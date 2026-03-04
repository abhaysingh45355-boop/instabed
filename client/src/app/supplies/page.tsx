"use client";

import React, { useState, useMemo } from "react";
import {
    Droplets, Wind, Activity, Search, MapPin, Phone, Info,
    TrendingUp, CheckCircle2, AlertCircle, ChevronRight, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data with city information
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const mockBloodResults = [
    { hospital: "City Care Super Specialty", city: "New Delhi", group: "A+", units: 12, lastUpdated: "2 mins ago", contact: "+91 9876543210" },
    { hospital: "St. Mary Medical Center", city: "New Delhi", group: "B-", units: 4, lastUpdated: "15 mins ago", contact: "+91 8876543211" },
    { hospital: "Apollo Multispecialty", city: "New Delhi", group: "O+", units: 25, lastUpdated: "1 hour ago", contact: "+91 7776543212" },
    { hospital: "Metro Heart Institute", city: "New Delhi", group: "A+", units: 8, lastUpdated: "5 mins ago", contact: "+91 6676543213" },
    { hospital: "Red Cross Blood Bank", city: "New Delhi", group: "O-", units: 3, lastUpdated: "Just now", contact: "+91 1122334455" },
    { hospital: "Lilavati Hospital", city: "Mumbai", group: "A+", units: 18, lastUpdated: "3 mins ago", contact: "+91 2226751000" },
    { hospital: "Breach Candy Hospital", city: "Mumbai", group: "B+", units: 9, lastUpdated: "10 mins ago", contact: "+91 2223667890" },
    { hospital: "KEM Hospital", city: "Mumbai", group: "O+", units: 30, lastUpdated: "Just now", contact: "+91 2224136051" },
    { hospital: "Narayana Health City", city: "Bangalore", group: "AB+", units: 14, lastUpdated: "8 mins ago", contact: "+91 8027832000" },
    { hospital: "Manipal Hospital", city: "Bangalore", group: "A-", units: 6, lastUpdated: "20 mins ago", contact: "+91 8025023456" },
    { hospital: "CMC Vellore", city: "Vellore", group: "O-", units: 22, lastUpdated: "1 min ago", contact: "+91 4162281000" },
    { hospital: "PGIMER", city: "Chandigarh", group: "B+", units: 16, lastUpdated: "5 mins ago", contact: "+91 1722746018" },
    { hospital: "Ruby Hall Clinic", city: "Pune", group: "A+", units: 10, lastUpdated: "12 mins ago", contact: "+91 2026163391" },
    { hospital: "AMRI Hospitals", city: "Kolkata", group: "AB-", units: 5, lastUpdated: "7 mins ago", contact: "+91 3366260000" },
    { hospital: "Medica Superspecialty", city: "Kolkata", group: "O+", units: 20, lastUpdated: "2 mins ago", contact: "+91 3366520000" },
    { hospital: "Aster CMI Hospital", city: "Hyderabad", group: "B-", units: 7, lastUpdated: "15 mins ago", contact: "+91 4071178899" },
    { hospital: "KIMS Hospital", city: "Hyderabad", group: "A+", units: 11, lastUpdated: "9 mins ago", contact: "+91 4044885000" },
    { hospital: "Meenakshi Mission", city: "Madurai", group: "O+", units: 15, lastUpdated: "3 mins ago", contact: "+91 4522588741" },
    { hospital: "SMS Hospital", city: "Jaipur", group: "B+", units: 13, lastUpdated: "6 mins ago", contact: "+91 1412518261" },
    { hospital: "Sanjay Gandhi PGI", city: "Lucknow", group: "AB+", units: 8, lastUpdated: "10 mins ago", contact: "+91 5222494000" },
];

const hospitalOxygenData = [
    { hospital: "City Care Super Specialty", city: "New Delhi", cylinders: 150, pipeline: "Stable", lastUpdated: "5 mins ago", status: "Critical", contact: "+91 9876543210" },
    { hospital: "St. Mary Medical Center", city: "New Delhi", cylinders: 210, pipeline: "Highly Stable", lastUpdated: "12 mins ago", status: "Normal", contact: "+91 8876543211" },
    { hospital: "Apollo Multispecialty", city: "New Delhi", cylinders: 45, pipeline: "Fluctuating", lastUpdated: "2 mins ago", status: "Low", contact: "+91 7776543212" },
    { hospital: "Metro Heart Institute", city: "New Delhi", cylinders: 300, pipeline: "Stable", lastUpdated: "20 mins ago", status: "Normal", contact: "+91 6676543213" },
    { hospital: "Green Valley Clinic", city: "New Delhi", cylinders: 12, pipeline: "Offline", lastUpdated: "Just now", status: "Out", contact: "+91 5556667770" },
    { hospital: "Lilavati Hospital", city: "Mumbai", cylinders: 280, pipeline: "Stable", lastUpdated: "4 mins ago", status: "Normal", contact: "+91 2226751000" },
    { hospital: "KEM Hospital", city: "Mumbai", cylinders: 190, pipeline: "Stable", lastUpdated: "1 min ago", status: "Normal", contact: "+91 2224136051" },
    { hospital: "Narayana Health City", city: "Bangalore", cylinders: 320, pipeline: "Highly Stable", lastUpdated: "6 mins ago", status: "Normal", contact: "+91 8027832000" },
    { hospital: "CMC Vellore", city: "Vellore", cylinders: 175, pipeline: "Stable", lastUpdated: "8 mins ago", status: "Normal", contact: "+91 4162281000" },
    { hospital: "PGIMER", city: "Chandigarh", cylinders: 95, pipeline: "Fluctuating", lastUpdated: "3 mins ago", status: "Low", contact: "+91 1722746018" },
    { hospital: "AMRI Hospitals", city: "Kolkata", cylinders: 60, pipeline: "Stable", lastUpdated: "11 mins ago", status: "Critical", contact: "+91 3366260000" },
    { hospital: "KIMS Hospital", city: "Hyderabad", cylinders: 250, pipeline: "Stable", lastUpdated: "7 mins ago", status: "Normal", contact: "+91 4044885000" },
    { hospital: "SMS Hospital", city: "Jaipur", cylinders: 110, pipeline: "Stable", lastUpdated: "5 mins ago", status: "Normal", contact: "+91 1412518261" },
];

const ventilatorData = [
    { hospital: "City Care Super Specialty", city: "New Delhi", total: 45, available: 12, types: ["ICU", "Portable"], lastUpdated: "2 mins ago", contact: "+91 9876543210" },
    { hospital: "Apollo Multispecialty", city: "New Delhi", total: 80, available: 5, types: ["ICU", "High-Flow"], lastUpdated: "8 mins ago", contact: "+91 7776543212" },
    { hospital: "Metro Heart Institute", city: "New Delhi", total: 30, available: 0, types: ["ICU"], lastUpdated: "Just now", contact: "+91 6676543213" },
    { hospital: "St. Mary Medical Center", city: "New Delhi", total: 25, available: 18, types: ["Portable"], lastUpdated: "1 hour ago", contact: "+91 8876543211" },
    { hospital: "Lilavati Hospital", city: "Mumbai", total: 60, available: 22, types: ["ICU", "Portable"], lastUpdated: "4 mins ago", contact: "+91 2226751000" },
    { hospital: "KEM Hospital", city: "Mumbai", total: 50, available: 8, types: ["ICU", "High-Flow"], lastUpdated: "1 min ago", contact: "+91 2224136051" },
    { hospital: "Narayana Health City", city: "Bangalore", total: 70, available: 30, types: ["ICU", "Portable", "High-Flow"], lastUpdated: "6 mins ago", contact: "+91 8027832000" },
    { hospital: "PGIMER", city: "Chandigarh", total: 35, available: 3, types: ["ICU"], lastUpdated: "3 mins ago", contact: "+91 1722746018" },
    { hospital: "Medica Superspecialty", city: "Kolkata", total: 40, available: 15, types: ["ICU", "Portable"], lastUpdated: "5 mins ago", contact: "+91 3366520000" },
    { hospital: "KIMS Hospital", city: "Hyderabad", total: 55, available: 20, types: ["ICU", "High-Flow"], lastUpdated: "7 mins ago", contact: "+91 4044885000" },
];

type SupplyTab = "blood" | "oxygen" | "ventilators";

export default function MedicalSuppliesPage() {
    const [activeTab, setActiveTab] = useState<SupplyTab>("blood");
    const [bloodGroup, setBloodGroup] = useState("A+");
    const [locationSearch, setLocationSearch] = useState("");
    const [searchSubmitted, setSearchSubmitted] = useState(false);

    const tabs: { id: SupplyTab; label: string; icon: any; color: string }[] = [
        { id: "blood", label: "Blood Inventory", icon: Droplets, color: "text-red-500" },
        { id: "oxygen", label: "Oxygen Supply", icon: Wind, color: "text-blue-500" },
        { id: "ventilators", label: "Ventilators", icon: Activity, color: "text-teal-500" },
    ];

    // Filter by blood group + location
    const filteredBlood = useMemo(() => {
        return mockBloodResults.filter((r) => {
            const groupMatch = r.group === bloodGroup;
            if (!locationSearch) return groupMatch;
            return groupMatch && r.city.toLowerCase().includes(locationSearch.toLowerCase());
        });
    }, [bloodGroup, locationSearch]);

    const filteredOxygen = useMemo(() => {
        if (!locationSearch) return hospitalOxygenData;
        return hospitalOxygenData.filter((r) => r.city.toLowerCase().includes(locationSearch.toLowerCase()));
    }, [locationSearch]);

    const filteredVentilators = useMemo(() => {
        if (!locationSearch) return ventilatorData;
        return ventilatorData.filter((r) => r.city.toLowerCase().includes(locationSearch.toLowerCase()));
    }, [locationSearch]);

    const handleSearch = () => {
        setSearchSubmitted(true);
    };

    // Unique cities for autocomplete hint
    const cities = [...new Set(mockBloodResults.map(r => r.city))].sort();

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-100 pt-28 pb-12">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="mb-2">Critical Medical Supplies</h1>
                            <p className="text-text-gray text-lg max-w-[600px]">
                                Real-time tracking of life-saving inventory across the national health grid.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 w-2.5 h-2.5 rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-text-dark">Live Systems Online</span>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border",
                                    activeTab === tab.id
                                        ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                                        : "bg-white text-text-gray border-slate-100 hover:border-primary/20 hover:bg-slate-50"
                                )}
                            >
                                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : tab.color)} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                <AnimatePresence mode="wait">
                    {activeTab === "blood" && (
                        <motion.div
                            key="blood"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Blood Search Bar */}
                            <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100 grid lg:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest ml-1">Blood Group</label>
                                    <select
                                        className="uiverse-input h-12 px-4 font-bold"
                                        value={bloodGroup}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                    >
                                        {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest ml-1">Location / City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search by city (Delhi, Mumbai, Bangalore, Kolkata...)"
                                            value={locationSearch}
                                            onChange={(e) => { setLocationSearch(e.target.value); setSearchSubmitted(false); }}
                                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                            className="uiverse-input h-12 pl-12 pr-4 relative z-10"
                                            list="city-suggestions"
                                        />
                                        <datalist id="city-suggestions">
                                            {cities.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                                >
                                    <Search className="w-4 h-4" />
                                    Search Availability
                                </button>
                            </div>

                            {/* Active filters info */}
                            {locationSearch && (
                                <div className="flex items-center gap-2 text-sm text-text-gray">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Showing results for <strong className="text-text-dark">{bloodGroup}</strong> in{" "}
                                    <strong className="text-text-dark">{locationSearch}</strong>
                                    <button onClick={() => setLocationSearch("")} className="text-primary text-xs font-bold ml-2 hover:underline">Clear</button>
                                </div>
                            )}

                            {/* Blood Results Table */}
                            <div className="bg-white rounded-[32px] shadow-soft border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="text-xl font-bold">Available Blood Units</h3>
                                    <span className="text-sm text-text-gray">{filteredBlood.length} result{filteredBlood.length !== 1 ? "s" : ""}</span>
                                </div>
                                {filteredBlood.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <h4 className="font-bold text-lg mb-2">No blood units found</h4>
                                        <p className="text-sm text-text-gray mb-4">
                                            No {bloodGroup} blood is available{locationSearch ? ` in "${locationSearch}"` : ""}. Try another blood group or city.
                                        </p>
                                        <button onClick={() => { setLocationSearch(""); setBloodGroup("A+"); }} className="text-primary font-bold text-sm hover:underline">
                                            Reset Search
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50">
                                                <tr>
                                                    <th className="px-8 py-4 text-[10px] font-bold text-text-gray uppercase tracking-widest">Provider</th>
                                                    <th className="px-8 py-4 text-[10px] font-bold text-text-gray uppercase tracking-widest">Group</th>
                                                    <th className="px-8 py-4 text-[10px] font-bold text-text-gray uppercase tracking-widest">Units</th>
                                                    <th className="px-8 py-4 text-[10px] font-bold text-text-gray uppercase tracking-widest">Last Update</th>
                                                    <th className="px-8 py-4 text-[10px] font-bold text-text-gray uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredBlood.map((result, i) => (
                                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <span className="font-bold text-text-dark block">{result.hospital}</span>
                                                            <span className="text-[10px] text-text-gray flex items-center gap-1 mt-0.5">
                                                                <MapPin className="w-3 h-3" /> {result.city}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="w-10 h-10 rounded-full bg-red-50 text-red-600 font-bold border border-red-100 flex items-center justify-center">
                                                                {result.group}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={cn("font-bold", result.units > 5 ? "text-green-600" : "text-amber-500")}>
                                                                {result.units} Units
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-xs text-text-gray italic">{result.lastUpdated}</td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex gap-2 justify-end">
                                                                <button
                                                                    onClick={() => window.open(`tel:${result.contact}`, "_self")}
                                                                    className="p-2 bg-slate-50 text-text-gray rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
                                                                    title={`Call ${result.contact}`}
                                                                >
                                                                    <Phone className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => window.open(`tel:${result.contact}`, "_self")}
                                                                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-bold text-xs hover:bg-primary hover:text-white transition-all"
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
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "oxygen" && (
                        <motion.div
                            key="oxygen"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Location search for oxygen */}
                            <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest ml-1">Filter by City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search city... (Delhi, Mumbai, Bangalore, Kolkata...)"
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 relative z-10"
                                            list="city-suggestions-oxy"
                                        />
                                        <datalist id="city-suggestions-oxy">
                                            {[...new Set(hospitalOxygenData.map(r => r.city))].sort().map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>
                                </div>
                                {locationSearch && (
                                    <button onClick={() => setLocationSearch("")} className="h-12 px-5 border border-slate-200 rounded-xl text-sm font-bold text-text-gray hover:bg-slate-50">
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Oxygen Summary Cards */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { label: "Cylinders Total", value: filteredOxygen.reduce((s, d) => s + d.cylinders, 0).toLocaleString(), icon: Wind, color: "blue" },
                                    { label: "Stable Pipeline", value: `${Math.round((filteredOxygen.filter(d => d.pipeline.includes("Stable")).length / Math.max(filteredOxygen.length, 1)) * 100)}%`, icon: CheckCircle2, color: "teal" },
                                    { label: "Critical / Low", value: filteredOxygen.filter(d => d.status === "Critical" || d.status === "Low" || d.status === "Out").length.toString().padStart(2, "0"), icon: AlertCircle, color: "amber" },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                                            stat.color === 'blue' ? "bg-blue-50 text-blue-600" : stat.color === 'teal' ? "bg-teal-50 text-teal-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-3xl font-extrabold text-text-dark">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Oxygen Inventory Table */}
                            <div className="bg-white rounded-[32px] shadow-soft border border-slate-100 overflow-hidden">
                                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="text-xl font-bold">Oxygen Tanker & Pipeline Monitoring</h3>
                                    <span className="text-sm text-text-gray">{filteredOxygen.length} facilities</span>
                                </div>
                                {filteredOxygen.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Wind className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <h4 className="font-bold text-lg mb-2">No oxygen data found</h4>
                                        <p className="text-sm text-text-gray">No data available for &ldquo;{locationSearch}&rdquo;. Try another city.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50">
                                                <tr>
                                                    <th className="px-8 py-5 text-[10px] font-bold text-text-gray uppercase tracking-widest">Hospital</th>
                                                    <th className="px-8 py-5 text-[10px] font-bold text-text-gray uppercase tracking-widest">Cylinders</th>
                                                    <th className="px-8 py-5 text-[10px] font-bold text-text-gray uppercase tracking-widest">Pipeline</th>
                                                    <th className="px-8 py-5 text-[10px] font-bold text-text-gray uppercase tracking-widest">Status</th>
                                                    <th className="px-8 py-5 text-[10px] font-bold text-text-gray uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredOxygen.map((data, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <span className="font-bold text-text-dark block">{data.hospital}</span>
                                                            <span className="text-[10px] text-text-gray flex items-center gap-1 mt-0.5">
                                                                <MapPin className="w-3 h-3" /> {data.city}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-bold">{data.cylinders}</span>
                                                                <div className="flex-1 min-w-[60px] max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div style={{ width: `${Math.min((data.cylinders / 300) * 100, 100)}%` }} className={cn(
                                                                        "h-full rounded-full",
                                                                        data.cylinders > 100 ? "bg-green-500" : data.cylinders > 50 ? "bg-amber-500" : "bg-red-500"
                                                                    )} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[10px] font-bold border",
                                                                data.pipeline.includes("Stable") ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                            )}>
                                                                {data.pipeline}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={cn(
                                                                "text-xs font-bold uppercase tracking-wider",
                                                                data.status === "Normal" ? "text-green-600" : data.status === "Low" ? "text-amber-500" : "text-red-500"
                                                            )}>
                                                                {data.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <button
                                                                onClick={() => window.open(`tel:${data.contact}`, "_self")}
                                                                className="p-2.5 bg-slate-50 text-text-gray rounded-xl hover:text-primary transition-all flex items-center gap-2 ml-auto"
                                                            >
                                                                <Phone className="w-4 h-4" />
                                                                <span className="text-[10px] font-bold uppercase">Call Now</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "ventilators" && (
                        <motion.div
                            key="ventilators"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Location search for ventilators */}
                            <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest ml-1">Filter by City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search city... (Delhi, Mumbai, Bangalore, Kolkata...)"
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 relative z-10"
                                            list="city-suggestions-vent"
                                        />
                                        <datalist id="city-suggestions-vent">
                                            {[...new Set(ventilatorData.map(r => r.city))].sort().map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>
                                </div>
                                {locationSearch && (
                                    <button onClick={() => setLocationSearch("")} className="h-12 px-5 border border-slate-200 rounded-xl text-sm font-bold text-text-gray hover:bg-slate-50">
                                        Clear
                                    </button>
                                )}
                            </div>

                            {filteredVentilators.length === 0 ? (
                                <div className="bg-white rounded-[32px] p-12 text-center border border-slate-100">
                                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h4 className="font-bold text-lg mb-2">No ventilator data found</h4>
                                    <p className="text-sm text-text-gray">No data for &ldquo;{locationSearch}&rdquo;. Try another city.</p>
                                </div>
                            ) : (
                                <div className="grid lg:grid-cols-2 gap-8">
                                    {filteredVentilators.map((v, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-soft hover:shadow-medium transition-all group">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-1">{v.hospital}</h3>
                                                    <p className="text-sm text-text-gray flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {v.city}
                                                    </p>
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-2 rounded-2xl font-bold text-sm",
                                                    v.available > 0 ? "bg-teal-50 text-teal-600" : "bg-red-50 text-red-600"
                                                )}>
                                                    {v.available} / {v.total} Available
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        style={{ width: `${(v.available / v.total) * 100}%` }}
                                                        className={cn(
                                                            "absolute top-0 left-0 h-full rounded-full transition-all duration-1000",
                                                            v.available > 10 ? "bg-teal-500" : v.available > 0 ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                    />
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {v.types.map(t => (
                                                        <span key={t} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-text-gray tracking-widest uppercase">
                                                            {t} TYPE
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                                    <span className="text-xs text-text-gray italic">Last verified: {v.lastUpdated}</span>
                                                    <button
                                                        onClick={() => window.open(`tel:${v.contact}`, "_self")}
                                                        className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                                                    >
                                                        Book Ventilator <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
