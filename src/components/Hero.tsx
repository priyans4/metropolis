import React, { useState } from 'react';
import { Calendar, Users, ShieldCheck, HelpCircle, Flame, Star, Sparkles } from 'lucide-react';
import { SearchParams } from '../types';

interface HeroProps {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  onSearch: () => void;
}

export default function Hero({ searchParams, setSearchParams, onSearch }: HeroProps) {
  const [errorMsg, setErrorMsg] = useState('');

  const handleDateChange = (field: 'checkIn' | 'checkOut', value: string) => {
    const updated = { ...searchParams, [field]: value };

    // Simple verification
    if (field === 'checkIn' && updated.checkOut <= value) {
      // Automatically shift check-out date to next day
      const nextDay = new Date(value);
      nextDay.setDate(nextDay.getDate() + 1);
      updated.checkOut = nextDay.toISOString().split('T')[0];
    }

    setSearchParams(updated);
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ ...searchParams, guests: parseInt(e.target.value) });
  };

  return (
    <div id="hero-section" className="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center bg-stone-900 overflow-hidden">
      {/* Background Image with elegant overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
          alt="Metropolis Hotel Lobby Entrance"
          className="w-full h-full object-cover opacity-45 transform scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-stone-50">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-editorial-cream/10 border border-editorial-cream/20 text-stone-200 text-[10px] font-semibold tracking-[0.2em] uppercase mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-stone-200" />
          <span>A Curated Sanctuary in the Metropolis</span>
        </div>

        <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight leading-[1.15] mb-6 font-light">
          Experience Elegant Luxury,<br />
          <span className="font-normal italic">Reimagined.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-stone-300 text-xs sm:text-sm md:text-base font-light tracking-[0.05em] mb-12 leading-relaxed opacity-90">
          Discover a curated collection of executive and penthouse suites designed to elevate your stay. Modern architectural brilliance meets classical high-end European hospitality.
        </p>

        {/* Search Widget - Editorial Styled */}
        <div id="search-widget" className="w-full max-w-4xl mx-auto bg-editorial-cream text-editorial-dark p-6 rounded-sm border border-editorial-dark/10 shadow-xl relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {/* Check In */}
            <div className="relative">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray font-medium mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-editorial-dark" />
                Check-In Date
              </label>
              <input
                id="search-check-in"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={searchParams.checkIn}
                onChange={(e) => handleDateChange('checkIn', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-editorial-sand text-editorial-dark border border-editorial-dark/10 rounded-sm text-xs font-medium focus:border-editorial-dark focus:outline-none transition-colors"
              />
            </div>

            {/* Check Out */}
            <div className="relative">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray font-medium mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-editorial-dark" />
                Check-Out Date
              </label>
              <input
                id="search-check-out"
                type="date"
                min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                value={searchParams.checkOut}
                onChange={(e) => handleDateChange('checkOut', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-editorial-sand text-editorial-dark border border-editorial-dark/10 rounded-sm text-xs font-medium focus:border-editorial-dark focus:outline-none transition-colors"
              />
            </div>

            {/* Guests */}
            <div className="relative">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray font-medium mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-editorial-dark" />
                Guests Capacity
              </label>
              <select
                id="search-guests"
                value={searchParams.guests}
                onChange={handleGuestsChange}
                className="w-full px-3.5 py-2.5 bg-editorial-sand text-editorial-dark border border-editorial-dark/10 rounded-sm text-xs font-medium focus:border-editorial-dark focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
              </select>
            </div>

            {/* CTA Button */}
            <div className="flex items-end">
              <button
                id="search-suites-btn"
                onClick={onSearch}
                className="w-full py-2.5 px-6 bg-editorial-dark hover:bg-editorial-dark/95 text-editorial-cream font-medium uppercase tracking-[0.15em] text-[11px] rounded-sm shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 h-[38px]"
              >
                Find Best Suites
              </button>
            </div>
          </div>

          {/* Bullet proofs */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-5 pt-4 border-t border-editorial-dark/10 text-[10px] uppercase tracking-[0.1em] text-editorial-gray">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-editorial-dark" />
              Guaranteed Best Rate Online
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-editorial-dark" />
              No Booking Fees
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-editorial-dark" />
              Free Cancellation prior to 24h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
