import React, { useState, useEffect } from 'react';
import {
  Plug2,
  Mouse,
  Keyboard,
  MonitorPlay,
  Cable,
  Headphones,
  UsbIcon,
  RectangleHorizontal
} from 'lucide-react';
import Header from '../components/Header';
import CardEquipamento from '../components/CardEquipamento';
import api from '../services/api';
import './Totem.css';

const Totem = () => {
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [colaboradorId, setColaboradorId] = useState('');
  const [colaborador, setColaborador] = useState(null);
  const [buscandoColaborador, setBuscandoColaborador] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const equipamentos = [
    {
      id: 'carregador-notebook',
      nome: 'Carregador de Notebook',
      descricao: 'Fonte de alimentação Tipo C',
      icon: Plug2
    },
    {
      id: 'Carregador-Macbook',
      nome: 'Carregador Macbook',
      descricao: 'Necessito de um carregador de Macbook',
      icon: Mouse
    },
    // {
    //   id: 'teclado',
    //   nome: 'Teclado USB',
    //   descricao: 'Teclado padrão com fio USB',
    //   icon: Keyboard
    // },
    {
      id: 'monitor',
      nome: 'Monitor não liga',
      descricao: 'Monitor adicional para workstation',
      icon: MonitorPlay
    },
    {
      id: 'Adaptador VGA para HDMI com problema',
      nome: 'Adaptador VGA para HDMI',
      descricao: 'Adaptador VGA para HDMI com problema',
      icon: Cable
    },
    {
      id: 'headset',
      nome: 'Headset',
      descricao: 'Fone de ouvido com microfone',
      icon: Headphones
    },
    // {
    //   id: 'adaptador-usb',
    //   nome: 'Adaptador USB',
    //   descricao: 'Hub USB ou adaptador',
    //   icon: UsbIcon
    // },
    // {
    //   id: 'mousepad',
    //   nome: 'Mousepad',
    //   descricao: 'Base ergonômica para mouse',
    //   icon: RectangleHorizontal
    // }
  ];

  const buscarColaborador = async (codigo) => {
    if (codigo.length !== 4) {
      setColaborador(null);
      return;
    }

    setBuscandoColaborador(true);
    setMensagem(null);

    try {
      const response = await api.get(`/colaboradores/${codigo}`);
      setColaborador(response.data);
    } catch (error) {
      setColaborador(null);
      setMensagem({
        tipo: 'erro',
        texto: 'Colaborador não encontrado'
      });
    } finally {
      setBuscandoColaborador(false);
    }
  };

  useEffect(() => {
    if (colaboradorId.length === 4) {
      buscarColaborador(colaboradorId);
    }
  }, [colaboradorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!colaborador) {
      setMensagem({
        tipo: 'erro',
        texto: 'Por favor, digite um código válido de colaborador'
      });
      return;
    }

    setEnviando(true);
    setMensagem(null);

    try {
      await api.post('/requests', {
        employee_name: colaborador.full_name,
        employee_code: colaboradorId,
        equipment: equipamentoSelecionado.nome,
        team: colaborador.function || colaborador.organization_name || 'Não informado'
      });

      setMensagem({
        tipo: 'sucesso',
        texto: 'Solicitação enviada com sucesso!'
      });

      setTimeout(() => {
        setEquipamentoSelecionado(null);
        setColaboradorId('');
        setColaborador(null);
        setMensagem(null);
      }, 3000);
    } catch (error) {
      setMensagem({
        tipo: 'erro',
        texto: error.response?.data?.error || 'Erro ao enviar solicitação'
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleVoltar = () => {
    setEquipamentoSelecionado(null);
    setColaboradorId('');
    setColaborador(null);
    setMensagem(null);
  };

  return (
    <>
      <Header />
      <div className="totem-container">
        <div className="content-wrapper">
          {!equipamentoSelecionado ? (
            <>
              <div className="page-header">
                <div className="page-eyebrow">Service Desk</div>
                {/* <h1 className="page-title">Solicitação de Equipamentos TI</h1> */}
                <p className="page-subtitle">
                  Selecione o equipamento que você precisa para dar continuidade ao seu trabalho
                </p>
              </div>

              <div className="grid-equipamentos">
                {equipamentos.map((equip) => (
                  <CardEquipamento
                    key={equip.id}
                    equipamento={equip}
                    onClick={() => setEquipamentoSelecionado(equip)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="form-container">
              <div className="form-card">
                <h2>Solicitar {equipamentoSelecionado.nome}</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Código do Colaborador (4 letras)</label>
                    <input
                      type="text"
                      className="input-colaborador"
                      value={colaboradorId}
                      onChange={(e) => setColaboradorId(e.target.value.toUpperCase())}
                      maxLength="4"
                      placeholder="_ _ _ _"
                      autoFocus
                      required
                    />
                    {buscandoColaborador && (
                      <div className="input-feedback loading">
                        Buscando colaborador...
                      </div>
                    )}
                  </div>

                  {colaborador && (
                    <div className="colaborador-info">
                      <div className="info-row">
                        <label>Nome Completo</label>
                        <div className="info-value">{colaborador.full_name}</div>
                      </div>
                      <div className="info-row">
                        <label>Função</label>
                        <div className="info-value">
                          {colaborador.function || colaborador.organization_name || 'Não informado'}
                        </div>
                      </div>
                    </div>
                  )}

                  {mensagem && (
                    <div className={`mensagem ${mensagem.tipo === 'sucesso' ? 'mensagem-sucesso' : 'mensagem-erro'}`}>
                      {mensagem.texto}
                    </div>
                  )}

                  <div className="form-buttons">
                    <button
                      type="button"
                      onClick={handleVoltar}
                      className="btn btn-secondary"
                      disabled={enviando}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!colaborador || enviando}
                    >
                      {enviando ? 'Enviando...' : 'Confirmar Solicitação'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="totem-footer">
            <a href="/painel-ti" className="link-admin">
              Acesso Administrativo
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Totem;
