# 主数据管理JavaScript修复

## 修复的错误

### 错误信息
```
Cannot set properties of null (setting 'textContent')
at MasterDataPage.updateCounts (master-data-management.js:77:72)
```

### 问题原因
HTML中移除了 `procurementProjectCount` 元素（采购项目统计卡片），但JavaScript仍在尝试更新它。

## 修复内容

### 1. 更新统计函数（添加空值检查）

**修复前**:
```javascript
updateCounts() {
    const allData = masterDataService.getMasterData({});
    const personData = masterDataService.getMasterData({ entityType: 'PERSON' });
    const supplierData = masterDataService.getMasterData({ entityType: 'SUPPLIER' });
    const organizationData = masterDataService.getMasterData({ entityType: 'ORGANIZATION' });
    const procurementProjectData = masterDataService.getMasterData({ entityType: 'PROCUREMENT_PROJECT' });

    document.getElementById('allCount').textContent = allData.length;
    document.getElementById('personCount').textContent = personData.length;
    document.getElementById('supplierCount').textContent = supplierData.length;
    document.getElementById('organizationCount').textContent = organizationData.length;
    document.getElementById('procurementProjectCount').textContent = procurementProjectData.length; // ❌ 元素不存在
}
```

**修复后**:
```javascript
updateCounts() {
    const allData = masterDataService.getMasterData({});
    const personData = masterDataService.getMasterData({ entityType: 'PERSON' });
    const supplierData = masterDataService.getMasterData({ entityType: 'SUPPLIER' });
    const organizationData = masterDataService.getMasterData({ entityType: 'ORGANIZATION' });

    const allCountEl = document.getElementById('allCount');
    const personCountEl = document.getElementById('personCount');
    const supplierCountEl = document.getElementById('supplierCount');
    const organizationCountEl = document.getElementById('organizationCount');

    if (allCountEl) allCountEl.textContent = allData.length;
    if (personCountEl) personCountEl.textContent = personData.length;
    if (supplierCountEl) supplierCountEl.textContent = supplierData.length;
    if (organizationCountEl) organizationCountEl.textContent = organizationData.length;
}
```

**改进点**:
- 移除了采购项目相关代码
- 添加了空值检查（防御性编程）
- 先获取元素，再检查是否存在

### 2. 新增事件绑定函数

由于HTML中移除了内联事件处理（onclick），需要添加事件绑定：

```javascript
function bindEvents() {
    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => masterDataPage.handleSearch());
    }
    
    // 类型筛选（替代标签页）
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            masterDataPage.currentTab = e.target.value || 'all';
            masterDataPage.currentPage = 1;
            masterDataPage.loadData();
        });
    }
    
    // 状态筛选
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            masterDataPage.currentPage = 1;
            masterDataPage.loadData();
        });
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // 重置所有筛选条件
        });
    }
    
    // 其他按钮...
}
```

### 3. 更新loadData函数

添加状态筛选支持：

```javascript
async loadData() {
    try {
        const statusFilter = document.getElementById('statusFilter');
        const filters = {
            entityType: this.currentTab === 'all' ? null : this.currentTab.toUpperCase(),
            search: this.searchKeyword,
            status: statusFilter ? statusFilter.value : null  // 新增
        };

        const data = masterDataService.getMasterData(filters);
        
        // 更新统计
        this.updateCounts();
        
        // 渲染表格
        this.renderTable(data);
        
    } catch (error) {
        console.error('加载数据失败:', error);
        console.error(error);
    }
}
```

### 4. 标签页切换改为筛选器

**旧方式**（标签页）:
```html
<button class="tab-btn active" data-tab="all" onclick="masterDataPage.switchTab('all')">
    全部主数据
</button>
```

**新方式**（下拉筛选）:
```html
<select id="typeFilter" class="filter-select">
    <option value="">全部类型</option>
    <option value="PERSON">人员</option>
    <option value="SUPPLIER">供应商</option>
    <option value="ORGANIZATION">组织</option>
    <option value="PROCUREMENT_PROJECT">采购项目</option>
</select>
```

**JavaScript适配**:
```javascript
typeFilter.addEventListener('change', (e) => {
    masterDataPage.currentTab = e.target.value || 'all';
    masterDataPage.currentPage = 1;
    masterDataPage.loadData();
});
```

## 事件绑定对照表

| 功能 | 旧方式 | 新方式 |
|------|--------|--------|
| 搜索 | onkeyup | addEventListener('input') |
| 类型切换 | 标签页onclick | select change事件 |
| 状态筛选 | - | select change事件 |
| 重置 | - | button click事件 |
| 重复数据 | onclick | button click事件 |
| 导出 | onclick | button click事件 |
| 新增 | onclick | button click事件 |
| 全选 | onchange | checkbox change事件 |
| 分页 | onclick | button click事件 |

## 需要后续更新的功能

由于HTML结构变化，以下功能可能需要进一步调整：

1. **表格渲染** - 需要使用新的按钮样式（action-btn）
2. **分页控件** - 需要支持页码按钮
3. **switchTab函数** - 可以移除或简化
4. **模态框** - 需要更新为统一的模态框样式

## 测试清单

- [x] 页面加载不报错
- [x] 统计卡片正常显示
- [x] 搜索功能正常
- [x] 类型筛选正常
- [x] 状态筛选正常
- [x] 重置按钮正常
- [ ] 表格渲染需要更新按钮样式
- [ ] 分页功能需要完善
- [ ] 模态框需要更新样式
