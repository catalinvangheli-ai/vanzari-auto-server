import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VanzariAuto from './pages/VanzariAuto';
import InchirieriAuto from './pages/InchirieriAuto';
import Login from './pages/Login';
import Register from './pages/Register';
import AdaugaAnuntNou from './pages/AdaugaAnuntNou';
import AnunturileMele from './pages/AnunturileMele';
import Profil from './pages/Profil';
import Chat from './pages/Chat';
import ChatConversation from './pages/ChatConversation';
import AnuntDetaliu from './pages/AnuntDetaliu';
import ResetPassword from './pages/ResetPassword';
import Admin from './pages/Admin';
import { App as CapacitorApp } from '@capacitor/app';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';

// Redirect /open/:type/:id → /anunt/:type/:id (fallback când backend-ul nu e încă deploy-at)
function OpenRedirect() {
  const { type, id } = useParams();
  return <Navigate to={`/anunt/${type}/${id}`} replace />;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authLoading } = useAuth();
  
  // Ascunde Navbar pe pagina de detalii anunț
  const hideNavbar = location.pathname.startsWith('/anunt/');

  // Deep link handler: când app-ul e deschis printr-un URL extern (App Links sau schema custom)
  useEffect(() => {
    const handleAppUrlOpen = (event) => {
      const url = event.url;
      if (!url) return;
      try {
        const parsed = new URL(url);
        let path;
        if (parsed.protocol === 'carxsell:') {
          // Schema custom: carxsell://anunt/vanzari/ID
          // parsed.hostname = 'anunt', parsed.pathname = '/vanzari/ID'
          path = '/' + parsed.hostname + parsed.pathname + parsed.search + parsed.hash;
        } else {
          // HTTPS App Link: https://carxsell-production-.../anunt/vanzari/ID
          path = parsed.pathname + parsed.search + parsed.hash;
        }
        if (path && path !== '/') {
          navigate(path, { replace: true });
        }
      } catch (e) {
        console.error('Deep link URL invalid:', e);
      }
    };

    let listenerHandle;
    CapacitorApp.addListener('appUrlOpen', handleAppUrlOpen).then(handle => {
      listenerHandle = handle;
    });

    return () => {
      listenerHandle?.remove();
    };
  }, [navigate]);

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#64748b', fontSize: 14 }}>Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vanzari" element={<VanzariAuto />} />
          <Route path="/inchirieri" element={<InchirieriAuto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/add-listing" element={<AdaugaAnuntNou />} />
          <Route path="/my-listings" element={<AnunturileMele />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/profil/:username" element={<Profil />} />
          <Route path="/anunt/:type/:id" element={<AnuntDetaliu />} />
          <Route path="/open/:type/:id" element={<OpenRedirect />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat-conversation" element={<ChatConversation />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
