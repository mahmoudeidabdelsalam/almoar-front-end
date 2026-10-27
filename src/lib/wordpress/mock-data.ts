import { SiteSettings, Project, Sector, SubsidiaryCompany, TeamMember, NewsArticle } from '@/types';

export const mockSettings: SiteSettings = {
  site_name: {
    ar: 'العمر القابضة',
    en: 'Alomar Holding',
  },
  tagline: {
    ar: 'استثمار برؤية أوسع',
    en: 'Investment with a Broader Vision',
  },
  contact: {
    phone: '+966 11 412 8888',
    email: 'info@alomarholding.sa',
    address_ar: 'الرياض، طريق أنس بن مالك، حي الملقا، المملكة العربية السعودية',
    address_en: 'Anas Bin Malik Road, Al Malqa District, Riyadh, Kingdom of Saudi Arabia',
    working_hours_ar: 'الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً',
    working_hours_en: 'Sunday - Thursday: 8:00 AM - 5:00 PM',
    coordinates: {
      lat: 24.8105,
      lng: 46.6190,
    },
  },
  statistics: [
    { key: 'years', number: '25+', label_ar: 'عاماً من الريادة والخبرة الاستثمارية', label_en: 'Years of Investment Excellence' },
    { key: 'aum', number: '4B+', label_ar: 'مليار ريال حجم المحفظة الاستثمارية', label_en: 'SAR Investment Portfolio' },
    { key: 'projects', number: '15+', label_ar: 'مشروعاً عقارياً وتنموياً رائداً', label_en: 'Flagship Real Estate Developments' },
    { key: 'subsidiaries', number: '6+', label_ar: 'شركات تابعة ومنظومات أعمال', label_en: 'Subsidiaries & Strategic Entities' },
  ],
  social_links: {
    x: 'https://x.com/alomarholding',
    linkedin: 'https://linkedin.com/company/alomarholding',
    instagram: 'https://instagram.com/alomarholding',
  },
};

export const mockSectors: Sector[] = [
  {
    id: 1,
    slug: 'real-estate-development',
    title: {
      ar: 'التطوير العقاري والمجتمعات السكنية',
      en: 'Real Estate & Residential Development',
    },
    summary: {
      ar: 'تطوير مشاريع سكنية وعمرانية ريادية بتصاميم استثنائية ومعايير عالمية تعزز جودة الحياة وتواكب النهضة الحضرية للمملكة.',
      en: 'Developing landmark residential and urban communities with world-class design standards, enhancing quality of life across the Kingdom.',
    },
    icon: 'building',
    image: '/images/project_dama_lazurd.jpg',
    stats: [
      { label: { ar: 'وحدة سكنية منجزة', en: 'Delivered Units' }, value: '2,500+' },
      { label: { ar: 'مساحات مطورة', en: 'Developed Area' }, value: '650,000 م²' },
    ],
  },
  {
    id: 2,
    slug: 'venture-capital-startups',
    title: {
      ar: 'الاستثمار الجريء والشركات الواعدة',
      en: 'Venture Capital & High-Growth Startups',
    },
    summary: {
      ar: 'تمكين رواد الأعمال والاستثمار الاستراتيجي في الشركات الناشئة والتقنيات الواعدة التي تسهم في تحول الاقتصاد الرقمي.',
      en: 'Empowering innovative entrepreneurs and strategic early-stage investments driving Saudi Arabia’s digital transformation.',
    },
    icon: 'trending-up',
    image: '/images/hero_riyadh.jpg',
    stats: [
      { label: { ar: 'شركة ناشئة ممولة', en: 'Funded Startups' }, value: '18+' },
      { label: { ar: 'معدل نمو سنوي', en: 'Annual Growth Rate' }, value: '34%' },
    ],
  },
  {
    id: 3,
    slug: 'commercial-mixed-use',
    title: {
      ar: 'الأصول والمجمعات التجارية',
      en: 'Commercial & Mixed-Use Assets',
    },
    summary: {
      ar: 'إدارة وتطوير مجمعات الأعمال والمراكز التجارية المتكاملة بأعلى معايير الاستدامة وتوليد العوائد المنتظمة.',
      en: 'Managing prime business parks, corporate headquarters, and mixed-use commercial destinations generating sustained yields.',
    },
    icon: 'briefcase',
    image: '/images/project_commercial.jpg',
    stats: [
      { label: { ar: 'مساحات تجارية مؤجرة', en: 'Leased Commercial Area' }, value: '120,000 م²' },
      { label: { ar: 'نسبة الإشغال', en: 'Occupancy Rate' }, value: '96%' },
    ],
  },
  {
    id: 4,
    slug: 'asset-management',
    title: {
      ar: 'إدارة الثروات والصناديق الاستثمارية',
      en: 'Asset Management & Private Equity',
    },
    summary: {
      ar: 'هيكلة الصناديق العقارية والاستثمارية وإدارة المحافظ المالية المتنوعة وفق مبادئ الحوكمة الرشيدة وأعلى درجات الأمان.',
      en: 'Structuring investment funds and managing institutional capital under robust corporate governance and risk optimization.',
    },
    icon: 'shield-check',
    image: '/images/hero_riyadh.jpg',
    stats: [
      { label: { ar: 'إجمالي الأصول المدارة', en: 'Total AUM' }, value: '4B+ SAR' },
      { label: { ar: 'شريك مؤسسي', en: 'Institutional Partners' }, value: '25+' },
    ],
  },
];

