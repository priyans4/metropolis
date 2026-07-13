import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, ChevronRight, ChevronLeft, CreditCard, CheckCircle2, Ticket, Sparkles, Building } from 'lucide-react';
import { Suite, Booking, SearchParams, UserProfile } from '../types';

interface BookingModalProps {
  suite: Suite;
  searchParams: SearchParams;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
  profile?: UserProfile;
  user?: any;
  onSignIn?: () => void;
}

export default function BookingModal({
  suite,
  searchParams,
  onClose,
  onConfirmBooking,
  profile,
  user,
  onSignIn
}: BookingModalProps) {
  const [step, setStep] = useState(1);

  // Date and stay parameters
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(searchParams.checkOut);
  const [guests, setGuests] = useState(searchParams.guests || 2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [nights, setNights] = useState(1);

  // Guest Details
  const [guestName, setGuestName] = useState(profile?.fullName || '');
  const [guestEmail, setGuestEmail] = useState(profile?.email || '');
  const [guestPhone, setGuestPhone] = useState(profile?.phone || '');

  // Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0); // decimal e.g. 0.10 for 10%
  const [promoError, setPromoError] = useState('');

  // Payment State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirmation Details
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Calculate nights whenever check-in or check-out changes
  useEffect(() => {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const diffTime = outDate.getTime() - inDate.getTime();
      const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (calculatedNights > 0) {
        setNights(calculatedNights);
      } else {
        setNights(1);
        // Correct check-out automatically to next day
        const nextDay = new Date(inDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOut(nextDay.toISOString().split('T')[0]);
      }
    }
  }, [checkIn, checkOut]);

  // Adjust guests capacity limits based on room
  useEffect(() => {
    if (guests > suite.guests) {
      setGuests(suite.guests);
    }
  }, [suite, guests]);

  // Synchronize guest contact inputs when profile is fetched asynchronously (e.g., during login)
  useEffect(() => {
    if (profile) {
      if (profile.fullName) setGuestName(profile.fullName);
      if (profile.email) setGuestEmail(profile.email);
      if (profile.phone) setGuestPhone(profile.phone);
    }
  }, [profile]);

  // Costs calculation
  const baseCost = suite.pricePerNight * nights;
  const discountAmount = promoApplied ? baseCost * promoDiscount : 0;
  const discountedBase = baseCost - discountAmount;
  const taxesAndFees = Math.round(discountedBase * 0.12 * 100) / 100; // 12% tax/resort fee
  const totalCost = discountedBase + taxesAndFees;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setPromoApplied(true);
      setPromoDiscount(0.10);
      setPromoError('');
    } else if (code === 'METROPOLIS20') {
      setPromoApplied(true);
      setPromoDiscount(0.20);
      setPromoError('');
    } else if (code) {
      setPromoError('Invalid coupon code.');
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const validateStep1 = () => {
    if (!checkIn || !checkOut) return false;
    if (new Date(checkOut) <= new Date(checkIn)) return false;
    return true;
  };

  const validateStep2 = () => {
    if (!guestName.trim()) return false;
    if (!guestEmail.trim() || !guestEmail.includes('@')) return false;
    if (!guestPhone.trim()) return false;
    return true;
  };

  const validateStep3 = () => {
    if (!cardName.trim()) return false;
    if (cardNumber.replace(/\s/g, '').length < 15) return false;
    if (!cardExpiry.includes('/')) return false;
    if (cardCvv.length < 3) return false;
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) {
      setPaymentError('Please complete your payment card details.');
      return;
    }

    setPaymentError('');
    setIsProcessing(true);

    // Simulate luxury server-side confirmation delay
    setTimeout(() => {
      const bookingRef = `MET-${Math.floor(100000 + Math.random() * 900000)}`;
      const bookingRecord: Booking = {
        id: bookingRef,
        suiteId: suite.id,
        suiteName: suite.name,
        suiteImage: suite.images[0],
        checkIn,
        checkOut,
        guests,
        guestName,
        guestEmail,
        guestPhone,
        totalPrice: parseFloat(totalCost.toFixed(2)),
        nights,
        status: 'active',
        bookingDate: new Date().toISOString().split('T')[0],
        specialRequests: specialRequests.trim() || undefined
      };

      setConfirmedBooking(bookingRecord);
      onConfirmBooking(bookingRecord);
      setIsProcessing(false);
      setStep(4);
    }, 1800);
  };

  return (
    <div id="booking-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-editorial-dark/70 backdrop-blur-sm overflow-y-auto">
      <div id="booking-modal-content" className="bg-editorial-cream w-full max-w-2xl rounded-sm shadow-2xl border border-editorial-dark/10 overflow-hidden max-h-[90vh] flex flex-col my-8">
        {/* Header banner */}
        <div className="bg-editorial-dark text-editorial-cream p-6 flex justify-between items-center flex-shrink-0 border-b border-editorial-cream/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 border border-editorial-cream/20 rounded-sm text-editorial-cream">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base uppercase tracking-[0.1em] font-medium">Reserve Your Suite</h3>
              <p className="text-editorial-cream/70 text-xs font-light">{suite.name}</p>
            </div>
          </div>
          <button
            id="close-booking-modal"
            onClick={onClose}
            className="text-editorial-cream/70 hover:text-editorial-cream p-1.5 rounded-sm hover:bg-editorial-cream/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator pipeline */}
        {user && step < 4 && (
          <div className="flex bg-editorial-sand border-b border-editorial-dark/10 text-[10px] uppercase tracking-[0.1em] font-medium text-editorial-gray flex-shrink-0">
            <div className={`flex-1 py-3 text-center transition-colors ${step === 1 ? 'bg-editorial-cream text-editorial-dark border-b border-editorial-dark font-semibold' : ''}`}>
              1. Stay Config
            </div>
            <div className={`flex-1 py-3 text-center transition-colors ${step === 2 ? 'bg-editorial-cream text-editorial-dark border-b border-editorial-dark font-semibold' : ''}`}>
              2. Guest Details
            </div>
            <div className={`flex-1 py-3 text-center transition-colors ${step === 3 ? 'bg-editorial-cream text-editorial-dark border-b border-editorial-dark font-semibold' : ''}`}>
              3. Payment & Billing
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-editorial-cream">
          {!user ? (
            <div className="text-center py-10 px-6 space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-14 h-14 bg-editorial-sand rounded-full flex items-center justify-center text-editorial-dark border border-editorial-dark/10">
                <Building className="w-6 h-6" />
              </div>
              <div className="max-w-md space-y-2">
                <h4 className="text-xl font-serif font-light text-editorial-dark uppercase tracking-wide">Signature Reservation</h4>
                <p className="text-editorial-gray text-xs font-light leading-relaxed">
                  To maintain our premier member experience and secure guest credentials, a verified account is required to reserve a luxury suite at The Metropolis.
                </p>
              </div>
              <button
                id="modal-signin-button"
                onClick={onSignIn}
                className="px-6 py-3 bg-editorial-dark hover:bg-black text-editorial-cream text-xs font-semibold uppercase tracking-[0.15em] rounded-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.25.61 4.47 1.617l2.435-2.435C17.3 1.556 14.93 0 12.24 0 6.13 0 1.2 4.93 1.2 11s4.93 11 11.04 11c6.38 0 10.61-4.484 10.61-10.8 0-.727-.063-1.427-.182-2.115H12.24z" />
                </svg>
                Sign In with Google
              </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex gap-4 p-4 bg-editorial-sand border border-editorial-dark/5 rounded-sm items-center">
                    <img src={suite.images[0]} alt={suite.name} className="w-20 h-16 object-cover rounded-sm" />
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.25em] text-editorial-gray font-semibold">{suite.type}</span>
                      <h4 className="text-sm font-serif font-light text-editorial-dark uppercase tracking-wider">{suite.name}</h4>
                      <p className="text-[11px] text-editorial-gray font-mono mt-0.5">${suite.pricePerNight} USD / night</p>
                    </div>
                  </div>

                  {/* Date selection row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Check-In Date</label>
                      <input
                        id="booking-check-in"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs text-editorial-dark font-medium focus:border-editorial-dark focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Check-Out Date</label>
                      <input
                        id="booking-check-out"
                        type="date"
                        min={checkIn}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs text-editorial-dark font-medium focus:border-editorial-dark focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Guests Selector & calculated nights banner */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between pt-2">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Guests Count</label>
                      <select
                        id="booking-guests"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs font-medium focus:border-editorial-dark focus:outline-none text-editorial-dark appearance-none"
                      >
                        {Array.from({ length: suite.guests }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-editorial-gray mt-1 block">Max capacity for this suite is {suite.guests} guests.</span>
                    </div>

                    <div className="bg-editorial-sand border border-editorial-dark/10 p-4 rounded-sm flex flex-col justify-center sm:w-48 text-center">
                      <span className="text-[9px] text-editorial-gray font-semibold uppercase tracking-widest">Stay Duration</span>
                      <span className="text-xl font-serif font-medium text-editorial-dark mt-1">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Special Requests (Optional)</label>
                    <textarea
                      id="booking-special-requests"
                      rows={3}
                      placeholder="e.g. Early check-in preference, feather pillows, foam mattress, dietary requests..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-xs uppercase tracking-[0.15em] text-editorial-dark font-medium border-b border-editorial-dark/10 pb-2">Guest Contact Details</h4>
                  <p className="text-editorial-gray text-xs font-light">This information is used to secure your automated check-in details and forward your booking voucher.</p>

                  {!user && onSignIn && (
                    <div className="bg-editorial-sand/60 border border-editorial-dark/10 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-editorial-dark">Have an account?</span>
                        <span className="text-[10px] text-editorial-gray">Sign in with Google to instantly prefill your details & save this booking permanently.</span>
                      </div>
                      <button
                        type="button"
                        onClick={onSignIn}
                        className="px-4 py-2 bg-editorial-dark hover:bg-black text-editorial-cream text-[9px] font-semibold uppercase tracking-[0.15em] rounded-sm transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.25.61 4.47 1.617l2.435-2.435C17.3 1.556 14.93 0 12.24 0 6.13 0 1.2 4.93 1.2 11s4.93 11 11.04 11c6.38 0 10.61-4.484 10.61-10.8 0-.727-.063-1.427-.182-2.115H12.24z" />
                        </svg>
                        Google Autocomplete
                      </button>
                    </div>
                  )}

                  {/* Guest Name */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Full Name</label>
                    <input
                      id="guest-name"
                      type="text"
                      required
                      placeholder="e.g., Jane Doe"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                    />
                  </div>

                  {/* Guest Email */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Email Address</label>
                    <input
                      id="guest-email"
                      type="email"
                      required
                      placeholder="e.g., janedoe@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                    />
                  </div>

                  {/* Guest Phone */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Phone Number</label>
                    <input
                      id="guest-phone"
                      type="tel"
                      required
                      placeholder="e.g., +1 (555) 019-2834"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Checkout details overview */}
                  <div className="bg-editorial-sand p-5 rounded-sm border border-editorial-dark/10">
                    <h4 className="text-[10px] uppercase tracking-[0.15em] text-editorial-dark font-semibold mb-3.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-editorial-dark" />
                      Your Stay Pricing Details
                    </h4>

                    <div className="space-y-2.5 text-xs text-editorial-dark">
                      <div className="flex justify-between font-light">
                        <span>{suite.name} ({nights} x ${suite.pricePerNight})</span>
                        <span className="font-medium">${baseCost.toFixed(2)}</span>
                      </div>

                      {promoApplied && (
                        <div className="flex justify-between text-emerald-800 font-medium">
                          <span className="flex items-center gap-1">
                            <Ticket className="w-3.5 h-3.5" />
                            Promo Discount ({(promoDiscount * 100)}% Off)
                          </span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-light">
                        <span>Metropolitan Taxes & resort fee (12%)</span>
                        <span className="font-medium">${taxesAndFees.toFixed(2)}</span>
                      </div>

                      <div className="border-t border-editorial-dark/10 pt-3 flex justify-between text-sm font-serif font-medium text-editorial-dark uppercase tracking-wide">
                        <span>Total Amount due</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div className="mt-4 pt-3 border-t border-editorial-dark/10 flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          id="promo-code-input"
                          type="text"
                          placeholder="ENTER PROMO CODE"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                          className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs tracking-wider uppercase focus:outline-none text-editorial-dark"
                        />
                        {promoApplied && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-emerald-700 font-bold uppercase tracking-wider">Applied</span>
                        )}
                      </div>
                      <button
                        id="apply-promo-btn"
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={promoApplied || !promoCode}
                        className="px-4 py-2 bg-editorial-dark hover:bg-editorial-dark/90 disabled:bg-editorial-gray/20 text-editorial-cream font-semibold text-[10px] uppercase tracking-wider rounded-sm transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <span className="text-[10px] text-red-600 block mt-1 font-medium">{promoError}</span>
                    )}
                    {!promoApplied && (
                      <span className="text-[9px] uppercase tracking-wider text-editorial-gray block mt-2">Try code <span className="font-semibold text-editorial-dark">WELCOME10</span> (10% off) or <span className="font-semibold text-editorial-dark">METROPOLIS20</span> (20% off)</span>
                    )}
                  </div>

                  {/* Secure payment form */}
                  <form id="payment-form" onSubmit={handleCheckout} className="space-y-4">
                    <h4 className="text-xs uppercase tracking-[0.15em] text-editorial-dark font-medium border-b border-editorial-dark/10 pb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-editorial-dark" />
                      Secure Card Details
                    </h4>

                    {paymentError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm font-semibold">
                        {paymentError}
                      </div>
                    )}

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1 font-medium">Cardholder Name</label>
                      <input
                        id="card-name"
                        type="text"
                        required
                        placeholder="e.g., JANE DOE"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/15 rounded-sm text-xs text-editorial-dark tracking-wide uppercase font-medium focus:border-editorial-dark focus:outline-none"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1 font-medium">Card Number</label>
                      <input
                        id="card-number"
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => {
                          // format as 4-4-4-4
                          const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          const matches = v.match(/\d{4,16}/g);
                          const match = matches && matches[0] || '';
                          const parts = [];

                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }

                          if (parts.length > 0) {
                            setCardNumber(parts.join(' '));
                          } else {
                            setCardNumber(v);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/15 rounded-sm text-xs text-editorial-dark tracking-widest font-mono focus:border-editorial-dark focus:outline-none"
                      />
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1 font-medium">Expiry MM/YY</label>
                        <input
                          id="card-expiry"
                          type="text"
                          required
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/[^0-9]/g, '');
                            if (v.length >= 2) {
                              v = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
                            }
                            setCardExpiry(v);
                          }}
                          className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/15 rounded-sm text-xs text-editorial-dark tracking-wider text-center font-mono focus:border-editorial-dark focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1 font-medium">CVV / CVC</label>
                        <input
                          id="card-cvv"
                          type="password"
                          required
                          maxLength={4}
                          placeholder="3 or 4 digits"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full px-3.5 py-2.5 bg-editorial-sand border border-editorial-dark/15 rounded-sm text-xs text-editorial-dark text-center tracking-widest font-mono focus:border-editorial-dark focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Submit button inside form (triggered below) */}
                    <button type="submit" className="hidden" id="hidden-submit-btn" />
                  </form>
                </div>
              )}

              {step === 4 && confirmedBooking && (
                <div className="text-center py-8 space-y-6 animate-fade-in">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-editorial-dark" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-2xl font-serif font-light text-editorial-dark uppercase tracking-wide">Reservation Secured</h4>
                    <p className="text-editorial-gray text-xs">A luxury receipt and booking check-in voucher has been sent to <span className="font-semibold text-editorial-dark">{confirmedBooking.guestEmail}</span>.</p>
                  </div>

                  <div className="bg-editorial-sand p-6 rounded-sm border border-editorial-dark/10 max-w-md mx-auto text-left space-y-4">
                    <div className="flex justify-between border-b border-editorial-dark/10 pb-3 text-[10px] uppercase tracking-wider text-editorial-gray">
                      <span>BOOKING REFERENCE</span>
                      <span className="font-mono font-bold text-editorial-dark text-xs">{confirmedBooking.id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-editorial-dark">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Suite Reserved</span>
                        <span className="font-medium">{confirmedBooking.suiteName}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Guest Name</span>
                        <span className="font-medium">{confirmedBooking.guestName}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Check-In</span>
                        <span className="font-mono font-medium">{confirmedBooking.checkIn}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Check-Out</span>
                        <span className="font-mono font-medium">{confirmedBooking.checkOut}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Length of Stay</span>
                        <span className="font-medium">{confirmedBooking.nights} {confirmedBooking.nights === 1 ? 'Night' : 'Nights'}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-medium">Amount Settled</span>
                        <span className="font-serif font-medium text-editorial-dark text-sm">${confirmedBooking.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>)}
        </div>

        {/* Modal actions footer */}
        <div className="bg-editorial-sand border-t border-editorial-dark/10 p-5 flex justify-between items-center flex-shrink-0">
          {!user ? (
            <div className="w-full flex justify-end">
              <button
                id="booking-cancel-btn"
                onClick={onClose}
                className="px-6 py-2 border border-editorial-dark/20 hover:bg-editorial-dark hover:text-editorial-cream text-editorial-dark text-[10px] uppercase tracking-wider font-semibold rounded-sm transition-all"
              >
                Cancel
              </button>
            </div>
          ) : step < 4 ? (
            <>
              {/* Back button */}
              {step > 1 ? (
                <button
                  id="booking-prev-step-btn"
                  onClick={handlePrevStep}
                  className="flex items-center gap-1 text-editorial-dark hover:text-black font-medium text-[10px] uppercase tracking-[0.15em] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {/* Action Trigger */}
              {step === 3 ? (
                <button
                  id="confirm-booking-final-btn"
                  onClick={() => document.getElementById('hidden-submit-btn')?.click()}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-editorial-dark hover:bg-editorial-dark/95 text-editorial-cream font-medium uppercase tracking-[0.15em] text-[10px] rounded-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? 'Processing...' : `Pay & Secure $${totalCost.toFixed(2)}`}
                </button>
              ) : (
                <button
                  id="booking-next-step-btn"
                  onClick={handleNextStep}
                  disabled={step === 1 ? !validateStep1() : !validateStep2()}
                  className="px-6 py-2.5 bg-editorial-dark hover:bg-editorial-dark/95 disabled:bg-editorial-gray/25 disabled:cursor-not-allowed text-editorial-cream font-medium uppercase tracking-[0.15em] text-[10px] rounded-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-center">
              <button
                id="booking-finish-btn"
                onClick={onClose}
                className="px-8 py-3 bg-editorial-dark hover:bg-editorial-dark/95 text-editorial-cream font-medium uppercase tracking-[0.15em] text-[10px] rounded-sm transition-all cursor-pointer"
              >
                Go to My Reservations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
