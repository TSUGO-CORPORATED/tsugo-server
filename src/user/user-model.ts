import { PrismaClient } from '@prisma/client';
import { UserCreate, UserLanguage, UserCreated, UserGet, UserGetDetail, UserUpdateInfo2, UserUpdateLanguage2, UserCheck } from '../globals';

const prisma = new PrismaClient();

// MODEL FUNCTIONS
export default {
  async createUser({ uid, email, firstName, lastName }: UserCreate) {
    const data: UserCreated = await prisma.user.create({
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
    await prisma.userLanguage.createMany({
      data: userLanguage,
    });
  },

  async checkUser(email: string) {
    const data: UserCheck | null = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email: email,
      }
    });

    return data;
  },

  async getUser(uid: string) {        
    const data: UserGet | null = await prisma.user.findUnique({
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

  async getUserDetail(uid: string) {
    const data: UserGetDetail | null = await prisma.user.findUnique({
      where: {
        uid: uid,
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

  async updateUserInfo({ userId, firstName, lastName, about }: UserUpdateInfo2 ) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        about: about,
      }
    });
  },

  async updateUserLanguage(changedLanguage: UserUpdateLanguage2) {
    await prisma.userLanguage.upsert({
      where: {
        id: changedLanguage.id,
      },
      update: {
        language: changedLanguage.language,
        proficiency: changedLanguage.proficiency,
        certifications: changedLanguage.certifications,
      },
      create: {
        userId: changedLanguage.userId,
        language: changedLanguage.language,
        proficiency: changedLanguage.proficiency,
        certifications: changedLanguage.certifications,
      },
    });
  },

  async deleteUserUpdateUserInfo(uid: string) {
    const data: {id: number} = await prisma.user.update({
      select: {
        id: true,
      },
      where: {
        uid: uid,
      },
      data: {
        email: `Deleted user ${uid}`,
        firstName: 'Deleted user',
        lastName: 'Deleted user',
        about: 'Deleted user',
      },
    });
    return data.id;
  },

  async deleteUserDeleteUserLanguage(userId: number) {
    await prisma.userLanguage.deleteMany({
      where: {
        userId: userId,
      },
    })
  },

  async deleteUserUpdateMessage(userId: number) {
    await prisma.message.updateMany({
      where: {
        userId: userId,
      },
      data: {
        content: "Deleted user"
      }
    })
  }
};