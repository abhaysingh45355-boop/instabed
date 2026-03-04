'use client';
import { useRef, useState } from 'react';

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

const SpotlightCard = ({
    children,
    className = '',
    spotlightColor = 'rgba(37, 99, 235, 0.08)'
}: SpotlightCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!divRef.current || isFocused) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(0.6);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(0.6);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-[32px] border border-slate-100 bg-white overflow-hidden p-8 shadow-soft ${className}`}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
                style={{
                    opacity,
                    background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
                }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default SpotlightCard;
