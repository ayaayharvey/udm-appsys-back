import express, { Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/route";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { configureSocket } from "./src/config/socket";
import cron from "node-cron";
const socket_1 = require("./src/config/socket");

const app = express();
const server = http.createServer(app);
configureSocket(server);

// to access .env file.
dotenv.config();
// for cross origin sharing.
app.use(cors());
// to parse body from client.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
// to access every endpoints or api route made in server.

app.use(routes);
const io = (0, socket_1.getIO)();

cron.schedule("0 12 * * *", () => {
  io.emit("guard_appointment_update");
  console.log("Fetch check for 12pm");
});

cron.schedule("0 17 * * *", () => {
  io.emit("guard_appointment_update");
  console.log("Fetch check for 5pm");
});

server.listen(process.env.APP_PORT, () => {
  console.log("server is running");
});
