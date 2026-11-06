// import dotenv from "dotenv";

// dotenv.config();
// import {MongoClient} from 'mongodb';
// import {status_code} from '../utils/constant.js'

// // const url="mongodb://localhost:27017/"
// const url=process.env.MONGO_URL;
// const client=new MongoClient(url);

// let database;

// export const connectDataBase=async()=>{
//     try {
//         if(database){
//             return database
//         }
//         await client.connect();
//         const db=client.db('HRManagementSystemdb')
//         return database=db
//     } catch (error) {
//         return {
//             status:0,
//             status_code:status_code.INTERNAL_SERVER_ERROR,
//             message:error.message
//         }
//     }
// }










// import dotenv from "dotenv";
// dotenv.config();

// import { MongoClient } from "mongodb";
// import { status_code } from "../utils/constant.js";

// const url = process.env.MONGO_URL;
// const client = new MongoClient(url);

// let database;

// export const connectDataBase = async () => {
//   try {
//     if (database) {
//       return database;
//     }

//     await client.connect();

//     const db = client.db("hr_management");

//     database = db;

//     return database;

//   } catch (error) {
//     return {
//       status: 0,
//       status_code: status_code.INTERNAL_SERVER_ERROR,
//       message: error.message,
//     };
//   }
// };















import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";
import { status_code } from "../utils/constant.js";

const url = process.env.MONGO_URL;

if (!url) {
  throw new Error("MONGO_URL is missing in environment variables");
}

const client = new MongoClient(url);

let database;

export const connectDataBase = async () => {
  try {
    if (database) {
      return database;
    }

    await client.connect();

    const db = client.db("hr_management");

    database = db;

    return database;

  } catch (error) {
    console.log("Database connection error:", error.message);

    return {
      status: 0,
      status_code: status_code.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};