import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  History,
  BarChart3,
  Users as UsersIcon,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Menu,
  LogOut,
  UserPlus,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { requestStore } from '@/store/requestStore';
import { userStore } from '@/store/userStore';
import { EquipmentRequest, RequestStatus, User, UserRole } from '@/types';

const menuItems = [
  { icon: LayoutDashboard, label: 'Solicitações', id: 'requests' },
  { icon: Package, label: 'Equipamentos', id: 'equipment' },
  { icon: History, label: 'Histórico', id: 'history' },
  { icon: BarChart3, label: 'Relatórios', id: 'reports' },
  { icon: UsersIcon, label: 'Usuários', id: 'users' },
  { icon: Settings, label: 'Configurações', id: 'settings' },
];

const statusVariants: Record<RequestStatus, 'default' | 'warning' | 'success' | 'secondary'> = {
  'Aberto': 'default',
  'Em andamento': 'warning',
  'Finalizado': 'success',
  'Aguardando retirada': 'secondary',
};

export function AdminPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('requests');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState(userStore.getCurrentUser());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    code: '',
    email: '',
    role: 'Analista' as UserRole,
    password: '',
  });
  const itemsPerPage = 10;

  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, completed: 0, waiting: 0 });

  useEffect(() => {
    if (!userStore.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          requestStore.fetchAll(),
          userStore.fetchAll(),
        ]);
        setRequests(requestStore.getAll());
        setUsers(userStore.getAll());
        const statsData = await requestStore.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();

    const loadFromStore = () => {
      setRequests(requestStore.getAll());
      setUsers(userStore.getAll());
      setCurrentUser(userStore.getCurrentUser());
    };

    const unsubscribeRequests = requestStore.subscribe(loadFromStore);
    const unsubscribeUsers = userStore.subscribe(loadFromStore);

    return () => {
      unsubscribeRequests();
      unsubscribeUsers();
    };
  }, [navigate]);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.team.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    try {
      await requestStore.update(id, { status: newStatus });
      const statsData = await requestStore.getStats();
      setStats(statsData);
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const handleTakeRequest = async (request: EquipmentRequest) => {
    if (!currentUser) return;

    try {
      await requestStore.update(request.id, {
        analystCode: currentUser.code,
        analystName: currentUser.name,
        status: 'Em andamento',
      });
      const statsData = await requestStore.getStats();
      setStats(statsData);
    } catch (error) {
      alert('Erro ao pegar chamado');
    }
  };

  const handleLogout = () => {
    userStore.logout();
    navigate('/login');
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userStore.add(newUser);
      setShowUserModal(false);
      setNewUser({
        name: '',
        code: '',
        email: '',
        role: 'Analista',
        password: '',
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userStore.delete(id);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const renderRequestsContent = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Chamados Abertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{stats.open}</div>
            <p className="text-xs text-slate-600 mt-1">Aguardando atendimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{stats.inProgress}</div>
            <p className="text-xs text-slate-600 mt-1">Sendo processados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Finalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{stats.completed}</div>
            <p className="text-xs text-slate-600 mt-1">Concluídos hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Aguardando Retirada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{stats.waiting}</div>
            <p className="text-xs text-slate-600 mt-1">Prontos para retirada</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Buscar por colaborador, código, equipamento ou equipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'Aberto' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('Aberto')}
                size="sm"
              >
                Abertos
              </Button>
              <Button
                variant={statusFilter === 'Em andamento' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('Em andamento')}
                size="sm"
              >
                Em Andamento
              </Button>
              <Button
                variant={statusFilter === 'Finalizado' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('Finalizado')}
                size="sm"
              >
                Finalizados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Colaborador
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Código
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Equipamento
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Equipe
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Analista
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {request.employeeName}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-900">
                    {request.employeeCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {request.equipment}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {request.team}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {request.analystCode ? (
                      <div>
                        <div className="font-medium text-slate-900">{request.analystName}</div>
                        <div className="text-xs text-slate-600 font-mono">{request.analystCode}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Não atribuído</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {request.createdAt.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariants[request.status]}>
                      {request.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {!request.analystCode && request.status === 'Aberto' && (
                        <Button
                          size="sm"
                          onClick={() => handleTakeRequest(request)}
                          className="h-8 text-xs"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          Pegar
                        </Button>
                      )}
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleStatusChange(request.id, e.target.value as RequestStatus)
                        }
                        className="text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Aberto">Aberto</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Aguardando retirada">Aguardando retirada</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-sm">Nenhuma solicitação encontrada</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, filteredRequests.length)} de{' '}
              {filteredRequests.length} resultados
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );

  const renderUsersContent = () => (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Gerenciamento de Usuários</h2>
          <p className="text-sm text-slate-600 mt-1">
            Adicione e gerencie analistas do sistema
          </p>
        </div>
        {userStore.isAdmin() && (
          <Button onClick={() => setShowUserModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Nome
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Código
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Função
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Criado em
                </th>
                {userStore.isAdmin() && (
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-900">
                    {user.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={user.role === 'Administrador' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.createdAt.toLocaleDateString('pt-BR')}
                  </td>
                  {userStore.isAdmin() && (
                    <td className="px-6 py-4">
                      {user.id !== 'admin-default' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Novo Usuário */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Adicionar Novo Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome Completo
                  </label>
                  <Input
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código (4 letras)
                  </label>
                  <Input
                    required
                    maxLength={4}
                    value={newUser.code}
                    onChange={(e) => setNewUser({ ...newUser, code: e.target.value.toUpperCase() })}
                    placeholder="Ex: JSLV"
                    className="uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <Input
                    required
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="joao.silva@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Função
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Analista">Analista</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Senha
                  </label>
                  <Input
                    required
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Digite a senha"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-sm">Central TI</h1>
                <p className="text-xs text-slate-400">Painel Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === item.id
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {activeMenu === 'requests' && 'Solicitações de Equipamentos'}
                {activeMenu === 'users' && 'Usuários'}
                {activeMenu === 'equipment' && 'Equipamentos'}
                {activeMenu === 'history' && 'Histórico'}
                {activeMenu === 'reports' && 'Relatórios'}
                {activeMenu === 'settings' && 'Configurações'}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {activeMenu === 'requests' && 'Gerencie as solicitações de equipamentos da equipe'}
                {activeMenu === 'users' && 'Gerencie os usuários do sistema'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{currentUser?.name}</p>
                <p className="text-xs text-slate-600">{currentUser?.email}</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser?.code}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {activeMenu === 'requests' && renderRequestsContent()}
          {activeMenu === 'users' && renderUsersContent()}
          {activeMenu !== 'requests' && activeMenu !== 'users' && (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Em Desenvolvimento
              </h3>
              <p className="text-slate-600">
                Esta funcionalidade estará disponível em breve.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
