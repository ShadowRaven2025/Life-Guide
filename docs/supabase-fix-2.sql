-- Скрипт для исправления ошибок с таблицами в Supabase
-- Выполните этот скрипт в SQL Editor в панели управления Supabase

-- Включение расширения для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Проверка структуры таблицы advices и добавление недостающих столбцов
DO $$
DECLARE
    table_exists BOOLEAN;
    category_exists BOOLEAN;
    author_id_exists BOOLEAN;
BEGIN
    -- Проверяем, существует ли таблица advices
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'advices'
    ) INTO table_exists;

    IF table_exists THEN
        -- Проверяем, существует ли столбец category
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'advices' 
            AND column_name = 'category'
        ) INTO category_exists;

        -- Проверяем, существует ли столбец author_id
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'advices' 
            AND column_name = 'author_id'
        ) INTO author_id_exists;

        -- Добавляем недостающие столбцы
        IF NOT category_exists THEN
            RAISE NOTICE 'Добавляем столбец category в таблицу advices...';
            ALTER TABLE public.advices ADD COLUMN category TEXT;
            ALTER TABLE public.advices ADD CONSTRAINT advices_category_check CHECK (category IN ('psychology', 'study', 'life'));
        END IF;

        IF NOT author_id_exists THEN
            RAISE NOTICE 'Добавляем столбец author_id в таблицу advices...';
            ALTER TABLE public.advices ADD COLUMN author_id UUID;
        END IF;
    ELSE
        -- Если таблица не существует, создаем ее
        RAISE NOTICE 'Таблица advices не существует. Создаем таблицу...';
        CREATE TABLE public.advices (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            category TEXT NOT NULL CHECK (category IN ('psychology', 'study', 'life')),
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            author_id UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Проверка существования таблицы users
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Проверяем, существует ли таблица users
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) INTO table_exists;

    IF NOT table_exists THEN
        -- Если таблица не существует, создаем ее
        RAISE NOTICE 'Таблица users не существует. Создаем таблицу...';
        CREATE TABLE public.users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            salt TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
            image TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        RAISE NOTICE 'Таблица users уже существует.';
    END IF;
END $$;

-- Создание индексов для ускорения поиска (если они еще не существуют)
DO $$
BEGIN
    -- Проверяем существование индекса users_email_idx
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'users' 
        AND indexname = 'users_email_idx'
    ) THEN
        CREATE INDEX users_email_idx ON public.users(email);
    END IF;

    -- Проверяем существование индекса advices_category_idx
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'advices' 
        AND column_name = 'category'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'advices' 
        AND indexname = 'advices_category_idx'
    ) THEN
        CREATE INDEX advices_category_idx ON public.advices(category);
    END IF;

    -- Проверяем существование индекса advices_author_idx
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'advices' 
        AND column_name = 'author_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'advices' 
        AND indexname = 'advices_author_idx'
    ) THEN
        CREATE INDEX advices_author_idx ON public.advices(author_id);
    END IF;
END $$;

-- Настройка политик безопасности Row Level Security (RLS)
-- Включение RLS для таблиц
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advices ENABLE ROW LEVEL SECURITY;

-- Удаление существующих политик (если они есть)
DROP POLICY IF EXISTS users_select_policy ON public.users;
DROP POLICY IF EXISTS users_insert_policy ON public.users;
DROP POLICY IF EXISTS users_update_policy ON public.users;
DROP POLICY IF EXISTS users_delete_policy ON public.users;
DROP POLICY IF EXISTS advices_select_policy ON public.advices;
DROP POLICY IF EXISTS advices_insert_policy ON public.advices;
DROP POLICY IF EXISTS advices_update_policy ON public.advices;
DROP POLICY IF EXISTS advices_delete_policy ON public.advices;

-- Создание новых политик
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
    FOR INSERT WITH CHECK (true);  -- Все могут создавать советы

-- Создаем политики update и delete только если существует столбец author_id
DO $$
DECLARE
    author_id_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'advices' 
        AND column_name = 'author_id'
    ) INTO author_id_exists;

    IF author_id_exists THEN
        EXECUTE '
        CREATE POLICY advices_update_policy ON public.advices
            FOR UPDATE USING (
                author_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.users
                    WHERE id = auth.uid() AND role = ''admin''
                )
            );
        ';

        EXECUTE '
        CREATE POLICY advices_delete_policy ON public.advices
            FOR DELETE USING (
                author_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.users
                    WHERE id = auth.uid() AND role = ''admin''
                )
            );
        ';
    ELSE
        -- Если столбца author_id нет, создаем простые политики
        EXECUTE '
        CREATE POLICY advices_update_policy ON public.advices
            FOR UPDATE USING (
                EXISTS (
                    SELECT 1 FROM public.users
                    WHERE id = auth.uid() AND role = ''admin''
                )
            );
        ';

        EXECUTE '
        CREATE POLICY advices_delete_policy ON public.advices
            FOR DELETE USING (
                EXISTS (
                    SELECT 1 FROM public.users
                    WHERE id = auth.uid() AND role = ''admin''
                )
            );
        ';
    END IF;
END $$;

-- Предоставление доступа для анонимного пользователя
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.advices TO anon;
GRANT INSERT ON public.users TO anon;
GRANT INSERT ON public.advices TO anon;

-- Предоставление доступа для аутентифицированного пользователя
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.advices TO authenticated;
GRANT UPDATE, DELETE ON public.users TO authenticated;

-- Проверка наличия данных в таблице advices и добавление базовых советов
DO $$
DECLARE
    advice_count INTEGER;
    category_exists BOOLEAN;
BEGIN
    -- Проверяем, существует ли столбец category
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'advices' 
        AND column_name = 'category'
    ) INTO category_exists;

    IF category_exists THEN
        SELECT COUNT(*) FROM public.advices INTO advice_count;
        
        IF advice_count = 0 THEN
            -- Если таблица пуста, добавляем базовые советы
            RAISE NOTICE 'Таблица advices пуста. Добавляем базовые советы...';
            
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
        ELSE
            RAISE NOTICE 'В таблице advices уже есть данные. Пропускаем добавление базовых советов.';
        END IF;
    ELSE
        RAISE NOTICE 'Столбец category не существует. Пропускаем добавление базовых советов.';
    END IF;
END $$;
