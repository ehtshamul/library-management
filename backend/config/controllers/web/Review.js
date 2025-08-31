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
    // Allow delete if user is owner or has Admin role
    const ownerId = reviewToDelete.userID?._id || reviewToDelete.userID;
    const requesterId = req.user.id;
    const isOwner = ownerId && requesterId && ownerId.toString() === requesterId.toString();
    const isAdmin = req.user.role && req.user.role.toLowerCase() === "admin";

    if (!isOwner && !isAdmin) {
      console.log("Delete forbidden - owner:", ownerId, "requester:", requesterId, "role:", req.user.role);
      return res.status(403).json({ message: "Cannot delete" });
    }

    await reviewToDelete.deleteOne();
    res.json({ message: "Deleted successfully", review: reviewToDelete });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Approved Reviews for Book
const getApproved = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Normalize input (e.g. Approved, Rejected, Pending)
    const normalizedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    // Update review status
    const reviewDoc = await review.findByIdAndUpdate(
      req.params.id,
      { status: normalizedStatus },
      { new: true } // return updated document
    ).populate("userID", "name");

    if (!reviewDoc) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      review: reviewDoc,
      message: `Review status updated to ${normalizedStatus}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Approved Reviews for Book
const showview = async (req, res) => {
  try {
    const reviews = await review.find({ bookID: req.params.id, status: "Approved" }).populate("userID", "name")
      .select("rating comment createdAt");
    res.status(200).json({ reviews, message: "success" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });

  }
}

// get all books for admin view 
const getAllreviews =async (req,res)=>{
  try{
    const reviews = await review.find().populate("userID","name")
    .populate("bookID","title author")
    .select("rating comment status createdAt")
    ;
    res.status(200).json({reviews,message:"success"});
  }catch(error){
    res.status(500).json({message:"Server error",error:error.message});
    console.log(error);
    console.log("Error fetching all reviews:", error);
  }
}




module.exports = { addReview, delreview, getApproved, showview ,getAllreviews};
