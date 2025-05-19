-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  salt TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы советов
CREATE TABLE IF NOT EXISTS advices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('psychology', 'study', 'life')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы для NextAuth
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  type TEXT NOT NULL,
  access_token TEXT,
  token_type TEXT,
  refresh_token TEXT,
  expires_at BIGINT,
  scope TEXT,
  id_token TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  session_token TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Создание политик безопасности для Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE advices ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Политики для пользователей
CREATE POLICY "Пользователи могут видеть только себя" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Пользователи могут создавать себя" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Пользователи могут обновлять только себя" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Политики для советов
CREATE POLICY "Советы доступны для чтения всем" ON advices
  FOR SELECT USING (true);

CREATE POLICY "Авторизованные пользователи могут создавать советы" ON advices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Авторы могут обновлять свои советы" ON advices
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Авторы могут удалять свои советы" ON advices
  FOR DELETE USING (auth.uid() = author_id);

-- Политики для аккаунтов
CREATE POLICY "Пользователи могут видеть только свои аккаунты" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут создавать только свои аккаунты" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять только свои аккаунты" ON accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять только свои аккаунты" ON accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Политики для сессий
CREATE POLICY "Пользователи могут видеть только свои сессии" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут создавать только свои сессии" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять только свои сессии" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять только свои сессии" ON sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Политики для токенов верификации
CREATE POLICY "Токены верификации доступны для чтения всем" ON verification_tokens
  FOR SELECT USING (true);

CREATE POLICY "Токены верификации доступны для создания всем" ON verification_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Токены верификации доступны для удаления всем" ON verification_tokens
  FOR DELETE USING (true);
