import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    Zap, 
    QrCode, 
    Music, 
    Users, 
    Radio, 
    User, 
    X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

// Utility for class merging
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CONCERT_IMAGES = [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80"  
];

// --- Sub-Components ---

const Cursor = ({ x, y, isClicking }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{
            x,
            y,
            opacity: 1,
            scale: isClicking ? 0.8 : 1,
        }}
        transition={{
            x: { type: "spring", stiffness: 150, damping: 20 },
            y: { type: "spring", stiffness: 150, damping: 20 },
            scale: { duration: 0.1 },
            opacity: { duration: 0.5 }
        }}
        className="fixed top-0 left-0 w-6 h-6 z-[100] pointer-events-none"
        style={{ marginTop: -5, marginLeft: -5 }} 
    >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    </motion.div>
);

const MouseGradient = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
                className="absolute w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] mix-blend-overlay"
                style={{
                    x: springX,
                    y: springY,
                    top: -400,
                    left: -400,
                }}
            />
        </div>
    );
};

const GridPattern = () => (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
);

const AnimatedText = ({ text, className, delay = 0 }) => {
    const words = text.split(" ");
    
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
                hidden: {}
            }}
            className={cn("flex flex-wrap", className)}
        >
            {words.map((word, index) => (
                <motion.span 
                    key={index}
                    variants={{
                        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                        hidden: { opacity: 0, y: 20, filter: "blur(10px)" }
                    }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    className="mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

const VotingCard = () => {
    const [voted, setVoted] = useState(false);
    const options = useMemo(() => [
        { name: "Midnight Echoes", percent: 58 },
        { name: "Thunder in the Valley", percent: 32 },
        { name: "Neon Dreams", percent: 10 }
    ], []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative z-20 w-full max-w-md bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl mx-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Live Session</span>
                </div>
                <span className="text-xs font-mono text-zinc-500 italic">Syncing...</span>
            </div>

            <h3 className="text-2xl font-light text-white mb-8 leading-tight">
                Which anthem should the crowd hear next?
            </h3>

            <div className="space-y-4">
                {options.map((option, i) => (
                    <button
                        key={i}
                        className="w-full relative overflow-hidden rounded-xl group transition-all"
                        onClick={() => setVoted(true)}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={voted ? { width: `${option.percent}%` } : { width: "0%" }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="absolute top-0 left-0 h-full bg-white/10 z-0"
                        />
                        <div className="relative p-4 flex justify-between items-center z-10 border border-white/5 rounded-xl bg-black/20 group-hover:border-white/20 transition-colors">
                            <span className="font-light text-zinc-300 group-hover:text-white">{option.name}</span>
                            {voted ? (
                                <span className="font-mono text-sm text-white">{option.percent}%</span>
                            ) : (
                                <Music className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

const MinimalFeature = ({ icon: Icon, title, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
        className="flex flex-col items-center gap-3 text-center group"
    >
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
            <Icon className="w-6 h-6 text-zinc-400 group-hover:text-white" />
        </div>
        <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors tracking-wide uppercase">{title}</span>
    </motion.div>
);

const DemoPollCard = ({ id, title, options, votedIndex }) => {
    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-medium">{title}</h4>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] text-zinc-500 font-mono">LIVE</span>
                </div>
            </div>
            <div className="space-y-3">
                {options.map((opt, i) => {
                    const isVoted = votedIndex === i;
                    return (
                        <div
                            id={`${id}-opt-${i}`}
                            key={i}
                            className={cn(
                                "relative h-10 rounded-lg overflow-hidden transition-all duration-300 border",
                                isVoted ? "border-white/20 bg-white/5" : "border-transparent bg-zinc-800/30"
                            )}
                        >
                            <motion.div
                                className={cn("absolute top-0 left-0 h-full", isVoted ? "bg-white/20" : "bg-white/5")}
                                animate={{ width: isVoted ? `${opt.percent + 10}%` : `${opt.percent}%` }}
                                transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-4 text-sm pointer-events-none">
                                <span className={cn(isVoted ? "text-white font-medium" : "text-zinc-400")}>
                                    {opt.name}
                                </span>
                                <span className="text-zinc-500 font-mono text-xs">{opt.percent}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const LiveDemoModal = ({ onClose }) => {
    const [cursor, setCursor] = useState({ x: -100, y: -100 });
    const [isClicking, setIsClicking] = useState(false);
    const [isHoveringClose, setIsHoveringClose] = useState(false); 
    const [movieState, setMovieState] = useState({ poll1: -1, poll2: -1 });
    
    // NEW: View state to toggle between QR and Polls
    const [view, setView] = useState('qr'); 

    useEffect(() => {
        document.body.classList.add('demo-active');
        return () => {
            document.body.classList.remove('demo-active');
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const runScript = async () => {
            const wait = (ms) => new Promise(res => setTimeout(res, ms));
            
            const moveTo = (elementId, isCloseBtn = false) => {
                const el = document.getElementById(elementId);
                if (el && isMounted) {
                    const rect = el.getBoundingClientRect();
                    setCursor({ x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 });
                    if (isCloseBtn) setIsHoveringClose(true);
                }
            };

            // 1. Show QR Code first
            await wait(1500);
            moveTo("demo-qr-container");
            await wait(800);
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);
            
            // 2. Transition to Polls
            if(isMounted) setView('demo');
            await wait(800);

            // 3. Automate Poll 1
            moveTo("demo-p1-opt-0");
            await wait(800);
            setIsClicking(true);
            setMovieState(s => ({ ...s, poll1: 0 }));
            await wait(200);
            setIsClicking(false);
            
            // 4. Automate Poll 2
            await wait(800);
            moveTo("demo-p2-opt-1");
            await wait(800);
            setIsClicking(true);
            setMovieState(s => ({ ...s, poll2: 1 }));
            await wait(200);
            setIsClicking(false);
            
            // 5. Close
            await wait(1000);
            moveTo("demo-close-btn", true);
            await wait(800);
            setIsClicking(true);
            await wait(200);
            
            if(isMounted) onClose();
        };
        runScript();
        return () => { isMounted = false; };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            onClick={onClose}
        >
            <Cursor x={cursor.x} y={cursor.y} isClicking={isClicking} />
            
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[3rem] p-10 relative shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {view === 'qr' ? "Join the Session" : "Live Participation"}
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1">
                            {view === 'qr' ? "Scan the code to enter the demo" : "Simulating real-time audience feedback"}
                        </p>
                    </div>
                    
                    <button 
                        id="demo-close-btn"
                        onClick={onClose} 
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            isHoveringClose ? "bg-white/10 text-white" : "text-zinc-400"
                        )}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'qr' ? (
                        /* QR CODE VIEW */
                        <motion.div
                            key="qr-view"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            className="flex flex-col items-center justify-center py-10"
                        >
                            <div 
                                id="demo-qr-container"
                                className="p-8 bg-white rounded-[2rem] shadow-2xl shadow-white/5 relative group"
                            >
                                <QrCode className="w-32 h-32 text-black" strokeWidth={1.5} />
                                <motion.div 
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-0.5 bg-red-500/50 shadow-[0_0_10px_red]"
                                />
                            </div>
                            <p className="mt-8 text-zinc-400 font-mono text-[10px] uppercase tracking-[0.2em] animate-pulse">
                                Initializing Secure Link...
                            </p>
                        </motion.div>
                    ) : (
                        /* POLLS VIEW */
                        <motion.div
                            key="polls-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <DemoPollCard 
                                id="demo-p1" 
                                title="Select Next Track" 
                                votedIndex={movieState.poll1} 
                                options={[
                                    { name: "Unreleased Single", percent: 45 }, 
                                    { name: "Acoustic Solo", percent: 35 }
                                ]} 
                            />
                            <DemoPollCard 
                                id="demo-p2" 
                                title="Light Show Color" 
                                votedIndex={movieState.poll2} 
                                options={[
                                    { name: "Neon Blue", percent: 60 }, 
                                    { name: "Laser Crimson", percent: 40 }
                                ]} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

const Landing = () => {
    const navigate = useNavigate();
    const [showDemo, setShowDemo] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden flex flex-col relative font-sans">
            <MouseGradient />
            <GridPattern />

            <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-md bg-black/10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl">V</div>
                    <span className="font-bold tracking-tighter text-lg">VoteFore</span>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    {isLoggedIn ? (
                        <button 
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition-all"
                        >
                            <User className="w-5 h-5 text-zinc-300" />
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate('/sign-in')} 
                            className="px-6 py-2.5 text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all"
                        >
                            Sign In
                        </button>
                    )}
                </motion.div>
            </nav>

            <main className="container mx-auto px-6 relative z-10 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            Next-Gen Event Tech
                        </motion.div>
                        
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]">
                            <AnimatedText text="Empower Every" className="text-zinc-600 justify-center lg:justify-start" delay={0.1} />
                            <AnimatedText text="Voice." className="text-white justify-center lg:justify-start" delay={0.3} />
                        </h1>

                        <motion.p 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            transition={{ delay: 0.8 }} 
                            className="text-lg text-zinc-500 mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed font-light"
                        >
                            Transform passive spectators into active participants. VoteFore bridges the gap between the stage and the seats with lightning-fast interactive polling.
                        </motion.p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button 
                                onClick={() => navigate(isLoggedIn ? '/generate' : '/sign-in')} 
                                className="group px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                            >
                                Start Live Poll
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => setShowDemo(true)} 
                                className="px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-zinc-300 rounded-full font-bold transition-all"
                            >
                                See Demo
                            </button>
                        </div>
                        
                        <div className="mt-20 flex gap-8 justify-center lg:justify-start border-t border-white/5 pt-10">
                            <MinimalFeature icon={Radio} title="Instant" delay={1.0} />
                            <MinimalFeature icon={Users} title="Scalable" delay={1.1} />
                            <MinimalFeature icon={Zap} title="Live" delay={1.2} />
                        </div>
                    </div>

                    <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            <motion.img
                                src={CONCERT_IMAGES[0]}
                                alt="Crowd"
                                className="absolute top-0 right-0 w-64 h-64 object-cover rounded-3xl opacity-40 blur-[1px] -rotate-12"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.img
                                src={CONCERT_IMAGES[1]}
                                alt="Stage"
                                className="absolute bottom-10 left-0 w-64 h-64 object-cover rounded-3xl opacity-40 blur-[1px] rotate-12"
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5 }}
                                className="absolute left-10 bottom-24 z-30 bg-white text-black p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 -rotate-6"
                            >
                                <QrCode className="w-10 h-10" />
                                <span className="font-mono text-[8px] uppercase font-black">Scan to Join</span>
                            </motion.div>
                        </div>

                        <VotingCard />
                    </div>
                </div>  
            </main>

            <AnimatePresence>
                {showDemo && <LiveDemoModal onClose={() => setShowDemo(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default Landing;