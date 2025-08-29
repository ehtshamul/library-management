const { get } = require("http");
const {addReview ,delreview,showview,adminview ,admindelete}=require("../../controllers/web/Review");
const {auth}=require("../../middleware/auth");
const express=require("express");
const router=express.Router();

// Route to add a review for a book
router.post("/add",auth(["User", 'user']) ,addReview);
// delete review
router.delete("/:id",auth(["User", 'user']) ,delreview);

router.get("/show/:id",showview);
// get show  for dashboard reviews
router.get("/admin",auth(["Admin", "admin"]),adminview);

router.delete("/admin/:id",auth(["Admin", "admin"]),admindelete);



 






module.exports=router;