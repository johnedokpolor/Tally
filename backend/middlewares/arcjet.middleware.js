export const arcjetMiddlware = async (req, res, next) => {
  try {
    const decison = await aj.protect(req, {
      requested: 1, // specifies tha each request consumes 1 token
    });
    if (decison.isDenied()) {
      if (decison.reason.isRateLimit()) {
        res.status(429).json({
          error: "Too Many Requests",
          message: "Rate Limit Exceeded, Please Try Again Later",
        });
      } else if (decison.reason.isBot()) {
        res.status(403).json({
          error: "Bot access denied",
          message: "Automated Requests are Not Allowed",
        });
      } else {
        res.status(403).json({
          error: "Forbidden",
          message: "Access Denied By Security Policy",
        });
      }
      return;
    }
    // check for spoofed bots
    if (
      decison.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed(),
      )
    ) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious Bot Activity Detected",
      });
    }
    next();
  } catch (err) {
    console.log("Arcjet error", err);
    next();
  }
};
