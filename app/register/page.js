"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/app/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    
    setLoading(true);
    setError("");

    try {
        const { data, error } = await signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                }
            }
        });

        if (error) throw error;
        
        // Check if email confirmation is required (User created but no session)
        if (data?.user && !data.session) {
            setError("Account created! Please check your email to confirm your account.");
            return;
        }
        
        // Pass name to onboarding for pre-filling
        router.push(`/onboarding?firstName=${formData.firstName}&lastName=${formData.lastName}`);
    } catch (err) {
        if (err.message?.includes("Too many requests") || err.status === 429) {
            setError("You are doing that too much. Please wait 60 seconds and try again.");
        } else {
            setError(err.message);
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image/Visual */}
      <div className="hidden lg:block w-1/2 relative bg-neutral-900 m-4 rounded-3xl overflow-hidden">
        <Image
          src="/register.jpg"
          alt="Sign Up Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-12 left-12 z-10 text-white">
          <div className="text-xs font-light bg-white/10 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-4 border border-white/10">
            new job post drop!
          </div>
          <h2 className="text-4xl font-light leading-tight font-space">
            Brand Strategist | <br />
            Procter & Co
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
          <h1 className="text-3xl font-space font-normal mb-2">Sign Up</h1>
          <p className="text-neutral-500 mb-10 text-sm">Sign up to get started</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex gap-4">
                <div className="w-1/2">
                    <label className="block text-sm font-medium mb-2" htmlFor="firstName">
                        First name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all bg-white text-black placeholder:text-neutral-400"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-medium mb-2" htmlFor="lastName">
                        Last name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all bg-white text-black placeholder:text-neutral-400"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all bg-white text-black placeholder:text-neutral-400"
                placeholder="Your email..."
                value={formData.email}
                onChange={handleChange}
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
                placeholder="Your password..."
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all bg-white text-black placeholder:text-neutral-400"
                placeholder="Your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
             {error && (
                <div className="text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                </div>
             )}

             <div className="flex items-center gap-2 text-sm text-neutral-500">
                <input type="checkbox" id="terms" className="rounded border-gray-300" />
                <label htmlFor="terms">I agree with <span className="text-orange-500 hover:underline cursor-pointer">Terms and Conditions</span></label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
