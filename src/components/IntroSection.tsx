import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const features = [
    "Compare sua taxa de juros com a média do mercado.",
    "Descubra se você pode estar pagando juros abusivos.",
    "Calcule o valor que você poderia economizar.",
    "Receba uma análise gratuita do seu contrato."
];

export const IntroSection: React.FC = () => {
    return (
        <Card className="bg-white/10 border-white/20 text-white mb-8 backdrop-blur-sm">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-brand-yellow mb-4">O que você pode fazer com esta ferramenta?</h2>
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-6 w-6 mr-3 text-brand-yellow flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};