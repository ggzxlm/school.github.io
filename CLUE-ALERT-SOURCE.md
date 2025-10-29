# 线索详情显示预警来源信息

## 更新时间
2025-10-28

## 功能说明
当线索来源是"预警转化"时，在线索详情页面显示预警的相关信息，并提供跳转到预警详情的功能。

## 实现内容

### 1. HTML结构
在线索详情模态框中添加了"来源信息"部分，位于基本信息和处置信息之间。

```html
<div class="detail-section" id="sourceSection">
    <h4>来源信息</h4>
    <div class="relation-card">
        <div class="relation-icon">预警图标</div>
        <div class="relation-content">
            <div class="relation-title">预警标题</div>
            <div class="relation-meta">预警元数据</div>
        </div>
        <button>查看预警详情</button>
    </div>
</div>
```

### 2. 数据结构
为来源是预警的线索添加了`alertSource`字段：

```javascript
{
    id: 'CLUE2025001',
    title: '科研经费报销存在连号发票异常',
    source: '监督模型自动预警',
    alertSource: {
        alertId: 'YJ-2025-001',
        alertTitle: '科研经费异常报销 - 连号发票检测',
        alertType: '科研经费',
        alertRisk: '高风险',
        alertTime: '2025-09-28 09:30',
        alertDepartment: '计算机学院'
    }
}
```

### 3. JavaScript逻辑
在`viewDetail`函数中添加了预警来源信息的显示逻辑：

```javascript
// 来源信息（预警）
const sourceSection = document.getElementById('sourceSection');
if (currentClue.alertSource) {
    sourceSection.style.display = 'block';
    // 填充预警信息
    // 绑定跳转事件
    document.getElementById('viewAlertBtn').onclick = function() {
        window.open(`alert-center.html?id=${alertId}`, '_blank');
    };
} else {
    sourceSection.style.display = 'none';
}
```

## 显示逻辑

### 有预警来源
- 显示"来源信息"部分
- 展示预警编号、标题、类型、时间
- 提供"查看预警详情"按钮
- 点击按钮在新标签页打开预警详情

### 无预警来源
- 隐藏"来源信息"部分
- 不影响其他信息的显示

## 已添加预警来源的线索

1. **CLUE2025001** - 科研经费报销存在连号发票异常
   - 预警编号：YJ-2025-001
   - 预警类型：科研经费
   - 预警时间：2025-09-28 09:30

2. **CLUE2025003** - 招生录取存在低分高录情况
   - 预警编号：YJ-2025-003
   - 预警类型：招生录取
   - 预警时间：2025-10-08 14:20

## 测试步骤

1. 强制刷新浏览器（Ctrl+Shift+R）
2. 打开clue-library.html页面
3. 点击"CLUE2025001"的"查看"按钮
4. 验证显示"来源信息"部分
5. 验证预警信息正确显示
6. 点击"查看预警详情"按钮
7. 验证跳转到alert-center.html并打开对应预警
8. 测试其他线索（无预警来源的不显示）

## 文件更新

- `clue-library.html` - 添加来源信息部分（v5）
- `js/clue-library.js` - 添加预警来源数据和显示逻辑（v5）

## 业务流程

```
预警触发 → 转化为线索 → 创建工单 → 执行整改
   ↓           ↓            ↓          ↓
YJ-2025-001  CLUE2025001  WO2025001  ZG2025001
```

在线索详情中可以：
- 查看来源预警（向上追溯）
- 查看关联工单（向下追溯）
- 查看整改任务（向下追溯）

## 后续优化建议

1. 支持其他来源类型（举报、审计等）
2. 添加来源信息的时间轴展示
3. 支持从线索直接跳转到预警
4. 添加预警转化线索的记录
5. 显示预警的处理结果

## 注意事项

- 只有`alertSource`字段存在时才显示来源信息
- 跳转使用`window.open`在新标签页打开
- 预警ID需要与alert-center.html中的数据匹配
- 确保预警详情页面支持URL参数
