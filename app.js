const express = require("express");
const clc = require("cli-color");
var cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
var cookieParser = require("cookie-parser");

const app = express();

//file imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");
const { isAuth } = require("./Middlewares/AuthMiddleware");
const { PostRouter } = require("./Controllers/PostController");
const { CommentRouter } = require("./Controllers/CommentController");

// Variables
const PORT = process.env.PORT;

//Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
var store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: false,
      sameSite: false,
    },
  })
);

// Routes
app.get("/", (req, res) => {
  return res.send("This is my Post App!!");
});

// Authentication Router
app.use("/auth", AuthRouter);

// Posts Router
app.use("/api", isAuth, PostRouter);

// Comment Router
app.use("/api", isAuth, CommentRouter);

app.listen(PORT, (req, res) => {
  console.log(clc.yellow.underline(`Server is running on Port ${PORT}`));
});
