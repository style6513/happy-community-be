const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { BCRYPT_WORK_FACTOR } = require("../config");
const {
  ensureCorrectUserOrAdmin,
  ensureLoggedIn,
} = require("../middlewares/authMiddlewares");

// Update user
// PUT /users/:id
router.put("/:id", ensureCorrectUserOrAdmin, async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(
      req.body.password,
      BCRYPT_WORK_FACTOR
    );
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnOriginal : false}
    )
    return res.status(200).json({ updatedUser });
  } catch (e) {
    return next(e);
  }
});

// DELETE USER
router.delete("/:id", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ deleted: req.params.id });
  } catch (e) {
    return next(e);
  }
});

// GET USER
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json({ user: others });
  } catch (e) {
    return next(e);
  }
});
module.exports = router;
