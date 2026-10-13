# 接口样板数据（后端对接用）

这个目录下的四个 JSON 是**接口返回值的样板**，可以直接拿给写后端的人当验收样张。

| 文件 | 对应接口 | 顶层类型 |
|---|---|---|
| `members.example.json` | `GET /api/public/members` | 数组 |
| `alumni.example.json` | `GET /api/public/alumni` | 数组 |
| `publications.example.json` | `GET /api/public/publications` | 数组 |
| `news.example.json` | `GET /api/public/news` | 数组 |

完整的接口清单（含登录、管理、图片上传）、字段表和请求响应示例见
[`docs/BACKEND-API.md`](../../docs/BACKEND-API.md)；
机器可读版本是同目录的 [`docs/openapi.yaml`](../../docs/openapi.yaml)。

## 前端怎么用

数据源开关在 `src/data/site.js` 顶部的 `dataSources`，留空 = 用站内静态数据：

```js
dataSources: {
  members: '',       // 填 './data/members.example.json' 就会用这份样板渲染
  alumni: '',
  publications: '',
  news: '',
  site: '',
},
```

把某一项指向样板文件，刷新后对应板块就会**完全用那份 JSON 渲染**；
改回 `''` 恢复静态数据。后端上线后把地址换成真接口即可，组件代码不用改：

```js
members: 'https://your-api.example.edu/api/public/members',
```

## 前端已经处理好的

- **接口挂了 / 404 / 返回格式不对 → 静默回落到内置静态数据**，页面不会白屏
- 同一个地址只请求一次（模块级缓存），首页 / 列表页 / 详情页共用
- 字段缺了就不渲染对应区块（没填 `education` 就不显示 Education 标题）
- `photo` 给图片 URL 即可（如 `/uploads/xxx.jpg`），不需要打包进前端
- 组件卸载后回来的响应会被丢弃，不会有「更新已卸载组件」的警告

## 本地接口还没起来时怎么自查

前端有「失败静默回落」，所以**页面看起来正常不等于接口接上了**。
一定要核对内容：把地址填好、刷新页面，确认页面上显示的就是接口返回的数据
（可以故意改一条标题试试）。更细的自查步骤见 `docs/BACKEND-API.md` §7。
