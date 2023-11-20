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

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript (AND WEBSOCKETS :)) Server, Yo! Hello');
  });

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

// INITIATE SERVER
const PORT: string = process.env.PORT || "8080";
server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));