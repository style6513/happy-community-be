const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Post",
    required : [true, "can't be blank"]
  },
  userId : { 
    type : String,
    required : [true, "can't be blank"]
  },
  text : {
    type : String,
    min : 1,
    max : 500
  },
}, {
  timestamps : true
})

module.exports = mongoose.model("Comment", CommentSchema);