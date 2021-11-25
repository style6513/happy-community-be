const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { BCRYPT_WORK_FACTOR } = require("../config");
const {
  ensureCorrectUserOrAdmin,
  ensureLoggedIn,
} = require("../middlewares/authMiddlewares");

// Update user
exports.updateUser = async (req, res, next) => {
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
}

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ deleted: req.params.id });
  } catch (e) {
    return next(e);
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json({user});
  } catch (e) {
    return next(e);
  }
}

exports.getFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(user.followings.map(friendId => User.findById(friendId)));
    return res.status(200).json({ friends })
  } catch (e) {
    return next(e);
  }
}

exports.followUser = async (req, res, next) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user?.followings.includes(req.body.userId)) {
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          {
            $addToSet: { followings: req.params.id }
          },
          { returnOriginal: false }
        );
        await User.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { followers: req.body.userId } }, { returnOriginal: false })
        return res.status(200).json("user has been followed")
        // return res.status(200).json(user)
      }
      else {
        return res.status(403).json("you already follow this user")
      }
    } else {
      return res.status(403).json("you cant follow yourself")
    }
  } catch (e) {
    return next(e)
  }
}

exports.unfollowUser = async (req, res, next) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user?.followings.includes(req.body.userId)) {
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          {
            $addToSet: { followings: req.params.id }
          },
          { returnOriginal: false }
        );
        await User.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { followers: req.body.userId } }, { returnOriginal: false })
        return res.status(200).json("user has been followed")
        // return res.status(200).json(user)
      }
      else {
        return res.status(403).json("you already follow this user")
      }
    } else {
      return res.status(403).json("you cant follow yourself")
    }
  } catch (e) {
    return next(e)
  }
}

