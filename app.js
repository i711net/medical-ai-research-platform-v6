const state = {
  lang: "zh",
  inputLang: "zh",
  selectedSymptoms: new Set(),
  role: "doctor",
  lastProfile: "liver",
  supabase: null,
  remoteReady: false,
  authUser: null,
  profile: null,
  currentPassword: "",
  knowledgeStack: [],
  db: {
    visits: [],
    records: [],
    audit: []
  }
};

const LOCAL_OLLAMA_URLS = ["http://127.0.0.1:11434", "http://localhost:11434"];

const copy = {
  zh: {
    tagline: "中医 + 西医 + GraphRAG + 舌诊 + 双语论文演示系统",
    deploy: "免费部署路线",
    intakeTitle: "双语医学问诊",
    intakeSub: "输入症状、舌象、脉象，生成研究/教学用途的 AI 推理结果。",
    researchOnly: "Research and education only",
    symptoms: "症状",
    tongue: "舌象",
    pulse: "脉象",
    uploadTongue: "上传舌象图片",
    uploadHint: "本地预览为模拟分析；接入 HF_TOKEN 后可调用 HuggingFace Vision。",
    freeText: "自由描述",
    freeTextPlaceholder: "例如：头痛、口苦、睡眠差，最近压力大。",
    analyze: "生成 AI 推理",
    reasoningTitle: "博士级 AI 推理引擎",
    reasoningSub: "规则引擎 + GraphRAG + 双语解释",
    tcmDx: "中医辨证",
    westernDx: "西医分析",
    formula: "方剂推荐",
    source: "知识来源",
    retrieval: "检索精度",
    consistency: "双语一致性",
    aiModelOutput: "本地 Ollama / Hugging Face AI 模型输出",
    graphSub: "医学知识图谱推理路径",
    caseTitle: "AI 病例生成",
    newCase: "生成病例",
    examTitle: "医学考试模式",
    startExam: "出题",
    deployTitle: "免费资源部署",
    readDocs: "查看说明",
    clinicTitle: "门诊业务系统",
    clinicSub: "挂号、病例、账号、后台和数据库管理，形成完整门诊工作流。",
    registrationTitle: "门诊挂号",
    registrationSub: "创建患者就诊记录并分配科室、医生和状态。",
    patientName: "患者姓名",
    patientAge: "年龄",
    department: "科室",
    doctor: "医生",
    chiefComplaint: "主诉",
    createVisit: "保存挂号",
    recordTitle: "病例系统",
    recordSub: "把 AI 推理结果归档为教学病例。",
    saveRecord: "保存当前病例",
    clearSelection: "清空选择",
    accountTitle: "账号系统",
    accountSub: "Supabase Auth 登录，并绑定医生、学生、管理员角色。",
    email: "邮箱",
    password: "密码",
    displayName: "人员姓名",
    inviteCode: "注册码",
    login: "登录",
    signup: "注册",
    logout: "退出",
    loginNamePlaceholder: "用户名 / 管理员",
    loginPasswordPlaceholder: "登录密码",
    adminEntry: "后台",
    adminTitle: "后台管理员",
    adminSub: "查看运营统计和待处理事项。",
    visitsToday: "今日挂号",
    recordsSaved: "病例归档",
    highRisk: "高风险提示",
    databaseTitle: "数据库保存与管理",
    databaseSub: "优先保存到 Supabase；未配置时自动使用浏览器 localStorage。",
    exportJson: "导出 JSON",
    resetDemo: "重置演示数据",
    inviteTitle: "人员注册码",
    inviteName: "人员姓名",
    inviteEmail: "绑定邮箱",
    staffLoginName: "登录名",
    staffPassword: "初始密码",
    validDays: "可用天数",
    inviteRole: "人员角色",
    inviteCodeOut: "生成注册码",
    createInvite: "保存人员账号",
    deletePassword: "删除专用密码"
  },
  en: {
    tagline: "TCM + Western medicine + GraphRAG + tongue vision + bilingual paper demo",
    deploy: "Free deployment path",
    intakeTitle: "Bilingual Medical Intake",
    intakeSub: "Enter symptoms, tongue signs, and pulse data for a research/education AI reasoning demo.",
    researchOnly: "Research and education only",
    symptoms: "Symptoms",
    tongue: "Tongue sign",
    pulse: "Pulse",
    uploadTongue: "Upload tongue image",
    uploadHint: "Local preview uses simulated analysis; HF_TOKEN can enable HuggingFace Vision.",
    freeText: "Free text",
    freeTextPlaceholder: "Example: headache, bitter taste, poor sleep, recent stress.",
    analyze: "Generate AI reasoning",
    reasoningTitle: "Doctor-Level Reasoning Engine",
    reasoningSub: "Rule Engine + GraphRAG + Bilingual Explanation",
    tcmDx: "TCM diagnosis",
    westernDx: "Western analysis",
    formula: "Formula recommendation",
    source: "Source",
    retrieval: "Retrieval precision",
    consistency: "Bilingual consistency",
    aiModelOutput: "Local Ollama / Hugging Face AI model output",
    graphSub: "Medical knowledge graph path",
    caseTitle: "AI Case Generator",
    newCase: "Generate case",
    examTitle: "Medical Exam Mode",
    startExam: "Create quiz",
    deployTitle: "Free Resource Deployment",
    readDocs: "Read docs",
    clinicTitle: "Clinic Operations System",
    clinicSub: "Registration, records, accounts, admin, and database management in one workflow.",
    registrationTitle: "Outpatient Registration",
    registrationSub: "Create a visit, assign department, doctor, and status.",
    patientName: "Patient name",
    patientAge: "Age",
    department: "Department",
    doctor: "Doctor",
    chiefComplaint: "Chief complaint",
    createVisit: "Save visit",
    recordTitle: "Case Records",
    recordSub: "Archive the current AI reasoning as an educational case.",
    saveRecord: "Save current case",
    clearSelection: "Clear selection",
    accountTitle: "Account System",
    accountSub: "Supabase Auth login with doctor, student, and administrator roles.",
    email: "Email",
    password: "Password",
    displayName: "Display name",
    inviteCode: "Invite code",
    login: "Log in",
    signup: "Sign up",
    logout: "Log out",
    loginNamePlaceholder: "Username / admin",
    loginPasswordPlaceholder: "Password",
    adminEntry: "Admin",
    adminTitle: "Admin Console",
    adminSub: "Review operational statistics and pending tasks.",
    visitsToday: "Visits today",
    recordsSaved: "Saved records",
    highRisk: "High-risk flags",
    databaseTitle: "Database Storage and Management",
    databaseSub: "Saves to Supabase when configured; falls back to browser localStorage.",
    exportJson: "Export JSON",
    resetDemo: "Reset demo data",
    inviteTitle: "Staff invite codes",
    inviteName: "Staff name",
    inviteEmail: "Bound email",
    staffLoginName: "Login name",
    staffPassword: "Initial password",
    validDays: "Valid days",
    inviteRole: "Staff role",
    inviteCodeOut: "Generated code",
    createInvite: "Save staff account",
    deletePassword: "Deletion password"
  }
};

const symptomGroups = [
  {
    id: "headFace",
    zh: "头面五官",
    en: "Head, face, senses",
    items: [
      ["headache", "头痛", "Headache"], ["frontalHeadache", "前头痛", "Frontal headache"], ["occipitalHeadache", "后头痛", "Occipital headache"],
      ["temporalHeadache", "两侧头痛", "Temporal headache"], ["vertexHeadache", "巅顶痛", "Vertex headache"], ["dizziness", "眩晕", "Dizziness"],
      ["heavyHead", "头重如裹", "Heavy head"], ["emptyHeadache", "头空痛", "Empty headache"], ["blurredVision", "目昏", "Blurred vision"],
      ["redEyes", "目赤", "Red eyes"], ["dryEyes", "目涩", "Dry eyes"], ["tinnitus", "耳鸣", "Tinnitus"], ["deafness", "耳聋", "Hearing loss"],
      ["nasalObstruction", "鼻塞", "Nasal obstruction"], ["runnyNose", "流涕", "Runny nose"], ["noseBleed", "鼻衄", "Nosebleed"],
      ["dryMouth", "口干", "Dry mouth"], ["bitter", "口苦", "Bitter taste"], ["mouthOdor", "口臭", "Bad breath"], ["gumBleed", "齿衄", "Gum bleeding"],
      ["throatPain", "咽痛", "Sore throat"], ["foreignBodyThroat", "咽中异物感", "Globus sensation"]
    ]
  },
  {
    id: "thirstTaste",
    zh: "口渴饮水口味",
    en: "Thirst, drinking, taste",
    items: [
      ["thirst", "口渴", "Thirst"], ["noDesireToDrink", "渴不欲饮", "Thirst without desire to drink"], ["coldDrinkPreference", "喜冷饮", "Prefers cold drinks"],
      ["warmDrinkPreference", "喜热饮", "Prefers warm drinks"], ["excessiveDrinking", "多饮", "Excessive drinking"], ["dryThroat", "咽干", "Dry throat"],
      ["blandTaste", "口淡", "Bland taste"], ["sweetTaste", "口甜", "Sweet taste"], ["stickyMouth", "口黏", "Sticky mouth"],
      ["sourTaste", "口酸", "Sour taste"], ["saltyTaste", "口咸", "Salty taste"], ["hungerNoAppetite", "饥不欲食", "Hungry but no appetite"],
      ["rapidHunger", "消谷善饥", "Rapid hunger"]
    ]
  },
  {
    id: "coldHeat",
    zh: "寒热汗出",
    en: "Cold, heat, sweating",
    items: [
      ["fever", "发热", "Fever"], ["chills", "恶寒", "Chills"], ["aversionWind", "恶风", "Aversion to wind"], ["alternatingChillsFever", "寒热往来", "Alternating chills and fever"],
      ["tidalFever", "潮热", "Tidal fever"], ["fiveCenterHeat", "五心烦热", "Five-center heat"], ["spontaneousSweat", "自汗", "Spontaneous sweating"],
      ["nightSweat", "盗汗", "Night sweating"], ["noSweat", "无汗", "No sweating"], ["profuseSweat", "大汗", "Profuse sweating"]
    ]
  },
  {
    id: "lungChest",
    zh: "肺系胸胁",
    en: "Lung, chest, rib-side",
    items: [
      ["cough", "咳嗽", "Cough"], ["phlegm", "咳痰", "Phlegm"], ["yellowPhlegm", "黄痰", "Yellow phlegm"], ["whitePhlegm", "白痰", "White phlegm"],
      ["wheezing", "喘促", "Wheezing"], ["shortBreath", "气短", "Shortness of breath"], ["chestPain", "胸痛", "Chest pain"], ["chestTightness", "胸闷", "Chest tightness"],
      ["ribPain", "胁痛", "Rib-side pain"], ["sighing", "善太息", "Frequent sighing"]
    ]
  },
  {
    id: "spleenStomach",
    zh: "脾胃二便",
    en: "Digestion, stool, urine",
    items: [
      ["poorAppetite", "纳差", "Poor appetite"], ["nausea", "恶心", "Nausea"], ["vomiting", "呕吐", "Vomiting"], ["acidRegurgitation", "反酸", "Acid regurgitation"],
      ["abdominalDistension", "腹胀", "Abdominal distension"], ["abdominalPain", "腹痛", "Abdominal pain"], ["looseStool", "便溏", "Loose stool"], ["diarrhea", "泄泻", "Diarrhea"],
      ["constipation", "便秘", "Constipation"], ["dryStool", "大便干", "Dry stool"], ["stickyStool", "大便黏滞", "Sticky stool"], ["undigestedFoodStool", "完谷不化", "Undigested food in stool"],
      ["tenesmus", "里急后重", "Tenesmus"], ["bloodStool", "便血", "Blood in stool"], ["frequentUrination", "尿频", "Frequent urination"],
      ["urgentUrination", "尿急", "Urgent urination"], ["painfulUrination", "尿痛", "Painful urination"], ["shortYellowUrine", "小便短黄", "Scanty yellow urine"],
      ["clearLongUrine", "小便清长", "Clear profuse urine"], ["nightUrination", "夜尿多", "Nocturia"], ["urinaryRetention", "癃闭", "Urinary retention"],
      ["hematuria", "尿血", "Blood in urine"], ["edema", "水肿", "Edema"]
    ]
  },
  {
    id: "spiritSleep",
    zh: "心神睡眠",
    en: "Mind, sleep",
    items: [
      ["palpitation", "心悸", "Palpitation"], ["insomnia", "失眠", "Insomnia"], ["difficultySleeping", "入睡困难", "Difficulty falling asleep"], ["earlyWaking", "早醒", "Early waking"],
      ["dreaminess", "多梦", "Vivid dreams"], ["forgetfulness", "健忘", "Forgetfulness"], ["irritability", "烦躁", "Irritability"], ["anxiety", "焦虑", "Anxiety"],
      ["fatigue", "乏力", "Fatigue"], ["somnolence", "嗜睡", "Somnolence"]
    ]
  },
  {
    id: "painLimbs",
    zh: "经络肢体疼痛",
    en: "Channels, limbs, pain",
    items: [
      ["neckStiffness", "项强", "Neck stiffness"], ["shoulderPain", "肩痛", "Shoulder pain"], ["lowBackPain", "腰痛", "Low back pain"], ["kneeWeakness", "膝软", "Weak knees"],
      ["limbNumbness", "肢麻", "Limb numbness"], ["jointPain", "关节痛", "Joint pain"], ["fixedPain", "刺痛固定", "Fixed stabbing pain"], ["coldLimbs", "四肢冷", "Cold limbs"],
      ["hotPalmsSoles", "手足心热", "Hot palms and soles"], ["wanderingPain", "游走痛", "Wandering pain"], ["distendingPain", "胀痛", "Distending pain"],
      ["coldPain", "冷痛", "Cold pain"], ["burningPain", "灼痛", "Burning pain"], ["dullPain", "隐痛", "Dull pain"], ["colicPain", "绞痛", "Colicky pain"],
      ["heavyPain", "重痛", "Heavy pain"], ["emptyPain", "空痛", "Empty pain"]
    ]
  },
  {
    id: "skinSurface",
    zh: "皮肤体表",
    en: "Skin and surface",
    items: [
      ["skinItching", "皮肤瘙痒", "Skin itching"], ["rash", "皮疹", "Rash"], ["wheal", "风团", "Wheal"], ["eczemaLike", "湿疹样", "Eczema-like rash"],
      ["jaundice", "黄疸", "Jaundice"], ["paleComplexion", "面色苍白", "Pale complexion"], ["sallowComplexion", "面色萎黄", "Sallow complexion"],
      ["redComplexion", "面红", "Red complexion"], ["darkComplexion", "面色晦暗", "Dull dark complexion"], ["scalyDrySkin", "肌肤甲错", "Dry scaly skin"],
      ["bruising", "紫斑", "Purpura"], ["soreSwelling", "疮疡肿痛", "Sore swelling"]
    ]
  },
  {
    id: "bleeding",
    zh: "出血相关",
    en: "Bleeding signs",
    items: [
      ["hemoptysis", "咯血", "Hemoptysis"], ["hematemesis", "吐血", "Hematemesis"], ["melena", "黑便", "Melena"], ["skinBleeding", "肌衄", "Skin bleeding"],
      ["easyBruising", "易瘀斑", "Easy bruising"], ["prolongedBleeding", "出血不止", "Prolonged bleeding"]
    ]
  },
  {
    id: "women",
    zh: "妇科相关",
    en: "Gynecology",
    items: [
      ["irregularMenses", "月经不调", "Irregular menstruation"], ["dysmenorrhea", "痛经", "Dysmenorrhea"], ["amenorrhea", "闭经", "Amenorrhea"], ["heavyMenses", "月经过多", "Heavy menses"],
      ["scantyMenses", "月经过少", "Scanty menses"], ["darkMenses", "经色暗", "Dark menstrual blood"], ["paleMenses", "经色淡", "Pale menstrual blood"],
      ["clottedMenses", "经血块", "Menstrual clots"], ["premenstrualBreastDistension", "经前乳胀", "Premenstrual breast distension"],
      ["warmRelievedDysmenorrhea", "痛经喜温", "Dysmenorrhea relieved by warmth"], ["pressureWorseDysmenorrhea", "痛经拒按", "Dysmenorrhea worse with pressure"],
      ["leukorrhea", "带下", "Leukorrhea"], ["yellowLeukorrhea", "黄带", "Yellow leukorrhea"], ["clearLeukorrhea", "清稀带下", "Clear watery leukorrhea"],
      ["postpartumFatigue", "产后乏力", "Postpartum fatigue"]
    ]
  },
  {
    id: "maleRepro",
    zh: "男科生殖",
    en: "Male reproductive",
    items: [
      ["impotence", "阳痿", "Impotence"], ["prematureEjaculation", "早泄", "Premature ejaculation"], ["seminalEmission", "遗精", "Seminal emission"],
      ["scrotalDampness", "阴囊潮湿", "Scrotal dampness"], ["testicularPain", "睾丸痛", "Testicular pain"], ["lowerAbdominalBearingDown", "小腹坠胀", "Lower abdominal bearing-down"],
      ["postVoidDribbling", "尿后余沥", "Post-void dribbling"]
    ]
  },
  {
    id: "children",
    zh: "小儿相关",
    en: "Pediatrics",
    items: [
      ["childNightCrying", "夜啼", "Night crying"], ["childStartle", "易惊", "Easily startled"], ["foodStagnation", "食积", "Food stagnation"],
      ["childAnorexia", "小儿厌食", "Pediatric anorexia"], ["febrileConvulsion", "高热惊厥", "Febrile convulsion"], ["childDiarrhea", "小儿腹泻", "Pediatric diarrhea"],
      ["enuresis", "遗尿", "Enuresis"], ["delayedDevelopment", "发育迟缓", "Delayed development"]
    ]
  }
];

