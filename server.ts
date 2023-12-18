// IMPORTING MODULES
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import http from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from 'peer';

// IMPORTING DATABASE CONTROLLER
import messageController from "./src/message/message-controller";
import router from "./src/routes";

// CONFIGURE MODULES
const app: Express = express();
dotenv.config({path: "./.env"}); 

// USING MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use('/', router);

// WEBSOCKET
const server = http.createServer(app);
const io = new Server(server, {
  cors: {origin: "*"}
});
const peerServer = ExpressPeerServer(server, {});
app.use('/peerjs', peerServer);

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
  });

  socket.on('video-join', (userId) => {
    const userRoom = [...socket.rooms.values()];
    socket.to(userRoom[1]).emit('connect-user', userId);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});


// INITIATE SERVER
const PORT: string = process.env.PORT || "8080";
server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));

