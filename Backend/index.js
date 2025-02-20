require("dotenv").config();
require("./db/mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const router = require("./routes/_index.routes");
const errorHandler = require("./middlewares/errorHandler");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const busLocations = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.emit("initialLocations", busLocations);

  socket.on("setLocation", (data) => {
    const { busId, latitude, longitude } = data;
    console.log("location", busId, latitude, longitude);

    busLocations[busId] = { latitude, longitude };

    io.emit("getLocation", { busId, latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", router);
app.use("/public", router);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
