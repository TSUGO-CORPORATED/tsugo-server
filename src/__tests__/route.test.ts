// IMPORTING MODULES
import request from 'supertest';
import express, { Express } from 'express';
import router from '../routes';
import { PrismaClient } from '@prisma/client';
import fixtures from '../fixtures';
import cors from "cors";

// INITIATING PRISMA
const prisma = new PrismaClient();

// RUNNING TEST LOCALLY
// a separate server is created to avoid conflict with main server
const app: Express = express();
app.use(express.json());
app.use(cors());
app.use('/', router);

// TESTING FOR SERVER AVAILABILITY
describe('Server', function () {
  test('responds to /', async () => {
    const res = await request(app).get('/');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('Express + TypeScript (AND WEBSOCKETS :)) Server, Yo! Hello');
    console.log(res.text);
  });
  
  // test('responds to /hello/:name', async () => {
  //   const res = await request(app).get('/hello/jaxnode'); 
  //   expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  //   expect(res.statusCode).toBe(200);
  //   expect(res.text).toEqual('hello jaxnode!');
  // });

  // test('responds to /hello/Annie', async () => {
  //   const res = await request(app).get('/hello/Annie'); 
  //   expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  //   expect(res.statusCode).toBe(200);
  //   expect(res.text).toEqual('hello Annie!');
  // });
});

// TESTING FOR USER PATH
describe('User', function () {
  test('Create user', async () => {
    console.log(fixtures.createUser());
    const res = await request(app)
      .post('/user')
      .send(fixtures.createUser());
    expect(res.statusCode).toBe(201);
    expect(res.text).toEqual('User created in backend database');

    if (res.statusCode === 201) {
      await prisma.user.delete({
        where: {
          uid: 'testuid1000'
        }
      })
    }
  })
});

// console.log(fixtures.getUser());