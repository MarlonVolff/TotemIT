# 🔐 Guia de Segurança

## ⚠️ Credenciais Padrão Removidas

As credenciais padrão (`ADMN` / `admin123`) foram **removidas** do código por questões de segurança.

## 👤 Como Criar o Primeiro Usuário Admin

### Método 1: Script Interativo (Recomendado)

```bash
cd backend
node src/create-admin.js
```

O script irá perguntar:
- Nome completo
- Código (4 letras)
- Email
- Senha

**Exemplo:**
```
Nome completo: João Silva
Código (4 letras): JOAO
Email: joao.silva@empresa.com
Senha: SenhaSegura123!
```

### Método 2: Diretamente no Banco SQLite

```bash
cd backend
sqlite3 database.sqlite
```

```sql
INSERT INTO users (id, name, code, email, role, password, created_at)
VALUES (
  'admin-' || strftime('%s', 'now'),
  'Seu Nome',
  'XXXX',
  'seu.email@empresa.com',
  'Administrador',
  'SuaSenhaSegura',
  datetime('now')
);
```

## 🔒 Boas Práticas de Segurança

### 1. Senhas Fortes
- ✅ Mínimo 12 caracteres
- ✅ Misture letras maiúsculas e minúsculas
- ✅ Inclua números e símbolos
- ❌ Não use senhas óbvias (admin123, 123456, senha)

### 2. Códigos de Usuário
- Use códigos únicos e não óbvios
- Evite usar "ADMN", "ADMIN", "ROOT"
- Exemplo: Use as iniciais + número (JOS1, MAR2)

### 3. Produção
- **NUNCA** comite credenciais no Git
- Use variáveis de ambiente para senhas
- Implemente hash de senhas (bcrypt) - **IMPORTANTE!**

## ⚠️ CRÍTICO: Senhas em Texto Plano

**ATENÇÃO:** Atualmente as senhas estão sendo armazenadas **SEM CRIPTOGRAFIA** no banco de dados!

Para produção, você **DEVE**:
1. Instalar bcrypt: `npm install bcrypt`
2. Hash as senhas antes de salvar
3. Comparar hash no login

### Exemplo de implementação segura:

```javascript
// Ao criar usuário:
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(senha, 10);

// Ao fazer login:
const senhaValida = await bcrypt.compare(senhaDigitada, senhaHashDoBanco);
```

## 📝 Checklist de Segurança

- [ ] Remover credenciais padrão do código ✅ (Feito!)
- [ ] Criar usuário admin com senha forte
- [ ] Implementar hash de senhas (bcrypt)
- [ ] Usar HTTPS em produção
- [ ] Configurar variáveis de ambiente
- [ ] Implementar rate limiting no login
- [ ] Adicionar logs de acesso
- [ ] Configurar timeout de sessão

## 🚨 Em Caso de Comprometimento

Se você suspeitar que as credenciais foram comprometidas:

1. **Troque a senha imediatamente**
2. **Verifique os logs de acesso**
3. **Revise as solicitações recentes**
4. **Considere criar um novo usuário**

## 📞 Suporte

Para dúvidas sobre segurança, consulte a equipe de TI.
