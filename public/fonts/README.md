# 品牌字体（可选）

学校规范字体：**Myriad Pro**（正文）、**Factoria**（标题）。

两个都是商业授权字体，学校品牌站不下发字体文件。所以这里默认不加载字体文件，
只靠 `font-family` 声明 + 系统回退 —— **和 utah.edu 官网的做法完全一致**
（官网也是写 `myriad-pro` / `factoria`，没有 @font-face）。

## 想让所有访客都稳定看到品牌字体

二选一：

**A. 用学校的 Adobe Fonts kit**

找学校 MarCom / Web 团队要 kit ID，然后在 `index.html` 里加上：

```html
<link rel="stylesheet" href="https://use.typekit.net/<KIT_ID>.css" />
```

**B. 自托管已授权的字体文件**

把 woff2 放进本目录，然后取消 `index.html` 里这行的注释：

```html
<link rel="stylesheet" href="./fonts/fonts.css" />
```

文件名对齐 `fonts.css` 里的 `src`（myriad-pro-regular / myriad-pro-semibold /
myriad-pro-bold / factoria-bold），不一致就改 `fonts.css`。

> 字体授权通常按域名和用量约定，上线前确认挂载域名在授权范围内。
