# GitHub 上传清单

把当前文件夹 `中医门诊处方系统` 里的这些文件和文件夹全部上传到 GitHub 仓库根目录。

## 必须上传

```text
index.html
styles.css
app.js
server.js
package.json
README.md
.gitignore
GITHUB_UPLOAD.md
assets/
sql/
api-examples/
supabase-config.js
```

## GitHub 上的目录结构应为

```text
medical-ai-research-platform-v6/
├── index.html
├── styles.css
├── app.js
├── server.js
├── package.json
├── supabase-config.js
├── README.md
├── .gitignore
├── GITHUB_UPLOAD.md
├── assets/
│   ├── v6-ui-concept.png
│   ├── v6-render-desktop.png
│   └── v6-render-mobile.png
├── sql/
│   ├── schema.sql
│   ├── seed.sql
│   ├── public_demo_policies.sql
│   ├── auth_migration.sql
│   └── auth_role_policies.sql
└── api-examples/
    └── huggingface-tongue.js
```

## 建议仓库名

```text
medical-ai-research-platform-v6
```

也可以用中文名，但英文名更适合后面投稿、Vercel、Cloudflare Pages 和 README 展示。

## 上传后检查

GitHub 页面里应该能直接看到：

- `README.md` 自动显示项目说明
- `index.html` 在根目录
- `assets`、`sql`、`api-examples` 三个文件夹都在根目录

## 下一步部署

上传完成后，可以继续做：

1. GitHub Pages 静态展示
2. Vercel 导入 GitHub 仓库
3. Cloudflare Pages 导入 GitHub 仓库
4. Supabase 执行 `sql/schema.sql` 和 `sql/seed.sql`

## 这版已经包含的系统模块

- 双语 AI 问诊
- GraphRAG 推理路径
- 舌诊上传入口
- 门诊挂号
- 病例保存
- 医生 / 学生 / 管理员账号角色
- 后台统计
- 本地数据库保存、预览和 JSON 导出
- Supabase 正式数据库表结构
- Supabase Auth 登录和角色权限 SQL
- 候诊队列状态流转
- 医生/学生/管理员按钮权限控制

## 接 Supabase 时要上传

如果已经在 `supabase-config.js` 填好 Supabase URL 和 anon key，也要把它上传到 GitHub。注意只能填 `anon public` key，不能填 `service_role` key。

## 接账号系统时执行顺序

如果你已经执行过旧版 SQL：

```text
1. sql/auth_migration.sql
2. sql/auth_role_policies.sql
```

如果是全新 Supabase 项目：

```text
1. sql/schema.sql
2. sql/seed.sql
3. sql/public_demo_policies.sql 或 sql/auth_role_policies.sql
```

公开 Demo 用 `public_demo_policies.sql` 更容易演示；真实账号权限用 `auth_role_policies.sql` 更规范。

如果这次只是更新候诊队列状态功能，重新执行：

```text
sql/auth_role_policies.sql
```

它会补上挂号状态更新权限。
