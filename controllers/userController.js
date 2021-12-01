const User = require("../models/User");
const multer = require("multer");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { ExpressError } = require("../utils/ExpressError");

// const multerStorage = multer.diskStorage({
//   destination : (req, file, cb) => {
//     cb(null, "public/img/users")
//   },
//   filename : (req, file, cb) => {
//     // user-{userId}-{currentTimeStamp}.jpeg
//     const fileExtention = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${fileExtention}`)
//   }
// })

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  } else {
    cb(new ExpressError("Images only", 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
    return next();
  } catch (e) {
    return next(e);
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body,
      {
        new: true,
        runValidators: true
      }
    )
    return res.status(200).json({ updatedUser });
  } catch (e) {
    return next(e);
  }
}

exports.updateMe = async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, BCRYPT_WORK_FACTOR);
  }
  if (req.file) {
    req.body.profilePicture = req.file.filename;
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body,
      {
        new: true,
        runValidators: true
      }
    )
    return res.status(200).json({ updatedUser });
  } catch (e) {
    return next(e);
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { active: false });
    return res.status(200).json({ deleted: req.params.id });
  } catch (e) {
    return next(e);
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json({ user });
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
    if (req.user._id === req.params.id) return next(new ExpressError("You can't follow yourself", 403));
    const targetUser = await User.findById(req.params.id);
    if (targetUser.followings.includes(req.user._id)) return next(new ExpressError("You already follow this user", 403));
    await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { followings: req.params.id } });
    return res.status(200).json({
      status: "success",
      message: `followed ${req.params.id}`
    })
  } catch (e) {
    return next(e);
  }
}

exports.unfollowUser = async (req, res, next) => {
  try {
    if (req.user._id === req.params.id) return next(new ExpressError("You can't unfollow yourself", 403));
    const targetUser = await User.findById(req.params.id);
    if (!targetUser.followings.includes(req.user._id)) return next(new ExpressError("Nothing to unfollow", 403));
    targetUser.followers.pull({ _id: req.user._id });
    req.user.followings.pull({ _id: req.params.id });

    return res.status(200).json({
      status: "success",
      message: `followed ${req.params.id}`
    })
  } catch (e) {
    return next(e);
  }
}

