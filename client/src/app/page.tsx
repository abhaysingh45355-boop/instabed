"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Activity, Droplets, Wind, Plus, Users, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import BlurText from "@/components/ui/BlurText";
import SpotlightCard from "@/components/ui/SpotlightCard";
import DecryptedText from "@/components/ui/DecryptedText";

const stats = [
  { label: "Partner Hospitals", value: "2,500+", icon: Building2 },
  { label: "Live Bed Updates", value: "15k+", icon: Activity },
  { label: "Blood Units Tracked", value: "8,000+", icon: Droplets },
  { label: "Active Users", value: "1.2M", icon: Users },
];

const features = [
  {
    title: "Real-Time Bed Tracking",
    description: "Get instant access to available general beds, ICU, and ventilators in hospitals near you.",
    icon: Activity,
    color: "text-blue-600",
    bg: "bg-blue-50",
    spotlightColor: "rgba(37, 99, 235, 0.12)",
    href: "/hospitals",
  },
  {
    title: "Medical Supplies",
    description: "Track critical inventory like blood units, oxygen cylinders, and ventilators in one dashboard.",
    icon: Wind,
    color: "text-teal-600",
    bg: "bg-teal-50",
    spotlightColor: "rgba(20, 184, 166, 0.12)",
    href: "/supplies",
  },
  {
    title: "Emergency Care",
    description: "Connect instantly with nearby ICUs and high-visibility emergency services.",
    icon: Plus,
    color: "text-red-600",
    bg: "bg-red-50",
    spotlightColor: "rgba(239, 68, 68, 0.12)",
    href: "/emergency",
  },
];

const steps = [
  {
    title: "Search Your Need",
    description: "Select what you are looking for—beds, blood, or oxygen—near your location.",
  },
  {
    title: "Filter & Compare",
    description: "Use our smart filters to find the best matched facility based on distance and availability.",
  },
  {
    title: "Get Directions",
    description: "Connect instantly with the hospital and follow live routes via Google Maps integration.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-transparent overflow-hidden">
        <div className="container-custom py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 max-w-[800px] mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 border border-blue-200 rounded-full text-blue-900 text-sm font-black mb-8 shadow-sm backdrop-blur-sm">
              <Plus className="w-4 h-4" />
              <DecryptedText
                text="National Health Infrastructure"
                speed={30}
                maxIterations={8}
                animateOn="view"
                className="text-primary"
              />
            </div>
            <BlurText
              text="Real-Time Hospital Availability."
              delay={80}
              animateBy="words"
              direction="top"
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-2 text-slate-900 justify-center drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.8)]"
            />
            <BlurText
              text="When It Matters Most."
              delay={100}
              animateBy="words"
              direction="top"
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-6 text-primary justify-center drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.8)]"
            />
            <p className="max-w-[600px] mx-auto text-lg mb-8 text-slate-950 font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
              Instabed connects you instantly with nearby hospitals, live bed availability, oxygen supplies, and blood inventory — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hospitals" className="btn-primary flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Find Nearby Hospitals
              </Link>
              <Link href="/emergency" className="btn-outline flex items-center justify-center gap-2">
                Check Emergency Availability
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="bg-primary py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-4 text-white">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white/60 backdrop-blur-lg">
        <div className="container-custom">
          <div className="text-center mb-16">
            <BlurText
              text="How Instabed Works"
              delay={100}
              animateBy="words"
              direction="top"
              className="text-3xl md:text-4xl font-bold mb-4 justify-center"
            />
            <p className="max-w-[700px] mx-auto text-lg text-text-gray">
              Providing a seamless experience to find medical resources during emergencies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <SpotlightCard
                key={idx}
                className="group !bg-white hover:shadow-medium transition-all duration-300"
                spotlightColor="rgba(37, 99, 235, 0.06)"
              >
                <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center text-primary font-bold text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {idx + 1}
                </div>
                <h3 className="mb-4 text-xl font-bold">{step.title}</h3>
                <p className="text-text-gray leading-relaxed">{step.description}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-transparent">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <SpotlightCard
                key={feature.title}
                className="group !bg-white hover:shadow-medium transition-all"
                spotlightColor={feature.spotlightColor}
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", feature.bg, feature.color)}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
                <p className="text-text-gray mb-6">{feature.description}</p>
                <Link href={feature.href} className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white/60 backdrop-blur-lg relative overflow-hidden">
        <div className="container-custom">
          <div className="bg-primary rounded-[40px] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="relative z-10 max-w-[800px]">
              <h2 className="text-white text-4xl lg:text-5xl font-bold mb-6">
                Are You a Hospital? Join Our Network and Save Lives.
              </h2>
              <p className="text-blue-100 text-lg mb-10">
                Register your facility on Instabed to provide real-time updates and reach patients in need instantly. Help us build a stronger medical infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="px-8 py-4 bg-white text-primary rounded-xl font-bold hover:shadow-xl transition-all">
                  Register Hospital
                </Link>
                <Link href="/about" className="px-8 py-4 border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                  How it Works for Partners
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
