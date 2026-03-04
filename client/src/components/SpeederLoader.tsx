"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function SpeederLoader() {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800); // Shorter duration for page transitions

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="loader">
                            <span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                            <div className="base">
                                <span></span>
                                <div className="face"></div>
                            </div>
                        </div>
                        <div className="longfazers">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className="absolute bottom-1/4 text-center">
                            <h2 className="text-2xl font-black tracking-[0.2em] uppercase text-slate-900 animate-pulse">
                                Instabed is Loading
                            </h2>
                            <p className="text-sm font-bold text-slate-500 mt-2 tracking-widest uppercase">
                                Initializing Medical Infrastructure...
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
