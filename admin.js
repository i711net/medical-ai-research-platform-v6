import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.SUPABASE_CONFIG || {};
const supabase = config.url?.startsWith("https://") && config.anonKey?.length > 30
  ? createClient(config.url, config.anonKey)
  : null;

const state = {
  profile: null,
  password: "",
  activeTable: "diagnostic_terms",
  selectedRecord: null,
  tableRows: [],
  learningRows: [],
  selectedLearning: null,
  db: { visits: [], records: [], audit: [] }
};

const ADMIN_SESSION_KEY = "medical-ai-v6-admin-session";

const tableConfigs = {
  diagnostic_terms: {
    title: "症状 / 舌象 / 脉象",
    editable: true,
    order: "sort_order",
    fields: [
      ["category", "分类", "select", ["symptom", "tongue", "pulse", "pattern", "risk"]],
      ["parent_slug", "上级分类/区域", "text"],
      ["slug", "唯一标识", "text", { required: true }],
      ["label_cn", "中文名称", "text", { required: true }],
      ["label_en", "英文名称", "text"],
      ["description", "说明/辨证意义", "textarea"],
      ["sort_order", "排序", "number"],
      ["is_active", "启用", "checkbox"]
    ],
    display: (row) => row.label_cn || row.slug,
    sub: (row) => `${row.category || ""} · ${row.slug || ""}`
  },
  formulas: {
    title: "方剂知识库",
    editable: true,
    order: "name_cn",
    fields: [
      ["name_cn", "方剂名", "text", { required: true }],
      ["name_en", "英文名", "text"],
      ["source", "出处", "text"],
      ["composition", "组成", "textarea"],
      ["dosage", "剂量说明", "textarea"],
      ["usage", "用法/治法", "textarea"],
      ["indications", "适用范围/主治", "textarea"],
      ["modifications", "加减应用", "textarea"],
      ["modern_notes", "现代说明/安全提醒", "textarea"],
      ["is_active", "启用", "checkbox"]
    ],
    display: (row) => row.name_cn,
    sub: (row) => row.source || row.name_en || ""
  },
  herbs: {
    title: "中药材知识库",
    editable: true,
    order: "name_cn",
    fields: [
      ["name_cn", "药材名", "text", { required: true }],
      ["name_en", "英文/别名", "text"],
      ["nature_flavor", "性味", "text"],
      ["meridians", "归经", "text"],
      ["functions", "功效", "textarea"],
      ["dosage", "用法用量", "textarea"],
      ["cautions", "禁忌/安全提醒", "textarea"],
      ["modern_notes", "现代应用/研究方向", "textarea"],
      ["is_active", "启用", "checkbox"]
    ],
    display: (row) => row.name_cn,
    sub: (row) => row.functions || row.nature_flavor || ""
  },
  learning_resources: {
    title: "医学学习资料",
    editable: true,
    order: "created_at",
    fields: [
      ["title", "资料标题", "text", { required: true }],
      ["type", "类型", "select", ["link", "pdf", "video", "audio", "text", "image", "office"]],
      ["url", "链接/文件地址", "text"],
      ["description", "说明", "textarea"],
      ["content", "正文内容", "textarea"],
      ["is_active", "启用", "checkbox"]
    ],
    display: (row) => row.title,
    sub: (row) => `${row.type || ""} · ${row.url || ""}`
  },
  app_users: {
    title: "人员账号",
    editable: false,
    order: "created_at",
    fields: [
      ["login_name", "登录名", "text"],
      ["display_name", "姓名", "text"],
      ["role", "角色", "text"],
      ["expires_at", "到期时间", "text"],
      ["is_active", "启用", "checkbox"],
      ["created_at", "创建时间", "text"]
    ],
    select: "id, login_name, display_name, role, expires_at, is_active, created_at",
    display: (row) => row.login_name,
    sub: (row) => `${row.display_name || ""} · ${row.role || ""}`
  },
  outpatient_visits: {
    title: "门诊挂号",
    editable: false,
    order: "created_at",
    fields: [
      ["visit_no", "挂号号", "text"],
      ["department", "科室", "text"],
      ["doctor_name", "医生", "text"],
      ["chief_complaint", "主诉", "textarea"],
      ["status", "状态", "text"],
      ["risk_level", "风险", "text"],
      ["created_at", "创建时间", "text"]
    ],
    select: "id, visit_no, department, doctor_name, chief_complaint, status, risk_level, created_at, patients(name, age)",
    display: (row) => row.visit_no || row.patients?.name || row.id,
    sub: (row) => `${row.patients?.name || ""} · ${row.department || ""} · ${row.status || ""}`
  },
  medical_records: {
    title: "病例记录",
    editable: false,
    order: "created_at",
    fields: [
      ["tcm_diagnosis", "中医诊断", "text"],
      ["western_diagnosis", "西医分析", "textarea"],
      ["formula", "方剂", "textarea"],
      ["risk_level", "风险", "text"],
      ["created_at", "创建时间", "text"]
    ],
    display: (row) => row.tcm_diagnosis || row.id,
    sub: (row) => `${row.formula || ""} · ${row.risk_level || ""}`
  },
  admin_audit_logs: {
    title: "审计记录",
    editable: false,
    order: "created_at",
    fields: [
      ["action", "动作", "text"],
      ["payload", "内容", "json"],
      ["created_at", "时间", "text"]
    ],
    display: (row) => row.action,
    sub: (row) => row.created_at || ""
  }
};

