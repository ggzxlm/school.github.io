/**
 * 风险路径分析服务
 * 识别风险传导路径,用红色标识风险路径,生成关联分析报告
 */

class RiskPathAnalysisService {
    constructor() {
        this.riskPaths = new Map();
        this.pathScores = new Map();
        this.initialized = false;
    }

    /**
     * 初始化服务
     */
    async initialize() {
        if (this.initialized) return;
        
        await this.loadRiskPaths();
        this.initialized = true;
        console.log('风险路径分析服务初始化完成');
    }

    /**
     * 分析风险路径
     * @param {Object} graph - 图谱对象
     * @param {string} startNodeId - 起始节点ID
     * @param {string} endNodeId - 结束节点ID (可选)
     * @returns {Promise<Array>} 风险路径列表
     */
    async analyzeRiskPaths(graph, startNodeId, endNodeId = null) {
        console.log('开始分析风险路径...');

        const paths = [];

        if (endNodeId) {
            // 分析两个节点之间的所有路径
            const allPaths = this.findAllPaths(graph, startNodeId, endNodeId);
            paths.push(...allPaths);
        } else {
            // 分析从起始节点出发的所有风险路径
            const riskNodes = graph.nodes.filter(n => 
                n.riskLevel === 'HIGH' || n.riskLevel === 'MEDIUM'
            );
            
            for (const riskNode of riskNodes) {
                if (riskNode.id !== startNodeId) {
                    const nodePaths = this.findAllPaths(graph, startNodeId, riskNode.id);
                    paths.push(...nodePaths);
                }
            }
        }

        // 评估每条路径的风险
        const evaluatedPaths = paths.map(path => this.evaluatePathRisk(path, graph));

        // 按风险评分排序
        evaluatedPaths.sort((a, b) => b.riskScore - a.riskScore);

        // 保存风险路径
        evaluatedPaths.forEach(path => {
            this.riskPaths.set(path.id, path);
        });

        await this.saveRiskPaths();

        console.log(`风险路径分析完成,发现 ${evaluatedPaths.length} 条路径`);

        return evaluatedPaths;
    }

    /**
     * 查找所有路径
     */
    findAllPaths(graph, startId, endId, maxDepth = 5) {
        const paths = [];
        const visited = new Set();

        const dfs = (currentId, targetId, currentPath, depth) => {
            if (depth > maxDepth) return;
            
            if (currentId === targetId) {
                paths.push([...currentPath]);
                return;
            }

            visited.add(currentId);

            // 查找当前节点的所有出边
            const outEdges = graph.edges.filter(e => e.source === currentId);

            for (const edge of outEdges) {
                const nextId = edge.target;
                if (!visited.has(nextId)) {
                    currentPath.push(edge);
                    dfs(nextId, targetId, currentPath, depth + 1);
                    currentPath.pop();
                }
            }

            visited.delete(currentId);
        };

        dfs(startId, endId, [], 0);

        return paths.map((path, index) => ({
            id: `path_${startId}_${endId}_${index}`,
            startNodeId: startId,
            endNodeId: endId,
            edges: path,
            nodes: this.getPathNodes(path, startId)
        }));
    }

    /**
     * 获取路径中的节点
     */
    getPathNodes(edges, startNodeId) {
        const nodes = [startNodeId];
        for (const edge of edges) {
            nodes.push(edge.target);
        }
        return nodes;
    }

