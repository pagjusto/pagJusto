import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { calculatorSchema, type CalculatorFormData } from '../services/validation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { Loader2, User, Phone, Calendar as CalendarIcon, DollarSign, Hash } from 'lucide-react';
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
        control,
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
                <CardTitle>Simule Agora e Descubra</CardTitle>
                <CardDescription>Preencha os campos abaixo para analisar seu financiamento.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    <fieldset className="space-y-4">
                        <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 w-full">Informações Pessoais</legend>
                        
                        <div className="space-y-1">
                            <Label htmlFor="fullName" className="flex items-center"><User className="h-4 w-4 mr-2 text-gray-400" />Seu Nome Completo</Label>
                            <Input id="fullName" type="text" placeholder="Ex: João da Silva" {...register('fullName')} />
                            <FormError message={errors.fullName?.message} />
                        </div>
                        
                        <div className="space-y-1">
                            <Label htmlFor="whatsappNumber" className="flex items-center"><Phone className="h-4 w-4 mr-2 text-gray-400" />Número de WhatsApp</Label>
                            <Input id="whatsappNumber" type="tel" placeholder="(11) 99999-8888" {...register('whatsappNumber')} />
                            <FormError message={errors.whatsappNumber?.message} />
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 w-full">Detalhes do Financiamento</legend>
                        
                        <div className="space-y-1">
                            <Label htmlFor="financingDate" className="flex items-center"><CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />Data do Financiamento</Label>
                            <Controller
                                name="financingDate"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(new Date(field.value), "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                                initialFocus
                                                locale={ptBR}
                                                disabled={(date) => date > new Date() || date < new Date("2019-01-01")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            <FormError message={errors.financingDate?.message} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="financedAmount" className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-gray-400" />Valor Financiado (R$)</Label>
                                <Input id="financedAmount" type="number" placeholder="50000" min="0" step="any" {...register('financedAmount')} />
                                <FormError message={errors.financedAmount?.message} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="downPayment" className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-gray-400" />Valor de Entrada (R$)</Label>
                                <Input id="downPayment" type="number" placeholder="10000" min="0" step="any" {...register('downPayment')} />
                                <FormError message={errors.downPayment?.message} />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="installmentAmount" className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-gray-400" />Valor da Parcela (R$)</Label>
                                <Input id="installmentAmount" type="number" placeholder="1200" min="0" step="any" {...register('installmentAmount')} />
                                <FormError message={errors.installmentAmount?.message} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="installments" className="flex items-center"><Hash className="h-4 w-4 mr-2 text-gray-400" />Nº de Parcelas</Label>
                                <Input id="installments" type="number" placeholder="48" min="1" step="1" {...register('installments')} />
                                <FormError message={errors.installments?.message} />
                            </div>
                        </div>
                    </fieldset>

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
                            'Analisar Meu Financiamento'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};