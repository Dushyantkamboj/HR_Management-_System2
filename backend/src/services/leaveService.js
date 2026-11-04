import { ObjectId } from "mongodb";
import { connectDataBase } from "../database/database.js";

export const list_leave_Service = async (payload) => {
 
  try {
    const db = await connectDataBase();
    const users = db.collection("users");
    const leaves = db.collection("leaves");

    const page = Number(payload.page) || 1;
    const limit = Number(payload.limit) || 10;

    const skip = (page - 1) * limit;

    const userDetails = await users.findOne({
      _id: new ObjectId(payload.userId),
      status: 1,
      is_deleted: false,
    });
    // console.log('userDetails:',userDetails);

    if (!userDetails) {
      return {
        status: 0,
        status_code: 404,
        messsage: "User detail not found",
      };
    }

    const condition = {
      // by default condition for admin/ hr
      is_deleted: false,
    };

    if (userDetails.type === 3) {
      // if employee
      condition.userId = userDetails._id;
    }

    const totalleaves = await leaves.countDocuments(condition);

    const leavesList = await leaves
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
            updated_at: -1,
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
            leave_type: 1,
            type: 1,
            from: 1,
            to: 1,
            reason: 1,
            created_by: 1,
            updated_by: 1,
            status: 1,
            "userDetails._id": 1,
            "userDetails.name": 1,
          },
        },
      ])
      .toArray();

    const totalPages = Math.ceil(totalleaves / limit);
    return {
      status: 1,
      status_code: 200,
      totalPages: totalPages,
      message: "Leaves list",
      data: leavesList,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    };
  }
};

export const add_leave_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");
    const leaves = db.collection("leaves");

    const userDetails = await users.findOne({
      _id: new ObjectId(payload.userId),
      is_deleted: false,
      status: 1,
    });

    if (!userDetails) {
      return {
        status: 0,
        status_code: 400,
        message: "user not exist",
      };
    }

    const data = {
      userId: userDetails._id,
      leave_type: payload.leave_type,
      type: payload.type,
      from: payload.from_date,
      to: payload.to_date,
      reason: payload.reason,
      created_at: Date.now(),
      updated_at: Date.now(),
      created_by: new ObjectId(payload.userID),
      updated_by: new ObjectId(payload.userID),
      is_deleted: false,
      status: 1,
    };

    await leaves.insertOne(data);
    return {
      status: 1,
      status_code: 200,
      message: "leave added successfully",
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    };
  }
};

export const update_leave_service = async (payload) => {
  // console.log('payload:',payload);
  try {
    const db = await connectDataBase();
    const leaves = db.collection("leaves");

    const leaveDetails = await leaves.findOne({
      _id: new ObjectId(payload.id),
      is_deleted: false,
    });
    // console.log('leaveDetails:',leaveDetails);

    if (!leaveDetails) {
      return {
        status: 0,
        status_code: 400,
        message: "leave not find",
      };
    }

    const userLeave = {
      leave_type: payload.leave_type,
      type: payload.type,
      from: payload.from,
      to: payload.to,
      reason: payload.reason,
      updated_at: Date.now(),
      updated_by: new ObjectId(payload.userID),
    };

    await leaves.updateOne({ _id: leaveDetails._id }, { $set: userLeave });
    return {
      status: 1,
      status_code: 200,
      message: "leave updated successfully",
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    };
  }
};

export const delete_leave_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const leaves = db.collection("leaves");

    const leaveDetails = await leaves.findOne({
      _id: new ObjectId(payload.id),
      is_deleted: false,
    });

    if (!leaveDetails) {
      return {
        status: 0,
        status_code: 400,
        message: "leave not find",
      };
    }

    await leaves.updateOne(
      { _id: new ObjectId(payload.id) },
      { $set: { is_deleted: true } },
    );

    return {
      status: 1,
      status_code: 200,
      message: "leave deleted successfully",
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    };
  }
};

export const status_leave_service = async (payload) => {

console.log('payload:',payload);
  try {
    const db = await connectDataBase();
    const user = db.collection("user");
    const leaves = db.collection("leaves");

    const userDetails = await user.findOne({
      _id: new ObjectId(payload.userID),
      status: 1,
      is_deleted: false,
    });
    if (!userDetails) {
      return {
        status: 0,
        status_code: 1,
        message: "user details not find",
      };
    }

    const leavesDetails = await leaves.findOne({
      _id: new ObjectId(payload.id),
      is_deleted: false,
    });
    if (!leavesDetails) {
      return {
        status: 0,
        status_code: 400,
        message: "leaves details not find",
      };
    }

    await leaves.updateOne(
      { _id: new ObjectId(payload.id) },
      { $set: { status: payload.status } },
    );
    return {
      status: 1,
      status_code: 200,
      message: "updated successfully",
      statusType:payload.status
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    };
  }
};
