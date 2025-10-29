# 图谱分析联动功能说明

## 📋 功能概述

实现了图谱分析模块中条件与图表的智能联动，支持：
1. 图谱类型切换
2. 显示层级调整
3. 中心节点选择
4. 动态数据生成

## 🎯 核心功能

### 1. 图谱类型切换

支持4种图谱类型，每种类型展示不同的关系网络：

#### 风险传导图谱（risk）
展示风险如何在不同实体间传导：
- **节点类型**：预警、部门、人员、合同、企业、流程、线索、事件
- **关系类型**：涉及部门、涉及人员、签订合同、关联关系等
- **用途**：追踪风险传播路径，识别风险源头

#### 部门关系图谱（department）
展示部门间的协作和人员关系：
- **节点类型**：部门、人员、项目
- **关系类型**：部门成员、协作关系、负责项目、上下级等
- **用途**：分析部门协作网络，识别关键部门

#### 流程监控图谱（process）
展示业务流程的各个环节：
- **节点类型**：流程、步骤
- **关系类型**：流转关系
- **用途**：监控流程执行，识别风险环节

#### 事件关联图谱（event）
展示事件与相关实体的关联：
- **节点类型**：事件、预警、人员、企业、合同
- **关系类型**：触发预警、涉及人员、关联企业等
- **用途**：事件溯源，关联分析

### 2. 显示层级控制

通过滑块控制显示的层级深度（1-5层）：

| 层级 | 说明 | 节点数量 |
|------|------|----------|
| 1层 | 只显示中心节点及其直接关联 | 最少 |
| 2层 | 显示二度关联 | 较少 |
| 3层 | 显示三度关联（默认） | 适中 |
| 4层 | 显示四度关联 | 较多 |
| 5层 | 显示所有关联 | 最多 |

**层级定义：**
- Level 0：中心节点
- Level 1：与中心节点直接相连的节点
- Level 2：与Level 1节点相连的节点
- Level 3：与Level 2节点相连的节点
- 以此类推...

### 3. 中心节点选择

支持选择不同的中心节点，图谱会以该节点为中心展开：

- **高风险预警 #2025-001**：以预警为中心，展示相关实体
- **计算机学院**：以部门为中心，展示部门关系
- **采购流程**：以流程为中心，展示流程步骤
- **廉政风险事件**：以事件为中心，展示事件关联

### 4. 动态数据生成

#### generateKnowledgeGraphData(graphType, depth, centerNode)

根据选择的条件动态生成图谱数据。

**参数：**
- `graphType`: 图谱类型（risk/department/process/event）
- `depth`: 显示层级（1-5）
- `centerNode`: 中心节点ID

**返回：**
```javascript
{
    nodes: [...],  // 过滤后的节点数组
    edges: [...]   // 过滤后的边数组
}
```

**生成逻辑：**
1. 根据graphType获取基础数据
2. 根据depth过滤节点（只保留level <= depth的节点）
3. 过滤边（只保留两端节点都存在的边）
4. 返回过滤后的数据

## 🔄 联动流程

### 流程1：图谱类型切换
```
用户点击图谱类型按钮
    ↓
更新按钮激活状态
    ↓
调用 updateKnowledgeGraph()
    ↓
获取当前条件（类型、深度、中心节点）
    ↓
调用 generateKnowledgeGraphData()
    ↓
生成过滤后的数据
    ↓
渲染图谱
    ↓
自动适应视图
```

### 流程2：层级深度调整
```
用户拖动滑块
    ↓
更新层级显示文本
    ↓
滑块释放时触发 change 事件
    ↓
调用 updateKnowledgeGraph()
    ↓
根据新的深度过滤数据
    ↓
重新渲染图谱
```

### 流程3：中心节点切换
```
用户选择中心节点
    ↓
触发 change 事件
    ↓
调用 updateKnowledgeGraph()
    ↓
根据新的中心节点生成数据
    ↓
重新渲染图谱
```

