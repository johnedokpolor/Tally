const responseHandler = (res, statusCode, message, data, success = true) => {
  return res.status(statusCode).json({ success, message, data });
};

export default responseHandler;
