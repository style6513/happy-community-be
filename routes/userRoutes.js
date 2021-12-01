const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  ensureCorrectUserOrAdmin,
  ensureLoggedInAndNotExpired
} = require("../middlewares/authMiddlewares");

router.get("/friends/:userId", userController.getFriends);
router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updateMe", upload.single("photo"), userController.updateUser)


router.use(ensureLoggedInAndNotExpired);

router
  .route("/:id")
  .get(userController.getUser)
  .put(
    ensureCorrectUserOrAdmin,
    userController.updateUser
  )
  .delete(
    ensureCorrectUserOrAdmin,
    userController.deleteUser
  )


router
  .route("/:id/follow")
  .put(userController.followUser);
    
router
  .route("/:id/unfollow")
  .put(userController.followUser)

module.exports = router;