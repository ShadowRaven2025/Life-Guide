import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, isValidAdminKey } from '@/lib/auth'; // Импорт из src/lib/auth.ts
import { findUserByEmail, createUser } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  console.log('=== API ROUTE: /api/auth/register ===');
  console.log('Метод запроса:', request.method);
  console.log('Заголовки запроса:', Object.fromEntries([...request.headers.entries()]));

  try {
    console.log('Получен запрос на регистрацию');

    // Проверка, что запрос содержит тело
    let body;
    try {
      const text = await request.text();
      console.log('Тело запроса (текст):', text);

      try {
        body = JSON.parse(text);
        console.log('Тело запроса (JSON):', {
          name: body.name,
          email: body.email,
          hasPassword: !!body.password,
          adminKey: !!body.adminKey,
          contentType: request.headers.get('Content-Type')
        });
      } catch (parseError) {
        console.error('Ошибка при парсинге JSON:', parseError);
        return NextResponse.json(
          { error: 'Некорректный формат JSON в запросе.' },
          { status: 400 }
        );
      }
    } catch (textError) {
      console.error('Ошибка при чтении тела запроса:', textError);
      return NextResponse.json(
        { error: 'Не удалось прочитать тело запроса.' },
        { status: 400 }
      );
    }

    const { name, email, password, adminKey } = body;

    // Проверка обязательных полей
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Имя, email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Проверка валидности email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Пожалуйста, введите корректный email' },
        { status: 400 }
      );
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать не менее 6 символов' },
        { status: 400 }
      );
    }

    // Проверка, существует ли пользователь с таким email
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Определение роли пользователя
    let role = 'user' as 'user' | 'admin';

    // Если указан ключ администратора, проверяем его
    if (adminKey) {
      if (isValidAdminKey(adminKey)) {
        role = 'admin';
        console.log(`Создан новый администратор: ${email}`);
      } else {
        return NextResponse.json(
          { error: 'Неверный ключ администратора' },
          { status: 400 }
        );
      }
    }

    // Хеширование пароля
    const { hash, salt } = hashPassword(password);

    // Создание пользователя
    console.log('Попытка создания пользователя:', { name, email, role });
    console.log('Проверка настроек Supabase:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });

    let user;
    try {
      user = await createUser({
        name,
        email,
        password: hash,
        salt,
        role,
      });

      console.log('Пользователь создан:', user ? 'успешно' : 'ошибка');

      if (!user) {
        console.error('Пользователь не создан, но ошибки не возникло');
        return NextResponse.json(
          {
            error: 'Ошибка при создании пользователя в базе данных. Проверьте настройки подключения к Supabase.',
            details: 'Функция createUser вернула null без ошибки'
          },
          { status: 500 }
        );
      }
    } catch (createError) {
      console.error('Ошибка при создании пользователя в Supabase:', createError);

      // Проверяем тип ошибки и формируем понятное сообщение
      let errorMessage = 'Ошибка при создании пользователя: ';

      if (createError instanceof Error) {
        console.error('Детали ошибки:', createError.message);
        console.error('Стек вызовов:', createError.stack);

        if (createError.message.includes('duplicate key')) {
          errorMessage += 'Пользователь с таким email уже существует.';
        } else if (createError.message.includes('connection')) {
          errorMessage += 'Не удалось подключиться к базе данных. Проверьте настройки Supabase.';
        } else {
          errorMessage += createError.message;
        }
      } else {
        errorMessage += 'Неизвестная ошибка';
      }

      return NextResponse.json(
        {
          error: errorMessage,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'не указан',
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        },
        { status: 500 }
      );
    }

    // Удаляем пароль и соль из ответа
    const { password: _, salt: __, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: role === 'admin'
          ? 'Администратор успешно зарегистрирован'
          : 'Пользователь успешно зарегистрирован'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации пользователя' },
      { status: 500 }
    );
  }
}
