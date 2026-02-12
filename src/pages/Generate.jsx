import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, History, Play, User, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Import Firebase
import { db } from '../firebase'; 
import { ref, onValue, push, runTransaction, serverTimestamp } from "firebase/database";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Generate = () => {
    const navigate = useNavigate();
    const qrRef = useRef();
    
    // The BASE_URL is for the VOTERS (the QR code)
    const BASE_URL = 'https://votefore-decision.vercel.app/join/';
    const [url, setUrl] = useState(`${BASE_URL}1`);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const pollIdRef = ref(db, 'currentPollId');
        const historyRef = ref(db, 'pollHistory');

        const unsubId = onValue(pollIdRef, (snapshot) => {
            const data = snapshot.val();
            setUrl(`${BASE_URL}${data || 1}`);
            setLoading(false);
        });

        const unsubHistory = onValue(historyRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const historyList = Object.entries(data)
                    .map(([id, value]) => ({ id, ...value }))
                    .reverse()
                    .slice(0, 5);
                setHistory(historyList);
            } else {
                setHistory([]);
            }
        });

        return () => {
            unsubId();
            unsubHistory();
        };
    }, []);

    const addToFirebaseHistory = async (newUrl) => {
        const historyRef = ref(db, 'pollHistory');
        const pollNum = newUrl.split('/').pop();
        
        await push(historyRef, {
            url: newUrl,
            pollNumber: pollNum,
            timestamp: new Date().toLocaleString(),
            createdAt: serverTimestamp()
        });
    };

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const pngUrl = canvas.toDataURL("image/png");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `votefore-qr-${url.split('/').pop()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStartPoll = async () => {
        setLoading(true);
        const pollIdRef = ref(db, 'currentPollId');
        
        try {
            const currentId = url.split('/').pop();

            // 1. Save current state to history before incrementing
            await addToFirebaseHistory(url);

            // 2. Increment global ID for the NEXT person who visits /generate
            await runTransaction(pollIdRef, (currentValue) => {
                return (currentValue || 1) + 1;
            });

            // 3. NAVIGATE INTERNALLY to admin dashboard
            navigate(`/admin/poll/${currentId}`); 
        } catch (error) {
            console.error("Error starting poll:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Navbar matching Landing.jsx */}
            <nav className="relative z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black transition-transform group-hover:scale-105">V</div>
                    <span className="font-bold tracking-tighter text-xl">VoteFore</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')} 
                        className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
                    >
                        Home
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-zinc-400 hover:text-white">
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 pt-16 pb-20">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Left Column */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight mb-4 text-white">Generate Access</h1>
                                <p className="text-zinc-500 font-light leading-relaxed">
                                    Current session: <span className="text-white font-bold">#{url.split('/').pop()}</span>.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Live Join URL (For Voters)</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={url}
                                        readOnly
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none transition-all cursor-default"
                                    />
                                    <button onClick={copyToClipboard} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors">
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleStartPoll}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-white/10 hover:bg-zinc-200 disabled:opacity-50"
                            >
                                <Play className="w-5 h-5 fill-black" />
                                Start Poll Dashboard #{url.split('/').pop()}
                            </button>
                        </motion.div>

                        {/* Right Column (QR Code) */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8">
                            <div ref={qrRef} className="p-8 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                <QRCodeCanvas 
                                    value={url} 
                                    size={240}
                                    level="H" 
                                    imageSettings={{ src: "/favicon.png", height: 40, width: 40, excavate: true }}
                                />
                            </div>
                            <button onClick={downloadQRCode} className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 border border-white/10 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all">
                                <Download className="w-4 h-4" /> Download PNG
                            </button>
                        </motion.div>
                    </div>

                    {/* History Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t border-white/5 pt-12">
                        <div className="flex items-center gap-3 mb-8">
                            <History className="w-5 h-5 text-zinc-400" />
                            <h2 className="text-xl font-bold tracking-tight">Recent Database Polls</h2>
                        </div>

                        <div className="grid gap-4">
                            <AnimatePresence mode='popLayout'>
                                {history.length > 0 ? (
                                    history.map((item) => (
                                        <motion.div 
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all"
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 font-bold">
                                                    #{item.pollNumber}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-zinc-200 truncate">{item.url}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.timestamp}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/admin/poll/${item.pollNumber}`)}
                                                className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl text-xs font-bold transition-all"
                                            >
                                                Admin View
                                            </button>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 rounded-3xl border border-dashed border-white/5">
                                        <p className="text-zinc-600 text-sm italic">No poll history in database.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Generate;