const symptomOptions = symptomGroups.flatMap((group) => group.items.map(([id, zh, en]) => ({ id, zh, en, group: group.id })));

const cases = [
  {
    zh: "症状：头痛、眩晕、舌红、弦脉；答案：肝阳上亢；方剂：天麻钩藤饮。",
    en: "Symptoms: headache, dizziness, red tongue, wiry pulse. Answer: Liver Yang Hyperactivity. Formula: Gastrodia and Uncaria Decoction."
  },
  {
    zh: "症状：恶寒、发热、后头痛、浮脉；答案：太阳表证；方剂：桂枝汤或川芎茶调散思路。",
    en: "Symptoms: aversion to cold, fever, occipital headache, floating pulse. Answer: Taiyang exterior pattern. Formula: Gui Zhi Tang or Chuan Xiong Cha Tiao San reasoning."
  },
  {
    zh: "症状：乏力、气短、舌淡、沉脉；答案：气虚证；方剂：四君子汤。",
    en: "Symptoms: fatigue, shortness of breath, pale tongue, deep pulse. Answer: Qi deficiency. Formula: Si Jun Zi Tang."
  }
];

const formulaKnowledge = {
  "天麻钩藤饮": {
    source: "《杂病证治新义》",
    composition: "天麻、钩藤、石决明、栀子、黄芩、川牛膝、杜仲、益母草、桑寄生、夜交藤、茯神",
    usage: "教学资料示例。实际剂量、煎服法和禁忌必须由执业医师辨证决定。",
    indications: "肝阳上亢所致头痛眩晕、失眠、舌红、脉弦等。",
    modifications: "热象明显可加强清热；痰湿明显可加化痰利湿；阴虚明显可配养阴潜阳。",
    modern: "现代常用于高血压相关头晕头痛的研究讨论，但不能替代临床诊断。"
  },
  "四君子汤": {
    source: "《太平惠民和剂局方》",
    composition: "人参、白术、茯苓、甘草",
    usage: "教学资料示例。补气基础方，实际应用需辨证。",
    indications: "脾胃气虚，面色萎白，气短乏力，舌淡脉虚。",
    modifications: "气虚明显可加黄芪；痰湿可加陈皮、半夏；食少纳呆可配砂仁、木香。",
    modern: "常作为补气健脾基础方用于教学和研究。"
  },
  "归脾汤": {
    source: "《济生方》",
    composition: "黄芪、人参、白术、茯神、酸枣仁、龙眼肉、木香、当归、远志、甘草、生姜、大枣",
    usage: "教学资料示例。实际剂量和适应证必须由执业医师辨证决定。",
    indications: "心脾两虚、气血不足所致失眠多梦、心悸健忘、食少乏力、舌嫩或舌淡、脉弱等。",
    modifications: "失眠重可酌配养心安神；纳差便溏重需健脾化湿；阴虚内热明显者不宜机械套用。",
    modern: "常用于心脾两虚型失眠、焦虑、疲劳等教学讨论，需排除器质性疾病。"
  },
  "天王补心丹": {
    source: "《摄生秘剖》",
    composition: "生地黄、天冬、麦冬、玄参、丹参、当归、五味子、酸枣仁、柏子仁、茯苓、远志、桔梗、朱砂等传统组成",
    usage: "教学资料示例。含朱砂等传统药物时现代应用必须遵循安全规范，不能自行服用。",
    indications: "阴虚血少、心神失养所致失眠多梦、心悸、盗汗、舌红少苔、脉细数等。",
    modifications: "盗汗明显重在滋阴敛汗；虚热明显酌清虚热；现代临床可由医师选择安全替代方案。",
    modern: "用于阴虚内热、心神不宁相关失眠的教学讨论，需注意药物安全与禁忌。"
  },
  "川芎茶调散": {
    source: "《太平惠民和剂局方》",
    composition: "川芎、白芷、羌活、细辛、防风、荆芥、薄荷、甘草、茶清",
    usage: "教学资料示例。现代临床对细辛等药需严格遵循规范和医嘱。",
    indications: "外感风邪头痛，或偏正头痛、恶寒发热等。",
    modifications: "风寒重加辛温解表；风热明显需调整清疏；久痛夹瘀可酌加活血。",
    modern: "需注意传统方中个别药物的现代安全规范，必要时由医师选择替代方案。"
  },
  "桂枝汤": {
    source: "《伤寒论》",
    composition: "桂枝、芍药、甘草、生姜、大枣",
    usage: "教学示例。传统为水煎温服，啜热粥助汗；剂量和服法必须由医师辨证。",
    indications: "太阳中风表虚证，发热恶风、自汗、头痛、脉浮缓。",
    modifications: "汗出多需辨虚实；兼喘可参考桂枝加厚朴杏子汤；误汗伤阳、里热炽盛者不可套用。",
    modern: "常用于外感表虚、植物神经功能紊乱等教学讨论，不替代感染性疾病评估。"
  },
  "麻黄汤": {
    source: "《伤寒论》",
    composition: "麻黄、桂枝、杏仁、甘草",
    usage: "教学示例。发汗力较强，现代应用必须评估血压、心率、失眠、用药相互作用。",
    indications: "太阳伤寒表实证，恶寒发热、无汗、身痛、喘、脉浮紧。",
    modifications: "咳喘重可重视宣肺平喘；体虚、自汗、高血压、心悸者慎用。",
    modern: "麻黄含拟交感成分，相关药品监管和禁忌需严格遵守。"
  },
  "银翘散": {
    source: "《温病条辨》",
    composition: "金银花、连翘、薄荷、牛蒡子、荆芥、淡豆豉、淡竹叶、桔梗、甘草、芦根",
    usage: "教学示例。辛凉透表，水煎服或现代制剂遵医嘱。",
    indications: "风热表证，发热、微恶风寒、咽痛、口渴、舌尖红。",
    modifications: "咽痛重加清利咽喉；咳嗽重加宣肺止咳；高热持续需排查感染。",
    modern: "常用于上呼吸道感染早期风热证型教学讨论。"
  },
  "小柴胡汤": {
    source: "《伤寒论》",
    composition: "柴胡、黄芩、人参、半夏、甘草、生姜、大枣",
    usage: "教学示例。和解少阳，需辨半表半里，不可作为万能抗炎方。",
    indications: "少阳证，寒热往来、胸胁苦满、口苦、咽干、目眩、默默不欲饮食。",
    modifications: "热重可清少阳；痰湿重需化痰；肝胆疾病需结合现代检查。",
    modern: "涉及肝胆、消化、免疫相关研究讨论，需注意药物性肝损伤风险评估。"
  },
  "逍遥散": {
    source: "《太平惠民和剂局方》",
    composition: "柴胡、当归、白芍、白术、茯苓、甘草、薄荷、生姜",
    usage: "教学示例。疏肝健脾养血，实际剂量遵医嘱。",
    indications: "肝郁血虚脾弱，胁痛、情志抑郁、月经不调、纳差、疲倦。",
    modifications: "热象明显可化裁丹栀逍遥散；血虚重加养血；痰湿重合化痰利湿。",
    modern: "常用于焦虑、经前期不适、功能性消化问题等证候研究。"
  },
  "半夏泻心汤": {
    source: "《伤寒论》",
    composition: "半夏、黄芩、干姜、人参、黄连、大枣、甘草",
    usage: "教学示例。寒热错杂、辛开苦降，需辨痞满呕利。",
    indications: "心下痞，呕吐、肠鸣、下利，寒热错杂。",
    modifications: "热重可偏清；寒重可温中；明显器质性胃肠病需现代诊疗。",
    modern: "常用于功能性消化不良、胃食管反流、肠易激等教学讨论。"
  },
  "二陈汤": {
    source: "《太平惠民和剂局方》",
    composition: "半夏、陈皮、茯苓、甘草、生姜、乌梅",
    usage: "教学示例。燥湿化痰、理气和中。",
    indications: "湿痰证，咳痰多、胸脘痞闷、恶心、眩悸、苔白腻。",
    modifications: "热痰可配清热化痰；寒痰可温化；痰湿夹食可消食导滞。",
    modern: "常作为痰湿体质、咳嗽痰多、胃肠痰湿的基础方义。"
  },
  "六君子汤": {
    source: "《医学正传》",
    composition: "人参、白术、茯苓、甘草、陈皮、半夏",
    usage: "教学示例。益气健脾、燥湿化痰。",
    indications: "脾胃气虚兼痰湿，食少便溏、胸脘痞闷、咳痰、舌淡苔腻。",
    modifications: "气虚明显加黄芪；食积加消导；痰湿重加化痰药。",
    modern: "常用于消化功能减退、慢性疲劳、痰湿相关证候研究。"
  },
  "补中益气汤": {
    source: "《脾胃论》",
    composition: "黄芪、人参、白术、甘草、当归、陈皮、升麻、柴胡",
    usage: "教学示例。补中益气、升阳举陷。",
    indications: "中气不足、气虚下陷，乏力、气短、久泻、脱肛、内脏下垂相关证候。",
    modifications: "气虚重用补气；阴虚火旺、实热内盛需慎辨。",
    modern: "用于气虚疲劳、胃肠功能低下等研究讨论，需排除严重器质性疾病。"
  },
  "六味地黄丸": {
    source: "《小儿药证直诀》",
    composition: "熟地黄、山茱萸、山药、泽泻、牡丹皮、茯苓",
    usage: "教学示例。滋补肝肾，丸剂或汤剂遵医嘱。",
    indications: "肝肾阴虚，腰膝酸软、头晕耳鸣、盗汗、五心烦热、舌红少苔。",
    modifications: "虚火明显可知柏地黄丸；眼目昏花可杞菊地黄丸；阳虚畏寒不宜机械套用。",
    modern: "常用于代谢、内分泌、衰老相关证候研究讨论。"
  },
  "知柏地黄丸": {
    source: "六味地黄丸加知母、黄柏化裁",
    composition: "熟地黄、山茱萸、山药、泽泻、牡丹皮、茯苓、知母、黄柏",
    usage: "教学示例。滋阴降火，苦寒药需辨脾胃承受能力。",
    indications: "阴虚火旺，潮热盗汗、口干咽燥、骨蒸、舌红少苔、脉细数。",
    modifications: "虚火重清虚热；脾虚便溏慎用苦寒。",
    modern: "用于阴虚内热相关证候讨论，需结合感染、内分泌等检查。"
  },
  "血府逐瘀汤": {
    source: "《医林改错》",
    composition: "桃仁、红花、当归、生地黄、川芎、赤芍、牛膝、桔梗、柴胡、枳壳、甘草",
    usage: "教学示例。活血化瘀、行气止痛，出血倾向和抗凝用药者慎用。",
    indications: "胸中血瘀，胸痛、头痛日久、痛有定处、舌暗或瘀点、脉涩。",
    modifications: "气滞重加行气；寒凝加温通；疑似心梗、肺栓塞等必须急诊。",
    modern: "常用于胸痛、头痛、循环相关证候研究，不能替代急症筛查。"
  },
  "龙胆泻肝汤": {
    source: "《医方集解》",
    composition: "龙胆草、黄芩、栀子、泽泻、木通、车前子、当归、生地黄、柴胡、甘草",
    usage: "教学示例。清肝胆实火、利湿热，苦寒力强需辨证。",
    indications: "肝胆实火或湿热下注，头痛目赤、胁痛口苦、耳鸣耳聋、尿赤、带下黄臭。",
    modifications: "湿重利湿；火重清火；脾胃虚寒慎用。",
    modern: "涉及肝胆、泌尿生殖炎症样症状讨论，需现代检查确认。"
  },
  "平胃散": {
    source: "《太平惠民和剂局方》",
    composition: "苍术、厚朴、陈皮、甘草、生姜、大枣",
    usage: "教学示例。燥湿运脾、行气和胃。",
    indications: "湿滞脾胃，脘腹胀满、食少、恶心、肢体困重、苔白腻。",
    modifications: "湿热加清热利湿；食积加消食；脾虚明显需兼补。",
    modern: "用于湿困脾胃、功能性消化不良相关教学讨论。"
  },
  "清胃散": {
    source: "《脾胃论》",
    composition: "生地黄、当归身、牡丹皮、黄连、升麻",
    usage: "教学示例。清胃凉血，剂量和适应证需医师辨证。",
    indications: "胃火牙痛、牙龈肿痛、口臭、齿衄、舌红脉数等。",
    modifications: "便秘明显需辨实热与津亏；牙周感染、龋齿应同时口腔科处理。",
    modern: "用于胃火上攻、口腔炎症样症状的方义教学，不能替代牙科诊治。"
  },
  "金匮肾气丸": {
    source: "《金匮要略》肾气丸方义",
    composition: "熟地黄、山茱萸、山药、泽泻、茯苓、牡丹皮、桂枝、附子",
    usage: "教学示例。温补肾阳、化气行水；含温热药，必须辨证使用。",
    indications: "肾阳不足，腰膝酸软、畏寒肢冷、小便清长、夜尿多、水肿等。",
    modifications: "水肿明显需结合心肾功能检查；湿热尿痛、阴虚火旺者不可误用温补。",
    modern: "用于泌尿、生殖、内分泌和衰老相关证候教学讨论。"
  },
  "保和丸": {
    source: "《丹溪心法》",
    composition: "山楂、神曲、半夏、茯苓、陈皮、连翘、莱菔子",
    usage: "教学示例。消食和胃，儿童剂量需儿科医师决定。",
    indications: "食积停滞，脘腹胀满、嗳腐吞酸、厌食、大便酸臭或不爽。",
    modifications: "脾虚食少应健脾为主；发热腹痛、呕吐腹泻明显需排查感染和急腹症。",
    modern: "用于消化不良、食积样表现的教学讨论。"
  },
  "增液汤": {
    source: "《温病条辨》",
    composition: "玄参、麦冬、生地黄",
    usage: "教学示例。增液润燥、滋阴生津，实际剂量需医师辨证。",
    indications: "津液不足、肠燥便秘、口干咽燥、舌红少津等。",
    modifications: "实热便秘需辨是否合通腑；脾虚便溏、痰湿重者慎用滋腻。",
    modern: "用于津亏燥结、口干便秘等证候教学，需排查糖尿病、脱水、药物副作用等。"
  },
  "沙参麦冬汤": {
    source: "《温病条辨》",
    composition: "沙参、玉竹、生甘草、冬桑叶、麦冬、生扁豆、天花粉",
    usage: "教学示例。清养肺胃、生津润燥。",
    indications: "燥伤肺胃或肺胃阴伤，干咳少痰、咽干口渴、舌红少苔。",
    modifications: "咳血、久咳、发热不退需现代医学检查；痰湿重者不宜单纯养阴。",
    modern: "用于干咳、咽燥、口干等肺胃阴伤证候教学。"
  },
  "养阴清肺汤": {
    source: "《重楼玉钥》",
    composition: "大生地、麦冬、玄参、贝母、丹皮、薄荷、白芍、甘草",
    usage: "教学示例。养阴清肺，解毒利咽。",
    indications: "阴虚肺燥或咽喉燥痛，咽干、鼻干、干咳、舌红少苔等。",
    modifications: "咽喉梗阻、呼吸困难、高热需急诊；寒湿痰多者慎用。",
    modern: "用于阴虚燥热咽喉症状的方义教学，不替代耳鼻喉诊疗。"
  }
};

