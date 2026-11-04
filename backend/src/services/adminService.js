import bcrypt from "bcrypt";
import { connectDataBase } from "../database/database.js";
import { ObjectId } from "mongodb";
import { status_code } from "../utils/constant.js";
import { response_message } from "../utils/responseMessage.js";
import { access_token, refresh_token} from "../utils/JWT.js";

export const admin_seeder_service = async () => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");
    const password = "Admin@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const seeder = {
      _id: new ObjectId(),
      name: "Dushyant Kamboj",
      email: "admin@gmail.com",
      password: hashedPassword,
      created_at: Date.now(),
      updated_at: Date.now(),
      is_deleted: false,
      status: 1,
      type: 1,
    };

    const userExist = await users.findOne({
      email: seeder.email,
      type:1,
      is_deleted: false,
      status: 1,
    });

    if (userExist) {
      return {
        status: 0,
        status_code: status_code.CONFLICT,
        message: response_message.alreadySeed,
      };
    }

    await users.insertOne(seeder);

    return {
      status: 1,
      status_code: status_code.CREATED,
      message: response_message.addedSeed,
    };

  } catch (error) {
    throw{
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    }
  }
};

export const admin_login_service=async(payload)=>{
    try {
        const db=await connectDataBase();
        const users=db.collection('users')
        
        const userExist=await users.findOne({
            email:payload.email.trim(),
            type:1,
            is_deleted:false,
            status:1
        });

        if(!userExist){
            return {
                status:0,
                status_code:status_code.NOT_FOUND,
                message:response_message.notExistUser
            }
        }

        const matchedPassword=await bcrypt.compare(payload.password,userExist.password);

        if(!matchedPassword){
            return {
                status:0,
                status_code:status_code.UNAUTHORIZED,
                message:response_message.passwordNotMatch
            }
        }

        const data={
            userId:userExist._id,
            name:userExist.name,
            type:userExist.type,
            status:userExist.status
        }

        const accessToken=await access_token(data)
        const refreshToken=await refresh_token(data)

        return {
            status:1,
            status_code:status_code.SUCCESS,
            message:response_message.loginSuccess,
            data:{
                type:data.type,
                name:data.name,
                email:data.email,
                accessToken:accessToken,
                refreshToken:refreshToken,
                status:data.status
            }
        }

    } catch (error) {
        throw {
            status:0,
            status_code:status_code.BAD_REQUEST,
            message:error.message
        }
    }
}
