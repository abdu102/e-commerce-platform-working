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
  logout: { en: 'Logout', ru: 'Выйти' },
  filters: { en: 'Filters', ru: 'Фильтры' },
  shopByCategory: { en: 'Shop by Category', ru: 'Покупки по категориям' },
  allProducts: { en: 'All Products', ru: 'Все товары' },
  view: { en: 'View', ru: 'Смотреть' },
  wishlist: { en: 'Wishlist', ru: 'Избранное' },
  back: { en: 'Back', ru: 'Назад' },
  shoppingCart: { en: 'Shopping Cart', ru: 'Корзина' },
  items: { en: 'items', ru: 'товаров' },
  stock: { en: 'Stock', ru: 'В наличии' },
  available: { en: 'available', ru: 'шт.' },
  orderSummary: { en: 'Order Summary', ru: 'Итоги заказа' },
  subtotal: { en: 'Subtotal', ru: 'Промежуточный итог' },
  shipping: { en: 'Shipping', ru: 'Доставка' },
  free: { en: 'Free', ru: 'Бесплатно' },
  tax: { en: 'Tax', ru: 'Налог' },
  total: { en: 'Total', ru: 'Итого' },
  buyAllNow: { en: 'Buy All Now', ru: 'Купить все' },
  continueShopping: { en: 'Continue Shopping', ru: 'Продолжить покупки' },
  cartEmptyTitle: { en: 'Your cart is empty', ru: 'Ваша корзина пуста' },
  cartEmptyText: { en: "Looks like you haven't added any items to your cart yet. Start shopping to see some amazing products!", ru: 'Похоже, вы еще не добавили товары в корзину. Начните покупки!' },
  startShopping: { en: 'Start Shopping', ru: 'Начать покупки' },
  quantity: { en: 'Quantity', ru: 'Количество' },
  addToCart: { en: 'Add to Cart', ru: 'В корзину' },
  buyNow: { en: 'Buy Now', ru: 'Купить сейчас' },
  specifications: { en: 'Specifications', ru: 'Характеристики' },
  reviews: { en: 'Reviews', ru: 'Отзывы' },
  qa: { en: 'Questions & Answers', ru: 'Вопросы и ответы' },
  ask: { en: 'Ask', ru: 'Спросить' },
  askPlaceholder: { en: 'Ask a question...', ru: 'Задайте вопрос...' },
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


