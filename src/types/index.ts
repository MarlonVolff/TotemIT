export type EquipmentType =
  | 'Carregador Notebook'
  | 'Headset'
  | 'Notebook Reserva'
  | 'Problema na mesa'
  | 'Outros';

export type RequestStatus = 'Aberto' | 'Em andamento' | 'Finalizado' | 'Aguardando retirada';

export type UserRole = 'Administrador' | 'Analista';

export interface User {
  id: string;
  name: string;
  code: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: Date;
}

export interface EquipmentRequest {
  id: string;
  employeeName: string;
  employeeCode: string;
  equipment: EquipmentType;
  team: string;
  observation: string;
  status: RequestStatus;
  analystCode?: string;
  analystName?: string;
  createdAt: Date;
  updatedAt: Date;
}
