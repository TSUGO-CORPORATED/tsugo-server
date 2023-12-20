// IMPORTING MODULES
import request, { Response } from 'supertest';
import express, { Express } from 'express';
import router from '../routes';
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import { AppointmentCreate, AppointmentDetail, AppointmentOverview, UserCreate, UserCreated, UserGet, UserGetDetail, UserUpdateInfo, UserUpdateInfo2 } from '../globals';
import { Decimal, DecimalJsLike } from '@prisma/client/runtime/library';

// INITIATING PRISMA
const prisma = new PrismaClient();

// CUSTOM INTERFACE
interface AppointmentCreateTest {
  appointmentTitle: string,
  appointmentType: string,
  clientUserId: number,
  clientSpokenLanguage: string,
  mainCategory: string | null,
  subCategory: string | null,
  status: string,
  interpreterSpokenLanguage: string,
  locationName?: string | null,
  locationAddress?: string | null,
  locationLatitude?: string | number | Decimal | DecimalJsLike | null,
  locationLongitude?: string | number | Decimal | DecimalJsLike | null,
  appointmentDateTime: string,
  appointmentNote: string | null,
}

interface AppointmentReturnTest {
  id: number,
  appointmentTitle: string,
  appointmentType: string,
  clientUserId: number,
  clientSpokenLanguage: string,
  mainCategory: string | null,
  subCategory: string | null,
  status: string,
  interpreterSpokenLanguage: string,
  locationName?: string | null,
  locationAddress?: string | null,
  locationLatitude?: string | number | Decimal | DecimalJsLike | null,
  locationLongitude?: string | number | Decimal | DecimalJsLike | null,
  appointmentDateTime: Date,
  appointmentNote: string | null,
}

// SEED DATA
const createUserClient: UserCreate = {
  uid: 'testuid1555',
  email: 'testemail1555',
  firstName: 'testfirstname1000',
  lastName: 'testLastName1000'
}

const createUserInterpreter: UserCreate = {
  uid: 'testuid1566',
  email: 'testemail1566',
  firstName: 'testfirstname1000',
  lastName: 'testLastName1000'
}

// RUNNING TEST LOCALLY
// a separate server is created to avoid conflict with main server
const app: Express = express();
app.use(express.json());
app.use(cors());
app.use('/', router);