function setStatus(text) {
  document.querySelector("#authStatus").textContent = text;
}

function saveAdminSession(profile, password) {
  const value = JSON.stringify({
    login_name: profile.login_name,
    display_name: profile.display_name,
    role: profile.role,
    password
  });
  sessionStorage.setItem(ADMIN_SESSION_KEY, value);
  localStorage.setItem(ADMIN_SESSION_KEY, value);
}

function readAdminSession() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
}

function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

function requireAdmin() {
  const ok = state.profile?.role === "admin";
  document.body.classList.toggle("admin-mode", ok);
  document.querySelector("#adminDashboard").classList.toggle("locked", !ok);
  document.querySelector(".top-login")?.classList.toggle("hidden-panel", ok);
  return ok;
}

async function restoreAdminSession() {
  const raw = readAdminSession();
  if (!raw) {
    requireAdmin();
    renderAdminManager();
    renderLearningAdmin();
    return;
  }
  try {
    const session = JSON.parse(raw);
    if (session.role !== "admin" || !session.login_name || !session.password) {
      clearAdminSession();
      requireAdmin();
      renderAdminManager();
      renderLearningAdmin();
      return;
    }
    state.profile = {
      login_name: session.login_name,
      display_name: session.display_name,
      role: session.role
    };
    state.password = session.password;
    setStatus(`管理员已登录：${session.display_name || session.login_name}`);
    requireAdmin();
    await Promise.all([loadDatabase(), loadActiveTable(), loadLearningResources()]);
  } catch {
    clearAdminSession();
    requireAdmin();
    renderAdminManager();
    renderLearningAdmin();
  }
}

async function login() {
  if (!supabase) {
    alert("Supabase 未配置");
    return;
  }
  const loginName = document.querySelector("#authEmail").value.trim();
  const password = document.querySelector("#authPassword").value;
  const { data, error } = await supabase.rpc("app_login", {
    p_login_name: loginName,
    p_password: password
  });
  if (error) {
    alert(error.message);
    return;
  }
  const profile = data?.[0];
  if (profile?.role !== "admin") {
    alert("只有管理员可以进入后台");
    return;
  }
  state.profile = profile;
  state.password = password;
  saveAdminSession(profile, password);
  setStatus(`管理员已登录：${profile.display_name || profile.login_name}`);
  requireAdmin();
  await Promise.all([loadDatabase(), loadActiveTable(), loadLearningResources()]);
}

function logout() {
  state.profile = null;
  state.password = "";
  state.tableRows = [];
  state.selectedRecord = null;
  state.learningRows = [];
  state.selectedLearning = null;
  clearAdminSession();
  setStatus("请使用管理员账号登录后台");
  requireAdmin();
  renderAdminManager();
  renderLearningAdmin();
}

