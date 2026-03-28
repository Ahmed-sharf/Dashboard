import React, { useState } from 'react';
import { Home, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (username === 'ahmed' && password === '12345') {
        toast.success('Welcome back, Ahmed!');
        onLogin(username);
      } else {
        toast.error('Invalid credentials', {
          description: 'Please check your username and password.',
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 dark:border-zinc-800">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/20 mb-6">
              <Home className="text-white dark:text-black w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Smartly</h1>
            <p className="text-gray-400 mt-2 text-center">Your home, smarter and more efficient than ever.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 focus:bg-white dark:focus:bg-zinc-800 transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 focus:bg-white dark:focus:bg-zinc-800 transition-all dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/90 dark:hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg shadow-black/10 dark:shadow-white/5 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-zinc-800 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account? <button className="text-black dark:text-white font-bold hover:underline">Contact Admin</button>
            </p>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-xs mt-8">
          &copy; 2026 Smartly Home Automation. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
