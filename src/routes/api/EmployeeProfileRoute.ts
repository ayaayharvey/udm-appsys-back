import express from 'express';
import EmployeeController from '../../controller/EmployeeController';
import { tokenAuth } from '../../middleware/TokenAuth';

const router = express.Router();
const employeeController = new EmployeeController();

router.route('/api/employee-profile')
    .get(tokenAuth, employeeController.getProfile);

export default router;