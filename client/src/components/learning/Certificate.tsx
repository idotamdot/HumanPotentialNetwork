import React from "react";
import { Award, Sparkles, Star } from "lucide-react";

interface CertificateProps {
  userName: string;
  courseName: string;
  issueDate: string;
}

const Certificate: React.FC<CertificateProps> = ({ userName, courseName, issueDate }) => {
  return (
    <div className="relative w-full border-[12px] border-double border-amber-200 dark:border-amber-900 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 p-8 text-center rounded-lg overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 h-32 w-32 bg-gradient-to-br from-purple-200/50 to-transparent dark:from-purple-700/30 rounded-br-full"></div>
        <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-blue-200/50 to-transparent dark:from-blue-700/30 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-pink-200/50 to-transparent dark:from-pink-700/30 rounded-tr-full"></div>
        <div className="absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-amber-200/50 to-transparent dark:from-amber-700/30 rounded-tl-full"></div>
        
        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(191,219,254,0.3)_0,_transparent_60%)] dark:bg-[radial-gradient(circle_at_center,_rgba(91,33,182,0.2)_0,_transparent_60%)]"></div>
        
        {/* Background Award Icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12 opacity-5">
          <Award className="w-[500px] h-[500px] text-purple-600 dark:text-purple-400" />
        </div>
        
        {/* Shining stars */}
        <div className="absolute top-[15%] left-[12%] text-amber-400 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute top-[25%] right-[18%] text-purple-400 animate-pulse delay-300">
          <Star className="w-5 h-5" />
        </div>
        <div className="absolute bottom-[20%] left-[22%] text-blue-400 animate-pulse delay-700">
          <Star className="w-4 h-4" />
        </div>
        <div className="absolute bottom-[15%] right-[15%] text-pink-400 animate-pulse delay-500">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-center items-center gap-3 mb-1">
            <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 font-['Cinzel',serif]">
              Human Potential Network
            </h1>
            <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 italic font-['Parisienne',cursive] text-xl mt-1">
            Certificate of Completion
          </p>
        </div>
        
        {/* Decorative Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent dark:via-amber-600 flex-1"></div>
          <div className="mx-4 relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 dark:from-amber-600 dark:to-amber-500 animate-pulse blur-sm opacity-70"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-full p-2">
              <Award className="w-10 h-10 text-amber-500" fill="rgba(245, 158, 11, 0.3)" />
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent dark:via-amber-600 flex-1"></div>
        </div>
        
        {/* Certificate Body */}
        <div className="my-12 space-y-6">
          <p className="text-lg text-slate-600 dark:text-slate-300 font-['Cormorant_Garamond',serif] italic">
            This is to certify that
          </p>
          
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-['Cinzel',serif] my-4 tracking-wide">
            {userName}
          </p>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 font-['Cormorant_Garamond',serif] italic">
            has successfully completed the course
          </p>
          
          <div className="my-4 relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
            <p className="relative bg-white dark:bg-slate-900 px-5 py-2 rounded-md text-2xl font-bold font-['Cinzel',serif]">
              {courseName}
            </p>
          </div>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 font-['Cormorant_Garamond',serif] italic mt-4">
            demonstrating exceptional commitment to personal growth and skill development
          </p>
        </div>
        
        {/* Date and Signature Section */}
        <div className="mt-14 grid grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600 mb-2"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-['Lato',sans-serif]">Issue Date</p>
            <p className="text-base text-slate-700 dark:text-slate-300 font-['Cormorant_Garamond',serif]">{issueDate}</p>
          </div>
          
          <div className="text-center">
            <div className="font-['Parisienne',cursive] text-2xl text-slate-700 dark:text-slate-300 mb-1">
              Jennifer Hopkins
            </div>
            <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600 mb-2"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-['Lato',sans-serif]">Program Director</p>
          </div>
        </div>
        
        {/* Decorative Seal */}
        <div className="absolute -right-10 bottom-10 transform rotate-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 border-4 border-amber-300 dark:border-amber-700 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400 dark:border-amber-600 flex items-center justify-center">
                <Award className="w-10 h-10 text-amber-500" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-['Lato',sans-serif]">
            Verify this certificate and explore more learning opportunities at
            <a href="#" className="text-blue-600 dark:text-blue-400 ml-1 hover:underline">humanpotential.network/certificates</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;