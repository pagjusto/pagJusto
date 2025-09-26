
import React, { useState } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
// FIX: Import the 'Card' component.
import { Card } from './components/Card';
import type { FormData, CalculationResult } from './types';
import { calculateMonthlyRate, calculateMonthlyPayment } from './services/financial';
import { getMarketRate } from './services/interestRateData';
import { formatCurrency, formatPercentage } from './services/formatters';

export default function App(): React.ReactElement {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestFormData, setLatestFormData] = useState<FormData | null>(null);

  const handleCalculate = (data: FormData): void => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setLatestFormData(null);

    // Using setTimeout to simulate an async calculation and show loading state
    setTimeout(() => {
      try {
        const { financingDate, financedAmount, downPayment, installmentAmount, installments, fullName, whatsappNumber } = data;

        if (!financingDate || financedAmount <= 0 || downPayment < 0 || installmentAmount <= 0 || installments <= 0) {
          throw new Error("Por favor, preencha todos os campos com valores válidos.");
        }
        
        if (!fullName.trim() || !whatsappNumber.trim()) {
            throw new Error("Por favor, preencha seu nome completo e número de WhatsApp.");
        }
        
        const cleanWhatsAppNumber = whatsappNumber.replace(/\D/g, '');
        if (cleanWhatsAppNumber.length < 10) { // Basic validation for DDD + number
            throw new Error("Número de WhatsApp inválido. Forneça o número com DDD.");
        }

        const principal = financedAmount - downPayment;
        if (principal <= 0) {
            throw new Error("O valor financiado deve ser maior que o valor de entrada.");
        }
        
        if (installmentAmount * installments <= principal) {
          throw new Error("O valor total das parcelas é menor ou igual ao valor financiado. Isso implicaria em juros negativos ou zero, verifique os valores inseridos.");
        }

        const marketRate = getMarketRate(financingDate);
        if (marketRate === null) {
          throw new Error("Não foi possível encontrar a taxa de juros de mercado para a data selecionada. Verifique se a data está dentro do período disponível (jan/2019 em diante).");
        }

        const userMonthlyRate = calculateMonthlyRate(principal, installmentAmount, installments);
        if (isNaN(userMonthlyRate) || !isFinite(userMonthlyRate)) {
            throw new Error("Não foi possível calcular a taxa de juros. Verifique se os valores do financiamento estão corretos.");
        }

        const marketMonthlyPayment = calculateMonthlyPayment(principal, marketRate / 100, installments);
        const userTotalPaid = installmentAmount * installments + downPayment;
        const marketTotalPaid = marketMonthlyPayment * installments + downPayment;
        const abusiveThresholdRate = marketRate * 1.5;
        
        const calculationResult: CalculationResult = {
          userRate: userMonthlyRate * 100,
          marketRate,
          abusiveThresholdRate,
          userInstallment: installmentAmount,
          marketInstallment: marketMonthlyPayment,
          userTotal: userTotalPaid,
          marketTotal: marketTotalPaid,
        };

        setResult(calculationResult);
        setLatestFormData(data);

      } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Ocorreu um erro inesperado durante o cálculo.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSendToWhatsApp = (): void => {
    if (!result || !latestFormData) {
        setError("Não foi possível gerar a mensagem. Tente calcular novamente.");
        return;
    }
    
    const { fullName, whatsappNumber } = latestFormData;

    // --- WhatsApp Message Logic ---
    const isAbusive = result.userRate > result.abusiveThresholdRate;
    const rateDifference = result.userRate - result.marketRate;
    const totalDifference = result.userTotal - result.marketTotal;

    let message = `Olá! Meu nome é ${fullName}.\n\n`;
    message += `Usei a Calculadora de Juros Abusivos e gostaria de uma análise do meu financiamento. Seguem os detalhes que inseri:\n\n`;
    message += `*📊 COMPARATIVO GERADO PELA FERRAMENTA 📊*\n\n`;

    message += `🔹 *Meu Contrato*\n`;
    message += `   - Taxa de Juros: *${formatPercentage(result.userRate)}*\n`;
    message += `   - Valor da Parcela: *${formatCurrency(result.userInstallment)}*\n`;
    message += `   - Custo Total: *${formatCurrency(result.userTotal)}*\n\n`;

    message += `🔹 *Média de Mercado*\n`;
    message += `   - Taxa de Juros: *${formatPercentage(result.marketRate)}*\n`;
    message += `   - Valor da Parcela: *${formatCurrency(result.marketInstallment)}*\n`;
    message += `   - Custo Total: *${formatCurrency(result.marketTotal)}*\n\n`;

    message += `*💰 RESUMO DA DIFERENÇA 💰*\n`;
    message += `Minha taxa está *${formatPercentage(rateDifference)}* acima da média.\n`;
    message += `Posso estar pagando *${formatCurrency(totalDifference)}* a mais no total.\n\n`;
    
    if (isAbusive) {
        message += `A ferramenta indicou *ALERTA DE JUROS ABUSIVOS* para o meu caso (minha taxa de ${formatPercentage(result.userRate)} está acima do teto de ${formatPercentage(result.abusiveThresholdRate)}).\n\n`;
    }
    
    message += `Meu número de contato é: ${whatsappNumber}\n\n`;
    message += `Aguardo o contato de um especialista para uma análise gratuita. Obrigado!`;


    const encodedMessage = encodeURIComponent(message);
    const businessWhatsAppNumber = '4991759509';
    const whatsappUrl = `https://wa.me/55${businessWhatsAppNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank')?.focus();
  }


  return (
    <div className="min-h-screen flex flex-col items-center text-brand-black">
      <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
          <div className="lg:col-span-2">
            <CalculatorForm onCalculate={handleCalculate} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-3">
             {error && (
              <Card className="mb-6 border-2 border-red-300 bg-red-50">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-danger mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <strong className="font-bold text-danger">Erro ao calcular:</strong>
                        <p className="text-sm text-gray-700">{error}</p>
                    </div>
                </div>
              </Card>
            )}
            <ResultsDisplay result={result} isLoading={isLoading} onSendToWhatsApp={handleSendToWhatsApp} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
