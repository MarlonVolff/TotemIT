import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PainelTI.css';

const PainelTI = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [chamados, setChamados] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('aberto');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [analistaFechamento, setAnalistaFechamento] = useState('');
  const [chamadoFechando, setChamadoFechando] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verificarToken();
    }
  }, []);

  useEffect(() => {
    if (autenticado) {
      carregarChamados();
      const interval = setInterval(carregarChamados, 10000); // Atualiza a cada 10s
      return () => clearInterval(interval);
    }
  }, [autenticado, filtroStatus]);

  const verificarToken = async () => {
    try {
      await api.get('/auth/verify');
      setAutenticado(true);
    } catch (error) {
      localStorage.removeItem('token');
      setAutenticado(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { usuario, senha });
      localStorage.setItem('token', response.data.token);
      setAutenticado(true);
      setSenha('');
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAutenticado(false);
    setUsuario('');
    setSenha('');
  };

  const carregarChamados = async () => {
    try {
      const response = await api.get('/chamados', {
        params: filtroStatus !== 'todos' ? { status: filtroStatus } : {}
      });
      setChamados(response.data);
    } catch (error) {
      console.error('Erro ao carregar chamados:', error);
    }
  };

  const iniciarFechamento = (chamado) => {
    setChamadoFechando(chamado.id);
    setAnalistaFechamento('');
  };

  const cancelarFechamento = () => {
    setChamadoFechando(null);
    setAnalistaFechamento('');
  };

  const handleFecharChamado = async (chamadoId) => {
    if (!analistaFechamento.trim()) {
      alert('Por favor, informe o nome do analista');
      return;
    }

    setLoading(true);

    try {
      await api.patch(`/chamados/${chamadoId}/fechar`, {
        analista: analistaFechamento
      });
      setChamadoFechando(null);
      setAnalistaFechamento('');
      carregarChamados();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao fechar chamado');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!autenticado) {
    return (
      <div className="painel-container">
        <div className="login-card">
          <h1>🔐 Painel TI</h1>
          <p>Faça login para acessar o painel administrativo</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Usuário</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu usuário"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                disabled={loading}
              />
            </div>

            {erro && <div className="erro-login">{erro}</div>}

            <button type="submit" className="btn btn-login" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="login-footer">
            <a href="/">← Voltar ao Totem</a>
            <p className="credenciais-padrao">
              <small>Usuário padrão: <strong>admin</strong> / Senha: <strong>admin123</strong></small>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="painel-container">
      <div className="painel-header">
        <h1>📋 Painel de Chamados - TI</h1>
        <button onClick={handleLogout} className="btn-logout">
          Sair
        </button>
      </div>

      <div className="filtros">
        <button
          className={`btn-filtro ${filtroStatus === 'aberto' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('aberto')}
        >
          Abertos ({chamados.filter(c => c.status === 'aberto').length})
        </button>
        <button
          className={`btn-filtro ${filtroStatus === 'fechado' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('fechado')}
        >
          Fechados
        </button>
        <button
          className={`btn-filtro ${filtroStatus === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('todos')}
        >
          Todos
        </button>
      </div>

      <div className="chamados-lista">
        {chamados.length === 0 ? (
          <div className="mensagem-vazia">
            {filtroStatus === 'aberto'
              ? '✓ Nenhum chamado aberto no momento'
              : 'Nenhum chamado encontrado'}
          </div>
        ) : (
          <table className="tabela-chamados">
            <thead>
              <tr>
                <th>ID</th>
                <th>Colaborador</th>
                <th>Equipamento</th>
                <th>Status</th>
                <th>Data Criação</th>
                <th>Analista</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((chamado) => (
                <tr key={chamado.id} className={chamado.status}>
                  <td>#{chamado.id}</td>
                  <td className="colaborador-id">{chamado.colaborador_id}</td>
                  <td>{chamado.equipamento}</td>
                  <td>
                    <span className={`badge badge-${chamado.status}`}>
                      {chamado.status === 'aberto' ? '🟢 Aberto' : '⚫ Fechado'}
                    </span>
                  </td>
                  <td>{formatarData(chamado.data_criacao)}</td>
                  <td>{chamado.analista || '-'}</td>
                  <td>
                    {chamado.status === 'aberto' && (
                      <>
                        {chamadoFechando === chamado.id ? (
                          <div className="fechar-inline">
                            <input
                              type="text"
                              placeholder="Seu nome"
                              value={analistaFechamento}
                              onChange={(e) => setAnalistaFechamento(e.target.value)}
                              className="input-analista"
                              autoFocus
                            />
                            <button
                              onClick={() => handleFecharChamado(chamado.id)}
                              className="btn btn-confirmar"
                              disabled={loading}
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelarFechamento}
                              className="btn btn-cancelar"
                              disabled={loading}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => iniciarFechamento(chamado)}
                            className="btn btn-fechar"
                          >
                            Fechar
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="painel-footer">
        <a href="/">← Voltar ao Totem</a>
      </div>
    </div>
  );
};

export default PainelTI;
