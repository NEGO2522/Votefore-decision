import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, BarChart3, Loader2, Trophy, Mail, ArrowRight } from 'lucide-react';

// Firebase imports
import { db } from '../firebase';
import { ref, onValue, runTransaction, push, set } from "firebase/database";

const UserPoll = () => {
    const navigate = useNavigate();
    const { pollId } = useParams(); // Get the Room ID from the URL

    // States
    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [isEnteringEmail, setIsEnteringEmail] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Listen to the specific poll ID from the URL
    useEffect(() => {
        if (!pollId) {
            setLoading(false);
            return;
        }

        const pollRef = ref(db, `polls/${pollId}`);
        
        const unsubscribe = onValue(pollRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPollData(data);
                
                // Check local storage using the specific poll's createdAt timestamp or ID
                const localVote = localStorage.getItem(`voted_${data.createdAt || pollId}`);
                if (localVote) {
                    setHasVoted(true);
                    setSelectedOption(parseInt(localVote));
                    setIsEnteringEmail(false);
                }
            } else {
                setPollData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [pollId]);

    // 2. Handle Voting
    const handleVote = async (optionId) => {
        if (hasVoted || !pollData?.isActive || isSubmitting) return;

        setIsSubmitting(true);
        const pollRef = ref(db, `polls/${pollId}`); // Match Admin path
        const responsesRef = ref(db, `poll_responses/${pollId}`); // Match Admin path

        try {
            // Update Poll Counts (Atomic Transaction)
            await runTransaction(pollRef, (currentData) => {
                if (currentData && currentData.options) {
                    const optIndex = currentData.options.findIndex(o => o.id === optionId);
                    if (optIndex !== -1) {
                        currentData.options[optIndex].count = (currentData.options[optIndex].count || 0) + 1;
                        currentData.totalParticipants = (currentData.totalParticipants || 0) + 1;
                    }
                }
                return currentData;
            });

            // Store User Email & Choice
            const newResponseRef = push(responsesRef);
            await set(newResponseRef, {
                email: email,
                optionId: optionId,
                label: pollData.options.find(o => o.id === optionId)?.label,
                timestamp: Date.now()
            });

            // Save state locally so they can't vote again on refresh
            localStorage.setItem(`voted_${pollData.createdAt || pollId}`, optionId.toString());
            setHasVoted(true);
            setSelectedOption(optionId);
            
        } catch (error) {
            console.error("Vote failed: ", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email.trim() && email.includes('@')) {
            setIsEnteringEmail(false);
        } else {
            alert("Please enter a valid email address.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    if (!pollData) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <BarChart3 className="w-16 h-16 text-zinc-800 mb-4" />
                <h1 className="text-2xl font-black">Poll Not Found</h1>
                <p className="text-zinc-500 mt-2">This session may have ended or the link is incorrect.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-6 text-sm font-bold text-white underline underline-offset-4"
                >
                    Go Back Home
                </button>
            </div>
        );
    }

    const totalVotes = pollData.totalParticipants || 0;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            </div>

            <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <h1 className="font-black tracking-tighter text-xl">LIVE POLL <span className="text-zinc-600 ml-2">#{pollId}</span></h1>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", pollData.isActive ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            {pollData.isActive ? "Live" : "Paused"}
                        </span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12 max-w-2xl">
                <AnimatePresence mode="wait">
                    {isEnteringEmail ? (
                        <motion.div 
                            key="email-step"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-8 py-12"
                        >
                            <div>
                                <h2 className="text-4xl font-black mb-4">Join Poll</h2>
                                <p className="text-zinc-500">Please enter your email to participate.</p>
                            </div>
                            <form onSubmit={handleEmailSubmit} className="max-w-sm mx-auto space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                    <input 
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-white/30 transition-all"
                                    />
                                </div>
                                <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="poll-step"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                                    {pollData.question}
                                </h2>
                                {!pollData.isActive && (
                                    <span className="px-4 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                                        Voting Paused
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {pollData.options.map((option, index) => {
                                    const percentage = totalVotes > 0 ? Math.round((option.count / totalVotes) * 100) : 0;
                                    const isWinner = hasVoted && percentage === Math.max(...pollData.options.map(o => Math.round((o.count / (totalVotes || 1)) * 100)));

                                    return (
                                        <motion.button
                                            key={option.id}
                                            disabled={hasVoted || !pollData.isActive || isSubmitting}
                                            onClick={() => handleVote(option.id)}
                                            className={cn(
                                                "relative w-full text-left p-6 rounded-2xl border transition-all overflow-hidden group",
                                                hasVoted ? "bg-zinc-900/50 border-white/5 cursor-default" : "bg-zinc-900 border-white/10 hover:border-white/30 active:scale-[0.98]",
                                                selectedOption === option.id && "border-white/40 bg-white/5"
                                            )}
                                        >
                                            {hasVoted && (
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    className={cn("absolute inset-0 opacity-10 transition-all duration-1000", option.color || 'bg-white')}
                                                />
                                            )}

                                            <div className="relative flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    {hasVoted ? (
                                                        selectedOption === option.id ? <CheckCircle2 className="w-5 h-5 text-white" /> : <div className="w-5" />
                                                    ) : (
                                                        <span className="text-zinc-600 font-black text-xl">{index + 1}</span>
                                                    )}
                                                    <p className="font-bold text-lg">{option.label}</p>
                                                </div>

                                                {hasVoted && (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl font-black tracking-tighter">{percentage}%</span>
                                                        {isWinner && totalVotes > 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="mt-12 text-center">
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {hasVoted ? `Logged in as: ${email}` : "Select an option to cast your vote"}
                                </p>
                                <p className="text-zinc-700 text-xs mt-2 italic">
                                    Total {totalVotes} participants
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

// Simple utility for merging tailwind classes
function cn(...inputs) { return inputs.filter(Boolean).join(' '); }

export default UserPoll;