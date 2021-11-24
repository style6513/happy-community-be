const router = require("express").Router();

const postController = require("../controllers/postController");

router
   .route("/")
   .post(postController.createPost);

router
   .route("/:id")
   .put(postController.updatePost)
   .delete(postController.deletePost)
   .get(postController.getAPost)

router
   .route("/:id/like")
   .put(postController.likePost)

router
   .route("/profile/:username")
   .get(postController.getUserPosts);

module.exports = router;