import { Request, Response } from "express";
import userModel from "./user-model";

export default {
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const email: string = req.params.email
      const data = await userModel.getUser(email);

      res.status(200).send(JSON.stringify(data));
    } catch {
      res.status(500).send("Failed to get user");
    }
  },

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      interface user {
        email: string,
        firstName: string,
        lastName: string,
      }

      const { email, firstName, lastName }: user = req.body;

      userModel.createUser(email, firstName, lastName);

      res.status(201).send("User created in backend database");
    } catch {
      res.status(401).send("Cannot register new user");
    }
  }
};







