"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

/* ───────── Inline SVG Illustrations ───────── */

function HeroIllustrationLeft() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Person sitting with laptop */}
      <circle cx="160" cy="280" rx="120" ry="30" fill="#F5E6C8" opacity="0.5" />
      {/* Chair */}
      <rect x="120" y="200" width="80" height="10" rx="5" fill="#2D2D2D" />
      <rect x="130" y="210" width="4" height="60" fill="#2D2D2D" />
      <rect x="186" y="210" width="4" height="60" fill="#2D2D2D" />
      {/* Body */}
      <ellipse cx="160" cy="175" rx="30" ry="35" fill="#2D2D2D" />
      {/* Head */}
      <circle cx="160" cy="125" r="25" fill="#F5D0A9" />
      {/* Hair */}
      <path d="M135 120 Q140 95 160 95 Q180 95 185 120 Q185 105 160 100 Q135 105 135 120Z" fill="#2D2D2D" />
      {/* Eyes */}
      <circle cx="152" cy="125" r="2" fill="#2D2D2D" />
      <circle cx="168" cy="125" r="2" fill="#2D2D2D" />
      {/* Smile */}
      <path d="M153 133 Q160 139 167 133" stroke="#2D2D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Laptop */}
      <rect x="135" y="185" width="50" height="30" rx="3" fill="#555" transform="rotate(-5, 160, 200)" />
      <rect x="138" y="188" width="44" height="22" rx="2" fill="#88CCFF" transform="rotate(-5, 160, 200)" />
      {/* Arms */}
      <path d="M130 170 Q120 185 135 195" stroke="#F5D0A9" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M190 170 Q200 185 185 195" stroke="#F5D0A9" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function HeroIllustrationCenter() {
  return (
    <svg viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Yellow accent blob */}
      <circle cx="250" cy="100" r="70" fill="#F5C542" opacity="0.3" />
      {/* Person standing waving */}
      <ellipse cx="170" cy="310" rx="80" ry="18" fill="#F5E6C8" opacity="0.4" />
      {/* Legs */}
      <rect x="155" y="240" width="8" height="60" rx="4" fill="#2D2D2D" />
      <rect x="177" y="240" width="8" height="60" rx="4" fill="#2D2D2D" />
      {/* Body / T-shirt */}
      <path d="M140 180 Q140 240 160 245 L180 245 Q200 240 200 180 Z" fill="#F5C542" />
      {/* Head */}
      <circle cx="170" cy="155" r="28" fill="#D4A574" />
      {/* Hair */}
      <path d="M142 148 Q145 120 170 118 Q195 120 198 148 Q195 130 170 128 Q145 130 142 148Z" fill="#2D2D2D" />
      {/* Eyes */}
      <circle cx="162" cy="155" r="2.5" fill="#2D2D2D" />
      <circle cx="178" cy="155" r="2.5" fill="#2D2D2D" />
      {/* Smile */}
      <path d="M162 165 Q170 172 178 165" stroke="#2D2D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Waving arm */}
      <path d="M200 195 Q220 170 235 140" stroke="#D4A574" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Hand */}
      <circle cx="237" cy="137" r="6" fill="#D4A574" />
      {/* Other arm */}
      <path d="M140 195 Q125 210 115 230" stroke="#D4A574" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function HeroIllustrationRight() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Yellow accent */}
      <circle cx="250" cy="80" r="80" fill="#F5C542" opacity="0.25" />
      {/* Person with backpack */}
      <ellipse cx="160" cy="310" rx="80" ry="18" fill="#F5E6C8" opacity="0.4" />
      {/* Legs */}
      <rect x="145" y="250" width="8" height="55" rx="4" fill="#2D2D2D" />
      <rect x="167" y="250" width="8" height="55" rx="4" fill="#2D2D2D" />
      {/* Body */}
      <path d="M130 190 Q130 255 150 258 L170 258 Q190 255 190 190 Z" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="160" cy="160" r="28" fill="#F5D0A9" />
      {/* Hair - bun style */}
      <path d="M132 152 Q135 125 160 122 Q185 125 188 152" fill="#2D2D2D" />
      <circle cx="160" cy="120" r="12" fill="#2D2D2D" />
      {/* Glasses */}
      <circle cx="152" cy="162" r="8" stroke="#2D2D2D" strokeWidth="1.5" fill="none" />
      <circle cx="170" cy="162" r="8" stroke="#2D2D2D" strokeWidth="1.5" fill="none" />
      <line x1="160" y1="162" x2="162" y2="162" stroke="#2D2D2D" strokeWidth="1.5" />
      {/* Backpack */}
      <rect x="185" y="195" width="25" height="40" rx="8" fill="#F5C542" stroke="#2D2D2D" strokeWidth="1" />
      {/* Arms */}
      <path d="M130 200 Q115 220 120 240" stroke="#F5D0A9" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M190 200 Q200 215 195 235" stroke="#F5D0A9" strokeWidth="7" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function FeatureIllustration1() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
      <circle cx="60" cy="60" r="55" stroke="#E8DDD0" strokeWidth="2" fill="none" />
      {/* Two people chatting */}
      <circle cx="42" cy="45" r="12" fill="#F5D0A9" />
      <path d="M30 42 Q32 30 42 28 Q52 30 54 42" fill="#2D2D2D" />
      <circle cx="78" cy="45" r="12" fill="#D4A574" />
      <path d="M66 42 Q68 30 78 28 Q88 30 90 42" fill="#2D2D2D" />
      {/* Bodies */}
      <path d="M30 70 Q30 90 42 95 Q54 90 54 70 Z" fill="#F5C542" />
      <path d="M66 70 Q66 90 78 95 Q90 90 90 70 Z" fill="#2D2D2D" />
      {/* Chat bubble */}
      <rect x="50" y="20" width="20" height="12" rx="6" fill="#F5C542" />
      <polygon points="55,32 58,32 55,37" fill="#F5C542" />
    </svg>
  );
}

