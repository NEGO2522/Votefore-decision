import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    User, 
    LogOut, 
    Mail, 
    Calendar, 
    ArrowLeft,
} from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const MouseGradient = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] mix-blend-overlay top-[-200px] left-[-200px]" />
    </div>
);

const GridPattern = () => (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
);

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/sign-in');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col relative font-sans">
            <MouseGradient />
            <GridPattern />

            {/* Header Navigation */}
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

            <main className="flex-1 flex items-center justify-center p-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl text-center">
                        
                        {/* Avatar Section */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                                <User className="w-10 h-10 text-zinc-400" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                            {user?.displayName || "Account Member"}
                        </h2>
                        
                        <div className="space-y-3 mb-10">
                            <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm font-mono">
                                <Mail className="w-4 h-4 text-zinc-700" />
                                {user?.email}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                                <Calendar className="w-4 h-4 text-zinc-700" />
                                Registered {new Date(user?.metadata.creationTime).getFullYear()}
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:invert transition-all flex items-center justify-center gap-2 group"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;