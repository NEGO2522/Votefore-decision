import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowRight, BarChart2, ShieldCheck, Zap, Globe, QrCode, Music, Users, Radio } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Updated with vibrant, high-energy concert imagery
const CONCERT_IMAGES = [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80", // Energetic crowd
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80", // Stage lights/performer
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80"  
];

// --- Components ---

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
            x: { duration: 0.8, ease: "easeInOut" },
            y: { duration: 0.8, ease: "easeInOut" },
            scale: { duration: 0.1 },
            opacity: { duration: 0.5 }
        }}
        className="fixed top-0 left-0 w-6 h-6 z-[60] pointer-events-none"
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
                    x: useSpring(mouseX, { stiffness: 50, damping: 20 }),
                    y: useSpring(mouseY, { stiffness: 50, damping: 20 }),
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
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: delay * i },
        }),
    };
    const child = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
    };

    return (
        <motion.div
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {words.map((word, index) => (
                <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

const VotingCard = () => {
    const [voted, setVoted] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1, type: "spring" }}
            className="relative z-20 w-full max-w-md bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-white/5 mx-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute inset-0 opacity-75"></div>
                        <div className="w-2 h-2 rounded-full bg-red-500 relative"></div>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-[0.2em]">Live on Stage</span>
                </div>
                <span className="text-xs font-mono text-zinc-500 italic uppercase">Syncing...</span>
            </div>

            <h3 className="text-2xl font-light text-white mb-8 leading-tight tracking-tight">
                Which anthem should the crowd hear next?
            </h3>

            <div className="space-y-4">
                {[
                    { name: "Midnight Echoes", percent: 58 },
                    { name: "Thunder in the Valley", percent: 32 },
                    { name: "Neon Dreams", percent: 10 }
                ].map((option, i) => (
                    <motion.button
                        key={i}
                        className="w-full relative overflow-hidden rounded-xl group"
                        onClick={() => setVoted(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={voted ? { width: `${option.percent}%` } : { width: "0%" }}
                            transition={{ duration: 1.5, delay: 0.1, ease: "circOut" }}
                            className="absolute top-0 left-0 h-full bg-white/10"
                        />
                        <div className="relative p-4 flex justify-between items-center z-10 border border-white/5 rounded-xl group-hover:border-white/20 transition-all bg-black/20">
                            <span className="font-light text-zinc-300 group-hover:text-white transition-colors">{option.name}</span>
                            {voted ? (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm text-white">
                                    {option.percent}%
                                </motion.span>
                            ) : (
                                <Music className="w-4 h-4 text-zinc-600 group-hover:text-white transition-all" />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>8.4K FANS VOTING</span>
                <span className="text-white/40">SETLIST V2.4</span>
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
            <Icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
        </div>
        <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">{title}</span>
    </motion.div>
);

const DemoPollCard = ({ id, title, options, votedIndex }) => {
    const [jitter, setJitter] = useState(options.map(() => 0));
    useEffect(() => {
        const interval = setInterval(() => {
            setJitter(prev => prev.map(() => Math.random() * 2 - 1));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 mb-4 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-light tracking-wide">{title}</h4>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs text-zinc-500 font-mono">LIVE</span>
                </div>
            </div>
            <div className="space-y-3">
                {options.map((opt, i) => {
                    const isVoted = votedIndex === i;
                    let percent = opt.percent + jitter[i];
                    if (isVoted) percent += 15;
                    percent = Math.min(100, Math.max(0, percent));
                    return (
                        <div
                            id={`${id}-opt-${i}`}
                            key={i}
                            className={cn(
                                "relative h-10 rounded-lg overflow-hidden transition-all duration-300 border",
                                isVoted ? "border-white/20 bg-white/5" : "border-transparent bg-zinc-800/50"
                            )}
                        >
                            <motion.div
                                className={cn("absolute top-0 left-0 h-full", isVoted ? "bg-white/20" : "bg-white/5")}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-4 text-sm pointer-events-none">
                                <span className={cn("transition-colors", isVoted ? "text-white font-medium" : "text-zinc-400")}>
                                    {opt.name}
                                </span>
                                <span className="text-zinc-500 font-mono text-xs">{percent.toFixed(1)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const LiveDemoModal = ({ onClose }) => {
    const [cursor, setCursor] = useState({ x: -50, y: -50 });
    const [isClicking, setIsClicking] = useState(false);
    const [movieState, setMovieState] = useState({ poll1: -1, poll2: -1 });

    useEffect(() => {
        const runScript = async () => {
            const wait = (ms) => new Promise(res => setTimeout(res, ms));
            const moveTo = (elementId) => {
                const el = document.getElementById(elementId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    setCursor({ x: rect.left + rect.width * 0.7, y: rect.top + rect.height * 0.5 });
                }
            };
            await wait(800);
            moveTo("demo-p1-opt-0");
            await wait(1000);
            setIsClicking(true);
            await wait(150);
            setMovieState(s => ({ ...s, poll1: 0 }));
            await wait(150);
            setIsClicking(false);
            await wait(800);
            moveTo("demo-p2-opt-1");
            await wait(1000);
            setIsClicking(true);
            await wait(150);
            setMovieState(s => ({ ...s, poll2: 1 }));
            await wait(150);
            setIsClicking(false);
            await wait(1200);
            setCursor({ x: window.innerWidth * 0.8, y: window.innerHeight * 0.8 });
            await wait(2000);
            onClose();
        };
        runScript();
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
            onClick={onClose}
        >
            <Cursor x={cursor.x} y={cursor.y} isClicking={isClicking} />
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-xl bg-black border border-white/10 rounded-3xl p-8 relative shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 tracking-tight">Stage Feed</h2>
                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Live Interaction Enabled
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-600 hover:text-white transition-colors">✕</button>
                </div>
                <div className="grid gap-6">
                    <DemoPollCard id="demo-p1" title="Select Next Track" votedIndex={movieState.poll1} options={[{ name: "Unreleased Single", percent: 35 }, { name: "Classic Throwback", percent: 30 }, { name: "Acoustic Solo", percent: 35 }]} />
                    <DemoPollCard id="demo-p2" title="Light Show Color" votedIndex={movieState.poll2} options={[{ name: "Neon Blue", percent: 45 }, { name: "Laser Crimson", percent: 40 }, { name: "Golden Glow", percent: 15 }]} />
                </div>
            </motion.div>
        </motion.div>
    );
};

const Landing = () => {
    const navigate = useNavigate();
    const [showDemo, setShowDemo] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden flex flex-col relative font-sans">
            <MouseGradient />
            <GridPattern />

            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-30">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-sm">V</div>
                    <span className="font-bold tracking-tight text-sm">VoteFore</span>
                </motion.div>
                <motion.button 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    onClick={() => navigate('/sign-in')} 
                    className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-800 rounded-full"
                >
                    Sign In
                </motion.button>
            </nav>

            <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col justify-center">
                <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                    <div className="text-center lg:text-left pt-20 lg:pt-0">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-zinc-400 text-xs font-medium mb-10 backdrop-blur-md"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            Live Crowd Control
                        </motion.div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                            <AnimatedText text="The Crowd" className="text-zinc-500 justify-center lg:justify-start" delay={0.1} />
                            <AnimatedText text="Decides." className="text-white justify-center lg:justify-start" delay={0.2} />
                        </h1>
                        <motion.p 
                            initial={{ opacity: 0, filter: "blur(5px)" }} 
                            animate={{ opacity: 1, filter: "blur(0px)" }} 
                            transition={{ delay: 0.6, duration: 1 }} 
                            className="text-lg text-zinc-500 mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed font-light"
                        >
                            Give your audience a voice. Let the stadium vote on the next track, the light show, or the encore—all in real-time.
                        </motion.p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button 
                                onClick={() => navigate('/sign-in')} 
                                className="group px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                            >
                                Start Live Poll
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => setShowDemo(true)} 
                                className="px-8 py-4 bg-transparent border border-zinc-800 hover:bg-white/5 text-zinc-300 rounded-full font-medium transition-all"
                            >
                                See Interaction
                            </button>
                        </div>
                        <div className="mt-20 flex gap-8 md:gap-12 justify-center lg:justify-start border-t border-white/5 pt-10">
                            <MinimalFeature icon={Radio} title="Instant Sync" delay={0.8} />
                            <MinimalFeature icon={Users} title="Massive Scale" delay={0.9} />
                            <MinimalFeature icon={Zap} title="No Latency" delay={1.0} />
                        </div>
                    </div>

                    <div className="relative h-[600px] w-full flex items-center justify-center">
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            {/* Updated Top Image: More color, less blur */}
                            <motion.img
                                src={CONCERT_IMAGES[0]}
                                alt="Crowd"
                                className="absolute top-[-20px] right-[-10px] w-72 h-72 object-cover rounded-3xl opacity-60 saturate-150 contrast-125 blur-[0.5px] -rotate-6 shadow-2xl"
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            {/* Updated Bottom Image: High contrast, cinematic */}
                            <motion.img
                                src={CONCERT_IMAGES[1]}
                                alt="Stage"
                                className="absolute bottom-5 left-[-20px] w-64 h-64 object-cover rounded-3xl opacity-50 saturate-125 contrast-125 blur-[0.5px] rotate-6 shadow-2xl"
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                            
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ 
                                    opacity: 1, 
                                    x: 0,
                                    y: [0, -10, 0],
                                    rotate: [-12, -8, -12] 
                                }}
                                transition={{ 
                                    opacity: { delay: 1.2, duration: 1 },
                                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute left-[-10px] bottom-32 z-30 bg-white text-black p-5 rounded-3xl shadow-2xl flex flex-col items-center gap-2"
                            >
                                <QrCode className="w-12 h-12" />
                                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Scan to Vote</span>
                            </motion.div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />
                        </div>

                        <VotingCard />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showDemo && <LiveDemoModal onClose={() => setShowDemo(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default Landing;