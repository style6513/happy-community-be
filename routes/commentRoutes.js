const router = require("express").Router({ mergeParams: true });
const { ensureLoggedInAndNotExpired, checkCommentOwnership } = require("../middlewares/authMiddlewares");
const { getAllCommentsForPost, getAComment, deleteComment, toggleLikeComment } = require("../controllers/commentController");

// posts/:postId/comments
router
  .route("/")
  .get(getAllCommentsForPost)
  .post(
    ensureLoggedInAndNotExpired,
    createComment
  );

// posts/:postId/comments/:commentId
router
  .route("/:commentId")
  .get(getAComment)
  .delete(
    ensureLoggedInAndNotExpired,
    checkCommentOwnership,
    deleteComment
  )


// posts/:postId/comments/:commentId/likes
router
  .route("/:commentId/likes")
  .put(
    ensureLoggedInAndNotExpired,
    toggleLikeComment
  )


module.exports = router;
