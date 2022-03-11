const app = require("./app");
const { PORT, ATLAS_URI } = require("./config");
const mongoose = require("mongoose");

// connect to our mongo database
mongoose.connect(ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;

connection.once("open", () => {
  console.log("MongoDB database connected successfully");
});

// set up our server to listen for requests
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
