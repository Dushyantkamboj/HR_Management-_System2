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

    const search = (payload.search || "").trim();

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      const text = search.toLowerCase();

      // Employee name / email / department live on the joined users collection
      const matchedUsers = await users
        .find(
          {
            $or: [
              { name: regex },
              { email: regex },
              { department: regex },
            ],
          },
          { projection: { _id: 1 } }
        )
        .toArray();

      const orConditions = [{ reason: regex }];

      if (matchedUsers.length) {
        orConditions.push({
          userId: { $in: matchedUsers.map((user) => user._id) },
        });
      }

      const leaveTypeMap = {
        sick: 1,
        casual: 2,
        annual: 3,
        unpaid: 4,
      };

      Object.entries(leaveTypeMap).forEach(([label, value]) => {
        if (
          text.length >= 2 &&
          (label.includes(text) || text.includes(label))
        ) {
          orConditions.push({ leave_type: value });
        }
      });

      const statusMap = {
        pending: 1,
        approved: 2,
        rejected: 3,
      };

      Object.entries(statusMap).forEach(([label, value]) => {
        if (
          text.length >= 2 &&
          (label.includes(text) || text.includes(label))
        ) {
          orConditions.push({ status: value });
        }
      });

      condition.$or = orConditions;
    }

    if (payload.status && payload.status !== "default") {
      condition.status = Number(payload.status);
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
            "userDetails.email": 1,
            "userDetails.department": 1,
            "userDetails.type": 1,
          },
        },
      ])
      .toArray();

    const totalPages = Math.ceil(totalleaves / limit);
    return {
      status: 1,
      status_code: 200,
      total: totalleaves,
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
        status_code: 404,
        message: "Leave not found",
      };
    }

    // Only the employee who applied can edit their own leave.
    if (String(leaveDetails.userId) !== String(payload.userId)) {
      return {
        status: 0,
        status_code: 403,
        message: "You can only update your own leave requests",
      };
    }

    // Once Admin/HR has taken an action the request is locked.
    if (Number(leaveDetails.status) !== 1) {
      return {
        status: 0,
        status_code: 409,
        message: "This leave has already been approved or rejected and can no longer be updated",
      };
    }

    const userLeave = {
      leave_type: payload.leave_type,
      type: payload.type,
      from: payload.from,
      to: payload.to,
      reason: payload.reason,
      updated_at: Date.now(),
      updated_by: new ObjectId(payload.userId),
    };

    await leaves.updateOne({ _id: leaveDetails._id }, { $set: userLeave });
    return {
      status: 1,
      status_code: 200,
      message: "Leave updated successfully",
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
  try {
    const db = await connectDataBase();
    const users = db.collection("users");
    const leaves = db.collection("leaves");

    // Only Admin (1) / HR (2) may approve or reject a leave.
    const reviewer = await users.findOne({
      _id: new ObjectId(payload.userId),
      status: 1,
      is_deleted: false,
    });
    if (!reviewer || (reviewer.type !== 1 && reviewer.type !== 2)) {
      return {
        status: 0,
        status_code: 403,
        message: "Only Admin or HR can update a leave status",
      };
    }

    const leavesDetails = await leaves.findOne({
      _id: new ObjectId(payload.id),
      is_deleted: false,
    });
    if (!leavesDetails) {
      return {
        status: 0,
        status_code: 404,
        message: "Leave not found",
      };
    }

    // A decision is final - a reviewed request cannot be changed again.
    if (Number(leavesDetails.status) !== 1) {
      return {
        status: 0,
        status_code: 409,
        message: "This leave has already been approved or rejected",
      };
    }

    await leaves.updateOne(
      { _id: new ObjectId(payload.id) },
      { $set: { status: payload.status, updated_at: Date.now(), updated_by: reviewer._id } },
    );
    return {
      status: 1,
      status_code: 200,
      message: "Leave status updated successfully",
      statusType: payload.status
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    };
  }
};

// Employees on approved leave that covers the current day.
export const on_leave_today_service = async () => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");
    const leaves = db.collection("leaves");

    // Only approved (2) and not soft-deleted requests count.
    const approved = await leaves
      .find({ is_deleted: false, status: 2 })
      .toArray();

    const parseDate = (value) => {
      if (!value) return null
      if (value instanceof Date) return isNaN(value) ? null : value

      if (typeof value === "string") {
        const text = value.trim()
        const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
        if (iso) {
          return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
        }
        const dmy = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/)
        if (dmy) {
          return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]))
        }
      }

      const d = new Date(value)
      return isNaN(d) ? null : d
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    )

    const activeLeaves = approved.filter((leave) => {
      const from = parseDate(leave.from)
      const to = parseDate(leave.to) || from

      return from && to && from <= todayEnd && to >= todayStart
    })

    const userIds = activeLeaves
      .map((leave) => leave.userId)
      .filter(Boolean)

    const userMap = {}
    if (userIds.length) {
      const matchedUsers = await users
        .find({ _id: { $in: userIds } }, { projection: { name: 1 } })
        .toArray()

      matchedUsers.forEach((user) => {
        userMap[user._id.toString()] = user.name
      })
    }

    const annual = activeLeaves.filter(
      (leave) => Number(leave.leave_type) === 3
    ).length

    const sick = activeLeaves.filter(
      (leave) => Number(leave.leave_type) === 1
    ).length

    return {
      status: 1,
      status_code: 200,
      data: {
        count: activeLeaves.length,
        annual,
        sick,
        employees: activeLeaves
          .map((leave) => userMap[leave.userId?.toString()])
          .filter(Boolean),
      },
    }
  } catch (error) {
    throw {
      status: 0,
      status_code: 400,
      message: error.message,
    }
  }
}
