import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  RotateCcw, 
  Pause, 
  Play,
  ArrowLeft,
  Trophy
} from 'lucide-react';

const AdminPoll = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(true);
    const [participantCount, setParticipantCount] = useState(124);
    
    // Mock data for the poll results
    const [votes, setVotes] = useState([
        { id: 1, label: 'Option A: New Release', count: 45, color: 'bg-white' },
        { id: 2, label: 'Option B: Classic Hits', count: 32, color: 'bg-zinc-400' },
        { id: 3, label: 'Option C: Underground Remixes', count: 28, color: 'bg-zinc-600' },
        { id: 4, label: 'Option D: Instrumental Only', count: 19, color: 'bg-zinc-800' },
    ]);

    const totalVotes = votes.reduce((acc, curr) => acc + curr.count, 0);

    // Simulate real-time vote updates
    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            setVotes(prev => prev.map(v => 
                Math.random() > 0.7 ? { ...v, count: v.count + Math.floor(Math.random() * 2) } : v
            ));
            setParticipantCount(p => p + (Math.random() > 0.8 ? 1 : 0));
        }, 2000);
        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Ambient background glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/generate')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="font-bold tracking-tight">Poll Control Center</h2>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isActive ? "bg-green-400" : "bg-red-400")}></span>
                                <span className={cn("relative inline-flex rounded-full h-2 w-2", isActive ? "bg-green-500" : "bg-red-500")}></span>
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                                {isActive ? 'Live Session' : 'Paused'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-400" />
                        <span className="font-mono font-bold">{participantCount}</span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black mb-2">What should we play next?</h1>
                            <p className="text-zinc-500">Managing real-time audience feedback</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black tracking-tighter">{totalVotes}</p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Votes</p>
                        </div>
                    </div>

                    {/* Poll Results */}
                    <div className="space-y-4">
                        {votes.sort((a, b) => b.count - a.count).map((option, index) => (
                            <motion.div 
                                key={option.id}
                                layout
                                className="relative p-6 rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden"
                            >
                                {/* Progress Bar Background */}
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(option.count / totalVotes) * 100}%` }}
                                    className={cn("absolute inset-0 opacity-10", option.color)}
                                />
                                
                                <div className="relative flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-600 font-black text-xl">0{index + 1}</span>
                                        <div>
                                            <p className="font-bold text-lg">{option.label}</p>
                                            <p className="text-xs text-zinc-500">{option.count} votes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black tracking-tighter">
                                            {Math.round((option.count / totalVotes) * 100)}%
                                        </span>
                                        {index === 0 && <Trophy className="w-4 h-4 text-yellow-500 mt-1 ml-auto" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Admin Controls */}
                    <div className="grid grid-cols-3 gap-4 pt-8">
                        <button 
                            onClick={() => setIsActive(!isActive)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all active:scale-95",
                                isActive ? "bg-zinc-900 border-white/10 text-white" : "bg-white border-transparent text-black"
                            )}
                        >
                            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                            <span className="text-xs font-bold uppercase tracking-widest">{isActive ? 'Pause' : 'Resume'}</span>
                        </button>

                        <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all active:scale-95">
                            <RotateCcw className="w-6 h-6 text-zinc-400" />
                            <span className="text-xs font-bold uppercase tracking-widest">Reset</span>
                        </button>

                        <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all active:scale-95 text-red-400">
                            <LogOut className="w-6 h-6" />
                            <span className="text-xs font-bold uppercase tracking-widest">End Poll</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper function for tailwind classes (can be imported from your utils)
function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}

export default AdminPoll;