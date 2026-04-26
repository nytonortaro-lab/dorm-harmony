"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language } from "./i18n";

export type Theme = "light" | "dark" | "system";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
  isDark: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("zh");
  const [theme, setThemeState] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 初始化: 从 localStorage 恢复设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    
    setMounted(true);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (!mounted) return;

    const updateTheme = () => {
      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(prefersDark);
      } else {
        setIsDark(theme === "dark");
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme, mounted]);

  // 更新 HTML 类名
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        t,
        isDark,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
