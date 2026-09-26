const { Router } = require("express");
const {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbacks,
  getFeedback,
} = require("../controllers/feedback.controller");
const passengerAuth = require("../middlewares/passengerAuth");
const FeedbackRouter = Router();

FeedbackRouter.post("/addfeedback", passengerAuth, createFeedback);
FeedbackRouter.get("/getfeedback/:id", getFeedbacks);
FeedbackRouter.get("/feedback/:id", passengerAuth, getFeedback);
FeedbackRouter.delete("/feedback/:id", passengerAuth, deleteFeedback);
FeedbackRouter.put("/feedback/:id", passengerAuth, updateFeedback);

module.exports = FeedbackRouter;
