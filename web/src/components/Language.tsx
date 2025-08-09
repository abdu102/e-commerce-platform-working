import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'ru';

type Dictionary = Record<string, { en: string; ru: string }>; 

const dictionary: Dictionary = {
  home: { en: 'Home', ru: 'Главная' },
  cart: { en: 'Cart', ru: 'Корзина' },
  orders: { en: 'Orders', ru: 'Заказы' },
  admin: { en: 'Admin', ru: 'Админ' },
  profile: { en: 'Profile', ru: 'Профиль' },
  login: { en: 'Login', ru: 'Войти' },
  filters: { en: 'Filters', ru: 'Фильтры' },
  shopByCategory: { en: 'Shop by Category', ru: 'Покупки по категориям' },
  allProducts: { en: 'All Products', ru: 'Все товары' },
  view: { en: 'View', ru: 'Смотреть' },
  wishlist: { en: 'Wishlist', ru: 'Избранное' },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dictionary) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
    document.documentElement.setAttribute('lang', l);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = (key: keyof typeof dictionary) => dictionary[key]?.[lang] ?? key;

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}


