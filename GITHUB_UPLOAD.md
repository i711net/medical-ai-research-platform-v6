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
```

## GitHub 上的目录结构应为

```text
medical-ai-research-platform-v6/
├── index.html
├── styles.css
├── app.js
├── server.js
├── package.json
├── README.md
├── .gitignore
├── GITHUB_UPLOAD.md
├── assets/
│   ├── v6-ui-concept.png
│   ├── v6-render-desktop.png
│   └── v6-render-mobile.png
├── sql/
│   ├── schema.sql
│   └── seed.sql
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
