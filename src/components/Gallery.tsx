import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, X, ZoomIn, Hotel, Landmark, Sparkles, MapPin, Calendar } from 'lucide-react';
import { Suite } from '../types';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'rooms' | 'common' | 'amenities';
  subcategory: string;
  description: string;
  suiteId?: string; // Links back to a suite if applicable
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    title: 'Cosmopolitan Queen Suite',
    category: 'rooms',
    subcategory: 'Standard',
    description: 'An elegant, warm urban escape framed by clean, high-contrast layouts and courtyard views.',
    suiteId: 's1'
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    title: 'Metropolitan King Suite',
    category: 'rooms',
    subcategory: 'Deluxe',
    description: 'Sleek designer details featuring polished brass fixtures, rich oak furniture, and a private seating lounge.',
    suiteId: 's2'
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    title: 'Terrace Junior Suite Oasis',
    category: 'rooms',
    subcategory: 'Deluxe',
    description: 'A lush, landscaped brick terrace that commands dramatic viewpoints over the historic metropolitan district.',
    suiteId: 's3'
  },
  {
    id: 'gal-4',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    title: 'Skyline Executive Suite',
    category: 'rooms',
    subcategory: 'Executive',
    description: 'Sweeping glass facades framing the endless twinkling grid of the downtown skyline.',
    suiteId: 's4'
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    title: 'Sanctuary Spa Chamber',
    category: 'rooms',
    subcategory: 'Executive',
    description: 'A dedicated personal wellness haven featuring an private cedar-wood Finnish sauna and a copper jacuzzi bath.',
    suiteId: 's5'
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    title: 'Grand Metropolis Penthouse',
    category: 'rooms',
    subcategory: 'Penthouse',
    description: 'Our top-floor palatial retreat, featuring curated artwork, bespoke bar, and sweeping dual-aspect terraces.',
    suiteId: 's6'
  },
  {
    id: 'gal-7',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    title: 'Grand Entrance & Atrium',
    category: 'common',
    subcategory: 'Lobby',
    description: 'Sophisticated check-in parlor boasting custom fluted plasterwork, high-ceiling arches, and classical acoustics.'
  },
  {
    id: 'gal-8',
    url: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
    title: 'The Library Lounge',
    category: 'common',
    subcategory: 'Lobby',
    description: 'An elegant reading alcove for discrete business transactions, fresh botanicals, and high-tea afternoons.'
  },
  {
    id: 'gal-9',
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    title: 'The Gilded Table Dining Room',
    category: 'common',
    subcategory: 'Restaurant',
    description: 'An intimate dining salon crafting avant-garde gastronomy from organically sourced heritage estate ingredients.'
  },
  {
    id: 'gal-10',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    title: 'The Obsidian Cocktail Bar',
    category: 'common',
    subcategory: 'Bar',
    description: 'A velvet-shrouded speakeasy showcasing rare whiskies, artisanal infusions, and vintage custom cellar labels.'
  },
  {
    id: 'gal-11',
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    title: 'The Horizon Rooftop Pool',
    category: 'amenities',
    subcategory: 'Rooftop Pool',
    description: 'Heated infinity plunge pool looking onto high-rise landmarks with luxury curtained private daybeds.'
  },
  {
    id: 'gal-12',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    title: 'The Kinetic Fitness Studio',
    category: 'amenities',
    subcategory: 'Gym',
    description: 'Modern cardiovascular and strength-training equipment featuring clean linear lights and structural wood frames.'
  },
  {
    id: 'gal-13',
    url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    title: 'The Aromatherapy Thermal Spa',
    category: 'amenities',
    subcategory: 'Spa',
    description: 'Quiet thermal rock baths, ambient soundscapes, and biological lavender steam-room treatments.'
  }
];

interface GalleryProps {
  onExploreSuite: (suiteId: string) => void;
}

