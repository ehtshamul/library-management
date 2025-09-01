const mongoose=require("mongoose");
const Schema=mongoose.Schema;
// Review schema definition
const review= new Schema({
    bookID:{type:Schema.Types.ObjectId,ref:"Book",required:true},
    userID:{type:Schema.Types.ObjectId,ref:"User",required:true},
    rating:{type:Number,required:true,min:1,max:5},
    comment:{type:String,trim:true},
    status:{type:String,enum:["Pending","Approved","Flagged"],default:"Pending"},


 },{ timestamps: true });
 module.exports=mongoose.model("Review",review);




