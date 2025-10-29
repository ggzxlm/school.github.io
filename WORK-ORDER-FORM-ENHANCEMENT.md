# 工单表单完善说明

## 📅 更新时间
2025-10-28

## 🎯 问题描述
新建和编辑工单的页面内容和工单详情的页面内容有差异，缺少了核查组成员、任务分解等重要内容。

## ✅ 解决方案

### 1. 新增核查组成员部分
在新建工单表单中添加了"核查组成员"部分，支持：
- 选择成员姓名（下拉选择）
- 选择成员角色（组长/成员/协助）
- 动态添加多个成员
- 动态删除成员
- 自动收集成员数据

### 2. 新增任务分解部分
在新建工单表单中添加了"任务分解"部分，支持：
- 输入任务标题
- 选择任务负责人
- 设置任务截止日期
- 动态添加多个任务
- 动态删除任务
- 自动收集任务数据

### 3. 完善详情页面渲染
优化了工单详情页面的渲染逻辑：
- 使用统一的渲染函数
- 正确显示核查组成员
- 正确显示任务列表
- 正确显示讨论记录

## 📋 表单字段对比

| 字段名称 | 新建表单 | 详情页面 | 状态 |
|---------|---------|---------|------|
| 工单标题 | ✓ | ✓ | 已有 |
| 工单类型 | ✓ | ✓ | 已有 |
| 优先级 | ✓ | ✓ | 已有 |
| 负责人 | ✓ | ✓ | 已有 |
| 截止日期 | ✓ | ✓ | 已有 |
| 工单描述 | ✓ | ✓ | 已有 |
| **核查组成员** | ✓ | ✓ | **新增** |
| **任务分解** | ✓ | ✓ | **新增** |
| 附件上传 | ✓ | - | 已有 |

## 🎨 界面设计

### 核查组成员
```
┌─────────────────────────────────────────┐
│ 核查组成员                               │
├─────────────────────────────────────────┤
│ [选择成员 ▼] [组长 ▼] [×]              │
│ [选择成员 ▼] [成员 ▼] [×]              │
│ [选择成员 ▼] [协助 ▼] [×]              │
│                                          │
│ [+ 添加成员]                            │
└─────────────────────────────────────────┘
```

### 任务分解
```
┌─────────────────────────────────────────┐
│ 任务分解                                 │
├─────────────────────────────────────────┤
│ [任务标题] [负责人 ▼] [截止日期] [×]   │
│ [任务标题] [负责人 ▼] [截止日期] [×]   │
│ [任务标题] [负责人 ▼] [截止日期] [×]   │
│                                          │
│ [+ 添加任务]                            │
└─────────────────────────────────────────┘
```

## 💻 技术实现

### HTML 结构

#### 核查组成员
```html
<div class="form-group">
    <label class="form-label">核查组成员</label>
    <div id="teamMembersSection" class="team-members-section">
        <div class="team-member-item">
            <select class="form-control member-select">
                <option value="">选择成员</option>
                <option value="张三">张三</option>
                <!-- 更多选项 -->
            </select>
            <select class="form-control role-select">
                <option value="组长">组长</option>
                <option value="成员">成员</option>
                <option value="协助">协助</option>
            </select>
            <button type="button" class="btn btn-sm btn-danger remove-member-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>
    <button type="button" class="btn btn-sm btn-secondary" onclick="addTeamMember()">
        <i class="fas fa-plus"></i> 添加成员
    </button>
</div>
```

#### 任务分解
```html
<div class="form-group">
    <label class="form-label">任务分解</label>
    <div id="tasksSection" class="tasks-section">
        <div class="task-item">
            <input type="text" class="form-control task-title" placeholder="任务标题">
            <select class="form-control task-assignee">
                <option value="">负责人</option>
                <option value="张三">张三</option>
                <!-- 更多选项 -->
            </select>
            <input type="date" class="form-control task-deadline">
            <button type="button" class="btn btn-sm btn-danger remove-task-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>
    <button type="button" class="btn btn-sm btn-secondary" onclick="addTask()">
        <i class="fas fa-plus"></i> 添加任务
    </button>
</div>
```

