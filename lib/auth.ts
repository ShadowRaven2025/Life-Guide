import crypto from 'crypto';

// Функция для хеширования пароля
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { hash, salt };
}

// Функция для проверки пароля
export function verifyPassword(password: string, hash: string, salt: string) {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === verifyHash;
}

// Функция для проверки ключа администратора
export function isValidAdminKey(key: string) {
  // Проверяем ключ без учета регистра
  const validKey = '12283Ara';
  return key.toLowerCase() === validKey.toLowerCase();
}
