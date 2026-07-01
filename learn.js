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
  const title = escapeHtml(resource.title || "学习资料");
  const description = resource.description ? `<p class="resource-description">${escapeHtml(resource.description)}</p>` : "";
  const content = resource.content ? `<article class="resource-content">${escapeHtml(resource.content)}</article>` : "";
  const url = resource.url || "";
  let media = "";
  if (url) {
    const safeUrl = escapeHtml(url);
    if (resource.type === "image") {
      media = `<img class="resource-media" src="${safeUrl}" alt="${title}" />`;
    } else if (resource.type === "video") {
      media = `<video class="resource-media" src="${safeUrl}" controls></video>`;
    } else if (resource.type === "audio") {
      media = `<audio class="resource-media" src="${safeUrl}" controls></audio>`;
    } else if (resource.type === "pdf") {
      media = `<iframe class="resource-frame" src="${safeUrl}" title="${title}"></iframe>`;
    }
    media += `<a class="primary-button resource-open-link" href="${safeUrl}" target="_blank" rel="noreferrer">打开原文件 / 链接</a>`;
  }
  viewer.innerHTML = `
    <h2>${title}</h2>
    ${description}
    ${content || "<p>暂无正文内容。管理员可以在后台“学习资料书架编辑”中粘贴文字。</p>"}
    ${media}
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const resources = await loadResources();
const list = document.querySelector("#learningList");
list.innerHTML = resources.map((item, index) => `
  <button class="resource-row" type="button" data-index="${index}">
    <strong>${escapeHtml(item.title || "未命名资料")}</strong>
    <span>${escapeHtml(item.type || "resource")} · ${escapeHtml(item.description || "")}</span>
  </button>
`).join("");
list.querySelectorAll("[data-index]").forEach((button) => {
  button.addEventListener("click", () => renderViewer(resources[Number(button.dataset.index)]));
});
if (resources.length) renderViewer(resources[0]);
