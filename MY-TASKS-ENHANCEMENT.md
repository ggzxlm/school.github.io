# 我的待办功能完善方案

## 📋 问题1：待办数据在哪个环节发起？

### 待办任务的来源

待办任务在以下环节自动或手动创建：

#### 1. **预警触发** → 自动创建待办
```
监督模型运行 → 发现异常 → 生成预警 → 自动创建待办
```
**示例**：
- 预警：科研经费报销存在连号发票
- 待办：审核科研经费报销单 - 张教授课题组
- 类型：预警核查
- 优先级：紧急

#### 2. **线索登记** → 手动创建待办
```
收到举报/发现问题 → 登记线索 → 分配责任人 → 创建待办
```
**示例**：
- 线索：教师校外有偿补课
- 待办：跟进学术不端行为调查
- 类型：线索跟进
- 优先级：高

#### 3. **工单分配** → 自动创建待办
```
创建工单 → 分配核查组 → 为组长和成员创建待办
```
**示例**：
- 工单：WO202510210001 科研经费异常报销核查
- 待办：完成科研经费核查工作
- 类型：工单处理
- 优先级：高

#### 4. **整改下达** → 自动创建待办
```
工单完成 → 发现问题 → 下达整改通知 → 为责任人创建待办
```
**示例**：
- 整改：ZG2025001 科研经费报销不规范问题整改
- 待办：提交整改方案和进度报告
- 类型：整改任务
- 优先级：高

#### 5. **整改复查** → 自动创建待办
```
整改完成 → 申请复查 → 为复查人创建待办
```
**示例**：
- 整改：ZG2025002 固定资产管理不规范整改
- 待办：复查基建项目整改材料
- 类型：整改复查
- 优先级：高

#### 6. **审批流程** → 自动创建待办
```
提交审批 → 流转到审批人 → 创建待办
```
**示例**：
- 审批：工单分配申请
- 待办：审批工单分配申请 - 三公经费超标核查
- 类型：工单审批
- 优先级：普通

#### 7. **定期任务** → 系统自动创建
```
定时任务触发 → 创建周期性待办
```
**示例**：
- 定期任务：月度工作总结
- 待办：完成月度监督报告编写
- 类型：报告编写
- 优先级：普通

### 待办创建流程图

```
┌─────────────┐
│  预警系统    │ → 自动创建待办（预警核查）
└─────────────┘

┌─────────────┐
│  线索库      │ → 手动创建待办（线索跟进）
└─────────────┘

┌─────────────┐
│  工单管理    │ → 自动创建待办（工单处理）
└─────────────┘

┌─────────────┐
│  整改管理    │ → 自动创建待办（整改任务/整改复查）
└─────────────┘

┌─────────────┐
│  审批流程    │ → 自动创建待办（审批任务）
└─────────────┘

┌─────────────┐
│  定时任务    │ → 自动创建待办（定期任务）
└─────────────┘
```

## 📊 问题2：完善待办详情信息

### 当前待办数据结构（简单）
```javascript
{
    id: 1,
    title: '审核科研经费报销单 - 张教授课题组',
    type: '预警核查',
    deadline: '2025-10-21 18:00',
    priority: 'urgent',
    status: 'pending'
}
```

