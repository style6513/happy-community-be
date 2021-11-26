const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  ensureCorrectUserOrAdmin,
  ensureLoggedInAndNotExpired
} = require("../middlewares/authMiddlewares");

router.post("/forgotPassword", authController.forgotPassword)

router
  .route("/:id")
    .get(userController.getUser)
    .put(
      ensureLoggedInAndNotExpired,
      ensureCorrectUserOrAdmin,
      userController.updateUser
    )
    .delete(
      ensureLoggedInAndNotExpired,
      ensureCorrectUserOrAdmin,
      userController.deleteUser
    )

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