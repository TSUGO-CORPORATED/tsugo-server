import { Request, Response } from "express";
import appointmentModel from "./appointment-model";
import { AppointmentCreate, AppointmentOverview, AppointmentDetail, ReviewAdd } from "../globals";

export default {
    async createAppointment(req: Request, res: Response): Promise<void> {
        try {
            // Decontructing data received
            const { appointmentTitle, appointmentType, clientUserId, clientSpokenLanguage, interpreterSpokenLanguage, locationLatitude, locationLongitude, locationName, appointmentDateTime, appointmentNote }: AppointmentCreate = req.body;
            await appointmentModel.createAppointment({ appointmentTitle, appointmentType, clientUserId, clientSpokenLanguage, interpreterSpokenLanguage, locationLatitude, locationLongitude, locationName, appointmentDateTime, appointmentNote });
            res.status(201).send("Appointment created in backend database");
        } catch {
            res.status(401).send("Cannot create new appointment");
        }
    },

    async findAppointment(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = Number(req.params.userId);

            const data: AppointmentOverview[] = await appointmentModel.findAppointment(userId);

            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment");
        }
    },

    async getAppointmentDetail(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId: number = Number(req.params.appointmentId);

            const data: AppointmentDetail | null = await appointmentModel.getAppointmentDetail(appointmentId);

            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment detail");
        }
    },

    async getAppointmentOverview(req: Request, res: Response): Promise<void> {
        try {
            const role: string = req.params.role;
            const timeframe: string = req.params.timeframe; 
            const userId: number = Number(req.params.userId);

            let status: string[] = [];
            if (timeframe === 'current' && role === 'client') status = ["Requested", "Accepted"];
            else if (timeframe === 'history' && role === 'client') status = ["Completed", "Cancelled"];
            else if (timeframe === 'current' && role === 'interpreter') status = ["Accepted"];
            else if (timeframe === 'history' && role === 'interpreter') status = ["Completed", "Cancelled"];

            const data: AppointmentOverview[] = await appointmentModel.getAppointmentOverview(role, userId, status);

            res.status(200).send(JSON.stringify(data));
        } catch {
            res.status(500).send("Failed to get appointment overview");
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

    async addReview(req: Request, res: Response): Promise<void> {
        try {
            // Decontructing data received
            const { appointmentId, role, reviewRating, reviewNote }: ReviewAdd = req.body;

            await appointmentModel.addReview({appointmentId, role, reviewRating, reviewNote});

            res.status(200).send("Review added");
        } catch {
            res.status(500).send("Failed to add review");
        }
    },
}