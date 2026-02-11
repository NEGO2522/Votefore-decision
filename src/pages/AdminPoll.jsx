import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  LogOut, 
  RotateCcw, 
  Pause, 
  Play,
  ArrowLeft,
  Trophy,
  Plus,
  X,
  Send,
  BarChart3
} from 'lucide-react';

const AdminPoll = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [participantCount, setParticipantCount] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Poll State (Empty by default)
    const [pollQuestion, setPollQuestion] = useState("");
    const [votes, setVotes] = useState([]);

    // Modal Form State
    const [newQuestion, setNewQuestion] = useState("");
    const [newOptions, setNewOptions] = useState(["", ""]);

    const totalVotes = votes.reduce((acc, curr) => acc + curr.count, 0);

    // --- Functionality ---
    const addOptionField = () => setNewOptions([...newOptions, ""]);
    const removeOptionField = (index) => setNewOptions(newOptions.filter((_, i) => i !== index));
    
    const handleCreatePoll = (e) => {
        e.preventDefault();
        const colors = ['bg-white', 'bg-zinc-300', 'bg-zinc-500', 'bg-zinc-700', 'bg-zinc-800'];
        
        const formattedVotes = newOptions
            .filter(opt => opt.trim() !== "")
            .map((opt, i) => ({
                id: Date.now() + i,
                label: opt,
                count: 0,
                color: colors[i % colors.length]
            }));

        setPollQuestion(newQuestion);
        setVotes(formattedVotes);
        setParticipantCount(0);
        setIsActive(true);
        setShowCreateModal(false);
        setNewQuestion("");
        setNewOptions(["", ""]);
    };

    const resetVotes = () => {
        setVotes(prev => prev.map(v => ({ ...v, count: 0 })));
        setParticipantCount(0);
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="font-bold tracking-tight">Poll Control</h2>
                        {pollQuestion && (
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isActive ? "bg-green-400" : "bg-red-400")}></span>
                                    <span className={cn("relative inline-flex rounded-full h-2 w-2", isActive ? "bg-green-500" : "bg-red-500")}></span>
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                                    {isActive ? 'Live' : 'Paused'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all"
                    >
                        <Plus className="w-4 h-4" /> <span className="hidden md:inline">New Poll</span>
                    </button>
                    <div className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-400" />
                        <span className="font-mono font-bold">{participantCount}</span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    
                    {pollQuestion ? (
                        <>
                            {/* Poll Header */}
                            <div className="flex justify-between items-end">
                                <div className="max-w-[70%]">
                                    <h1 className="text-2xl md:text-4xl font-black mb-2 leading-tight">{pollQuestion}</h1>
                                    <p className="text-zinc-500 text-sm">Waiting for audience responses...</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black tracking-tighter">{totalVotes}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Votes</p>
                                </div>
                            </div>

                            {/* Poll Results */}
                            <div className="space-y-4">
                                {votes.sort((a, b) => b.count - a.count).map((option, index) => (
                                    <motion.div key={option.id} layout className="relative p-6 rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${totalVotes > 0 ? (option.count / totalVotes) * 100 : 0}%` }}
                                            className={cn("absolute inset-0 opacity-10", option.color)}
                                        />
                                        <div className="relative flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <span className="text-zinc-600 font-black text-xl">0{index + 1}</span>
                                                <p className="font-bold text-lg">{option.label}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black tracking-tighter">
                                                    {totalVotes > 0 ? Math.round((option.count / totalVotes) * 100) : 0}%
                                                </span>
                                                {index === 0 && totalVotes > 0 && <Trophy className="w-4 h-4 text-yellow-500 mt-1 ml-auto" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Controls */}
                            <div className="grid grid-cols-3 gap-4 pt-8">
                                <button onClick={() => setIsActive(!isActive)} className={cn("flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all", isActive ? "bg-zinc-900 border-white/10" : "bg-white text-black")}>
                                    {isActive ? <Pause /> : <Play className="fill-current" />}
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{isActive ? 'Pause' : 'Resume'}</span>
                                </button>
                                <button onClick={resetVotes} className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all">
                                    <RotateCcw className="text-zinc-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Reset</span>
                                </button>
                                <button onClick={() => navigate('/generate')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-zinc-900 border border-white/10 text-red-400 hover:bg-red-500/10 transition-all">
                                    <LogOut />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">End Session</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                            <BarChart3 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">No Active Poll</h2>
                            <p className="text-zinc-500 mb-8 max-w-xs mx-auto text-sm">Create a new poll to start receiving real-time votes from your audience.</p>
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                Create Your First Poll
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* --- CREATE POLL MODAL --- */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold">New Poll Configuration</h3>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5"/></button>
                            </div>

                            <form onSubmit={handleCreatePoll} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Poll Question</label>
                                    <input required value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="What's on your mind?" className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 focus:border-white/20 outline-none transition-all" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Options</label>
                                    {newOptions.map((opt, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input required value={opt} onChange={(e) => {
                                                const updated = [...newOptions];
                                                updated[i] = e.target.value;
                                                setNewOptions(updated);
                                            }} placeholder={`Option ${i+1}`} className="flex-1 bg-black border border-white/5 rounded-xl px-4 py-3 focus:border-white/20 outline-none" />
                                            {newOptions.length > 2 && (
                                                <button type="button" onClick={() => removeOptionField(i)} className="p-3 text-zinc-500 hover:text-red-400 transition-colors"><X className="w-4 h-4"/></button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addOptionField} className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors py-2"><Plus className="w-3 h-3"/> Add Another Option</button>
                                </div>

                                <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
                                    <Send className="w-4 h-4" /> Start Poll Session
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

function cn(...inputs) { return inputs.filter(Boolean).join(' '); }

export default AdminPoll;