import AnimatedText from "./AnimatedText";
import Image from "next/image";

export default function Message() {
  return (
    <section className="lg:min-h-screen min-h-[60vh] px-4 xl:px-20 relative overflow-hidden flex items-center justify-center">
        <div className="max-w-[1400px] mx-auto relative z-10">
            {/* Quote Icon */}
            <div className="">
                <div className="lg:text-[10vw] hidden xl:block text-gradient font-bold font-space relative top-25">“</div>
            </div>

            <div className="flex flex-col xl:flex-row gap-10 md:gap-20 items-start md:items-end">
                <blockquote className=" text-xl lg:text-3xl xl:text-5xl text-white font-light leading-snug font-space max-w-5xl">
                    <AnimatedText text="I built Job Weave because I was tired of the chaos. Job hunting shouldn't feel like a full-time job without pay. This is the tool I wish I had. It's is completly free. Something Intersting is on cards:)" />
                </blockquote>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-12">
                     {/* Back Circle - Logo/Gradient */}
                     <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 blur-[2px] opacity-80 z-0"></div>
                     <div className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center bg-black/20 z-10">
                        <Image src="/icon.svg" width={24} height={24} alt="Logo" className="opacity-80" />
                     </div>

                     {/* Front Circle - Profile */}
                     <div className="absolute left-6 top-0 w-10 h-10 rounded-full overflow-hidden border-2 border-black z-20">
                        <Image src="/avatars/male1.png" fill alt="Profile" className="object-cover" />
                     </div>
                </div>
                <p className="text-neutral-500 font-medium font-space">yerraguntla koushik</p>
            </div>
                </div>
            </div>
        </div>
    </section>
  );
}