export const mockProjects: Project[] = [
  {
    id: 1,
    slug: 'dama-lazurd',
    title: {
      ar: 'مشروع داما لازورد — الخبر',
      en: 'Dama Lazurd — Khobar Waterfront',
    },
    excerpt: {
      ar: 'مجتمع سكني فاخر يتميز بإطلالات ساحرة على ساحل الخبر ومرافق متكاملة وحياة مجتمعية عصرية متطورة.',
      en: 'An exclusive seaside residential community featuring contemporary architecture, landscaped gardens, and premium amenities.',
    },
    content: {
      ar: 'يمثل مشروع "داما لازورد" في الخبر نموذجاً فريداً للابتكار العقاري والتكامل المجتمعي. تم تصميم المشروع ليوفر بيئة معيشية راقية للعائلات تبحث عن الخصوصية والرفاهية، مع إطلالات بحرية ومرافق رياضية وحدائق منسقة وتصاميم تحترم الهوية المعمارية الحديثة.',
      en: 'Dama Lazurd represents an inspiring benchmark in contemporary residential design along the vibrant Khobar coast. Offering bespoke private residences, smart-home automation, expansive leisure decks, and lush desert gardens.',
    },
    image: '/images/project_dama_lazurd.jpg',
    gallery: [
      '/images/project_dama_lazurd.jpg',
      '/images/project_commercial.jpg',
      '/images/hero_riyadh.jpg',
    ],
    category: 'سكني',
    category_en: 'Residential',
    location: 'الخبر — الواجهة البحرية',
    location_en: 'Khobar Waterfront',
    status: 'قيد التطوير',
    status_en: 'Under Construction',
    units_count: '148 وحدة سكنية فاخرة',
    land_area: '42,000 م²',
    built_area: '68,500 م²',
    completion_year: '2026',
    brochure_url: '#',
    featured: true,
  },
  {
    id: 2,
    slug: 'al-khayala-elite-complex',
    title: {
      ar: 'الخيّالة إيليت كومبلكس — جدة',
      en: 'Al-Khayala Elite Complex — Jeddah',
    },
    excerpt: {
      ar: 'مجمع تجاري وسكني متكامل بالتعاون مع الشركة الوطنية للإسكان (NHC) لتقديم نمط حياة متوازن ومبتكر.',
      en: 'A premier mixed-use destination developed in partnership with the National Housing Company (NHC), blending commercial vitality and luxury residences.',
    },
    content: {
      ar: 'بالشراكة الاستراتيجية مع الشركة الوطنية للإسكان، يجمع مجمع الخيّالة إيليت بين حيوية الأعمال وسكينة الحياة العصرية في شمال جدة. يضم مكاتب ذكية ومراكز تسوق مفتوحة ومساحات خضراء ومطاعم عالمية وممشى رياضي متكامل.',
      en: 'Al-Khayala Elite Complex unites premier workspaces with lifestyle retail and urban living. Developed under sustainable building standards adhering to Saudi green building guidelines.',
    },
    image: '/images/project_commercial.jpg',
    gallery: [
      '/images/project_commercial.jpg',
      '/images/project_dama_lazurd.jpg',
    ],
    category: 'متعدد الاستخدامات',
    category_en: 'Mixed-Use',
    location: 'جدة — شمال أبحر',
    location_en: 'North Obhur, Jeddah',
    status: 'قيد التطوير',
    status_en: 'Under Construction',
    units_count: '210 وحدة + 45 متجراً',
    land_area: '58,000 م²',
    built_area: '92,000 م²',
    completion_year: '2027',
    brochure_url: '#',
    featured: true,
  },
  {
    id: 3,
    slug: 'al-malqa-residences',
    title: {
      ar: 'فلل الملقا بريميوم — الرياض',
      en: 'Al Malqa Premium Residences — Riyadh',
    },
    excerpt: {
      ar: 'فلل وقصور عصرية في قلب حي الملقا الراقي شمال الرياض، مصممة بأعلى درجات الخصوصية والتفرد.',
      en: 'Bespoke modern villas in the prestigious Al Malqa district in north Riyadh, crafted with architectural distinction.',
    },
    content: {
      ar: 'تجسد فلل الملقا بريميوم قمة الفخامة السكنية في العاصمة الرياض. تقع بالقرب من طريق أنس بن مالك ومركز الملك عبد الله المالي (KAFD)، وتوفر مساحات رحبة وتشطيبات بأفخر أحجار الرياض والرخام الإيطالي.',
      en: 'Al Malqa Premium Residences showcase exquisite residential craftsmanship close to King Abdullah Financial District (KAFD), offering smart energy systems and expansive courtyards.',
    },
    image: '/images/hero_riyadh.jpg',
    gallery: [
      '/images/hero_riyadh.jpg',
      '/images/project_dama_lazurd.jpg',
    ],
    category: 'سكني',
    category_en: 'Residential',
    location: 'الرياض — حي الملقا',
    location_en: 'Al Malqa District, Riyadh',
    status: 'مكتمل وجاهز للتسليم',
    status_en: 'Completed & Delivered',
    units_count: '36 فيلا مستقلة',
    land_area: '24,000 م²',
    built_area: '38,000 م²',
    completion_year: '2024',
    brochure_url: '#',
    featured: true,
  },
  {
    id: 4,
    slug: 'alomar-business-hub',
    title: {
      ar: 'برج العمر للأعمال — الرياض',
      en: 'Alomar Business Hub — Riyadh',
    },
    excerpt: {
      ar: 'برج مكتبي استثماري ذكي بمواصفات عالمية LEED Gold يوفر بيئة عمل ملهمة لكبرى الشركات الإقليمية والدولية.',
      en: 'A premier LEED Gold commercial tower providing agile, intelligent headquarters for regional and global enterprises.',
    },
    content: {
      ar: 'برج العمر للأعمال هو وجهة الشركات الرائدة في الرياض. يشتمل على قاعات مؤتمرات مجهزة بأحدث التقنيات، ومطاعم تنفيذية، وأنظمة توفير الطاقة وتوليد الطاقة المتجددة.',
      en: 'Alomar Business Hub provides state-of-the-art office infrastructure with high-efficiency glazing, high-speed elevators, and panoramic city vistas.',
    },
    image: '/images/project_commercial.jpg',
    category: 'تجاري',
    category_en: 'Commercial',
    location: 'الرياض — طريق الملك فهد',
    location_en: 'King Fahd Road, Riyadh',
    status: 'قيد التطوير',
    status_en: 'Under Construction',
    units_count: '54 مكتباً تنفيذياً',
    land_area: '16,500 م²',
    built_area: '48,000 م²',
    completion_year: '2026',
    brochure_url: '#',
    featured: false,
  },
];

