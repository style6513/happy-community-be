const express = require('express');
const app = express();
const cors = require("cors");
const { NotFoundError, UnauthorizedError } = require("./utils/ExpressError");

// // Routes Imports
const authRouter = require("./routes/authRoutes");
const appnameController = require('./controllers/appnameController');
const userController = require("./controllers/userController");
const postRouter = require("./routes/postRoutes");
const globalErrorController = require("./controllers/errorController");
const { authenticateJWT } = require('./middlewares/authMiddlewares');
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
 }
app.use(express.json());
// cors setup
const whitelist = ["http://localhost:3000"]
app.use(cors({
   origin: function (origin, cb) {
      if (whitelist.includes(origin) || !origin) {
         cb(null, true)
      } else {
         cb(new UnauthorizedError("Not allowed by CORS"))
      }
   }
}));

app.use(authenticateJWT)

// Middleware

app.use('/appname', appnameController);
app.use('/auth', authRouter);
app.use("/users", userController);
app.use("/posts", postRouter);

app.all("*", (req, res, next) => {
   return next(new NotFoundError(`Can't find ${req.originalUrl}`))
})

app.use(globalErrorController);
module.exports = app;
