const { get } = require("http");
const {addReview ,delreview,getApproved,showview }=require("../../controllers/web/Review");
const {auth}=require("../../middleware/auth");
const express=require("express");
const router=express.Router();

// Route to add a review for a book
router.post("/add",auth(["User", 'user']) ,addReview);
// delete review
router.delete("/:id",auth(["User", 'user']) ,delreview);
// get approved admin 
router.patch("/approved/:id",auth(["Admin","admin"]), getApproved)
// get show approve reviews
router.get("/show/:id",showview);







module.exports=router;