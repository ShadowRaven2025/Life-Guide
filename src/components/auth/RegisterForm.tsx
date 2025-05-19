'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EnhancedGlassInput } from '@/components/ui/enhanced-glass-input';

function RegisterFormContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
    isAdmin: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log('Отправка формы регистрации');

    // Валидация формы
    if (!formData.name || !formData.email || !formData.password) {
      let errorMessage = 'Пожалуйста, заполните все обязательные поля:';
      if (!formData.name) errorMessage += ' Имя,';
      if (!formData.email) errorMessage += ' Email,';
      if (!formData.password) errorMessage += ' Пароль,';

      // Удаляем последнюю запятую и добавляем точку
      errorMessage = errorMessage.slice(0, -1) + '.';

      setError(errorMessage);
      console.log('Ошибка валидации: не все обязательные поля заполнены');
      return;
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Пожалуйста, введите корректный email (например, example@mail.com)');
      console.log('Ошибка валидации: некорректный формат email');
      return;
    }

    // Проверка длины пароля
    if (formData.password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      console.log('Ошибка валидации: пароль слишком короткий');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают. Пожалуйста, проверьте правильность ввода');
      console.log('Ошибка валидации: пароли не совпадают');
      return;
    }

    if (formData.isAdmin && !formData.adminKey) {
      setError('Для регистрации администратора требуется ключ. Пожалуйста, введите ключ администратора');
      console.log('Ошибка валидации: не указан ключ администратора');
      return;
    }

    setLoading(true);
    console.log('Начало отправки запроса на регистрацию');

    try {
      const requestBody = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminKey: formData.isAdmin ? formData.adminKey : undefined,
      };

      console.log('Отправляемые данные:', { ...requestBody, password: '***' });
      console.log('Отправка запроса на регистрацию по URL:', '/api/auth/register');

      let response;
      try {
        console.log('Отправка запроса на URL:', '/api/auth/register');
        console.log('Тело запроса:', { ...requestBody, password: '***' });

        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Получен ответ от сервера:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries([...response.headers.entries()])
        });
      } catch (fetchError) {
        console.error('Ошибка при выполнении fetch запроса:', fetchError);
        throw new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету или попробуйте позже.');
      }

      let responseText;
      try {
        responseText = await response.text();
        console.log('Текст ответа:', responseText);
      } catch (textError) {
        console.error('Ошибка при получении текста ответа:', textError);
        throw new Error('Не удалось прочитать ответ сервера.');
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Данные ответа (JSON):', data);
      } catch (jsonError) {
        console.error('Ошибка при парсинге JSON:', jsonError);
        console.log('Ответ не является валидным JSON');
        throw new Error('Сервер вернул некорректный ответ. Пожалуйста, попробуйте позже.');
      }

      if (!response.ok) {
        console.error('Ошибка при регистрации:', data.error);

        // Обработка конкретных ошибок
        if (data.error.includes('уже существует')) {
          throw new Error('Пользователь с таким email уже зарегистрирован. Пожалуйста, используйте другой email или выполните вход.');
        } else if (data.error.includes('Неверный ключ администратора')) {
          throw new Error('Указан неверный ключ администратора. Пожалуйста, проверьте правильность ввода ключа.');
        } else if (data.error.includes('Supabase')) {
          throw new Error('Ошибка подключения к базе данных. Пожалуйста, убедитесь, что настройки Supabase корректны.');
        } else {
          throw new Error(data.error || 'Ошибка при регистрации. Пожалуйста, попробуйте позже.');
        }
      }

      console.log('Успешная регистрация, перенаправление на страницу входа');
      // Успешная регистрация, перенаправляем на страницу входа
      router.push('/auth/signin?registered=true');
    } catch (err) {
      console.error('Ошибка при обработке запроса:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 flex items-center justify-center flex-grow" style={{ minHeight: 'calc(100vh - 300px)' }}>
      <div className="max-w-2xl w-full mx-auto backdrop-blur-md bg-background/40 dark:bg-background/20 border border-glass-border dark:border-primary/20 rounded-xl shadow-xl p-10 animate-fade-in relative overflow-hidden">
        {/* Эффект свечения */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
        {/* Эффект блеска */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute inset-0 z-10 animate-glass-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-light rounded-full blur opacity-30 animate-pulse"></div>
            <div className="relative bg-background/80 dark:bg-background/40 rounded-full p-2.5 backdrop-blur-md">
              <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Регистрация
          </span>
        </h1>

        {error && (
          <div className="bg-red-100/80 dark:bg-red-900/20 border border-red-400/50 dark:border-red-700/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm shadow-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h4 className="font-medium mb-1">Ошибка регистрации</h4>
                <p>{error}</p>

                {/* Ошибки Supabase */}
                {(error.includes('Supabase') || error.includes('базе данных') || error.includes('таблица') || error.includes('подключ')) && (
                  <div className="mt-2 text-sm bg-red-50/50 dark:bg-red-900/10 p-3 rounded-md border border-red-200/50 dark:border-red-800/30">
                    <p className="font-medium mb-1">Проблема с подключением к базе данных:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Проверьте настройки подключения к Supabase в файле <code className="bg-red-100/50 dark:bg-red-900/30 px-1 py-0.5 rounded">.env.local</code></li>
                      <li>Убедитесь, что указаны правильные значения для <code className="bg-red-100/50 dark:bg-red-900/30 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> и <code className="bg-red-100/50 dark:bg-red-900/30 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                      <li>Проверьте, что в Supabase созданы все необходимые таблицы</li>
                      <li>Следуйте инструкциям в файле <code className="bg-red-100/50 dark:bg-red-900/30 px-1 py-0.5 rounded">docs/supabase-setup.md</code></li>
                    </ul>
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded border border-yellow-200/50 dark:border-yellow-800/30 text-yellow-800 dark:text-yellow-200">
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        Для тестирования можно использовать бесплатный план Supabase
                      </p>
                    </div>
                  </div>
                )}

                {/* Ошибка с существующим пользователем */}
                {error.includes('уже существует') || error.includes('уже зарегистрирован') && (
                  <div className="mt-2 text-sm">
                    <p>Что можно сделать:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Используйте другой email для регистрации</li>
                      <li>Если это ваш аккаунт, перейдите на <a href="/auth/signin" className="text-primary underline">страницу входа</a></li>
                      <li>Если вы забыли пароль, воспользуйтесь функцией восстановления пароля</li>
                    </ul>
                  </div>
                )}

                {/* Ошибка с ключом администратора */}
                {error.includes('ключ администратора') && (
                  <div className="mt-2 text-sm">
                    <p>Проверьте правильность ввода ключа администратора:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Убедитесь, что вы вводите правильный ключ</li>
                      <li>Проверьте, нет ли лишних пробелов</li>
                      <li>Учтите регистр символов (заглавные и строчные буквы)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
          <div>
            <div className="relative">
              <EnhancedGlassInput
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                variant="success"
                width="full"
                borderStyle="medium"
                className="pl-12 py-5 text-base focus:ring-2 focus:ring-primary/40 text-lg"
                style={{ backgroundColor: '#1f2937', color: 'white', height: '70px', fontSize: '1.125rem' }}
                placeholder="Имя"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <EnhancedGlassInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="primary"
                width="full"
                borderStyle="medium"
                className="pl-12 py-5 text-base focus:ring-2 focus:ring-primary/40 text-lg"
                style={{ backgroundColor: '#1f2937', color: 'white', height: '70px', fontSize: '1.125rem' }}
                placeholder="Email"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <EnhancedGlassInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                variant="accent"
                width="full"
                borderStyle="medium"
                className="pl-12 py-5 text-base focus:ring-2 focus:ring-primary/40 text-lg"
                style={{ backgroundColor: '#1f2937', color: 'white', height: '70px', fontSize: '1.125rem' }}
                placeholder="Пароль (мин. 6 символов)"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <EnhancedGlassInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                variant="accent"
                width="full"
                borderStyle="medium"
                className="pl-12 py-5 text-base focus:ring-2 focus:ring-primary/40 text-lg"
                style={{ backgroundColor: '#1f2937', color: 'white', height: '70px', fontSize: '1.125rem' }}
                placeholder="Подтвердите пароль"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center p-2 rounded-lg hover:bg-primary/5 transition-colors">
            <input
              id="isAdmin"
              name="isAdmin"
              type="checkbox"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="h-5 w-5 rounded border-glass-border text-amber-500 focus:ring-amber-500"
            />
            <Label htmlFor="isAdmin" className="cursor-pointer ml-2 text-sm">
              Регистрация администратора
            </Label>
          </div>

          {formData.isAdmin && (
            <div className="relative animate-fade-in">
              <EnhancedGlassInput
                id="adminKey"
                name="adminKey"
                type="password"
                value={formData.adminKey}
                onChange={handleChange}
                required={formData.isAdmin}
                variant="warning"
                width="full"
                borderStyle="medium"
                className="pl-12 py-5 text-base focus:ring-2 focus:ring-amber-500/40 text-lg"
                style={{ backgroundColor: '#1f2937', color: 'white', height: '70px', fontSize: '1.125rem', borderColor: '#f59e0b' }}
                placeholder="Ключ администратора"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-7 h-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-8 bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 backdrop-blur-md text-lg py-6 text-amber-300 hover:text-amber-200 font-medium"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Регистрация...
              </span>
            ) : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-glass-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full text-muted border border-glass-border/30">или</span>
            </div>
          </div>

          <div className="text-sm flex items-center justify-center space-x-2">
            <span className="text-muted-foreground">Уже есть аккаунт?</span>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 h-9 px-4 py-2"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterForm() {
  return (
    <div className="flex flex-col flex-grow" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <RegisterFormContent />
    </div>
  );
}
