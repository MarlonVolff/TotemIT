import React, { useState } from 'react';
import CardEquipamento from '../components/CardEquipamento';
import api from '../services/api';
import './Totem.css';

const equipamentos = [
  { nome: 'Carregador de Notebook', icone: '🔌' },
  { nome: 'Mouse USB', icone: '🖱️' },
  { nome: 'Teclado USB', icone: '⌨️' },
  { nome: 'Cabo HDMI', icone: '📺' },
  { nome: 'Cabo de Rede', icone: '🔗' },
  { nome: 'Headset', icone: '🎧' },
  { nome: 'Adaptador USB-C', icone: '🔄' },
  { nome: 'Mousepad', icone: '📋' }
];

const Totem = () => {
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [colaboradorId, setColaboradorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleSelectEquipamento = (nomeEquipamento) => {
    setEquipamentoSelecionado(nomeEquipamento);
    setMensagem({ tipo: '', texto: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (colaboradorId.length !== 4) {
      setMensagem({
        tipo: 'erro',
        texto: 'O ID deve ter exatamente 4 letras!'
      });
      return;
    }

    setLoading(true);

    try {
      await api.post('/chamados', {
        colaborador_id: colaboradorId,
        equipamento: equipamentoSelecionado
      });

      setMensagem({
        tipo: 'sucesso',
        texto: '✓ Chamado criado com sucesso! A TI irá atendê-lo em breve.'
      });

      setTimeout(() => {
        setEquipamentoSelecionado(null);
        setColaboradorId('');
        setMensagem({ tipo: '', texto: '' });
      }, 3000);
    } catch (error) {
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao criar chamado. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    setEquipamentoSelecionado(null);
    setColaboradorId('');
    setMensagem({ tipo: '', texto: '' });
  };

  return (
    <div className="totem-container">
      <div className="totem-header">
        <h1>🖥️ Totem de Equipamentos TI</h1>
        <p>Selecione o equipamento que você precisa</p>
      </div>

      {!equipamentoSelecionado ? (
        <div className="grid-equipamentos">
          {equipamentos.map((equip, index) => (
            <CardEquipamento
              key={index}
              equipamento={equip}
              onSelect={handleSelectEquipamento}
            />
          ))}
        </div>
      ) : (
        <div className="form-container">
          <div className="form-card">
            <h2>Solicitar: {equipamentoSelecionado}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Digite suas 4 letras de identificação:</label>
                <input
                  type="text"
                  maxLength={4}
                  value={colaboradorId}
                  onChange={(e) => setColaboradorId(e.target.value.toUpperCase())}
                  placeholder="ABCD"
                  className="input-colaborador"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {mensagem.texto && (
                <div className={`mensagem mensagem-${mensagem.tipo}`}>
                  {mensagem.texto}
                </div>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  onClick={handleVoltar}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || colaboradorId.length !== 4}
                >
                  {loading ? 'Enviando...' : 'Confirmar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="totem-footer">
        <a href="/painel-ti" className="link-admin">
          Acesso TI
        </a>
      </div>
    </div>
  );
};

export default Totem;
