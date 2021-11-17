require("dotenv").config();
const checkBotMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.body.user) {
      token = req.body.user.tokenCaptcha;
    } else {
      token = req.body.tokenCaptcha;
    }
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
