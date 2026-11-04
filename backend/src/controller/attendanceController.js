
import { list_attendance_service,add_attendance_service } from "../services/attendanceService.js"

export const list_attendance_controller=async(req,res)=>{
    try {
        const response=await list_attendance_service(req.user)
        return res.status(response.status_code).json(response)
    } catch (error) {
        return res.status(400).json({
            status:0,
            status_code:400,
            message:error.message
        })
    }
}

export const add_attendance_controller=async(req,res)=>{
    try {
        const body={
            ...req.user,
            ...req.body
        }
        
        const response=await add_attendance_service(body);
        return res.status(response.status_code).json(response)
    } catch (error) {
        return res.status(400).json({
            status:0,
            status_code:400,
            message:error.message
        })
    }
}