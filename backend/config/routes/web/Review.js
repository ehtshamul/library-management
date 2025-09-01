const { get } = require("http");
const { addReview, delreview, getApproved, showview ,getAllreviews} = require("../../controllers/web/Review");
const { auth } = require("../../middleware/auth");
const express = require("express");
const router = express.Router();

// Route to add a review for a book (any authenticated user)
router.post("/add", auth(["user","User"]), addReview);
// delete review
// allow any authenticated user; controller will enforce owner-or-admin logic


// get show all book admin 
router.get("/getalls",  auth (["admin","Admin"]),getAllreviews);


router.delete("/:id", auth(["user", "User"]), delreview);
// get approved admin 
router.patch("/approved/:id", auth(["Admin", "admin"]), getApproved)
// get show approve reviews
router.get("/show/:id",  showview);







module.exports = router;