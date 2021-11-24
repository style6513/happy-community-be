const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
   userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required : true
   },
   desc : {
      type : String,
      max : 500,
      trim : true
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

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;