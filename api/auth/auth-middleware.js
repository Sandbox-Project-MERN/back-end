const validateLogin = (req, res, next) => {
  const userInfo = ({ email, password } = req.body);

  for (const [key, value] of Object.entries(userInfo)) {
    if (value == null || value === "")
      return next({ status: 400, message: `Missing '${key}' in request body` });
  }
};

module.exports = { validateLogin };
