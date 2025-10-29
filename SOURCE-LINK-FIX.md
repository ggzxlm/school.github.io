# 来源追溯跳转链接修复

## 问题描述
点击待办详情中"来源追溯"部分的"查看"按钮后，打开的页面不正确：
- 预警类型跳转到了监督指挥中心（command-center.html）
- 应该跳转到预警中心（alert-center.html）并显示具体预警详情

## 解决方案

### 更新viewSourceDetail函数
修改了`js/dashboard.js`中的URL映射：

**修改前：**
```javascript
const urlMap = {
    'alert': 'command-center.html',  // ❌ 错误：跳转到监督指挥中心
    'clue': `clue-library.html?id=${id}`,
    'workorder': `work-order.html?id=${id}`,
    'rectification': `rectification.html?id=${id}`
};
```

**修改后：**
```javascript
const urlMap = {
    'alert': `alert-center.html?id=${id}`,  // ✅ 正确：跳转到预警中心并传递ID
    'clue': `clue-library.html?id=${id}`,
    'workorder': `work-order.html?id=${id}`,
    'rectification': `rectification.html?id=${id}`
};
```

## 跳转规则

### 1. 预警（alert）
- **目标页面**：`alert-center.html`
- **参数**：`?id=预警ID`
- **示例**：`alert-center.html?id=ALERT2025001`
- **说明**：跳转到预警中心，显示具体预警详情

### 2. 线索（clue）
- **目标页面**：`clue-library.html`
- **参数**：`?id=线索ID`
- **示例**：`clue-library.html?id=CLUE2025001`
- **说明**：跳转到线索库，显示具体线索详情

### 3. 工单（workorder）
- **目标页面**：`work-order.html`
- **参数**：`?id=工单ID`
- **示例**：`work-order.html?id=WO202510210001`
- **说明**：跳转到工单管理，显示具体工单详情

### 4. 整改（rectification）
- **目标页面**：`rectification.html`
- **参数**：`?id=整改ID`
- **示例**：`rectification.html?id=ZG2025001`
- **说明**：跳转到整改管理，显示具体整改详情

## 页面验证

所有目标页面都已存在：
- ✅ `alert-center.html` - 预警中心
- ✅ `clue-library.html` - 线索库
- ✅ `work-order.html` - 工单管理
- ✅ `rectification.html` - 整改管理

## 使用方法

### 1. 强制刷新浏览器
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 2. 打开Dashboard页面
访问 `dashboard.html`

### 3. 查看待办详情
点击任意待办的"查看"按钮

### 4. 测试来源跳转
点击"来源追溯"部分的"查看"按钮，验证：
- 预警类型 → 跳转到预警中心
- 线索类型 → 跳转到线索库
- 工单类型 → 跳转到工单管理
- 整改类型 → 跳转到整改管理

## 测试用例

### 测试1：预警来源
1. 打开待办"审核科研经费报销单 - 张教授课题组"
2. 点击来源追溯的"查看"按钮
3. 应该跳转到：`alert-center.html?id=ALERT2025001`
4. 页面应该显示预警详情

### 测试2：整改来源
1. 打开待办"复查基建项目整改材料 - 图书馆改造工程"
2. 点击来源追溯的"查看"按钮
3. 应该跳转到：`rectification.html?id=ZG2025004`
4. 页面应该显示整改详情

### 测试3：线索来源
1. 打开待办"跟进学术不端行为调查"
2. 点击来源追溯的"查看"按钮
3. 应该跳转到：`clue-library.html?id=CLUE2025007`
4. 页面应该显示线索详情

### 测试4：工单来源
1. 打开待办"审批工单分配申请 - 三公经费超标核查"
2. 点击来源追溯的"查看"按钮
3. 应该跳转到：`work-order.html?id=WO202510210003`
4. 页面应该显示工单详情

## 技术说明

### 跳转方式
使用`window.open(url, '_blank')`在新标签页中打开目标页面

### 参数传递
通过URL查询参数传递ID：`?id=xxx`

### 目标页面处理
目标页面需要：
1. 从URL中获取ID参数
2. 根据ID加载对应的详情数据
3. 显示详情信息

示例代码：
```javascript
// 获取URL参数
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// 根据ID加载数据
if (id) {
    loadDetailById(id);
}
```

## 注意事项

1. **浏览器缓存**：更新后必须强制刷新
2. **页面存在性**：确保所有目标页面都存在
3. **参数处理**：目标页面需要正确处理ID参数
4. **数据加载**：目标页面需要根据ID加载对应数据

## 相关文件

- `js/dashboard.js` - viewSourceDetail函数（已更新）
- `dashboard.html` - 版本号已更新为v3.1
- `alert-center.html` - 预警中心页面
- `clue-library.html` - 线索库页面
- `work-order.html` - 工单管理页面
- `rectification.html` - 整改管理页面

## 后续优化

1. 在目标页面中实现ID参数的处理逻辑
2. 添加页面不存在时的错误处理
3. 添加返回按钮，方便用户返回待办列表
4. 考虑使用路由管理器统一管理页面跳转
5. 添加页面跳转的动画效果

## 常见问题

**Q: 点击"查看"按钮没有反应？**
A: 检查浏览器控制台是否有JavaScript错误，确保已强制刷新。

**Q: 跳转到的页面显示404？**
A: 检查目标页面文件是否存在，路径是否正确。

**Q: 跳转后页面没有显示详情？**
A: 目标页面需要实现ID参数的处理逻辑，根据ID加载对应数据。

**Q: 如何在新窗口中打开而不是新标签页？**
A: 修改`window.open`的第三个参数，添加窗口特性。

## 更新记录

- 2025-10-28 15:30 - 修复预警跳转链接，从command-center.html改为alert-center.html
- 2025-10-28 15:30 - 更新版本号为v3.1
