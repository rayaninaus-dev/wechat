/**
 * Apple Design System 色彩配置
 * 为 WeVocab 微信小程序优化
 * 
 * 设计原则：
 * 1. 极简主义 - 最少化颜色，优先使用中性色
 * 2. 高对比度 - 确保可读性和无障碍性
 * 3. 优雅深度 - 通过微妙的阴影和渐变增加维度
 * 4. 语义清晰 - 每种颜色都有明确的用途
 */

// ============================================
// 核心色彩系统（Apple Style）
// ============================================

export const APPLE_COLORS = {
  // 中性色 - 极简的基础
  neutral: {
    // 浅色主题
    light: {
      background: '#FFFFFF',      // 主背景
      surface: '#F9F9F9',         // 卡片背景
      border: '#E5E5EA',          // 边框线
      text_primary: '#000000',    // 主文本
      text_secondary: '#8E8E93',  // 次文本
      text_tertiary: '#C7C7CC',   // 三级文本
      overlay: 'rgba(0, 0, 0, 0.05)',
    },
    // 深色主题
    dark: {
      background: '#000000',
      surface: '#1C1C1E',
      border: '#38383A',
      text_primary: '#FFFFFF',
      text_secondary: '#8E8E93',
      text_tertiary: '#424245',
      overlay: 'rgba(255, 255, 255, 0.05)',
    }
  },

  // 系统色 - Apple的标准系统颜色
  system: {
    // 蓝色 - 主要交互
    blue: {
      light: '#007AFF',
      medium: '#005FCC',
      dark: '#0051BA',
    },
    // 绿色 - 正确、成功
    green: {
      light: '#34C759',
      medium: '#30B746',
      dark: '#2AA739',
    },
    // 红色 - 错误、危险
    red: {
      light: '#FF3B30',
      medium: '#FF2D20',
      dark: '#D70015',
    },
    // 黄色 - 警告
    yellow: {
      light: '#FFCC00',
      medium: '#FFB800',
      dark: '#E6A700',
    },
    // 橙色 - 强调
    orange: {
      light: '#FF9500',
      medium: '#FF8C00',
      dark: '#E67E00',
    },
    // 紫色 - 学习进度
    purple: {
      light: '#AF52DE',
      medium: '#9C27B0',
      dark: '#7B1FA2',
    },
  },

  // 语义色 - 特定用途
  semantic: {
    light: {
      primary: '#007AFF',         // 主要按钮、链接
      success: '#34C759',         // 成功状态
      warning: '#FF9500',         // 警告
      danger: '#FF3B30',          // 危险
      info: '#007AFF',            // 信息
      accent: '#AF52DE',          // 强调色（学习）
    },
    dark: {
      primary: '#0A84FF',
      success: '#32D74B',
      warning: '#FF9F0A',
      danger: '#FF453A',
      info: '#0A84FF',
      accent: '#BF5AF0',
    }
  },

  // 特殊用途
  special: {
    light: {
      divider: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.18)',
      placeholder: 'rgba(0, 0, 0, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      divider: 'rgba(255, 255, 255, 0.08)',
      disabled: 'rgba(255, 255, 255, 0.18)',
      placeholder: 'rgba(255, 255, 255, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    }
  }
};

// ============================================
// Tailwind CSS 配置映射
// ============================================

