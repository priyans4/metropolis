import React from 'react';
import { Search, Star, SlidersHorizontal, RefreshCw, DollarSign, Bed, Sparkles } from 'lucide-react';
import { AMENITIES_LIST } from '../data';

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onReset: () => void;
  resultsCount: number;
}

export default function Filters({
  searchQuery,
  setSearchQuery,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  selectedAmenities,
  setSelectedAmenities,
  sortBy,
  setSortBy,
  onReset,
  resultsCount
}: FiltersProps) {

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div id="filters-container" className="bg-editorial-cream border border-editorial-dark/10 rounded-sm p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-editorial-dark/10 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-editorial-dark" />
          <h3 className="font-serif font-medium text-editorial-dark text-base uppercase tracking-[0.05em]">Filter Suites</h3>
        </div>
        <button
          id="reset-filters-btn"
          onClick={onReset}
          className="text-[10px] text-editorial-gray hover:text-editorial-dark flex items-center gap-1 transition-colors uppercase tracking-[0.15em] font-medium"
        >
          <RefreshCw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Results Count Summary */}
      <div className="bg-editorial-sand px-3.5 py-2.5 border border-editorial-dark/5 rounded-sm text-xs text-editorial-gray flex justify-between items-center font-light">
        <span>Available Options:</span>
        <span className="font-semibold text-editorial-dark font-mono">{resultsCount} {resultsCount === 1 ? 'Suite' : 'Suites'}</span>
      </div>

      {/* Search Bar Input */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Search Keyword</label>
        <div className="relative">
          <input
            id="filter-search-input"
            type="text"
            placeholder="Search suite names, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs text-editorial-dark placeholder-editorial-gray/50 focus:outline-none focus:border-editorial-dark"
          />
          <Search className="w-3.5 h-3.5 text-editorial-gray/60 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Pricing slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray font-medium">Max Nightly Price</label>
          <span className="text-xs font-semibold font-mono text-editorial-dark">${maxPrice}</span>
        </div>
        <input
          id="filter-price-slider"
          type="range"
          min={150}
          max={1300}
          step={25}
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full h-1 bg-editorial-sand rounded-sm appearance-none cursor-pointer accent-editorial-dark"
        />
        <div className="flex justify-between text-[9px] text-editorial-gray/70 uppercase tracking-[0.05em] font-light">
          <span>Min: $150</span>
          <span>Max: $1300+</span>
        </div>
      </div>

      {/* Guest ratings select filters */}
      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray font-medium">Minimum Star Rating</label>
        <div className="flex flex-col gap-1.5">
          {[0, 4, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              id={`filter-rating-btn-${rating}`}
              onClick={() => setMinRating(rating)}
              className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-all ${minRating === rating
                  ? 'bg-editorial-dark text-editorial-cream font-medium border border-editorial-dark'
                  : 'bg-editorial-sand/60 hover:bg-editorial-sand text-editorial-dark border border-transparent'
                }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className={`w-3 h-3 ${rating > 0 ? 'fill-current text-editorial-dark' : 'text-editorial-gray/40'} ${minRating === rating ? 'text-editorial-cream fill-current' : ''}`} />
                <span className="text-[11px] font-light">{rating === 0 ? 'All Ratings' : `${rating.toFixed(1)}+ Stars`}</span>
              </div>
              <span className={`text-[9px] uppercase tracking-[0.05em] font-mono ${minRating === rating ? 'text-editorial-cream/70' : 'text-editorial-gray'}`}>
                {rating === 0 ? '' : rating === 4 ? 'Very Good' : rating === 4.5 ? 'Superb' : 'Exceptional'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Multi-Checkboxes */}
      <div className="space-y-2.5">
        <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray font-medium">Amenities Included</label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {AMENITIES_LIST.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <label key={amenity} className="flex items-center gap-2.5 cursor-pointer text-editorial-dark hover:text-black select-none text-xs font-light">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-3.5 h-3.5 rounded border-editorial-dark/20 text-editorial-dark focus:ring-editorial-dark cursor-pointer accent-editorial-dark"
                />
                <span className="text-[11px] tracking-[0.02em]">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sorting Rules */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.15em] text-editorial-gray mb-1.5 font-medium">Sort Order</label>
        <select
          id="filter-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 bg-editorial-sand border border-editorial-dark/10 rounded-sm text-xs font-medium focus:outline-none focus:border-editorial-dark text-editorial-dark cursor-pointer"
        >
          <option value="featured">Featured Suites</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
