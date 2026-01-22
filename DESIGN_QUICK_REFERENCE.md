# ⚡ Apple Design System 快速参考指南

## 🎨 核心色彩系统

### 主色 - Apple Blue
```
浅色：bg-blue-500 text-blue-600
深色：dark:bg-blue-600 dark:text-blue-400
使用：主按钮、进度条、激活状态、主要指标
```

### 背景色
```
浅色模式：bg-white
深色模式：dark:bg-black 或 dark:bg-gray-900
```

### 中立色
```
浅色：gray-50 / gray-100 / gray-200 / gray-700 / gray-800 / black
深色：gray-900 / gray-800 / gray-700 / gray-300 / gray-200 / white
```

### 系统色（用于数据分类）
```
成功绿：bg-green-50 dark:bg-green-900/20 + border-green-200 dark:border-green-700
错误红：bg-red-50 dark:bg-red-900/20 + border-red-200 dark:border-red-700
警告黄：bg-yellow-50 dark:bg-yellow-900/20 + border-yellow-200 dark:border-yellow-700
信息蓝：bg-blue-50 dark:bg-blue-900/20 + border-blue-200 dark:border-blue-700
强调紫：bg-purple-50 dark:bg-purple-900/20 + border-purple-200 dark:border-purple-700
```

---

## 📐 排版规范

### 标题
```tsx
<Text className="text-3xl font-bold">主标题</Text>      {/* 32px, bold */}
<Text className="text-2xl font-bold">副标题</Text>      {/* 24px, bold */}
<Text className="text-lg font-bold">小标题</Text>       {/* 18px, bold */}
<Text className="text-sm font-bold">标签</Text>        {/* 14px, bold */}
<Text className="text-xs font-bold">小标签</Text>      {/* 12px, bold */}
```

### 正文
```tsx
<Text className="text-base font-medium">正文内容</Text>   {/* 16px, medium */}
<Text className="text-sm text-gray-600">说明文字</Text>   {/* 14px, gray */}
<Text className="text-xs text-gray-500">备注文字</Text>   {/* 12px, light gray */}
```

---

## 🎯 组件样式模板

### 卡片容器
```tsx
<View className="bg-white dark:bg-gray-900 rounded-xl p-6 
                 shadow-sm border border-gray-200 dark:border-gray-800">
  {/* 内容 */}
</View>
```

### 主按钮
```tsx
<Button className="px-6 py-3 bg-blue-500 dark:bg-blue-600 
                   text-white rounded-lg font-semibold
                   active:scale-95 transition-transform" />
```

### 次按钮
```tsx
<Button className="px-6 py-3 bg-gray-100 dark:bg-gray-800
                   text-gray-700 dark:text-gray-300 rounded-lg font-semibold
                   active:scale-95" />
```

### 标签/徽章
```tsx
<View className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30
                 border border-blue-200 dark:border-blue-700
                 rounded-lg">
  <Text className="text-xs font-bold text-blue-700 dark:text-blue-300">标签</Text>
</View>
```

### 输入框
```tsx
<View className="px-4 py-2.5 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-lg focus:border-blue-500 dark:focus:border-blue-400" />
```

---

## 🌓 深色模式配置

### Tailwind 配置
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // 必须设置
  theme: {
    extend: {}
  }
}
```

### 主 HTML 元素
```html
<!-- 浅色模式 -->
<html class="">
  ...
</html>

<!-- 深色模式 -->
<html class="dark">
  ...
</html>
```

### ThemeProvider 使用
```tsx
import { ThemeProvider, useTheme } from './ThemeProvider'

// 在 App 根包裹
<ThemeProvider>
  <YourApp />
</ThemeProvider>

// 在组件中获取主题
const MyComponent = () => {
  const { theme, isDark, setTheme } = useTheme()
  return (
    <View className="bg-white dark:bg-black">
      {isDark ? '深色' : '浅色'}
    </View>
  )
}
```

---

## ✨ 动画原则

### 过渡时间
```
快速反馈：duration-150  {/* 元素触摸反馈 */}
标准过渡：duration-300  {/* 普通动画 */}
缓慢动画：duration-500  {/* 进度条、加载 */}
```

### 缓动函数
```
ease-in-out  {/* 标准缓动 */}
ease-out     {/* 快速结束 */}
linear       {/* 匀速 - 避免使用 */}
```

### 常用动画
```tsx
{/* 缩放反馈 */}
<View className="active:scale-95 transition-transform duration-150" />

{/* 淡入淡出 */}
<View className="opacity-0 hover:opacity-100 transition-opacity duration-300" />

{/* 颜色过渡 */}
<View className="bg-white hover:bg-gray-50 transition-colors duration-300" />

