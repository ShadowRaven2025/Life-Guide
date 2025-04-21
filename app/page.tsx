'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ClientLayout } from './ClientLayout'

type Advice = {
  id: string
  category: 'psychology' | 'study' | 'life'
  question: string
  answer: string
}

export default function Home() {
  const [advices, setAdvices] = useState<Advice[]>([])
  const [activeCategory, setActiveCategory] = useState<'all' | Advice['category']>('all')
  const [showForm, setShowForm] = useState(false)
  const [newAdvice, setNewAdvice] = useState<Omit<Advice, 'id'>>({ 
    category: 'psychology', 
    question: '', 
    answer: '' 
  })

  // Загрузка данных
  useEffect(() => {
    const savedAdvices = localStorage.getItem('lifeGuideAdvices')
    if (savedAdvices) {
      setAdvices(JSON.parse(savedAdvices))
    }
  }, [])

  // Сохранение советов
  useEffect(() => {
    if (advices.length > 0) {
      localStorage.setItem('lifeGuideAdvices', JSON.stringify(advices))
    }
  }, [advices])


  const handleAddAdvice = () => {
    if (newAdvice.question.trim() && newAdvice.answer.trim()) {
      setAdvices([...advices, {
        ...newAdvice,
        id: Date.now().toString()
      }])
      setNewAdvice({ category: 'psychology', question: '', answer: '' })
      setShowForm(false)
    }
  }

  const filteredAdvices = activeCategory === 'all' 
    ? advices 
    : advices.filter(advice => advice.category === activeCategory)

  return (
    <ClientLayout>
      {/* Шапка */}
      <header className="container py-6 flex justify-between items-center border-b border-border/50">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          LifeGuide
        </h1>
      </header>

      {/* Основной контент */}
      <div className="container py-8 space-y-8">
        {/* Фильтры */}
        <div className="flex flex-wrap gap-3">
          {['all', 'psychology', 'study', 'life'].map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'secondary'}
              onClick={() => setActiveCategory(category as any)}
              className="capitalize px-4 py-2"
            >
              {category === 'all' ? 'Все' : 
               category === 'psychology' ? 'Психология' :
               category === 'study' ? 'Учеба' : 'Быт'}
            </Button>
          ))}
        </div>

        {/* Список советов */}
        <div className="grid gap-6">
          {filteredAdvices.length > 0 ? (
            filteredAdvices.map(advice => (
              <div 
                key={advice.id} 
                className="card hover:border-primary/50 transition-all"
              >
                <div className="space-y-3">
                  <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full inline-block">
                    {advice.category === 'psychology' && 'Психология'}
                    {advice.category === 'study' && 'Учеба'}
                    {advice.category === 'life' && 'Быт'}
                  </span>
                  <h3 className="text-xl font-semibold">{advice.question}</h3>
                  <p className="text-muted-foreground">{advice.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Пока нет советов. Добавьте первый!</p>
            </div>
          )}
        </div>

        {/* Кнопка добавления */}
        <div className="fixed bottom-8 right-8">
          <Button 
            size="lg" 
            className="rounded-full w-16 h-16 p-0 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
            onClick={() => setShowForm(true)}
          >
            <span className="text-3xl">+</span>
          </Button>
        </div>

        {/* Форма добавления */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="card max-w-md w-full shadow-2xl border-primary/30">
              <h2 className="text-2xl font-bold mb-6">Добавить совет</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
                  <select
                    className="w-full p-3 border rounded-lg bg-background"
                    value={newAdvice.category}
                    onChange={(e) => setNewAdvice({...newAdvice, category: e.target.value as Advice['category']})}
                  >
                    <option value="psychology">Психология</option>
                    <option value="study">Учеба</option>
                    <option value="life">Быт</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Вопрос</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg bg-background"
                    value={newAdvice.question}
                    onChange={(e) => setNewAdvice({...newAdvice, question: e.target.value})}
                    placeholder="Введите вопрос"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ответ</label>
                  <textarea
                    className="w-full p-3 border rounded-lg min-h-[120px] bg-background"
                    value={newAdvice.answer}
                    onChange={(e) => setNewAdvice({...newAdvice, answer: e.target.value})}
                    placeholder="Введите ответ"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2"
                  >
                    Отмена
                  </Button>
                  <Button 
                    onClick={handleAddAdvice}
                    disabled={!newAdvice.question.trim() || !newAdvice.answer.trim()}
                    className="px-6 py-2"
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}