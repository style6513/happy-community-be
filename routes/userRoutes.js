const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  ensureCorrectUserOrAdmin,
  ensureLoggedInAndNotExpired
} = require("../middlewares/authMiddlewares");

router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword);

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
    .put(
      ensureLoggedInAndNotExpired,
      userController.followUser
    );
    
router
  .route("/:id/unfollow")
    .put(
      ensureLoggedInAndNotExpired,
      userController.followUser
    )

module.exports = router;