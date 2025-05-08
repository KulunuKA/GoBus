const { Router } = require("express");
const {
  getComplaints,
  complaintResolved,
  getPassengers,
  deletePassenger,
  getSupportTickets,
  supportTicektUpdateInprogress,
  getChats,
  createOrOpenchat,
  getAllChats,
  deactivateChat,
  closeTicket,
  editePassenger,
  getAuthority,
} = require("../controllers/admin.controller");
const { registerPassenger } = require("../controllers/passenger.controller");
const { registerBusOwner, updateBusOwner } = require("../controllers/busOwner.controller");
const AdminRouter = Router();

AdminRouter.get("/complaints", getComplaints);
AdminRouter.put("/complaints/:id", complaintResolved);
AdminRouter.get("/passengers", getPassengers);
AdminRouter.post("/passengers", registerPassenger);
AdminRouter.get("/authorities", getAuthority);
AdminRouter.post("/authorities", registerBusOwner);
AdminRouter.put("/authorities/:id", updateBusOwner);
AdminRouter.delete("/passengers/:id", deletePassenger);
AdminRouter.put("/passengers/:id", editePassenger);
AdminRouter.get("/supportTickets", getSupportTickets);
AdminRouter.put("/supportTickets/:id", supportTicektUpdateInprogress);
AdminRouter.get("/chatRoom/:id", getChats);
AdminRouter.get("/chatRoom", getAllChats);
AdminRouter.put("/chatRoom/:id", createOrOpenchat);
AdminRouter.put("/deactivateChatRooms/:id", deactivateChat);
AdminRouter.put("/closeTickets/:id", closeTicket);

module.exports = AdminRouter;
