const Complaint = require("../models/complaint");
const Ticket = require("../models/supportTicket");
const Passenger = require("../models/passenger");
const Chat = require("../models/chat");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const BusOwner = require("../models/busOwner");
const Admin = require("../models/admin");

//admin login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(400, "Please provide admin name and password"));
    }
    const admin = await Admin.findByCredentials(email, password);
    if (!admin) {
      return next(new AppError(401, "Invalid credentials"));
    }

    let token = await admin.generateAuthToken();

    res.status(200).send({
      data: {
        id: admin._id,
        email: admin.email,
        token,
      },
      msg: "Login successful",
      code: 0,
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    next(new AppError(500, "Server error"));
  }
};

const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find();
    res.status(201).send({
      data: complaints,
      msg: "Complaints fetched successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

const getSupportTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find();
    res.status(201).send({
      data: tickets,
      msg: "Support tickets fetched successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

const supportTicektUpdateInprogress = async (req, res, next) => {
  try {
    console.log("Update ticket request received:", {
      ticketId: req.params.id,
      body: req.body,
    });

    if (!req.params.id) {
      console.log("Missing ticket ID");
      return next(new AppError(400, "Please provide Ticket id"));
    }

    // Make sure the ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid ticket ID format");
      return next(new AppError(400, "Invalid ticket ID format"));
    }

    // Check if ticket exists before updating
    const existingTicket = await Ticket.findById(req.params.id);
    if (!existingTicket) {
      console.log("Ticket not found");
      return next(new AppError(404, "No ticket found with that ID"));
    }

    console.log("Existing ticket found:", existingTicket);

    // Validate the status value
    if (
      req.body.status &&
      !["open", "in_progress", "closed"].includes(req.body.status)
    ) {
      console.log("Invalid status value");
      return next(new AppError(400, "Invalid status value"));
    }

    // Update with better error handling
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    console.log("Ticket updated successfully:", ticket);

    res.status(200).json({
      data: { ticket },
      msg: "Ticket updated successfully",
      code: 0,
    });
  } catch (error) {
    console.error("Error in supportTicektUpdateInprogress:", error);
    next(new AppError(500, `Server error: ${error.message}`));
  }
};

//mark as read
const complaintResolved = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError("Please provide complaint id"));
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );

    if (!complaint) {
      return next(new AppError("No complaint found with that ID", 404));
    }

    res.status(200).send({
      data: { complaint },
      msg: "Complaint resolved successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

const getPassengers = async (req, res, next) => {
  try {
    const passengers = await Passenger.find();
    res.status(201).send({
      data: passengers,
      msg: "Passengers fetched successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

const getAuthority = async (req, res, next) => {
  try {
    const authorities = await BusOwner.find();
    res.status(201).send({
      data: authorities,
      msg: "Authorities fetched successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

const deletePassenger = async (req, res, next) => {
  try {
    const passenger = await Passenger.findByIdAndDelete(req.params.id);
    if (!passenger) {
      return next(new AppError("No passenger found with that ID", 404));
    }
    res.status(200).send({
      data: passenger,
      msg: "Passenger deleted successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

//update passenger details
const editePassenger = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "mobile"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return next(new AppError(400, "Invalid updates"));
    }

    const passenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!passenger) {
      return next(new AppError(404, "No passenger found"));
    }
    passenger.save();

    const { _id: id, username, mobile, email } = passenger;
    res.status(200).send({
      data: {
        id,
        username,
        mobile,
        email,
      },
      code: 0,
      msg: "Passenger Updated",
    });
  } catch (error) {
    next(new AppError(400, "Server error"));
  }
};

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

const getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find();
    res.status(201).send({
      data: chats,
      msg: "All Chats fetched successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

// Improved createOrOpenchat function with initial message
const createOrOpenchat = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const { userId } = req.body; // Extract userId from the request body

    console.log("Create/open chat request received:", {
      ticketId: ticketId,
      userId: userId,
    });

    if (!ticketId) {
      console.log("Missing ticket ID");
      return next(new AppError(400, "Please provide Ticket id"));
    }

    if (!userId) {
      console.log("Missing user ID");
      return next(new AppError(400, "Please provide User id"));
    }

    // Validate ticket existence
    const ticketExists = await Ticket.findById(ticketId);
    if (!ticketExists) {
      console.log("Ticket not found for chat creation");
      return next(new AppError(404, "No ticket found with that ID"));
    }

    // Find or create chat
    let chat = await Chat.findOne({ ticketId });
    console.log("Existing chat found:", chat ? "Yes" : "No");

    if (!chat) {
      console.log(
        "Creating new chat for ticket:",
        ticketId,
        "and user:",
        userId
      );
      chat = await Chat.create({
        ticketId,
        userId, // Associate the userId with the chat
        messages: [
          {
            sender: "admin",
            content: `Hello User ${userId}, we started to resolve your problem`,
            timestamp: new Date(),
          },
        ],
      });
      console.log("New chat created:", chat);
    }

    res.status(200).json({
      code: 0,
      msg: "Chat created/opened successfully",
      data: chat,
      ticketId,
      userId,
    });
  } catch (error) {
    console.error("Error in createOrOpenchat:", error);
    next(new AppError(500, `Server error: ${error.message}`));
  }
};

const closeTicket = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError("Please provide ticket id"));
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!ticket) {
      return next(new AppError("No Ticket found with that ID", 404));
    }

    res.status(200).send({
      data: { ticket },
      msg: "Ticket Closed successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

const deactivateChat = async (req, res, next) => {
  try {
    const ticketId = req.params.id;

    if (!ticketId) {
      return next(new AppError(400, "Ticket ID is required"));
    }

    const chat = await Chat.findOneAndUpdate({ ticketId: ticketId }, req.body, {
      runValidators: true,
      new: true,
    });

    if (!chat) {
      return next(new AppError("No Chat found with that ID", 404));
    }

    res.status(200).send({
      data: { chat },
      msg: "Chat Deactivated successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

module.exports = {
  getComplaints,
  complaintResolved,
  getPassengers,
  deletePassenger,
  getSupportTickets,
  supportTicektUpdateInprogress,
  getChats,
  createOrOpenchat,
  getAllChats,
  closeTicket,
  deactivateChat,
  editePassenger,
  getAuthority,
  adminLogin,
};
