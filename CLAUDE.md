# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是李强的个人简历/作品集网站。单页面应用，数据从 Supabase 动态拉取，Vite 构建，部署在 Vercel。

## 常用命令

```bash
npm run dev       # 启动 Vite 开发服务器
npm run build     # 生产构建，输出到 dist/
npm run preview   # 预览生产构建
```

## 核心架构

**单文件 SPA** — 整个应用在 `index.html` 一个文件中：HTML 结构 + 内联 CSS + 内联 JS 模块。无框架、无路由、无额外 JS 文件。所有静态资源（图片、字体）通过 `public/` 目录由 Vite 直接提供。

**数据层** — 通过 Supabase client (`@supabase/supabase-js`) 在运行时从四张表拉取数据：
- `personal_info` — 姓名、头衔、联系方式
- `highlights` — 亮点项目（编号、中英文标题、日期、预览图数组）
- `skills` — 技能卡片（AI应用/剪辑/办公软件）
- `ppt_works` — PPT 作品轮播的图片列表

Supabase 连接信息通过 Vite 环境变量（`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`）注入，定义在 `.env` 中。`.env.example` 提供模板。

**数据缓存** — `fetchResumeData()` 实现 localStorage 缓存层（key: `resumeData_cache`，有效期 10 分钟）。命中缓存时"秒开"，同时后台静默刷新数据并更新缓存。缓存读取失败时自动降级为网络请求。

**图片路径修复** — 数据库存储的旧图片路径包含中文字符，前端 `IMAGE_PATH_MAP` 映射表 + `fixImagePath()` 函数在运行时将中文路径自动修正为 `public/images/` 下的 ASCII 文件名。

**自定义滚动** — 页面不使用浏览器原生滚动。通过 `viewbox`（fixed 容器）+ `scrollbox`（transform: translateY）实现阻尼滚动。`ResizeObserver` 监听内容高度并同步到 `body.height` 作为虚拟滚动条。

**模态系统** — `#material-modal` 是全屏模态层。`openMaterial(index, type)` 根据类型渲染不同内容：
- `type='highlight'` + index 0/1：放映机特效（projector 图片 + 光束 + 扫描线文字）
- `type='highlight'` + index 2/3：PPT 无限画布模式（3×3 tile grid，可拖拽）。入场流程为两阶段：intro 界面（raining canvas 特效）→ 点击箭头 → 进入可拖拽 viewport
- `type='accordion'`：技能详情图片列表（index=2 额外显示"WPS撰写简历"标题）

PPT 画布使用 3×3 瓦片网格（每瓦片 5×4 图片），通过 CSS grid 实现无缝无限拖拽，鼠标拖拽时平移并取模循环。

**轮播** — `#works-exhibition` 区域展示 PPT 作品图片，每张图片叠加在 `框.png` 外框上，通过 opacity 切换实现渐显渐出。

**开屏动画** — 白色全屏 splash，最多等待 300ms 后 slide-up 消失，然后触发打字机效果。数据加载失败时强制关闭开屏并显示错误提示。

**主题系统** — 暗色/亮色切换，通过 `localStorage` 持久化，默认跟随系统 `prefers-color-scheme`。CSS 变量集中在 `:root` 和 `html.dark` 中定义。

**悬浮预览** — `#floating-preview` 在鼠标悬停于高亮行时跟随光标显示缩略图。编号为 01 的行使用 `mockup-frame` 并排展示两张图片，其余行展示单张图片。

## 其他交互功能

- **头像 3D 倾斜**（`initAvatarTilt`）：鼠标在头像上移动时产生 perspective 旋转
- **微信号复制**（`copyWechat`）：clipboard API 主方案，`execCommand` 降级方案
- **滚动揭示**（`initScrollReveal`）：IntersectionObserver 驱动元素淡入
- **打字机效果**（`typeWriter`）：开屏后逐字显示介绍文字，带随机速度抖动

## 部署

`vercel.json` 配置 Vercel 部署：构建命令 `npm run build`，输出目录 `dist`，框架类型 `vite`。

## Supabase 本地开发

`supabase/` 目录包含本地 Supabase CLI 配置（`config.toml`），可用 `supabase start` 启动本地实例。

## 注意事项

- `.env` 中包含 Supabase 密钥。当前目录是备份，原项目应使用 `.env.local` 且不提交到 git。
- `转场动画/` 目录是独立的页面转场实验（Vue SPA 和无刷新跳转），与主站无关。
- 字体文件较大（`.ttf`/`.ttc`），加载可能影响首屏性能。已加 `font-display: swap` 优化。