const herbKnowledge = {
  "人参": { type: "补气药", nature: "甘、微苦，微温；归脾、肺、心、肾经", actions: "大补元气，补脾益肺，生津养血，安神益智。", dosage: "教学示例：常见 3-9g，另煎或研末另服需医师指导。", western: "研究涉及免疫调节、抗疲劳、代谢和认知等方向。", safety: "实热、湿热、表实未解者慎用；与抗凝、降糖等药物同用需专业评估。" },
  "黄芪": { type: "补气药", nature: "甘，微温；归脾、肺经", actions: "补气升阳，固表止汗，利水消肿，托毒生肌。", dosage: "教学示例：9-30g，补气升提或固表用途不同。", western: "研究涉及免疫、心肾保护、疲劳和蛋白尿等方向。", safety: "实热、阴虚阳亢、表实邪盛慎用。" },
  "白术": { type: "补气健脾药", nature: "苦、甘，温；归脾、胃经", actions: "健脾益气，燥湿利水，止汗，安胎。", dosage: "教学示例：6-12g。", western: "研究涉及胃肠动力、免疫和水液代谢。", safety: "阴虚燥渴、津亏便秘慎用。" },
  "茯苓": { type: "利水渗湿药", nature: "甘、淡，平；归心、肺、脾、肾经", actions: "利水渗湿，健脾，宁心。", dosage: "教学示例：9-15g。", western: "研究涉及利尿、免疫调节、镇静和代谢。", safety: "阴虚津伤、小便过多者慎用。" },
  "甘草": { type: "补气调和药", nature: "甘，平；归心、肺、脾、胃经", actions: "补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药。", dosage: "教学示例：2-10g。", western: "甘草酸相关研究涉及抗炎、肝保护等。", safety: "长期大剂量可致水钠潴留、血压升高、低钾；高血压、心肾病慎用。" },
  "当归": { type: "补血活血药", nature: "甘、辛，温；归肝、心、脾经", actions: "补血活血，调经止痛，润肠通便。", dosage: "教学示例：6-12g。", western: "研究涉及造血、微循环、抗炎和妇科相关。", safety: "出血倾向、月经过多、腹泻者慎用；抗凝药同用需评估。" },
  "白芍": { type: "补血柔肝药", nature: "苦、酸，微寒；归肝、脾经", actions: "养血调经，敛阴止汗，柔肝止痛，平抑肝阳。", dosage: "教学示例：6-15g。", western: "研究涉及镇痛、抗炎、免疫调节。", safety: "阳衰虚寒、腹痛泄泻慎用。" },
  "柴胡": { type: "解表疏肝药", nature: "辛、苦，微寒；归肝、胆、肺经", actions: "疏散退热，疏肝解郁，升举阳气。", dosage: "教学示例：3-10g。", western: "研究涉及抗炎、肝胆、情绪应激方向。", safety: "阴虚阳亢、肝阳上亢明显者慎用；肝病患者需专业评估。" },
  "陈皮": { type: "理气药", nature: "辛、苦，温；归脾、肺经", actions: "理气健脾，燥湿化痰。", dosage: "教学示例：3-10g。", western: "研究涉及胃肠动力、祛痰、黄酮类抗氧化。", safety: "气虚阴亏、燥咳吐血慎用。" },
  "半夏": { type: "化痰止呕药", nature: "辛，温；有毒；归脾、胃、肺经", actions: "燥湿化痰，降逆止呕，消痞散结。", dosage: "教学示例：多用制半夏 3-9g。", western: "研究涉及止吐、祛痰、胃肠调节。", safety: "必须炮制使用；孕妇、阴虚燥咳、出血者慎用。" },
  "酸枣仁": { type: "养心安神药", nature: "甘、酸，平；归心、肝、胆经", actions: "养心补肝，宁心安神，敛汗，生津。", dosage: "教学示例：10-20g，失眠常用炒品。", western: "研究涉及睡眠、镇静、焦虑相关。", safety: "嗜睡者、驾驶和镇静药同用需谨慎。" },
  "远志": { type: "安神化痰药", nature: "苦、辛，温；归心、肾、肺经", actions: "安神益智，交通心肾，祛痰开窍，消散痈肿。", dosage: "教学示例：3-10g。", western: "研究涉及认知、镇静、祛痰。", safety: "胃炎、溃疡、阴虚火旺者慎用。" },
  "天麻": { type: "平肝息风药", nature: "甘，平；归肝经", actions: "息风止痉，平抑肝阳，祛风通络。", dosage: "教学示例：3-10g。", western: "研究涉及眩晕、头痛、神经保护。", safety: "血虚无风、津液亏虚者需辨证；过敏少见但需注意。" },
  "钩藤": { type: "平肝息风药", nature: "甘，微寒；归肝、心包经", actions: "息风定惊，清热平肝。", dosage: "教学示例：6-15g，常后下。", western: "研究涉及血压、神经兴奋性和镇静。", safety: "低血压或降压药同用需监测。" },
  "石决明": { type: "平肝潜阳药", nature: "咸，寒；归肝经", actions: "平肝潜阳，清肝明目。", dosage: "教学示例：15-30g，先煎。", western: "主要为矿物贝壳类钙质药材相关方义研究。", safety: "脾胃虚寒慎用。" },
  "川芎": { type: "活血行气药", nature: "辛，温；归肝、胆、心包经", actions: "活血行气，祛风止痛。", dosage: "教学示例：3-10g。", western: "研究涉及头痛、微循环、抗血小板。", safety: "阴虚火旺、出血倾向、孕期慎用。" },
  "金银花": { type: "清热解毒药", nature: "甘，寒；归肺、心、胃经", actions: "清热解毒，疏散风热。", dosage: "教学示例：6-15g。", western: "研究涉及抗炎、抗菌、抗病毒方向。", safety: "脾胃虚寒、便溏慎用。" },
  "连翘": { type: "清热解毒药", nature: "苦，微寒；归肺、心、小肠经", actions: "清热解毒，消肿散结，疏散风热。", dosage: "教学示例：6-15g。", western: "研究涉及上呼吸道感染、抗炎抗氧化。", safety: "脾胃虚寒慎用。" },
  "黄芩": { type: "清热燥湿药", nature: "苦，寒；归肺、胆、脾、大肠、小肠经", actions: "清热燥湿，泻火解毒，止血，安胎。", dosage: "教学示例：3-10g。", western: "黄芩苷研究涉及抗炎、抗病毒、肝胆。", safety: "苦寒伤胃，脾胃虚寒慎用。" },
  "黄连": { type: "清热燥湿药", nature: "苦，寒；归心、脾、胃、肝、胆、大肠经", actions: "清热燥湿，泻火解毒。", dosage: "教学示例：2-5g。", western: "小檗碱相关研究涉及肠道、代谢、抗菌。", safety: "苦寒力强，脾胃虚寒、孕期慎用；与多药相互作用需评估。" },
  "熟地黄": { type: "补血滋阴药", nature: "甘，微温；归肝、肾经", actions: "补血滋阴，益精填髓。", dosage: "教学示例：9-15g。", western: "研究涉及造血、内分泌、免疫和抗衰老。", safety: "滋腻碍胃，痰湿、便溏、纳差者慎用。" },
  "生地黄": { type: "清热凉血药", nature: "甘、苦，寒；归心、肝、肾经", actions: "清热凉血，养阴生津。", dosage: "教学示例：9-15g。", western: "研究涉及抗炎、免疫和糖代谢。", safety: "脾虚湿滞、便溏者慎用。" },
  "麦冬": { type: "养阴药", nature: "甘、微苦，微寒；归心、肺、胃经", actions: "养阴润肺，益胃生津，清心除烦。", dosage: "教学示例：6-12g。", western: "研究涉及黏膜保护、抗炎、心血管。", safety: "脾胃虚寒泄泻、痰湿咳嗽慎用。" },
  "丹参": { type: "活血祛瘀药", nature: "苦，微寒；归心、肝经", actions: "活血祛瘀，通经止痛，清心除烦，凉血消痈。", dosage: "教学示例：9-15g。", western: "研究涉及冠脉循环、抗血小板、抗炎。", safety: "抗凝/抗血小板药同用、出血倾向、孕期慎用。" },
  "桃仁": { type: "活血祛瘀药", nature: "苦、甘，平；归心、肝、大肠经", actions: "活血祛瘀，润肠通便，止咳平喘。", dosage: "教学示例：5-10g。", western: "研究涉及微循环、肠道润滑、炎症。", safety: "孕期、出血倾向、抗凝用药慎用。" },
  "红花": { type: "活血调经药", nature: "辛，温；归心、肝经", actions: "活血通经，散瘀止痛。", dosage: "教学示例：3-10g。", western: "研究涉及微循环和血液流变。", safety: "孕期、月经过多、出血倾向慎用。" }
};

const graphSets = {
  liver: [
    ["头痛", "Headache", 24, 36, true],
    ["舌红", "Red tongue", 168, 28, false],
    ["肝阳上亢", "Liver Yang", 106, 118, true],
    ["天麻钩藤饮", "Formula", 206, 190, false]
  ],
  liverQi: [
    ["胁胀太息", "Rib distension", 24, 36, true],
    ["情志不舒", "Stress", 168, 28, false],
    ["肝郁气滞", "Liver Qi stagnation", 106, 118, true],
    ["逍遥散", "Formula", 206, 190, false]
  ],
  exterior: [
    ["后头痛", "Occipital pain", 24, 42, true],
    ["浮脉", "Floating pulse", 168, 34, false],
    ["太阳表证", "Taiyang pattern", 96, 126, true],
    ["川芎茶调散", "Formula", 210, 190, false]
  ],
  qi: [
    ["乏力", "Fatigue", 28, 48, true],
    ["舌淡", "Pale tongue", 170, 40, false],
    ["气虚证", "Qi deficiency", 104, 128, true],
    ["四君子汤", "Formula", 216, 190, false]
  ],
  heartSpleen: [
    ["失眠多梦", "Insomnia", 28, 48, true],
    ["舌嫩", "Tender tongue", 170, 40, false],
    ["心脾两虚", "Heart-Spleen deficiency", 104, 128, true],
    ["归脾汤", "Formula", 216, 190, false]
  ],
  yin: [
    ["盗汗", "Night sweat", 28, 48, true],
    ["少苔", "Scant coating", 170, 40, false],
    ["阴虚内热", "Yin deficiency", 104, 128, true],
    ["天王补心丹", "Formula", 216, 190, false]
  ],
  fluidDeficiency: [
    ["口干咽干", "Dry mouth", 28, 48, true],
    ["少苔/燥苔", "Dry coating", 170, 40, false],
    ["津液不足", "Fluid deficiency", 104, 128, true],
    ["增液汤", "Formula", 216, 190, false]
  ],
  dampHeat: [
    ["尿黄口黏", "Damp heat", 28, 48, true],
    ["苔腻脉数", "Greasy coating", 170, 40, false],
    ["湿热内蕴", "Damp-heat", 104, 128, true],
    ["龙胆泻肝汤", "Formula", 216, 190, false]
  ],
  phlegmDamp: [
    ["头重痰多", "Phlegm", 28, 48, true],
    ["胸闷苔腻", "Oppression", 170, 40, false],
    ["痰湿阻滞", "Phlegm-damp", 104, 128, true],
    ["二陈汤", "Formula", 216, 190, false]
  ],
  bloodStasis: [
    ["刺痛固定", "Fixed pain", 28, 48, true],
    ["舌暗瘀斑", "Dark tongue", 170, 40, false],
    ["血瘀证", "Blood stasis", 104, 128, true],
    ["血府逐瘀汤", "Formula", 216, 190, false]
  ],
  stomachHeat: [
    ["口臭便秘", "Bad breath", 28, 48, true],
    ["喜冷饮", "Cold drinks", 170, 40, false],
    ["胃热", "Stomach heat", 104, 128, true],
    ["清胃散", "Formula", 216, 190, false]
  ],
  kidneyYang: [
    ["夜尿肢冷", "Nocturia", 28, 48, true],
    ["腰膝酸软", "Low back", 170, 40, false],
    ["肾阳不足", "Kidney Yang deficiency", 104, 128, true],
    ["金匮肾气丸", "Formula", 216, 190, false]
  ],
  childFood: [
    ["食积腹胀", "Food stagnation", 28, 48, true],
    ["厌食便臭", "Poor appetite", 170, 40, false],
    ["小儿食积", "Pediatric food retention", 104, 128, true],
    ["保和丸", "Formula", 216, 190, false]
  ],
  bleeding: [
    ["出血表现", "Bleeding", 28, 48, true],
    ["危险信号", "Red flags", 170, 40, false],
    ["出血证待辨", "Bleeding pattern", 104, 128, true],
    ["先查因止血", "Investigate first", 216, 190, false]
  ],
  undifferentiated: [
    ["症状未全", "Incomplete", 28, 48, true],
    ["舌脉未定", "Tongue/pulse unknown", 170, 40, false],
    ["暂不强辨", "Do not force pattern", 104, 128, true],
    ["继续补问", "Ask more", 216, 190, false]
  ]
};

function t(key) {
  return copy[state.lang][key] || key;
}

function hasRole(...roles) {
  if (!state.authUser) return true;
  return roles.includes(state.role);
}

function applyPermissions() {
  const canManageClinic = hasRole("doctor", "admin");
  const canAdmin = hasRole("admin");
  const canUseAi = !state.authUser || hasRole("doctor", "admin");
  [
    "#registrationForm input",
    "#registrationForm select",
    "#registrationForm textarea",
    "#registrationForm .analyze-button",
    "#saveRecordButton"
  ].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.disabled = !canManageClinic;
      el.title = canManageClinic ? "" : (state.lang === "zh" ? "学生角色不能管理门诊数据" : "Student role cannot manage clinic data");
    });
  });

  ["#resetButton", "#createInviteButton", "#inviteName", "#staffLoginName", "#staffPassword", "#inviteRole", "#validDays"].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.disabled = !canAdmin;
      el.title = canAdmin ? "" : (state.lang === "zh" ? "仅管理员可操作" : "Admin only");
    });
  });

  [
    "#diagnosisForm button",
    "#diagnosisForm select",
    "#diagnosisForm textarea",
    "#diagnosisForm input"
  ].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.disabled = !canUseAi;
      el.title = canUseAi ? "" : (state.lang === "zh" ? "学生身份不能使用 AI 问诊" : "Student role cannot use AI diagnosis");
    });
  });
}

