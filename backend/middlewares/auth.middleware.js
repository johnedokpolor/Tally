import errorHandler from "./errorHandler.js";

export const protectRoute = (req, res, next) => {
  if (!req.auth().isAuthenticated) {
    return errorHandler(res, "Unauthorised - you must be logged in", 401);
  }
  next();
};
