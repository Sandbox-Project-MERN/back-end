const User = require("../user/user-model");

const UserService = {
  getAllUsers: async () => {
    return await User.find().select(["email", "full_name", "description"]);
  },

  updateUser: async (user) => {
    return await User.updateOne({ email }, user);
  },
};

module.exports = UserService;