// TESTING FOR APPOINTMENT PATH
describe('Appointment', function () {
  let appointment: AppointmentReturnTest | null;
  let client: UserCreated | null;
  let interpreter: UserCreated | null;

  // Before each, insert data
  beforeEach(async () => {
    client = await prisma.user.create({
      data: createUserClient
    });
    interpreter = await prisma.user.create({
      data: createUserInterpreter
    });
    appointment = await prisma.appointment.create({
      data: {
        appointmentTitle: "review test",
        appointmentType: "In-person",
        mainCategory: "Business", 
        subCategory: "sub-business",
        status: 'Requested',
        clientUserId: client?.id,
        clientSpokenLanguage: "English",
        interpreterSpokenLanguage: "Japanese",
        locationName: "Code Chrysalis",
        locationAddress: "test address",
        locationLatitude: 123124,
        locationLongitude: 4548237,
        appointmentDateTime: "2023-12-25T10:29:02.366Z",
        appointmentNote: "test3"
      }
    });
  });

  // After each, remove data
  afterEach(async () => {
    try {
      await prisma.appointment.delete({
        where: {
          id: appointment?.id,
        }
      });
      await prisma.user.delete({
        where: {
          id: client?.id,
        }
      });
      await prisma.user.delete({
        where: {
          id: interpreter?.id,
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
  describe('Find appointment', function () {
    test('should return an array of appointment', async () => {
      const res: Response = await request(app)
        .get(`/appointment/find/${interpreter?.id}`);
      const appointmentData: AppointmentReturnTest[] = JSON.parse(res.text);
      // console.log(res.text);
      expect(res.statusCode).toBe(200);
      expect(appointmentData[0]).toHaveProperty('id');
      expect(appointmentData[0]).toHaveProperty('status');
      expect(appointmentData[0]).toHaveProperty('appointmentTitle');
      expect(appointmentData[0]).toHaveProperty('appointmentType');
      expect(appointmentData[0]).toHaveProperty('appointmentDateTime');
      expect(appointmentData[0]).toHaveProperty('mainCategory');
      expect(appointmentData[0]).toHaveProperty('subCategory');
      expect(appointmentData[0]).toHaveProperty('locationName');
      expect(appointmentData[0]).toHaveProperty('locationLatitude');
      expect(appointmentData[0]).toHaveProperty('locationLongitude');
      expect(appointmentData[0]).toHaveProperty('clientSpokenLanguage');
      expect(appointmentData[0]).toHaveProperty('interpreterSpokenLanguage');
    });

    test('should not have expired appointment', async () => {
      const res: Response = await request(app)
        .get(`/appointment/find/${interpreter?.id}`);
      const appointmentData: AppointmentReturnTest[] = JSON.parse(res.text);
      // console.log(appointmentData);
      const expiredAppointment = appointmentData.filter(appointment => {
        const appointmentTime = new Date(appointment.appointmentDateTime)
        if (appointmentTime < new Date()) return true;
        else return false;
        // console.log(appointmentTime, new Date());
      });
      expect(expiredAppointment[0]).toBeFalsy();
      // console.log(expiredAppointment);
    });
  });

  describe('Get overview appointment', function () {
    test('should return an array containing object of appointment overview', async () => {
      const res: Response = await request(app)
        .get(`/appointment/overview/client/current/${client?.id}`);
      const appointmentData: AppointmentOverview[] = JSON.parse(res.text);
      // console.log(appointmentData);
      expect(res.statusCode).toBe(200);
      expect(appointmentData[0]).toHaveProperty('id');
      expect(appointmentData[0]).toHaveProperty('status');
      expect(appointmentData[0]).toHaveProperty('appointmentTitle');
      expect(appointmentData[0]).toHaveProperty('appointmentType');
      expect(appointmentData[0]).toHaveProperty('appointmentDateTime');
      expect(appointmentData[0]).toHaveProperty('mainCategory');
      expect(appointmentData[0]).toHaveProperty('subCategory');
      expect(appointmentData[0]).toHaveProperty('locationName');
      expect(appointmentData[0]).toHaveProperty('locationLatitude');
      expect(appointmentData[0]).toHaveProperty('locationLongitude');
      expect(appointmentData[0]).toHaveProperty('clientSpokenLanguage');
      expect(appointmentData[0]).toHaveProperty('interpreterSpokenLanguage');
    });
  });

  describe('Get appointment detail', function () {
    test('should return an object of appointment detail', async () => {
      const res: Response = await request(app)
        .get(`/appointment/detail/${appointment?.id}`);
      const appointmentData: AppointmentDetail = JSON.parse(res.text);
      // console.log(appointmentData);
      expect(res.statusCode).toBe(200);
      expect(appointmentData).toHaveProperty('id');
      expect(appointmentData).toHaveProperty('status');
      expect(appointmentData).toHaveProperty('appointmentTitle');
      expect(appointmentData).toHaveProperty('appointmentType');
      expect(appointmentData).toHaveProperty('appointmentDateTime');
      expect(appointmentData).toHaveProperty('mainCategory');
      expect(appointmentData).toHaveProperty('subCategory');
      expect(appointmentData).toHaveProperty('clientUserId');
      expect(appointmentData).toHaveProperty('clientUser');
      expect(appointmentData).toHaveProperty('interpreterUserId');
      expect(appointmentData).toHaveProperty('interpreterUser');
      expect(appointmentData).toHaveProperty('locationName');
      expect(appointmentData).toHaveProperty('locationAddress');
      expect(appointmentData).toHaveProperty('locationLatitude');
      expect(appointmentData).toHaveProperty('locationLongitude');
      expect(appointmentData).toHaveProperty('clientSpokenLanguage');
      expect(appointmentData).toHaveProperty('interpreterSpokenLanguage');
      expect(appointmentData).toHaveProperty('appointmentNote');
      expect(appointmentData).toHaveProperty('reviewClientThumb');
      expect(appointmentData).toHaveProperty('reviewClientNote');
      expect(appointmentData).toHaveProperty('reviewInterpreterThumb');
      expect(appointmentData).toHaveProperty('reviewInterpreterNote');
    });
  });

  describe('Patch appointment status to accept', function () {
    test('should succeed', async () => {
      const res: Response = await request(app)
        .patch(`/appointment/accept/${appointment?.id}/${interpreter?.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('Appointment accepted');
    });

    test('status should be accepted', async () => {
      const res: Response = await request(app)
        .patch(`/appointment/accept/${appointment?.id}/${interpreter?.id}`);
      const data: { status: string } | null = await prisma.appointment.findUnique({
        where: {
          id: appointment?.id,
        },
        select: {
          status: true,
        }
      });
      expect(data?.status).toEqual('Accepted');
    });
  });

  describe('Patch appointment status to cancel', function () {
    test('should change status of the appointment to accept', async () => {
      const res: Response = await request(app)
        .patch(`/appointment/cancel/${appointment?.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('Appointment cancelled');
    });

    test('status should be cancelled', async () => {
      const res: Response = await request(app)
        .patch(`/appointment/cancel/${appointment?.id}`);
      const data: { status: string } | null = await prisma.appointment.findUnique({
        where: {
          id: appointment?.id,
        },
        select: {
          status: true,
        }
      });
      expect(data?.status).toEqual('Cancelled');
    });
  });

  describe('Patch appointment status to complete', function () {
    test('should change status of the appointment to complete', async () => {
      const res: Response = await request(app)
        .patch(`/appointment/complete/${appointment?.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('Appointment completed');
    });

    test('status should be completed', async () => {
      const res: Response = await request(app)
        .patch(`/appointment/complete/${appointment?.id}`);
      const data: { status: string } | null = await prisma.appointment.findUnique({
        where: {
          id: appointment?.id,
        },
        select: {
          status: true,
        }
      });
      expect(data?.status).toEqual('Completed');
    });
  });

  describe('Add review', function () {
    test('should be able to add review', async () => {
      const res: Response = await request(app)
        .patch(`/appointment/review`)
        .send({
          appointmentId: appointment?.id,
          role: "client",
          reviewThumb: true,
          reviewNote: "test"
        });
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('Review added');
      const data: { reviewClientThumb: boolean | null, reviewClientNote: string | null} | null = await prisma.appointment.findUnique({
        where: {
          id: appointment?.id,
        },
        select: {
          reviewClientThumb: true,
          reviewClientNote: true
        }
      });
      expect(data?.reviewClientThumb).toEqual(true);
      expect(data?.reviewClientNote).toEqual('test');
    });
  });

  describe('Update appointment', function () {
    test('It should be albe to update appointment data', async () => {
      const updateAppointmentData = {
        id: appointment?.id,
        appointmentTitle: 'update title',
        appointmentType: "In-person",
        mainCategory: "Business", 
        subCategory: "sub-business",
        clientUserId: 68,
        clientSpokenLanguage: "English",
        interpreterSpokenLanguage: "Japanese",
        locationName: "Code Chrysalis",
        locationAddress: "test address",
        locationLatitude: 123124,
        locationLongitude: 4548237,
        appointmentDateTime: "2023-12-25T10:29:02.366Z",
        appointmentNote: "test3"
      }

      const res: Response = await request(app)
        .put('/appointment')
        .send(updateAppointmentData);
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('Appointment data updated');
    });
  });

  describe('Create appointment', function () {
    afterAll( async () => {
      try {
        await prisma.appointment.deleteMany({
          where: {
            appointmentTitle: 'appointment test 1600'
          }
        });
      } catch (err) {
        console.log(err);
      }
    });

    test('It should create a new appointmnet', async () => {
      const newAppointment: AppointmentCreate = {
        appointmentTitle: "appointment test 1600",
        appointmentType: "In-person",
        mainCategory: "Business", 
        subCategory: "sub-business",
        clientUserId: 68,
        clientSpokenLanguage: "English",
        interpreterSpokenLanguage: "Japanese",
        locationName: "Code Chrysalis",
        locationAddress: "test address",
        locationLatitude: 123124,
        locationLongitude: 4548237,
        appointmentDateTime: "2023-12-25T10:29:02.366Z",
        appointmentNote: "test3"
      }

      const res: Response = await request(app)
        .post('/appointment')
        .send(newAppointment);
      expect(res.statusCode).toBe(201);
      expect(res.text).toEqual('Appointment created in backend database');
    });
  });
});