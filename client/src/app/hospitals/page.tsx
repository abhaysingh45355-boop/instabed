"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Filter, List, Grid2X2, Compass, X, RefreshCw, WifiOff, Loader2 } from "lucide-react";
import HospitalCardComponent, { Hospital } from "@/components/HospitalCard";
import { cn } from "@/lib/utils";

// Haversine formula to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Transform API response from DB shape → Hospital card shape
function transformHospital(h: any): Hospital {
    return {
        id: h.id,
        name: h.name,
        address: h.address,
        city: h.city,
        lat: h.latitude ?? 0,
        lng: h.longitude ?? 0,
        distance: "—",
        distanceKm: 0,
        contact: h.contact_number,
        beds: {
            general: {
                total: h.beds?.total_general ?? 0,
                available: h.beds?.available_general ?? 0,
            },
            icu: {
                total: h.beds?.total_icu ?? 0,
                available: h.beds?.available_icu ?? 0,
            },
            ventilator: {
                total: h.beds?.total_ventilator ?? 0,
                available: h.beds?.available_ventilator ?? 0,
            },
        },
        oxygen: (h.oxygen?.cylinders_available ?? 0) > 0,
        blood: (h.blood ?? []).filter((b: any) => b.units_available > 0).map((b: any) => b.blood_group),
        isVerified: h.is_verified ?? false,
        lastUpdated: h.beds?.last_updated || h.updated_at,
    };
}


