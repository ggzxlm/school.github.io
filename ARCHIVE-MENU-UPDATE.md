# 归档查询菜单和按钮更新说明

## ✅ 已完成的更新

### 1. 侧边导航栏菜单

在 `js/components.js` 中的侧边导航栏配置中，添加了"整改归档查询"菜单项：

```javascript
{
    id: 'clue',
    icon: 'fa-lightbulb',
    text: '线索管理',
    children: [
        { id: 'alert-center', icon: 'fa-bell', text: '预警中心', link: 'alert-center.html' },
        { id: 'clue-library', icon: 'fa-folder-open', text: '线索库', link: 'clue-library.html' },
        { id: 'work-order', icon: 'fa-clipboard-list', text: '工单管理', link: 'work-order.html' },
        { id: 'rectification', icon: 'fa-tasks', text: '整改管理', link: 'rectification.html' },
        { id: 'rectification-archive', icon: 'fa-archive', text: '整改归档查询', link: 'rectification-archive.html' } // ⭐ 新增
    ]
}
```

**菜单位置**：线索管理 → 整改归档查询

### 2. 整改管理页面按钮

在 `rectification.html` 的页面操作区添加了"查看归档"按钮：

```html
<div class="page-actions">
    <button class="btn btn-secondary" onclick="window.location.href='rectification-archive.html'">
        <i class="fas fa-archive"></i>
        查看归档
    </button>
    <button class="btn btn-secondary" onclick="exportData()">
        <i class="fas fa-download"></i>
        导出
    </button>
    <button class="btn btn-secondary" onclick="refreshData()">
        <i class="fas fa-sync-alt"></i>
        刷新
    </button>
</div>
```

**按钮位置**：整改管理页面右上角

### 3. 销号归档成功提示

在 `js/rectification.js` 中优化了销号归档成功后的提示，添加了跳转按钮：

```javascript
// 显示归档成功提示（带跳转按钮）
function showArchiveSuccessToast() {
    const toast = document.createElement('div');
    toast.innerHTML = `
        <div>
            <div>销号归档成功</div>
            <div>整改任务已归档，可在归档查询中查看</div>
        </div>
        <button onclick="window.location.href='rectification-archive.html'">
            <i class="fas fa-archive"></i> 立即查看归档
        </button>
    `;
    // ...
}
```

**显示时机**：点击"销号归档"按钮并确认后

## 📊 功能入口总览

### 入口1：侧边导航栏
```
线索管理
  ├─ 预警中心
  ├─ 线索库
  ├─ 工单管理
  ├─ 整改管理
  └─ 整改归档查询 ⭐
```

### 入口2：整改管理页面
```
整改管理页面
  └─ 右上角操作区
      └─ [查看归档] 按钮 ⭐
```

### 入口3：销号归档提示
```
销号归档成功
  └─ [立即查看归档] 按钮 ⭐
```

## 🧪 测试方法

### 方法1：查看侧边导航栏
1. 打开任意页面（如 `rectification.html`）
2. 查看左侧导航栏
3. 展开"线索管理"分组
4. 确认是否有"整改归档查询"菜单项

### 方法2：查看整改管理页面按钮
1. 打开 `rectification.html`
2. 查看页面右上角
3. 确认是否有"查看归档"按钮
4. 点击按钮，验证是否跳转到归档查询页面

### 方法3：测试销号归档提示
1. 打开 `rectification.html`
2. 点击任意整改任务的"查看详情"
3. 点击"销号归档"按钮
4. 确认后查看是否显示带跳转按钮的提示
5. 点击"立即查看归档"，验证是否跳转

### 方法4：使用测试页面
打开 `test-archive-menu.html`，按照页面提示进行测试。

## 📝 修改的文件

1. ✅ `js/components.js` - 添加侧边导航栏菜单项
2. ✅ `rectification.html` - 添加"查看归档"按钮
3. ✅ `js/rectification.js` - 优化销号归档提示
4. 📝 `test-archive-menu.html` - 测试页面

## 🎨 UI效果

### 侧边导航栏
```
┌─────────────────────┐
│ 线索管理            │
│  ├─ 预警中心        │
│  ├─ 线索库          │
│  ├─ 工单管理        │
│  ├─ 整改管理        │
│  └─ 整改归档查询 ⭐ │
└─────────────────────┘
```

### 整改管理页面按钮
```
┌─────────────────────────────────────┐
│ 整改管理                             │
│                    [查看归档] ⭐     │
│                    [导出]            │
│                    [刷新]            │
└─────────────────────────────────────┘
```

### 销号归档提示
```
┌─────────────────────────────────┐
│ ✓ 销号归档成功                   │
│ 整改任务已归档，可在归档查询中查看 │
│                                  │
│ [📦 立即查看归档] ⭐             │
└─────────────────────────────────┘
```

## ✨ 用户体验优化

1. **多入口访问**：提供3个入口，方便用户从不同场景访问归档查询
2. **即时反馈**：销号归档成功后立即提供跳转入口
3. **清晰导航**：在侧边栏明确标识归档查询功能
4. **快捷操作**：在整改管理页面提供快速跳转按钮

## 🔄 后续优化建议

1. 在归档查询页面添加"返回整改管理"按钮
2. 在整改列表中为已归档的任务添加标识
3. 支持从归档查询页面直接跳转到原整改详情
4. 添加归档数量的实时统计显示

---

**更新时间**：2025-10-28  
**版本**：v1.0  
**状态**：✅ 已完成
