-- Medical AI Research Platform V6 knowledge seed.
-- Run after sql/app_accounts_and_knowledge.sql.
-- Educational/research data only; not clinical prescribing advice.

insert into diagnostic_terms (category, parent_slug, slug, label_cn, label_en, description, sort_order) values
  ('symptom', 'head-face', 'blurred-vision', '目昏', 'Blurred vision', '肝肾亏虚、肝火、痰湿上扰等均可见，需结合眼科危险信号。', 101),
  ('symptom', 'head-face', 'tinnitus', '耳鸣', 'Tinnitus', '可与肝胆火、肾虚、痰火、药物和耳科疾病相关。', 102),
  ('symptom', 'cold-heat', 'tidal-fever', '潮热', 'Tidal fever', '多提示阴虚内热或湿温热势，需结合盗汗、舌苔。', 201),
  ('symptom', 'cold-heat', 'five-center-heat', '五心烦热', 'Five-center heat', '多属阴虚内热。', 202),
  ('symptom', 'lung-chest', 'yellow-phlegm', '黄痰', 'Yellow phlegm', '多提示痰热、肺热或感染方向，需结合发热和呼吸困难。', 301),
  ('symptom', 'spleen-stomach', 'acid-regurgitation', '反酸', 'Acid regurgitation', '可见肝胃不和、胃热、胃气上逆，需鉴别胃食管反流。', 401),
  ('symptom', 'spirit-sleep', 'difficulty-sleeping', '入睡困难', 'Difficulty falling asleep', '多与心神不宁、肝郁、阴血不足、睡眠节律有关。', 501),
  ('symptom', 'spirit-sleep', 'early-waking', '早醒', 'Early waking', '需结合焦虑抑郁、阴虚内热、老年睡眠障碍等。', 502),
  ('symptom', 'channels-limbs', 'fixed-stabbing-pain', '刺痛固定', 'Fixed stabbing pain', '常作为血瘀疼痛线索，急性胸痛需优先排急症。', 601),
  ('symptom', 'gynecology', 'dysmenorrhea', '痛经', 'Dysmenorrhea', '寒凝、气滞、血瘀、虚证均可，需排除器质性病变。', 701)
on conflict (slug) do update
set label_cn = excluded.label_cn,
    label_en = excluded.label_en,
    description = excluded.description,
    sort_order = excluded.sort_order;

insert into formulas (name_cn, name_en, source, composition, dosage, usage, indications, modifications, modern_notes) values
  ('归脾汤', 'Gui Pi Tang', '《济生方》', '黄芪、人参、白术、茯神、酸枣仁、龙眼肉、木香、当归、远志、甘草、生姜、大枣', '教学资料示例，剂量需医师辨证', '水煎服或按医嘱使用', '心脾两虚、气血不足所致失眠多梦、心悸健忘、食少乏力', '失眠重加养心安神；纳差便溏重健脾化湿；阴虚内热明显者慎用温补', '用于心脾两虚型失眠、焦虑、疲劳等教学讨论'),
  ('天王补心丹', 'Tian Wang Bu Xin Dan', '《摄生秘剖》', '生地黄、天冬、麦冬、玄参、丹参、当归、五味子、酸枣仁、柏子仁、茯苓、远志、桔梗、朱砂等传统组成', '教学资料示例，含矿物药传统组成须现代安全评估', '丸剂或汤剂均需遵医嘱', '阴虚血少、心神失养所致失眠多梦、心悸、盗汗、舌红少苔', '虚热明显清虚热；现代应用需考虑安全替代', '用于阴虚内热、心神不宁相关失眠教学讨论'),
  ('逍遥散', 'Xiao Yao San', '《太平惠民和剂局方》', '柴胡、当归、白芍、白术、茯苓、甘草、薄荷、生姜', '教学资料示例', '水煎服或遵医嘱', '肝郁血虚脾弱，胁痛、情志抑郁、月经不调、纳差', '热象明显化裁丹栀逍遥散；痰湿重合化痰利湿', '常用于焦虑、经前期不适、功能性消化问题证候讨论'),
  ('六味地黄丸', 'Liu Wei Di Huang Wan', '《小儿药证直诀》', '熟地黄、山茱萸、山药、泽泻、牡丹皮、茯苓', '教学资料示例', '丸剂或汤剂遵医嘱', '肝肾阴虚，腰膝酸软、头晕耳鸣、盗汗、舌红少苔', '虚火明显可知柏地黄丸；眼目昏花可杞菊地黄丸', '常用于代谢、内分泌、衰老相关证候研究讨论'),
  ('血府逐瘀汤', 'Xue Fu Zhu Yu Tang', '《医林改错》', '桃仁、红花、当归、生地黄、川芎、赤芍、牛膝、桔梗、柴胡、枳壳、甘草', '教学资料示例，活血药需评估禁忌', '水煎服，遵医嘱', '胸中血瘀，胸痛、头痛日久、痛有定处、舌暗或瘀点', '气滞重加行气；寒凝加温通；急性胸痛先排急症', '用于胸痛、头痛、循环相关证候研究，不能替代急症筛查')
on conflict (name_cn) do update
set name_en = excluded.name_en,
    source = excluded.source,
    composition = excluded.composition,
    dosage = excluded.dosage,
    usage = excluded.usage,
    indications = excluded.indications,
    modifications = excluded.modifications,
    modern_notes = excluded.modern_notes;

insert into herbs (name_cn, name_en, nature_flavor, meridians, functions, dosage, cautions, modern_notes) values
  ('黄芪', 'Astragalus', '甘，微温', '脾、肺', '补气升阳，固表止汗，利水消肿，托毒生肌', '教学示例：9-30g', '实热、阴虚阳亢、表实邪盛慎用', '研究涉及免疫、心肾保护、疲劳和蛋白尿等方向'),
  ('酸枣仁', 'Ziziphus seed', '甘、酸，平', '心、肝、胆', '养心补肝，宁心安神，敛汗，生津', '教学示例：10-20g', '嗜睡者、驾驶和镇静药同用需谨慎', '研究涉及睡眠、镇静、焦虑相关'),
  ('天麻', 'Gastrodia', '甘，平', '肝', '息风止痉，平抑肝阳，祛风通络', '教学示例：3-10g', '血虚无风、津液亏虚者需辨证', '研究涉及眩晕、头痛、神经保护'),
  ('丹参', 'Salvia miltiorrhiza', '苦，微寒', '心、肝', '活血祛瘀，通经止痛，清心除烦', '教学示例：9-15g', '抗凝/抗血小板药同用、出血倾向、孕期慎用', '研究涉及冠脉循环、抗血小板、抗炎'),
  ('甘草', 'Licorice', '甘，平', '心、肺、脾、胃', '补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药', '教学示例：2-10g', '长期大剂量可致水钠潴留、血压升高、低钾', '甘草酸相关研究涉及抗炎、肝保护等')
on conflict (name_cn) do update
set name_en = excluded.name_en,
    nature_flavor = excluded.nature_flavor,
    meridians = excluded.meridians,
    functions = excluded.functions,
    dosage = excluded.dosage,
    cautions = excluded.cautions,
    modern_notes = excluded.modern_notes;