### JavaScript 函数

#### 添加成员
```javascript
function addTeamMember() {
    const section = document.getElementById('teamMembersSection');
    const memberItem = document.createElement('div');
    memberItem.className = 'team-member-item';
    memberItem.innerHTML = `...`;
    section.appendChild(memberItem);
    updateRemoveButtons('teamMembersSection', 'remove-member-btn');
}
```

#### 移除成员
```javascript
function removeMember(button) {
    const section = document.getElementById('teamMembersSection');
    const memberItem = button.closest('.team-member-item');
    memberItem.remove();
    updateRemoveButtons('teamMembersSection', 'remove-member-btn');
}
```

#### 获取成员数据
```javascript
function getTeamMembersData() {
    const section = document.getElementById('teamMembersSection');
    const memberItems = section.querySelectorAll('.team-member-item');
    const members = [];
    
    memberItems.forEach(item => {
        const name = item.querySelector('.member-select').value;
        const role = item.querySelector('.role-select').value;
        
        if (name) {
            members.push({
                name: name,
                role: role,
                department: '纪检监察室'
            });
        }
    });
    
    return members;
}
```

#### 渲染成员列表（详情页）
```javascript
function renderTeamMembers(members) {
    const container = document.getElementById('teamMembers');
    
    if (!members || members.length === 0) {
        container.innerHTML = '<p>暂无核查组成员</p>';
        return;
    }
    
    container.innerHTML = members.map(member => `
        <div class="team-member-card">
            <div class="member-avatar">${member.name.charAt(0)}</div>
            <div class="member-info">
                <div class="member-name">${member.name}</div>
                <div class="member-role">${member.role} · ${member.department}</div>
            </div>
        </div>
    `).join('');
}
```

### CSS 样式

```css
/* 核查组成员和任务分解样式 */
.team-members-section,
.tasks-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
}

.team-member-item,
.task-item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

/* 详情页面的成员卡片样式 */
.team-member-card {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.member-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 18px;
    margin-right: 16px;
}
```

## 🔄 数据流程

### 创建工单
```
1. 用户填写表单
   ├─ 基本信息（标题、类型、优先级等）
   ├─ 核查组成员（可选）
   └─ 任务分解（可选）

2. 点击"创建工单"
   ├─ 验证必填项
   ├─ 收集基本信息
   ├─ 调用 getTeamMembersData() 收集成员
   ├─ 调用 getTasksData() 收集任务
   └─ 创建工单对象

3. 保存到数据
   └─ mockOrders.unshift(newOrder)

4. 刷新列表
   └─ renderOrders()
```

### 查看详情
```
1. 点击"查看"按钮
   └─ viewOrderDetail(orderId)

2. 获取工单数据
   └─ mockOrders.find(o => o.id === orderId)

3. 渲染详情
   ├─ 填充基本信息
   ├─ 调用 renderTeamMembers() 渲染成员
   ├─ 调用 renderTaskList() 渲染任务
   └─ 调用 renderDiscussions() 渲染讨论

4. 显示模态框
   └─ modal.classList.add('modal-show')
```

## 🧪 测试步骤

1. **强制刷新浏览器**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **打开工单管理页面**
   - 访问 `work-order.html`
   - 或访问 `test-work-order-form.html`

3. **测试新建工单**
   - 点击"新建工单"按钮
   - 验证核查组成员部分存在
   - 验证任务分解部分存在

4. **测试添加成员**
   - 点击"添加成员"按钮
   - 验证新增成员输入项
   - 验证删除按钮显示

5. **测试删除成员**
   - 点击删除按钮
   - 验证成员项被删除
   - 验证只剩一个时删除按钮隐藏

