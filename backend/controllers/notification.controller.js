import { getAuth } from "@clerk/express";
import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../middlewares/responseHandler.js";
import { Notification } from "../models/notification.model.js";
import errorHandler from "../middlewares/errorHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const user = await User.findOne({ clerkId: userId });
  if (!user) return errorHandler(res, "User Not Found", 404);

  const notifications = await Notification.find({
    to: user._id,
  })
    .sort({ createdAt: -1 })
    .populate("from", "username firstName lastName profilePicture")
    .populate("post", "content image")
    .populate("comment", "content");

  if (notifications.length === 0)
    return errorHandler(res, "No Notifications Found", 404);
  return responseHandler(
    res,
    200,
    "Notifications Gotten Successfully",
    notifications,
  );
});
export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const { userId } = getAuth(req);

  const user = User.findOne({ clerkId: userId });
  if (!user) return errorHandler(res, "User Not Found", 404);
  const notification = Notification.findByIdAndDelete({
    to: user._id,
    _id: notificationId,
  });

  if (!notification) return errorHandler(res, "Notification Not Found", 404);

  return responseHandler(
    res,
    200,
    "Notification Deleted Successfully",
    notification,
  );
});
