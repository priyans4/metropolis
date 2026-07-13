import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, Award, Edit3, Save, CheckCircle, Calendar, 
  Trash2, Plus, Minus, Info, Sparkles, Landmark, Settings, 
  ArrowRight, ShieldCheck, Heart, AlertCircle 
} from 'lucide-react';
import { Booking, UserProfile, Suite } from '../types';

interface UserProfileProps {
  profile: UserProfile;
  bookings: Booking[];
  suites: Suite[];
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onCancelBooking: (bookingId: string) => void;
  onUpdateBooking: (bookingId: string, updatedFields: Partial<Booking>) => void;
  onExploreSuites: () => void;
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function UserProfileComponent({
  profile,
  bookings,
  suites,
  onUpdateProfile,
  onCancelBooking,
  onUpdateBooking,
  onExploreSuites,
  user,
  onSignIn,
  onSignOut
}: UserProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingName, setEditingName] = useState(profile.fullName);
  const [editingEmail, setEditingEmail] = useState(profile.email);
  const [editingPhone, setEditingPhone] = useState(profile.phone);
  const [editingTemp, setEditingTemp] = useState(profile.preferences.roomTemperature);
  const [editingPillow, setEditingPillow] = useState(profile.preferences.pillowType);
  const [editingLocation, setEditingLocation] = useState(profile.preferences.roomLocation);

  // Sync state values when profile updates asynchronously from Firestore
  React.useEffect(() => {
    setEditingName(profile.fullName);
    setEditingEmail(profile.email);
    setEditingPhone(profile.phone);
    setEditingTemp(profile.preferences.roomTemperature);
    setEditingPillow(profile.preferences.pillowType);
    setEditingLocation(profile.preferences.roomLocation);
  }, [profile]);

