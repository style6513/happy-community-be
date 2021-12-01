const router = require("express").Router();
const authController = require("../controllers/authController");

// router.post("/auth/register")
router
   .route("/register")
   .post(authController.register);

router
   .route("/login")
   .post(authController.login);

module.exports = router;