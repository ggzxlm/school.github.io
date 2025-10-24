# Dashboard数据显示问题调试指南

## 问题
Dashboard页面的待办事项和最近动态仍然不显示数据，且后台没有报错。

## 调试步骤

### 1. 打开浏览器控制台
1. 在Chrome/Edge中按 `F12` 或 `Ctrl+Shift+I`
2. 切换到 `Console` 标签页
3. 刷新dashboard.html页面

### 2. 查看控制台日志
应该能看到以下日志输出：

```
[Dashboard] 开始初始化
[Dashboard] 加载数据前，mockData.todos数量: 8
[Dashboard] 加载数据后，mockData.todos数量: X
[Dashboard] 加载数据后，mockData.alerts数量: X
[Dashboard] 加载数据后，mockData.activities数量: X
[Dashboard] 开始渲染待办列表，数据数量: X
[Dashboard] 开始渲染预警列表，数据数量: X
[Dashboard] 开始渲染时间线，数据数量: X
[Dashboard] 初始化完成
```

### 3. 根据日志判断问题

#### 情况A：看到"找不到xxx元素"错误
**问题**：HTML元素ID不匹配
**解决**：检查dashboard.html中的元素ID是否正确

#### 情况B：数据数量为0
**问题**：mockData被覆盖为空
**原因**：dataService返回了空数据
**解决**：需要修改loadData逻辑，保留mockData

#### 情况C：数据数量正常但页面不显示
**问题**：渲染逻辑有问题
**解决**：检查renderTodoList等方法的实现

#### 情况D：没有任何日志输出
**问题**：Dashboard.init()没有被调用
**解决**：检查页面底部的script标签顺序

### 4. 检查HTML元素
在控制台执行以下命令检查元素是否存在：

```javascript
console.log('todo-tbody:', document.getElementById('todo-tbody'));
console.log('alert-list:', document.getElementById('alert-list'));
console.log('timeline:', document.getElementById('timeline'));
console.log('stats-cards:', document.getElementById('stats-cards'));
```

如果返回null，说明元素不存在或ID不匹配。

### 5. 手动测试渲染
在控制台执行：

```javascript
// 测试待办列表渲染
Dashboard.renderTodoList();

// 测试预警列表渲染
Dashboard.renderAlertList();

// 测试时间线渲染
Dashboard.renderTimeline();

// 测试统计卡片渲染
Dashboard.renderStatsCards();
```

### 6. 检查mockData
在控制台执行：

```javascript
console.log('mockData.todos:', Dashboard.mockData.todos);
console.log('mockData.alerts:', Dashboard.mockData.alerts);
console.log('mockData.activities:', Dashboard.mockData.activities);
```

应该能看到完整的数据数组。

## 常见问题和解决方案

### 问题1：dataService覆盖了mockData
**症状**：加载数据后数量变为0
**解决**：修改loadData方法，只在dataService返回有效数据时才覆盖

```javascript
if (window.dataService && typeof window.dataService.getTodos === 'function') {
    const todos = await window.dataService.getTodos();
    // 只在有数据时才覆盖
    if (todos && todos.length > 0) {
        this.mockData.todos = todos.map(...);
    }
}
```

### 问题2：Utils未定义
**症状**：控制台报错 `Utils is not defined`
**解决**：确保common.js在dashboard.js之前加载

### 问题3：Modal未定义
**症状**：点击快捷操作按钮报错
**解决**：确保components.js已加载

### 问题4：页面加载顺序问题
**症状**：Dashboard对象未定义
**解决**：检查script标签顺序：
```html
<script src="js/common.js"></script>
<script src="js/components.js"></script>
<script src="js/mock-data.js"></script>
<script src="js/data-service.js"></script>
<script src="js/data-loader.js"></script>
<script src="js/dashboard.js"></script>
```

## 临时解决方案

如果问题仍然存在，可以在控制台手动初始化：

```javascript
// 强制使用mockData
Dashboard.mockData = {
    stats: [...], // 复制mockData定义
    todos: [...],
    alerts: [...],
    activities: [...]
};

// 重新渲染
Dashboard.renderStatsCards();
Dashboard.renderTodoList();
Dashboard.renderAlertList();
Dashboard.renderTimeline();
```

## 需要提供的调试信息

如果问题仍未解决，请提供：
1. 控制台的完整日志输出
2. 控制台的错误信息（如果有）
3. 执行检查命令的结果
4. 浏览器类型和版本

## 文件检查清单

- [ ] dashboard.html 存在且可访问
- [ ] js/dashboard.js 存在且正确加载
- [ ] js/common.js 存在且正确加载
- [ ] js/components.js 存在且正确加载
- [ ] HTML中的元素ID与JS中的ID匹配
- [ ] script标签顺序正确
- [ ] 没有JavaScript语法错误
- [ ] 浏览器控制台没有报错
