# Li Group 课题组官网 · React + Vite

The University of Utah · **Li Research Group**（Mining and Mine Waste Laboratory）
Department of Mining Engineering, College of Mines and Earth Sciences

- 线上地址（GitHub Pages）：<https://15228085004-ux.github.io/LiGroupSite/>
- 源码仓库：<https://github.com/15228085004-ux/LiGroupSite>

**当前状态**：结构、样式、交互已完成并上线。导师资料、研究方向、设备清单已是真实内容；
**学生资料、设备照片与介绍、合作伙伴 logo 仍是占位**，材料到位后按第 5 节填写即可。

---

## 1. 技术栈与环境

- React 18 + Vite 5，纯 CSS（CSS 变量做设计 token，没有引入 UI 框架）
- 无外部图片依赖、无外部字体依赖（首次加载快，也便于挂到学校服务器）
- PC 优先，版心 **1700px**；窄屏有完整的移动端兜底样式
- 环境要求：Node.js ≥ 18

## 2. 快速开始

**最省事的方式（Windows）**：双击项目根目录的 `启动网站.cmd`。
它会自动检查依赖、启动本地预览、并打开浏览器；黑窗口关掉，预览就结束。

```bash
npm install        # 安装依赖（npm / pnpm 均可）
npm run dev        # 本地预览，默认 http://127.0.0.1:5173
npm run build      # 打包到 dist/
npm run preview    # 预览打包结果
```

## 3. 目录结构

```
├─ index.html                  # 页面入口（标题 / description / favicon）
├─ vite.config.js              # base: './' —— dist 可放任意子目录
├─ .github/workflows/deploy.yml# push 即自动构建 + 发布到 GitHub Pages
├─ public/
│  ├─ favicon.svg
│  ├─ fonts/                   # 品牌字体接入位（见其中的 README）
│  └─ data/                    # 后端接口样板 JSON（可选）
├─ docs/
│  ├─ BACKEND-API.md           # ★ 后端接口文档（可直接发给后端）
│  └─ openapi.yaml             # 机器可读版（可导入 Swagger / Postman）
└─ src/
   ├─ main.jsx                 # 挂载 + 样式引入
   ├─ App.jsx                  # 路由 + 首页区块 + 滚动行为
   ├─ data/site.js             # ★ 全站内容都在这一个文件里
   ├─ assets/
   │  ├─ brand/                # 官方校标（interlocking U + 字标）
   │  ├─ hero/                 # 首屏轮播照片（4 张）
   │  ├─ lab/                  # ★ 实验室 / 设备照片放这里
   │  └─ team/pi.jpg           # 导师照片
   ├─ hooks/
   │  ├─ useSiteMotion.js      # 全站动效（GSAP + ScrollTrigger）
   │  ├─ useSiteData.js        # 成员 / 校友 / 论文 / 新闻数据（可接后端）
   │  ├─ useRemoteData.js      # 接口拉取 + 模块级缓存 + 失败回落
   │  ├─ useHashRoute.js       # hash 路由
   │  └─ useActiveSection.js   # 导航高亮
   ├─ utils/
   │  ├─ equipment.js          # 设备名 → slug、设备列表摊平
   │  └─ format.js             # {department} 之类占位符替换
   ├─ components/              # 每个区块一个组件
   ├─ pages/                   # 子页面（Team / Facilities / Publications / News）
   └─ styles/                  # tokens / base / layout / header / hero / sections / footer / news-page / responsive
```

## 4. 内容都在 `src/data/site.js`

学校与院系、课题组名、导航、Hero、研究方向、Team、实验室设备、合作伙伴、招募信息、
页脚与联系方式，全部集中在这一个文件。

几个约定：

- **导航**：`nav` 数组的 `id` 必须和对应 `<section id="...">` 一致，当前是
  `home / research / team / facilities / sponsors`（`sponsors` 的显示名是 **Partners**）。
- **占位链接**：`href: ''` 会渲染成灰色不可点状态，填上真实链接后自动变可点击；站外链接自动 `target="_blank"`。
- **顶部提示条**：`demoNotice.enabled`，当前为 `false`（给导师看的版本已关掉），需要时改回 `true`。
- **标题大小写**：UI 标题统一 **Title Case**（Research Interests / Lab Facilities / Partners …）；
  新闻标题、论文标题这类长句保持 Sentence Case。

## 5. 页面与模块

### 首页（单页滚动）

