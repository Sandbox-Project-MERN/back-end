const User = require("../user/user-model");

const UserService = {
  getAllUsers: async () => {
    return await User.find().select(["email", "full_name", "description"]);
  },

  getUserWithEmail: async (email) => {
    return await User.find({ email }).then(([user]) => user);
  },

  getUserWhere: async (filter) => {
    return await User.find(filter)
      .select(["email", "full_name", "description"])
      .then(([user]) => user);
  },

  updateUser: async (_id, user) => {
    await User.updateOne({ _id }, user);

    return await User.find({ _id })
      .select([
        "email",
        "full_name",
        "description",
        "_id",
        "photo_url",
        "photo_id",
      ])
      .then(([user]) => user);
  },
};

module.exports = UserService;
