import React, { useState } from 'react';
import type { FormData } from '../types';
import { Card } from './Card';
import { InputField } from './InputField';

interface CalculatorFormProps {
  onCalculate: (data: FormData) => void;
  isLoading: boolean;
}

const initialFormState: FormData = {
    financingDate: '',
    financedAmount: 0,
    downPayment: 0,
    installmentAmount: 0,
    installments: 0,
    fullName: '',
    whatsappNumber: '',
};

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, isLoading }) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <Card>
        <h2 className="text-2xl font-bold text-brand-black mb-6">
            Calcule sua Economia
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="Seu Nome Completo"
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ex: João da Silva"
                required
            />
            <InputField
                label="Número de WhatsApp"
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="(11) 99999-8888"
                required
            />
             <InputField
                label="Data do Financiamento"
                id="financingDate"
                name="financingDate"
                type="date"
                value={formData.financingDate}
                onChange={handleChange}
                required
            />
            <InputField
                label="Valor do Financiamento (R$)"
                id="financedAmount"
                name="financedAmount"
                type="number"
                value={formData.financedAmount}
                onChange={handleChange}
                placeholder="Ex: 50000"
                min="0"
                step="100"
                required
            />
            <InputField
                label="Valor de Entrada (R$)"
                id="downPayment"
                name="downPayment"
                type="number"
                value={formData.downPayment}
                onChange={handleChange}
                placeholder="Ex: 10000"
                min="0"
                step="100"
            />
            <InputField
                label="Valor da Parcela (R$)"
                id="installmentAmount"
                name="installmentAmount"
                type="number"
                value={formData.installmentAmount}
                onChange={handleChange}
                placeholder="Ex: 1200"
                min="0"
                step="10"
                required
            />
            <InputField
                label="Quantidade de Parcelas"
                id="installments"
                name="installments"
                type="number"
                value={formData.installments}
                onChange={handleChange}
                placeholder="Ex: 48"
                min="1"
                step="1"
                required
            />

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-brand-yellow hover:bg-yellow-400 text-brand-black font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculando...
                    </>
                ) : (
                    'Calcular Juros'
                )}
            </button>
        </form>
    </Card>
  );
};