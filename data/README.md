# 模拟数据说明

## 概述

本目录包含系统的模拟数据文件，用于演示和测试系统功能。所有数据均为虚构，仅用于展示系统界面和交互流程。

## 数据文件

### mock-data.json

主要的模拟数据文件，包含以下数据类型：

#### 1. 用户数据 (users)
- 系统用户信息
- 包含用户名、姓名、部门、角色、状态等字段

#### 2. 线索数据 (clues)
- 监督线索信息
- 包含线索编号、标题、来源、风险等级、状态、涉及人员等字段

#### 3. 预警数据 (alerts)
- 系统预警信息
- 包含预警类型、风险等级、状态、涉及部门、金额等字段

#### 4. 工单数据 (workOrders)
- 核查工单信息
- 包含工单类型、优先级、状态、核查组成员、任务列表等字段

#### 5. 整改数据 (rectifications)
- 整改任务信息
- 包含整改计划、责任人、进度、里程碑、佐证材料等字段

#### 6. 统计数据 (dashboardStats)
- 工作台统计数据
- 包含待办、预警、整改、线索的数量和趋势

#### 7. 待办事项 (todos)
- 用户待办任务
- 包含任务类型、截止时间、优先级等字段

#### 8. 最近动态 (recentActivities)
- 系统操作记录
- 包含操作类型、操作人、操作时间等字段

#### 9. 指挥中心数据 (commandCenterStats, alertTrend, departmentRisk, etc.)
- 监督指挥大屏数据
- 包含预警趋势、部门风险排名、问题分类、整改进度等

#### 10. 监督数据 (disciplineSupervision, auditSupervision)
- 纪检监督和审计监督数据
- 包含各监督领域的统计和异常数据

#### 11. 系统管理数据 (departments, roles, dataSources, rules, auditLogs)
- 系统配置和管理数据
- 包含部门、角色、数据源、规则、日志等信息

#### 12. 报表数据 (reports)
- 报表列表信息
- 包含报表名称、类型、更新时间等字段

## 数据服务

### data-service.js

数据服务模块，提供以下功能：

1. **数据加载**: 从 JSON 文件加载模拟数据
2. **数据筛选**: 根据条件筛选数据
3. **数据排序**: 按指定字段排序
4. **数据分页**: 支持分页查询
5. **数据刷新**: 重新加载数据

### data-loader.js

数据加载器工具，为各页面提供便捷的数据加载方法：

- `loadDashboardData()`: 加载工作台数据
- `loadClueLibraryData()`: 加载线索库数据
- `loadAlertCenterData()`: 加载预警中心数据
- `loadWorkOrderData()`: 加载工单管理数据
- `loadRectificationData()`: 加载整改管理数据
- `loadCommandCenterData()`: 加载指挥中心数据
- `loadDisciplineSupervisionData()`: 加载纪检监督数据
- `loadAuditSupervisionData()`: 加载审计监督数据
- `loadSystemManagementData()`: 加载系统管理数据
- `loadReportCenterData()`: 加载报表中心数据

## 使用方法

### 1. 在页面中引入脚本

```html
<script src="js/data-service.js"></script>
<script src="js/data-loader.js"></script>
```

### 2. 使用数据服务

```javascript
// 获取线索列表
const result = await window.dataService.getClues(
    { status: 'pending', riskLevel: 'high' },  // 筛选条件
    { field: 'createTime', order: 'desc' },     // 排序
    { page: 1, pageSize: 10 }                   // 分页
);

console.log(result.data);  // 线索数据
console.log(result.total); // 总数
```

### 3. 使用数据加载器

```javascript
// 加载工作台数据
await DataLoader.loadDashboardData((data) => {
    console.log(data.stats);      // 统计数据
    console.log(data.todos);      // 待办事项
    console.log(data.alerts);     // 预警列表
    console.log(data.activities); // 最近动态
});
```

## 数据更新

如需修改或添加模拟数据，请编辑 `mock-data.json` 文件。修改后刷新页面即可看到更新。

## 注意事项

1. 所有数据均为虚构，仅用于演示
2. 数据文件采用 JSON 格式，请确保格式正确
3. 修改数据时注意保持数据结构的一致性
4. 时间格式统一使用 `YYYY-MM-DD HH:mm:ss`
5. 金额字段使用数字类型，不包含千分位分隔符

## 扩展数据

如需添加新的数据类型：

1. 在 `mock-data.json` 中添加新的数据字段
2. 在 `data-service.js` 中添加对应的获取方法
3. 在 `data-loader.js` 中添加对应的加载方法（可选）
4. 在页面 JavaScript 中调用新方法加载数据

## 示例

### 筛选高风险线索

```javascript
const highRiskClues = await window.dataService.getClues({
    riskLevel: 'high',
    status: 'pending'
});
```

### 分页查询预警

```javascript
const page1 = await window.dataService.getAlerts(
    {},
    { field: 'createTime', order: 'desc' },
    { page: 1, pageSize: 10 }
);
```

### 搜索用户

```javascript
const users = await window.dataService.getUsers({
    search: '张三',
    department: '纪检监察室'
});
```
