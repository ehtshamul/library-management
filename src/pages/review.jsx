import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addReview } from '../store/reviewSlice';

export default function BookReviewForm({ BookID }) {
    const [formData, setFormData] = useState({
        bookID: BookID || '',
        rating: 0,
        comment: ''
    });
    const [error, setError] = useState(null);
    const Dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const { user } = useSelector((state) => state.auth);


    const handleSubmit = async () => {
        setError(null);

        if (!auth?.user) {
            setError('You must be logged in to submit a review.');
            return;
        }


        if (!formData.bookID || !formData.rating || !formData.comment.trim()) {
            setError('Please provide rating and a short comment.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = await Dispatch(
                addReview({ ...formData, userID: auth.user.id })
            ).unwrap();

            // Re-fetch reviews so we get populated user data and consistent shape
            try {
                await Dispatch(require('../store/reviewSlice').showReview(formData.bookID));
            } catch (e) {
                // ignore fetch error here; UI will update on next load
            }

            setFormData((prev) => ({ ...prev, rating: 0, comment: '' }));
            setHoverRating(0);
            setError(null);

        } catch (err) {

            let message = 'Failed to submit review';
            try {
                if (typeof err === 'string') {
                    message = err;
                } else if (err?.message) {
                    message = err.message;
                } else if (err?.data) {
                    if (typeof err.data === 'string') message = err.data;
                    else if (err.data.message) message = err.data.message;
                    else message = JSON.stringify(err.data);
                } else {
                    message = JSON.stringify(err);
                }
            } catch (e) {
                message = String(err);
            }
            console.error('addReview error', err);
            setError(message);
        } finally {
            setIsSubmitting(false);

        }
    };



    useEffect(() => {
        if (BookID) setFormData((prev) => ({ ...prev, bookID: BookID }));
    }, [BookID]);

    const StarRating = () => (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-all duration-200 hover:scale-110"
                >
                    <Star
                        className={`w-5 h-5 transition-colors duration-200 ${star <= (hoverRating || formData.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 hover:text-amber-200'
                            }`}
                    />
                </button>
            ))}
            {formData.rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                    {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                </span>
            )}
        </div>
    );

    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                <p className="text-sm text-gray-600 mt-1">Share your experience with this book</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
                {/* Rating */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Rating
                    </label>
                    <StarRating />
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MessageCircle className="w-4 h-4" />
                        Your Review
                    </label>
                    <textarea
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none resize-none text-sm"
                        placeholder="What did you think about this book?"
                        maxLength={500}
                        required
                    />
                    <div className="text-right text-xs text-gray-500">
                        {formData.comment.length}/500
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                        {typeof error === 'object'
                            ? (error?.message ?? JSON.stringify(error))
                            : error}
                    </div>
                )}


                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!formData.rating || !formData.comment.trim() || isSubmitting}
                    className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                >
                    {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Submit Review
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}