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

insert into diagnostic_terms (category, parent_slug, slug, label_cn, label_en, description, sort_order) values
  ('symptom', 'head-face', 'heavy-head', '头重如裹', 'Heavy head', '常见于湿邪、痰湿、清阳不升等，需结合胸闷、纳呆、苔腻。', 103),
  ('symptom', 'head-face', 'empty-headache', '头空痛', 'Empty headache', '多见于精血不足、清窍失养，需结合眩晕、健忘、腰膝酸软。', 104),
  ('symptom', 'head-face', 'dry-eyes', '目涩', 'Dry eyes', '可见肝血不足、阴虚、用眼过度或眼科疾病。', 105),
  ('symptom', 'head-face', 'nasal-obstruction', '鼻塞', 'Nasal obstruction', '外感、鼻渊、过敏等均可出现，需结合涕色、发热恶寒。', 106),
  ('symptom', 'head-face', 'foreign-body-throat', '咽中异物感', 'Globus sensation', '常作为梅核气、肝气郁结或咽喉疾病线索。', 107),
  ('symptom', 'thirst-taste', 'thirst', '口渴', 'Thirst', '需辨喜冷喜热、饮水多少、是否渴不欲饮。', 801),
  ('symptom', 'thirst-taste', 'no-desire-to-drink', '渴不欲饮', 'Thirst without desire to drink', '可见湿热、瘀血、痰饮等水液输布异常。', 802),
  ('symptom', 'thirst-taste', 'cold-drink-preference', '喜冷饮', 'Prefers cold drinks', '多提示热证或津液耗伤方向，需结合舌红、脉数。', 803),
  ('symptom', 'thirst-taste', 'warm-drink-preference', '喜热饮', 'Prefers warm drinks', '常见寒证、阳虚或胃寒线索。', 804),
  ('symptom', 'thirst-taste', 'sticky-mouth', '口黏', 'Sticky mouth', '多与湿浊、痰湿、湿热有关。', 805),
  ('symptom', 'thirst-taste', 'hunger-no-appetite', '饥不欲食', 'Hungry but no appetite', '胃阴不足、虚热或胃失和降可见。', 806),
  ('symptom', 'spleen-stomach', 'sticky-stool', '大便黏滞', 'Sticky stool', '常见湿热或湿浊下注，需结合里急后重、肛门灼热。', 407),
  ('symptom', 'spleen-stomach', 'undigested-food-stool', '完谷不化', 'Undigested food in stool', '多见脾肾阳虚、运化失司。', 408),
  ('symptom', 'spleen-stomach', 'tenesmus', '里急后重', 'Tenesmus', '湿热痢疾、肠道炎症等可见，需结合便血、发热腹痛。', 409),
  ('symptom', 'spleen-stomach', 'painful-urination', '尿痛', 'Painful urination', '需考虑淋证、湿热下注及泌尿感染风险。', 410),
  ('symptom', 'spleen-stomach', 'clear-long-urine', '小便清长', 'Clear profuse urine', '多见虚寒、阳虚、气化不利。', 411),
  ('symptom', 'spleen-stomach', 'urinary-retention', '癃闭', 'Urinary retention', '属于需要重视的排尿困难表现，严重时需及时就医。', 412),
  ('symptom', 'channels-limbs', 'wandering-pain', '游走痛', 'Wandering pain', '多见风邪痹阻，需结合恶风、关节肿痛。', 602),
  ('symptom', 'channels-limbs', 'distending-pain', '胀痛', 'Distending pain', '常提示气滞，情志、胁肋、乳房和脘腹部位尤需辨别。', 603),
  ('symptom', 'channels-limbs', 'cold-pain', '冷痛', 'Cold pain', '多提示寒凝或阳虚，喜温喜按需进一步记录。', 604),
  ('symptom', 'channels-limbs', 'burning-pain', '灼痛', 'Burning pain', '多提示热证、湿热、阴虚火旺等。', 605),
  ('symptom', 'channels-limbs', 'dull-pain', '隐痛', 'Dull pain', '多见虚证或慢性病程，需结合喜按、劳累加重。', 606),
  ('symptom', 'skin-surface', 'skin-itching', '皮肤瘙痒', 'Skin itching', '风、湿、热、血虚均可致痒，需看皮疹形态。', 901),
  ('symptom', 'skin-surface', 'rash', '皮疹', 'Rash', '需结合颜色、分布、发热、过敏和感染风险。', 902),
  ('symptom', 'skin-surface', 'jaundice', '黄疸', 'Jaundice', '需鉴别湿热、寒湿及肝胆系统疾病，应重视化验检查。', 903),
  ('symptom', 'skin-surface', 'bruising', '紫斑', 'Purpura', '需辨血热、气不摄血、瘀血，并排查凝血和血液系统疾病。', 904),
  ('symptom', 'bleeding', 'hemoptysis', '咯血', 'Hemoptysis', '需要优先排查肺部、支气管和心血管相关风险。', 1001),
  ('symptom', 'bleeding', 'hematemesis', '吐血', 'Hematemesis', '属于消化道出血危险表现，应及时线下就医。', 1002),
  ('symptom', 'bleeding', 'melena', '黑便', 'Melena', '提示上消化道出血可能，需尽快医学评估。', 1003),
  ('symptom', 'gynecology', 'dark-menses', '经色暗', 'Dark menstrual blood', '可提示寒凝、气滞血瘀等，需结合血块和疼痛性质。', 702),
  ('symptom', 'gynecology', 'pale-menses', '经色淡', 'Pale menstrual blood', '多见气血不足或脾虚统摄无力。', 703),
  ('symptom', 'gynecology', 'clotted-menses', '经血块', 'Menstrual clots', '常作为血瘀、寒凝或气滞线索。', 704),
  ('symptom', 'gynecology', 'yellow-leukorrhea', '黄带', 'Yellow leukorrhea', '多提示湿热下注或感染方向，需结合气味和瘙痒。', 705),
  ('symptom', 'male-repro', 'impotence', '阳痿', 'Impotence', '需辨肾阳虚、肝郁、湿热、血瘀及心血管代谢因素。', 1101),
  ('symptom', 'male-repro', 'seminal-emission', '遗精', 'Seminal emission', '可见肾虚、心肾不交、湿热下注等。', 1102),
  ('symptom', 'male-repro', 'scrotal-dampness', '阴囊潮湿', 'Scrotal dampness', '常见湿热下注、肝胆湿热或局部皮肤问题。', 1103),
  ('symptom', 'children', 'food-stagnation', '食积', 'Food stagnation', '小儿常见，需结合腹胀、嗳腐、夜卧不安、大便酸臭。', 1201),
  ('symptom', 'children', 'febrile-convulsion', '高热惊厥', 'Febrile convulsion', '儿童高热伴抽搐属于急症风险，应及时就医。', 1202),
  ('symptom', 'children', 'enuresis', '遗尿', 'Enuresis', '需辨肾气不足、脾肺气虚、湿热下注及发育因素。', 1203)
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
