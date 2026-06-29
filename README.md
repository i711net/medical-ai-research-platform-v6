# Medical AI Research Platform V6

这是一个可运行的双语医学 AI 研究展示系统，覆盖中医辨证、西医分诊、GraphRAG 推理路径、舌诊 AI 接口预留、门诊挂号、病例系统、账号角色、后台管理员、数据库保存与管理、病例生成、考试模式和论文实验指标。

> 重要边界：本项目仅用于医学 AI 研究、教学和产品 Demo，不用于临床诊断或处方。

## 直接运行

```bash
npm run dev
```

打开：

```text
http://localhost:4173
```

也可以直接打开 `index.html` 预览。

## 已包含功能

- 中英文 UI 切换
- 症状、舌象、脉象、自由文本输入
- 本地模拟的中医 + 西医推理结果
- GraphRAG 知识图谱路径可视化
- 门诊挂号：患者、年龄、科室、医生、主诉、风险状态
- 病例系统：把当前 AI 推理归档为病例
- 账号系统：医生、学生、管理员三类角色模拟
- 后台管理员：挂号数、病例数、高风险提示、审计日志
- 数据库管理：浏览器 localStorage 保存、JSON 预览和导出
- Rule / RAG / GraphRAG / Bilingual GraphRAG 实验指标展示
- AI 病例生成与考试模式演示
- Supabase `pgvector`、账号、患者、挂号、病例、审计日志表结构
- HuggingFace 舌诊接口示例
- Vercel / Cloudflare Pages / GitHub Pages 静态部署友好

## 免费资源路线

| 模块 | 免费优先方案 | 说明 |
| --- | --- | --- |
| 代码仓库 | GitHub | 开源项目、论文附件、Issue 管理 |
| 静态前端 | Cloudflare Pages 或 Vercel Hobby | 本项目零依赖静态文件，适合直接部署 |
| 数据库 | Supabase Free | 放账号、患者、挂号、病例、图谱节点；`pgvector` 用于 RAG |
| 图谱可视化 | 浏览器原生 / Cytoscape.js 可选 | 当前版本用原生 DOM，无需依赖 |
| 舌诊模型 | HuggingFace Spaces/API | 免费 CPU 适合演示；真实医学模型需自行训练和验证 |
| LLM | 可选 OpenAI / HuggingFace | 当前本地版不强制依赖模型 Key |

## 接入 Supabase

1. 在 Supabase 创建项目。
2. 打开 SQL Editor。
3. 执行 `sql/schema.sql`。
4. 执行 `sql/seed.sql`。
5. 执行 `sql/public_demo_policies.sql`，允许公开 Demo 用 anon key 读写挂号和病例。
6. 把 `supabase-config.js` 里的 `url` 和 `anonKey` 改成 Supabase 项目的值。
7. 上传更新后的文件，Vercel 会自动重新部署。

建议环境变量：

```text
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
HF_TOKEN=...
OPENAI_API_KEY=...
```

当前静态网站版本不使用 Vercel 环境变量读取前端配置，而是使用 `supabase-config.js`。只填写 Supabase `anon public` key，不要填写 `service_role` key。

`sql/public_demo_policies.sql` 是公开演示策略，适合 Demo 阶段。正式上线账号系统后，应改成基于 Supabase Auth 用户角色的更严格 RLS。

## V6.1 账号登录与角色权限

本项目支持 Supabase Auth 邮箱密码登录。前端会根据 `clinic_users.role` 切换医生、学生、管理员工作台。

如果你已经执行过旧版 `schema.sql`，先执行：

```text
sql/auth_migration.sql
```

然后执行：

```text
sql/auth_role_policies.sql
```

Supabase 控制台建议设置：

1. Authentication → Providers → Email 开启。
2. Demo 阶段可以关闭 Confirm email，方便注册后立刻登录。
3. 正式上线应开启 Confirm email，并收紧 RLS。

角色说明：

- `doctor`：挂号、保存病例、AI 辅助诊断
- `student`：病例学习、考试训练
- `admin`：后台统计、审计、数据管理

V6.2 增强：

- 登录后按角色限制按钮权限
- 学生不能新增挂号、保存病例、更新就诊状态
- 医生/管理员可以把挂号状态改为候诊、接诊、完成
- 重新执行 `sql/auth_role_policies.sql` 可获得 Supabase 更新权限

## V6.3 管理员邀请码与安全删除

本项目不建议开放网页自由注册。推荐流程：

1. 管理员先登录系统。
2. 管理员在后台生成人员注册码。
3. 新人员使用邮箱、密码、姓名、注册码注册。
4. 人员角色由注册码决定，不能自己选择医生/学生/管理员。
5. 管理员删除记录前应先导出 JSON 备份。
6. 删除记录需要管理员登录 + 删除专用密码。

执行：

```text
sql/admin_security.sql
```

然后在 Supabase SQL Editor 里执行文件底部的删除密码初始化语句，把 `CHANGE_THIS_DELETE_PASSWORD` 改成你自己的删除专用密码。

Vercel 负责部署网站；账号、角色、注册码和删除权限由 Supabase 管理。

## 部署建议

### Cloudflare Pages

- Build command 留空或使用 `npm run check`
- Output directory 填项目根目录
- 入口文件为 `index.html`

### Vercel

- Framework preset 选择 Other
- Build command 可留空或填 `npm run check`
- Output directory 填 `.`

### GitHub Pages

- 上传整个项目
- Pages source 选择 main 分支根目录

## 论文方向

建议题目：

```text
A Multimodal GraphRAG-Based Bilingual Medical AI System for Traditional Chinese Medicine Diagnosis and Educational Simulation
```

可写贡献点：

- Bilingual medical knowledge alignment
- GraphRAG + rule-based hybrid reasoning
- Multimodal tongue diagnosis interface
- Synthetic medical case generation
- Explainable TCM + Western medicine education workflow

## 文件说明

- `index.html`：主界面
- `styles.css`：视觉系统
- `app.js`：双语、问诊、图谱、病例和考试交互
- 浏览器本地数据库：`localStorage` key 为 `medical-ai-v6-db`
- `server.js`：零依赖本地预览服务
- `sql/schema.sql`：Supabase / pgvector / 门诊业务表结构
- `sql/seed.sql`：知识图谱和医学知识种子数据
- `sql/public_demo_policies.sql`：公开 Demo 的 Supabase RLS 策略
- `sql/auth_migration.sql`：给旧数据库增加 Auth 用户关联字段
- `sql/auth_role_policies.sql`：Supabase Auth 角色权限策略
- `sql/admin_security.sql`：管理员注册码、安全删除密码和删除函数
- `supabase-config.js`：Supabase URL 和 anon key 配置
- `api-examples/huggingface-tongue.js`：HuggingFace 舌诊接口示例
- `assets/v6-ui-concept.png`：本次生成的 UI 概念图
