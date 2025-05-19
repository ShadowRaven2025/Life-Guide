'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../src/components/ui/button'
import { GlassButton } from '../src/components/ui/glass-button'
import { GlassCard } from '../src/components/ui/glass-card'
import { GlassContainer } from '../src/components/ui/glass-container'
import { GlassInput } from '../src/components/ui/glass-input'
import { getAdvices, createAdvice, Advice } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const [advices, setAdvices] = useState<Advice[]>([])
  const [activeCategory, setActiveCategory] = useState<'all' | Advice['category']>('all')
  const [showForm, setShowForm] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [newAdvice, setNewAdvice] = useState<Omit<Advice, 'id'>>({
    category: 'psychology',
    question: '',
    answer: '',
    created_at: new Date().toISOString()
  })

  // Load data and check authentication
  useEffect(() => {
    const loadAdvices = async () => {
      try {
        const data = await getAdvices();
        setAdvices(data);
      } catch (error) {
        console.error('Ошибка при загрузке советов:', error);
      }
    };

    // Проверка авторизации пользователя
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setIsAuthenticated(false);
      }
    };

    loadAdvices();
    checkAuth();
  }, []);

  const handleAddAdvice = async () => {
    // Проверяем авторизацию
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (newAdvice.question.trim() && newAdvice.answer.trim()) {
      try {
        // Получаем данные пользователя
        const storedUser = localStorage.getItem('user');
        let author_id = undefined;

        if (storedUser) {
          const user = JSON.parse(storedUser);
          author_id = user.id;
        }

        const createdAdvice = await createAdvice({
          category: newAdvice.category,
          question: newAdvice.question,
          answer: newAdvice.answer,
          author_id
        });

        if (createdAdvice) {
          setAdvices([createdAdvice, ...advices]);
          setNewAdvice({ category: 'psychology', question: '', answer: '', created_at: new Date().toISOString() });
          setShowForm(false);
        }
      } catch (error) {
        console.error('Ошибка при создании совета:', error);
      }
    }
  }

  // Функция для открытия формы добавления совета
  const handleOpenAddForm = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowForm(true);
    }
  }

  const filteredAdvices = activeCategory === 'all'
    ? advices
    : advices.filter(advice => advice.category === activeCategory)

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-slow-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-slow-float-delay"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Life Guide
                </span>
              </h1>

              <p className="text-xl text-foreground/80 max-w-lg">
                Платформа с полезными советами по психологии, учебе и организации жизни
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="px-6 py-3 shadow-md hover:shadow-lg transition-all">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Просмотреть советы
                </Button>
                <Button variant="secondary" className="px-6 py-3 bg-background/50 backdrop-blur-sm border-glass-border hover:bg-primary/10 hover:border-primary/30 shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Подробнее
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-2xl blur-xl opacity-50"></div>
              <div className="glass glass-card w-full h-auto relative shadow-xl border border-primary/10 dark:border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="relative h-full flex items-center justify-center p-4">
                  <div className="flex justify-center items-center w-full">
                    <img
                      src="/ideas-bulbs.svg"
                      alt="Идеи и вдохновение"
                      className="w-auto h-auto max-w-full"
                      style={{ maxHeight: '250px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-slow-float-reverse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Библиотека советов Life Guide
            </h2>

            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
              Изучите нашу коллекцию советов, которые помогут вам преодолеть жизненные трудности
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'psychology', 'study', 'life'].map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'secondary'}
                onClick={() => setActiveCategory(category as any)}
                className={`capitalize px-5 py-2.5 shadow-sm ${activeCategory === category ? 'shadow-md' : 'bg-background/50 backdrop-blur-sm border-glass-border hover:bg-primary/10 hover:border-primary/30'}`}
              >
                {category === 'all' ? 'Все' :
                 category === 'psychology' ? 'Психология' :
                 category === 'study' ? 'Учеба' : 'Жизнь'}
              </Button>
            ))}
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAdvices.length > 0 ? (
              filteredAdvices.map(advice => (
                <div
                  key={advice.id}
                  className="glass glass-card hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg border border-primary/10 dark:border-primary/20"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full inline-block">
                        {advice.category === 'psychology' && 'Психология'}
                        {advice.category === 'study' && 'Учеба'}
                        {advice.category === 'life' && 'Жизнь'}
                      </span>
                      <svg className="w-5 h-5 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">{advice.question}</h3>
                    <p className="text-foreground/70">{advice.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 glass glass-card shadow-md border border-primary/10 dark:border-primary/20">
                <div className="mb-6 inline-block">
                  <div className="bg-background/80 dark:bg-background/40 rounded-full p-4 backdrop-blur-md">
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Пока нет советов
                </h3>

                <p className="text-foreground/70 text-lg mb-8 max-w-md mx-auto">
                  Добавьте свой первый совет, чтобы начать формировать библиотеку знаний
                </p>

                <Button
                  onClick={handleOpenAddForm}
                  className="px-6 py-3 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить совет
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Button */}
      <div className="fixed bottom-20 right-8 z-40">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-light rounded-full blur opacity-30 animate-pulse"></div>
          <Button
            className="rounded-full w-14 h-14 p-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 relative"
            onClick={handleOpenAddForm}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass glass-card max-w-md w-full shadow-2xl border border-primary/10 dark:border-primary/20 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Требуется авторизация
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <svg className="w-5 h-5 text-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5 p-4">
              <div className="text-center mb-6">
                <div className="mb-4 inline-block">
                  <div className="bg-background/80 dark:bg-background/40 rounded-full p-3 backdrop-blur-md">
                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Для добавления советов необходимо войти</h3>
                <p className="text-foreground/70 mb-6">
                  Пожалуйста, войдите в свой аккаунт или зарегистрируйтесь, чтобы добавлять советы
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    router.push('/auth/signin');
                    setShowAuthModal(false);
                  }}
                  className="px-6 py-2.5 shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Войти
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    router.push('/auth/register');
                    setShowAuthModal(false);
                  }}
                  className="px-6 py-2.5 bg-background/50 backdrop-blur-sm border-glass-border hover:bg-primary/10 hover:border-primary/30 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Зарегистрироваться
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Guide Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass glass-card max-w-md w-full shadow-2xl border border-primary/10 dark:border-primary/20 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Добавить новый совет
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <svg className="w-5 h-5 text-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Категория
                </label>
                <select
                  className="w-full p-3 border rounded-[var(--radius)] bg-background/50 backdrop-blur-sm border-glass-border focus:border-primary/50 shadow-sm"
                  value={newAdvice.category}
                  onChange={(e) => setNewAdvice({...newAdvice, category: e.target.value as Advice['category']})}
                >
                  <option value="psychology">Психология</option>
                  <option value="study">Учеба</option>
                  <option value="life">Жизнь</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Вопрос
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-[var(--radius)] bg-background/50 backdrop-blur-sm border-glass-border focus:border-primary/50 shadow-sm"
                  value={newAdvice.question}
                  onChange={(e) => setNewAdvice({...newAdvice, question: e.target.value})}
                  placeholder="Введите ваш вопрос"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Ответ
                </label>
                <textarea
                  className="w-full p-3 border rounded-[var(--radius)] min-h-[120px] bg-background/50 backdrop-blur-sm border-glass-border focus:border-primary/50 shadow-sm"
                  value={newAdvice.answer}
                  onChange={(e) => setNewAdvice({...newAdvice, answer: e.target.value})}
                  placeholder="Введите ваш ответ"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-background/50 backdrop-blur-sm border-glass-border hover:bg-primary/10 hover:border-primary/30 shadow-sm"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleAddAdvice}
                  disabled={!newAdvice.question.trim() || !newAdvice.answer.trim()}
                  className="px-6 py-2.5 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить совет
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}