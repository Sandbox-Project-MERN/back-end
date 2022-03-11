/* eslint-disable eqeqeq */
const express = require("express");
const AuthService = require("../middleware/auth-service");
const { requireAuth } = require("../middleware/jwt-auth");

const authRouter = express.Router();

authRouter.route("/login").post(async (req, res, next) => {
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

module.exports = authRouter;