async function createStaff() {
  if (!requireAdmin()) return;
  const { error } = await supabase.rpc("admin_create_app_user", {
    p_admin_login_name: state.profile.login_name,
    p_admin_password: state.password,
    p_login_name: document.querySelector("#staffLoginName").value.trim(),
    p_password: document.querySelector("#staffPassword").value.trim(),
    p_display_name: document.querySelector("#inviteName").value.trim(),
    p_role: document.querySelector("#inviteRole").value,
    p_valid_days: Number(document.querySelector("#validDays").value || 30)
  });
  if (error) {
    alert(error.message);
    return;
  }
  alert("人员账号已保存");
  await Promise.all([loadDatabase(), reloadIfTable("app_users")]);
}

async function deleteStaff() {
  if (!requireAdmin()) return;
  if (!confirm("确认停用该人员账号？")) return;
  const { error } = await supabase.rpc("admin_delete_app_user", {
    p_admin_login_name: state.profile.login_name,
    p_admin_password: state.password,
    p_delete_password: document.querySelector("#deleteStaffPassword").value,
    p_login_name: document.querySelector("#deleteLoginName").value.trim()
  });
  if (error) {
    alert(error.message);
    return;
  }
  alert("人员账号已停用");
  await Promise.all([loadDatabase(), reloadIfTable("app_users")]);
}

async function loadDatabase() {
  if (!supabase) return;
  const [visits, records, audit] = await Promise.all([
    supabase.from("outpatient_visits").select("id, visit_no, department, doctor_name, chief_complaint, status, risk_level, created_at, patients(name, age)").order("created_at", { ascending: false }).limit(50),
    supabase.from("medical_records").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("admin_audit_logs").select("action, created_at, payload").order("created_at", { ascending: false }).limit(20)
  ]);
  state.db.visits = visits.data || [];
  state.db.records = records.data || [];
  state.db.audit = audit.data || [];
  renderDatabase();
}

function renderDatabase() {
  document.querySelector("#visitCount").textContent = String(state.db.visits.length);
  document.querySelector("#recordCount").textContent = String(state.db.records.length);
  document.querySelector("#riskCount").textContent = String(state.db.visits.filter((v) => v.risk_level === "high").length);
  document.querySelector("#auditLog").innerHTML = state.db.audit.map((item) => `<div>${item.created_at} ${item.action}</div>`).join("");
  document.querySelector("#databasePreview").value = JSON.stringify({
    当前编辑区: state.activeTable,
    当前编辑区数据: state.tableRows,
    统计预览: state.db
  }, null, 2);
}

async function loadActiveTable() {
  if (!requireAdmin() || !supabase) {
    renderAdminManager();
    return;
  }
  const config = tableConfigs[state.activeTable];
  const select = config.select || "*";
  let query = supabase.from(state.activeTable).select(select);
  if (config.order) query = query.order(config.order, { ascending: config.order !== "created_at" });
  if (config.order !== "created_at" && config.fields.some(([field]) => field === "created_at")) {
    query = query.order("created_at", { ascending: false });
  }
  const { data, error } = await query.limit(1000);
  if (error) {
    state.tableRows = [];
    state.selectedRecord = null;
    renderAdminManager(error.message);
    return;
  }
  state.tableRows = data || [];
  state.selectedRecord = null;
  renderAdminManager();
  renderDatabase();
}

async function reloadIfTable(table) {
  if (state.activeTable === table) await loadActiveTable();
}

function getFilteredRows() {
  const keyword = document.querySelector("#adminDbSearch")?.value.trim().toLowerCase() || "";
  if (!keyword) return state.tableRows;
  return state.tableRows.filter((row) => JSON.stringify(row).toLowerCase().includes(keyword));
}

function renderAdminManager(errorText = "") {
  renderTabs();
  renderToolbar();
  renderList(errorText);
  renderEditor();
}

function renderToolbar() {
  const config = tableConfigs[state.activeTable];
  const newButton = document.querySelector("#newDbRecordButton");
  if (newButton) {
    newButton.disabled = !config.editable || !requireAdmin();
    newButton.textContent = config.editable ? "新增" : "只读";
  }
}

