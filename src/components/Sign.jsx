import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Chrome, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth, googleProvider } from '../firebase'; 
import { sendSignInLinkToEmail, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const Sign = () => {
    const navigate = useNavigate(); // 2. Initialize navigate
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState({ type: '', text: '' });

    const actionCodeSettings = {
        // Point this to your "finish-sign-in" route
        url: window.location.origin + '/finish-sign-in', 
        handleCodeInApp: true,
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setInfo({ type: '', text: '' });

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            setInfo({ type: 'success', text: 'Check your inbox! We sent a login link.' });
            // Note: We don't navigate yet because the user must click the link in their email
        } catch (error) {
            setInfo({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            // 3. Navigate to landing on success
            navigate('/'); 
        } catch (error) {
            setInfo({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 flex items-center justify-center relative overflow-hidden">
            {/* ... (Rest of your UI code remains exactly the same) ... */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome back</h1>
                        <p className="text-zinc-500">Sign in to start controlling the stage.</p>
                    </div>

                    {info.text && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                                info.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}
                        >
                            {info.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            {info.text}
                        </motion.div>
                    )}

                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-zinc-600"
                                    placeholder="name@example.com"
                                />
                                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5 group-focus-within:text-white transition-colors" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : "Send Login Link"}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-zinc-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                        >
                            <Chrome className="w-4 h-4" />
                            Google
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Sign;