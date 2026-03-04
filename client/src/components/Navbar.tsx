"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PhoneCall, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Find Hospitals", href: "/hospitals" },
    { name: "Medical Supplies", href: "/supplies" },
    { name: "Emergency", href: "/emergency" },
    { name: "AI Doctor", href: "/ai-doctor" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-primary/90 backdrop-blur-md py-3 shadow-soft border-white/10"
                    : "bg-primary/75 backdrop-blur-sm py-5 border-transparent"
            )}
        >
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
                        <span className="text-primary font-bold text-xl">I</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">
                        Insta<span className="text-blue-100">bed</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative text-sm font-medium transition-colors hover:text-white",
                                pathname === item.href ? "text-white" : "text-white/80"
                            )}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Right CTA */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                        Hospital Login
                    </Link>
                    <Link
                        href="tel:102"
                        className="btn-emergency flex items-center gap-2 text-sm"
                    >
                        <PhoneCall className="w-4 h-4" />
                        Emergency
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
                    >
                        <div className="container-custom py-6 flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between py-2 text-lg font-medium",
                                        pathname === item.href ? "text-primary" : "text-text-dark"
                                    )}
                                >
                                    {item.name}
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3 bg-slate-50 text-center rounded-lg font-medium text-text-dark"
                                >
                                    Hospital Login
                                </Link>
                                <Link
                                    href="tel:102"
                                    onClick={() => setIsOpen(false)}
                                    className="btn-emergency text-center"
                                >
                                    Emergency Call
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
