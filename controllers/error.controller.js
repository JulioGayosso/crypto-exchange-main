const dotenv = require("dotenv");

//utils
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const sendErrorDev = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};

const sendErrorProd = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || "something went wrong!",
  });
};

const tokenExpiredError = () => {
  return new AppError("session has expired", 403);
};
const tokenInvalidSignatureError = () => {
  return new AppError("invalid sessiom", 403);
};
const dbUniqueConstrainError = () => {
  return new AppError("The entered email has alreday been taken", 400);
};
const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };

    if (error.name === "TokenExpiredError") err = tokenExpiredError();
    else if (error.name === "JsonWebTokenError")
      err = tokenInvalidSignatureError();
    else if (error.name === "SequelizeUniqueConstrainError")
      err = dbUniqueConstrainError();
    sendErrorProd(err, req, res);
  }
};

module.exports = { globalErrorHandler };
