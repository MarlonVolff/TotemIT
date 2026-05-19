import { EquipmentRequest } from '@/types';
import { api } from '@/lib/api';

class RequestStore {
  private requests: EquipmentRequest[] = [];
  private listeners: Array<() => void> = [];
  private static instance: RequestStore;

  constructor() {
    if (RequestStore.instance) {
      return RequestStore.instance;
    }
    RequestStore.instance = this;
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

  async fetchAll(): Promise<EquipmentRequest[]> {
    try {
      const data = await api.getRequests();
      this.requests = data.map((r: any) => ({
        id: r.id,
        employeeName: r.employee_name,
        employeeCode: r.employee_code,
        equipment: r.equipment,
        team: r.team,
        observation: r.observation || '',
        status: r.status,
        analystCode: r.analyst_code,
        analystName: r.analyst_name,
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      }));
      this.notify();
      return this.requests;
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      throw error;
    }
  }

  getAll(): EquipmentRequest[] {
    return [...this.requests];
  }

  getById(id: string): EquipmentRequest | undefined {
    return this.requests.find((r) => r.id === id);
  }

  async add(request: Omit<EquipmentRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<EquipmentRequest> {
    try {
      const data = await api.createRequest({
        employee_name: request.employeeName,
        employee_code: request.employeeCode,
        equipment: request.equipment,
        team: request.team,
        observation: request.observation,
      });

      const newRequest: EquipmentRequest = {
        id: data.id,
        employeeName: data.employee_name,
        employeeCode: data.employee_code,
        equipment: data.equipment,
        team: data.team,
        observation: data.observation || '',
        status: data.status,
        analystCode: data.analyst_code,
        analystName: data.analyst_name,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      this.requests.unshift(newRequest);
      this.notify();
      return newRequest;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<EquipmentRequest>): Promise<void> {
    try {
      const apiUpdates: any = {};

      if (updates.status) {
        apiUpdates.status = updates.status;
      }

      if (updates.analystCode !== undefined) {
        apiUpdates.analyst_code = updates.analystCode;
      }

      if (updates.analystName !== undefined) {
        apiUpdates.analyst_name = updates.analystName;
      }

      await api.updateRequest(id, apiUpdates);

      const index = this.requests.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.requests[index] = {
          ...this.requests[index],
          ...updates,
          updatedAt: new Date(),
        };
        this.notify();
      }
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const stats = await api.getStats();
      return {
        total: stats.total || 0,
        open: stats.open || 0,
        inProgress: stats.in_progress || 0,
        completed: stats.completed || 0,
        waiting: stats.waiting || 0,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        completed: 0,
        waiting: 0,
      };
    }
  }
}

export const requestStore = new RequestStore();
