import { getAuth } from "@clerk/express";
import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../middlewares/responseHandler.js";
import errorHandler from "../middlewares/errorHandler.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Notification } from "../models/notification.model.js";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName");

  responseHandler(res, 200, "Comments Gotten Successfully", comments);
});
export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { userId } = getAuth(req);
  const { content } = req.body;

  if (!content || content.trim() === "")
    return errorHandler(res, "Content Must be Addded", 400);

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) return errorHandler(res, "User or Post not Found", 404);

  const comment = await Comment.create({
    user: user._id,
    post: postId,
    content,
  });

  // link comment to post
  await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

  // create notification if not commenting on own post
  if (user._id.toString() !== post.user.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      comment: comment._id,
      type: "comment",
    });
  }
  return responseHandler(res, 201, "Comment Added Successfully", comment);
});
export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const { userId } = getAuth(req);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const comment = await Comment.findOne({
    _id: commentId,
    createdAt: { $gt: fiveMinutesAgo },
  });
  const user = await User.findOne({ clerkId: userId });
  if (!comment)
    return errorHandler(res, "Comment Not Found or Edit Window Expired", 400);
  if (!content.trim())
    return errorHandler(res, "Comment Must Contain Content", 400);
  if (comment.user.toString() !== user._id.toString())
    return errorHandler(res, "You Can Only Edit Your Posts");

  comment.content = content;
  comment.isEdited = true;
  await comment.save();

  return responseHandler(res, 201, "Comment Edited Successfully", comment);
});
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = getAuth(req);

  const comment = await Comment.findById(commentId);
  const user = await User.findOne({ clerkId: userId });

  if (!comment || !user) {
    return errorHandler(res, "Comment or User Not Found", 404);
  }

  if (user._id.toString() !== comment.user.toString())
    return errorHandler(res, "You Can Only Delete Your Comments", 400);

  // unlink comment from post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: commentId },
  });
  // delete notifications triggered by the comment
  await Notification.deleteMany({ comment: commentId });
  await Comment.deleteOne();
  return responseHandler(res, 201, "Comment Deleted Successfully", comment);
});
