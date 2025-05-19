-- Включение расширения для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  salt TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы аккаунтов OAuth
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Создание таблицы сессий
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы токенов верификации
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, token)
);

-- Создание таблицы советов
CREATE TABLE IF NOT EXISTS advices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для ускорения запросов
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_advices_category ON advices(category);
CREATE INDEX IF NOT EXISTS idx_advices_author_id ON advices(author_id);

-- Включение Row Level Security для таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE advices ENABLE ROW LEVEL SECURITY;

-- Политики для таблицы users
CREATE POLICY users_select_policy ON users
  FOR SELECT USING (auth.uid() = id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY users_insert_policy ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY users_update_policy ON users
  FOR UPDATE USING (auth.uid() = id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY users_delete_policy ON users
  FOR DELETE USING (auth.jwt()->>'role' = 'admin');

-- Политики для таблицы accounts
CREATE POLICY accounts_select_policy ON accounts
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY accounts_insert_policy ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY accounts_update_policy ON accounts
  FOR UPDATE USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY accounts_delete_policy ON accounts
  FOR DELETE USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

-- Политики для таблицы sessions
CREATE POLICY sessions_select_policy ON sessions
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY sessions_insert_policy ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY sessions_update_policy ON sessions
  FOR UPDATE USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY sessions_delete_policy ON sessions
  FOR DELETE USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

-- Политики для таблицы verification_tokens
CREATE POLICY verification_tokens_select_policy ON verification_tokens
  FOR SELECT USING (true);

CREATE POLICY verification_tokens_insert_policy ON verification_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY verification_tokens_update_policy ON verification_tokens
  FOR UPDATE USING (true);

CREATE POLICY verification_tokens_delete_policy ON verification_tokens
  FOR DELETE USING (true);

-- Политики для таблицы advices
CREATE POLICY advices_select_policy ON advices
  FOR SELECT USING (true);

CREATE POLICY advices_insert_policy ON advices
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY advices_update_policy ON advices
  FOR UPDATE USING (auth.uid() = author_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY advices_delete_policy ON advices
  FOR DELETE USING (auth.uid() = author_id OR auth.jwt()->>'role' = 'admin');
