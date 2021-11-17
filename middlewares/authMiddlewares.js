const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const { UnauthorizedError } = require("../ExpressError");
/** Middleware: Authenticate user.
 * If a token was provided, verify it, and if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field).
 * 
 * It's not an error if no token was provided or it the token is not valid.
 */
function authenticateJWT(req, res, next) {
   try {
     const authHeader = req.headers && req.headers.authorization;
     if(authHeader) {
       const token = authHeader.replace(/^[Bb]earer /, "").trim();
       res.locals.user = jwt.verify(token, SECRET);
     }
     return next();
   } catch(e) {
     return next();
   }
 }
 
 /**
  * Middleware to use when they must be logged in.
  * If not, raise UnauthorizedError
  */
 function ensureLoggedIn(req, res, next) {
   try {

      if(!res.locals.user) throw new UnauthorizedError();
      return next();

   } catch(e) {
     return next(e);
   }
 }
 
 /**
  * Middleware to use when they be logged in as an admin user.
  * If not, raises UnauthorizedError
  */
 function ensureAdmin(req, res, next) {
   try {

      if(!res.locals.user || !res.locals.user.isAdmin) {
         throw new UnauthorizedError();
      }
      return next();

   } catch(e) {
     return next(e)
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
     if(!(user && (user.isAdmin || user.id === req.params.id))) {
       throw new UnauthorizedError();
     }
     return next();

   } catch(e) {
     return next(e);
   }
 }
module.exports = {
   authenticateJWT,
   ensureLoggedIn,
   ensureAdmin,
   ensureCorrectUserOrAdmin
};