### 完善后的待办数据结构
```javascript
{
    id: 1,
    title: '审核科研经费报销单 - 张教授课题组',
    description: '监督模型发现张教授课题组科研经费报销存在5张连号发票，金额合计8.5万元，需要立即核查。',
    type: '预警核查',
    deadline: '2025-10-21 18:00',
    priority: 'urgent',
    status: 'pending',
    
    // 新增：来源信息
    source: {
        type: 'alert',              // 来源类型：alert/clue/workorder/rectification
        id: 'ALERT2025001',         // 来源ID
        title: '科研经费报销异常',  // 来源标题
        module: '科研经费监督'       // 所属模块
    },
    
    // 新增：关联信息
    relations: {
        clueId: 'CLUE2025001',      // 关联线索
        workOrderId: null,           // 关联工单（如果有）
        rectificationId: null        // 关联整改（如果有）
    },
    
    // 新增：任务详情
    details: {
        unit: '计算机学院',          // 涉及单位
        person: '张教授',            // 涉及人员
        amount: 85000,               // 涉及金额
        riskLevel: 'high',           // 风险等级
        evidence: [                  // 证据材料
            '连号发票5张',
            '报销金额8.5万元',
            '报销时间集中在同一天'
        ]
    },
    
    // 新增：处理信息
    process: {
        assignedBy: '李主任',        // 分配人
        assignedAt: '2025-10-20 09:00',  // 分配时间
        expectedDuration: 2,         // 预计耗时（天）
        requiredActions: [           // 需要的操作
            '调取报销凭证',
            '核实发票真伪',
            '约谈当事人',
            '形成核查结论'
        ]
    },
    
    // 新增：操作记录
    history: [
        {
            time: '2025-10-20 09:00',
            user: '李主任',
            action: '创建待办',
            note: '预警触发，需要立即核查'
        },
        {
            time: '2025-10-20 14:30',
            user: '张三',
            action: '开始处理',
            note: '已调取相关报销凭证'
        }
    ]
}
```

## 🎯 完善方案

### 1. 更新待办数据结构

在 `js/dashboard.js` 中更新 `mockData.todos`，添加：
- ✅ description - 详细描述
- ✅ source - 来源信息
- ✅ relations - 关联信息
- ✅ details - 任务详情
- ✅ process - 处理信息
- ✅ history - 操作记录

### 2. 完善待办详情页面

在 `viewTodoDetail()` 函数中展示：

```html
┌─────────────────────────────────────┐
│ 待办详情                              │
├─────────────────────────────────────┤
│ 基本信息                              │
│ - 任务标题                            │
│ - 任务类型                            │
│ - 优先级                              │
│ - 截止时间                            │
│ - 任务状态                            │
├─────────────────────────────────────┤
│ 来源追溯 ⭐                           │
│ ┌─────────────────────────────────┐ │
│ │ 🔔 来源预警                      │ │
│ │ ALERT2025001                    │ │
│ │ 科研经费报销异常                 │ │
│ │ 模块: 科研经费监督               │ │
│ │ [查看预警详情]                   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 💡 关联线索                      │ │
│ │ CLUE2025001                     │ │
│ │ 科研经费报销存在连号发票异常     │ │
│ │ [查看线索详情]                   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 任务详情                              │
│ - 涉及单位: 计算机学院                │
│ - 涉及人员: 张教授                    │
│ - 涉及金额: 8.5万元                   │
│ - 风险等级: 高风险                    │
├─────────────────────────────────────┤
│ 证据材料                              │
│ • 连号发票5张                         │
│ • 报销金额8.5万元                     │
│ • 报销时间集中在同一天                │
├─────────────────────────────────────┤
│ 需要的操作                            │
│ ☐ 调取报销凭证                       │
│ ☐ 核实发票真伪                       │
│ ☐ 约谈当事人                         │
│ ☐ 形成核查结论                       │
├─────────────────────────────────────┤
│ 操作记录                              │
│ 2025-10-20 09:00 李主任 创建待办     │
│ 2025-10-20 14:30 张三 开始处理       │
└─────────────────────────────────────┘
```

### 3. 待办类型与来源映射

| 待办类型 | 来源模块 | 创建时机 | 优先级规则 |
|---------|---------|---------|-----------|
| 预警核查 | 预警系统 | 预警触发时 | 根据风险等级 |
| 预警处置 | 预警系统 | 预警确认后 | 根据风险等级 |
| 线索跟进 | 线索库 | 线索登记时 | 根据线索类型 |
| 工单处理 | 工单管理 | 工单分配时 | 根据工单优先级 |
| 工单审批 | 工单管理 | 工单提交审批时 | 普通 |
| 整改任务 | 整改管理 | 整改下达时 | 高 |
| 整改复查 | 整改管理 | 整改完成申请复查时 | 高 |
| 报告编写 | 系统定时任务 | 月末自动创建 | 普通 |
| 会议参加 | 日程管理 | 会议安排时 | 普通 |

