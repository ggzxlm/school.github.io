/**
 * 关联层级和过滤服务
 * 支持设置关联层级(1-5层)、按实体类型过滤、识别关键节点
 */

class RelationFilterService {
    constructor() {
        this.filters = {
            depth: 3,
            entityTypes: [],
            relationTypes: [],
            riskLevels: [],
            includeHidden: true,
            minConfidence: 0
        };
        this.keyNodes = new Map();
        this.initialized = false;
    }

    /**
     * 初始化服务
     */
    async initialize() {
        if (this.initialized) return;
        
        this.initialized = true;
        console.log('关联层级和过滤服务初始化完成');
    }

    /**
     * 按层级过滤图谱
     * @param {Object} graph - 原始图谱
     * @param {string} centerNodeId - 中心节点ID
     * @param {number} depth - 层级深度(1-5)
     * @returns {Object} 过滤后的图谱
     */
    filterByDepth(graph, centerNodeId, depth = 3) {
        if (depth < 1 || depth > 5) {
            throw new Error('层级深度必须在1-5之间');
        }

        console.log(`按层级过滤图谱: 中心节点=${centerNodeId}, 深度=${depth}`);

        const filteredNodes = new Set();
        const filteredEdges = [];
        const nodeLevels = new Map();

        // BFS遍历,记录每个节点的层级
        const queue = [{ nodeId: centerNodeId, level: 0 }];
        const visited = new Set([centerNodeId]);
        filteredNodes.add(centerNodeId);
        nodeLevels.set(centerNodeId, 0);

        while (queue.length > 0) {
            const { nodeId, level } = queue.shift();

            if (level >= depth) continue;

            // 查找相邻节点
            const adjacentEdges = graph.edges.filter(e => 
                e.source === nodeId || e.target === nodeId
            );

            for (const edge of adjacentEdges) {
                const nextNodeId = edge.source === nodeId ? edge.target : edge.source;

                if (!visited.has(nextNodeId)) {
                    visited.add(nextNodeId);
                    filteredNodes.add(nextNodeId);
                    nodeLevels.set(nextNodeId, level + 1);
                    queue.push({ nodeId: nextNodeId, level: level + 1 });
                }

                // 添加边(如果两端节点都在过滤范围内)
                if (filteredNodes.has(edge.source) && filteredNodes.has(edge.target)) {
                    filteredEdges.push(edge);
                }
            }
        }

        // 构建过滤后的图谱
        const filteredGraph = {
            ...graph,
            nodes: graph.nodes.filter(n => filteredNodes.has(n.id)).map(n => ({
                ...n,
                level: nodeLevels.get(n.id),
                isCenterNode: n.id === centerNodeId
            })),
            edges: filteredEdges,
            metadata: {
                ...graph.metadata,
                centerNodeId,
                depth,
                filteredAt: new Date().toISOString()
            }
        };

        console.log(`过滤完成: ${filteredGraph.nodes.length} 个节点, ${filteredGraph.edges.length} 条边`);

        return filteredGraph;
    }

    /**
     * 按实体类型过滤
     * @param {Object} graph - 原始图谱
     * @param {Array} entityTypes - 实体类型列表
     * @returns {Object} 过滤后的图谱
     */
    filterByEntityType(graph, entityTypes) {
        if (!entityTypes || entityTypes.length === 0) {
            return graph;
        }

        console.log(`按实体类型过滤: ${entityTypes.join(', ')}`);

        const filteredNodes = graph.nodes.filter(n => 
            entityTypes.includes(n.type)
        );

        const nodeIds = new Set(filteredNodes.map(n => n.id));
        const filteredEdges = graph.edges.filter(e => 
            nodeIds.has(e.source) && nodeIds.has(e.target)
        );

        return {
            ...graph,
            nodes: filteredNodes,
            edges: filteredEdges,
            metadata: {
                ...graph.metadata,
                entityTypeFilter: entityTypes,
                filteredAt: new Date().toISOString()
            }
        };
    }

