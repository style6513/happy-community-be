const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
   },
   commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
   }
},
   { timestamps: true }
);
LikeSchema.index({ postId: 1, commentId: 1 }, { unique: true })
const Like = mongoose.model("Like", LikeSchema);

module.exports = Like;