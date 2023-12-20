// IMPORTING MODULES
import express, { Router, Express, Request, Response } from 'express';

// IMPORTING DATABASE CONTROLLER
import userController from "./user/user-controller";
import appointmentController from "./appointment/appointment-controller";
import messageController from "./message/message-controller";


const router = Router();

// router.get('/', index);
// router.get('/hello/:name', hello);

// ENDPOINTS
// Test
router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript (AND WEBSOCKETS :)) Server, Yo! Hello');
  });

// User
// Create user
router.post('/user', userController.createUser);
// to access: http://localhost:8080/user
// this path will create a new user
// Language is inactive right now
    // body content: {"uid": "testuid", "email": "testemail8", "firstName": "firstname", "lastName": "lastname", "languages": [{"language": "English", "proficiency": "conversational"}, {"language": "Japanese", "proficiency": "native"}]}
    // the language must be in an array containing objects

// Check user record
router.get('/user/check/:email', userController.checkUser);

// Get user basic information
router.get('/user/:uid', userController.getUser);
// to access: http://localhost:8080/user/testuid
// this path will return the user information based on uid
// this has parameter "uid" that must be specified
// will return an object containing the user id, first name and last name
// ex: {"id":55,firstName":"first1","lastName":"last1"}

// Get user detail information
router.get('/user/detail/:uid', userController.getUserDetail);
// to access: http://localhost:8080/user/detail/testuid
// this path will return full user information based on user uid
// will return an object containing the user full information
// ex: {"id":55,"email":"test1@gmail.com","firstName":"first1","lastName":"last1","profilePicture":null,"about":null,"userLanguage":[],"clientTotalThumbsUp":2,"clientTotalThumbsDown":0,"interpreterTotalThumbsUp":4,"interpreterTotalThumbsDown":1}

// Modify user information
router.put('/user', userController.updateUserInfo);
// to access: http://localhost:8080/user
// this path will update user info
// body content: {"userId": 63, "uid":"testuid", "firstName": "firstname", "lastName": "lastname", "about": "testabout", "languages": [{"id": 6, "language": "English", "proficiency": "conversational"}, {"language": "Japan", "proficiency":"native"}]}
// in the case wehre new language is added, the id of the language should be left blank
// about is optional
// will not return anything, just text

// Delete user
router.delete('/user/:uid', userController.deleteUser);
// to access: http://localhost:8080/user/testuid
// this path will:
    // modify user email, firstname, lastname, about to 'Deleted user'
    // delete all registered user language associated with that user
    // modify all user message content to just 'Deleted user'. Note that the message id and timestamp will still exist
// will not return anything, just text

// Appointment
// Create appointment for client
router.post('/appointment', appointmentController.createAppointment);
// to access: http://localhost:8080/appointment
// this path will create a new appointment
// body content: {"appointmentTitle": "testappointmenttitle","appointmentType": "In-person","mainCategory": "Business", "subCategory": "sub-business","clientUserId": 63,"clientSpokenLanguage": "English","interpreterSpokenLanguage": "Japanese","locationLatitude": 123124,"locationLongitude": 4548237,"locationName": "testLocationName","appointmentDateTime": "2023-11-23T10:29:02.366Z","appointmentNote": "test3"}
// will not return anything, just text
// appointmentDateTime should be in ISO string

// Update appointment data
router.put('/appointment', appointmentController.updateAppointment)
// to access: http://localhost:8080/appointment
// this path will update the appointment based on id
// body content: {"id": 7,"appointmentTitle": "update appointment 9","appointmentType": "In-person update","mainCategory": "Business", "subCategory": "sub-business","clientSpokenLanguage": "English update","interpreterSpokenLanguage": "Japanese update","locationName": "Code Chrysalis update","locationAddress": "test address update","locationLatitude": 123124555,"locationLongitude": 45482375555,"appointmentDateTime": "2024-11-23T10:29:02.366Z","appointmentNote": "test3noteupdate"}
// will not return anything, just text
// appointmentDateTime should be in ISO string

