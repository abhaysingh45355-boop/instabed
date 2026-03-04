"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        hospital: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Message sent! Our team will get back to you shortly.");
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-24">
            <div className="container-custom">
                <div className="max-w-[1000px] mx-auto grid lg:grid-cols-5 gap-12">

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl font-black mb-6">Get in touch.</h1>
                            <p className="text-text-gray text-lg leading-relaxed mb-10">
                                Have questions about our platform or want to register your hospital? We're here to help.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, label: "Email support", value: "hello@instabed.com" },
                                { icon: Phone, label: "Phone", value: "+91 1800-INSTA-BED" },
                                { icon: MapPin, label: "Office", value: "Cyber City, Phase 3, Gurugram, HR 122002" },
                                { icon: Clock, label: "Availability", value: "24/7 Crisis Support" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest mb-1">{item.label}</p>
                                        {item.label === "Phone" ? (
                                            <a href="tel:1800-46782-233" className="font-bold text-text-dark hover:text-primary transition-colors underline decoration-primary/20">{item.value}</a>
                                        ) : (
                                            <p className="font-bold text-text-dark">{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-primary-light p-8 rounded-[40px] mt-12">
                            <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                For Hospitals
                            </h4>
                            <p className="text-sm text-blue-800 font-medium mb-6">
                                Join over 2,500 hospitals saving lives with real-time transparency.
                            </p>
                            <button className="flex items-center gap-2 text-primary font-black text-sm hover:gap-3 transition-all">
                                Partner Registration <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[48px] p-8 md:p-12 shadow-medium border border-slate-100"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-text-dark ml-2 uppercase tracking-widest">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="uiverse-input"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-text-dark ml-2 uppercase tracking-widest">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            className="uiverse-input"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-dark ml-2 uppercase tracking-widest">Hospital Name (Optional)</label>
                                    <input
                                        type="text"
                                        className="uiverse-input"
                                        placeholder="E.g. City General Hospital"
                                        value={formData.hospital}
                                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-dark ml-2 uppercase tracking-widest">How can we help?</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="uiverse-input"
                                        placeholder="Tell us about your concern or inquiry..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
