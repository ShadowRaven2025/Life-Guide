const fs = require('fs');
const path = require('path');

// Исходный файл
const sourceFile = path.join(__dirname, 'docs', 'light-bulb-lamps-dark-background_41969-13092.avif');

// Целевая директория и файл
const targetDir = path.join(__dirname, 'public', 'docs');
const targetFile = path.join(targetDir, 'light-bulb-lamps-dark-background_41969-13092.avif');

// Создаем директорию public/docs, если она не существует
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Создана директория: ${targetDir}`);
}

// Копируем файл
try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`Файл успешно скопирован из ${sourceFile} в ${targetFile}`);
} catch (err) {
  console.error(`Ошибка при копировании файла: ${err.message}`);
  console.error('Полный путь к исходному файлу:', path.resolve(sourceFile));
  console.error('Существует ли исходный файл:', fs.existsSync(sourceFile));
  console.error('Содержимое директории docs:', fs.readdirSync(path.join(__dirname, 'docs')));
}
