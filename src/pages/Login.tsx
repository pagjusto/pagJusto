import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-green p-4">
            <img 
                src="/logo.png"
                alt="Pag Justo! Logo" 
                className="w-72 sm:w-80 mx-auto mb-8"
            />
            <div className="w-full max-w-md">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ 
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    inputLabelText: 'white',
                                    anchorTextColor: 'white',
                                    anchorTextHoverColor: '#d1d5db',
                                }
                            }
                        }
                    }}
                    providers={[]}
                    theme="dark"
                    localization={{
                        variables: {
                            sign_in: {
                                email_label: 'Seu e-mail',
                                password_label: 'Sua senha',
                                button_label: 'Entrar',
                                link_text: 'Já tem uma conta? Entre',
                            },
                            sign_up: {
                                email_label: 'Seu e-mail',
                                password_label: 'Crie uma senha',
                                button_label: 'Cadastrar',
                                link_text: 'Não tem uma conta? Cadastre-se',
                            },
                            forgotten_password: {
                                link_text: 'Esqueceu sua senha?',
                                email_label: 'Seu e-mail',
                                button_label: 'Enviar instruções',
                            }
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default Login;