import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Ticket,
  CheckCircle2,
  Clock,
  LogOut,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import Header from '../components/Header';
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
  const [busca, setBusca] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    abertos: 0,
    finalizados: 0,
    hoje: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verificarToken();
    }
  }, []);

  useEffect(() => {
    if (autenticado) {
      carregarChamados();
      const interval = setInterval(carregarChamados, 30000); // Atualiza a cada 30s
      return () => clearInterval(interval);
    }
  }, [autenticado, filtroStatus, busca]);

  const verificarToken = async () => {
    // Por enquanto, apenas verifica se existe token
    // TODO: Implementar verificação real no backend
    const token = localStorage.getItem('token');
    if (token) {
      setAutenticado(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await api.post('/users/login', {
        code: usuario,
        password: senha
      });

      // Salva os dados do usuário
      localStorage.setItem('token', 'logged_in'); // Token simples por enquanto
      localStorage.setItem('user', JSON.stringify(response.data));
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
      const response = await api.get('/requests');
      let todosChamados = response.data;

      // Calcular estatísticas
      const hoje = new Date().toISOString().split('T')[0];
      const stats = {
        total: todosChamados.length,
        abertos: todosChamados.filter(c => c.status === 'Aberto').length,
        finalizados: todosChamados.filter(c => c.status === 'Finalizado').length,
        hoje: todosChamados.filter(c => c.created_at.startsWith(hoje)).length
      };
      setStats(stats);

      // Filtrar por status se necessário
      let chamadosFiltrados = todosChamados;
      if (filtroStatus !== 'todos') {
        chamadosFiltrados = todosChamados.filter(c =>
          c.status.toLowerCase() === filtroStatus.toLowerCase()
        );
      }

      // Filtrar por busca
      if (busca.trim()) {
        chamadosFiltrados = chamadosFiltrados.filter(c =>
          c.employee_name.toLowerCase().includes(busca.toLowerCase()) ||
          c.employee_code.toLowerCase().includes(busca.toLowerCase()) ||
          c.equipment.toLowerCase().includes(busca.toLowerCase()) ||
          c.id.toLowerCase().includes(busca.toLowerCase())
        );
      }

      setChamados(chamadosFiltrados);
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
      await api.put(`/requests/${chamadoId}`, {
        status: 'Finalizado',
        analyst_name: analistaFechamento
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
          {/* Left Side - Login Form */}
          <div className="login-form-side">
            <h1>
              <span className="admin-text">Admin</span> Login - GFT
            </h1>
            <p>Entre com as suas credenciais</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>4letras</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Informe suas 4 letras"
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
                  placeholder="Coloque sua senha"
                  disabled={loading}
                />
              </div>

              {erro && <div className="erro-login">{erro}</div>}

              <button type="submit" className="btn btn-login" disabled={loading}>
                {loading ? 'Acessando...' : 'Acessar'}
              </button>
            </form>

            <div className="login-footer">
              <a href="/">← Voltar ao Totem</a>
              <p className="credenciais-padrao">
                <small>Usuário padrão: <strong>ADMN</strong> / Senha: <strong>admin123</strong></small>
              </p>
            </div>
          </div>

          {/* Right Side - Dashboard Preview */}
          <div className="login-preview-side">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-header-dot"></div>
                <div className="preview-header-dot"></div>
                <div className="preview-header-dot"></div>
                <span className="preview-title">Admin Dashboard</span>
              </div>

              <div className="preview-stats">
                <div className="preview-stat-card">
                  <div className="preview-stat-value">335</div>
                  <div className="preview-stat-label">Total de Chamados</div>
                </div>
                <div className="preview-stat-card">
                  <div className="preview-stat-value">240</div>
                  <div className="preview-stat-label">Abertos</div>
                </div>
                <div className="preview-stat-card">
                  <div className="preview-stat-value">45</div>
                  <div className="preview-stat-label">Finalizados</div>
                </div>
                <div className="preview-stat-card">
                  <div className="preview-stat-value">150</div>
                  <div className="preview-stat-label">Criados Hoje</div>
                </div>
              </div>

              <div className="preview-chart">
                <div className="preview-bar"></div>
                <div className="preview-bar"></div>
                <div className="preview-bar"></div>
                <div className="preview-bar"></div>
                <div className="preview-bar"></div>
                <div className="preview-bar"></div>
                <div className="preview-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="itsm-container">
        {/* Sidebar */}
        <aside className="itsm-sidebar">
          <nav className="sidebar-nav">
            <button className="nav-item active">
              <Ticket size={20} />
              <span>Chamados</span>
            </button>
            <button className="nav-item" disabled>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="itsm-main">
          {/* Page Header */}
          <div className="page-header-itsm">
            <div>
              <h1 className="page-title-itsm">Gerenciamento de Chamados</h1>
              <p className="page-subtitle-itsm">Service Desk - Equipamentos TI</p>
            </div>
            <button onClick={carregarChamados} className="btn-refresh" title="Atualizar">
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <Ticket size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total de Chamados</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon open">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.abertos}</div>
                <div className="stat-label">Abertos</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon closed">
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.finalizados}</div>
                <div className="stat-label">Finalizados</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon today">
                <LayoutDashboard size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.hoje}</div>
                <div className="stat-label">Hoje</div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="toolbar">
            <div className="filters-group">
              <button
                className={`filter-chip ${filtroStatus === 'aberto' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('aberto')}
              >
                <Clock size={16} />
                Abertos
              </button>
              <button
                className={`filter-chip ${filtroStatus === 'finalizado' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('finalizado')}
              >
                <CheckCircle2 size={16} />
                Finalizados
              </button>
              <button
                className={`filter-chip ${filtroStatus === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('todos')}
              >
                <Filter size={16} />
                Todos
              </button>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar por colaborador, código ou equipamento..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          {/* Tickets Table */}
          <div className="tickets-container">
            {chamados.length === 0 ? (
              <div className="empty-state">
                <Ticket size={48} />
                <h3>Nenhum chamado encontrado</h3>
                <p>
                  {filtroStatus === 'aberto'
                    ? 'Não há chamados abertos no momento'
                    : busca
                    ? 'Nenhum resultado para sua busca'
                    : 'Nenhum chamado registrado'}
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Colaborador</th>
                      <th>Equipamento</th>
                      <th>Status</th>
                      <th>Criado em</th>
                      <th>Analista</th>
                      <th className="actions-col">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chamados.map((chamado) => (
                      <tr key={chamado.id}>
                        <td>
                          <span className="ticket-id">{chamado.id}</span>
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {chamado.employee_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div className="user-info">
                              <div className="user-name">{chamado.employee_name}</div>
                              <div className="user-code">{chamado.employee_code}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="equipment-name">{chamado.equipment}</span>
                        </td>
                        <td>
                          <span className={`status-badge status-${chamado.status.toLowerCase()}`}>
                            {chamado.status === 'Aberto' ? 'Aberto' : 'Finalizado'}
                          </span>
                        </td>
                        <td>
                          <span className="date-text">{formatarData(chamado.created_at)}</span>
                        </td>
                        <td>
                          <span className="analyst-name">
                            {chamado.analyst_name || '-'}
                          </span>
                        </td>
                        <td className="actions-col">
                          {chamado.status === 'Aberto' && (
                            <>
                              {chamadoFechando === chamado.id ? (
                                <div className="action-inline">
                                  <input
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={analistaFechamento}
                                    onChange={(e) => setAnalistaFechamento(e.target.value)}
                                    className="analyst-input"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleFecharChamado(chamado.id)}
                                    className="btn-action confirm"
                                    disabled={loading || !analistaFechamento.trim()}
                                    title="Confirmar"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                  <button
                                    onClick={cancelarFechamento}
                                    className="btn-action cancel"
                                    disabled={loading}
                                    title="Cancelar"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => iniciarFechamento(chamado)}
                                  className="btn-close-ticket"
                                >
                                  Finalizar
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default PainelTI;
