'use client';

import { useState, useEffect } from 'react';
import { User } from './supabase';

// Хук для получения текущего пользователя из localStorage
export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

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
    const handleStorageChange = (event: StorageEvent) => {
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

  return { user, status };
}
