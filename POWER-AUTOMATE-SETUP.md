# 🔔 Configurar Notificações no Microsoft Teams via Power Automate

Guia completo para receber notificações automáticas no Teams quando um chamado for aberto.

---

## 📋 Visão Geral

**Fluxo:**
1. Colaborador solicita equipamento no totem
2. Chamado é criado no sistema
3. Power Automate verifica novos chamados a cada X minutos
4. Envia mensagem no canal do Teams
5. Marca chamado como notificado

---

## 🚀 Parte 1: Endpoints Disponíveis

O backend agora tem endpoints específicos para o Power Automate:

### **1. Consultar Novos Chamados (Não Notificados)**
```
GET http://localhost:3001/api/notifications/pending
```

**Resposta:**
```json
{
  "count": 2,
  "notifications": [
    {
      "id": "REQ-123456789",
      "employeeName": "João Silva",
      "employeeCode": "JSLV",
      "equipment": "Mouse",
      "team": "Desenvolvimento",
      "observation": "Urgente",
      "createdAt": "2026-05-19T15:30:00",
      "message": "🔔 **Novo Chamado de Equipamento**\n\n**Solicitado por:** João Silva (JSLV)..."
    }
  ]
}
```

### **2. Marcar Como Notificado (Individual)**
```
POST http://localhost:3001/api/notifications/mark-notified/REQ-123456789
```

### **3. Marcar Vários Como Notificado**
```
POST http://localhost:3001/api/notifications/mark-notified-bulk
Body: { "ids": ["REQ-123", "REQ-456"] }
```

### **4. Resetar Notificações (Para Testes)**
```
POST http://localhost:3001/api/notifications/reset-notifications
```

---

## 🔧 Parte 2: Criar o Flow no Power Automate

### **Passo 1: Acessar Power Automate**

1. Acesse: https://make.powerautomate.com
2. Login com conta corporativa (@gft.com)
3. Clique em **"+ Criar"** → **"Fluxo de nuvem automatizado"**

### **Passo 2: Configurar Gatilho (Recorrência)**

1. Nome do Flow: `"Notificar Novos Chamados TI no Teams"`
2. Gatilho: **"Recorrência"**
3. Configurar:
   - **Intervalo:** `3` (ou o que preferir)
   - **Frequência:** `Minuto`
   - **Fuso horário:** `(UTC-03:00) Brasília`

### **Passo 3: Adicionar Ação HTTP**

1. Clique em **"+ Nova etapa"**
2. Procure: **"HTTP"**
3. Selecione: **"HTTP - HTTP"**
4. Configure:
   - **Método:** `GET`
   - **URI:** `http://SEU-IP:3001/api/notifications/pending`
   
   ⚠️ **Substitua `SEU-IP`** pelo IP do servidor (ex: `192.168.1.100` ou `localhost` se rodar na mesma máquina)

5. **Cabeçalhos:**
   ```
   Content-Type: application/json
   ```

### **Passo 4: Verificar Se Há Novos Chamados**

1. Clique em **"+ Nova etapa"**
2. Procure: **"Condição"**
3. Configure:
   - **Se:** `Body('HTTP')?['count']`
   - **é maior que:** `0`

### **Passo 5: Aplicar a Cada Notificação (SE SIM)**

1. No lado **"Se sim"** da condição
2. Adicione: **"Aplicar a cada"**
3. Selecionar uma saída das etapas anteriores:
   - Escolha: `body('HTTP')?['notifications']`

### **Passo 6: Postar Mensagem no Teams**

1. Dentro do **"Aplicar a cada"**, adicione:
   - **"Postar mensagem em um chat ou canal"** (Microsoft Teams)

2. Configure:
   - **Postar como:** `Flow bot`
   - **Postar em:** `Canal`
   - **Equipe:** Selecione sua equipe
   - **Canal:** Selecione o canal (ex: "TI - Equipamentos")
   - **Mensagem:**
     ```
     @{items('Aplicar_a_cada')?['message']}
     ```

### **Passo 7: Marcar Como Notificado**

1. Ainda dentro do **"Aplicar a cada"**, adicione nova ação:
   - **"HTTP"**

