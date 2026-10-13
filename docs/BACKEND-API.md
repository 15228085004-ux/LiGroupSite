# 课题组官网 · 后端接口文档

> 面向对象：写后端的同学
> 前端形态：**纯静态站**（React + Vite，hash 路由），不需要服务端做 URL 重写
> 文档版本：v1 · 2026-10-05
> 配套文件：[`openapi.yaml`](./openapi.yaml)（可直接导入 Swagger / Postman / Apifox 生成接口骨架）

---

## 0. 一分钟看懂要做什么

前端一共需要 **7 个公开读取接口**（首期）+ **1 组登录/管理接口**（二期，给内部人填资料用）。

| # | 方法 | 路径 | 用途 | 当前前端状态 |
|---|---|---|---|---|
| 1 | GET | `/api/public/members` | 在读成员列表（团队页 / 个人页） | **前端已接好，填地址即生效** |
| 2 | GET | `/api/public/members/{slug}` | 单个成员详情 | 可选（列表里也有全量字段） |
| 3 | GET | `/api/public/alumni` | 校友与访问学者 | **前端已接好，填地址即生效** |
| 4 | GET | `/api/public/publications` | 论文列表（支持按年份筛选） | **前端已接好，填地址即生效** |
| 5 | GET | `/api/public/news` | 新闻列表 | **前端已接好，填地址即生效** |
| 6 | GET | `/api/public/news/{slug}` | 单条新闻详情 | 复用 5 的列表数据，无需单独接 |
| 7 | GET | `/api/public/site` | 站点文案（Hero、研究介绍、联系方式…） | 可选，后期再做 |
| 8 | — | `/api/auth/*`、`/api/admin/*` | 登录 + 增删改 + 图片上传 | 二期 |

**重要说明**：1、3、4、5 这四块前端已经全部接好了（见 §5）——
后端接口做完之后，**只要在 `src/data/site.js` 的 `dataSources` 里填上地址就生效**，
组件代码一行都不用改。接口还没好时前端会用内置静态数据，页面照常能看。

---

## 1. 通用约定

### 1.1 地址与协议

| 项目 | 约定 |
|---|---|
| 生产地址 | `https://<你的域名>/api`（下文所有路径都省略域名） |
| 开发地址 | `http://localhost:8000/api`（端口随意，告诉我即可） |
| 协议 | **必须 HTTPS**。学校页面是 https，前端调 http 接口会被浏览器拦掉（混合内容） |
| 推荐部署 | 如果站点最后挂在 `*.utah.edu` 下，强烈建议用 Nginx 把 `/api` 反代到后端，**同域就不用处理 CORS** |

### 1.2 返回格式

| 场景 | 返回 |
|---|---|
| 列表接口 | **顶层直接是 JSON 数组** `[ {...}, {...} ]`，不要包 `{ "data": [...] }` |
| 详情接口 | 顶层直接是对象 `{ ... }` |
| 删除成功 | `204 No Content`（无 body） |
| 创建成功 | `201 Created` + 新建对象 |

列表要裸数组的原因：前端 `useMembers()` 现在直接用 `Array.isArray(data)` 判断，
包一层就取不到数据了。要改也能改，但保持一致最省事。

### 1.3 命名与类型

| 类型 | 写法 | 例子 |
|---|---|---|
| 字段名 | 小驼峰 `camelCase` | `sortOrder`、`publishedAt` |
| 日期时间 | ISO 8601 字符串 | `"2026-09-01"` / `"2026-09-01T10:30:00Z"` |
| 布尔 | 真布尔值 `true` / `false` | 不要用 `"1"`、`"yes"` |
| 数组 | 没有内容时返回 `[]`，不要返回 `null` | `"interests": []` |
| 可空字符串 | 用 `""` 或省略字段，两种前端都能处理 | `"photo": ""` |
| 排序 | 数组顺序 = 页面显示顺序，后端排好再返回 | 成员按 `sortOrder` |

### 1.4 分页

首期数据量很小（几十条），**可以先不分页**。如果要分页：

```
GET /api/public/news?limit=20&offset=0
```

- 仍返回**裸数组**（当前页的数据）
- 总数放在响应头 `X-Total-Count: 137`
- 默认 `limit=100`，上限 `limit=200`

### 1.5 错误格式

