const express = require("express");
const app = express();
const cors = require("cors");
const { ExpressError } = require("./utils/ExpressError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// // Routes Imports
const authRouter = require("./routes/authRoutes");
const appnameController = require("./controllers/appnameController");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const globalErrorController = require("./controllers/errorController");

const { authenticateJWT } = require("./middlewares/authMiddlewares");
const morgan = require("morgan");

// Set security HTTP headers
app.use(helmet());

// development logging.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// cors setup
const whitelist = ["http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, cb) {
      if (whitelist.includes(origin) || !origin) {
        cb(null, true);
      } else {
        cb(new ExpressError("Not allowed by CORS", 401));
      }
    },
  })
);

// rate limit for DDOS protection, only allow 250 requests from the same IP in one hour
const limiter = rateLimit({ 
  max : 250,
  windowMs : 60 * 60 * 1000,
  message : "Too many requests from this IP, please try again in a hour"
});

// authenticate jwt on all routes.
app.use(authenticateJWT);

app.use("/appname", appnameController);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.all("*", (req, res, next) => {
  return next(new ExpressError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorController);
module.exports = app;
