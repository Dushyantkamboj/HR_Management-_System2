import express from 'express'
import { validations } from '../middleware/validationMiddleware.js'
import { authentication } from '../middleware/authMiddleware.js'
import { list_event_controller,add_event_controller, update_event_controller, delete_event_controller} from '../controller/eventController.js'
import { list_event_schema,add_event_schema, update_event_schema, delete_event_schema } from '../validation/eventValidation.js'

const router=express.Router()

router.get('/list',validations(list_event_schema,"query"),authentication,list_event_controller)
router.post('/add',validations(add_event_schema,"body"),authentication,add_event_controller);
router.patch('/update',validations(update_event_schema,"body"),authentication,update_event_controller);
router.delete('/delete',validations(delete_event_schema,"body"),authentication,delete_event_controller)

export {router as eventRoute}