const express = require("express");
const cookie_Parse = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const accountRouter = require("./routers/accountRouter");
const postsRouter = require("./routers/postsRouter");
const draftsRouter = require("./routers/draftsRouter");
const userRouter = require("./routers/uRouter");
const _ = require("lodash");
const cors = require("cors");
const { checkUser } = require("./middlewares/authMiddleware");
global._ = _;

require("dotenv").config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cookie_Parse());
app.use(express.static("public"));

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    return result;
  })
  .catch((err) => console.log(err));

// enable cors for localhost

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/", authRouter.router);
app.use("/account", [checkUser], accountRouter.router);
app.use("/posts", [checkUser], postsRouter.router);
app.use("/drafts", [checkUser], draftsRouter.router);
app.use("/u", [checkUser], userRouter.router);
app.listen(3001, () => {
  console.log("server is listen on port 3001");
});
