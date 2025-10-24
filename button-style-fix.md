# 采集任务管理按钮样式修复

## 修复前后对比

### 修复前
```javascript
// 混合了多种按钮样式
<button class="action-btn action-btn-success">执行</button>
<button class="action-btn action-btn-primary">详情</button>
<button class="btn btn-secondary btn-sm">禁用</button>  // 旧样式
<button class="btn btn-danger btn-sm">删除</button>     // 旧样式
```

### 修复后
```javascript
// 统一使用 action-btn 样式，与数据源管理一致
<button class="action-btn action-btn-primary">查看</button>
<button class="action-btn action-btn-success">执行</button>
<button class="action-btn action-btn-warning">停止</button>
<button class="action-btn action-btn-secondary">编辑</button>
<button class="action-btn action-btn-danger">删除</button>
```

## 按钮样式统一

### 数据源管理页面
```javascript
<button class="action-btn action-btn-primary">查看</button>
<button class="action-btn action-btn-info">测试</button>
<button class="action-btn action-btn-success">同步</button>
<button class="action-btn action-btn-secondary">编辑</button>
<button class="action-btn action-btn-danger">删除</button>
```

### 采集任务管理页面（修复后）
```javascript
<button class="action-btn action-btn-primary">查看</button>
<button class="action-btn action-btn-success">执行</button>
<button class="action-btn action-btn-warning">停止</button>
<button class="action-btn action-btn-secondary">编辑</button>
<button class="action-btn action-btn-danger">删除</button>
```

## 按钮颜色方案

| 样式类 | 颜色 | 用途 |
|--------|------|------|
| action-btn-primary | 蓝色 | 主要操作（查看） |
| action-btn-success | 绿色 | 成功/执行操作 |
| action-btn-info | 青色 | 信息操作（测试） |
| action-btn-warning | 黄色 | 警告操作（停止） |
| action-btn-secondary | 灰色 | 次要操作（编辑） |
| action-btn-danger | 红色 | 危险操作（删除） |

## 按钮顺序优化

### 修复前
执行/停止 → 详情 → 编辑 → 删除 → 禁用/启用

### 修复后
查看 → 执行/停止 → 编辑 → 删除

**优化点**：
1. 查看操作放在最前面（最常用）
2. 移除了禁用/启用按钮（简化操作）
3. 删除操作放在最后（危险操作）
4. 按钮数量从5-6个减少到4个

## CSS样式定义

```css
.action-btn {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
    border: 1px solid transparent;
    cursor: pointer;
    background: transparent;
}

.action-btn-primary {
    color: #2563eb;
    border-color: #2563eb;
}

.action-btn-primary:hover {
    background-color: #2563eb;
    color: white;
}

/* 其他样式类似... */
```

## 图标使用

所有按钮都使用 Font Awesome 图标：
- 查看: `fa-eye`
- 执行: `fa-play`
- 停止: `fa-stop`
- 编辑: `fa-edit`
- 删除: `fa-trash`

## 响应式支持

按钮在小屏幕上会自动换行，保持良好的可用性。
