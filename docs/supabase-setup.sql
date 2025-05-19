-- Скрипт для настройки базы данных Supabase для приложения Life-Guide
-- Выполните этот скрипт в SQL Editor в панели управления Supabase

-- Включение расширения для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы советов
CREATE TABLE IF NOT EXISTS public.advices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('psychology', 'study', 'life')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для ускорения поиска
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS advices_category_idx ON public.advices(category);
CREATE INDEX IF NOT EXISTS advices_author_idx ON public.advices(author_id);

-- Настройка политик безопасности Row Level Security (RLS)
-- Включение RLS для таблиц
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advices ENABLE ROW LEVEL SECURITY;

-- Политики для таблицы пользователей
CREATE POLICY users_select_policy ON public.users
    FOR SELECT USING (true);  -- Все могут просматривать пользователей

CREATE POLICY users_insert_policy ON public.users
    FOR INSERT WITH CHECK (true);  -- Все могут создавать пользователей (через API)

CREATE POLICY users_update_policy ON public.users
    FOR UPDATE USING (
        auth.uid() = id OR  -- Пользователь может обновлять свой профиль
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )  -- Или администратор может обновлять любой профиль
    );

CREATE POLICY users_delete_policy ON public.users
    FOR DELETE USING (
        auth.uid() = id OR  -- Пользователь может удалить свой профиль
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )  -- Или администратор может удалить любой профиль
    );

-- Политики для таблицы советов
CREATE POLICY advices_select_policy ON public.advices
    FOR SELECT USING (true);  -- Все могут просматривать советы

CREATE POLICY advices_insert_policy ON public.advices
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL  -- Только аутентифицированные пользователи могут создавать советы
    );

CREATE POLICY advices_update_policy ON public.advices
    FOR UPDATE USING (
        author_id = auth.uid() OR  -- Автор может обновлять свои советы
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )  -- Или администратор может обновлять любые советы
    );

CREATE POLICY advices_delete_policy ON public.advices
    FOR DELETE USING (
        author_id = auth.uid() OR  -- Автор может удалять свои советы
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )  -- Или администратор может удалять любые советы
    );

-- Предоставление доступа для анонимного пользователя
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.advices TO anon;
GRANT INSERT ON public.users TO anon;
GRANT INSERT ON public.advices TO anon;
GRANT USAGE ON SEQUENCE public.users_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.advices_id_seq TO anon;

-- Предоставление доступа для аутентифицированного пользователя
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.advices TO authenticated;
GRANT UPDATE, DELETE ON public.users TO authenticated;
GRANT USAGE ON SEQUENCE public.users_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.advices_id_seq TO authenticated;

