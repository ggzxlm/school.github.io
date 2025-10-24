/**
 * 监督模型库服务
 * Supervision Model Library Service
 */

class SupervisionModelService {
    constructor() {
        this.models = this.initializePresetModels();
        this.customModels = [];
        this.loadCustomModels();
    }

    /**
     * 初始化预置模型库
     */
    initializePresetModels() {
        // 从规则引擎服务获取规则
        const allRules = window.ruleEngineService ? window.ruleEngineService.getAllRules() : [];
        
        console.log('初始化模型库，规则数量:', allRules.length);
        
        return [
            // 1. 科研经费使用监督模型
            {
                id: 'model_research_funds_usage',
                name: '科研经费使用监督模型',
                type: 'PRESET',
                category: '科研监督',
                description: '全面监督科研经费使用的合规性，包括设备采购、劳务费发放、差旅费报销、发票真伪等',
                applicableScenarios: [
                    '设备使用率低且重复购置',
                    '团队成员频繁向同一供应商采购',
                    '发票疑似伪造',
                    '预算执行偏差过大',
                    '差旅费时空冲突',
                    '劳务费发放异常',
                    '设备采购价格异常',
                    '项目结余资金过多',
                    '外协费用比例过高',
                    '材料费未集中采购',
                    '项目进度与支出不匹配'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE_RESEARCH_001', 'RULE_RESEARCH_002', 'RULE_RESEARCH_003',
                    'RULE_RESEARCH_004', 'RULE_RESEARCH_005', 'RULE_RESEARCH_006',
                    'RULE_RESEARCH_007', 'RULE_RESEARCH_008', 'RULE_RESEARCH_009',
                    'RULE_RESEARCH_010', 'RULE_RESEARCH_011', 'RULE_RESEARCH_012',
                    'RULE_RESEARCH_013'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            },

            // 2. 预算执行监督模型
            {
                id: 'model_budget_execution',
                name: '预算执行监督模型',
                type: 'PRESET',
                category: '财务监督',
                description: '监督预算执行进度、超预算支出、预算调整频繁等异常情况',
                applicableScenarios: [
                    '预算执行进度异常',
                    '超预算支出',
                    '预算调整过于频繁',
                    '预算执行率过低或过高'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE_FINANCE_005', 'RULE_FINANCE_006'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            },

            // 3. 三公经费监督模型
            {
                id: 'model_three_public_funds',
                name: '三公经费监督模型',
                type: 'PRESET',
                category: '财务监督',
                description: '监督公务接待、公务用车、因公出国（境）等三公经费支出异常',
                applicableScenarios: [
                    '三公经费超标',
                    '单次接待费用过高',
                    '公务用车费用异常',
                    '因公出国频次异常',
                    '违规发放津补贴',
                    '公款吃喝异常'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE_FINANCE_007', 'RULE_STYLE_001', 'RULE_STYLE_002', 
                    'RULE_STYLE_003', 'RULE_FINANCE_004', 'RULE010'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            },

            // 4. 采购招标监督模型
            {
                id: 'model_procurement_bidding',
                name: '采购招标监督模型',
                type: 'PRESET',
                category: '采购监督',
                description: '监督采购招标过程的合规性，防范围标串标、拆分采购等违规行为',
                applicableScenarios: [
                    '单笔采购金额超限',
                    '供应商关联关系',
                    '围标串标风险',
                    '拆分采购规避招标',
                    '合同变更频繁'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE001', 'RULE_PROCUREMENT_001', 'RULE_PROCUREMENT_002',
                    'RULE_PROCUREMENT_003', 'RULE_PROCUREMENT_004'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            },

            // 5. 资产管理监督模型
            {
                id: 'model_asset_management',
                name: '资产管理监督模型',
                type: 'PRESET',
                category: '资产监督',
                description: '监督资产采购、使用、处置等环节的合规性和异常情况',
                applicableScenarios: [
                    '资产长期闲置',
                    '资产处置价格过低',
                    '资产重复采购',
                    '资产盘点差异'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE_ASSET_001', 'RULE_ASSET_002', 'RULE_ASSET_003', 'RULE_ASSET_004'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            },

            // 6. 招生录取监督模型
            {
                id: 'model_enrollment',
                name: '招生录取监督模型',
                type: 'PRESET',
                category: '招生监督',
                description: '监督招生录取过程的公平性和合规性',
                applicableScenarios: [
                    '录取分数异常',
                    '特殊类型招生异常',
                    '加分资格异常',
                    '录取程序违规',
                    '学生资助资金异常'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE_ADMISSION_001', 'RULE_ADMISSION_002', 'RULE_ADMISSION_003',
                    'RULE011'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            },

            // 7. 财务管理监督模型
            {
                id: 'model_financial_management',
                name: '财务管理监督模型',
                type: 'PRESET',
                category: '财务监督',
                description: '监督财务管理的合规性、资金安全和财务风险',
                applicableScenarios: [
                    '大额资金异常',
                    '发票异常',
                    '报销违规',
                    '资金往来异常'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE_FINANCE_001', 'RULE_FINANCE_002', 'RULE_FINANCE_003',
                    'RULE_FINANCE_004', 'RULE_COMPREHENSIVE_002'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            },

            // 8. 八项规定监督模型
            {
                id: 'model_eight_regulations',
                name: '八项规定监督模型',
                type: 'PRESET',
                category: '作风监督',
                description: '监督违反中央八项规定精神的行为',
                applicableScenarios: [
                    '公款吃喝',
                    '违规发放津补贴',
                    '公车私用',
                    '违规收送礼品礼金',
                    '公务接待超标',
                    '差旅费报销异常'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE_STYLE_001', 'RULE_STYLE_002', 'RULE_STYLE_003',
                    'RULE_FINANCE_007', 'RULE010', 'RULE_FINANCE_004'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            },

            // 9. 综合风险监督模型
            {
                id: 'model_comprehensive_risk',
                name: '综合风险监督模型',
                type: 'PRESET',
                category: '综合监督',
                description: '通过图谱分析和时序分析，发现复杂的关联关系和异常行为模式',
                applicableScenarios: [
                    '复杂关系网络',
                    '异常行为序列',
                    '利益输送风险',
                    '系统性风险',
                    '关联交易检测',
                    '教师兼职收入申报'
                ],
                rules: this.getRulesByIds(allRules, [
                    'RULE_COMPREHENSIVE_001', 'RULE_COMPREHENSIVE_002',
                    'RULE_PROCUREMENT_001', 'RULE_PROCUREMENT_002',
                    'RULE_RESEARCH_002', 'RULE_RESEARCH_003',
                    'RULE_ADMISSION_003', 'RULE012'
                ]),
                version: '2.0',
                status: 'ACTIVE',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2025-10-24')
            }
        ];
    }

    /**
     * 根据规则ID列表获取规则
     */
    getRulesByIds(allRules, ruleIds) {
        console.log('getRulesByIds - 总规则数:', allRules.length, '需要的规则ID:', ruleIds);
        
        const result = ruleIds.map(id => {
            const rule = allRules.find(r => r.id === id);
            if (rule) {
                return {
                    id: rule.id,
                    ruleName: rule.ruleName,
                    ruleType: rule.ruleType,
                    description: rule.description,
                    config: rule.config,
                    alertLevel: rule.alertLevel,
                    enabled: rule.enabled,
                    category: rule.category
                };
            } else {
                console.warn('未找到规则:', id);
            }
            return null;
        }).filter(r => r !== null);
        
        console.log('getRulesByIds - 返回规则数:', result.length);
        return result;
    }

    /**
     * 从规则引擎服务同步规则
     */
    syncRulesFromEngine() {
        if (!window.ruleEngineService) {
            console.warn('规则引擎服务未初始化');
            return;
        }

        // 重新初始化预置模型
        this.models = this.initializePresetModels();
        
        // 更新自定义模型中的规则
        this.customModels.forEach(model => {
            if (model.rules && model.rules.length > 0) {
                const ruleIds = model.rules.map(r => r.id);
                const allRules = window.ruleEngineService.getAllRules();
                model.rules = this.getRulesByIds(allRules, ruleIds);
            }
        });
        
        this.saveCustomModels();
    }

    /**
     * 获取规则引擎中的所有规则（用于规则选择器）
     */
    getAvailableRules() {
        if (!window.ruleEngineService) {
            return [];
        }
        return window.ruleEngineService.getAllRules();
    }

    /**
     * 加载自定义模型
     */
    loadCustomModels() {
        const stored = localStorage.getItem('custom_supervision_models');
        if (stored) {
            try {
                this.customModels = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to load custom models:', e);
                this.customModels = [];
            }
        }
    }

    /**
     * 保存自定义模型
     */
    saveCustomModels() {
        localStorage.setItem('custom_supervision_models', JSON.stringify(this.customModels));
    }

    /**
     * 获取所有模型
     */
    getAllModels() {
        return [...this.models, ...this.customModels];
    }

    /**
     * 获取预置模型
     */
    getPresetModels() {
        return this.models;
    }

    /**
     * 获取自定义模型
     */
    getCustomModels() {
        return this.customModels;
    }

    /**
     * 根据ID获取模型
     */
    getModelById(modelId) {
        return this.getAllModels().find(m => m.id === modelId);
    }

    /**
     * 根据分类获取模型
     */
    getModelsByCategory(category) {
        return this.getAllModels().filter(m => m.category === category);
    }

    /**
     * 启用模型
     */
    enableModel(modelId) {
        const model = this.getModelById(modelId);
        if (model) {
            model.status = 'ACTIVE';
            model.updatedAt = new Date();
            
            if (model.type === 'CUSTOM') {
                this.saveCustomModels();
            }
            
            return { success: true, message: '模型已启用' };
        }
        return { success: false, message: '模型不存在' };
    }

    /**
     * 禁用模型
     */
    disableModel(modelId) {
        const model = this.getModelById(modelId);
        if (model) {
            model.status = 'INACTIVE';
            model.updatedAt = new Date();
            
            if (model.type === 'CUSTOM') {
                this.saveCustomModels();
            }
            
            return { success: true, message: '模型已禁用' };
        }
        return { success: false, message: '模型不存在' };
    }

    /**
     * 创建自定义模型
     */
    createCustomModel(modelData) {
        const model = {
            id: 'model_custom_' + Date.now(),
            type: 'CUSTOM',
            status: 'DRAFT',
            version: '1.0',
            createdAt: new Date(),
            updatedAt: new Date(),
            ...modelData
        };
        
        this.customModels.push(model);
        this.saveCustomModels();
        
        return model;
    }

    /**
     * 更新自定义模型
     */
    updateCustomModel(modelId, updates) {
        const index = this.customModels.findIndex(m => m.id === modelId);
        if (index !== -1) {
            this.customModels[index] = {
                ...this.customModels[index],
                ...updates,
                updatedAt: new Date()
            };
            this.saveCustomModels();
            return { success: true, message: '模型更新成功', model: this.customModels[index] };
        }
        return { success: false, message: '模型不存在' };
    }

    /**
     * 删除自定义模型
     */
    deleteCustomModel(modelId) {
        const index = this.customModels.findIndex(m => m.id === modelId);
        if (index !== -1) {
            this.customModels.splice(index, 1);
            this.saveCustomModels();
            return { success: true, message: '模型已删除' };
        }
        return { success: false, message: '模型不存在' };
    }

    /**
     * 模型回测
     */
    async backtestModel(modelId, startDate, endDate, testData) {
        const model = this.getModelById(modelId);
        if (!model) {
            throw new Error('模型不存在');
        }

        // 模拟回测过程
        const results = {
            modelId: modelId,
            modelName: model.name,
            testPeriod: { startDate, endDate },
            totalRecords: testData.length,
            alerts: [],
            metrics: {
                truePositives: 0,
                falsePositives: 0,
                trueNegatives: 0,
                falseNegatives: 0
            }
        };

        // 对每条测试数据执行规则检查
        for (const record of testData) {
            for (const rule of model.rules) {
                if (rule.enabled && this.evaluateRule(rule, record)) {
                    results.alerts.push({
                        ruleId: rule.ruleId,
                        ruleName: rule.ruleName,
                        recordId: record.id,
                        timestamp: record.timestamp,
                        alertLevel: rule.alertLevel
                    });
                }
            }
        }

        // 计算评估指标
        results.metrics.precision = results.metrics.truePositives / 
            (results.metrics.truePositives + results.metrics.falsePositives) || 0;
        results.metrics.recall = results.metrics.truePositives / 
            (results.metrics.truePositives + results.metrics.falseNegatives) || 0;
        results.metrics.accuracy = (results.metrics.truePositives + results.metrics.trueNegatives) / 
            results.totalRecords || 0;
        results.metrics.f1Score = 2 * (results.metrics.precision * results.metrics.recall) / 
            (results.metrics.precision + results.metrics.recall) || 0;

        return results;
    }

    /**
     * 评估规则（简化版）
     */
    evaluateRule(rule, record) {
        // 这里是简化的规则评估逻辑
        // 实际应该根据规则类型和配置进行复杂的评估
        switch (rule.ruleType) {
            case 'THRESHOLD':
                return this.evaluateThresholdRule(rule, record);
            case 'TREND':
                return this.evaluateTrendRule(rule, record);
            case 'CORRELATION':
                return this.evaluateCorrelationRule(rule, record);
            case 'SEQUENCE':
                return this.evaluateSequenceRule(rule, record);
            case 'GRAPH':
                return this.evaluateGraphRule(rule, record);
            default:
                return false;
        }
    }

    evaluateThresholdRule(rule, record) {
        const config = rule.config;
        const value = this.getFieldValue(record, config.field);
        const threshold = config.threshold;
        
        switch (config.operator) {
            case '>': return value > threshold;
            case '<': return value < threshold;
            case '>=': return value >= threshold;
            case '<=': return value <= threshold;
            case '==': return value == threshold;
            case '!=': return value != threshold;
            default: return false;
        }
    }

    evaluateTrendRule(rule, record) {
        // 简化实现，实际需要历史数据对比
        return Math.random() < 0.1; // 10%概率触发
    }

    evaluateCorrelationRule(rule, record) {
        // 简化实现，实际需要关系图谱查询
        return Math.random() < 0.05; // 5%概率触发
    }

    evaluateSequenceRule(rule, record) {
        // 简化实现，实际需要时序分析
        return Math.random() < 0.08; // 8%概率触发
    }

    evaluateGraphRule(rule, record) {
        // 简化实现，实际需要图数据库查询
        return Math.random() < 0.03; // 3%概率触发
    }

    getFieldValue(record, fieldExpression) {
        // 简化的字段值获取，支持简单的表达式
        if (fieldExpression.includes('/')) {
            const parts = fieldExpression.split('/').map(p => p.trim());
            const numerator = record[parts[0]] || 0;
            const denominator = record[parts[1]] || 1;
            return numerator / denominator;
        }
        return record[fieldExpression] || 0;
    }

    /**
     * 模型对比分析
     */
    compareModels(modelIds, testData) {
        const comparisons = [];
        
        for (const modelId of modelIds) {
            const model = this.getModelById(modelId);
            if (model) {
                const result = this.backtestModel(modelId, null, null, testData);
                comparisons.push({
                    modelId: model.id,
                    modelName: model.name,
                    alertCount: result.alerts.length,
                    precision: result.metrics.precision,
                    recall: result.metrics.recall,
                    f1Score: result.metrics.f1Score
                });
            }
        }
        
        return comparisons;
    }

    /**
     * 获取模型统计信息
     */
    getModelStatistics() {
        const allModels = this.getAllModels();
        return {
            total: allModels.length,
            preset: this.models.length,
            custom: this.customModels.length,
            active: allModels.filter(m => m.status === 'ACTIVE').length,
            inactive: allModels.filter(m => m.status === 'INACTIVE').length,
            byCategory: this.groupByCategory(allModels)
        };
    }

    groupByCategory(models) {
        const grouped = {};
        models.forEach(model => {
            if (!grouped[model.category]) {
                grouped[model.category] = 0;
            }
            grouped[model.category]++;
        });
        return grouped;
    }
}

// 导出服务实例
window.supervisionModelService = new SupervisionModelService();
