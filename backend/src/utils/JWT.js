import jwt from 'jsonwebtoken';
import { status_code } from './constant.js';

export const access_token=async(payload)=>{
    try {
        const token=jwt.sign(
            {
                userId:payload.userId,
                email:payload.email,
                name:payload.name,
                type:payload.type,
                statue:payload.status
            },
            process.env.TOKEN_SECRET_KEY,
            {
                expiresIn:'1h'
            }
        )
        return token;
    } catch (error) {
        throw{
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        }
    }
}

export const refresh_token=async(payload)=>{
    try {
        const token=jwt.sign(
            {
                userId:payload.userId
            },
            process.env.TOKEN_SECRET_KEY,
            {
                expiresIn:'7d'
            }
        );
        return token;
    } catch (error) {
        throw {
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        }
    }
}