统一返回，便于前端统一提示：

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "slug 已存在",
    "field": "slug"
  }
}
```

| HTTP | code | 含义 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 参数不合法 |
| 401 | `UNAUTHORIZED` | 没登录 / token 过期 |
| 403 | `FORBIDDEN` | 登录了但没权限（比如学生改别人的资料） |
| 404 | `NOT_FOUND` | 资源不存在 |
| 409 | `CONFLICT` | slug 重复、唯一约束冲突 |
| 413 | `PAYLOAD_TOO_LARGE` | 图片太大 |
| 500 | `INTERNAL_ERROR` | 服务端异常 |

### 1.6 CORS（前后端不同域时）

```
Access-Control-Allow-Origin: https://<站点域名>
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Expose-Headers: X-Total-Count
Access-Control-Max-Age: 86400
```

- 如果用 Cookie 鉴权，再加 `Access-Control-Allow-Credentials: true`，
  且 `Allow-Origin` **不能写 `*`**，必须回显具体域名。
- 上传图片用 `multipart/form-data`，属于「非简单请求」，**必须正确处理 `OPTIONS` 预检**。

### 1.7 缓存

公开读接口建议加缓存头：

```
Cache-Control: public, max-age=300
ETag: "<内容哈希>"
```

带 `If-None-Match` 命中时返回 `304`。改动内容后 ETag 要跟着变，
否则前端最多 5 分钟看不到更新。

### 1.8 图片规范

| 项目 | 要求 |
|---|---|
| 成员 / 校友照片 | **正方形 1:1**，边长 ≥ 600px，JPG / PNG / WebP，单张 ≤ 2 MB |
| 新闻配图 | 16:9，宽度 ≥ 1600px，≤ 5 MB |
| 存储 | 磁盘或对象存储都行，返回**可直接访问的 URL** |
| 返回值 | 相对路径 `/uploads/xxx.jpg` 或绝对路径 `https://cdn.example.edu/...` 都可以 |
| 处理 | 建议服务端裁成 1:1 并生成缩略图（卡片只显示 240px 宽，别传 5MB 原图） |
| 命名 | 建议 `{slug}-{随机串}.jpg`，避免中文名和重名 |

---

## 2. 数据模型

字段分两类：**前端渲染要用** 和 **后端自己管理用**。

### 2.1 Member（在读成员）

#### 前端渲染字段

| 字段 | 类型 | 必填 | 说明 | 显示位置 |
|---|---|---|---|---|
| `slug` | string | 建议必填 | URL 唯一标识，小写 + 连字符，如 `phd-student-one`。**不填就没有个人页**，卡片不可点 | 个人页地址 `#/team/<slug>` |
| `name` | string | 是 | 姓名 | 卡片标题 + 个人页大标题 |
| `role` | string | 是 | 身份，如 `Ph.D. Student` / `Postdoc` | 卡片红色小字 |
| `initials` | string | 否 | 没照片时显示的首字母块，如 `P1` | 卡片照片占位 |
| `photo` | string (url) | 否 | 个人照片；留空显示首字母块 | 卡片 1:1 方图 |
| `email` | string | 否 | 邮箱（不用加 `mailto:`） | 个人页 Email 按钮 |
| `focus` | string | 否 | 一句话研究方向 | 卡片灰色正文 |
| `since` | string | 否 | 加入年份，如 `"2026"` | 卡片底部 `Since 2026` |
| `status` | string | 否 | 当前状态，如 `"Ph.D. student, 2nd year"` | 个人页标题下方 |
| `interests` | string[] | 否 | 研究兴趣标签 | 个人页标签组 |
| `education` | object[] | 否 | 教育经历 | 个人页 Education 区块 |
| `experience` | object[] | 否 | 工作 / 实习经历 | 个人页 Experience 区块 |
| `projects` | object[] | 否 | 项目 | 个人页 Projects 区块 |
| `bio` | string[] | 否 | 个人简介，**一段一个数组元素** | 个人页正文 |
| `links` | object[] | 否 | `{ label, href }`，如 Google Scholar / ORCID | 个人页链接按钮 |

子结构（照抄即可）：

