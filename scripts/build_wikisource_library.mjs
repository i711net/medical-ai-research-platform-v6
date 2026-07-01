import fs from "node:fs/promises";
import path from "node:path";

const books = [
  {
    title: "傷寒論",
    titleCn: "伤寒论",
    author: "张仲景",
    sourceUrl: "https://zh.wikisource.org/wiki/%E5%82%B7%E5%AF%92%E8%AB%96"
  },
  {
    title: "金匱要略",
    titleCn: "金匮要略",
    author: "张仲景",
    sourceUrl: "https://zh.wikisource.org/wiki/%E9%87%91%E5%8C%B1%E8%A6%81%E7%95%A5"
  },
  {
    title: "難經",
    titleCn: "难经",
    author: "秦越人",
    sourceUrl: "https://zh.wikisource.org/wiki/%E9%9B%A3%E7%B6%93"
  },
  {
    title: "神農本草經",
    titleCn: "神农本草经",
    author: "无名氏",
    sourceUrl: "https://zh.wikisource.org/wiki/%E7%A5%9E%E8%BE%B2%E6%9C%AC%E8%8D%89%E7%B6%93"
  },
  {
    title: "溫病條辨",
    titleCn: "温病条辨",
    author: "吴鞠通",
    sourceUrl: "https://zh.wikisource.org/wiki/%E6%BA%AB%E7%97%85%E6%A2%9D%E8%BE%A8"
  }
];

function sqlString(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function cleanExtract(text) {
  return String(text || "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\[\s*编辑\s*\]/g, "")
    .trim();
}

async function fetchWikisourceText(title) {
  const url = new URL("https://zh.wikisource.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("prop", "extracts");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("format", "json");
  url.searchParams.set("redirects", "1");
  url.searchParams.set("titles", title);
  const response = await fetch(url, {
    headers: { "user-agent": "medical-ai-research-platform-v6/1.0" }
  });
  if (!response.ok) throw new Error(`${title}: HTTP ${response.status}`);
  const data = await response.json();
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing !== undefined || !page.extract) {
    throw new Error(`${title}: no extract returned`);
  }
  return cleanExtract(page.extract);
}

const rows = [];
for (const book of books) {
  try {
    const text = await fetchWikisourceText(book.title);
    if (text.length < 500) throw new Error(`${book.title}: text too short`);
    rows.push({
      ...book,
      content: [
        `书名：${book.titleCn}`,
        `作者：${book.author}`,
        "来源：维基文库",
        `来源链接：${book.sourceUrl}`,
        "授权提醒：维基文库文本通常按自由授权发布，使用时请保留来源与授权说明；古籍内容仅供学习研究，不构成医疗建议。",
        "",
        text
      ].join("\n")
    });
    console.log(`OK ${book.titleCn}: ${text.length} chars`);
  } catch (error) {
    console.warn(`SKIP ${book.titleCn}: ${error.message}`);
  }
}

if (!rows.length) throw new Error("No books were fetched.");

const values = rows.map((book) => `(
  ${sqlString(book.titleCn)},
  'text',
  ${sqlString(`公版中医古籍全文，来源：维基文库。作者：${book.author}。请保留来源链接与授权说明。`)},
  ${sqlString(book.sourceUrl)},
  ${sqlString(book.content)},
  true
)`).join(",\n");

const sql = `-- Public-domain / open classical TCM texts from Wikisource.
-- Run this in Supabase SQL Editor after learning_resources has been created.
-- Source: https://zh.wikisource.org/
-- Keep source URLs and license attribution when reusing these texts.

delete from learning_resources
where title in (${rows.map((book) => sqlString(book.titleCn)).join(", ")});

insert into learning_resources (
  title,
  type,
  description,
  url,
  content,
  is_active
) values
${values};
`;

const output = path.resolve("sql", "public_domain_tcm_wikisource_seed.sql");
await fs.writeFile(output, sql, "utf8");
console.log(`Wrote ${output}`);
