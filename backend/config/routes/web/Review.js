const { get } = require("http");
const { addReview, delreview, getApproved, showview } = require("../../controllers/web/Review");
const { auth } = require("../../middleware/auth");
const express = require("express");
const router = express.Router();

// Route to add a review for a book (any authenticated user)
router.post("/add", auth(["user","User"]), addReview);
// delete review
// allow any authenticated user; controller will enforce owner-or-admin logic
router.delete("/:id", auth(["user", "User"]), delreview);
// get approved admin 
router.patch("/approved/:id", auth(["Admin", "admin"]), getApproved)
// get show approve reviews
router.get("/show/:id", showview);







module.exports = router;