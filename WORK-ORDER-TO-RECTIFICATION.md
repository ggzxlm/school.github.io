# 工单生成整改单功能实现说明

## ✅ 功能概述

实现了从工单核查结果直接生成整改任务的完整业务流程，确保问题发现、核查、整改的监督闭环。

## 🎯 业务流程

```
线索发现 → 工单核查 → 生成整改单 → 整改跟踪 → 复查销号
```

### 详细流程

1. **线索发现**：系统预警、审计发现、举报等
2. **创建工单**：从线索创建工单进行核查
3. **工单核查**：组建核查组，分配任务，调查取证
4. **工单完成**：核查完成，形成核查结论
5. **生成整改单**：从工单详情页面点击"生成整改单"按钮 ⭐ 新功能
6. **填写整改信息**：自动跳转到整改管理页面，填写整改措施
7. **整改跟踪**：责任单位执行整改，上传佐证材料
8. **复查销号**：纪检部门复查验收，销号归档

## 🔧 技术实现

### 1. 工单详情页面（work-order.html）

在工单详情模态框底部添加"生成整改单"按钮：

```html
<div class="modal-footer">
    <button id="closeDetailModalBtn" class="btn btn-secondary">关闭</button>
    <button id="editOrderBtn" class="btn btn-primary">
        <i class="fas fa-edit"></i> 编辑
    </button>
    <!-- 新增：生成整改单按钮 -->
    <button id="createRectificationBtn" class="btn btn-success" style="display: none;">
        <i class="fas fa-plus-circle"></i> 生成整改单
    </button>
</div>
```

### 2. 工单管理脚本（work-order.js）

#### 2.1 修改 viewOrderDetail 函数

在查看工单详情时，根据工单状态显示/隐藏"生成整改单"按钮：

```javascript
function viewOrderDetail(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    // ... 现有代码 ...
    
    // 显示/隐藏生成整改单按钮
    const createRectBtn = document.getElementById('createRectificationBtn');
    if (createRectBtn) {
        // 只有已完成或待审核的工单才显示生成整改单按钮
        if (order.status === '已完成' || order.status === '待审核') {
            createRectBtn.style.display = 'inline-flex';
            createRectBtn.onclick = () => createRectificationFromOrder(orderId);
        } else {
            createRectBtn.style.display = 'none';
        }
    }
}
```

#### 2.2 新增 createRectificationFromOrder 函数

实现从工单生成整改单的逻辑：

```javascript
// 从工单生成整改单
function createRectificationFromOrder(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
        showToast('工单不存在', 'error');
        return;
    }
    
    // 检查工单状态
    if (order.status !== '已完成' && order.status !== '待审核') {
        showToast('只有已完成或待审核的工单才能生成整改单', 'warning');
        return;
    }
    
    // 确认对话框
    if (!confirm(`确认要从工单"${order.title}"生成整改单吗？`)) {
        return;
    }
    
    // 构建URL参数
    const params = new URLSearchParams({
        action: 'create',
        workOrderId: order.orderNo,
        workOrderTitle: order.title,
        workOrderType: order.type,
        description: order.description,
        clueId: order.clueId || '',
        clueTitle: order.clueTitle || ''
    });
    
    // 跳转到整改管理页面
    showToast('正在跳转到整改管理页面...', 'info');
    setTimeout(() => {
        window.location.href = 'rectification.html?' + params.toString();
    }, 500);
}
```

### 3. 整改管理脚本（rectification.js）

#### 3.1 修改页面初始化逻辑

