# 云杉寨 · 官方页面

> 云杉为屏，木石为城

《我的世界》国际版第三方服务器上的玩家共建组织 —— 官网静态站点。

**纯静态 · 零依赖 · 零构建。** 没有 `npm install`，没有打包步骤，改完文件刷新浏览器就生效。

---

## 目录

- [快速开始](#快速开始)
- [目录结构](#目录结构)
- [页面与路由](#页面与路由)
- [日常维护](#日常维护)
  - [站点信息 site.js](#1-站点信息-datasitejs)
  - [成员 members.js](#2-成员-datamembersjs)
  - [建筑作品 buildings.js](#3-建筑作品-databuildingsjs)
  - [公告 announcements.js](#4-公告-dataannouncementsjs)
  - [里程碑 milestones.js](#5-里程碑-datamilestonesjs)
  - [新增一个栏目](#6-新增一个栏目)
- [功能说明](#功能说明)
- [样式与设计约定](#样式与设计约定)
- [部署](#部署)
- [已知待补](#已知待补)
- [浏览器支持](#浏览器支持)

---

## 快速开始

### 方式一：直接打开

双击 `index.html` 即可。所有路径都是相对的，本地也能跑。

### 方式二：本地服务器（推荐）

```bash
python -m http.server 8000
# 然后打开 http://127.0.0.1:8000/
```

装了 Node 也可以用 `npx serve .`。

推荐用服务器的原因：避免浏览器缓存旧 JS，且 `file://` 下个别浏览器对 `history.replaceState` 有限制（代码里已做容错，但走 HTTP 更接近线上环境）。

---

## 目录结构

```
.
├── index.html               页面骨架：启动页、顶栏、#app 容器、页脚挂载点
├── css/
│   └── style.css            全站样式（设计令牌 + 全部组件，单文件）
├── data/                    ← 日常维护只改这里
│   ├── site.js              站点配置：名称、导航、成员上限、文案、页脚、备案号
│   ├── members.js           成员名单
│   ├── buildings.js         建筑作品
│   ├── announcements.js     活动公告
│   └── milestones.js        里程碑 / 荣誉
├── js/
│   ├── core.js              公共工具：转义、日期、成员统计、图标、搜索、卡片模板
│   ├── layout.js            顶栏导航、页脚、侧边点导航、移动端菜单
│   ├── splash.js            启动页（一次性播放，约 4.3 秒）
│   ├── main.js              路由（# 哈希路由）与启动
│   └── pages/               每个栏目一个文件，注册到 CJY.pages
│       ├── home.js          首页
│       ├── members.js       成员名单
│       ├── buildings.js     建筑展示
│       ├── news.js          活动公告
│       ├── join.js          加入我们
│       └── about.js         关于云杉寨
├── assets/
│   ├── logo.png             站徽（白底方图，所有位置都放在白色圆板里）
│   ├── hero/big_space.jpg   驻地全景（首页 Banner 与「关于我们」配图）
│   └── avatars/             成员头像，建议 128×128 正方形
└── tools/
    └── generate-avatars.py  历史遗留脚本，见「已知待补」
```

### 渲染方式

`index.html` 里只有一个空的 `<div id="app">`。`js/main.js` 根据 URL 的 `#` 片段挑选页面，调用该页面的 `render()` 返回 HTML 字符串，一次性写入 `#app`；如果页面定义了 `mounted(root, params)`，再执行它绑定交互。

所以：**新增内容不用改 HTML，改 `data/` 里的文件即可。**

---

## 页面与路由

| 地址 | 页面 | 渲染文件 |
| --- | --- | --- |
| `#/` | 首页 | `js/pages/home.js` |
| `#/members` | 成员名单 | `js/pages/members.js` |
| `#/buildings` | 建筑展示 | `js/pages/buildings.js` |
| `#/news` | 活动公告 | `js/pages/news.js` |
| `#/join` | 加入我们 | `js/pages/join.js` |
| `#/about` | 关于云杉寨 | `js/pages/about.js` |

- 未知地址（如 `#/typo`）会渲染首页，并把地址栏自动修正回 `#/`。
- 路由支持查询参数，例如 `#/members?q=ariter` 会打开成员页并预先筛好关键词。

---

## 日常维护

### 1. 站点信息 `data/site.js`

全站通用配置。改完刷新即可。

| 字段 | 说明 |
| --- | --- |
| `name` / `nameEn` | 中文名 / 英文名 |
| `slogan` | 一句话标语，显示在 Banner 标题下、页脚 |
| `tagline` | 浏览器标签页标题用的补充说明 |
| `subtitle` | 组织定位，页脚兜底文案 |
| `established` | 成立日期 `YYYY-MM-DD`，用于算「成立月份」和年份 |
| `capacity` | **成员人数上限**。已加入人数自动统计，不用手改 |
| `goals.buildings` | **建筑收录目标**，首页进度条的分母。填 `0` 则显示「目标待补充」 |
| `version` | 版本号，显示在 Banner、页脚、启动页左下角 |
| `notice` | 首页顶部公告条文字。**留空则按剩余名额自动生成一句** |
| `nav` | 导航栏目数组，每项 `{ id, label, icon }`，`icon` 取值见「新增图标」 |
| `server` | 服务器资料，显示在「关于云杉寨」和加入页 |
| `links` | 对外链接：`qq` / `discord` / `bilibili` / `map`，留空显示「待补充」，填 URL 则渲染成链接 |
| `hero` | 首页 Banner：`image` / `imageAlt` / `badge` / `desc` |
| `about` | 关于页：`eyebrow` / `title` / `desc` / `paragraphs[]` / `features[]` |
| `join` | 加入页：`eyebrow` / `title` / `desc` / `intro` / `conditions[]` / `steps[]` / `contact` / `note` |
| `footer` | 页脚：`slogan` / `desc` / `disclaimer` / `copyright` / **`icp`** |

关于 `footer.icp`：填了才在页脚显示，并自动加上通往工信部备案系统的链接；留空整项不出现。

```js
footer: {
  icp: '粤ICP备2026000000号'   // 没有就留空字符串
}
```

### 2. 成员 `data/members.js`

在数组末尾追加一条即可，首页成员墙、成员页、统计数字、剩余名额会自动更新。

```js
{
  id: '15',                        // 编号，留空自动生成
  name: 'PlayerName',              // 游戏 ID / 昵称
  role: '成员',                    // 会长 / 副会长 / 精英 / 成员 / 见习
  title: '生电部',                 // 一句话头衔，留空显示「寨内成员」
  avatar: 'assets/avatars/PlayerName.png'
}
```

- **身份顺序**：`会长 → 副会长 → 精英 → 成员 → 见习`，名单按此排序；写了别的身份也能显示，只是排在最后。
- **头像**：放进 `assets/avatars/`，建议 128×128 正方形。`avatar` 留空或图片加载失败时会自动显示「首字」占位头像，不会出现破图。
- ⚠ **文件名必须逐字一致，大小写也要一致**：Windows 不区分大小写，写错了本地照样能显示，但部署到 Linux 服务器（Gitee Pages、GitHub Pages 等）就会 404。
- 想在成员页新增身份配色，在 `js/core.js` 的 `ROLE_ORDER` / `ROLE_CLASS` 各补一项，再到 `css/style.css` 补一个 `.role-chip.role-xxx`。

### 3. 建筑作品 `data/buildings.js`

```js
{
  id: 'b02',
  title: '寨门 · 第一次翻修',
  image: 'assets/works/gate.jpg',  // 图片放 assets/works/（自己新建这个目录）
  author: '北风',
  date: '2026-07-01',
  desc: '一段介绍，一两句话。',
  tags: ['公共建筑', '翻修']
}
```

作品数少于 3 件时，页面用虚线空槽补位 —— 空槽代表「位置已预留、内容待补充」，不是缺内容。

### 4. 公告 `data/announcements.js`

```js
{
  date: '2026-07-10',
  title: '公告标题',
  tag: '活动',        // 活动 / 通知 / 工程 / 招新，只是个小标签
  desc: '正文摘要，一两句话。'
}
```

数组为空时，首页和公告页显示「公告整理中」的空状态。

### 5. 里程碑 `data/milestones.js`

首页「云杉寨荣誉 · 里程碑」用卡片展示，「关于云杉寨」页用时间线展示，共用同一份数据。

```js
{
  date: '2026.06',
  title: '完成第一次驻地全景记录',
  icon: 'compass',    // 可选，取值见「新增图标」
  desc: '一句话说明。'
}
```

### 6. 新增一个栏目

1. 复制一个 `js/pages/*.js`，改名为新栏目，注册 `CJY.pages.新id = { title, render, mounted }`。
2. 在 `js/main.js` 的 `ROUTES` 数组里加上新 id。
3. 在 `index.html` 里加一行 `<script src="js/pages/新文件.js"></script>`（放在 `js/main.js` 之前）。
4. 在 `data/site.js` 的 `nav` 数组里加一项 —— 顶部导航和页脚会自动出现。

---

## 功能说明

**启动页** — 打开站点时展示 logo 与四周扩散的光效，约 4.3 秒后淡出；点击任意处 / 按 `Esc` 可跳过，同一标签页内只播一次（`sessionStorage` 记录）。

时长要改的话：改 `js/splash.js` 的 `DURATION`，并同步改 `css/style.css` 里 `.splash-progress i` 的 `animation-duration`（进度条时长 + 0.2s 延迟应等于 `DURATION`）。

**全站搜索** — 首页 Banner 内的搜索框可搜 成员 / 建筑 / 里程碑，带联想下拉，支持 `↑` `↓` 选择、`Enter` 确认、`Esc` 关闭；回车跳到成员页并带上关键词。

**成员页** — 模糊搜索（连续子串优先，否则按「顺序子序列」匹配，所以 `twb` 也能命中 `TheWindBlows2025`）、按身份筛选、卡片 / 列表两种视图。

**侧边点导航** — 仅首页出现，右侧竖排圆点对应各区块，滚动时自动高亮，点击平滑跳转。窗口宽度 ≤1180px 时自动隐藏。

**响应式断点** — 1180 / 1040 / 900 / 720 / 480px。900px 以下顶部导航收成汉堡菜单，720px 以下内容区留白收窄。

**无障碍** — 尊重系统「减少动态效果」设置（`prefers-reduced-motion`），禁用动画与平滑滚动；禁用 JS 时显示 `<noscript>` 提示；焦点样式统一走 `:focus-visible`。

---

## 样式与设计约定

`css/style.css` 是单文件，分 19 段，文件头有目录。**换主色只改 `:root` 里的 `--green-*` 即可全站生效。**

```
01 设计令牌   02 基础与重置   03 布局与容器   04 启动页     05 页头与导航
06 公告条/Banner  07 统计与目标卡  08 关于我们  09 区块与标题  10 按钮与面板
11 画廊与作品  12 荣誉与时间线  13 成员卡片  14 公告/空状态  15 加入页/关于页
16 侧边点导航  17 页脚        18 动效        19 响应式
```

### logo 的使用规则（重要）

`assets/logo.png` 是**白底方图**，而站点是浅色底。为了让白底边缘不露出方角，所有出现位置都把它放在一块**白色圆板**上（白 + 白 = 方边消失，只留下中间的树徽）：

| 位置 | 尺寸 | 类名 |
| --- | --- | --- |
| 顶部导航 | 40px | `.brand-logo` |
| Banner | 84–118px | `.banner-logo` |
| 启动页 | 124–184px | `.splash-logo` |
| 页脚 | 44px | `.footer-brand img` |

圆板靠 `background: #fff` + `border-radius: 50%` + 少量 `padding` 实现。**不要给 logo 加 `drop-shadow`**，阴影会把白色方块的边重新描出来（`.logo-card img` 那条注释就是在说明这点）。

### 新增图标

图标是内联 SVG，不是图标字体，无外部依赖。在 `js/core.js` 的 `ICONS` 对象里加一条即可：

```js
newIconName: '<path d="…"/>'
```

然后在需要的地方调用 `CJY.util.icon('newIconName')`。现有图标：

`tree` `grid` `users` `search` `card` `list` `box` `mail` `pin` `calendar` `home` `trophy` `clock` `pen` `sparkle` `hammer` `compass` `bell`

---

## 部署

纯静态站点，直接把整个目录上传到任意静态托管即可（Gitee Pages / GitHub Pages / Nginx / 对象存储）。

### 注意事项

1. **文件名大小写** — 部署到 Linux 服务器时路径区分大小写。本地（Windows）能显示、线上 404 的绝大多数原因都是这个，尤其是 `assets/avatars/` 里的头像。
2. **根路径** — 站点用的是相对路径，可以部署在子目录（如 `https://example.com/yunshan/`），无需改配置。
3. **ICP 备案** — 部署在国内服务器需要备案，备案号填到 `data/site.js` 的 `footer.icp`。
4. **社交分享图** — `index.html` 里 `og:image` 目前是相对路径 `assets/logo.png`。社交平台抓取分享卡片一般要求绝对 URL，确定域名后建议改成 `https://你的域名/assets/logo.png`。
5. **缓存** — 静态托管常会缓存 CSS/JS。改完样式没生效时先强制刷新（Ctrl+F5）。

---

## 已知待补

| 项 | 说明 |
| --- | --- |
| **3 个成员头像缺失** | `Nlkijh_124.png`、`xyyynhhhh01.png`、`JerryLi387.png` 尚未提供，目前走「首字」占位，不影响使用 |
| **ICP 备案号** | `data/site.js` 的 `footer.icp` 为空，页脚不显示这一项 |
| **建筑目标数** | `goals.buildings` 暂设 12，按实际规划调整 |
| **`tools/generate-avatars.py` 已过时** | 它生成的是 `01.png`…`16.png`，而现在的 `members.js` 按成员名取图，两者对不上（那批占位图也已在早期提交里删除）。要么改造成「读 `members.js` 按成员名生成、跳过已存在的文件」，要么直接删掉 |
| **公告 / 建筑内容偏少** | 结构已就绪，数据待补；作品不足 3 件、公告为空时走空状态与虚线空槽 |

---

## 浏览器支持

JS 全部是 ES5 语法（无箭头函数、无 `const`/`let`、无模板字符串），不做任何转译。

CSS 用到了 `clamp()`、`aspect-ratio`、`backdrop-filter`、`mask-image` 等较新的特性，因此需要**现代浏览器**：

Chrome / Edge 88+、Firefox 89+、Safari 15.4+。

不兼容 IE。