6. **测试添加任务**
   - 点击"添加任务"按钮
   - 验证新增任务输入项
   - 验证删除按钮显示

7. **测试删除任务**
   - 点击删除按钮
   - 验证任务项被删除
   - 验证只剩一个时删除按钮隐藏

8. **测试提交工单**
   - 填写所有必填项
   - 添加成员和任务
   - 点击"创建工单"
   - 验证工单创建成功

9. **测试查看详情**
   - 在列表中点击"查看"
   - 验证核查组成员正确显示
   - 验证任务列表正确显示
   - 验证讨论记录正确显示

## ⚠️ 注意事项

1. **可选字段**
   - 核查组成员和任务分解都是可选的
   - 至少需要填写一个成员或任务才会保存

2. **删除按钮逻辑**
   - 只有一个项目时，删除按钮隐藏
   - 有多个项目时，所有删除按钮显示

3. **默认值**
   - 成员角色默认为"成员"
   - 任务状态默认为"待开始"
   - 任务进度默认为 0%

4. **数据验证**
   - 只收集已填写的成员和任务
   - 空的输入项会被忽略

## 📁 文件更新

### 1. work-order.html
- 在新建工单表单中添加核查组成员部分
- 在新建工单表单中添加任务分解部分
- 保持详情页面的HTML结构不变

### 2. js/work-order.js
- 添加 `addTeamMember()` 函数：添加成员
- 添加 `removeMember()` 函数：移除成员
- 添加 `addTask()` 函数：添加任务
- 添加 `removeTask()` 函数：移除任务
- 添加 `updateRemoveButtons()` 函数：更新删除按钮状态
- 添加 `getTeamMembersData()` 函数：获取成员数据
- 添加 `getTasksData()` 函数：获取任务数据
- 添加 `renderTeamMembers()` 函数：渲染成员列表
- 添加 `renderTaskList()` 函数：渲染任务列表
- 添加 `renderDiscussions()` 函数：渲染讨论记录
- 更新 `submitCreateOrder()` 函数：收集成员和任务数据
- 更新 `viewOrderDetail()` 函数：使用新的渲染函数

### 3. css/work-order.css
- 添加核查组成员和任务分解的表单样式
- 添加详情页面的成员卡片样式
- 添加详情页面的任务卡片样式
- 添加详情页面的讨论记录样式
- 添加响应式设计样式

## 🚀 后续优化建议

1. **成员管理**
   - 从用户系统获取成员列表
   - 支持搜索成员
   - 显示成员头像
   - 显示成员所属部门

2. **任务管理**
   - 支持任务优先级设置
   - 支持任务依赖关系
   - 支持任务进度更新
   - 支持任务状态变更

3. **表单验证**
   - 验证成员不重复
   - 验证任务标题不为空
   - 验证截止日期合理性

4. **编辑功能**
   - 支持编辑工单时修改成员
   - 支持编辑工单时修改任务
   - 保持编辑和新建表单一致

5. **权限控制**
   - 根据角色控制成员选择范围
   - 根据权限控制任务分配

## 🐛 常见问题

**Q: 删除按钮什么时候显示？**
A: 当有多个成员或任务时，所有删除按钮都会显示。只有一个时，删除按钮隐藏。

**Q: 成员和任务是必填的吗？**
A: 不是必填的，但建议至少添加一个成员和一个任务。

**Q: 如何修改默认的成员列表？**
A: 在HTML中修改 `<select class="form-control member-select">` 的选项。

**Q: 详情页面不显示成员和任务？**
A: 检查工单数据中是否包含 `team` 和 `tasks` 字段，确保数据结构正确。

**Q: 如何自定义成员角色？**
A: 在HTML中修改 `<select class="form-control role-select">` 的选项。

---

**开发者**: Kiro AI Assistant  
**更新时间**: 2025-10-28  
**版本**: v1.0
