-- Public-domain / open classical TCM reading links.
-- Run this in Supabase SQL Editor. These entries are links and descriptions.
-- Use the admin page's "导入维基文库全文" button to import full text where available.

delete from learning_resources
where title in (
  '伤寒论',
  '金匮要略',
  '难经',
  '神农本草经',
  '黄帝内经',
  '温病条辨',
  '本草纲目',
  '医学三字经'
);

insert into learning_resources (title, type, description, url, content, is_active) values
(
  '伤寒论',
  'link',
  '张仲景经典著作。可在后台用维基文库标题“傷寒論”导入开放文本。',
  'https://zh.wikisource.org/wiki/%E5%82%B7%E5%AF%92%E8%AB%96',
  '开放古籍入口。后台编辑本资料，输入维基文库标题“傷寒論”，点击“导入维基文库全文”，检查后保存。',
  true
),
(
  '金匮要略',
  'link',
  '张仲景杂病辨治经典。可在后台用维基文库标题“金匱要略”导入开放文本。',
  'https://zh.wikisource.org/wiki/%E9%87%91%E5%8C%B1%E8%A6%81%E7%95%A5',
  '开放古籍入口。后台编辑本资料，输入维基文库标题“金匱要略”，点击“导入维基文库全文”，检查后保存。',
  true
),
(
  '难经',
  'link',
  '中医经典之一。可在后台用维基文库标题“難經”导入开放文本。',
  'https://zh.wikisource.org/wiki/%E9%9B%A3%E7%B6%93',
  '开放古籍入口。后台编辑本资料，输入维基文库标题“難經”，点击“导入维基文库全文”，检查后保存。',
  true
),
(
  '神农本草经',
  'link',
  '本草学经典。可在后台用维基文库标题“神農本草經”导入开放文本。',
  'https://zh.wikisource.org/wiki/%E7%A5%9E%E8%BE%B2%E6%9C%AC%E8%8D%89%E7%B6%93',
  '开放古籍入口。后台编辑本资料，输入维基文库标题“神農本草經”，点击“导入维基文库全文”，检查后保存。',
  true
),
(
  '黄帝内经',
  'link',
  '中医理论经典总目。维基文库多为分篇页面，适合逐篇导入。',
  'https://zh.wikisource.org/wiki/%E9%BB%83%E5%B8%9D%E5%85%A7%E7%B6%93',
  '开放古籍入口。后台可按分篇标题逐篇导入，例如素问、灵枢相关篇目。',
  true
),
(
  '温病条辨',
  'link',
  '温病学经典。可在后台用维基文库标题“溫病條辨”导入开放文本。',
  'https://zh.wikisource.org/wiki/%E6%BA%AB%E7%97%85%E6%A2%9D%E8%BE%A8',
  '开放古籍入口。后台编辑本资料，输入维基文库标题“溫病條辨”，点击“导入维基文库全文”，检查后保存。',
  true
),
(
  '本草纲目',
  'link',
  '李时珍本草学巨著。篇幅大，建议按卷或分页面导入。',
  'https://zh.wikisource.org/wiki/%E6%9C%AC%E8%8D%89%E7%B6%B1%E7%9B%AE',
  '开放古籍入口。篇幅较大，建议在维基文库按卷或分篇导入。',
  true
),
(
  '医学三字经',
  'link',
  '陈修园医学启蒙经典。可在后台搜索维基文库同名页面导入。',
  'https://zh.wikisource.org/wiki/%E9%86%AB%E5%AD%B8%E4%B8%89%E5%AD%97%E7%B6%93',
  '开放古籍入口。后台编辑本资料，输入维基文库标题“醫學三字經”，点击“导入维基文库全文”，检查后保存。',
  true
);
