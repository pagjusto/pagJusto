import React from 'react';
import { logoBase64 } from '../assets/logo';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export const Header: React.FC = () => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="text-center py-8 sm:py-12">
             <div className="absolute top-4 right-4">
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
                src={logoBase64} 
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