```jsonc
{
  "education": [
    {
      "degree": "Ph.D. in Mining Engineering",
      "institution": "The University of Utah",
      "period": "2026 – present"
    }
  ],
  "experience": [
    {
      "title": "Research Intern",
      "organization": "SRK Consulting",
      "period": "Summer 2025",
      "description": "参与尾矿坝稳定性分析"
    }
  ],
  "projects": [
    {
      "title": "膏体尾矿脱水实验平台",
      "period": "2026 – present",
      "description": "搭建并调试脱水实验装置",
      "link": "https://example.com"
    }
  ],
  "links": [
    {
      "label": "Google Scholar",
      "href": "https://scholar.google.com/citations?user=xxxx"
    }
  ]
}
```

`experience[].description`、`projects[].description`、`projects[].link` 都可以省略。

**空区块自动隐藏**：`education` / `experience` / `projects` / `interests` / `bio` / `links`
只要返回空数组或字段缺省，前端就不显示该区块，不会出现空标题。
所以**学生只填一半也完全没问题**，填多少显示多少。

#### 后端管理字段（前端暂不渲染，建议存）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | int / string | 主键，管理接口用 |
| `sortOrder` | int | 排序权重，越小越靠前；列表按它排好再返回 |
| `category` | enum | `phd` / `ms` / `undergrad` / `postdoc` / `visiting` / `staff` |
| `isActive` | bool | 是否在组 |
| `isPublished` | bool | 是否审核通过。公开接口**只返回 true 的** |
| `startDate` / `endDate` | date | 入学 / 离开时间，比 `since` 规范 |
| `updatedAt` | datetime | 最后修改时间 |
| `updatedBy` | string | 最后修改人 |

### 2.2 Alumni（校友与访问学者）

字段比成员轻（没有个人页）：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | int | 是 | 主键（管理用） |
| `name` | string | 是 | 姓名 |
| `role` | string | 是 | 在组期间身份，如 `M.S. Student` |
| `period` | string | 是 | 在组时间，如 `"2026 – 2027"` / `"2027"` |
| `photo` | string (url) | 否 | 照片，尺寸要求同成员 |
| `position` | object | 否 | 现在去哪了：`{ title, organization, link }` |
| `link` | string (url) | 否 | 个人主页；填了整张卡片可点 |
| `sortOrder` | int | 否 | 排序 |

```json
{
  "id": 11,
  "name": "Alumnus One",
  "role": "M.S. Student",
  "period": "2026 – 2027",
  "photo": "/uploads/alumnus-one.jpg",
  "position": {
    "title": "Research Engineer",
    "organization": "Example Mining Co.",
    "link": ""
  },
  "link": "",
  "sortOrder": 1
}
```

校友只会越积越多，所以首页只放入口，完整名单在 `#/team/alumni`。
这个接口可以放心返回全量，前端用网格展示。

### 2.3 Publication（论文）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | int | 是 | 主键 |
| `year` | string | 是 | 年份，如 `"2026"`（**字符串**，前端直接当筛选项显示） |
| `title` | string | 是 | 论文标题 |
| `authors` | string | 是 | 作者，按显示顺序写成一个字符串，如 `"Y. Li, A. Student, B. Student"` |
| `venue` | string | 是 | 期刊或会议名 |
| `highlight` | bool | 否 | `true` 会在列表里加一条红色高亮标记（用来标代表作） |
| `links` | object[] | 否 | `{ label, href }`，label 建议用 `PDF` / `Code` / `DOI` / `Slides` |
| `type` | enum | 否 | `journal` / `conference` / `preprint` |
| `doi` | string | 否 | DOI，后端可以用它反查更多信息 |
| `isFeatured` | bool | 否 | 是否在**首页**展示（首页现在只显示前 4 条） |
| `sortOrder` / `createdAt` | — | 否 | 管理和排序用 |

```json
{
  "id": 3,
  "year": "2026",
  "title": "Sedimentation and consolidation of thickened tailings",
  "authors": "Y. Li, A. Student, B. Student",
  "venue": "Minerals Engineering",
  "highlight": true,
  "links": [
    { "label": "PDF", "href": "https://example.com/paper.pdf" },
    { "label": "DOI", "href": "https://doi.org/10.xxxx" }
  ],
  "type": "journal",
  "doi": "10.xxxx/xxxxx",
  "isFeatured": true
}
```

年份筛选：前端会自己从返回数据里提取所有出现过的 `year` 生成筛选按钮，
**后端不需要额外提供年份列表接口**。也不需要排序参数，
后端按 `year DESC` + `sortOrder` 排好返回即可。

