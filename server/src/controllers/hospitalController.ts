import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllHospitals = async (req: Request, res: Response) => {
    try {
        const hospitals = await prisma.hospital.findMany({
            include: {
                beds: true,
                oxygen: true,
                blood: true
            }
        });
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hospitals' });
    }
};

export const getHospitalById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const hospital = await prisma.hospital.findUnique({
            where: { id },
            include: {
                beds: true,
                oxygen: true,
                blood: true
            }
        });
        if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hospital' });
    }
};

export const searchHospitals = async (req: Request, res: Response) => {
    const { city, bloodGroup, minBeds } = req.query;

    try {
        const hospitals = await prisma.hospital.findMany({
            where: {
                city: city ? (city as string) : undefined,
                beds: minBeds ? {
                    available_general: { gte: parseInt(minBeds as string) }
                } : undefined,
                blood: bloodGroup ? {
                    some: {
                        blood_group: bloodGroup as string,
                        units_available: { gt: 0 }
                    }
                } : undefined
            },
            include: {
                beds: true,
                blood: true
            }
        });
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};
