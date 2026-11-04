import express from 'express';
import { validations } from '../middleware/validationMiddleware.js';
import { admin_seeder_controller, admin_login_controller} from '../controller/adminController.js';
import { seeder_schema_validatiions, admin_login_schema} from '../validation/adminValidation.js';

const router=express.Router();

router.post('/seeder',validations(seeder_schema_validatiions,"body"),admin_seeder_controller)
router.post('/login',validations(admin_login_schema,"body"),admin_login_controller)

export {router as adminRoute}