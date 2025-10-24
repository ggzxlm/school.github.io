# 采集任务管理 - 模态框样式更新

## 修改说明

已将采集任务管理页面的"新建任务"模态框更新为与数据源管理页面一致的样式。

## 修改内容

### HTML（collection-task-management.html）

#### 修改前
```html
<div id="createTaskModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>新建采集任务</h2>
            <button class="close-btn" onclick="closeCreateTaskModal()">&times;</button>
        </div>
```

#### 修改后
```html
<div id="createTaskModal" class="modal-overlay">
    <div class="modal-container modal-lg">
        <div class="modal-header">
            <h2 class="modal-title" id="createTaskModalTitle">
                <i class="fas fa-plus-circle"></i>新建采集任务
            </h2>
            <button class="modal-close-btn" onclick="closeCreateTaskModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
```

### 主要变更

1. **容器类名**
   - `class="modal"` → `class="modal-overlay"`
   - `class="modal-content"` → `class="modal-container modal-lg"`

2. **标题样式**
   - 添加 `class="modal-title"` 和 `id="createTaskModalTitle"`
   - 添加图标 `<i class="fas fa-plus-circle"></i>`

3. **关闭按钮**
   - `class="close-btn"` → `class="modal-close-btn"`
   - 使用图标 `<i class="fas fa-times"></i>` 替代 `&times;`

4. **表单样式**
   - 添加 `class="form-label"` 到所有label
   - 添加 `class="form-control"` 到所有input/select/textarea
   - 添加 `class="form-text"` 到提示文本
   - 添加 `class="form-row"` 实现两列布局
   - 必填字段添加 `class="required"`

5. **按钮样式**
   - 提交按钮添加 `id="submitTaskBtn"` 和图标

### JavaScript（js/collection-task-management.js）

#### showCreateTaskModal()
```javascript
function showCreateTaskModal() {
    console.log('[采集任务] 打开创建任务模态框');
    
    const modal = document.getElementById('createTaskModal');
    
    // 重置表单和标题
    form.reset();
    modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>新建采集任务';
    submitBtn.innerHTML = '<i class="fas fa-check"></i> 创建';
    
    // 显示模态框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}
```

#### closeCreateTaskModal()
```javascript
function closeCreateTaskModal() {
    const modal = document.getElementById('createTaskModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}
```

#### editTask()
```javascript
function editTask(taskId) {
    // 填充表单数据
    // ...
    
    // 更新标题
    modalTitle.innerHTML = '<i class="fas fa-edit"></i>编辑采集任务';
    
    // 更新按钮
    submitBtn.innerHTML = '<i class="fas fa-check"></i> 保存';
    submitBtn.onclick = function() {
        updateTask(taskId);
    };
    
    // 显示模态框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}
```

## 样式特点

### 与数据源管理页面保持一致

1. **模态框遮罩层**
   - 半透明黑色背景
   - 居中显示
   - 点击遮罩层可关闭（需要添加事件）

2. **模态框容器**
   - 白色背景
   - 圆角边框
   - 阴影效果
   - 最大宽度800px（modal-lg）

3. **标题栏**
   - 图标 + 文字
   - 蓝色图标
   - 关闭按钮悬停效果

4. **表单布局**
   - 清晰的标签和输入框
   - 两列布局（form-row）
   - 必填字段标记（红色星号）
   - 提示文本（灰色小字）

5. **底部按钮**
   - 右对齐
   - 取消按钮（灰色）
   - 提交按钮（蓝色，带图标）

## 表单字段

### 必填字段
- 任务名称
- 数据源
- 任务类型

### 可选字段
- 调度配置（Cron表达式）
- 查询语句/API路径
- 增量字段（仅增量采集时显示）
- 最大重试次数（默认3）
- 启用任务（默认勾选）

## 功能特性

### 1. 智能表单
- 根据任务类型自动显示/隐藏增量字段
- 表单验证（HTML5原生验证）
- 默认值设置

### 2. 模式切换
- 创建模式：标题"新建采集任务"，按钮"创建"
- 编辑模式：标题"编辑采集任务"，按钮"保存"

### 3. 动画效果
- 淡入淡出动画
- 平滑过渡效果

### 4. 用户反馈
- 控制台日志输出
- 操作成功/失败提示

## 使用说明

### 创建新任务
1. 点击"新建任务"按钮
2. 填写表单字段
3. 选择任务类型（会自动显示/隐藏相关字段）
4. 点击"创建"按钮

### 编辑任务
1. 点击任务行的"编辑"按钮
2. 表单自动填充现有数据
3. 修改需要更改的字段
4. 点击"保存"按钮

## CSS依赖

采集任务管理页面的CSS文件（`css/collection-task-management.css`）已包含所需样式：
- `.modal-overlay` - 模态框遮罩层
- `.modal-show` - 显示状态
- `.modal-container` - 模态框容器
- `.modal-lg` - 大尺寸模态框
- `.modal-header` - 标题栏
- `.modal-title` - 标题
- `.modal-close-btn` - 关闭按钮
- `.modal-body` - 主体内容
- `.modal-footer` - 底部按钮区
- `.form-group` - 表单组
- `.form-label` - 表单标签
- `.form-control` - 表单控件
- `.form-text` - 提示文本
- `.form-row` - 表单行（两列布局）

## 测试建议

### 测试创建功能
1. 点击"新建任务"按钮
2. 确认模态框正常弹出
3. 确认标题为"新建采集任务"
4. 填写所有必填字段
5. 切换任务类型，确认增量字段显示/隐藏正常
6. 点击"创建"按钮
7. 确认任务创建成功

### 测试编辑功能
1. 点击任意任务的"编辑"按钮
2. 确认模态框正常弹出
3. 确认标题为"编辑采集任务"
4. 确认表单自动填充现有数据
5. 修改部分字段
6. 点击"保存"按钮
7. 确认任务更新成功

### 测试关闭功能
1. 打开模态框
2. 点击关闭按钮（X）
3. 确认模态框正常关闭
4. 确认有淡出动画效果

## 与其他页面的一致性

现在以下页面使用相同的模态框样式：
- ✅ 数据源管理（datasource-management.html）
- ✅ 主数据管理（master-data-management.html）
- ✅ 数据质量管理（data-quality-management.html）
- ✅ 采集任务管理（collection-task-management.html）

## 状态
✅ HTML结构已更新
✅ JavaScript逻辑已更新
✅ CSS样式已存在
✅ 无语法错误
✅ 准备就绪

## 下一步
刷新页面即可看到新的模态框样式，与数据源管理页面保持一致。
