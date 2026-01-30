"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

// Components
import Warehouse from "./components/Warehouse";
import CustomStreak from "./components/CustomStreak";
import Streak from "./components/Streak";
import Track from "./components/Track";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState("track");
  const searchParams = useSearchParams();
  const [avatar, setAvatar] = useState("/avatars/male1.png");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
      await signOut();
      router.push("/login");
  };
  
  // Lifted State for Track/Streak
  const [trackItems, setTrackItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch & Auth Check
  useEffect(() => {
    if (!user) {
        router.push("/");
        return; 
    }

    const fetchData = async () => {
        try {
            // 1. Fetch Profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', user.id)
                .single();
            
            if (profile?.avatar_url) setAvatar(profile.avatar_url);

            // 2. Fetch Applications
            const { data: apps, error } = await supabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error("Supabase error:", error);
                throw error;
            }
            
            setTrackItems(apps || []);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user]);

  const addTrackItem = async () => {
      if (!user) return;
      const newItem = {
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          company: "",
          role: "",
          jd: "",
          status: "Wishlist",
          remarks: ""
      };

      try {
          const { data, error } = await supabase
            .from('applications')
            .insert([newItem])
            .select()
            .single();

          if (error) throw error;
          setTrackItems([data, ...trackItems]);
      } catch (err) {
          console.error("Error adding item:", err);
      }
  };

  const deleteTrackItem = async (id) => {
      try {
          const { error } = await supabase.from('applications').delete().eq('id', id);
          if (error) throw error;
          setTrackItems(trackItems.filter(item => item.id !== id));
      } catch (err) {
           console.error("Error deleting item:", err);
      }
  };

  const updateTrackItem = async (id, field, value) => {
      // Optimistic update
      setTrackItems(trackItems.map(item => item.id === id ? { ...item, [field]: value } : item));
      
      try {
          const { error } = await supabase
            .from('applications')
            .update({ [field]: value })
            .eq('id', id);
          if (error) throw error;
      } catch (err) {
           console.error("Error updating item:", err);
      }
  };


  const views = {
    finds: <FindsView />,
    track: <TrackStreakView 
                items={trackItems} 
                onAdd={addTrackItem} 
                onDelete={deleteTrackItem} 
                onUpdate={updateTrackItem}
                loading={loading}
            />,
    warehouse: <Warehouse />,
    custom_streaks: <CustomStreak />,
  };
  
  const headerTitles = {
      finds: "Job Weave / Finds",
      track: "Job Weave / Tracker",
      warehouse: "Job Weave / Warehouse",
      custom_streaks: "Job Weave / Streaks"
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center overflow-x-hidden">
       {/* Background Ambient Effect (Subtle) */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-900/30 rounded-full blur-[150px]" />
       </div>

      {/* Header */}
      <header className="fixed top-0 left-0 z-40 w-full backdrop-blur-sm  md:py-4 py-2 px-3 md:px-6 ">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
             <div className="flex items-center gap-3">
                 {/* Logo */}
                 <div className="shrink-0">
                    <Link href="/">
                        <Image src="/icon.svg" alt="Job Weave Logo" width={32} height={32} className="md:w-8 w-6 md:h-8 h-6" />
                    </Link>
                 </div>
                 {/* Title */}
                 <h1 className="text-sm md:text-xl font-space font-light text-neutral-300">
                    {headerTitles[currentView]}
                 </h1>
             </div>

             {/* Avatar & Profile Menu */}
             <div className="relative">
                 <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="relative md:w-10 w-6 md:h-10 h-6 rounded-full overflow-hidden border border-white/20 hover:border-white/50 transition-colors focus:outline-none"
                 >
                     <Image 
                        src={avatar} 
                        alt="User Avatar" 
                        fill 
                        className="object-cover"
                     />
                 </button>

                 <AnimatePresence>
                    {isProfileMenuOpen && (
                        <>
                            {/* Click outside to close */}
                            <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsProfileMenuOpen(false)}
                            />
                            
                            {/* Dropdown Menu */}
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 top-12 z-50 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl p-1 overflow-hidden"
                            >
                                <div className="px-4 py-2 border-b border-white/5 mb-1">
                                    <p className="text-xs text-neutral-400">Signed in as</p>
                                    <p className="text-sm text-white truncate font-medium">{user?.email}</p>
                                </div>
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    Log out
                                </button>
                            </motion.div>
                        </>
                    )}
                 </AnimatePresence>
             </div>
          </div>
      </header>
      
      {/* Protected View Content */}
      <div className="flex-1 w-full max-w-[1400px] p-4 md:p-6 pb-24 md:pb-32 pt-24 md:pt-28 z-10 w-full">
         <AnimatePresence mode="wait">
            <motion.div
                key={currentView}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
            >
                {views[currentView]}
            </motion.div>
         </AnimatePresence>
      </div>

      {/* Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-0 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 z-50 pointer-events-none w-full md:w-auto flex justify-center md:block">
          <div className="pointer-events-auto bg-neutral-200/90 backdrop-blur-md p-0.5 flex flex-row md:flex-col items-center gap-2 rounded-full md:rounded-r-2xl md:rounded-l-none shadow-2xl border border-white/20">
              <DockButton 
                active={currentView === 'finds'} 
                onClick={() => setCurrentView('finds')}
                icon={<FindsIcon active={currentView === 'finds'} />}
                label="Finds"
              />
              <DockButton 
                active={currentView === 'track'} 
                onClick={() => setCurrentView('track')}
                icon={<TrackIcon active={currentView === 'track'} />}
                label="Tracker"
              />
              <DockButton 
                active={currentView === 'custom_streaks'} 
                onClick={() => setCurrentView('custom_streaks')}
                icon={<FireIcon active={currentView === 'custom_streaks'} />}
                label="Streaks"
              />
              <DockButton 
                active={currentView === 'warehouse'} 
                onClick={() => setCurrentView('warehouse')}
                icon={<WarehouseIcon active={currentView === 'warehouse'} />}
                label="Warehouse"
              />
          </div>
      </div>
      
      {/* Gradient Definition for SVGs */}
      <svg width="0" height="0" className="absolute">
        <defs>
            <radialGradient id="icon-gradient" cx="71.16%" cy="35.69%" r="64.18%">
                <stop offset="0.89%" stopColor="#230886" />
                <stop offset="17.23%" stopColor="#0f1ea3" />
                <stop offset="42.04%" stopColor="#2b0fab" />
                <stop offset="55.12%" stopColor="#2b147e" />
                <stop offset="71.54%" stopColor="#0f165f" />
                <stop offset="100%" stopColor="#2c0493" />
            </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function DockButton({ active, onClick, icon, label }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center justify-center lg:w-12 lg:h-12 md:w-10 md:h-10 w-8 h-8 md:rounded-xl rounded-full transition-all duration-300 ${active ? 'bg-black text-white' : 'hover:bg-white/50 text-neutral-900'}`}
            title={label}
        >
            <div className={`text-2xl ${active ? '' : 'text-neutral-900'}`}>
                {icon}
            </div>
        </button>
    )
}

// Icons
function FindsIcon({ active }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

function TrackIcon({ active }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

function WarehouseIcon({ active }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8C20.9996 7.64927 20.9044 7.30481 20.725 6.99993C20.5456 6.69505 20.2882 6.44026 19.9774 6.26001L13.9774 2.26001C13.6806 2.08339 13.3429 1.99219 12.9972 1.99219C12.6515 1.99219 12.3138 2.08339 12.017 2.26001L6.01703 6.26001C5.70624 6.44026 5.44885 6.69505 5.26943 6.99993C5.09001 7.30481 4.99479 7.64927 4.99442 8V16C4.99479 16.3507 5.09001 16.6952 5.26943 17.0001C5.44885 17.305 5.70624 17.5598 6.01703 17.74L12.017 21.74C12.3138 21.9166 12.6515 22.0078 12.9972 22.0078C13.3429 22.0078 13.6806 21.9166 13.9774 21.74L19.9774 17.74C20.2882 17.5598 20.5456 17.305 20.725 17.0001C20.9044 16.6952 20.9996 16.3507 20.9944 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

function FireIcon({ active }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M8.5 14.5C8.5 14.5 9.5 10.5 14.5 8.5C14.5 8.5 12.5 17 17 16C17 16 16 21 12 21C8 21 8.5 14.5 8.5 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 2C12 2 4.5 7.5 4.5 13.5C4.5 19.5 12 22 12 22C12 22 19.5 19.5 19.5 13.5C19.5 7.5 12 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

// Placeholder Views
function FindsView() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-4xl font-space font-light mb-4 text-gradient">Coming Soon</h1>
            <p className="text-neutral-500 font-space text-center text-xs">Finds is a feature that will help you find the best jobs for you. That is posted by job seekers for job seekers.</p>
        </div>
    )
}

function TrackStreakView({ items, onAdd, onDelete, onUpdate, loading }) {
    if (loading) {
        return <div className="flex h-full items-center justify-center text-neutral-500">Loading your data...</div>;
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Streak Section (Top) */}
            <div className="flex-shrink-0">
                <Streak 
                    items={items} 
                    isCheckedIn={items.some(item => item.date === new Date().toISOString().split('T')[0])}
                    title="Application Streak"
                    description="Keep your momentum going! Apply to jobs daily."
                />
            </div>

            {/* Track Section (Remaining Height) */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                 <h2 className="text-2xl font-space font-light text-neutral-200 mb-4 px-1">Application Tracker</h2>
                 <Track 
                    items={items} 
                    onAdd={onAdd} 
                    onDelete={onDelete} 
                    onUpdate={onUpdate} 
                 />
            </div>
        </div>
    )
}
