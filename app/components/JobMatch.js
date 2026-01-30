import AnimatedText from './AnimatedText';
import Image from 'next/image';

export default function JobMatch() {
  return (
    <section>
        <section className="py-16 md:py-32 px-4 md:px-10 bg-[#0a0a0a]">
      <div className="grid xl:grid-cols-2 gap-20 items-start  mx-auto">
        
        {/* Left Text */}
        <div>
           <AnimatedText text="Weave / Finds" className="text-5xl mb-6 tracking-wide font-space py-5 text-gradient" />
           <h2 className="text-2xl md:text-3xl lg:text-5xl font-light shadow-none text-neutral-500 py-4 md:py-6 lg:py-12">
            post, apply, 
            <div className="text-2xl md:text-3xl lg:text-5xl font-light shadow-none text-neutral-500 ">get hired</div>
           </h2>

           <div className="md:space-y-10 space-y-6">
               <div>
                   <h3 className="text-xl text-neutral-300 font-light font-space mb-2">Job Posting & Explore</h3>
                   <p className="text-neutral-500 leading-relaxed font-light text-sm md:text-base">
                       Post jobs, find relevant roles, and get matched with the right fit.
                   </p>
               </div>
               <div className="pt-6 border-t border-neutral-800">
                   <h3 className="text-xl text-white/40 font-light font-space">Finds ( Job Community )</h3>
               </div>
               
           </div>
        </div>

        {/* Right Dashboard Image/Mockup */}
        <div className="relative bg-neutral-900 rounded p-4 overflow-hidden">
            
             {/* Header Mockup */}
             <div className="flex justify-between items-center lg:mb-6 md:mb-4 mb-2 px-2">
                 <div className="flex gap-2">
                     <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 w-1.5 h-1.5 rounded-full bg-blue-100/10" />
                     <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 w-1.5 h-1.5 rounded-full bg-blue-100/10" />
                 </div>
                 <div className="lg:w-40 lg:h-2 md:w-20 md:h-2 w-16 h-1 bg-neutral-800 rounded-full" />
             </div>
             
             {/* Content Mockup */}
             <div className='xl:h-[400px] w-full flex items-center justify-center'>
                <Image src="/finds.webp" alt="Dashboard" width={1000} height={1000} className="object-cover rounded" />
             </div>
             
        </div>

      </div>
    </section>
      <section className="py-12 md:py-20 px-4 md:px-10">
       <div className="mx-auto">
           <div className="">
                <AnimatedText text="Weave / Streak & Tracker" className="text-5xl text-neutral-500 mb-4 tracking-wide py-5 text-gradient font-space" />
               
           </div>

           
           <div className="flex flex-col lg:flex-row gap-8 ">
               {/* Card 1 */}
               <div className="   lg:md-6 relative overflow-hidden group w-full lg:w-1/2">
                <div className="text-white">
                    <h2 className="lg:text-5xl md:text-4xl text-3xl font-light mb-6 max-w-2xl text-white font-space">
                   Your personal streak tracker
               </h2>
               <p className="text-neutral-500  font-light leading-relaxed text-sm md:text-base">
                   Track your job application streaks, interview preparation, and career milestones. Never miss a beat.
               </p>
                </div>
                    {/* Content */}
                    <div className="relative z-10 bg-neutral-900 rounded p-6  mt-10 mx-auto ">
                    <div className="flex justify-between items-center lg:mb-6 md:mb-4 mb-2 px-2">
                 <div className="flex gap-2">
                     <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 w-1.5 h-1.5 rounded-full bg-blue-100/10" />
                     <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 w-1.5 h-1.5 rounded-full bg-blue-100/10" />
                 </div>
                 <div className="lg:w-40 lg:h-2 md:w-20 md:h-2 w-16 h-1 bg-neutral-800 rounded-full" />
             </div>
                        <div className="flex gap-4">
                            
                            <Image src="/streak.jpeg" alt="Dashboard" width={1000} height={1000} className="object-cover" />
                        </div>
                        
                    </div>
               </div>

                {/* Card 2 */}
               <div className="relative overflow-hidden w-full lg:w-1/2">
                    <div className="bg-neutral-900 rounded p-6   relative mb-10">
                    <div className="flex justify-between items-center lg:mb-6 md:mb-4 mb-2 px-2">
                 <div className="flex gap-2">
                     <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 w-1.5 h-1.5 rounded-full bg-blue-100/10" />
                     <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 w-1.5 h-1.5 rounded-full bg-blue-100/10" />
                 </div>
                 <div className="lg:w-40 lg:h-2 md:w-20 md:h-2 w-16 h-1 bg-neutral-800 rounded-full" />
             </div>
                        <div className="flex gap-4">
                          
                    
                 
                             <Image src="/track.jpeg" width={1000} height={1000} alt="Logo" className="opacity-100 rounded  w-full h-full" />
                        </div>
                    </div>
                     <div className="text-white ">
                    <h2 className="lg:text-5xl md:text-4xl text-3xl font-light mb-6 max-w-2xl text-white font-space">
                   Application tracker
               </h2>
               <p className="md:text-base text-sm text-neutral-500 max-w-xl font-light z-100">
                   Track your application progress, deadlines, and interview schedules and never miss a deadline. 
               </p>
                </div>
               </div>
           </div>
       </div>
    </section>
    <section className="py-16 md:py-32 px-4 md:px-10 ">
      <div className="grid lg:grid-cols-2 gap-20 items-start  mx-auto">
        
        {/* Left Text */}
        <div>
           <AnimatedText text="Weave / Warehouse" className="text-5xl mb-6 tracking-wide font-space py-5 text-gradient" />
           <h2 className="text-2xl md:text-3xl lg:text-5xl font-light shadow-none text-neutral-500 py-4 md:py-6 lg:py-12">
            store, copy, 
            <div className="text-2xl md:text-3xl lg:text-5xl font-light shadow-none text-neutral-500 ">paste</div>
           </h2>

           <div className="space-y-10">
               <div>
                   <h3 className="text-xl text-neutral-300 font-medium mb-2 font-space">Store & Manage Job Assets</h3>
                   <p className="text-neutral-500 leading-relaxed font-light text-sm md:text-base ">
                       Store your quick links( LinkedIn, GitHub, Portfolio Website, Leetcode etc. ) & Files( Cover Letter, Resume, Images, Important Documents etc. ) in one place. And When you need it, just copy and paste.
                   </p>
               </div>
               <div className="pt-6 border-t border-neutral-800">
                   <h3 className="text-xl text-white/30 font-light font-space">Weave Warehouse ( Job Assets )</h3>
               </div>
               
           </div>
        </div>

        {/* Right Dashboard Image/Mockup */}
        <div className="relative bg-[#111] rounded p-4 overflow-hidden">
             {/* Header Mockup */}
             <div className="flex justify-between items-center lg:mb-6 md:mb-4 mb-2 px-2">
                 <div className="flex gap-2">
                     <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 w-1.5 h-1.5  rounded-full bg-blue-100/10" />
                     <span className="lg:w-3 lg:h-3 md:w-2 md:h-2 w-1.5 h-1.5  rounded-full bg-blue-100/10" />
                 </div>
                 <div className="lg:w-40 lg:h-2 md:w-20 md:h-2 w-16 h-1 bg-neutral-800 rounded-full" />
             </div>
              <div className='lg:h-[350px] w-full flex items-center justify-center'>
                <Image src="/warehouse.png" alt="Dashboard" width={1000} height={1000} className="object-cover rounded-md" />
             </div>
             
             
        </div>

      </div>
    </section>
    </section>
    
  );
}
