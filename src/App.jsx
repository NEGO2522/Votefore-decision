import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Sign from './components/Sign';
import Profile from './pages/Profile'; 
import PrivacyPolicy from './components/Privacy_Policy';
import ContactUs from './components/ContactUs';
import Generate from './pages/Generate';
import AdminPoll from './pages/AdminPoll'; // Import the AdminPoll component

const FinishSignIn = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <p className="animate-pulse font-mono tracking-widest">VERIFYING AUTHENTICATION...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<Sign />} />
        
        {/* User & Generation Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/generate" element={<Generate />} />
        
        {/* Admin Control Route */}
        <Route path="/admin/poll" element={<AdminPoll />} />
        
        {/* Support & Legal */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Auth Callback */}
        <Route path="/finish-sign-in" element={<FinishSignIn />} />

        {/* 404 Catch-all */}
        <Route path="*" element={
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <h1 className="text-2xl font-light tracking-tighter">404 | Page Not Found</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;