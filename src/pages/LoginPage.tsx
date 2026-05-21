import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userStore } from '@/store/userStore';

export function LoginPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await userStore.login(code, password);
      navigate('/admin');
    } catch (error: any) {
      setError(error.message || 'Código ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Logo GFT */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Logo no Topo */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white text-2xl font-bold">GFT</span>
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">GFT</h2>
              <p className="text-blue-200 text-sm">IT Solutions</p>
            </div>
          </div>

          {/* Conteúdo Central */}
          <div className="text-white max-w-lg">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Central de<br />Equipamentos TI
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Sistema corporativo de gerenciamento e controle de solicitações de equipamentos de tecnologia.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-blue-100">Gestão de solicitações em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-blue-100">Controle de atribuição de analistas</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-blue-100">Dashboard administrativo completo</span>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="flex items-center justify-between text-blue-200 text-sm">
            <span>© 2026 GFT Technologies</span>
            <span>Versão 1.0</span>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
              <span className="text-white text-2xl font-bold">GFT</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Central de Equipamentos TI</h2>
          </div>

          {/* Cabeçalho */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Bem-vindo
            </h2>
            <p className="text-slate-600">
              Acesse o painel administrativo
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Código de Acesso
              </label>
              <Input
                required
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Digite seu código (4 letras)"
                className="h-12 text-base uppercase"
                autoComplete="username"
              />
              <p className="mt-1 text-xs text-slate-500">
                Utilize as 4 letras do seu código de analista
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="h-12 text-base"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              Acessar Painel
            </Button>
          </form>

          {/* Informações de Acesso */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 text-center mb-2 font-medium">
              Acesso Padrão para Testes
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="text-center">
                <p className="text-slate-500">Código</p>
                <p className="font-mono font-bold text-slate-900 mt-1">ADMN</p>
              </div>
              <div className="text-slate-300">|</div>
              <div className="text-center">
                <p className="text-slate-500">Senha</p>
                <p className="font-mono font-bold text-slate-900 mt-1">admin123</p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Sistema interno de uso corporativo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
