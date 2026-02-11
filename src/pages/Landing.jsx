import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, BarChart2, ShieldCheck, Zap, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

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
        style={{ marginTop: -5, marginLeft: -5 }} // Offset to align tip
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
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
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
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.8, duration: 1, type: "spring" }}
            className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-white/5 mx-auto"
        >
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping absolute inset-0 opacity-75"></div>
                        <div className="w-2 h-2 rounded-full bg-white relative"></div>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-[0.2em]">Live Poll</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">2m 14s LEFT</span>
            </div>

            <h3 className="text-2xl font-light text-white mb-8 leading-tight tracking-tight">
                Next feature to build?
            </h3>

            <div className="space-y-4">
                {[
                    { name: "Dark Mode 2.0", percent: 62 },
                    { name: "Collaborative Lists", percent: 28 },
                    { name: "API Access", percent: 10 }
                ].map((option, i) => (
                    <motion.button
                        key={i}
                        className="w-full relative overflow-hidden rounded-xl group"
                        onClick={() => setVoted(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Progress Bar Background */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={voted ? { width: `${option.percent}%` } : { width: "0%" }}
                            transition={{ duration: 1.5, delay: 0.1, ease: "circOut" }}
                            className="absolute top-0 left-0 h-full bg-white/10"
                        />

                        <div className="relative p-4 flex justify-between items-center z-10 border border-white/5 rounded-xl group-hover:border-white/20 transition-all bg-black/20">
                            <span className="font-light text-zinc-300 group-hover:text-white transition-colors">{option.name}</span>
                            {voted ? (
                                <motion.span
                                    initial={{ opacity: 0, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                    className="font-mono text-sm text-white"
                                >
                                    {option.percent}%
                                </motion.span>
                            ) : (
                                <div className="w-4 h-4 rounded-full border border-zinc-600 group-hover:border-white group-hover:scale-110 transition-all" />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>1,240 VOTES</span>
                <span>VERIFIED ON-CHAIN</span>
            </div>
        </motion.div>
    );
};

const MinimalFeature = ({ icon: Icon, title, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
    // Internal separate jitter state for liveliness
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
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-zinc-500 font-mono">LIVE</span>
                </div>
            </div>
            <div className="space-y-3">
                {options.map((opt, i) => {
                    const isVoted = votedIndex === i;
                    // Calculate display percent (base + jitter, boosted if voted)
                    let percent = opt.percent + jitter[i];
                    if (isVoted) percent += 15; // Simulate vote bump
                    percent = Math.min(100, Math.max(0, percent));

                    return (
                        <div
                            id={`${id}-opt-${i}`} // ID for cursor targeting
                            key={i}
                            className={cn(
                                "relative h-10 rounded-lg overflow-hidden transition-all duration-300 border",
                                isVoted ? "border-white/20 bg-white/5" : "border-transparent bg-zinc-800/50"
                            )}
                        >
                            {/* Progress Bar */}
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

                            {/* Checkmark for voted state */}
                            {isVoted && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center"
                                >
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const LiveDemoModal = ({ onClose }) => {
    const [cursor, setCursor] = useState({ x: -50, y: -50 }); // Start off-screen
    const [isClicking, setIsClicking] = useState(false);
    const [movieState, setMovieState] = useState({
        poll1: -1, // -1 = none voted
        poll2: -1
    });

    // The "Script" for the video
    useEffect(() => {
        const runScript = async () => {
            const wait = (ms) => new Promise(res => setTimeout(res, ms));

            // Helper to move cursor to element
            const moveTo = (elementId) => {
                const el = document.getElementById(elementId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // Aim for center-ish
                    setCursor({
                        x: rect.left + rect.width * 0.7,
                        y: rect.top + rect.height * 0.5
                    });
                }
            };

            await wait(800);

            // 1. Target first poll, first option
            moveTo("demo-p1-opt-0"); // Mobile App Redesign
            await wait(1000); // Travel time

            // 2. Click
            setIsClicking(true);
            await wait(150);
            setMovieState(s => ({ ...s, poll1: 0 })); // Update state mid-click
            await wait(150);
            setIsClicking(false);

            await wait(800); // Admire the vote

            // 3. Target second poll, second option
            moveTo("demo-p2-opt-1"); // Kyoto
            await wait(1000);

            // 4. Click
            setIsClicking(true);
            await wait(150);
            setMovieState(s => ({ ...s, poll2: 1 }));
            await wait(150);
            setIsClicking(false);

            await wait(1200);
            // 5. Move to close? Or just idle. 
            // Let's drift away
            setCursor({ x: window.innerWidth * 0.8, y: window.innerHeight * 0.8 });

            // Close the modal after a short delay
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 tracking-tight">Live Session</h2>
                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Connected to wss://v1.vote.fore
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-600 hover:text-white transition-colors">✕</button>
                </div>

                <div className="grid gap-6">
                    <DemoPollCard
                        id="demo-p1"
                        title="Q3 Roadmap Priority"
                        votedIndex={movieState.poll1}
                        options={[
                            { name: "Mobile App Redesign", percent: 35 },
                            { name: "API Integration", percent: 30 },
                            { name: "User Analytics", percent: 35 }
                        ]}
                    />
                    <DemoPollCard
                        id="demo-p2"
                        title="Team Offsite Location"
                        votedIndex={movieState.poll2}
                        options={[
                            { name: "Bali, Indonesia", percent: 45 },
                            { name: "Kyoto, Japan", percent: 40 },
                            { name: "Lisbon, Portugal", percent: 15 }
                        ]}
                    />
                </div>

                <div className="mt-8 text-center">
                    <p className="text-zinc-600 text-sm font-mono animate-pulse">Waiting for admin...</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Landing = ({ onSignIn }) => {
    const { scrollYProgress } = useScroll();
    const [showDemo, setShowDemo] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-hidden flex flex-col relative font-sans">
            <MouseGradient />
            <GridPattern />

            {/* Header */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-30">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-sm">V</div>
                    <span className="font-bold tracking-tight text-sm">VoteFore</span>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onSignIn}
                    className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-800 rounded-full"
                >
                    Sign In
                </motion.button>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col justify-center">

                <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

                    {/* Left Text Content */}
                    <div className="text-center lg:text-left pt-20 lg:pt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-zinc-400 text-xs font-medium mb-10 backdrop-blur-md"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Future of Consensus
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                            <AnimatedText text="Decide" className="text-zinc-500 justify-center lg:justify-start" delay={0.1} />
                            <AnimatedText text="Together." className="text-white justify-center lg:justify-start" delay={0.2} />
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, filter: "blur(5px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="text-lg text-zinc-500 mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed font-light"
                        >
                            Minimalist, real-time voting for teams that move fast.
                            No clutter, just results.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <button className="group px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                                Start Voting
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => setShowDemo(true)}
                                className="px-8 py-4 bg-transparent border border-zinc-800 hover:bg-white/5 text-zinc-300 rounded-full font-medium transition-all"
                            >
                                Live Demo
                            </button>
                        </motion.div>

                        {/* Quick Stats / Trust */}
                        <div className="mt-20 flex gap-12 justify-center lg:justify-start border-t border-white/5 pt-10">
                            <MinimalFeature icon={Zap} title="Real-time" delay={1.0} />
                            <MinimalFeature icon={ShieldCheck} title="Verified" delay={1.1} />
                            <MinimalFeature icon={Globe} title="Global" delay={1.2} />
                        </div>
                    </div>

                    {/* Right Visual Content */}
                    <div className="relative perspective-1000 h-[500px] flex items-center justify-center">
                        {/* Abstract Glow Behind Card */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-tr from-zinc-800/30 to-zinc-500/10 rounded-full blur-[80px]"
                        />

                        <VotingCard />

                        {/* Minimal floating elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-10 md:right-0 w-20 h-20 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center z-0"
                        >
                            <BarChart2 className="text-zinc-500 w-8 h-8" />
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Modals */}
            {showDemo && <LiveDemoModal onClose={() => setShowDemo(false)} />}
        </div>
    );
};
export default Landing;