{/* 位置过渡 */}
<View className="translate-y-4 hover:translate-y-0 transition-transform duration-300" />
```

---

## 📦 代码示例库

### 完整卡片（学习卡示例）
```tsx
<View className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-900 
                 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
                 flex flex-col items-center justify-center p-8">
  <Text className="text-6xl font-bold text-gray-800 dark:text-white mb-6">
    {word}
  </Text>
  
  <View className="flex items-center gap-3 px-5 py-3 rounded-lg 
                   bg-gray-100 dark:bg-gray-800 cursor-pointer active:scale-95">
    <Volume2 size={22} className="text-blue-500 dark:text-blue-400" />
    <Text className="text-gray-800 dark:text-gray-200 font-mono text-lg">
      {phonetic}
    </Text>
  </View>
</View>
```

### 统计卡片
```tsx
<View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg 
                 border border-blue-200 dark:border-blue-700">
  <Text className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
    学习会话
  </Text>
  <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">
    {count}
  </Text>
  <Text className="text-xs text-blue-600 dark:text-blue-400 mt-1">
    次
  </Text>
</View>
```

### 进度条
```tsx
<View className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
  <View 
    className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</View>
```

### 标签组
```tsx
<View className="flex gap-2">
  {items.map((item, i) => (
    <View key={i} className="px-3 py-1.5 bg-white dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700
                             rounded-lg text-xs font-semibold
                             text-gray-700 dark:text-gray-300">
      {item}
    </View>
  ))}
</View>
```

---

## 🔧 常见错误避免

### ❌ 不要做这些
```tsx
// ❌ 只设置浅色
<View className="bg-blue-50 rounded-2xl shadow-2xl">

// ✅ 应该这样
<View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm 
                 border border-blue-200 dark:border-blue-700">

// ❌ 渐变在现代设计中过时
<View className="bg-gradient-to-r from-indigo-500 to-purple-500">

// ✅ 应该这样
<View className="bg-blue-500 dark:bg-blue-600">

// ❌ 深色模式忘记适配
<View className="text-gray-700">

// ✅ 应该这样
<View className="text-gray-700 dark:text-gray-300">

// ❌ 阴影过重
<View className="shadow-2xl shadow-indigo-300/50">

// ✅ 应该这样
<View className="shadow-sm">
```

---

## 🚀 性能优化建议

### CSS 优化
```tsx
// ❌ 避免动态类名
const color = isDark ? 'bg-gray-900' : 'bg-white'
<View className={color}>

// ✅ 使用 Tailwind dark: 前缀
<View className="bg-white dark:bg-gray-900">

// ❌ 避免自定义颜色
<View style={{ backgroundColor: '#123456' }}>

// ✅ 使用设计系统色
<View className="bg-blue-500">
```

### 动画性能
```tsx
// ❌ 避免 transform 之外的属性动画
<View className="transition-all" style={{ width: `${w}px` }}>

// ✅ 只动画 transform 和 opacity
<View className="transition-transform" style={{ transform: `scale(${scale})` }}>
```

---

## 📱 微信小程序特适配

### SafeArea 处理
```tsx
<View className="fixed bottom-0 w-full
                 pb-[env(safe-area-inset-bottom)]
                 pt-[env(safe-area-inset-top)]">
  {/* 导航栏 */}
</View>
```

### 触摸反馈（替代 hover）
```tsx
// ❌ 不在小程序中使用
<View className="hover:bg-gray-100">

// ✅ 在小程序中使用
<View className="active:bg-gray-100 active:scale-95">
```

### 系统深色模式检测
```tsx
// ThemeProvider 已自动处理
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const isDark = mediaQuery.matches
  // 自动应用深色主题
}, [])
```

---

## 📊 设计系统文件位置

| 文件 | 位置 | 用途 |
|------|------|------|
| appleColors.ts | `/services/` | 色彩定义 |
| ThemeProvider.tsx | `/components/` | 深色模式 |
| APPLE_DESIGN_SYSTEM.md | `/` | 详细规范 |

---

## 🎯 检查清单 - 添加新组件时

新建组件时确保：

- [ ] 背景色：`bg-white dark:bg-gray-900` 或 `bg-white dark:bg-black`
- [ ] 文本色：有对应的 `dark:text-*` 前缀
- [ ] 边框：使用 `border border-gray-200 dark:border-gray-800`
- [ ] 阴影：最多使用 `shadow-sm`
- [ ] 圆角：使用 `rounded-lg` (12px) 或 `rounded-xl` (16px)
- [ ] 按钮：主色为 `bg-blue-500 dark:bg-blue-600`
- [ ] 动画：使用 `transition-*` + `duration-*`
- [ ] 深色：所有颜色都有 `dark:` 变体

---

**快速参考卡准备好了！🎨✨**

需要具体代码示例？查看各组件源文件：
- WordCard.tsx（学习卡模式）
- StatsPanel.tsx（统计卡片模式）
- AchievementDisplay.tsx（系统色使用）

