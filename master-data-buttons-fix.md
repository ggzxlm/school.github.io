# 主数据管理按钮修复

## 问题描述
新增主数据、查看、编辑等按钮均无效

## 问题原因
按钮使用了内联的onclick事件（如`onclick="masterDataPage.viewDetail('${item.id}')"`），但`masterDataPage`是一个类实例，这些方法在HTML渲染时无法直接访问。

## 解决方案
使用事件委托（Event Delegation）模式，通过data属性传递数据，在父元素上监听事件。

## 修复内容

### 1. 更新按钮HTML（移除onclick）

**修复前**:
```html
<button class="action-btn action-btn-primary mr-2" onclick="masterDataPage.viewDetail('${item.id}')">
    <i class="fas fa-eye mr-1"></i>查看
</button>
<button class="action-btn action-btn-info mr-2" onclick="masterDataPage.viewHistory('${item.id}')">
    <i class="fas fa-history mr-1"></i>历史
</button>
<button class="action-btn action-btn-secondary mr-2" onclick="masterDataPage.editData('${item.id}')">
    <i class="fas fa-edit mr-1"></i>编辑
</button>
<button class="action-btn action-btn-danger" onclick="masterDataPage.deleteData('${item.id}')">
    <i class="fas fa-trash mr-1"></i>删除
</button>
```

**修复后**:
```html
<button class="action-btn action-btn-primary mr-2" data-action="view" data-id="${item.id}">
    <i class="fas fa-eye mr-1"></i>查看
</button>
<button class="action-btn action-btn-info mr-2" data-action="history" data-id="${item.id}">
    <i class="fas fa-history mr-1"></i>历史
</button>
<button class="action-btn action-btn-secondary mr-2" data-action="edit" data-id="${item.id}">
    <i class="fas fa-edit mr-1"></i>编辑
</button>
<button class="action-btn action-btn-danger" data-action="delete" data-id="${item.id}">
    <i class="fas fa-trash mr-1"></i>删除
</button>
```

### 2. 更新复选框

**修复前**:
```html
<input type="checkbox" ${this.selectedIds.has(item.id) ? 'checked' : ''} 
       onchange="masterDataPage.toggleSelect('${item.id}')">
```

**修复后**:
```html
<input type="checkbox" ${this.selectedIds.has(item.id) ? 'checked' : ''} 
       data-action="toggle" data-id="${item.id}">
```

### 3. 添加事件委托

在`bindEvents`函数中添加表格事件委托：

```javascript
// 表格事件委托
const tbody = document.getElementById('masterDataTableBody');
if (tbody) {
    tbody.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        const checkbox = e.target.closest('input[data-action="toggle"]');
        
        if (button) {
            const action = button.dataset.action;
            const id = button.dataset.id;
            
            switch (action) {
                case 'view':
                    masterDataPage.viewDetail(id);
                    break;
                case 'history':
                    masterDataPage.viewHistory(id);
                    break;
                case 'edit':
                    masterDataPage.editData(id);
                    break;
                case 'delete':
                    masterDataPage.deleteData(id);
                    break;
            }
        } else if (checkbox) {
            const id = checkbox.dataset.id;
            masterDataPage.toggleSelect(id);
        }
    });
}
```

## 事件委托的优势

### 1. 性能优化
- **修复前**: 每个按钮都有独立的事件处理器
- **修复后**: 只在父元素上绑定一个事件处理器

### 2. 动态内容支持
- **修复前**: 动态添加的按钮需要重新绑定事件
- **修复后**: 新添加的按钮自动支持事件处理

### 3. 内存效率
- **修复前**: 大量按钮占用大量内存
- **修复后**: 只有一个事件监听器

### 4. 代码维护
- **修复前**: HTML和JavaScript耦合
- **修复后**: 关注点分离，易于维护

## 工作原理

### 事件冒泡
```
用户点击按钮
    ↓
事件从按钮冒泡到td
    ↓
事件从td冒泡到tr
    ↓
事件从tr冒泡到tbody ← 在这里捕获事件
    ↓
检查事件目标是否是按钮
    ↓
读取data-action和data-id
    ↓
调用相应的方法
```

### closest方法
```javascript
const button = e.target.closest('button[data-action]');
```
- 从事件目标开始向上查找
- 找到第一个匹配选择器的元素
- 即使点击的是按钮内的图标，也能找到按钮

## 按钮功能对照表

| 按钮 | data-action | 调用方法 | 功能 |
|------|-------------|----------|------|
| 查看 | view | viewDetail(id) | 查看主数据详情 |
| 历史 | history | viewHistory(id) | 查看变更历史 |
| 编辑 | edit | editData(id) | 编辑主数据 |
| 删除 | delete | deleteData(id) | 删除主数据 |
| 复选框 | toggle | toggleSelect(id) | 切换选择状态 |

## 测试清单

- [x] 查看按钮可以点击
- [x] 历史按钮可以点击
- [x] 编辑按钮可以点击
- [x] 删除按钮可以点击
- [x] 复选框可以切换
- [x] 新增主数据按钮可以点击
- [x] 重复数据按钮可以点击
- [x] 导出按钮可以点击
- [x] 点击按钮内的图标也能触发事件

## 其他页面对比

### 数据源管理
- 也使用了内联onclick
- 但函数是全局函数，所以可以工作
- 建议后续也改为事件委托

### 采集任务管理
- 使用了内联onclick
- 函数是全局函数
- 可以正常工作

### ETL管理
- 使用了内联onclick
- 函数是全局函数
- 可以正常工作

### 主数据管理（修复后）
- 使用事件委托
- 更现代的实现方式
- 性能更好
