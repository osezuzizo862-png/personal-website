# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是李强的个人简历/作品集网站。单页面应用，数据从 Supabase 动态拉取，Vite 构建。

## 常用命令

```bash
npm run dev       # 启动 Vite 开发服务器
npm run build     # 生产构建
npm run preview   # 预览生产构建
```

## 核心架构

**单文件 SPA** — 整个应用在 `index.html` 一个文件中：HTML 结构 + 内联 CSS（~600 行）+ 内联 JS 模块（~650 行）。无框架、无路由、无额外 JS 文件。

**数据层** — 通过 Supabase client (`@supabase/supabase-js`) 在运行时从四张表拉取数据：
- `personal_info` — 姓名、头衔、联系方式
- `highlights` — 亮点项目（编号、中英文标题、日期、预览图数组）
- `skills` — 技能卡片（AI应用/剪辑/办公软件）
- `ppt_works` — PPT 作品轮播的图片列表

Supabase 连接信息通过 Vite 环境变量（`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`）注入，定义在 `.env` 中。

**自定义滚动** — 页面不使用浏览器原生滚动。通过 `viewbox`（fixed 容器）+ `scrollbox`（transform: translateY）实现阻尼滚动。`ResizeObserver` 监听内容高度并同步到 `body.height` 作为虚拟滚动条。

**模态系统** — `#material-modal` 是全屏模态层。`openMaterial(index, type)` 根据类型渲染不同内容：
- `type='highlight'` + index 0/1：放映机特效（projector 图片 + 光束）
- `type='highlight'` + index 2/3：PPT 无限画布模式（3×3 tile grid，可拖拽）
- `type='accordion'`：技能详情图片列表

PPT 画布使用 3×3 瓦片网格（每瓦片 5×4 图片），通过 CSS grid 实现无缝无限拖拽，鼠标拖拽时平移并取模循环。

**轮播** — `#works-exhibition` 区域展示 PPT 作品图片，每张图片叠加在 `框.png` 外框上，通过 opacity 切换实现渐显渐出。

**开屏动画** — 白色全屏 splash，1.2 秒后 slide-up 消失，然后触发打字机效果。

## Supabase 本地开发

`supabase/` 目录包含本地 Supabase CLI 配置（`config.toml`），可用 `supabase start` 启动本地实例。生产环境使用云端项目 `aihdjvjjwxolwjasssim`。

## 注意事项

- `.env` 中包含 Supabase 密钥。当前目录是备份，原项目应使用 `.env.local` 且不提交到 git。
- `转场动画/` 目录是独立的页面转场实验（Vue SPA 和无刷新跳转），与主站无关。
- 字体文件较大（`.ttf`/`.ttc`），加载可能影响首屏性能。
