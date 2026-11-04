import jwt from 'jsonwebtoken';
import { status_code } from '../utils/constant.js';
import { response_message } from '../utils/responseMessage.js';
import {employee_details_service} from '../services/userService.js'

export const authentication=async(req,res,next)=>{
    
    try {
        const authResponse=req.headers.authorization;

        // console.log('authResponse:',authResponse);
        
        if(!authResponse){
            return res.status(status_code.UNAUTHORIZED).json({
                status:0,
                status_code:status_code.UNAUTHORIZED,
                message:response_message.unauthorized
            });
        };

        const token=authResponse.split(" ")[1]
        const details=await jwt.verify(token,process.env.TOKEN_SECRET_KEY);

        const body={
            ...details
        }

        const currentUser=await employee_details_service(body)
        
        if(!currentUser.status){
            return res.status(status_code.NOT_FOUND).json({
                status:0,
                status_code:status_code.NOT_FOUND,
                message:response_message.notExistUser
            })
        }

        else if(!currentUser.data.status){
            return res.status(status_code.FORBIDDEN).json({
                status:0,
                status_code:status_code.FORBIDDEN,
                message:response_message.inactiveUser
            })
        }
        
        req.user={...details,...currentUser} ;
        
        next();
    } catch (error) {
        return res.status(status_code.BAD_REQUEST).json({
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        })
    }
}