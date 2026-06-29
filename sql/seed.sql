insert into graph_nodes (slug, type, name_cn, name_en) values
  ('headache', 'symptom', '头痛', 'Headache'),
  ('red-tongue', 'tongue', '舌红', 'Red tongue'),
  ('liver-yang', 'syndrome', '肝阳上亢', 'Liver Yang Hyperactivity'),
  ('tianma-gouteng', 'formula', '天麻钩藤饮', 'Gastrodia and Uncaria Decoction'),
  ('fatigue', 'symptom', '乏力', 'Fatigue'),
  ('qi-deficiency', 'syndrome', '气虚证', 'Qi Deficiency'),
  ('sijunzi', 'formula', '四君子汤', 'Si Jun Zi Tang')
on conflict (slug) do nothing;

insert into medical_knowledge (title_cn, title_en, content_cn, content_en, type, source) values
  ('肝阳上亢', 'Liver Yang Hyperactivity', '头痛眩晕、急躁易怒、舌红、脉弦。治以平肝潜阳。', 'Headache, dizziness, irritability, red tongue, wiry pulse. Treatment principle: calm liver and subdue yang.', 'syndrome', 'TCM teaching seed'),
  ('天麻钩藤饮', 'Gastrodia and Uncaria Decoction', '常用于肝阳上亢型头痛眩晕的教学推理。', 'Often used as a teaching example for headache and dizziness related to Liver Yang Hyperactivity.', 'formula', 'TCM teaching seed'),
  ('四君子汤', 'Si Jun Zi Tang', '用于气虚证教学演示，症见乏力、气短、舌淡。', 'Teaching example for Qi deficiency with fatigue, shortness of breath, and pale tongue.', 'formula', 'TCM teaching seed');

insert into graph_edges (from_id, to_id, relation)
select a.id, b.id, e.relation
from (
  values
    ('headache', 'liver-yang', 'suggests'),
    ('red-tongue', 'liver-yang', 'supports'),
    ('liver-yang', 'tianma-gouteng', 'treated_by'),
    ('fatigue', 'qi-deficiency', 'suggests'),
    ('qi-deficiency', 'sijunzi', 'treated_by')
) as e(from_slug, to_slug, relation)
join graph_nodes a on a.slug = e.from_slug
join graph_nodes b on b.slug = e.to_slug;
