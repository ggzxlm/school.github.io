# 采集任务管理 - 详情模态框样式更新

## 修改说明

已将采集任务管理页面的"任务详情"模态框更新为与其他页面一致的样式，并保留了标签页功能。

## 修改内容

### HTML（collection-task-management.html）

#### 修改前
```html
<div id="taskDetailModal" class="modal">
    <div class="modal-content large">
        <div class="modal-header">
            <h2 id="detailTaskName">任务详情</h2>
            <button class="close-btn" onclick="closeTaskDetailModal()">&times;</button>
        </div>
```

#### 修改后
```html
<div id="taskDetailModal" class="modal-overlay">
    <div class="modal-container modal-xl">
        <div class="modal-header">
            <h2 class="modal-title" id="detailTaskName">
                <i class="fas fa-info-circle"></i>任务详情
            </h2>
            <button class="modal-close-btn" onclick="closeTaskDetailModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="detail-tabs">
                <button class="tab-btn active" onclick="switchDetailTab('info')">基本信息</button>
                <button class="tab-btn" onclick="switchDetailTab('history')">执行历史</button>
                <button class="tab-btn" onclick="switchDetailTab('logs')">执行日志</button>
                <button class="tab-btn" onclick="switchDetailTab('stats')">统计信息</button>
            </div>
            <div id="tabContent" class="tab-content-area">
                <!-- 内容将通过JavaScript动态生成 -->
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeTaskDetailModal()">关闭</button>
        </div>
    </div>
</div>
```

### 主要变更

1. **容器类名**
   - `class="modal"` → `class="modal-overlay"`
   - `class="modal-content large"` → `class="modal-container modal-xl"`

2. **标题样式**
   - 添加 `class="modal-title"`
   - 添加图标 `<i class="fas fa-info-circle"></i>`

3. **关闭按钮**
   - `class="close-btn"` → `class="modal-close-btn"`
   - 使用图标替代文本

4. **标签页**
   - 函数名从 `switchTab()` 改为 `switchDetailTab()` 避免冲突
   - 内容区域类名从 `tab-content` 改为 `tab-content-area`

5. **底部按钮**
   - 添加 `modal-footer` 和关闭按钮

### JavaScript（js/collection-task-management.js）

#### viewTaskDetail()
```javascript
function viewTaskDetail(taskId) {
    console.log('[采集任务] 查看任务详情:', taskId);
    
    currentTask = window.collectionTaskService.getById(taskId);
    
    // 更新标题（带图标）
    titleEl.innerHTML = `<i class="fas fa-info-circle"></i>${escapeHtml(currentTask.taskName)}`;
    
    // 显示模态框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    // 默认显示基本信息
    switchDetailTab('info');
}
```

#### closeTaskDetailModal()
```javascript
function closeTaskDetailModal() {
    const modal = document.getElementById('taskDetailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    currentTask = null;
}
```

#### switchDetailTab()
```javascript
function switchDetailTab(tab) {
    currentTab = tab;
    
    // 更新标签按钮状态（只针对详情模态框内的按钮）
    document.querySelectorAll('#taskDetailModal .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 设置当前标签为active
    const tabIndex = ['info', 'history', 'logs', 'stats'].indexOf(tab);
    if (tabIndex >= 0 && buttons[tabIndex]) {
        buttons[tabIndex].classList.add('active');
    }
    
    // 渲染标签内容
    const content = document.getElementById('tabContent');
    switch(tab) {
        case 'info': content.innerHTML = renderTaskInfo(); break;
        case 'history': content.innerHTML = renderTaskHistory(); break;
        case 'logs': content.innerHTML = renderTaskLogs(); break;
        case 'stats': content.innerHTML = renderTaskStats(); break;
    }
}
```

### CSS（css/collection-task-management.css）

新增样式：

#### 标签页样式
```css
.detail-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 2px solid #E5E7EB;
}

.detail-tabs .tab-btn {
    padding: 12px 20px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #6B7280;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: -2px;
}

.detail-tabs .tab-btn.active {
    color: #1E40AF;
    border-bottom-color: #1E40AF;
}
```

#### 统计网格
```css
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.stats-item {
    background: #F9FAFB;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
}
```

#### 历史表格
```css
.history-table {
    width: 100%;
    border-collapse: collapse;
}

.history-table thead {
    background: #F9FAFB;
}
```

