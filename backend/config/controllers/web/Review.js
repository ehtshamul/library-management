const review = require("../../models/admin/review");

// Add review for books
const addReview = async (req, res) => {
  const { bookID, rating, comment } = req.body;
  try {
    const exists = await review.findOne({ bookID, userID: req.user.id });
    if (exists) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book" });
    }

    const newReview = new review({
      bookID,
      userID: req.user.id, // ✅ use req.user.id from your auth middleware
      rating,
      comment,
    });

    await newReview.save();
    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Own Review
// Delete Own Review
const delreview = async (req, res) => {
  try {
    const reviewToDelete = await review.findById(req.params.id);
    if (!reviewToDelete) return res.status(404).json({ message: "Not found" });

    // Check if the logged-in user is the owner
    if (reviewToDelete.userID.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Cannot delete" });

    await reviewToDelete.deleteOne();
    res.json({ message: "Deleted successfully", review: reviewToDelete });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get Approved Reviews for Book
const showview = async (req, res) => {
  try {
    // include userID so frontend can check ownership (populate user name and id)
    const reviews = await review
      .find({ bookID: req.params.id, status: "Approved" })
      .populate("userID", "name")
      .select("rating comment createdAt userID");
    res.status(200).json({ reviews, message: "success" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });

  }
}
//  get show  for dashboard reviews  
const adminview = async (req, res) => {
  try {
    const reviews= await review.find().populate("userID", "name").populate("bookID", "title").select("rating comment status createdAt userID bookID");
    res.status(200).json({ reviews, message: "success" });



    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });

  }
}




module.exports = { addReview, delreview, adminview, showview };
