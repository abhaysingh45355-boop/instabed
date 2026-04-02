"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function HospitalLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed. Please check your credentials.");
                setIsLoading(false);
                return;
            }

            // Store auth data in sessionStorage
            sessionStorage.setItem(
                "hospital-auth",
                JSON.stringify({
                    token: data.token,
                    id: data.user.hospitalId,
                    name: data.user.hospitalName || data.user.name,
                    email: data.user.email,
                    userId: data.user.id,
                    role: data.user.role,
                    hospitalId: data.user.hospitalId,
                    loggedInAt: new Date().toISOString(),
                })
            );
            router.push("/dashboard");
        } catch (err) {
            setError("Network error. Please check your connection and try again.");
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
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Hospital Portal</h1>
                    <p className="text-text-gray">Sign in to manage your facility&apos;s real-time data on Instabed</p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100"
                >
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-text-dark mb-2">Email Address</label>
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

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-text-dark">Password</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-primary hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="uiverse-input pl-11 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <>
                                    Sign In to Portal
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-text-gray mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                            <span>Secured with end-to-end encryption</span>
                        </div>
                    </div>
                </motion.div>

                {/* Demo Credentials Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 bg-blue-50/50 rounded-2xl p-5 border border-blue-100"
                >
                    <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Demo Credentials</p>
                    <p className="text-xs text-text-gray mb-3">Use any of the seeded admin accounts. Default password: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-100 font-mono text-primary">hospital123</code></p>
                    <div className="space-y-1.5 text-xs text-text-gray">
                        <p><strong className="text-text-dark">City Care:</strong> admin@citycare.com</p>
                        <p><strong className="text-text-dark">St. Mary:</strong> admin@stmary.com</p>
                        <p><strong className="text-text-dark">Apollo:</strong> admin@apollo.com</p>
                        <p><strong className="text-text-dark">Metro:</strong> admin@metro.com</p>
                        <p><strong className="text-text-dark">Fortis:</strong> admin@fortis.com</p>
                        <p><strong className="text-text-dark">Max:</strong> admin@max.com</p>
                    </div>
                </motion.div>

                <p className="text-center text-xs text-text-gray mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/contact" className="text-primary font-bold hover:underline">
                        Contact Us
                    </Link>
                </p>
            </div>
        </div>
    );
}
