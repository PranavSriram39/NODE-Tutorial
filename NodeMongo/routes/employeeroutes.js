const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeControllers');
const Employee = require("../models/Employee");

//get,post,put/patch,delete

router.post('/addemp',employeeController.createEmployee)
router.get('/getemp',employeeController.getEmployees)
router.get('/employee/:id',employeeController.singleEmployee)
router.put('/updateemp/:id',employeeController.updateEmployee)
router.delete('/delete/:id',employeeController.deleteEmployee)


module.exports = router;


