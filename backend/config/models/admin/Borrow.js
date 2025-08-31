
const mongoose =require("mongoose");

const borrowSchema= new mongoose.Schema({
    Bookid:{type :mongoose.Schema.Types.ObjectId,ref :"Book",required:true},
    Userid:{type :mongoose.Schema. Types.ObjectId,ref :"User",required:true},
    borrowdate:{type:Date,default :Date.now},
    duedate:{type:Date,required:true},
    return:{type:Boolean,default:false},

})

module.exports=mongoose.model("Borrow",borrowSchema);