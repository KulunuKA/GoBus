const Chat = require("../models/chat");
const AppError = require("../utils/appError");

const getChats = async (req, res, next) => {
  try {
    const ticketId = req.params.id;

    if (!ticketId) {
      return next(new AppError(400, "Ticket ID is required"));
    }

    const chat = await Chat.findOne({ ticketId });

    if (!chat) {
      return res.status(404).json({
        code: 404,
        msg: "Chat not found",
        data: null,
      });
    }

    res.status(200).json({
      code: 0,
      msg: "Chat fetched successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Error in getChats:", error);
    next(new AppError(500, error.message));
  }
};

module.exports = { getChats };