### 2.4 News（新闻）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | int | 是 | 主键 |
| `slug` | string | 是 | URL 唯一标识，如 `group-opens`；**全站唯一，改了旧链接就失效** |
| `date` | string | 是 | `YYYY-MM-DD`，列表用它倒序 |
| `dateLabel` | string | 否 | 显示用文本，如 `"Sep 2026"`。不给也行，我让前端按 `date` 自动格式化 |
| `tag` | string | 否 | 分类标签，如 `Announcement` / `Publication` / `Award` / `Talk` |
| `title` | string | 是 | 标题 |
| `summary` | string | 是 | 一句话摘要，列表页和详情页都显示 |
| `body` | string[] | 是 | 正文，**一段一个数组元素** |
| `status` | enum | 否 | `draft` / `published`；公开接口只返回 `published` |
| `publishedAt` | datetime | 否 | 发布时间，用于草稿箱排序 |
| `coverImage` | string (url) | 否 | 封面图（前端现在没渲染，留着以后加） |
| `author` | string | 否 | 作者 |

```json
{
  "id": 1,
  "slug": "group-opens",
  "date": "2026-09-01",
  "dateLabel": "Sep 2026",
  "tag": "Announcement",
  "title": "The group opens at The University of Utah",
  "summary": "We are officially up and running in the Department of Mining Engineering.",
  "body": ["第一段……", "第二段……"],
  "status": "published",
  "publishedAt": "2026-09-01T09:00:00Z"
}
```

详情页会自动显示「上一条 / 下一条」导航，**前端从列表里自己算**，
所以列表接口返回全量（或按时间倒序的完整数据）就够，不需要额外的 prev / next 接口。

### 2.5 SiteSettings（站点文案 · 可选 · 后期再做）

现在 Hero 大标题、About、Research 四个方向、Facilities、Join 文案、联系方式、页脚链接
全部写死在 `src/data/site.js`。如果以后想让老师自己改，可以加这个接口：

```
GET /api/public/site
```

返回一个对象，字段与 `src/data/site.js` 的顶层结构一致：

```jsonc
{
  "group": { "name": "Yuan (Stuart) Li Research Group", "shortName": "Li Group" },
  "contact": {
    "email": "stuart.li@utah.edu",
    "phone": "801-581-5244",
    "office": "WBB Room 311",
    "address": "135 South 1460 East, Salt Lake City, UT 84112",
    "mapUrl": "https://www.map.utah.edu"
  },
  "hero": {
    "slides": [{ "src": "/uploads/hero-01.jpg", "alt": "" }],
    "slideInterval": 6500,
    "lead": "……",
    "meta": ["Salt Lake City, Utah", "Est. 2026", "Ph.D. & Postdoc openings"]
  },
  "stats": [{ "value": "4", "label": "Research thrusts" }],
  "research": {
    "areas": [{ "index": "01", "title": "…", "body": "…", "tags": ["…"] }],
    "equipment": ["…"]
  },
  "join": { "columns": [{ "title": "…", "items": ["…"] }] }
}
```

完整字段清单直接看 `src/data/site.js`，**键名保持一致**我就能直接接。

---

## 3. 公开接口（无需登录）

### 3.1 `GET /api/public/members` ★ 已预留，优先做

在读成员列表。

```
GET /api/public/members
```

可选参数（前端暂时不传，留着以后用）：

| 参数 | 类型 | 说明 |
|---|---|---|
| `category` | string | 按身份过滤，如 `?category=phd` |
| `active` | bool | 是否只返回在组成员，默认 `true` |

**响应 `200`** —— 顶层裸数组，顺序即页面显示顺序：

```json
[
  {
    "slug": "phd-student-one",
    "name": "Ph.D. Student One",
    "role": "Ph.D. Student",
    "initials": "P1",
    "photo": "/uploads/phd-student-one.jpg",
    "email": "student1@utah.edu",
    "focus": "尾矿脱水与固结",
    "since": "2026",
    "status": "Ph.D. student, 1st year",
    "interests": ["Sedimentation", "Consolidation", "Filtration"],
    "education": [
      {
        "degree": "Ph.D. in Mining Engineering",
        "institution": "The University of Utah",
        "period": "2026 – present"
      }
    ],
    "experience": [],
    "projects": [],
    "bio": ["第一段", "第二段"],
    "links": [{ "label": "Google Scholar", "href": "https://scholar.google.com/" }]
  }
]
```

