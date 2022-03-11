const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRY } = require("../../src/config");

function makeAuthHeader(user, secret = JWT_SECRET) {
  const token = jwt.sign(
    {
      user_id: user._id,
      name: user.full_name,
    },
    secret,
    {
      subject: user.email,
      expiresIn: JWT_EXPIRY,
      algorithm: "HS256",
    }
  );
  return `Bearer ${token}`;
}

const makeNewUser = () => {
  return {
    email: "newuser@gmail.com",
    full_name: "New User",
    description: "something about the new user",
    password: "SOs0s3cr3t!",
  };
};

module.exports = {
  makeAuthHeader,
  makeNewUser,
};
