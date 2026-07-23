"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, GraduationCap, BookOpen, Check } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Update/Ensure role in profile table
      await supabase
        .from("users")
        .update({ role })
        .eq("id", authData.user.id);

      // Check if profile details are already set up
      const { data: profile } = await supabase
        .from("users")
        .select("department_id, year_of_study, college_id")
        .eq("id", authData.user.id)
        .single();

      if (!profile || !profile.college_id) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2D2D2D]">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">hubble</span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#E8DDD0] p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-[#1a1a1a]">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Sign in as a Student or Teacher to access your campus portal
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              role === "student"
                ? "bg-[#2D2D2D] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#F5C542]" />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              role === "teacher"
                ? "bg-[#2D2D2D] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#4285F4]" />
            <span>Teacher Login</span>
          </button>
        </div>

        {/* Role Banner */}
        <div
          className={`p-3 rounded-xl mb-6 text-xs flex items-center gap-2 border ${
            role === "teacher"
              ? "bg-blue-50 border-blue-200 text-blue-800"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          {role === "teacher" ? (
            <>
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Teacher Account:</strong> Create events, monitor coordinators & manage campus communities.
              </span>
            </>
          ) : (
            <>
              <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Student Account:</strong> Join events, participate in groups & connect with peers.
              </span>
            </>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-gray-700">
              {role === "teacher" ? "Faculty / Institutional Email" : "Student Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder={role === "teacher" ? "professor@college.edu" : "student@college.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none bg-[#FAF6F0] border border-[#E8DDD0] text-[#1a1a1a] focus:border-[#F5C542] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-[#F5C542] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none bg-[#FAF6F0] border border-[#E8DDD0] text-[#1a1a1a] focus:border-[#F5C542] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-xs"
          >
            {loading ? "Signing in..." : `Sign in as ${role === "teacher" ? "Teacher" : "Student"}`}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#E8DDD0]" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-[#E8DDD0]" />
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: `${window.location.origin}/auth/callback` },
            });
          }}
          className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 bg-white border border-[#E8DDD0] text-gray-700 hover:shadow-sm transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-6 text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#1a1a1a] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
