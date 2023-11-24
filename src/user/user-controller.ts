import { Request, Response } from "express";
import userModel from "./user-model";
import { UserCreate, UserCreated, UserReturn, Language, UserLanguage, UserUpdateInfo, UserUpdateLanguage } from "../globals";

// CONTROLLER FUNCTIONS
export default {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Deconstructing data received
      const { uid, email, firstName, lastName }: UserCreate = req.body;
      
      // Registering user data to database
      const userCreated: UserCreated = await userModel.createUser({ uid, email, firstName, lastName });
      // console.log(userCreated);
      
      // Registering user language to database
        // currently only run if language is being registered, subject to change
      if (req.body.language) {
        const languages: Language[] = req.body.languages;
        console.log(languages);
        const userLanguage: UserLanguage[] = [];
        for (const language of languages) {
          userLanguage.push({
            userId: userCreated.id,
            language: language.language,
            proficiency: language.proficiency,
            certifications: language.certifications,
          })
        }
        // console.log(userLanguage);
        userModel.addLanguages(userLanguage);
      }

      res.status(201).send("User created in backend database");
    } catch {
      res.status(401).send("Cannot register new user");
    }
  },

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const uid: string = req.params.uid
      const data: UserReturn | null = await userModel.getUser(uid);

      res.status(200).send(JSON.stringify(data));
    } catch {
      res.status(500).send("Failed to get user");
    }
  },

  async getUserDetail(req: Request, res: Response): Promise<void> {
    try {
      const id: number = Number(req.params.id)
      const data: UserReturn | null = await userModel.getUserDetail(id);

      res.status(200).send(JSON.stringify(data));
    } catch {
      res.status(500).send("Failed to get user detail");
    }
  },

  async updateUserInfo(req: Request, res: Response): Promise<void> {
    try {
      // Update user info
      const { id, firstName, lastName, about }: UserUpdateInfo = req.body;
      await userModel.updateUserInfo({ id, firstName, lastName, about });

      // Update user language
      const updatedLanguages: UserUpdateLanguage[] = req.body.languages;
      // await userModel.updateUserLanguage(updatedLanguages);
      // separate existing language, 
      // update 
      // add

      res.status(200).send(JSON.stringify("User info updated"));
    } catch {
      res.status(500).send("Failed to update user");
    }
  },
};







