"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DotSpinnerLoader() {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[10000] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="relative flex items-center justify-center scale-150">
                        <div className="spinner">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                    <div className="mt-20 text-center">
                        <h2 className="text-xl font-black tracking-[0.2em] uppercase text-slate-900 animate-pulse">
                            Instabed
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 mt-2 tracking-widest uppercase">
                            Syncing Hospital Data...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
