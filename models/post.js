const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
   userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required : true
   },
   desc : {
      type : String,
      minLength : 1,
      maxlength : 500,
      trim : true
   },
   imgs : [{ 
      type : String, 
      match : [] //7 max per post
   }], 
   likes : [{ type : mongoose.Schema.Types.ObjectId, ref : "Like" }],
   comments : [{ type : mongoose.Schema.Types.ObjectId, ref : "Comment" }],
   hashtags : [{ type : String }] // max 3
}, 
   { timestamps : true }
);

PostSchema.pre(/^find/, function(next) {
   this.start = Date.now();
   next();
})

PostSchema.post(/^find/, function(docs, next) {
   console.log(`Query took ${Date.now() - this.start} milliseconds`);
   console.log(docs);
   next();
})

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;