-- Добавление базовых советов
INSERT INTO public.advices (category, question, answer, created_at)
VALUES
    -- Советы по психологии
    ('psychology', 'Как справиться со стрессом перед важным событием?', 'Практикуйте глубокое дыхание: вдох на 4 счета, задержка на 4 счета, выдох на 6 счетов. Визуализируйте успешный исход. Подготовьтесь заранее и выспитесь. Помните, что небольшой стресс — это нормально и даже полезно для мобилизации ресурсов.', NOW()),

    ('psychology', 'Как повысить самооценку?', 'Ведите дневник достижений, записывая даже маленькие победы. Окружите себя поддерживающими людьми. Практикуйте позитивные аффирмации. Ставьте реалистичные цели и достигайте их. Помните, что самооценка строится на действиях, а не только на мыслях.', NOW()),

    ('psychology', 'Как научиться говорить "нет"?', 'Начните с малого — отказывайтесь от незначительных просьб. Используйте технику "бутерброда": начните с позитива, затем откажите, и закончите на позитивной ноте. Помните, что ваше время ценно, и забота о себе — это не эгоизм.', NOW()),

    ('psychology', 'Как справиться с прокрастинацией?', 'Используйте технику "помидора": работайте 25 минут, затем отдыхайте 5 минут. Разбивайте большие задачи на маленькие. Создайте рабочее пространство без отвлекающих факторов. Вознаграждайте себя за выполненные задачи.', NOW()),

    ('psychology', 'Как улучшить отношения с близкими?', 'Практикуйте активное слушание: задавайте уточняющие вопросы и перефразируйте услышанное. Выражайте благодарность и признательность. Уделяйте качественное время без гаджетов. Обсуждайте проблемы, используя "я-сообщения" вместо обвинений.', NOW()),

    -- Советы по учебе
    ('study', 'Как эффективно запоминать новую информацию?', 'Используйте метод интервальных повторений: повторяйте материал через 1 день, 3 дня, 7 дней и 21 день. Объясняйте материал кому-то другому или воображаемому слушателю. Связывайте новую информацию с уже известной. Используйте мнемонические техники и ассоциации.', NOW()),

    ('study', 'Как составить эффективный план обучения?', 'Определите конкретные, измеримые цели. Разбейте материал на логические блоки. Чередуйте разные предметы в течение дня. Включите в план регулярные перерывы и время для повторения. Отслеживайте прогресс и корректируйте план при необходимости.', NOW()),

    ('study', 'Как сохранять концентрацию во время учебы?', 'Используйте технику Pomodoro: 25 минут работы, 5 минут отдыха. Устраните отвлекающие факторы: отключите уведомления, используйте приложения для блокировки соцсетей. Обеспечьте комфортные условия: тишину, хорошее освещение, удобное рабочее место.', NOW()),

    ('study', 'Как подготовиться к экзамену за короткий срок?', 'Сосредоточьтесь на ключевых концепциях и наиболее вероятных вопросах. Используйте краткие конспекты и карточки для повторения. Практикуйте активное вспоминание вместо пассивного перечитывания. Объясняйте материал вслух. Обеспечьте полноценный сон перед экзаменом.', NOW()),

    ('study', 'Как выбрать эффективный метод обучения?', 'Определите свой стиль обучения: визуальный, аудиальный или кинестетический. Экспериментируйте с разными методами: конспектирование, ментальные карты, аудиозаписи, практические упражнения. Регулярно анализируйте результаты и корректируйте подход.', NOW()),

    -- Советы по организации жизни
    ('life', 'Как эффективно планировать день?', 'Составляйте план вечером предыдущего дня. Выделяйте 1-3 приоритетные задачи. Используйте технику тайм-блокинга: выделяйте конкретные блоки времени для определенных задач. Включайте в план время для отдыха и непредвиденных ситуаций. Анализируйте выполнение плана в конце дня.', NOW()),

    ('life', 'Как поддерживать баланс между работой и личной жизнью?', 'Установите четкие границы: определите рабочие часы и придерживайтесь их. Создайте ритуалы перехода между работой и отдыхом. Планируйте качественное время с близкими. Научитесь делегировать задачи. Регулярно оценивайте свой уровень удовлетворенности разными сферами жизни.', NOW()),

    ('life', 'Как начать здоровый образ жизни?', 'Внедряйте изменения постепенно: начните с одной привычки и закрепите ее. Добавляйте физическую активность в повседневные дела: ходите по лестнице, выходите на одну остановку раньше. Планируйте здоровые перекусы. Обеспечьте достаточный сон. Найдите единомышленников для поддержки.', NOW()),

    ('life', 'Как эффективно управлять финансами?', 'Ведите учет доходов и расходов. Следуйте правилу 50/30/20: 50% на необходимые расходы, 30% на желания, 20% на сбережения. Автоматизируйте платежи и сбережения. Создайте финансовую подушку безопасности. Регулярно пересматривайте свой бюджет и финансовые цели.', NOW()),

    ('life', 'Как развивать полезные привычки?', 'Используйте метод "крошечных привычек": начинайте с минимальных действий (например, одно отжимание в день). Привязывайте новую привычку к существующей рутине. Отслеживайте прогресс визуально. Создавайте окружение, способствующее желаемому поведению. Вознаграждайте себя за последовательность.', NOW());

-- Создание тестового администратора (пароль: admin123)
-- Примечание: в реальном приложении пароли должны быть хешированы
INSERT INTO public.users (name, email, password, salt, role, created_at)
VALUES ('Admin', 'admin@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'salt123', 'admin', NOW());

-- Создание тестового пользователя (пароль: user123)
INSERT INTO public.users (name, email, password, salt, role, created_at)
VALUES ('User', 'user@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'salt123', 'user', NOW());
