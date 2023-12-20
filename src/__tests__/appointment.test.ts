// IMPORTING MODULES
import request, { Response } from 'supertest';
import express, { Express } from 'express';
import router from '../routes';
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import { AppointmentCreate, AppointmentDetail, AppointmentOverview, UserCreate, UserGet, UserGetDetail, UserUpdateInfo, UserUpdateInfo2 } from '../globals';
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
const createAppointment: AppointmentCreateTest = {
  appointmentTitle: "review test",
  appointmentType: "In-person",
  mainCategory: "Business", 
  subCategory: "sub-business",
  status: 'Requested',
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

// RUNNING TEST LOCALLY
// a separate server is created to avoid conflict with main server
const app: Express = express();
app.use(express.json());
app.use(cors());
app.use('/', router);


// TESTING FOR APPOINTMENT PATH
describe('Appointment', function () {
  let appointment: AppointmentReturnTest | null;

  // Before each, insert data
  beforeEach(async () => {
    appointment = await prisma.appointment.create({
      data: createAppointment,
    });
  });

  // After each, remove data
  afterEach(async () => {
    try {
      await prisma.appointment.delete({
        where: {
          id: appointment?.id,
        }
      })
    } catch (err) {
      console.log(err);
    }
  });
  describe('Find appointment', function () {
    test('should return an array of appointment', async () => {
      const res: Response = await request(app)
        .get(`/appointment/find/${createAppointment.clientUserId + 1}`);
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
        .get(`/appointment/find/${createAppointment.clientUserId + 1}`);
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
        .get(`/appointment/overview/client/current/${createAppointment.clientUserId}`);
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
      expect(res.text).toEqual('Appointment created in backend database')
    });
  });
});