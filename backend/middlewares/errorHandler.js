const responseHandler = (
  res,
  statusCode = 500,
  message = "Something went wrong",
) => {
  return res.status(statusCode).json({ success: false, message });
};

export default responseHandler;
