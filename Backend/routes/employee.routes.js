const { Router } = require("express");
const EmployeeRouter = Router();
const {
  updateEmployee,
  deleteEmployee,
  addEmployee,
  getAllEmployeeByOwner,
  employeeLogin,
  addDailyIncome,
} = require("../controllers/employee.controller");
const busOwnerAuth = require("../middlewares/busOwnerAuth");

EmployeeRouter.post("/add", busOwnerAuth, addEmployee);
EmployeeRouter.get("/get/:id", busOwnerAuth, getAllEmployeeByOwner);
EmployeeRouter.put("/update/:id", busOwnerAuth, updateEmployee);
EmployeeRouter.delete("/delete/:id", busOwnerAuth, deleteEmployee);
EmployeeRouter.post("/login", employeeLogin);
EmployeeRouter.post("/addincome/:id", addDailyIncome);

module.exports = EmployeeRouter;
