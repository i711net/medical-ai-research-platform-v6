const state = {
  lang: "zh",
  inputLang: "zh",
  selectedSymptoms: new Set(["headache", "insomnia"]),
  role: "doctor",
  lastProfile: "liver",
  supabase: null,
  remoteReady: false,
  authUser: null,
  profile: null,
  currentPassword: "",
  db: {
    visits: [],
    records: [],
    audit: []
  }
};

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
    aiModelOutput: "Hugging Face AI 模型输出",
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
    aiModelOutput: "Hugging Face AI model output",
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

const symptomOptions = [
  { id: "headache", zh: "头痛", en: "Headache" },
  { id: "frontalHeadache", zh: "前头痛", en: "Frontal headache" },
  { id: "occipitalHeadache", zh: "后头痛", en: "Occipital headache" },
  { id: "temporalHeadache", zh: "两侧头痛", en: "Temporal headache" },
  { id: "vertexHeadache", zh: "巅顶痛", en: "Vertex headache" },
  { id: "bitter", zh: "口苦", en: "Bitter taste" },
  { id: "fever", zh: "发热", en: "Fever" },
  { id: "chills", zh: "恶寒", en: "Chills" },
  { id: "alternatingChillsFever", zh: "寒热往来", en: "Alternating chills and fever" },
  { id: "cough", zh: "咳嗽", en: "Cough" },
  { id: "phlegm", zh: "咳痰", en: "Phlegm" },
  { id: "wheezing", zh: "喘促", en: "Wheezing" },
  { id: "chestPain", zh: "胸痛", en: "Chest pain" },
  { id: "chestTightness", zh: "胸闷", en: "Chest tightness" },
  { id: "palpitation", zh: "心悸", en: "Palpitation" },
  { id: "fatigue", zh: "乏力", en: "Fatigue" },
  { id: "insomnia", zh: "失眠", en: "Insomnia" },
  { id: "dreaminess", zh: "多梦", en: "Vivid dreams" },
  { id: "dizziness", zh: "眩晕", en: "Dizziness" },
  { id: "nausea", zh: "恶心", en: "Nausea" },
  { id: "poorAppetite", zh: "纳差", en: "Poor appetite" },
  { id: "looseStool", zh: "便溏", en: "Loose stool" },
  { id: "constipation", zh: "便秘", en: "Constipation" },
  { id: "edema", zh: "水肿", en: "Edema" },
  { id: "nightSweat", zh: "盗汗", en: "Night sweating" }
];

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
  "川芎茶调散": {
    source: "《太平惠民和剂局方》",
    composition: "川芎、白芷、羌活、细辛、防风、荆芥、薄荷、甘草、茶清",
    usage: "教学资料示例。现代临床对细辛等药需严格遵循规范和医嘱。",
    indications: "外感风邪头痛，或偏正头痛、恶寒发热等。",
    modifications: "风寒重加辛温解表；风热明显需调整清疏；久痛夹瘀可酌加活血。",
    modern: "需注意传统方中个别药物的现代安全规范，必要时由医师选择替代方案。"
  }
};

