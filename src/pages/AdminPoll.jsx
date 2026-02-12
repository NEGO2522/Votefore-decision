import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, LogOut, RotateCcw, Pause, Play, ArrowLeft, 
  Trophy, Plus, X, Send, BarChart3, Clock 
} from 'lucide-react';

// 1. Import Firebase
import { db } from '../firebase';
import { ref, onValue, set, update } from "firebase/database";

const AdminPoll = () => {
    const { pollId } = useParams(); // Gets the ID from the URL: /admin/poll/:pollId
    const navigate = useNavigate();
    
    // UI & Local States
    const [isActive, setIsActive] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [pollData, setPollData] = useState(null);
    
    // Modal Form States
    const [newQuestion, setNewQuestion] = useState("");
    const [newOptions, setNewOptions] = useState(["", ""]);
    const [timeLimit, setTimeLimit] = useState(60); // Default 1 minute

    // 2. Sync with Firebase on Component Mount
    useEffect(() => {
        if (!pollId) return;
        const pollRef = ref(db, `polls/${pollId}`);

        const unsubscribe = onValue(pollRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPollData(data);
                setIsActive(data.isActive);
            }
        });

        return () => unsubscribe();
    }, [pollId]);

    // 3. Timer Logic (Server-Side Sync)
    useEffect(() => {
        let timer;
        if (isActive && pollData?.timeLeft > 0) {
            timer = setInterval(() => {
                const newTime = pollData.timeLeft - 1;
                update(ref(db, `polls/${pollId}`), { timeLeft: newTime });
            }, 1000);
        } else if (pollData?.timeLeft === 0 && isActive) {
            // Auto-pause when time runs out
            handleToggleActive(false);
        }
        return () => clearInterval(timer);
    }, [isActive, pollData?.timeLeft, pollId]);

    // 4. Create/Initialize the Poll in DB
    const handleCreatePoll = async (e) => {
        e.preventDefault();
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'];
        
        // Transform options into an object for Firebase
        const optionsObj = {};
        newOptions.filter(opt => opt.trim() !== "").forEach((opt, i) => {
            const id = `opt_${i}`;
            optionsObj[id] = {
                id,
                label: opt,
                votes: 0,
                color: colors[i % colors.length]
            };
        });

        const pollPayload = {
            question: newQuestion,
            options: optionsObj,
            isActive: true,
            timeLeft: parseInt(timeLimit),
            totalVotes: 0,
            participantCount: 0, // In a real app, track this via a separate 'presence' node
            createdAt: new Date().toISOString()
        };

        await set(ref(db, `polls/${pollId}`), pollPayload);
        setShowCreateModal(false);
    };

    const handleToggleActive = (status) => {
        update(ref(db, `polls/${pollId}`), { isActive: status });
    };

    const resetVotes = () => {
        if (!pollData) return;
        const resetOptions = { ...pollData.options };
        Object.keys(resetOptions).forEach(key => resetOptions[key].votes = 0);
        
        update(ref(db, `polls/${pollId}`), { 
            options: resetOptions, 
            totalVotes: 0 
        });
    };

    // Calculate dynamic values for display
    const optionsArray = pollData?.options ? Object.values(pollData.options) : [];
    const totalVotes = pollData?.totalVotes || 0;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/generate')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="font-bold tracking-tight text-sm text-zinc-400">ADMIN CONTROL PANEL</h2>
                        <h1 className="font-black tracking-tighter">POLL #{pollId}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {pollData && (
                        <div className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl flex items-center gap-3">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            <span className={cn("font-mono font-bold", pollData.timeLeft < 10 ? "text-red-500 animate-pulse" : "text-white")}>
                                {Math.floor(pollData.timeLeft / 60)}:{(pollData.timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                    )}
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all"
                    >
                        <Plus className="w-4 h-4" /> New Session
                    </button>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    {pollData ? (
                        <div className="space-y-8">
                            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                                <div className="max-w-[70%]">
                                    <h2 className="text-3xl md:text-5xl font-black mb-2 leading-tight">{pollData.question}</h2>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                            {isActive ? 'Live & Accepting Votes' : 'Poll Paused'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-5xl font-black tracking-tighter">{totalVotes}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Votes Cast</p>
                                </div>
                            </div>

                            {/* Poll Results Display */}
                            <div className="space-y-4">
                                {optionsArray.sort((a, b) => b.votes - a.votes).map((option, index) => {
                                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                                    return (
                                        <motion.div key={option.id} layout className="relative p-6 rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className={cn("absolute inset-0 opacity-10 transition-all duration-1000", option.color)}
                                            />
                                            <div className="relative flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-700 font-black text-2xl">{index + 1}</span>
                                                    <p className="font-bold text-lg">{option.label}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl font-black tracking-tighter">{percentage}%</span>
                                                    {index === 0 && totalVotes > 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Admin Controls */}
                            <div className="grid grid-cols-3 gap-4 pt-8">
                                <button onClick={() => handleToggleActive(!isActive)} className={cn("flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all", isActive ? "bg-zinc-900 border-white/10 text-white" : "bg-white text-black")}>
                                    {isActive ? <Pause /> : <Play className="fill-current" />}
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{isActive ? 'Pause Poll' : 'Resume Poll'}</span>
                                </button>
                                <button onClick={resetVotes} className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all">
                                    <RotateCcw className="text-zinc-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Reset Votes</span>
                                </button>
                                <button onClick={() => navigate('/generate')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-zinc-900 border border-white/10 text-red-400 hover:bg-red-500/10 transition-all">
                                    <LogOut />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Close Dashboard</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                            <BarChart3 className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                            <h2 className="text-2xl font-black mb-2">No Data for Poll #{pollId}</h2>
                            <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-sm leading-relaxed">
                                This poll hasn't been configured yet. Click the button below to set a question and start the session.
                            </p>
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="px-10 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                Configure Poll
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* --- NEW POLL MODAL --- */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                            <form onSubmit={handleCreatePoll} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">The Question</label>
                                    <input required value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="e.g. What's our next project?" className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 focus:border-white/20 outline-none transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Time Limit (Seconds)</label>
                                    <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 outline-none" />
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
                                                <button type="button" onClick={() => setNewOptions(newOptions.filter((_, idx) => idx !== i))} className="p-3 text-zinc-500 hover:text-red-400"><X className="w-4 h-4"/></button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setNewOptions([...newOptions, ""])} className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">+ Add another option</button>
                                </div>

                                <button type="submit" className="w-full py-5 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
                                    <Send className="w-4 h-4" /> LAUNCH POLL SESSION
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