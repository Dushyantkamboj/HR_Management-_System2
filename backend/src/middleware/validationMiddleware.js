import { status_code } from "../utils/constant.js";

export const validations=(schema,body)=>{
    
    return (req,res,next)=>{
        const payload=body==="body"?req.body:req.query;
        
        console.log("payload",payload);
        

        const {error}=schema.validate(payload)
        if(error){
            return res.status(status_code.BAD_REQUEST).json({
                status:0,
                status_code:status_code.BAD_REQUEST,
                message:error.details[0].message
            })
        }
        next();
    }
}