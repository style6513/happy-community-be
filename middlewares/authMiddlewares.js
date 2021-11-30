const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const { ExpressError } = require("../utils/ExpressError");
const Comment = require("../models/Comment");
/** Middleware: Authenticate user.
 * If a token was provided, verify it, and if valid, store the token payload
 * on res.locals (this will include the id and isAdmin field).
 *
 * It's not an error if no token was provided or it the token is not valid.
 */
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET);
    }
    return next();
  } 
  catch (e) {
    return next();
  }
}

/**
 * Middleware to use when they must be logged in, and that the token is still valid,
 * ie.) not expired, or that the user's password hasn't changed since issued date.
 */
async function ensureLoggedInAndNotExpired(req, res, next) {
  try {
    if (!res.locals.user) {
      return next(new ExpressError("Unauthorized", 401));
    }
    const decoded = res.locals.user;
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new ExpressError("The user belonging to this token no longer exists")
      );
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new ExpressError("User recently changed password, log-in again", 401)
      );
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    return next();
  } catch (e) {
    return next(e);
  }
}

/**
 * Middleware to use when they be logged in as an admin user.
 * If not, raises ExpressError
 */
function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new ExpressError("Unauthorized", 401);
    }
    return next();
  } catch (e) {
    return next(e);
  }
}

/**
 * Middleware to use when they must provide a valid token && be user matching
 * id provided as route param.
 * If not,m raises Unauthorized
 */
function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.isAdmin || user.id === req.params.id))) {
      throw new ExpressError("Unauthorized", 401);
    }
    return next();
  } catch (e) {
    return next(e);
  }
}

function restrictTo(...roles) {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new ExpressError("Unauthorized", 401))
    }

    return next();
  } 
}

async function checkCommentOwnership(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(comment.userId !== req.user.id) {
      return next(new ExpressError("Unauthorized", 401))
    }
    return next();
  } catch(e) {
    return next(e);
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedInAndNotExpired,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  restrictTo,
  checkCommentOwnership
};
