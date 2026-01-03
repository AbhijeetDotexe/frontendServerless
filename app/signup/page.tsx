import { AuthForm } from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
       {/* Ambient Background Glow */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
       </div>

       <div className="z-10 w-full">
         <AuthForm type="signup" />
       </div>
    </div>
  );
}