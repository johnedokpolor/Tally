import { User } from "../models/user.model.js";
import errorHandler from "./errorHandler.js";
import { getAuth } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  if (!req.auth().isAuthenticated) {
    return errorHandler(res, "Unauthorised - you must be logged in", 401);
  }
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });
  if (!user) return errorHandler(res, "User Not Found", 404);
  req.user = user;
  next();
};
