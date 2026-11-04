import { status_code } from "../utils/constant.js";
import { response_message } from "../utils/responseMessage.js";
import { event_details_service,list_event_service,add_event_service, update_event_service, delete_event_service } from "../services/eventService.js";


export const list_event_controller=async(req,res)=>{
    try {
        
        const query={
            ...req.query
        };

        const response=await list_event_service(query)
        return res.status(response.status_code).json(response)
    } catch (error) {
        return res.status(status_code.BAD_REQUEST).json({
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        })
    }
}

export const add_event_controller=async(req,res)=>{
    try {

        const body={
            ...req.user,
            ...req.body
        }

        const response=await add_event_service(body);
        return res.status(response.status_code).json(response)
    } catch (error) {
        return res.status(status_code.BAD_REQUEST).json({
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        })       
    }
}

export const update_event_controller=async(req,res)=>{
    try {

        const body={
            ...req.user,
            ...req.body,
            dataType: "eventId"
        }

        const eventDetails=await event_details_service(body)
        if(!eventDetails.status){
            return res.status(status_code.CONFLICT).json({
                status:0,
                status_code:status_code.CONFLICT,
                message:response_message.eventNotFound
            })
        }

        const response=await update_event_service(body)
        return res.status(response.status_code).json(response)
    } catch (error) {
        return res.status(status_code.BAD_REQUEST).json({
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        })
    }
}

export const delete_event_controller=async(req,res)=>{
    try {
        const body={
            ...req.user,
            ...req.body,
            dataType: "eventId"
        }
        
        const eventDetails=await event_details_service(body)
        if(!eventDetails.status){
            return res.status(status_code.CONFLICT).json({
                status:0,
                status_code:status_code.CONFLICT,
                message:response_message.eventNotFound
            })
        }

        const response=await delete_event_service(body)
        return res.status(response.status_code).json(response);
    } catch (error) {
        return res.status(status_code.CONFLICT).json({
            status:0,
            status_code:status_code.CONFLICT,
            message:error.message
        })
    }
}