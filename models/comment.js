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
      minLength : 1,
      maxLength : 500,
      trim : true
   },
   likes : [{ type : mongoose.Schema.Types.ObjectId, ref : "Like" }]
}, { timestamps : true });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;