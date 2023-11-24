import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DATA TYPE INTERFACES
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

interface UserReturn {
  id: number,
  firstName: string,
  lastName: string,
}

// MODEL FUNCTIONS
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
};