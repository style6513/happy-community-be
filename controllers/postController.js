const User = require("../models/User");
const Post = require("../models/Post");
const APIFeatures = require("../utils/apiFeatures");
const { UnauthorizedError, NotFoundError, BadRequestError } = require("../utils/ExpressError");
const Like = require("../models/Like");

exports.getNowTrendingPosts = async (req, res, next) => {
   try {
      // ranking = (numberOfComments * commentsWeight + numberOfLikes * likesWeight) / (daysSincePost * gravity)
      // gravity 0.2
      // commentsWeight 2
      // likesWeight 1
      const trendingPostAggregate = [
         {
            $addFields : {
               numComments: { $size: "$comments" },
               numLikes: { $size: "$likes" },
               divideBy: { $multiply: [ { $subtract: ["$$NOW", "$createdAt"] } , 0.2] }
            }
         },
         {
            $set: {
               ranking: {
                  $divide: [
                     {
                        $add: [
                           { $multiply: ["$numComments", 2] },
                           { $multiply: ["$numLikes", 1] }
                        ]
                     },
                     "$divideBy"
                  ],
               }
            }
         },
         {
            $sort : { ranking : -1 }
         }
      ]
      const nowTrending = await Post.aggregate(trendingPostAggregate);
      return res.status(200).json(nowTrending)
   } catch (e) {
      return next(e);
   }
}

exports.getAllPosts = async (req, res, next) => {
   try {
      const features = new APIFeatures(Post.find(), req.query)
         .filter()
         .sort()
         .limitFields()
         .paginate();
      const posts = await features.query;
      return res.status(200).json(posts)
   }
   catch (e) {
      return next(e);
   }
}

exports.createPost = async (req, res, next) => {
   const newPost = new Post(req.body);
   try {
      const savedPost = await newPost.save();
      if(!savedPost) return next(new BadRequestError())
      return res.status(200).json(savedPost);
   } catch (e) {
      return next(e);
   }
}

exports.updatePost = async (req, res, next) => {
   const _post = await Post.findById(req.params.id);
   try {
      if (_post.userId === req.body.userId) {
         const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
         return res.status(200).json(post)
      } else {
         return next(new UnauthorizedError())
      }
   } catch (e) {
      return next(e);
   }
}

exports.deletePost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
         await post.deleteOne();
         return res.status(204).json("the post has been deleted")
      } else {
         return next(new UnauthorizedError())
      }
   } catch (e) {
      return next(e);
   }
}

exports.likePost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
         const _newLike = new Like({ userId: req.body.userId, postId: req.params.id });
         const newLike = await _newLike.save();

         await Post.findByIdAndUpdate(req.params.id, { $addToSet: { likes: newLike._id } }, { returnOriginal: false });
         return res.status(200).json("the post has been liked")
      } else {
         await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: req.body.userId } });
         return res.status(200).json("the post has been disliked")
      }
   } catch (e) {
      return next(e);
   }
}

exports.getAPost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);
      if(!post) return next(new NotFoundError(`Can't find ${req.originalUrl}`))
      return res.status(200).json(post)
   } catch (e) {
      return next(e);
   }
}

exports.getUserPosts = async (req, res, next) => {
   try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      return res.status(200).json(posts)
   } catch (e) {
      return next(e);
   }
}