function applyLanguage() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  renderSymptoms();
  renderRole();
  renderDatabase();
  applyPermissions();
}

function renderSymptoms() {
  const box = document.querySelector("#symptomChips");
  box.innerHTML = "";
  symptomGroups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "symptom-group";
    const heading = document.createElement("h3");
    heading.textContent = state.inputLang === "zh" ? group.zh : group.en;
    section.appendChild(heading);

    const chips = document.createElement("div");
    chips.className = "symptom-group-grid";
    group.items.forEach(([id, zh, en]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `chip ${state.selectedSymptoms.has(id) ? "active" : ""}`;
      button.textContent = state.inputLang === "zh" ? zh : en;
      button.addEventListener("click", () => {
        state.selectedSymptoms.has(id)
          ? state.selectedSymptoms.delete(id)
          : state.selectedSymptoms.add(id);
        renderSymptoms();
      });
      chips.appendChild(button);
    });
    section.appendChild(chips);
    box.appendChild(section);
  });
}

function analyze() {
  const selected = state.selectedSymptoms;
  const tongue = document.querySelector("#tongueSelect").value;
  const pulse = document.querySelector("#pulseSelect").value;
  const freeText = document.querySelector("#freeText").value || "";
  const mentions = (terms) => terms.some((term) => freeText.toLowerCase().includes(term.toLowerCase()));
  const hasAny = (...ids) => ids.some((id) => selected.has(id));
  const selectedItems = symptomOptions.filter((item) => selected.has(item.id));
  const selectedLabels = selectedItems.map((item) => item.zh);
  const tongueText = document.querySelector("#tongueSelect").selectedOptions[0]?.textContent?.split("/")[0]?.trim() || "未选择";
  const pulseText = document.querySelector("#pulseSelect").selectedOptions[0]?.textContent?.split("/")[0]?.trim() || "未选择";
  const evidence = [];
  const addEvidence = (text) => {
    if (text && !evidence.includes(text)) evidence.push(text);
  };

  const scores = {
    undifferentiated: 0,
    liver: 0,
    liverQi: 0,
    exterior: 0,
    qi: 0,
    heartSpleen: 0,
    yin: 0,
    fluidDeficiency: 0,
    dampHeat: 0,
    phlegmDamp: 0,
    bloodStasis: 0,
    stomachHeat: 0,
    kidneyYang: 0,
    childFood: 0,
    bleeding: 0
  };
  const add = (profile, amount) => {
    scores[profile] += amount;
  };

  if (!selected.size && tongue === "none" && pulse === "none" && !freeText.trim()) add("undifferentiated", 5);

  if (hasAny("headache", "temporalHeadache", "vertexHeadache", "dizziness", "redEyes", "ribPain")) { add("liver", 2); addEvidence("头目胁肋症状提示肝胆经或清窍受扰"); }
  if (hasAny("bitter", "redEyes") || tongue === "red" || tongue === "darkRed") { add("liver", 1); add("stomachHeat", 1); addEvidence("红舌、目赤、口苦偏热象"); }
  if (pulse === "wiry") { add("liverQi", 2); add("liver", 1); addEvidence("弦脉多见肝胆、气滞、疼痛或痰饮"); }
  if (hasAny("chestPain", "chestTightness", "fixedPain", "darkMenses", "clottedMenses") || mentions(["胸痛", "胸闷", "刺痛", "血块", "chest pain"])) { add("bloodStasis", 3); add("liverQi", 1); addEvidence("刺痛固定、胸痛或血块提示血瘀/气滞风险"); }

  if (hasAny("fever", "chills", "aversionWind", "cough", "occipitalHeadache", "runnyNose", "nasalObstruction")) { add("exterior", 2); addEvidence("发热恶寒、鼻塞流涕、咳嗽偏外感表证"); }
  if (hasAny("phlegm", "whitePhlegm", "yellowPhlegm", "wheezing", "noSweat") || pulse === "floating" || mentions(["发热", "咳嗽", "后头痛", "恶寒", "鼻塞", "fever", "cough"])) { add("exterior", 1); }

  if (hasAny("fatigue", "poorAppetite", "looseStool", "undigestedFoodStool", "edema", "sallowComplexion", "shortBreath")) { add("qi", 2); addEvidence("乏力、纳差、便溏、气短提示脾肺气虚"); }
  if (hasAny("warmDrinkPreference", "clearLongUrine", "nightUrination", "coldLimbs") || tongue === "pale" || tongue === "teethMarked" || tongue === "swollen" || pulse === "deep" || pulse === "deficient" || mentions(["乏力", "纳差", "便溏", "怕冷", "fatigue"])) { add("qi", 1); }

  if (hasAny("insomnia", "dreaminess", "palpitation", "forgetfulness", "anxiety")) { add("heartSpleen", 2); addEvidence("失眠多梦、心悸健忘提示心神失养"); }
  if (hasAny("poorAppetite", "looseStool", "fatigue", "paleComplexion", "scantyMenses", "paleMenses")) add("heartSpleen", 1);
  if (tongue === "tender" || tongue === "pale" || pulse === "weak" || pulse === "deficient" || pulse === "thin") { add("heartSpleen", 2); addEvidence("舌嫩/舌淡、弱脉/虚脉/细脉偏虚证"); }
  if (mentions(["失眠", "多梦", "心悸", "健忘", "insomnia", "dream"])) add("heartSpleen", 2);

  if (hasAny("nightSweat", "fiveCenterHeat", "tidalFever", "dryThroat", "hotPalmsSoles") || tongue === "scanty" || tongue === "peeled" || pulse === "thin" || pulse === "rapid") { add("yin", 2); addEvidence("盗汗、潮热、少苔、细数脉偏阴虚内热"); }
  if ((hasAny("insomnia", "dreaminess")) && (tongue === "scanty" || pulse === "thin" || hasAny("nightSweat", "fiveCenterHeat"))) add("yin", 2);

  if (hasAny("dryMouth", "dryThroat", "thirst", "noDesireToDrink", "coldDrinkPreference", "cracked", "dryEyes") || tongue === "dry" || tongue === "cracked" || tongue === "scanty" || tongue === "peeled") { add("fluidDeficiency", 3); addEvidence("口干咽干、口渴、裂纹/燥苔提示津液不足或热伤津"); }
  if (hasAny("dryStool", "constipation", "hotPalmsSoles", "tidalFever") || pulse === "thin" || pulse === "rapid") add("fluidDeficiency", 1);

  if (hasAny("ribPain", "sighing", "distendingPain", "premenstrualBreastDistension", "irregularMenses", "anxiety", "foreignBodyThroat")) { add("liverQi", 2); addEvidence("胁胀、善太息、情志相关症状提示肝郁气滞"); }
  if (hasAny("poorAppetite", "abdominalDistension", "acidRegurgitation") || mentions(["胁痛", "太息", "郁闷", "乳胀", "情志"])) add("liverQi", 1);

  if (hasAny("yellowPhlegm", "shortYellowUrine", "urgentUrination", "painfulUrination", "stickyStool", "tenesmus", "yellowLeukorrhea", "scrotalDampness", "skinItching", "eczemaLike", "jaundice")) { add("dampHeat", 3); addEvidence("尿黄尿痛、黄带、黏滞便、皮肤湿痒提示湿热"); }
  if (hasAny("bitter", "mouthOdor", "stickyMouth", "fever") || tongue === "greasy" || tongue === "yellow" || tongue === "thickGreasy" || pulse === "rapid" || mentions(["湿热", "尿痛", "黄带", "口黏", "黄疸"])) add("dampHeat", 1);

  if (hasAny("phlegm", "whitePhlegm", "heavyHead", "chestTightness", "nausea", "abdominalDistension", "somnolence", "stickyMouth")) { add("phlegmDamp", 2); addEvidence("痰多、头重、胸闷、恶心、口黏提示痰湿阻滞"); }
  if (hasAny("poorAppetite", "looseStool", "edema") || tongue === "greasy" || tongue === "thickGreasy" || tongue === "swollen" || pulse === "slippery" || mentions(["痰多", "头重", "困重", "苔腻"])) add("phlegmDamp", 1);

  if (hasAny("fixedPain", "chestPain", "darkComplexion", "scalyDrySkin", "bruising", "darkMenses", "clottedMenses", "pressureWorseDysmenorrhea")) { add("bloodStasis", 3); addEvidence("刺痛固定、经血块、面色晦暗、紫斑提示血瘀"); }
  if (tongue === "purple" || tongue === "bluishPurple" || tongue === "darkRed" || pulse === "choppy" || mentions(["刺痛", "痛有定处", "瘀斑", "舌暗"])) add("bloodStasis", 2);

  if (hasAny("mouthOdor", "rapidHunger", "coldDrinkPreference", "dryStool", "constipation", "gumBleed", "soreSwelling", "burningPain")) { add("stomachHeat", 2); addEvidence("口臭、消谷善饥、便秘、牙龈出血提示胃肠实热"); }
  if (hasAny("thirst", "bitter", "sourTaste") || tongue === "red" || tongue === "yellow" || pulse === "rapid" || mentions(["胃热", "口臭", "牙龈", "便秘"])) add("stomachHeat", 1);

  if (hasAny("coldLimbs", "clearLongUrine", "nightUrination", "lowBackPain", "kneeWeakness", "impotence", "prematureEjaculation", "enuresis", "warmDrinkPreference")) { add("kidneyYang", 2); addEvidence("畏寒肢冷、夜尿、小便清长、腰膝酸软提示肾阳不足"); }
  if (tongue === "pale" || tongue === "swollen" || pulse === "deep" || pulse === "weak" || mentions(["畏寒", "腰膝酸软", "夜尿", "阳痿"])) add("kidneyYang", 1);

  if (hasAny("foodStagnation", "childAnorexia", "childDiarrhea", "childNightCrying") || mentions(["食积", "嗳腐", "小儿厌食", "腹胀"])) { add("childFood", 3); addEvidence("小儿厌食、食积、腹胀便臭提示食积停滞"); }
  if (hasAny("abdominalDistension", "poorAppetite", "undigestedFoodStool", "stickyStool")) add("childFood", 1);

  if (hasAny("noseBleed", "gumBleed", "bloodStool", "hematuria", "hemoptysis", "hematemesis", "melena", "skinBleeding", "easyBruising", "prolongedBleeding", "heavyMenses")) { add("bleeding", 4); addEvidence("出血类症状需优先辨危险信号和现代医学查因"); }
  if (hasAny("fever", "redComplexion", "rash", "bruising") || tongue === "red" || pulse === "rapid" || mentions(["出血", "咯血", "吐血", "黑便", "尿血"])) add("bleeding", 1);

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  let profile = ranked[0][0];
  if (ranked[0][1] <= 0) profile = "undifferentiated";
  state.lastProfile = profile;

  const zhResults = {
    liver: ["肝阳上亢", "头痛、眩晕、目赤、舌红或弦脉提示肝阳偏亢，上扰清窍；治法以平肝潜阳、清热息风为主。", "需关注血压、偏头痛、紧张型头痛、脑血管危险信号；突发剧烈头痛、偏瘫、言语不清需急诊。", "天麻钩藤饮 / Gastrodia and Uncaria Decoction", "基础思路：天麻、钩藤、石决明、牛膝等平肝潜阳；热象重可清肝，阴虚明显配养阴，痰湿明显先化痰。教学演示，不构成处方。"],
    liverQi: ["肝郁气滞", "胁痛、善太息、胀痛、经前乳胀、情志不舒与脘腹胀满同见，提示肝失疏泄、气机郁滞；治以疏肝解郁、理气和中。", "需评估焦虑抑郁、胃食管反流、胆囊疾病、乳腺或妇科问题；胸痛和持续右上腹痛要线下检查。", "逍遥散 / Xiao Yao San", "基础思路：柴胡、当归、白芍、白术、茯苓、甘草等疏肝健脾养血；热象可丹栀化裁，气滞痛重加强理气，痰湿重合化痰。"],
    exterior: ["外感表证", "发热恶寒、恶风、鼻塞流涕、咳嗽或后头痛提示外邪在表；治法按风寒、风热分疏风解表。", "考虑上呼吸道感染、流感样疾病、过敏性鼻炎等；高热不退、呼吸困难、胸痛、老人儿童精神差需及时就医。", "桂枝汤 / Gui Zhi Tang；银翘散 / Yin Qiao San", "恶风自汗偏桂枝汤思路；咽痛口渴、舌尖红偏银翘散思路；无汗身痛喘咳需谨慎辨麻黄汤禁忌。"],
    qi: ["脾肺气虚", "乏力、气短、纳差、便溏、面色萎黄、舌淡或脉虚提示气虚，脾失健运、肺气不足；治以益气健脾。", "需排查贫血、甲状腺异常、营养不良、慢性感染、睡眠障碍和心肺功能问题。", "四君子汤 / Si Jun Zi Tang；补中益气汤 / Bu Zhong Yi Qi Tang", "基础用人参、白术、茯苓、甘草补气健脾；久泻、下陷感、明显气短乏力可参考补中益气汤思路。"],
    heartSpleen: ["心脾两虚", "失眠、多梦、心悸、健忘、纳差便溏、舌嫩或弱脉提示心脾两虚、气血不足；治以益气健脾、养血安神。", "需评估焦虑抑郁、睡眠节律紊乱、贫血、甲状腺功能、消化吸收和长期压力因素。", "归脾汤 / Gui Pi Tang", "黄芪、人参、白术、茯神、酸枣仁、龙眼肉、当归、远志等。失眠重偏养心安神，便溏纳差重偏健脾。"],
    yin: ["阴虚内热", "盗汗、潮热、五心烦热、口咽干、少苔或脉细数提示阴液不足、虚热内扰；治以滋阴清热、养心安神。", "需排查甲状腺功能异常、感染后低热、围绝经期、焦虑、慢性消耗性疾病。", "天王补心丹 / Tian Wang Bu Xin Dan；知柏地黄丸 / Zhi Bai Di Huang Wan", "失眠心悸偏天王补心丹思路；腰膝酸软、盗汗骨蒸偏知柏地黄丸思路；含矿物药或苦寒药均需安全评估。"],
    fluidDeficiency: ["津液不足 / 燥热伤津待辨", "口干、咽干、口渴、干便、裂纹舌、少苔或燥苔提示津液亏少；需进一步辨是实热伤津、阴虚内热、燥邪犯肺，还是湿热阻滞导致津不上承。治法随证为生津润燥、清热养阴或宣润肺胃。", "需评估饮水不足、口腔疾病、糖代谢异常、干燥综合征、药物副作用、发热脱水等。若明显多饮多尿、体重下降，应查血糖和尿常规。", "增液汤 / Zeng Ye Tang；沙参麦冬汤或养阴清肺汤思路", "单独口干不能直接开方。大便干结偏增液润肠；干咳咽燥偏养阴润肺；口苦口黏尿黄偏湿热，不宜单纯滋腻。"],
    dampHeat: ["湿热内蕴或湿热下注", "口苦口黏、小便短黄尿痛、大便黏滞、黄带、阴囊潮湿、皮肤瘙痒或黄疸提示湿热；治以清热利湿、分消湿浊。", "需排查泌尿感染、阴道炎/前列腺炎、肝胆疾病、肠炎、皮肤感染或过敏；黄疸、发热腰痛、血尿需尽快就医。", "龙胆泻肝汤 / Long Dan Xie Gan Tang；平胃散加清热利湿思路", "肝胆湿热、胁痛口苦尿赤偏龙胆泻肝汤；脾胃湿困偏平胃散化裁。苦寒清热药不可长期自行使用。"],
    phlegmDamp: ["痰湿阻滞", "头重如裹、痰多胸闷、恶心、纳差腹胀、嗜睡、苔腻提示痰湿内阻、清阳不升；治以燥湿化痰、理气和中。", "需结合呼吸道感染、慢性支气管炎、胃食管反流、代谢综合征、睡眠呼吸暂停等方向评估。", "二陈汤 / Er Chen Tang；六君子汤 / Liu Jun Zi Tang", "痰多胸闷偏二陈汤；气虚痰湿、纳差便溏偏六君子汤；黄痰发热需转清热化痰。"],
    bloodStasis: ["血瘀证", "刺痛固定、痛经拒按、经色暗有血块、面色晦暗、肌肤甲错、舌暗或脉涩提示血行不畅；治以活血化瘀、行气止痛。", "胸痛、突发肢体麻木、咯血黑便、外伤后疼痛等必须先排急症；抗凝用药、孕期、出血倾向需特别谨慎。", "血府逐瘀汤 / Xue Fu Zhu Yu Tang", "胸胁头痛日久、痛有定处偏血府逐瘀汤思路；寒凝加温通，气滞加行气。活血药必须核对禁忌。"],
    stomachHeat: ["胃热或胃肠实热", "口臭、牙龈出血、消谷善饥、喜冷饮、便秘大便干、口渴、舌红脉数提示胃热或胃肠积热；治以清胃泻热、通腑和胃。", "需排查口腔牙周疾病、胃食管反流、糖代谢异常、便秘相关疾病；便血、剧烈腹痛、呕血黑便需急诊。", "清胃散 / Qing Wei San；承气类方义需医师严辨", "口臭齿衄偏清胃散思路；便秘腹满拒按属实热时才考虑通腑，老人孕妇儿童不可自行攻下。"],
    kidneyYang: ["肾阳不足", "畏寒肢冷、小便清长、夜尿多、腰膝酸软、阳痿早泄、舌淡胖或沉弱脉提示肾阳不足、气化无力；治以温补肾阳、化气行水。", "需评估泌尿生殖系统疾病、前列腺问题、糖尿病、肾功能、内分泌和心血管因素。", "金匮肾气丸 / Jin Gui Shen Qi Wan", "腰膝冷痛、夜尿清长偏温补肾阳；水肿明显需查肾心功能；湿热尿痛时不能误补。"],
    childFood: ["小儿食积", "小儿厌食、食积、腹胀、大便酸臭或完谷不化、夜卧不安提示乳食积滞、脾胃运化失常；治以消食导滞、健脾和胃。", "儿童高热惊厥、持续呕吐腹泻、脱水、精神差、便血需立即就医；长期厌食需查营养和消化系统。", "保和丸 / Bao He Wan", "山楂、神曲、莱菔子等消食化滞；脾虚明显需健脾，不可长期过用消导。儿童剂量必须儿科医师决定。"],
    bleeding: ["出血证待辨", "鼻衄、齿衄、便血、尿血、咯血、吐血、黑便、紫斑或月经过多提示出血类证候，需辨血热妄行、气不摄血、瘀血阻络等。", "咯血、吐血、黑便、尿血、出血不止、头晕心慌、血压异常属于高风险，优先线下急诊或专科检查。", "先止血与查因，方药需面诊辨证", "血热偏清热凉血；气虚不摄偏益气摄血；瘀血出血偏化瘀止血。此类不提供自行用方，必须先做现代医学排查。"],
    undifferentiated: ["资料不足，暂不强行辨证", "目前症状、舌象、脉象信息不足。请至少选择主要症状，并补充寒热、汗出、饮食口味、二便、睡眠、疼痛性质、舌象和脉象。系统会再进行四诊合参。", "若有胸痛、呼吸困难、意识障碍、突发剧烈头痛、偏瘫、咯血、吐血、黑便、持续高热，应先线下就医。", "暂不推荐方剂", "资料不足时不应硬套方剂。请继续补问病程、诱因、加重缓解因素、既往史、用药史和危险信号。"]
  };

  const enResults = {
    liver: ["Liver Yang Hyperactivity", "Headache, dizziness, red eyes, red tongue, or wiry pulse suggests Liver Yang rising; principle: calm Liver, anchor Yang, clear heat, extinguish wind.", "Check blood pressure, migraine/tension headache, and neurovascular warning signs.", "Gastrodia and Uncaria Decoction / 天麻钩藤饮", "Teaching only: Gastrodia, Uncaria, Haliotis shell, Achyranthes. Modify for heat, phlegm, or Yin deficiency."],
    liverQi: ["Liver Qi Stagnation", "Rib-side pain, sighing, distending pain, premenstrual breast distension, mood stress, and abdominal bloating suggest constrained Liver Qi.", "Consider anxiety, reflux, gallbladder disease, breast/gynecologic disease; chest pain needs medical assessment.", "Xiao Yao San / 逍遥散", "Teaching only: soothe Liver, strengthen Spleen, nourish Blood; modify for heat, Qi stagnation, or phlegm-dampness."],
    exterior: ["Exterior Pattern", "Fever/chills, aversion to wind, nasal symptoms, cough, or occipital headache suggests an exterior pathogen; differentiate wind-cold versus wind-heat.", "Consider URI, influenza-like illness, allergy. Seek care for high fever, dyspnea, chest pain, or frail patients.", "Gui Zhi Tang / 桂枝汤; Yin Qiao San / 银翘散", "Use formula direction by pattern, not as a prescription."],
    qi: ["Spleen-Lung Qi Deficiency", "Fatigue, shortness of breath, poor appetite, loose stool, sallow complexion, pale tongue, or weak pulse suggests Qi deficiency.", "Check anemia, thyroid disease, nutrition, chronic infection, sleep and cardiopulmonary issues.", "Si Jun Zi Tang / 四君子汤; Bu Zhong Yi Qi Tang / 补中益气汤", "Teaching only: strengthen Qi and Spleen; consider raising Yang when sinking signs exist."],
    heartSpleen: ["Heart-Spleen Deficiency", "Insomnia, vivid dreams, palpitations, forgetfulness, poor appetite, loose stool, tender tongue, or weak pulse suggests Qi-Blood insufficiency.", "Consider anxiety, circadian disruption, anemia, thyroid disease, malabsorption and chronic stress.", "Gui Pi Tang / 归脾汤", "Teaching only: tonify Qi, nourish Blood, calm the spirit."],
    yin: ["Yin Deficiency with Deficiency Heat", "Night sweating, tidal fever, five-center heat, dry throat, scant coating, or thin-rapid pulse suggests Yin deficiency with deficiency heat.", "Check thyroid dysfunction, chronic infection, perimenopause, anxiety and wasting disease.", "Tian Wang Bu Xin Dan / 天王补心丹; Zhi Bai Di Huang Wan / 知柏地黄丸", "Teaching only: nourish Yin and clear deficiency heat; safety review required."],
    fluidDeficiency: ["Fluid Deficiency / Dryness-Heat to Differentiate", "Dry mouth, dry throat, thirst, dry stool, cracked tongue, scant coating, or dry coating suggests insufficient fluids. Differentiate excess heat damaging fluids, Yin deficiency, dryness affecting Lung, or damp-heat blocking fluid distribution.", "Consider dehydration, oral disease, diabetes, Sjogren syndrome, medication effects, fever and fluid loss.", "Zeng Ye Tang / 增液汤; Sha Shen Mai Dong Tang or Yang Yin Qing Fei Tang direction", "Do not prescribe from dry mouth alone. Constipation suggests moistening bowels; dry cough suggests nourishing Lung; bitter sticky mouth and yellow urine suggests damp-heat."],
    dampHeat: ["Damp-Heat Pattern", "Sticky bitter taste, scanty yellow urine, dysuria, sticky stool, yellow leukorrhea, scrotal dampness, itching, or jaundice suggests damp-heat.", "Rule out urinary infection, gynecologic/urologic infection, hepatobiliary disease, enteritis, skin infection/allergy.", "Long Dan Xie Gan Tang / 龙胆泻肝汤; modified Ping Wei San / 平胃散", "Teaching only: clear heat and drain dampness; bitter-cold herbs need caution."],
    phlegmDamp: ["Phlegm-Damp Obstruction", "Heavy head, abundant phlegm, chest oppression, nausea, poor appetite, somnolence, and greasy coating suggest phlegm-damp obstruction.", "Consider respiratory disease, reflux, metabolic syndrome, sleep apnea.", "Er Chen Tang / 二陈汤; Liu Jun Zi Tang / 六君子汤", "Teaching only: dry dampness, transform phlegm, regulate Qi and strengthen Spleen."],
    bloodStasis: ["Blood Stasis Pattern", "Fixed stabbing pain, dark complexion, menstrual clots, purpura, dark tongue, or choppy pulse suggests impaired blood movement.", "Chest pain, neurologic symptoms, hemoptysis/melena, trauma, pregnancy, anticoagulant use require priority medical assessment.", "Xue Fu Zhu Yu Tang / 血府逐瘀汤", "Teaching only: invigorate blood and move Qi after contraindication review."],
    stomachHeat: ["Stomach Heat / Intestinal Heat", "Bad breath, gum bleeding, rapid hunger, preference for cold drinks, dry stool, constipation, thirst and rapid pulse suggest Stomach/GI heat.", "Rule out dental disease, reflux, diabetes/metabolic disease and dangerous GI bleeding.", "Qing Wei San / 清胃散; purgative formulas only under clinician supervision", "Teaching only: clear Stomach heat and harmonize bowels; do not self-purge."],
    kidneyYang: ["Kidney Yang Deficiency", "Cold limbs, clear profuse urine, nocturia, low back/knee weakness, impotence, pale swollen tongue, or deep-weak pulse suggests Kidney Yang deficiency.", "Assess urinary/prostate disease, diabetes, kidney function, endocrine and cardiovascular factors.", "Jin Gui Shen Qi Wan / 金匮肾气丸", "Teaching only: warm and tonify Kidney Yang; avoid tonification when damp-heat dysuria is present."],
    childFood: ["Pediatric Food Stagnation", "Pediatric anorexia, food stagnation, abdominal distension, sour stool, undigested food, or restless sleep suggests food accumulation.", "High fever convulsion, dehydration, persistent vomiting/diarrhea, blood in stool or lethargy needs urgent care.", "Bao He Wan / 保和丸", "Teaching only: reduce food stagnation and support Spleen; pediatric dosing requires clinician judgment."],
    bleeding: ["Bleeding Pattern Requiring Differentiation", "Epistaxis, gum bleeding, hematuria, hematemesis, melena, hemoptysis, purpura, or heavy menses needs differentiation of blood heat, Qi failing to contain blood, or stasis.", "Hemoptysis, hematemesis, melena, hematuria, prolonged bleeding, dizziness, palpitations or abnormal blood pressure are high risk.", "Stop bleeding and investigate cause first", "No self-prescribed formula. Modern medical evaluation comes first."],
    undifferentiated: ["Insufficient data", "There is not enough symptom, tongue, and pulse information. Add chief symptoms, cold/heat, sweating, appetite/taste, stool/urine, sleep, pain quality, tongue and pulse.", "Red flags such as chest pain, dyspnea, neurologic deficit, severe sudden headache, bleeding or persistent high fever need urgent care.", "No formula recommendation yet", "Do not force a formula when data are insufficient."]
  };

  const data = state.lang === "zh" ? zhResults[profile] : enResults[profile];
  const compatible = ranked
    .filter(([key, value]) => key !== profile && key !== "undifferentiated" && value > 0)
    .slice(0, 3)
    .map(([key]) => (state.lang === "zh" ? zhResults[key]?.[0] : enResults[key]?.[0]))
    .filter(Boolean);
  const evidenceText = evidence.length
    ? evidence.slice(0, 5).join("；")
    : (state.lang === "zh" ? "暂无充分四诊证据，请继续补充问诊信息" : "Insufficient four-diagnostic evidence; add more intake details");
  const intakeText = state.lang === "zh"
    ? `已选症状：${selectedLabels.join("、") || "未选择"}；舌象：${tongueText}；脉象：${pulseText}。`
    : `Selected symptoms: ${selectedLabels.map((label) => symptomOptions.find((item) => item.zh === label)?.en || label).join(", ") || "None"}; tongue: ${tongueText}; pulse: ${pulseText}.`;
  const compatibleText = compatible.length
    ? (state.lang === "zh" ? `兼夹/需鉴别：${compatible.join("、")}。` : `Concurrent patterns to differentiate: ${compatible.join(", ")}.`)
    : "";
  document.querySelector("#tcmDiagnosis").textContent = data[0];
  document.querySelector("#pathogenesis").textContent = `${intakeText} ${data[1]} 四诊依据：${evidenceText}。${compatibleText}`;
  document.querySelector("#westernDiagnosis").textContent = data[2];
  document.querySelector("#riskText").textContent = hasAny("chestPain", "hemoptysis", "hematemesis", "melena", "prolongedBleeding", "febrileConvulsion", "urinaryRetention")
    ? state.lang === "zh"
      ? "Risk level: high. 胸痛、咯血、吐血、黑便、出血不止、高热惊厥或癃闭请优先线下急诊/专科处理。"
      : "Risk level: high. Chest pain, hemoptysis, hematemesis, melena, prolonged bleeding, febrile convulsion or urinary retention needs urgent care."
    : state.lang === "zh"
      ? "Risk level: moderate. 本系统仅用于研究与教学。"
      : "Risk level: moderate. This system is for research and education only.";
  document.querySelector("#formulaName").innerHTML = renderKnowledgeLinks(data[3]);
  document.querySelector("#formulaDetail").innerHTML = renderKnowledgeLinks(data[4]);

  const confidenceMap = {
    liver: 0.87,
    liverQi: 0.84,
    exterior: 0.82,
    qi: 0.79,
    heartSpleen: 0.84,
    yin: 0.83,
    dampHeat: 0.82,
    phlegmDamp: 0.81,
    bloodStasis: 0.80,
    stomachHeat: 0.78,
    kidneyYang: 0.79,
    childFood: 0.77,
    bleeding: 0.72,
    fluidDeficiency: 0.76,
    undifferentiated: 0.50
  };
  const topScore = ranked[0]?.[1] || 0;
  const secondScore = ranked[1]?.[1] || 0;
  const confidence = Math.max(0.5, Math.min(confidenceMap[profile] || 0.76, 0.62 + topScore * 0.035 + Math.max(0, topScore - secondScore) * 0.015));
  document.querySelector("#confidenceBadge").textContent = confidence.toFixed(2);
  document.querySelector("#retrievalScore").textContent = (confidence + 0.04).toFixed(2);
  document.querySelector("#consistencyScore").textContent = (confidence + 0.01).toFixed(2);
  renderGraph(profile);
  renderDatabase();
}

