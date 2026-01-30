import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative">
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-gradient-to-r from-[#090129] via-[#010103] to-[#0d0727] blur-[120px] rounded-full pointer-events-none" /> */}

      <nav className="sticky top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Link href="/">
            <Image src="/icon.svg" alt="Job Weave Logo" width={32} height={32} className="w-8 h-8" />
        </Link>
        <span className="font-space text-xl tracking-tight font-light">Job Weave</span>
      </div>

      

      <div className="flex items-center gap-4">
        <Link href="/login" className="block text-md font-light hover:text-gray-300 font-space">
          Log in
        </Link>
        
      </div>
      </nav>
      <section className="relative min-h-screen flex flex-col justify-center px-4 md:px-10 pt-32 md:pt-20 overflow-hidden ">
      
        <div className="relative z-10 max-w-5xl mt-10 py-10">
          
            <p className="text-neutral-500 mb-2 font-medium font-space">Hello, Job Seeker!</p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight tracking-tight">
                Looking for the perfect job - <br className="hidden md:block" />
                <span className="text-neutral-400 font-space ">Tracker, Assets Manager, and Community?</span>
            </h1>
        </div>
        <div className="relative w-full aspect-video rounded  lg:rounded-lg overflow-hidden bg-[#111] shadow-2xl border border-white/5">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
             
             <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                <Image src="/register.jpg" alt="Dashboard" width={2000} height={1000} className="object-cover" />
             </div>

             <div className="absolute bottom-1 left-1 md:bottom-5 md:left-5 lg:bottom-10 lg:left-10 z-20 text-white">
                <div className=" items-center gap-2 mb-2 hidden md:flex justify-start">
                        <div className="w-3 h-3 bg-black rounded-full" />
                    
                    <span className="text-xs md:text-sm font-light text-white/90">new job match</span>
                </div>
                <h3 className="text-xs md:text-sm lg:text-base xl:text-2xl font-light">
                    SD - II <span className="text-neutral-400">|</span> at Amazon <span className="text-xs md:text-sm lg:text-base xl:text-2xl align-top">↗</span>
                </h3>
             </div>
             
        </div>
        <div className="text-center py-56 md:py-80 max-w-6xl mx-auto z-10 ">
             <div className="md:text-sm text-xs text-neutral-500 mb-4 tracking-wide font-space">Weave / Finds</div>
             <h2 className="text-md md:text-2xl lg:text-4xl font-light leading-tight text-white text-gradient">
                 Don't lag behind in the job market.
             </h2>
             <p className="text-lg md:text-2xl lg:text-4xl font-light text-neutral-500 font-space md:mt-2 mt-1 leading-tight">
                 Job Weave helps you stay ahead of the curve.
             </p>
        </div>
     </section>
    </section>
    
  );
}
