require("dotenv").config();
const checkBotMiddleware = async (req, res, next) => {
  try {
    const token = req.body.user.tokenCaptcha;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_CAPTCHA_KEY}&response=${token}`;
    const response = await fetch(url, {
      method: "post",
    });
    const google_response = await response.json(); 
    if (google_response.success) {
      next();
    } else {
      res.status(400).json({
        error: "Bot isn't allowed",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: "Bot isn't allowed",
    });
  }
};
module.exports = { checkBotMiddleware };