async function requestHuggingFaceDiagnosis() {
  const output = document.querySelector("#aiOutput");
  if (!output) return;

  const selectedLabels = symptomOptions
    .filter((item) => state.selectedSymptoms.has(item.id))
    .map((item) => item.zh);
  const tongueText = document.querySelector("#tongueSelect").selectedOptions[0]?.textContent?.split("/")[0]?.trim() || "未选择";
  const pulseText = document.querySelector("#pulseSelect").selectedOptions[0]?.textContent?.split("/")[0]?.trim() || "未选择";
  const freeText = document.querySelector("#freeText").value || "";

  const sentSummary = state.lang === "zh"
    ? `正在检测本机 Ollama AI 模型：\n症状：${selectedLabels.join("、") || "未选择"}\n舌象：${tongueText}\n脉象：${pulseText}\n自由描述：${freeText || "无"}`
    : `Checking local Ollama AI model:\nSymptoms: ${selectedLabels.join(", ") || "None selected"}\nTongue: ${tongueText}\nPulse: ${pulseText}\nFree text: ${freeText || "None"}`;
  output.textContent = sentSummary;

  const localResult = await requestLocalOllamaDiagnosis({ selectedLabels, tongueText, pulseText, freeText });
  if (localResult.handled) {
    output.textContent = localResult.message;
    return;
  }

  try {
    output.textContent = state.lang === "zh"
      ? `${sentSummary}\n\n未检测到可用本机 Ollama，正在尝试 Hugging Face 备用模型...`
      : `${sentSummary}\n\nNo usable local Ollama detected. Trying Hugging Face fallback...`;
    const response = await fetch("/api/ai-diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symptoms: selectedLabels,
        tongue: tongueText,
        pulse: pulseText,
        freeText,
        language: state.lang === "zh" ? "中文" : "English",
        maxTokens: 384,
        temperature: 0.2
      })
    });
    const rawText = await response.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(rawText.slice(0, 300) || "AI service returned a non-JSON error");
    }
    if (!response.ok) throw new Error(data.error || "AI request failed");
    output.textContent = state.lang === "zh"
      ? `Hugging Face 模型返回：\n\n${data.result || "模型没有返回内容。"}`
      : `Hugging Face model response:\n\n${data.result || "The model returned no content."}`;
  } catch (error) {
    output.textContent = state.lang === "zh"
      ? `Hugging Face 模型暂不可用：${error.message}\n\n已保留上方本地规则 + GraphRAG 演示结果。`
      : `Hugging Face model unavailable: ${error.message}\n\nLocal rule + GraphRAG demo result remains above.`;
  }
}

