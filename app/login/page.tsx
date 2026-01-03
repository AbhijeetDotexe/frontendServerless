// app/login/page.tsx
'use client'; // Try adding this if it's missing

import { AuthForm } from '@/components/AuthForm'; // Check this path

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
       {/* Background Glow */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
       </div>
       
       <div className="z-10 w-full flex justify-center"> {/* Added flex justify-center here */}
         <AuthForm type="login" />
       </div>
    </div>
  );
}