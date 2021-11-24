require('./db/db')
const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { NotFoundError, UnauthorizedError } = require("./ExpressError");

// // Routes Imports
const authRouter = require("./routes/authRoutes");
const appnameController = require('./controllers/appnameController');
const userController = require("./controllers/userController");
const postRouter = require("./routes/postRoutes");
const { authenticateJWT } = require('./middlewares/authMiddlewares');
const morgan = require('morgan');

if(process.env.NODE_ENV === "development") {
   app.use(morgan("dev"))
}

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
app.use(express.json());
app.use('/appname', appnameController);
app.use('/auth', authRouter);
app.use("/users", userController);
app.use("/posts", postRouter);


app.use((req, res, next) => {
   return next(new NotFoundError());
});

app.use((err, req, res, next) => {

   console.error(err.stack);

   const status = err.status || 500;
   const message = err.message;
   return res.status(status).json({
      error: { message, status },
   });
});

module.exports = app;