    /**
     * 评估路径风险
     */
    evaluatePathRisk(path, graph) {
        let riskScore = 0;
        const riskFactors = [];

        // 1. 节点风险评分
        const nodeRiskScores = {
            HIGH: 40,
            MEDIUM: 20,
            LOW: 5,
            NORMAL: 0
        };

        for (const nodeId of path.nodes) {
            const node = graph.nodes.find(n => n.id === nodeId);
            if (node) {
                const nodeScore = nodeRiskScores[node.riskLevel] || 0;
                riskScore += nodeScore;
                
                if (node.riskLevel === 'HIGH' || node.riskLevel === 'MEDIUM') {
                    riskFactors.push({
                        type: 'NODE_RISK',
                        nodeId: node.id,
                        nodeName: node.label,
                        riskLevel: node.riskLevel,
                        description: `节点 ${node.label} 存在 ${node.riskLevel} 风险`
                    });
                }
            }
        }

        // 2. 边风险评分
        const edgeRiskScores = {
            HIGH: 30,
            MEDIUM: 15,
            LOW: 5,
            NORMAL: 0
        };

        for (const edge of path.edges) {
            const edgeScore = edgeRiskScores[edge.riskLevel] || 0;
            riskScore += edgeScore;

            if (edge.riskLevel === 'HIGH' || edge.riskLevel === 'MEDIUM') {
                riskFactors.push({
                    type: 'EDGE_RISK',
                    edgeId: edge.id,
                    edgeLabel: edge.label,
                    riskLevel: edge.riskLevel,
                    description: `关系 ${edge.label} 存在 ${edge.riskLevel} 风险`
                });
            }

            // 特殊关系类型加分
            if (edge.type === 'FAMILY') {
                riskScore += 10;
                riskFactors.push({
                    type: 'RELATION_TYPE',
                    relationType: 'FAMILY',
                    description: '存在亲属关系'
                });
            } else if (edge.type === 'EQUITY') {
                riskScore += 15;
                riskFactors.push({
                    type: 'RELATION_TYPE',
                    relationType: 'EQUITY',
                    description: '存在股权关系'
                });
            } else if (edge.type === 'CONFLICT') {
                riskScore += 25;
                riskFactors.push({
                    type: 'RELATION_TYPE',
                    relationType: 'CONFLICT',
                    description: '存在利益冲突'
                });
            }

            // 隐藏关联加分
            if (edge.isHidden) {
                riskScore += 10;
                riskFactors.push({
                    type: 'HIDDEN_RELATION',
                    description: '存在隐藏关联'
                });
            }
        }

        // 3. 路径长度评分(路径越短风险越高)
        const pathLength = path.edges.length;
        if (pathLength <= 2) {
            riskScore += 20;
            riskFactors.push({
                type: 'PATH_LENGTH',
                length: pathLength,
                description: '关联路径较短,风险传导直接'
            });
        } else if (pathLength <= 3) {
            riskScore += 10;
        }

        // 4. 特殊模式识别
        const patterns = this.identifyRiskPatterns(path, graph);
        patterns.forEach(pattern => {
            riskScore += pattern.score;
            riskFactors.push({
                type: 'RISK_PATTERN',
                pattern: pattern.name,
                description: pattern.description
            });
        });

        // 确定风险等级
        let riskLevel = 'LOW';
        if (riskScore >= 100) {
            riskLevel = 'HIGH';
        } else if (riskScore >= 50) {
            riskLevel = 'MEDIUM';
        }

        return {
            ...path,
            riskScore,
            riskLevel,
            riskFactors,
            pathLength,
            analyzedAt: new Date().toISOString()
        };
    }

