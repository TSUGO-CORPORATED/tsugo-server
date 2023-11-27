import { Request, Response } from "express";
import messageModel from "./message-model";
import { MessageCreate, MessageGet } from "../globals";

// CONTROLLER FUNCTIONS
export default {
    async createMessage(req: Request, res: Response): Promise<void> {
        try {
            const { appointmentId, userId, content, messageTimestamp }: MessageCreate = req.body;

            await messageModel.createMessage({ appointmentId, userId, content, messageTimestamp });

            res.status(201).send("Message created in backend database");
        } catch {
            res.status(401).send("Cannot register new message");
        }
    },

    async getMessage(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId: number = Number(req.params.appointmentId);

            const data: MessageGet[] = await messageModel.getMessage(appointmentId);

            res.status(201).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment");
        }
    },

    async socketGetMessagesById(id: number) {
        try {
            const data: MessageGet[] = await messageModel.getMessage(id);
            return data;
        } catch {
            return "error";
        }
    },

    async socketCreateMessage(appointmentId: number, userId: number, content: string, messageTimestamp: Date) {
        await messageModel.createMessage({ appointmentId, userId, content, messageTimestamp });
    },
}