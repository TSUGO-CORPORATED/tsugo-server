import { Request, Response } from "express";
import userModel from "./user-model";

// Data type interface
interface UserInput {
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
}

interface UserCreated {
  id: number;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: Buffer | null;
  about: string | null;
}

interface Language {
  language: string,
  proficiency: string,
  certifications?: string,
}

interface UserLanguage {
  userId: number,
  language: string,
  proficiency: string,
  certifications?: string,
}

export default {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Deconstructing data received
      const { uid, email, firstName, lastName }: UserInput = req.body;
      const languages: Language[] = req.body.languages;

      // Registering user data to database
      const userCreated: UserCreated = await userModel.createUser({ uid, email, firstName, lastName });
      console.log(userCreated);
      console.log(languages);

      // Registering user language to database
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

      res.status(201).send("User created in backend database");
    } catch {
      res.status(401).send("Cannot register new user");
    }
  },

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const uid: string = req.params.uid
      const data = await userModel.getUser(uid);

      res.status(200).send(JSON.stringify(data));
    } catch {
      res.status(500).send("Failed to get user");
    }
  },
};







