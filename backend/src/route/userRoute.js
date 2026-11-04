import express from 'express';
import {authentication} from '../middleware/authMiddleware.js'
import { validations } from '../middleware/validationMiddleware.js';
import { add_employee_controller,update_employee_controller, delete_employee_controller,list_employee_controller, login_employee_controller, change_password_controller } from '../controller/userController.js';
import { add_employee_schema,update_employee_schema, delete_employee_schema, list_employee_schema, employee_login_schema, change_password_schema } from '../validation/userValidation.js';

const router=express.Router();

router.post('/login',validations(employee_login_schema,"body"),login_employee_controller)

router.get('/list',validations(list_employee_schema,"query"),authentication,list_employee_controller)
router.post('/add',validations(add_employee_schema,"body"),authentication,add_employee_controller)
router.patch('/update',validations(update_employee_schema,"body"),authentication,update_employee_controller)
router.delete('/delete',validations(delete_employee_schema,"body"),authentication,delete_employee_controller)
router.patch('/changepassword',validations(change_password_schema,"body"),authentication,change_password_controller)

export {router as userRoute}