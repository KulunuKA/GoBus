const { Router } = require("express");

const passengerAuth = require("../middlewares/passengerAuth");
const { getChats } = require("../controllers/chat.controller");
const ChatRouter = Router();

ChatRouter.get("/chat/:id", getChats);

module.exports = ChatRouter;