#### 日志容器
```css
.log-container {
    background: #1e293b;
    color: #e2e8f0;
    padding: 16px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    max-height: 500px;
    overflow-y: auto;
}
```

## 功能特性

### 1. 四个标签页
- **基本信息**：显示任务的基本配置信息
- **执行历史**：显示任务的执行记录表格
- **执行日志**：显示任务的详细日志（终端风格）
- **统计信息**：显示任务的统计数据

### 2. 动态标题
- 查看详情：显示任务名称
- 查看日志：显示"任务名称 - 执行日志"

### 3. 响应式设计
- 桌面端：4列统计网格
- 平板端：2列统计网格
- 移动端：1列统计网格，标签页可横向滚动

### 4. 平滑动画
- 模态框淡入淡出
- 标签页切换无闪烁

## 标签页内容

### 基本信息（info）
显示任务的配置信息：
- 任务名称
- 任务类型
- 数据源
- 状态
- 调度配置
- 最大重试次数
- 创建时间
- 更新时间
- 查询语句/API路径（如果有）

### 执行历史（history）
显示任务的执行记录表格：
- 执行时间
- 状态
- 采集记录数
- 失败记录数
- 重试次数
- 执行方式（手动/自动）

### 执行日志（logs）
显示任务的详细日志：
- 终端风格显示
- 深色背景
- 等宽字体
- 时间戳
- 日志级别（SUCCESS/FAILED/RUNNING）
- 日志内容

### 统计信息（stats）
显示任务的统计数据：
- 总执行次数
- 成功次数（绿色）
- 失败次数（红色）
- 成功率
- 总采集记录数
- 平均每次采集

## 使用说明

### 查看任务详情
1. 点击任务行的"查看"按钮
2. 模态框打开，默认显示"基本信息"标签
3. 点击其他标签查看不同内容
4. 点击"关闭"按钮或遮罩层关闭模态框

### 查看任务日志
1. 点击任务行的"日志"按钮（如果有）
2. 模态框打开，直接显示"执行日志"标签
3. 可以切换到其他标签查看

## 样式特点

### 1. 与其他页面一致
- 使用相同的 `modal-overlay` 和 `modal-container`
- 使用相同的标题和关闭按钮样式
- 使用相同的底部按钮样式

### 2. 超大尺寸（modal-xl）
- 最大宽度1200px
- 适合显示详细信息和表格

### 3. 标签页设计
- 清晰的标签导航
- 活动标签有蓝色下划线
- 悬停效果

### 4. 内容区域
- 最小高度300px
- 自适应内容高度
- 日志区域可滚动

## 技术细节

### 函数重命名
为避免与其他模态框的标签页冲突，将函数名从 `switchTab()` 改为 `switchDetailTab()`。

### 选择器优化
使用 `#taskDetailModal .tab-btn` 确保只选择详情模态框内的标签按钮。

### 动态内容渲染
四个渲染函数保持不变：
- `renderTaskInfo()`
- `renderTaskHistory()`
- `renderTaskLogs()`
- `renderTaskStats()`

## 测试建议

### 测试查看详情
1. 点击任意任务的"查看"按钮
2. 确认模态框正常弹出
3. 确认默认显示"基本信息"标签
4. 依次点击四个标签，确认内容正确切换
5. 确认标签按钮的active状态正确
6. 点击"关闭"按钮，确认模态框正常关闭

### 测试响应式
1. 调整浏览器窗口大小
2. 确认统计网格在不同尺寸下正确显示
3. 确认标签页在移动端可以横向滚动
4. 确认表格在小屏幕下可以横向滚动

### 测试动画
1. 打开模态框，观察淡入效果
2. 关闭模态框，观察淡出效果
3. 切换标签，确认无闪烁

## 与其他页面的一致性

现在以下页面使用相同的模态框样式：
- ✅ 数据源管理（datasource-management.html）
- ✅ 主数据管理（master-data-management.html）
- ✅ 数据质量管理（data-quality-management.html）
- ✅ 采集任务管理 - 创建任务（collection-task-management.html）
- ✅ 采集任务管理 - 任务详情（collection-task-management.html）

## 状态
✅ HTML结构已更新
✅ JavaScript逻辑已更新
✅ CSS样式已添加
✅ 标签页功能正常
✅ 无语法错误
✅ 准备就绪

## 下一步
刷新页面，点击任务的"查看"按钮即可看到新的详情模态框样式。