// Find appointment for interpreter
router.get('/appointment/find/:userId', appointmentController.findAppointment);
// to access: http://localhost:8080/appointment
// require userId input. this is require to exclude any appointment made by the client itself
// this path will return an array of object containing all appointment with status requested
// ex: [{"id":6,"status":"Requested","appointmentTitle":"testappointmenttitle","appointmentType":"In-person","mainCategory": "Business", "subCategory": "sub-business","appointmentDateTime":"2023-11-23T10:29:02.366Z","locationLatitude":"123124","locationLongitude":"4548237","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese"}]

// Get overview appointment data
router.get('/appointment/overview/:role/:timeframe/:userId', appointmentController.getAppointmentOverview);
// to access: http://localhost:8080/appointment/overivew/client/current/55
// role: client or interpreter
// timeframe: current or history
// userId is the id belonging to client or interpreter
// if client, current: return appointment with status requested, accepted
// if client, history: return appointment with status completed, cancelled
// if interpreter, current: return appointment with status accepted
// if interpreter, history: return appointment with status completed, cancelled
// will return an array containing object that contains id, status, appointmentDateTime, locationLatitude, locationLongitude, clientSpokenLanguage, interpreterSpokenLanguage
// ex: [{"id":6,"status":"Requested","appointmentTitle":"testappointmenttitle","appointmentType":"In-person","mainCategory": "Business", "subCategory": "sub-business","clientSpokenLanguage":"English","interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","appointmentDateTime":"2023-11-23T10:29:02.366Z"}]

// Get detail appointment data
router.get('/appointment/detail/:appointmentId', appointmentController.getAppointmentDetail);
// to access: http://localhost:8080/appointment/detail/1
// this path will return full detail regarding the appointment
// will return an object containing appointment detail along with details of client and interpreter
// ex: {"id":6,"status":"Requested","appointmentTitle":"testappointmenttitle","appointmentType":"In-person","mainCategory": "Business", "subCategory": "sub-business","clientUserId":1,"clientUser":{"firstName":"firstnameupdate","lastName":"lastname","profilePicture":null},"clientSpokenLanguage":"English","interpreterUserId":2,"interpreterUser":null,"interpreterSpokenLanguage":"Japanese","locationLatitude":"123124","locationLongitude":"4548237","locationName":"testlocationname","appointmentDateTime":"2023-11-23T10:29:02.366Z","appointmentNote":"test3","reviewClientRating":null,"reviewClientNote":null,"reviewInterpreterRating":null,"reviewInterpreterNote":null}

// Accept appointment by interpreter
router.patch('/appointment/accept/:appointmentId/:interpreterUserId', appointmentController.acceptAppointment);
// to access: http://localhost:8080/accept/appointment/1/52
// this path will update the appointment to accepted status and assign the appointment with the interpreter id
// this path has no body content
// will not return anything, just text

// Cancel appointment by client/interpreter
router.patch('/appointment/cancel/:appointmentId', appointmentController.cancelAppointment)
// to access: http://localhost:8080/appointment/cancel/1
// this path will cancel the appointment and change the status to cancelled 
// this path has no body content
// will not return anything, just text

// Complete appointment by client/interpreter
router.patch('/appointment/complete/:appointmentId', appointmentController.completeAppointment)
// to access: http://localhost:8080/appointment/complete/1
// this path will complete the appointment and change the status to completed
// this path has no body content
// will not return anything, just text

// Add review
router.patch('/appointment/review', appointmentController.addReview)
// to access: http://localhost:8080/appointment/review/
// this path add review to the appointment specified
// body content: {"appointmentId": 4,"role": "client","reviewThumb": true,"reviewNote": "test"}
// review thumb is either true (for good) or false (for bad)
// will not return anything, just text

// Message
// Create new message
router.post('/message', messageController.createMessage);
// to access: http://localhost:8080/message
// this path will create a new message in the database 
// body content: {"appointmentId": 4, "userId": 55, "content": "test message", "messageTimestamp": "2023-11-23T10:29:02.366Z"}
// the timestamp should be in iso string

// Get all message in according to the appointment
router.get('/message/:appointmentId', messageController.getMessage);
// to access: http://localhost:8080/message/4
// this path will return all message associated with the appointment id
// will return an array containing an object 
// ex: [{"id":1,"appointmentId":4,"userId":55,"content":"test message","messageTimestamp":"2023-11-23T10:29:02.366Z"}]

export default router;