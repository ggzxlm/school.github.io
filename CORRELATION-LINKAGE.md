# 关联分析联动功能说明

## 📋 功能概述

实现了关联分析模块中条件与图谱的智能联动，支持：
1. 实体类型过滤
2. 实体搜索与高亮
3. 关联关系展示
4. 图谱交互操作

## 🎯 核心功能

### 1. 实体类型过滤

#### getSelectedEntityTypes()
获取当前选中的实体类型

**返回：**
- 类型数组，如 `['person', 'company']`

**实现逻辑：**
```javascript
function getSelectedEntityTypes() {
    const checkboxes = document.querySelectorAll('.entity-filter input[type="checkbox"]');
    const types = [];
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const typeMap = ['person', 'company', 'contract', 'bid'];
            types.push(typeMap[index]);
        }
    });
    return types;
}
```

#### updateRelationGraph()
根据选中的类型更新图谱

**功能：**
1. 获取选中的实体类型
2. 过滤节点（只保留选中类型的节点）
3. 过滤边（只保留两端节点都存在的边）
4. 重新渲染图谱

**示例：**
```javascript
// 只勾选"人员"和"企业"
selectedTypes = ['person', 'company']

// 过滤后的节点
filteredNodes = [
    { id: 'person1', name: '张三', type: 'person' },
    { id: 'person2', name: '李四', type: 'person' },
    { id: 'company1', name: '科技有限公司', type: 'company' }
]

// 过滤后的边（只保留人员-企业之间的关系）
filteredEdges = [
    { source: 'person1', target: 'company1', relation: '关联' }
]
```

### 2. 实体搜索

#### searchAndHighlightEntity(keyword)
搜索实体并高亮显示

**参数：**
- `keyword`: 搜索关键词

**功能：**
1. 在选中类型的节点中搜索匹配的实体
2. 获取匹配节点的所有关联节点
3. 高亮显示匹配的节点
4. 只显示相关的子图

**搜索逻辑：**
```javascript
// 1. 搜索匹配节点（模糊匹配）
const matchedNodes = nodes.filter(node => 
    selectedTypes.includes(node.type) && 
    node.name.toLowerCase().includes(keyword.toLowerCase())
);

// 2. 获取关联边
const relatedEdges = edges.filter(edge => 
    matchedNodeIds.has(edge.source) || matchedNodeIds.has(edge.target)
);

// 3. 获取关联节点
relatedEdges.forEach(edge => {
    relatedNodeIds.add(edge.source);
    relatedNodeIds.add(edge.target);
});

// 4. 渲染并高亮
renderRelationGraphWithData(displayNodes, relatedEdges, matchedNodeIds);
```

**示例：**
```
搜索"张三"：
1. 找到节点：person1（张三）
2. 找到关联边：
   - person1 → contract1（签订）
   - person1 → person3（亲属关系）
3. 添加关联节点：contract1, person3
4. 高亮显示：person1（红色边框、阴影、放大）
5. 只显示：person1, contract1, person3 及其关系
```

### 3. 图谱渲染

#### renderRelationGraphWithData(nodesData, edgesData, highlightIds)
使用指定数据渲染关系图谱

**参数：**
- `nodesData`: 节点数据数组
- `edgesData`: 边数据数组
- `highlightIds`: 需要高亮的节点ID数组（可选）

**节点样式：**
```javascript
// 基础样式
person:   蓝色 (#3b82f6), 大小50
company:  绿色 (#10b981), 大小60
contract: 橙色 (#f59e0b), 大小55
bid:      紫色 (#8b5cf6), 大小55

// 高亮样式
symbolSize: +15
borderColor: #ef4444
borderWidth: 4
shadowBlur: 10
shadowColor: #ef4444
fontSize: 14 (vs 12)
fontWeight: bold (vs normal)
```

**边样式：**
```javascript
// 普通关系
color: #9ca3af (灰色)
width: 2
type: solid

// 风险关系
color: #ef4444 (红色)
width: 3
type: dashed
```

### 4. 图谱工具

#### handleGraphToolAction(index)
处理图谱工具栏操作

**工具列表：**
- 0: 放大 - 恢复默认视图
- 1: 缩小 - 恢复默认视图
- 2: 适应画布 - 调整图表大小
- 3: 重新布局 - 根据当前条件重新渲染

## 📊 数据结构

### 节点数据
```javascript
{
    id: 'person1',           // 唯一标识
    name: '张三',            // 显示名称
    type: 'person',          // 类型：person/company/contract/bid
    title: '采购部主任',     // 人员职务（可选）
    regCapital: '500万',     // 企业注册资本（可选）
    amount: '120万',         // 合同金额（可选）
    date: '2025-03-15'       // 投标日期（可选）
}
```

