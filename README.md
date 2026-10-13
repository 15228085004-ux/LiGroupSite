# 课题组官网 · React + Vite 基础版本

The University of Utah · Yuan (Stuart) Li Research Group（站点品牌名 `Li Group`）课题组介绍网站。

当前是**可运行、可预览的基础版本**：结构、样式、交互都已就位，所有文字/成员/论文都是**占位内容**，
后续替换成真实信息即可对外使用。

---

## 1. 技术栈与环境

- React 18 + Vite 5
- 纯 CSS（CSS 变量做设计 token，没有引入 UI 框架，方便后续自由调整）
- 无外部图片依赖、无外部字体依赖（首次加载快，也便于挂到学校服务器）
- 以 PC 端为主要展示目标，版心 **1700px**，同时保留了窄屏兜底样式

环境要求：Node.js ≥ 18。

## 2. 快速开始

**最省事的方式（Windows）**：直接双击项目根目录里的 `启动网站.cmd`。
它会自动检查依赖、启动本地预览、并打开浏览器；那个黑窗口关掉，预览就结束。
（第一次运行需要联网装依赖，之后几秒就能起来。）

```bash
# 安装依赖（npm / pnpm 均可）
npm install        # 或 pnpm install

# 本地开发预览（默认 http://127.0.0.1:5173）
npm run dev        # 或 pnpm dev

# 打包成静态文件（输出到 dist/）
npm run build      # 或 pnpm build

# 本地预览打包结果
npm run preview
```

## 3. 目录结构

```
├─ index.html                 # 页面入口（标题、描述、favicon）
├─ vite.config.js             # base: './' —— dist 可直接放到任意子目录
├─ public/favicon.svg         # 站点图标（当前为临时山形图标）
├─ docs/
│  ├─ BACKEND-API.md          # ★ 后端接口文档（可直接发给后端）
│  └─ openapi.yaml            # 同一套接口的机器可读定义（导入 Swagger/Postman）
└─ src/
   ├─ main.jsx                # 挂载 + 样式引入顺序
   ├─ App.jsx                 # 页面结构：DemoBar + Navbar + 各 section + 收尾页
   ├─ data/site.js            # ★ 全站文案都在这一个文件里
   ├─ utils/format.js         # {department} 之类的占位符替换
   ├─ hooks/
   │  ├─ useSiteMotion.js     # 全站动效（GSAP + ScrollTrigger）
   │  ├─ useMembers.js        # 成员数据（可接后端接口）
   │  ├─ useHashRoute.js      # hash 路由：#/news、#/team/<slug> …
   │  └─ useActiveSection.js  # 导航高亮
   ├─ components/             # 每个 section 一个组件
   ├─ pages/                  # 子页面（新闻列表/详情、人员、论文…）
   └─ styles/                 # tokens / base / layout / header / hero / sections / footer / news-page / responsive
```

## 4. 改内容只需要动一个文件

所有文案集中在 [`src/data/site.js`](src/data/site.js)，包括：学校与院系、课题组名称、Hero 文案与按钮、
关键数字、About、Research 方向、Team 成员、Publications、News、Join 招募信息、收尾页与联系方式。

几个约定：

- **导航**：`nav` 数组里的 `id` 必须和对应 `<section id="...">` 一致（目前是
  `home / research / team / publications / news`）。想加/减导航项，两边一起改即可。
- **占位链接**：`href: ''` 会渲染成虚线灰色、不可点击的状态（比如 PDF / Code / CV）。
  填上真实链接后会自动变成可点击样式，站外链接自动带 `target="_blank"`。
- **顶部提示条**：`demoNotice.enabled` 改成 `false` 即可隐藏「占位内容版本」提示条。
- **论文年份筛选**：年份标签由 `publications.items` 自动生成，增加论文时不用手动维护年份列表。

## 5. 已实现的模块

