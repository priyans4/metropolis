import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, Calendar, Users, Landmark, Landmark as HotelIcon, 
  Sparkles, ShieldCheck, Mail, Phone, ArrowRight, CornerDownRight, AlertTriangle 
} from 'lucide-react';
import { Booking } from '../types';

interface BookingConfirmedModalProps {
  booking: Booking;
  onClose: () => void;
  onViewPortfolio: () => void;
}

export function BookingConfirmedModal({
  booking,
  onClose,
  onViewPortfolio
}: BookingConfirmedModalProps) {
  return (
    <div id="booking-confirmed-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-editorial-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
        id="booking-confirmed-modal"
        className="bg-editorial-cream border border-editorial-dark/15 max-w-lg w-full rounded-sm shadow-2xl overflow-hidden flex flex-col text-editorial-dark"
      >
        {/* Animated celebration top section */}
        <div className="relative bg-gradient-to-br from-stone-900 to-amber-950 p-6 text-editorial-cream text-center overflow-hidden space-y-2">
          {/* Ambient patterns */}
          <div className="absolute top-[-50%] right-[-30%] w-64 h-64 rounded-full border border-editorial-cream/5 pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-36 h-36 rounded-full border border-editorial-cream/5 pointer-events-none" />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="w-12 h-12 bg-editorial-cream/10 border border-editorial-cream/20 text-amber-300 rounded-sm flex items-center justify-center mx-auto"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </motion.div>

          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-[0.3em] text-editorial-cream/65 font-semibold">Reservation Success</span>
            <h3 className="text-2xl font-serif font-light uppercase tracking-wide">Stay Confirmed</h3>
          </div>
          
          <div className="inline-block bg-editorial-cream/15 border border-editorial-cream/10 rounded-sm px-3 py-1 text-[9px] font-mono text-editorial-cream/90">
            CONFIRMATION CODE: {booking.id}
          </div>
        </div>

        {/* Modal core info body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* Suite Hero Card */}
          <div className="flex gap-4 border-b border-editorial-dark/10 pb-4">
            <img 
              src={booking.suiteImage} 
              alt={booking.suiteName} 
              className="w-24 h-16 object-cover rounded-sm border border-editorial-dark/10 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="text-[8px] uppercase tracking-wider text-editorial-gray font-bold">Suite Selection</span>
              <h4 className="text-sm font-serif font-light text-editorial-dark uppercase truncate">{booking.suiteName}</h4>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-editorial-gray font-light">
                <Calendar className="w-3.5 h-3.5" />
                <span>{booking.nights} nights stay</span>
              </div>
            </div>
          </div>

          {/* Booking Parameters details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-editorial-sand/45 p-3 rounded-sm border border-editorial-dark/5">
              <span className="block text-[8px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">Check-In Arrival</span>
              <span className="font-mono font-medium block">{booking.checkIn}</span>
              <span className="text-[9px] text-editorial-gray block mt-0.5">After 3:00 PM</span>
            </div>
            <div className="bg-editorial-sand/45 p-3 rounded-sm border border-editorial-dark/5">
              <span className="block text-[8px] uppercase tracking-wider text-editorial-gray font-semibold mb-1">Check-Out Departure</span>
              <span className="font-mono font-medium block">{booking.checkOut}</span>
              <span className="text-[9px] text-editorial-gray block mt-0.5">Before 11:00 AM</span>
            </div>
          </div>

          {/* Occupants, Guest details */}
          <div className="space-y-2 border-b border-editorial-dark/10 pb-4">
            <h5 className="text-[9px] uppercase tracking-wider text-editorial-gray font-bold">Guest Portfolio Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs font-light">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-editorial-dark/60 shrink-0" />
                <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'} Total</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-editorial-dark/60 shrink-0" />
                <span className="truncate">{booking.guestEmail}</span>
              </div>
              <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                <Phone className="w-3.5 h-3.5 text-editorial-dark/60 shrink-0" />
                <span>{booking.guestPhone}</span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="bg-amber-50/50 border border-amber-500/10 p-3 rounded-sm text-xs font-light text-editorial-dark/90 italic">
              <span className="font-semibold not-italic block text-[8px] uppercase tracking-wider text-editorial-gray mb-1">
                Your Special Request:
              </span>
              "{booking.specialRequests}"
            </div>
          )}

          {/* Pricing summary */}
          <div className="flex justify-between items-center bg-editorial-dark text-editorial-cream p-4 rounded-sm">
            <div>
              <span className="block text-[8px] uppercase tracking-[0.15em] text-editorial-cream/50">Total Stay Valuation</span>
              <span className="text-xl font-serif">${booking.totalPrice.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] uppercase tracking-[0.15em] text-editorial-cream/40">Status</span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono">Paid / Guaranteed</span>
            </div>
          </div>

          {/* Reassurance text */}
          <div className="flex items-start gap-2 text-[10px] text-editorial-gray font-light">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Your security and privacy is certified. Free cancellation is active up to 24 hours prior to check-in. For any modifications, manage your stay through your guest portal.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-editorial-dark/10 p-4 bg-editorial-sand/40 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onViewPortfolio}
            className="flex-1 py-3 bg-editorial-dark hover:opacity-90 text-editorial-cream text-[10px] uppercase tracking-[0.15em] font-bold rounded-sm transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Go to Guest Portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 border border-editorial-dark/15 hover:bg-editorial-sand/50 text-editorial-dark text-[10px] uppercase tracking-[0.15em] font-semibold rounded-sm transition-all"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface BookingCanceledModalProps {
  booking: Booking;
  onClose: () => void;
  onBrowseSuites: () => void;
}

