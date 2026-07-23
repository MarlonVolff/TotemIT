import { useState } from 'react';
import { Monitor, Headphones, Cable, Laptop, Package, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EquipmentType } from '@/types';
import { requestStore } from '@/store/requestStore';

const equipmentOptions: Array<{ type: EquipmentType; icon: React.ReactNode }> = [
  { type: 'Carregador Notebook', icon: <Cable className="w-12 h-12" /> },
  { type: 'Headset', icon: <Headphones className="w-12 h-12" /> },
  { type: 'Notebook Reserva', icon: <Laptop className="w-12 h-12" /> },
  { type: 'Problema na mesa', icon: <AlertTriangle className="w-12 h-12" /> },
  { type: 'Outros', icon: <Package className="w-12 h-12" /> },
];

export function TotemPage() {
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastRequest, setLastRequest] = useState<any>(null);
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeCode: '',
    team: '',
    observation: '',
  });
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);

  const handleEquipmentSelect = (equipment: EquipmentType) => {
    setSelectedEquipment(equipment);
    setShowConfirmation(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const request = await requestStore.add({
        employeeName: formData.employeeName,
        employeeCode: formData.employeeCode,
        equipment: selectedEquipment!,
        team: formData.team,
        observation: formData.observation,
        status: 'Aberto',
      });

      setLastRequest(request);
      setShowConfirmation(true);
      setFormData({
        employeeName: '',
        employeeCode: '',
        team: '',
        observation: '',
      });
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      alert('Erro ao criar solicitação. Tente novamente.');
    }
  };

  const handleBackToSelection = () => {
    setSelectedEquipment(null);
    setShowConfirmation(false);
    // Limpar todos os campos do formulário ao voltar
    setFormData({
      employeeName: '',
      employeeCode: '',
      team: '',
      observation: '',
    });
  };

  const handleEmployeeCodeChange = async (code: string) => {
    const upperCode = code.toUpperCase();
    setFormData({ ...formData, employeeCode: upperCode });

    // Quando digitar 4 letras, buscar automaticamente
    if (upperCode.length === 4) {
      setIsLoadingEmployee(true);
      try {
        console.log('🔍 Buscando colaborador:', upperCode);
        const response = await fetch(`http://localhost:3001/api/colaboradores/${upperCode}`);

        if (response.ok) {
          const colaborador = await response.json();
          console.log('✅ Colaborador encontrado:', colaborador);

          // Limpar o nome (remover espaços extras e informações entre parênteses)
          let cleanName = colaborador.full_name || '';
          // Remove tudo entre parênteses e após
          cleanName = cleanName.replace(/\s*\([^)]*\)\s*/g, '').trim();

          console.log('📝 Nome limpo:', cleanName);

          setFormData({
            ...formData,
            employeeCode: upperCode,
            employeeName: cleanName,
            team: colaborador.function || colaborador.organization_name || '',
          });
        } else {
          console.warn('⚠️ Colaborador não encontrado:', upperCode);
          // Se não encontrar, limpa os campos
          setFormData({
            ...formData,
            employeeCode: upperCode,
            employeeName: '',
            team: '',
          });
        }
      } catch (error) {
        console.error('❌ Erro ao buscar colaborador:', error);
        // Em caso de erro, também limpa os campos
        setFormData({
          ...formData,
          employeeCode: upperCode,
          employeeName: '',
          team: '',
        });
      } finally {
        setIsLoadingEmployee(false);
      }
    }
  };

  if (showConfirmation && lastRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg p-12 text-center shadow-xl border-2">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-2">
              Solicitação Enviada
            </h1>
            <p className="text-slate-600">
              Sua solicitação foi registrada com sucesso
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 mb-8 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Número do Chamado:</span>
              <span className="text-sm font-semibold text-slate-900">{lastRequest.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Horário:</span>
              <span className="text-sm font-semibold text-slate-900">
                {lastRequest.createdAt.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Status:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Aberto
              </span>
            </div>
          </div>

          <Button
            onClick={handleBackToSelection}
            className="w-full h-12 text-base"
            size="lg"
          >
            Nova Solicitação
          </Button>
        </Card>

        {/* Copyright */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GFT. Todos os direitos reservados.
          </p>
        </div>
      </div>
    );
  }

  if (selectedEquipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          {/* Botão Voltar */}
          <button
            onClick={handleBackToSelection}
            className="mb-6 text-slate-600 hover:text-slate-900 flex items-center gap-2 font-medium transition-all hover:gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          {/* Card do Formulário */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            {/* Header com background azul suave */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-10 py-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Solicitar {selectedEquipment}
              </h1>
              <p className="text-slate-600 mt-2">
                Preencha as informações abaixo para criar sua solicitação
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="p-10">
              <div className="space-y-8">
                {/* Campo 4 Letras - Destaque */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <label className="block text-base font-semibold text-slate-900 mb-3">
                    Código do Colaborador
                  </label>
                  <div className="relative">
                    <Input
                      required
                      maxLength={4}
                      value={formData.employeeCode}
                      onChange={(e) => handleEmployeeCodeChange(e.target.value)}
                      placeholder="DIGITE SUAS 4 LETRAS"
                      className="h-14 text-lg uppercase font-bold tracking-wider text-center border-2 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                      disabled={isLoadingEmployee}
                      autoFocus
                    />
                    {isLoadingEmployee && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-blue-700 mt-3 font-medium">
                    ✓ Seus dados serão carregados automaticamente
                  </p>
                </div>

                {/* Grid de 2 colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Nome Completo
                    </label>
                    <Input
                      required
                      value={formData.employeeName}
                      onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                      placeholder="Aguardando código..."
                      className="h-12 bg-slate-50 border-slate-300 text-slate-900"
                      readOnly
                      disabled={isLoadingEmployee}
                    />
                  </div>

                  {/* Setor */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Equipe / Setor
                    </label>
                    <Input
                      required
                      value={formData.team}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      placeholder="Aguardando código..."
                      className="h-12 bg-slate-50 border-slate-300 text-slate-900"
                      readOnly
                      disabled={isLoadingEmployee}
                    />
                  </div>
                </div>
              </div>

              {/* Botão Submit */}
              <div className="mt-10">
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  disabled={isLoadingEmployee}
                >
                  {isLoadingEmployee ? 'Carregando dados...' : 'Confirmar Solicitação'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Copyright */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} GFT. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Central de Equipamentos TI
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Sistema de Solicitação Self-Service
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-800 mb-3">
            Selecione o equipamento desejado
          </h2>
          <p className="text-slate-600">
            Toque no card para iniciar sua solicitação
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {equipmentOptions.map((option) => (
            <Card
              key={option.type}
              onClick={() => handleEquipmentSelect(option.type)}
              className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 hover:border-primary"
            >
              <div className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
                <div className="text-primary mb-4">{option.icon}</div>
                <h3 className="font-semibold text-slate-800 text-lg">
                  {option.type}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Copyright */}
      <footer className="py-6 text-center border-t border-slate-200 bg-white mt-auto">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} GFT. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
