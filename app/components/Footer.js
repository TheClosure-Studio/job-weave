import AnimatedText from './AnimatedText';
import Link from 'next/link';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="pt-20 md:pt-32 px-4 md:px-20 pb-10 bg-gradient-to-t from-[#07091d] to-black min-h-screen">
         <div className="max-w-[1400px] mx-auto text-center pb-20 md:pb-42">
             <h2 className="text-2xl md:text-3xl lg:text-5xl text-white font-light mb-8 font-space">
                 Land your dream job, stress-free.
             </h2>
             <Link href="/register" className="bg-white text-black px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-2xl font-medium hover:bg-gray-100 transition-colors font-space ">
                 Sign Up
             </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 lg:gap-12 gap-6 border-t border-white/5 pt-12 text-sm">
             <div className="md:col-span-2">
                 <div className="flex items-center gap-2 mb-4">
                    <Image src="/icon.svg" width={24} height={24} alt="Logo" className="" />
                    <AnimatedText text="Job Weave" className="font-space font-light text-xl tracking-tight text-white" />
                 </div>
                 <p className="text-neutral-400 max-w-xs mb-8">
                     Job Seakers Community, Job Application Tracker, and Job Asset Manager.
                 </p>
               
             </div>

             <div>
                <div className="space-y-2">
                     <p className="text-neutral-200 font-medium">Follow us</p>
                     <Link href="https://www.linkedin.com/in/koushik-yerraguntla" className="text-neutral-600 block hover:text-white transition-colors duration-500 font-space">LinkedIn</Link>
                     <Link href="https://www.instagram.com/theclosure.studio/" className="text-neutral-600 block hover:text-white transition-colors duration-500 font-space">Instagram</Link>
                     <Link href="https://x.com/ClosureStudio" className="text-neutral-600 block hover:text-white transition-colors duration-500 font-space">X</Link>
                 </div>
                
             </div>

            <div className="space-y-2">
                     <p className="text-neutral-200 font-medium">Reach out to us</p>
                     <Link href="https://theclosurestudio.vercel.app/" className="text-neutral-600 block hover:text-white transition-colors duration-500">[company] <span className='font-space'>The Closure Studio</span></Link>
                     <a href="mailto:theclosurestudio96@gmail.com" className="text-neutral-600 block hover:text-white transition-colors duration-500">[email] <span className='font-space'>theclosurestudio96@gmail.com</span></a>
                 </div>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-end mt-20 text-sm font-space text-neutral-400/60 gap-4 ">
            
             
            
                 <div className="">©2026 Job Weave</div>
                 
                 <div className=" hidden lg:block"> Terms and Conditions</div>
                 <Link href="https://theclosurestudio.vercel.app/" className="text-gradient font-extrabold hidden lg:block">The Closure Studio</Link>
             
         </div>
    </footer>
  );
}
