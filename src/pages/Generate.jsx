import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowRight, Download, Share2, Sparkles, Copy, Check, History, ExternalLink, Trash2, Play } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Generate = () => {
    const navigate = useNavigate();
    const qrRef = useRef();
    const [url, setUrl] = useState('https://votefore.com/join/123');
    const [copied, setCopied] = useState(false);
    
    // History state initialized from localStorage
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('qr_history');
        return saved ? JSON.parse(saved) : [];
    });

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('qr_history', JSON.stringify(history));
    }, [history]);

    const addToHistory = (newUrl) => {
        if (!newUrl || history.some(item => item.url === newUrl)) return;
        const newEntry = {
            id: Date.now(),
            url: newUrl,
            timestamp: new Date().toLocaleDateString()
        };
        setHistory(prev => [newEntry, ...prev].slice(0, 5)); // Keep last 5
    };

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        
        // Add to history when downloaded
        addToHistory(url);

        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "votefore-qr.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        addToHistory(url); // Also add to history when copied
        setTimeout(() => setCopied(false), 2000);
    };

    const clearHistory = () => setHistory([]);

    const handleStartPoll = () => {
        // Navigates to the Admin Poll dashboard
        navigate('/admin/poll'); 
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Header Navigation */}
            <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black">V</div>
                    <span className="font-bold tracking-tighter text-xl">VoteFore</span>
                </div>

                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <span className="text-sm font-medium">Back to Home</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </nav>

            <main className="relative z-10 container mx-auto px-6 pt-16 pb-20">
                <div className="max-w-4xl mx-auto space-y-16">
                    
                    {/* Top Section: Generator */}
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Left: Input Controls */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h1 className="text-4xl font-black tracking-tight mb-4 text-white">Generate Access</h1>
                                <p className="text-zinc-500 font-light leading-relaxed">
                                    Create a unique QR code for your audience. When they scan this, they'll be dropped straight into your live session.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Poll Destination URL</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Enter destination link..."
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 transition-all"
                                    />
                                    <button 
                                        onClick={copyToClipboard}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Start Poll Button for Admin */}
                            <button 
                                onClick={handleStartPoll}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-white/10 hover:bg-zinc-200"
                            >
                                <Play className="w-5 h-5 fill-black" />
                                Start Live Poll
                            </button>

                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 text-zinc-400" />
                                    <h3 className="font-bold text-sm">Pro Tip</h3>
                                </div>
                                <p className="text-sm text-zinc-500 font-light">
                                    Click "Start Live Poll" to manage your candidates and see incoming results in real-time.
                                </p>
                            </div>
                        </motion.div>

                        {/* Right: QR Preview */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <div 
                                ref={qrRef}
                                className="p-8 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform hover:scale-[1.02]"
                            >
                                <QRCodeCanvas 
                                    value={url} 
                                    size={240}
                                    level="H" 
                                    includeMargin={false}
                                    imageSettings={{
                                        src: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.png",
                                        height: 40,
                                        width: 40,
                                        excavate: true,
                                    }}
                                />
                            </div>

                            <div className="flex w-full gap-4">
                                <button 
                                    onClick={downloadQRCode}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-900 border border-white/10 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-95"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PNG
                                </button>
                                <button className="px-6 py-4 bg-zinc-900 border border-white/10 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Section: History */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="border-t border-white/5 pt-12"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-zinc-400" />
                                <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
                            </div>
                            {history.length > 0 && (
                                <button 
                                    onClick={clearHistory}
                                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" /> Clear History
                                </button>
                            )}
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
                                            className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-900/50 transition-all"
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-zinc-200 truncate">{item.url}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.timestamp}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setUrl(item.url)}
                                                className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl text-xs font-bold transition-all"
                                            >
                                                Restore
                                            </button>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 rounded-3xl border border-dashed border-white/5">
                                        <p className="text-zinc-600 text-sm italic">No recent activity found.</p>
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