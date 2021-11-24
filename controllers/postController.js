// const router = require("express").Router();
const User = require("../models/User");
const  Post  = require("../models/Post");
const { UnauthorizedError } = require("../ExpressError");
// const { ensureLoggedIn } = require("../middlewares/authMiddlewares");

exports.getAllPosts = async (req, res, next) => {
   try {
      // build query
      const queryObj = { ...req.query }
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(ele => delete queryObj[ele]);

      // localhost:9000/posts?desc=something&duration[gte]=5
      // { desc : "something", duration : { $gte : 5 } }
      // gte, te, lte, lt
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
      console.log(JSON.parse(queryStr))
      let query = Post.find(JSON.parse(queryStr))

      // sorting query
      if(req.query.sort) {
         const sortBy = req.query.sort.split(",").join(" ")
         query = query.sort(sortBy)
      }

      // field limiting 
      if(req.query.fields) {
         const fields = req.query.fields.split(",").join(" ");
         query = query.select(fields);
      } else {
         query = query.select("-__v")
      }

      //pagination
      // localhost:9000/posts?page=2&limit=10
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit

      query = query.skip(skip).limit(limit);

      if(req.query.page) {
         const numDocs = await Post.countDocuments();
         if(skip >= numDocs) throw new Error("This apge does not exist")
      }

      const posts = await query;
      return res.status(200).json(posts)
   } 
   catch(e) {
      return next(e);
   }
}

exports.createPost = async (req, res, next) => {
   const newPost = new Post(req.body);
   try {
      const savedPost = await newPost.save();
      return res.status(200).json(savedPost);
   } catch(e) {
      return next(e);
   }
}

exports.updatePost = async (req, res, next) => {
   const post = await Post.findById(req.params.id);
   try {
      if(post.userId === req.body.userId) { 
         await post.updateOne({ $set : req.body });
         return res.status(200).json("the post has been updated")
      } else {
         return next(new UnauthorizedError())
      }
   } catch(e) {
      return next(e);
   }
}

exports.deletePost = async (req, res, next) => {
   try { 
      const post = await Post.findById(req.params.id);
      if(post.userId === req.body.userId) { 
         await post.deleteOne();
         return res.status(204).json("the post has been deleted")
      } else {
         return next(new UnauthorizedError())
      }
   } catch(e) {
      return next(e);
   }
}

exports.likePost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);
      if(!post.likes.includes(req.body.userId)) {
         await post.updateOne({ $push : { likes : req.body.userId }});
         return res.status(200).json("the post has been liked")
      } else {
         await post.updateOne({ $pull : { likes : req.body.userId }});
         return res.status(200).json("the post has been disliked")
      }
   } catch(e) {
      return next(e);
   }
}

exports.getAPost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);
      return res.status(200).json(post)
   } catch(e) {
      return next(e);
   }
}

exports.getUserPosts = async (req, res, next) => {
   try {
      const user = await User.findOne({ username : req.params.username });
      const posts = await Post.find({ userId : user._id });
      return res.status(200).json(posts)
   } catch(e) {
      return next(e);
   }
}

// // create a post
// router.post("/", ensureLoggedIn, async (req, res, next) => {
//    const newPost = new Post(req.body);
//    try {
//       const savedPost = await newPost.save();
//       return res.status(200).json(savedPost);
//    } catch(e) {
//       return next(e);
//    }
// });

// // update a post
// router.put("/:id", ensureLoggedIn,async (req, res, next) => {
//    try {
//       const post = await Post.findById(req.params.id);
//       if(post.userId === req.body.userId) { 
//          await post.updateOne({ $set : req.body });
//          return res.status(200).json("the post has been updated")
//       } else {
//          return next(new UnauthorizedError())
//       }
//    } catch(e) {
//       return next(e);
//    }
// });

// // delete a post
// router.delete("/:id", ensureLoggedIn, async (req, res, next) => {
//    try { 
//       const post = await Post.findById(req.params.id);
//       if(post.userId === req.body.userId) { 
//          await post.deleteOne();
//          return res.status(200).json("the post has been deleted")
//       } else {
//          return next(new UnauthorizedError())
//       }
//    } catch(e) {
//       return next(e);
//    }
// })

// // like/dislike a post
// router.put("/:id/like", async (req, res, next) => {
//    try {
//       const post = await Post.findById(req.params.id);
//       if(!post.likes.includes(req.body.userId)) {
//          await post.updateOne({ $push : { likes : req.body.userId }});
//          return res.status(200).json("the post has been liked")
//       } else {
//          await post.updateOne({ $pull : { likes : req.body.userId }});
//          return res.status(200).json("the post has been disliked")
//       }
//    } catch(e) {
//       return next(e);
//    }
// });

// // get a post
// router.get("/:id", async (req, res, next) => {
//    try {
//       const post = await Post.findById(req.params.id);
//       return res.status(200).json(post)
//    } catch(e) {
//       return next(e);
//    }
// })


// // get user's all posts
// router.get("/profile/:username", async (req, res, next) => {
//    try {
//       const user = await User.findOne({ username : req.params.username });
//       const posts = await Post.find({ userId : user._id });
//       return res.status(200).json(posts)
//    } catch(e) {
//       return next(e);
//    }
// });


// module.exports = router;