function renderTabs() {
  document.querySelectorAll("#adminDbTabs [data-table]").forEach((button) => {
    button.classList.toggle("active", button.dataset.table === state.activeTable);
  });
}

function renderList(errorText = "") {
  const list = document.querySelector("#adminDbList");
  const count = document.querySelector("#adminDbCount");
  if (!list || !count) return;
  const config = tableConfigs[state.activeTable];
  const rows = getFilteredRows();
  count.textContent = errorText ? "读取失败" : `${rows.length} / ${state.tableRows.length} 条`;
  if (errorText) {
    list.innerHTML = `<div class="admin-db-empty">读取数据库失败：${escapeHtml(errorText)}</div>`;
    return;
  }
  if (!requireAdmin()) {
    list.innerHTML = `<div class="admin-db-empty">登录管理员账号后显示数据库内容。</div>`;
    return;
  }
  if (!rows.length) {
    list.innerHTML = `<div class="admin-db-empty">当前区域没有数据。请确认已经在 Supabase SQL Editor 运行对应种子 SQL；如果刚运行过，请点“刷新”。搜索框有内容时也可能是搜索无结果。</div>`;
    return;
  }
  list.innerHTML = rows.map((row) => `
    <button class="admin-db-row ${state.selectedRecord?.id === row.id ? "active" : ""}" type="button" data-id="${row.id || ""}">
      <strong>${escapeHtml(config.display(row) || "未命名")}</strong>
      <span>${escapeHtml(config.sub(row) || "")}</span>
      ${row.is_active === false ? "<em>已停用</em>" : ""}
    </button>
  `).join("");
  list.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRecord = state.tableRows.find((row) => String(row.id) === button.dataset.id) || null;
      renderAdminManager();
    });
  });
}

function renderEditor() {
  const editor = document.querySelector("#adminDbEditor");
  if (!editor) return;
  const config = tableConfigs[state.activeTable];
  const record = state.selectedRecord;
  if (!requireAdmin()) {
    editor.innerHTML = `<div class="empty-editor">请先登录管理员账号。</div>`;
    return;
  }
  if (!record) {
    editor.innerHTML = `<div class="empty-editor">请选择左侧一条 ${config.title} 数据，或点击“新增”。</div>`;
    return;
  }
  const readonly = !config.editable;
  editor.innerHTML = `
    <div class="editor-heading">
      <strong>${escapeHtml(config.title)}</strong>
      <span>${readonly ? "只读查看" : record.id ? "编辑数据库记录" : "新增数据库记录"}</span>
    </div>
    ${config.fields.map(([field, label, type, extra]) => renderField(field, label, type, extra, record, readonly)).join("")}
    <div class="editor-actions">
      ${readonly ? "" : `<button class="primary-button" id="saveDbRecordButton" type="submit">保存修改</button>`}
      ${readonly || !record.id || !("is_active" in record) ? "" : `<button class="ghost-button" id="toggleActiveButton" type="button">${record.is_active === false ? "启用" : "停用"}</button>`}
    </div>
  `;
  if (!readonly) {
    editor.querySelector("#toggleActiveButton")?.addEventListener("click", toggleActiveRecord);
  }
}

function renderField(field, label, type, extra, record, readonly) {
  const value = record[field];
  const disabled = readonly ? "disabled" : "";
  const required = extra?.required ? "required" : "";
  if (type === "textarea") {
    return `<label class="admin-edit-field"><span>${label}</span><textarea data-field="${field}" rows="4" ${disabled} ${required}>${escapeHtml(value || "")}</textarea></label>`;
  }
  if (type === "select") {
    const options = (Array.isArray(extra) ? extra : []).map((item) => `<option value="${item}" ${value === item ? "selected" : ""}>${item}</option>`).join("");
    return `<label class="admin-edit-field"><span>${label}</span><select data-field="${field}" ${disabled} ${required}>${options}</select></label>`;
  }
  if (type === "checkbox") {
    return `<label class="admin-edit-field checkbox-field"><input data-field="${field}" type="checkbox" ${value !== false ? "checked" : ""} ${disabled} /><span>${label}</span></label>`;
  }
  if (type === "json") {
    return `<label class="admin-edit-field"><span>${label}</span><textarea rows="6" disabled>${escapeHtml(JSON.stringify(value || {}, null, 2))}</textarea></label>`;
  }
  return `<label class="admin-edit-field"><span>${label}</span><input data-field="${field}" type="${type || "text"}" value="${escapeHtml(value ?? "")}" ${disabled} ${required} /></label>`;
}