| # | 模块 | 说明 |
|---|---|---|
| 0 | 顶栏 | 学校风格：黑色底 + U 校标组合 + 课题组名 + 院系（右上）+ 全大写导航行 + 搜索/菜单按钮 |
| 1 | 全屏 Hero | 顶栏以下占满一屏，背景是自动轮播照片（交叉淡入 + 缓慢推近），大标题 + 一句话定位 + 双按钮 + 关键数字条，底部山脊剪影 |
| 2 | About | 组内定位、理念三卡片、一句 slogan |
| 3 | Research | 4 个研究方向卡片 + 设施与合作 |
| 4 | Team | PI 大卡片（含 Email / Scholar / CV / ORCID）+ 成员照片卡片；首页只展示前 `team.limit` 位，底部有「View all people」；有个人页的成员卡片可点，没写的就不跳转。Alumni & visitors 会越来越长，所以单独一页，首页和团队页只留入口条 |
| 5 | Publications | 首页展示最近 `publications.limit` 条，底部有「View all publications」进完整列表页；完整页带年份筛选（作者 / 会议 / PDF·Code·DOI）和 Google Scholar 入口 |
| 6 | News | 首页展示前 N 条（`news.limit`），每条可点进独立详情页；左侧有「View all news」进全部新闻列表页 |
| 7 | Join | 整幅红色 CTA，Ph.D. / Postdoc 两类要求 |
| 8 | 页脚 | 学校风格页脚：黑色三栏（Resources / 品牌块 + 联系方式 / Quick Links）+ 灰色法务条（版权、法务链接、社交图标）；回到顶部是右侧浮动按钮 |

交互细节：整条顶栏固定吸顶（黑色，与学校官网一致）、当前 section 红色下划线高亮、搜索浮层（本地索引，
覆盖研究方向 / 成员 / 论文 / 新闻）、汉堡菜单浮层、滚动进场动画、锚点平滑滚动、
`prefers-reduced-motion` 无障碍适配、键盘 focus 样式。

### 关于校标（重要）

`src/assets/brand/` 下的文件：

| 文件 | 内容 | 用途 |
|---|---|---|
| `interlocking-u-mark.png` | 官方 interlocking U 标记（红色，含 ®） | 顶栏与页脚的标记 |
| `u-wordmark.png` | 字标「THE UNIVERSITY of UTAH」 | 顶栏与页脚的字标 |
| `uu-logo-hrz.png` / `uu-institutional.png` | 官方横向 / 纵向锁定组合 | 备用变体 |

**标记和字标都是官方素材位图，没有用字体去排。** 官方字标是特定字体（尤其
斜体 `of` 的比例很独特），用 Myriad / Factoria 或任何替代字体重排都不可能一致，
所以字标是从官方高清锁定图里抠出来的透明 PNG（652×302，白色，8 倍下采样使用，
在深色底上足够锐利）。

标记、字标、间距三者的比例直接按官方锁定图写死（标记 508×472、字标 652×302、
间距 36、字标中心比标记中心低 31），只由一个 `--lockup-mark` 变量驱动缩放，
见 [`header.css`](src/styles/header.css) 的 `.u-logo`。要换尺寸只需改这一个变量。

