"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";

const avatars = [
  "/avatars/male1.png",
  "/avatars/male2.png",
  "/avatars/male3.png",
  "/avatars/male4.png",
  "/avatars/female1.png",
  "/avatars/female2.png",
  "/avatars/female3.png",
];

const gradients = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500",
  "from-blue-400 to-cyan-400",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-amber-500",
  "from-indigo-400 to-cyan-400",
  "from-fuchsia-500 to-purple-600",
];

export default function Onboarding() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Attempt to construct a username from query params if available
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    if (firstName && lastName) {
      setUsername(`${firstName}${lastName}`.toLowerCase());
    } else if (firstName) {
        setUsername(firstName.toLowerCase());
    }
  }, [searchParams]);

  const handleContinue = async () => {
      if (!username) {
          setError("Username is required");
          return;
      }
      
      setLoading(true);
      setError("");

      try {
          // 1. Check uniqueness
          const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .neq('id', user?.id) // exclude self if updating
            .single();

           if (existingUser) {
               throw new Error("Username is already taken");
           }

           // 2. Update Profile
           if (user) {
               const { error: updateError } = await supabase
                .from('profiles')
                .update({ 
                    username: username,
                    avatar_url: avatars[selectedAvatar]
                })
                .eq('id', user.id);

                if (updateError) throw updateError;
           }

           // 3. Redirect
           router.push('/dashboard');

      } catch (err) {
          console.error(err);
          if (err.message?.includes("duplicate key") || err.code === "23505") {
              setError("Username is already taken. Please choose another one.");
          } else {
              setError(err.message || "Something went wrong");
          }
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
       {/* Background Ambient Effect */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
       </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-5xl font-space font-light mb-2">Welcome!</h1>
           <p className="text-neutral-400">Let's set up your profile to get started</p>
        </div>

        {/* Username Input */}
        <div className="mb-8">
            <label className="block text-sm font-medium mb-3 text-neutral-300 ml-1">Choose your username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                }}
                placeholder="JohnDoe"
                className={`w-full bg-neutral-900/50 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-4 py-3 text-md outline-none focus:border-white/20 transition-all font-space placeholder:text-neutral-600`}
            />
            {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
        </div>

        {/* Avatar Selection */}
        <div className="mb-12">
            <label className="block text-sm font-medium mb-6 text-neutral-300 ml-1">Choose an avatar</label>
            <div className="flex flex-wrap justify-center gap-2 w-full">
                <div className="flex flex-wrap justify-center gap-1 w-md">
                {avatars.map((avatar, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAvatar(index)}
                        className={`relative rounded-full p-1 transition-all duration-300 ${selectedAvatar === index ? 'ring-2 ring-white ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                    >
                        <div className={`w-20 h-20 md:w-20 md:h-20 rounded-full overflow-hidden relative bg-gradient-to-br ${gradients[index % gradients.length]} blur-lg backdrop-blur-2xl`}>
                           
                        
                        </div>
                           <Image 
                             src={avatar} 
                             alt={`Avatar ${index + 1}`}
                             fill
                             className="object-cover p-0.5 rounded-full absolute inset-0"
                           />
                    </motion.button>
                ))}
                </div>
            </div>
        </div>

        {/* Continue Button */}
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={loading}
            className="w-full bg-white text-black font-medium text-lg py-4 rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? "Setting up..." : "Continue"}
        </motion.button>

      </motion.div>
    </div>
  );
}