## 🔄 完整的业务流程

### 案例：科研经费问题的待办流程

#### 第1步：预警触发 → 创建待办1
```
预警系统发现异常
  ↓
创建预警 ALERT2025001
  ↓
自动创建待办：预警核查
  ↓
分配给：张三（纪检专员）
```

#### 第2步：登记线索 → 创建待办2
```
张三核查预警
  ↓
确认问题存在
  ↓
登记线索 CLUE2025001
  ↓
自动创建待办：线索跟进
  ↓
分配给：李主任（纪检主任）
```

#### 第3步：创建工单 → 创建待办3
```
李主任审核线索
  ↓
决定立案调查
  ↓
创建工单 WO202510210001
  ↓
自动创建待办：工单处理
  ↓
分配给：张三（核查组长）
```

#### 第4步：下达整改 → 创建待办4
```
工单核查完成
  ↓
发现问题需要整改
  ↓
创建整改任务 ZG2025001
  ↓
自动创建待办：整改任务
  ↓
分配给：王处长（科研处长）
```

#### 第5步：申请复查 → 创建待办5
```
整改措施完成
  ↓
提交复查申请
  ↓
自动创建待办：整改复查
  ↓
分配给：张三（纪检专员）
```

## 💡 完善建议

### 1. 数据结构完善

在 `js/dashboard.js` 和 `js/my-tasks.js` 中，为每个待办添加：

```javascript
{
    // 基本信息
    id: 1,
    title: '审核科研经费报销单 - 张教授课题组',
    description: '监督模型发现张教授课题组科研经费报销存在5张连号发票...',
    type: '预警核查',
    deadline: '2025-10-21 18:00',
    priority: 'urgent',
    status: 'pending',
    
    // 来源信息 ⭐
    source: {
        type: 'alert',
        id: 'ALERT2025001',
        title: '科研经费报销异常',
        module: '科研经费监督',
        createdAt: '2025-10-20 08:30'
    },
    
    // 关联信息 ⭐
    relations: {
        clueId: 'CLUE2025001',
        clueTitle: '科研经费报销存在连号发票异常',
        workOrderId: null,
        rectificationId: null
    },
    
    // 任务详情 ⭐
    details: {
        unit: '计算机学院',
        person: '张教授',
        amount: 85000,
        riskLevel: 'high',
        evidence: [
            '连号发票5张（发票号：12345-12349）',
            '报销金额8.5万元',
            '报销时间：2025-10-15',
            '报销项目：办公用品采购'
        ],
        attachments: [
            { name: '报销单扫描件.pdf', size: '2.3 MB' },
            { name: '发票清单.xlsx', size: '156 KB' }
        ]
    },
    
    // 处理信息 ⭐
    process: {
        assignedBy: '李主任',
        assignedAt: '2025-10-20 09:00',
        expectedDuration: 2,
        requiredActions: [
            { action: '调取报销凭证', completed: false },
            { action: '核实发票真伪', completed: false },
            { action: '约谈当事人', completed: false },
            { action: '形成核查结论', completed: false }
        ],
        notes: '请在2个工作日内完成核查，如发现问题及时上报。'
    },
    
    // 操作记录 ⭐
    history: [
        {
            time: '2025-10-20 08:30',
            user: '系统',
            action: '预警触发',
            note: '监督模型发现异常'
        },
        {
            time: '2025-10-20 09:00',
            user: '李主任',
            action: '创建待办',
            note: '分配给张三进行核查'
        },
        {
            time: '2025-10-20 14:30',
            user: '张三',
            action: '开始处理',
            note: '已调取相关报销凭证'
        }
    ]
}
```

### 2. 详情页面完善

修改 `viewTodoDetail()` 函数，展示完整信息：

#### A. 添加来源追溯区块
```html
<div class="detail-section">
    <h4 class="detail-section-title">
        <i class="fas fa-link"></i>
        来源追溯
    </h4>
    <div class="relation-card">
        <div class="relation-icon">
            <i class="fas fa-bell"></i>
        </div>
        <div class="relation-content">
            <div class="relation-title">ALERT2025001 - 科研经费报销异常</div>
            <div class="relation-meta">模块: 科研经费监督 · 时间: 2025-10-20 08:30</div>
        </div>
        <button class="btn btn-sm btn-primary">查看预警详情</button>
    </div>
</div>
```

