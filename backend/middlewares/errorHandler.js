const errorHandler = (
  res,
  message = "Something Went Wrong",
  statusCode = 500,
  success = false,
) => {
  return res.status(statusCode).json({ success, message });
};

export default errorHandler;
