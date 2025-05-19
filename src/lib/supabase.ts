import { createClient } from '@supabase/supabase-js';

// Получаем URL и ключ Supabase из переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Логирование настроек Supabase при инициализации
console.log('=== SUPABASE: Инициализация клиента ===');
console.log('Supabase URL:', supabaseUrl || 'не указан');
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);
console.log('Supabase Anon Key (первые 5 символов):', supabaseAnonKey ? supabaseAnonKey.substring(0, 5) + '...' : 'не указан');

// Проверка наличия настроек
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ОШИБКА: Отсутствуют настройки Supabase в переменных окружения!');
  console.error('Пожалуйста, проверьте файл .env.local и убедитесь, что в нем указаны NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Создаем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Функция для входа
export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    // Получаем пользователя по email
    const user = await findUserByEmail(email);

    if (!user) {
      return { error: 'Пользователь с таким email не найден', user: null };
    }

    // Проверяем пароль (в реальном приложении нужно использовать хеширование)
    if (user.password !== password) {
      return { error: 'Неверный пароль', user: null };
    }

    // Сохраняем сессию в localStorage
    const { password: _, salt: __, ...userWithoutSensitiveData } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutSensitiveData));

    return { user: userWithoutSensitiveData, error: null };
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

// Типы данных для таблиц
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  role: 'user' | 'admin';
  image?: string;
  created_at: string;
};

export type Advice = {
  id: string;
  category: 'psychology' | 'study' | 'life';
  question: string;
  answer: string;
  author_id?: string;
  created_at: string;
};

// Функции для работы с пользователями
export async function findUserByEmail(email: string): Promise<User | null> {
  console.log('Поиск пользователя по email:', email);

  try {
    // Сначала проверим, какие таблицы существуют
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('Ошибка при получении списка таблиц:', tablesError);
    } else {
      console.log('Существующие таблицы:', tables?.map(t => t.table_name));
    }

    // Теперь проверим структуру таблицы users, если она существует
    if (tables?.some(t => t.table_name === 'users')) {
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_schema', 'public')
        .eq('table_name', 'users');

      if (columnsError) {
        console.error('Ошибка при получении структуры таблицы users:', columnsError);
      } else {
        console.log('Структура таблицы users:', columns);
      }
    }

    // Теперь попробуем найти пользователя
    console.log('Выполняем запрос для поиска пользователя по email:', email);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Ошибка при поиске пользователя в Supabase:', error);
      return null;
    }

    console.log('Пользователь найден:', data);
    return data as User || null;
  } catch (error) {
    console.error('Исключение при поиске пользователя:', error);
    return null;
  }
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  salt: string;
  role: 'user' | 'admin';
}): Promise<User | null> {
  console.log('Создание пользователя:', {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    hasPassword: !!userData.password,
    hasSalt: !!userData.salt
  });

  try {
    // Проверка, существует ли пользователь с таким email
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует.');
    }

    // Создание пользователя
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          salt: userData.salt,
          role: userData.role,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании пользователя в Supabase:', error);
      console.error('Код ошибки:', error.code);
      console.error('Сообщение ошибки:', error.message);

      // Формируем понятное сообщение об ошибке
      if (error.code === '23505') {
        throw new Error('Пользователь с таким email уже существует.');
      } else if (error.code === '42P01') {
        throw new Error('Таблица users не существует. Проверьте, что вы создали необходимые таблицы в Supabase.');
      } else {
        throw new Error(`Ошибка при создании пользователя: ${error.message}`);
      }
    }

    if (!data) {
      console.error('Пользователь не создан, данные отсутствуют');
      throw new Error('Не удалось создать пользователя. База данных не вернула данные.');
    }

    console.log('Пользователь успешно создан:', { id: data.id, email: data.email, role: data.role });
    return data as User;
  } catch (error) {
    console.error('Исключение при создании пользователя:', error);
    throw error; // Пробрасываем ошибку дальше для обработки в API-маршруте
  }
}

// Функции для работы с советами
export async function getAdvices(category?: 'psychology' | 'study' | 'life'): Promise<Advice[]> {
  console.log('Получение советов:', { category });

  try {
    let query = supabase.from('advices').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Ошибка при получении советов из Supabase:', error);
      return [];
    }

    return data as Advice[] || [];
  } catch (error) {
    console.error('Исключение при получении советов:', error);
    return [];
  }
}

export async function createAdvice(adviceData: {
  category: 'psychology' | 'study' | 'life';
  question: string;
  answer: string;
  author_id?: string;
}): Promise<Advice | null> {
  console.log('Создание совета:', adviceData);

  try {
    const { data, error } = await supabase
      .from('advices')
      .insert([
        {
          category: adviceData.category,
          question: adviceData.question,
          answer: adviceData.answer,
          author_id: adviceData.author_id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании совета в Supabase:', error);
      return null;
    }

    return data as Advice || null;
  } catch (error) {
    console.error('Исключение при создании совета:', error);
    return null;
  }
}
