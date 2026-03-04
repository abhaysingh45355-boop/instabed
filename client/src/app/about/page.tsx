"use client";

import React from "react";
import Image from "next/image";
import { Target, Eye, Users, Calendar, Award, ShieldCheck, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const values = [
    { title: "Trust & Transparency", desc: "Providing factual, real-time availability verified by hospitals directly.", icon: ShieldCheck },
    { title: "Empathetic Technology", desc: "Designed with the sensitivity that medical emergencies demand.", icon: HeartPulse },
    { title: "National Scale", desc: "Building infrastructure that connects every corner of the health ecosystem.", icon: Award },
];

const team = [
    { name: "Dr. Ananya Sharma", role: "Chief Medical Officer", image: "https://images.unsplash.com/photo-1559839734-2b71f1e9cbee?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Vikram Malhotra", role: "Head of Infrastructure", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Sarah Joseph", role: "Product Design Lead", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Rajiv Menon", role: "CTO & AI Systems", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200" },
];

export default function AboutPage() {
    return (
        <div className="transparent min-h-screen">
            {/* Hero Section */}
            <section className="bg-transparent py-24 pt-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 skew-x-12 translate-x-1/2 backdrop-blur-[2px]" />
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[800px]"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white shadow-sm border border-slate-100 rounded-lg text-primary text-xs font-bold mb-6">
                            <Calendar className="w-4 h-4" />
                            <span>ESTABLISHED 2024</span>
                        </div>
                        <h1 className="mb-6 text-slate-900 drop-shadow-md">We're on a mission to modernize India's medical infrastructure.</h1>
                        <p className="text-slate-700 text-xl leading-relaxed font-medium drop-shadow-sm">
                            Instabed was born out of a simple observation: during medical emergencies, every second counts. Finding a bed, blood, or oxygen shouldn't be a matter of luck or multiple phone calls.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding">
                <div className="container-custom grid lg:grid-cols-2 gap-20">
                    <div className="bg-white/40 backdrop-blur-md p-12 rounded-[60px] relative overflow-hidden border border-white/20 shadow-xl">
                        <Target className="w-12 h-12 text-primary mb-8" />
                        <h2 className="mb-6 text-slate-900 drop-shadow-sm">Our Mission</h2>
                        <p className="text-slate-700 text-lg leading-relaxed font-medium">
                            To build a unified, intelligent, and real-time medical resource network that ensures no patient is ever turned away due to a lack of information. We strive to connect healthcare providers and patients through a transparent digital layer.
                        </p>
                    </div>
                    <div className="bg-teal-50/40 backdrop-blur-md p-12 rounded-[60px] relative overflow-hidden border border-white/20 shadow-xl">
                        <Eye className="w-12 h-12 text-teal-600 mb-8" />
                        <h2 className="mb-6 text-slate-900 drop-shadow-sm">Our Vision</h2>
                        <p className="text-slate-700 text-lg leading-relaxed font-medium">
                            To become the national backbone of emergency healthcare information, making medical resource management as seamless as ordering a meal or booking a ride. A future where infrastructure intelligence saves lives every day.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section-padding bg-transparent">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="mb-4">Our Core Values</h2>
                        <p className="text-text-gray max-w-[600px] mx-auto">The principles that guide every feature we build and every hospital we partner with.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="bg-white/60 backdrop-blur-md p-10 rounded-[40px] shadow-soft border border-white/20 hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-8">
                                    <v.icon className="w-7 h-7" />
                                </div>
                                <h3 className="mb-4">{v.title}</h3>
                                <p className="text-text-gray">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="mb-4">Our Founding Team</h2>
                        <p className="text-text-gray max-w-[600px] mx-auto">A diverse group of doctors, engineers, and designers committed to healthcare reform.</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="text-center group"
                            >
                                <div className="relative w-full aspect-square rounded-[40px] overflow-hidden mb-6 bg-slate-100 ring-1 ring-slate-100 ring-offset-4 group-hover:ring-primary transition-all">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                                <p className="text-sm font-bold text-primary uppercase tracking-widest">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section Placeholder */}
            <section className="section-padding bg-transparent overflow-hidden">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="mb-4">Our Journey</h2>
                        <p className="text-text-gray">From a concept to a national infrastructure project.</p>
                    </div>

                    <div className="relative pt-12">
                        {/* Horizontal Line */}
                        <div className="absolute top-[162px] left-0 right-0 h-1 bg-primary/20" />

                        <div className="grid grid-cols-4 gap-4 relative z-10">
                            {[
                                { year: "2024 JAN", title: "Conceptualization", desc: "First design of the real-time bed tracker.", color: "bg-blue-600" },
                                { year: "2024 MAY", title: "Hospital Beta", desc: "Launched with 50 partner hospitals in Delhi NCR.", color: "bg-teal-600" },
                                { year: "2024 OCT", title: "AI Doctor Launch", desc: "Integrated clinical symptom triage engine.", color: "bg-indigo-600" },
                                { year: "2025 JAN", title: "National Expansion", desc: "Crossing 2,000+ facilities nationwide.", color: "bg-red-600" },
                            ].map((step, i) => (
                                <div key={i} className="px-4">
                                    <div className={cn("w-8 h-8 rounded-full border-4 border-white shadow-md mx-auto mb-8 relative z-20", step.color)}>
                                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-slate-900 font-black whitespace-nowrap drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">{step.year}</span>
                                    </div>
                                    <h4 className="text-center font-bold mb-2 text-slate-900">{step.title}</h4>
                                    <p className="text-center text-xs text-slate-700 font-medium px-4">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
