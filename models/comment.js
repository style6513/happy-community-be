const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
   userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required : true
   },
   postId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post",
      required : true
   },
   text : {
      type : String,
      required : true,
      min : 1,
      max : 500,
      trim : true
   },
}, { timestamps : true });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;