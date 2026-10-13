/**
 * ============================================================================
 *  站点内容配置 —— 全站文案集中在这里，改这一个文件就能替换大部分内容
 * ============================================================================
 *  ⚠️  当前所有文字 / 人名 / 论文 / 联系方式均为「占位示例」，
 *      正式对外发布前请逐项替换为课题组的真实信息。
 *      需要向导师确认的清单见 README.md。
 *
 *  约定：
 *    - 每条 nav item 的 id 必须和对应 <section id="..."> 一致，导航高亮靠它。
 *    - 链接留空字符串 '' 时，按钮会自动渲染成不可点的灰色状态。
 * ============================================================================
 */

import heroTailings01 from '../assets/hero/hero-tailings-01.jpg'
import heroKennecott from '../assets/hero/hero-kennecott.jpg'
import heroThompsonCreek from '../assets/hero/hero-thompson-creek.jpg'
import heroAyrshire from '../assets/hero/hero-ayrshire.jpg'
/* 以前那三张学校宣传照还留在 src/assets/hero/ 里（hero-01~03.jpg），
   想再用回来，按下面 slides 的写法加一行 import + 一条记录即可。 */
import piPhoto from '../assets/team/pi.jpg'

export const site = {
  /* ------------------------------------------------------------------
   * 数据源开关（后端接好之后只需要改这里）
   *
   * 每一项留空字符串 = 用下面写死的静态数据；
   * 填上接口地址   = 前端自动去拉那份 JSON，并覆盖静态数据。
   * 拉取失败 / 格式不对会静默回落到静态数据，页面不会白屏。
   *
   * 接口字段约定见 docs/BACKEND-API.md，机器可读版 docs/openapi.yaml。
   * 想本地先试：把地址指向 public/data/ 下的样板文件，例如
   *   news: './data/news.example.json',
   *   alumni: './data/alumni.example.json',
   *   publications: './data/publications.example.json',
   *   members: './data/members.example.json',
   * ------------------------------------------------------------------ */
  dataSources: {
    members: '', // GET /api/public/members       顶层数组
    alumni: '', // GET /api/public/alumni        顶层数组
    publications: '', // GET /api/public/publications  顶层数组
    news: '', // GET /api/public/news          顶层数组
    site: '', // GET /api/public/site          顶层对象（暂未接入，见 README）
  },

  /* ------------------------------------------------------------------
   * 顶部：演示提示条（正式上线时把 demoNotice 改成 false 即可隐藏）
   * ------------------------------------------------------------------ */
  demoNotice: {
    enabled: true,
    text: '占位内容版本 · 导师信息与联系方式已按个人主页填写，成员 / 论文 / 新闻仍为示例，发布前请替换',
  },

  /* ------------------------------------------------------------------
   * 学校 / 院系信息
   * ------------------------------------------------------------------ */
  university: {
    name: 'The University of Utah',
    shortName: 'The U',
    college: 'College of Mines and Earth Sciences',
    department: 'Department of Mining Engineering',
    city: 'Salt Lake City',
    state: 'Utah',
  },

  /* ------------------------------------------------------------------
   * 课题组信息
   * 命名约定：课题组名用 "Li Research Group"，导师姓名用 "Yuan (Stuart) Li"，
   * 实验室名用 hero 标题里的 "Mining and Mine Waste Laboratory"。
   * 如果课题组另有官方叫法（例如 "Stuart Li Group"），改这两行即可，
   * 导航 / 页脚 / 收尾页会跟着变（index.html 的 <title> 需要单独同步）。
   * ------------------------------------------------------------------ */
  group: {
    name: 'Li Research Group',
    shortName: 'Li Group',
  },

  /* ------------------------------------------------------------------
   * 联系方式（footer / join 区域共用）
   * ------------------------------------------------------------------ */
  contact: {
    // 来自老师的个人主页 stuartyuanli.github.io
    email: 'stuart.li@utah.edu',
    phone: '801-581-5244',
    office: 'WBB Room 311',
    address: '135 South 1460 East, Salt Lake City, UT 84112',
    mapUrl: 'https://www.map.utah.edu',
  },

  /* ------------------------------------------------------------------
   * 页脚（学校风格：Resources / 中间品牌块 / Quick Links + 灰色法务条）
   * Quick Links 与法务链接的地址抄自 utah.edu 官网页脚，社交账号抄自
   * brand.utah.edu；如需调整以学校当前官网为准。
   * href 留空时该项会渲染成不可点击的灰色状态。
   * ------------------------------------------------------------------ */
  footer: {
    resourcesTitle: 'Resources',
    resources: [
      { label: 'Contact Us', href: 'mailto:stuart.li@utah.edu' },
      { label: 'Prospective Students', href: '#join' },
      { label: 'Research', href: '#research' },
      { label: 'Webmaster', href: '' },
    ],
    quickTitle: 'Quick Links',
    quickLinks: [
      { label: 'Campus A to Z Index', href: 'https://www.utah.edu/a-z/' },
      { label: 'Campus Directory', href: 'https://people.utah.edu/' },
      { label: 'Campus Map', href: 'https://www.map.utah.edu' },
      { label: 'Shuttle Tracker', href: 'https://map.utah.edu/?allshuttle=on' },
      { label: 'CIS', href: 'https://portal.app.utah.edu/' },
      { label: 'UMail', href: 'https://www.umail.utah.edu/' },
      { label: '@theU', href: 'https://attheu.utah.edu/', preserveCase: true },
    ],
    legalLinks: [
      {
        label: 'Nondiscrimination & Accessibility',
        href: 'https://www.utah.edu/nondiscrimination/',
      },
      { label: 'Disclaimer', href: 'https://www.utah.edu/disclaimer/' },
      {
        label: 'Privacy',
        href: 'https://privacyportal.utah.edu/privacy-portal/privacy-policies/privacy-statement/',
      },
      {
        label: 'Credits & Attributions',
        href: 'https://www.utah.edu/credits-v3.php',
      },
      { label: 'About the U', href: 'https://about.utah.edu/' },
      { label: 'Media Contacts', href: 'https://attheu.utah.edu/media-contacts/' },
    ],
    lastUpdated: '9/13/26',
    // 学校官方社交账号（来自 brand.utah.edu 页脚）
    social: [
      { id: 'x', label: 'X', href: 'https://x.com/uutah' },
      { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/universityofutah' },
      { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/universityofutah/' },
      { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/user/theuniversityofutah' },
    ],
  },

  /* ------------------------------------------------------------------
   * 导航（顺序 = 页面顺序）
   * ------------------------------------------------------------------ */
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'research', label: 'Research' },
    { id: 'team', label: 'Team' },
    { id: 'facilities', label: 'Lab Facilities' },
    { id: 'sponsors', label: 'Sponsors' },
  ],

  /* ------------------------------------------------------------------
   * 1) 全屏 Hero
   * ------------------------------------------------------------------ */
  hero: {
    /* 大标题分两行写：
       第一行实心、第二行走「描边」样式（hero__title-line--accent），
       只给一行时 HTML 上会多一个 hero__title--single，样式见 styles/hero.css。 */
    titleLine1: 'Mining and Mine Waste',
    titleLine2: 'Laboratory',
    /* ---- 首页背景轮播 ----
       照片放在 src/assets/hero/ 里，然后在这里加一行 import + 一条记录即可。
       建议 1920×1080 以上、横向构图：上面会压一层深色蒙版，太亮的照片文字会看不清。
       只留一张时轮播会自动停掉，不写 slides 就退回纯渐变背景。
       ⚠️ 第 1 张是用户提供的尾矿库航拍（1068×600，大屏上会放大、略微发虚，
       拿到高清原图后替换同名文件即可）；后 3 张来自 Wikimedia Commons，
       CC 授权要求署名，所以每张都写了 credit —— 首屏底部会自动显示当前那张的署名。 */
    slideInterval: 6500, // 每张停留时长（毫秒）
    slides: [
      { src: heroTailings01, alt: '' },
      {
        src: heroKennecott,
        alt: '',
        credit: {
          author: 'Supercarwaar',
          license: 'CC BY-SA 4.0',
          href: 'https://commons.wikimedia.org/wiki/File:Kennecott_Tailings_Pond_and_Smokestack.jpg',
        },
      },
      {
        src: heroThompsonCreek,
        alt: '',
        credit: {
          author: 'Sam Beebee',
          license: 'CC BY 3.0',
          href: 'https://commons.wikimedia.org/wiki/File:Thompson_Creek_Mine_Tailing_Pond.jpg',
        },
      },
      {
        src: heroAyrshire,
        alt: '',
        credit: {
          author: 'PaulT (Gunther Tschuch)',
          license: 'CC BY-SA 4.0',
          href: 'https://commons.wikimedia.org/wiki/File:Ayrshire_New_Cumnock_Mine_Aerial.jpg',
        },
      },
    ],
    // 首页大标题下面的一句话定位
    lead:
      'Advancing sustainable mining and mine waste management through innovative research and engineering solutions.',
    primaryCta: { label: 'Explore Research', href: '#research' },
    secondaryCta: { label: 'Join the Group', href: '#join' },
    meta: ['Salt Lake City, Utah'],
  },

  /* ------------------------------------------------------------------
   * Hero 底部的关键数字（3—4 个最好看）
   * ------------------------------------------------------------------ */
  stats: [
    { value: '5', label: 'Research thrusts' },
    { value: '8', label: 'Group members' },
    { value: '20+', label: 'Publications' },
    { value: '3', label: 'Open positions' },
  ],

  /* ------------------------------------------------------------------
   * 2) About / Overview
   *    ⚠️ 按《Website design.docx》要求，首页的 About 整节已经删掉，
   *    这份数据目前没有任何地方渲染（先留着，想放回去随时可以）。
   * ------------------------------------------------------------------ */
  about: {
    eyebrow: 'About the group',
    title: 'A small group working on one of mining’s hardest problems',
    paragraphs: [
      'Our group is based in the {department} within the {college} at {university}. We work at the intersection of geotechnical engineering, mineral processing and environmental engineering — almost always on mine tailings, which are the largest waste stream mining produces.',
      'We study how tailings dewater through sedimentation and filtration, how they behave rheologically and mechanically, how tailings storage facilities can be kept safe, and whether tailings can be used to sequester carbon. The work is physical, but it is also about risk: what happens over decades, and what it takes to be sure.',
      'The group keeps a close connection to practice. Between us we have worked with consulting firms such as SRK, HATCH and AECOM on field investigations, tailings dam design and stability analysis, and that field experience shapes the questions we take on.',
    ],
    pillars: [
      {
        title: 'Test it properly',
        body: 'Real tailings, real conditions, careful measurement — results that hold up outside the lab.',
      },
      {
        title: 'Connect to practice',
        body: 'Field experience and industry collaboration keep the research questions honest.',
      },
      {
        title: 'Safety first',
        body: 'Tailings facilities are long-lived infrastructure. Getting the geotechnics right is the whole point.',
      },
    ],
    quote:
      'Tailings are where geotechnics, mineral processing and operations meet — and where the consequences last longest.',
    quoteBy: 'How we think about the work',
  },

  /* ------------------------------------------------------------------
   * 3) Research —— 5 个方向卡片
   *    方向文案按《Website design.docx》给的原文录入（不要自己改写措辞）。
   * ------------------------------------------------------------------ */
  research: {
    eyebrow: 'Research',
    title: 'Research interests',
    // 按文档要求，这句引导语整段删除（留空则不渲染）
    lead: '',
    areas: [
      {
        index: '01',
        title: 'Tailings Dewatering and Management',
        body:
          'Investigating flocculation, sedimentation, and filtration processes to improve tailings dewatering efficiency and support sustainable tailings management.',
      },
      {
        index: '02',
        title: 'Tailings Storage Facilities (TSFs)',
        body:
          'Advancing the design, monitoring, and performance assessment of tailings storage facilities through experimental investigations, numerical modeling, and data-driven approaches.',
      },
      {
        index: '03',
        title: 'Mine Backfill Technology',
        body:
          'Studying the rheological, mechanical, hydraulic, and geochemical behavior of mine backfill materials to optimize their transport, placement, and long-term performance.',
      },
      {
        index: '04',
        title: 'Heap Leaching Operations',
        body:
          'Investigating fluid flow, permeability, and particle migration in heap leaching systems to improve solution distribution, hydraulic performance, and mineral recovery.',
      },
      {
        index: '05',
        title: 'Mine Waste Co-Disposal',
        body:
          'Evaluating the interaction, segregation, and geotechnical behavior of combined waste rock and tailings to develop more efficient and sustainable mine waste disposal strategies.',
      },
    ],
    /* 原来的「Facilities & collaborations」区块已按文档删除，
       设备清单搬到 5) Lab Facilities 板块（site.facilities）。 */
  },

  /* ------------------------------------------------------------------
   * 4) Team
   * ------------------------------------------------------------------ */
  team: {
    eyebrow: 'Team',
    // 按文档：小节标题改成 Principal Investigator，正文去掉 "students"
    title: 'Principal Investigator',
    lead: 'A group of researchers from a wide range of backgrounds.',
    /* 首页只展示前 limit 位成员，完整名单在 #/team */
    /* 按文档：目前 7 个学生位置 */
    limit: 7,
    viewAllLabel: 'View all people',
    pageTitle: 'Team',
    pageLead:
      'Everyone in the group, past and present. Members with a profile page are linked — click a card to read more.',
    /* 成员数据来源在文件顶部的 dataSources.members 里切换；
       下面 members 这份静态数据是接口没配 / 拉取失败时的兜底。 */
    pi: {
      name: 'Yuan (Stuart) Li',
      role: 'Assistant Professor',
      initials: 'SL',
      photo: piPhoto,
      affiliation: 'Department of Mining Engineering, College of Mines and Earth Sciences',
      bio:
        'Yuan (Stuart) Li is an Assistant Professor in the Department of Mining Engineering at the University of Utah. He earned his Ph.D. in Mining Engineering from the University of British Columbia, where he studied under the supervision of Professor Dirk van Zyl.\n\nHis research focuses on advancing mine tailings management, with a particular emphasis on dewatering methods through sedimentation and filtration. He also works on the rheological, mechanical and geotechnical behaviour of tailings, on the safety challenges and environmental impact of tailings storage facilities, and on the potential of tailings for carbon capture and storage.\n\nBeyond academia he has industry experience with consulting firms including SRK, HATCH and AECOM, working on geotechnical field investigations, tailings dam design and stability analysis.',
      links: [
        { label: 'Email', href: 'mailto:stuart.li@utah.edu' },
        { label: 'Personal website', href: 'https://stuartyuanli.github.io/' },
        { label: 'Department', href: 'https://mining.utah.edu/' },
      ],
    },
    membersTitle: 'Graduate and undergraduate students',
    /* 成员字段说明（完整版见 README「成员数据格式」）：
       - slug      有 slug 才有个人页（#/team/<slug>），卡片才会变成可点链接；
                   没有 slug 的成员卡片就只是静态展示
       - photo     个人照片，import 进来放这里；留空则显示首字母占位块
       - status    当前状态，例如 'Ph.D. student, 3rd year'
       - interests 研究兴趣标签
       - education 教育经历数组：{ degree, institution, period }
       - experience 工作/实习经历数组：{ title, organization, period, description }
       - projects  项目数组：{ title, period, description, link }
       - bio       个人页正文段落数组
       - links     个人页上的链接：{ label, href }
       照片建议正方形，边长 600px 以上，卡片里会裁成 1:1。 */
    members: [
      {
        slug: 'phd-student-one',
        name: 'Ph.D. Student One',
        role: 'Ph.D. Student',
        initials: 'P1',
        focus: 'Tailings dewatering and sedimentation',
        expected: '2029',
        photo: '',
        email: '',
        status: 'Ph.D. student, 1st year',
        interests: ['Flocculation', 'Sedimentation', 'Filtration'],
        /* 按标注：Education 只列已完成的学位（在读的 Ph.D. 不重复列），且不显示年份 */
        education: [
          {
            degree: 'M.S. in Mineral Processing',
            institution: 'Example University',
            period: '2026', // 只写毕业年，不写区间
          },
          {
            degree: 'B.S. in Mining Engineering',
            institution: 'Example University',
            period: '2023',
          },
        ],
        projects: [
          {
            title: 'Flocculation screening for thickened tailings',
            period: '2026 – present',
            description:
              'Comparing flocculant chemistries against settling rate and filter cake permeability.',
            link: '',
          },
          {
            title: 'Continuous thickening trials',
            period: '2026 – present',
            description:
              'Bench-scale continuous thickening, linking batch settling results to plant behaviour.',
            link: '',
          },
        ],
        bio: [], // 待补：学生本人简介（填了才会显示）
        links: [
          { label: 'Email', href: '' },
          { label: 'Google Scholar', href: '' },
          { label: 'LinkedIn', href: '' },
        ],
      },
      {
        slug: 'phd-student-two',
        name: 'Ph.D. Student Two',
        role: 'Ph.D. Student',
        initials: 'P2',
        focus: 'Tailings storage facilities',
        expected: '2028',
        photo: '',
        email: '',
        status: 'Ph.D. student, 2nd year',
        interests: ['TSF stability', 'Monitoring', 'Numerical modeling'],
        education: [
          {
            degree: 'M.S. in Geotechnical Engineering',
            institution: 'Example University',
            period: '2025',
          },
        ],
        projects: [
          {
            title: 'Performance assessment of raised tailings dams',
            period: '2026 – present',
            description: 'Combining field monitoring data with numerical models of TSF behaviour.',
            link: '',
          },
        ],
        bio: [],
        links: [
          { label: 'Email', href: '' },
          { label: 'Google Scholar', href: '' },
          { label: 'LinkedIn', href: '' },
        ],
      },
      {
        slug: 'phd-student-three',
        name: 'Ph.D. Student Three',
        role: 'Ph.D. Student',
        initials: 'P3',
        focus: 'Mine backfill technology',
        expected: '2030',
        photo: '',
        email: '',
        status: 'Ph.D. student, incoming',
        interests: ['Paste backfill', 'Rheology', 'Geochemistry'],
        education: [], // 只有「在读的 Ph.D.」这一条，按标注不列
        bio: [],
        links: [
          { label: 'Email', href: '' },
          { label: 'Google Scholar', href: '' },
          { label: 'LinkedIn', href: '' },
        ],
      },
      {
        slug: 'phd-student-four',
        name: 'Ph.D. Student Four',
        role: 'Ph.D. Student',
        initials: 'P4',
        focus: 'Heap leaching hydrology',
        expected: '2030',
        photo: '',
        email: '',
        status: 'Ph.D. student, 1st year',
        interests: ['Unsaturated flow', 'Permeability', 'Particle migration'],
        education: [
          {
            degree: 'B.S. in Mining Engineering',
            institution: 'Example University',
            period: '2024',
          },
        ],
        bio: [],
        links: [
          { label: 'Email', href: '' },
          { label: 'Google Scholar', href: '' },
          { label: 'LinkedIn', href: '' },
        ],
      },
      // 下面几位故意没写 slug：卡片不可点，用来演示「有的跳转、有的不跳」
      {
        name: 'M.S. Student One',
        role: 'M.S. Student',
        initials: 'MS',
        focus: 'Mine waste co-disposal',
        expected: '2027',
        photo: '',
        links: [
          { label: 'Email', href: '' },
          { label: 'Google Scholar', href: '' },
          { label: 'LinkedIn', href: '' },
        ],
      },
      {
        name: 'M.S. Student Two',
        role: 'M.S. Student',
        initials: 'M2',
        focus: 'Tailings rheology',
        expected: '2027',
        photo: '',
        links: [
          { label: 'Email', href: '' },
          { label: 'Google Scholar', href: '' },
          { label: 'LinkedIn', href: '' },
        ],
      },
      {
        name: 'Undergraduate One',
        role: 'Undergraduate Researcher',
        initials: 'UG',
        focus: 'Laboratory testing support',
        expected: '2027',
        photo: '',
        links: [
          { label: 'Email', href: '' },
          { label: 'Google Scholar', href: '' },
          { label: 'LinkedIn', href: '' },
        ],
      },
    ],
    /* Alumni & visitors 单独一页（#/team/alumni）。
       这个名单会随时间越来越长，所以首页和 #/team 都只放一个入口，不铺列表。
       每条字段：
         name      姓名
         photo     照片（方形，建议 400px 以上）；留空显示姓名首字母
         role      在组时的身份，例如 'M.S. Student'
         period    在组时间，例如 '2026 – 2027'
         position  现在的去处：{ title, organization, link }
         link      个人主页 / LinkedIn（可选）
    */
    alumniTitle: 'Previous students',
    alumniLead: 'Former graduate and undergraduate students — and where they went next.',
    alumni: [
      {
        name: 'Alumnus One',
        role: 'M.S. Student',
        period: '2026 – 2027',
        photo: '',
        position: {
          title: 'Research Engineer',
          organization: 'Example Company',
          link: '',
        },
        link: '',
      },
      {
        name: 'Visiting Scholar One',
        role: 'Visiting Ph.D. student',
        period: '2027',
        photo: '',
        position: {
          title: 'Ph.D. Candidate',
          organization: 'Example University',
          link: '',
        },
        link: '',
      },
    ],
  },

  /* ------------------------------------------------------------------
   * 5) Lab Facilities —— 实验室与设备清单
   *    照片和整段介绍待补：photo 填图片地址、lead 填介绍文字，
   *    版面位置已经留好，只填空就行。
   * ------------------------------------------------------------------ */
  facilities: {
    eyebrow: 'Lab facilities',
    title: 'Lab facilities',
    lead: '',
    photo: '', // 待补：把照片放进 src/assets/lab/ 再 import 进来
    photoCaption: '',
    groups: [
      {
        title: 'Material Characterization',
        items: [
          {
            name: 'Particle Size Analyzer',
            body: 'Laser diffraction particle size distribution analysis',
          },
          {
            name: 'Mechanical Sieve Shaker',
            body: 'Gradation analysis of coarse particles',
          },
          {
            name: 'Vibratory Wet Sieving System',
            body: 'Wet particle size separation of fine particles',
          },
          {
            name: 'Falling-head Permeameter',
            body: 'Hydraulic conductivity characterization for fine soils',
          },
        ],
      },
      {
        title: 'Tailings Thickening and Filtration',
        items: [
          {
            name: 'Instrumented Settling Column',
            body: 'Batch settling testing for slurry suspensions',
          },
          {
            name: 'Automated Continuous Thickening System',
            body: 'Continuous sedimentation and thickening performance evaluation',
          },
          {
            name: 'Leaf Filtration System',
            body: 'Vacuum filtration performance and filter cake characterization',
          },
          {
            name: 'Pressure Filtration Tank',
            body: 'Pressure filtration performance and filter cake characterization',
          },
        ],
      },
      {
        title: 'Mine Backfill',
        items: [
          {
            name: 'Closed-loop Pipeline Testing',
            body: 'Cemented paste transport behavior and pipeline pressure loss evaluation',
          },
          {
            name: 'Unconfined Compression Testing Machine',
            body: 'Unconfined compressive strength characterization of mine backfill materials',
          },
          {
            name: 'Slump and Mini-Slump Testing Equipment',
            body: 'Industrial and lab-scale paste tailings flowability evaluation',
          },
          {
            name: 'Humidity Cell Testing',
            body: 'Long-term geochemical weathering and stability assessment',
          },
        ],
      },
      {
        title: 'Heap Leaching Operation',
        items: [
          {
            name: 'Pressure Injection Testing System',
            body: 'High-pressure fluid flow and hydraulic behavior investigation',
          },
        ],
      },
      {
        title: 'Commingled Tailings',
        items: [
          {
            name: 'Commingled Tailings Deposition System',
            body: 'Deposition behavior and particle segregation characterization',
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------
   * 6) Sponsors —— 合作企业 / 赞助单位
   *    名单和 logo 待补：把 logo 放进 src/assets/sponsors/ 再 import，
   *    然后按 { name, logo, href } 的格式加进数组即可。
   * ------------------------------------------------------------------ */
  sponsors: {
    eyebrow: 'Industry partners',
    title: 'Sponsors',
    lead: '',
    note: 'Partner logos will be added here.',
    /* 每一项：{ name: '公司名', logo: 图片地址, href: '公司网址' } */
    logos: [],
    /* 名单还没到时首页先摆几个空位，方便看版面效果 */
    placeholderSlots: 6,
  },

  /* ------------------------------------------------------------------
   * 7) Publications
   * ------------------------------------------------------------------ */
  publications: {
    eyebrow: 'Publications',
    title: 'Selected publications',
    lead: 'A full and always-up-to-date list is maintained on Google Scholar.',
    /* 首页只显示前 limit 条，其余在 #/publications 完整列表页（带年份筛选） */
    limit: 4,
    viewAllLabel: 'View all publications',
    pageTitle: 'Publications',
    pageLead:
      'Everything the group has published, newest first. A full and always-up-to-date list is also kept on Google Scholar.',
    scholarUrl: 'https://scholar.google.com/',
    // 年份筛选项自动从 publications[].year 生成，这里只需要写正文
    items: [
      {
        year: '2026',
        title: 'Placeholder paper on sedimentation and consolidation of thickened tailings',
        authors: 'Y. Li, A. Student, B. Student',
        venue: 'Placeholder venue — replace with the real one',
        highlight: true, // highlight: true 会加一条红色高亮标记
        links: [
          { label: 'PDF', href: '' },
          { label: 'Code', href: '' },
          { label: 'DOI', href: '' },
        ],
      },
      {
        year: '2026',
        title: 'Placeholder paper on filtration performance of thickened tailings',
        authors: 'B. Student, Y. Li',
        venue: 'Placeholder journal — replace with the real one',
        links: [
          { label: 'PDF', href: '' },
          { label: 'Code', href: '' },
        ],
      },
      {
        year: '2025',
        title: 'Placeholder paper on the rheology and geotechnical behaviour of tailings',
        authors: 'C. Student, Y. Li',
        venue: 'Placeholder venue — replace with the real one',
        links: [
          { label: 'PDF', href: '' },
          { label: 'Slides', href: '' },
        ],
      },
      {
        year: '2025',
        title: 'Placeholder paper on paste tailings backfill',
        authors: 'Y. Li, D. Student, E. Student',
        venue: 'Placeholder venue — replace with the real one',
        links: [{ label: 'PDF', href: '' }],
      },
      {
        year: '2024',
        title: 'Placeholder paper on the stability of tailings storage facilities',
        authors: 'E. Student, Y. Li',
        venue: 'Placeholder journal — replace with the real one',
        links: [
          { label: 'PDF', href: '' },
          { label: 'Code', href: '' },
        ],
      },
      {
        year: '2024',
        title: 'Placeholder paper on CO2 sequestration in tailings management',
        authors: 'Y. Li, F. Student',
        venue: 'Placeholder venue — replace with the real one',
        links: [{ label: 'PDF', href: '' }],
      },
    ],
  },

  /* ------------------------------------------------------------------
   * 8) News
   * 每条 news 都有独立的详情页，地址是 #/news/<slug>
   * 首页只展示前 news.limit 条，更多通过「View all news」进 #/news
   * ------------------------------------------------------------------ */
  news: {
    eyebrow: 'News',
    title: 'Recent updates',
    lead: 'Announcements, papers, talks, and everything else happening in the group.',
    limit: 4,
    viewAllLabel: 'View all news',
    backLabel: 'All news',
    items: [
      {
        slug: 'group-opens',
        date: '2026-09-01',
        dateLabel: 'Sep 2026',
        tag: 'Announcement',
        title: 'The group opens at The University of Utah',
        summary:
          'We are officially up and running in the Department of Mining Engineering.',
        body: [
          'The group is officially open as of September 2026, based in the Department of Mining Engineering within the College of Mines and Earth Sciences.',
          'We are starting with a small core of graduate students and a set of projects on mine tailings: dewatering, material behaviour, storage facility stability, and carbon capture. Over the coming year we will be setting up the lab space, the testing equipment, and the collaborations that make those projects possible.',
          'If you are a prospective student or a group on campus who wants to work together, the door is open — see the Join page or send an email.',
        ],
      },
      {
        slug: 'two-papers-accepted',
        date: '2026-08-12',
        dateLabel: 'Aug 2026',
        tag: 'Publication',
        title: 'Two papers accepted at the Placeholder Conference on Tailings (PCT)',
        summary:
          'Both papers will be presented later this year; data and methods will be released with the camera-ready versions.',
        body: [
          'Two papers from the group were accepted. The first looks at sedimentation and consolidation of thickened tailings; the second studies the filtration performance of tailings under field-relevant conditions.',
          'Both projects were led by students, with collaborators from other departments on campus. Data and methods for both papers will be released alongside the camera-ready versions.',
          'A full list of publications is kept on the Publications page.',
        ],
      },
      {
        slug: 'toolkit-1-0',
        date: '2026-06-20',
        dateLabel: 'Jun 2026',
        tag: 'Facilities',
        title: 'The tailings testing laboratory is being set up',
        summary:
          'Sample preparation, settling and filtration benches, and rheology equipment are on the way.',
        body: [
          'Work has started on the tailings testing laboratory: sample preparation, settling and filtration benches, and the rheology equipment we need for the group’s core experiments.',
          'When it is ready we will be able to run column settling, filtration and rheology tests in-house rather than sending everything out.',
        ],
      },
      {
        slug: 'invited-talk',
        date: '2026-03-15',
        dateLabel: 'Mar 2026',
        tag: 'Talk',
        title: 'Invited talk at the Placeholder Research Symposium',
        summary:
          'A talk on what tailings management looks like when the questions come from real operations.',
        body: [
          'Li gave an invited talk on the gap between how tailings behave in carefully controlled laboratory tests and how they behave in the field.',
          'The talk covered dewatering, rheology and storage facility stability, and ended with a discussion of what a useful testing programme should look like for a real facility.',
        ],
      },
      {
        slug: 'lab-space',
        date: '2026-01-20',
        dateLabel: 'Jan 2026',
        tag: 'Announcement',
        title: 'Lab space and compute are being set up',
        summary:
          'Renovation of the group space is under way, along with our first cluster allocation.',
        body: [
          'Work has started on the group lab space in the College of Mines and Earth Sciences building. When finished it will have desks for students, a small meeting area, and room for hardware projects.',
          'Alongside the space, our first cluster allocation is in place, so students can start running experiments from day one.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------
   * 9) Join —— 红色整幅 CTA
   * ------------------------------------------------------------------ */
  join: {
    eyebrow: 'Openings',
    title: 'Join the group',
    lead:
      'If you are interested in pursuing a Master’s or Ph.D. in tailings management, email me your CV.',
    ctaLabel: 'Email your CV',
    columns: [
      {
        title: 'Prospective Ph.D. students',
        points: [
          'Apply to the Ph.D. program in Mining Engineering and mention tailings in your statement',
          'Backgrounds in mining, civil or geotechnical engineering, geosciences or a related field are all welcome',
          'Send a CV and a short note about what you want to work on',
        ],
      },
      {
        title: 'Postdocs & visiting students',
        points: [
          'Postdoc positions are available as funding allows — email first',
          'Visiting students from partner institutions are welcome',
          'Undergraduates at the U can join for course credit or hourly work',
        ],
      },
    ],
  },

}

export default site
