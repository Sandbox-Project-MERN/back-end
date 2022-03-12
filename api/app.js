const express = require("express");
const app = express(); // set up server

const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const { NODE_ENV } = require("./config");
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

const authRouter = require("./auth/auth-router");
const userRouter = require("./user/user-router");

// app.use(morgan(morganOption)); // add security & semantic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello!");
});
// global error handler
app.use((err, req, res, next) => {
  // added error handler to prevent sensitive information to leak in production
  let response;

  if (NODE_ENV === "production") response = { message: "server error" };
  else response = { message: err.message };

  res.status(err.status || 500).json(response);
});

module.exports = app;