2. Configure:
   - **Método:** `POST`
   - **URI:** 
     ```
     http://SEU-IP:3001/api/notifications/mark-notified/@{items('Aplicar_a_cada')?['id']}
     ```
   - **Cabeçalhos:**
     ```
     Content-Type: application/json
     ```

### **Passo 8: Salvar e Testar**

1. Clique em **"Salvar"**
2. Clique em **"Testar"** → **"Manualmente"**
3. Crie um chamado no totem
4. Aguarde o intervalo configurado (3 minutos)
5. Verifique se chegou no Teams!

---

## 🎨 Formato da Mensagem no Teams

A mensagem que aparecerá no Teams:

```
🔔 **Novo Chamado de Equipamento**

**Solicitado por:** João Silva (JSLV)
**Equipamento:** Mouse
**Equipe/Setor:** Desenvolvimento
**ID do Chamado:** REQ-1731849234567-abc123
**Horário:** 19/05/2026 15:30:45

**Observação:** Mouse com fio USB urgente

[Acessar Painel Administrativo](http://localhost:5173/admin)
```

---

## 🔍 Parte 3: Testar Localmente

### **Testar Endpoints**

```bash
# 1. Ver chamados pendentes de notificação
curl http://localhost:3001/api/notifications/pending

# 2. Criar um chamado no totem
# Abra: http://localhost:5173/totem

# 3. Verificar novamente
curl http://localhost:3001/api/notifications/pending

# 4. Marcar como notificado (teste)
curl -X POST http://localhost:3001/api/notifications/mark-notified/REQ-123456789

# 5. Resetar para testar novamente
curl -X POST http://localhost:3001/api/notifications/reset-notifications
```

---

## ⚙️ Configurações Avançadas

### **Alterar Intervalo de Verificação**

No Power Automate, ajuste a **Recorrência:**
- **1 minuto:** Notificação quase instantânea (mais requisições)
- **5 minutos:** Balanceado (recomendado)
- **15 minutos:** Economia de requisições

### **Mencionar Pessoas no Teams**

Na mensagem do Teams, você pode mencionar:
```
<at>João Silva</at> novo chamado para você!
```

### **Adicionar Botões Interativos**

Usar **Adaptive Cards** para criar botões:
- "Pegar Chamado"
- "Ver Detalhes"
- "Atribuir para Mim"

---

## 🆘 Solução de Problemas

### **Flow não executa**
- Verifique se está salvo e ativado
- Veja histórico de execuções no Power Automate

### **Erro ao conectar na API**
- Verifique se o backend está rodando
- Teste a URL no navegador: `http://SEU-IP:3001/api/notifications/pending`
- Verifique firewall/rede

### **Mensagem não aparece no Teams**
- Verifique permissões do Flow bot no canal
- Teste postar mensagem manualmente primeiro

### **Notificações duplicadas**
- Verifique se o endpoint `mark-notified` está sendo chamado
- Veja o campo `notified` no banco: `SELECT * FROM equipment_requests`

---

## 📊 Monitoramento

### **Ver Histórico de Notificações**

```sql
-- Ver todos os chamados e status de notificação
SELECT id, employee_name, equipment, notified, created_at
FROM equipment_requests
ORDER BY created_at DESC;

-- Contar notificações enviadas
SELECT notified, COUNT(*) as total
FROM equipment_requests
GROUP BY notified;
```

---

## 🎉 Pronto!

Agora seu sistema está integrado com o Microsoft Teams!

**Fluxo Completo:**
1. ✅ Colaborador solicita no totem
2. ✅ Sistema registra no banco
3. ✅ Power Automate consulta a cada X minutos
4. ✅ Mensagem enviada no Teams
5. ✅ Chamado marcado como notificado
6. ✅ Analistas veem e pegam o chamado

**Benefícios:**
- 🔔 Notificação automática
- 📱 Funciona em mobile/desktop
- 🚀 Analistas respondem mais rápido
- 📊 Rastreável e auditável

---

## 📞 Contato

Se tiver dúvidas ou precisar de ajustes, consulte a documentação do Power Automate ou peça ajuda à equipe de TI.

✨ **Sistema profissional com notificações automáticas!**
