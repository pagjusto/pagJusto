import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
    const [currentLogo, setCurrentLogo] = useState<string>('/logo.png');
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        const customLogo = localStorage.getItem('customLogo');
        if (customLogo) {
            setCurrentLogo(customLogo);
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveLogo = () => {
        if (previewLogo) {
            localStorage.setItem('customLogo', previewLogo);
            setCurrentLogo(previewLogo);
            alert('Logo atualizada com sucesso!');
        }
    };

    const handleResetLogo = () => {
        localStorage.removeItem('customLogo');
        setCurrentLogo('/logo.png');
        setPreviewLogo(null);
        setSelectedFile(null);
        alert('Logo restaurada para o padrão.');
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-brand-green text-white p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-2xl">
                <Link to="/" className="inline-flex items-center text-white hover:text-brand-yellow mb-6">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Voltar para a Calculadora
                </Link>
                <Card className="bg-white text-brand-black">
                    <CardHeader>
                        <CardTitle>Configurações da Aplicação</CardTitle>
                        <CardDescription>Personalize a aparência da calculadora.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="logo-upload">Alterar Logo</Label>
                            <p className="text-sm text-gray-500">
                                Selecione uma imagem (PNG, JPG) para usar como logo.
                            </p>
                            <div className="flex items-center gap-4 my-4">
                                <p className="font-semibold">Logo Atual:</p>
                                <img src={currentLogo} alt="Logo Atual" className="h-16 w-auto bg-gray-100 p-2 rounded" />
                            </div>
                            <Input id="logo-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="file:text-brand-black" />
                        </div>

                        {previewLogo && (
                            <div className="space-y-2">
                                <Label>Pré-visualização da Nova Logo</Label>
                                <div className="p-4 border rounded-md flex justify-center">
                                    <img src={previewLogo} alt="Pré-visualização da nova logo" className="h-20 w-auto" />
                                </div>
                                <Button onClick={handleSaveLogo} className="w-full bg-brand-green hover:bg-green-800">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Salvar Nova Logo
                                </Button>
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <Button onClick={handleResetLogo} variant="destructive" className="w-full">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Restaurar Logo Padrão
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Settings;