import { Request, Response } from "express";
import appointmentModel from "./appointment-model";
import { AppointmentCreate, AppointmentOverview, AppointmentDetail } from "../globals";

export default {
    async createAppointment(req: Request, res: Response): Promise<void> {
        try {
            // Decontructing data received
            const { clientUserId, clientSpokenLanguage, interpreterSpokenLanguage, locationLatitude, locationLongitude, appointmentDateTime, appointmentNote }: AppointmentCreate = req.body;

            await appointmentModel.createAppointment({ clientUserId, clientSpokenLanguage, interpreterSpokenLanguage, locationLatitude, locationLongitude, appointmentDateTime, appointmentNote });

            res.status(201).send("Appointment created in backend database");
        } catch {
            res.status(401).send("Cannot create new appointment");
        }
    },

    async findAppointment(req: Request, res: Response): Promise<void> {
        try {
            const data = await appointmentModel.findAppointment();

            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment");
        }
    },

    async acceptAppointment(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId: number = Number(req.params.appointmentId);
            const interpreterUserId: number = Number(req.params.interpreterUserId);

            await appointmentModel.acceptAppointment(appointmentId, interpreterUserId);

            res.status(200).send("Appointment accepted");
        } catch {
            res.status(500).send("Failed to accept appointment");
        }
    },

    async cancelAppointment(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId: number = Number(req.params.appointmentId);

            await appointmentModel.cancelAppointment(appointmentId);

            res.status(200).send("Appointment cancelled");
        } catch {
            res.status(500).send("Failed to cancel appointment");
        }
    },

    async completeAppointment(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId: number = Number(req.params.appointmentId);

            await appointmentModel.completeAppointment(appointmentId);

            res.status(200).send("Appointment completed");
        } catch {
            res.status(500).send("Failed to complete appointment");
        }
    },

    async getAppointmentDetail(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId: number = Number(req.params.appointmentId);

            const data: AppointmentDetail | null = await appointmentModel.getAppointmentDetail(appointmentId);
            console.log('okay');
            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment");
        }
    },

    async getAppointmentClientCurrent(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = Number(req.params.userId);

            const status = ["Requested", "Ongoing"];

            const data: AppointmentOverview[] = await appointmentModel.getAppointment("client", userId, status);

            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment");
        }
    },

    async getAppointmentClientHistory(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = Number(req.params.userId);

            const status = ["Completed", "Cancelled"];

            const data: AppointmentOverview[] = await appointmentModel.getAppointment("client", userId, status);

            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment");
        }
    },

    async getAppointmentInterpreterCurrent(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = Number(req.params.userId);

            const status = ["Ongoing"];

            const data: AppointmentOverview[] = await appointmentModel.getAppointment("interpreter", userId, status);

            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment");
        }
    },

    async getAppointmentInterpreterHistory(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = Number(req.params.userId);

            const status = ["Completed", "Cancelled"];

            const data: AppointmentOverview[] = await appointmentModel.getAppointment("interpreter", userId, status);

            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment");
        }
    },
}