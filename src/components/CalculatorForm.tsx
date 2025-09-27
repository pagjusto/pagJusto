import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculatorSchema, type CalculatorFormData } from '../services/validation';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { formatPhoneNumber } from '../services/formatters';

interface CalculatorFormProps {
  onCalculate: (data: CalculatorFormData) => void;
  isLoading: boolean;
}

const FormError: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    return <p className="text-sm text-danger mt-1">{message}</p>;
};

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CalculatorFormData>({
        resolver: zodResolver(calculatorSchema),
        defaultValues: {
            fullName: '',
            whatsappNumber: '',
            financingDate: '',
            financedAmount: undefined,
            downPayment: 0,
            installmentAmount: undefined,
            installments: undefined,
        }
    });

    const whatsappValue = watch('whatsappNumber');
    React.useEffect(() => {
        const formatted = formatPhoneNumber(whatsappValue);
        if (formatted !== whatsappValue) {
            setValue('whatsappNumber', formatted, { shouldValidate: true });
        }
    }, [whatsappValue, setValue]);

    const onSubmit = (data: CalculatorFormData) => {
        onCalculate(data);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calcule sua Economia</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="fullName">Seu Nome Completo</Label>
                        <Input id="fullName" type="text" placeholder="Ex: João da Silva" {...register('fullName')} />
                        <FormError message={errors.fullName?.message} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
                        <Input id="whatsappNumber" type="tel" placeholder="(11) 99999-8888" {...register('whatsappNumber')} />
                        <FormError message={errors.whatsappNumber?.message} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="financingDate">Data do Financiamento</Label>
                        <Input id="financingDate" type="date" {...register('financingDate')} />
                        <FormError message={errors.financingDate?.message} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="financedAmount">Valor do Financiamento (R$)</Label>
                        <Input id="financedAmount" type="number" placeholder="Ex: 50000" min="0" step="any" {...register('financedAmount')} />
                        <FormError message={errors.financedAmount?.message} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="downPayment">Valor de Entrada (R$)</Label>
                        <Input id="downPayment" type="number" placeholder="Ex: 10000" min="0" step="any" {...register('downPayment')} />
                        <FormError message={errors.downPayment?.message} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="installmentAmount">Valor da Parcela (R$)</Label>
                        <Input id="installmentAmount" type="number" placeholder="Ex: 1200" min="0" step="any" {...register('installmentAmount')} />
                        <FormError message={errors.installmentAmount?.message} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="installments">Quantidade de Parcelas</Label>
                        <Input id="installments" type="number" placeholder="Ex: 48" min="1" step="1" {...register('installments')} />
                        <FormError message={errors.installments?.message} />
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