export const mockCompanies: SubsidiaryCompany[] = [
  {
    id: 1,
    slug: 'dama-real-estate',
    name: {
      ar: 'شركة داما للتطوير العقاري',
      en: 'Dama Real Estate Development',
    },
    tagline: {
      ar: 'نبني مجتمعات المستقبل برؤية تلهم الحياة',
      en: 'Building Future Communities with Inspiring Living',
    },
    description: {
      ar: 'الذراع العقاري التابع لمجموعة العمر القابضة، والمتخصص في تطوير المجمعات السكنية الفاخرة والمشاريع المتكاملة بالتعاون مع كبرى الكيانات التنموية.',
      en: 'The premier real estate arm of Alomar Holding, pioneering master-planned residential communities in alliance with national entities.',
    },
    logo: '/branding/alomar_logo_mark.png',
    website: 'https://alomarinvest.sa',
    year: '2016',
    sector_slug: 'real-estate-development',
  },
  {
    id: 2,
    slug: 'alomar-ventures',
    name: {
      ar: 'العمر للاستثمار الجريء والتقنية',
      en: 'Alomar Ventures & Tech',
    },
    tagline: {
      ar: 'تمكين رواد الأعمال والابتكار المستدام',
      en: 'Empowering Disruptive Innovation & Startups',
    },
    description: {
      ar: 'صندوق استثماري جريء يستثمر في الشركات التقنية الناشئة في مراحل النمو المبكر والمتقدم عبر قطاعات التقنية العقارية والمالية واللوجستية.',
      en: 'Strategic venture capital vehicle backing scalable tech startups across PropTech, FinTech, and Logistics in the MENA region.',
    },
    logo: '/branding/alomar_logo_mark.png',
    website: 'https://alomarholding.sa',
    year: '2019',
    sector_slug: 'venture-capital-startups',
  },
  {
    id: 3,
    slug: 'alomar-asset-management',
    name: {
      ar: 'العمر لإدارة الأصول والممتلكات',
      en: 'Alomar Asset & Property Management',
    },
    tagline: {
      ar: 'تعظيم قيمة الأصول واستدامة العوائد',
      en: 'Maximizing Asset Value & Sustained Returns',
    },
    description: {
      ar: 'إدارة وتشغيل المحافظ العقارية والتجارية وتقديم حلول إدارة المرافق وصيانة الأصول بأحدث الأنظمة الذكية لضمان أعلى نسب الإشغال والرضا.',
      en: 'Comprehensive facility and asset management operations maintaining peak occupancy and institutional asset preservation.',
    },
    logo: '/branding/alomar_logo_mark.png',
    website: 'https://alomarholding.sa',
    year: '2014',
    sector_slug: 'asset-management',
  },
];

