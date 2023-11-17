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