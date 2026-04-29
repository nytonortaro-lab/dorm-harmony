"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, type Language, type TranslationKey } from "./i18n";
import { type StyleMode, type ThemeMode } from "./dorm-data";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  styleMode: StyleMode;
  setStyleMode: (styleMode: StyleMode) => void;
  t: (key: TranslationKey) => string;
  isDark: boolean;
  mounted: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("zh");
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [styleMode, setStyleModeState] = useState<StyleMode>("harmony");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedLanguage = localStorage.getItem("language") as Language | null;
      const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
      const savedStyle = localStorage.getItem("styleMode") as StyleMode | null;

      if (savedLanguage === "zh" || savedLanguage === "en") {
        setLanguageState(savedLanguage);
      }

      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
        setThemeState(savedTheme);
      }

      if (savedStyle === "harmony" || savedStyle === "forest" || savedStyle === "sunset") {
        setStyleModeState(savedStyle);
      }

      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateTheme = () => {
      if (theme === "system") {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
        return;
      }

      setIsDark(theme === "dark");
    };

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [mounted, theme]);

  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;
    html.classList.toggle("dark", isDark);
    html.dataset.style = styleMode;
    html.lang = language === "zh" ? "zh-CN" : "en";
  }, [isDark, language, mounted, styleMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const setStyleMode = (nextStyleMode: StyleMode) => {
    setStyleModeState(nextStyleMode);
    localStorage.setItem("styleMode", nextStyleMode);
  };

  const t = (key: TranslationKey) => translations[language][key];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        styleMode,
        setStyleMode,
        t,
        isDark,
        mounted,
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
