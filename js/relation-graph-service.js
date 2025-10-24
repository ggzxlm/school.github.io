/**
 * 关系图谱服务
 * 构建和管理人员-企业-合同-投标等多实体关系网络
 */

class RelationGraphService {
    constructor() {
        this.graphs = new Map(); // 存储图谱数据
        this.nodes = new Map(); // 节点索引
        this.edges = new Map(); // 边索引
        this.initialized = false;
    }

    /**
     * 初始化服务
     */
    async initialize() {
        if (this.initialized) return;
        
        // 加载已有图谱数据
        await this.loadGraphsFromStorage();
        this.initialized = true;
        
        console.log('关系图谱服务初始化完成');
    }

    /**
     * 构建关系图谱
     * @param {Object} config - 图谱配置
     * @returns {Promise<Object>} 图谱对象
     */
    async buildGraph(config) {
        const {
            graphId = this.generateId(),
            entityIds = [],
            entityTypes = ['PERSON', 'COMPANY', 'CONTRACT', 'BID'],
            depth = 2,
            includeRelations = ['ALL']
        } = config;

        console.log(`开始构建关系图谱: ${graphId}`);

        const graph = {
            id: graphId,
            nodes: [],
            edges: [],
            metadata: {
                entityTypes,
                depth,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        // 构建节点和边
        for (const entityId of entityIds) {
            await this.addEntityToGraph(graph, entityId, depth, entityTypes, includeRelations);
        }

        // 保存图谱
        this.graphs.set(graphId, graph);
        await this.saveGraphToStorage(graphId, graph);

        console.log(`图谱构建完成: ${graph.nodes.length} 个节点, ${graph.edges.length} 条边`);
        
        return graph;
    }

    /**
     * 添加实体到图谱
     */
    async addEntityToGraph(graph, entityId, depth, entityTypes, includeRelations, currentDepth = 0) {
        if (currentDepth > depth) return;
        
        // 检查节点是否已存在
        if (graph.nodes.find(n => n.id === entityId)) return;

        // 获取实体数据
        const entity = await this.getEntityData(entityId);
        if (!entity) return;

        // 检查实体类型是否在允许范围内
        if (!entityTypes.includes(entity.type) && !entityTypes.includes('ALL')) return;

        // 添加节点
        const node = this.createNode(entity);
        graph.nodes.push(node);
        this.nodes.set(entityId, node);

        // 获取关联关系
        const relations = await this.getEntityRelations(entityId, includeRelations);

        // 添加关联节点和边
        for (const relation of relations) {
            const targetId = relation.targetId;
            
            // 递归添加关联实体
            await this.addEntityToGraph(graph, targetId, depth, entityTypes, includeRelations, currentDepth + 1);

            // 添加边
            const edge = this.createEdge(relation);
            if (!graph.edges.find(e => e.id === edge.id)) {
                graph.edges.push(edge);
                this.edges.set(edge.id, edge);
            }
        }
    }

    /**
     * 创建节点对象
     */
    createNode(entity) {
        return {
            id: entity.id,
            type: entity.type,
            label: entity.name || entity.id,
            properties: {
                name: entity.name,
                idCard: entity.idCard,
                creditCode: entity.creditCode,
                department: entity.department,
                position: entity.position,
                amount: entity.amount,
                date: entity.date,
                status: entity.status,
                ...entity.properties
            },
            style: this.getNodeStyle(entity.type),
            riskLevel: entity.riskLevel || 'NORMAL'
        };
    }

    /**
     * 创建边对象
     */
    createEdge(relation) {
        return {
            id: `${relation.sourceId}-${relation.type}-${relation.targetId}`,
            source: relation.sourceId,
            target: relation.targetId,
            type: relation.type,
            label: this.getRelationLabel(relation.type),
            properties: relation.properties || {},
            style: this.getEdgeStyle(relation.type, relation.riskLevel),
            riskLevel: relation.riskLevel || 'NORMAL'
        };
    }

    /**
     * 获取节点样式
     */
    getNodeStyle(type) {
        const styles = {
            PERSON: {
                shape: 'circle',
                size: 40,
                color: '#5B8FF9',
                icon: '👤'
            },
            COMPANY: {
                shape: 'rect',
                size: 50,
                color: '#5AD8A6',
                icon: '🏢'
            },
            CONTRACT: {
                shape: 'diamond',
                size: 45,
                color: '#F6BD16',
                icon: '📄'
            },
            BID: {
                shape: 'hexagon',
                size: 45,
                color: '#E86452',
                icon: '📋'
            },
            PROJECT: {
                shape: 'ellipse',
                size: 45,
                color: '#6DC8EC',
                icon: '🎯'
            }
        };
        return styles[type] || styles.PERSON;
    }

    /**
     * 获取边样式
     */
    getEdgeStyle(type, riskLevel = 'NORMAL') {
        const baseStyle = {
            lineWidth: 2,
            stroke: '#999',
            lineDash: []
        };

        // 风险等级样式
        if (riskLevel === 'HIGH') {
            baseStyle.stroke = '#ff4d4f';
            baseStyle.lineWidth = 3;
        } else if (riskLevel === 'MEDIUM') {
            baseStyle.stroke = '#faad14';
            baseStyle.lineWidth = 2.5;
        }

        // 关系类型样式
        const typeStyles = {
            FAMILY: { lineDash: [5, 5] },
            EQUITY: { lineDash: [10, 5] },
            EMPLOYMENT: { lineDash: [] },
            APPROVAL: { lineDash: [2, 2] },
            SIGN: { lineDash: [] }
        };

        return { ...baseStyle, ...(typeStyles[type] || {}) };
    }

    /**
     * 获取关系标签
     */
    getRelationLabel(type) {
        const labels = {
            FAMILY: '亲属关系',
            EQUITY: '股权关系',
            EMPLOYMENT: '任职关系',
            APPROVAL: '审批关系',
            SIGN: '签约关系',
            BID: '投标关系',
            LEGAL_REP: '法人代表',
            SHAREHOLDER: '股东',
            DIRECTOR: '董事',
            SUPERVISOR: '监事'
        };
        return labels[type] || type;
    }

    /**
     * 获取实体数据
     */
    async getEntityData(entityId) {
        // 模拟从数据库获取实体数据
        const mockData = this.getMockEntityData();
        return mockData[entityId];
    }

    /**
     * 获取实体关联关系
     */
    async getEntityRelations(entityId, includeRelations = ['ALL']) {
        // 模拟从数据库获取关联关系
        const mockRelations = this.getMockRelations();
        
        let relations = mockRelations.filter(r => 
            r.sourceId === entityId || r.targetId === entityId
        );

        // 过滤关系类型
        if (!includeRelations.includes('ALL')) {
            relations = relations.filter(r => includeRelations.includes(r.type));
        }

        // 标准化关系方向
        return relations.map(r => {
            if (r.sourceId === entityId) {
                return r;
            } else {
                return {
                    ...r,
                    sourceId: r.targetId,
                    targetId: r.sourceId
                };
            }
        });
    }

    /**
     * 增量更新图谱
     */
    async updateGraph(graphId, updates) {
        const graph = this.graphs.get(graphId);
        if (!graph) {
            throw new Error(`图谱不存在: ${graphId}`);
        }

        console.log(`开始增量更新图谱: ${graphId}`);

        const { addNodes = [], removeNodes = [], addEdges = [], removeEdges = [] } = updates;

        // 添加新节点
        for (const nodeData of addNodes) {
            const entity = await this.getEntityData(nodeData.id);
            if (entity) {
                const node = this.createNode(entity);
                if (!graph.nodes.find(n => n.id === node.id)) {
                    graph.nodes.push(node);
                    this.nodes.set(node.id, node);
                }
            }
        }

        // 删除节点
        for (const nodeId of removeNodes) {
            const index = graph.nodes.findIndex(n => n.id === nodeId);
            if (index !== -1) {
                graph.nodes.splice(index, 1);
                this.nodes.delete(nodeId);
            }
            // 同时删除相关的边
            graph.edges = graph.edges.filter(e => 
                e.source !== nodeId && e.target !== nodeId
            );
        }

        // 添加新边
        for (const edgeData of addEdges) {
            const edge = this.createEdge(edgeData);
            if (!graph.edges.find(e => e.id === edge.id)) {
                graph.edges.push(edge);
                this.edges.set(edge.id, edge);
            }
        }

        // 删除边
        for (const edgeId of removeEdges) {
            const index = graph.edges.findIndex(e => e.id === edgeId);
            if (index !== -1) {
                graph.edges.splice(index, 1);
                this.edges.delete(edgeId);
            }
        }

        // 更新元数据
        graph.metadata.updatedAt = new Date().toISOString();
        graph.metadata.nodeCount = graph.nodes.length;
        graph.metadata.edgeCount = graph.edges.length;

        // 保存更新
        await this.saveGraphToStorage(graphId, graph);

        console.log(`图谱更新完成: ${graph.nodes.length} 个节点, ${graph.edges.length} 条边`);

        return graph;
    }

    /**
     * 获取图谱
     */
    getGraph(graphId) {
        return this.graphs.get(graphId);
    }

    /**
     * 删除图谱
     */
    async deleteGraph(graphId) {
        this.graphs.delete(graphId);
        localStorage.removeItem(`graph_${graphId}`);
        console.log(`图谱已删除: ${graphId}`);
    }

    /**
     * 列出所有图谱
     */
    listGraphs() {
        return Array.from(this.graphs.values()).map(g => ({
            id: g.id,
            nodeCount: g.nodes.length,
            edgeCount: g.edges.length,
            metadata: g.metadata
        }));
    }

    /**
     * 保存图谱到存储
     */
    async saveGraphToStorage(graphId, graph) {
        try {
            localStorage.setItem(`graph_${graphId}`, JSON.stringify(graph));
        } catch (error) {
            console.error('保存图谱失败:', error);
        }
    }

    /**
     * 从存储加载图谱
     */
    async loadGraphsFromStorage() {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('graph_')) {
                    const graphData = localStorage.getItem(key);
                    if (graphData) {
                        const graph = JSON.parse(graphData);
                        this.graphs.set(graph.id, graph);
                        
                        // 重建索引
                        graph.nodes.forEach(node => this.nodes.set(node.id, node));
                        graph.edges.forEach(edge => this.edges.set(edge.id, edge));
                    }
                }
            }
        } catch (error) {
            console.error('加载图谱失败:', error);
        }
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 获取模拟实体数据
     */
    getMockEntityData() {
        return {
            'P001': {
                id: 'P001',
                type: 'PERSON',
                name: '张三',
                idCard: '110101198001011234',
                department: '采购部',
                position: '采购经理',
                riskLevel: 'NORMAL'
            },
            'P002': {
                id: 'P002',
                type: 'PERSON',
                name: '李四',
                idCard: '110101198502021234',
                department: '财务部',
                position: '财务总监',
                riskLevel: 'NORMAL'
            },
            'P003': {
                id: 'P003',
                type: 'PERSON',
                name: '王五',
                idCard: '110101199003031234',
                riskLevel: 'HIGH'
            },
            'C001': {
                id: 'C001',
                type: 'COMPANY',
                name: '某某科技有限公司',
                creditCode: '91110000MA001234XX',
                legalRep: '王五',
                riskLevel: 'HIGH'
            },
            'C002': {
                id: 'C002',
                type: 'COMPANY',
                name: '某某建筑工程公司',
                creditCode: '91110000MA005678XX',
                legalRep: '赵六',
                riskLevel: 'NORMAL'
            },
            'CT001': {
                id: 'CT001',
                type: 'CONTRACT',
                name: '办公设备采购合同',
                amount: 500000,
                date: '2024-01-15',
                status: 'SIGNED',
                riskLevel: 'MEDIUM'
            },
            'CT002': {
                id: 'CT002',
                type: 'CONTRACT',
                name: '实验室建设合同',
                amount: 2000000,
                date: '2024-02-20',
                status: 'EXECUTING',
                riskLevel: 'HIGH'
            },
            'B001': {
                id: 'B001',
                type: 'BID',
                name: '办公设备采购项目',
                amount: 500000,
                date: '2024-01-10',
                status: 'COMPLETED',
                riskLevel: 'MEDIUM'
            }
        };
    }

