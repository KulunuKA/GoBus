const { Router } = require("express");
const EmployeeRouter = Router();
const {
  updateEmployee,
  deleteEmployee,
  addEmployee,
  getAllEmployeeByOwner,
} = require("../controllers/employee.controller");
const busOwnerAuth = require("../middlewares/busOwnerAuth");

EmployeeRouter.post("/add", busOwnerAuth, addEmployee);
EmployeeRouter.get("/get/:id", busOwnerAuth, getAllEmployeeByOwner);
EmployeeRouter.put("/update/:id", busOwnerAuth, updateEmployee);
EmployeeRouter.delete("/delete/:id", busOwnerAuth, deleteEmployee);

module.exports = EmployeeRouter;
