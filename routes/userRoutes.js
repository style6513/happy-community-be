const router = require("express").Router();
const userController = require("../controllers/userController");

router
  .route("/:id")
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)

router
  .route("/friends/:userId")
    .get(userController.getFriends)

router
  .route("/:id/follow")
    .put(userController.followUser);
    
router
  .route("/:id/unfollow")
    .put(userController.followUser)

module.exports = router;