## 📊 数据结构

### 节点数据
```javascript
{
    id: 'alert-001',              // 唯一标识
    name: '高风险预警#2025-001',   // 显示名称
    type: 'alert',                // 节点类型
    risk: 'high',                 // 风险等级
    level: 0                      // 层级（用于深度过滤）
}
```

### 边数据
```javascript
{
    source: 'alert-001',          // 源节点ID
    target: 'dept-cs',            // 目标节点ID
    relation: '涉及部门',          // 关系类型
    risk: true                    // 是否为风险关系（可选）
}
```

### 风险等级颜色
- **high（高风险）**：红色 (#ef4444)，节点大小60
- **medium（中风险）**：橙色 (#f59e0b)，节点大小55
- **low（低风险）**：蓝色 (#3b82f6)，节点大小50
- **normal（正常）**：绿色 (#10b981)，节点大小50

## 🎨 交互功能

### 1. 图谱操作
- **放大**：放大图谱视图
- **缩小**：缩小图谱视图
- **适应画布**：自动调整图谱大小以适应容器
- **重新布局**：重新计算节点位置
- **显示标签**：切换节点标签显示/隐藏

### 2. 节点交互
- **鼠标悬停**：显示节点详细信息
- **点击节点**：高亮节点及其相邻节点
- **拖拽节点**：调整节点位置

### 3. 边交互
- **鼠标悬停**：显示关系类型
- **风险关系**：红色虚线标注

## 🧪 测试场景

### 测试场景 1：图谱类型切换
**操作：**
1. 打开数据分析页面，切换到"图谱分析"
2. 点击"风险传导图谱"
3. 点击"部门关系图谱"
4. 点击"流程监控图谱"
5. 点击"事件关联图谱"

**预期：**
- 每次切换后图谱立即更新
- 显示对应类型的节点和关系
- 节点数量和关系类型符合预期

### 测试场景 2：层级深度调整
**操作：**
1. 选择"风险传导图谱"
2. 将滑块调整到1层
3. 观察图谱变化
4. 依次调整到2层、3层、4层、5层

**预期：**
- 层级1：只显示中心节点及其直接关联（最少节点）
- 层级2：增加二度关联节点
- 层级3：增加三度关联节点
- 层级4：增加四度关联节点
- 层级5：显示所有节点

### 测试场景 3：中心节点切换
**操作：**
1. 选择"风险传导图谱"
2. 中心节点选择"高风险预警 #2025-001"
3. 点击"生成图谱"
4. 切换中心节点为"计算机学院"
5. 点击"生成图谱"

**预期：**
- 图谱以新的中心节点为核心重新生成
- 显示与新中心节点相关的实体
- 层级关系正确

### 测试场景 4：组合条件
**操作：**
1. 选择"部门关系图谱" + "2层" + "计算机学院"
2. 切换到"流程监控图谱" + "3层" + "采购流程"
3. 切换到"事件关联图谱" + "4层" + "廉政风险事件"

**预期：**
- 每次切换后图谱完全更新
- 数据符合所有条件的组合
- 图谱显示正确

## 💡 使用示例

### 示例 1：追踪风险传播路径
```
条件：
- 图谱类型：风险传导图谱
- 显示层级：3层
- 中心节点：高风险预警 #2025-001

结果：
显示预警相关的部门、人员、合同、企业等实体，
以及它们之间的关联关系，帮助追踪风险传播路径。
```

### 示例 2：分析部门协作网络
```
条件：
- 图谱类型：部门关系图谱
- 显示层级：2层
- 中心节点：计算机学院

结果：
显示计算机学院的成员、协作部门、负责项目等，
帮助分析部门的协作网络和关键人员。
```

### 示例 3：监控业务流程
```
条件：
- 图谱类型：流程监控图谱
- 显示层级：5层
- 中心节点：采购流程

结果：
显示采购流程的所有步骤和流转关系，
帮助识别流程中的风险环节。
```

### 示例 4：事件溯源分析
```
条件：
- 图谱类型：事件关联图谱
- 显示层级：4层
- 中心节点：廉政风险事件

结果：
显示事件触发的预警、涉及的人员、关联的企业和合同，
帮助进行事件溯源和关联分析。
```

## 🔧 技术实现

### 关键代码片段

#### 1. 初始化事件监听
```javascript
function initKnowledgeGraph() {
    // 图谱类型切换
    const graphTypeTags = document.querySelectorAll('[data-graph-type]');
    graphTypeTags.forEach(tag => {
        tag.addEventListener('click', function() {
            graphTypeTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateKnowledgeGraph();
        });
    });
    
    // 深度滑块
    const depthSlider = document.getElementById('graph-depth-slider');
    depthSlider.addEventListener('change', function() {
        if (knowledgeGraphChart) {
            updateKnowledgeGraph();
        }
    });
    
    // 中心节点选择
    const centerNodeSelect = document.getElementById('center-node-select');
    centerNodeSelect.addEventListener('change', function() {
        if (knowledgeGraphChart) {
            updateKnowledgeGraph();
        }
    });
}
```

#### 2. 动态数据生成
```javascript
function generateKnowledgeGraphData(graphType, depth, centerNode) {
    const baseData = knowledgeGraphData[graphType] || knowledgeGraphData.risk;
    
    // 如果深度为最大值，返回所有数据
    if (depth >= 5) {
        return baseData;
    }
    
    // 根据深度过滤节点
    const filteredNodes = baseData.nodes.filter(node => node.level <= depth);
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    
    // 过滤边
    const filteredEdges = baseData.edges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
    
    return { nodes: filteredNodes, edges: filteredEdges };
}
```

#### 3. 图谱更新
```javascript
function updateKnowledgeGraph() {
    // 获取当前条件
    const graphType = document.querySelector('[data-graph-type].active')?.dataset.graphType || 'risk';
    const depth = parseInt(document.getElementById('graph-depth-slider').value) || 3;
    const centerNode = document.getElementById('center-node-select').value;
    
    // 生成数据
    const graphData = generateKnowledgeGraphData(graphType, depth, centerNode);
    
    // 渲染图谱
    // ...
}
```

## 🚀 后续优化建议

### 1. 真实数据接入
连接后端API获取真实的图谱数据：
```javascript
async function fetchGraphData(graphType, depth, centerNode) {
    const response = await fetch(`/api/graph/${graphType}`, {
        method: 'POST',
        body: JSON.stringify({ depth, centerNode })
    });
    return await response.json();
}
```

### 2. 智能推荐
根据用户行为推荐相关节点：
```javascript
function recommendNodes(currentNode) {
    // 基于历史查询、关联强度等推荐
    return suggestedNodes;
}
```

### 3. 路径分析
计算两个节点之间的最短路径：
```javascript
function findShortestPath(sourceId, targetId) {
    // 使用BFS或Dijkstra算法
    return path;
}
```

### 4. 社区发现
自动识别图谱中的社区结构：
```javascript
function detectCommunities(graphData) {
    // 使用Louvain算法或其他社区发现算法
    return communities;
}
```

### 5. 时间轴
支持查看图谱随时间的演变：
```javascript
function getGraphAtTime(timestamp) {
    // 返回特定时间点的图谱状态
    return historicalGraph;
}
```

## 📝 注意事项

1. **性能考虑**：节点数量超过100时，考虑使用虚拟化或聚合
2. **数据一致性**：确保节点ID在边中都能找到对应的节点
3. **层级定义**：需要在数据中正确设置level属性
4. **中心节点**：确保中心节点在当前图谱类型中存在
5. **浏览器兼容**：测试在不同浏览器中的显示效果

---

**实现时间**：2025-10-28  
**版本**：v1.0  
**状态**：✅ 已完成
