import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword } from './auth';

// Пути к файлам данных
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ADVICES_FILE = path.join(DATA_DIR, 'advices.json');

// Типы данных
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

export interface Advice {
  id: string;
  category: 'psychology' | 'study' | 'life';
  question: string;
  answer: string;
  authorId?: string;
  createdAt: string;
}

// Инициализация директории и файлов данных
function initDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(ADVICES_FILE)) {
    fs.writeFileSync(ADVICES_FILE, JSON.stringify([]));
  }
}

// Получение всех пользователей
export function getUsers(): User[] {
  initDataFiles();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Сохранение пользователей
export function saveUsers(users: User[]): void {
  initDataFiles();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
}

// Поиск пользователя по email
export function findUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
}

// Создание нового пользователя
export function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}): User {
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
    createdAt: new Date().toISOString(),
  };
  
  // Сохранение пользователя
  users.push(newUser);
  saveUsers(users);
  
  // Возвращаем пользователя без пароля и соли
  const { password, salt: userSalt, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
}

// Проверка учетных данных пользователя
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

// Получение всех советов
export function getAdvices(category?: 'psychology' | 'study' | 'life'): Advice[] {
  initDataFiles();
  try {
    const data = fs.readFileSync(ADVICES_FILE, 'utf8');
    const advices = JSON.parse(data) as Advice[];
    
    if (category) {
      return advices.filter(advice => advice.category === category);
    }
    
    return advices;
  } catch (error) {
    console.error('Error reading advices file:', error);
    return [];
  }
}

// Сохранение советов
export function saveAdvices(advices: Advice[]): void {
  initDataFiles();
  try {
    fs.writeFileSync(ADVICES_FILE, JSON.stringify(advices, null, 2));
  } catch (error) {
    console.error('Error writing advices file:', error);
  }
}

// Создание нового совета
export function createAdvice(adviceData: {
  category: 'psychology' | 'study' | 'life';
  question: string;
  answer: string;
  authorId?: string;
}): Advice {
  const advices = getAdvices();
  
  // Создание нового совета
  const newAdvice: Advice = {
    id: Date.now().toString(),
    category: adviceData.category,
    question: adviceData.question,
    answer: adviceData.answer,
    authorId: adviceData.authorId,
    createdAt: new Date().toISOString(),
  };
  
  // Сохранение совета
  advices.push(newAdvice);
  saveAdvices(advices);
  
  return newAdvice;
}