function createBlankRecord() {
  const config = tableConfigs[state.activeTable];
  if (!config.editable) return;
  const record = {};
  config.fields.forEach(([field, _label, type]) => {
    if (field === "is_active") record[field] = true;
    else if (field === "sort_order") record[field] = 100;
    else if (type === "checkbox") record[field] = false;
    else record[field] = "";
  });
  if (state.activeTable === "diagnostic_terms") {
    record.category = "symptom";
    record.slug = `term-${Date.now()}`;
  }
  if (state.activeTable === "learning_resources") record.type = "link";
  state.selectedRecord = record;
  renderAdminManager();
}

function collectEditorRecord() {
  const record = { ...state.selectedRecord };
  document.querySelectorAll("#adminDbEditor [data-field]").forEach((input) => {
    const field = input.dataset.field;
    if (input.type === "checkbox") record[field] = input.checked;
    else if (input.type === "number") record[field] = input.value === "" ? null : Number(input.value);
    else record[field] = input.value;
  });
  return record;
}

async function saveActiveRecord(event) {
  event.preventDefault();
  if (!requireAdmin()) return;
  const config = tableConfigs[state.activeTable];
  if (!config.editable) return;
  const record = collectEditorRecord();
  const payload = { ...record };
  let result;
  if (payload.id) {
    const id = payload.id;
    delete payload.created_at;
    result = await supabase
      .from(state.activeTable)
      .update(payload)
      .eq("id", id)
      .select()
      .single();
  } else {
    delete payload.id;
    delete payload.created_at;
    result = await supabase
      .from(state.activeTable)
      .insert(payload)
      .select()
      .single();
  }
  const { data, error } = result;
  if (error) {
    alert(error.message);
    return;
  }
  alert("已保存到数据库");
  state.selectedRecord = data;
  await loadActiveTable();
}

async function toggleActiveRecord() {
  if (!requireAdmin() || !state.selectedRecord?.id) return;
  const next = state.selectedRecord.is_active === false;
  const { error } = await supabase
    .from(state.activeTable)
    .update({ is_active: next })
    .eq("id", state.selectedRecord.id);
  if (error) {
    alert(error.message);
    return;
  }
  alert(next ? "已启用" : "已停用");
  await loadActiveTable();
}

async function loadLearningResources() {
  if (!requireAdmin() || !supabase) {
    renderLearningAdmin();
    return;
  }
  const { data, error } = await supabase
    .from("learning_resources")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) {
    state.learningRows = [];
    state.selectedLearning = null;
    renderLearningAdmin(error.message);
    return;
  }
  state.learningRows = data || [];
  if (state.selectedLearning?.id) {
    state.selectedLearning = state.learningRows.find((row) => row.id === state.selectedLearning.id) || null;
  }
  renderLearningAdmin();
}

function getFilteredLearningRows() {
  const keyword = document.querySelector("#learningSearch")?.value.trim().toLowerCase() || "";
  if (!keyword) return state.learningRows;
  return state.learningRows.filter((row) => JSON.stringify(row).toLowerCase().includes(keyword));
}