注意：

- **必须**是数组，不能是 `{ "data": [...] }`
- 只返回 `isPublished = true` 的成员（学生填了但导师还没审核的不要放出来）
- 返回顺序 = 页面顺序（首页显示前 6 位，完整名单在 `#/team`）
- 前端有兜底：接口挂了或格式不对，会**静默回落到写死的静态数据**，页面不会白屏。
  所以后端出问题**不会立刻暴露** —— 务必自己 curl 一遍确认（见 §7）

### 3.2 `GET /api/public/members/{slug}`

单个成员详情，字段同上。

```
GET /api/public/members/phd-student-one
```

| 状态 | 返回 |
|---|---|
| `200` | 成员对象 |
| `404` | `{ "error": { "code": "NOT_FOUND", "message": "Member not found" } }` |

可选：前端现在从列表里 `find()`，不请求这个接口也能跑。
但有了它以后做预渲染 / SEO / 分享卡片会方便，建议顺手做一个。

### 3.3 `GET /api/public/alumni`

校友与访问学者列表，**裸数组**，字段见 §2.2。

```
GET /api/public/alumni
```

```json
[
  {
    "id": 11,
    "name": "Alumnus One",
    "role": "M.S. Student",
    "period": "2026 – 2027",
    "photo": "/uploads/alumnus-one.jpg",
    "position": {
      "title": "Research Engineer",
      "organization": "Example Mining Co.",
      "link": ""
    },
    "link": "",
    "sortOrder": 1
  }
]
```

### 3.4 `GET /api/public/publications`

```
GET /api/public/publications
GET /api/public/publications?year=2026
GET /api/public/publications?featured=true
```

三个参数都是可选的（前端现在自己筛，不传也能跑）。

**响应 `200`** —— 裸数组，按 `year` 倒序：

```json
[
  {
    "id": 3,
    "year": "2026",
    "title": "Sedimentation and consolidation of thickened tailings",
    "authors": "Y. Li, A. Student, B. Student",
    "venue": "Minerals Engineering",
    "highlight": true,
    "links": [
      { "label": "PDF", "href": "https://example.com/paper.pdf" },
      { "label": "DOI", "href": "https://doi.org/10.xxxx" }
    ]
  }
]
```

### 3.5 `GET /api/public/news`

```
GET /api/public/news
GET /api/public/news?limit=20&offset=0
```

**响应 `200`** —— 裸数组，按 `date` 倒序（最新在前）：

```json
[
  {
    "slug": "group-opens",
    "date": "2026-09-01",
    "dateLabel": "Sep 2026",
    "tag": "Announcement",
    "title": "The group opens at The University of Utah",
    "summary": "We are officially up and running in the Department of Mining Engineering.",
    "body": ["第一段", "第二段"]
  }
]
```

列表页只用到 `slug / date / dateLabel / tag / title / summary`，
`body` 一起返回也完全可以（数据量小，少一次请求）。

### 3.6 `GET /api/public/news/{slug}`

```
GET /api/public/news/group-opens
```

| 状态 | 返回 |
|---|---|
| `200` | 新闻对象（含 `body` 数组） |
| `404` | 统一错误格式 |

### 3.7 `GET /api/public/site`（可选）

见 §2.5。

---

## 4. 管理接口（二期 · 内部人填写资料用）

这一块是给「学生自己填经历 / 老师发新闻 / 维护论文列表」用的后台。
前端会做一个简单的后台页面，后端只需要提供接口。

### 4.1 鉴权

推荐 **Cookie + Session**（学校如果已有统一认证，走 SSO 最好）或 **JWT**。

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/logout` | 退出 |
| GET | `/api/auth/me` | 当前登录用户，用于判断是否显示后台入口 |

```jsonc
// POST /api/auth/login 请求
{ "email": "student1@utah.edu", "password": "********" }

