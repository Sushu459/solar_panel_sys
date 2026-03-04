import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useData } from '../../contexts/DataContext';
import type { Review } from '../../types';

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-lime-400 text-lime-400'
              : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-lime-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all h-full flex flex-col">
      {/* Quote Icon */}
      <Quote className="w-8 h-8 text-emerald-300 mb-4" />

      {/* Rating */}
      <StarRating rating={review.rating} />

      {/* Comment */}
      <p className="text-slate-600 font-medium mt-4 mb-6 flex-1 line-clamp-4">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-lime-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center text-white font-bold">
          {review.reviewer_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-slate-800">{review.reviewer_name}</div>
          {review.project && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              {review.project.city}
            </div>
          )}
        </div>
      </div>

      {/* Admin Response */}
      {review.admin_response && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="text-xs text-emerald-600 font-bold mb-1">Response from Ever Green Solar:</div>
          <p className="text-sm text-slate-600">{review.admin_response}</p>
        </div>
      )}
    </div>
  );
}

export default function ReviewsSection() {
  const { approvedReviews, fetchApprovedReviews } = useData();
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;

  useEffect(() => {
    fetchApprovedReviews();
  }, [fetchApprovedReviews]);

  const totalPages = Math.ceil(approvedReviews.length / reviewsPerPage);
  const currentReviews = approvedReviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (approvedReviews.length === 0) {
    return null;
  }

  // Calculate average rating
  const averageRating =
    approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-white via-emerald-50/30 to-lime-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500">Clients Say</span>
            </h2>
            <p className="text-slate-600 font-medium max-w-xl">
              Real stories from real customers who have transformed their energy consumption
            </p>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-lime-100 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500">out of 5</div>
            </div>
            <div className="border-l border-lime-100 pl-4">
              <StarRating rating={Math.round(averageRating)} />
              <div className="text-sm text-slate-500 mt-1">
                {approvedReviews.length} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevPage}
              className="p-2 rounded-full bg-emerald-50 text-slate-500 hover:bg-emerald-100 hover:text-slate-700 transition-colors border border-lime-200"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentPage ? 'bg-emerald-500' : 'bg-lime-200'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextPage}
              className="p-2 rounded-full bg-emerald-50 text-slate-500 hover:bg-emerald-100 hover:text-slate-700 transition-colors border border-lime-200"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/contact">
            <Button
              className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 rounded-full px-8 py-6 font-bold shadow-lg shadow-emerald-500/20 border-0"
            >
              Share Your Experience
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
