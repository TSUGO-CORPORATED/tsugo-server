import { PrismaClient } from '@prisma/client';
import { UserCreate, UserLanguage, UserReturn, UserUpdateInfo } from '../globals';

const prisma = new PrismaClient();

// MODEL FUNCTIONS
export default {
  async createUser({ uid, email, firstName, lastName }: UserCreate) {
    const data = await prisma.user.create({
      data: {
        uid: uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
      }
    }); 

    return data;
  },

  async addLanguages(userLanguage: UserLanguage[]) {
    const data = await prisma.userLanguage.createMany({
      data: userLanguage,
    });

    return data;
  },

  async getUser(uid: string) {        
    const data: UserReturn | null = await prisma.user.findFirst({
      where: {
        uid: uid,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      }
    });

    return data;
  },

  async getUserDetail(id: number) {
    const data: UserReturn | null = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        about: true,
        userLanguage: {
          select: {
            id: true,
            language: true,
            proficiency: true,
            certifications: true
          }
        }
      }
    });

    return data;
  },

  async updateUserInfo({ id, firstName, lastName, about }: UserUpdateInfo ) {
    const data = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        about: about,
      }
    });

    return data;
  },
};