export const mockTeam: TeamMember[] = [
  {
    id: 1,
    name: {
      ar: 'عبد العزيز بن محمد العمر',
      en: 'Abdulaziz M. Alomar',
    },
    role: {
      ar: 'رئيس مجلس الإدارة',
      en: 'Chairman of the Board',
    },
    bio: {
      ar: 'رائد أعمال وخبير استثماري يتمتع بخبرة تتجاوز 25 عاماً في قيادة المجموعات القابضة وتطوير الاستثمارات الاستراتيجية والمشاريع التنموية الكبرى في المملكة العربية السعودية.',
      en: 'A prominent Saudi business leader with over 25 years of investment leadership across real estate development, private equity, and national transformation initiatives.',
    },
    image: '/images/board_chairman.jpg',
    order: 1,
  },
  {
    id: 2,
    name: {
      ar: 'م. فهد بن عبد العزيز العمر',
      en: 'Eng. Fahad A. Alomar',
    },
    role: {
      ar: 'نائب رئيس مجلس الإدارة والعضو المنتدب',
      en: 'Vice Chairman & Managing Director',
    },
    bio: {
      ar: 'مهندس واستراتيجي متخصص في إدارة الأصول العقارية وتطوير الشراكات المؤسسية مع القطاعين العام والخاص، يشرف على التوسع الاستثماري للشركات التابعة.',
      en: 'Seasoned engineer and corporate strategist leading institutional partnerships, public-private alliances, and multi-asset operational scaling.',
    },
    image: '/images/board_chairman.jpg',
    order: 2,
  },
  {
    id: 3,
    name: {
      ar: 'د. سلطان بن عبد الله القحطاني',
      en: 'Dr. Sultan A. Al-Qahtani',
    },
    role: {
      ar: 'عضو مجلس الإدارة — رئيس لجنة الاستثمار',
      en: 'Board Member & Investment Committee Chair',
    },
    bio: {
      ar: 'خبير مالي واقتصادي حائز على الدكتوراه في التمويل الدولي، يمتلك سجلاً حافلاً في إدارة الصناديق الاستثمارية وهيكلة عمليات الاندماج والاستحواذ.',
      en: 'PhD in International Finance with extensive expertise in structuring real estate investment trusts (REITs), private placements, and corporate governance.',
    },
    image: '/images/board_chairman.jpg',
    order: 3,
  },
  {
    id: 4,
    name: {
      ar: 'أ. نورة بنت خالد التميمي',
      en: 'Noura K. Al-Tamimi',
    },
    role: {
      ar: 'الرئيس التنفيذي للمجموعة (CEO)',
      en: 'Chief Executive Officer (CEO)',
    },
    bio: {
      ar: 'قيادية تنفيذية بارزة تتمتع بخبرة عميقة في الإدارة الاستراتيجية والتحول الرقمي، قادت نمواً قياسياً في عوائد المجموعة وتطوير الحوكمة المؤسسية.',
      en: 'Distinguished executive driving strategic growth, ESG governance frameworks, and operational excellence across the holding portfolio.',
    },
    image: '/images/board_chairman.jpg',
    order: 4,
  },
];