export function BookingCanceledModal({
  booking,
  onClose,
  onBrowseSuites
}: BookingCanceledModalProps) {
  return (
    <div id="booking-canceled-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-editorial-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
        id="booking-canceled-modal"
        className="bg-editorial-cream border border-editorial-dark/15 max-w-md w-full rounded-sm shadow-2xl overflow-hidden flex flex-col text-editorial-dark"
      >
        {/* Banner with notice alert */}
        <div className="bg-stone-100 border-b border-editorial-dark/10 p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-600 rounded-sm flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-[0.2em] text-editorial-gray font-bold">Cancellation Confirmed</span>
            <h3 className="text-xl font-serif font-light uppercase tracking-wide text-editorial-dark">Reservation Released</h3>
          </div>
          
          <span className="inline-block text-[9px] font-mono text-editorial-gray/80">
            REF CODE: {booking.id}
          </span>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-4 text-center">
          <p className="text-xs text-editorial-gray font-light leading-relaxed">
            Your reservation for the <strong className="font-semibold text-editorial-dark">{booking.suiteName}</strong> has been successfully canceled. The room has been returned to our vacant suite registry.
          </p>

          <div className="bg-editorial-sand/40 border border-editorial-dark/5 p-4 rounded-sm text-left space-y-2 text-xs">
            <h5 className="text-[9px] uppercase tracking-wider text-editorial-dark font-bold">Transaction Ledger Status:</h5>
            <div className="space-y-1.5 text-editorial-gray font-light">
              <div className="flex justify-between">
                <span>Billing Total Returned:</span>
                <span className="font-mono text-editorial-dark font-medium">${booking.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Cancellation Charges:</span>
                <span className="font-mono text-emerald-600 font-semibold">$0.00 (Free Guarantee)</span>
              </div>
              <div className="flex justify-between">
                <span>Hold Authorized Release:</span>
                <span className="text-editorial-dark">Complete</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-editorial-gray font-light">
            We hope to welcome you to The Metropolis in the future. Explore our visual archives or other signature suites whenever you are ready to reschedule.
          </p>
        </div>

        {/* Footer actions */}
        <div className="border-t border-editorial-dark/10 p-4 bg-editorial-sand/40 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onBrowseSuites}
            className="flex-1 py-3 bg-editorial-dark hover:opacity-90 text-editorial-cream text-[10px] uppercase tracking-[0.15em] font-bold rounded-sm transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <HotelIcon className="w-3.5 h-3.5" />
            Browse Other Suites
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 border border-editorial-dark/15 hover:bg-editorial-sand/50 text-editorial-dark text-[10px] uppercase tracking-[0.15em] font-semibold rounded-sm transition-all"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>
  );
}
