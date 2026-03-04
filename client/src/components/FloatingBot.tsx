"use client";

import React, { useState } from "react";
import { Bot, X, Send, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FloatingBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: "ai", text: "Hi! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { type: "user", text: input }]);
        setInput("");
        setTimeout(() => {
            setMessages(prev => [...prev, { type: "ai", text: "I'm processing that... For a full triage, please visit our dedicated AI Doctor page." }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold leading-none">Instabed AI</p>
                                    <p className="text-[10px] opacity-80 mt-1">Symptom Triage</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href="/ai-doctor" onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <Maximize2 className="w-4 h-4" />
                                </Link>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-[300px] overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                            {messages.map((m, i) => (
                                <div key={i} className={cn(
                                    "flex",
                                    m.type === "user" ? "justify-end" : "justify-start"
                                )}>
                                    <div className={cn(
                                        "max-w-[80%] p-3 text-sm rounded-2xl",
                                        m.type === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-white text-text-dark border border-slate-100 shadow-sm rounded-tl-none"
                                    )}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-50 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/20"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
                    isOpen ? "bg-text-dark text-white rotate-90" : "bg-primary text-white shadow-primary/40"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
