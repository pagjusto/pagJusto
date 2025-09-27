import { z } from 'zod';

// Preprocess strings to numbers, handling empty strings and commas for decimals.
const stringToNumber = z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() === '') return undefined;
    if (typeof val === 'number') return val;
    return Number(String(val).replace(',', '.'));
}, z.number());

export const calculatorSchema = z.object({
    fullName: z.string().min(3, { message: "Por favor, insira seu nome completo." }),
    whatsappNumber: z.string()
        .min(14, { message: "O número de WhatsApp parece curto demais." })
        .refine(val => val.replace(/\D/g, '').length >= 10, { message: "Número de WhatsApp inválido. Inclua o DDD." }),
    financingDate: z.string().min(1, { message: "A data do financiamento é obrigatória." }),
    
    financedAmount: stringToNumber
        .pipe(z.number({ required_error: "Valor é obrigatório.", invalid_type_error: "Valor inválido." }).min(1, { message: "O valor deve ser maior que zero." })),
    
    downPayment: stringToNumber
        .pipe(z.number({ required_error: "Valor é obrigatório.", invalid_type_error: "Valor inválido." }).min(0, { message: "A entrada não pode ser negativa." })),
    
    installmentAmount: stringToNumber
        .pipe(z.number({ required_error: "Valor é obrigatório.", invalid_type_error: "Valor inválido." }).min(1, { message: "O valor deve ser maior que zero." })),
    
    installments: stringToNumber
        .pipe(z.number({ required_error: "Valor é obrigatório.", invalid_type_error: "Valor inválido." }).int({ message: "Deve ser um número inteiro." }).min(1, { message: "Deve haver pelo menos 1 parcela." })),
}).refine(data => {
    if (typeof data.financedAmount === 'number' && typeof data.downPayment === 'number') {
        return data.financedAmount > data.downPayment;
    }
    return true;
}, {
    message: "O valor financiado deve ser maior que o valor de entrada.",
    path: ["financedAmount"],
});

export type CalculatorFormData = z.infer<typeof calculatorSchema>;