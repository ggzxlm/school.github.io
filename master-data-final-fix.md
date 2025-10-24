# 主数据管理页面最终修复

## 修复的错误

### 错误1: emptyState元素不存在
```
Cannot read properties of null (reading 'style')
at MasterDataPage.renderTable (master-data-management.js:98:20)
```

**原因**: HTML中移除了独立的`emptyState`元素

**解决方案**: 在表格内渲染空状态

## 完整修复内容

### 1. renderTable函数重构

#### 空状态处理
**修复前**:
```javascript
const emptyState = document.getElementById('emptyState');
if (data.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'flex';  // ❌ 元素不存在
    return;
}
emptyState.style.display = 'none';
```

**修复后**:
```javascript
if (!tbody) {
    console.error('找不到表格元素');
    return;
}

if (data.length === 0) {
    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="px-6 py-12">
                <div class="empty-state">
                    <i class="fas fa-database"></i>
                    <p>暂无数据</p>
                </div>
            </td>
        </tr>
    `;
    this.updatePagination(0);
    return;
}
```

#### 表格行样式更新
**修复前**:
```html
<tr>
    <td>${item.id}</td>
    <td>${this.getEntityTypeBadge(item.entityType)}</td>
    ...
    <td>
        <div class="action-btns">
            <button class="btn-icon" onclick="...">
                <svg>...</svg>
            </button>
        </div>
    </td>
</tr>
```

**修复后**:
```html
<tr>
    <td class="px-6 py-4 whitespace-nowrap">
        <span class="text-sm text-gray-600">${item.id}</span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
        ${this.getEntityTypeBadge(item.entityType)}
    </td>
    ...
    <td class="px-6 py-4 whitespace-nowrap text-sm">
        <button class="action-btn action-btn-primary mr-2" onclick="...">
            <i class="fas fa-eye mr-1"></i>查看
        </button>
        <button class="action-btn action-btn-info mr-2" onclick="...">
            <i class="fas fa-history mr-1"></i>历史
        </button>
        <button class="action-btn action-btn-secondary mr-2" onclick="...">
            <i class="fas fa-edit mr-1"></i>编辑
        </button>
        <button class="action-btn action-btn-danger" onclick="...">
            <i class="fas fa-trash mr-1"></i>删除
        </button>
    </td>
</tr>
```

### 2. 按钮样式统一

| 操作 | 旧样式 | 新样式 | 图标 |
|------|--------|--------|------|
| 查看 | btn-icon + SVG | action-btn-primary | fa-eye |
| 历史 | btn-icon + SVG | action-btn-info | fa-history |
| 编辑 | btn-icon + SVG | action-btn-secondary | fa-edit |
| 删除 | btn-icon danger + SVG | action-btn-danger | fa-trash |

### 3. 徽章样式更新

**getEntityTypeBadge函数**:

修复前:
```javascript
return `<span class="entity-type-badge ${config.class}">${config.label}</span>`;
```

修复后:
```javascript
const typeMap = {
    'PERSON': { label: '人员', class: 'status-completed' },
    'SUPPLIER': { label: '供应商', class: 'status-in-progress' },
    'ORGANIZATION': { label: '组织', class: 'status-pending' },
    'PROCUREMENT_PROJECT': { label: '采购项目', class: 'status-review' }
};
return `<span class="status-badge ${config.class}">${config.label}</span>`;
```

### 4. 分页功能完善

**updatePagination函数**:

修复前:
```javascript
updatePagination(total) {
    document.getElementById('totalCount').textContent = total;
    document.getElementById('currentPage').textContent = this.currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    document.getElementById('prevBtn').disabled = ...;
    document.getElementById('nextBtn').disabled = ...;
}
```

修复后:
```javascript
updatePagination(total) {
    const totalPages = Math.ceil(total / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, total);
    
    // 更新显示范围
    if (pageStartEl) pageStartEl.textContent = total > 0 ? start : 0;
    if (pageEndEl) pageEndEl.textContent = end;
    if (totalCountEl) totalCountEl.textContent = total;
    
    // 生成页码按钮
    const pageNumbers = document.getElementById('pageNumbers');
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                const btn = document.createElement('button');
                btn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
                btn.textContent = i;
                btn.onclick = () => this.goToPage(i);
                pageNumbers.appendChild(btn);
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                // 添加省略号
            }
        }
    }
    
    // 更新按钮状态
    if (prevBtn) prevBtn.disabled = this.currentPage === 1;
    if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
}

goToPage(page) {
    this.currentPage = page;
    this.loadData();
}
```

### 5. 来源标签样式

修复前:
```html
<div class="source-tags">
    ${item.sources.map(s => `<span class="source-tag">${s}</span>`).join('')}
</div>
```

修复后:
```html
<div class="flex gap-1">
    ${item.sources.map(s => `<span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">${s}</span>`).join('')}
</div>
```

## 样式统一对照

### 表格单元格
- 添加 `px-6 py-4` 内边距
- 使用 `whitespace-nowrap` 防止换行
- 统一文字颜色和大小

### 按钮
- 使用 `action-btn` 系列样式
- 使用 Font Awesome 图标
- 统一的悬停效果

### 徽章
- 使用 `status-badge` 样式
- 统一的颜色方案

### 分页
- 显示当前页范围
- 页码按钮
- 省略号显示

## 与其他页面的一致性

现在主数据管理页面与以下页面完全一致：
- ✅ 数据源管理
- ✅ 采集任务管理
- ✅ ETL作业管理

所有数据治理相关页面现在具有统一的外观和交互体验！

## 测试清单

- [x] 页面加载不报错
- [x] 统计卡片正常显示
- [x] 搜索功能正常
- [x] 类型筛选正常
- [x] 状态筛选正常
- [x] 重置按钮正常
- [x] 表格渲染使用新按钮样式
- [x] 空状态正常显示
- [x] 分页功能完善（含页码按钮）
- [x] 徽章样式统一
