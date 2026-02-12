import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  LogOut, 
  RotateCcw, 
  Pause, 
  Play,
  ArrowLeft,
  Plus,
  X,
  Send,
  BarChart3,
  Mail
} from 'lucide-react';
import { db } from '../firebase';
import { ref, set, onValue, update } from 'firebase/database';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AdminPoll = () => {
    const navigate = useNavigate();
    const { pollId } = useParams(); // Get the ID from the URL (e.g., /admin/poll/5)
    
    const [isActive, setIsActive] = useState(false);
    const [participantCount, setParticipantCount] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showResponses, setShowResponses] = useState(false);
    
    // Poll State
    const [pollQuestion, setPollQuestion] = useState("");
    const [votes, setVotes] = useState([]);
    const [rawResponses, setRawResponses] = useState([]);

    // Modal Form State
    const [newQuestion, setNewQuestion] = useState("");
    const [newOptions, setNewOptions] = useState(["", ""]);

    // --- Firebase Sync: Main Poll Data ---
    useEffect(() => {
        if (!pollId) return;
        
        // Match the path used by the UserPoll (polls/ID)
        const pollRef = ref(db, `polls/${pollId}`);
        
        const unsubscribe = onValue(pollRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPollQuestion(data.question || "");
                setVotes(data.options || []);
                setIsActive(data.isActive || false);
                setParticipantCount(data.totalParticipants || 0);
            } else {
                setPollQuestion("");
                setVotes([]);
            }
        });

        return () => unsubscribe();
    }, [pollId]);

    // --- Firebase Sync: Participant Emails ---
    useEffect(() => {
        if (!pollId) return;
        const responsesRef = ref(db, `poll_responses/${pollId}`);
        const unsubscribe = onValue(responsesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setRawResponses(Object.values(data));
            } else {
                setRawResponses([]);
            }
        });
        return () => unsubscribe();
    }, [pollId]);

    const totalVotes = votes.reduce((acc, curr) => acc + (curr.count || 0), 0);

    // --- Form Logic ---
    const addOptionField = () => setNewOptions([...newOptions, ""]);
    const removeOptionField = (index) => setNewOptions(newOptions.filter((_, i) => i !== index));
    
    const handleCreatePoll = async (e) => {
        e.preventDefault();
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'];
        
        const formattedOptions = newOptions
            .filter(opt => opt.trim() !== "")
            .map((opt, i) => ({
                id: i,
                label: opt,
                count: 0,
                color: colors[i % colors.length]
            }));

        const newPollData = {
            question: newQuestion,
            options: formattedOptions,
            isActive: true,
            createdAt: Date.now(),
            totalParticipants: 0,
            pollId: pollId // Store the ID inside for reference
        };

        try {
            // Updated to use the dynamic pollId from URL
            await set(ref(db, `polls/${pollId}`), newPollData);
            setShowCreateModal(false);
            setNewQuestion("");
            setNewOptions(["", ""]);
        } catch (error) {
            console.error("Error creating poll:", error);
            alert("Failed to sync with Database.");
        }
    };

    const togglePollStatus = async () => {
        const pollRef = ref(db, `polls/${pollId}`);
        await update(pollRef, { isActive: !isActive });
    };

    const resetVotes = async () => {
        if (!window.confirm("Are you sure? This will wipe all current results and emails.")) return;
        
        const pollRef = ref(db, `polls/${pollId}`);
        const resetOptions = votes.map(v => ({ ...v, count: 0 }));
        
        await update(pollRef, { 
            options: resetOptions,
            totalParticipants: 0 
        });
        await set(ref(db, `poll_responses/${pollId}`), null);
    };

    const endSession = async () => {
        if (!window.confirm("End session and delete poll?")) return;
        await set(ref(db, `polls/${pollId}`), null);
        navigate('/generate');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            </div>

            {/* Nav */}
            <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/generate')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="font-bold tracking-tight">Admin Console <span className="text-zinc-500 ml-1">#{pollId}</span></h2>
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
                        onClick={() => setShowResponses(!showResponses)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                    >
                        <Mail className={cn("w-5 h-5", showResponses ? "text-white" : "text-zinc-500")} />
                    </button>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all"
                    >
                        <Plus className="w-4 h-4" /> <span className="hidden md:inline">New Poll</span>
                    </button>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Results */}
                    <div className="lg:col-span-2 space-y-8">
                        {pollQuestion ? (
                            <>
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{pollQuestion}</h1>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-3xl font-black tracking-tighter">{totalVotes}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Votes</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black tracking-tighter text-blue-500">{participantCount}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Participants</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {votes.map((option) => {
                                        const percentage = totalVotes > 0 ? Math.round((option.count / totalVotes) * 100) : 0;
                                        return (
                                            <div key={option.id} className="relative p-5 rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    className={cn("absolute inset-0 opacity-10", option.color)}
                                                />
                                                <div className="relative flex justify-between items-center">
                                                    <span className="font-bold text-lg">{option.label}</span>
                                                    <div className="text-right">
                                                        <span className="text-xl font-black">{percentage}%</span>
                                                        <p className="text-[10px] text-zinc-500">{option.count} votes</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <button onClick={togglePollStatus} className={cn("flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all", isActive ? "bg-zinc-900 border-white/10" : "bg-white text-black")}>
                                        {isActive ? <Pause size={20}/> : <Play size={20} className="fill-current"/>}
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{isActive ? 'Pause' : 'Resume'}</span>
                                    </button>
                                    <button onClick={resetVotes} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all">
                                        <RotateCcw size={20} className="text-zinc-400"/>
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Reset</span>
                                    </button>
                                    <button onClick={endSession} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-900 border border-white/10 text-red-400 hover:bg-red-500/10 transition-all">
                                        <LogOut size={20}/>
                                        <span className="text-[9px] font-bold uppercase tracking-widest">End</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                <BarChart3 className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                <h2 className="text-xl font-bold">No Poll Created for #{pollId}</h2>
                                <p className="text-zinc-500 mt-2 text-sm">Create a poll to start seeing live results for this room.</p>
                            </div>
                        )}
                    </div>

                    {/* Feed */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-6 h-full max-h-[600px] flex flex-col">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                                <Users size={14}/> Live Responses
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {rawResponses.length > 0 ? (
                                    rawResponses.slice().reverse().map((res, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i} 
                                            className="p-3 bg-zinc-900 rounded-xl border border-white/5"
                                        >
                                            <p className="text-[10px] text-zinc-500 font-mono mb-1">{new Date(res.timestamp).toLocaleTimeString()}</p>
                                            <p className="text-xs font-bold truncate">{res.email}</p>
                                            <p className="text-[10px] text-zinc-400 mt-1">Voted: <span className="text-white">{res.label}</span></p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center text-zinc-700 text-xs italic">
                                        Waiting for participants...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold">Create Poll for Room #{pollId}</h3>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleCreatePoll} className="space-y-6">
                                <input required value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Poll Question" className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/20" />
                                <div className="space-y-3">
                                    {newOptions.map((opt, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input required value={opt} onChange={(e) => {
                                                const updated = [...newOptions];
                                                updated[i] = e.target.value;
                                                setNewOptions(updated);
                                            }} placeholder={`Option ${i+1}`} className="flex-1 bg-black border border-white/5 rounded-xl px-4 py-3 text-sm outline-none" />
                                            {newOptions.length > 2 && <button type="button" onClick={() => removeOptionField(i)} className="p-2 text-zinc-500"><X size={16}/></button>}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addOptionField} className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">+ Add Option</button>
                                </div>
                                <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2">
                                    <Send size={18} /> Launch Poll
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPoll;