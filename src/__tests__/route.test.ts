import request from 'supertest';
import express, { Express } from 'express';
import router from '../routes';

// RUNNING TEST LOCALLY
// a separate server is created to avoid conflict with main server
const app: Express = express();
app.use('/', router);

// TESTING FOR USER PATH
describe('Good Home Routes', function () {

  test('responds to /', async () => {
    const res = await request(app).get('/');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('Express + TypeScript (AND WEBSOCKETS :)) Server, Yo! Hello');
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