import express from 'express';
import { tokenAuth } from '../../middleware/TokenAuth';
import EmployeeController from '../../controller/EmployeeController';
import { checkEmailExistence } from '../../middleware/CheckEmailExistence';

const router = express.Router();
const employeeController = new EmployeeController();

router.route('/api/employee')
    .get(tokenAuth, employeeController.getEmployee)
    .post(tokenAuth, checkEmailExistence, employeeController.createEmployee)


export default router;