const graphSets = {
  liver: [
    ["头痛", "Headache", 24, 36, true],
    ["舌红", "Red tongue", 168, 28, false],
    ["肝阳上亢", "Liver Yang", 106, 118, true],
    ["天麻钩藤饮", "Formula", 206, 190, false]
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
  symptomOptions.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${state.selectedSymptoms.has(item.id) ? "active" : ""}`;
    button.textContent = state.inputLang === "zh" ? item.zh : item.en;
    button.addEventListener("click", () => {
      state.selectedSymptoms.has(item.id)
        ? state.selectedSymptoms.delete(item.id)
        : state.selectedSymptoms.add(item.id);
      renderSymptoms();
    });
    box.appendChild(button);
  });
}

function analyze() {
  const selected = state.selectedSymptoms;
  const tongue = document.querySelector("#tongueSelect").value;
  const pulse = document.querySelector("#pulseSelect").value;
  const freeText = document.querySelector("#freeText").value || "";
  const mentions = (terms) => terms.some((term) => freeText.toLowerCase().includes(term.toLowerCase()));

  let profile = "liver";
  if (selected.has("fever") || selected.has("cough") || selected.has("occipitalHeadache") || mentions(["发热", "咳嗽", "后头痛", "恶寒", "fever", "cough"])) profile = "exterior";
  if (selected.has("fatigue") || selected.has("poorAppetite") || selected.has("looseStool") || tongue === "pale" || pulse === "deep" || mentions(["乏力", "纳差", "便溏", "fatigue"])) profile = "qi";
  if (selected.has("chestPain") || selected.has("chestTightness") || mentions(["胸痛", "胸闷", "chest pain"])) profile = "liver";
  state.lastProfile = profile;

  const zhResults = {
    liver: ["肝阳上亢", "头痛、舌红、弦脉与睡眠压力因素共同提示肝阳偏亢，治以平肝潜阳。", "需关注血压、紧张型头痛或偏头痛鉴别。若突发剧烈头痛需立即就医。", "天麻钩藤饮 / Gastrodia and Uncaria Decoction", "天麻、钩藤、石决明、牛膝。教学演示建议，不构成处方。"],
    exterior: ["太阳表证", "发热、咳嗽或后头痛偏向外感表证，治以疏风解表。", "考虑上呼吸道感染或流感样症状。高热、呼吸困难需就医。", "川芎茶调散 / Chuan Xiong Cha Tiao San", "川芎、白芷、荆芥、防风。用于教学推理路径展示。"],
    qi: ["气虚证", "乏力、舌淡、沉脉提示气虚，治以益气健脾。", "考虑疲劳综合、贫血、甲状腺或睡眠问题，建议结合检查。", "四君子汤 / Si Jun Zi Tang", "人参、白术、茯苓、甘草。仅用于教育演示。"]
  };

  const enResults = {
    liver: ["Liver Yang Hyperactivity", "Headache, red tongue, wiry pulse, and stress-related sleep disturbance suggest an upward Liver Yang pattern.", "Monitor blood pressure and differentiate tension-type headache or migraine. Seek urgent care for sudden severe headache.", "Gastrodia and Uncaria Decoction / 天麻钩藤饮", "Gastrodia, Uncaria, Haliotis shell, Achyranthes. Research demo only, not a prescription."],
    exterior: ["Taiyang Exterior Pattern", "Fever, cough, or occipital headache suggests an exterior wind-cold/wind pattern.", "Consider upper respiratory infection or flu-like illness. Seek care for high fever or breathing difficulty.", "Chuan Xiong Cha Tiao San / 川芎茶调散", "Chuanxiong, Angelica dahurica, Schizonepeta, Saposhnikovia. Education demo only."],
    qi: ["Qi Deficiency Pattern", "Fatigue, pale tongue, and deep pulse suggest Qi deficiency; reasoning focuses on tonifying Qi and spleen support.", "Consider anemia, thyroid issues, sleep problems, or chronic fatigue; pair with clinical tests.", "Si Jun Zi Tang / 四君子汤", "Ginseng, Atractylodes, Poria, Licorice. Education demo only."]
  };

  const data = state.lang === "zh" ? zhResults[profile] : enResults[profile];
  document.querySelector("#tcmDiagnosis").textContent = data[0];
  document.querySelector("#pathogenesis").textContent = data[1];
  document.querySelector("#westernDiagnosis").textContent = data[2];
  document.querySelector("#riskText").textContent = selected.has("chestPain")
    ? state.lang === "zh"
      ? "Risk level: high. 胸痛请优先排查心血管急症。"
      : "Risk level: high. Chest pain requires urgent cardiovascular screening."
    : state.lang === "zh"
      ? "Risk level: moderate. 本系统仅用于研究与教学。"
      : "Risk level: moderate. This system is for research and education only.";
  document.querySelector("#formulaName").textContent = data[3];
  document.querySelector("#formulaDetail").textContent = data[4];

  const confidence = profile === "liver" ? 0.87 : profile === "exterior" ? 0.82 : 0.79;
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
  const tongueText = document.querySelector("#tongueSelect").selectedOptions[0]?.textContent?.split("/")[0]?.trim() || "舌红";
  const pulseText = document.querySelector("#pulseSelect").selectedOptions[0]?.textContent?.split("/")[0]?.trim() || "弦脉";
  const freeText = document.querySelector("#freeText").value || "";

  output.textContent = state.lang === "zh"
    ? "正在调用 Hugging Face 中医模型，请稍候..."
    : "Calling Hugging Face TCM model, please wait...";

  try {
    const response = await fetch("/api/ai-diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symptoms: selectedLabels,
        tongue: tongueText,
        pulse: pulseText,
        freeText,
        language: state.lang === "zh" ? "中文" : "English",
        maxTokens: 1024,
        temperature: 0.2
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI request failed");
    output.textContent = data.result || "模型没有返回内容。";
  } catch (error) {
    output.textContent = state.lang === "zh"
      ? `Hugging Face 模型暂不可用：${error.message}\n\n已保留上方本地规则 + GraphRAG 演示结果。`
      : `Hugging Face model unavailable: ${error.message}\n\nLocal rule + GraphRAG demo result remains above.`;
  }
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

function openKnowledge(name) {
  const normalized = Object.keys(formulaKnowledge).find((key) => name.includes(key));
  const item = formulaKnowledge[normalized];
  const popover = document.querySelector("#knowledgePopover");
  const title = document.querySelector("#knowledgeTitle");
  const body = document.querySelector("#knowledgeBody");
  if (!popover || !title || !body) return;
  title.textContent = normalized || name;
  if (!item) {
    body.innerHTML = `<p>后台尚未录入该方剂或中药说明。管理员可在方药知识库中补充。</p>`;
  } else {
    body.innerHTML = `
      <dl>
        <dt>出处</dt><dd>${item.source}</dd>
        <dt>组成</dt><dd>${item.composition}</dd>
        <dt>用法用量</dt><dd>${item.usage}</dd>
        <dt>适用范围</dt><dd>${item.indications}</dd>
        <dt>加减应用</dt><dd>${item.modifications}</dd>
        <dt>现代说明</dt><dd>${item.modern}</dd>
      </dl>
    `;
  }
  popover.hidden = false;
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
  const nodes = graphSets[profile];
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

document.querySelector("#caseButton").addEventListener("click", () => {
  const item = cases[Math.floor(Math.random() * cases.length)];
  document.querySelector("#caseText").textContent = item[state.lang];
});

document.querySelector("#examButton").addEventListener("click", () => {
  document.querySelector("#examText").textContent = state.lang === "zh"
    ? "题目：头痛 + 舌红 + 弦脉，最可能的证型？选项：肝阳上亢 / 气虚证 / 风寒表证。"
    : "Quiz: Headache + red tongue + wiry pulse. Most likely pattern? Options: Liver Yang / Qi deficiency / wind-cold exterior.";
});

document.querySelector("#registrationForm")?.addEventListener("submit", createVisit);
document.querySelector("#saveRecordButton")?.addEventListener("click", saveCurrentRecord);
document.querySelector("#signupButton")?.addEventListener("click", signUp);
document.querySelector("#loginButton")?.addEventListener("click", signIn);
document.querySelector("#logoutButton")?.addEventListener("click", signOut);
document.querySelector("#createInviteButton")?.addEventListener("click", createInviteCode);
document.querySelector("#formulaName")?.addEventListener("click", () => {
  openKnowledge(document.querySelector("#formulaName").textContent || "");
});
document.querySelector("#closeKnowledgeButton")?.addEventListener("click", () => {
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
