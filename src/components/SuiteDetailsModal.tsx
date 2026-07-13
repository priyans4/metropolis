import React, { useState } from 'react';
import { X, Star, Check, Calendar, Plus, MessageSquare } from 'lucide-react';
import { Suite, Review } from '../types';

interface SuiteDetailsModalProps {
  suite: Suite;
  reviews: Review[];
  onClose: () => void;
  onBook: (suite: Suite) => void;
  onSubmitReview: (suiteId: string, rating: number, userName: string, title: string, comment: string) => void;
}

export default function SuiteDetailsModal({
  suite,
  reviews,
  onClose,
  onBook,
  onSubmitReview
}: SuiteDetailsModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // New Review form state
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [formError, setFormError] = useState('');

  // Filter reviews for this suite
  const suiteReviews = reviews.filter((r) => r.suiteId === suite.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTitle.trim() || !newComment.trim()) {
      setFormError('Please fill out all fields.');
      return;
    }

    onSubmitReview(suite.id, newRating, newName, newTitle, newComment);

    // Reset state
    setNewName('');
    setNewTitle('');
    setNewComment('');
    setNewRating(5);
    setShowAddReview(false);
    setFormError('');
  };

  return (
    <div id="suite-details-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-editorial-dark/70 backdrop-blur-sm overflow-y-auto">
      <div id="suite-details-modal-content" className="bg-editorial-cream w-full max-w-4xl rounded-sm shadow-2xl border border-editorial-dark/10 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="relative flex-shrink-0">
          <div className="h-64 sm:h-80 w-full bg-editorial-dark">
            <img
              src={suite.images[activeImageIdx]}
              alt={suite.name}
              className="w-full h-full object-cover opacity-90 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-editorial-dark via-editorial-dark/20 to-transparent" />
          </div>

          {/* Close button */}
          <button
            id="close-details-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-sm bg-editorial-dark/85 hover:bg-editorial-dark text-editorial-cream transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-editorial-cream">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] uppercase font-medium tracking-[0.2em] px-2.5 py-1 rounded-sm border border-editorial-cream/25 bg-editorial-dark/45">
                {suite.type}
              </span>
              <div className="flex items-center gap-1 text-editorial-cream text-xs">
                <Star className="w-3.5 h-3.5 fill-current text-editorial-cream" />
                <span className="font-semibold">{suite.rating.toFixed(1)}</span>
                <span className="text-editorial-cream/70">({suiteReviews.length} Reviews)</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-light tracking-[0.02em] uppercase">
              {suite.name}
            </h2>
          </div>
        </div>

        {/* Thumbnail gallery */}
        <div className="flex bg-editorial-dark p-2 gap-2 border-b border-editorial-dark flex-shrink-0 overflow-x-auto">
          {suite.images.map((img, idx) => (
            <button
              key={idx}
              id={`thumbnail-btn-${idx}`}
              onClick={() => setActiveImageIdx(idx)}
              className={`relative h-14 w-20 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer ${activeImageIdx === idx ? 'ring-1 ring-editorial-cream' : 'opacity-50 hover:opacity-100'
                }`}
            >
              <img src={img} alt={`Suite View ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-editorial-dark/10 bg-editorial-sand/40 flex-shrink-0">
          <button
            id="tab-details"
            onClick={() => setActiveTab('details')}
            className={`flex-1 sm:flex-none px-6 py-3.5 text-[10px] uppercase tracking-[0.15em] font-medium border-b transition-all ${activeTab === 'details'
                ? 'border-editorial-dark text-editorial-dark font-semibold'
                : 'border-transparent text-editorial-gray hover:text-editorial-dark'
              }`}
          >
            Suite Details
          </button>
          <button
            id="tab-reviews"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 sm:flex-none px-6 py-3.5 text-[10px] uppercase tracking-[0.15em] font-medium border-b transition-all flex items-center justify-center gap-1.5 ${activeTab === 'reviews'
                ? 'border-editorial-dark text-editorial-dark font-semibold'
                : 'border-transparent text-editorial-gray hover:text-editorial-dark'
              }`}
          >
            Guest Reviews ({suiteReviews.length})
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-editorial-cream">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Long Description */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-[0.15em] text-editorial-gray font-semibold">Description</h4>
                <p className="text-editorial-dark text-sm leading-relaxed font-light">
                  {suite.longDescription}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-editorial-sand p-5 rounded-sm border border-editorial-dark/5">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-light">Size / Dimensions</span>
                  <span className="block text-sm font-medium text-editorial-dark">{suite.size} sq ft</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-light">Bed Setup</span>
                  <span className="block text-sm font-medium text-editorial-dark">{suite.beds}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-light">Max Occupancy</span>
                  <span className="block text-sm font-medium text-editorial-dark">{suite.guests} Guests</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-editorial-gray font-light">Price Per Night</span>
                  <span className="block text-sm font-serif font-medium text-editorial-dark">${suite.pricePerNight} USD</span>
                </div>
              </div>

              {/* Amenities checklist */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-[0.15em] text-editorial-gray font-semibold">Amenities Included</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                  {suite.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-editorial-dark text-xs sm:text-sm font-light">
                      <div className="p-0.5 border border-editorial-dark/15 text-editorial-dark rounded-sm shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="tracking-[0.01em]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header inside reviews */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-editorial-dark/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-serif font-light text-editorial-dark">{suite.rating.toFixed(1)}</span>
                    <div className="flex text-editorial-dark">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(suite.rating) ? 'fill-current text-editorial-dark' : 'text-editorial-gray/20'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-editorial-gray text-[11px] uppercase tracking-wider mt-1">Based on {suiteReviews.length} real guest stays</p>
                </div>

                {!showAddReview && (
                  <button
                    id="write-review-btn"
                    onClick={() => setShowAddReview(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-editorial-dark hover:bg-editorial-dark/90 text-editorial-cream font-medium text-[10px] uppercase tracking-[0.1em] rounded-sm shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Write a Review
                  </button>
                )}
              </div>

              {/* Add Review Form */}
              {showAddReview && (
                <form id="add-review-form" onSubmit={handleSubmitReview} className="bg-editorial-sand border border-editorial-dark/10 p-5 rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-serif font-medium text-editorial-dark uppercase tracking-wider text-xs">Share Your Experience</h5>
                    <button
                      type="button"
                      onClick={() => setShowAddReview(false)}
                      className="text-editorial-gray hover:text-editorial-dark text-[10px] uppercase tracking-wider font-medium"
                    >
                      Cancel
                    </button>
                  </div>

                  {formError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm font-medium">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Guest Name */}
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-editorial-gray mb-1 font-medium">Full Name</label>
                      <input
                        id="review-form-name"
                        type="text"
                        placeholder="e.g. Alexander Hamilton"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark"
                      />
                    </div>
                    {/* Star Rating */}
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-editorial-gray mb-1 font-medium">Rating</label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            id={`rating-star-btn-${star}`}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1 focus:outline-none"
                          >
                            <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current text-editorial-dark' : 'text-editorial-gray/30'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-editorial-gray mb-1 font-medium">Review Title</label>
                    <input
                      id="review-form-title"
                      type="text"
                      placeholder="e.g., Unforgettable hospitality, beautifully styled rooms!"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark"
                    />
                  </div>

                  {/* Review Comments */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-editorial-gray mb-1 font-medium">Detailed Feedback</label>
                    <textarea
                      id="review-form-comment"
                      rows={3}
                      placeholder="Tell future guests about the amenities, views, service and bed comfort..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-editorial-cream border border-editorial-dark/15 rounded-sm text-xs focus:border-editorial-dark focus:outline-none text-editorial-dark"
                    />
                  </div>

                  <button
                    id="submit-review-btn"
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-editorial-dark hover:bg-editorial-dark/90 text-editorial-cream font-medium text-[10px] uppercase tracking-[0.15em] rounded-sm transition-all"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {suiteReviews.length === 0 ? (
                  <div className="text-center py-8 text-editorial-gray font-light text-sm">
                    No reviews submitted yet for this suite. Be the first to review!
                  </div>
                ) : (
                  suiteReviews.map((r) => (
                    <div key={r.id} className="bg-editorial-sand/50 p-4 rounded-sm border border-editorial-dark/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-editorial-dark">{r.userName}</span>
                        <span className="text-editorial-gray text-[10px] font-light">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-editorial-dark">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-current text-editorial-dark' : 'text-editorial-gray/30'}`} />
                          ))}
                        </div>
                        {r.title && <span className="text-xs font-medium text-editorial-dark ml-1.5 font-serif">{r.title}</span>}
                      </div>
                      <p className="text-editorial-dark/85 text-xs sm:text-sm font-light leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Area with Price and Booking Trigger */}
        <div className="bg-editorial-sand border-t border-editorial-dark/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          <div>
            <span className="text-editorial-gray text-[10px] uppercase tracking-wider font-light">Starting rate at</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-serif font-medium text-editorial-dark">${suite.pricePerNight}</span>
              <span className="text-editorial-gray text-[11px] uppercase tracking-wide font-light">/ night</span>
            </div>
          </div>
          <button
            id="book-from-details-btn"
            onClick={() => onBook(suite)}
            className="w-full sm:w-auto px-8 py-3 bg-editorial-dark hover:bg-editorial-dark/95 text-editorial-cream font-medium uppercase tracking-[0.15em] text-[11px] rounded-sm transition-all cursor-pointer"
          >
            Book This Suite
          </button>
        </div>
      </div>
    </div>
  );
}
