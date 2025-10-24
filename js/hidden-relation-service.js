/**
 * 隐藏关联识别服务
 * 自动识别亲属关系、股权关系、任职关系等隐藏关联
 */

class HiddenRelationService {
    constructor() {
        this.relationRules = [];
        this.discoveredRelations = new Map();
        this.initialized = false;
    }

    /**
     * 初始化服务
     */
    async initialize() {
        if (this.initialized) return;
        
        // 加载关联识别规则
        this.loadRelationRules();
        
        // 加载已发现的关联
        await this.loadDiscoveredRelations();
        
        this.initialized = true;
        console.log('隐藏关联识别服务初始化完成');
    }

    /**
     * 加载关联识别规则
     */
    loadRelationRules() {
        this.relationRules = [
            // 亲属关系识别规则
            {
                id: 'FAMILY_SAME_ADDRESS',
                type: 'FAMILY',
                name: '同住址亲属识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'PERSON' && 
                           entity2.type === 'PERSON' &&
                           entity1.address && 
                           entity2.address &&
                           entity1.address === entity2.address &&
                           entity1.id !== entity2.id;
                },
                confidence: 0.7,
                riskLevel: 'MEDIUM'
            },
            {
                id: 'FAMILY_SAME_SURNAME',
                type: 'FAMILY',
                name: '同姓氏亲属识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'PERSON' && 
                           entity2.type === 'PERSON' &&
                           entity1.name && 
                           entity2.name &&
                           entity1.name[0] === entity2.name[0] &&
                           entity1.id !== entity2.id;
                },
                confidence: 0.3,
                riskLevel: 'LOW'
            },
            {
                id: 'FAMILY_EMERGENCY_CONTACT',
                type: 'FAMILY',
                name: '紧急联系人亲属识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'PERSON' && 
                           entity2.type === 'PERSON' &&
                           entity1.emergencyContact === entity2.id;
                },
                confidence: 0.9,
                riskLevel: 'HIGH'
            },
            
            // 股权关系识别规则
            {
                id: 'EQUITY_SHAREHOLDER',
                type: 'EQUITY',
                name: '股东关系识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'PERSON' && 
                           entity2.type === 'COMPANY' &&
                           entity2.shareholders &&
                           entity2.shareholders.some(s => s.id === entity1.id);
                },
                confidence: 1.0,
                riskLevel: 'HIGH'
            },
            {
                id: 'EQUITY_LEGAL_REP',
                type: 'EQUITY',
                name: '法人代表关系识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'PERSON' && 
                           entity2.type === 'COMPANY' &&
                           entity2.legalRep === entity1.name;
                },
                confidence: 1.0,
                riskLevel: 'HIGH'
            },
            {
                id: 'EQUITY_CROSS_HOLDING',
                type: 'EQUITY',
                name: '交叉持股识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'COMPANY' && 
                           entity2.type === 'COMPANY' &&
                           entity1.shareholders &&
                           entity2.shareholders &&
                           entity1.shareholders.some(s => s.id === entity2.id) &&
                           entity2.shareholders.some(s => s.id === entity1.id);
                },
                confidence: 1.0,
                riskLevel: 'HIGH'
            },
            
            // 任职关系识别规则
            {
                id: 'EMPLOYMENT_DIRECTOR',
                type: 'EMPLOYMENT',
                name: '董事关系识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'PERSON' && 
                           entity2.type === 'COMPANY' &&
                           entity2.directors &&
                           entity2.directors.includes(entity1.id);
                },
                confidence: 1.0,
                riskLevel: 'MEDIUM'
            },
            {
                id: 'EMPLOYMENT_SUPERVISOR',
                type: 'EMPLOYMENT',
                name: '监事关系识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'PERSON' && 
                           entity2.type === 'COMPANY' &&
                           entity2.supervisors &&
                           entity2.supervisors.includes(entity1.id);
                },
                confidence: 1.0,
                riskLevel: 'MEDIUM'
            },
            {
                id: 'EMPLOYMENT_MANAGER',
                type: 'EMPLOYMENT',
                name: '高管关系识别',
                condition: (entity1, entity2) => {
                    return entity1.type === 'PERSON' && 
                           entity2.type === 'COMPANY' &&
                           entity2.managers &&
                           entity2.managers.includes(entity1.id);
                },
                confidence: 1.0,
                riskLevel: 'MEDIUM'
            },
            
            // 利益关联识别规则
            {
                id: 'INTEREST_APPROVAL_SUPPLIER',
                type: 'INTEREST',
                name: '审批人与供应商关联',
                condition: (entity1, entity2, graph) => {
                    if (entity1.type !== 'PERSON' || entity2.type !== 'COMPANY') {
                        return false;
                    }
                    // 检查是否存在审批关系和供应商关系
                    const hasApproval = graph.edges.some(e => 
                        e.source === entity1.id && 
                        e.type === 'APPROVAL'
                    );
                    const isSupplier = entity2.properties && entity2.properties.isSupplier;
                    return hasApproval && isSupplier;
                },
                confidence: 0.8,
                riskLevel: 'HIGH'
            }
        ];
    }

    /**
     * 识别隐藏关联
     * @param {Object} graph - 图谱对象
     * @returns {Promise<Array>} 发现的隐藏关联列表
     */
    async identifyHiddenRelations(graph) {
        console.log('开始识别隐藏关联...');
        
        const hiddenRelations = [];
        const nodes = graph.nodes;

        // 遍历所有节点对
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const entity1 = nodes[i];
                const entity2 = nodes[j];

                // 检查是否已存在显式关联
                const hasExplicitRelation = graph.edges.some(e => 
                    (e.source === entity1.id && e.target === entity2.id) ||
                    (e.source === entity2.id && e.target === entity1.id)
                );

                if (hasExplicitRelation) continue;

                // 应用识别规则
                for (const rule of this.relationRules) {
                    try {
                        const matched = rule.condition(entity1, entity2, graph);
                        if (matched) {
                            const relation = {
                                id: `hidden_${entity1.id}_${entity2.id}_${rule.type}`,
                                sourceId: entity1.id,
                                targetId: entity2.id,
                                type: rule.type,
                                subType: rule.id,
                                label: rule.name,
                                confidence: rule.confidence,
                                riskLevel: rule.riskLevel,
                                discoveredAt: new Date().toISOString(),
                                isHidden: true
                            };
                            
                            hiddenRelations.push(relation);
                            this.discoveredRelations.set(relation.id, relation);
                        }
                    } catch (error) {
                        console.error(`规则执行失败: ${rule.id}`, error);
                    }
                }
            }
        }

        // 推理间接关联
        const inferredRelations = await this.inferIndirectRelations(graph, hiddenRelations);
        hiddenRelations.push(...inferredRelations);

        // 保存发现的关联
        await this.saveDiscoveredRelations();

        console.log(`识别完成,发现 ${hiddenRelations.length} 个隐藏关联`);
        
        return hiddenRelations;
    }

    /**
     * 推理间接关联
     */
    async inferIndirectRelations(graph, directRelations) {
        const inferredRelations = [];

        // 规则1: 如果A和B是亲属,B和C有股权关系,则A和C有间接利益关联
        for (const rel1 of directRelations) {
            if (rel1.type === 'FAMILY') {
                for (const rel2 of [...graph.edges, ...directRelations]) {
                    if (rel2.type === 'EQUITY' && rel1.targetId === rel2.sourceId) {
                        const inferred = {
                            id: `inferred_${rel1.sourceId}_${rel2.targetId}_INTEREST`,
                            sourceId: rel1.sourceId,
                            targetId: rel2.targetId,
                            type: 'INTEREST',
                            subType: 'INFERRED_FAMILY_EQUITY',
                            label: '间接利益关联(亲属-股权)',
                            confidence: Math.min(rel1.confidence || 0.8, rel2.confidence || 0.8) * 0.8,
                            riskLevel: 'HIGH',
                            inferredFrom: [rel1.id, rel2.id],
                            discoveredAt: new Date().toISOString(),
                            isHidden: true,
                            isInferred: true
                        };
                        inferredRelations.push(inferred);
                        this.discoveredRelations.set(inferred.id, inferred);
                    }
                }
            }
        }

        // 规则2: 如果A审批了合同,B是合同的供应商,且A和B有任何关联,则标记为高风险
        const approvalEdges = graph.edges.filter(e => e.type === 'APPROVAL');
        const signEdges = graph.edges.filter(e => e.type === 'SIGN');

        for (const approval of approvalEdges) {
            for (const sign of signEdges) {
                if (approval.target === sign.target) {
                    // 检查审批人和供应商之间是否有关联
                    const hasRelation = [...graph.edges, ...directRelations].some(e =>
                        (e.source === approval.source && e.target === sign.source) ||
                        (e.source === sign.source && e.target === approval.source)
                    );

                    if (hasRelation) {
                        const inferred = {
                            id: `inferred_${approval.source}_${sign.source}_CONFLICT`,
                            sourceId: approval.source,
                            targetId: sign.source,
                            type: 'CONFLICT',
                            subType: 'APPROVAL_SUPPLIER_CONFLICT',
                            label: '利益冲突(审批-供应商)',
                            confidence: 0.9,
                            riskLevel: 'HIGH',
                            inferredFrom: [approval.id, sign.id],
                            discoveredAt: new Date().toISOString(),
                            isHidden: true,
                            isInferred: true
                        };
                        inferredRelations.push(inferred);
                        this.discoveredRelations.set(inferred.id, inferred);
                    }
                }
            }
        }

        return inferredRelations;
    }

    /**
     * 标注风险关联
     */
    markRiskRelations(relations) {
        return relations.map(relation => {
            // 计算风险评分
            let riskScore = 0;

            // 基于关联类型的风险
            const typeRisk = {
                'FAMILY': 30,
                'EQUITY': 40,
                'EMPLOYMENT': 20,
                'INTEREST': 50,
                'CONFLICT': 60
            };
            riskScore += typeRisk[relation.type] || 0;

            // 基于置信度的风险
            riskScore += (relation.confidence || 0.5) * 30;

            // 基于推理深度的风险
            if (relation.isInferred) {
                riskScore += 10;
            }

            // 确定风险等级
            let riskLevel = 'LOW';
            if (riskScore >= 70) {
                riskLevel = 'HIGH';
            } else if (riskScore >= 40) {
                riskLevel = 'MEDIUM';
            }

            return {
                ...relation,
                riskScore,
                riskLevel,
                riskFactors: this.identifyRiskFactors(relation)
            };
        });
    }

    /**
     * 识别风险因素
     */
    identifyRiskFactors(relation) {
        const factors = [];

        if (relation.type === 'FAMILY') {
            factors.push('存在亲属关系');
        }
        if (relation.type === 'EQUITY') {
            factors.push('存在股权关系');
        }
        if (relation.type === 'EMPLOYMENT') {
            factors.push('存在任职关系');
        }
        if (relation.type === 'INTEREST') {
            factors.push('存在利益关联');
        }
        if (relation.type === 'CONFLICT') {
            factors.push('存在利益冲突');
        }
        if (relation.isInferred) {
            factors.push('通过推理发现');
        }
        if (relation.confidence && relation.confidence < 0.6) {
            factors.push('置信度较低');
        }

        return factors;
    }

    /**
     * 获取实体的所有隐藏关联
     */
    getEntityHiddenRelations(entityId) {
        const relations = [];
        for (const relation of this.discoveredRelations.values()) {
            if (relation.sourceId === entityId || relation.targetId === entityId) {
                relations.push(relation);
            }
        }
        return relations;
    }

    /**
     * 生成关联分析报告
     */
    generateRelationReport(graph, hiddenRelations) {
        const markedRelations = this.markRiskRelations(hiddenRelations);

        const report = {
            graphId: graph.id,
            generatedAt: new Date().toISOString(),
            summary: {
                totalNodes: graph.nodes.length,
                totalEdges: graph.edges.length,
                hiddenRelations: hiddenRelations.length,
                highRiskRelations: markedRelations.filter(r => r.riskLevel === 'HIGH').length,
                mediumRiskRelations: markedRelations.filter(r => r.riskLevel === 'MEDIUM').length,
                lowRiskRelations: markedRelations.filter(r => r.riskLevel === 'LOW').length
            },
            relationsByType: this.groupRelationsByType(markedRelations),
            highRiskRelations: markedRelations
                .filter(r => r.riskLevel === 'HIGH')
                .sort((a, b) => b.riskScore - a.riskScore),
            recommendations: this.generateRecommendations(markedRelations)
        };

        return report;
    }

    /**
     * 按类型分组关联
     */
    groupRelationsByType(relations) {
        const grouped = {};
        for (const relation of relations) {
            if (!grouped[relation.type]) {
                grouped[relation.type] = [];
            }
            grouped[relation.type].push(relation);
        }
        return grouped;
    }

    /**
     * 生成建议
     */
    generateRecommendations(relations) {
        const recommendations = [];

        const highRiskCount = relations.filter(r => r.riskLevel === 'HIGH').length;
        if (highRiskCount > 0) {
            recommendations.push({
                level: 'HIGH',
                message: `发现 ${highRiskCount} 个高风险关联,建议立即核查`,
                actions: ['核实关联关系真实性', '评估利益冲突风险', '采取回避措施']
            });
        }

        const conflictRelations = relations.filter(r => r.type === 'CONFLICT');
        if (conflictRelations.length > 0) {
            recommendations.push({
                level: 'HIGH',
                message: `发现 ${conflictRelations.length} 个利益冲突,建议审查相关业务`,
                actions: ['审查审批流程', '核查合同签订过程', '评估是否存在违规行为']
            });
        }

        const familyRelations = relations.filter(r => r.type === 'FAMILY');
        if (familyRelations.length > 0) {
            recommendations.push({
                level: 'MEDIUM',
                message: `发现 ${familyRelations.length} 个亲属关系,建议核实回避制度执行情况`,
                actions: ['核实亲属关系', '检查是否执行回避制度', '完善关联申报机制']
            });
        }

        return recommendations;
    }

    /**
     * 保存发现的关联
     */
    async saveDiscoveredRelations() {
        try {
            const data = Array.from(this.discoveredRelations.values());
            localStorage.setItem('discovered_relations', JSON.stringify(data));
        } catch (error) {
            console.error('保存关联数据失败:', error);
        }
    }

    /**
     * 加载已发现的关联
     */
    async loadDiscoveredRelations() {
        try {
            const data = localStorage.getItem('discovered_relations');
            if (data) {
                const relations = JSON.parse(data);
                relations.forEach(r => this.discoveredRelations.set(r.id, r));
            }
        } catch (error) {
            console.error('加载关联数据失败:', error);
        }
    }
}

// 创建全局实例
window.hiddenRelationService = new HiddenRelationService();
