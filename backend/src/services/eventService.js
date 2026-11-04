import { ObjectId } from "mongodb";
import { status_code } from "../utils/constant.js";
import { response_message } from "../utils/responseMessage.js";
import { connectDataBase } from "../database/database.js";

export const event_details_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const events = db.collection("events");
    const dataType = payload.dataType;

    const condition = {
      is_deleted: false,
    };

    switch (dataType) {
      case "eventId":
        condition._id = new ObjectId(payload.eventId);
        break;
    }

    const eventExist = await events.findOne(condition);

    if (!eventExist) {
      return {
        status: 0,
        status_code: status_code.NOT_FOUND,
        message: response_message.eventNotFound,
      };
    }

    return {
      status: 1,
      status_code: status_code.FOUND,
      message: response_message.eventFound,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const list_event_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const events = db.collection("events");

    const page = parseInt(payload.page) || 1;
    const limit = parseInt(payload.limit) || 10;

    const skip = (page - 1) * limit;

    const condition = {
      is_deleted: false,
    };

    const totalevents = await events.countDocuments(condition);

    const eventList = await events
      .find(condition)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalevents / limit);
    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: "userList",
      data: {
        employees: eventList,
        pagination: {
          currentPage: page,
          limit: limit,
          totalevents: totalevents,
          totalPages: totalPages,
        },
      },
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const add_event_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const events = db.collection("events");

    const data = {
      title: payload.title,
      category: payload.category,
      status: payload.status,
      date: payload.date,
      starts: payload.starts,
      ends: payload.ends,
      location: payload.location,
      organizer: payload.organizer,
      attendees: payload.attendees,
      created_at: Date.now(),
      created_by: new ObjectId(payload.userId),
      updated_at: Date.now(),
      updated_by: new ObjectId(payload.userId),
      is_deleted: false,
    };

    await events.insertOne(data);
    return {
      status: 1,
      status_code: status_code.CREATED,
      message: response_message.eventAdded,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const update_event_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const events = db.collection("events");

    const data = {
      title: payload.title,
      category: payload.category,
      status: payload.status,
      date: payload.date,
      starts: payload.starts,
      ends: payload.ends,
      location: payload.location,
      organizer: payload.organizer,
      attendees: payload.attendees,
      updated_at: Date.now(),
      updated_by: new ObjectId(payload.userId),
    };

    await events.updateOne(
      { _id: new ObjectId(payload.eventId) },
      { $set: data },
    );
    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: response_message.eventUpdated,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const delete_event_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const events = db.collection("events");

    await events.updateOne(
      { _id: new ObjectId(payload.eventId) },
      { $set: { is_deleted: true } },
    );
    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: response_message.eventDeleted,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};
