import React from 'react';
import type { CalculationResult } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { formatCurrency, formatPercentage } from '../services/formatters';
import { Loader2, FileText, MessageSquareWarning, BadgeCheck, BotMessageSquare } from 'lucide-react';

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
            <Card className="flex justify-center items-center h-96">
                <CardContent>
                    <div className="text-center">
                        <Loader2 className="mx-auto h-12 w-12 text-brand-green animate-spin" />
                        <p className="mt-4 text-lg text-gray-700">Analisando seu financiamento...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    if (!result) {
        return (
            <Card className="flex justify-center items-center h-96">
                <CardContent>
                    <div className="text-center text-gray-500">
                        <FileText className="mx-auto h-16 w-16 text-gray-300" strokeWidth={1} />
                        <p className="mt-4 text-lg font-medium">Os resultados da sua análise aparecerão aqui.</p>
                        <p className="text-sm">Preencha os dados e clique em "Calcular Juros".</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const isAbusive = result.userRate > result.abusiveThresholdRate;
    const rateDifference = Math.abs(result.userRate - result.marketRate);
    const totalDifference = Math.abs(result.userTotal - result.marketTotal);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resultado da Análise</CardTitle>
            </CardHeader>
            <CardContent>
                {isAbusive ? (
                    <div className="bg-red-50 border-l-4 border-danger text-danger p-4 mb-6 rounded-r-lg flex items-start" role="alert">
                        <MessageSquareWarning className="h-6 w-6 mr-3 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Alerta: Indícios de Juros Abusivos!</p>
                            <p>Sua taxa de <strong>{formatPercentage(result.userRate)}</strong> está acima do teto considerado para a época (<strong>{formatPercentage(result.abusiveThresholdRate)}</strong>), que é 1.5x a média de mercado.</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 border-l-4 border-success text-success p-4 mb-6 rounded-r-lg flex items-start" role="alert">
                        <BadgeCheck className="h-6 w-6 mr-3 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Análise Preliminar Positiva</p>
                            <p>Sua taxa de juros parece estar alinhada com a média de mercado do período.</p>
                        </div>
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

                <Button
                    onClick={onSendToWhatsApp}
                    className="w-full bg-brand-green hover:bg-green-800 text-white font-bold py-3 text-lg h-auto transition duration-300 ease-in-out"
                    aria-label="Enviar análise para um especialista via WhatsApp"
                >
                    <BotMessageSquare className="h-6 w-6 mr-2" />
                    Enviar Análise via WhatsApp
                </Button>
            </CardContent>
        </Card>
    );
};