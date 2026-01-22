import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Apple风格的主题提供者
 * 支持：浅色、深色、跟随系统三种模式
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  // 初始化：检测系统主题偏好
  useEffect(() => {
    // 检查本地存储
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // 检测系统深色模式
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!savedTheme) {
      setIsDark(prefersDark);
    } else if (savedTheme === 'system') {
      setIsDark(prefersDark);
    } else {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 切换主题
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    } else {
      setIsDark(newTheme === 'dark');
    }

    // 更新DOM
    updateDOMTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * 更新DOM的theme属性
 */
function updateDOMTheme(theme: Theme) {
  const html = document.documentElement;
  
  if (theme === 'dark') {
    html.classList.add('dark');
  } else if (theme === 'light') {
    html.classList.remove('dark');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}

/**
 * 主题选择组件（可放在设置页面）
 */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          theme === 'light'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
        }`}
      >
        ☀️ Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          theme === 'dark'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
        }`}
      >
        🌙 Dark
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          theme === 'system'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
        }`}
      >
        ⚙️ System
      </button>
    </div>
  );
}
