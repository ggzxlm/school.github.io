# 高校纪检审计监管一体化平台

一个面向高等院校的综合性监督管理系统，通过数据驱动和智能化手段，实现纪检监督、审计监督、线索管理、风险预警等功能的一体化管理。

## 🌟 项目特色

- **全流程监控** - 采购项目从论证到合同签订的8个阶段全覆盖
- **智能搜索** - 实时搜索建议、搜索历史、热门搜索
- **风险预警** - 多维度风险识别和预警
- **数据可视化** - 丰富的图表和数据展示
- **响应式设计** - 适配各种屏幕尺寸

## 🚀 快速开始

### 在线演示

访问 GitHub Pages: [https://你的用户名.github.io/仓库名](https://你的用户名.github.io/仓库名)

### 本地运行

1. **克隆项目**
```bash
git clone https://github.com/你的用户名/仓库名.git
cd 仓库名
```

2. **启动本地服务器**

使用 Python:
```bash
python -m http.server 8000
```

或使用 Node.js:
```bash
npx http-server
```

3. **访问应用**
```
打开浏览器访问 http://localhost:8000
```

## 📋 核心功能

### 1. 采购项目全流程预警 🛒

从论证到合同签订的全流程监控，覆盖8个关键阶段：

- ✅ **论证** - 检查参会人员专业性、倾向性风险
- ✅ **立项** - 检查重复建设、资料完整性
- ✅ **需求** - 检查举报线索、技术参数倾向性
- ✅ **公告** - 检查公告平台合规性、期限要求
- ✅ **专家抽取** - 检查专家比例、部门参与情况
- ✅ **评标** - 检查投诉质疑、评分合理性
- ✅ **结果公示** - 检查公示期限、异议处理
- ✅ **合同签订** - 检查内容匹配度、金额差异

**快速访问：**
- 项目列表：`test-procurement-project.html`
- 高风险示例：`procurement-project-detail.html?id=P2025001`
- 低风险示例：`procurement-project-detail.html?id=P2025002`

### 2. 全局搜索功能 🔍

智能、便捷、高效的搜索体验：

- 🔍 **实时搜索建议** - 输入时显示相关建议
- 📝 **搜索历史** - 自动保存最近10条搜索
- 🔥 **热门搜索** - 展示系统热门关键词
- ✨ **关键词高亮** - 搜索结果中高亮显示
- 🎯 **类型筛选** - 按类型过滤搜索结果

**快速访问：**
- 功能演示：`search-demo.html`
- 功能测试：`test-search.html`
- 搜索结果：`search-results.html?q=采购`

### 3. 纪检监督 ⚖️

- 第一议题
- 重大决策
- 招生录取
- 科研经费
- 基建采购
- 采购项目监督
- 财务管理
- 八项规定
- 三重一大

### 4. 审计监督 📊

- 预算执行
- 科研经费
- 采购管理
- 固定资产
- 招生学籍
- 工程项目
- 薪酬社保
- IT治理

### 5. 数据治理 💾

- 数据源管理
- 采集任务
- ETL管理
- 主数据管理
- 数据质量
- 元数据管理
- 数据安全
- 数据分类分级

## 🗂️ 项目结构

```
.
├── index.html                          # 首页
├── quick-access.html                   # 快速访问页面
├── css/                                # 样式文件
│   ├── common.css                      # 公共样式
│   ├── procurement-project-detail.css  # 采购项目详情样式
│   └── search-results.css              # 搜索结果样式
├── js/                                 # JavaScript文件
│   ├── common.js                       # 公共函数
│   ├── components.js                   # 公共组件
│   ├── procurement-project-service.js  # 采购项目服务
│   ├── procurement-project-detail.js   # 采购项目详情
│   └── search-results.js               # 搜索结果
├── procurement-project-detail.html     # 采购项目详情页
├── test-procurement-project.html       # 采购项目测试页
├── search-results.html                 # 搜索结果页
├── search-demo.html                    # 搜索演示页
└── docs/                               # 文档目录
    ├── PROCUREMENT-QUICK-START.md      # 采购项目快速开始
    ├── SEARCH-QUICK-START.md           # 搜索功能快速开始
    └── HOW-TO-ACCESS.md                # 访问指南
```

## 📖 文档

- [快速访问指南](HOW-TO-ACCESS.md)
- [采购项目快速开始](PROCUREMENT-QUICK-START.md)
- [采购项目功能说明](PROCUREMENT-PROJECT-ALERT-GUIDE.md)
- [搜索功能快速开始](SEARCH-QUICK-START.md)
- [搜索功能使用指南](SEARCH-USAGE-GUIDE.md)

## 🛠️ 技术栈

- **前端框架**: 原生 JavaScript (ES6+)
- **样式**: CSS3
- **图标**: Font Awesome 6.4.0
- **存储**: LocalStorage
- **架构**: 组件化设计

## 🎨 特性

### 用户体验
- 流畅的动画效果
- 响应式设计
- 直观的交互
- 清晰的视觉反馈

### 性能优化
- 本地存储
- 组件化架构
- 按需加载
- 代码优化

### 可扩展性
- 模块化设计
- 易于维护
- 支持自定义
- 灵活配置

## 📊 数据说明

本项目使用模拟数据进行演示，包括：

- 2个采购项目示例
- 10条搜索结果数据
- 多个预警案例
- 完整的流程数据

实际使用时需要对接真实的后端API。

## 🔧 开发指南

### 添加新功能

1. 在 `js/` 目录下创建新的服务文件
2. 在 `css/` 目录下创建对应的样式文件
3. 创建 HTML 页面
4. 在 `js/components.js` 中添加导航菜单项

### 自定义样式

所有样式变量定义在 `css/common.css` 的 `:root` 中：

```css
:root {
    --color-primary: #1E40AF;
    --color-success: #10B981;
    --color-warning: #F59E0B;
    --color-danger: #EF4444;
    /* ... 更多变量 */
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### 2025-10-24

#### 新增功能
- ✅ 采购项目全流程预警功能
- ✅ 全局搜索功能
- ✅ 快速访问页面

#### 优化改进
- ✅ 优化导航菜单结构
- ✅ 改进搜索体验
- ✅ 完善文档说明

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👥 作者

开发团队

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

## 📞 联系方式

- 项目地址: [https://github.com/你的用户名/仓库名](https://github.com/你的用户名/仓库名)
- 问题反馈: [Issues](https://github.com/你的用户名/仓库名/issues)

---

**Made with ❤️ by 开发团队**
