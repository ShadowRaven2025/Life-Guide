import { hashPassword, verifyPassword } from './auth';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  role: 'user' | 'admin';
  image?: string;
  createdAt: string;
}

/**
 * Получает всех пользователей из localStorage
 */
export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  
  const users = localStorage.getItem('lifeGuideUsers');
  return users ? JSON.parse(users) : [];
}

/**
 * Сохраняет пользователей в localStorage
 */
export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('lifeGuideUsers', JSON.stringify(users));
}

/**
 * Находит пользователя по email
 */
export function findUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
}

/**
 * Создает нового пользователя
 */
export function createUser(userData: Omit<User, 'id' | 'createdAt'> & { password: string }): User {
  const users = getUsers();
  
  // Проверка, существует ли пользователь с таким email
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  
  // Хеширование пароля
  const { hash, salt } = hashPassword(userData.password);
  
  // Создание нового пользователя
  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: hash,
    salt: salt,
    role: userData.role,
    image: userData.image,
    createdAt: new Date().toISOString(),
  };
  
  // Сохранение пользователя
  users.push(newUser);
  saveUsers(users);
  
  // Возвращаем пользователя без пароля и соли
  const { password, salt: userSalt, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
}

/**
 * Проверяет учетные данные пользователя
 */
export function validateCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email);
  
  if (!user || !user.password || !user.salt) {
    return null;
  }
  
  const isValid = verifyPassword(password, user.password, user.salt);
  
  if (!isValid) {
    return null;
  }
  
  // Возвращаем пользователя без пароля и соли
  const { password: _, salt: __, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

/**
 * Обновляет данные пользователя
 */
export function updateUser(userId: string, userData: Partial<User>): User | null {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return null;
  }
  
  // Обновляем данные пользователя
  users[userIndex] = { ...users[userIndex], ...userData };
  saveUsers(users);
  
  // Возвращаем обновленного пользователя без пароля и соли
  const { password, salt, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword as User;
}
