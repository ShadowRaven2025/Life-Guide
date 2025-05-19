// Типы данных для таблиц
import { User, Advice } from './supabase';

// Локальное хранилище для разработки
const mockStorage = {
  users: [] as User[],
  advices: [] as Advice[],
};

// Функции для работы с пользователями
export async function mockFindUserByEmail(email: string): Promise<User | null> {
  console.log('Mock: Поиск пользователя по email', email);
  const user = mockStorage.users.find(u => u.email === email);
  return user || null;
}

export async function mockCreateUser(userData: {
  name: string;
  email: string;
  password: string;
  salt: string;
  role: 'user' | 'admin';
}): Promise<User | null> {
  console.log('Mock: Создание пользователя', {
    name: userData.name,
    email: userData.email,
    role: userData.role,
  });

  // Проверяем, существует ли пользователь с таким email
  const existingUser = await mockFindUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует.');
  }

  // Создаем нового пользователя
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    salt: userData.salt,
    role: userData.role,
    created_at: new Date().toISOString(),
  };

  // Добавляем пользователя в хранилище
  mockStorage.users.push(newUser);
  console.log('Mock: Пользователь успешно создан', {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return newUser;
}

// Функции для работы с советами
export async function mockGetAdvices(category?: 'psychology' | 'study' | 'life'): Promise<Advice[]> {
  console.log('Mock: Получение советов', { category });
  
  if (category) {
    return mockStorage.advices
      .filter(a => a.category === category)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  return mockStorage.advices
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function mockCreateAdvice(adviceData: {
  category: 'psychology' | 'study' | 'life';
  question: string;
  answer: string;
  author_id?: string;
}): Promise<Advice | null> {
  console.log('Mock: Создание совета', adviceData);

  // Создаем новый совет
  const newAdvice: Advice = {
    id: `advice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    category: adviceData.category,
    question: adviceData.question,
    answer: adviceData.answer,
    author_id: adviceData.author_id,
    created_at: new Date().toISOString(),
  };

  // Добавляем совет в хранилище
  mockStorage.advices.push(newAdvice);
  console.log('Mock: Совет успешно создан', { id: newAdvice.id });

  return newAdvice;
}

// Функция для очистки хранилища (для тестирования)
export function mockClearStorage() {
  mockStorage.users = [];
  mockStorage.advices = [];
  console.log('Mock: Хранилище очищено');
}

// Функция для добавления тестовых данных
export function mockAddTestData() {
  // Добавляем тестовых пользователей
  if (mockStorage.users.length === 0) {
    mockStorage.users.push({
      id: 'user_test_1',
      name: 'Тестовый пользователь',
      email: 'test@example.com',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
      salt: 'test_salt',
      role: 'user',
      created_at: new Date().toISOString(),
    });
    
    mockStorage.users.push({
      id: 'user_test_2',
      name: 'Администратор',
      email: 'admin@example.com',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
      salt: 'test_salt',
      role: 'admin',
      created_at: new Date().toISOString(),
    });
  }

  // Добавляем тестовые советы
  if (mockStorage.advices.length === 0) {
    mockStorage.advices.push({
      id: 'advice_test_1',
      category: 'psychology',
      question: 'Как справиться со стрессом?',
      answer: 'Для снижения уровня стресса рекомендуется регулярно заниматься спортом, практиковать медитацию и обеспечивать достаточный сон.',
      author_id: 'user_test_2',
      created_at: new Date().toISOString(),
    });
    
    mockStorage.advices.push({
      id: 'advice_test_2',
      category: 'study',
      question: 'Как эффективно запоминать информацию?',
      answer: 'Используйте метод интервального повторения, создавайте ассоциации и визуализируйте информацию для лучшего запоминания.',
      author_id: 'user_test_2',
      created_at: new Date().toISOString(),
    });
    
    mockStorage.advices.push({
      id: 'advice_test_3',
      category: 'life',
      question: 'Как правильно планировать свой день?',
      answer: 'Составляйте список задач на день, расставляйте приоритеты и выделяйте время для отдыха и восстановления энергии.',
      author_id: 'user_test_1',
      created_at: new Date().toISOString(),
    });
  }

  console.log('Mock: Тестовые данные добавлены');
}

// Инициализация тестовых данных
mockAddTestData();
