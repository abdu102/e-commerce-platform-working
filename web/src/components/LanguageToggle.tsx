import { useLanguage } from './Language';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const isEN = lang === 'en';
  return (
    <div className="relative inline-flex items-center bg-gray-200/80 backdrop-blur rounded-full p-1 select-none shadow-inner">
      <button onClick={()=>setLang('en')} className="px-3 py-1 text-xs font-semibold text-gray-700">EN</button>
      <button onClick={()=>setLang('ru')} className="px-3 py-1 text-xs font-semibold text-gray-700">RU</button>
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`absolute top-1 bottom-1 w-8 rounded-full shadow bg-white ${isEN ? 'left-1' : 'left-11'}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isEN ? (
            <span role="img" aria-label="US flag">🇺🇸</span>
          ) : (
            <span role="img" aria-label="RU flag">🇷🇺</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}


