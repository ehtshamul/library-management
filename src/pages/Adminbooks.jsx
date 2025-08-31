import React, { useState, useEffect } from "react";
import { Trash2, Eye, Star } from "lucide-react";
import { ApprovedAdmin, getAllreviews } from "../store/reviewSlice";
import { useDispatch, useSelector } from "react-redux";

const AdminRevbooks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const safeLower = (s) => (s ? String(s).toLowerCase() : "");
  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  // Fetch all reviews
  useEffect(() => {
    let mounted = true;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const reviewsArray = await dispatch(getAllreviews()).unwrap();
        if (!mounted) return;
        setReviews(reviewsArray);
        console.log("Fetched reviews:", reviewsArray);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        if (mounted) setError("Failed to load reviews");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReviews();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  // Delete review locally
  const deleteReview = (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews((prev) => prev.filter((review) => review._id !== id));
    }
  };

  // Update review status (call backend + update UI)
  const updateStatus = async (id, newStatus) => {
    try {
      await dispatch(ApprovedAdmin({ id, status: newStatus })).unwrap();
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const viewReview = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (safeLower(status)) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < (rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));

  const countByStatus = (status) =>
    reviews.filter((r) => safeLower(r.status) === safeLower(status)).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-2">Manage and moderate book reviews</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">{countByStatus("Approved")}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{countByStatus("Pending")}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-red-600">{countByStatus("Flagged")}</div>
            <div className="text-sm text-gray-600">Flagged</div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading reviews...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : reviews.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No reviews found</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book & User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {review.bookID?.title || "Unknown Book"}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {review.userID?.name || "Unknown"}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-1">({review.rating ?? 0})</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{review.comment || "—"}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={review.status || "Pending"}
                          onChange={(e) => updateStatus(review._id, e.target.value)}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-none ${getStatusColor(review.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Flagged">Flagged</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewReview(review)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteReview(review._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Review Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                    <p className="text-gray-900">
                      {selectedReview.bookID?.title || "Unknown Book"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer</label>
                    <p className="text-gray-900">{selectedReview.userID?.name || "Unknown"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedReview.rating)}
                      <span className="text-gray-600">({selectedReview.rating ?? 0}/5)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedReview.comment || "—"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          selectedReview.status
                        )}`}
                      >
                        {selectedReview.status || "Pending"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <p className="text-gray-900">{formatDate(selectedReview.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      deleteReview(selectedReview._id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRevbooks;