function renderLearningAdmin(errorText = "") {
  const list = document.querySelector("#learningAdminList");
  const editor = document.querySelector("#learningEditor");
  if (!list || !editor) return;
  if (!requireAdmin()) {
    list.innerHTML = `<div class="admin-db-empty">登录管理员账号后显示学习资料。</div>`;
    editor.innerHTML = `<div class="empty-editor">请先登录管理员账号。</div>`;
    return;
  }
  if (errorText) {
    list.innerHTML = `<div class="admin-db-empty">读取学习资料失败：${escapeHtml(errorText)}</div>`;
    editor.innerHTML = `<div class="empty-editor">请检查 Supabase 权限或 learning_resources 表结构。</div>`;
    return;
  }
  const rows = getFilteredLearningRows();
  list.innerHTML = rows.length ? rows.map((row) => `
    <div class="learning-book-row ${state.selectedLearning?.id === row.id ? "active" : ""}">
      <button type="button" data-learning-id="${row.id}">
        <strong>${escapeHtml(row.title || "未命名资料")}</strong>
        <span>${escapeHtml(row.type || "text")}${row.is_active === false ? " · 已停用" : ""}</span>
      </button>
      <button class="ghost-button mini-edit-button" type="button" data-learning-edit="${row.id}">编辑</button>
    </div>
  `).join("") : `<div class="admin-db-empty">还没有学习资料。点击“新增书籍”，把文字粘贴到右侧正文后保存。</div>`;
  list.querySelectorAll("[data-learning-id], [data-learning-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.learningId || button.dataset.learningEdit;
      state.selectedLearning = state.learningRows.find((row) => String(row.id) === id) || null;
      renderLearningAdmin();
    });
  });
  renderLearningEditor();
}

function renderLearningEditor() {
  const editor = document.querySelector("#learningEditor");
  const record = state.selectedLearning;
  if (!editor) return;
  if (!record) {
    editor.innerHTML = `<div class="empty-editor">请选择左侧书籍，或点击“新增书籍”。</div>`;
    return;
  }
  editor.innerHTML = `
    <div class="editor-heading">
      <strong>${record.id ? "编辑学习资料" : "新增学习资料"}</strong>
      <span>保存后前台学习区立即读取数据库内容</span>
    </div>
    <label class="admin-edit-field">
      <span>书籍 / 资料名称</span>
      <input data-learning-field="title" type="text" required value="${escapeHtml(record.title || "")}" />
    </label>
    <div class="two-col">
      <label class="admin-edit-field">
        <span>资料类型</span>
        <select data-learning-field="type">
          ${["text", "link", "pdf", "video", "audio", "image", "office"].map((type) => `<option value="${type}" ${record.type === type ? "selected" : ""}>${type}</option>`).join("")}
        </select>
      </label>
      <label class="admin-edit-field checkbox-field">
        <input data-learning-field="is_active" type="checkbox" ${record.is_active !== false ? "checked" : ""} />
        <span>前台显示</span>
      </label>
    </div>
    <label class="admin-edit-field">
      <span>外部链接 / 文件地址</span>
      <input data-learning-field="url" type="text" value="${escapeHtml(record.url || "")}" />
    </label>
    <label class="admin-edit-field">
      <span>资料说明</span>
      <textarea data-learning-field="description" rows="3">${escapeHtml(record.description || "")}</textarea>
    </label>
    <label class="admin-edit-field learning-content-field">
      <span>书籍正文 / 章节内容</span>
      <textarea data-learning-field="content" rows="18" placeholder="可以直接把 TXT、Word/WPS 里的文字复制粘贴到这里。">${escapeHtml(record.content || "")}</textarea>
    </label>
    <div class="editor-actions">
      <button class="primary-button" type="submit">保存学习资料</button>
      ${record.id ? `<button class="ghost-button" id="toggleLearningActiveButton" type="button">${record.is_active === false ? "前台显示" : "前台隐藏"}</button>` : ""}
    </div>
  `;
  editor.querySelector("#toggleLearningActiveButton")?.addEventListener("click", toggleLearningActive);
}

function createLearningResource() {
  if (!requireAdmin()) return;
  state.selectedLearning = {
    title: "",
    type: "text",
    url: "",
    description: "",
    content: "",
    is_active: true
  };
  renderLearningAdmin();
}

function collectLearningRecord() {
  const record = { ...state.selectedLearning };
  document.querySelectorAll("#learningEditor [data-learning-field]").forEach((input) => {
    const field = input.dataset.learningField;
    if (input.type === "checkbox") record[field] = input.checked;
    else record[field] = input.value;
  });
  return record;
}

