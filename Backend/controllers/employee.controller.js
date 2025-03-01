const Employee = require("../models/employee");
const AppError = require("../utils/appError");

const addEmployee = async (res, req, next) => {
  try {
    if (
      !req.body.ownerID ||
      !req.body.name ||
      !req.body.age ||
      !req.body.position ||
      !req.body.salary
    ) {
      return next(new AppError(400, "Invalid required fields"));
    }

    //TODO: want check have owner

    const employee = await Employee.create(req.body);

    res.status(201).send({
      data: {
        employee,
      },
      code: 0,
      msg: "Added",
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//delete employee
//TODO:update bus owner
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return next(new AppError(404, "No employee found with that ID"));
    }

    res.status(204).send({
      msg: "delete employee successfully",
      data: null,
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//update employee
const updateEmployee = async (req, res, next) => {
  try {
    if (
      !req.body.name ||
      !req.body.age ||
      !req.body.position ||
      !req.body.salary
    ) {
      return next(new AppError(400, "Invalid required fields"));
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return next(new AppError(404, "No employee found with that ID"));
    }

    res.status(204).send({
      msg: "updated employee successfully",
      data: {
        employee,
      },
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

const getAllEmployeeByOwner = async (req, res, next) => {
  try {
    const ownerID = req.params.id || req.user?.id;

    if (!ownerID) {
      return next(new AppError(400, "Owner ID is required"));
    }
    const employees = await Employee.find({ ownerID });

    res.status(200).send({
      data: {
        employees,
      },
      code: 0,
      msg: "",
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

module.exports = {
  addEmployee,
  deleteEmployee,
  updateEmployee,
  getAllEmployeeByOwner,
};
