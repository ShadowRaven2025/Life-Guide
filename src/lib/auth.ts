import { createHash, randomBytes } from 'crypto';

/**
 * Хеширует пароль с использованием SHA-256 и соли
 * @param password Пароль для хеширования
 * @returns Объект с хешем пароля и солью
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex');

  return { hash, salt };
}

/**
 * Проверяет пароль с хешем и солью
 * @param password Пароль для проверки
 * @param hash Хеш для сравнения
 * @param salt Соль, использованная при хешировании
 * @returns true, если пароль соответствует хешу
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const passwordHash = createHash('sha256')
    .update(password + salt)
    .digest('hex');

  return passwordHash === hash;
}

/**
 * Проверяет, является ли ключ действительным ключом администратора
 * @param key Ключ для проверки
 * @returns true, если ключ действителен
 */
export function isValidAdminKey(key: string): boolean {
  // Проверяем ключ без учета регистра
  const validKey = '12283Ara';
  return key.toLowerCase() === validKey.toLowerCase();
}
