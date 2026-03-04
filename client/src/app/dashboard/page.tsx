"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Building2, LogOut, Bed, ShieldCheck, Wind, Droplets,
    Save, RefreshCw, Activity, TrendingUp, AlertTriangle,
    CheckCircle2, Edit3, Plus, Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HospitalAuth {
    id: string;
    name: string;
    email: string;
    loggedInAt: string;
}

interface SupplyData {
    beds: { general: { total: number; available: number }; icu: { total: number; available: number }; ventilator: { total: number; available: number } };
    oxygen: { cylinders: number; available: number; litersPerMin: number };
    blood: { [group: string]: number };
    lastUpdated: string;
}

const DEFAULT_SUPPLY: SupplyData = {
    beds: {
        general: { total: 50, available: 12 },
        icu: { total: 10, available: 4 },
        ventilator: { total: 5, available: 1 },
    },
    oxygen: { cylinders: 30, available: 22, litersPerMin: 500 },
    blood: { "A+": 12, "A-": 3, "B+": 8, "B-": 2, "AB+": 4, "AB-": 1, "O+": 15, "O-": 6 },
    lastUpdated: new Date().toISOString(),
};

export default function HospitalDashboard() {
    const router = useRouter();
    const [auth, setAuth] = useState<HospitalAuth | null>(null);
    const [supply, setSupply] = useState<SupplyData>(DEFAULT_SUPPLY);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "beds" | "blood" | "oxygen">("overview");

    useEffect(() => {
        const stored = sessionStorage.getItem("hospital-auth");
        if (!stored) {
            router.push("/login");
            return;
        }
        const parsed = JSON.parse(stored) as HospitalAuth;
        setAuth(parsed);

        // Load saved supply data for this hospital
        const savedData = localStorage.getItem(`supply-${parsed.id}`);
        if (savedData) {
            setSupply(JSON.parse(savedData));
        }
    }, [router]);

    const handleSave = async () => {
        if (!auth) return;
        setSaving(true);
        // Simulate API save
        await new Promise((r) => setTimeout(r, 800));
        const updated = { ...supply, lastUpdated: new Date().toISOString() };
        setSupply(updated);
        localStorage.setItem(`supply-${auth.id}`, JSON.stringify(updated));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("hospital-auth");
        router.push("/login");
    };

    const updateBed = (type: "general" | "icu" | "ventilator", field: "total" | "available", delta: number) => {
        setSupply((prev) => {
            const newVal = Math.max(0, prev.beds[type][field] + delta);
            // available can't exceed total
            const safeVal = field === "available" ? Math.min(newVal, prev.beds[type].total) : newVal;
            return {
                ...prev,
                beds: {
                    ...prev.beds,
                    [type]: { ...prev.beds[type], [field]: safeVal },
                },
            };
        });
    };

    const updateBlood = (group: string, delta: number) => {
        setSupply((prev) => ({
            ...prev,
            blood: { ...prev.blood, [group]: Math.max(0, (prev.blood[group] || 0) + delta) },
        }));
    };

    const updateOxygen = (field: keyof SupplyData["oxygen"], delta: number) => {
        setSupply((prev) => ({
            ...prev,
            oxygen: { ...prev.oxygen, [field]: Math.max(0, prev.oxygen[field] + delta) },
        }));
    };

    if (!auth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const totalBeds = supply.beds.general.total + supply.beds.icu.total + supply.beds.ventilator.total;
    const availableBeds = supply.beds.general.available + supply.beds.icu.available + supply.beds.ventilator.available;
    const totalBlood = Object.values(supply.blood).reduce((a, b) => a + b, 0);

    const tabs = [
        { key: "overview" as const, label: "Overview", icon: Activity },
        { key: "beds" as const, label: "Bed Management", icon: Bed },
        { key: "blood" as const, label: "Blood Inventory", icon: Droplets },
        { key: "oxygen" as const, label: "Oxygen & Ventilators", icon: Wind },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Dashboard Header */}
            <div className="bg-white border-b border-slate-100 pt-20 pb-6">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{auth.name}</h1>
                                <p className="text-sm text-text-gray">{auth.email} • Hospital Admin Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all",
                                    saved
                                        ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                        : "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/20",
                                    saving && "opacity-60 cursor-wait"
                                )}
                            >
                                {saving ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : saved ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-text-gray hover:text-red-500 hover:border-red-200 transition-all flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all",
                                    activeTab === tab.key
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-text-gray hover:bg-slate-100"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard label="Total Beds" value={totalBeds} sub={`${availableBeds} available`} icon={Bed} color="blue" />
                            <StatCard label="ICU Beds" value={supply.beds.icu.available} sub={`of ${supply.beds.icu.total} total`} icon={ShieldCheck} color="indigo" />
                            <StatCard label="Blood Units" value={totalBlood} sub="all groups" icon={Droplets} color="red" />
                            <StatCard label="Oxygen" value={supply.oxygen.available} sub={`of ${supply.oxygen.cylinders} cylinders`} icon={Wind} color="teal" />
                        </div>

                        {/* Quick Summary */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
                                <h3 className="font-bold text-lg mb-4">Bed Availability</h3>
                                <div className="space-y-4">
                                    <BedBar label="General" available={supply.beds.general.available} total={supply.beds.general.total} />
                                    <BedBar label="ICU" available={supply.beds.icu.available} total={supply.beds.icu.total} />
                                    <BedBar label="Ventilator" available={supply.beds.ventilator.available} total={supply.beds.ventilator.total} />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
                                <h3 className="font-bold text-lg mb-4">Blood Inventory</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {Object.entries(supply.blood).map(([group, units]) => (
                                        <div key={group} className={cn("p-3 rounded-2xl text-center border", units > 5 ? "bg-green-50 border-green-100" : units > 0 ? "bg-yellow-50 border-yellow-100" : "bg-red-50 border-red-100")}>
                                            <span className="text-xs font-bold text-text-gray block mb-1">{group}</span>
                                            <span className={cn("text-lg font-bold", units > 5 ? "text-green-600" : units > 0 ? "text-yellow-600" : "text-red-500")}>{units}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs text-text-gray">
                            Last updated: {new Date(supply.lastUpdated).toLocaleString()}
                        </div>
                    </motion.div>
                )}

                {/* Beds Tab */}
                {activeTab === "beds" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="grid lg:grid-cols-3 gap-6">
                            {(["general", "icu", "ventilator"] as const).map((type) => (
                                <div key={type} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
                                    <h3 className="font-bold text-lg mb-6 capitalize flex items-center gap-2">
                                        {type === "general" && <Bed className="w-5 h-5 text-blue-500" />}
                                        {type === "icu" && <ShieldCheck className="w-5 h-5 text-indigo-500" />}
                                        {type === "ventilator" && <Wind className="w-5 h-5 text-teal-500" />}
                                        {type === "general" ? "General Beds" : type === "icu" ? "ICU Beds" : "Ventilator Beds"}
                                    </h3>

                                    <div className="space-y-6">
                                        <NumberInput
                                            label="Total Capacity"
                                            value={supply.beds[type].total}
                                            onIncrement={() => updateBed(type, "total", 1)}
                                            onDecrement={() => updateBed(type, "total", -1)}
                                        />
                                        <NumberInput
                                            label="Currently Available"
                                            value={supply.beds[type].available}
                                            onIncrement={() => updateBed(type, "available", 1)}
                                            onDecrement={() => updateBed(type, "available", -1)}
                                            max={supply.beds[type].total}
                                        />
                                        <div className="pt-4 border-t border-slate-50">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-gray">Occupied</span>
                                                <span className="font-bold text-text-dark">{supply.beds[type].total - supply.beds[type].available}</span>
                                            </div>
                                            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-300"
                                                    style={{ width: `${supply.beds[type].total > 0 ? ((supply.beds[type].total - supply.beds[type].available) / supply.beds[type].total) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Blood Tab */}
                {activeTab === "blood" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Blood Bank Inventory</h3>
                                <span className="text-sm text-text-gray">Total: <strong className="text-text-dark">{totalBlood} units</strong></span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(supply.blood).map(([group, units]) => (
                                    <div key={group} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="w-10 h-10 bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center justify-center text-xs font-bold">{group}</span>
                                            {units <= 3 && (
                                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                            )}
                                        </div>
                                        <NumberInput
                                            label="Units"
                                            value={units}
                                            onIncrement={() => updateBlood(group, 1)}
                                            onDecrement={() => updateBlood(group, -1)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Oxygen Tab */}
                {activeTab === "oxygen" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <Wind className="w-5 h-5 text-teal-500" />
                                    Oxygen Supply
                                </h3>
                                <div className="space-y-6">
                                    <NumberInput
                                        label="Total Cylinders"
                                        value={supply.oxygen.cylinders}
                                        onIncrement={() => updateOxygen("cylinders", 1)}
                                        onDecrement={() => updateOxygen("cylinders", -1)}
                                    />
                                    <NumberInput
                                        label="Available Cylinders"
                                        value={supply.oxygen.available}
                                        onIncrement={() => updateOxygen("available", 1)}
                                        onDecrement={() => updateOxygen("available", -1)}
                                        max={supply.oxygen.cylinders}
                                    />
                                    <NumberInput
                                        label="Flow Rate (L/min)"
                                        value={supply.oxygen.litersPerMin}
                                        onIncrement={() => updateOxygen("litersPerMin", 50)}
                                        onDecrement={() => updateOxygen("litersPerMin", -50)}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                    Ventilator Status
                                </h3>
                                <div className="space-y-6">
                                    <NumberInput
                                        label="Total Ventilators"
                                        value={supply.beds.ventilator.total}
                                        onIncrement={() => updateBed("ventilator", "total", 1)}
                                        onDecrement={() => updateBed("ventilator", "total", -1)}
                                    />
                                    <NumberInput
                                        label="Available Ventilators"
                                        value={supply.beds.ventilator.available}
                                        onIncrement={() => updateBed("ventilator", "available", 1)}
                                        onDecrement={() => updateBed("ventilator", "available", -1)}
                                        max={supply.beds.ventilator.total}
                                    />
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                        <p className="text-xs font-bold text-primary mb-1">Utilization Rate</p>
                                        <p className="text-2xl font-bold text-text-dark">
                                            {supply.beds.ventilator.total > 0
                                                ? Math.round(((supply.beds.ventilator.total - supply.beds.ventilator.available) / supply.beds.ventilator.total) * 100)
                                                : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

/* ──── Sub-components ──── */

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: number; sub: string; icon: any; color: string }) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        red: "bg-red-50 text-red-600 border-red-100",
        teal: "bg-teal-50 text-teal-600 border-teal-100",
    };
    return (
        <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 border", colors[color])}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-text-dark">{value}</p>
            <p className="text-xs text-text-gray font-medium mt-1">{label} • {sub}</p>
        </div>
    );
}

function BedBar({ label, available, total }: { label: string; available: number; total: number }) {
    const pct = total > 0 ? (available / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-text-dark">{label}</span>
                <span className="text-sm font-bold text-text-dark">{available}/{total}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", pct > 30 ? "bg-green-500" : pct > 10 ? "bg-yellow-500" : "bg-red-500")}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function NumberInput({ label, value, onIncrement, onDecrement, max }: { label: string; value: number; onIncrement: () => void; onDecrement: () => void; max?: number }) {
    return (
        <div>
            <label className="text-sm font-medium text-text-gray mb-2 block">{label}</label>
            <div className="flex items-center gap-3">
                <button
                    onClick={onDecrement}
                    disabled={value <= 0}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors disabled:opacity-30"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-text-dark min-w-[50px] text-center">{value}</span>
                <button
                    onClick={onIncrement}
                    disabled={max !== undefined && value >= max}
                    className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors disabled:opacity-30"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
