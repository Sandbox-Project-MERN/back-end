const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const authRouter = require("./middleware/auth-router");
const registerRouter = require("./routers/registration-router");

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

const app = express(); // set up server
// app.use(morgan(morganOption)); // add security & semantic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/auth", registerRouter);

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
