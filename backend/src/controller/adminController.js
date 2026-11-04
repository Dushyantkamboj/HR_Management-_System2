import { admin_seeder_service, admin_login_service } from "../services/adminService.js"
import { status_code } from "../utils/constant.js";
import { response_message } from "../utils/responseMessage.js";

export const admin_seeder_controller=async(req,res)=>{
    try {
        if(req.body.admin_secret_key===process.env.ADMIN_SECRET_KEY){
            const response=await admin_seeder_service(req.body);
            return res.status(response.status_code).json(response)
        }else{
            return res.status(status_code.UNAUTHORIZED).json({
                status:0,
                status_code:status_code.UNAUTHORIZED,
                message:response_message.unauthorized
            })
        }
    } catch (error) {
        return res.status(status_code.BAD_REQUEST).json({
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        })
    }
}

export const admin_login_controller=async(req,res)=>{
    try {

        const body={
            ...req.body
        }

        const response=await admin_login_service(body)
        return res.status(response.status_code).json(response)
    } catch (error) {
        return res.status(status_code.BAD_REQUEST).json({
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        })
    }
}