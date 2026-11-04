import express from 'express';
import { validations } from '../middleware/validationMiddleware.js'
import { authentication } from '../middleware/authMiddleware.js';
import { add_leave_schema,update_leave_schema,delete_leave_schema,list_leave_schema,status_leaves_schema} from '../validation/leaveValidations.js';
import { list_leave_controller,add_leave_controller,update_leave_controller,delete_leave_controller,leave_status_controller } from '../controller/leaveController.js';

const router=express.Router();

router.get('/list',validations(list_leave_schema,"query"),authentication,list_leave_controller)
router.post('/add',validations(add_leave_schema,"body"),authentication,add_leave_controller);
router.patch('/edit',validations(update_leave_schema,"body"),authentication,update_leave_controller);
router.patch('/status',validations(status_leaves_schema,"body"),authentication,leave_status_controller)
router.delete('/delete',validations(delete_leave_schema,"body"),authentication,delete_leave_controller);

export {router as leaveRoute}