export const TAILWIND_APPLE_CONFIG = {
  // 主背景
  'bg-apple-bg': 'bg-white dark:bg-black',
  'bg-apple-surface': 'bg-gray-50 dark:bg-neutral-900',
  'bg-apple-surface-secondary': 'bg-gray-100 dark:bg-neutral-800',

  // 文本颜色
  'text-apple-primary': 'text-black dark:text-white',
  'text-apple-secondary': 'text-gray-500 dark:text-gray-500',
  'text-apple-tertiary': 'text-gray-400 dark:text-gray-600',

  // 边框
  'border-apple': 'border-gray-200 dark:border-gray-700',
  'border-apple-light': 'border-gray-100 dark:border-gray-800',

  // 系统颜色
  'text-apple-primary-action': 'text-blue-500 dark:text-blue-400',
  'text-apple-success': 'text-green-500 dark:text-green-400',
  'text-apple-warning': 'text-orange-500 dark:text-orange-400',
  'text-apple-danger': 'text-red-500 dark:text-red-400',
  'text-apple-accent': 'text-purple-500 dark:text-purple-400',

  // 背景色
  'bg-apple-primary-action': 'bg-blue-500 dark:bg-blue-600',
  'bg-apple-success': 'bg-green-500 dark:bg-green-600',
  'bg-apple-warning': 'bg-orange-500 dark:bg-orange-600',
  'bg-apple-danger': 'bg-red-500 dark:bg-red-600',
};

// ============================================
// 组件级配色方案
// ============================================

export const COMPONENT_COLORS = {
  // 按钮配色
  button: {
    primary: {
      light: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
      dark: 'dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:active:bg-blue-800',
    },
    secondary: {
      light: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
      dark: 'dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:active:bg-gray-600',
    },
    ghost: {
      light: 'bg-transparent text-blue-500 hover:bg-blue-50 active:bg-blue-100',
      dark: 'dark:bg-transparent dark:text-blue-400 dark:hover:bg-gray-800 dark:active:bg-gray-700',
    },
  },

  // 卡片配色
  card: {
    light: 'bg-white border-gray-200 shadow-sm',
    dark: 'dark:bg-neutral-900 dark:border-gray-700 dark:shadow-black/20',
  },

  // 输入框配色
  input: {
    light: 'bg-gray-50 border-gray-200 text-black placeholder-gray-400',
    dark: 'dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500',
  },

  // 徽章配色
  badge: {
    primary: {
      light: 'bg-blue-100 text-blue-700',
      dark: 'dark:bg-blue-900 dark:text-blue-200',
    },
    success: {
      light: 'bg-green-100 text-green-700',
      dark: 'dark:bg-green-900 dark:text-green-200',
    },
    warning: {
      light: 'bg-orange-100 text-orange-700',
      dark: 'dark:bg-orange-900 dark:text-orange-200',
    },
    danger: {
      light: 'bg-red-100 text-red-700',
      dark: 'dark:bg-red-900 dark:text-red-200',
    },
  },
};

// ============================================
// 主题切换辅助函数
// ============================================

export function getAppleColor(colorName: string, isDarkMode: boolean) {
  if (isDarkMode) {
    return TAILWIND_APPLE_CONFIG[`${colorName}-dark`] || 
           `${colorName} dark:${colorName}-dark`;
  }
  return colorName;
}

// ============================================
// 渐变方案（极简版）
// ============================================

export const GRADIENTS = {
  // 学习进度 - 微妙的紫蓝渐变
  learning: 'from-blue-400 to-purple-400',
  
  // 成功完成 - 绿色到蓝色
  success: 'from-green-400 to-blue-400',
  
  // 激励徽章 - 金色渐变
  achievement: 'from-yellow-300 to-orange-400',
  
  // 中性渐变 - 灰色
  neutral: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
};

// ============================================
// 阴影方案（Apple Style）
// ============================================

export const SHADOWS = {
  // 极小阴影 - 微妙的深度
  xs: 'shadow-xs',
  
  // 小阴影 - 卡片使用
  sm: 'shadow-sm',
  
  // 中等阴影 - 模态框
  md: 'shadow-md',
  
  // 大阴影 - 浮窗
  lg: 'shadow-lg',
  
  // 内阴影 - 凹陷效果
  inner: 'shadow-inner',
  
  // 深色模式阴影
  dark_sm: 'dark:shadow-black/20',
  dark_md: 'dark:shadow-black/30',
};

export default APPLE_COLORS;
