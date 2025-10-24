/**
 * 关系图谱可视化服务
 * 使用G6实现图谱可视化,支持缩放、拖拽、筛选交互
 */

class RelationGraphVisualization {
    constructor(containerId) {
        this.containerId = containerId;
        this.graph = null;
        this.currentData = null;
        this.filters = {
            nodeTypes: [],
            edgeTypes: [],
            riskLevels: [],
            depth: 5
        };
        this.layout = 'force';
        this.initialized = false;
    }

    /**
     * 初始化图谱
     */
    async initialize() {
        if (this.initialized) return;

        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`容器不存在: ${this.containerId}`);
        }

        const width = container.offsetWidth || 800;
        const height = container.offsetHeight || 600;

        // 创建G6图实例
        this.graph = new G6.Graph({
            container: this.containerId,
            width,
            height,
            modes: {
                default: [
                    'drag-canvas',
                    'zoom-canvas',
                    'drag-node',
                    'click-select',
                    {
                        type: 'tooltip',
                        formatText: (model) => this.formatTooltip(model)
                    },
                    {
                        type: 'edge-tooltip',
                        formatText: (model) => this.formatEdgeTooltip(model)
                    }
                ]
            },
            layout: {
                type: 'force',
                preventOverlap: true,
                nodeSpacing: 100,
                linkDistance: 150,
                nodeStrength: -300,
                edgeStrength: 0.6,
                collideStrength: 0.8
            },
            defaultNode: {
                size: 40,
                style: {
                    fill: '#5B8FF9',
                    stroke: '#fff',
                    lineWidth: 2
                },
                labelCfg: {
                    position: 'bottom',
                    offset: 5,
                    style: {
                        fontSize: 12,
                        fill: '#333'
                    }
                }
            },
            defaultEdge: {
                type: 'line',
                style: {
                    stroke: '#999',
                    lineWidth: 2,
                    endArrow: {
                        path: G6.Arrow.triangle(8, 10, 0),
                        fill: '#999'
                    }
                },
                labelCfg: {
                    autoRotate: true,
                    style: {
                        fontSize: 10,
                        fill: '#666',
                        background: {
                            fill: '#fff',
                            padding: [2, 4, 2, 4],
                            radius: 2
                        }
                    }
                }
            },
            nodeStateStyles: {
                hover: {
                    fill: '#1890ff',
                    stroke: '#1890ff',
                    lineWidth: 3
                },
                selected: {
                    fill: '#f5222d',
                    stroke: '#f5222d',
                    lineWidth: 3
                }
            },
            edgeStateStyles: {
                hover: {
                    stroke: '#1890ff',
                    lineWidth: 3
                },
                selected: {
                    stroke: '#f5222d',
                    lineWidth: 3
                }
            }
        });

        // 绑定事件
        this.bindEvents();

        this.initialized = true;
        console.log('图谱可视化初始化完成');
    }

    /**
     * 渲染图谱
     */
    render(graphData) {
        if (!this.graph) {
            throw new Error('图谱未初始化');
        }

        this.currentData = graphData;

        // 转换数据格式
        const data = this.transformData(graphData);

        // 应用过滤
        const filteredData = this.applyFilters(data);

        // 渲染
        this.graph.data(filteredData);
        this.graph.render();

        // 自适应画布
        this.fitView();

        console.log(`图谱渲染完成: ${filteredData.nodes.length} 个节点, ${filteredData.edges.length} 条边`);
    }

    /**
     * 转换数据格式
     */
    transformData(graphData) {
        const nodes = graphData.nodes.map(node => ({
            id: node.id,
            label: node.label,
            type: this.getNodeShape(node.type),
            size: this.getNodeSize(node),
            style: this.getNodeStyle(node),
            ...node
        }));

        const edges = graphData.edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label,
            type: this.getEdgeType(edge),
            style: this.getEdgeStyle(edge),
            ...edge
        }));

        return { nodes, edges };
    }

    /**
     * 获取节点形状
     */
    getNodeShape(type) {
        const shapes = {
            PERSON: 'circle',
            COMPANY: 'rect',
            CONTRACT: 'diamond',
            BID: 'hexagon',
            PROJECT: 'ellipse'
        };
        return shapes[type] || 'circle';
    }

    /**
     * 获取节点大小
     */
    getNodeSize(node) {
        const baseSize = 40;
        const riskMultiplier = {
            HIGH: 1.5,
            MEDIUM: 1.2,
            LOW: 1.0,
            NORMAL: 1.0
        };
        return baseSize * (riskMultiplier[node.riskLevel] || 1.0);
    }

    /**
     * 获取节点样式
     */
    getNodeStyle(node) {
        const style = { ...node.style };

        // 根据风险等级设置颜色
        if (node.riskLevel === 'HIGH') {
            style.fill = '#ff4d4f';
            style.stroke = '#cf1322';
        } else if (node.riskLevel === 'MEDIUM') {
            style.fill = '#faad14';
            style.stroke = '#d48806';
        } else if (node.riskLevel === 'LOW') {
            style.fill = '#52c41a';
            style.stroke = '#389e0d';
        }

        return style;
    }

    /**
     * 获取边类型
     */
    getEdgeType(edge) {
        // 隐藏关联使用虚线
        if (edge.isHidden) {
            return 'line-dash';
        }
        return 'line';
    }

    /**
     * 获取边样式
     */
    getEdgeStyle(edge) {
        const style = { ...edge.style };

        // 根据风险等级设置颜色
        if (edge.riskLevel === 'HIGH') {
            style.stroke = '#ff4d4f';
            style.lineWidth = 3;
        } else if (edge.riskLevel === 'MEDIUM') {
            style.stroke = '#faad14';
            style.lineWidth = 2.5;
        }

        // 隐藏关联使用虚线
        if (edge.isHidden) {
            style.lineDash = [5, 5];
        }

        return style;
    }

    /**
     * 应用过滤器
     */
    applyFilters(data) {
        let nodes = [...data.nodes];
        let edges = [...data.edges];

        // 按节点类型过滤
        if (this.filters.nodeTypes.length > 0) {
            nodes = nodes.filter(n => this.filters.nodeTypes.includes(n.type));
            const nodeIds = new Set(nodes.map(n => n.id));
            edges = edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
        }

        // 按边类型过滤
        if (this.filters.edgeTypes.length > 0) {
            edges = edges.filter(e => this.filters.edgeTypes.includes(e.type));
        }

        // 按风险等级过滤
        if (this.filters.riskLevels.length > 0) {
            nodes = nodes.filter(n => this.filters.riskLevels.includes(n.riskLevel));
            edges = edges.filter(e => this.filters.riskLevels.includes(e.riskLevel));
            const nodeIds = new Set(nodes.map(n => n.id));
            edges = edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
        }

        return { nodes, edges };
    }

    /**
     * 设置过滤器
     */
    setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        if (this.currentData) {
            this.render(this.currentData);
        }
    }

    /**
     * 切换布局
     */
    changeLayout(layoutType) {
        this.layout = layoutType;

        const layouts = {
            force: {
                type: 'force',
                preventOverlap: true,
                nodeSpacing: 100,
                linkDistance: 150
            },
            circular: {
                type: 'circular',
                radius: 200,
                startAngle: 0,
                endAngle: Math.PI * 2
            },
            radial: {
                type: 'radial',
                unitRadius: 100,
                preventOverlap: true
            },
            dagre: {
                type: 'dagre',
                rankdir: 'LR',
                nodesep: 50,
                ranksep: 100
            },
            concentric: {
                type: 'concentric',
                minNodeSpacing: 50
            }
        };

        const layout = layouts[layoutType] || layouts.force;
        this.graph.updateLayout(layout);
    }

    /**
     * 高亮节点
     */
    highlightNode(nodeId) {
        this.graph.setItemState(nodeId, 'selected', true);
        
        // 高亮相关边
        const edges = this.graph.getEdges();
        edges.forEach(edge => {
            const model = edge.getModel();
            if (model.source === nodeId || model.target === nodeId) {
                this.graph.setItemState(edge, 'selected', true);
            }
        });

        // 聚焦到节点
        this.graph.focusItem(nodeId, true, {
            easing: 'easeCubic',
            duration: 500
        });
    }

    /**
     * 清除高亮
     */
    clearHighlight() {
        const nodes = this.graph.getNodes();
        const edges = this.graph.getEdges();
        
        nodes.forEach(node => {
            this.graph.clearItemStates(node);
        });
        
        edges.forEach(edge => {
            this.graph.clearItemStates(edge);
        });
    }

    /**
     * 查找节点
     */
    findNode(keyword) {
        if (!this.currentData) return [];

        const results = this.currentData.nodes.filter(node => {
            const label = node.label || '';
            const name = node.properties?.name || '';
            return label.includes(keyword) || name.includes(keyword);
        });

        return results;
    }

    /**
     * 展开节点
     */
    async expandNode(nodeId, depth = 1) {
        // 获取节点的关联数据
        const relatedData = await window.relationGraphService.getEntityRelations(nodeId);
        
        // 添加到当前图谱
        const updates = {
            addNodes: relatedData.nodes || [],
            addEdges: relatedData.edges || []
        };

        await window.relationGraphService.updateGraph(this.currentData.id, updates);
        
        // 重新渲染
        const updatedGraph = window.relationGraphService.getGraph(this.currentData.id);
        this.render(updatedGraph);
    }

    /**
     * 折叠节点
     */
    collapseNode(nodeId) {
        // 移除与该节点相关的边和孤立节点
        const edges = this.currentData.edges.filter(e => 
            e.source !== nodeId && e.target !== nodeId
        );

        // 找出孤立节点
        const connectedNodes = new Set();
        edges.forEach(e => {
            connectedNodes.add(e.source);
            connectedNodes.add(e.target);
        });

        const nodes = this.currentData.nodes.filter(n => 
            n.id === nodeId || connectedNodes.has(n.id)
        );

        this.render({ ...this.currentData, nodes, edges });
    }

    /**
     * 自适应画布
     */
    fitView() {
        this.graph.fitView(20);
    }

    /**
     * 缩放
     */
    zoom(ratio) {
        this.graph.zoom(ratio);
    }

    /**
     * 导出图片
     */
    exportImage(name = 'graph') {
        this.graph.downloadFullImage(name, 'image/png', {
            backgroundColor: '#fff',
            padding: 20
        });
    }

    /**
     * 格式化节点提示信息
     */
    formatTooltip(model) {
        const lines = [
            `<div style="padding: 8px;">`,
            `<strong>${model.label}</strong>`,
            `<div style="margin-top: 4px; font-size: 12px;">`,
            `类型: ${this.getTypeLabel(model.type)}`,
        ];

        if (model.properties) {
            if (model.properties.department) {
                lines.push(`部门: ${model.properties.department}`);
            }
            if (model.properties.position) {
                lines.push(`职位: ${model.properties.position}`);
            }
            if (model.properties.amount) {
                lines.push(`金额: ¥${model.properties.amount.toLocaleString()}`);
            }
        }

        if (model.riskLevel && model.riskLevel !== 'NORMAL') {
            lines.push(`<span style="color: ${this.getRiskColor(model.riskLevel)}">风险等级: ${model.riskLevel}</span>`);
        }

        lines.push(`</div></div>`);
        return lines.join('<br/>');
    }

    /**
     * 格式化边提示信息
     */
    formatEdgeTooltip(model) {
        const lines = [
            `<div style="padding: 8px;">`,
            `<strong>${model.label}</strong>`,
            `<div style="margin-top: 4px; font-size: 12px;">`,
        ];

        if (model.isHidden) {
            lines.push(`<span style="color: #faad14;">隐藏关联</span>`);
        }

        if (model.confidence) {
            lines.push(`置信度: ${(model.confidence * 100).toFixed(0)}%`);
        }

        if (model.riskLevel && model.riskLevel !== 'NORMAL') {
            lines.push(`<span style="color: ${this.getRiskColor(model.riskLevel)}">风险等级: ${model.riskLevel}</span>`);
        }

        lines.push(`</div></div>`);
        return lines.join('<br/>');
    }

    /**
     * 获取类型标签
     */
    getTypeLabel(type) {
        const labels = {
            PERSON: '人员',
            COMPANY: '企业',
            CONTRACT: '合同',
            BID: '投标',
            PROJECT: '项目'
        };
        return labels[type] || type;
    }

    /**
     * 获取风险颜色
     */
    getRiskColor(level) {
        const colors = {
            HIGH: '#ff4d4f',
            MEDIUM: '#faad14',
            LOW: '#52c41a'
        };
        return colors[level] || '#999';
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 节点点击事件
        this.graph.on('node:click', (e) => {
            const node = e.item;
            const model = node.getModel();
            this.onNodeClick && this.onNodeClick(model);
        });

        // 节点双击事件
        this.graph.on('node:dblclick', (e) => {
            const node = e.item;
            const model = node.getModel();
            this.onNodeDoubleClick && this.onNodeDoubleClick(model);
        });

        // 边点击事件
        this.graph.on('edge:click', (e) => {
            const edge = e.item;
            const model = edge.getModel();
            this.onEdgeClick && this.onEdgeClick(model);
        });

        // 画布点击事件
        this.graph.on('canvas:click', () => {
            this.clearHighlight();
            this.onCanvasClick && this.onCanvasClick();
        });
    }

    /**
     * 销毁图谱
     */
    destroy() {
        if (this.graph) {
            this.graph.destroy();
            this.graph = null;
        }
        this.initialized = false;
    }
}

// 导出
window.RelationGraphVisualization = RelationGraphVisualization;