    /**
     * 识别风险模式
     */
    identifyRiskPatterns(path, graph) {
        const patterns = [];

        // 模式1: 审批人-亲属-供应商
        if (this.matchPattern(path, graph, ['PERSON', 'PERSON', 'COMPANY'], ['APPROVAL', 'FAMILY', 'EQUITY'])) {
            patterns.push({
                name: 'APPROVAL_FAMILY_SUPPLIER',
                score: 50,
                description: '审批人通过亲属关系与供应商关联'
            });
        }

        // 模式2: 审批人-任职-供应商
        if (this.matchPattern(path, graph, ['PERSON', 'COMPANY'], ['APPROVAL', 'EMPLOYMENT'])) {
            patterns.push({
                name: 'APPROVAL_EMPLOYMENT_SUPPLIER',
                score: 40,
                description: '审批人在供应商企业任职'
            });
        }

        // 模式3: 多层股权关联
        const equityCount = path.edges.filter(e => e.type === 'EQUITY').length;
        if (equityCount >= 2) {
            patterns.push({
                name: 'MULTI_EQUITY',
                score: 30,
                description: '存在多层股权关联'
            });
        }

        // 模式4: 循环关联
        const nodeSet = new Set(path.nodes);
        if (nodeSet.size < path.nodes.length) {
            patterns.push({
                name: 'CIRCULAR_RELATION',
                score: 35,
                description: '存在循环关联关系'
            });
        }

        // 模式5: 隐藏关联链
        const hiddenCount = path.edges.filter(e => e.isHidden).length;
        if (hiddenCount >= 2) {
            patterns.push({
                name: 'HIDDEN_CHAIN',
                score: 25,
                description: '存在隐藏关联链'
            });
        }

        return patterns;
    }

    /**
     * 匹配路径模式
     */
    matchPattern(path, graph, nodeTypes, edgeTypes) {
        if (path.nodes.length !== nodeTypes.length) return false;
        if (path.edges.length !== edgeTypes.length) return false;

        // 检查节点类型
        for (let i = 0; i < path.nodes.length; i++) {
            const node = graph.nodes.find(n => n.id === path.nodes[i]);
            if (!node || node.type !== nodeTypes[i]) return false;
        }

        // 检查边类型
        for (let i = 0; i < path.edges.length; i++) {
            if (path.edges[i].type !== edgeTypes[i]) return false;
        }

        return true;
    }

    /**
     * 标识风险路径
     * 在图谱中用红色标识风险路径
     */
    markRiskPathsInGraph(graph, riskPaths) {
        const highRiskPaths = riskPaths.filter(p => p.riskLevel === 'HIGH');

        // 收集所有高风险路径中的节点和边
        const riskNodeIds = new Set();
        const riskEdgeIds = new Set();

        for (const path of highRiskPaths) {
            path.nodes.forEach(nodeId => riskNodeIds.add(nodeId));
            path.edges.forEach(edge => riskEdgeIds.add(edge.id));
        }

        // 更新节点样式
        graph.nodes.forEach(node => {
            if (riskNodeIds.has(node.id)) {
                node.style = {
                    ...node.style,
                    fill: '#ff4d4f',
                    stroke: '#cf1322',
                    lineWidth: 3
                };
                node.isInRiskPath = true;
            }
        });

        // 更新边样式
        graph.edges.forEach(edge => {
            if (riskEdgeIds.has(edge.id)) {
                edge.style = {
                    ...edge.style,
                    stroke: '#ff4d4f',
                    lineWidth: 3
                };
                edge.isInRiskPath = true;
            }
        });

        return graph;
    }

    /**
     * 生成关联分析报告
     */
    generateAnalysisReport(graph, riskPaths, hiddenRelations) {
        const highRiskPaths = riskPaths.filter(p => p.riskLevel === 'HIGH');
        const mediumRiskPaths = riskPaths.filter(p => p.riskLevel === 'MEDIUM');

        const report = {
            reportId: `report_${Date.now()}`,
            graphId: graph.id,
            generatedAt: new Date().toISOString(),
            
            // 概览
            summary: {
                totalNodes: graph.nodes.length,
                totalEdges: graph.edges.length,
                highRiskNodes: graph.nodes.filter(n => n.riskLevel === 'HIGH').length,
                mediumRiskNodes: graph.nodes.filter(n => n.riskLevel === 'MEDIUM').length,
                totalPaths: riskPaths.length,
                highRiskPaths: highRiskPaths.length,
                mediumRiskPaths: mediumRiskPaths.length,
                hiddenRelations: hiddenRelations?.length || 0
            },

            // 高风险路径详情
            highRiskPaths: highRiskPaths.map(path => ({
                pathId: path.id,
                riskScore: path.riskScore,
                riskLevel: path.riskLevel,
                pathLength: path.pathLength,
                startNode: this.getNodeInfo(graph, path.startNodeId),
                endNode: this.getNodeInfo(graph, path.endNodeId),
                riskFactors: path.riskFactors,
                description: this.generatePathDescription(path, graph)
            })),

            // 风险节点分析
            riskNodes: this.analyzeRiskNodes(graph, riskPaths),

            // 风险关系分析
            riskRelations: this.analyzeRiskRelations(graph, riskPaths),

            // 风险模式统计
            riskPatterns: this.statisticsRiskPatterns(riskPaths),

            // 建议措施
            recommendations: this.generateRecommendations(graph, riskPaths, hiddenRelations)
        };

        return report;
    }

