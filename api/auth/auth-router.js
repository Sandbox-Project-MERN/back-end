/* eslint-disable eqeqeq */
const express = require("express");
const AuthService = require("./auth-service");
const {
  validatePassword,
  checkUserExistsByEmail,
} = require("../user/user-middleware");
const { validateLogin } = require("../auth/auth-middleware");

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

router.post(
  "/login",
  validateLogin,
  checkUserExistsByEmail,
  async (req, res, next) => {
    const { password } = req.body;

    const userFromDb = req.user;

    const match = await AuthService.comparePasswords(
      password,
      userFromDb.password
    );

    if (!match) return next({ status: 400, message: "Invalid password" });

    const sub = userFromDb.email;
    const payload = {
      user_id: userFromDb._id,
      name: userFromDb.full_name,
    };

    res.status(200).json({
      authToken: AuthService.createJwt(sub, payload),
    });
  }
);

module.exports = router;