### 边数据
```javascript
{
    source: 'person1',       // 源节点ID
    target: 'contract1',     // 目标节点ID
    relation: '签订',        // 关系类型
    risk: true               // 是否为风险关系（可选）
}
```

## 🔄 联动流程

### 流程1：实体类型过滤
```
用户勾选/取消复选框
    ↓
触发 change 事件
    ↓
调用 updateRelationGraph()
    ↓
调用 getSelectedEntityTypes()
    ↓
过滤节点和边
    ↓
调用 renderRelationGraphWithData()
    ↓
图谱更新完成
```

### 流程2：实体搜索
```
用户输入关键词并点击搜索
    ↓
调用 searchAndHighlightEntity()
    ↓
搜索匹配节点
    ↓
获取关联节点和边
    ↓
调用 renderRelationGraphWithData() 并传入高亮ID
    ↓
图谱更新并高亮显示
```

### 流程3：组合过滤
```
用户设置类型过滤 + 输入搜索关键词
    ↓
搜索时同时应用类型过滤
    ↓
只在选中类型中搜索
    ↓
显示符合两个条件的结果
```

## 🎨 交互设计

### 1. 实体类型过滤器
```html
<label class="entity-filter">
    <input type="checkbox" checked>
    <span class="entity-icon person"><i class="fas fa-user"></i></span>
    <span>人员</span>
</label>
```

**交互：**
- 默认全部勾选
- 点击复选框立即更新图谱
- 至少保留一个类型勾选

### 2. 搜索框
```html
<input type="text" class="form-input" placeholder="输入人员、企业或合同名称...">
<button class="btn-primary">
    <i class="fas fa-search"></i>
    搜索
</button>
```

**交互：**
- 支持模糊搜索
- 支持回车键搜索
- 清空搜索框后点击搜索，显示所有符合类型过滤的节点
- 未找到匹配时弹出提示

### 3. 图谱工具栏
```html
<div class="graph-toolbar">
    <button class="graph-tool-btn" title="放大">
        <i class="fas fa-search-plus"></i>
    </button>
    <button class="graph-tool-btn" title="缩小">
        <i class="fas fa-search-minus"></i>
    </button>
    <button class="graph-tool-btn" title="适应画布">
        <i class="fas fa-compress"></i>
    </button>
    <button class="graph-tool-btn" title="重新布局">
        <i class="fas fa-sync"></i>
    </button>
</div>
```

**位置：** 图谱右下角
**样式：** 半透明背景，悬停高亮

### 4. 节点交互
- **点击节点**：显示实体详情面板
- **悬停节点**：显示提示信息
- **拖拽节点**：调整节点位置
- **点击空白**：取消选择

### 5. 实体详情面板
```html
<div id="entity-detail-panel" class="entity-detail-panel">
    <div class="panel-header">
        <h3>实体详情</h3>
        <button class="close-btn">×</button>
    </div>
    <div class="panel-content">
        <!-- 动态内容 -->
    </div>
</div>
```

**位置：** 图谱右侧
**显示：** 点击节点时弹出
**关闭：** 点击关闭按钮或点击空白处

## 🧪 测试用例

### 测试用例 1：单一类型过滤
**操作：** 只勾选"人员"
**预期：**
- 只显示5个人员节点
- 只显示人员之间的关系（如：张三 ↔ 王五 亲属关系）
- 其他类型节点全部隐藏

### 测试用例 2：多类型过滤
**操作：** 勾选"人员"和"企业"
**预期：**
- 显示5个人员节点 + 3个企业节点
- 显示人员-企业关系（如：王五 → 科技有限公司 法人）
- 显示人员-人员关系
- 隐藏合同和投标节点

### 测试用例 3：精确搜索
**操作：** 搜索"张三"
**预期：**
- 张三节点高亮显示
- 显示张三的关联节点（合同1、王五等）
- 只显示相关子图
- 其他无关节点隐藏

### 测试用例 4：模糊搜索
**操作：** 搜索"科技"
**预期：**
- 匹配"科技有限公司"
- 企业节点高亮
- 显示企业的关联节点
- 支持部分匹配

### 测试用例 5：组合过滤
**操作：** 只勾选"人员"，搜索"张三"
**预期：**
- 只在人员类型中搜索
- 张三节点高亮
- 只显示张三关联的人员节点
- 不显示张三关联的企业、合同等

