const User = require("../user/user-model");

const UserService = {
  getAllUsers: async () => {
    return await User.find().select(["email", "full_name", "description"]);
  },
};

module.exports = UserService;
