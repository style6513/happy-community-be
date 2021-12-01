const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { ExpressError } = require("../utils/ExpressError");
const { BCRYPT_WORK_FACTOR, SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");
const userRegisterSchema = require("../validationSchema/userRegisterSchema.json");
const sendEmail = require("../utils/email");

const createToken = (user) => {
  let payload = {
    id: user._id,
    isAdmin: user.isAdmin || false,
  };
  return jwt.sign(payload, SECRET, { expiresIn: "3d" });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = createToken(user);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}


exports.register = async (req, res, next) => {
  const validator = jsonschema.validate(req.body, userRegisterSchema);
  if (!validator.valid) {
    const errors = validator.errors.map((e) => e.stack);
    return next(new ExpressError(errors, 401));
  }
  try {
    const { username, email, phone } = req.body;
    const hashedPw = await bcrypt.hash(req.body.password, BCRYPT_WORK_FACTOR);
    const newUser = new User({
      username,
      email,
      password: hashedPw,
      passwordConfirm: hashedPw,
      phone,
      isAdmin: req.body.isAdmin || false,
    });

    const savedUser = await newUser.save();
    createSendToken(savedUser, 201, req, res)
  } catch (e) {
    return next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select(`+password`)
    if (!user) return next(new ExpressError("Invalid credentials", 401));
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return next(new ExpressError("Invalid credentials", 401));
    }
    createSendToken(user, 200, req, res)

  } catch (e) {
    return next(e);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ExpressError("There is no user with that email", 404));
    }
    // generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? submit patch request with your new password to ${resetURL}`;
    try {
      // email is sent
      await sendEmail({
        email: user.email,
        subject: `Your password reset token (valid for 10mins)`,
        message,
      });
    } catch (e) {
      // if there is a error within sending the email part, we want to just set the passwordResetToken/and epiration back to undefined.
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new ExpressError("Error sending email. Try again later", 500)
      );
    }
    // if we get here, then the email is sent successfully.
    return res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (e) {
    return next(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
      // get user based on token
      const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
      const user = await User.findOne({
          passwordResetToken : hashedToken,
          passwordResetExpires : { $gt : Date.now() }   // check for user that has the resettoken as the hashedToken, and one that hasn't expired.
      });

      // if token not expired, and there is a user, set the new password
      if(!user) return next(new ExpressError("Invalid reset token", 401));
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      // log the user in, send JWT.
      createSendToken(user, 200, req, res)
  } 
  catch (e) {
    return next(e);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if(!(await bcrypt.compare(req.body.passwordCurrent, user.password))) {
      return next(new ExpressError("Your current password is wrong.", 401))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, req, res);
  } catch(e) {
    return next(e);
  }
}