// 200 响应
{
  "id": 7,
  "name": "Ph.D. Student One",
  "email": "student1@utah.edu",
  "role": "student",
  "memberId": 3
}
```

角色建议：

| 角色 | 权限 |
|---|---|
| `student` | 只能看 / 改**自己**的资料，改完进入待审核状态 |
| `pi` | 全部权限，审核学生资料、发布新闻、维护论文 |
| `admin` | 全部权限 + 用户管理 |

### 4.2 成员管理

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| GET | `/api/admin/members` | 全部成员（含未发布），支持 `?status=pending` | pi / admin |
| GET | `/api/admin/members/me` | 学生查自己的档案 | student |
| GET | `/api/admin/members/{id}` | 单个成员 | pi / admin |
| POST | `/api/admin/members` | 新建成员 | pi / admin |
| PUT | `/api/admin/members/{id}` | 全量更新（表单提交用这个） | 本人 / pi |
| PATCH | `/api/admin/members/{id}` | 局部更新（只传改动字段） | 本人 / pi |
| DELETE | `/api/admin/members/{id}` | 删除（建议软删除） | pi / admin |
| POST | `/api/admin/members/{id}/photo` | 上传照片，见 §4.4 | 本人 / pi |
| POST | `/api/admin/members/{id}/submit` | 学生提交审核 | student |
| POST | `/api/admin/members/{id}/approve` | 导师通过，`isPublished = true` | pi |
| POST | `/api/admin/members/{id}/reject` | 打回，body `{ "reason": "照片太模糊" }` | pi |

`PUT /api/admin/members/{id}` 请求体示例（没填的字段传空数组 / 空字符串即可）：

```jsonc
{
  "name": "Ph.D. Student One",
  "role": "Ph.D. Student",
  "focus": "尾矿脱水与固结",
  "since": "2026",
  "status": "Ph.D. student, 2nd year",
  "email": "student1@utah.edu",
  "interests": ["Sedimentation", "Filtration"],
  "education": [
    {
      "degree": "Ph.D. in Mining Engineering",
      "institution": "The University of Utah",
      "period": "2026 – present"
    }
  ],
  "experience": [],
  "projects": [],
  "bio": ["第一段", "第二段"],
  "links": [{ "label": "Google Scholar", "href": "https://scholar.google.com/" }]
}
```

服务端需要校验：

- `name` / `role` 非空
- `slug` 自动生成（从姓名或邮箱），**全局唯一**，冲突返回 `409`
- `email` 格式合法
- 学生只能改自己的记录，否则 `403`
- `bio` / `education` 等加长度上限（比如 bio 单段 ≤ 2000 字），防灌水

### 4.3 论文 / 新闻 / 校友管理

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/admin/publications` | 含未发布和全部字段 |
| POST | `/api/admin/publications` | 新建 |
| PUT / PATCH | `/api/admin/publications/{id}` | 更新 |
| DELETE | `/api/admin/publications/{id}` | 删除 |
| GET | `/api/admin/news` | 含草稿 |
| POST | `/api/admin/news` | 新建（`status: "draft"`） |
| PUT / PATCH | `/api/admin/news/{id}` | 更新 |
| POST | `/api/admin/news/{id}/publish` | 发布 |
| DELETE | `/api/admin/news/{id}` | 删除 |
| GET / POST / PUT / PATCH / DELETE | `/api/admin/alumni[/{id}]` | 校友增删改 |
| GET / PUT | `/api/admin/site` | 站点文案（可选） |

加分项（不做也不影响）：

```
POST /api/admin/publications/lookup
{ "doi": "10.xxxx/xxxxx" }
```

后端请求 Crossref 返回 `title / authors / venue / year`，
老师加论文就不用手打作者列表了。

### 4.4 图片上传

