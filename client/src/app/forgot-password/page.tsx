"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [devToken, setDevToken] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong. Please try again.");
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            // In development, the API returns the token for easy testing
            if (data.devToken) {
                setDevToken(data.devToken);
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex items-center justify-center px-4 pt-20 pb-12">
            <div className="w-full max-w-[480px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-6">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                    <p className="text-text-gray">
                        Enter your email and we&apos;ll generate a reset link for you
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100"
                >
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Check your email</h3>
                            <p className="text-sm text-text-gray mb-6">
                                If an account with <strong>{email}</strong> exists, a password reset link has been generated.
                            </p>

                            {/* Dev-only: show the reset link directly */}
                            {devToken && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
                                    <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wider">⚠ Dev Mode — Reset Link</p>
                                    <Link
                                        href={`/reset-password?token=${devToken}`}
                                        className="text-sm text-primary font-mono break-all hover:underline"
                                    >
                                        /reset-password?token={devToken}
                                    </Link>
                                </div>
                            )}

                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-text-dark mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray pointer-events-none" />
                                    <input
                                        type="email"
                                        placeholder="admin@hospital.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="uiverse-input pl-11"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>

                <p className="text-center text-xs text-text-gray mt-6">
                    <Link href="/login" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" />
                        Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
