const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Users
  async login(code: string, password: string) {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    return response.json();
  },

  async getUsers() {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    return response.json();
  },

  async createUser(userData: any) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar usuário');
    }

    return response.json();
  },

  async updateUser(id: string, updates: any) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Erro ao atualizar usuário');
    return response.json();
  },

  async deleteUser(id: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erro ao excluir usuário');
    return response.json();
  },

  // Requests
  async getRequests() {
    const response = await fetch(`${API_URL}/requests`);
    if (!response.ok) throw new Error('Erro ao buscar solicitações');
    return response.json();
  },

  async getRequestById(id: string) {
    const response = await fetch(`${API_URL}/requests/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar solicitação');
    return response.json();
  },

  async createRequest(requestData: any) {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error('Erro ao criar solicitação');
    return response.json();
  },

  async updateRequest(id: string, updates: any) {
    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Erro ao atualizar solicitação');
    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_URL}/requests/stats/summary`);
    if (!response.ok) throw new Error('Erro ao buscar estatísticas');
    return response.json();
  },
};
