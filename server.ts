// IMPORTING MODULES
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import http from "http";
import { Server } from "socket.io";
// const http = require("http");
// const {Server} = require("socket.io");

// CONFIGURE MODULES
const app: Express = express();
dotenv.config({path: "./.env"}); 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {origin: "*"}
});

// USING MIDDLEWARE
app.use(express.json());
app.use(cors());

// WEBSOCKET
io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  socket.on("message", async (msg) => {
    const userRoom = [...socket.rooms.values()];
    let parsedMessage = await JSON.parse(msg);
    messageController.socketCreateMessage(parsedMessage.appointment, parsedMessage.user, parsedMessage.content, parsedMessage.timestamp);
    console.log("a user posted: " + parsedMessage.content + " in room: " + userRoom[1]);
    io.to(userRoom[1]).emit("message", msg); //TODO: Send from socket and have it remember it's own message, no need to send to it too
  });

  socket.on("CONNECT_ROOM", async (msg) => {
    let parsedMessage = await JSON.parse(msg);
    socket.join(parsedMessage.room);
    console.log("connected to room");
    //TODO: get by room name instead of number
    let data = await messageController.socketGetMessagesById(parsedMessage.room);
    console.log(data);
    const stringedData = JSON.stringify(data);
    io.to(socket.id).emit("history", stringedData);
  });

  socket.on("DISCONNECT_ROOM", async (msg) => {
    let parsedMessage = await JSON.parse(msg);
    socket.leave(parsedMessage.room);
  })

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

// IMPORTING DATABASE CONTROLLER
import userController from "./src/user/user-controller";
import appointmentController from "./src/appointment/appointment-controller";
import messageController from "./src/message/message-controller";
import { json } from "stream/consumers";

// Test
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript (AND WEBSOCKETS :)) Server, Yo! Hello');
});

// User
// Create user
app.post('/user', userController.createUser);
  // to access: http://localhost:8080/user
  // this path will create a new user
  // body content: {"uid": "testuid", "email": "testemail8", "firstName": "firstname", "lastName": "lastname", "languages": [{"language": "English", "proficiency": "conversational"}, {"language": "Japanese", "proficiency": "native"}]}
  // the language must be in an array containing objects

// Get user information
app.get('/user/:uid', userController.getUser);
  // to access: http://localhost:8080/user/testuid
  // this path will return the user information based on uid
  // this has parameter "uid" that must be specified
  // will return an object containing the user id, first name and last name
  // ex: {"id":55,firstName":"first1","lastName":"last1"}
app.get('/user/detail/:uid', userController.getUserDetail);
  // to access: http://localhost:8080/user/detail/testuid
  // this path will return full user information based on user uid
  // will return an object containing the user full information
  // ex: {"id":55,"email":"test1@gmail.com","firstName":"first1","lastName":"last1","profilePicture":null,"about":null,"userLanguage":[]}
app.put('/user', userController.updateUserInfo);
  // to access: http://localhost:8080/user
  // this path will update user info
  // body content: {"userId": 63, "uid":"testuid", "firstName": "firstname", "lastName": "lastname", "about": "testabout", "languages": [{"id": 6, "language": "English", "proficiency": "conversational"}, {"language": "Japan", "proficiency":"native"}]}
  // in the case wehre new language is added, the id of the language should be left blank
  // about is optional
  // will not return anything, just text

// Appointment
// Create appointment for client
app.post('/appointment', appointmentController.createAppointment);
  // to access: http://localhost:8080/appointment
  // this path will create a new appointment
  // body content: {"appointmentTitle": "testappointmenttitle","appointmentType": "In-person","clientUserId": 63,"clientSpokenLanguage": "English","interpreterSpokenLanguage": "Japanese","locationLatitude": 123124,"locationLongitude": 4548237,"locationDetail": "testlocationdetail","appointmentDateTime": "2023-11-23T10:29:02.366Z","appointmentNote": "test3"}
  // will not return anything, just text
  // appointmentDateTime should be in ISO string

