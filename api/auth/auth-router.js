/* eslint-disable eqeqeq */
const express = require("express");
const AuthService = require("./auth-service");
const { validatePassword } = require("../user/user-middleware");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { full_name, email, password, description } = req.body;
  const regUser = { full_name, description, password, email };

  for (const [key, value] of Object.entries(regUser)) {
    if (value == null) {
      return next({ status: 400, message: `Missing '${key}' in request body` });
    }
  }

  const passwordError = validatePassword(password);

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

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const loginUser = { email, password };

  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
    }
  }

  try {
    const user = await AuthService.getUserWithEmail(loginUser.email);

    if (!user) return next({ status: 400, message: "Invalid email" });

    const pw = await AuthService.comparePasswords(
      loginUser.password,
      user.password
    );

    if (!pw) return next({ status: 400, message: "Invalid password" });

    const sub = user.email;
    const payload = {
      user_id: user._id,
      name: user.full_name,
    };
    return res.send({
      authToken: AuthService.createJwt(sub, payload),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
