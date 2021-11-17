const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const { UnauthorizedError } = require("../ExpressError");

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

function ensureLoggedIn(req, res, next) {
   try {
      if(!res.locals.user) throw new UnauthorizedError();
      return next();
   } catch(e) {
      return next(e);
   }
}

function ensureAdmin(req, res, next) {
   try {
      if(!res.locals.user || !res.locals.user.isAdmin) {
         throw new UnauthorizedError();
      }
      return next();
   } catch(e) {
      return next(e);
   }
}

function ensureCorrectUserOrAdmin(req ,res, next) {
   try {
      const user = res.locals.user;
      if(
         !user && 
            (user.isAdmin || user.id === req.params.id)
      ) throw new UnauthorizedError();
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