### 测试用例 6：空搜索
**操作：** 清空搜索框，点击搜索
**预期：**
- 显示所有符合类型过滤的节点
- 取消高亮效果
- 恢复正常视图

### 测试用例 7：未找到结果
**操作：** 搜索"不存在的实体"
**预期：**
- 弹出提示："未找到匹配的实体"
- 图谱保持当前状态
- 不进行任何更新

## 💡 使用场景

### 场景 1：分析人员关系网络
```
操作：
1. 只勾选"人员"
2. 搜索目标人员
3. 查看其关联的人员

用途：
- 发现亲属关系
- 分析社交网络
- 识别关键人物
```

### 场景 2：追踪采购流程
```
操作：
1. 勾选"人员"、"企业"、"合同"、"投标"
2. 搜索特定合同
3. 查看完整的采购链路

用途：
- 追溯合同来源
- 识别参与方
- 发现异常关系
```

### 场景 3：企业关联分析
```
操作：
1. 只勾选"企业"和"人员"
2. 搜索目标企业
3. 查看企业的关联人员

用途：
- 发现利益关联
- 识别风险关系
- 分析企业背景
```

### 场景 4：风险关系排查
```
操作：
1. 勾选所有类型
2. 观察红色虚线（风险关系）
3. 点击节点查看详情

用途：
- 发现亲属关系
- 识别任职关系
- 评估廉政风险
```

## 🔧 技术实现

### 关键代码片段

#### 1. 实体类型过滤
```javascript
function updateRelationGraph() {
    const selectedTypes = getSelectedEntityTypes();
    
    // 过滤节点
    const filteredNodes = mockData.relationData.nodes.filter(node => 
        selectedTypes.includes(node.type)
    );
    
    // 过滤边
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = mockData.relationData.edges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
    
    renderRelationGraphWithData(filteredNodes, filteredEdges);
}
```

#### 2. 实体搜索
```javascript
function searchAndHighlightEntity(keyword) {
    const selectedTypes = getSelectedEntityTypes();
    
    // 搜索匹配节点
    const matchedNodes = mockData.relationData.nodes.filter(node => 
        selectedTypes.includes(node.type) && 
        node.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (matchedNodes.length === 0) {
        alert('未找到匹配的实体');
        return;
    }
    
    // 获取关联节点
    const relatedNodeIds = new Set(matchedNodes.map(n => n.id));
    const relatedEdges = mockData.relationData.edges.filter(edge => 
        relatedNodeIds.has(edge.source) || relatedNodeIds.has(edge.target)
    );
    
    relatedEdges.forEach(edge => {
        relatedNodeIds.add(edge.source);
        relatedNodeIds.add(edge.target);
    });
    
    const displayNodes = mockData.relationData.nodes.filter(node => 
        relatedNodeIds.has(node.id)
    );
    
    // 渲染并高亮
    renderRelationGraphWithData(displayNodes, relatedEdges, matchedNodes.map(n => n.id));
}
```

#### 3. 节点高亮
```javascript
// 高亮节点
if (isHighlighted) {
    symbolSize += 15;
    itemStyle.borderColor = '#ef4444';
    itemStyle.borderWidth = 4;
    itemStyle.shadowBlur = 10;
    itemStyle.shadowColor = '#ef4444';
}
```

## 📈 性能优化

1. **图表复用**：使用 dispose() 销毁旧图表，避免内存泄漏
2. **按需渲染**：只渲染过滤后的节点和边
3. **事件委托**：使用事件委托减少事件监听器数量
4. **数据缓存**：缓存原始数据，避免重复请求

## 🚀 后续优化方向

1. **高级搜索**：支持多条件搜索、正则表达式
2. **路径分析**：计算两个节点之间的最短路径
3. **社区发现**：自动识别关系密集的社区
4. **时间轴**：支持按时间查看关系演变
5. **导出功能**：导出图谱为图片或数据文件
6. **布局算法**：支持多种布局算法（力导向、层次、圆形等）
7. **关系强度**：根据关系强度调整边的粗细
8. **节点聚合**：当节点过多时自动聚合

## 📝 注意事项

1. **数据量限制**：当节点数量超过100时，考虑分页或聚合
2. **搜索性能**：大数据量时使用索引优化搜索
3. **浏览器兼容**：确保在主流浏览器中正常工作
4. **移动端适配**：考虑触摸操作和小屏幕显示
5. **数据安全**：敏感关系数据需要权限控制

---

**实现时间**：2025-10-28  
**版本**：v1.0  
**状态**：✅ 已完成
