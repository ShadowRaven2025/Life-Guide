import { createClient } from '@supabase/supabase-js';

// Создаем клиент Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Функция для поиска пользователя по email
export async function findUserByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Пользователь не найден (код PGRST116 - "не найдено")
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Ошибка при поиске пользователя:', error);
    return null;
  }
}

// Функция для создания пользователя
export async function createUser({
  name,
  email,
  password,
  salt,
  role = 'user',
}: {
  name: string;
  email: string;
  password: string;
  salt: string;
  role?: 'user' | 'admin';
}) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password,
          salt,
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}

// Типы для аутентификации
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  image?: string;
}

export interface Session {
  user: User | null;
  expires: string;
}

// Функция для входа
export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    // Получаем пользователя по email
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Ошибка при поиске пользователя:', userError);
      return { error: 'Пользователь с таким email не найден', user: null };
    }

    // Проверяем пароль (в реальном приложении нужно использовать хеширование)
    if (users.password !== password) {
      return { error: 'Неверный пароль', user: null };
    }

    // Создаем сессию
    const user: User = {
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      image: users.image
    };

    // Сохраняем сессию в localStorage
    localStorage.setItem('user', JSON.stringify(user));

    return { user, error: null };
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return { error: 'Произошла ошибка при входе', user: null };
  }
}

// Функция для выхода
export async function signOut() {
  localStorage.removeItem('user');
  window.location.href = '/';
}

// Функция для регистрации
export async function signUp({
  name,
  email,
  password,
  isAdmin = false,
  adminKey = ''
}: {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  adminKey?: string;
}) {
  try {
    // Проверяем, если пользователь хочет зарегистрироваться как админ
    let role = 'user';

    if (isAdmin) {
      // Проверяем ключ администратора
      if (adminKey !== '12283Ara') {
        return { error: 'Неверный ключ администратора', user: null };
      }
      role = 'admin';
    }

    // Проверяем, существует ли пользователь с таким email
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { error: 'Пользователь с таким email уже существует', user: null };
    }

    // Создаем нового пользователя
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password, // В реальном приложении нужно хешировать пароль
          salt: 'salt123', // В реальном приложении нужно генерировать соль
          role
        }
      ])
      .select()
      .single();

    if (createError) {
      console.error('Ошибка при создании пользователя:', createError);
      return { error: 'Ошибка при создании пользователя', user: null };
    }

    // Возвращаем созданного пользователя
    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      image: newUser.image
    };

    return { user, error: null };
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return { error: 'Произошла ошибка при регистрации', user: null };
  }
}

// Хук для получения текущего пользователя
export function useUser() {
  // Это не настоящий React-хук, а просто функция
  // Для совместимости с компонентами, которые ожидают объект session
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  if (user) {
    return {
      data: {
        user: JSON.parse(user)
      },
      status: 'authenticated'
    };
  }

  return {
    data: null,
    status: 'unauthenticated'
  };
}

// Функция для проверки, является ли пользователь администратором
export function isAdmin(user: User | null) {
  return user?.role === 'admin';
}
