import { getAuth } from "@clerk/express";
import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../middlewares/responseHandler.js";
import { Notification } from "../models/notification.model.js";
import errorHandler from "../middlewares/errorHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const notifications = Notification.find({
    to: userId,
  })
    .sort({ createdAt: -1 })
    .populate("from", "username firstName lastName profilePicture")
    .populate("post", "content image")
    .populate("comment", "content");

  if (!notifications) return errorHandler(res, "No Notifications Found", 404);
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

  const user = Notification.findOne({ clerkId: userId });
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