矢量源文件（AI / EPS / SVG）学校不公开提供，需要走
[University Logo Request Form](https://brand.utah.edu/university-logo-request-form/) 申请；
留白、最小尺寸、颜色变体等规范见
[Logos & Marks](https://brand.utah.edu/branding/logos-marks/)。

### 首页背景照片（轮播）

照片列表在 [`site.js`](src/data/site.js) 的 `hero.slides`，换照片三步：

1. 把照片放进 `src/assets/hero/`（建议 1920×1080 以上、横向构图）
2. 在 `site.js` 顶部加一行 `import hero04 from '../assets/hero/hero-04.jpg'`
3. 把它加进 `hero.slides` 数组

行为说明：

- 每张停留 `hero.slideInterval` 毫秒（默认 6.5 秒），交叉淡入 1.8 秒，同时缓慢推近（Ken Burns）
- 切到后台标签页会自动暂停计时，回来继续
- 系统开了「减少动态效果」时不轮播、不推近
- 只放一张时轮播自动停掉；把 `slides` 清空就退回原来的纯渐变背景
- 照片上压了一层深色蒙版（`.hero--media .hero__bg`），房间亮度不够的照片可能看不清；
  照片很亮/很暗时，调 `hero.css` 里那三个 `rgba(...)` 的最后一个数值（0.5~0.9）即可

> **⚠️ 仓库里现在这三张 `hero-0x.jpg` 只是占位，正式发布前必须换掉。**
> 它们是学校品牌站 brand.utah.edu 上的公开宣传照（车间、校园、课堂），
> 里面是**可识别的真实人物，并不是课题组成员**。放在「课题组介绍」的语境下
> 会让人误以为是你组的成员，涉及肖像使用，务必替换成课题组自己的照片
> （实验室、组会、校园、合影都行，记得取得出镜者同意）。

### 页面结构（News 子页面）

站点主体是单页（section 锚点），News 另有两个子页面，用 **hash 路由**实现：

| 地址 | 内容 |
|---|---|
| `#news` | 首页的 News 板块（锚点滚动） |
| `#/news` | 全部新闻列表页 |
| `#/news/<slug>` | 单条新闻详情页 |
| `#publications` | 首页的 Publications 板块（锚点滚动） |
| `#/publications` | 全部论文列表页（年份筛选） |
| `#team` | 首页的 Team 板块（锚点滚动） |
| `#/team` | 全部成员列表页（PI + 成员 + Alumni） |
| `#/team/<slug>` | 成员个人页 |
| `#/team/alumni` | Alumni & visitors 名单页 |

用 hash 而不是 history API，是因为站点要挂到学校服务器、可能在任意子目录下，
hash 路由不需要任何服务端重写规则。路由代码在
[`src/hooks/useHashRoute.js`](src/hooks/useHashRoute.js)，两个页面在 `src/pages/`。

新闻内容集中在 [`site.js`](src/data/site.js) 的 `news.items`，每条包含：

```js
{
  slug: 'group-opens',        // URL 用，只能有字母数字和连字符
  date: '2026-09-01',         // ISO 日期，用于排序
  dateLabel: 'Sep 2026',      // 列表和详情页显示的时间
  tag: 'Announcement',        // 可选，会渲染成红色小标签
  title: '…',
  summary: '…',               // 列表页的一句话摘要
  body: ['段落 1', '段落 2'],  // 详情页正文
}
```

详情页底部会自动生成「上一条 / 下一条」导航（按 `date` 倒序），
首页板块只显示最近的 `news.limit` 条。站内搜索的新闻结果也直接指向详情页。

### 成员数据格式（后端可对接）

成员数据默认写在 `site.js` 的 `team.members`，字段如下——这套字段同时也是
**给后端/学生自助填写表单的数据约定**，1:1 对应即可：

```js
{
  slug: 'phd-student-one',   // 有 slug 才有个人页 #/team/<slug>，卡片才会可点；
                             // 不写 slug 的成员卡片就是静态展示（“有的就跳转”）
  name: 'Ph.D. Student One',
  role: 'Ph.D. Student',     // 卡片上的角色
  initials: 'P1',            // 没照片时显示的首字母
  photo: teamPhoto,          // 个人照片；留空则显示首字母占位块
  email: '…',                // 个人页上的 Email 按钮
  focus: 'Learning foundations',   // 一句话方向，卡片上显示
  since: '2026',             // 加入年份
  status: 'Ph.D. student, 1st year',        // 当前状态
  interests: ['…', '…'],                     // 研究兴趣标签
  education: [                               // 教育经历（本科/硕士/博士…）
    { degree: 'Ph.D. in Mining Engineering',
      institution: 'The University of Utah',
      period: '2026 – present' },
  ],
  experience: [                              // 工作 / 实习经历（可选）
    { title: 'Research Intern', organization: '…', period: 'Summer 2025',
      description: '…' },
  ],
  projects: [                                // 参与的项目（可选）
    { title: '…', period: '2026 – present', description: '…', link: '' },
  ],
  bio: ['段落 1', '段落 2'],                 // 个人页正文
  links: [{ label: 'Google Scholar', href: '…' }],   // 其他链接
}
```

个人页会按数据有无自动隐藏空区块：没有 `education` 就不显示「Education」标题，
没有 `projects` 就不显示项目区，所以后端只填一半也不会出现空壳。

**Alumni & visitors** 用另一套更轻的字段（`site.js` 的 `team.alumni`）：

```js
{
  name: 'Alumnus One',
  photo: '',                             // 照片（方形，建议 400px 以上）；留空显示姓名首字母
  role: 'M.S. Student',                  // 在组时的身份
  period: '2026 – 2027',                 // 在组时间
  position: {                            // 现在的去处（可选）
    title: 'Research Engineer',
    organization: 'Example Company',
    link: '',                            // 可选，会渲染成 visit 链接
  },
  link: '',                              // 个人主页 / LinkedIn，可选
}
```

名单在 `#/team/alumni`，**和在读成员用的是同一个卡片组件、同一套尺寸**
（1:1 方照片 + 姓名 + 身份 + 现任职位 + 在组时间），所以两边看起来完全一致。
卡片网格的列数是按容器宽度算的，并且保证卡宽在 220~280px 之间——
人少时不会两张卡占满整屏，人多时也不会出现「最后一行只落单一张」。
没照片的人显示姓名首字母，卡片高度完全一致。

首页和 `#/team` 只放一个入口条（`Alumni & visitors · N people`），不铺名单。

### 接后端：改 `dataSources` 里的地址就行

> 需要交给后端开发的完整接口清单、字段表、请求响应示例，见
> [`docs/BACKEND-API.md`](docs/BACKEND-API.md)（配套 `docs/openapi.yaml` 可直接导入
> Swagger / Postman / Apifox）。下面这一节只讲前端这边怎么接。

成员 / 校友 / 论文 / 新闻这四块的数据源开关集中在 `src/data/site.js` 顶部的
`dataSources` 里，留空用站内静态数据，填上接口地址就用接口数据：

```js
dataSources: {
  members: 'https://your-api.example.edu/api/public/members',
  alumni: '',        // 还没接后端就先留空
  publications: '',
  news: '',
  site: '',
},
```

几个已经处理好的细节：

- **接口挂了不会白屏**：请求失败、404、返回的不是数组 → 静默回落到静态数据
- **只请求一次**：结果缓存在模块作用域，首页 / 列表页 / 详情页共用
- **`photo` 用 URL 即可**：后端返回 `/uploads/xxx.jpg` 这样的路径就行，不需要 import
- 返回的数组顺序就是展示顺序（成员首页只取前 `team.limit` 位）

**想先本地试一下**：把地址指向 `public/data/` 下自带的样板文件，
例如 `news: './data/news.example.json'`，刷新后新闻区就完全用那份 JSON 渲染；
改回 `''` 恢复静态数据。这条链路（改地址生效 / 地址写错自动回落）已经实测通过。
样板文件与更细的说明见 [`public/data/README.md`](public/data/README.md)。

### 以后要做「内部平台」的三种做法

你们设想的「拼成一个平台，内部人员自己填」是完全可行的，前端这边已经准备好了接口位。
后端选型上有三条路，按投入从小到大：

| 方案 | 说明 | 适合 |
|---|---|---|
| **静态 JSON + Git** | 学生把信息按模板发给你/填进 JSON，提交后重新部署 | 现在就想用，人少、改动不频繁 |
| **Headless CMS**（Strapi / Directus / Sanity 等） | 装好就有后台登录、权限、富文本、图片上传；直接给你 REST/GraphQL 接口 | **最贴合你们设想**：不写后端代码也有完整管理后台 |
| **自建 API**（Node/Express 或 FastAPI + 数据库） | 最灵活，可对接学校统一身份认证 | 需要和学校系统深度集成时 |

不管选哪种，**前端要的都只是那一份 JSON 数组**，所以后端怎么换都不影响页面。
真的做平台时，除了成员信息，通常还要考虑这几件事：

1. **登录与权限**：每个人只能改自己的（Headless CMS 自带角色/字段级权限）
2. **图片上传与存储**：头像存哪、怎么给外链（CMS 一般直接给 URL）
3. **草稿 / 发布**：改完先预览再对外
4. **重建还是实时取数**：现在是运行时 `fetch`，后台改完刷新即可生效；
   如果走「静态 JSON + Git」则需要重新 `build`

照片规格：卡片和 PI 头像位都是 **1:1 方形**，`object-fit: cover` 自动裁切，
竖版照片也能用。建议边长 600px 以上。

> 现在所有成员都是 `photo: ''`，卡片显示的是红色渐变的首字母占位块——
> 这是有意留的：照片位已经占好、比例固定，照片补上后版面完全不变。

### 动效系统（GSAP + ScrollTrigger）

动效集中在两个文件里，不在组件里散着写：

- [`src/hooks/useSiteMotion.js`](src/hooks/useSiteMotion.js) —— 全部动画逻辑
- [`src/styles/motion.css`](src/styles/motion.css) —— 遮罩用的 `.anim-mask / .anim-line`，
  以及「只有 JS 接管时才隐藏待进场元素」的规则

**首屏 opening**：顶栏从上方落下 → 背景照片从 1.16 缩回 1 → 大标题遮罩揭开 + 压扁后归位
（`yPercent 118 → 0`、`scaleY 0.68 → 1`）→ 右侧文案 / 两个按钮 / meta / 数据条依次进场 →
滚动时背景轻微视差。

**滚动进模块**：板块大标题先大幅进场（同样是遮罩 + 压扁归位），eyebrow 左移淡入，
然后带 `data-reveal` 的卡片 / 段落依次 stagger 出现；照片是放大揭开 + 轻微视差。

**「滚到哪儿，哪儿就已经在了」**：入场动画的节奏跟着滚动速度走 ——

| 滚动速度 | 表现 |
| --- | --- |
| 慢慢滚（< 1200 px/s） | 完整入场（0.45s）+ 错峰，动画看得清 |
| 中等（1200–4500 px/s） | 时长按速度等比缩短，并取消错峰等待 |
| 锚点跳转 / 快速甩动（> 4500 px/s） | 不做入场，内容直接落定 |

另外还有两道兜底：停手 90ms 后，视口里的内容会在 0.08s 内补齐；
已经被滚过头的元素直接落定（否则往回滚会看到空白）。
触发点也放在「元素刚从视口下缘露头」（`top 98%`），不是滚到眼前才开始。
实测：慢速滚动时元素最迟在升到视口 62% 高度前就已完全显示；
跳转到任一板块后 80ms 内该屏内容全部到位。

几个刻意的选择：

- **缓动用 `expo.out`**（起步快、收尾极慢）—— 高级感来自这里。不要换成 `back` / `elastic`，
  那会产生廉价回弹
- **只动 transform / opacity**，不碰 `top / width / letter-spacing` 这类会触发布局的属性
- 每个 `data-reveal` 元素挂一条独立的 `ScrollTrigger`（`once: true`，播完即销毁）。
  没有用 `ScrollTrigger.batch`：它要合并批次，会额外带来约 100ms 的延迟，
  正是「停下来还要等内容慢慢出现」的来源
- 想整体调节奏：改 `useSiteMotion.js` 顶部的 `EASE / D / STAGGER / ITEM_SHIFT`，
  以及 `FAST_SCROLL / STAGGER_SCROLL / IDLE_DELAY`

**无障碍**：系统开启「减少动态效果」时整套动效完全不接管，内容按静态样式直接显示，
也不会出现「先隐藏再显示」的闪烁（靠 index.html 里那个提前打上的 `html.js` 标记实现）。

**加新元素**：给元素加 `data-reveal` 就会获得进场动画。筛选论文年份、切换子页面这类
动态渲染出来的新节点，由 `MutationObserver` 自动接管，不会出现「停在 opacity:0 的空白」。

**调试**：开发模式下控制台有 `window.__motion`（暴露 gsap / ScrollTrigger），
可以 `__motion.gsap.globalTimeline.timeScale(4)` 加速预览，或
`__motion.ScrollTrigger.getAll()` 查看当前有多少条滚动动画。生产构建不会暴露它。

## 6. 设计说明

- **配色**：Utah Red `#BE0000`（官方色值 RGB 190-0-0，见
  [brand.utah.edu/branding/colors](https://brand.utah.edu/branding/colors/)）+ 黑 + 白，配中性灰阶；深色区块用近黑 `#08090A`，
  红色只在强调处（eyebrow、按钮、下划线、数据、CTA 区）出现。
  > 正式定稿前建议对照学校 brand guide 核对一次色值（尤其是 Pantone / CMYK 印刷版本），
  > 以及是否允许在第三方页面上使用校名与校徽。
- **版心**：`.container` = `min(1700px, 100% - 2 × 64px)`，1920 屏下左右各留 110px。
- **响应式**：全部断点集中在 [`src/styles/responsive.css`](src/styles/responsive.css)，
  从 PC 版逐级过渡到手机版。手机端参考 utah.edu 的做法：顶栏收成单行
  （U 标 + 课题组名 + 搜索 + 汉堡），导航收进抽屉；正文保持 17px，标题略缩小；
  所有多列布局收成一列，页脚改成纵向堆叠。
  字号用 `clamp()` 做流式过渡，断点之外不会跳变。
  另外有两条**按高度**的规则（`max-height: 880 / 700 / 640`）：
  窗口较矮时逐级收紧 Hero 间距，最矮时收掉 Hero 底部的数据条，
  保证首屏 Hero 在任何窗口尺寸下都正好占满一屏。
  视口高度统一走 `--viewport-h` 变量（移动端用 `100svh`，避免地址栏收起时跳动）。
- **字体**：和 utah.edu 官网用同一套字体栈——正文 `myriad-pro`（Myriad Pro），
  标题 `factoria`（Factoria），见 [brand.utah.edu/branding/typography](https://brand.utah.edu/branding/typography/)。
  官网自己也没有下发 webfont 文件（只声明 font-family，靠本地已安装字体），
  所以本项目同样处理：没装字体的机器会自动回退到系统无衬线。
  想让所有访客都看到品牌字体，见 [public/fonts/README.md](public/fonts/README.md)
  （Adobe Fonts kit 或自托管授权字体，两种方式都已预留接口）。

## 7. 部署 / 挂到学校官网

`vite.config.js` 里设了 `base: './'`，打包产物的资源引用都是相对路径，所以：

1. `npm run build` 得到 `dist/`；
2. 把 `dist/` 整个目录（或里面的文件）上传到学校服务器的任意目录，
   例如 `https://www.utah.edu/~yuanlab/`；
3. 单页应用只有一个 HTML，不需要配置服务器重写规则。

如果学校要求走他们的模板/域名，通常只需要 `index.html` + `dist/assets/` 两部分。

### 选项 A：GitHub Pages（最快，建议先用这个）

仓库里已经放好 workflow：[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)。
只需要做三件事：

1. 用 GitHub Desktop 把这个目录 Publish 成仓库（要用**公开仓库** ——
   免费账号的 Pages 只对公开仓库开放）；
2. 打开仓库网页 → `Settings` → `Pages` → Source 选 **GitHub Actions**；
3. 之后每次 push，Actions 会自动构建并发布，网址形如
   `https://<你的用户名>.github.io/<仓库名>/`。

日常更新流程：本地改完 → 双击 `启动网站.cmd` 看一眼 → GitHub Desktop 里
Commit + Push → 等一分钟线上就更新了。**日常给别人看只需要打开网址，
不需要开任何本地服务。**

> 注意：如果以后换成 `pnpm` 装依赖，记得 CI 用的是 `npm install`，
> 两边都正常，但不要把 `node_modules` 提交上去（`.gitignore` 已经排除）。

## 8. 需要向导师确认的信息（替换占位内容前）

1. 课题组**正式英文名**（当前全称用 `Yuan (Stuart) Li Research Group`、站点短名用 `Li Group`；
   如果课题组另有官称，比如 `Stuart Li Group`，告诉我改起来是一行的事）
2. 院系 / 学院全称，以及导师的正式职称写法
3. 邮箱、办公室门牌、电话、邮寄地址
4. 个人主页 / Google Scholar / ORCID / CV 链接
5. 4 个研究方向（现在写的是 AI/CS 方向的示例，需要按实际方向重写）
6. 成员名单、照片、加入年份；是否需要展示 Alumni
7. 代表性论文清单（标题、作者、会议、PDF/Code 链接），以及首页要突出哪几篇
8. 是否需要**中英双语**（现在全英文；若要双语，建议加一个语言切换 + `site.zh / site.en` 两份文案）
9. 是否需要放**照片/视频**（实验室、校园、组会），以及肖像授权
10. 学校对官网的规范：配色、字体、无障碍（WCAG AA）、隐私声明、页脚版权写法
11. **页脚链接**：Quick Links、法务链接、社交账号都已填上学校官方地址
   （抄自 utah.edu 与 brand.utah.edu 页脚），如有变动以学校当前官网为准。
   还剩 `Webmaster` 一项是空占位，需要时补上真实地址。

## 9. 后续可以继续做的

- 换成真实图片（Hero 背景、成员头像、实验室照片）
- 中英双语切换
- Publications 自动同步（BibTeX 文件或 Google Scholar 抓取）
- 单独的 Publication / Team 详情页（需要引入路由时再加 `react-router`）
- 深色模式、SEO/OG 分享卡片、站点地图
