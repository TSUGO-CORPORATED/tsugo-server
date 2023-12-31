import { PrismaClient } from '@prisma/client';
import { AppointmentOverview, AppointmentCreate, AppointmentUpdate, AppointmentDetail, ReviewAdd } from '../globals';

const prisma = new PrismaClient();

// MODEL FUNCTIONS
export default {
    async createAppointment({ appointmentTitle, appointmentType, mainCategory, subCategory, clientUserId, clientSpokenLanguage, interpreterSpokenLanguage, locationName, locationAddress, locationLatitude, locationLongitude, appointmentDateTime, appointmentNote }: AppointmentCreate) {
        await prisma.appointment.create({
            data: {
                appointmentTitle: appointmentTitle,
                appointmentType: appointmentType,
                appointmentDateTime: appointmentDateTime,
                appointmentNote: appointmentNote,
                mainCategory: mainCategory,
                subCategory: subCategory,
                status: "Requested",
                clientUserId: clientUserId,
                clientSpokenLanguage: clientSpokenLanguage,
                interpreterSpokenLanguage: interpreterSpokenLanguage,
                locationName: locationName,
                locationAddress: locationAddress,
                locationLatitude: locationLatitude,
                locationLongitude: locationLongitude,
            }
        });
    },

    async updateAppointment({ id, appointmentTitle, appointmentType, mainCategory, subCategory, clientSpokenLanguage, interpreterSpokenLanguage, locationName, locationAddress, locationLatitude, locationLongitude, appointmentDateTime, appointmentNote }: AppointmentUpdate) {
        await prisma.appointment.update({
            where: {
                id: id,
            },
            data: {
                appointmentTitle: appointmentTitle,
                appointmentType: appointmentType,
                mainCategory: mainCategory,
                subCategory: subCategory,
                appointmentDateTime: appointmentDateTime,
                appointmentNote: appointmentNote,
                clientSpokenLanguage: clientSpokenLanguage,
                interpreterSpokenLanguage: interpreterSpokenLanguage,
                locationName: locationName,
                locationAddress: locationAddress,
                locationLatitude: locationLatitude,
                locationLongitude: locationLongitude,
            }
        });
    },

    async findExpiredAppointment() {
        const data = await prisma.appointment.findMany({
            select: {
                id: true,
            },
            where: {
                status: "Requested",
                appointmentDateTime: {
                    lte: new Date(),
                }
            }
        })

        return data;
    },

    async findAppointment(userId: number) {
        const data: AppointmentOverview[] = await prisma.appointment.findMany({
            select: {
                id: true,
                status: true,
                appointmentTitle: true,
                appointmentType: true,
                appointmentDateTime: true,
                mainCategory: true,
                subCategory: true,
                locationName: true,
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
            },
            orderBy: [
                {
                    appointmentDateTime: 'asc'
                }
            ],
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
                mainCategory: true,
                subCategory: true,
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
                locationName: true,
                locationAddress: true,
                locationLatitude: true,
                locationLongitude: true,
                appointmentDateTime: true,
                appointmentNote: true,
                reviewClientThumb: true,
                reviewClientNote: true,
                reviewInterpreterThumb: true,
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
                mainCategory: true,
                subCategory: true,
                clientSpokenLanguage: true,
                interpreterSpokenLanguage: true,
                locationName: true,
                locationLatitude: true,
                locationLongitude: true,
                appointmentDateTime: true,
            },
            where: {
                ...(role === 'client' ? {clientUserId: userId} : {interpreterUserId: userId}),
                status: { in: status},
            },
            orderBy: [
                {
                    appointmentDateTime: 'asc'
                }
            ],
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

    async addReview({ appointmentId, role, reviewThumb, reviewNote }: ReviewAdd ) {
        await prisma.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                ...(role === 'client' ? {reviewClientThumb: reviewThumb} : {reviewInterpreterThumb: reviewThumb}),
                ...(role === 'client' ? {reviewClientNote: reviewNote} : {reviewInterpreterNote: reviewNote}),
            }
        });
    },

    async calcTotalThumbsClient(userId: number | undefined) {
        const data = await prisma.appointment.groupBy({
            by: ['reviewClientThumb'],
            _count: true,
            where: {
                clientUserId: userId,
                reviewClientThumb: {not: null},
            },
        })
        return data;
    },

    async calcTotalThumbsInterpreter(userId: number | undefined) {
        const data = await prisma.appointment.groupBy({
            by: ['reviewInterpreterThumb'],
            _count: true,
            where: {
                interpreterUserId: userId,
                reviewInterpreterThumb: {not: null},
            },
        })
        return data;
    },
}