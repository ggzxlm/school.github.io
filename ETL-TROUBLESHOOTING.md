# ETL数据问题排查指南

## 问题：前台没有显示数据

如果ETL管理页面显示"暂无符合条件的ETL作业"，请按以下步骤排查和修复。

## 快速修复方法

### 方法1：使用修复工具（推荐）

1. 打开 `fix-etl-data.html` 页面
2. 查看当前状态
3. 点击"修复数据"按钮
4. 等待修复完成
5. 打开 `etl-management.html` 查看数据

### 方法2：使用浏览器控制台

1. 打开 `etl-management.html` 页面
2. 按 F12 打开开发者工具
3. 切换到 Console（控制台）标签
4. 运行以下命令：

```javascript
// 检查服务是否存在
console.log('ETL服务:', window.etlService);

// 检查当前数据
console.log('当前作业数:', window.etlService.getAll().length);

// 如果没有数据，强制初始化
localStorage.removeItem('etl_jobs');
localStorage.removeItem('etl_executions');
localStorage.removeItem('etl_versions');
window.etlService = new ETLService();

// 验证数据
console.log('修复后作业数:', window.etlService.getAll().length);

// 重新加载页面数据
loadJobs();
```

### 方法3：在ETL管理页面直接操作

1. 打开 `etl-management.html` 页面
2. 点击右上角的"重新加载演示数据"按钮
3. 确认操作
4. 等待数据加载完成

## 详细排查步骤

### 1. 检查服务是否加载

打开浏览器控制台，输入：
```javascript
window.etlService
```

**预期结果**: 应该显示 ETLService 对象
**如果显示 undefined**: 说明 `etl-service.js` 没有正确加载

### 2. 检查数据是否存在

```javascript
window.etlService.getAll()
```

**预期结果**: 应该返回包含12个作业的数组
**如果返回空数组**: 说明数据没有初始化

### 3. 检查 localStorage

```javascript
JSON.parse(localStorage.getItem('etl_jobs'))
```

**预期结果**: 应该显示作业数据数组
**如果为 null 或空数组**: 说明数据没有保存到 localStorage

### 4. 查看初始化日志

在控制台中查找以下日志：
- `[ETL服务] 初始化检查`
- `[ETL服务] 首次初始化，创建演示数据`
- `[ETL服务] 演示数据创建完成`

如果没有看到这些日志，说明初始化过程有问题。

## 常见问题

### Q1: 为什么数据没有自动初始化？

**可能原因**:
1. localStorage 中已经有空数据（之前清空过但没有重新初始化）
2. 脚本加载顺序问题
3. 浏览器禁用了 localStorage

**解决方法**:
使用修复工具或手动清空 localStorage 后刷新页面

### Q2: 点击"重新加载演示数据"没有反应

**可能原因**:
1. Modal 或 Toast 组件没有正确加载
2. JavaScript 错误阻止了执行

**解决方法**:
1. 检查浏览器控制台是否有错误
2. 使用修复工具页面进行修复

### Q3: 数据显示0条

**可能原因**:
1. 筛选条件过滤了所有数据
2. 数据确实为空

**解决方法**:
1. 点击"重置"按钮清空筛选条件
2. 使用修复工具重新初始化数据

## 测试工具

项目提供了多个测试工具帮助排查问题：

### 1. fix-etl-data.html
- 可视化的修复工具
- 显示当前状态
- 一键修复数据
- 查看详细日志

### 2. simple-etl-test.html
- 简单的功能测试页面
- 5个测试用例
- 适合快速验证功能

### 3. test-etl-data.html
- 完整的数据展示页面
- 显示所有作业详情
- 支持重新加载和清空

### 4. debug-etl.html
- 调试专用页面
- 详细的数据检查
- 适合开发调试

## 预防措施

1. **不要手动清空 localStorage**
   如果需要清空，请使用"重新加载演示数据"功能

2. **确保脚本加载顺序**
   在 HTML 中，`etl-service.js` 必须在 `etl-management.js` 之前加载

3. **检查浏览器兼容性**
   确保浏览器支持 localStorage 和 ES6 语法

4. **定期备份数据**
   如果有重要的自定义数据，建议导出备份

## 技术支持

如果以上方法都无法解决问题，请：

1. 打开浏览器控制台
2. 复制所有错误信息
3. 记录操作步骤
4. 联系技术支持

## 相关文件

- `js/etl-service.js` - ETL服务核心代码
- `js/etl-management.js` - ETL管理页面代码
- `etl-management.html` - ETL管理页面
- `fix-etl-data.html` - 数据修复工具
- `ETL-SAMPLE-DATA-GUIDE.md` - 演示数据说明
- `ETL-DATA-UPDATE.md` - 更新说明
