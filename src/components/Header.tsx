import React from 'react';
import { logoBase64 } from '../assets/logo';

export const Header: React.FC = () => {
    return (
        <header className="text-center py-8 sm:py-12">
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