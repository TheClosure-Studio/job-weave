"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Hero from './components/Hero';
import JobMatch from './components/JobMatch';
import Message from './components/Message';
import Footer from './components/Footer';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-orange-500/30">
      
      <Hero />
      
      <JobMatch />
   
      <Message />
      <Footer />
    </main>
  );
}
