const router = require("express").Router();
const authMiddlewares = require("../middlewares/authMiddlewares");
const postController = require("../controllers/postController");
const commentRouter = require("./commentRoutes");

// posts/:postId/comments will use commentRoutes
router.use("/:postId/comments", commentRouter);

// GET posts/now-trending
router
   .route("/now-trending")
   .get(postController.getNowTrendingPosts);

// posts/
router
   .route("/")
   .get(postController.getAllPosts)
   .post(
      authMiddlewares.ensureLoggedInAndNotExpired,
      postController.createPost
   );

// posts/:postId
router
   .route("/:postId")
   .put(postController.updatePost)
   .delete(postController.deletePost)
   .get(postController.getAPost)

router
   .route("/:postId/like")
   .put(postController.likePost)

router
   .route("/profile/:username")
   .get(postController.getUserPosts);

module.exports = router;