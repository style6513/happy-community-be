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
   imgs : [{  type : String, }], 
   likes : [{ type : mongoose.Schema.Types.ObjectId, ref : "Like" }],
   comments : [{ type : mongoose.Schema.Types.ObjectId, ref : "Comment" }],
   hashtags : [{ type : String }] // max 3
}, 
   { 
      toJSON : { virtuals : true },
      toObject : { virtuals : true },
      timestamps : true 
   }
);

// PostSchema.virtual("likes", {
//    ref : "Like",
//    foreignField : "postId",
//    localField : "_id"
// })
PostSchema.pre(/^find/, function(next) {
   this.start = Date.now();
   next();
})

PostSchema.pre(/^find/, function(docs, next) {
   this.populate({
      path : "comments",
      select : "-__v -postId"
   }).populate({
      path : "likes",
      select : "userId"
   });
   return next();
})

PostSchema.post(/^find/, function(docs, next) {
   console.log(`Query took ${Date.now() - this.start} milliseconds`);
   console.log(docs);
   next();
})

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;