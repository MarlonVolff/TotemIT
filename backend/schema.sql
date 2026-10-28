-- ============================================
-- SCHEMA POSTGRESQL - Sistema Totem Equipamentos TI
-- ============================================

-- Tabela de Usuários (Administradores)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Colaboradores
CREATE TABLE IF NOT EXISTS colaboradores (
  employee_number VARCHAR(10) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  organization_name VARCHAR(255),
  status VARCHAR(50),
  city VARCHAR(100),
  location_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  function VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Solicitações de Equipamentos
CREATE TABLE IF NOT EXISTS equipment_requests (
  id VARCHAR(50) PRIMARY KEY,
  employee_name VARCHAR(255) NOT NULL,
  employee_code VARCHAR(10) NOT NULL,
  equipment VARCHAR(255) NOT NULL,
  team VARCHAR(255) NOT NULL,
  observation TEXT,
  status VARCHAR(50) DEFAULT 'Aberto',
  analyst_code VARCHAR(10),
  analyst_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_code ON users(code);
CREATE INDEX IF NOT EXISTS idx_colaboradores_status ON colaboradores(status);
CREATE INDEX IF NOT EXISTS idx_colaboradores_employee_number ON colaboradores(employee_number);
CREATE INDEX IF NOT EXISTS idx_equipment_requests_status ON equipment_requests(status);
CREATE INDEX IF NOT EXISTS idx_equipment_requests_employee_code ON equipment_requests(employee_code);
CREATE INDEX IF NOT EXISTS idx_equipment_requests_created_at ON equipment_requests(created_at);

-- Comentários nas tabelas
COMMENT ON TABLE users IS 'Tabela de usuários administradores do sistema';
COMMENT ON TABLE colaboradores IS 'Tabela de colaboradores da empresa';
COMMENT ON TABLE equipment_requests IS 'Tabela de solicitações de equipamentos TI';

-- Inserir usuário admin padrão
INSERT INTO users (id, name, code, email, role, password, created_at)
VALUES (
  'admin-default',
  'Administrador',
  'ADMN',
  'admin@empresa.com',
  'Administrador',
  'admin123',
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Schema PostgreSQL criado com sucesso!';
  RAISE NOTICE '📋 Tabelas criadas: users, colaboradores, equipment_requests';
  RAISE NOTICE '🔐 Usuário admin padrão: ADMN / admin123';
END $$;
