"use client";

import { Languages, MonitorCog, Palette } from "lucide-react";
import { useApp } from "@/lib/app-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AppPreferencesProps = {
  compact?: boolean;
};

export function AppPreferences({ compact = false }: AppPreferencesProps) {
  const { language, setLanguage, theme, setTheme, styleMode, setStyleMode, t } =
    useApp();

  const wrapperClass = compact
    ? "grid gap-2 sm:grid-cols-3"
    : "grid gap-3";

  return (
    <div className={wrapperClass}>
      <label className="grid gap-1.5 text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Languages className="size-4" />
          {t("language")}
        </span>
        <Select value={language} onValueChange={(value) => setLanguage(value as "zh" | "en")}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <MonitorCog className="size-4" />
          {t("theme")}
        </span>
        <Select value={theme} onValueChange={(value) => setTheme(value as typeof theme)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">{t("systemMode")}</SelectItem>
            <SelectItem value="light">{t("lightMode")}</SelectItem>
            <SelectItem value="dark">{t("darkMode")}</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Palette className="size-4" />
          {t("styleMode")}
        </span>
        <Select
          value={styleMode}
          onValueChange={(value) => setStyleMode(value as typeof styleMode)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="harmony">{t("styleHarmony")}</SelectItem>
            <SelectItem value="forest">{t("styleForest")}</SelectItem>
            <SelectItem value="sunset">{t("styleSunset")}</SelectItem>
          </SelectContent>
        </Select>
      </label>
    </div>
  );
}
