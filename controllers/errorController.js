const {ExpressError} = require("../utils/ExpressError");
const mongoose = require("mongoose");

const handleCastErrorDB = (path, value) => {
  const message = `Invalid ${path} ${value}.`;
  return new ExpressError(message, 400)
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ExpressError(message, 400)
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(e => e.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ExpressError(message, 400)
}

const sendErrorDev = (err, res) => {
  return res.status(err.status).json({
    status: err.status,
    message : err.message, 
    stack : err.stack, 
    errror : err
  })
};

const sendErrorProd = (err, res) => {
  if(err.isOperational) {
    return  res.status(err.status).json({
      status : err.status, 
      message : err.message
   });
  }

  console.error("ERROR", err);
  return res.status(500).json({
    status : "error",
    message : "something wen't wrong"
  })
}


module.exports = (err, req, res, next) => {
  err.status = err.status || 500;
  if(process.env.NODE_ENV === "development") {
    sendErrorDev(err, res)
 } 
 else if(process.env.NODE_ENV === "production") {
   let error = Object.assign(err);
   error.message = err.message;

   if(err instanceof mongoose.CastError) error = handleCastErrorDB(err.path, err.value);
   if(err.code === 11000) error = handleDuplicateFieldsDB(err);
   if(err.name === "ValidationError") error = handleValidationErrorDB(err);
   sendErrorProd(error, res)
 }
}

