import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../middlewares/errorHandler.js";
import { User } from "../models/user.model.js";

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  // const user = await User.findOne({ userName: username });
  const user = false;

  if (!user) {
    return responseHandler(res, 404, "Usfer not found");
  }

  return res.json({ success: true, data: user });
});

export { getUserProfile };
