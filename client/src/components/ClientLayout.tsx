"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingBot from "@/components/FloatingBot";
import BackgroundVideo from "@/components/BackgroundVideo";
import DotSpinnerLoader from "@/components/DotSpinnerLoader";

// Dynamic import to avoid SSR issues with Three.js
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DotSpinnerLoader />
            <BackgroundVideo />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <FloatingBot />
        </>
    );
}
