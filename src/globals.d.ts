import { Decimal } from '@prisma/client/runtime/library';

export interface UserCreate {
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
}

export interface UserCreated {
  id: number;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: Buffer | null;
  about: string | null;
}

export interface UserReturn {
  id: number,
  firstName: string,
  lastName: string,
}

export interface Language {
  language: string,
  proficiency: string,
  certifications?: string,
}

export interface UserLanguage {
  userId: number,
  language: string,
  proficiency: string,
  certifications?: string,
}

export interface UserUpdateInfo {
  id: number,
  firstName: string,
  lastName: string,
  about: string,
}

export interface UserUpdateLanguage {
  id: number,
  language: string,
  proficiency: string,
  certifications?: string,
}

export interface AppointmentCreate {
  clientUserId: number,
  clientSpokenLanguage: string,
  interpreterSpokenLanguage: string,
  locationLatitude: number,
  locationLongitude: number,
  appointmentDateTime: string,
  appointmentNote: string,
}

export interface AppointmentOverview {
  id: number;
  status: string;
  clientSpokenLanguage: string;
  interpreterSpokenLanguage: string;
  locationLatitude: Decimal;
  locationLongitude: Decimal;
  appointmentDateTime: Date;
}

export interface AppointmentDetail {
  id: number;
  clientSpokenLanguage: string;
  interpreterSpokenLanguage: string;
  locationLatitude: Decimal;
  locationLongitude: Decimal;
  appointmentDateTime: Date;
  appointmentNote: string | null;
  status: string;
  clientUser: {
    firstName: string;
    lastName: string;
    profilePicture?: any;
  };
  interpreterUser: {
    firstName: string;
    lastName: string;
    profilePicture?: any;
  } | null;
  reviewClientRating: number | null,
  reviewClientNote: string | null,
  reviewInterpreterRating: number | null,
  reviewInterpreterNote: string | null,
} 

export interface ReviewAdd {
  appointmentId: number;
  role: 'client' | 'interpreter';
  reviewRating: number;
  reviewNote: string;
}

export interface MessageCreate {
  appointmentId: number;
  userId: number;
  content: string;
  messageTimestamp: Date;
}

export interface MessageGet {
  id: number,
  appointmentId: number;
  userId: number;
  content: string;
  messageTimestamp: Date;
}