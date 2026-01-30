import Hero from './components/Hero';
import JobMatch from './components/JobMatch';
import Message from './components/Message';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-orange-500/30">
      
      <Hero />
      
      <JobMatch />
   
      <Message />
      <Footer />
    </main>
  );
}
