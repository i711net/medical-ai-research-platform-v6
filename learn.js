import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const fallbackResources = [
  {
    title: "中医诊断学基础目录",
    type: "text",
    description: "望闻问切、八纲辨证、脏腑辨证学习入口。",
    content: "建议后台上传 PDF、课件、视频或外部课程链接。"
  },
  {
    title: "西医常见症状鉴别",
    type: "link",
    description: "头痛、胸痛、发热、咳嗽等基础鉴别诊断。",
    url: "https://medlineplus.gov/"
  }
];

const config = window.SUPABASE_CONFIG || {};
let supabase = null;
if (config.url?.startsWith("https://") && config.anonKey?.length > 30) {
  supabase = createClient(config.url, config.anonKey);
}

async function loadResources() {
  if (!supabase) return fallbackResources;
  const { data, error } = await supabase
    .from("learning_resources")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error || !data?.length) return fallbackResources;
  return data;
}

function renderViewer(resource) {
  const viewer = document.querySelector("#resourceViewer");
  if (resource.url) {
    viewer.innerHTML = `<a class="primary-button" href="${resource.url}" target="_blank" rel="noreferrer">打开资料</a>`;
    return;
  }
  viewer.textContent = resource.content || resource.description || "暂无预览。";
}

const resources = await loadResources();
const list = document.querySelector("#learningList");
list.innerHTML = resources.map((item, index) => `
  <button class="resource-row" type="button" data-index="${index}">
    <strong>${item.title}</strong>
    <span>${item.type || "resource"} · ${item.description || ""}</span>
  </button>
`).join("");
list.querySelectorAll("[data-index]").forEach((button) => {
  button.addEventListener("click", () => renderViewer(resources[Number(button.dataset.index)]));
});
