import { PrismaClient } from '@prisma/client';
import { AppointmentOverview, AppointmentCreate, AppointmentDetail, ReviewAdd } from '../globals';

const prisma = new PrismaClient();

// MODEL FUNCTIONS
export default {
    async createAppointment({ appointmentTitle, appointmentType, clientUserId, clientSpokenLanguage, interpreterSpokenLanguage, locationLatitude, locationLongitude, locationDetail, appointmentDateTime, appointmentNote }: AppointmentCreate) {
        await prisma.appointment.create({
            data: {
                appointmentTitle: appointmentTitle,
                appointmentType: appointmentType,
                appointmentDateTime: appointmentDateTime,
                appointmentNote: appointmentNote,
                status: "Requested",
                clientUserId: clientUserId,
                clientSpokenLanguage: clientSpokenLanguage,
                interpreterSpokenLanguage: interpreterSpokenLanguage,
                locationLatitude: locationLatitude,
                locationLongitude: locationLongitude,
                locationDetail: locationDetail,
            }
        });
    },

    async findAppointment(userId: number) {
        const data: AppointmentOverview[] = await prisma.appointment.findMany({
            select: {
                id: true,
                status: true,
                appointmentTitle: true,
                appointmentType: true,
                appointmentDateTime: true,
                locationLatitude: true,
                locationLongitude: true,
                clientSpokenLanguage: true,
                interpreterSpokenLanguage: true,
            },
            where: {
                status: "Requested",
                NOT: {
                    clientUserId: userId,
                }
            }
        });

        return data;
    },

    async getAppointmentDetail(appointmentId: number) {
        const data: AppointmentDetail | null = await prisma.appointment.findUnique({
            select: {
                id: true,
                status: true,
                appointmentTitle: true,
                appointmentType: true,
                clientUserId: true,
                clientUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                    }
                },
                clientSpokenLanguage: true,
                interpreterUserId: true,
                interpreterUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                    }
                },
                interpreterSpokenLanguage: true,
                locationLatitude: true,
                locationLongitude: true,
                locationDetail: true,
                appointmentDateTime: true,
                appointmentNote: true,
                reviewClientRating: true,
                reviewClientNote: true,
                reviewInterpreterRating: true,
                reviewInterpreterNote: true,
            },
            where: {
                id: appointmentId,
            },
        });
        return data;
    },

    async getAppointmentOverview(role: string, userId: number, status: string[]) {
        const data: AppointmentOverview[] = await prisma.appointment.findMany({
            select: {
                id: true,
                status: true,
                appointmentTitle: true,
                appointmentType: true,
                clientSpokenLanguage: true,
                interpreterSpokenLanguage: true,
                locationLatitude: true,
                locationLongitude: true,
                appointmentDateTime: true,
            },
            where: {
                ...(role === 'client' ? {clientUserId: userId} : {interpreterUserId: userId}),
                status: { in: status},
            },
        });
        return data;
    },

    async acceptAppointment(appointmentId: number, interpreterUserId: number) {
        await prisma.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                status: "Accepted",
                interpreterUserId: interpreterUserId,
            }
        })
    },

    async cancelAppointment(appointmentId: number) {
        await prisma.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                status: "Cancelled",
            }
        })
    },

    async completeAppointment(appointmentId: number) {
        await prisma.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                status: "Completed",
            }
        });
    },

    async addReview({ appointmentId, role, reviewRating, reviewNote }: ReviewAdd ) {
        await prisma.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                ...(role === 'client' ? {reviewClientRating: reviewRating} : {reviewInterpreterRating: reviewRating}),
                ...(role === 'client' ? {reviewClientNote: reviewNote} : {reviewInterpreterNote: reviewNote}),
            }
        });
    },
}