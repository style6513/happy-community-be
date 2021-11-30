const Comment = require("../models/Comment");
const Like = require("../models/Like");
const { ExpressError } = require("../utils/ExpressError");

exports.createComment = async (req, res, next) => {
  try {
    const newComment = await Comment.create({
      userId: req.user.id,
      postId: req.params.postId,
      text: req.body.text,
    });
    return res.status(200).json(newComment);
  } catch (e) {
    return next(e);
  }
};

exports.getAllCommentsForPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId : req.params.postId })  
    return res.status(200).json(comments);
  } 
  catch (e) {
    return next(e);
  }
};

exports.getAComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    return res.status(200).json(comment);
  } catch(e) {
    return next(e);
  }
}

exports.deleteComment = async (req, res, next) => {
  try {
    const doc = await Comment.findByIdAndDelete(req.params.commentId);
    if(!doc) return next(new ExpressError("comment does not exist", 404));
    return res.status(200).json({ deleted : req.params.commentId });
  } catch(e) {
    return next(e);
  }
}

exports.toggleLikeComment = async (req, res, next) => {

}