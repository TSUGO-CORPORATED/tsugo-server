import { Request, Response } from "express";
import appointmentModel from "./appointment-model";
import { AppointmentCreate, AppointmentOverview, AppointmentDetail, ReviewAdd, AppointmentUpdate } from "../globals";

async function removeExpiredAppointment() {
    const findExpiredAppointment: {id: number}[] = await appointmentModel.findExpiredAppointment();
    if (findExpiredAppointment.length) {
        for (const appointment of findExpiredAppointment) {
            await appointmentModel.cancelAppointment(appointment.id);
        }
    }
    return;
}

export default {
    async createAppointment(req: Request, res: Response): Promise<void> {
        try {
            // Decontructing data received
            const { appointmentTitle, appointmentType, mainCategory, subCategory, clientUserId, clientSpokenLanguage, interpreterSpokenLanguage, locationName, locationAddress, locationLatitude, locationLongitude, appointmentDateTime, appointmentNote }: AppointmentCreate = req.body;
            await appointmentModel.createAppointment({ appointmentTitle, appointmentType, mainCategory, subCategory, clientUserId, clientSpokenLanguage, interpreterSpokenLanguage, locationName, locationAddress, locationLatitude, locationLongitude, appointmentDateTime, appointmentNote });
            
            res.status(201).send("Appointment created in backend database");
        } catch {
            res.status(401).send("Cannot create new appointment");
        }
    },

    async updateAppointment(req: Request, res: Response): Promise<void> {
        try {
            // Decontructing data received
            const { id, appointmentTitle, appointmentType, mainCategory, subCategory, clientSpokenLanguage, interpreterSpokenLanguage, locationName, locationAddress, locationLatitude, locationLongitude, appointmentDateTime, appointmentNote }: AppointmentUpdate = req.body;
            await appointmentModel.updateAppointment({ id, appointmentTitle, appointmentType, mainCategory, subCategory, clientSpokenLanguage, interpreterSpokenLanguage, locationName, locationAddress, locationLatitude, locationLongitude, appointmentDateTime, appointmentNote });
            
            res.status(200).send(JSON.stringify("Appointment data updated"));
        } catch {
            res.status(500).send("Failed to update appointment");
        }
    },

    async findAppointment(req: Request, res: Response): Promise<void> {
        try {
            // Taking userId of the requesting user. This id will be used to exclude appointment made by that user
            const userId: number = Number(req.params.userId);

            // Removing expired appointment
            removeExpiredAppointment();

            // Getting appointment
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
            // Taking request data
            const role: string = req.params.role;
            const timeframe: string = req.params.timeframe; 
            const userId: number = Number(req.params.userId);

            // Set the status that is going to be used based on timeframe and role
            let status: string[] = [];
            if (timeframe === 'current' && role === 'client') status = ["Requested", "Accepted"];
            else if (timeframe === 'history' && role === 'client') status = ["Completed", "Cancelled"];
            else if (timeframe === 'current' && role === 'interpreter') status = ["Accepted"];
            else if (timeframe === 'history' && role === 'interpreter') status = ["Completed", "Cancelled"];

            // Removing expired appointment
            await removeExpiredAppointment();

            // Getting data
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
            const { appointmentId, role, reviewThumb, reviewNote }: ReviewAdd = req.body;

            await appointmentModel.addReview({appointmentId, role, reviewThumb, reviewNote});

            res.status(200).send("Review added");
        } catch {
            res.status(500).send("Failed to add review");
        }
    },
}