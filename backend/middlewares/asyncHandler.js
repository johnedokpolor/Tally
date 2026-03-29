import errorHandler from "./errorHandler.js";

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error(err);
      s;
      return errorHandler(res, err.message);
    });
  };
};

export default asyncHandler;
