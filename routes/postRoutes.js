const router = require("express").Router();
const { ensureLoggedInAndNotExpired, verifyPostOwnership } = require("../middlewares/authMiddlewares");
const { getUserPosts, getNowTrendingPosts, getAllPosts, createPost, updatePost, deletePost, getAPost, likePost } = require("../controllers/postController");
const commentRouter = require("./commentRoutes");

// posts/:postId/comments will use commentRoutes
router.use("/:postId/comments", commentRouter);
router.get("/profile/:username", getUserPosts);

// GET posts/now-trending
router
   .route("/now-trending")
   .get(getNowTrendingPosts);

// posts/
router
   .route("/")
   .get(getAllPosts)
   .post(
      ensureLoggedInAndNotExpired,
      createPost
   );

// posts/:postId
router
   .route("/:postId")
   .put(
      ensureLoggedInAndNotExpired,
      verifyPostOwnership,
      updatePost
   )
   .delete(ensureLoggedInAndNotExpired, verifyPostOwnership, deletePost)
   .get(getAPost)

router
   .route("/:postId/like")
   .put(ensureLoggedInAndNotExpired, likePost)



module.exports = router;