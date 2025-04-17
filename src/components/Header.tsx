import React from 'react';

export function Header() {
    return (
      <header className="border-b">
        <div className="container mx-auto h-16 flex items-center justify-between">
          <span className="font-bold text-xl">LifeGuide</span>
          {/* TODO: Добавить навигацию, кнопку темы */}
        </div>
      </header>
    );
  } 