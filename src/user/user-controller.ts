import { Request, Response } from "express";
import userModel from "./user-model";
import { UserCreate, UserCreated, UserGet, UserGetDetail, Language, UserLanguage, UserUpdateInfo, UserUpdateLanguage, UserUpdateLanguage2 } from "../globals";
import appointmentModel from "../appointment/appointment-model";

// CONTROLLER FUNCTIONS
export default {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Deconstructing data received
      const { uid, email, firstName, lastName }: UserCreate = req.body;
      
      // Registering user data to database
      const userCreated: UserCreated = await userModel.createUser({ uid, email, firstName, lastName });
      console.log(userCreated);
      
      // Registering user language to database
        // currently only run if language is being registered, subject to change
      if (req.body.languages) {
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
        console.log(userLanguage);
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
      const data: UserGet | null = await userModel.getUser(uid);

      res.status(200).send(JSON.stringify(data));
    } catch {
      res.status(500).send("Failed to get user");
    }
  },

  async getUserDetail(req: Request, res: Response): Promise<void> {
    try {
      const uid: string = req.params.uid;
      const data: UserGetDetail | null = await userModel.getUserDetail(uid);

      const clientThumbs = await appointmentModel.calcTotalThumb(data?.id, 'client');

      const sentData = clientThumbs;
      res.status(200).send(JSON.stringify(sentData));
    } catch {
      res.status(500).send("Failed to get user detail");
    }
  },

  async updateUserInfo(req: Request, res: Response): Promise<void> {
    try {
      // Update user info
      const { uid, userId, firstName, lastName, about }: UserUpdateInfo = req.body;
      await userModel.updateUserInfo({ userId, firstName, lastName, about });

      // Update language
      const updatedLanguages: UserUpdateLanguage[] = req.body.languages;
      for (const language of updatedLanguages) {
        const changedLanguage: UserUpdateLanguage2 = {
            id: language.id || 0,
              // this assigns id 0 if the language is new
            userId: userId,
            language: language.language,
            proficiency: language.proficiency,
            certifications: language.certifications,
        }
        console.log(changedLanguage);
        await userModel.updateUserLanguage(changedLanguage);
          // update can only be done per record, so have to use loop
      }

      res.status(200).send(JSON.stringify("User info updated"));
    } catch {
      res.status(500).send("Failed to update user");
    }
  },
};







