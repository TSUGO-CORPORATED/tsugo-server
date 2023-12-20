// IMPORTING MODULES
import request, { Response } from 'supertest';
import express, { Express } from 'express';
import router from '../routes';
import cors from "cors";
import { PrismaClient } from '@prisma/client';


// INITIATING PRISMA
const prisma = new PrismaClient();


// INTERFACE
interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
}

// SEED DATA
const createUser: User = {
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
  let userFixture: User | null;

  // Before each, insert data
  beforeEach(async () => {
    userFixture = createUser;
    await request(app)
      .post('/user')
      .send(createUser)
      .then((result) => {
        // console.log("inserted test customer");
      })
      .catch(console.error);
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
      it('should return true', async () => {
        const res = await request(app)
          .get(`/user/check/${createUser.email}`)
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('true');
      });
    });

   describe('When user does not exist', () => {
      it('should return false', async () => {
        const res = await request(app)
          .get('/user/check/randomemail');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('false');
      })
   });
  });
  
  describe('Get user basic info', () => {
    describe('When user exist', () => {
      it('should return an object', async () => {
        const res = await request(app)
          .get(`/user/${createUser.uid}`);
        const userData = JSON.parse(res.text);
        // console.log(res.text);
        // console.log(userData);
        expect(res.statusCode).toBe(200);
        expect(typeof userData).toBe("object");
      });

      it('the object returned should only contain id, firstName, lastName', async () => {
        const res = await request(app)
          .get(`/user/${createUser.uid}`);
        const userData = JSON.parse(res.text);
        expect(userData).toHaveProperty('id');
        expect(userData).toHaveProperty('firstName');
        expect(userData).toHaveProperty('lastName');
        expect(userData.firstName).toBe(createUser.firstName);
        expect(userData.lastName).toBe(createUser.lastName);
      });
    });

    describe('Get user detail', () => {
      describe('When user exist', () => {
        it('should return an object', async () => {
          const res = await request(app)
            .get(`/user/detail/${createUser.uid}`);
          const userData = JSON.parse(res.text);
          expect(res.statusCode).toBe(200);
          expect(typeof userData).toBe("object");
        });

        it('the object returned should only contain various information', async () => {
          const res = await request(app)
            .get(`/user/detail/${createUser.uid}`);
          const userData = JSON.parse(res.text);
          expect(userData).toHaveProperty('id');
          expect(userData).toHaveProperty('email');
          expect(userData).toHaveProperty('firstName');
          expect(userData).toHaveProperty('lastName');
          expect(userData).toHaveProperty('profilePicture');
          expect(userData).toHaveProperty('about');
          expect(userData).toHaveProperty('userLanguage');
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
      const newUser: User = {
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
      
      const data: User | null = await prisma.user.findUnique({
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

  });

});
