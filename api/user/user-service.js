const User = require("../user/user-model");

const UserService = {
  getAllUsers: async () => {
    return await User.find().select(["email", "full_name", "description"]);
  },

  getUserWithEmail: async (email) => {
    return await User.find({ email }).then(([user]) => user);
  },

  updateUser: async (_id, user) => {
    return await User.updateOne({ _id }, user);
  },
};

module.exports = UserService;
