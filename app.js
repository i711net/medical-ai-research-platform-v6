const state = {
  lang: "zh",
  inputLang: "zh",
  selectedSymptoms: new Set(["headache", "insomnia"]),
  role: "doctor",
  lastProfile: "liver",
  supabase: null,
  remoteReady: false,
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
    accountSub: "模拟医生、学生、管理员三类角色。",
    adminTitle: "后台管理员",
    adminSub: "查看运营统计和待处理事项。",
    visitsToday: "今日挂号",
    recordsSaved: "病例归档",
    highRisk: "高风险提示",
    databaseTitle: "数据库保存与管理",
    databaseSub: "优先保存到 Supabase；未配置时自动使用浏览器 localStorage。",
    exportJson: "导出 JSON",
    resetDemo: "重置演示数据"
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
    accountSub: "Simulated doctor, student, and administrator roles.",
    adminTitle: "Admin Console",
    adminSub: "Review operational statistics and pending tasks.",
    visitsToday: "Visits today",
    recordsSaved: "Saved records",
    highRisk: "High-risk flags",
    databaseTitle: "Database Storage and Management",
    databaseSub: "Saves to Supabase when configured; falls back to browser localStorage.",
    exportJson: "Export JSON",
    resetDemo: "Reset demo data"
  }
};

const symptomOptions = [
  { id: "headache", zh: "头痛", en: "Headache" },
  { id: "bitter", zh: "口苦", en: "Bitter taste" },
  { id: "fever", zh: "发热", en: "Fever" },
  { id: "cough", zh: "咳嗽", en: "Cough" },
  { id: "chestPain", zh: "胸痛", en: "Chest pain" },
  { id: "fatigue", zh: "乏力", en: "Fatigue" },
  { id: "insomnia", zh: "失眠", en: "Insomnia" },
  { id: "dizziness", zh: "眩晕", en: "Dizziness" }
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

  let profile = "liver";
  if (selected.has("fever") || selected.has("cough")) profile = "exterior";
  if (selected.has("fatigue") || tongue === "pale" || pulse === "deep") profile = "qi";
  if (selected.has("chestPain")) profile = "liver";
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
    await loadRemoteDatabase();
  }
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
      </article>
    `);
    list.innerHTML = rows.join("") || `<article class="data-item"><span>${state.lang === "zh" ? "暂无挂号记录" : "No visits yet"}</span></article>`;
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
  analyze();
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