async function fetchLocalOllama(path, options = {}, timeout = 30000) {
  let lastError;
  for (const baseUrl of LOCAL_OLLAMA_URLS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(`${baseUrl}${path}`, { ...options, signal: controller.signal });
      return { response, baseUrl };
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error("Local Ollama is unavailable");
}

async function requestLocalOllamaDiagnosis({ selectedLabels, tongueText, pulseText, freeText }) {
  const timeoutMs = 30000;

  try {
    const { response: tagsResponse } = await fetchLocalOllama("/api/tags", {}, 2500);
    if (!tagsResponse.ok) throw new Error(`Ollama tags HTTP ${tagsResponse.status}`);
    const tags = await tagsResponse.json();
    const models = Array.isArray(tags.models) ? tags.models : [];
    if (!models.length) {
      return {
        handled: true,
        message: buildLocalAiGuide("已检测到 Ollama，但还没有安装任何模型。")
      };
    }

    const preferred = models.find((item) => /tcm|deepseek|qwen|yi|llama|gemma|mistral/i.test(item.name)) || models[0];
    const modelName = preferred.name;
    const prompt = buildMedicalPrompt(selectedLabels, tongueText, pulseText, freeText);
    const { response: chatResponse } = await fetchLocalOllama("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.85,
          repeat_penalty: 1.25,
          repeat_last_n: 128,
          num_predict: 256,
          num_ctx: 2048
        },
        messages: [
          {
            role: "system",
            content: "你是中医+西医医学AI研究与教学助手。只用于教育和科研演示，不构成诊断或处方。必须提示危险信号需要线下就医。"
          },
          { role: "user", content: prompt }
        ]
      })
    }, timeoutMs);

    const rawText = await chatResponse.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(rawText.slice(0, 300) || "Ollama returned a non-JSON response");
    }
    if (!chatResponse.ok) throw new Error(data.error || `Ollama chat HTTP ${chatResponse.status}`);

    const content = data.message?.content || data.response || "";
    const quality = validateLocalAiOutput(content, selectedLabels);
    if (!quality.ok) {
      return {
        handled: true,
        message: state.lang === "zh"
          ? `本机 Ollama 模型返回质量不合格，已自动拦截。\n\n原因：${quality.reason}\n\n请以左侧“博士级 AI 推理引擎”的规则 + GraphRAG 结果为准；本地模型可换用 qwen2.5:7b-instruct、qwen3:8b 或其他指令模型后再试。`
          : `Local Ollama output was blocked by quality checks.\n\nReason: ${quality.reason}\n\nUse the local rule + GraphRAG result on the left, or switch to a stronger instruction model.`
      };
    }
    return {
      handled: true,
      message: state.lang === "zh"
        ? `本机 Ollama 模型返回（${modelName}）：\n\n${content || "模型没有返回内容。"}`
        : `Local Ollama model response (${modelName}):\n\n${content || "The model returned no content."}`
    };
  } catch (error) {
    const message = String(error.message || error);
    const likelyCors = message.includes("Failed to fetch") || message.includes("NetworkError");
    return {
      handled: true,
      message: buildLocalAiGuide(likelyCors
        ? "未检测到可用的本机 Ollama，或浏览器被 CORS 拦截。"
        : `本机 Ollama 暂不可用：${message}`)
    };
  }
}

function buildMedicalPrompt(selectedLabels, tongueText, pulseText, freeText) {
  const hasRedFlag = selectedLabels.some((label) => /胸痛|黑便|咯血|吐血|尿血|出血|昏迷|抽搐|呼吸困难|偏瘫|剧烈头痛|高热/.test(label))
    || /胸痛|黑便|咯血|吐血|尿血|出血|昏迷|抽搐|呼吸困难|偏瘫|剧烈头痛|高热/.test(freeText || "");
  return `请根据以下资料做中医+西医教学推理：
症状：${selectedLabels.join("、") || "未选择"}
舌象：${tongueText}
脉象：${pulseText}
自由描述：${freeText || "无"}

硬性要求：
- 不要编造不存在的方剂组成。
- 不要重复同一个药物或同一句话。
- 方剂最多推荐 2 个，并说明“适用条件/禁忌”，不得输出长药物清单。
- 如果有黑便、吐血、咯血、胸痛、呼吸困难、偏瘫、昏迷、抽搐、持续高热等危险信号，必须优先建议线下急诊/专科评估，不得给具体处方。
- 输出总字数控制在 500 字以内。
${hasRedFlag ? "- 当前资料含危险信号：请不要推荐具体处方，只能给安全分流、鉴别方向和补问要点。\n" : ""}
请按结构输出：
1. 安全风险分级：低/中/高，列出需立即就医的危险信号
2. 中医辨证：可能证型、证据、病机，不要和已选症状矛盾
3. 西医鉴别：需要排除的常见方向
4. 方剂思路：推荐方剂、适用范围、禁忌提醒，不给绝对处方
5. 加减思路：根据症状说明加减方向
6. 预防调护：生活方式、复诊和检查建议
7. 不确定性：还需要补问什么`;
}

function validateLocalAiOutput(content, selectedLabels = []) {
  const text = String(content || "").trim();
  if (!text) return { ok: false, reason: "模型没有返回内容" };
  if (text.length > 1800) return { ok: false, reason: "输出过长，可能已经跑偏" };

  const repeatedHerb = text.match(/([\u4e00-\u9fa5]{1,4})(、\1){3,}/);
  if (repeatedHerb) return { ok: false, reason: `出现明显重复内容：${repeatedHerb[0].slice(0, 30)}` };

  const chunks = text.match(/[\u4e00-\u9fa5]{2,6}/g) || [];
  const counts = chunks.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  const repeated = Object.entries(counts).find(([word, count]) => count >= 10 && !["危险信号", "线下就医", "医学评估"].includes(word));
  if (repeated) return { ok: false, reason: `词语反复出现：${repeated[0]}` };

  const hasRedFlag = selectedLabels.some((label) => /胸痛|黑便|咯血|吐血|尿血|出血|昏迷|抽搐|呼吸困难|偏瘫|剧烈头痛|高热/.test(label));
  const suggestsFormula = /方剂包括|处方|剂量|每日|水煎|克|五味子汤|麻黄汤|桂枝汤|银翘散/.test(text);
  if (hasRedFlag && suggestsFormula && !/急诊|立即就医|线下|专科|排除/.test(text)) {
    return { ok: false, reason: "存在危险信号时仍给出具体方剂，安全性不足" };
  }
  return { ok: true, reason: "" };
}

function buildLocalAiGuide(reason) {
  if (state.lang !== "zh") {
    return `${reason}\n\nLocal AI setup:\n1. Install Ollama on this computer.\n2. Run: ollama pull qwen2.5:7b-instruct\n3. If CORS blocks this site, allow this domain in OLLAMA_ORIGINS and restart Ollama.\n\nThe local rule + GraphRAG result remains available above.`;
  }
  return `${reason}

本地 AI 使用方法：
1. 在使用者电脑安装 Ollama。
2. 先拉一个模型，例如：ollama pull qwen2.5:7b-instruct
3. 如果要使用你下载的 GGUF，可用 Ollama 创建本地模型，例如 Modelfile 写 FROM 你的 .gguf 文件路径。
4. 如果浏览器提示跨域拦截，需要给 Ollama 设置 OLLAMA_ORIGINS，允许本网站域名。

上方本地规则 + GraphRAG 结果仍然可用。`;
}

async function detectLocalAi() {
  const panel = document.querySelector(".local-ai-connect");
  const title = document.querySelector("#localAiTitle");
  const status = document.querySelector("#localAiStatus");
  if (!panel || !title || !status) return;

  panel.classList.remove("ready", "warning", "error");
  title.textContent = state.lang === "zh" ? "本地 AI 模型：正在检测..." : "Local AI model: checking...";
  status.textContent = state.lang === "zh"
    ? "请连接本机 Ollama 模型；连接成功后这里会显示已连接。"
    : "Connect a local Ollama model; this area will show connected when ready.";

  try {
    const { response, baseUrl } = await fetchLocalOllama("/api/tags", {}, 2500);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const models = Array.isArray(data.models) ? data.models : [];
    if (!models.length) {
      panel.classList.add("warning");
      title.textContent = state.lang === "zh" ? "本地 AI 模型：已发现 Ollama，但未安装模型" : "Local AI model: Ollama found, no models installed";
      status.textContent = state.lang === "zh"
        ? "请先在本机 Ollama 里添加一个模型。添加完成后点“重新检测”，网站会自动接入。"
        : "Add a model to local Ollama first. Then click Check again and the site will connect automatically.";
      return;
    }

    const names = models.map((item) => item.name).join("、");
    panel.classList.add("ready");
    title.textContent = state.lang === "zh" ? "本地 AI 模型：已连接" : "Local AI model: connected";
    status.textContent = state.lang === "zh"
      ? `已通过 ${baseUrl} 检测到 Ollama 模型：${names}。生成 AI 推理时会优先使用本机模型。`
      : `Detected Ollama models through ${baseUrl}: ${names}. AI reasoning will use local models first.`;
  } catch (error) {
    panel.classList.add("error");
    title.textContent = state.lang === "zh" ? "本地 AI 模型：未连接" : "Local AI model: not connected";
    status.textContent = state.lang === "zh"
      ? "Ollama 可能已启动，但浏览器访问被拦截。请允许本网站访问本机 Ollama，或重启 Ollama 后再点“重新检测”。"
      : "Ollama may be running, but browser access is blocked. Allow this site to access local Ollama, then check again.";
  }
}

function inspectLocalModelFile(event) {
  const file = event.target.files?.[0];
  const panel = document.querySelector(".local-ai-connect");
  const title = document.querySelector("#localAiTitle");
  const status = document.querySelector("#localAiStatus");
  if (!file || !panel || !title || !status) return;

  const sizeGb = file.size / 1024 / 1024 / 1024;
  panel.classList.remove("ready", "warning", "error");
  if (!file.name.toLowerCase().endsWith(".gguf")) {
    panel.classList.add("error");
    title.textContent = "本地 AI 模型：文件格式不对";
    status.textContent = `已选择：${file.name}。请选择 .gguf 模型文件。文件检查只用于提示，真正运行需要本机 Ollama 模型。`;
    return;
  }

  panel.classList.add(sizeGb >= 0.5 ? "warning" : "error");
  title.textContent = "本地 AI 模型：已检查 GGUF 文件";
  status.textContent = sizeGb >= 0.5
    ? `已选择：${file.name}，约 ${sizeGb.toFixed(2)} GB。请把这个文件添加到本机 Ollama；添加完成后点“重新检测”，首页会显示已连接。`
    : `已选择：${file.name}，只有 ${Math.max(1, Math.round(file.size / 1024))} KB，可能不是完整模型文件，而是下载指针或损坏文件。`;
}

async function testLocalAiModel() {
  const panel = document.querySelector(".local-ai-connect");
  const title = document.querySelector("#localAiTitle");
  const status = document.querySelector("#localAiStatus");
  if (!panel || !title || !status) return;

  panel.classList.remove("ready", "warning", "error");
  title.textContent = "本地 AI 模型：正在测试...";
  status.textContent = "正在向本机 Ollama 发送一个短测试请求。";

  try {
    const { response: tagsResponse, baseUrl } = await fetchLocalOllama("/api/tags", {}, 3000);
    if (!tagsResponse.ok) throw new Error(`Ollama 服务返回 HTTP ${tagsResponse.status}`);
    const tags = await tagsResponse.json();
    const models = Array.isArray(tags.models) ? tags.models : [];
    if (!models.length) {
      panel.classList.add("warning");
      title.textContent = "本地 AI 模型：Ollama 已启动，但没有模型";
      status.textContent = "请先在 Ollama 添加一个模型，然后再测试。";
      return;
    }

    const modelName = (models.find((item) => /tcm|deepseek|qwen|yi|llama|gemma|mistral/i.test(item.name)) || models[0]).name;
    const { response: chatResponse } = await fetchLocalOllama("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        stream: false,
        options: { num_predict: 64, temperature: 0.1 },
        messages: [
          { role: "user", content: "请用一句中文回答：本地医学AI模型连接测试成功。" }
        ]
      })
    }, 20000);

    const rawText = await chatResponse.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(rawText.slice(0, 200) || "Ollama 返回内容无法解析");
    }
    if (!chatResponse.ok) throw new Error(data.error || `Ollama 测试 HTTP ${chatResponse.status}`);

    panel.classList.add("ready");
    title.textContent = "本地 AI 模型：测试成功";
    status.textContent = `已通过 ${baseUrl} 连接并测试模型：${modelName}。返回：${data.message?.content || data.response || "测试成功"}`;
  } catch (error) {
    panel.classList.add("error");
    title.textContent = "本地 AI 模型：测试失败";
    status.textContent = `没有完成本机模型测试：${error.message || error}。如果 Ollama 已启动，请设置 OLLAMA_ORIGINS 允许本网站，然后完全退出并重启 Ollama。`;
  }
}

function showLocalAiHelp() {
  const panel = document.querySelector(".local-ai-connect");
  const title = document.querySelector("#localAiTitle");
  const status = document.querySelector("#localAiStatus");
  if (!panel || !title || !status) return;

  panel.classList.remove("ready", "warning", "error");
  panel.classList.add("warning");
  title.textContent = "本地 AI 模型：连接说明";
  status.textContent = "连接顺序：1. 先打开电脑里的 Ollama 程序；2. 在 Ollama 里添加模型；3. 如果网页测试 Failed to fetch，请设置 OLLAMA_ORIGINS=https://medical-ai-research-platform-v6.vercel.app 后完全退出并重启 Ollama；4. 回本网页点“重新检测”和“测试本地模型”。";
}

async function initSupabase() {
  const config = window.SUPABASE_CONFIG || {};
  const isConfigured = config.url?.startsWith("https://") && config.anonKey?.length > 30;
  if (!isConfigured) return;
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    state.supabase = createClient(config.url, config.anonKey);
  } catch (error) {
    state.supabase = null;
    state.remoteReady = false;
    console.warn("Supabase SDK load failed:", error);
  }
}

