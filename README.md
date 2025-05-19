# Life-Guide

Life-Guide - это платформа для обмена советами и рекомендациями по психологии, учебе и жизни.

## Требования

- Node.js 18+ 
- pnpm или yarn
- Аккаунт Supabase

## Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/yourusername/life-guide.git
cd life-guide
```

2. Установите зависимости:

```bash
pnpm install
# или
yarn install
```

3. Настройте Supabase:

Следуйте инструкциям в файле [docs/supabase-setup.md](docs/supabase-setup.md) для настройки базы данных Supabase.

4. Настройте переменные окружения:

Создайте файл `.env.local` в корне проекта и заполните его следующими переменными:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# OAuth Providers (если используются)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

5. Запустите приложение в режиме разработки:

```bash
pnpm dev
# или
yarn dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## Функциональность

- Регистрация и авторизация пользователей
- Регистрация администраторов с использованием специального ключа
- Просмотр советов по категориям
- Добавление новых советов
- Темная и светлая темы

## Технологии

- Next.js 15
- React 18
- Supabase (PostgreSQL)
- NextAuth.js
- Tailwind CSS
- Glassmorphism UI

## Структура проекта

- `app/` - Маршруты и страницы приложения
- `src/components/` - React компоненты
- `src/lib/` - Утилиты и библиотеки
- `public/` - Статические файлы
- `docs/` - Документация

## Лицензия

MIT