| # | 区块 | 说明 |
|---|---|---|
| 0 | 顶栏 | 黑色底 + 官方 U 校标 + 课题组名 + 院系（右上）+ 导航（HOME / RESEARCH / TEAM / LAB FACILITIES / PARTNERS）+ 搜索 / 汉堡菜单 |
| 1 | Hero | 整屏高度；背景 4 张照片自动轮播（交叉淡入 + 缓慢推近）；主标题 `Mining and Mine Waste Laboratory`（第二行描边）+ 一句定位 + Explore Research / Join the Group + Salt Lake City, Utah；**底部不再有统计条和 SCROLL** |
| 2 | Research | 5 个研究方向卡片（文案来自 `Website design.docx` 原文） |
| 3 | Team | `Principal Investigator` 大卡片（导师）+ `Graduate and Undergraduate Students`（7 位）+ `Previous Students` 入口 |
| 4 | Lab Facilities | 5 组、14 台设备；**目前设备不可点开**（照片还没收集齐，见下面开关） |
| 5 | Partners | 合作伙伴：logo + 公司名（目前 6 个占位） |
| 6 | Join the Group | 整幅红色 CTA，Prospective Ph.D. Students / Postdocs & Visiting Students 两栏 |
| 7 | 页脚 | 三栏 + 法务条；**首屏照片的 CC 署名也在这里** |

### 子页面（hash 路由）

| 地址 | 内容 | 入口 |
|---|---|---|
| `#team` | 首页 Team 区块 | 导航 |
| `#/team` | 全部成员列表页 | 直接访问（首页已列全，不再放按钮） |
| `#/team/<slug>` | 学生个人页 | 成员卡片 |
| `#/team/alumni` | Previous Students | 首页 Team 区块底部 |
| `#facilities` | 首页 Lab Facilities 区块 | 导航 |
| `#/facilities` | 设备列表页（卡片 + 照片位） | 设备详情开放后才有按钮 |
| `#/facilities/<slug>` | 单台设备页（照片 + 介绍） | 同上，当前隐藏 |
| `#/publications` | 全部论文页（年份筛选） | 保留，但首页和导航已不展示 |
| `#/news`、`#/news/<slug>` | 新闻列表 / 详情 | 保留，但首页和导航已不展示 |

用 hash 而不是 history API，是因为站点可能挂在任意子目录，**不需要服务端重写规则**。

### 学生数据格式（`site.team.members`）

```js
{
  slug: 'phd-student-one',          // 有 slug 才有个人页；不写就是静态卡片
  name: 'Ph.D. Student One',
  role: 'Ph.D. Student',
  initials: 'P1',                   // 没照片时的占位字
  photo: '',                        // 建议 1:1 方形、600px 以上
  email: 'xxx@utah.edu',            // 会被 Email 按钮自动使用
  focus: 'Tailings dewatering and sedimentation',  // 研究方向（卡片上显示）
  expected: '2029',                 // 预计毕业年（卡片上显示 Expected 2029）
  status: 'Ph.D. student, 1st year',// 个人页姓名下面那行
  interests: ['Flocculation', 'Sedimentation', 'Filtration'],  // 个人页标签
  education: [                      // 学位 + 学校（年份只写毕业年，不写区间）
    { degree: 'M.S. in Mineral Processing', institution: 'Example University', period: '2026' },
  ],
  bio: [],                          // 个人简介段落；留空则不渲染
  links: [                          // 三个入口固定顺序，缺了页面也会补位
    { label: 'Email', href: '' },
    { label: 'Google Scholar', href: '' },
    { label: 'LinkedIn', href: '' },
  ],
}
```

个人页的规则（和设计文档一致）：

- 不再显示角色小标签（`PH.D. STUDENT`）和「方向 · Since 年份」那行 —— 和下面的 `status` 重复
- **Education 只列已完成的学位**（在读的那条不重复列），年份只显示毕业年
- **每个学生固定三个链接**：Email / Google Scholar / LinkedIn，页面强制补齐、顺序固定
- `projects` 区块已关闭；`experience` 有数据时仍会显示

校友用另一套更轻的字段（`site.team.alumni`：`name / photo / role / period / position / link`），
单独在 `#/team/alumni` 展示，和成员卡片共用同一套尺寸与网格规则。

### 实验室与设备（`site.facilities`）

```js
equipmentLinks: false,   // ★ 总开关：false = 设备只展示、不能点开；照片齐了改 true

groups: [
  {
    title: 'Material Characterization',
    items: [
      {
        name: 'Particle Size Analyzer',
        body: 'Laser diffraction particle size distribution analysis', // 一行说明
        photos: [],   // 这台设备的照片（可多张）；留空显示占位框
        intro: [],    // 更长的介绍（可多段）；留空显示占位提示
      },
    ],
  },
]
```

开关打开后，下面三样会**同时恢复**：

