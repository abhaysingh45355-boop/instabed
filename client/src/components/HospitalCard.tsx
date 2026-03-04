"use client";

import React from "react";
import { Bed, Wind, Droplets, MapPin, Phone, ExternalLink, ShieldCheck, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Hospital {
    id: string;
    name: string;
    address: string;
    distance: string;
    distanceKm: number;
    contact: string;
    beds: {
        general: { total: number; available: number };
        icu: { total: number; available: number };
        ventilator: { total: number; available: number };
    };
    oxygen: boolean;
    blood: string[];
    isVerified: boolean;
}

interface HospitalCardProps {
    hospital: Hospital;
    onCall?: (contact: string) => void;
    onDetails?: (hospital: Hospital) => void;
    onGetDirections?: (address: string) => void;
}

export default function HospitalCard({ hospital, onCall, onDetails, onGetDirections }: HospitalCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 hover:border-primary/20 hover:shadow-medium transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-text-dark group-hover:text-primary transition-colors">
                            {hospital.name}
                        </h3>
                        {hospital.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-text-gray text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{hospital.address} • {hospital.distance}</span>
                    </div>
                </div>
                <div className="text-xs font-bold px-2 py-1 bg-green-50 text-green-600 rounded-md border border-green-100">
                    OPEN NOW
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                <AvailabilityBadge
                    icon={Bed}
                    label="Beds"
                    value={hospital.beds.general.available}
                    color="blue"
                />
                <AvailabilityBadge
                    icon={ShieldCheck}
                    label="ICU"
                    value={hospital.beds.icu.available}
                    color="indigo"
                />
                <AvailabilityBadge
                    icon={Wind}
                    label="Oxygen"
                    status={hospital.oxygen ? "Available" : "Stock Out"}
                    color="teal"
                />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                    {hospital.blood.slice(0, 3).map((group) => (
                        <span key={group} className="w-8 h-8 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center text-[10px] font-bold">
                            {group}
                        </span>
                    ))}
                    {hospital.blood.length > 3 && (
                        <span className="text-[10px] font-medium text-text-gray flex items-center">+{hospital.blood.length - 3} more</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onGetDirections?.(hospital.address)}
                        className="p-2 text-text-gray hover:text-teal-600 transition-colors rounded-lg bg-slate-50 hover:bg-teal-50"
                        title="Get Directions"
                    >
                        <Navigation className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onCall?.(hospital.contact)}
                        className="p-2 text-text-gray hover:text-green-600 transition-colors rounded-lg bg-slate-50 hover:bg-green-50"
                        title={`Call ${hospital.contact}`}
                    >
                        <Phone className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDetails?.(hospital)}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        Details
                        <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function AvailabilityBadge({ icon: Icon, label, value, status, color }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        teal: "bg-teal-50 text-teal-600 border-teal-100",
        red: "bg-red-50 text-red-600 border-red-100",
    };

    const displayValue = value !== undefined ? value : status;
    const isUnavailable = (value !== undefined && value === 0) || status === "Stock Out";

    return (
        <div className={cn("p-3 rounded-2xl border flex flex-col items-center", colors[color])}>
            <Icon className="w-4 h-4 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">{label}</span>
            <span className={cn("text-base font-bold", isUnavailable && "text-red-500")}>{displayValue}</span>
        </div>
    );
}
