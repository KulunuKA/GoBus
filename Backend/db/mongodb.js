const mongoose = require("mongoose");
const mongodbURI = process.env.MONGO_URI;

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("error", console.error.bind(console, "connection error:"));

connection.once("open", () => {
  console.log("MongoDB Connected!");
});
