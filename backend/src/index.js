import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { adminRoute } from "./route/adminRoute.js";
import { userRoute } from "./route/userRoute.js";
import { eventRoute } from "./route/eventRoute.js";
import { attendanceRoute } from "./route/attendanceRoute.js";
import { leaveRoute } from "./route/leaveRoute.js";

const app = express();
dotenv.config();

const port = process.env.PORT;
const api_v1 = process.env.API_VERSION;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(`/${api_v1}/admin`, adminRoute);
app.use(`/${api_v1}/user`,userRoute);
app.use(`/${api_v1}/event`,eventRoute);
app.use(`/${api_v1}/attendance`,attendanceRoute)
app.use(`/${api_v1}/leave`,leaveRoute)

app.get(`/${api_v1}`, (req, res) => {
  res.send("hello world");
});

app.listen(`${port}`, () => {
  console.log(`The app listen on the port ${port}`);
});