export default function Gallery({ onExploreSuite }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'rooms' | 'common' | 'amenities'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Reset subcategory filter when category changes
  useEffect(() => {
    setSelectedSubcategory('all');
  }, [activeCategory]);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || item.subcategory === selectedSubcategory;
    return matchesCategory && matchesSubcategory;
  });

  // Unique subcategories for the active category to filter
  const getSubcategories = () => {
    if (activeCategory === 'all') return [];
    const subs = GALLERY_ITEMS.filter((i) => i.category === activeCategory).map((i) => i.subcategory);
    return Array.from(new Set(subs));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const prevIndex = lightboxIndex === 0 ? filteredItems.length - 1 : lightboxIndex - 1;
    setLightboxIndex(prevIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const nextIndex = lightboxIndex === filteredItems.length - 1 ? 0 : lightboxIndex + 1;
    setLightboxIndex(nextIndex);
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div id="hotel-gallery-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-12">
      
      {/* Intro Text & Vibe */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-editorial-sand text-editorial-dark border border-editorial-dark/10 px-3.5 py-1 rounded-sm text-[10px] uppercase tracking-[0.18em] font-medium">
          <Sparkles className="w-3 h-3" />
          The Visual Archive
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-editorial-dark uppercase tracking-wide">
          Spaces & Perspectives
        </h2>
        <p className="text-editorial-gray font-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Immerse yourself in our architectural diary. From bespoke suites to quiet lobbies, explore the clean lines, curated materials, and five-star luxury amenities of The Metropolis.
        </p>
      </div>

      {/* Main Categories Tab Bar */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-editorial-dark/10 pb-4 max-w-2xl mx-auto">
        {(['all', 'rooms', 'common', 'amenities'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-200 border-b ${
              activeCategory === cat
                ? 'border-editorial-dark text-editorial-dark font-semibold'
                : 'border-transparent text-editorial-gray hover:text-editorial-dark'
            }`}
          >
            {cat === 'all' && 'All Perspectives'}
            {cat === 'rooms' && 'Suites & Rooms'}
            {cat === 'common' && 'Common Spaces'}
            {cat === 'amenities' && 'Exquisite Amenities'}
          </button>
        ))}
      </div>

      {/* Subcategory Pill Filters */}
      {activeCategory !== 'all' && getSubcategories().length > 0 && (
        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-3 py-1 text-[9px] uppercase tracking-wider rounded-full border transition-all ${
              selectedSubcategory === 'all'
                ? 'bg-editorial-dark text-editorial-cream border-editorial-dark'
                : 'bg-editorial-cream text-editorial-gray border-editorial-dark/15 hover:border-editorial-dark'
            }`}
          >
            All {activeCategory === 'rooms' ? 'Suites' : activeCategory === 'common' ? 'Spaces' : 'Amenities'}
          </button>
          {getSubcategories().map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1 text-[9px] uppercase tracking-wider rounded-full border transition-all ${
                selectedSubcategory === sub
                  ? 'bg-editorial-dark text-editorial-cream border-editorial-dark'
                  : 'bg-editorial-cream text-editorial-gray border-editorial-dark/15 hover:border-editorial-dark'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Responsive Bento Grid with Image Lazy Loading & Skeleton */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const isLoaded = loadedImages[item.id];
            
            // Generate some visual interest using index-based layout classes for a bento style
            let gridClass = "col-span-1 aspect-square";
            if (index % 5 === 0) {
              gridClass = "sm:col-span-2 aspect-[4/3] sm:aspect-[16/10]";
            } else if (index % 6 === 3) {
              gridClass = "col-span-1 aspect-[3/4]";
            }

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className={`${gridClass} relative overflow-hidden group cursor-pointer bg-editorial-sand border border-editorial-dark/5 rounded-sm shadow-sm hover:shadow-md hover:border-editorial-dark/15 transition-all`}
              >
                {/* Image Placeholder Skeleton */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-editorial-sand animate-pulse flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-editorial-gray/20 animate-bounce" />
                  </div>
                )}

                {/* Main Image */}
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  onLoad={() => handleImageLoad(item.id)}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                    isLoaded ? 'opacity-95' : 'opacity-0'
                  }`}
                />

                {/* Subtle dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-editorial-dark/80 via-editorial-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />

                {/* Floating zoom badge */}
                <div className="absolute top-4 right-4 p-2 rounded-sm bg-editorial-cream/90 backdrop-blur-sm border border-editorial-dark/5 text-editorial-dark shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-4px] group-hover:translate-y-0">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>

                {/* Overlaid caption info */}
                <div className="absolute bottom-4 left-4 right-4 text-editorial-cream opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[4px] group-hover:translate-y-0 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] uppercase tracking-wider bg-editorial-cream/25 backdrop-blur-sm px-1.5 py-0.5 rounded-sm font-medium">
                      {item.subcategory}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-serif font-light tracking-wide uppercase">{item.title}</h4>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox / Immersive Full-Screen Slider Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div 
            id="gallery-lightbox-modal"
            className="fixed inset-0 z-50 bg-editorial-dark/95 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between text-editorial-cream py-2 border-b border-editorial-cream/10">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-editorial-cream" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-light">The Metropolis Visual Diary</span>
              </div>
              <button
                id="lightbox-close-btn"
                onClick={() => setLightboxIndex(null)}
                className="p-2 hover:bg-editorial-cream/10 rounded-sm transition-colors text-editorial-cream cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle Slider Container */}
            <div className="flex-1 flex items-center justify-between gap-4 max-w-6xl mx-auto w-full">
              {/* Left Arrow */}
              <button
                id="lightbox-prev-btn"
                onClick={handlePrev}
                className="p-2 sm:p-3 bg-editorial-cream/5 hover:bg-editorial-cream/15 text-editorial-cream rounded-sm transition-all focus:outline-none"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 h-6" />
              </button>

              {/* Slider Core Image Frame */}
              <div 
                className="relative flex-1 max-h-[60vh] sm:max-h-[70vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  src={filteredItems[lightboxIndex].url}
                  alt={filteredItems[lightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain rounded-sm border border-editorial-cream/10 shadow-2xl"
                />
              </div>

              {/* Right Arrow */}
              <button
                id="lightbox-next-btn"
                onClick={handleNext}
                className="p-2 sm:p-3 bg-editorial-cream/5 hover:bg-editorial-cream/15 text-editorial-cream rounded-sm transition-all focus:outline-none"
              >
                <ArrowRight className="w-5 h-5 sm:w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption & Interactive Link details */}
            <div 
              className="max-w-3xl mx-auto w-full text-center text-editorial-cream pb-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                <div className="flex justify-center items-center gap-2">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-editorial-cream/65 bg-editorial-cream/10 px-2 py-0.5 rounded-sm font-semibold">
                    {filteredItems[lightboxIndex].category}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-editorial-cream/50">•</span>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-editorial-cream/65">
                    {filteredItems[lightboxIndex].subcategory}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-light uppercase tracking-wide">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="text-xs sm:text-sm font-light text-editorial-cream/85 max-w-xl mx-auto leading-relaxed">
                  {filteredItems[lightboxIndex].description}
                </p>
              </div>

              {/* Dynamic Link to Suite Bookings */}
              {filteredItems[lightboxIndex].suiteId && (
                <div className="pt-2 animate-fade-in">
                  <button
                    id={`lightbox-book-link-${filteredItems[lightboxIndex].suiteId}`}
                    onClick={() => {
                      if (filteredItems[lightboxIndex].suiteId) {
                        onExploreSuite(filteredItems[lightboxIndex].suiteId);
                        setLightboxIndex(null);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-editorial-cream text-editorial-dark hover:bg-editorial-cream/90 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-sm transition-all shadow-md"
                  >
                    <Hotel className="w-3.5 h-3.5" />
                    Explore & Reserve Room
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