#### B. 添加任务详情区块
```html
<div class="detail-section">
    <h4 class="detail-section-title">任务详情</h4>
    <div class="detail-grid">
        <div class="detail-item">
            <label>涉及单位</label>
            <div>计算机学院</div>
        </div>
        <div class="detail-item">
            <label>涉及人员</label>
            <div>张教授</div>
        </div>
        <div class="detail-item">
            <label>涉及金额</label>
            <div>8.5万元</div>
        </div>
        <div class="detail-item">
            <label>风险等级</label>
            <div><span class="risk-badge high">高风险</span></div>
        </div>
    </div>
</div>
```

#### C. 添加证据材料区块
```html
<div class="detail-section">
    <h4 class="detail-section-title">证据材料</h4>
    <ul class="evidence-list">
        <li>连号发票5张（发票号：12345-12349）</li>
        <li>报销金额8.5万元</li>
        <li>报销时间：2025-10-15</li>
        <li>报销项目：办公用品采购</li>
    </ul>
</div>
```

#### D. 添加需要的操作区块
```html
<div class="detail-section">
    <h4 class="detail-section-title">需要的操作</h4>
    <div class="action-checklist">
        <label class="action-item">
            <input type="checkbox">
            <span>调取报销凭证</span>
        </label>
        <label class="action-item">
            <input type="checkbox">
            <span>核实发票真伪</span>
        </label>
        <label class="action-item">
            <input type="checkbox">
            <span>约谈当事人</span>
        </label>
        <label class="action-item">
            <input type="checkbox">
            <span>形成核查结论</span>
        </label>
    </div>
</div>
```

#### E. 添加操作记录时间轴
```html
<div class="detail-section">
    <h4 class="detail-section-title">操作记录</h4>
    <div class="timeline">
        <div class="timeline-item completed">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>预警触发</h4>
                <div class="timeline-time">2025-10-20 08:30 · 系统</div>
                <div class="timeline-description">监督模型发现异常</div>
            </div>
        </div>
        <div class="timeline-item completed">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>创建待办</h4>
                <div class="timeline-time">2025-10-20 09:00 · 李主任</div>
                <div class="timeline-description">分配给张三进行核查</div>
            </div>
        </div>
        <div class="timeline-item in-progress">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>开始处理</h4>
                <div class="timeline-time">2025-10-20 14:30 · 张三</div>
                <div class="timeline-description">已调取相关报销凭证</div>
            </div>
        </div>
    </div>
</div>
```

### 3. 添加快速操作按钮

在详情页面底部添加：
```html
<div class="modal-footer">
    <button class="btn btn-secondary">关闭</button>
    <button class="btn btn-primary">
        <i class="fas fa-external-link-alt"></i>
        查看来源详情
    </button>
    <button class="btn btn-success">
        <i class="fas fa-check"></i>
        开始处理
    </button>
</div>
```

## 📊 待办类型统计

根据来源分类：
- **预警相关**: 预警核查、预警处置（30%）
- **线索相关**: 线索跟进（15%）
- **工单相关**: 工单处理、工单审批（25%）
- **整改相关**: 整改任务、整改复查（20%）
- **其他**: 报告编写、会议参加（10%）

## 🎯 实施步骤

1. ✅ 创建完善的待办数据结构
2. ⏳ 更新 `js/dashboard.js` 中的待办数据
3. ⏳ 更新 `js/my-tasks.js` 中的待办数据
4. ⏳ 完善 `viewTodoDetail()` 函数
5. ⏳ 添加来源追溯功能
6. ⏳ 添加关联信息展示
7. ⏳ 添加操作记录时间轴
8. ⏳ 实现快速跳转功能

---

**文档版本**: v1.0  
**创建时间**: 2025-10-28  
**状态**: 📝 规划中
