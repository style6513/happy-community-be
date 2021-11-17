require('./db/db')
const express = require('express');
const app = express();
const cors = require("cors");
const {NotFoundError, UnauthorizedError} = require("./ExpressError");

// // Routes Imports
const authController = require("./controllers/authController");
const appnameController = require('./controllers/appnameController');

// cors setup
const whitelist = ["http://localhost:3000"]
app.use(cors({
   origin : function(origin, cb) {
      if(whitelist.includes(origin) || !origin) {
         cb(null, true)
      } else {
         cb(new UnauthorizedError("Not allowed by CORS"))
      }
   }
}));

// Middleware
app.use(express.json());
app.use('/appname',appnameController);
app.use('/auth',authController);


app.use((req, res, next) => {
   return next(new NotFoundError());
 });

 app.use((err, req, res, next) => {
   if (process.env.NODE_ENV !== "test") {
     console.error(err.stack);
   }
   const status = err.status || 500;
   const message = err.message;
   return res.status(status).json({
     error: { message, status },
   });
 });

module.exports = app;
