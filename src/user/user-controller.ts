import { Request, Response } from "express";
import userModel from "./user-model";
import { UserCheck, UserCreate, UserCreated, UserGet, UserGetDetail, UserUpdateInfo, UserUpdateLanguage, UserUpdateLanguage2 } from "../globals";
import appointmentModel from "../appointment/appointment-model";
import { Language, UserLanguage } from "../globals";

// CONTROLLER FUNCTIONS
export default {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Deconstructing data received
      const { uid, email, firstName, lastName }: UserCreate = req.body;
      // console.log(uid, email, firstName, lastName);
      
      // Registering user data to database
      const userCreated: UserCreated = await userModel.createUser({ uid, email, firstName, lastName });
      // console.log(userCreated);
      
      // Registering user language to database
        // currently only run if language is being registered, subject to change
        // this feature is deactivated for now
      // if (req.body.languages) {
      //   const languages: Language[] = req.body.languages;
      //   console.log(languages);
      //   const userLanguage: UserLanguage[] = [];
      //   for (const language of languages) {
      //     userLanguage.push({
      //       userId: userCreated.id,
      //       language: language.language,
      //       proficiency: language.proficiency,
      //       certifications: language.certifications,
      //     })
      //   }
      //   // console.log(userLanguage);
      //   userModel.addLanguages(userLanguage);
      // }

      res.status(201).send("User created in backend database");
    } catch {
      res.status(401).send("Cannot register new user");
    }
  },

  async checkUser(req: Request, res: Response): Promise<void> {
    try {
      const email: string = req.params.email;

      // Check for user, if available return true, otherwise false
      const data: UserCheck | null = await userModel.checkUser(email);
      let check: boolean = false;
      if (data) check = true;

      res.status(200).send(JSON.stringify(check));
    } catch {
      res.status(500).send("Failed to get user");
    }
  },

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const uid: string = req.params.uid;
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

      if (data) {
        const clientThumbs = await appointmentModel.calcTotalThumbsClient(data?.id);
        const clientTotalThumbsUp1 = clientThumbs.find(x => x.reviewClientThumb === true);
        const clientTotalThumbsUp2 = clientTotalThumbsUp1 ? clientTotalThumbsUp1['_count'] : 0;
        const clientTotalThumbsDown1 = clientThumbs.find(x => x.reviewClientThumb === false);
        const clientTotalThumbsDown2 = clientTotalThumbsDown1 ? clientTotalThumbsDown1['_count'] : 0;

        const interpreterThumbs = await appointmentModel.calcTotalThumbsInterpreter(data?.id);
        const interpreterTotalThumbsUp1 = interpreterThumbs.find(x => x.reviewInterpreterThumb === true);
        const interpreterTotalThumbsUp2 = interpreterTotalThumbsUp1 ? interpreterTotalThumbsUp1['_count'] : 0;
        const interpreterTotalThumbsDown1 = interpreterThumbs.find(x => x.reviewInterpreterThumb === false);
        const interpreterTotalThumbsDown2 = interpreterTotalThumbsDown1 ? interpreterTotalThumbsDown1['_count'] : 0;
  
        data["clientTotalThumbsUp"] = clientTotalThumbsUp2;
        data["clientTotalThumbsDown"] = clientTotalThumbsDown2;
        data["interpreterTotalThumbsUp"] = interpreterTotalThumbsUp2;
        data["interpreterTotalThumbsDown"] = interpreterTotalThumbsDown2;
      }


      res.status(200).send(JSON.stringify(data));
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
      // const updatedLanguages: UserUpdateLanguage[] = req.body.languages;
      // for (const language of updatedLanguages) {
      //   const changedLanguage: UserUpdateLanguage2 = {
      //       id: language.id || 0,
      //         // this assigns id 0 if the language is new
      //       userId: userId,
      //       language: language.language,
      //       proficiency: language.proficiency,
      //       certifications: language.certifications,
      //   }
      //   console.log(changedLanguage);
      //   await userModel.updateUserLanguage(changedLanguage);
      //     // update can only be done per record, so have to use loop
      // }

      res.status(200).send("User info updated");
    } catch {
      res.status(500).send("Failed to update user");
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const uid: string = req.params.uid;

      const userId: number = await userModel.deleteUserUpdateUserInfo(uid); 
      await userModel.deleteUserDeleteUserLanguage(userId); 
      await userModel.deleteUserUpdateMessage(userId); 
      
      res.status(204).send();
    } catch {
      res.status(202).send("Failed to delete user");
    }
  },
};







