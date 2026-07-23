# 📋 Instruções para Importar Colaboradores do Excel

## 1️⃣ Preparar o arquivo Excel

1. Coloque seu arquivo Excel na pasta `backend/` com o nome **`colaboradores.xlsx`**
2. Certifique-se que o Excel tem as seguintes colunas (os nomes podem variar):
   - `Full name` ou `full_name`
   - `First Name` ou `first_name`
   - `Last Name` ou `last_name`
   - `Employee number` ou `employee_number` (AS 4 LETRAS - ex: ALRR)
   - `Organization->Name` ou `organization_name`
   - `Status` (deve conter "Active" para colaboradores ativos)
   - `City` ou `city`
   - `Location->Name` ou `location_name`
   - `Email` ou `email`
   - `Phone` ou `phone`
   - `Function` ou `function` (FUNÇÃO/SETOR do colaborador)

## 2️⃣ Instalar a biblioteca necessária

No terminal, dentro da pasta `backend/`:

```bash
npm install xlsx
```

## 3️⃣ Executar a importação

Ainda na pasta `backend/`, execute:

```bash
node src/import-colaboradores.js
```

Você verá uma mensagem de sucesso como:

```
📊 Iniciando importação de colaboradores...
✅ 150 colaboradores encontrados no Excel
🗑️  Tabela limpa
✅ Importação concluída!
📥 Colaboradores importados: 150
❌ Erros: 0

📋 Primeiros colaboradores importados:
   ALRR - Abel Roberth Junior (Sorocaba) (Head of Software)
   JDOE - John Doe (Developer)
   ...
```

## 4️⃣ Como funciona

Depois da importação:

1. O colaborador digita as **4 letras** (ex: ALRR)
2. Automaticamente o sistema busca no banco de dados
3. Os campos **Nome** e **Setor** são preenchidos automaticamente
4. Se não encontrar, os campos ficam vazios para preenchimento manual

## 🔧 Troubleshooting

### Erro: "Cannot find module 'xlsx'"
**Solução:** Execute `npm install xlsx` na pasta backend/

### Erro: "ENOENT: no such file"
**Solução:** Verifique se o arquivo `colaboradores.xlsx` está na pasta `backend/`

### Colaborador não é encontrado ao digitar as 4 letras
**Solução:**
1. Verifique se o Employee Number no Excel está correto (4 letras)
2. Verifique se o Status é "Active"
3. Execute novamente a importação

### Ajustar o caminho do arquivo
Se o arquivo Excel está em outro lugar, edite o arquivo `backend/src/import-colaboradores.js` na linha 5:

```javascript
const excelFilePath = path.join(__dirname, '..', 'SEU_ARQUIVO.xlsx');
```

## 📊 Verificar os dados importados

Para ver todos os colaboradores importados, acesse:
```
http://localhost:3001/api/colaboradores
```

Para buscar um colaborador específico:
```
http://localhost:3001/api/colaboradores/ALRR
```

## 🔄 Reimportar dados

Para atualizar os dados:
1. Atualize o arquivo `colaboradores.xlsx`
2. Execute novamente: `node src/import-colaboradores.js`
3. A tabela será limpa e os dados serão importados novamente
