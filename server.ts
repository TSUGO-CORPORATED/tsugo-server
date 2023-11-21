// IMPORTING MODULES
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// CONFIGURE MODULES
const app: Express = express();
dotenv.config({path: "./.env"}); 

// USING MIDDLEWARE
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server, Yo! Hello');
  });

// INITIATE SERVER
const PORT: string = process.env.PORT || "8080";
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));

// IMPORTING DATABASE CONTROLLER
import userController from "./src/user/user-controller";

// User
app.get('/user/:email', userController.getUser);
  // to access: http://localhost:8080/user/abc@gmail.com
  // this has parameter "id" that must be specified
  // will return an object containing the user id, email, first name and last name
  // ex: {id:31, email:"client1@gmail.com", firstName:"firstname123", lastName:"lastname123"}
app.post('/user', userController.createUser);
  // to access: http://localhost:8080/user
  // body, raw, json
  // ex: {email: "testemail", firstName: "firstname", lastName: "lastname"}