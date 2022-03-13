const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const userInfo = { email, password };

  for (const [key, value] of Object.entries(userInfo)) {
    if (value == null || value === "")
      return next({ status: 400, message: `Missing '${key}' in request body` });
  }

  next();
};

module.exports = { validateLogin };
