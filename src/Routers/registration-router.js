/* eslint-disable eqeqeq */
const express = require("express");
const AuthService = require("../middleware/auth-service");
const UserValService = require("../middleware/user-validation-service");

const registerRouter = express.Router();

registerRouter.route("/register").post(async (req, res, next) => {
  const { full_name, email, password, description } = req.body;
  const regUser = { full_name, description, password, email };

  for (const [key, value] of Object.entries(regUser)) {
    if (value == null) {
      return next({ status: 400, message: `Missing '${key}' in request body` });
    }
  }

  const passwordError = UserValService.validatePassword(password);

  if (passwordError) return next({ status: 400, message: passwordError });

  try {
    const user = await AuthService.getUserWithEmail(regUser.email);

    if (user) return next({ status: 400, message: "Email not available" });

    const newUser = await AuthService.createUser(regUser);

    if (!newUser)
      return next({
        status: 400,
        message: "User not created, please try again",
      });

    delete newUser.password;

    return res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
});

module.exports = registerRouter;
