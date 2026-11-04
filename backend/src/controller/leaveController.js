import { list_leave_Service,add_leave_service, update_leave_service,status_leave_service, delete_leave_service } from "../services/leaveService.js";

export const list_leave_controller=async(req,res)=>{

    try {
        const body={
            ...req.user,
            ...req.query
        }

        console.log();
        
        const response=await list_leave_Service(body);
        return res.status(response.status_code).json(response);
    } catch (error) {
        return res.status(400).json({
            status:0,
            status_code:400,
            message:error.message
        })
    }
}

export const add_leave_controller=async(req,res)=>{
    try {
        const body={
            ...req.user,
            ...req.body
        }
        const response=await add_leave_service(body);
        return res.status(response.status_code).json(response);
    } catch (error) {
        return res.status(400).json({
            status:0,
            status_code:400,
            message:error.message
        })
    }
}

export const update_leave_controller=async(req,res)=>{
    try {
        const body={
            ...req.user,
            ...req.body
        }
        const response=await update_leave_service(body);

        return res.status(response.status_code).json(response)
    } catch (error) {
        return {
            status:0,
            status_code:400,
            message:error.message
        }
    }
}


export const leave_status_controller=async(req,res)=>{

    try {
        const body={
            ...req.user,
            ...req.body
        }

        const response=await status_leave_service(body)
        return res.status(response.status_code).json(response)

    } catch (error) {
        return res.status(400).json({
            status:0,
            status_code:400,
            message:error.message
        })
    }
}

export const delete_leave_controller=async(req,res)=>{
    try {
        const response=await delete_leave_service(req.body);
        return res.status(response.status_code).json(response);
    } catch (error) {
        return res.status(400).json({
            status:0,
            status_code:400,
            message:error.message
        })
    }
}