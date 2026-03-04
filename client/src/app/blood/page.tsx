"use client";

import React, { useState } from "react";
import { Search, MapPin, Droplets, Info, ExternalLink, Calendar, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const mockBloodResults = [
    { hospital: "City Care Super Specialty", group: "A+", units: 12, lastUpdated: "2 mins ago", contact: "+91 9876543210" },
    { hospital: "St. Mary Medical Center", group: "B-", units: 4, lastUpdated: "15 mins ago", contact: "+91 8876543211" },
    { hospital: "Apollo Multispecialty", group: "O+", units: 25, lastUpdated: "1 hour ago", contact: "+91 7776543212" },
    { hospital: "Metro Heart Institute", group: "A+", units: 8, lastUpdated: "5 mins ago", contact: "+91 6676543213" },
    { hospital: "Red Cross Blood Bank", group: "O-", units: 3, lastUpdated: "Just now", contact: "+91 1122334455" },
];

export default function BloodAvailabilityPage() {
    const [bloodGroup, setBloodGroup] = useState("A+");

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-16 pt-28">
                <div className="container-custom text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6 text-red-600 border border-red-100">
                        <Droplets className="w-8 h-8" />
                    </div>
                    <h1 className="mb-4">Search Blood Availability by Group</h1>
                    <p className="text-text-gray max-w-[600px] mx-auto text-lg mb-12">
                        Find live updates on blood inventory across registered hospitals and blood banks in your region.
                    </p>

                    {/* Search Card */}
                    <div className="max-w-[800px] mx-auto bg-white p-6 rounded-3xl shadow-medium border border-slate-100 grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest absolute top-3 left-4 z-10">Blood Group</label>
                            <select
                                className="uiverse-input pt-8 pb-3 font-bold"
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                            >
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest absolute top-3 left-4 z-10">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-[38px] w-4 h-4 text-text-gray" />
                                <input
                                    type="text"
                                    placeholder="Enter location"
                                    className="uiverse-input pl-10 pt-8 pb-3 font-medium"
                                />
                            </div>
                        </div>
                        <button className="bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
                            <Search className="w-5 h-5" />
                            Search Availability
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="container-custom py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Search Results</h2>
                    <div className="flex items-center gap-2 text-sm text-text-gray bg-white px-4 py-2 rounded-full border border-slate-100">
                        <Info className="w-4 h-4 text-primary" />
                        Last updated in real-time
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Hospital/Blood Bank</th>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Blood Group</th>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Units Available</th>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Last Updated</th>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockBloodResults.map((result, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-text-dark">{result.hospital}</div>
                                        <div className="text-xs text-text-gray flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3" /> New Delhi, Sector 45
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 font-bold border border-red-100">
                                            {result.group}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "font-bold text-lg",
                                            result.units > 5 ? "text-green-600" : "text-amber-500"
                                        )}>
                                            {result.units} Units
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-text-gray italic">
                                        {result.lastUpdated}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => window.open(`tel:${result.contact}`, "_self")}
                                                className="p-2.5 bg-slate-100 text-text-gray rounded-xl hover:text-primary transition-all"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => window.open(`tel:${result.contact}`, "_self")}
                                                className="px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
                                            >
                                                Request Units
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Stats Summary */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    {[
                        { label: "Total A+ Units", value: "142", icon: Droplets, color: "red" },
                        { label: "Active Requests", value: "28", icon: Calendar, color: "blue" },
                        { label: "Donors Available", value: "850+", icon: Search, color: "teal" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center",
                                stat.color === 'red' ? "bg-red-50 text-red-600" : stat.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-teal-50 text-teal-600"
                            )}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-gray uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
