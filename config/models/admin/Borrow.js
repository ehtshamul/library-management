const mongoose= require("mongoose");


const BorrowSchema =new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    book:{type:mongoose.Schema.Types.ObjectId,ref:"Book",required:true},
    borrow:{type:Date,default:Date.now,required:true},
    duedate:{type:Date,required:true},
    returned:{type:Boolean,default:false}

});
module.exports = mongoose.model("Borrow", BorrowSchema);
