import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Send, Mail, Phone, 
    Instagram, Twitter, Linkedin, Youtube 
} from 'lucide-react';

const ContactUs = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => setStatus('success'), 1500);
    };

    // Correct Embed URL for Rambagh, Jaipur (Standard public link)
    const mapLocationSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.455792942738!2d75.80556207616147!3d26.88900656133486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db60010000001%3A0x6d85949d0124f2f5!2sRambagh%20Palace!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-sans relative overflow-x-hidden">
            {/* Background Aesthetics */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Fixed Header Navigation (Same as Profile.jsx) */}
            <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50">
                <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                        V
                    </div>
                    <span className="font-bold tracking-tighter text-xl">VoteFore</span>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            </nav>

            <main className="relative z-10 container mx-auto px-6 pt-32 pb-20">
                <header className="max-w-4xl mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-7xl md:text-8xl font-bold tracking-tighter leading-none"
                    >
                        Get in <span className="text-zinc-600">Touch.</span>
                    </motion.h1>
                </header>

                <div className="grid lg:grid-cols-12 gap-12 items-stretch">
                    
                    {/* Column 1: Contact & Socials */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3 space-y-12"
                    >
                        <section className="space-y-6">
                            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">Essentials</h3>
                            <div className="space-y-4">
                                <a href="mailto:hello@votefore.live" className="group flex items-center gap-4 text-zinc-300 hover:text-white transition-colors">
                                    <Mail className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-lg font-light">hello@votefore.live</span>
                                </a>
                                <a href="tel:+911412385700" className="group flex items-center gap-4 text-zinc-300 hover:text-white transition-colors">
                                    <Phone className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-lg font-light">+91 141 238 5700</span>
                                </a>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">Social Stage</h3>
                            <div className="flex gap-4">
                                {[Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 hover:-translate-y-1">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    </motion.div>

                    {/* Column 2: Minimal Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-4"
                    >
                        <form 
                            onSubmit={handleSubmit}
                            className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] space-y-8 h-full shadow-2xl"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 ml-1">Full Name</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-xl focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 ml-1">Email</label>
                                <input 
                                    type="email" required
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-xl focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 ml-1">Message</label>
                                <textarea 
                                    required rows="4"
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-xl focus:outline-none focus:border-white transition-colors resize-none placeholder:text-zinc-800"
                                    placeholder="Tell us about the project"
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                disabled={status !== 'idle'}
                                className="group w-full py-6 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.95] disabled:opacity-50"
                            >
                                <span className="relative z-10 text-xs uppercase tracking-[0.2em]">
                                    {status === 'idle' ? 'Send Message' : status === 'sending' ? 'Dispatching...' : 'Sent Successfully'}
                                </span>
                                {status === 'idle' && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </button>
                        </form>
                    </motion.div>

                    {/* Column 3: Attractive Dark Map */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-5 min-h-[500px] rounded-[40px] overflow-hidden border border-white/5 relative group bg-zinc-900"
                    >
                        <iframe 
                            src={mapLocationSrc}
                            width="100%" 
                            height="100%" 
                            style={{ 
                                border: 0, 
                                filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(0.2)' 
                            }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Rambagh, Jaipur Location"
                            className="transition-all duration-700 group-hover:filter-none group-hover:grayscale-0"
                        ></iframe>
                        
                        {/* Interactive Floating Card */}
                        <div className="absolute bottom-6 left-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex justify-between items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Location</p>
                                <p className="text-sm font-semibold">Rambagh, Jaipur, Rajasthan</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                                <Send className="w-4 h-4 rotate-45" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ContactUs;