"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      
      try {
          const { error } = await signIn({ email, password });
          if (error) throw error;
          
          router.push('/dashboard');
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image/Visual */}
      <div className="hidden lg:block w-1/2 relative bg-neutral-900 m-4 rounded-3xl overflow-hidden">
        <Image
          src="/login.jpg"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-12 left-12 z-10 text-white">
          <div className="text-xs font-light bg-white/10 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-4 border border-white/10">
            Job Application Tracking
          </div>
          <h2 className="text-4xl font-light leading-tight font-space">
            Streak & Track | <br />
            Assets Warehouse
          </h2>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white text-black relative">
        <Link href="/" className="absolute top-8 right-8 text-neutral-400 hover:text-black transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Link>
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-space font-normal mb-2">Login</h1>
          <p className="text-neutral-500 mb-10 text-sm">Login to your account to continue</p>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all bg-white text-black placeholder:text-neutral-400"
                placeholder="Your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all bg-white text-black placeholder:text-neutral-400"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="text-sm">
                <button type="button" className="text-orange-500 hover:text-orange-600">Login with email link</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
