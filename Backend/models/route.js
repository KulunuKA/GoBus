const mongoose = require("mongoose");
const routeSchema = new mongoose.Schema({
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusOwner",
    required: true,
  },
  route_number: {
    type: String,
    required: true,
    trim: true,
  },
  start: {
    type: String,
    required: true,
    trim: true,
  },
  end: {
    type: String,
    required: true,
    trim: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  main_cities: {
    type: [String],
    required: true,
  },
});

routeSchema.post("save", async function (doc, next) {
  try {
    await mongoose.model("BusOwner").findByIdAndUpdate(doc.ownerID, {
      $addToSet: { routesId: doc._id },
    });
    next();
  } catch (error) {
    next(error);
  }
});

routeSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    await mongoose.model("BusOwner").findByIdAndUpdate(doc.ownerID, {
      $pull: { routesId: doc._id },
    });
    next();
  } catch (error) {
    next(error);
  }
});

const Route = mongoose.model("Route", routeSchema);
module.exports = Route;
