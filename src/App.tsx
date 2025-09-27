import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';
import Home from './pages/Home';
import Login from './pages/Login';
import type { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-green">
            <p className="text-white text-xl">Carregando...</p>
        </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!session ? <Login /> : <Navigate to="/" state={{ from: location }} replace />} 
      />
      <Route 
        path="/" 
        element={session ? <Home /> : <Navigate to="/login" state={{ from: location }} replace />} 
      />
    </Routes>
  );
};

export default App;