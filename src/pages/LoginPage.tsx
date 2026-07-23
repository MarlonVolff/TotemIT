import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userStore } from '@/store/userStore';
import { Shield, Lock, User } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await userStore.login(code, password);
      navigate('/admin');
    } catch (error: any) {
      setError(error.message || 'Código ou senha incorretos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-5/12 flex-col p-12 xl:p-16 relative">
          {/* Logo & Brand - Fixo no Topo */}
          <div className="absolute top-12 left-12 xl:left-16">
            <div className="inline-flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">GFT</h1>
                <p className="text-xs text-slate-400 tracking-wider">TECHNOLOGY SOLUTIONS</p>
              </div>
            </div>
          </div>

          {/* Ilustração de Assistência Técnica - Centralizada */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-3xl opacity-20"></div>
                <div className="relative bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50">
                  {/* SVG Ilustração - Assistência e Tecnologia */}
                  <svg className="w-full h-96" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Mesa/Base */}
                    <rect x="50" y="320" width="400" height="8" rx="4" fill="#1E293B"/>

                    {/* Monitor Central */}
                    <rect x="170" y="140" width="160" height="120" rx="8" fill="#1E293B" stroke="#3B82F6" strokeWidth="3">
                      <animate attributeName="stroke" values="#3B82F6;#06B6D4;#8B5CF6;#3B82F6" dur="6s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="180" y="150" width="140" height="100" rx="4" fill="#0F172A">
                      <animate attributeName="opacity" values="1;0.95;1" dur="4s" repeatCount="indefinite"/>
                    </rect>

                    {/* Tela do Monitor - Gráficos/Dashboard */}
                    <rect x="190" y="165" width="50" height="30" rx="2" fill="#3B82F6" opacity="0.3">
                      <animate attributeName="height" values="30;40;30" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="165;160;165" dur="3s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="250" y="165" width="50" height="30" rx="2" fill="#06B6D4" opacity="0.3">
                      <animate attributeName="height" values="30;35;30" dur="2.5s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="165;162;165" dur="2.5s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="190" y="205" width="110" height="35" rx="2" fill="#8B5CF6" opacity="0.2">
                      <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite"/>
                    </rect>
                    <circle cx="215" cy="175" r="3" fill="#60A5FA">
                      <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="275" cy="175" r="3" fill="#22D3EE">
                      <animate attributeName="r" values="3;4;3" dur="1.8s" repeatCount="indefinite"/>
                    </circle>

                    {/* Base do Monitor */}
                    <rect x="235" y="260" width="30" height="40" fill="#334155"/>
                    <rect x="220" y="300" width="60" height="20" rx="4" fill="#1E293B"/>

                    {/* Mouse */}
                    <ellipse cx="350" cy="305" rx="15" ry="20" fill="#334155" stroke="#475569" strokeWidth="2">
                      <animate attributeName="fill" values="#334155;#3B82F6;#334155" dur="4s" repeatCount="indefinite"/>
                    </ellipse>
                    <line x1="350" y1="295" x2="350" y2="315" stroke="#475569" strokeWidth="1">
                      <animate attributeName="stroke" values="#475569;#60A5FA;#475569" dur="4s" repeatCount="indefinite"/>
                    </line>

                    {/* Teclado */}
                    <rect x="140" y="290" width="180" height="25" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
                    <g opacity="0.5">
                      <rect x="150" y="297" width="10" height="10" rx="1" fill="#334155"/>
                      <rect x="165" y="297" width="10" height="10" rx="1" fill="#334155"/>
                      <rect x="180" y="297" width="10" height="10" rx="1" fill="#334155"/>
                      <rect x="195" y="297" width="10" height="10" rx="1" fill="#334155"/>
                      <rect x="210" y="297" width="10" height="10" rx="1" fill="#334155"/>
                      <rect x="225" y="297" width="35" height="10" rx="1" fill="#334155"/>
                      <rect x="265" y="297" width="10" height="10" rx="1" fill="#334155"/>
                      <rect x="280" y="297" width="10" height="10" rx="1" fill="#334155"/>
                      <rect x="295" y="297" width="10" height="10" rx="1" fill="#334155"/>
                    </g>

                    {/* Headset/Fone */}
                    <path d="M100 200 Q100 150 130 150 L130 200" stroke="#3B82F6" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <path d="M160 200 Q160 150 130 150 L130 200" stroke="#3B82F6" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <circle cx="100" cy="200" r="12" fill="#1E293B" stroke="#3B82F6" strokeWidth="3"/>
                    <circle cx="160" cy="200" r="12" fill="#1E293B" stroke="#3B82F6" strokeWidth="3"/>

                    {/* Equipamentos Laterais - Mouse Extra */}
                    <rect x="380" y="200" width="45" height="60" rx="8" fill="#1E293B" stroke="#06B6D4" strokeWidth="2"/>
                    <circle cx="402" cy="225" r="8" fill="#06B6D4" opacity="0.3"/>

                    {/* Cabo/Adaptador */}
                    <rect x="390" y="270" width="30" height="12" rx="2" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2"/>
                    <circle cx="395" cy="276" r="2" fill="#A78BFA"/>
                    <circle cx="415" cy="276" r="2" fill="#A78BFA"/>

                    {/* Ícones de Suporte/Assistência Flutuantes */}
                    <g opacity="0.6">
                      {/* Ferramentas */}
                      <circle cx="380" cy="100" r="20" fill="#3B82F6" opacity="0.2">
                        <animate attributeName="cy" values="100;95;100" dur="3s" repeatCount="indefinite"/>
                      </circle>
                      <g>
                        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite"/>
                        <path d="M370 100 L375 95 L390 110 L385 115 Z" fill="#60A5FA"/>
                        <rect x="376" y="102" width="3" height="10" fill="#60A5FA" transform="rotate(45 377 107)"/>
                      </g>

                      {/* Mensagem/Chat */}
                      <circle cx="120" cy="280" r="18" fill="#06B6D4" opacity="0.2">
                        <animate attributeName="cy" values="280;285;280" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <g>
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite"/>
                        <rect x="108" y="272" width="24" height="16" rx="3" fill="#22D3EE" opacity="0.6"/>
                        <path d="M115 288 L120 293 L125 288" fill="#22D3EE" opacity="0.6"/>
                      </g>

                      {/* Settings/Config */}
                      <circle cx="420" cy="140" r="18" fill="#8B5CF6" opacity="0.2">
                        <animate attributeName="cy" values="140;137;140" dur="3.5s" repeatCount="indefinite"/>
                      </circle>
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="0 420 140" to="360 420 140" dur="8s" repeatCount="indefinite"/>
                        <circle cx="420" cy="140" r="8" fill="none" stroke="#A78BFA" strokeWidth="2"/>
                        <circle cx="420" cy="140" r="3" fill="#A78BFA"/>
                      </g>
                    </g>

                    {/* Linhas de Conexão/Rede */}
                    <line x1="100" y1="210" x2="170" y2="200" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3" opacity="0.3">
                      <animate attributeName="stroke-dashoffset" from="0" to="6" dur="1s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <line x1="380" y1="200" x2="330" y2="180" stroke="#06B6D4" strokeWidth="1" strokeDasharray="3 3" opacity="0.3">
                      <animate attributeName="stroke-dashoffset" from="0" to="6" dur="1.2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite"/>
                    </line>
                    <line x1="420" y1="150" x2="330" y2="150" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" opacity="0.3">
                      <animate attributeName="stroke-dashoffset" from="0" to="6" dur="1.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite"/>
                    </line>

                    {/* Partículas/Pontos de Dados */}
                    <circle cx="200" cy="120" r="2" fill="#60A5FA" opacity="0.5">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="280" cy="110" r="2" fill="#22D3EE" opacity="0.5">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="240" cy="100" r="2" fill="#A78BFA" opacity="0.5">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-12 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-white">GFT</h1>
                  <p className="text-xs text-slate-400">TECHNOLOGY SOLUTIONS</p>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Área Restrita</h3>
                    <p className="text-xs text-slate-400">Acesso ao Painel Administrativo</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Código de Acesso
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <Input
                      required
                      maxLength={4}
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="4 LETRAS"
                      className="h-12 pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 uppercase"
                      autoComplete="username"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <Input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-400">Falha na Autenticação</p>
                        <p className="text-xs text-red-400/80 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Autenticando...</span>
                    </div>
                  ) : (
                    'Acessar Painel'
                  )}
                </Button>
              </form>

              {/* Test Credentials */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Credenciais de Teste:</span>
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 bg-slate-800 rounded border border-slate-700">
                      <span className="font-mono text-slate-300">ADMN</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <div className="px-2 py-1 bg-slate-800 rounded border border-slate-700">
                      <span className="font-mono text-slate-300">admin123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <p className="mt-6 text-center text-xs text-slate-500">
              Sistema protegido por autenticação multi-fator
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
