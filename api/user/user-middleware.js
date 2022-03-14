const UserService = require("../user/user-service");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])[\S]+/;

const validatePassword = (password) => {
  if (password.length < 8) {
    return "password must be longer than 8 characters";
  }
  if (password.length > 72) {
    return "password must be less than 72 characters";
  }
  if (password.startsWith(" ") || password.endsWith(" ")) {
    return "password must not start or end with empty spaces";
  }
  if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
    return "password must contain 1 upper case, lower case, number and special character";
  }
  return null;
};

const emailAlreadyExists = async (req, res, next) => {
  const { email } = req.body;
  const _id = req.params._id;

  const foundUser = await UserService.getUserWithEmail(email);

  if (!foundUser) return next();

  if (foundUser.email === email && foundUser._id == _id) return next();
  else return next({ status: 400, message: "Email already taken" });
};

const checkUserExistsByEmail = async (req, res, next) => {
  const foundUser = await UserService.getUserWithEmail(req.body.email);

  if (foundUser) {
    req.user = foundUser;
    next();
  } else
    return next({
      status: 400,
      message: "That email is not registered to any user",
    });
};

module.exports = {
  validatePassword,
  emailAlreadyExists,
  checkUserExistsByEmail,
};