  // States for modifying an active booking
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingGuests, setEditingGuests] = useState<number>(1);
  const [editingSpecialRequests, setEditingSpecialRequests] = useState<string>('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'active');
  const pastBookings = bookings.filter((b) => b.status === 'cancelled');

  // Find the max guests for a specific suite to validate when editing a booking
  const getSuiteMaxGuests = (suiteId: string): number => {
    const suite = suites.find((s) => s.id === suiteId);
    return suite ? suite.guests : 4;
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      fullName: editingName,
      email: editingEmail,
      phone: editingPhone,
      preferences: {
        roomTemperature: editingTemp,
        pillowType: editingPillow,
        roomLocation: editingLocation
      }
    });
    setIsEditingProfile(false);
  };

  const handleStartEditBooking = (booking: Booking) => {
    setEditingBookingId(booking.id);
    setEditingGuests(booking.guests);
    setEditingSpecialRequests(booking.specialRequests || '');
    setBookingError(null);
  };

  const handleSaveBookingChange = (bookingId: string, suiteId: string) => {
    const maxGuests = getSuiteMaxGuests(suiteId);
    if (editingGuests > maxGuests) {
      setBookingError(`This suite allows a maximum of ${maxGuests} guests.`);
      return;
    }
    if (editingGuests < 1) {
      setBookingError(`At least 1 guest is required.`);
      return;
    }

    onUpdateBooking(bookingId, {
      guests: editingGuests,
      specialRequests: editingSpecialRequests
    });
    setEditingBookingId(null);
    setBookingError(null);
  };

  const handleCancelClick = (id: string) => {
    setCancellingId(id);
  };

  const handleConfirmCancel = (id: string) => {
    onCancelBooking(id);
    setCancellingId(null);
  };

  // Guest card styles are integrated directly below

  if (!user) {
    return (
      <div id="user-profile-signin-prompt" className="max-w-xl mx-auto px-4 py-24 text-center space-y-8 animate-fade-in">
        <div className="w-16 h-16 border border-editorial-dark/20 text-editorial-dark rounded-sm flex items-center justify-center mx-auto">
          <User className="w-6 h-6" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-serif font-light text-editorial-dark uppercase tracking-wide">Guest Account Required</h2>
          <p className="text-editorial-gray text-xs sm:text-sm font-light leading-relaxed">
            Unlock your private Metropolis club benefits. Sign in with Google to synchronize your custom stay attributes, manage permanent suite reservations, and access our elite room-climate configurations.
          </p>
        </div>
        <div>
          <button
            onClick={onSignIn}
            className="px-8 py-3 bg-editorial-dark hover:bg-black text-editorial-cream text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-all shadow-md inline-flex items-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.25.61 4.47 1.617l2.435-2.435C17.3 1.556 14.93 0 12.24 0 6.13 0 1.2 4.93 1.2 11s4.93 11 11.04 11c6.38 0 10.61-4.484 10.61-10.8 0-.727-.063-1.427-.182-2.115H12.24z"/>
            </svg>
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="user-profile-dashboard" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-fade-in space-y-12">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-editorial-dark/10 pb-5">
        <div>
          <h2 className="text-3xl font-serif font-light text-editorial-dark uppercase tracking-wide">Guest Portfolio</h2>
          <p className="text-editorial-gray text-xs sm:text-sm mt-1 font-light">
            Manage your personal preferences, custom stay attributes, and private reservations.
          </p>
        </div>
        <button
          onClick={onExploreSuites}
          className="text-[10px] uppercase tracking-[0.15em] font-semibold text-editorial-dark hover:opacity-80 flex items-center gap-1.5 self-start md:self-auto transition-opacity"
        >
          Reserve another suite
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Loyalty Card & Personal details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Guest Membership Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-editorial-dark via-[#2a2a2a] to-editorial-dark border border-editorial-dark/30 rounded-sm p-6 text-editorial-cream shadow-xl space-y-8 flex flex-col justify-between h-56 group">
            {/* Background design accents */}
            <div className="absolute top-[-50%] right-[-30%] w-64 h-64 rounded-full border border-editorial-cream/5 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-[-20%] left-[-10%] w-36 h-36 rounded-full border border-editorial-cream/5 pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[8px] uppercase tracking-[0.3em] text-editorial-cream/50 font-light">Metropolis Private Club</span>
                <span className="text-lg font-serif tracking-wider uppercase font-light text-editorial-cream">Exclusive Guest Card</span>
              </div>
              <Landmark className="w-5 h-5 text-editorial-cream/40" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end border-t border-editorial-cream/10 pt-4">
                <div>
                  <span className="block text-[8px] uppercase tracking-[0.2em] text-editorial-cream/40 font-light">Registered Guest</span>
                  <span className="text-sm font-medium text-editorial-cream tracking-wide">{profile.fullName}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-[0.2em] text-editorial-cream/40 font-light">Member ID</span>
                  <span className="font-mono text-xs text-editorial-cream/80">{profile.memberId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details & Preferences Card */}
          <div className="bg-editorial-sand/45 border border-editorial-dark/10 rounded-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-editorial-dark/5 pb-3">
              <h3 className="text-xs uppercase font-semibold tracking-[0.15em] text-editorial-dark flex items-center gap-2">
                <User className="w-4 h-4 text-editorial-dark/60" />
                Profile Details
              </h3>
              {!isEditingProfile && (
                <button
                  id="edit-profile-btn"
                  onClick={() => {
                    setEditingName(profile.fullName);
                    setEditingEmail(profile.email);
                    setEditingPhone(profile.phone);
                    setEditingTemp(profile.preferences.roomTemperature);
                    setEditingPillow(profile.preferences.pillowType);
                    setEditingLocation(profile.preferences.roomLocation);
                    setIsEditingProfile(true);
                  }}
                  className="p-1 hover:bg-editorial-dark/5 rounded-sm transition-colors text-editorial-dark cursor-pointer flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!isEditingProfile ? (
                /* Read-Only State */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5 text-xs text-editorial-dark"
                >
                  <div className="space-y-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Full Name</span>
                      <span className="font-medium text-sm block mt-0.5">{profile.fullName}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Verified Email</span>
                      <span className="font-medium block mt-0.5">{profile.email}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Contact Phone</span>
                      <span className="font-mono block mt-0.5">{profile.phone}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Registered Since</span>
                      <span className="block mt-0.5">{profile.memberSince}</span>
                    </div>
                  </div>

                  <div className="border-t border-editorial-dark/5 pt-4 space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-semibold text-editorial-dark/70 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-editorial-dark" />
                      Hotel Room Preferences
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-editorial-cream border border-editorial-dark/5 p-2.5 rounded-sm">
                        <span className="block text-[8px] uppercase tracking-wider text-editorial-gray">Temp Goal</span>
                        <span className="text-sm font-medium mt-0.5 block">{profile.preferences.roomTemperature}°C</span>
                      </div>
                      <div className="bg-editorial-cream border border-editorial-dark/5 p-2.5 rounded-sm">
                        <span className="block text-[8px] uppercase tracking-wider text-editorial-gray">Pillow Choice</span>
                        <span className="text-sm font-medium mt-0.5 block truncate">{profile.preferences.pillowType}</span>
                      </div>
                      <div className="bg-editorial-cream border border-editorial-dark/5 p-2.5 rounded-sm col-span-2">
                        <span className="block text-[8px] uppercase tracking-wider text-editorial-gray">Desired Location</span>
                        <span className="text-sm font-medium mt-0.5 block">{profile.preferences.roomLocation}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Editing Profile Form State */
                <motion.form 
                  onSubmit={handleProfileSave}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editingEmail}
                        onChange={(e) => setEditingEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={editingPhone}
                        onChange={(e) => setEditingPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark font-medium"
                      />
                    </div>

                    <div className="border-t border-editorial-dark/5 pt-3 space-y-3">
                      <span className="block text-[10px] uppercase tracking-widest font-semibold text-editorial-dark/80">Customize In-room Stays</span>
                      
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">Ideal Temperature (°C)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="18"
                            max="26"
                            step="0.5"
                            value={editingTemp}
                            onChange={(e) => setEditingTemp(parseFloat(e.target.value))}
                            className="w-full accent-editorial-dark"
                          />
                          <span className="text-xs font-mono font-bold shrink-0">{editingTemp}°C</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">Pillow Consistency</label>
                        <select
                          value={editingPillow}
                          onChange={(e) => setEditingPillow(e.target.value as any)}
                          className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark"
                        >
                          <option value="Goose Down">Goose Down (Ultra-Soft)</option>
                          <option value="Memory Foam">Memory Foam (Firm Support)</option>
                          <option value="Hypoallergenic">Hypoallergenic (Sensitive Care)</option>
                          <option value="Lavender Infused">Lavender Infused (Calming Aromatics)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">Room Location Preference</label>
                        <select
                          value={editingLocation}
                          onChange={(e) => setEditingLocation(e.target.value as any)}
                          className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark"
                        >
                          <option value="High Floor">High Floor (Panoramic Skyline views)</option>
                          <option value="Near Elevator">Near Elevator (Accessible convenience)</option>
                          <option value="Quiet Courtyard">Quiet Courtyard (Serene courtyard silence)</option>
                          <option value="No Preference">No Preference (Optimal availability)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      id="save-profile-btn"
                      className="flex-1 py-2 bg-editorial-dark hover:opacity-90 text-editorial-cream text-[10px] uppercase tracking-wider font-semibold rounded-sm transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-2 bg-editorial-cream hover:bg-editorial-sand/65 border border-editorial-dark/15 text-editorial-dark text-[10px] uppercase tracking-wider font-semibold rounded-sm transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Sign Out Action Card */}
          <div className="bg-editorial-sand/20 border border-editorial-dark/5 rounded-sm p-4 text-center">
            <button
              onClick={onSignOut}
              className="w-full py-2.5 bg-editorial-cream border border-editorial-dark/15 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-editorial-dark text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign Out of Account
            </button>
          </div>

        </div>

        {/* Right Column: Manage reservations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-editorial-cream border border-editorial-dark/10 rounded-sm p-6 space-y-6 shadow-sm">
            
            {/* Header stays count */}
            <div className="flex items-center justify-between border-b border-editorial-dark/10 pb-4">
              <h3 className="text-sm font-serif font-light text-editorial-dark uppercase tracking-wider">
                Confirmed Reservations
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-editorial-sand border border-editorial-dark/10 px-3 py-1 rounded-sm text-editorial-dark">
                {activeBookings.length} Upcoming stays
              </span>
            </div>

            {/* Empty state if no active reservations */}
            {activeBookings.length === 0 && (
              <div className="text-center py-16 space-y-5">
                <div className="w-12 h-12 border border-editorial-dark/10 text-editorial-dark rounded-sm flex items-center justify-center mx-auto bg-editorial-sand">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h4 className="font-serif text-lg font-light uppercase tracking-wider text-editorial-dark">No Scheduled Stays</h4>
                  <p className="text-editorial-gray text-xs font-light leading-relaxed">
                    You currently have no active or upcoming stays booked. Explore our bespoke luxury suites to start designing your next urban journey.
                  </p>
                </div>
                <button
                  onClick={onExploreSuites}
                  className="px-6 py-2.5 bg-editorial-dark hover:bg-editorial-dark/95 text-editorial-cream text-[10px] uppercase tracking-[0.15em] font-medium rounded-sm transition-all shadow-sm"
                >
                  Explore Suites & Rooms
                </button>
              </div>
            )}

            {/* List of active reservations */}
            {activeBookings.length > 0 && (
              <div className="space-y-6">
                {activeBookings.map((booking) => {
                  const isBookingEditing = editingBookingId === booking.id;
                  const suiteMaxGuests = getSuiteMaxGuests(booking.suiteId);

                  return (
                    <div 
                      key={booking.id}
                      id={`booking-profile-card-${booking.id}`}
                      className="border border-editorial-dark/15 rounded-sm overflow-hidden flex flex-col md:flex-row bg-editorial-cream hover:shadow-md transition-all duration-300"
                    >
                      {/* Image side */}
                      <div className="relative md:w-48 h-40 md:h-auto shrink-0 bg-editorial-dark">
                        <img 
                          src={booking.suiteImage} 
                          alt={booking.suiteName} 
                          className="w-full h-full object-cover opacity-95 hover:scale-102 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Content side */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Reference card header */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[10px] font-mono text-editorial-gray font-medium">REF: {booking.id}</span>
                            <span className="flex items-center gap-1 text-[9px] text-editorial-dark bg-editorial-sand border border-editorial-dark/10 px-2 py-0.5 rounded-sm uppercase font-semibold tracking-wider">
                              <ShieldCheck className="w-3 h-3 text-editorial-dark" />
                              Confirmed
                            </span>
                          </div>

                          {/* Room name */}
                          <h4 className="text-base font-serif font-light text-editorial-dark uppercase tracking-wide">
                            {booking.suiteName}
                          </h4>

                          {/* Key parameters of booking */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] text-editorial-dark font-light">
                            <div>
                              <span className="block text-[8px] text-editorial-gray uppercase tracking-wider font-semibold">Dates of Stay</span>
                              <span className="font-mono font-medium">{booking.checkIn} → {booking.checkOut}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-editorial-gray uppercase tracking-wider font-semibold">Nights</span>
                              <span className="font-medium">{booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-editorial-gray uppercase tracking-wider font-semibold">Occupancy</span>
                              <span className="font-medium">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                            </div>
                          </div>

                          {/* In-room customized special requests */}
                          {!isBookingEditing ? (
                            <div className="bg-editorial-sand/40 border border-editorial-dark/5 p-3 rounded-sm text-xs font-light text-editorial-dark italic">
                              <span className="font-semibold not-italic block text-[8px] uppercase tracking-wider text-editorial-gray mb-1">
                                Personalized Stay Request:
                              </span>
                              {booking.specialRequests ? `"${booking.specialRequests}"` : '"No custom requests selected."'}
                            </div>
                          ) : (
                            /* Stay details edit fields */
                            <div className="bg-editorial-sand p-3.5 border border-editorial-dark/10 rounded-sm space-y-3 text-xs">
                              <span className="font-bold block text-[8px] uppercase tracking-widest text-editorial-dark">
                                Modify Stay Parameters
                              </span>

                              {bookingError && (
                                <div className="p-2 bg-red-50 border border-red-200 text-red-800 text-[10px] rounded-sm flex items-center gap-1.5 font-medium">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  {bookingError}
                                </div>
                              )}

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Edit Occupants */}
                                <div>
                                  <label className="block text-[8px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">
                                    Occupants (Max {suiteMaxGuests})
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      id="btn-guest-dec"
                                      onClick={() => setEditingGuests(prev => Math.max(1, prev - 1))}
                                      className="p-1.5 border border-editorial-dark/15 rounded-sm hover:bg-editorial-cream text-editorial-dark transition-all focus:outline-none"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center font-mono font-bold text-xs">{editingGuests}</span>
                                    <button
                                      type="button"
                                      id="btn-guest-inc"
                                      onClick={() => setEditingGuests(prev => Math.min(suiteMaxGuests, prev + 1))}
                                      className="p-1.5 border border-editorial-dark/15 rounded-sm hover:bg-editorial-cream text-editorial-dark transition-all focus:outline-none"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Special Requests */}
                              <div>
                                <label className="block text-[8px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">
                                  Special requests & Room customization
                                </label>
                                <textarea
                                  value={editingSpecialRequests}
                                  onChange={(e) => setEditingSpecialRequests(e.target.value)}
                                  rows={2}
                                  className="w-full px-2.5 py-1.5 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark font-light"
                                  placeholder="E.g., feather pillow preference, early airport arrival, high-floor quiet corridor..."
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action buttons footer */}
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3.5 border-t border-editorial-dark/10">
                          <div>
                            <span className="text-[9px] text-editorial-gray uppercase tracking-wider font-semibold">Stay Total Billing</span>
                            <span className="block text-base font-serif font-medium text-editorial-dark">${booking.totalPrice.toFixed(2)}</span>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            {/* Confirmation to cancel */}
                            {cancellingId === booking.id ? (
                              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200/50 p-1.5 rounded-sm text-xs">
                                <span className="text-red-900 font-semibold text-[10px] uppercase">Confirm cancel?</span>
                                <button
                                  id={`confirm-cancel-stay-${booking.id}`}
                                  onClick={() => handleConfirmCancel(booking.id)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-stone-50 rounded-sm font-semibold text-[9px] uppercase tracking-wider transition-colors"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setCancellingId(null)}
                                  className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-sm font-semibold text-[9px] uppercase tracking-wider transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            ) : !isBookingEditing ? (
                              <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                  id={`edit-booking-btn-${booking.id}`}
                                  onClick={() => handleStartEditBooking(booking)}
                                  className="px-3 py-1.5 border border-editorial-dark/15 text-editorial-dark hover:bg-editorial-sand/65 rounded-sm text-[9px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Settings className="w-3 h-3 text-editorial-dark" />
                                  Manage Stay
                                </button>
                                <button
                                  id={`cancel-booking-btn-${booking.id}`}
                                  onClick={() => handleCancelClick(booking.id)}
                                  className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50/50 rounded-sm text-[9px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Cancel Stay
                                </button>
                              </div>
                            ) : (
                              /* Active editing stays */
                              <div className="flex gap-2">
                                <button
                                  id={`save-booking-btn-${booking.id}`}
                                  onClick={() => handleSaveBookingChange(booking.id, booking.suiteId)}
                                  className="px-3.5 py-1.5 bg-editorial-dark text-editorial-cream hover:opacity-90 rounded-sm text-[9px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Confirm Changes
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingBookingId(null);
                                    setBookingError(null);
                                  }}
                                  className="px-3 py-1.5 border border-editorial-dark/15 text-editorial-dark hover:bg-editorial-sand rounded-sm text-[9px] font-semibold uppercase tracking-wider transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past stay archive section */}
          {pastBookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase font-semibold tracking-[0.15em] text-editorial-gray flex items-center gap-1.5 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-editorial-gray/40" />
                Cancelled / Historical Archive ({pastBookings.length})
              </h3>

              <div className="space-y-3">
                {pastBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="bg-editorial-sand/35 border border-editorial-dark/5 rounded-sm p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-xs font-semibold text-editorial-dark uppercase tracking-wider">{booking.suiteName}</h4>
                        <span className="text-[9px] uppercase font-mono text-editorial-gray/70 font-light">REF: {booking.id}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-editorial-gray font-light">
                        <span className="font-mono">{booking.checkIn} to {booking.checkOut}</span>
                        <span>•</span>
                        <span>{booking.nights} nights</span>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-[9px] text-editorial-gray bg-editorial-sand border border-editorial-dark/10 px-2.5 py-0.5 rounded-sm uppercase font-semibold tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      Cancelled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
