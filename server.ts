// IMPORTING MODULES
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Socket } from "socket.io";
const http = require("http");
const {Server} = require("socket.io");

// CONFIGURE MODULES
const app: Express = express();
dotenv.config({path: "./.env"}); 
const server = http.createServer(app);
const io = new Server(server);

// USING MIDDLEWARE
app.use(express.json());
app.use(cors());

// WEBSOCKET
io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    console.log("a user posted: " + msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

// IMPORTING DATABASE CONTROLLER
import userController from "./src/user/user-controller";

// Test
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript (AND WEBSOCKETS :)) Server, Yo! Hello');
});

// User
// Create user
app.post('/user', userController.createUser);
  // to access: http://localhost:8080/user
  // body, raw, json
  // ex: {"uid": "als;djad234234", "email": "testemail8", "firstName": "firstname", "lastName": "lastname", "languages": [{"language": "English", "proficiency": "conversational"}]}
  // the language must be in an array containing objects
// Get user information
app.get('/user/:uid', userController.getUser);
  // to access: http://localhost:8080/user/sdfa191asdf1a9s1df
  // this has parameter "uid" that must be specified
  // will return an object containing the user id, uid, email, first name and last name
  // ex: {id:31, uid:"als;dnv189", email:"client1@gmail.com", firstName:"firstname123", lastName:"lastname123"}


  // INITIATE SERVER
const PORT: string = process.env.PORT || "8080";
server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));

