const router = require("express").Router({ mergeParams: true });
const authMiddlewares = require("../middlewares/authMiddlewares");
const commentController = require("../controllers/commentController");

// posts/:postId/comments
router
  .route("/")
  .get(commentController.getAllCommentsForPost)
  .post(
    authMiddlewares.ensureLoggedInAndNotExpired,
    commentController.createComment
  );

// posts/:postId/comments/:commentId
router
  .route("/:commentId")
  .get(commentController.getAComment)
  .delete(
    authMiddlewares.ensureLoggedInAndNotExpired,
    authMiddlewares.checkCommentOwnership,
    commentController.deleteComment
  )


// posts/:postId/comments/:commentId/likes
router
  .route("/:commentId/likes")
  .put(
    authMiddlewares.ensureLoggedInAndNotExpired,
  )


module.exports = router;
