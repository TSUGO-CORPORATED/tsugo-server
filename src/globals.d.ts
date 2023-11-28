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

export interface UserGet {
  id: number,
  firstName: string,
  lastName: string,
}

export interface UserGetDetailLanguage {
  id: number,
  language: string,
  proficiency: string,
  certifications?: string | null,
}

export interface UserGetDetail {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: Buffer | null;
  about: string | null;
  userLanguage: UserGetDetailLanguage[];
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
  uid: string,
  userId: number,
  firstName: string,
  lastName: string,
  about?: string,
}

export interface UserUpdateInfo2 {
  userId:  number,
  firstName: string,
  lastName: string,
  about?: string,
}

export interface UserUpdateLanguage {
  id: number,
  language: string,
  proficiency: string,
  certifications?: string,
}

export interface UserUpdateLanguage2 {
  id: number,
  userId: number,
  language: string,
  proficiency: string,
  certifications?: string,
}

export interface AppointmentCreate {
  appointmentTitle: string,
  appointmentType: string,
  clientUserId: number,
  clientSpokenLanguage: string,
  interpreterSpokenLanguage: string,
  locationLatitude?: string | number | Decimal | DecimalJsLike,
  locationLongitude?: string | number | Decimal | DecimalJsLike,
  locationDetail: string,
  appointmentDateTime: string,
  appointmentNote: string,
}

export interface AppointmentOverview {
  id: number;
  status: string;
  appointmentTitle: string,
  appointmentType: string,
  clientSpokenLanguage: string;
  interpreterSpokenLanguage: string;
  locationLatitude: Decimal;
  locationLongitude: Decimal;
  appointmentDateTime: Date;
}

export interface AppointmentDetail {
  id: number;
  appointmentTitle: string,
  appointmentType: string,
  clientSpokenLanguage: string;
  interpreterSpokenLanguage: string;
  locationLatitude: string | number | Decimal | DecimalJsLike,
  locationLongitude: string | number | Decimal | DecimalJsLike,
  locationDetail: string | null;
  appointmentDateTime: Date;
  appointmentNote: string | null;
  status: string;
  clientUserId: number;
  clientUser: {
    firstName: string;
    lastName: string;
    profilePicture?: any;
  };
  interpreterUserId?: number | null;
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