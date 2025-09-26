import React, { useState } from 'react';
import type { FormData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { formatPhoneNumber } from '../services/formatters';

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

    if (name === 'whatsappNumber') {
        const formattedValue = formatPhoneNumber(value);
        setFormData(prev => ({
            ...prev,
            [name]: formattedValue,
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Calcule sua Economia</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="fullName">Seu Nome Completo</Label>
                    <Input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Ex: João da Silva" required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
                    <Input id="whatsappNumber" name="whatsappNumber" type="tel" value={formData.whatsappNumber} onChange={handleChange} placeholder="(11) 99999-8888" required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="financingDate">Data do Financiamento</Label>
                    <Input id="financingDate" name="financingDate" type="date" value={formData.financingDate} onChange={handleChange} required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="financedAmount">Valor do Financiamento (R$)</Label>
                    <Input id="financedAmount" name="financedAmount" type="number" value={formData.financedAmount} onChange={handleChange} placeholder="Ex: 50000" min="0" step="100" required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="downPayment">Valor de Entrada (R$)</Label>
                    <Input id="downPayment" name="downPayment" type="number" value={formData.downPayment} onChange={handleChange} placeholder="Ex: 10000" min="0" step="100" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="installmentAmount">Valor da Parcela (R$)</Label>
                    <Input id="installmentAmount" name="installmentAmount" type="number" value={formData.installmentAmount} onChange={handleChange} placeholder="Ex: 1200" min="0" step="10" required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="installments">Quantidade de Parcelas</Label>
                    <Input id="installments" name="installments" type="number" value={formData.installments} onChange={handleChange} placeholder="Ex: 48" min="1" step="1" required />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-yellow hover:bg-yellow-400 text-brand-black font-bold py-3 text-lg h-auto transition duration-300 ease-in-out"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Calculando...
                        </>
                    ) : (
                        'Calcular Juros'
                    )}
                </Button>
            </form>
        </CardContent>
    </Card>
  );
};