在页面加载时检查URL参数，如果是从工单跳转过来，则打开创建表单：

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否从工单页面跳转过来创建整改单
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'create') {
        // 从工单创建整改单
        const workOrderData = {
            workOrderId: urlParams.get('workOrderId'),
            workOrderTitle: urlParams.get('workOrderTitle'),
            workOrderType: urlParams.get('workOrderType'),
            description: urlParams.get('description'),
            clueId: urlParams.get('clueId'),
            clueTitle: urlParams.get('clueTitle')
        };
        
        // 延迟打开创建模态框
        setTimeout(() => {
            openCreateRectificationModal(workOrderData);
        }, 500);
    }
    
    initializePage();
});
```

#### 3.2 新增 openCreateRectificationModal 函数

创建整改单表单模态框，自动填充工单信息：

```javascript
function openCreateRectificationModal(workOrderData) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.id = 'createRectificationModal';
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-container modal-lg">
            <div class="modal-header">
                <h3 class="modal-title">
                    <i class="fas fa-plus-circle"></i> 创建整改任务
                </h3>
                <button class="modal-close-btn" onclick="closeCreateRectificationModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="createRectificationForm">
                    <!-- 来源信息展示 -->
                    <div class="detail-section">
                        <h4>来源信息</h4>
                        <div>工单编号：${workOrderData.workOrderId}</div>
                        <div>工单标题：${workOrderData.workOrderTitle}</div>
                    </div>
                    
                    <!-- 整改任务表单 -->
                    <div class="form-group">
                        <label>整改任务标题 *</label>
                        <input type="text" id="rectTitle" required 
                               value="${workOrderData.workOrderTitle.replace('核查', '整改')}">
                    </div>
                    
                    <div class="form-group">
                        <label>责任单位 *</label>
                        <select id="rectDepartment" required>
                            <option value="">请选择</option>
                            <option value="财务处">财务处</option>
                            <option value="科研处">科研处</option>
                            <!-- 更多选项 -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>责任人 *</label>
                        <input type="text" id="rectResponsible" required>
                    </div>
                    
                    <div class="form-group">
                        <label>整改时限 *</label>
                        <input type="date" id="rectDeadline" required>
                    </div>
                    
                    <div class="form-group">
                        <label>问题描述 *</label>
                        <textarea id="rectDescription" required>${workOrderData.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>整改措施 *</label>
                        <textarea id="rectMeasures" required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeCreateRectificationModal()">取消</button>
                <button class="btn btn-primary" onclick="submitCreateRectification()">
                    <i class="fas fa-check"></i> 创建整改任务
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 设置默认截止日期为30天后
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);
    document.getElementById('rectDeadline').value = deadline.toISOString().split('T')[0];
    
    // 保存工单数据
    window.currentWorkOrderData = workOrderData;
}
```

#### 3.3 新增 submitCreateRectification 函数

提交创建整改单，建立与工单的关联：

```javascript
function submitCreateRectification() {
    const form = document.getElementById('createRectificationForm');
    if (!form.checkValidity()) {
        showToast('请填写所有必填项', 'warning');
        return;
    }
    
    const workOrderData = window.currentWorkOrderData || {};
    
    // 生成整改单编号
    const newId = 'ZG' + new Date().getFullYear() + 
                  String(mockRectifications.length + 1).padStart(3, '0');
    
    // 创建新的整改任务
    const newRectification = {
        id: newId,
        title: document.getElementById('rectTitle').value,
        department: document.getElementById('rectDepartment').value,
        responsible: document.getElementById('rectResponsible').value,
        deadline: document.getElementById('rectDeadline').value,
        progress: 0,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        
        // 关联工单信息
        workOrderId: workOrderData.workOrderId,
        workOrderTitle: workOrderData.workOrderTitle,
        workOrderStatus: '已完成',
        
        // 关联线索信息
        clueId: workOrderData.clueId || null,
        clueTitle: workOrderData.clueTitle || null,
        
        description: document.getElementById('rectDescription').value,
        measures: document.getElementById('rectMeasures').value,
        
        timeline: [
            {
                date: new Date().toISOString().split('T')[0],
                title: '整改任务下达',
                desc: '根据工单核查结果创建整改任务',
                status: 'completed',
                operator: '纪检监察室'
            }
        ],
        evidences: []
    };
    
    // 添加到数据中
    mockRectifications.unshift(newRectification);
    
    showToast('整改任务创建成功！', 'success');
    closeCreateRectificationModal();
    
    // 刷新页面数据
    setTimeout(() => {
        filterData();
        updateDashboard();
    }, 500);
}
```

## 📊 数据关联

### 整改单数据结构

```javascript
{
    id: 'ZG2025001',                      // 整改编号
    title: '科研经费报销不规范问题整改',
    department: '科研处',                  // 责任单位
    responsible: '张三',                   // 责任人
    deadline: '2025-11-30',               // 整改时限
    progress: 75,                         // 整改进度
    status: 'in_progress',                // 状态
    
    // 关联工单（来源）
    workOrderId: 'WO202510210001',        // 工单编号
    workOrderTitle: '科研经费异常报销核查',
    workOrderStatus: '已完成',
    
    // 关联线索（原始来源）
    clueId: 'CLUE2025001',                // 线索编号
    clueTitle: '科研经费报销存在连号发票异常',
    clueType: '系统预警',
    
    // 整改内容
    description: '问题描述...',
    measures: '整改措施...',
    metrics: [...],                       // 量化指标
    timeline: [...],                      // 时间轴
    evidences: [...]                      // 佐证材料
}
```

## 🎨 用户界面

### 工单详情页面

```
┌─────────────────────────────────────┐
│ 工单详情                              │
├─────────────────────────────────────┤
│ 基本信息                              │
│ - 工单编号: WO202510210001           │
│ - 工单标题: 科研经费异常报销核查      │
│ - 状态: 已完成                        │
├─────────────────────────────────────┤
│ 核查组成员                            │
│ 任务分解                              │
│ 讨论记录                              │
├─────────────────────────────────────┤
│ [关闭] [编辑] [生成整改单] ⭐         │
└─────────────────────────────────────┘
```

### 创建整改单表单

```
┌─────────────────────────────────────┐
│ 创建整改任务                          │
├─────────────────────────────────────┤
│ 📋 来源信息                           │
│ 工单编号: WO202510210001             │
│ 工单标题: 科研经费异常报销核查        │
│ 工单类型: 纪检核查                    │
├─────────────────────────────────────┤
│ 整改任务标题: [自动填充]             │
│ 责任单位: [下拉选择]                 │
│ 责任人: [输入]                        │
│ 整改时限: [日期选择，默认30天]       │
│ 问题描述: [自动填充工单描述]         │
│ 整改措施: [输入]                      │
├─────────────────────────────────────┤
│ [取消] [创建整改任务]                 │
└─────────────────────────────────────┘
```

## 🧪 测试方法

### 方法1：完整流程测试

1. 打开工单管理页面：`work-order.html`
2. 点击任意已完成工单的"查看"按钮
3. 在工单详情模态框底部找到"生成整改单"按钮
4. 点击按钮，确认跳转
5. 在整改管理页面填写整改信息
6. 提交创建整改任务
7. 验证整改单已创建并包含工单关联信息

### 方法2：快速测试

打开测试页面：`test-create-rectification.html`

点击"开始快速测试"按钮，直接跳转到创建整改单表单。

### 方法3：URL参数测试

直接访问带参数的URL：

```
rectification.html?action=create&workOrderId=WO202510210001&workOrderTitle=科研经费异常报销核查&workOrderType=纪检核查&description=发现问题...
```

## ✅ 功能特点

1. **自动填充**：工单信息自动填充到整改单表单
2. **智能判断**：只有已完成或待审核的工单才能生成整改单
3. **双向关联**：整改单包含工单信息，可以追溯来源
4. **完整闭环**：线索 → 工单 → 整改 → 销号的完整流程
5. **用户友好**：一键生成，操作简单

## 📝 使用说明

### 适用场景

- 工单核查完成，发现问题需要整改
- 审计发现问题，需要责任单位整改
- 纪检核查发现违规行为，需要整改

### 操作权限

- 纪检监察人员：可以从工单生成整改单
- 审计人员：可以从工单生成整改单
- 责任单位：只能查看整改任务，不能创建

### 注意事项

1. 只有已完成或待审核的工单才能生成整改单
2. 生成整改单前请确认工单核查结论准确
3. 整改措施需要责任单位认真填写
4. 整改时限建议根据问题严重程度设置

## 🔄 后续优化

1. 支持批量生成整改单
2. 整改单模板功能
3. 整改进度自动提醒
4. 整改效果评估
5. 整改数据统计分析

---

**实现时间**：2025-10-28  
**版本**：v1.0  
**状态**：✅ 已完成