export default function HospitalsPage() {
    const [search, setSearch] = useState("");
    const [view, setView] = useState("grid");
    const [locationFetching, setLocationFetching] = useState(false);
    const [locationStatus, setLocationStatus] = useState("");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Data fetching state
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    // Filter states
    const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [widerRange, setWiderRange] = useState(false);
    const [externalHospitals, setExternalHospitals] = useState<Hospital[]>([]);
    const [isFetchingExternal, setIsFetchingExternal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        generalBeds: false,
        icuBeds: false,
        ventilators: false,
        oxygen: false,
    });
    const [bloodGroup, setBloodGroup] = useState("");
    const [maxDistance, setMaxDistance] = useState(50);

    // Selected hospital for detail modal
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

    // Fetch hospitals from the database API
    const fetchHospitals = async () => {
        setIsLoading(true);
        setFetchError("");
        try {
            const res = await fetch("/api/hospitals");
            if (!res.ok) {
                throw new Error("Failed to fetch hospitals");
            }
            const data = await res.json();
            const transformed = (Array.isArray(data) ? data : []).map(transformHospital);
            setHospitals(transformed);
        } catch (err: any) {
            console.error("Failed to load hospitals:", err);
            setFetchError(err.message || "Failed to load hospitals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleLocationClick = () => {
        if (!navigator.geolocation) {
            setLocationStatus("Geolocation not supported");
            return;
        }
        setLocationFetching(true);
        setLocationStatus("");
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserCoords(coords);
                setLocationFetching(false);
                setLocationStatus(`📍 Located. Fetching nearby hospitals...`);
                
                // Fetch from Google Places API via our proxy
                setIsFetchingExternal(true);
                try {
                    const radius = maxDistance * 1000; // convert km to meters
                    const response = await fetch(`/api/google/places?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`);
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setExternalHospitals(data);
                        setLocationStatus(`📍 Successfully found ${data.length} nearby hospitals from Google!`);
                    }
                } catch (err) {
                    console.error("External fetch failed:", err);
                    setLocationStatus("📍 Located. Showing distances based on your location.");
                } finally {
                    setIsFetchingExternal(false);
                }
            },
            (err) => {
                setLocationFetching(false);
                setLocationStatus("Location access denied. Using default distances.");
            },
            { enableHighAccuracy: true }
        );
    };

    const handleFilterToggle = (key: keyof typeof filters) => {
        setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleResetFilters = () => {
        setFilters({ generalBeds: false, icuBeds: false, ventilators: false, oxygen: false });
        setBloodGroup("");
        setMaxDistance(50);
        setSearch("");
    };

    // Filtered and Sorted hospitals
    const filteredHospitals = useMemo(() => {
        const combinedBase = [...hospitals, ...externalHospitals];
        
        const hospitalsWithRealDist = combinedBase.map(h => {
            if (userCoords) {
                const dist = getDistanceFromLatLonInKm(userCoords.lat, userCoords.lng, h.lat, h.lng);
                return { ...h, distanceKm: dist, distance: `${dist.toFixed(1)} km` };
            }
            return h;
        });

        let filtered = hospitalsWithRealDist.filter((h) => {
            // Search filter
            if (search) {
                const q = search.toLowerCase();
                if (!h.name.toLowerCase().includes(q) && !h.address.toLowerCase().includes(q) && !h.city.toLowerCase().includes(q)) {
                    return false;
                }
            }
            
            // City-level "Wider Range" logic
            const isCitySearch = search && hospitals.some(mh => mh.city.toLowerCase() === search.toLowerCase());
            if (isCitySearch && widerRange && h.city.toLowerCase() === search.toLowerCase()) {
                // Skip distance filter if it's a city search with wider range
            } else {
                // Distance filter — only if user location is available
                if (userCoords && h.distanceKm > maxDistance) return false;
            }

            // Availability filters
            if (filters.generalBeds && h.beds.general.available === 0) return false;
            if (filters.icuBeds && h.beds.icu.available === 0) return false;
            if (filters.ventilators && h.beds.ventilator.available === 0) return false;
            if (filters.oxygen && !h.oxygen) return false;
            // Blood group filter
            if (bloodGroup && !h.blood.includes(bloodGroup)) return false;

            return true;
        });

        // Sort by distance if location available
        if (userCoords) {
            filtered.sort((a, b) => a.distanceKm - b.distanceKm);
        }

        return filtered;
    }, [search, filters, bloodGroup, maxDistance, userCoords, widerRange, hospitals, externalHospitals]);

    const activeFilterCount = Object.values(filters).filter(Boolean).length + (bloodGroup ? 1 : 0) + (maxDistance < 50 ? 1 : 0);

    const FilterPanel = () => (
        <div className="space-y-6">
            {/* Bed Type */}
            <div>
                <p className="text-sm font-bold text-text-dark mb-3">Availability</p>
                <div className="space-y-2">
                    {[
                        { key: "generalBeds" as const, label: "General Beds" },
                        { key: "icuBeds" as const, label: "ICU Beds" },
                        { key: "ventilators" as const, label: "Ventilators" },
                        { key: "oxygen" as const, label: "Oxygen" },
                    ].map((f) => (
                        <label key={f.key} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters[f.key]}
                                onChange={() => handleFilterToggle(f.key)}
                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-text-gray group-hover:text-text-dark transition-colors">{f.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Blood Group */}
            <div>
                <p className="text-sm font-bold text-text-dark mb-3">Blood Group</p>
                <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">All Groups</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>

            {/* Distance Slider */}
            <div>
                <p className="text-sm font-bold text-text-dark mb-3">
                    Search Radius: <span className="text-primary">{maxDistance} km</span>
                </p>
                <input
                    type="range"
                    className="w-full accent-primary"
                    min="1"
                    max="500"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-text-gray mt-2 font-medium">
                    <span>1 km</span>
                    <span>500 km</span>
                </div>
            </div>

            {/* Wider Range Toggle */}
            <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={widerRange}
                            onChange={() => setWiderRange(!widerRange)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <div>
                        <span className="text-sm font-bold text-text-dark group-hover:text-primary transition-colors">Wider Range</span>
                        <p className="text-[10px] text-text-gray">Show all hospitals in the selected city</p>
                    </div>
                </label>
            </div>
        </div>
    );

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="bg-transparent min-h-screen">
                <div className="bg-white/70 backdrop-blur-lg border-b border-slate-100 py-10 pt-20">
                    <div className="container-custom">
                        <h1 className="text-3xl font-bold mb-6">Find Hospitals Near You</h1>
                        <div className="flex items-center gap-3 text-text-gray">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span className="text-sm">Loading hospitals from database...</span>
                        </div>
                    </div>
                </div>
                <div className="container-custom py-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 animate-pulse">
                                <div className="h-5 bg-slate-200 rounded-lg w-3/4 mb-3" />
                                <div className="h-3 bg-slate-100 rounded w-1/2 mb-6" />
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="h-20 bg-slate-100 rounded-2xl" />
                                    <div className="h-20 bg-slate-100 rounded-2xl" />
                                    <div className="h-20 bg-slate-100 rounded-2xl" />
                                </div>
                                <div className="h-8 bg-slate-100 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (fetchError) {
        return (
            <div className="bg-transparent min-h-screen">
                <div className="bg-white/70 backdrop-blur-lg border-b border-slate-100 py-10 pt-20">
                    <div className="container-custom">
                        <h1 className="text-3xl font-bold mb-6">Find Hospitals Near You</h1>
                    </div>
                </div>
                <div className="container-custom py-20 flex flex-col items-center justify-center gap-4">
                    <WifiOff className="w-16 h-16 text-slate-300" />
                    <h2 className="text-xl font-bold">Failed to Load Hospitals</h2>
                    <p className="text-sm text-text-gray text-center max-w-md">{fetchError}</p>
                    <button
                        onClick={fetchHospitals}
                        className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-transparent min-h-screen">
            <div className="bg-white/70 backdrop-blur-lg border-b border-slate-100 py-10 pt-20">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">Find Hospitals Near You</h1>
                        <button
                            onClick={fetchHospitals}
                            className="px-4 py-2 text-xs font-bold text-primary hover:text-blue-700 transition-colors flex items-center gap-1.5 bg-blue-50 rounded-xl border border-blue-100"
                            title="Refresh hospital data"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Refresh
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 relative z-10">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray w-5 h-5 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search hospital name, area or city..."
                                className="uiverse-input pl-12"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleLocationClick}
                                disabled={locationFetching}
                                className={cn(
                                    "px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-sm font-medium hover:bg-slate-50 transition-all",
                                    locationFetching && "opacity-60 cursor-wait"
                                )}
                            >
                                <MapPin className={cn("w-4 h-4", locationFetching && "animate-pulse text-primary")} />
                                {locationFetching ? "Detecting..." : "Current Location"}
                            </button>
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="lg:hidden px-4 py-4 border border-slate-200 rounded-2xl bg-white relative"
                            >
                                <Filter className="w-5 h-5" />
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Location status */}
                    {locationStatus && (
                        <p className="mt-3 text-sm text-text-gray">
                            {locationStatus}
                        </p>
                    )}
                </div>
            </div>

            <div className="container-custom py-10">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Desktop Filters Panel */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 sticky top-32">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Filters</h3>
                                <button
                                    onClick={handleResetFilters}
                                    className="text-primary text-xs font-bold uppercase tracking-wider hover:underline"
                                >
                                    Reset
                                </button>
                            </div>
                            <FilterPanel />
                        </div>
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
                            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-auto shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold">Filters</h3>
                                    <button onClick={() => setShowMobileFilters(false)}>
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <FilterPanel />
                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={handleResetFilters}
                                        className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Grid */}
                    <main className="lg:col-span-9">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-text-gray">
                                Showing <span className="font-bold text-text-dark">{filteredHospitals.length}</span> hospital{filteredHospitals.length !== 1 ? "s" : ""}{" "}
                                {hospitals.length > 0 && <span className="text-xs">(from database)</span>}
                                {activeFilterCount > 0 && (
                                    <span className="ml-2 text-primary text-xs font-bold">
                                        ({activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active)
                                    </span>
                                )}
                            </p>
                            <div className="flex items-center gap-2 p-1 bg-white border border-slate-100 rounded-xl">
                                <button
                                    onClick={() => setView("grid")}
                                    className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text-gray hover:bg-slate-50")}
                                >
                                    <Grid2X2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setView("list")}
                                    className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text-gray hover:bg-slate-50")}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <div className="w-px h-6 bg-slate-100 mx-1" />
                                <button
                                    onClick={() => window.open("https://www.google.com/maps/search/hospitals+near+me", "_blank")}
                                    className="flex items-center gap-2 p-2 px-3 text-xs font-bold text-text-gray hover:text-primary transition-colors"
                                >
                                    <Compass className="w-4 h-4" />
                                    MAP VIEW
                                </button>
                            </div>
                        </div>

                        {filteredHospitals.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-2">No hospitals found</h3>
                                <p className="text-text-gray text-sm mb-6">
                                    {hospitals.length === 0
                                        ? "No hospitals are registered yet. Run the seed script to add demo data."
                                        : "Try adjusting your search or filters"}
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        ) : (
                            <div className={cn("grid gap-6", view === "grid" ? "md:grid-cols-2" : "grid-cols-1")}>
                                {filteredHospitals.map((h) => (
                                    <HospitalCardComponent
                                        key={h.id}
                                        hospital={h}
                                        onCall={(contact) => window.open(`tel:${contact}`, "_self")}
                                        onDetails={(hospital) => setSelectedHospital(hospital)}
                                        onGetDirections={(address) => window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, "_blank")}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Hospital Detail Modal */}
            {selectedHospital && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedHospital(null)} />
                    <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-auto">
                        <button
                            onClick={() => setSelectedHospital(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h2 className="text-2xl font-bold mb-1">{selectedHospital.name}</h2>
                        <p className="text-sm text-text-gray mb-6 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {selectedHospital.address} • {selectedHospital.distance}
                        </p>

                        <div className="space-y-4 mb-6">
                            <h4 className="font-bold text-sm text-text-dark">Bed Availability</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <DetailStat label="General" available={selectedHospital.beds.general.available} total={selectedHospital.beds.general.total} />
                                <DetailStat label="ICU" available={selectedHospital.beds.icu.available} total={selectedHospital.beds.icu.total} />
                                <DetailStat label="Ventilator" available={selectedHospital.beds.ventilator.available} total={selectedHospital.beds.ventilator.total} />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-sm text-text-dark mb-3">Blood Groups Available</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedHospital.blood.length > 0 ? (
                                    selectedHospital.blood.map((group) => (
                                        <span key={group} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
                                            {group}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-text-gray">No blood group data available</span>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-sm text-text-dark mb-2">Oxygen Supply</h4>
                            <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full", selectedHospital.oxygen ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                                <span className={cn("w-2 h-2 rounded-full", selectedHospital.oxygen ? "bg-green-500" : "bg-red-500")} />
                                {selectedHospital.oxygen ? "Available" : "Not Available"}
                            </span>
                        </div>

                        {/* Last Updated timestamp */}
                        {(selectedHospital as any).lastUpdated && (
                            <div className="mb-6 text-xs text-text-gray">
                                Last updated: {new Date((selectedHospital as any).lastUpdated).toLocaleString()}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => window.open(`tel:${selectedHospital.contact}`, "_self")}
                                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                📞 Call Now
                            </button>
                            <button
                                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedHospital.address)}`, "_blank")}
                                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                🗺️ Get Directions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailStat({ label, available, total }: { label: string; available: number; total: number }) {
    const percentage = total > 0 ? (available / total) * 100 : 0;
    return (
        <div className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1">{label}</p>
            <p className={cn("text-xl font-bold", available > 0 ? "text-green-600" : "text-red-500")}>{available}</p>
            <p className="text-[10px] text-text-gray">of {total}</p>
            <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all", available > 0 ? "bg-green-500" : "bg-red-400")}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
