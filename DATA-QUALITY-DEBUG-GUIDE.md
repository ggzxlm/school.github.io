# 数据质量管理页面调试指南

## 问题现象
- 统计数字显示正常（20、96.4、20、13）
- 但质量规则、检查历史、质量工单列表都是空的

## 调试步骤

### 1. 打开浏览器开发者工具
- 按 F12 或右键点击"检查"
- 切换到 Console（控制台）标签

### 2. 查看控制台日志
应该看到以下日志输出：
```
[数据质量] 开始初始化
[数据质量] 服务初始化完成
[数据质量] 统计数据更新完成
[数据质量] 切换到dashboard标签页
[数据质量] 事件绑定完成
```

### 3. 点击"质量规则"标签
应该看到：
```
[数据质量] 切换标签页: rules
[数据质量] 标签页内容已显示: rules
[数据质量] 加载规则列表
[数据质量] dataQualityService: DataQualityService {rules: Array(20), checks: Array(20), tickets: Array(15), initialized: true}
[数据质量] dataQualityService.initialized: true
[数据质量] dataQualityService.rules: Array(20)
[数据质量] 规则数量: 20
[数据质量] 规则数据: Array(20)
[数据质量] 开始渲染规则表格
```

### 4. 使用测试页面
打开 `test-data-quality-service.html` 进行独立测试：
- 这个页面会单独测试数据服务
- 显示详细的测试结果
- 帮助定位问题所在

### 5. 手动测试数据服务
在浏览器控制台中输入以下命令：

```javascript
// 检查服务是否存在
console.log('dataQualityService:', dataQualityService);

// 检查初始化状态
console.log('initialized:', dataQualityService.initialized);

// 检查数据数组
console.log('rules:', dataQualityService.rules);
console.log('checks:', dataQualityService.checks);
console.log('tickets:', dataQualityService.tickets);

// 获取数据
console.log('getRules():', dataQualityService.getRules());
console.log('getChecks():', dataQualityService.getChecks());
console.log('getTickets():', dataQualityService.getTickets());

// 获取统计
console.log('getStatistics():', dataQualityService.getStatistics());
```

## 可能的问题和解决方案

### 问题1: 服务未初始化
**症状**: `dataQualityService.initialized` 为 `false`

**解决方案**:
```javascript
// 手动初始化
await dataQualityService.initialize();
```

### 问题2: 数据数组为空
**症状**: `dataQualityService.rules.length` 为 0

**解决方案**:
- 检查 `loadMockData()` 方法是否正确执行
- 检查是否有JavaScript错误阻止了数据加载

### 问题3: 页面元素找不到
**症状**: 控制台显示 "找不到rulesTableBody元素"

**解决方案**:
- 检查HTML中是否有 `id="rulesTableBody"` 的元素
- 确认标签页切换时元素是否可见

### 问题4: 缓存问题
**症状**: 修改代码后没有生效

**解决方案**:
- 硬刷新页面：Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)
- 清除浏览器缓存
- 在开发者工具的 Network 标签中勾选 "Disable cache"

## 验证数据是否正确加载

### 方法1: 查看统计数字
如果统计数字显示正确（20、96.4、20、13），说明：
- ✅ 数据服务已初始化
- ✅ 数据已加载
- ✅ `getStatistics()` 方法工作正常

### 方法2: 检查数组长度
在控制台输入：
```javascript
dataQualityService.rules.length  // 应该是 20
dataQualityService.checks.length // 应该是 20
dataQualityService.tickets.length // 应该是 15
```

### 方法3: 检查第一条数据
```javascript
dataQualityService.rules[0]  // 应该显示第一条规则的详细信息
```

## 常见错误信息

### "dataQualityService is not defined"
- 原因: `data-quality-service.js` 未加载或加载失败
- 解决: 检查HTML中的script标签，确认文件路径正确

### "Cannot read property 'length' of undefined"
- 原因: 数据数组未初始化
- 解决: 确保调用了 `initialize()` 方法

### "tbody is null"
- 原因: DOM元素不存在或未加载
- 解决: 确保在DOM加载完成后再调用方法

## 强制重新加载数据

如果数据没有显示，可以在控制台手动重新加载：

```javascript
// 重新初始化服务
dataQualityService.initialized = false;
await dataQualityService.initialize();

// 重新加载页面数据
dataQualityPage.updateStatistics();
dataQualityPage.loadRules();
dataQualityPage.loadChecks();
dataQualityPage.loadTickets();
```

## 检查HTML结构

确认HTML中有以下元素：

```html
<!-- 质量规则表格 -->
<tbody id="rulesTableBody"></tbody>

<!-- 检查历史表格 -->
<tbody id="checksTableBody"></tbody>

<!-- 质量工单表格 -->
<tbody id="ticketsTableBody"></tbody>
```

## 联系支持

如果以上方法都无法解决问题，请提供：
1. 浏览器控制台的完整日志
2. Network标签中的请求列表
3. 浏览器版本信息
4. 操作系统信息

## 快速修复

如果急需查看数据，可以临时使用以下代码直接渲染：

```javascript
// 在控制台执行
const rules = dataQualityService.getRules();
console.table(rules);  // 以表格形式显示所有规则
```

这样可以在控制台中查看所有数据，即使页面显示有问题。
