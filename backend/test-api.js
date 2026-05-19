// Script de teste da API
const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
let token = '';

async function testarAPI() {
  console.log('\n========================================');
  console.log('  Teste da API do Sistema de Totem');
  console.log('========================================\n');

  try {
    // 1. Teste de health check
    console.log('1. Testando health check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('   ✓ Backend funcionando:', health.data.mensagem);

    // 2. Criar chamado
    console.log('\n2. Criando chamado...');
    const chamado = await axios.post(`${API_URL}/chamados`, {
      colaborador_id: 'TEST',
      equipamento: 'Mouse USB'
    });
    console.log('   ✓ Chamado criado:', chamado.data);

    // 3. Login
    console.log('\n3. Fazendo login como TI...');
    const login = await axios.post(`${API_URL}/auth/login`, {
      usuario: 'admin',
      senha: 'admin123'
    });
    token = login.data.token;
    console.log('   ✓ Login realizado. Token recebido.');

    // 4. Verificar token
    console.log('\n4. Verificando token...');
    const verify = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✓ Token válido:', verify.data);

    // 5. Listar chamados
    console.log('\n5. Listando chamados...');
    const chamados = await axios.get(`${API_URL}/chamados`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   ✓ Total de chamados: ${chamados.data.length}`);
    console.log('   Últimos chamados:', chamados.data.slice(0, 3));

    // 6. Fechar chamado
    console.log('\n6. Fechando o chamado criado...');
    const fechar = await axios.patch(
      `${API_URL}/chamados/${chamado.data.id}/fechar`,
      { analista: 'Teste Automatizado' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   ✓ Chamado fechado:', fechar.data);

    console.log('\n========================================');
    console.log('  ✓ Todos os testes passaram!');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Erro no teste:', error.response?.data || error.message);
    console.log('\nCertifique-se de que o backend está rodando: npm start\n');
  }
}

testarAPI();
