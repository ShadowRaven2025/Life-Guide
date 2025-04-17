import React from 'react'; // Добавьте этот импорт

export function Footer() {
    return (
      <footer className="border-t mt-8">
        <div className="container mx-auto py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LifeGuide. Все права защищены (локально).
        </div>
      </footer>
    );
  }