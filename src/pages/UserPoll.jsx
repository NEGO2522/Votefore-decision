import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, BarChart3, ArrowLeft, Loader2, Trophy } from 'lucide-react';

// Firebase imports
import { db } from '../firebase';
import { ref, onValue, runTransaction } from "firebase/database";

const UserPoll = () => {
    const { pollId } = useParams();
    const navigate = useNavigate();

    // States
    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Sync with Firebase and check local storage for previous vote
    useEffect(() => {
        if (!pollId) return;

        // Check if user has already voted in this specific poll (Local Storage)
        const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '{}');
        if (votedPolls[pollId]) {
            setHasVoted(true);
            setSelectedOption(votedPolls[pollId]);
        }

        const pollRef = ref(db, `polls/${pollId}`);
        const unsubscribe = onValue(pollRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPollData(data);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [pollId]);

    // 2. Handle Voting using a Transaction (Atomic increment)
    const handleVote = async (optionId) => {
        if (hasVoted || !pollData?.isActive || pollData?.timeLeft <= 0) return;

        setIsSubmitting(true);
        const pollRef = ref(db, `polls/${pollId}`);

        try {
            await runTransaction(pollRef, (currentData) => {
                if (currentData && currentData.options && currentData.options[optionId]) {
                    currentData.options[optionId].votes = (currentData.options[optionId].votes || 0) + 1;
                    currentData.totalVotes = (currentData.totalVotes || 0) + 1;
                }
                return currentData;
            });

            // Save to local storage to prevent double voting
            const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '{}');
            votedPolls[pollId] = optionId;
            localStorage.setItem('voted_polls', JSON.stringify(votedPolls));

            setHasVoted(true);
            setSelectedOption(optionId);
        } catch (error) {
            console.error("Vote failed: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const optionsArray = pollData?.options ? Object.values(pollData.options) : [];
    const totalVotes = pollData?.totalVotes || 0;
    const isExpired = pollData?.timeLeft <= 0 || !pollData?.isActive;

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
                <p className="text-zinc-500 mt-2">The session you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold">Go Home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <h1 className="font-black tracking-tighter text-xl">LIVE POLL</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl flex items-center gap-3">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <span className={cn("font-mono font-bold", pollData.timeLeft < 10 && pollData.timeLeft > 0 ? "text-red-500 animate-pulse" : "text-white")}>
                            {pollData.timeLeft > 0 
                                ? `${Math.floor(pollData.timeLeft / 60)}:${(pollData.timeLeft % 60).toString().padStart(2, '0')}`
                                : "0:00"
                            }
                        </span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12 max-w-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                        {pollData.question}
                    </h2>
                    {isExpired && (
                        <span className="px-4 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                            Poll Ended
                        </span>
                    )}
                </div>

                <div className="space-y-4">
                    {optionsArray.map((option, index) => {
                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isWinner = index === 0 && totalVotes > 0;

                        return (
                            <motion.button
                                key={option.id}
                                disabled={hasVoted || isExpired || isSubmitting}
                                onClick={() => handleVote(option.id)}
                                className={cn(
                                    "relative w-full text-left p-6 rounded-2xl border transition-all overflow-hidden group",
                                    hasVoted ? "bg-zinc-900/50 border-white/5 cursor-default" : "bg-zinc-900 border-white/10 hover:border-white/30 active:scale-[0.98]",
                                    selectedOption === option.id && "border-white/40 bg-white/5"
                                )}
                            >
                                {/* Progress Bar Background (Only show after voting or if expired) */}
                                {(hasVoted || isExpired) && (
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        className={cn("absolute inset-0 opacity-10 transition-all duration-1000", option.color)}
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

                                    {(hasVoted || isExpired) && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-black tracking-tighter">{percentage}%</span>
                                            {isWinner && <Trophy className="w-4 h-4 text-yellow-500" />}
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {hasVoted ? "Thank you for your response" : "Select an option to cast your vote"}
                    </p>
                    <p className="text-zinc-700 text-xs mt-2 italic">
                        Total {totalVotes} votes cast so far
                    </p>
                </div>
            </main>
        </div>
    );
};

function cn(...inputs) { return inputs.filter(Boolean).join(' '); }

export default UserPoll;