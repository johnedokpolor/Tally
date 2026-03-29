import responseHandler from "./responseHandler.js";

export const protectRoute = (req, res, next) => {
  if (!req.auth().isAuthenticated) {
    return responseHandler(res, 401, "Unauthorised - you must be logged in");
  }
  next();
};
