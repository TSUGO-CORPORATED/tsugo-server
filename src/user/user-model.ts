import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async getUser(email: string) {        
    async function prismaGetUser(email: string) {
      return await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        }
      });
    }
    const data = await prismaGetUser(email)
      .then(async (res) => {
        await prisma.$disconnect();
        // console.log(res);
        return res;
      })
      .catch(async (err) => {
        // console.error(e)
        await prisma.$disconnect();
        process.exit(1);
      });
    return data;
  },

  async createUser(email: string, firstName: string, lastName: string) {
    async function prismaCreateUser(email: string, firstName: string, lastName: string) {
      return await prisma.user.create({
        data: {
          email: email,
          firstName: firstName,
          lastName: lastName,
        }
      });
    }
    
    const data = await prismaCreateUser(email, firstName, lastName)
      .then(async (res) => {
        await prisma.$disconnect();
        // console.log(res);
        return res;
      })
      .catch(async (err) => {
        // console.error(e)
        await prisma.$disconnect();
        process.exit(1);
      });

    return data;
  }
};