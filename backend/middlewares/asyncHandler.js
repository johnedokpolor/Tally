import errorHandler from "./errorHandler.js";

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      return errorHandler(res, err.message);
    });
  };
};

export default asyncHandler;