    /**
     * 获取模拟关联关系
     */
    getMockRelations() {
        return [
            // 张三与李四是亲属关系
            {
                sourceId: 'P001',
                targetId: 'P002',
                type: 'FAMILY',
                properties: { relation: '配偶' },
                riskLevel: 'NORMAL'
            },
            // 张三审批了合同CT001
            {
                sourceId: 'P001',
                targetId: 'CT001',
                type: 'APPROVAL',
                properties: { role: '审批人', date: '2024-01-14' },
                riskLevel: 'MEDIUM'
            },
            // 王五是C001公司的法人
            {
                sourceId: 'P003',
                targetId: 'C001',
                type: 'LEGAL_REP',
                properties: { since: '2020-01-01' },
                riskLevel: 'HIGH'
            },
            // C001公司中标了B001项目
            {
                sourceId: 'C001',
                targetId: 'B001',
                type: 'BID',
                properties: { rank: 1, score: 95 },
                riskLevel: 'HIGH'
            },
            // B001项目签订了CT001合同
            {
                sourceId: 'B001',
                targetId: 'CT001',
                type: 'SIGN',
                properties: { date: '2024-01-15' },
                riskLevel: 'MEDIUM'
            },
            // C001公司签订了CT001合同
            {
                sourceId: 'C001',
                targetId: 'CT001',
                type: 'SIGN',
                properties: { role: '乙方', date: '2024-01-15' },
                riskLevel: 'HIGH'
            },
            // 李四与C002有任职关系
            {
                sourceId: 'P002',
                targetId: 'C002',
                type: 'EMPLOYMENT',
                properties: { position: '董事', since: '2019-06-01' },
                riskLevel: 'MEDIUM'
            },
            // C002公司签订了CT002合同
            {
                sourceId: 'C002',
                targetId: 'CT002',
                type: 'SIGN',
                properties: { role: '乙方', date: '2024-02-20' },
                riskLevel: 'MEDIUM'
            }
        ];
    }
}

// 创建全局实例
window.relationGraphService = new RelationGraphService();
