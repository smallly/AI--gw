# AI-GTV 设计规范文档

> 本文档记录项目的 UI/UX 设计规范，供开发与设计同步使用。

---

## 一、基础样式

### 字体

| 用途 | 字体 | 类名 |
|------|------|------|
| 正文（默认） | Inter | `font-sans` |
| 代码 | JetBrains Mono | `font-mono` |
| 装饰标题 | Playfair Display | `font-serif` |

### 颜色

| 语义 | 颜色 | 使用场景 |
|------|------|----------|
| 页面背景 | `#FAFAFA` | 全局背景、主内容区 |
| 全屏页背景 | `#F5F5F7` | 绑定页等全屏模态页 |
| 主色 | `#2141d6` | 主要按钮、强调、图标、链接 |
| 主色浅 | `#2141d6/10` | 次级按钮背景、标签背景 |
| 正文主色 | `#1A1A1A` / `text-slate-900` | 标题、重要文字 |
| 正文次级 | `text-slate-800` | 普通正文 |
| 辅助文字 | `text-slate-400` | 描述、说明、占位文字 |
| 边框 | `border-slate-200` | 卡片边框 |
| 边框（强调） | `border-slate-300` | 输入框边框 |
| 不可用背景 | `bg-slate-200` | 主按钮禁用态 |
| 不可用文字 | `text-slate-400` | 所有按钮禁用态文字 |

---

## 二、组件规范

### 卡片（Card）

```
圆角：rounded-xl
背景：bg-white
边框：border border-slate-200
阴影：无
内边距：p-5
```

- 不使用 `shadow`，通过边框区分层次
- 不使用 `rounded-2xl` 及以上的大圆角

### 输入框（Input）

```
背景：bg-white
边框：border border-slate-300
圆角：rounded-xl
阴影：shadow-sm
聚焦：focus:ring-2 focus:ring-indigo-500/30
```

### 主要按钮（Primary Button）

```
背景：bg-[#2141d6]
文字：text-white
圆角：rounded-xl
字重：font-semibold
悬停：hover:bg-[#1935b8]
点击：active:scale-95
禁用：disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed
```

> **规则：所有按钮禁用态统一使用灰色（`bg-slate-200 text-slate-400`），不使用 opacity 降低原色。**

### 次级按钮（Secondary Button）

```
背景：bg-[#2141d6]/10
文字：text-[#2141d6]
圆角：rounded-xl
字重：font-semibold
悬停：hover:bg-[#2141d6]/20
禁用：disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
```

### 胶囊按钮（Pill Button，底部快捷操作）

```
背景：bg-white
边框：border border-slate-100
圆角：rounded-full
文字：text-xs font-medium text-slate-600
图标：text-indigo-500
阴影：shadow-sm
点击：active:scale-95
```

---

## 三、页面布局

### 整体结构

- 全屏高度：`h-screen overflow-hidden`
- 主内容区最大宽度：`max-w-4xl mx-auto`
- 底部安全区：`pb-12`（录音页面等全屏模态）

### 消息气泡

| 角色 | 最大宽度 | 背景 | 对齐 |
|------|----------|------|------|
| 用户 | `max-w-[85%] lg:max-w-[75%]` | `bg-[#EEEFF1]` | 右对齐 |
| AI | `max-w-full` | 透明 | 左对齐 |
| 演练模式 | `max-w-full` | `bg-amber-50 border border-amber-100` | 左对齐 |

### 底部操作栏

- 快捷操作按钮：**左对齐**，使用 `flex gap-2`（不加 `justify-center`）
- 输入框区域：`bg-white border border-slate-100 rounded-full shadow-lg`

---

## 四、项目列表页

### 搜索框

```
背景：bg-white
边框：border border-slate-300
圆角：rounded-xl
阴影：shadow-sm
```

### 项目条目

```
背景：bg-white（非录音中状态）
边框：border border-slate-200
圆角：rounded-2xl
阴影：shadow-sm
内边距：p-4
条目间距：space-y-1.5
```

- 录音中状态：`bg-indigo-50 border-indigo-200`
- 项目名称：`font-bold text-slate-800 text-sm truncate`，父容器用 `flex-1 min-w-0` 保证自适应宽度，不设固定 `max-w`

---

## 五、授权卡片（GTVBindingCard）

```
圆角：rounded-xl
背景：bg-white
边框：border border-slate-200
阴影：无
内边距：p-5
```

| 元素 | 样式 |
|------|------|
| 标题 | `font-semibold text-slate-900 text-base` |
| 描述文字 | `text-sm text-slate-400 leading-relaxed` |
| 操作按钮 | 次级按钮样式（`bg-indigo-50 text-indigo-600 rounded-xl font-semibold`） |

---

## 八、绑定页（BindingView）

### 页面结构

```
背景：bg-white（白色）
顶部：返回箭头靠左，无标题栏文字
内容区：px-6，居中排列
```

### Logo 区

```
尺寸：w-16 h-16，rounded-2xl
背景：bg-slate-50
图片：object-contain，w-12 h-12
```

标题：`text-xl font-bold text-slate-900 text-center`
副标题：`text-sm text-slate-400 text-center`

### 输入框

```
形状：rounded-full（胶囊形）
背景：bg-[#F5F5F5]（浅灰，无边框，无阴影）
内边距：px-6 py-4
文字：text-sm text-slate-800
占位文字：placeholder:text-slate-400
```

- **手机号**：独立一行，全宽
- **验证码**：与"获取验证码"文字按钮同行，共用一个胶囊容器
  - 输入框：`flex-1 bg-transparent`
  - 获取验证码：`text-[#2141d6] font-semibold text-sm`，倒计时时显示 `{n}s`，禁用时 `text-slate-400`

### 确认按钮

```
形状：rounded-full（胶囊形）
背景：bg-[#2141d6]
文字：text-white font-bold text-base
禁用：disabled:bg-slate-200 disabled:text-slate-400
```

### 交互流程

1. 输入 11 位手机号后"获取验证码"可点击，点击后进入 60s 倒计时
2. 输入 6 位验证码后"确认绑定"可点击
3. 点击"确认绑定" → 弹出演示选择弹窗（绑定成功 / 绑定失败）
4. **绑定成功**：页面关闭，toast 提示"授权成功"显示 2s，GTVBindingCard 按钮置灰改为"已授权"
5. **绑定失败**：弹出错误提示弹窗，文案"抱歉，暂未找到该手机号相关账号，无法完成关联，请联系人工客服。"，用户点击"知道了"关闭

### 弹窗样式

```
遮罩：bg-black/30 backdrop-blur-sm
卡片：bg-white rounded-2xl p-6 shadow-xl
位置：绝对居中（top-1/2 -translate-y-1/2）
```


```
宽度：w-[280px]
背景：bg-[#FAFAFA]
位置：右侧滑入
遮罩：bg-black/20 backdrop-blur-sm
```

---

## 七、动效规范

| 场景 | 动效 |
|------|------|
| 全屏页面进出 | `y: '100%' → 0`，spring 弹性（damping 25, stiffness 200） |
| 消息出现 | `opacity: 0→1, y: 10→0` |
| 侧边栏进出 | `x: '100%' → 0` |
| 录音波纹 | scale + opacity 循环，delay 间隔 0.4s |
| 按钮点击 | `active:scale-95 transition-all` |