async function loadDatabase() {
  const fallback = {
    visits: [
      {
        id: "V20260629-001",
        name: "张明",
        age: 36,
        department: "中医内科",
        doctor: "李医生",
        complaint: "头痛三天，睡眠差。",
        status: "waiting",
        risk: "moderate",
        createdAt: "2026-06-29 09:20"
      }
    ],
    records: [],
    audit: ["系统初始化：已载入演示挂号数据。"]
  };

  try {
    const raw = localStorage.getItem("medical-ai-v6-db");
    state.db = raw ? JSON.parse(raw) : fallback;
  } catch {
    state.db = fallback;
  }

  if (state.supabase) {
    await initAuthSession();
    await loadRemoteDatabase();
  }
}

async function initAuthSession() {
  const { data } = await state.supabase.auth.getSession();
  state.authUser = data.session?.user || null;
  if (state.authUser) await loadUserProfile();
  state.supabase.auth.onAuthStateChange(async (_event, session) => {
    state.authUser = session?.user || null;
    state.profile = null;
    if (state.authUser) await loadUserProfile();
    renderRole();
    renderDatabase();
  });
}

async function loadUserProfile() {
  if (!state.supabase || !state.authUser) return;
  const { data, error } = await state.supabase
    .from("clinic_users")
    .select("id, email, display_name, role")
    .eq("auth_user_id", state.authUser.id)
    .maybeSingle();

  if (error) {
    addAudit(`读取账号角色失败：${error.message}`);
    return;
  }

  state.profile = data;
  if (data?.role) state.role = data.role;
}

async function redeemInviteCode(inviteCode, displayName) {
  if (!state.supabase || !state.authUser) return;
  const email = state.authUser.email || document.querySelector("#authEmail")?.value.trim();
  const { data, error } = await state.supabase.rpc("redeem_invite_code", {
    p_code: inviteCode,
    p_auth_user_id: state.authUser.id,
    p_email: email,
    p_display_name: displayName || email?.split("@")[0] || "Medical AI User"
  });

  if (error) throw error;
  state.profile = Array.isArray(data) ? data[0] : data;
  if (state.profile?.role) state.role = state.profile.role;
}

async function signUp() {
  if (!state.supabase) {
    alert(state.lang === "zh" ? "请先配置 Supabase。" : "Please configure Supabase first.");
    return;
  }

  const email = document.querySelector("#authEmail").value.trim();
  const password = document.querySelector("#authPassword").value;
  const displayName = document.querySelector("#displayName").value.trim();
  const inviteCode = document.querySelector("#inviteCode").value.trim();
  if (!inviteCode) {
    alert(state.lang === "zh" ? "注册必须填写管理员分配的注册码。" : "Registration requires an admin-issued invite code.");
    return;
  }
  const { data, error } = await state.supabase.auth.signUp({ email, password });
  if (error) {
    alert(error.message);
    return;
  }

  state.authUser = data.user || null;
  if (data.session && state.authUser) {
    try {
      await redeemInviteCode(inviteCode, displayName);
      addAudit(`注册码注册账号：${email} (${state.profile?.role || "unknown"})`);
    } catch (profileError) {
      alert(`Profile error: ${profileError.message}`);
    }
  } else {
    alert(state.lang === "zh" ? "注册成功，请按 Supabase 邮件设置完成确认后再登录。" : "Signup succeeded. Confirm the Supabase email before logging in.");
  }
  renderRole();
  renderDatabase();
}

async function signIn() {
  if (!state.supabase) {
    alert(state.lang === "zh" ? "请先配置 Supabase。" : "Please configure Supabase first.");
    return;
  }

  const loginName = document.querySelector("#authEmail").value.trim();
  const password = document.querySelector("#authPassword").value;
  const appLogin = await state.supabase.rpc("app_login", {
    p_login_name: loginName,
    p_password: password
  });

  if (!appLogin.error && appLogin.data?.length) {
    const profile = appLogin.data[0];
    state.currentPassword = password;
    state.authUser = { id: profile.id, email: profile.login_name };
    state.profile = {
      id: profile.id,
      email: profile.login_name,
      display_name: profile.display_name,
      role: profile.role,
      expires_at: profile.expires_at,
      days_remaining: profile.days_remaining
    };
    state.role = profile.role;
    if (profile.role === "admin") {
      const adminSession = JSON.stringify({
        login_name: profile.login_name,
        display_name: profile.display_name,
        role: profile.role,
        password
      });
      sessionStorage.setItem("medical-ai-v6-admin-session", adminSession);
      localStorage.setItem("medical-ai-v6-admin-session", adminSession);
    }
    addAudit(`账号登录：${profile.login_name}`);
    renderRole();
    renderDatabase();
    return;
  }

  const email = loginName;
  const { data, error } = await state.supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert(error.message);
    return;
  }

  state.authUser = data.user;
  state.currentPassword = password;
  await loadUserProfile();
  if (!state.profile) {
    alert(state.lang === "zh" ? "此账号没有角色资料，请联系管理员分配注册码。" : "This account has no role profile. Ask an administrator for an invite code.");
  }
  addAudit(`账号登录：${email}`);
  renderRole();
  renderDatabase();
}

async function signOut() {
  if (state.supabase && state.authUser?.email?.includes("@")) {
    await state.supabase.auth.signOut();
  }
  state.authUser = null;
  state.profile = null;
  state.currentPassword = "";
  sessionStorage.removeItem("medical-ai-v6-admin-session");
  localStorage.removeItem("medical-ai-v6-admin-session");
  addAudit("账号退出");
  renderRole();
  renderDatabase();
}

function saveDatabase() {
  localStorage.setItem("medical-ai-v6-db", JSON.stringify(state.db));
}

async function loadRemoteDatabase() {
  const [visitsResult, recordsResult, auditResult] = await Promise.all([
    state.supabase
      .from("outpatient_visits")
      .select("id, visit_no, department, doctor_name, chief_complaint, status, risk_level, created_at, patients(name, age)")
      .order("created_at", { ascending: false })
      .limit(20),
    state.supabase
      .from("medical_records")
      .select("id, symptoms, tongue_sign, pulse_sign, tcm_diagnosis, western_diagnosis, formula, confidence, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    state.supabase
      .from("admin_audit_logs")
      .select("action, created_at")
      .order("created_at", { ascending: false })
      .limit(6)
  ]);

  if (visitsResult.error || recordsResult.error || auditResult.error) {
    addAudit(`Supabase 读取失败：${visitsResult.error?.message || recordsResult.error?.message || auditResult.error?.message}`);
    state.remoteReady = false;
    return;
  }

  state.db.visits = visitsResult.data.map((row) => ({
    id: row.visit_no,
    supabaseId: row.id,
    name: row.patients?.name || "未命名",
    age: row.patients?.age || "",
    department: row.department,
    doctor: row.doctor_name,
    complaint: row.chief_complaint || "",
    status: row.status,
    risk: row.risk_level,
    createdAt: row.created_at
  }));

  state.db.records = recordsResult.data.map((row) => ({
    id: row.id,
    symptoms: row.symptoms || [],
    tongue: row.tongue_sign,
    pulse: row.pulse_sign,
    tcmDiagnosis: row.tcm_diagnosis,
    westernDiagnosis: row.western_diagnosis,
    formula: row.formula,
    confidence: row.confidence,
    createdAt: row.created_at
  }));

  state.db.audit = auditResult.data.map((row) => `${row.created_at} ${row.action}`);
  state.remoteReady = true;
  saveDatabase();
}

async function syncVisitToSupabase(visit) {
  if (!state.supabase) return;

  const patientResult = await state.supabase
    .from("patients")
    .insert({ name: visit.name, age: visit.age })
    .select("id")
    .single();

  if (patientResult.error) throw patientResult.error;

  const visitResult = await state.supabase
    .from("outpatient_visits")
    .insert({
      visit_no: visit.id,
      patient_id: patientResult.data.id,
      department: visit.department,
      doctor_name: visit.doctor,
      chief_complaint: visit.complaint,
      status: visit.status,
      risk_level: visit.risk
    })
    .select("id")
    .single();

  if (visitResult.error) throw visitResult.error;

  visit.supabaseId = visitResult.data.id;
  await syncAuditToSupabase(`新增挂号：${visit.id} ${visit.name}`, { visit_no: visit.id });
  state.remoteReady = true;
}

async function syncRecordToSupabase(record) {
  if (!state.supabase) return;

  const latestVisit = state.db.visits.find((visit) => visit.id === record.visitId);
  const recordResult = await state.supabase
    .from("medical_records")
    .insert({
      visit_id: latestVisit?.supabaseId || null,
      symptoms: record.symptoms,
      tongue_sign: record.tongue,
      pulse_sign: record.pulse,
      tcm_diagnosis: record.tcmDiagnosis,
      western_diagnosis: record.westernDiagnosis,
      formula: record.formula,
      confidence: Number(record.confidence),
      graph_path: []
    });

  if (recordResult.error) throw recordResult.error;
  await syncAuditToSupabase(`病例归档：${record.id} ${record.tcmDiagnosis}`, { record_id: record.id });
  state.remoteReady = true;
}

async function syncVisitStatusToSupabase(visit) {
  if (!state.supabase || !visit.supabaseId) return;
  const result = await state.supabase
    .from("outpatient_visits")
    .update({ status: visit.status })
    .eq("id", visit.supabaseId);

  if (result.error) throw result.error;
  await syncAuditToSupabase(`更新就诊状态：${visit.id} ${visit.status}`, { visit_no: visit.id, status: visit.status });
}

async function createInviteCode() {
  if (!hasRole("admin")) {
    alert(state.lang === "zh" ? "仅管理员可以创建人员账号。" : "Only administrators can create staff accounts.");
    return;
  }
  const displayName = document.querySelector("#inviteName").value.trim() || "New staff";
  const loginName = document.querySelector("#staffLoginName").value.trim();
  const password = document.querySelector("#staffPassword").value.trim();
  const role = document.querySelector("#inviteRole").value;
  const validDays = Number(document.querySelector("#validDays").value || 30);

  if (!loginName || password.length < 6) {
    alert(state.lang === "zh" ? "请填写登录名，并设置至少 6 位初始密码。" : "Enter a login name and an initial password of at least 6 characters.");
    return;
  }

  if (state.supabase) {
    const { error } = await state.supabase.rpc("admin_create_app_user", {
      p_admin_login_name: state.profile?.email,
      p_admin_password: state.currentPassword,
      p_login_name: loginName,
      p_password: password,
      p_display_name: displayName,
      p_role: role,
      p_valid_days: validDays
    });
    if (error) {
      alert(error.message);
      return;
    }
  }

  addAudit(`创建人员账号：${displayName} ${role} ${validDays}天`);
  saveDatabase();
  renderDatabase();
}

async function deleteVisit(id) {
  if (!hasRole("admin")) {
    alert(state.lang === "zh" ? "仅管理员可以删除记录。" : "Only administrators can delete records.");
    return;
  }

  const password = document.querySelector("#deletePassword").value;
  if (!password) {
    alert(state.lang === "zh" ? "请输入删除专用密码。" : "Enter the deletion password.");
    return;
  }

  const visit = state.db.visits.find((item) => item.id === id);
  if (!visit) return;
  if (!confirm(state.lang === "zh" ? `确认删除 ${visit.id}？删除前请先导出备份。` : `Delete ${visit.id}? Export a backup first.`)) return;

  if (state.supabase && visit.supabaseId) {
    const { error } = await state.supabase.rpc("delete_outpatient_visit_with_password", {
      p_visit_id: visit.supabaseId,
      p_delete_password: password
    });
    if (error) {
      alert(error.message);
      return;
    }
  }

  state.db.visits = state.db.visits.filter((item) => item.id !== id);
  addAudit(`删除挂号记录：${visit.id}`);
  saveDatabase();
  renderDatabase();
}

async function syncAuditToSupabase(action, payload = {}) {
  if (!state.supabase) return;
  const result = await state.supabase
    .from("admin_audit_logs")
    .insert({ action, payload });
  if (result.error) throw result.error;
}

function addAudit(message) {
  const time = new Date().toLocaleString("zh-CN", { hour12: false });
  state.db.audit.unshift(`${time} ${message}`);
  state.db.audit = state.db.audit.slice(0, 6);
}

async function createVisit(event) {
  event.preventDefault();
  if (!hasRole("doctor", "admin")) {
    alert(state.lang === "zh" ? "当前角色不能新增挂号。" : "Current role cannot create visits.");
    return;
  }
  const visit = {
    id: `V${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(state.db.visits.length + 1).padStart(3, "0")}`,
    name: document.querySelector("#patientName").value.trim(),
    age: Number(document.querySelector("#patientAge").value),
    department: document.querySelector("#department").value,
    doctor: document.querySelector("#doctor").value,
    complaint: document.querySelector("#chiefComplaint").value.trim() || document.querySelector("#freeText").value.trim() || "未填写",
    status: "waiting",
    risk: state.selectedSymptoms.has("chestPain") ? "high" : "moderate",
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false })
  };

  state.db.visits.unshift(visit);
  addAudit(`新增挂号：${visit.id} ${visit.name}`);
  try {
    await syncVisitToSupabase(visit);
  } catch (error) {
    addAudit(`Supabase 写入挂号失败：${error.message}`);
    state.remoteReady = false;
  }
  saveDatabase();
  renderDatabase();
  event.target.reset();
  document.querySelector("#patientAge").value = 36;
}

async function saveCurrentRecord() {
  if (!hasRole("doctor", "admin")) {
    alert(state.lang === "zh" ? "当前角色不能保存病例。" : "Current role cannot save records.");
    return;
  }
  const latestVisit = state.db.visits[0];
  const record = {
    id: `R${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(state.db.records.length + 1).padStart(3, "0")}`,
    visitId: latestVisit?.id || "manual-demo",
    patientName: latestVisit?.name || "未绑定患者",
    symptoms: [...state.selectedSymptoms],
    tongue: document.querySelector("#tongueSelect").value,
    pulse: document.querySelector("#pulseSelect").value,
    tcmDiagnosis: document.querySelector("#tcmDiagnosis").textContent,
    westernDiagnosis: document.querySelector("#westernDiagnosis").textContent,
    formula: document.querySelector("#formulaName").textContent,
    confidence: document.querySelector("#confidenceBadge").textContent,
    risk: state.selectedSymptoms.has("chestPain") ? "high" : "moderate",
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false })
  };

  state.db.records.unshift(record);
  addAudit(`病例归档：${record.id} ${record.tcmDiagnosis}`);
  try {
    await syncRecordToSupabase(record);
  } catch (error) {
    addAudit(`Supabase 写入病例失败：${error.message}`);
    state.remoteReady = false;
  }
  saveDatabase();
  renderDatabase();
}

