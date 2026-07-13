import React from 'react';
import { Star, Users, Maximize, BedDouble, ChevronRight } from 'lucide-react';
import { Suite } from '../types';

interface SuiteCardProps {
  suite: Suite;
  onBook: (suite: Suite) => void;
  onViewDetails: (suite: Suite) => void;
  key?: string | number;
}

export default function SuiteCard({ suite, onBook, onViewDetails }: SuiteCardProps) {
  // Determine Type color
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'penthouse':
        return 'bg-editorial-dark text-editorial-cream border-editorial-dark';
      case 'executive':
        return 'bg-editorial-sand text-editorial-dark border-editorial-dark/20';
      case 'deluxe':
        return 'bg-transparent text-editorial-dark border-editorial-dark/30';
      default:
        return 'bg-transparent text-editorial-gray border-editorial-dark/10';
    }
  };

  return (
    <div
      id={`suite-card-${suite.id}`}
      className="bg-editorial-cream rounded-sm border border-editorial-dark/10 overflow-hidden shadow-sm hover:shadow-md hover:border-editorial-dark/20 transition-all duration-300 flex flex-col group"
    >
      {/* Image Container */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-editorial-sand">
        <img
          src={suite.images[0]}
          alt={suite.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        {/* Overlays */}
        {suite.featured && (
          <span className="absolute top-4 left-4 bg-editorial-dark/95 backdrop-blur-sm text-editorial-cream text-[9px] uppercase tracking-[0.2em] font-medium px-3 py-1 rounded-sm shadow-sm">
            Signature Suite
          </span>
        )}

        <div className="absolute bottom-4 right-4 bg-editorial-cream/90 backdrop-blur-md px-2.5 py-1 rounded-sm text-editorial-dark text-[11px] font-medium flex items-center gap-1 border border-editorial-dark/10">
          <Star className="w-3.5 h-3.5 fill-current text-editorial-dark" />
          <span>{suite.rating.toFixed(1)}</span>
          <span className="text-editorial-gray font-light">({suite.reviewCount})</span>
        </div>
      </div>

      {/* Info Details */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[9px] uppercase font-medium tracking-[0.15em] px-2.5 py-0.5 rounded-sm border ${getTypeBadge(suite.type)}`}>
            {suite.type}
          </span>
          <span className="text-editorial-gray text-[11px] font-mono tracking-wider">{suite.size} sq ft</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-light text-editorial-dark mb-2 group-hover:text-editorial-dark/75 transition-colors">
          {suite.name}
        </h3>

        <p className="text-editorial-gray text-xs sm:text-sm font-light leading-relaxed mb-4 flex-1">
          {suite.description}
        </p>

        {/* Icons Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-editorial-dark/10 mb-4 text-editorial-dark text-[11px] uppercase tracking-[0.05em]">
          <div className="flex items-center gap-1.5 justify-center font-light">
            <BedDouble className="w-3.5 h-3.5 text-editorial-dark shrink-0" />
            <span>{suite.beds.split(' ')[1] || 'Bed'}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center font-light">
            <Users className="w-3.5 h-3.5 text-editorial-dark shrink-0" />
            <span>Max {suite.guests}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center font-light">
            <Maximize className="w-3.5 h-3.5 text-editorial-dark shrink-0" />
            <span>{suite.size} SF</span>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {suite.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="bg-editorial-sand text-editorial-dark text-[10px] uppercase tracking-[0.05em] px-2.5 py-1 rounded-sm font-light">
              {amenity}
            </span>
          ))}
          {suite.amenities.length > 3 && (
            <span className="bg-editorial-dark text-editorial-cream text-[10px] uppercase tracking-[0.05em] px-2 py-1 rounded-sm font-light font-mono">
              +{suite.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Pricing / Booking Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-editorial-dark/5">
          <div>
            <span className="text-2xl font-serif font-medium text-editorial-dark">${suite.pricePerNight}</span>
            <span className="text-editorial-gray text-[10px] uppercase tracking-[0.05em] font-light"> / night</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id={`view-details-btn-${suite.id}`}
              onClick={() => onViewDetails(suite)}
              className="px-3.5 py-2 border border-editorial-dark/20 text-editorial-dark hover:bg-editorial-dark hover:text-editorial-cream hover:border-editorial-dark font-medium text-[11px] uppercase tracking-[0.1em] rounded-sm transition-all"
            >
              Details
            </button>
            <button
              id={`book-suite-btn-${suite.id}`}
              onClick={() => onBook(suite)}
              className="px-4 py-2 bg-editorial-dark hover:bg-editorial-dark/90 text-editorial-cream font-medium text-[11px] uppercase tracking-[0.1em] rounded-sm transition-all"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