// Find appointment for interpreter
app.get('/appointment/find/:userId', appointmentController.findAppointment);
  // to access: http://localhost:8080/appointment
  // require userId input. this is require to exclude any appointment made by the client itself
  // this path will return an array of object containing all appointment with status requested
  // ex: [{"id":6,"status":"Requested","appointmentTitle":"testappointmenttitle","appointmentType":"In-person","appointmentDateTime":"2023-11-23T10:29:02.366Z","locationLatitude":"123124","locationLongitude":"4548237","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese"}]

  // Get overview appointment data
app.get('/appointment/overview/:role/:timeframe/:userId', appointmentController.getAppointmentOverview);
// to access: http://localhost:8080/appointment/overivew/client/current/55
// role: client or interpreter
// timeframe: current or history
// userId is the id belonging to client or interpreter
// if client, current: return appointment with status requested, accepted
// if client, history: return appointment with status completed, cancelled
// if interpreter, current: return appointment with status accepted
// if interpreter, history: return appointment with status completed, cancelled
// will return an array containing object that contains id, status, appointmentDateTime, locationLatitude, locationLongitude, clientSpokenLanguage, interpreterSpokenLanguage
// ex: [{"id":6,"status":"Requested","appointmentTitle":"testappointmenttitle","appointmentType":"In-person","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","appointmentDateTime":"2023-11-23T10:29:02.366Z"}]

// Get detail appointment data
app.get('/appointment/detail/:appointmentId', appointmentController.getAppointmentDetail);
  // to access: http://localhost:8080/appointment/detail/1
  // this path will return full detail regarding the appointment
  // will return an object containing appointment detail along with details of client and interpreter
  // ex: {"id":6,"status":"Requested","appointmentTitle":"testappointmenttitle","appointmentType":"In-person","clientUserId":1,"clientUser":{"firstName":"firstnameupdate","lastName":"lastname","profilePicture":null},"clientSpokenLanguage":"English","interpreterUserId":2,"interpreterUser":null,"interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","locationDetail":"testlocationdetail","appointmentDateTime":"2023-11-23T10:29:02.366Z","appointmentNote":"test3","reviewClientRating":null,"reviewClientNote":null,"reviewInterpreterRating":null,"reviewInterpreterNote":null}

  // Accept appointment by interpreter
app.patch('/appointment/accept/:appointmentId/:interpreterUserId', appointmentController.acceptAppointment);
  // to access: http://localhost:8080/accept/appointment/1/52
  // this path will update the appointment to accepted status and assign the appointment with the interpreter id
  // this path has no body content
  // will not return anything, just text

// Cancel appointment by client/interpreter
app.patch('/appointment/cancel/:appointmentId', appointmentController.cancelAppointment)
  // to access: http://localhost:8080/appointment/cancel/1
  // this path will cancel the appointment and change the status to cancelled 
  // this path has no body content
  // will not return anything, just text

// Complete appointment by client/interpreter
app.patch('/appointment/complete/:appointmentId', appointmentController.completeAppointment)
  // to access: http://localhost:8080/appointment/complete/1
  // this path will complete the appointment and change the status to completed
  // this path has no body content
  // will not return anything, just text

// Add review
app.patch('/appointment/review', appointmentController.addReview)
  // to access: http://localhost:8080/appointment/review/
  // this path add review to the appointment specified
  // body content: {"appointmentId": 4,"role": "client","reviewRating": 4,"reviewNote": "test"}
  // will not return anything, just text

// Message
// Create new message
app.post('/message', messageController.createMessage);
  // to access: http://localhost:8080/message
  // this path will create a new message in the database 
  // body content: {"appointmentId": 4, "userId": 55, "content": "test message", "messageTimestamp": "2023-11-23T10:29:02.366Z"}
  // the timestamp should be in iso string
// Get all message in according to the appointment
app.get('/message/:appointmentId', messageController.getMessage);
  // to access: http://localhost:8080/message/4
  // this path will return all message associated with the appointment id
  // will return an array containing an object 
  // ex: [{"id":1,"appointmentId":4,"userId":55,"content":"test message","messageTimestamp":"2023-11-23T10:29:02.366Z"}]


// INITIATE SERVER
const PORT: string = process.env.PORT || "8080";
server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));

