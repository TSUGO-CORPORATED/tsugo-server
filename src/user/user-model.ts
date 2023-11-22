import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Data type interface
interface User {
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
}

interface UserLanguage {
  userId: number,
  language: string,
  proficiency: string,
  certifications?: string,
}

export default {
  async createUser({ uid, email, firstName, lastName }: User) {
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
    const data = await prisma.user.findFirst({
      where: {
        uid: uid,
      },
      select: {
        id: true,
        uid: true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });

    return data;
  },
};