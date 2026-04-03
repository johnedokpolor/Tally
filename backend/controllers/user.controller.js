import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../middlewares/responseHandler.js";
import errorHandler from "../middlewares/errorHandler.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { clerkClient, getAuth } from "@clerk/express";

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ userName: username });

  if (!user) {
    return errorHandler(res, "User Not Found", 404);
  }
  return responseHandler(res, 200, "User Gotten Successfully", user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  if (!user) return errorHandler(res, "User Not Found", 404);
  return responseHandler(res, 200, "User Updated Successfully", user);
});

const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  // Check if user exists in mongodb
  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return responseHandler(res, 200, "User Already Exists", existingUser);
  }

  // Create new user from Clerk data
  const clerkUser = await clerkClient.users.getUser(userId);
  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    userName:
      clerkUser.emailAddresses[0].emailAddress.split("@")[0] + Date.now(),
    profilePicture: clerkUser.imageUrl || "",
  };
  const user = await User.create(userData);
  return responseHandler(res, 201, "User Stored Successfully", user);
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return responseHandler(res, 200, "User Gotten Successfully", req.user);
});
const followUser = asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;

  // checks if userId and targerId are the same
  if (req.user._id === targetUserId)
    return errorHandler(res, "You Cannot Follow Yourself", 400);

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) return errorHandler(res, "User Not Found", 404);

  // checks if current user is following target user already
  const isFollowing = req.user.following.includes(targetUserId);

  if (isFollowing) {
    // unfollows a user if following already
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: req.user._id },
    });

    // create notification
    await Notification.create({
      from: req.user._id,
      to: targetUser._id,
      type: "unfollow",
    });
  } else {
    // follows a user if not following
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $push: { followers: req.user._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUser._id,
      type: "follow",
    });
  }

  return responseHandler(
    res,
    200,
    isFollowing ? "User Unfollowed Successfully" : "User Followed Successfully",
  );
});

export { getUserProfile, syncUser, getCurrentUser, updateProfile, followUser };
