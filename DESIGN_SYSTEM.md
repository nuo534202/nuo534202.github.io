# nuo534202 个人博客设计系统

## 设计概述

基于 Vercel 设计语言的启发，融合程序员风格与浅蓝色系主题，打造技术感、高级感并存的个人博客视觉系统。

---

## 色彩规范

### 主色调（蓝色系）
| 名称 | 色值 | 用途 |
|---|---|---|
| Blue 50 | `#f0f7ff` | 最浅背景、hover状态 |
| Blue 100 | `#d3e5ff` | 标签背景、soft填充 |
| Blue 200 | `#a8caff` | 装饰元素、分割线 |
| Blue 300 | `#7aadff` | 次要强调 |
| Blue 400 | `#4d8eff` | 图标、装饰 |
| Blue 500 | `#2563eb` | 主链接色、CTA |
| Blue 600 | `#1d4ed8` | 主按钮hover |
| Blue 700 | `#1e40af` | 深色强调 |
| Blue 800 | `#1e3a8a` | 标题、深色文字 |
| Blue 900 | `#172554` | 最深蓝色 |

### 中性色
| 名称 | 色值 | 用途 |
|---|---|---|
| Ink | `#0f172a` | 主标题、深色背景 |
| Body | `#334155` | 正文文字 |
| Mute | `#64748b` | 次要文字、占位符 |
| Hairline | `#e2e8f0` | 分割线、边框 |
| Hairline Strong | `#94a3b8` | 强调分割线 |
| Canvas | `#ffffff` | 卡片表面 |
| Canvas Soft | `#f8fafc` | 页面背景 |
| Canvas Soft 2 | `#f1f5f9` | 内嵌区域 |

### 语义色
| 名称 | 色值 | 用途 |
|---|---|---|
| Success | `#2563eb` | 成功状态（与主色统一） |
| Error | `#ef4444` | 错误状态 |
| Warning | `#f59e0b` | 警告状态 |

### 渐变系统
- **Hero Gradient**: `linear-gradient(135deg, #1e3a8a 0%, #2563eb 35%, #3b82f6 65%, #60a5fa 100%)`
- **Card Hover Gradient**: `linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)`
- **装饰线 Gradient**: `linear-gradient(90deg, #60a5fa, #2563eb)`

---

## 字体系统

### 字体家族
- **主字体**: `Inter, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif`
- **等宽字体**: `"JetBrains Mono", "Fira Code", "Consolas", "Monaco", monospace`

### 字号层级
| Token | 大小 | 字重 | 行高 | 字间距 | 用途 |
|---|---|---|---|---|---|
| display-xl | 48px | 700 | 52px | -1.5px | Hero标题 |
| display-lg | 32px | 700 | 40px | -1px | 区块标题 |
| display-md | 24px | 600 | 32px | -0.5px | 卡片标题 |
| display-sm | 20px | 600 | 28px | -0.3px | 小标题 |
| body-lg | 18px | 400 | 28px | 0 | 引导段落 |
| body-md | 16px | 400 | 24px | 0 | 正文 |
| body-sm | 14px | 400 | 20px | -0.2px | 次要文字 |
| caption | 12px | 400 | 16px | 0 | 标签、脚注 |
| code | 13px | 400 | 20px | 0 | 代码、技术标签 |

### 字体原则
- 标题使用负字间距，增强紧凑感
- 技术标签、代码片段使用等宽字体
- 正文保持400字重，标题600-700
- 代码元素用反引号包裹，配合浅蓝背景

---

## 间距系统

| Token | 值 | 用途 |
|---|---|---|
| xxs | 4px | 最小间隙 |
| xs | 8px | 紧凑间距 |
| sm | 12px | 组件内部 |
| md | 16px | 标准间距 |
| lg | 24px | 卡片内边距 |
| xl | 32px | 区块间距 |
| 2xl | 48px | 大区块 |
| 3xl | 64px | 页面级间距 |
| 4xl | 96px | 超大间距 |

---

## 圆角系统

| Token | 值 | 用途 |
|---|---|---|
| none | 0 | 全宽区块 |
| sm | 6px | 小按钮、输入框 |
| md | 8px | 卡片、图片 |
| lg | 12px | 大卡片 |
| xl | 16px | 模态框 |
| pill | 100px | 主按钮、标签 |
| full | 9999px | 圆形元素 |

---

## 阴影系统

| Level | 值 | 用途 |
|---|---|---|
| Level 0 | none | 扁平元素 |
| Level 1 | `0 0 0 1px rgba(0,0,0,0.05)` | 卡片边框 |
| Level 2 | `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)` | 基础卡片 |
| Level 3 | `0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)` | 悬停卡片 |
| Level 4 | `0 10px 15px -3px rgba(37,99,235,0.08), 0 4px 6px -4px rgba(37,99,235,0.04)` | 强调卡片 |
| Level 5 | `0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)` | 模态框 |

---

## 组件规范

### 导航栏
- 高度: 64px
- 背景: 白色 + 底部1px hairline边框
- 链接: body-sm, 灰色，hover变蓝色
- 移动端: 折叠为汉堡菜单

### 按钮
- **Primary**: Blue 500背景，白色文字，pill圆角，hover时Blue 600
- **Secondary**: 白色背景，Ink文字，1px hairline边框，pill圆角
- **Ghost**: 透明背景，hover时Canvas Soft背景

### 卡片
- 背景: Canvas
- 圆角: md (8px)
- 阴影: Level 2
- Hover: Level 4 + 边框变Blue 200
- 内边距: lg (24px)

### 代码标签
- 背景: Blue 50
- 文字: Blue 700
- 字体: 等宽
- 圆角: sm
- 内边距: 2px 8px

---

## 响应式断点

| 名称 | 宽度 | 关键变化 |
|---|---|---|
| Mobile | < 640px | 单列布局，汉堡菜单，卡片全宽 |
| Tablet | 640-1023px | 双列网格，导航保持水平 |
| Desktop | 1024-1279px | 三列网格，完整导航 |
| Wide | ≥ 1280px | 最大宽度1280px居中 |

---

## 程序员风格元素

### 视觉隐喻
- 代码片段样式的标签: `<Coding />`, `const Developer = true`
- 终端风格的装饰区块
- 等宽字体用于技术标签
- 反引号包裹的关键词
- 花括号 `{}` 作为装饰符号
- 注释风格的辅助文字: `// 欢迎来到我的博客`

### 交互反馈
- 卡片hover时轻微上浮 + 阴影增强
- 按钮hover时颜色加深 + 微缩放
- 链接hover时下划线动画
- 页面加载时的渐入动画
