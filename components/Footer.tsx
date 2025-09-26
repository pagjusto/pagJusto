import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-center text-sm text-white/80 mt-auto">
            <p>
                <strong>Aviso Legal:</strong> Esta calculadora é uma ferramenta de simulação e seus resultados são apenas para fins informativos.
                Os cálculos são baseados nos dados fornecidos pelo usuário e nas taxas médias de juros para aquisição de veículos (pessoa física) divulgadas pelo Banco Central do Brasil (Série 25471).
                A análise de abusividade de juros em um contrato real requer avaliação jurídica especializada.
            </p>
            <p className="mt-2 opacity-60">
                Desenvolvido com React, TypeScript e Tailwind CSS.
            </p>
        </footer>
    );
};