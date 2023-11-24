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
import appointmentController from "./src/appointment/appointment-controller";

// Test
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript (AND WEBSOCKETS :)) Server, Yo! Hello');
});

// User
// Create user
app.post('/user', userController.createUser);
  // to access: http://localhost:8080/user
  // this path will create a new user
  // body content: {"uid": "als;djad234234", "email": "testemail8", "firstName": "firstname", "lastName": "lastname", "languages": [{"language": "English", "proficiency": "conversational"}]}
  // the language must be in an array containing objects

// Get user information
app.get('/user/:uid', userController.getUser);
  // to access: http://localhost:8080/user/p0Tkul9unvNMKMl7pg9lkDegzJ73
  // this path will return the user information based on uid
  // this has parameter "uid" that must be specified
  // will return an object containing the user id, uid, email, first name and last name
  // ex: {id:31, uid:"als;dnv189", email:"client1@gmail.com", firstName:"firstname123", lastName:"lastname123"}


// Appointment
// Create appointment for client
app.post('/appointment', appointmentController.createAppointment);
  // to access: http://localhost:8080/appointment
  // this path will create a new appointment
  // body content: {"status": "requested", "clientUserId": 51, "clientSpokenLanguage": "English", "interpreterSpokenLanguage": "Japanese", "locationLatitude": 123124, "locationLongitude": 4548237, "appointmentDateTime": "2023-11-23T10:29:02.366Z", "appointmentNote": "test1"}
  // will not return anything, just text

// Find appointment for interpreter
app.get('/appointment', appointmentController.findAppointment);
  // to access: http://localhost:8080/appointment
  // this path will return an array of object containing all appointment with status requested
  // ex: [{"id":3,"status":"Requested","appointmentDateTime":"2023-11-23T10:29:02.366Z","locationLatitude":"123124","locationLongitude":"4548237","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese"}]

// Accept appointment by interpreter
app.patch('/appointment/accept/:appointmentId/:interpreterUserId', appointmentController.acceptAppointment);
  // to access: http://localhost:8080/accept/appointment/1/52
  // this path will update the appointment to ongoing status and assign the appointment with the interpreter id
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

// Get detail appointment data
app.get('/appointment/:appointmentId', appointmentController.getAppointmentDetail);
  // to access: http://localhost:8080/appointment/1
  // this path will return full detail regarding the appointment
  // will return an object containing appointment detail along with details of client and interpreter
  // ex: {"id":1,"status":"Ongoing","clientUser":{"firstName":"first3","lastName":"last3","profilePicture":null},"clientSpokenLanguage":"English","interpreterUser":{"firstName":"first4","lastName":"last4","profilePicture":null},"interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","appointmentDateTime":"2023-11-23T10:29:02.366Z","appointmentNote":"test1","reviewClientRating":null,"reviewClientNote":null,"reviewInterpreterRating":null,"reviewInterpreterNote":null}

// Get current appointment belonging to client
app.get('/appointment/client/current/:userId', appointmentController.getAppointmentClientCurrent);
  // to access: http://localhost:8080/appointment/client/current/51
  // this path will return appointment belonging to the client with status requested and ongoing
  // will return an array containing object that contains id, status, appointmentDateTime, locationLatitude, locationLongitude, clientSpokenLanguage, interpreterSpokenLanguage
  // ex: [{"id":1,"status":"Ongoing","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","appointmentDateTime":"2023-11-23T10:29:02.366Z"}]

// Get history appointment belonging to client  
app.get('/appointment/client/history/:userId', appointmentController.getAppointmentClientHistory);
  // to access: http://localhost:8080/appointment/client/history/51
  // this path will return appointment belonging to the client with status completed and cancelled
  // will return an array containing object that contains id, status, appointmentDateTime, locationLatitude, locationLongitude, clientSpokenLanguage, interpreterSpokenLanguage
  // ex: [{"id":2,"status":"Cancelled","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","appointmentDateTime":"2023-11-23T10:29:02.366Z"}]

// Get current appointment belonging to interpreter
app.get('/appointment/interpreter/current/:userId', appointmentController.getAppointmentInterpreterCurrent);
  // to access: http://localhost:8080/appointment/client/current/51
  // this path will return appointment belonging to the interpreter with status ongoing
  // will return an array containing object of the appointment
  // ex: [{"id":1,"status":"Ongoing","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","appointmentDateTime":"2023-11-23T10:29:02.366Z"},{"id":2,"status":"Ongoing","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","appointmentDateTime":"2023-11-23T10:29:02.366Z"}]

// Get history appointment belonging to interpreter
app.get('/appointment/interpreter/history/:userId', appointmentController.getAppointmentInterpreterHistory);
  // to access: http://localhost:8080/appointment/interpreter/history/52
  // this path will return appointment belonging to the interpreter with status completed and cancelled
  // will return an array containing object that contains id, status, appointmentDateTime, locationLatitude, locationLongitude, clientSpokenLanguage, interpreterSpokenLanguage
  // ex: [{"id":2,"status":"Cancelled","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","appointmentDateTime":"2023-11-23T10:29:02.366Z"}]


  // INITIATE SERVER
const PORT: string = process.env.PORT || "8080";
server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));

