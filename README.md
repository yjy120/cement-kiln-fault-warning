# 水泥窑线异常检测与故障预警系统

本科毕业设计项目。学生：杨佳莹（软件工程 23 级）｜指导教师：张志鹏老师。

## 项目目标

在老师已有的水泥窑线监测与诊断可视化界面基础上，补充「故障预警」功能模块并编写对应的功能代码。不重复造系统。

## 主要工作

- 在已有界面上加入预警相关页面与展示（预警总览、预警列表、预警详情、异常趋势、处置记录、统计分析）。
- 编写预警功能代码：风险评估逻辑 → 预警生成 → 预警记录增删改查 → 处置状态流转 → 前端图表展示。
- 预警等级草案：0 正常 / 1 提示 / 2 一般 / 3 严重 / 4 紧急（颜色、阈值需老师确认）。

## 技术栈

- **Vue 3** — 前端框架
- **Vue Router** — 页面路由
- **ECharts** — 图表（趋势图、等级分布等）
- **Vite** — 构建与开发服务器

> 具体版本已锁定在 `package.json` 与 `package-lock.json`，大家装出来完全一致。最终以老师提供的原型技术栈为准，如需调整再统一修改清单。

## 目录说明

```
src/
  views/        页面
  components/   可复用组件
  router/       路由
  assets/       静态资源（含全局样式 main.css）
public/         公共资源
docs/           项目文档、手册、资料导读
index.html      页面入口
package.json    依赖清单（要提交）
package-lock.json 版本锁定（要提交，保证所有人环境一致）
vite.config.js  Vite 配置
```

## 怎么把项目跑起来（队友必看）

> 环境不会随 `git clone` 自动装好，需要按下面做。**第一步只有一次，之后每次拉代码只做第 2、3 步。**

**第 0 步（每人只做一次）：安装 Node.js**

去官网 https://nodejs.org/ 下载 **LTS 长期支持版**，一路下一步装完。装完打开命令行输入 `node -v`、`npm -v` 能显示版本号就成了。

**第 1 步：拉代码**

```bash
git clone https://github.com/yjy120/cement-kiln-fault-warning.git
cd cement-kiln-fault-warning
```

**第 2 步：安装依赖（照着清单自动下载，这一步就是"自动配环境"）**

```bash
npm install
```

> 这一步会读 `package-lock.json`，把所有依赖的**精确版本**下载到 `node_modules`。`node_modules` 不用提交，`.gitignore` 已经忽略了。

**第 3 步：启动**

```bash
npm run dev
```

浏览器会自动打开 http://localhost:5173 ，看到水泥窑线预警平台的界面就成了。

**常见问题**

- `npm install` 很慢或卡住 → 换国内镜像：`npm install --registry=https://registry.npmmirror.com`
- 换了电脑/拉了新代码后报错 → 删掉 `node_modules`，重新 `npm install`
- 报端口占用 → `npm run dev -- --port 5174` 换个端口
- **不要删 `package-lock.json`**，它保证你和队友装的版本一模一样

## 进度

- [x] 初始化本地 Git 仓库并推送到 GitHub 远程
- [x] 搭建 Vue 3 + Vite + ECharts 前端骨架（工况总览示例页）
- [x] 配置依赖清单与版本锁定，写好组队环境说明
- [ ] 确认老师提供的界面是否有可运行源码
- [ ] 按老师原型改造/接入可视化界面
- [ ] 加入预警页面与真实功能代码
