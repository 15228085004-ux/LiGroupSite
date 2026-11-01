# 实验室照片放这里

这个目录专门放 **Lab Facilities** 用到的照片，放进来之后在
`src/data/site.js` 的 `site.facilities` 里 import + 填进去即可：

```js
import labPhoto from '../assets/lab/lab-overview.jpg'        // 实验室全景
import psaPhoto from '../assets/lab/particle-size-analyzer.jpg'  // 单台设备

facilities: {
  photo: labPhoto,            // 实验室全景照（可选）
  pageLead: '……',             // 实验室整段介绍（可选）
  groups: [
    {
      title: 'Material Characterization',
      items: [
        {
          name: 'Particle Size Analyzer',
          body: 'Laser diffraction particle size distribution analysis',
          photo: psaPhoto,     // 这台设备的照片（可选，留空显示占位框）
          intro: '……',          // 更长的介绍（可选，只有设备页会显示）
        },
      ],
    },
  ],
}
```

要求：

- **格式**：JPG / PNG 都行，先压到 1600px 宽以内再用（大照片会让首屏变慢）
- **比例**：设备照建议横向 16:10（卡片里会按这个比例裁剪）
- **命名**：用小写英文 + 连字符，例如 `pressure-filtration-tank.jpg`，别用中文名
- 一张都没有也没关系，页面会显示灰色占位框，版面不会塌
