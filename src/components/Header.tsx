'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from '@/lib/supabase';

export function Header() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Функция для получения пользователя из localStorage
    const getUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setStatus('authenticated');
        } else {
          setUser(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Ошибка при получении пользователя из localStorage:', error);
        setUser(null);
        setStatus('unauthenticated');
      }
    };

    // Получаем пользователя при монтировании компонента
    getUserFromStorage();

    // Слушаем событие storage для синхронизации между вкладками
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        getUserFromStorage();
      }
    };

    // Добавляем слушатель события storage
    window.addEventListener('storage', handleStorageChange);

    // Удаляем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  return (
    <header className="sticky top-0 z-50 py-4 overflow-hidden glass-nav">
      {/* Основной фон с эффектом стекла */}
      <div className="absolute inset-0 glass"></div>

      {/* Декоративные элементы для усиления эффекта стекла - с отрицательным z-index */}
      <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-slow-float -z-10"></div>
      <div className="absolute -bottom-1/2 -right-1/4 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-slow-float-delay -z-10"></div>

      {/* Блестящие элементы - с отрицательным z-index */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-70 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"></div>

      {/* Блестящие точки - с отрицательным z-index */}
      <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full opacity-80 animate-twinkle -z-10"></div>
      <div className="absolute top-3/4 left-2/3 w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-twinkle-delay -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full opacity-80 animate-twinkle-delay-2 -z-10"></div>

      {/* Движущийся блик - с отрицательным z-index */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-0 -left-1/2 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12 animate-shimmer-slow"></div>
      </div>

      <div className="container relative z-10 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Логотип и слоган */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/">
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Life-Guide
            </span>
          </Link>
          <p className="text-sm text-muted mt-1">
            Жизненные советы, которые всегда полезны
          </p>
        </div>

        {/* Навигация */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/" className="nav-link">
            <span className="inline-flex items-center px-3 py-2 rounded-lg bg-glass-background border border-glass-border backdrop-blur-md transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-glow">
              <span className="icon-duotone mr-1">
                <svg className="icon-duotone-secondary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2" />
                </svg>
                <svg className="icon-duotone-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2" />
                </svg>
              </span>
              <span className="text-amber-300 font-medium">
                Главная
              </span>
            </span>
          </Link>

          <Link href="/guides" className="nav-link">
            <span className="inline-flex items-center px-3 py-2 rounded-lg bg-glass-background border border-glass-border backdrop-blur-md transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-glow">
              <span className="icon-duotone mr-1">
                <svg className="icon-duotone-secondary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <svg className="icon-duotone-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <span className="text-amber-300 font-medium">
                Советы
              </span>
            </span>
          </Link>

          <Link href="/community" className="nav-link">
            <span className="inline-flex items-center px-3 py-2 rounded-lg bg-glass-background border border-glass-border backdrop-blur-md transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-glow">
              <span className="icon-duotone mr-1">
                <svg className="icon-duotone-secondary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <svg className="icon-duotone-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              <span className="text-amber-300 font-medium">
                Сообщество
              </span>
            </span>
          </Link>

          {user ? (
            <>
              <Link href="/add" className="nav-link group ml-1">
                <span className="relative inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-br from-primary/80 to-primary/60 border border-white/20 text-white transition-all duration-300 hover:shadow-glow-lg hover:scale-105">
                  <span className="icon-duotone mr-1">
                    <svg className="icon-duotone-secondary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <svg className="icon-duotone-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </span>
                  <span className="relative font-medium">
                    Добавить совет
                  </span>
                </span>
              </Link>

              <div className="nav-link group ml-1 relative">
                <button
                  onClick={() => signOut()}
                  className="relative inline-flex items-center px-3 py-2 rounded-lg bg-glass-background border border-glass-border backdrop-blur-md transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-glow"
                >
                  <span className="icon-duotone mr-1">
                    <svg className="icon-duotone-secondary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <svg className="icon-duotone-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  <span className="relative text-amber-300 font-medium">
                    Выйти
                  </span>
                </button>

                {user.role === 'admin' && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    Админ
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="nav-link group ml-1">
                <span className="relative inline-flex items-center px-3 py-2 rounded-lg bg-glass-background border border-glass-border backdrop-blur-md transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-glow">
                  <span className="icon-duotone mr-1">
                    <svg className="icon-duotone-secondary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <svg className="icon-duotone-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  <span className="relative">
                    Войти
                  </span>
                </span>
              </Link>

              <Link href="/auth/register" className="nav-link group">
                <span className="relative inline-flex items-center px-3 py-2 rounded-lg bg-glass-background border border-glass-border backdrop-blur-md transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-glow">
                  <span className="icon-duotone mr-1">
                    <svg className="icon-duotone-secondary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <svg className="icon-duotone-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </span>
                  <span className="relative">
                    Регистрация
                  </span>
                </span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}