    /**
     * 按关系类型过滤
     * @param {Object} graph - 原始图谱
     * @param {Array} relationTypes - 关系类型列表
     * @returns {Object} 过滤后的图谱
     */
    filterByRelationType(graph, relationTypes) {
        if (!relationTypes || relationTypes.length === 0) {
            return graph;
        }

        console.log(`按关系类型过滤: ${relationTypes.join(', ')}`);

        const filteredEdges = graph.edges.filter(e => 
            relationTypes.includes(e.type)
        );

        // 保留有边连接的节点
        const connectedNodeIds = new Set();
        filteredEdges.forEach(e => {
            connectedNodeIds.add(e.source);
            connectedNodeIds.add(e.target);
        });

        const filteredNodes = graph.nodes.filter(n => 
            connectedNodeIds.has(n.id)
        );

        return {
            ...graph,
            nodes: filteredNodes,
            edges: filteredEdges,
            metadata: {
                ...graph.metadata,
                relationTypeFilter: relationTypes,
                filteredAt: new Date().toISOString()
            }
        };
    }

    /**
     * 按风险等级过滤
     * @param {Object} graph - 原始图谱
     * @param {Array} riskLevels - 风险等级列表
     * @returns {Object} 过滤后的图谱
     */
    filterByRiskLevel(graph, riskLevels) {
        if (!riskLevels || riskLevels.length === 0) {
            return graph;
        }

        console.log(`按风险等级过滤: ${riskLevels.join(', ')}`);

        const filteredNodes = graph.nodes.filter(n => 
            riskLevels.includes(n.riskLevel)
        );

        const filteredEdges = graph.edges.filter(e => 
            riskLevels.includes(e.riskLevel)
        );

        // 保留有边连接的节点
        const connectedNodeIds = new Set();
        filteredEdges.forEach(e => {
            connectedNodeIds.add(e.source);
            connectedNodeIds.add(e.target);
        });

        const finalNodes = filteredNodes.filter(n => 
            connectedNodeIds.has(n.id)
        );

        return {
            ...graph,
            nodes: finalNodes,
            edges: filteredEdges,
            metadata: {
                ...graph.metadata,
                riskLevelFilter: riskLevels,
                filteredAt: new Date().toISOString()
            }
        };
    }

    /**
     * 组合过滤
     * @param {Object} graph - 原始图谱
     * @param {Object} filters - 过滤条件
     * @returns {Object} 过滤后的图谱
     */
    applyFilters(graph, filters = {}) {
        let filteredGraph = { ...graph };

        // 应用层级过滤
        if (filters.centerNodeId && filters.depth) {
            filteredGraph = this.filterByDepth(filteredGraph, filters.centerNodeId, filters.depth);
        }

        // 应用实体类型过滤
        if (filters.entityTypes && filters.entityTypes.length > 0) {
            filteredGraph = this.filterByEntityType(filteredGraph, filters.entityTypes);
        }

        // 应用关系类型过滤
        if (filters.relationTypes && filters.relationTypes.length > 0) {
            filteredGraph = this.filterByRelationType(filteredGraph, filters.relationTypes);
        }

        // 应用风险等级过滤
        if (filters.riskLevels && filters.riskLevels.length > 0) {
            filteredGraph = this.filterByRiskLevel(filteredGraph, filters.riskLevels);
        }

        // 过滤隐藏关联
        if (filters.includeHidden === false) {
            filteredGraph.edges = filteredGraph.edges.filter(e => !e.isHidden);
        }

        // 过滤低置信度关联
        if (filters.minConfidence && filters.minConfidence > 0) {
            filteredGraph.edges = filteredGraph.edges.filter(e => 
                !e.confidence || e.confidence >= filters.minConfidence
            );
        }

        return filteredGraph;
    }

    /**
     * 识别关键节点
     * @param {Object} graph - 图谱对象
     * @returns {Array} 关键节点列表
     */
    identifyKeyNodes(graph) {
        console.log('开始识别关键节点...');

        const keyNodes = [];

        for (const node of graph.nodes) {
            const metrics = this.calculateNodeMetrics(node, graph);
            
            // 判断是否为关键节点
            if (this.isKeyNode(metrics)) {
                keyNodes.push({
                    ...node,
                    metrics,
                    keyNodeType: this.determineKeyNodeType(metrics),
                    importance: this.calculateImportance(metrics)
                });
            }
        }

        // 按重要性排序
        keyNodes.sort((a, b) => b.importance - a.importance);

        // 保存关键节点
        keyNodes.forEach(node => {
            this.keyNodes.set(node.id, node);
        });

        console.log(`识别完成,发现 ${keyNodes.length} 个关键节点`);

        return keyNodes;
    }

