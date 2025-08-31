import { Star, User, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { showReview, deletereview } from "../store/reviewSlice";

export default function ReviewsDisplay({ BookID }) {
  const dispatch = useDispatch();
  const { reviews, status, error } = useSelector((state) => state.reviews);
  const auth = useSelector((state) => state.auth);
  const [deletingId, setDeletingId] = useState(null);

  const loading = status === "loading";

  useEffect(() => {
    if (BookID) {
      dispatch(showReview(BookID));
    }
  }, [dispatch, BookID]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setDeletingId(reviewId);
      await dispatch(deletereview(reviewId)).unwrap();

      // refresh list from server to get consistent populated data
      try {
        await dispatch(showReview(BookID));
      } catch (e) {
        console.warn('Failed to refresh reviews after delete', e);
      }

      // Redux state میں سے فوراً remove کریں
      dispatch(showReview(BookID)); // یا اگر slice میں delete کی action ہے تو اسے کال کریں
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setDeletingId(null);
    }
  };
  

  const StarRating = ({ rating = 0 }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating})</span>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
        <p className="text-red-500">
          Failed to load reviews:{" "}
          {typeof error === "object" ? error?.message ?? JSON.stringify(error) : error}
        </p>
      </div>
    );
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Customer Reviews ({reviews.length})
      </h3>

      {reviews.map((review, index) => {
  const ownerId = review.userID?._id || review.userID?.id || review.userID || null;
  const currentUserId = auth.user?._id || auth.user?.id || null;
  const isOwner = ownerId && currentUserId && ownerId.toString() === currentUserId.toString();

  return (
    <div
      key={review._id || index}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>

          <div>
            <p className="font-medium text-gray-900">
              {review.userID?.name || "Anonymous"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString()
                : "Unknown date"}
            </div>
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <StarRating rating={review.rating || 0} />

      {/* Review Comment */}
      <p className="text-gray-700 leading-relaxed mt-3">
        {review.comment || "No comment"}
      </p>

      {/* Delete Button */}
      {isOwner && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleDelete(review._id || review.id)}
            disabled={deletingId === (review._id || review.id)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deletingId === (review._id || review.id) ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      )}
    </div>
  );
})}
    </div>
  );
}