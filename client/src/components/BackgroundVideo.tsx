"use client";

import React from "react";

export default function BackgroundVideo() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
            >
                <source src="/as12.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* Overlay to ensure readability and cinematic feel */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
        </div>
    );
}