export const mockNews: NewsArticle[] = [
  {
    id: 1,
    slug: 'nhc-strategic-partnership-dama',
    title: {
      ar: 'العمر القابضة تعلن توقيع اتفاقية تطوير استراتيجية مع الوطنية للإسكان (NHC)',
      en: 'Alomar Holding Signs Strategic Development Agreement with NHC',
    },
    excerpt: {
      ar: 'ضمن جهودها لتعزيز المعروض السكني النوعي، أبرمت المجموعة اتفاقية لتطوير مجمع سكني وتجاري مبتكر في شمال جدة.',
      en: 'Reinforcing residential supply, Alomar Holding concludes partnership to develop mixed-use community in North Jeddah.',
    },
    content: {
      ar: 'أعلنت شركة العمر القابضة عن إبرام شراكة استراتيجية جديدة مع الشركة الوطنية للإسكان (NHC) لتطوير المرحلة الجديدة من مجمعات "داما"، بهدف تزويد السوق بأكثر من 400 وحدة سكنية متوافقة مع أعلى معايير الاستدامة وجودة الحياة، وبما يخدم مستهدفات برنامج الإسكان ضمن رؤية السعودية 2030.',
      en: 'Alomar Holding proudly announced signing a landmark agreement with the National Housing Company (NHC) to engineer the upcoming phase of Dama master developments, adding high-efficiency sustainable housing units.',
    },
    image: '/images/project_dama_lazurd.jpg',
    date: '18 أكتوبر 2026',
    category: { ar: 'شراكات واستثمارات', en: 'Partnerships & Growth' },
    read_time: '3 دقائق',
  },
  {
    id: 2,
    slug: 'restatex-exhibition-2026-participation',
    title: {
      ar: 'مشاركة متميزة لمجموعة العمر في معرض ريستاتكس العقاري بالرياض',
      en: 'Alomar Holding Showcases Landmark Developments at Restatex Riyadh',
    },
    excerpt: {
      ar: 'شهد جناح المجموعة إقبالاً واسعاً من المستثمرين والزوار للاطلاع على محفظة المشاريع السكنية والتجارية الجديدة.',
      en: 'Alomar Holding pavilion witnessed wide acclaim from institutional investors exploring new luxury residential portfolios.',
    },
    content: {
      ar: 'شاركت مجموعة العمر القابضة في معرض ريستاتكس الرياض العقاري، حيث استعرضت أحدث مشاريعها "داما لازورد" بالخبر وفلل الملقا بريميوم بالرياض، بالإضافة إلى تدشين خطتها الاستثمارية للأعوام الثلاثة القادمة بحضور نخبة من قادة القطاع العقاري.',
      en: 'Participating in Restatex Riyadh, Alomar Holding unveiled key milestones for Dama Lazurd Khobar and Al Malqa Residences while unveiling its strategic 3-year investment trajectory.',
    },
    image: '/images/hero_riyadh.jpg',
    date: '12 أكتوبر 2026',
    category: { ar: 'المركز الإعلامي', en: 'Corporate News' },
    read_time: '4 دقائق',
  },
  {
    id: 3,
    slug: 'proptech-fund-launch',
    title: {
      ar: 'ذراع الاستثمار الجريء "العمر فنشرز" يطلق صندوقاً متخصصاً في التقنية العقارية',
      en: 'Alomar Ventures Launches Specialized $50M PropTech Acceleration Fund',
    },
    excerpt: {
      ar: 'بهدف دعم الحلول الذكية في البناء والتشييد وإدارة المرافق الخضراء وتمكين الكفاءات الوطنية.',
      en: 'Accelerating smart construction technologies, green building intelligence, and empowering Saudi founders.',
    },
    content: {
      ar: 'أطلقت شركة "العمر فنشرز" ذراع الاستثمار الجريء للمجموعة صندوقاً استثمارياً بقيمة 50 مليون دولار مخصصاً للاستثمار في تقنيات العقار (PropTech) وتقنيات البناء المستدام، سعياً لدمج الذكاء الاصطناعي وإنترنت الأشياء في مجتمعات المجموعة العمرانية.',
      en: 'Alomar Ventures inaugurated a $50M specialized venture fund targeting early-stage PropTech and clean-building technology startups, pioneering AI-driven facility intelligence.',
    },
    image: '/images/project_commercial.jpg',
    date: '28 سبتمبر 2026',
    category: { ar: 'استثمار جريء', en: 'Venture Capital' },
    read_time: '5 دقائق',
  },
];
