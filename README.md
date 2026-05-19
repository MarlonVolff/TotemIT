# 🖥️ Sistema de Totem para Solicitação de Equipamentos TI

Sistema completo para gerenciamento de solicitações de equipamentos através de totem (tablet) com painel administrativo para a equipe de TI.

## 📋 Funcionalidades

### Totem (Colaboradores)
- Interface intuitiva para tablet
- Seleção visual de equipamentos
- Identificação rápida com 4 letras
- Confirmação de solicitação

### Painel TI (Administrativo)
- Login seguro com JWT
- Visualização de chamados em tempo real
- Filtros: abertos, fechados, todos
- Fechamento de chamados com registro do analista
- Atualização automática a cada 10 segundos

## 🚀 Tecnologias

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express
- **Banco de Dados**: SQLite
- **Autenticação**: JWT (jsonwebtoken)

## 📦 Instalação

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## ▶️ Como Executar

### 1. Iniciar o Backend

```bash
cd backend
npm start
```

O backend irá rodar em: `http://localhost:3001`

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin123`

### 2. Iniciar o Frontend

```bash
cd frontend
npm start
```

O frontend irá rodar em: `http://localhost:3000`

## 📱 Acesso via Tablet

Para testar no tablet:

1. Certifique-se de que o PC e o tablet estão na mesma rede Wi-Fi
2. Descubra o IP local do seu PC:
   - Windows: `ipconfig` (procure por IPv4)
   - Mac/Linux: `ifconfig` ou `ip addr`
3. No navegador do tablet, acesse:
   - Totem: `http://<IP_DO_PC>:3000`
   - Painel TI: `http://<IP_DO_PC>:3000/painel-ti`

**Exemplo:**
- Se o IP do PC for `192.168.1.100`
- Acesse: `http://192.168.1.100:3000`

## 🎯 Fluxo de Uso

### Colaborador (Totem)
1. Acessa o totem no tablet
2. Seleciona o equipamento desejado
3. Insere suas 4 letras de identificação (ex: ABCD)
4. Confirma a solicitação
5. Recebe mensagem de sucesso

### Analista de TI (Painel)
1. Acessa `/painel-ti`
2. Faz login com usuário e senha
3. Visualiza lista de chamados abertos
4. Quando atende o colaborador:
   - Clica em "Fechar"
   - Insere seu nome
   - Confirma o fechamento
5. Chamado é marcado como fechado

## 📂 Estrutura do Projeto

```
totem-equipamentos/
├── backend/
│   ├── src/
│   │   ├── server.js          # Servidor Express
│   │   ├── database.js        # Configuração SQLite
│   │   ├── routes/
│   │   │   ├── chamados.js    # Rotas de chamados
│   │   │   └── auth.js        # Autenticação
│   │   └── middleware/
│   │       └── auth.js        # Middleware JWT
│   ├── database.sqlite        # Banco de dados (criado automaticamente)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js             # Rotas principais
    │   ├── pages/
    │   │   ├── Totem.jsx      # Interface do totem
    │   │   └── PainelTI.jsx   # Painel administrativo
    │   ├── components/
    │   │   └── CardEquipamento.jsx
    │   └── services/
    │       └── api.js         # Cliente API
    └── package.json
```

## 🔒 API Endpoints

### Públicos
- `POST /api/chamados` - Criar chamado

### Protegidos (requer autenticação)
- `POST /api/auth/login` - Login TI
- `GET /api/auth/verify` - Verificar token
- `GET /api/chamados` - Listar chamados
- `PATCH /api/chamados/:id/fechar` - Fechar chamado

## 🛠️ Equipamentos Incluídos

- Carregador de Notebook 🔌
- Mouse USB 🖱️
- Teclado USB ⌨️
- Cabo HDMI 📺
- Cabo de Rede 🔗
- Headset 🎧
- Adaptador USB-C 🔄
- Mousepad 📋

## 🔧 Configuração

### Alterar Porta do Backend

Edite `backend/src/server.js`:
```javascript
const PORT = 3001; // Altere para a porta desejada
```

### Alterar URL da API no Frontend

Edite `frontend/src/services/api.js`:
```javascript
baseURL: 'http://localhost:3001/api' // Altere para o IP/porta do backend
```

### Adicionar Novo Usuário TI

Execute no banco de dados ou crie um endpoint administrativo para adicionar usuários.

## 📝 Próximas Melhorias

- [ ] Notificações em tempo real com WebSockets
- [ ] Dashboard com estatísticas
- [ ] Histórico completo com busca
- [ ] Cadastro de novos equipamentos via interface
- [ ] Múltiplos níveis de acesso
- [ ] Integração com Active Directory
- [ ] Modo offline com sincronização
- [ ] Impressão de comprovante

## 🐛 Troubleshooting

### Backend não inicia
- Verifique se a porta 3001 está livre
- Execute `npm install` novamente

### Frontend não se conecta ao backend
- Verifique se o backend está rodando
- Confirme a URL da API em `services/api.js`
- Desabilite CORS temporariamente para testar

### Tablet não acessa
- Confirme que estão na mesma rede
- Teste o IP no navegador do próprio PC primeiro
- Verifique firewall do Windows

## 📄 Licença

Este projeto é de uso interno para fins educacionais e de demonstração.

## 👨‍💻 Desenvolvido por

Sistema desenvolvido com Claude Code para gerenciamento de solicitações de equipamentos TI.