function renderDatabase() {
  const list = document.querySelector("#visitList");
  if (list) {
    const rows = state.db.visits.slice(0, 5).map((visit) => `
      <article class="data-item">
        <strong>${visit.id} · ${visit.name} · ${visit.department}</strong>
        <span>${visit.doctor} · ${visit.status} · risk: ${visit.risk}</span>
        <small>${visit.complaint}</small>
        <div class="queue-actions">
          <button type="button" data-visit-status="${visit.id}|waiting">候诊</button>
          <button type="button" data-visit-status="${visit.id}|in_consult">接诊</button>
          <button type="button" data-visit-status="${visit.id}|done">完成</button>
          <button class="danger-action" type="button" data-delete-visit="${visit.id}">删除</button>
        </div>
      </article>
    `);
    list.innerHTML = rows.join("") || `<article class="data-item"><span>${state.lang === "zh" ? "暂无挂号记录" : "No visits yet"}</span></article>`;
    list.querySelectorAll("[data-visit-status]").forEach((button) => {
      button.disabled = !hasRole("doctor", "admin");
      button.addEventListener("click", async () => {
        const [id, status] = button.dataset.visitStatus.split("|");
        await updateVisitStatus(id, status);
      });
    });
    list.querySelectorAll("[data-delete-visit]").forEach((button) => {
      button.disabled = !hasRole("admin");
      button.addEventListener("click", async () => {
        await deleteVisit(button.dataset.deleteVisit);
      });
    });
  }

  const visitCount = document.querySelector("#visitCount");
  const recordCount = document.querySelector("#recordCount");
  const riskCount = document.querySelector("#riskCount");
  if (visitCount) visitCount.textContent = String(state.db.visits.length);
  if (recordCount) recordCount.textContent = String(state.db.records.length);
  if (riskCount) riskCount.textContent = String([...state.db.visits, ...state.db.records].filter((item) => item.risk === "high").length);

  const auditLog = document.querySelector("#auditLog");
  if (auditLog) auditLog.innerHTML = state.db.audit.map((item) => `<div>${item}</div>`).join("");

  const preview = document.querySelector("#databasePreview");
  if (preview) preview.value = JSON.stringify(state.db, null, 2);

  const status = document.querySelector("#dbStatus");
  if (status) {
    if (state.remoteReady) {
      status.textContent = state.lang === "zh" ? "Supabase 云数据库已连接" : "Supabase connected";
    } else if (state.supabase) {
      status.textContent = state.lang === "zh" ? "Supabase 待验证，本地备份已保存" : "Supabase pending, local backup saved";
    } else {
      status.textContent = state.lang === "zh" ? "本地数据库已保存" : "Local DB saved";
    }
  }
  applyPermissions();
}

async function updateVisitStatus(id, nextStatus) {
  if (!hasRole("doctor", "admin")) {
    alert(state.lang === "zh" ? "当前角色不能更新就诊状态。" : "Current role cannot update visit status.");
    return;
  }

  const visit = state.db.visits.find((item) => item.id === id);
  if (!visit) return;
  visit.status = nextStatus;
  addAudit(`更新就诊状态：${visit.id} ${nextStatus}`);
  try {
    await syncVisitStatusToSupabase(visit);
    state.remoteReady = true;
  } catch (error) {
    addAudit(`Supabase 更新状态失败：${error.message}`);
    state.remoteReady = false;
  }
  saveDatabase();
  renderDatabase();
}

function renderRole() {
  const roleText = {
    zh: {
      doctor: ["医生工作台", "可查看挂号、保存病例、生成 AI 诊断建议。"],
      student: ["学生学习台", "可使用考试模式、病例生成和双语解释训练辨证能力。"],
      admin: ["管理员后台", "可查看挂号统计、病例归档、风险提示和数据库导出。"]
    },
    en: {
      doctor: ["Doctor workspace", "Review visits, save records, and generate AI-assisted reasoning."],
      student: ["Student workspace", "Use quizzes, generated cases, and bilingual explanations for training."],
      admin: ["Admin console", "Monitor visits, archived records, risk flags, and database exports."]
    }
  };
  const [title, desc] = roleText[state.lang][state.role];
  const titleEl = document.querySelector("#activeRole");
  const descEl = document.querySelector("#roleDescription");
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  document.querySelectorAll("[data-role]").forEach((el) => {
    el.classList.toggle("active", el.dataset.role === state.role);
  });

  const status = document.querySelector("#authStatus");
  if (status) {
    if (state.authUser && state.profile) {
      status.textContent = state.lang === "zh"
        ? `已登录：${state.profile.display_name || state.profile.email} · ${state.profile.role}${state.profile.days_remaining != null ? ` · 剩余 ${state.profile.days_remaining} 天` : ""}`
        : `Signed in: ${state.profile.display_name || state.profile.email} · ${state.profile.role}${state.profile.days_remaining != null ? ` · ${state.profile.days_remaining} days left` : ""}`;
    } else if (state.authUser) {
      status.textContent = state.lang === "zh" ? "已登录，角色资料待创建" : "Signed in, profile pending";
    } else if (state.supabase) {
      status.textContent = state.lang === "zh" ? "Supabase Auth 已启用，当前未登录" : "Supabase Auth enabled, not signed in";
    } else {
      status.textContent = state.lang === "zh" ? "演示角色模式" : "Demo role mode";
    }
  }
  document.body.classList.toggle("admin-mode", state.role === "admin" && !!state.authUser);
  document.querySelector("#adminEntryButton")?.classList.toggle("visible", state.role === "admin" && !!state.authUser);
  document.querySelector("#githubButton")?.classList.toggle("visible", state.role === "admin" && !!state.authUser);
  applyPermissions();
}

async function openKnowledge(name, options = {}) {
  const formulaName = Object.keys(formulaKnowledge).find((key) => name.includes(key));
  const herbName = Object.keys(herbKnowledge).find((key) => name.includes(key));
  const normalized = formulaName || herbName || name;
  let item = formulaName ? formulaKnowledge[formulaName] : herbKnowledge[herbName];
  let itemType = formulaName ? "formula" : "herb";
  const popover = document.querySelector("#knowledgePopover");
  const title = document.querySelector("#knowledgeTitle");
  const body = document.querySelector("#knowledgeBody");
  const backButton = document.querySelector("#backKnowledgeButton");
  if (!popover || !title || !body) return;
  if (!options.fromHistory && !popover.hidden && title.textContent) {
    state.knowledgeStack.push({
      title: title.textContent,
      body: body.innerHTML
    });
  }
  title.textContent = formulaName ? (normalized || name) : `${normalized || name} 药材说明`;
  body.innerHTML = `<p>正在读取知识库...</p>`;
  popover.hidden = false;
  if (!item) {
    const remote = await fetchKnowledgeRecord(normalized || name, formulaName ? "formula" : "herb");
    if (remote) {
      item = remote.item;
      itemType = remote.type;
    }
  }
  if (!item) {
    body.innerHTML = `<p>后台尚未录入该方剂或中药说明。管理员可在方药知识库中补充。</p>`;
  } else if (itemType === "formula") {
    body.innerHTML = `
      <dl>
        <dt>出处</dt><dd>${item.source}</dd>
        <dt>组成</dt><dd>${renderKnowledgeLinks(item.composition)}</dd>
        <dt>用法用量</dt><dd>${item.usage}</dd>
        <dt>适用范围</dt><dd>${item.indications}</dd>
        <dt>加减应用</dt><dd>${item.modifications}</dd>
        <dt>现代说明</dt><dd>${item.modern}</dd>
      </dl>
    `;
  } else {
    body.innerHTML = `
      <dl>
        <dt>类别</dt><dd>${item.type}</dd>
        <dt>性味归经</dt><dd>${item.nature}</dd>
        <dt>中医功效</dt><dd>${item.actions}</dd>
        <dt>用法用量</dt><dd>${item.dosage}</dd>
        <dt>现代研究/西医应用方向</dt><dd>${item.western}</dd>
        <dt>安全提醒</dt><dd>${item.safety}</dd>
      </dl>
    `;
  }
  if (backButton) backButton.hidden = state.knowledgeStack.length === 0;
}

async function fetchKnowledgeRecord(name, preferredType = "herb") {
  if (!state.supabase || !name) return null;
  const cleanName = String(name).replace(/药材说明/g, "").trim();
  try {
    if (preferredType === "formula") {
      const { data, error } = await state.supabase
        .from("formulas")
        .select("name_cn,source,composition,usage,indications,modifications,modern_notes")
        .eq("name_cn", cleanName)
        .maybeSingle();
      if (!error && data) {
        return {
          type: "formula",
          item: {
            source: data.source || "后台知识库",
            composition: data.composition || "",
            usage: data.usage || data.dosage || "",
            indications: data.indications || "",
            modifications: data.modifications || "",
            modern: data.modern_notes || ""
          }
        };
      }
    }
    const { data, error } = await state.supabase
      .from("herbs")
      .select("name_cn,name_en,nature_flavor,meridians,functions,dosage,cautions,modern_notes")
      .eq("name_cn", cleanName)
      .maybeSingle();
    if (error || !data) return null;
    return {
      type: "herb",
      item: {
        type: data.name_en ? `中药材 / ${data.name_en}` : "中药材",
        nature: `${data.nature_flavor || "待补充"}；归经：${data.meridians || "待补充"}`,
        actions: data.functions || "待补充",
        dosage: data.dosage || "需医师辨证决定",
        western: data.modern_notes || "待补充",
        safety: data.cautions || "孕期、儿童、肝肾功能异常及合并用药者需专业评估"
      }
    };
  } catch {
    return null;
  }
}

function backKnowledge() {
  const previous = state.knowledgeStack.pop();
  const backButton = document.querySelector("#backKnowledgeButton");
  if (!previous) {
    if (backButton) backButton.hidden = true;
    return;
  }
  document.querySelector("#knowledgeTitle").textContent = previous.title;
  document.querySelector("#knowledgeBody").innerHTML = previous.body;
  if (backButton) backButton.hidden = state.knowledgeStack.length === 0;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderKnowledgeLinks(text) {
  const raw = String(text ?? "");
  if (!raw) return "";
  const terms = [...new Set([
    ...Object.keys(formulaKnowledge),
    ...Object.keys(herbKnowledge)
  ])]
    .filter((term) => raw.includes(term))
    .sort((a, b) => b.length - a.length);
  if (!terms.length) return escapeHtml(raw).replace(/\n/g, "<br>");

  let html = "";
  let index = 0;
  while (index < raw.length) {
    let match = null;
    let matchIndex = raw.length;
    for (const term of terms) {
      const found = raw.indexOf(term, index);
      if (found !== -1 && (found < matchIndex || (found === matchIndex && term.length > (match?.length || 0)))) {
        match = term;
        matchIndex = found;
      }
    }
    if (!match) {
      html += escapeHtml(raw.slice(index));
      break;
    }
    html += escapeHtml(raw.slice(index, matchIndex));
    html += `<button class="knowledge-link" type="button" data-knowledge="${escapeHtml(match)}">${escapeHtml(match)}</button>`;
    index = matchIndex + match.length;
  }
  return html.replace(/\n/g, "<br>");
}

function resetDemoData() {
  if (!confirm(state.lang === "zh" ? "确认重置演示数据？" : "Reset demo data?")) return;
  localStorage.removeItem("medical-ai-v6-db");
  loadDatabase();
  renderDatabase();
}

function renderGraph(profile = "liver") {
  const canvas = document.querySelector("#graphCanvas");
  canvas.innerHTML = "";
  const nodes = graphSets[profile] || graphSets.undifferentiated || graphSets.heartSpleen;
  const edges = [[0, 2], [1, 2], [2, 3]];

  edges.forEach(([from, to]) => {
    const a = nodes[from];
    const b = nodes[to];
    const x1 = a[2] + 42;
    const y1 = a[3] + 18;
    const x2 = b[2] + 42;
    const y2 = b[3] + 18;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const edge = document.createElement("span");
    edge.className = "edge";
    edge.style.left = `${x1}px`;
    edge.style.top = `${y1}px`;
    edge.style.width = `${length}px`;
    edge.style.transform = `rotate(${angle}deg)`;
    canvas.appendChild(edge);
  });

  nodes.forEach(([zh, en, left, top, primary]) => {
    const node = document.createElement("div");
    node.className = `node ${primary ? "primary" : ""}`;
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;
    node.textContent = state.lang === "zh" ? zh : en;
    canvas.appendChild(node);
  });
}

document.querySelector("#langToggle").addEventListener("click", () => {
  state.lang = state.lang === "zh" ? "en" : "zh";
  applyLanguage();
  analyze();
});

document.querySelectorAll("[data-input-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    state.inputLang = button.dataset.inputLang;
    document.querySelectorAll("[data-input-lang]").forEach((el) => el.classList.toggle("active", el === button));
    renderSymptoms();
  });
});

document.querySelector("#diagnosisForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.authUser && !hasRole("doctor", "admin")) {
    alert(state.lang === "zh" ? "学生身份不能使用 AI 推理。" : "Student role cannot use AI reasoning.");
    return;
  }
  analyze();
  requestHuggingFaceDiagnosis();
});

document.querySelector("#caseButton")?.addEventListener("click", () => {
  const item = cases[Math.floor(Math.random() * cases.length)];
  document.querySelector("#caseText").textContent = item[state.lang];
});

document.querySelector("#examButton")?.addEventListener("click", () => {
  document.querySelector("#examText").textContent = state.lang === "zh"
    ? "题目：头痛 + 舌红 + 弦脉，最可能的证型？选项：肝阳上亢 / 气虚证 / 风寒表证。"
    : "Quiz: Headache + red tongue + wiry pulse. Most likely pattern? Options: Liver Yang / Qi deficiency / wind-cold exterior.";
});

document.querySelector("#registrationForm")?.addEventListener("submit", createVisit);
document.querySelector("#saveRecordButton")?.addEventListener("click", saveCurrentRecord);
document.querySelector("#signupButton")?.addEventListener("click", signUp);
document.querySelector("#loginButton")?.addEventListener("click", signIn);
document.querySelector("#logoutButton")?.addEventListener("click", signOut);
document.querySelector("#checkLocalAiButton")?.addEventListener("click", detectLocalAi);
document.querySelector("#testLocalAiButton")?.addEventListener("click", testLocalAiModel);
document.querySelector("#localAiHelpButton")?.addEventListener("click", showLocalAiHelp);
document.querySelector("#localModelFile")?.addEventListener("change", inspectLocalModelFile);
document.querySelector("#createInviteButton")?.addEventListener("click", createInviteCode);
document.querySelector("#formulaName")?.addEventListener("click", (event) => {
  const target = event.target.closest("[data-knowledge]");
  if (target) openKnowledge(target.dataset.knowledge || target.textContent || "");
});
document.querySelector("#formulaDetail")?.addEventListener("click", (event) => {
  const target = event.target.closest("[data-knowledge]");
  if (target) openKnowledge(target.dataset.knowledge || target.textContent || "");
});
document.querySelector("#knowledgeBody")?.addEventListener("click", (event) => {
  const target = event.target.closest("[data-knowledge]");
  if (target) openKnowledge(target.dataset.knowledge || target.textContent || "");
});
document.querySelector("#backKnowledgeButton")?.addEventListener("click", backKnowledge);
document.querySelector("#closeKnowledgeButton")?.addEventListener("click", () => {
  state.knowledgeStack = [];
  document.querySelector("#backKnowledgeButton").hidden = true;
  document.querySelector("#knowledgePopover").hidden = true;
});
document.querySelector("#clearSelectionButton")?.addEventListener("click", () => {
  state.selectedSymptoms.clear();
  renderSymptoms();
  analyze();
});
document.querySelector("#exportButton")?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state.db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "medical-ai-v6-database.json";
  link.click();
  URL.revokeObjectURL(url);
});
document.querySelector("#resetButton")?.addEventListener("click", resetDemoData);
document.querySelectorAll("[data-role]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.authUser) {
      alert(state.lang === "zh" ? "登录后角色由管理员注册码决定，不能手动切换。" : "After login, role is assigned by admin invite code and cannot be switched manually.");
      renderRole();
      return;
    }
    state.role = button.dataset.role;
    document.querySelectorAll("[data-role]").forEach((el) => el.classList.toggle("active", el === button));
    renderRole();
  });
});

document.querySelector("#tongueImage").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  document.querySelector(".upload-zone small").textContent = state.lang === "zh"
    ? `已载入：${file.name}。模拟舌诊：舌红，置信度 0.83。`
    : `Loaded: ${file.name}. Simulated tongue vision: red tongue, confidence 0.83.`;
});

await initSupabase();
await loadDatabase();
applyLanguage();
analyze();
detectLocalAi();
