"use client";

import React from "react";
import { Wind, Activity, CheckCircle2, AlertCircle, Building2, MapPin, Phone, TrendingUp, Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const oxygenStats = [
    { label: "Cylinders Available", value: "1,240", sub: "+12% from yesterday", icon: Wind, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Refill Stations", value: "45 Active", sub: "2 stations maintenance", icon: CheckCircle2, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Pending Requests", value: "85", sub: "Priority: High", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
];

const hospitalOxygenData = [
    { hospital: "City Care Super Specialty", cylinders: 150, pipeline: "Stable", lastUpdated: "5 mins ago", status: "Critical", contact: "+91 9876543210" },
    { hospital: "St. Mary Medical Center", cylinders: 210, pipeline: "Highly Stable", lastUpdated: "12 mins ago", status: "Normal", contact: "+91 8876543211" },
    { hospital: "Apollo Multispecialty", cylinders: 45, pipeline: "Fluctuating", lastUpdated: "2 mins ago", status: "Low", contact: "+91 7776543212" },
    { hospital: "Metro Heart Institute", cylinders: 300, pipeline: "Stable", lastUpdated: "20 mins ago", status: "Normal", contact: "+91 6676543213" },
    { hospital: "Green Valley Clinic", cylinders: 12, pipeline: "Offline", lastUpdated: "Just now", status: "Out", contact: "+91 5556667770" },
];

export default function OxygenTrackerPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-white border-b border-slate-100 py-16 pt-28">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold mb-4 border border-teal-100">
                                <Activity className="w-3.5 h-3.5" />
                                LIVE OXYGEN TELEMETRY
                            </div>
                            <h1 className="mb-2">Oxygen Infrastructure Tracker</h1>
                            <p className="text-text-gray text-lg max-w-[600px]">
                                Monitoring real-time oxygen inventory and pipeline status across regional health facilities.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-text-dark">System Live</span>
                            <span className="text-xs text-text-gray">Last Sync: {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                {/* Summary Dashboard */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {oxygenStats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft relative overflow-hidden group">
                            <div className={cn("inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <p className="text-sm font-bold text-text-gray uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-extrabold mb-2">{stat.value}</h3>
                            <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" /> {stat.sub}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Real-time Trends Placeholder */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-soft border border-slate-100 mb-12">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Consumption Trends</h2>
                            <p className="text-sm text-text-gray">Oxygen demand vs. supply across the city (last 24h)</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none">
                            <option>Last 24 Hours</option>
                            <option>Weekly View</option>
                        </select>
                    </div>

                    {/* Mock Graph */}
                    <div className="h-[300px] w-full bg-slate-50 rounded-3xl flex items-end justify-between p-8 gap-2">
                        {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary">
                                <div style={{ height: `${h}%` }} className="w-full bg-primary rounded-t-lg transition-all" />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-text-dark text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] font-bold text-text-gray uppercase tracking-widest px-4">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:59</span>
                    </div>
                </div>

                {/* Breakdown Table */}
                <div className="bg-white rounded-[40px] shadow-soft border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Hospital-wise Inventory</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                            <input type="text" placeholder="Search hospital..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none w-64" />
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Hospital</th>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Cylinders Avail.</th>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Pipeline Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {hospitalOxygenData.map((data, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-text-dark">{data.hospital}</div>
                                        <div className="text-[10px] text-text-gray flex items-center gap-1 mt-1 font-medium">
                                            <MapPin className="w-3 h-3" /> South District Core
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg">{data.cylinders}</span>
                                            <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div style={{ width: `${Math.min((data.cylinders / 300) * 100, 100)}%` }} className={cn(
                                                    "h-full rounded-full",
                                                    data.cylinders > 100 ? "bg-green-500" : data.cylinders > 50 ? "bg-amber-500" : "bg-red-500"
                                                )} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border",
                                            data.pipeline === "Stable" || data.pipeline === "Highly Stable"
                                                ? "bg-green-50 text-green-600 border-green-100"
                                                : data.pipeline === "Fluctuating"
                                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                                    : "bg-red-50 text-red-600 border-red-100"
                                        )}>
                                            {data.pipeline}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "font-bold text-xs uppercase tracking-wider",
                                            data.status === "Normal" ? "text-green-600" : data.status === "Low" ? "text-amber-500" : "text-red-500"
                                        )}>
                                            {data.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => window.open(`tel:${data.contact}`, "_self")}
                                            className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all inline-flex items-center gap-2"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            Order Oxygen
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
