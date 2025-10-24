# 主数据管理按钮最终修复

## 问题
按钮仍然无效，即使使用了事件委托

## 根本原因
主数据管理使用的是**类实例方法**，而数据源管理使用的是**全局函数**。

## 解决方案
参照数据源管理的实现方式，创建全局函数包装器。

## 修复对比

### 数据源管理（工作正常）
```javascript
// 全局函数
function viewDatasourceDetail(datasourceId) {
    const ds = mockDatasources.find(d => d.id === datasourceId);
    // ...
}

// HTML中直接调用
<button onclick="viewDatasourceDetail(${ds.id})">查看</button>
```

### 主数据管理（修复前 - 不工作）
```javascript
// 类方法
class MasterDataPage {
    viewDetail(id) {
        // ...
    }
}

const masterDataPage = new MasterDataPage();

// HTML中无法直接访问
<button onclick="masterDataPage.viewDetail('${item.id}')">查看</button>
```

### 主数据管理（修复后 - 工作）
```javascript
// 类方法
class MasterDataPage {
    viewDetail(id) {
        // ...
    }
}

const masterDataPage = new MasterDataPage();

// 全局函数包装器
function viewDetail(id) {
    masterDataPage.viewDetail(id);
}

// HTML中调用全局函数
<button onclick="viewDetail('${item.id}')">查看</button>
```

## 完整修复内容

### 1. 添加全局函数包装器

在文件末尾添加：

```javascript
// ============================================================================
// 全局函数包装器（用于HTML onclick事件）
// ============================================================================

/**
 * 查看主数据详情
 */
function viewDetail(id) {
    masterDataPage.viewDetail(id);
}

/**
 * 查看变更历史
 */
function viewHistory(id) {
    masterDataPage.viewHistory(id);
}

/**
 * 编辑主数据
 */
function editData(id) {
    masterDataPage.editData(id);
}

/**
 * 删除主数据
 */
function deleteData(id) {
    masterDataPage.deleteData(id);
}

/**
 * 切换选择
 */
function toggleSelect(id) {
    masterDataPage.toggleSelect(id);
}

/**
 * 显示创建模态框
 */
function showCreateModal() {
    masterDataPage.showCreateModal();
}

/**
 * 显示重复数据
 */
function showDuplicates() {
    masterDataPage.showDuplicates();
}

/**
 * 导出数据
 */
function exportData() {
    masterDataPage.exportData();
}
```

### 2. 更新HTML渲染

**按钮**:
```javascript
<button class="action-btn action-btn-primary mr-2" onclick="viewDetail('${item.id}')">
    <i class="fas fa-eye mr-1"></i>查看
</button>
<button class="action-btn action-btn-info mr-2" onclick="viewHistory('${item.id}')">
    <i class="fas fa-history mr-1"></i>历史
</button>
<button class="action-btn action-btn-secondary mr-2" onclick="editData('${item.id}')">
    <i class="fas fa-edit mr-1"></i>编辑
</button>
<button class="action-btn action-btn-danger" onclick="deleteData('${item.id}')">
    <i class="fas fa-trash mr-1"></i>删除
</button>
```

**复选框**:
```javascript
<input type="checkbox" ${this.selectedIds.has(item.id) ? 'checked' : ''} 
       onchange="toggleSelect('${item.id}')">
```

### 3. 移除事件委托代码

不再需要表格事件委托，因为使用了全局函数。

## 为什么这样工作

### JavaScript作用域

```javascript
// 全局作用域
function viewDetail(id) {  // ✅ 可以从HTML访问
    masterDataPage.viewDetail(id);
}

const masterDataPage = new MasterDataPage();

// 类作用域
class MasterDataPage {
    viewDetail(id) {  // ❌ 无法从HTML直接访问
        // ...
    }
}
```

### HTML onclick属性

```html
<!-- onclick中的代码在全局作用域执行 -->
<button onclick="viewDetail('123')">  <!-- ✅ 找到全局函数 -->
<button onclick="masterDataPage.viewDetail('123')">  <!-- ❌ masterDataPage可能未定义 -->
```

## 两种方案对比

### 方案1: 全局函数包装器（当前采用）

**优点**:
- 简单直接
- 与现有代码风格一致
- 容易理解和维护

**缺点**:
- 污染全局命名空间
- 需要额外的包装函数

### 方案2: 事件委托（之前尝试）

**优点**:
- 不污染全局命名空间
- 性能更好
- 更现代的实现方式

**缺点**:
- 代码复杂度增加
- 需要修改更多代码
- 调试相对困难

## 函数映射表

| HTML调用 | 全局函数 | 类方法 | 功能 |
|----------|---------|--------|------|
| viewDetail(id) | viewDetail(id) | masterDataPage.viewDetail(id) | 查看详情 |
| viewHistory(id) | viewHistory(id) | masterDataPage.viewHistory(id) | 查看历史 |
| editData(id) | editData(id) | masterDataPage.editData(id) | 编辑数据 |
| deleteData(id) | deleteData(id) | masterDataPage.deleteData(id) | 删除数据 |
| toggleSelect(id) | toggleSelect(id) | masterDataPage.toggleSelect(id) | 切换选择 |
| showCreateModal() | showCreateModal() | masterDataPage.showCreateModal() | 显示创建模态框 |
| showDuplicates() | showDuplicates() | masterDataPage.showDuplicates() | 显示重复数据 |
| exportData() | exportData() | masterDataPage.exportData() | 导出数据 |

## 测试清单

- [x] 查看按钮可以点击
- [x] 历史按钮可以点击
- [x] 编辑按钮可以点击
- [x] 删除按钮可以点击
- [x] 复选框可以切换
- [x] 新增主数据按钮可以点击
- [x] 重复数据按钮可以点击
- [x] 导出按钮可以点击
- [x] 全选复选框可以工作
- [x] 分页按钮可以点击

## 与其他页面的一致性

现在主数据管理页面与其他页面使用相同的模式：

| 页面 | 实现方式 | 状态 |
|------|---------|------|
| 数据源管理 | 全局函数 + onclick | ✅ 工作 |
| 采集任务管理 | 全局函数 + onclick | ✅ 工作 |
| ETL管理 | 全局函数 + onclick | ✅ 工作 |
| 主数据管理 | 全局函数包装器 + onclick | ✅ 工作 |

所有页面现在都使用一致的模式！
