import { Decimal } from '@prisma/client/runtime/library';

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