    /**
     * 计算节点指标
     */
    calculateNodeMetrics(node, graph) {
        const metrics = {};

        // 1. 度中心性(Degree Centrality)
        const inDegree = graph.edges.filter(e => e.target === node.id).length;
        const outDegree = graph.edges.filter(e => e.source === node.id).length;
        metrics.degree = inDegree + outDegree;
        metrics.inDegree = inDegree;
        metrics.outDegree = outDegree;

        // 2. 介数中心性(Betweenness Centrality) - 简化计算
        metrics.betweenness = this.calculateBetweenness(node.id, graph);

        // 3. 接近中心性(Closeness Centrality)
        metrics.closeness = this.calculateCloseness(node.id, graph);

        // 4. 特征向量中心性(Eigenvector Centrality) - 简化为邻居的度之和
        const neighbors = this.getNeighbors(node.id, graph);
        metrics.eigenvector = neighbors.reduce((sum, neighborId) => {
            const neighborDegree = graph.edges.filter(e => 
                e.source === neighborId || e.target === neighborId
            ).length;
            return sum + neighborDegree;
        }, 0);

        // 5. 风险相关指标
        metrics.riskLevel = node.riskLevel;
        metrics.riskScore = this.getRiskScore(node.riskLevel);

        // 6. 关系类型多样性
        const relatedEdges = graph.edges.filter(e => 
            e.source === node.id || e.target === node.id
        );
        const relationTypes = new Set(relatedEdges.map(e => e.type));
        metrics.relationDiversity = relationTypes.size;

        // 7. 高风险关联数
        metrics.highRiskConnections = relatedEdges.filter(e => 
            e.riskLevel === 'HIGH'
        ).length;

        return metrics;
    }

