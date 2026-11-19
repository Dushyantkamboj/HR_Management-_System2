import express from 'express';
import {authentication} from '../middleware/authMiddleware.js'
import { validations } from '../middleware/validationMiddleware.js';
import { add_employee_controller,update_employee_controller, delete_employee_controller,list_employee_controller, login_employee_controller, change_password_controller, forgot_password_controller, reset_password_controller, verify_reset_token_controller } from '../controller/userController.js';
import { add_employee_schema,update_employee_schema, delete_employee_schema, list_employee_schema, employee_login_schema, change_password_schema, forgot_password_schema, verify_reset_token_schema, reset_password_schema } from '../validation/userValidation.js';

const router=express.Router();

router.post('/login',validations(employee_login_schema,"body"),login_employee_controller);
router.post('/forgotpassword',validations(forgot_password_schema,"body"),forgot_password_controller);
router.post('/verifyresettoken',validations(verify_reset_token_schema,"body"),verify_reset_token_controller);
router.post('/resetpassword',validations(reset_password_schema,"body"),reset_password_controller);

router.get('/list',validations(list_employee_schema,"query"),authentication,list_employee_controller);
router.post('/add',validations(add_employee_schema,"body"),authentication,add_employee_controller);
router.patch('/update',validations(update_employee_schema,"body"),authentication,update_employee_controller);
router.delete('/delete',validations(delete_employee_schema,"body"),authentication,delete_employee_controller);
router.patch('/changepassword',validations(change_password_schema,"body"),authentication,change_password_controller);

export {router as userRoute}
