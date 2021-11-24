const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
   userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required : true
   },
   desc : {
      type : String,
      max : 500
   },
   imgs : {
      type : Array,
      default : []
   },
   likes : [{ type : mongoose.Schema.Types.ObjectId, ref : "Like" }],
   comments : [{ type : mongoose.Schema.Types.ObjectId, ref : "Comment" }],
}, 
   { timestamps : true }
);

const LikeSchema = new mongoose.Schema({
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
}, { timestamps : true });

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
      max : 500
   },
}, { timestamps : true });

const Like = mongoose.model("Like", LikeSchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Post = mongoose.model("Post", PostSchema);
module.exports = { Like, Comment, Post};