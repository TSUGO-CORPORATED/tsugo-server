import { PrismaClient } from '@prisma/client';
import { MessageCreate, MessageGet } from '../globals';

const prisma = new PrismaClient();

// MODEL FUNCTIONS
export default {
    async createMessage({ appointmentId, userId, content, messageTimestamp }: MessageCreate) {
        await prisma.message.create({
            data: {
                appointmentId: appointmentId,
                userId: userId,
                content: content,
                messageTimestamp: messageTimestamp,
            }
        });
    },

    async getMessage(appointmentId: number) {
        const data: MessageGet[] = await prisma.message.findMany({
            select: {
                id: true,
                appointmentId: true,
                userId: true,
                content: true,
                messageTimestamp: true,
            },
            where: {
                appointmentId: appointmentId,
            }
        });

        return data;
    },
}