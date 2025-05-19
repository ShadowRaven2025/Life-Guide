// Скрипт для импорта базовых советов в Supabase
// Запустите с помощью команды: node docs/import-advices.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Загрузка переменных окружения из .env.local
require('dotenv').config({ path: '.env.local' });

// Получаем URL и ключ Supabase из переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Ошибка: Отсутствуют настройки Supabase в переменных окружения!');
  console.error('Пожалуйста, проверьте файл .env.local и убедитесь, что в нем указаны NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Создаем клиент Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Путь к JSON-файлу с советами
const advicesFilePath = path.join(__dirname, 'initial-advices.json');

// Функция для импорта советов
async function importAdvices() {
  try {
    // Чтение JSON-файла
    const rawData = fs.readFileSync(advicesFilePath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (!data.advices || !Array.isArray(data.advices) || data.advices.length === 0) {
      console.error('Ошибка: Файл с советами имеет неверный формат или пуст');
      process.exit(1);
    }
    
    console.log(`Найдено ${data.advices.length} советов для импорта`);
    
    // Подготовка данных для вставки
    const advicesToInsert = data.advices.map(advice => ({
      ...advice,
      created_at: new Date().toISOString()
    }));
    
    // Вставка данных в Supabase
    const { data: insertedData, error } = await supabase
      .from('advices')
      .insert(advicesToInsert)
      .select();
    
    if (error) {
      console.error('Ошибка при импорте советов в Supabase:', error);
      process.exit(1);
    }
    
    console.log(`Успешно импортировано ${insertedData.length} советов`);
    console.log('Импорт завершен успешно!');
    
  } catch (error) {
    console.error('Произошла ошибка при импорте советов:', error);
    process.exit(1);
  }
}

// Запуск импорта
importAdvices();
