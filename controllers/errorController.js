const ExpressError = require("../utils/ExpressError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} ${err.value}.`;
  return new ExpressError(message, 400)
};

const sendErrorDev = (err, req, res) => {
  return res.status(err.status).json({
    status: err.status,
    message : err.message, 
    stack : err.stack, 
    error : err 
  })
};

const sendErrorProd = (err, req, res) => {
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
    console.error(err.stack)
    sendErrorDev(err, req, res)
 } 
 else if(process.env.NODE_ENV === "production") {
   let error = { ...err };
   error.message = err.message;

   if(error.name === "CastError") error = handleCastErrorDB(err)
   sendErrorProd(error, req, res)
 }
}