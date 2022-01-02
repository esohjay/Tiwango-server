const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ExpressError = require("./utils/ExpressError");
//const MongoStore = require("connect-mongo");
const path = require("path");
const cors = require("cors");
dotenv.config();

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
  //useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
//"http://localhost:3000","https://agritalk.netlify.app"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("homepage");
});
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).send(err.message);
});

/*
//serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });*/

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
