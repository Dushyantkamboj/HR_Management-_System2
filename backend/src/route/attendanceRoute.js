import express from 'express';
import { validations } from '../middleware/validationMiddleware.js';
import { list_attendance_schema,add_attendance_schema } from '../validation/attendanceValidations.js';
import { list_attendance_controller,add_attendance_controller } from '../controller/attendanceController.js';
import { authentication } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/list',validations(list_attendance_schema,"body"),authentication,list_attendance_controller);
router.post('/add',validations(add_attendance_schema,"body"),authentication,add_attendance_controller);

export {router as attendanceRoute}