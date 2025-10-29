# Dashboard待办详情功能修复

## 问题描述
在dashboard.html页面点击待办列表的"查看"按钮时，显示的是简单版本的详情，缺少以下内容：
- 来源追溯
- 任务详情（单位、人员、金额、风险等级）
- 证据材料
- 附件列表
- 需要的操作清单
- 完整的操作记录

## 解决方案

### 1. 更新viewTodoDetail函数
在`js/dashboard.js`中完全重写了`viewTodoDetail`函数，使其显示完整的待办详情信息。

### 2. 新增viewSourceDetail函数
添加了`viewSourceDetail`函数，支持从待办详情跳转到来源页面（预警/线索/工单/整改）。

### 3. 更新文件版本
- `dashboard.html` - 为JS和CSS添加版本参数 `?v=2.0`
- 强制浏览器重新加载更新后的文件

## 新增功能

### 来源追溯
- 显示待办任务的来源（预警/线索/工单/整改）
- 不同来源类型使用不同颜色图标
- 支持一键跳转到来源详情页面

### 任务详情
- 涉及单位、人员信息
- 涉及金额（自动格式化为万元）
- 风险等级（高/中/低，带彩色标签）
- 截止时间、任务类型

### 证据材料
- 列表形式展示所有证据
- 左侧彩色边框突出显示

### 附件列表
- 文件名、大小清晰展示
- 支持下载操作（预留接口）

### 操作清单
- 复选框显示完成状态
- 已完成项目自动划线

### 操作记录
- 时间轴样式展示历史记录
- 最新记录高亮显示
- 包含时间、操作人、操作内容

## 使用方法

### 1. 清除浏览器缓存
**强制刷新（推荐）**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 2. 打开Dashboard页面
访问 `dashboard.html` 页面

### 3. 查看待办详情
点击待办列表中的"查看"按钮，应该能看到完整的详情信息

## 验证功能

打开待办详情后，应该能看到以下内容：

✓ 基本信息（标题、描述、优先级、注意事项）
✓ 来源追溯（预警/线索/工单/整改，带跳转按钮）
✓ 任务详情（单位、人员、金额、风险等级）
✓ 证据材料列表
✓ 附件列表（带下载按钮）
✓ 需要的操作（复选框列表）
✓ 操作记录（时间轴展示）

## 技术细节

### 数据结构
待办任务数据包含以下字段：
```javascript
{
    id: 1,
    title: '任务标题',
    description: '任务描述',
    type: '任务类型',
    priority: 'urgent|high|normal',
    deadline: '截止时间',
    source: {
        type: 'alert|clue|workorder|rectification',
        id: '来源ID',
        title: '来源标题',
        module: '所属模块',
        createdAt: '创建时间'
    },
    details: {
        unit: '涉及单位',
        person: '涉及人员',
        amount: 金额（元）,
        riskLevel: 'high|medium|low',
        evidence: ['证据1', '证据2'],
        attachments: [
            { name: '文件名', size: '文件大小' }
        ]
    },
    process: {
        requiredActions: [
            { action: '操作名称', completed: true|false }
        ],
        notes: '注意事项'
    },
    history: [
        {
            time: '时间',
            user: '用户',
            action: '操作',
            note: '说明'
        }
    ]
}
```

### 样式说明
- 使用内联样式确保兼容性
- 响应式布局，支持不同屏幕尺寸
- 使用CSS变量保持一致性
- 时间轴使用绝对定位实现

### 跳转逻辑
```javascript
viewSourceDetail(type, id) {
    const urlMap = {
        'alert': 'command-center.html',
        'clue': `clue-library.html?id=${id}`,
        'workorder': `work-order.html?id=${id}`,
        'rectification': `rectification.html?id=${id}`
    };
    window.open(urlMap[type], '_blank');
}
```

## 相关文件

- `js/dashboard.js` - 主要逻辑文件（已更新）
- `css/dashboard.css` - 样式文件（已有样式支持）
- `dashboard.html` - 页面文件（已更新版本号）

## 注意事项

1. **浏览器缓存**：更新后必须强制刷新才能看到新功能
2. **数据完整性**：确保待办数据包含完整的字段
3. **跳转链接**：根据实际路由配置调整URL
4. **下载功能**：附件下载需要后端API支持

## 后续优化建议

1. 添加待办任务的编辑功能
2. 支持待办任务的批量操作
3. 添加待办任务的评论功能
4. 实现附件的实际下载功能
5. 添加待办任务的提醒功能
6. 支持待办任务的委派功能

## 测试清单

- [ ] 打开dashboard.html页面
- [ ] 点击待办列表的"查看"按钮
- [ ] 验证基本信息显示正确
- [ ] 验证来源追溯显示正确
- [ ] 点击"查看"按钮测试跳转
- [ ] 验证任务详情显示正确
- [ ] 验证证据材料列表显示
- [ ] 验证附件列表显示
- [ ] 验证操作清单显示
- [ ] 验证操作记录时间轴显示
- [ ] 点击"立即处理"按钮测试
- [ ] 在不同浏览器中测试兼容性

## 常见问题

**Q: 为什么看不到新增的内容？**
A: 浏览器缓存了旧文件。请使用 Ctrl+Shift+R 强制刷新。

**Q: 点击"查看"按钮没有反应？**
A: 检查浏览器控制台是否有JavaScript错误。按F12打开控制台查看。

**Q: 来源跳转不工作？**
A: 确保目标页面存在，并且URL配置正确。

**Q: 如何确认使用的是新版本？**
A: 在控制台输入 `Dashboard.mockData.todos[0].source` 查看是否有数据。

## 更新日期
2025-10-28
