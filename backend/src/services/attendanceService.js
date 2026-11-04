import { ObjectId } from "mongodb";
import { connectDataBase } from "../Database/database.js";
import moment from "moment";

export const list_attendance_service = async (payload) => {

  try {
    const db = await connectDataBase();
    const users = db.collection("users");
    const attendance = db.collection("attendance");

    const page = Number(payload.page) || 1;
    const limit = Number(payload.limit) || 10;

    const skip = (page - 1) * limit;

    // userd
    const userDetails = await users.findOne({
      _id: new ObjectId(payload.userId),
      status:1,
      is_deleted:false
    });

    
    if(!userDetails){
      return {
        status:0,
        status_code: 404,
        messsage: "User detail not found"
      }
    }

    const condition = { // by default condition for admin/ hr 
      is_deleted: false,
    };

    if(userDetails.type === 3 ){ // if employee
      condition.userId = userDetails._id;
    }  

    const totalEmployees = await attendance.countDocuments(condition);

    
const attendanceList = await attendance
  .aggregate([
    // 1. Filter attendance
    {
      $match: condition,
    },

    // 2. Join attendance with user
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },

    // 3. Convert userDetails array into object
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 4. Sort latest attendance first
    {
      $sort: {
        _id: -1,
      },
    },

    // 5. Pagination
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },

    // 6. Select fields
    {
      $project: {
        _id: 1,
        userId: 1,
        check_in: 1,
        check_out: 1,
        createdAt: 1,
        status:1,
        "userDetails._id": 1,
        "userDetails.name": 1,
        "userDetails.email": 1,
        "userDetails.phone": 1,
        "userDetails.type": 1,
      },
    },
  ])
  .toArray();

    // console.log("attendanceList:", attendanceList);

    const totalPages = Math.ceil(totalEmployees / limit);
    return {
      status: 1,
      status_code: 200,
      totalPages: totalPages,
      message: "attendance list",
      data: attendanceList,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    };
  }
};

export const add_attendance_service = async (payload) => {

  try {
    const db = await connectDataBase();
    const users = db.collection("users");
    const attendance = db.collection("attendance");

    const userDetails = await users.findOne({
      _id: new ObjectId(payload.userId),
      is_deleted: false,
    });

    if (!userDetails) {
      return {
        status: 0,
        status_code: 200,
        message: "user not exist",
      };
    }


    const current_date = moment().format("D-M-YYYY HH:mm");
    console.log('current_date:',current_date);

    const start_date = moment().startOf("day").format("D-M-YYYY HH:mm");
    console.log('start_date:',start_date);
    
    const end_date = moment().endOf("day").format("D-M-YYYY HH:mm");
    console.log('end_date:',end_date);
    
    const alreadyCheckedIn = await attendance.findOne({
      userId: new ObjectId(payload.userId),
      check_in: {
        $gte: start_date,
        $lt: end_date,
      },
      is_deleted: false,
    });

    if (payload.attendance_type === 1) {
  
      if (alreadyCheckedIn) {
        return {
          status: 0,
          status_code: 400,
          message: "Already CheckIn",
        };
      }

      const attendanceData = {
        userId: new ObjectId(payload.userId),
        check_in: current_date,
        check_out: null,
        created_at: Date.now(),
        updated_at: Date.now(),
        created_by: new ObjectId(payload.userId),
        updated_by: new ObjectId(payload.userId),
        status:1,
        is_deleted: false,
      };
      await attendance.insertOne(attendanceData);
    
      return {
        status: 1,
        status_code: 200,
        message: "CheckIn Successfull",
      };

    } else if (payload.attendance_type === 2) {

      if (!alreadyCheckedIn) {
        return {
          status: 0,
          status_code: 400,
          message: "CheckIn First",
        };
      }

      const alreadyCheckedOut = await attendance.findOne({
        userId: new ObjectId(payload.userID),
        check_out: {
          $gte: start_date,
          $lt: end_date,
        },
        is_deleted: false,
      });

      if (alreadyCheckedOut) {
        return {
          status: 0,
          status_code: 400,
          message: "Already CheckOut",
        };
      }

      await attendance.updateOne( 
        { _id: alreadyCheckedIn._id, }, 
        { $set: { check_out: current_date, updated_at: Date.now(), updated_by: new ObjectId(payload.userID), },} 
      );
      return {
        status: 1,
        status_code: 200,
        message: "CheckOut successful",
      };
    }
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    };
  }
};
