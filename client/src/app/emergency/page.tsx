"use client";

import React from "react";
import { Phone, AlertTriangle, MapPin, Activity, HelpCircle, ShieldAlert, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const emergencyContacts = [
    { name: "National Ambulance", number: "102", icon: Activity },
    { name: "Police Emergency", number: "100", icon: ShieldAlert },
    { name: "Blood Bank Help", number: "104", icon: AlertTriangle },
];

export default function EmergencyPage() {
    return (
        <div className="bg-red-50 min-h-screen py-20 pt-32">
            <div className="container-custom">
                <div className="max-w-[1000px] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-red-600 text-white rounded-[32px] mb-8 shadow-2xl shadow-red-200"
                        >
                            <AlertTriangle className="w-10 h-10" />
                        </motion.div>
                        <h1 className="text-red-600 text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">
                            Emergency Assistance
                        </h1>
                        <p className="text-slate-600 text-xl font-medium max-w-[700px] mx-auto leading-relaxed">
                            If you are in immediate danger or need urgent medical attention, use the resources below.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Call Button Section */}
                        <div
                            onClick={() => window.open("tel:102", "_self")}
                            className="bg-white rounded-[48px] p-10 shadow-2xl shadow-red-100 border-2 border-red-50 relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer group hover:border-red-200 transition-all"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
                            <h2 className="text-2xl font-bold mb-4">Urgent Medical Call</h2>
                            <p className="text-text-gray mb-10">Instantly connect with the national emergency ambulance service.</p>

                            <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-300 group-hover:scale-110 active:scale-95 transition-all duration-300">
                                <Phone className="w-12 h-12 animate-pulse" />
                            </div>

                            <p className="mt-8 text-3xl font-black text-red-600 tracking-widest">102</p>
                            <p className="text-sm font-bold text-text-gray mt-2 uppercase">Tap to call now</p>
                        </div>

                        {/* Nearest Hospital Alert */}
                        <div className="bg-white rounded-[48px] p-10 shadow-2xl shadow-red-100 border-2 border-red-50 flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold">Nearest ICU Facility</h3>
                            </div>

                            <div className="flex-1">
                                <div className="p-6 bg-slate-50 rounded-3xl mb-6">
                                    <h4 className="font-bold text-lg mb-1">City Care Super Specialty</h4>
                                    <p className="text-sm text-text-gray mb-4">1.2 km away • Sector 45, Gurugram</p>
                                    <div className="flex gap-4">
                                        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200">
                                            <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest">ICU BEDS</p>
                                            <p className="text-xl font-black text-primary">04</p>
                                        </div>
                                        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200">
                                            <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest">OXYGEN</p>
                                            <p className="text-xl font-black text-teal-600">YES</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=City+Care+Super+Specialty+Sector+45+Gurugram", "_blank")}
                                    className="w-full py-5 bg-text-dark text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all group"
                                >
                                    Get Integrated Directions
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contacts Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {emergencyContacts.map((contact, i) => (
                            <div
                                key={i}
                                onClick={() => window.open(`tel:${contact.number}`, "_self")}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center justify-between group hover:border-red-200 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                        <contact.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-dark">{contact.name}</p>
                                        <p className="text-lg font-black text-slate-800">{contact.number}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                                    <Phone className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Guidelines */}
                    <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-[40px] p-10 border border-red-100">
                        <div className="flex items-center gap-3 mb-6">
                            <HelpCircle className="w-6 h-6 text-red-500" />
                            <h3 className="text-xl font-bold">What to do while waiting?</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Stay calm and try to slow down your breathing.",
                                "Keep the patient in a comfortable position, sitting or lying down.",
                                "Loosen any tight clothing to assist breathing.",
                                "Gather the patient's ID and current medical records if possible."
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-4 text-slate-700">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                    <span className="font-medium">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
