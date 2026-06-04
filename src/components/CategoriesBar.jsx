import React from 'react';
import { Grid, Cpu, Shirt, Home, Compass, BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CategoriesBar({ activeCategory, setActiveCategory }) {
  const { t } = useLanguage();

  const categoryItems = [
    { id: 'all', labelKey: 'categories.all', icon: Grid },
    { id: 'electronics', labelKey: 'categories.electronics', icon: Cpu },
    { id: 'fashion', labelKey: 'categories.fashion', icon: Shirt },
    { id: 'home', labelKey: 'categories.home', icon: Home },
    { id: 'sports', labelKey: 'categories.sports', icon: Compass },
    { id: 'books', labelKey: 'categories.books', icon: BookOpen },
    { id: 'beauty', labelKey: 'categories.beauty', icon: Sparkles }
  ];

  return (
    <div className="categories-bar">
      <div className="categories-inner">
        {categoryItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`category-tab ${activeCategory === item.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(item.id)}
            >
              <Icon size={16} />
              <span>{t(item.labelKey)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