1. 首页设备列表可以点开
2. `#/facilities` 的卡片可以点开、显示 "View this instrument"
3. 首页 Lab Facilities 底部的 **View All Facilities** 按钮

设备页地址按设备名自动生成（`Particle Size Analyzer` → `#/facilities/particle-size-analyzer`），
想固定链接可以在数据里手写 `slug`。照片与填写规范见
[`src/assets/lab/README.md`](src/assets/lab/README.md)。

### 合作伙伴（`site.sponsors`）

```js
{
  eyebrow: 'Industry Partners',
  title: 'Partners',
  logos: [
    { name: 'Company Name', logo: companyLogo, href: 'https://company.com' },
  ],
  placeholderSlots: 6,   // logos 为空时先摆几个空位
}
```

每张卡 = logo + 公司名；空位状态显示灰色的 `LOGO` + `Company name`。有 `href` 时点 logo 可跳转。

### 首页背景照片

`hero.slides` 里现在是 4 张：

| # | 内容 | 来源 |
|---|---|---|
| 1 | 尾矿库航拍 | 用户提供（1068×600，大屏会略放大，有高清原图可直接替换同名文件） |
| 2 | Kennecott 尾矿库（犹他） | Wikimedia Commons，CC BY-SA 4.0 |
| 3 | Thompson Creek 尾矿库 | Wikimedia Commons，CC BY 3.0 |
| 4 | Ayrshire 矿航拍 | Wikimedia Commons，CC BY-SA 4.0 |

后三张带 `credit` 字段，**署名自动渲染在页脚法务条**（CC 授权要求「作者 + 协议 + 来源」，
不能删）。换成自己的照片时不需要 credit，那行会自动消失。

换图三步：放进 `src/assets/hero/` → 在 `site.js` 顶部 import → 加进 `hero.slides`。
每张停留 `hero.slideInterval` 毫秒（默认 6.5 秒）；只剩一张时轮播自动停。

### 关于校标（重要）

`src/assets/brand/` 下的文件：

| 文件 | 内容 | 用途 |
|---|---|---|
| `interlocking-u-mark.png` | 官方 interlocking U 标记（红色，含 ®） | 顶栏与页脚的标记 |
| `u-wordmark.png` | 字标「THE UNIVERSITY of UTAH」 | 顶栏与页脚的字标 |
| `uu-logo-hrz.png` / `uu-institutional.png` | 官方横向 / 纵向锁定组合 | 备用变体 |

标记和字标都是官方素材位图，没有用字体去排（官方字标里斜体 `of` 的比例用任何字体重排都不可能一致）。
比例按官方锁定图写死，只由一个 `--lockup-mark` 变量驱动缩放，见
[`header.css`](src/styles/header.css) 的 `.u-logo`。

