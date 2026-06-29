import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.SUPABASE_CONFIG || {};
const supabase = config.url?.startsWith("https://") && config.anonKey?.length > 30
  ? createClient(config.url, config.anonKey)
  : null;

const state = {
  profile: null,
  password: "",
  db: { visits: [], records: [], audit: [] }
};

function setStatus(text) {
  document.querySelector("#authStatus").textContent = text;
}

function requireAdmin() {
  const ok = state.profile?.role === "admin";
  document.body.classList.toggle("admin-mode", ok);
  document.querySelector("#adminDashboard").classList.toggle("locked", !ok);
  return ok;
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
  setStatus(`管理员已登录：${profile.display_name || profile.login_name}`);
  requireAdmin();
  await loadDatabase();
}

function logout() {
  state.profile = null;
  state.password = "";
  setStatus("请使用管理员账号登录后台");
  requireAdmin();
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
  await loadDatabase();
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
  await loadDatabase();
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
  document.querySelector("#databasePreview").value = JSON.stringify(state.db, null, 2);
}

async function saveResource() {
  if (!requireAdmin()) return;
  const { error } = await supabase.from("learning_resources").insert({
    title: document.querySelector("#resourceTitle").value.trim(),
    type: "link",
    url: document.querySelector("#resourceUrl").value.trim(),
    description: document.querySelector("#resourceDescription").value.trim()
  });
  if (error) alert(error.message);
  else alert("学习资料已保存");
}

async function saveTerm() {
  if (!requireAdmin()) return;
  const label = document.querySelector("#termLabel").value.trim();
  const slug = `${document.querySelector("#termCategory").value}-${Date.now()}`;
  const { error } = await supabase.from("diagnostic_terms").insert({
    category: document.querySelector("#termCategory").value,
    slug,
    label_cn: label,
    description: document.querySelector("#termDescription").value.trim()
  });
  if (error) alert(error.message);
  else alert("词条已保存");
}

async function saveFormula() {
  if (!requireAdmin()) return;
  const { error } = await supabase.from("formulas").insert({
    name_cn: document.querySelector("#formulaTitle").value.trim(),
    modern_notes: document.querySelector("#formulaBody").value.trim()
  });
  if (error) alert(error.message);
  else alert("方药说明已保存");
}

document.querySelector("#loginButton").addEventListener("click", login);
document.querySelector("#logoutButton").addEventListener("click", logout);
document.querySelector("#createInviteButton").addEventListener("click", createStaff);
document.querySelector("#deleteStaffButton").addEventListener("click", deleteStaff);
document.querySelector("#saveResourceButton").addEventListener("click", saveResource);
document.querySelector("#saveTermButton").addEventListener("click", saveTerm);
document.querySelector("#saveFormulaButton").addEventListener("click", saveFormula);
document.querySelector("#exportButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state.db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "medical-ai-v6-admin-backup.json";
  link.click();
  URL.revokeObjectURL(url);
});
document.querySelector("#resetButton").addEventListener("click", () => {
  document.querySelector("#databasePreview").value = "";
});

requireAdmin();