    /**
     * 获取节点信息
     */
    getNodeInfo(graph, nodeId) {
        const node = graph.nodes.find(n => n.id === nodeId);
        if (!node) return null;

        return {
            id: node.id,
            label: node.label,
            type: node.type,
            riskLevel: node.riskLevel,
            properties: node.properties
        };
    }

    /**
     * 生成路径描述
     */
    generatePathDescription(path, graph) {
        const parts = [];
        
        for (let i = 0; i < path.nodes.length; i++) {
            const node = graph.nodes.find(n => n.id === path.nodes[i]);
            if (node) {
                parts.push(node.label);
            }
            
            if (i < path.edges.length) {
                const edge = path.edges[i];
                parts.push(`-[${edge.label}]->`);
            }
        }

        return parts.join(' ');
    }

    /**
     * 分析风险节点
     */
    analyzeRiskNodes(graph, riskPaths) {
        const nodeFrequency = new Map();

        // 统计节点在风险路径中出现的频率
        for (const path of riskPaths) {
            for (const nodeId of path.nodes) {
                const count = nodeFrequency.get(nodeId) || 0;
                nodeFrequency.set(nodeId, count + 1);
            }
        }

        // 找出关键风险节点
        const riskNodes = [];
        for (const [nodeId, frequency] of nodeFrequency.entries()) {
            if (frequency >= 2) {
                const node = graph.nodes.find(n => n.id === nodeId);
                if (node) {
                    riskNodes.push({
                        ...this.getNodeInfo(graph, nodeId),
                        frequency,
                        importance: this.calculateNodeImportance(nodeId, graph, riskPaths)
                    });
                }
            }
        }

        // 按重要性排序
        riskNodes.sort((a, b) => b.importance - a.importance);

        return riskNodes;
    }

    /**
     * 计算节点重要性
     */
    calculateNodeImportance(nodeId, graph, riskPaths) {
        let importance = 0;

        // 出现在高风险路径中的次数
        const highRiskCount = riskPaths.filter(p => 
            p.riskLevel === 'HIGH' && p.nodes.includes(nodeId)
        ).length;
        importance += highRiskCount * 10;

        // 节点的度(连接数)
        const degree = graph.edges.filter(e => 
            e.source === nodeId || e.target === nodeId
        ).length;
        importance += degree * 2;

        // 节点自身的风险等级
        const node = graph.nodes.find(n => n.id === nodeId);
        if (node) {
            const riskScores = { HIGH: 20, MEDIUM: 10, LOW: 5, NORMAL: 0 };
            importance += riskScores[node.riskLevel] || 0;
        }

        return importance;
    }

