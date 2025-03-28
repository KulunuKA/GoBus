const {Router} = require('express');
const { getComplaints, complaintResolved } = require('../controllers/admin.controller');
const AdminRouter = Router();

AdminRouter.get('/complaints', getComplaints)
AdminRouter.put("/complaints/:id",complaintResolved)

module.exports = AdminRouter;