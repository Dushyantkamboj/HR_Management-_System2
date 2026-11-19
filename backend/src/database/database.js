import {MongoClient} from 'mongodb';
import {status_code} from '../utils/constant.js'

const url="mongodb://localhost:27017/"
const client=new MongoClient(url);

let database;

export const connectDataBase=async()=>{
    try {
        if(database){
            return database
        }
        await client.connect();
        const db=client.db('HRManagementSystemdb')
        return database=db
    } catch (error) {
        return {
            status:0,
            status_code:status_code.INTERNAL_SERVER_ERROR,
            message:error.message
        }
    }
}