    /**
     * 分析风险关系
     */
    analyzeRiskRelations(graph, riskPaths) {
        const relationTypes = {};

        for (const path of riskPaths) {
            for (const edge of path.edges) {
                if (!relationTypes[edge.type]) {
                    relationTypes[edge.type] = {
                        type: edge.type,
                        label: edge.label,
                        count: 0,
                        highRiskCount: 0,
                        examples: []
                    };
                }

                relationTypes[edge.type].count++;
                if (path.riskLevel === 'HIGH') {
                    relationTypes[edge.type].highRiskCount++;
                }

                if (relationTypes[edge.type].examples.length < 3) {
                    relationTypes[edge.type].examples.push({
                        source: this.getNodeInfo(graph, edge.source),
                        target: this.getNodeInfo(graph, edge.target),
                        riskLevel: edge.riskLevel
                    });
                }
            }
        }

        return Object.values(relationTypes).sort((a, b) => b.highRiskCount - a.highRiskCount);
    }

    /**
     * 统计风险模式
     */
    statisticsRiskPatterns(riskPaths) {
        const patterns = {};

        for (const path of riskPaths) {
            for (const factor of path.riskFactors) {
                if (factor.type === 'RISK_PATTERN') {
                    if (!patterns[factor.pattern]) {
                        patterns[factor.pattern] = {
                            pattern: factor.pattern,
                            description: factor.description,
                            count: 0
                        };
                    }
                    patterns[factor.pattern].count++;
                }
            }
        }

        return Object.values(patterns).sort((a, b) => b.count - a.count);
    }

    /**
     * 生成建议措施
     */
    generateRecommendations(graph, riskPaths, hiddenRelations) {
        const recommendations = [];

        const highRiskCount = riskPaths.filter(p => p.riskLevel === 'HIGH').length;
        if (highRiskCount > 0) {
            recommendations.push({
                priority: 'HIGH',
                category: '风险路径',
                title: `发现 ${highRiskCount} 条高风险路径`,
                description: '存在明显的利益关联或冲突,建议立即核查',
                actions: [
                    '核实路径中的关联关系真实性',
                    '评估是否存在利益输送',
                    '检查相关业务流程的合规性',
                    '对涉及人员进行约谈调查'
                ]
            });
        }

        const conflictPaths = riskPaths.filter(p => 
            p.riskFactors.some(f => f.type === 'RISK_PATTERN' && f.pattern.includes('APPROVAL'))
        );
        if (conflictPaths.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                category: '利益冲突',
                title: `发现 ${conflictPaths.length} 个审批相关风险`,
                description: '审批人员与供应商或承包商存在关联',
                actions: [
                    '审查审批流程是否符合回避制度',
                    '核查是否存在违规审批',
                    '完善利益关联申报机制',
                    '加强审批监督和制约'
                ]
            });
        }

        if (hiddenRelations && hiddenRelations.length > 0) {
            const highRiskHidden = hiddenRelations.filter(r => r.riskLevel === 'HIGH').length;
            if (highRiskHidden > 0) {
                recommendations.push({
                    priority: 'MEDIUM',
                    category: '隐藏关联',
                    title: `发现 ${highRiskHidden} 个高风险隐藏关联`,
                    description: '通过数据分析发现的潜在关联关系',
                    actions: [
                        '核实隐藏关联的真实性',
                        '完善人员关系申报制度',
                        '建立关联关系数据库',
                        '定期开展关联关系排查'
                    ]
                });
            }
        }

        return recommendations;
    }

    /**
     * 保存风险路径
     */
    async saveRiskPaths() {
        try {
            const data = Array.from(this.riskPaths.values());
            localStorage.setItem('risk_paths', JSON.stringify(data));
        } catch (error) {
            console.error('保存风险路径失败:', error);
        }
    }

    /**
     * 加载风险路径
     */
    async loadRiskPaths() {
        try {
            const data = localStorage.getItem('risk_paths');
            if (data) {
                const paths = JSON.parse(data);
                paths.forEach(p => this.riskPaths.set(p.id, p));
            }
        } catch (error) {
            console.error('加载风险路径失败:', error);
        }
    }
}

// 创建全局实例
window.riskPathAnalysisService = new RiskPathAnalysisService();