function FeatureIllustration2() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
      <circle cx="60" cy="60" r="55" stroke="#E8DDD0" strokeWidth="2" fill="none" />
      {/* Person with thumbs up */}
      <circle cx="60" cy="42" r="14" fill="#D4A574" />
      <path d="M46 38 Q48 25 60 23 Q72 25 74 38" fill="#2D2D2D" />
      <circle cx="55" cy="42" r="2" fill="#2D2D2D" />
      <circle cx="65" cy="42" r="2" fill="#2D2D2D" />
      <path d="M55 50 Q60 55 65 50" stroke="#2D2D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Body */}
      <path d="M42 68 Q42 95 60 100 Q78 95 78 68 Z" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="1" />
      {/* Thumbs up arm */}
      <path d="M78 75 Q90 65 92 52" stroke="#D4A574" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="49" r="5" fill="#D4A574" />
    </svg>
  );
}

function FeatureIllustration3() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
      <circle cx="60" cy="60" r="55" stroke="#E8DDD0" strokeWidth="2" fill="none" />
      {/* Three people group */}
      <circle cx="40" cy="45" r="10" fill="#F5D0A9" />
      <path d="M30 42 Q32 32 40 30 Q48 32 50 42" fill="#2D2D2D" />
      <circle cx="60" cy="40" r="11" fill="#D4A574" />
      <path d="M49 37 Q51 26 60 24 Q69 26 71 37" fill="#2D2D2D" />
      <circle cx="80" cy="45" r="10" fill="#F5D0A9" />
      <path d="M70 42 Q72 32 80 30 Q88 32 90 42" fill="#555" />
      {/* Bodies */}
      <path d="M28 65 Q28 85 40 90 Q52 85 52 65 Z" fill="#F5C542" />
      <path d="M47 60 Q47 85 60 90 Q73 85 73 60 Z" fill="#2D2D2D" />
      <path d="M68 65 Q68 85 80 90 Q92 85 92 65 Z" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="1" />
      {/* Heart above */}
      <path d="M55 18 Q55 12 60 15 Q65 12 65 18 Q65 22 60 26 Q55 22 55 18Z" fill="#F5C542" />
    </svg>
  );
}

/* ───────── Decorative Blobs ───────── */

function DecorativeBlob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="100" cy="100" r="90" fill="#F5C542" opacity="0.2" />
    </svg>
  );
}

/* ───────── Page Component ───────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-900 font-sans overflow-hidden">
      
      {/* ─── Decorative background blobs ─── */}
      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#F5C542] opacity-[0.12] blur-[2px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-60px] w-[220px] h-[220px] rounded-full bg-[#F5C542] opacity-[0.10] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[180px] h-[180px] rounded-full bg-[#E8DDD0] opacity-[0.25] pointer-events-none" />

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 max-w-[1400px] mx-auto"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2D2D2D] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">hubble</span>
        </div>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="text-gray-900 hover:text-gray-900 transition-colors">Home</Link>
          <Link href="/groups" className="hover:text-gray-900 transition-colors">Community</Link>
          <Link href="/#about" className="hover:text-gray-900 transition-colors">About us</Link>
          <Link href="/#features" className="hover:text-gray-900 transition-colors">Features</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-semibold border-2 border-gray-900 rounded-full text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </motion.nav>

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section id="about" className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-10 md:pt-16 pb-8">
        
        {/* Hero Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <motion.h1
            custom={0}
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900 mb-6"
          >
            Hey there! having{" "}
            <br className="hidden sm:block" />
            <span className="whitespace-nowrap">
              trouble making{" "}
              <span className="relative inline-block">
                <span className="relative z-10">friends?</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-[#F5C542] opacity-50 rounded-sm -z-0" />
              </span>
            </span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8"
          >
            We are here to help you find your people, no matter what you are.
            We always happy to welcome you. we just be friend here!
          </motion.p>

          <motion.div custom={2} variants={fadeUp}>
            <Link
              href="/groups"
              className="inline-block px-8 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors duration-300 shadow-lg shadow-gray-900/10"
            >
              Join us now
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Illustrations Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto items-end"
        >
          <div className="flex justify-center">
            <div className="w-40 sm:w-52 md:w-64">
              <HeroIllustrationLeft />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-44 sm:w-56 md:w-72">
              <HeroIllustrationCenter />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-40 sm:w-52 md:w-64">
              <HeroIllustrationRight />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ FEATURES SECTION ═══════════════════ */}
      <section id="features" className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        
        {/* Divider line */}
        <div className="w-full h-px bg-[#E8DDD0] mb-16 md:mb-20" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-center mb-14 md:mb-20 tracking-tight"
          style={{ color: "#1a1a1a" }}
        >
          Why we think we can help you?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 max-w-4xl mx-auto">
          
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6">
              <FeatureIllustration1 />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: "#1a1a1a" }}>This community is fun</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
              Connect with like-minded people, share experiences, and build lasting memories together in a vibrant community.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6">
              <FeatureIllustration2 />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: "#1a1a1a" }}>It&apos;s pretty easy</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
              Getting started takes seconds. Browse groups, click join, and you&apos;re in. No complicated setup or approvals needed.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6">
              <FeatureIllustration3 />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: "#1a1a1a" }}>Be friend with others</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
              Make meaningful connections across your campus. Whether it&apos;s academics, clubs, or just hanging out.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-8 border-t border-[#E8DDD0]">
        <p className="text-xs text-gray-400 font-medium">Hubble © 2025. All rights reserved.</p>
      </footer>

    </div>
  );
}
