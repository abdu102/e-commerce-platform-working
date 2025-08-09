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
  // New translations for ProductPage and HomePage
  productNotFound: { en: 'Product not found', ru: 'Товар не найден' },
  goBackToHome: { en: 'Go back to home', ru: 'Вернуться на главную' },
  inStock: { en: 'in stock', ru: 'в наличии' },
  outOfStock: { en: 'Out of stock', ru: 'Нет в наличии' },
  selectColor: { en: 'Color', ru: 'Цвет' },
  selectSize: { en: 'Size', ru: 'Размер' },
  onlyLeftInStock: { en: 'Only {stock} left in stock', ru: 'Осталось только {stock} шт.' },
  freeShipping: { en: 'Free Shipping', ru: 'Бесплатная доставка' },
  onOrdersOver: { en: 'On orders over $50', ru: 'При заказе от $50' },
  securePayment: { en: 'Secure Payment', ru: 'Безопасная оплата' },
  secureCheckout: { en: '100% secure checkout', ru: '100% безопасная оплата' },
  easyReturns: { en: 'Easy Returns', ru: 'Легкий возврат' },
  returnPolicy: { en: '30 day return policy', ru: 'Возврат в течение 30 дней' },
  questionsAndAnswers: { en: 'Questions & Answers', ru: 'Вопросы и ответы' },
  yourRating: { en: 'Your Rating', ru: 'Ваша оценка' },
  yourComment: { en: 'Write your review...', ru: 'Напишите ваш отзыв...' },
  submitReview: { en: 'Submit Review', ru: 'Отправить отзыв' },
  processing: { en: 'Processing...', ru: 'Обработка...' },
  askAQuestion: { en: 'Ask a question...', ru: 'Задайте вопрос...' },
  // HomePage translations
  summerTechSale: { en: 'Summer Tech Sale', ru: 'Летняя распродажа техники' },
  upTo40Off: { en: 'Up to 40% off on top brands', ru: 'До 40% скидки на топ бренды' },
  shopNow: { en: 'Shop Now', ru: 'Купить сейчас' },
  backToSchool: { en: 'Back to School', ru: 'К школе' },
  laptopsAndMore: { en: 'Laptops, tablets and accessories', ru: 'Ноутбуки, планшеты и аксессуары' },
  proAccessories: { en: 'Pro Accessories', ru: 'Про аксессуары' },
  gearForCreators: { en: 'Gear for creators and gamers', ru: 'Оборудование для создателей и геймеров' },
  discoverAmazing: { en: 'Discover Amazing', ru: 'Откройте удивительную' },
  technology: { en: 'Technology', ru: 'Технологию' },
  findTheLatestGadgets: { en: 'Find the latest gadgets and electronics at unbeatable prices', ru: 'Найдите последние гаджеты и электронику по непревзойденным ценам' },
  searchForProducts: { en: 'Search for products...', ru: 'Поиск товаров...' },
  priceMin: { en: 'Min Price', ru: 'Мин. цена' },
  priceMax: { en: 'Max Price', ru: 'Макс. цена' },
  sort: { en: 'Sort', ru: 'Сортировка' },
  newest: { en: 'Newest', ru: 'Новейшие' },
  priceLowToHigh: { en: 'Price: Low to High', ru: 'Цена: по возрастанию' },
  priceHighToLow: { en: 'Price: High to Low', ru: 'Цена: по убыванию' },
  onlyInStock: { en: 'Only in stock', ru: 'Только в наличии' },
  reset: { en: 'Reset', ru: 'Сбросить' },
  noProductsFound: { en: 'No products found', ru: 'Товары не найдены' },
  tryAdjustingYourSearchTerms: { en: 'Try adjusting your search terms or browse all categories', ru: 'Попробуйте изменить поисковые запросы или просмотрите все категории' },
  // Admin translations
  adminDashboard: { en: 'Admin Dashboard', ru: 'Панель администратора' },
  // Checkout translations
  backToCart: { en: 'Back to Cart', ru: 'Вернуться в корзину' },
  checkout: { en: 'Checkout', ru: 'Оформить заказ' },
  shippingInformation: { en: 'Shipping Information', ru: 'Информация о доставке' },
  phoneNumber: { en: 'Phone Number', ru: 'Номер телефона' },
  paymentInformation: { en: 'Payment Information', ru: 'Информация об оплате' },
  cardNumber: { en: 'Card Number', ru: 'Номер карты' },
  expiryDate: { en: 'Expiry Date', ru: 'Дата истечения' },
  cardholderName: { en: 'Cardholder Name', ru: 'Имя владельца карты' },
  placeOrder: { en: 'Place Order', ru: 'Разместить заказ' },
  // Cart translations
  yourCart: { en: 'Your Cart', ru: 'Ваша корзина' },
  subtotalFor: { en: 'Subtotal for {count} {plural}', ru: 'Промежуточный итог для {count} {plural}' },
  // Orders translations
  yourOrders: { en: 'Your Orders', ru: 'Ваши заказы' },
  noOrdersYet: { en: 'No orders yet', ru: 'Пока нет заказов' },
  placeOrderToSee: { en: 'Place an order to see it listed here.', ru: 'Разместите заказ, чтобы увидеть его здесь.' },
  orderId: { en: 'Order ID', ru: 'ID заказа' },
  date: { en: 'Date', ru: 'Дата' },
  status: { en: 'Status', ru: 'Статус' },
  actions: { en: 'Actions', ru: 'Действия' },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dictionary, params?: Record<string, string | number>) => string;
  tnCategory: (name: string) => string;
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

  const t = (key: keyof typeof dictionary, params?: Record<string, string | number>) => {
    let translatedText = dictionary[key]?.[lang] ?? key;
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translatedText = translatedText.replace(`{${param}}`, String(value));
      });
    }
    return translatedText;
  };

  const tnCategory = (name: string) => {
    if (lang === 'en') return name;
    const map: Record<string, string> = {
      'Electronics': 'Электроника',
      'Laptops': 'Ноутбуки',
      'Smartphones': 'Смартфоны',
      'Accessories': 'Аксессуары',
      'Cameras': 'Камеры',
      'Audio': 'Аудио',
      'Wearables': 'Носимые устройства',
      'Gaming': 'Игры',
      'Home Appliances': 'Бытовая техника',
      'Drones': 'Дроны',
      'Tablets': 'Планшеты',
      'Printers': 'Принтеры',
      'Monitors': 'Мониторы',
      'Networking': 'Сетевое оборудование',
      'Storage': 'Хранение данных',
      'Software': 'Программное обеспечение',
      'Peripherals': 'Периферия',
      'Smart Home': 'Умный дом',
      'Health & Fitness': 'Здоровье и фитнес',
      'Virtual Reality': 'Виртуальная реальность',
    };
    return map[name] || name;
  };

  const value = useMemo(() => ({ lang, setLang, t, tnCategory }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}