矢量源文件学校不公开提供，需要走
[University Logo Request Form](https://brand.utah.edu/university-logo-request-form/) 申请；
规范见 [Logos & Marks](https://brand.utah.edu/branding/logos-marks/)。

### 动效系统（GSAP + ScrollTrigger）

- [`src/hooks/useSiteMotion.js`](src/hooks/useSiteMotion.js) —— 全部动画逻辑
- [`src/styles/motion.css`](src/styles/motion.css) —— 标题遮罩 + 「只有 JS 接管时才隐藏」规则

首屏 opening：顶栏落下 → 背景从 1.16 缩回 → 大标题遮罩揭开 + 压扁归位 → 文案 / 按钮 / meta 依次进场。

滚动进模块：标题先大幅进场，`[data-reveal]` 的卡片依次 stagger，照片放大揭开 + 轻微视差。

**「滚到哪儿，哪儿就已经在了」**：入场节奏跟着滚动速度走 ——

| 滚动速度 | 表现 |
|---|---|
| 慢（< 1200 px/s） | 完整入场（0.45s）+ 错峰 |
| 中（1200–4500 px/s） | 时长按速度缩短、取消错峰 |
| 跳转 / 快速甩动（> 4500 px/s） | 不做入场，直接落定 |

另有兜底：停手 90ms 后视口内容 0.08s 内补齐；被滚过头的元素直接落定。
想整体调节奏改文件顶部的 `D / STAGGER / FAST_SCROLL / STAGGER_SCROLL / IDLE_DELAY`。

路由切换的滚动也做了处理：关掉浏览器自带的滚动恢复，进子页面固定回顶部；
从子页面回首页点导航是「直接落位」，本来就在首页点导航保留平滑滚动。

### 接后端：改 `dataSources` 里的地址

> 完整接口清单、字段表、示例见 [`docs/BACKEND-API.md`](docs/BACKEND-API.md)
> 与 [`docs/openapi.yaml`](docs/openapi.yaml)。

```js
dataSources: {
  members: 'https://your-api.example.edu/api/public/members',
  alumni: '',
  publications: '',
  news: '',
  site: '',
}
```

- 留空 = 用站内静态数据；填地址 = 用接口数据
- 请求失败 / 404 / 返回不是数组 → 静默回落到静态数据，不会白屏
- 同一地址全站只请求一次（模块级缓存）
- `photo` 直接用 URL 即可（后端返回 `/uploads/xxx.jpg` 就行）

本地想试：把地址指向 `public/data/` 下的样板文件，例如 `news: './data/news.example.json'`。

### 以后做「内部平台」的三种做法

| 方案 | 说明 | 适合 |
|---|---|---|
| 静态 JSON + Git | 学生按模板填 JSON / 表单，提交后重新部署 | 人少、改动不频繁 |
| Headless CMS（Strapi / Directus / Sanity） | 自带后台登录、权限、富文本、图片上传，直接给 API | **最贴合「内部平台」的设想** |
| 自建 API（Node / FastAPI + 数据库） | 最灵活，可接学校统一身份认证 | 需要和学校系统深度集成 |

前端只要那一份 JSON，后端怎么换都不影响页面。

## 6. 设计说明

- **配色**：Utah Red `#BE0000`（官方 RGB 190-0-0）+ 黑 + 白 + 中性灰；
  深色区块近黑 `#08090A`，红色只用于强调（eyebrow、按钮、下划线、CTA）。
- **版心**：`.container` = `min(1700px, 100% - 2 × 64px)`。
- **响应式**：断点集中在 [`responsive.css`](src/styles/responsive.css)。
  手机端顶栏收成单行（U 标 + 组名 + 搜索 + 汉堡），导航进抽屉；多列布局收成一列。
  字号用 `clamp()` 流式过渡；另有按窗口高度的规则收紧 Hero 间距，保证首屏始终一屏。
  视口高度统一走 `--viewport-h`（移动端 `100svh`，避免地址栏收起时跳动）。
- **字体**：与 utah.edu 官网同一套字体栈 —— 正文 `myriad-pro`、标题 `factoria`。
  官网本身不下发 webfont，本项目同样只声明 font-family，没装字体时回退系统无衬线。
  想统一显示见 [public/fonts/README.md](public/fonts/README.md)。
- **首屏**：底部统计条和 SCROLL 已按设计要求移除，Hero 仍是整屏高度。

## 7. 部署

### 线上环境（已配置好）

GitHub Pages + GitHub Actions：**[`https://15228085004-ux.github.io/LiGroupSite/`](https://15228085004-ux.github.io/LiGroupSite/)**

- workflow：[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- `configure-pages` 带了 `enablement: true`，**首次部署会自动开启 Pages**，不需要手动去设置里点
- `vite.config.js` 的 `base: './'` 保证资源路径是相对的，挂在 `/LiGroupSite/` 这种子目录下也正常

日常更新：

```bash
git add -A && git commit -m "..." && git push
```

push 后 Actions 自动构建发布，约 1 分钟生效（浏览器有缓存时 Ctrl+F5 强刷）。

### 挂到学校官网

`npm run build` 后把 `dist/` 整个目录上传到学校服务器任意目录即可；
单页应用只有一个 HTML，hash 路由**不需要服务端重写规则**。
如果学校走他们的模板/域名，通常只需要 `index.html` + `dist/assets/`。

## 8. 还需要补的内容

1. **7 位学生的真实资料**：姓名、照片、研究方向、预计毕业年、当前状态、兴趣标签、学历、三个链接
2. **实验室**：整体照片 + 一段介绍（`site.facilities.photo / lead`）
3. **设备**：每台设备的照片 + 详细介绍（填完把 `equipmentLinks` 改 `true`，点击与按钮一起恢复）
4. **合作伙伴**：公司名 + logo（`site.sponsors.logos`）
5. **论文 / 新闻**：页面仍在（`#/publications`、`#/news`），首页和导航目前不展示；内容准备好后可恢复
6. **Webmaster 链接**：页脚 Quick Links 里目前还是空占位
7. **是否需要中英双语**：现在是全英文
8. **发布前确认**：图片来源与肖像授权（尤其人物照片）、页脚法务信息按学校最新版本核对

## 9. 后续可以继续做的

- 用真实照片替换首屏 / 成员 / 实验室
- 中英双语切换
- Publications 自动同步（BibTeX 或 Google Scholar）
- 深色模式、SEO / OG 分享卡片、站点地图
- 内部内容管理平台（见「三种做法」）
