# Apple Design System for WeVocab
## 苹果风格设计系统完整指南

---

## 📋 目录

1. [设计原则](#design-principles)
2. [色彩系统](#color-system)
3. [组件规范](#component-specs)
4. [排版规范](#typography)
5. [间距和布局](#spacing-layout)
6. [阴影和深度](#shadows-depth)
7. [动画规范](#animations)
8. [实现指南](#implementation)

---

## <a id="design-principles"></a>1. 设计原则

### 极简主义 (Minimalism)
```
✅ 只使用必要的颜色
✅ 大量空白空间
✅ 清晰的视觉层级
✅ 去除装饰性元素
```

### 高对比度 (Accessibility)
```
✅ WCAG AA标准（最少4.5:1对比度）
✅ 支持无障碍使用
✅ 深浅主题都适用
✅ 清晰的焦点指示器
```

### 优雅深度 (Elegant Depth)
```
✅ 微妙的阴影而不是大阴影
✅ 细微的渐变
✅ 层级分明但不突兀
✅ 柔和的颜色过渡
```

### 语义清晰 (Semantic Clarity)
```
✅ 一致的颜色含义
✅ 可预见的交互
✅ 清晰的状态反馈
✅ 自解释的设计
```

---

## <a id="color-system"></a>2. 色彩系统

### 2.1 核心调色板

#### 中性色（基础）
```
浅色主题：
- 背景：#FFFFFF
- 表面：#F9F9F9
- 边框：#E5E5EA
- 文本主：#000000
- 文本次：#8E8E93
- 文本三：#C7C7CC

深色主题：
- 背景：#000000
- 表面：#1C1C1E
- 边框：#38383A
- 文本主：#FFFFFF
- 文本次：#8E8E93
- 文本三：#424245
```

#### 系统色（语义）
```
蓝色（主要操作）：#007AFF
绿色（成功）：#34C759
红色（错误）：#FF3B30
黄色（警告）：#FFCC00
橙色（强调）：#FF9500
紫色（学习）：#AF52DE
```

### 2.2 颜色使用规则

| 元素 | 浅色主题 | 深色主题 | 用途 |
|-----|--------|--------|------|
| 主要按钮 | Blue-500 | Blue-600 | CTA、主操作 |
| 次要按钮 | Gray-100 | Gray-800 | 次操作 |
| 正确状态 | Green-500 | Green-400 | 成功、已掌握 |
| 错误状态 | Red-500 | Red-400 | 错误、逾期 |
| 警告状态 | Orange-500 | Orange-400 | 需要注意 |
| 学习进度 | Purple-500 | Purple-400 | SRS进度 |

### 2.3 深色模式支持

```typescript
// 每个颜色都有浅色和深色版本
const appleStyle = {
  light: {
    primary: '#007AFF',
    success: '#34C759',
  },
  dark: {
    primary: '#0A84FF',
    success: '#32D74B',
  }
}

// Tailwind中使用
className="text-blue-500 dark:text-blue-400"
className="bg-white dark:bg-neutral-900"
```

---

## <a id="component-specs"></a>3. 组件规范

### 3.1 按钮规范

#### 主按钮（Primary）
```tsx
<button className="px-6 py-3 bg-blue-500 text-white rounded-lg 
                   font-semibold shadow-sm hover:bg-blue-600 
                   active:bg-blue-700 transition-colors
                   dark:bg-blue-600 dark:hover:bg-blue-700">
  按钮文本
</button>
```

#### 次按钮（Secondary）
```tsx
<button className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg 
                   font-semibold hover:bg-gray-200 
                   active:bg-gray-300 transition-colors
                   dark:bg-gray-800 dark:text-white">
  按钮文本
</button>
```

#### 幽灵按钮（Ghost）
```tsx
<button className="px-6 py-3 bg-transparent text-blue-500 rounded-lg
                   hover:bg-blue-50 active:bg-blue-100 transition-colors
                   dark:text-blue-400 dark:hover:bg-gray-800">
  按钮文本
</button>
```

### 3.2 卡片规范

```tsx
<div className="bg-white dark:bg-neutral-900 
                border border-gray-200 dark:border-gray-700
                rounded-xl p-4 shadow-sm">
  卡片内容
</div>
```

**样式特性：**
- 圆角：rounded-xl (12px)
- 内边距：p-4
- 阴影：shadow-sm（微妙）
- 边框：1px solid gray-200/700

### 3.3 输入框规范

```tsx
<input className="w-full px-4 py-3 
                  bg-gray-50 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  text-black dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-blue-500 dark:focus:ring-blue-400"
       placeholder="输入框" />
```

### 3.4 徽章规范

```tsx
<span className="px-3 py-1 rounded-full text-sm font-semibold
                 bg-blue-100 text-blue-700
                 dark:bg-blue-900 dark:text-blue-200">
  新
</span>
```

---

## <a id="typography"></a>4. 排版规范

### 4.1 字体栈

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Helvetica Neue', Arial, sans-serif;
```

### 4.2 字体尺寸和权重

| 用途 | 尺寸 | 权重 | 行高 | 示例 |
|-----|------|------|------|------|
| 主标题 | 28px | 700 | 1.3 | 页面标题 |
| 副标题 | 22px | 600 | 1.4 | 卡片标题 |
| 正文 | 16px | 400 | 1.5 | 普通文本 |
| 小文本 | 14px | 500 | 1.4 | 标签、提示 |
| 超小文本 | 12px | 400 | 1.3 | 说明文本 |

### 4.3 排版示例

```tsx
// 主标题
<h1 className="text-2xl font-bold text-black dark:text-white">
  标题
</h1>

// 副标题
<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
  副标题
</h2>

// 正文
<p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
  正文内容...
</p>

// 辅助文本
<p className="text-sm text-gray-500 dark:text-gray-400">
  辅助说明
</p>
```

---

## <a id="spacing-layout"></a>5. 间距和布局

### 5.1 间距系统

```
基础单位：4px

尺寸规律：
- xs: 4px   (small padding)
- sm: 8px   (compact)
- md: 12px  (default)
- lg: 16px  (comfortable)
- xl: 24px  (spacious)
- 2xl: 32px (very spacious)
```

### 5.2 应用示例

```tsx
// 页面内边距
className="px-4 py-6"   // md + lg

// 组件间距
className="gap-4"       // 组件之间

// 卡片内边距
className="p-4"         // 标准

// 紧凑列表
className="space-y-2"   // 列表项间距
```

### 5.3 布局网格

```
移动设备（375px宽）：
- 边距：16px
- 内容宽：343px
- 列数：1 (单列卡片)

折叠设备（底部导航）：
- pb-32（为底部导航留空）
```

---

## <a id="shadows-depth"></a>6. 阴影和深度

### 6.1 Apple风格阴影

```
原则：微妙而优雅，不是深色和戏剧性

- xs (微妙)：0 1px 2px rgba(0,0,0,0.05)
- sm (卡片)：0 1px 3px rgba(0,0,0,0.1)
- md (浮窗)：0 4px 6px rgba(0,0,0,0.1)
- lg (模态)：0 10px 15px rgba(0,0,0,0.1)

深色模式：
- dark:shadow-sm → shadow-black/20
- dark:shadow-md → shadow-black/30
```

### 6.2 阴影应用

```tsx
// 卡片
className="shadow-sm"

// 浮窗
className="shadow-md"

// 模态框
className="shadow-lg"
```

---

## <a id="animations"></a>7. 动画规范

### 7.1 动画原则

```
✅ 时长：150-300ms（快速响应）
✅ 缓动：ease-in-out（自然感）
✅ 用途：反馈、过渡、吸引注意力
✅ 禁忌：过度动画、分散注意力
```

### 7.2 常用动画

```tsx
// 按钮点击
className="active:scale-95"

// 淡入淡出
className="transition-opacity duration-200"

// 背景色过渡
className="transition-colors duration-200"

// 滑入
className="animate-in slide-in-from-right duration-200"

// 弹跳
className="animate-bounce"
```

---

## <a id="implementation"></a>8. 实现指南

### 8.1 Tailwind配置更新

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // 支持深色模式
  theme: {
    extend: {
      colors: {
        'apple-blue': '#007AFF',
        'apple-green': '#34C759',
        'apple-red': '#FF3B30',
        'apple-orange': '#FF9500',
        'apple-purple': '#AF52DE',
      },
      spacing: {
        'apple-sm': '8px',
        'apple-md': '12px',
        'apple-lg': '16px',
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
      }
    }
  }
}
```

### 8.2 在组件中使用

```tsx
import { useTheme } from '@/styles/ThemeProvider';

function MyComponent() {
  const { isDark } = useTheme();
  
  return (
    <div className={`
      bg-white dark:bg-neutral-900
      text-black dark:text-white
      border border-gray-200 dark:border-gray-700
      rounded-xl shadow-sm
      p-4
      transition-colors duration-200
    `}>
      内容
    </div>
  );
}
```

### 8.3 渐变使用

```tsx
// 学习进度
className="bg-gradient-to-r from-blue-400 to-purple-400"

// 成功
className="bg-gradient-to-r from-green-400 to-blue-400"

// 激励
className="bg-gradient-to-r from-yellow-300 to-orange-400"
```

---

## 📱 在微信小程序中的适配

### 关键点

1. **安全区域** - 使用 `safe-area-inset` 避免刘海/底部条
2. **深色模式** - WeChat API支持系统深色模式检测
3. **性能** - 避免大量阴影和模糊效果
4. **触感** - 使用 `active:` 状态而不是 hover（触摸设备）

### WeChat特定调整

```tsx
// 避免在小程序中使用 hover 效果
className="active:scale-95 active:opacity-80"  // ✅ 使用 active

// 而不是
className="hover:opacity-80"  // ❌ 小程序中无效
```

---

## 🎯 颜色检查清单

- [ ] 所有文本对比度 >= 4.5:1（WCAG AA）
- [ ] 深色模式下所有颜色都适配
- [ ] 状态颜色一致（绿=成功，红=错误）
- [ ] 按钮颜色符合语义
- [ ] 阴影在深色模式下可见
- [ ] 无纯黑色/纯白色（改用深灰/浅灰）

---

## 📚 参考资源

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

**设计标准由 GitHub Copilot 基于 Apple Design System 创建** ✨
