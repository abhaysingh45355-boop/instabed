"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, Bot, User, Sparkles, AlertCircle, Info, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    type: "ai" | "user";
    content: string;
    timestamp: Date;
}

export default function AIDoctorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            type: "ai",
            content: "Hello! I am your AI Medical Assistant. Please describe your symptoms or any health concerns you have, and I will guide you with preliminary triage and advice.",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            type: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Mock AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: "I understand. Based on your description, this could be related to several factors. Have you experienced any fever, dizziness, or chest pain recently?",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col pt-20">
            <div className="flex-1 container-custom py-8 lg:py-12 flex flex-col lg:flex-row gap-12 overflow-hidden">

                {/* Left Side: Info & Illustration */}
                <div className="lg:w-1/3 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-light text-primary rounded-lg text-xs font-bold mb-4 border border-blue-100">
                            <Sparkles className="w-4 h-4" />
                            POWERED BY INTEL-MED AI
                        </div>
                        <h1 className="text-3xl font-bold mb-4 leading-tight">Your Digital Health Companion</h1>
                        <p className="text-text-gray mb-8">
                            Instabed AI Doctor uses advanced medical knowledge to help you triage symptoms and find the right care path.
                        </p>

                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
                            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">Medical Disclaimer</p>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    This AI assistant provides general information and does not replace professional medical advice, diagnosis, or treatment. In case of emergency, call <a href="tel:102" className="font-bold underline">102</a> immediately.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="hidden lg:block relative flex-1 opacity-80">
                        <Image
                            src="/ai-doctor.png"
                            alt="AI Doctor illustration"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Right Side: Chat Interface */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 bg-white rounded-[40px] shadow-medium border border-slate-100 flex flex-col overflow-hidden max-h-[80vh] lg:max-h-none"
                >
                    {/* Chat Header */}
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-text-dark">Instabed AI Doctor</h3>
                                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Always Active</p>
                            </div>
                        </div>
                        <button className="p-3 text-text-gray hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth"
                    >
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex gap-4 max-w-[85%]",
                                    msg.type === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                    msg.type === "ai" ? "bg-primary-light text-primary" : "bg-slate-100 text-slate-600"
                                )}>
                                    {msg.type === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl md:p-5 text-sm leading-relaxed",
                                    msg.type === "ai"
                                        ? "bg-blue-50/50 text-text-dark rounded-tl-none border border-blue-50"
                                        : "bg-primary text-white rounded-tr-none shadow-md"
                                )}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-4 max-w-[85%] mr-auto">
                                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="p-4 bg-blue-50/50 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 md:p-8 pt-0">
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-2 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <input
                                type="text"
                                placeholder="Describe your symptoms (e.g., 'I have a headache and fever')..."
                                className="flex-1 bg-transparent border-none outline-none p-4 text-sm font-medium"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 px-2">
                            {["Symptom Check", "Nearest ICU", "Blood Request Help"].map(tag => (
                                <button key={tag} className="text-[10px] font-bold text-text-gray uppercase tracking-widest px-3 py-1.5 bg-white border border-slate-100 rounded-full hover:border-primary/20 hover:text-primary transition-all">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
