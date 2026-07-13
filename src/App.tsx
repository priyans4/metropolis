import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Filters from './components/Filters';
import SuiteCard from './components/SuiteCard';
import SuiteDetailsModal from './components/SuiteDetailsModal';
import BookingModal from './components/BookingModal';
import Gallery from './components/Gallery';
import UserProfileComponent from './components/UserProfile';
import { BookingConfirmedModal, BookingCanceledModal } from './components/StatusModals';

import { Suite, Booking, Review, SearchParams, UserProfile } from './types';
import { INITIAL_SUITES, INITIAL_REVIEWS } from './data';
import { SlidersHorizontal, ArrowRight, HeartHandshake, Landmark, ChevronRight } from 'lucide-react';

import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';

const INITIAL_PROFILE: UserProfile = {
  fullName: 'Alexander Mercer',
  email: 'alexander.mercer@luminaelite.com',
  phone: '+1 (555) 019-2834',
  memberSince: 'October 2024',
  memberId: 'MT-99042-E',
  preferences: {
    roomTemperature: 21.0,
    pillowType: 'Goose Down',
    roomLocation: 'High Floor'
  }
};

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('suites');

  // Firebase auth state
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Core App State
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [suites, setSuites] = useState<Suite[]>(INITIAL_SUITES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Auth state listener & User Profile syncing
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user profile from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        let docSnap = null;
        let attempts = 0;
        const maxAttempts = 3;
        let lastError: unknown = null;

        while (attempts < maxAttempts) {
          try {
            docSnap = await getDoc(userRef);
            break;
          } catch (err) {
            lastError = err;
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 200));
            }
          }
        }

        if (!docSnap) {
          handleFirestoreError(lastError, OperationType.GET, `users/${currentUser.uid}`);
          return;
        }

        try {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create a default profile document for first-time users
            const newProfile: UserProfile = {
              fullName: currentUser.displayName || 'Guest Member',
              email: currentUser.email || '',
              phone: '',
              memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              memberId: `MT-${Math.floor(10000 + Math.random() * 90000)}-G`,
              preferences: {
                roomTemperature: 21.0,
                pillowType: 'Goose Down',
                roomLocation: 'No Preference'
              }
            };
            await setDoc(userRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      } else {
        // Logged out
        setProfile(INITIAL_PROFILE);
        setBookings([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time bookings listener (scoped to the authenticated user)
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }

    const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const loadedBookings: Booking[] = [];
      snapshot.forEach((doc) => {
        loadedBookings.push(doc.data() as Booking);
      });
      // Sort bookings by bookingDate descending
      loadedBookings.sort((a, b) => b.bookingDate.localeCompare(a.bookingDate));
      setBookings(loadedBookings);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `bookings?userId=${user?.uid}`);
    });

    return () => unsubscribeBookings();
  }, [user]);

  // Real-time suites sync (seeds initial data if empty)
  useEffect(() => {
    const suitesRef = collection(db, 'suites');
    const unsubscribeSuites = onSnapshot(suitesRef, async (snapshot) => {
      const loadedSuites: Suite[] = [];
      snapshot.forEach((doc) => {
        loadedSuites.push(doc.data() as Suite);
      });

      if (loadedSuites.length > 0) {
        setSuites(loadedSuites);
      } else {
        // Seed database if empty
        try {
          for (const suite of INITIAL_SUITES) {
            await setDoc(doc(db, 'suites', suite.id), suite);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'suites');
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'suites');
    });

    return () => unsubscribeSuites();
  }, []);

  // Real-time reviews sync (seeds initial data if empty)
  useEffect(() => {
    const reviewsRef = collection(db, 'reviews');
    const unsubscribeReviews = onSnapshot(reviewsRef, async (snapshot) => {
      const loadedReviews: Review[] = [];
      snapshot.forEach((doc) => {
        loadedReviews.push(doc.data() as Review);
      });

      if (loadedReviews.length > 0) {
        setReviews(loadedReviews);
      } else {
        // Seed database if empty
        try {
          for (const review of INITIAL_REVIEWS) {
            await setDoc(doc(db, 'reviews', review.id), {
              ...review,
              userId: 'system-seed'
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'reviews');
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'reviews');
    });

    return () => unsubscribeReviews();
  }, []);

  // Search parameters for dates & guests
  const [searchParams, setSearchParams] = useState<SearchParams>(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];
    return {
      checkIn: today,
      checkOut: tomorrow,
      guests: 2
    };
  });

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(1300);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  // Modals Visibility
  const [selectedDetailsSuite, setSelectedDetailsSuite] = useState<Suite | null>(null);
  const [selectedBookingSuite, setSelectedBookingSuite] = useState<Suite | null>(null);

  // Status Modals
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [canceledBooking, setCanceledBooking] = useState<Booking | null>(null);

  // Sign In / Out methods
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), updatedProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }
    }
  };

  // Handle booking update (e.g. guests count, special requests)
  const handleUpdateBooking = async (bookingId: string, updatedFields: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...updatedFields } : b))
    );
    if (user) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), updatedFields);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
      }
    }
  };

  // Handle booking creation
  const handleConfirmBooking = async (newBooking: Booking) => {
    const bookingId = newBooking.id || `bk-${Date.now()}`;
    const bookingWithUser = {
      ...newBooking,
      id: bookingId,
      userId: user ? user.uid : 'guest'
    };

    setBookings((prev) => [bookingWithUser, ...prev]);
    setConfirmedBooking(bookingWithUser);
    setSelectedBookingSuite(null);
    setSelectedDetailsSuite(null);
    setActiveTab('profile');

    if (user) {
      try {
        await setDoc(doc(db, 'bookings', bookingId), bookingWithUser);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
      }
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking) {
      setCanceledBooking(targetBooking);
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    if (user) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
      }
    }
  };

  // Handle new review submission
  const handleAddReview = async (
    suiteId: string,
    rating: number,
    userName: string,
    title: string,
    comment: string
  ) => {
    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      suiteId,
      userName,
      userId: user ? user.uid : 'anonymous',
      rating,
      date: new Date().toISOString().split('T')[0],
      title,
      comment
    };

    // Update reviews state
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate average rating and reviewCount for the suite
    setSuites((prevSuites) =>
      prevSuites.map((suite) => {
        if (suite.id === suiteId) {
          const suiteReviews = updatedReviews.filter((r) => r.suiteId === suiteId);
          const totalRating = suiteReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = totalRating / (suiteReviews.length || 1);
          const updatedSuite = {
            ...suite,
            rating: Math.round(newAvg * 10) / 10, // round to 1 decimal place
            reviewCount: suiteReviews.length
          };

          // Write updated suite back to Firestore
          setDoc(doc(db, 'suites', suiteId), updatedSuite).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `suites/${suiteId}`)
          );

          return updatedSuite;
        }
        return suite;
      })
    );

    try {
      await setDoc(doc(db, 'reviews', newReview.id), newReview);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reviews/${newReview.id}`);
    }
  };

  // Fast trigger to reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setMaxPrice(1300);
    setMinRating(0);
    setSelectedAmenities([]);
    setSortBy('featured');
  };

  // Filter rooms by search params & filters
  const filteredSuites = suites
    .filter((suite) => {
      // 1. Keyword search (name, description, longDescription, amenities)
      const q = searchQuery.toLowerCase();
      const matchesKeyword =
        !q ||
        suite.name.toLowerCase().includes(q) ||
        suite.description.toLowerCase().includes(q) ||
        suite.longDescription.toLowerCase().includes(q) ||
        suite.amenities.some((a) => a.toLowerCase().includes(q));

      // 2. Max Price Filter
      const matchesPrice = suite.pricePerNight <= maxPrice;

      // 3. Minimum Rating Filter
      const matchesRating = suite.rating >= minRating;

      // 4. Amenities Checked (Must contain ALL checked amenities)
      const matchesAmenities = selectedAmenities.every((amenity) =>
        suite.amenities.includes(amenity)
      );

      // 5. Guest Capacity Filter (Must support at least the searched guest count)
      const matchesCapacity = suite.guests >= searchParams.guests;

      return matchesKeyword && matchesPrice && matchesRating && matchesAmenities && matchesCapacity;
    })
    .sort((a, b) => {
      // Sorting rules
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating; // tie breaker: rating
      }
      if (sortBy === 'price-asc') {
        return a.pricePerNight - b.pricePerNight;
      }
      if (sortBy === 'price-desc') {
        return b.pricePerNight - a.pricePerNight;
      }
      if (sortBy === 'rating-desc') {
        return b.rating - a.rating;
      }
      return 0;
    });

  // Hotlink: Open Details Modal directly from anywhere
  const handleExploreSuiteId = (suiteId: string) => {
    const suite = suites.find((s) => s.id === suiteId);
    if (suite) {
      setSelectedDetailsSuite(suite);
    }
  };

  const activeBookingsCount = bookings.filter((b) => b.status === 'active').length;

  return (
    <div id="app-root" className="min-h-screen bg-editorial-cream text-editorial-dark flex flex-col font-sans">
      {/* Premium top branding bar */}
      <div className="bg-editorial-dark text-editorial-cream/90 text-[10px] sm:text-xs text-center py-2 uppercase tracking-[0.25em] flex-shrink-0 font-light flex items-center justify-center gap-1.5 border-b border-editorial-cream/10">
        <Landmark className="w-3.5 h-3.5" />
        <span>Prestige Urban Stays & Private Club Perks • Lumina Elite</span>
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBookingsCount={activeBookingsCount}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Hero section */}
      {activeTab === 'suites' && (
        <Hero
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onSearch={() => {
            // Instantly focuses onto suites grid
            const gridEl = document.getElementById('suites-browsing-section');
            if (gridEl) {
              gridEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}

      {/* Main Container */}
      <main className="flex-1">
        {activeTab === 'suites' && (
          <div
            id="suites-browsing-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          >
            {/* Header section with counts */}
            <div className="mb-12 text-center md:text-left space-y-2 border-b border-editorial-dark/10 pb-6">
              <h2 className="text-3xl md:text-4xl font-serif font-light text-editorial-dark tracking-[0.02em] uppercase">
                Our Signature Suites
              </h2>
              <p className="text-editorial-gray text-xs sm:text-sm font-light tracking-wide">
                Accommodating {searchParams.guests} {searchParams.guests === 1 ? 'guest' : 'guests'} from{' '}
                <span className="font-mono font-medium text-editorial-dark underline underline-offset-4 decoration-editorial-dark/25">{searchParams.checkIn}</span> to{' '}
                <span className="font-mono font-medium text-editorial-dark underline underline-offset-4 decoration-editorial-dark/25">{searchParams.checkOut}</span>.
              </p>
            </div>

            {/* Content Layout Grid (Sidebar + Main List) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filter Sidebar */}
              <div className="lg:col-span-1">
                <Filters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onReset={handleResetFilters}
                  resultsCount={filteredSuites.length}
                />
              </div>

              {/* Suites Cards Grid */}
              <div className="lg:col-span-3 space-y-6">
                {filteredSuites.length === 0 ? (
                  /* Zero suites fallback */
                  <div
                    id="no-suites-fallback"
                    className="bg-editorial-sand border border-editorial-dark/10 rounded-sm p-12 text-center text-editorial-dark max-w-xl mx-auto space-y-5"
                  >
                    <div className="w-12 h-12 border border-editorial-dark/20 text-editorial-dark rounded-sm flex items-center justify-center mx-auto">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl font-light uppercase tracking-[0.05em]">No suites match your criteria</h3>
                    <p className="text-editorial-gray text-xs sm:text-sm font-light max-w-sm mx-auto leading-relaxed">
                      We couldn't find any rooms that fit your exact pricing, guest capacity, or checked amenities. Try loosening your filters or resetting the search.
                    </p>
                    <button
                      id="fallback-reset-btn"
                      onClick={handleResetFilters}
                      className="px-6 py-2.5 bg-editorial-dark hover:bg-editorial-dark/90 text-editorial-cream text-[11px] font-medium uppercase tracking-[0.15em] rounded-sm transition-all"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSuites.map((suite) => (
                      <SuiteCard
                        key={suite.id}
                        suite={suite}
                        onBook={(suiteToBook) => setSelectedBookingSuite(suiteToBook)}
                        onViewDetails={(suiteToView) => setSelectedDetailsSuite(suiteToView)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Photo Gallery */}
        {activeTab === 'gallery' && (
          <Gallery
            onExploreSuite={(suiteId) => {
              handleExploreSuiteId(suiteId);
            }}
          />
        )}

        {/* Tab: Profile & Reservations Dashboard */}
        {activeTab === 'profile' && (
          <UserProfileComponent
            profile={profile}
            bookings={bookings}
            suites={suites}
            onUpdateProfile={handleUpdateProfile}
            onCancelBooking={handleCancelBooking}
            onUpdateBooking={handleUpdateBooking}
            onExploreSuites={() => setActiveTab('suites')}
            user={user}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        )}


      </main>

      {/* Footnote bar */}
      <footer className="bg-editorial-dark text-editorial-cream/70 text-xs py-12 mt-auto border-t border-editorial-cream/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-editorial-cream/20 text-editorial-cream rounded-sm flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-serif font-medium text-editorial-cream uppercase tracking-wider text-sm">
                The Metropolis Hotel
              </span>
              <span className="block text-[9px] text-editorial-cream/50 tracking-[0.25em] uppercase mt-0.5">
                Luxury Suites Downtown
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs font-light uppercase tracking-[0.1em] text-editorial-cream/60">
            <span className="hover:text-editorial-cream cursor-pointer transition-colors">Privacy & Cookies</span>
            <span>•</span>
            <span className="hover:text-editorial-cream cursor-pointer transition-colors">Standard Stay Terms</span>
            <span>•</span>
            <span className="hover:text-editorial-cream cursor-pointer transition-colors">Corporate Inquiries</span>
            <span>•</span>
            <span className="hover:text-editorial-cream cursor-pointer transition-colors">Help Desk</span>
          </div>

          <div className="text-[10px] text-editorial-cream/40 text-center md:text-right font-light uppercase tracking-wider">
            © 2026 The Metropolis Luxury Hotel & Suites. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Suite Details Overlay Modal */}
      {selectedDetailsSuite && (
        <SuiteDetailsModal
          suite={selectedDetailsSuite}
          reviews={reviews}
          onClose={() => setSelectedDetailsSuite(null)}
          onBook={(suiteToBook) => {
            setSelectedBookingSuite(suiteToBook);
          }}
          onSubmitReview={handleAddReview}
        />
      )}

      {/* Booking Wizard Overlay Modal */}
      {selectedBookingSuite && (
        <BookingModal
          suite={selectedBookingSuite}
          searchParams={searchParams}
          onClose={() => setSelectedBookingSuite(null)}
          onConfirmBooking={handleConfirmBooking}
          profile={profile}
          user={user}
          onSignIn={handleSignIn}
        />
      )}

      {/* Booking Confirmed Status Modal */}
      {confirmedBooking && (
        <BookingConfirmedModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onViewPortfolio={() => {
            setConfirmedBooking(null);
            setActiveTab('profile');
          }}
        />
      )}

      {/* Booking Canceled Status Modal */}
      {canceledBooking && (
        <BookingCanceledModal
          booking={canceledBooking}
          onClose={() => setCanceledBooking(null)}
          onBrowseSuites={() => {
            setCanceledBooking(null);
            setActiveTab('suites');
          }}
        />
      )}
    </div>
  );
}
