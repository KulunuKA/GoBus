const {Router} = require('express');
const { getComplaints, complaintResolved, getPassengers, deletePassenger } = require('../controllers/admin.controller');
const AdminRouter = Router();

AdminRouter.get('/complaints', getComplaints)
AdminRouter.put("/complaints/:id",complaintResolved)
AdminRouter.get('/passengers', getPassengers)
AdminRouter.delete('/passengers/:id', deletePassenger)

module.exports = AdminRouter;