async function saveLearningResource(event) {
  event.preventDefault();
  if (!requireAdmin() || !state.selectedLearning) return;
  const payload = collectLearningRecord();
  if (!payload.title?.trim()) {
    alert("请填写书籍或资料名称");
    return;
  }
  let result;
  if (payload.id) {
    const id = payload.id;
    delete payload.created_at;
    result = await supabase.from("learning_resources").update(payload).eq("id", id).select().single();
  } else {
    delete payload.id;
    delete payload.created_at;
    result = await supabase.from("learning_resources").insert(payload).select().single();
  }
  if (result.error) {
    alert(result.error.message);
    return;
  }
  state.selectedLearning = result.data;
  alert("学习资料已保存");
  await Promise.all([loadLearningResources(), reloadIfTable("learning_resources")]);
}

async function toggleLearningActive() {
  if (!requireAdmin() || !state.selectedLearning?.id) return;
  const next = state.selectedLearning.is_active === false;
  const { error } = await supabase
    .from("learning_resources")
    .update({ is_active: next })
    .eq("id", state.selectedLearning.id);
  if (error) {
    alert(error.message);
    return;
  }
  state.selectedLearning.is_active = next;
  await Promise.all([loadLearningResources(), reloadIfTable("learning_resources")]);
}

async function saveTerm() {
  if (!requireAdmin()) return;
  const label = document.querySelector("#termLabel").value.trim();
  const slug = `${document.querySelector("#termCategory").value}-${Date.now()}`;
  const { error } = await supabase.from("diagnostic_terms").insert({
    category: document.querySelector("#termCategory").value,
    slug,
    label_cn: label,
    description: document.querySelector("#termDescription").value.trim(),
    is_active: true,
    sort_order: 100
  });
  if (error) alert(error.message);
  else {
    alert("词条已保存");
    await reloadIfTable("diagnostic_terms");
  }
}

async function saveFormula() {
  if (!requireAdmin()) return;
  const { error } = await supabase.from("formulas").upsert({
    name_cn: document.querySelector("#formulaTitle").value.trim(),
    modern_notes: document.querySelector("#formulaBody").value.trim(),
    is_active: true
  }, { onConflict: "name_cn" });
  if (error) alert(error.message);
  else {
    alert("方药说明已保存");
    await reloadIfTable("formulas");
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.querySelector("#loginButton")?.addEventListener("click", login);
document.querySelector("#logoutButton")?.addEventListener("click", logout);
document.querySelector("#createInviteButton")?.addEventListener("click", createStaff);
document.querySelector("#deleteStaffButton")?.addEventListener("click", deleteStaff);
document.querySelector("#saveTermButton")?.addEventListener("click", saveTerm);
document.querySelector("#saveFormulaButton")?.addEventListener("click", saveFormula);
document.querySelector("#refreshDataButton").addEventListener("click", async () => {
  await Promise.all([loadDatabase(), loadActiveTable(), loadLearningResources()]);
});
document.querySelector("#newDbRecordButton")?.addEventListener("click", createBlankRecord);
document.querySelector("#adminDbEditor")?.addEventListener("submit", saveActiveRecord);
document.querySelector("#adminDbSearch")?.addEventListener("input", renderAdminManager);
document.querySelector("#reloadLearningButton")?.addEventListener("click", loadLearningResources);
document.querySelector("#newLearningButton")?.addEventListener("click", createLearningResource);
document.querySelector("#learningEditor")?.addEventListener("submit", saveLearningResource);
document.querySelector("#learningSearch")?.addEventListener("input", renderLearningAdmin);
document.querySelectorAll("#adminDbTabs [data-table]").forEach((button) => {
  button.addEventListener("click", async () => {
    state.activeTable = button.dataset.table;
    state.selectedRecord = null;
    await loadActiveTable();
  });
});
document.querySelector("#exportButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({
    activeTable: state.activeTable,
    rows: state.tableRows,
    preview: state.db
  }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `medical-ai-v6-${state.activeTable}-backup.json`;
  link.click();
  URL.revokeObjectURL(url);
});
document.querySelector("#resetButton").addEventListener("click", () => {
  document.querySelector("#databasePreview").value = "";
});

restoreAdminSession();
