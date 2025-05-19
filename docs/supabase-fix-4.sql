-- Скрипт для исправления ошибок с таблицами в Supabase
-- Выполните этот скрипт в SQL Editor в панели управления Supabase

-- Включение расширения для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Проверка структуры таблицы users
DO $$
DECLARE
    table_exists BOOLEAN;
    id_column_exists BOOLEAN;
    role_column_exists BOOLEAN;
    primary_key_name TEXT;
BEGIN
    -- Проверяем, существует ли таблица users
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) INTO table_exists;

    IF table_exists THEN
        RAISE NOTICE 'Таблица users существует. Проверяем структуру...';
        
        -- Проверяем, существует ли столбец id
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users' 
            AND column_name = 'id'
        ) INTO id_column_exists;
        
        -- Проверяем, существует ли столбец role
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users' 
            AND column_name = 'role'
        ) INTO role_column_exists;
        
        -- Если столбец id не существует, добавляем его
        IF NOT id_column_exists THEN
            RAISE NOTICE 'Столбец id не существует в таблице users. Добавляем...';
            
            -- Получаем имя первичного ключа, если он существует
            SELECT constraint_name INTO primary_key_name
            FROM information_schema.table_constraints
            WHERE table_schema = 'public'
            AND table_name = 'users'
            AND constraint_type = 'PRIMARY KEY';
            
            -- Если первичный ключ существует, удаляем его
            IF primary_key_name IS NOT NULL THEN
                EXECUTE 'ALTER TABLE public.users DROP CONSTRAINT ' || primary_key_name;
            END IF;
            
            -- Добавляем столбец id
            ALTER TABLE public.users ADD COLUMN id UUID DEFAULT uuid_generate_v4();
            ALTER TABLE public.users ADD PRIMARY KEY (id);
        END IF;
        
        -- Если столбец role не существует, добавляем его
        IF NOT role_column_exists THEN
            RAISE NOTICE 'Столбец role не существует в таблице users. Добавляем...';
            ALTER TABLE public.users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
            ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
        END IF;
    ELSE
        -- Если таблица не существует, создаем ее
        RAISE NOTICE 'Таблица users не существует. Создаем...';
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
    END IF;
END $$;

-- Проверка структуры таблицы advices
DO $$
DECLARE
    table_exists BOOLEAN;
    id_column_exists BOOLEAN;
    category_column_exists BOOLEAN;
    question_column_exists BOOLEAN;
    answer_column_exists BOOLEAN;
    author_id_column_exists BOOLEAN;
    primary_key_name TEXT;
BEGIN
    -- Проверяем, существует ли таблица advices
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'advices'
    ) INTO table_exists;

    IF table_exists THEN
        RAISE NOTICE 'Таблица advices существует. Проверяем структуру...';
        
        -- Проверяем, существуют ли необходимые столбцы
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'advices' 
            AND column_name = 'id'
        ) INTO id_column_exists;
        
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'advices' 
            AND column_name = 'category'
        ) INTO category_column_exists;
        
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'advices' 
            AND column_name = 'question'
        ) INTO question_column_exists;
        
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'advices' 
            AND column_name = 'answer'
        ) INTO answer_column_exists;
        
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'advices' 
            AND column_name = 'author_id'
        ) INTO author_id_column_exists;
        
        -- Если столбец id не существует, добавляем его
        IF NOT id_column_exists THEN
            RAISE NOTICE 'Столбец id не существует в таблице advices. Добавляем...';
            
            -- Получаем имя первичного ключа, если он существует
            SELECT constraint_name INTO primary_key_name
            FROM information_schema.table_constraints
            WHERE table_schema = 'public'
            AND table_name = 'advices'
            AND constraint_type = 'PRIMARY KEY';
            
            -- Если первичный ключ существует, удаляем его
            IF primary_key_name IS NOT NULL THEN
                EXECUTE 'ALTER TABLE public.advices DROP CONSTRAINT ' || primary_key_name;
            END IF;
            
            -- Добавляем столбец id
            ALTER TABLE public.advices ADD COLUMN id UUID DEFAULT uuid_generate_v4();
            ALTER TABLE public.advices ADD PRIMARY KEY (id);
        END IF;
        
        -- Добавляем недостающие столбцы
        IF NOT category_column_exists THEN
            RAISE NOTICE 'Столбец category не существует в таблице advices. Добавляем...';
            ALTER TABLE public.advices ADD COLUMN category TEXT;
            ALTER TABLE public.advices ADD CONSTRAINT advices_category_check CHECK (category IN ('psychology', 'study', 'life'));
        END IF;
        
        IF NOT question_column_exists THEN
            RAISE NOTICE 'Столбец question не существует в таблице advices. Добавляем...';
            ALTER TABLE public.advices ADD COLUMN question TEXT;
        END IF;
        
        IF NOT answer_column_exists THEN
            RAISE NOTICE 'Столбец answer не существует в таблице advices. Добавляем...';
            ALTER TABLE public.advices ADD COLUMN answer TEXT;
        END IF;
        
        IF NOT author_id_column_exists THEN
            RAISE NOTICE 'Столбец author_id не существует в таблице advices. Добавляем...';
            ALTER TABLE public.advices ADD COLUMN author_id UUID;
        END IF;
    ELSE
        -- Если таблица не существует, создаем ее
        RAISE NOTICE 'Таблица advices не существует. Создаем...';
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

-- Создание индексов для ускорения поиска (если они еще не существуют)
DO $$
BEGIN
    -- Проверяем существование индекса users_email_idx
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'email'
    ) AND NOT EXISTS (
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

-- Создание базовых политик для всех таблиц
CREATE POLICY users_select_policy ON public.users FOR SELECT USING (true);
CREATE POLICY users_insert_policy ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY users_update_policy ON public.users FOR UPDATE USING (true);
CREATE POLICY users_delete_policy ON public.users FOR DELETE USING (true);

CREATE POLICY advices_select_policy ON public.advices FOR SELECT USING (true);
CREATE POLICY advices_insert_policy ON public.advices FOR INSERT WITH CHECK (true);
CREATE POLICY advices_update_policy ON public.advices FOR UPDATE USING (true);
CREATE POLICY advices_delete_policy ON public.advices FOR DELETE USING (true);

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
    question_exists BOOLEAN;
    answer_exists BOOLEAN;
BEGIN
    -- Проверяем, существуют ли необходимые столбцы
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'advices' 
        AND column_name = 'category'
    ) INTO category_exists;

    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'advices' 
        AND column_name = 'question'
    ) INTO question_exists;

    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'advices' 
        AND column_name = 'answer'
    ) INTO answer_exists;

    IF category_exists AND question_exists AND answer_exists THEN
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
        RAISE NOTICE 'Не все необходимые столбцы существуют. Пропускаем добавление базовых советов.';
    END IF;
END $$;
