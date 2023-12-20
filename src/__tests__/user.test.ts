// IMPORTING MODULES
import request, { Response } from 'supertest';
import express, { Express } from 'express';
import router from '../routes';
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import { AppointmentCreate, UserCreate, UserGet, UserGetDetail, UserUpdateInfo, UserUpdateInfo2 } from '../globals';
import { Decimal, DecimalJsLike } from '@prisma/client/runtime/library';

// INITIATING PRISMA
const prisma = new PrismaClient();

// SEED DATA
const createUser: UserCreate = {
  uid: 'testuid1000',
  email: 'testemail1000',
  firstName: 'testfirstname1000',
  lastName: 'testLastName1000'
}

// RUNNING TEST LOCALLY
// a separate server is created to avoid conflict with main server
const app: Express = express();
app.use(express.json());
app.use(cors());
app.use('/', router);


// TESTING FOR SERVER AVAILABILITY
describe('Server', function () {
  test('responds to /', async () => {
    const res: Response = await request(app).get('/');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('Express + TypeScript (AND WEBSOCKETS :)) Server, Yo! Hello');
    // console.log(res.text);
  });
});

// TESTING FOR USER PATH
describe('User', function () {
  // Before each, insert data
  beforeEach(async () => {
    // await request(app)
    //   .post('/user')
    //   .send(createUser)
    //   .then((result) => {
    //     // console.log("inserted test customer");
    //   })
    //   .catch(console.error);
    await prisma.user.create({
      data: createUser,
    });
  });

  // After each, remove data
  afterEach(async () => {
    try {
      await prisma.user.delete({
        where: {
          uid: 'testuid1000'
        }
      })
    } catch (err) {
      console.log(err);
    }
  });

  describe('Check user', () => {
    describe('When user exist', () => {
      test('should return true', async () => {
        const res: Response = await request(app)
          .get(`/user/check/${createUser.email}`);
        const check: boolean = JSON.parse(res.text);
        expect(res.statusCode).toBe(200);
        expect(check).toBe(true);
      });
    });

    describe('When user does not exist', () => {
      test('should return false', async () => {
        const res: Response = await request(app)
          .get('/user/check/randomemail');
        const check: boolean = JSON.parse(res.text)
        expect(res.statusCode).toBe(200);
        expect(check).toBe(false);
      })
    });
  });
  
  describe('Get user basic info', () => {
    describe('When user exist', () => {
      test('should return an object', async () => {
        const res: Response = await request(app)
          .get(`/user/${createUser.uid}`);
        const userData: UserGet = JSON.parse(res.text);
        // console.log(res.text);
        // console.log(userData);
        expect(res.statusCode).toBe(200);
        expect(typeof userData).toBe("object");
      });

      test('the object returned should only contain id, firstName, lastName', async () => {
        const res: Response = await request(app)
          .get(`/user/${createUser.uid}`);
        const userData: UserGet = JSON.parse(res.text);
        expect(userData).toHaveProperty('id');
        expect(userData).toHaveProperty('firstName');
        expect(userData).toHaveProperty('lastName');
        expect(userData.firstName).toBe(createUser.firstName);
        expect(userData.lastName).toBe(createUser.lastName);
      });
    });

    describe('Get user detail', () => {
      describe('When user exist', () => {
        test('should return an object', async () => {
          const res: Response = await request(app)
            .get(`/user/detail/${createUser.uid}`);
          const userData: UserGetDetail = JSON.parse(res.text);
          expect(res.statusCode).toBe(200);
          expect(typeof userData).toBe("object");
        });

        it('the object returned should only contain various information', async () => {
          const res: Response = await request(app)
            .get(`/user/detail/${createUser.uid}`);
          const userData: UserGetDetail = JSON.parse(res.text);
          expect(userData).toHaveProperty('id');
          expect(userData).toHaveProperty('email');
          expect(userData).toHaveProperty('firstName');
          expect(userData).toHaveProperty('lastName');
          expect(userData).toHaveProperty('profilePicture');
          expect(userData).toHaveProperty('about');
          expect(userData).toHaveProperty('userLanguage');
          expect(userData).toHaveProperty('clientTotalThumbsUp');
          expect(userData).toHaveProperty('clientTotalThumbsDown');
          expect(userData).toHaveProperty('interpreterTotalThumbsUp');
          expect(userData).toHaveProperty('interpreterTotalThumbsDown');
        });
      });
    });
  });

  describe('Create user', () => {
    afterAll( async () => {
      try {
        await prisma.user.delete({
          where: {
            uid: 'testuid1500'
          }
        });
      } catch (err) {
        console.log(err);
      }
    });

    test('It should create a new user', async () => {
      const newUser: UserCreate = {
        uid: 'testuid1500',
        email: 'testemail1500',
        firstName: 'testfirstname1500',
        lastName: 'testLastName1500'
      }

      const res: Response = await request(app)
        .post('/user')
        .send(newUser);
      expect(res.statusCode).toBe(201);
      expect(res.text).toEqual('User created in backend database');
      
      const data: UserCreate | null = await prisma.user.findUnique({
        where: {
          uid: newUser.uid,
        },
        select: {
          uid: true,
          email: true,
          firstName: true,
          lastName: true,
        }
      });
      expect(data).toEqual(newUser);
    });
  });

  describe('Update user', () => {
    test('It should be able to update the user data', async () => {
      const userData = await prisma.user.findUnique({
        where: {
          uid: createUser.uid,
        },
        select: {
          id: true
        }
      });

      const updateUser: UserUpdateInfo  = {
        uid: 'testuid1000',
        userId: userData?.id,
        firstName: 'testfirstname1000update',
        lastName: 'testLastName1000update',
        about: 'aboutupdate'
      }

      const res: Response = await request(app)
        .put('/user')
        .send(updateUser);
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual("User info updated");
      const data = await prisma.user.findUnique({
        where: {
          id: userData?.id,
        },
        select: {
          uid: true,
          id: true,
          firstName: true,
          lastName: true,
          about: true,
        }
      });
      const processedData = {
        uid: data?.uid,
        userId: data?.id,
        firstName: data?.firstName,
        lastName: data?.lastName,
        about: data?.about
      }
      expect(updateUser).toEqual(processedData);
    });
  });

  describe('Delete user', () => {
    test('It should delete user, by modifying its info', async () => {
      const res: Response = await request(app)
        .delete(`/user/${createUser.uid}`);
      expect(res.statusCode).toBe(204);
      const data = await prisma.user.findUnique({
        where: {
          uid: createUser.uid,
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          about: true,
        }
      });
      const expectedData = {
        email: `Deleted user ${createUser.uid}`,
        firstName: 'Deleted user',
        lastName: 'Deleted user',
        about: 'Deleted user',
      }
      expect(data).toEqual(expectedData);
    });
  });
});