```
POST /api/admin/uploads
Content-Type: multipart/form-data
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `file` | File | 图片本体 |
| `type` | string | `member-photo` / `news-cover` / `hero-slide` |

**响应 `201`**

```json
{
  "url": "https://cdn.example.edu/uploads/2026/09/abc123.jpg",
  "width": 800,
  "height": 800,
  "size": 184320
}
```

服务端要做：

- 只接受 `image/jpeg`、`image/png`、`image/webp`，**要验证真实 MIME，不要只看扩展名**
- 超过大小上限返回 `413`
- 存储时重命名（不要直接用用户上传的中文原始文件名）
- 成员照片建议服务端统一裁成 1:1 并压缩到 300KB 以内

---

## 5. 前端接入点（**已经接好，只等地址**）

### 5.1 改哪里

前端已经为这四块预留好了数据源开关，全部集中在 `src/data/site.js` 的 `dataSources`：

```js
dataSources: {
  members: '',       // GET /api/public/members        顶层数组
  alumni: '',        // GET /api/public/alumni         顶层数组
  publications: '',  // GET /api/public/publications   顶层数组
  news: '',          // GET /api/public/news           顶层数组
  site: '',          // GET /api/public/site           顶层对象（暂未接入）
},
```

**留空 = 用站点内置的静态数据；填地址 = 用接口数据覆盖静态数据。**
接口做好之后，把对应那一行填上就行，组件代码一行都不用动：

```js
members: 'https://your-api.example.edu/api/public/members',
```

每一块的行为都完全一致：

| 行为 | 说明 |
|---|---|
| 覆盖范围 | 首页板块 + 列表页 + 详情页共用同一份接口数据 |
| 失败回落 | 请求失败 / 404 / 返回的不是数组 → **静默回落到内置静态数据**，页面不白屏 |
| 请求次数 | 同一个地址全站只请求一次（模块级缓存），不会每切一个页面就重新拉 |
| 字段缺失 | 缺的字段对应区块自动不渲染，后端只填一半也能正常显示 |

### 5.2 不等后端也能先试（本地样例数据）

`public/data/` 下放着四份和接口格式**一模一样**的样板文件：

```
public/data/members.example.json        ← 对应 GET /api/public/members
public/data/alumni.example.json         ← 对应 GET /api/public/alumni
public/data/publications.example.json   ← 对应 GET /api/public/publications
public/data/news.example.json           ← 对应 GET /api/public/news
```

把 `dataSources` 里对应的一项指过去，刷新页面就会**完全用这份 JSON 渲染**：

```js
news: './data/news.example.json',
```

这条链路已经实测通过（改地址 → 页面内容跟着换；地址写错 → 自动回落静态数据）。
后端同学也可以直接拿这几个文件当**接口返回值的验收样张**。

### 5.3 还没接的

| 板块 | 说明 |
|---|---|
| Hero / About / Research / Join / 联系方式 / 页脚 | 仍写在 `site.js` 里，对应 `/api/public/site`（P3）。这块涉及十来个组件，等前面四块跑顺了再一起改 |

---

## 6. 建议的开发顺序

| 阶段 | 内容 | 说明 |
|---|---|---|
| **P0** | `GET /api/public/members` | 前端已预留，做完立刻能看到效果 |
| **P0** | `GET /api/public/publications`、`GET /api/public/news` | 纯读，数据量小 |
| **P1** | `GET /api/public/alumni`、`GET /api/public/news/{slug}` | 补齐页面 |
| **P2** | 登录 + 成员自助填写 + 照片上传 | 解决「学生自己填」的需求 |
| **P2** | 论文 / 新闻 CRUD | 老师自己维护，不用改代码 |
| **P3** | `/api/public/site`、DOI 查询 | 锦上添花 |

---

## 7. 怎么验证接口没问题

做完 `GET /api/public/members` 后，先自己 curl 一遍：

```bash
curl -s http://localhost:8000/api/public/members | head -c 400
```

必须满足：

1. 输出**以 `[` 开头**（裸数组，不是 `{`）
2. 每条都有 `name` 和 `role`
3. 是合法 JSON：`curl -s ... | python -m json.tool` 不报错
4. 跨域时带上 `Origin` 请求头，响应里要有 `Access-Control-Allow-Origin`

```bash
curl -s -i -H "Origin: http://127.0.0.1:5175" http://localhost:8000/api/public/members
```

然后在前端验证：

1. 把接口地址填进 `src/data/site.js` 的 `dataSources.members`
2. 刷新 `http://127.0.0.1:5175/#/team`
3. 页面上出现的人**必须和接口返回的一模一样**（数量、姓名、照片）

注意：前端有「失败静默回落」，所以**页面看起来正常 ≠ 接口接上了**。
一定要核对人数和姓名，确认接口数据真的被用上了。

---

## 8. 附：示例数据在哪

| 内容 | 位置 |
|---|---|
| 成员完整样板 | `public/data/members.example.json` |
| 论文 / 新闻 / 校友样板 | `src/data/site.js` 里的 `publications.items`、`news.items`、`team.alumni` |
| 机器可读接口定义 | `docs/openapi.yaml`（导入 Swagger / Postman / Apifox 可自动生成请求体） |

字段拿不准就直接问前端这边 —— **前端渲染什么，后端就存什么**，
不需要额外设计一套数据结构。
