import asyncHandler from "../middlewares/asyncHandler.js";
import errorHandler from "../middlewares/errorHandler.js";
import responseHandler from "../middlewares/responseHandler.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { Comment } from "../models/comment.model.js";

import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("user", "userName firstName lastName profilePicture")
    .populate({
      path: "comment",
      populate: {
        path: "user",
        select: "userName firstName lastName profilePicture",
      }, // goes into the comment array and populates each comment with it's author(a user)
    });

  if (posts.length === 0) return errorHandler(res, "No Posts Found", 404);
  return responseHandler(res, 200, "Posts Gotten Successfully", posts);
});

export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .populate("user", "userName firstName lastName profilePicture")
    .populate({
      path: "comment",
      populate: {
        path: "user",
        select: "userName firstName lastName profilePicture",
      }, // goes into the comment array and populates each comment with it's author(a user)
    });
  if (!post) return errorHandler(res, "Post Not Found", 404);
  return responseHandler(res, 200, "Posts Gotten Successfully", post);
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) return errorHandler(res, "User Not Found", 404);

  const posts = await Post.find({ user: user._id })
    .populate("user", "userName firstName lastName profilePicture")
    .populate({
      path: "comment",
      populate: {
        path: "user",
        select: "userName firstName lastName profilePicture",
      }, // goes into the comment array and populates each comment with it's author(a user)
    });
  if (!posts) return errorHandler(res, "User has no Posts", 404);
  return responseHandler(res, 200, "Posts Gotten Successfully", posts);
});

export const createPost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  // Checks if content or image is available
  if (!content?.trim() && !imageFile)
    return errorHandler(res, "Post Must Contain Either Text or Image ", 400);

  const user = await User.findOne({ clerkId: userId });
  if (!user) return errorHandler(res, "User Not Found", 404);

  let imageUrl = "";

  if (imageFile) {
    try {
      //convert buffer to base64 for cloudinary
      const base64Image = `data:image/jpeg;base64,${imageFile.buffer.toString("base64")}`;
      const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "tally_posts",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" }, // crops the image to required dimensions
          { quality: "auto" },
          { format: "auto" },
        ],
      });
      // set imageUrl to cloudinary link
      imageUrl = uploadedResponse.secure_url;
    } catch (error) {
      console.error(error);
      return errorHandler(res, error.message, 400);
    }
  }

  const post = await Post.create({
    user: user._id,
    content: content || "",
    image: imageUrl,
  });

  // Checks if other users were mentioned
  const mentions =
    content
      ?.match(/[@][\w\-_.]+/g)
      ?.map((mention) => mention.toLowerCase().replace("@", "")) || [];

  if (mentions.length > 0) {
    // find users in the database by their usernames
    const taggedUsers = await User.find({ userName: { $in: mentions } });

    // creates an array of notification promises
    const notificationPromises = taggedUsers
      .map((taggedUser) => {
        if (taggedUser._id.toString() !== user._id.toString()) {
          return Notification.create({
            from: user._id,
            to: taggedUser._id,
            type: "tag",
            post: post._id,
          });
        }
      })
      .filter(Boolean); // filter out undefined

    // resolves all the promises
    await Promise.all(notificationPromises);
  }

  return responseHandler(res, 201, "Posts Created Successfully", post);
});

export const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { userId } = getAuth(req);

  const post = await Post.findById(postId);
  const user = await User.findOne({ clerkId: userId });
  if (!post || !user) return errorHandler(res, "Post or User Not Found", 404);

  const isLiked = post.likes.includes(user._id);
  if (isLiked) {
    // unlike a post if liked already
    await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
    // create notification if not unliking your own post
    if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "unlike",
        post: postId,
      });
    }
  } else {
    // like a post if unlked already
    await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } });
    // create notification if not liking your own post
    if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "like",
        post: postId,
      });
    }
  }

  return responseHandler(
    res,
    201,
    isLiked ? "Post Unliked Successfully" : "Post Liked Successfully",
    post,
  );
});
export const updatePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { content } = req.body;
  const imageFile = req.file;

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  // Checks if content or image is available
  if (!content && !imageFile)
    return errorHandler(res, "Post Must Contain Either Text or Image ", 400);

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findOne({
    _id: postId,
    createdAt: { $gt: fiveMinutesAgo },
  });
  if (!user) return errorHandler(res, "User Not Found", 404);
  if (!post)
    return errorHandler(res, " Post Not Found or Edit Window expired", 404);

  let imageUrl = post.image; // keep existing if no new image

  if (imageFile) {
    try {
      //convert buffer to base64 for cloudinary
      const base64Image = `data:image/jpeg;base64,${imageFile.buffer.toString("base64")}`;
      const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "tally_posts",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" }, // crops the image to required dimensions
          { quality: "auto" },
          { format: "auto" },
        ],
      });
      // set imageUrl to cloudinary link
      imageUrl = uploadedResponse.secure_url;
    } catch (error) {
      console.error(error);
      return errorHandler(res, error.message, 400);
    }
  }
  post.content = content || post.content;
  post.image = imageUrl;
  post.isEdited = true;

  await post.save();
  // Checks if other users were mentioned
  const mentions =
    content
      ?.match(/[@][\w\-_.]+/g)
      ?.map((mention) => mention.toLowerCase().replace("@", "")) || [];

  if (mentions.length > 0) {
    // find users in the database by their usernames
    const taggedUsers = await User.find({ userName: { $in: mentions } });

    // creates an array of notification promises
    const notificationPromises = taggedUsers
      .map((taggedUser) => {
        if (taggedUser._id.toString() !== user._id.toString()) {
          return Notification.create({
            from: user._id,
            to: taggedUser._id,
            type: "tag",
            post: post._id,
          });
        }
      })
      .filter(Boolean); // filter out undefined

    // resolves all the promises
    await Promise.all(notificationPromises);
  }

  return responseHandler(res, 201, "Post Updated Successfully", post);
});

export const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { userId } = getAuth(req);
  const post = await Post.findById(postId);
  const user = await User.findOne({ clerkId: userId });

  if (!post || !user) return errorHandler(res, "Post or User Not Found", 404);
  if (post.user.toString() !== user._id.toString()) {
    return errorHandler(res, "You can only delete your own posts", 400);
  }
  // delete all comments and notifications for this post
  await Comment.deleteMany({ post: postId });
  await Notification.deleteMany({ post: postId });

  // delete post
  await post.deleteOne();

  return responseHandler(res, 200, "Post Deleted Successfully");
});
