
import React from 'react';
import type { CalculationResult } from '../types';
import { Card } from './Card';
import { formatCurrency, formatPercentage } from '../services/formatters';

interface ResultsDisplayProps {
  result: CalculationResult | null;
  isLoading: boolean;
  onSendToWhatsApp: () => void;
}

const ResultRow: React.FC<{ label: string; userValue: string; marketValue: string }> = ({ label, userValue, marketValue }) => (
    <div className="grid grid-cols-3 gap-2 py-3 border-b border-gray-200 items-center">
        <div className="font-medium text-gray-600">{label}</div>
        <div className="text-right font-semibold text-brand-black">{userValue}</div>
        <div className="text-right font-semibold text-brand-black">{marketValue}</div>
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, onSendToWhatsApp }) => {
    if (isLoading) {
        return (
            <Card>
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <svg className="animate-spin mx-auto h-12 w-12 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg text-gray-700">Analisando seu financiamento...</p>
                    </div>
                </div>
            </Card>
        );
    }
    
    if (!result) {
        return (
            <Card>
                <div className="flex justify-center items-center h-96">
                    <div className="text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mt-4 text-lg font-medium">Os resultados da sua análise aparecerão aqui.</p>
                        <p className="text-sm">Preencha os dados e clique em "Calcular Juros".</p>
                    </div>
                </div>
            </Card>
        );
    }

    const isAbusive = result.userRate > result.abusiveThresholdRate;
    const rateDifference = Math.abs(result.userRate - result.marketRate);
    const totalDifference = Math.abs(result.userTotal - result.marketTotal);

    return (
        <Card>
            <h2 className="text-2xl font-bold text-brand-black mb-6">
                Resultado da Análise
            </h2>
            
            {isAbusive ? (
                 <div className="bg-red-50 border-l-4 border-danger text-danger p-4 mb-6 rounded-r-lg" role="alert">
                    <p className="font-bold">Alerta: Indícios de Juros Abusivos!</p>
                    <p>Sua taxa de <strong>{formatPercentage(result.userRate)}</strong> está acima do teto considerado para a época (<strong>{formatPercentage(result.abusiveThresholdRate)}</strong>), que é 1.5x a média de mercado. Isso pode indicar abusividade.</p>
                </div>
            ) : (
                <div className="bg-green-50 border-l-4 border-success text-success p-4 mb-6 rounded-r-lg" role="alert">
                    <p className="font-bold">Análise Preliminar Positiva</p>
                    <p>Sua taxa de juros parece estar alinhada com a média de mercado do período.</p>
                </div>
            )}
            
            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 pb-2 border-b-2 border-gray-300">
                    <div className="font-bold">Critério</div>
                    <div className="text-right font-bold">Seu Contrato</div>
                    <div className="text-right font-bold">Média de Mercado</div>
                </div>
                <ResultRow 
                    label="Taxa de Juros Mensal"
                    userValue={formatPercentage(result.userRate)}
                    marketValue={formatPercentage(result.marketRate)}
                />
                 <ResultRow 
                    label="Valor da Parcela"
                    userValue={formatCurrency(result.userInstallment)}
                    marketValue={formatCurrency(result.marketInstallment)}
                />
                 <ResultRow 
                    label="Custo Total do Financiamento"
                    userValue={formatCurrency(result.userTotal)}
                    marketValue={formatCurrency(result.marketTotal)}
                />
            </div>

             <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                <p className="font-bold text-lg text-brand-black">
                    Diferença Total: Você pode estar pagando <span className="text-success font-extrabold">{formatCurrency(totalDifference)}</span> a mais.
                </p>
                <p className="text-sm text-gray-600">
                    Sua taxa de juros está {formatPercentage(rateDifference)} acima da média.
                </p>
            </div>
            
            <p className="text-center text-gray-600 mt-8 mb-4">
                Gostaria de uma análise gratuita e sem compromisso do seu contrato por um de nossos especialistas?
            </p>

            <button
                onClick={onSendToWhatsApp}
                className="w-full flex justify-center items-center bg-brand-green hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
                aria-label="Enviar análise para um especialista via WhatsApp"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.398 1.919 6.321l-.306 1.113 1.127-.297z"/></svg>
                Enviar Análise via WhatsApp
            </button>
        </Card>
    );
};
