"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  // Sync with localStorage + <html> class
  useEffect(() => {
    const saved = localStorage.getItem("ai-cure-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldBeDark);
    setDark(shouldBeDark);
  }, []);

  const toggleTheme = () => {
    if (dark === null) return;
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ai-cure-theme", next ? "dark" : "light");
    setDark(next);
  };

  // Avoid flicker by not rendering before theme is known
  if (dark === null) return null;

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="cursor-pointer rounded-full border border-border hover:bg-accent/20 hover:scale-105 transition-all duration-150"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      )}
    </Button>
  );
}