    /**
     * 计算介数中心性(简化版)
     */
    calculateBetweenness(nodeId, graph) {
        // 简化计算:统计经过该节点的最短路径数量
        let betweenness = 0;
        const nodes = graph.nodes.map(n => n.id);

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const source = nodes[i];
                const target = nodes[j];
                
                if (source === nodeId || target === nodeId) continue;

                const paths = this.findShortestPaths(graph, source, target);
                const pathsThroughNode = paths.filter(path => 
                    path.includes(nodeId)
                ).length;

                if (paths.length > 0) {
                    betweenness += pathsThroughNode / paths.length;
                }
            }
        }

        return betweenness;
    }

    /**
     * 查找最短路径
     */
    findShortestPaths(graph, startId, endId) {
        const queue = [[startId]];
        const visited = new Set();
        const shortestPaths = [];
        let shortestLength = Infinity;

        while (queue.length > 0) {
            const path = queue.shift();
            const currentId = path[path.length - 1];

            if (path.length > shortestLength) break;

            if (currentId === endId) {
                if (path.length < shortestLength) {
                    shortestLength = path.length;
                    shortestPaths.length = 0;
                }
                shortestPaths.push(path);
                continue;
            }

            if (visited.has(currentId)) continue;
            visited.add(currentId);

            const neighbors = this.getNeighbors(currentId, graph);
            for (const neighborId of neighbors) {
                if (!path.includes(neighborId)) {
                    queue.push([...path, neighborId]);
                }
            }
        }

        return shortestPaths;
    }

    /**
     * 计算接近中心性
     */
    calculateCloseness(nodeId, graph) {
        const distances = this.calculateDistances(nodeId, graph);
        const totalDistance = Array.from(distances.values()).reduce((sum, d) => sum + d, 0);
        
        if (totalDistance === 0) return 0;
        
        return (graph.nodes.length - 1) / totalDistance;
    }

    /**
     * 计算到其他节点的距离
     */
    calculateDistances(startId, graph) {
        const distances = new Map();
        const queue = [{ nodeId: startId, distance: 0 }];
        const visited = new Set([startId]);

        while (queue.length > 0) {
            const { nodeId, distance } = queue.shift();
            distances.set(nodeId, distance);

            const neighbors = this.getNeighbors(nodeId, graph);
            for (const neighborId of neighbors) {
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    queue.push({ nodeId: neighborId, distance: distance + 1 });
                }
            }
        }

        return distances;
    }

    /**
     * 获取邻居节点
     */
    getNeighbors(nodeId, graph) {
        const neighbors = new Set();
        
        graph.edges.forEach(edge => {
            if (edge.source === nodeId) {
                neighbors.add(edge.target);
            } else if (edge.target === nodeId) {
                neighbors.add(edge.source);
            }
        });

        return Array.from(neighbors);
    }

    /**
     * 判断是否为关键节点
     */
    isKeyNode(metrics) {
        // 满足以下任一条件即为关键节点:
        // 1. 度中心性高(连接数多)
        if (metrics.degree >= 5) return true;
        
        // 2. 介数中心性高(桥接作用强)
        if (metrics.betweenness >= 10) return true;
        
        // 3. 高风险节点且有多个高风险连接
        if (metrics.riskLevel === 'HIGH' && metrics.highRiskConnections >= 2) return true;
        
        // 4. 关系类型多样性高
        if (metrics.relationDiversity >= 4) return true;
        
        // 5. 特征向量中心性高(连接重要节点)
        if (metrics.eigenvector >= 20) return true;

        return false;
    }

    /**
     * 确定关键节点类型
     */
    determineKeyNodeType(metrics) {
        const types = [];

        if (metrics.degree >= 5) {
            types.push('HUB'); // 枢纽节点
        }

        if (metrics.betweenness >= 10) {
            types.push('BRIDGE'); // 桥接节点
        }

        if (metrics.riskLevel === 'HIGH') {
            types.push('RISK'); // 风险节点
        }

        if (metrics.relationDiversity >= 4) {
            types.push('DIVERSE'); // 多样性节点
        }

        if (metrics.eigenvector >= 20) {
            types.push('INFLUENTIAL'); // 影响力节点
        }

        return types.length > 0 ? types : ['NORMAL'];
    }

    /**
     * 计算重要性得分
     */
    calculateImportance(metrics) {
        let score = 0;

        // 度中心性权重
        score += metrics.degree * 5;

        // 介数中心性权重
        score += metrics.betweenness * 3;

        // 接近中心性权重
        score += metrics.closeness * 10;

        // 特征向量中心性权重
        score += metrics.eigenvector * 2;

        // 风险权重
        score += metrics.riskScore * 10;

        // 高风险连接权重
        score += metrics.highRiskConnections * 8;

        // 关系多样性权重
        score += metrics.relationDiversity * 4;

        return score;
    }

    /**
     * 获取风险分数
     */
    getRiskScore(riskLevel) {
        const scores = {
            HIGH: 10,
            MEDIUM: 5,
            LOW: 2,
            NORMAL: 0
        };
        return scores[riskLevel] || 0;
    }

    /**
     * 获取关键节点
     */
    getKeyNodes() {
        return Array.from(this.keyNodes.values());
    }

    /**
     * 按类型获取关键节点
     */
    getKeyNodesByType(type) {
        return Array.from(this.keyNodes.values()).filter(node => 
            node.keyNodeType.includes(type)
        );
    }

    /**
     * 生成过滤器配置选项
     */
    getFilterOptions(graph) {
        // 实体类型选项
        const entityTypes = [...new Set(graph.nodes.map(n => n.type))];

        // 关系类型选项
        const relationTypes = [...new Set(graph.edges.map(e => e.type))];

        // 风险等级选项
        const riskLevels = ['HIGH', 'MEDIUM', 'LOW', 'NORMAL'];

        return {
            entityTypes: entityTypes.map(type => ({
                value: type,
                label: this.getEntityTypeLabel(type),
                count: graph.nodes.filter(n => n.type === type).length
            })),
            relationTypes: relationTypes.map(type => ({
                value: type,
                label: this.getRelationTypeLabel(type),
                count: graph.edges.filter(e => e.type === type).length
            })),
            riskLevels: riskLevels.map(level => ({
                value: level,
                label: level,
                count: graph.nodes.filter(n => n.riskLevel === level).length
            })),
            depthOptions: [1, 2, 3, 4, 5]
        };
    }

    /**
     * 获取实体类型标签
     */
    getEntityTypeLabel(type) {
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
     * 获取关系类型标签
     */
    getRelationTypeLabel(type) {
        const labels = {
            FAMILY: '亲属关系',
            EQUITY: '股权关系',
            EMPLOYMENT: '任职关系',
            APPROVAL: '审批关系',
            SIGN: '签约关系',
            BID: '投标关系',
            INTEREST: '利益关联',
            CONFLICT: '利益冲突'
        };
        return labels[type] || type;
    }
}

// 创建全局实例
window.relationFilterService = new RelationFilterService();
