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
      { returnOriginal: false }
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

// GET FRIENDS
router.get("/friends/:userId", ensureLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(user.followings.map(friendId => User.findById(friendId)));
    return res.status(200).json({ friends })
  } catch (e) {
    return next(e);
  }
});

// follow a user
router.put("/:id/follow", ensureLoggedIn, async (req, res, next) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followings.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { folllowings: req.params.id } });
        return res.status(200).json("user has been followed")
      } else {
        return res.status(403).json("you already follow this user")
      }
    } else {
      return res.status(403).json("you cant follow yourself")
    }
  } catch (e) {
    return next(e)
  }
});

// unfollow a user.
router.put("/:id/unfollow", ensureLoggedIn, async (req, res, next) => {
  try {
    if(req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if(user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res.status(200).json("user has been unfollowed");
      } else {
        return res.status(403).json("you don't follow this user")
      }
    } else {
      return res.status(403).json("you can't unfollow yourself")
    }
  } catch(e) {
    return next(e);
  }
})
module.exports = router;
