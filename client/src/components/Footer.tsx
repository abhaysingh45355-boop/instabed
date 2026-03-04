"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Twitter, Linkedin, Github, ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">I</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-text-dark">
                                Insta<span className="text-primary">bed</span>
                            </span>
                        </Link>
                        <p className="text-sm text-text-gray leading-relaxed mb-6">
                            Empowering healthcare through real-time infrastructure intelligence. Connecting patients to resources when every second counts.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-text-gray hover:bg-primary hover:text-white transition-all">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-text-dark uppercase tracking-widest mb-6">Platform</h4>
                        <ul className="space-y-4">
                            {["Find Hospitals", "Blood Bank", "Oxygen Tracker", "AI Doctor", "Emergency"].map((link) => (
                                <li key={link}>
                                    <Link href={`/${link.toLowerCase().replace(" ", "-")}`} className="text-sm text-text-gray hover:text-primary transition-colors flex items-center gap-1 group">
                                        {link}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-bold text-text-dark uppercase tracking-widest mb-6">Resources</h4>
                        <ul className="space-y-4">
                            {["About Us", "Contact", "Privacy Policy", "Terms of Service", "Hospital Login"].map((link) => (
                                <li key={link}>
                                    <Link href={`/${link.toLowerCase().replace(" ", "-")}`} className="text-sm text-text-gray hover:text-primary transition-colors flex items-center gap-1 group">
                                        {link}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold text-text-dark uppercase tracking-widest mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-text-gray">
                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                Cyber City, Phase 3, Gurugram, India
                            </li>
                            <li className="flex items-center gap-3 text-sm text-text-gray">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <a href="tel:1800-46782-233" className="hover:text-primary transition-colors">1800-INSTA-BED</a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-text-gray">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                support@instabed.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-gray font-medium">
                        © {new Date().getFullYear()} Instabed Technologies. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest">Enterprise Grade Architecture</p>
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            All Systems Operational
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
