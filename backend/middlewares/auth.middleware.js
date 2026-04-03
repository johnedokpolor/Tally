import { User } from "../models/user.model.js";
import asyncHandler from "./asyncHandler.js";
import errorHandler from "./errorHandler.js";
import { getAuth } from "@clerk/express";

export const protectRoute = asyncHandler(async (req, res, next) => {
  // checks if clerk has an authenticated user
  if (!req.auth().isAuthenticated) {
    return errorHandler(res, "Unauthorised - you must be logged in", 401);
  }
  const { userId } = getAuth(req);

  // find user using clerkId
  const user = await User.findOne({ clerkId: userId });
  if (!user) return errorHandler(res, "User Not Found", 404);

  // set user to req.user
  req.user = user;
  next();
});
