import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';

export const Header: React.FC = () => {
    const [logoSrc, setLogoSrc] = useState<string>('/logo.png');

    useEffect(() => {
        const handleStorageChange = () => {
            const customLogo = localStorage.getItem('customLogo');
            setLogoSrc(customLogo || '/logo.png');
        };

        handleStorageChange(); // Initial check
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="text-center py-8 sm:py-12">
             <div className="absolute top-4 right-4 flex items-center gap-2">
                <Button 
                    variant="ghost" 
                    asChild
                    className="text-white hover:bg-white/10 hover:text-white p-2 h-auto"
                    aria-label="Configurações"
                >
                    <Link to="/settings">
                        <SettingsIcon className="h-5 w-5" />
                    </Link>
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="text-white hover:bg-white/10 hover:text-white"
                    aria-label="Sair da conta"
                >
                    <LogOut className="h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Sair</span>
                </Button>
            </div>
            <img 
                src={logoSrc}
                alt="Pag Justo! Logo" 
                className="w-48 sm:w-56 mx-auto mb-6"
                aria-label="Pag Justo! Calculadora de Juros"
            />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Calculadora de Juros Abusivos
            </h1>
            <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto">
                Descubra se a taxa de juros do seu financiamento está acima da média do mercado e saiba quanto você poderia economizar.
            </p>
        </header>
    );
};