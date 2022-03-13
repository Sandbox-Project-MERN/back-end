const makeUsersArray = () => {
  return [
    {
      _id: "622d1bd3172bc8bc459a403d",
      email: "testuser1@gmail.com",
      full_name: "Test User",
      password: "password1",
      description: "something about Test User",
    },
    {
      _id: "622d1bd3192bc8bc459a403d",
      email: "testuser2@gmail.com",
      full_name: "Test User2",
      password: "password2",
      description: "something about Test User2",
    },
  ];
};

const makeFixtures = () => {
  const users = makeUsersArray();
  return {
    users,
  };
};

module.exports = {
  makeFixtures,
  makeUsersArray,
};
