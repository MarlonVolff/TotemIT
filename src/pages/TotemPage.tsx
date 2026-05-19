import { useState } from 'react';
import { Monitor, Mouse, Keyboard, Headphones, Cable, Usb, Laptop, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EquipmentType } from '@/types';
import { requestStore } from '@/store/requestStore';

const equipmentOptions: Array<{ type: EquipmentType; icon: React.ReactNode }> = [
  { type: 'Carregador Notebook', icon: <Cable className="w-12 h-12" /> },
  { type: 'Mouse', icon: <Mouse className="w-12 h-12" /> },
  { type: 'Teclado', icon: <Keyboard className="w-12 h-12" /> },
  { type: 'Headset', icon: <Headphones className="w-12 h-12" /> },
  { type: 'Cabo HDMI', icon: <Cable className="w-12 h-12" /> },
  { type: 'Adaptador USB-C', icon: <Usb className="w-12 h-12" /> },
  { type: 'Notebook Reserva', icon: <Laptop className="w-12 h-12" /> },
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
      </div>
    );
  }

  if (selectedEquipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-8 shadow-xl border-2">
          <div className="mb-8">
            <button
              onClick={handleBackToSelection}
              className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <h1 className="text-3xl font-semibold text-slate-800">
              Solicitar {selectedEquipment}
            </h1>
            <p className="text-slate-600 mt-2">
              Preencha os dados abaixo para completar sua solicitação
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome do Colaborador
              </label>
              <Input
                required
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                placeholder="Digite seu nome completo"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                4 Letras
              </label>
              <Input
                required
                maxLength={4}
                value={formData.employeeCode}
                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value.toUpperCase() })}
                placeholder="Ex: ABCD"
                className="h-12 uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Equipe / Setor
              </label>
              <Input
                required
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="Ex: Desenvolvimento, Comercial, RH"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observação (Opcional)
              </label>
              <Textarea
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                placeholder="Informações adicionais sobre a solicitação"
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base" size="lg">
              Solicitar Equipamento
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

      <main className="max-w-7xl mx-auto px-6 py-12">
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
    </div>
  );
}
