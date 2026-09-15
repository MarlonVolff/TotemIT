const XLSX = require('xlsx');
const db = require('./database');
const path = require('path');

// Caminho para o arquivo Excel (ajuste conforme necessário)
const excelFilePath = path.join(__dirname, '..', 'colaboradores.xlsx');

console.log('📊 Iniciando importação de colaboradores...');
console.log(`📁 Arquivo: ${excelFilePath}`);

async function importar() {
  try {
    // Ler o arquivo Excel
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; // Primeira aba
    const worksheet = workbook.Sheets[sheetName];

    // Converter para JSON
    const colaboradores = XLSX.utils.sheet_to_json(worksheet);

    console.log(`✅ ${colaboradores.length} colaboradores encontrados no Excel`);

    // Limpar tabela antes de importar
    db.run('DELETE FROM colaboradores', [], async (err) => {
      if (err) {
        console.error('❌ Erro ao limpar tabela:', err);
        return;
      }

      console.log('🗑️  Tabela limpa');

      let imported = 0;
      let errors = 0;

      // Inserir cada colaborador
      for (const [index, colab] of colaboradores.entries()) {
        // Mapear os nomes das colunas do Excel
        const employeeNumber = colab['Employee number'] || colab['employee_number'];
        const fullName = colab['Full name'] || colab['full_name'];
        const firstName = colab['First Name'] || colab['first_name'];
        const lastName = colab['Last Name'] || colab['last_name'];
        const orgName = colab['Organization->Name'] || colab['organization_name'];
        const status = colab['Status'] || colab['status'];
        const city = colab['City'] || colab['city'];
        const locationName = colab['Location->Name'] || colab['location_name'];
        const email = colab['Email'] || colab['email'];
        const phone = colab['Phone'] || colab['phone'];
        const func = colab['Function'] || colab['function'];

        if (!employeeNumber) {
          console.warn(`⚠️  Linha ${index + 2}: Employee number vazio, pulando...`);
          errors++;
          continue;
        }

        try {
          await new Promise((resolve, reject) => {
            db.run(
              `INSERT INTO colaboradores (
                employee_number, full_name, first_name, last_name,
                organization_name, status, city, location_name,
                email, phone, function
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                employeeNumber,
                fullName || '',
                firstName || '',
                lastName || '',
                orgName || '',
                status || '',
                city || '',
                locationName || '',
                email || '',
                phone || '',
                func || ''
              ],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
          imported++;
        } catch (err) {
          console.error(`❌ Erro ao importar ${employeeNumber}:`, err.message);
          errors++;
        }
      }

      console.log('\n===========================================');
      console.log('✅ Importação concluída!');
      console.log(`📥 Colaboradores importados: ${imported}`);
      console.log(`❌ Erros: ${errors}`);
      console.log('===========================================\n');

      // Mostrar alguns exemplos
      db.all('SELECT employee_number, full_name, function FROM colaboradores LIMIT 5', [], (err, rows) => {
        if (!err && rows.length > 0) {
          console.log('📋 Primeiros colaboradores importados:');
          rows.forEach(row => {
            console.log(`   ${row.employee_number} - ${row.full_name} (${row.function})`);
          });
        }

        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Erro ao ler arquivo Excel:', error.message);
    console.error('\n💡 Dicas:');
    console.error('   1. Verifique se o arquivo "colaboradores.xlsx" existe na pasta backend/');
    console.error('   2. Instale a biblioteca xlsx: npm install xlsx');
    console.error('   3. Verifique se o caminho do arquivo está correto');
    process.exit(1);
  }
}

importar();
