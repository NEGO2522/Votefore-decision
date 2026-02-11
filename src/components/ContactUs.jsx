import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, MessageSquare, Mail, MapPin, Globe } from 'lucide-react';

const ContactUs = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // idle, sending, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans relative overflow-hidden">
            {/* Background Grid & Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

            <nav className="relative z-20 p-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group text-sm font-mono tracking-widest uppercase"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
                    
                    {/* Left Side: Copy */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div>
                            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
                                Let's sync <br />
                                <span className="text-zinc-500">the stage.</span>
                            </h1>
                            <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-md">
                                Planning a world tour or a local festival? Our team is ready to help you scale your audience interaction to 100k+ fans.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex items-center gap-4 text-zinc-300">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span>hello@votefore.live</span>
                            </div>
                            <div className="flex items-center gap-4 text-zinc-300">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <span>Available Worldwide</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <form 
                            onSubmit={handleSubmit}
                            className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl space-y-6"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-1">Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="Alex Chen"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-1">Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="alex@tour.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-1">Message</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
                                    placeholder="Tell us about your event..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                disabled={status !== 'idle'}
                                className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {status === 'idle' && (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                                {status === 'sending' && "Dispatching..."}
                                {status === 'success' && "Message Received"}
                            </button>

                            {status === 'success' && (
                                <motion.p 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="text-center text-xs text-green-500 font-mono uppercase tracking-tighter"
                                >
                                    We'll get back to you within 24 hours.
                                </motion.p>
                            )}
                        </form>

                        {/* Decorative accent */}
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-red-500/10 blur-3xl rounded-full -z-10"></div>
                    </motion.div>
                </div>

                <footer className="mt-24 text-center">
                    <div className="flex justify-center gap-8 mb-8 opacity-20 grayscale">
                        {/* Placeholder for "Trusted by" logos */}
                        <div className="font-bold text-2xl tracking-tighter italic">FESTIVAL X</div>
                        <div className="font-bold text-2xl tracking-tighter italic">STADIUM GO</div>
                        <div className="font-bold text-2xl tracking-tighter italic">AUDIO CORE</div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default ContactUs;