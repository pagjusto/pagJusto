import React, { useState } from 'react';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { IntroSection } from '@/components/IntroSection';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { CalculationResult } from '@/types';
import type { CalculatorFormData } from '@/services/validation';
import { calculateMonthlyRate, calculateMonthlyPayment } from '@/services/financial';
import { getMarketRate } from '@/services/interestRateData';

export default function Home(): React.ReactElement {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestFormData, setLatestFormData] = useState<CalculatorFormData | null>(null);

  const handleCalculate = (data: CalculatorFormData): void => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setLatestFormData(null);

    // Using setTimeout to simulate an async calculation and show loading state
    setTimeout(() => {
      try {
        const { financingMonth, financingYear, financedAmount, downPayment, installmentAmount, installments } = data;

        const financingDate = `${financingYear}-${financingMonth}`;
        const principal = financedAmount - downPayment;
        
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

  return (
    <div className="min-h-screen flex flex-col items-center text-brand-black">
      <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 relative">
        <Header />
        <IntroSection />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <CalculatorForm onCalculate={handleCalculate} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-3">
             {error && (
              <Card className="mb-6 border-danger bg-red-50 text-danger">
                <CardContent className="p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-6 w-6 mr-3" />
                        <div>
                            <strong className="font-bold">Erro ao calcular:</strong>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            )}
            <ResultsDisplay result={result} isLoading={isLoading} formData={latestFormData} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}