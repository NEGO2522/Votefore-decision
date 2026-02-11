import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Eye,
            title: "Data Collection",
            content: "We collect minimal data required for real-time interaction. This includes temporary session identifiers and your voting preferences to ensure poll integrity."
        },
        {
            icon: Lock,
            title: "Security",
            content: "Your connection to VoteFore is encrypted. We do not store personal identifiable information (PII) for general audience members participating in live polls."
        },
        {
            icon: ShieldCheck,
            title: "Third Parties",
            content: "We never sell your data. We use industry-standard infrastructure providers to host our real-time syncing engines, all of which are SOC2 compliant."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

            <nav className="relative z-20 p-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs mb-6">
                        <ShieldCheck className="w-3 h-3" />
                        Effective February 2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-400 text-lg font-light leading-relaxed">
                        At VoteFore, we believe privacy is a fundamental right. We’ve designed our 
                        real-time voting platform to be as anonymous and secure as possible.
                    </p>
                </motion.div>

                <div className="grid gap-12">
                    {sections.map((section, index) => (
                        <motion.section 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col md:flex-row gap-6 border-t border-white/5 pt-12"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <section.icon className="w-6 h-6 text-zinc-300" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-medium mb-3">{section.title}</h2>
                                <p className="text-zinc-500 leading-relaxed font-light">
                                    {section.content}
                                </p>
                            </div>
                        </motion.section>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm"
                >
                    <h3 className="flex items-center gap-2 text-white font-medium mb-4">
                        <FileText className="w-5 h-5" />
                        Compliance & Cookies
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed italic">
                        We use strictly necessary cookies to keep your session active during a live event. 
                        By using the platform, you agree to this minimal data processing. For specific 
                        GDPR/CCPA requests, contact our privacy officer at <span className="text-white underline cursor-pointer">privacy@votefore.live</span>.
                    </p>
                </motion.div>

                <footer className="mt-24 pb-12 text-center text-zinc-600 text-xs font-mono tracking-widest uppercase">
                    &copy; 2026 VoteFore Systems Inc.
                </footer>
            </main>
        </div>
    );
};

export default PrivacyPolicy;