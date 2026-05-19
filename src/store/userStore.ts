import { User } from '@/types';
import { api } from '@/lib/api';

class UserStore {
  private users: User[] = [];
  private currentUser: User | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadCurrentUserFromStorage();
  }

  private loadCurrentUserFromStorage() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
  }

  private saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async login(code: string, password: string): Promise<User> {
    try {
      const user = await api.login(code, password);
      this.currentUser = user;
      this.saveCurrentUser();
      this.notify();
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  logout() {
    this.currentUser = null;
    this.saveCurrentUser();
    this.notify();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'Administrador';
  }

  async fetchAll(): Promise<User[]> {
    try {
      const users = await api.getUsers();
      this.users = users.map((u: any) => ({
        ...u,
        createdAt: new Date(u.created_at),
      }));
      this.notify();
      return this.users;
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  getAll(): User[] {
    return [...this.users];
  }

  getAnalysts(): User[] {
    return this.users.filter((u) => u.role === 'Analista');
  }

  async add(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      const newUser = await api.createUser({
        name: userData.name,
        code: userData.code,
        email: userData.email,
        role: userData.role,
        password: userData.password,
      });

      const user: User = {
        ...newUser,
        createdAt: new Date(newUser.created_at),
      };

      this.users.push(user);
      this.notify();
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar usuário');
    }
  }

  async update(id: string, updates: Partial<User>) {
    try {
      await api.updateUser(id, updates);
      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updates };
        this.notify();
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao atualizar usuário');
    }
  }

  async delete(id: string) {
    try {
      await api.deleteUser(id);
      this.users = this.users.filter((u) => u.id !== id);
      this.notify();
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao excluir usuário');
    }
  }
}

export const userStore = new UserStore();
