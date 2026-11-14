import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import es from "./locales/es.json";

// English is the source text, so it needs no dictionary.
const dictionaries = { en: null, es };

const getInitialLang = () => {
  try {
    const saved = localStorage.getItem("lang");
    if (saved in dictionaries) return saved;
  } catch {
    // storage blocked (sandboxed viewer, private mode)
  }
  const device = (typeof navigator !== "undefined" && navigator.language) || "en";
  return device.toLowerCase().startsWith("es") ? "es" : "en";
};

const LanguageContext = createContext({ lang: "en", dict: null, t: (text) => text, setLang: () => {} });

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem("lang", next);
    } catch {
      // storage blocked; the choice just won't persist
    }
  }, []);

  const value = useMemo(() => {
    const dict = dictionaries[lang];
    return { lang, dict, setLang, t: (text) => (dict && dict[text]) || text };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
