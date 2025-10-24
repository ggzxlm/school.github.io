/**
 * 模型优化反馈服务
 * 负责误报标注、漏报记录、规则优化分析和一键优化应用
 */

const ModelOptimizationService = {
    /**
     * 误报标注数据存储
     */
    falsePositives: [],

    /**
     * 漏报记录数据存储
     */
    falseNegatives: [],

    /**
     * 优化建议数据存储
     */
    optimizationSuggestions: [],

    /**
     * 标注误报预警
     * @param {string} alertId - 预警ID
     * @param {Object} feedback - 反馈信息
     * @returns {Promise<Object>}
     */
    async markFalsePositive(alertId, feedback) {
        try {
            const falsePositive = {
                id: `FP-${Date.now()}`,
                alertId: alertId,
                reason: feedback.reason,
                category: feedback.category,
                description: feedback.description,
                markedBy: feedback.userId || 'current_user',
                markedAt: new Date().toISOString(),
                ruleId: feedback.ruleId,
                ruleName: feedback.ruleName,
                evidenceData: feedback.evidenceData || {},
                tags: feedback.tags || []
            };

            this.falsePositives.push(falsePositive);
            
            // 保存到本地存储
            this.saveFalsePositives();

            return {
                success: true,
                data: falsePositive,
                message: '误报标注成功'
            };
        } catch (error) {
            console.error('标注误报失败:', error);
            return {
                success: false,
                message: '标注误报失败: ' + error.message
            };
        }
    },

    /**
     * 获取误报标注列表
     * @param {Object} filter - 筛选条件
     * @returns {Array}
     */
    getFalsePositives(filter = {}) {
        let results = [...this.falsePositives];

        if (filter.ruleId) {
            results = results.filter(fp => fp.ruleId === filter.ruleId);
        }

        if (filter.category) {
            results = results.filter(fp => fp.category === filter.category);
        }

        if (filter.startDate) {
            results = results.filter(fp => new Date(fp.markedAt) >= new Date(filter.startDate));
        }

        if (filter.endDate) {
            results = results.filter(fp => new Date(fp.markedAt) <= new Date(filter.endDate));
        }

        return results.sort((a, b) => new Date(b.markedAt) - new Date(a.markedAt));
    },

    /**
     * 记录漏报场景
     * @param {Object} scenario - 漏报场景信息
     * @returns {Promise<Object>}
     */
    async recordFalseNegative(scenario) {
        try {
            const falseNegative = {
                id: `FN-${Date.now()}`,
                title: scenario.title,
                description: scenario.description,
                expectedRule: scenario.expectedRule,
                missingReason: scenario.missingReason,
                businessContext: scenario.businessContext,
                suggestedRule: scenario.suggestedRule || null,
                reportedBy: scenario.userId || 'current_user',
                reportedAt: new Date().toISOString(),
                status: 'pending', // pending, analyzed, implemented
                priority: scenario.priority || 'medium',
                relatedData: scenario.relatedData || {}
            };

            this.falseNegatives.push(falseNegative);
            
            // 保存到本地存储
            this.saveFalseNegatives();

            // 自动分析规则缺失原因
            const analysis = await this.analyzeMissingRule(falseNegative);
            falseNegative.analysis = analysis;

            return {
                success: true,
                data: falseNegative,
                message: '漏报记录成功'
            };
        } catch (error) {
            console.error('记录漏报失败:', error);
            return {
                success: false,
                message: '记录漏报失败: ' + error.message
            };
        }
    },

    /**
     * 分析规则缺失原因
     * @param {Object} falseNegative - 漏报记录
     * @returns {Object}
     */
    async analyzeMissingRule(falseNegative) {
        // 模拟分析过程
        const reasons = [];
        const suggestions = [];

        // 分析可能的原因
        if (!falseNegative.expectedRule) {
            reasons.push('未配置相关规则');
            suggestions.push('建议创建新规则覆盖此场景');
        } else {
            reasons.push('现有规则阈值设置不当');
            reasons.push('规则条件不够全面');
            suggestions.push('建议调整规则阈值');
            suggestions.push('建议增加规则检查条件');
        }

        return {
            reasons: reasons,
            suggestions: suggestions,
            analyzedAt: new Date().toISOString()
        };
    },

    /**
     * 获取漏报记录列表
     * @param {Object} filter - 筛选条件
     * @returns {Array}
     */
    getFalseNegatives(filter = {}) {
        let results = [...this.falseNegatives];

        if (filter.status) {
            results = results.filter(fn => fn.status === filter.status);
        }

        if (filter.priority) {
            results = results.filter(fn => fn.priority === filter.priority);
        }

        return results.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    },

    /**
     * 分析规则优化建议
     * @param {string} ruleId - 规则ID
     * @returns {Promise<Object>}
     */
    async analyzeRuleOptimization(ruleId) {
        try {
            // 获取该规则的误报数据
            const ruleFalsePositives = this.getFalsePositives({ ruleId });
            
            // 获取规则信息（模拟）
            const ruleInfo = await this.getRuleInfo(ruleId);
            
            // 分析误报模式
            const patterns = this.analyzeFalsePositivePatterns(ruleFalsePositives);
            
            // 生成优化建议
            const suggestions = this.generateOptimizationSuggestions(ruleInfo, patterns, ruleFalsePositives);
            
            // 计算预期效果
            const expectedImpact = this.calculateExpectedImpact(ruleInfo, suggestions, ruleFalsePositives);
            
            const optimization = {
                id: `OPT-${Date.now()}`,
                ruleId: ruleId,
                ruleName: ruleInfo.name,
                currentConfig: ruleInfo.config,
                falsePositiveCount: ruleFalsePositives.length,
                patterns: patterns,
                suggestions: suggestions,
                expectedImpact: expectedImpact,
                status: 'pending', // pending, applied, rejected
                createdAt: new Date().toISOString()
            };
            
            this.optimizationSuggestions.push(optimization);
            this.saveOptimizationSuggestions();
            
            return {
                success: true,
                data: optimization,
                message: '优化分析完成'
            };
        } catch (error) {
            console.error('规则优化分析失败:', error);
            return {
                success: false,
                message: '规则优化分析失败: ' + error.message
            };
        }
    },

    /**
     * 获取规则信息（模拟）
     * @param {string} ruleId - 规则ID
     * @returns {Object}
     */
    async getRuleInfo(ruleId) {
        // 模拟规则信息
        return {
            id: ruleId,
            name: '连号发票检测规则',
            type: 'threshold',
            config: {
                threshold: 3,
                timeWindow: '30d',
                field: 'invoice_number',
                operator: 'consecutive'
            },
            alertLevel: 'high',
            enabled: true
        };
    },

    /**
     * 分析误报模式
     * @param {Array} falsePositives - 误报数据
     * @returns {Object}
     */
    analyzeFalsePositivePatterns(falsePositives) {
        const patterns = {
            commonReasons: {},
            commonCategories: {},
            timeDistribution: {},
            dataCharacteristics: []
        };

        // 统计常见原因
        falsePositives.forEach(fp => {
            patterns.commonReasons[fp.reason] = (patterns.commonReasons[fp.reason] || 0) + 1;
            patterns.commonCategories[fp.category] = (patterns.commonCategories[fp.category] || 0) + 1;
        });

        // 识别数据特征
        if (falsePositives.length > 5) {
            patterns.dataCharacteristics.push('误报率较高，建议调整阈值');
        }

        return patterns;
    },

    /**
     * 生成优化建议
     * @param {Object} ruleInfo - 规则信息
     * @param {Object} patterns - 误报模式
     * @param {Array} falsePositives - 误报数据
     * @returns {Array}
     */
    generateOptimizationSuggestions(ruleInfo, patterns, falsePositives) {
        const suggestions = [];

        // 基于误报率生成建议
        const falsePositiveRate = falsePositives.length / 100; // 假设总预警数为100

        if (falsePositiveRate > 0.3) {
            suggestions.push({
                type: 'threshold_adjustment',
                title: '调整阈值',
                description: '当前误报率较高，建议提高阈值以减少误报',
                currentValue: ruleInfo.config.threshold,
                suggestedValue: ruleInfo.config.threshold + 2,
                expectedReduction: '预计减少30%误报',
                confidence: 0.85
            });
        }

        if (patterns.commonReasons['正常业务场景']) {
            suggestions.push({
                type: 'add_exception',
                title: '添加例外条件',
                description: '识别到正常业务场景被误报，建议添加例外条件',
                suggestedCondition: '排除特定业务类型或部门',
                expectedReduction: '预计减少20%误报',
                confidence: 0.75
            });
        }

        suggestions.push({
            type: 'feature_weight',
            title: '调整特征权重',
            description: '优化规则特征权重以提高准确性',
            currentWeights: { amount: 0.4, frequency: 0.3, pattern: 0.3 },
            suggestedWeights: { amount: 0.5, frequency: 0.25, pattern: 0.25 },
            expectedReduction: '预计减少15%误报',
            confidence: 0.70
        });

        return suggestions;
    },

    /**
     * 计算预期效果
     * @param {Object} ruleInfo - 规则信息
     * @param {Array} suggestions - 优化建议
     * @param {Array} falsePositives - 误报数据
     * @returns {Object}
     */
    calculateExpectedImpact(ruleInfo, suggestions, falsePositives) {
        const totalReduction = suggestions.reduce((sum, s) => {
            const match = s.expectedReduction.match(/(\d+)%/);
            return sum + (match ? parseInt(match[1]) : 0);
        }, 0);

        return {
            currentFalsePositiveRate: (falsePositives.length / 100 * 100).toFixed(1) + '%',
            expectedFalsePositiveRate: Math.max(0, (falsePositives.length / 100 * 100 - totalReduction)).toFixed(1) + '%',
            expectedReduction: totalReduction + '%',
            confidenceLevel: 'high',
            estimatedAccuracyImprovement: totalReduction / 2 + '%'
        };
    },

    /**
     * 获取优化建议列表
     * @param {Object} filter - 筛选条件
     * @returns {Array}
     */
    getOptimizationSuggestions(filter = {}) {
        let results = [...this.optimizationSuggestions];

        if (filter.ruleId) {
            results = results.filter(opt => opt.ruleId === filter.ruleId);
        }

        if (filter.status) {
            results = results.filter(opt => opt.status === filter.status);
        }

        return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    /**
     * 一键应用优化方案
     * @param {string} optimizationId - 优化方案ID
     * @returns {Promise<Object>}
     */
    async applyOptimization(optimizationId) {
        try {
            const optimization = this.optimizationSuggestions.find(opt => opt.id === optimizationId);
            
            if (!optimization) {
                throw new Error('优化方案不存在');
            }

            if (optimization.status === 'applied') {
                throw new Error('该优化方案已应用');
            }

            // 执行历史数据回测
            const backtestResult = await this.runBacktest(optimization);
            
            // 应用优化配置
            const applyResult = await this.applyRuleConfig(optimization);
            
            // 更新优化方案状态
            optimization.status = 'applied';
            optimization.appliedAt = new Date().toISOString();
            optimization.backtestResult = backtestResult;
            optimization.applyResult = applyResult;
            
            this.saveOptimizationSuggestions();
            
            return {
                success: true,
                data: {
                    optimization: optimization,
                    backtestResult: backtestResult,
                    applyResult: applyResult
                },
                message: '优化方案应用成功'
            };
        } catch (error) {
            console.error('应用优化方案失败:', error);
            return {
                success: false,
                message: '应用优化方案失败: ' + error.message
            };
        }
    },

    /**
     * 执行历史数据回测
     * @param {Object} optimization - 优化方案
     * @returns {Promise<Object>}
     */
    async runBacktest(optimization) {
        // 模拟回测过程
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 生成回测结果
        const result = {
            testPeriod: {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString()
            },
            beforeOptimization: {
                totalAlerts: 150,
                truePositives: 105,
                falsePositives: 45,
                precision: 0.70,
                recall: 0.95
            },
            afterOptimization: {
                totalAlerts: 120,
                truePositives: 102,
                falsePositives: 18,
                precision: 0.85,
                recall: 0.92
            },
            improvement: {
                precisionImprovement: '+15%',
                falsePositiveReduction: '-60%',
                recallChange: '-3%',
                overallScore: '+12%'
            },
            recommendation: 'strong_recommend' // strong_recommend, recommend, neutral, not_recommend
        };

        return result;
    },

    /**
     * 应用规则配置
     * @param {Object} optimization - 优化方案
     * @returns {Promise<Object>}
     */
    async applyRuleConfig(optimization) {
        // 模拟应用配置
        await new Promise(resolve => setTimeout(resolve, 500));

        const newConfig = {};
        
        optimization.suggestions.forEach(suggestion => {
            if (suggestion.type === 'threshold_adjustment') {
                newConfig.threshold = suggestion.suggestedValue;
            } else if (suggestion.type === 'feature_weight') {
                newConfig.weights = suggestion.suggestedWeights;
            } else if (suggestion.type === 'add_exception') {
                newConfig.exceptions = [suggestion.suggestedCondition];
            }
        });

        return {
            ruleId: optimization.ruleId,
            previousConfig: optimization.currentConfig,
            newConfig: newConfig,
            appliedAt: new Date().toISOString(),
            appliedBy: 'current_user'
        };
    },

    /**
     * 生成优化效果报告
     * @param {string} optimizationId - 优化方案ID
     * @returns {Object}
     */
    generateOptimizationReport(optimizationId) {
        const optimization = this.optimizationSuggestions.find(opt => opt.id === optimizationId);
        
        if (!optimization || optimization.status !== 'applied') {
            return null;
        }

        const report = {
            title: `规则优化效果报告 - ${optimization.ruleName}`,
            optimizationId: optimizationId,
            ruleId: optimization.ruleId,
            ruleName: optimization.ruleName,
            appliedAt: optimization.appliedAt,
            summary: {
                totalSuggestions: optimization.suggestions.length,
                appliedSuggestions: optimization.suggestions.length,
                backtestPeriod: optimization.backtestResult.testPeriod,
                overallImprovement: optimization.backtestResult.improvement.overallScore
            },
            detailedResults: {
                before: optimization.backtestResult.beforeOptimization,
                after: optimization.backtestResult.afterOptimization,
                improvement: optimization.backtestResult.improvement
            },
            appliedChanges: optimization.suggestions.map(s => ({
                type: s.type,
                title: s.title,
                description: s.description,
                expectedReduction: s.expectedReduction
            })),
            recommendation: optimization.backtestResult.recommendation,
            generatedAt: new Date().toISOString()
        };

        return report;
    },

    /**
     * 保存误报标注到本地存储
     */
    saveFalsePositives() {
        try {
            localStorage.setItem('model_false_positives', JSON.stringify(this.falsePositives));
        } catch (error) {
            console.error('保存误报标注失败:', error);
        }
    },

    /**
     * 加载误报标注从本地存储
     */
    loadFalsePositives() {
        try {
            const data = localStorage.getItem('model_false_positives');
            if (data) {
                this.falsePositives = JSON.parse(data);
            }
        } catch (error) {
            console.error('加载误报标注失败:', error);
            this.falsePositives = [];
        }
    },

    /**
     * 保存漏报记录到本地存储
     */
    saveFalseNegatives() {
        try {
            localStorage.setItem('model_false_negatives', JSON.stringify(this.falseNegatives));
        } catch (error) {
            console.error('保存漏报记录失败:', error);
        }
    },

    /**
     * 加载漏报记录从本地存储
     */
    loadFalseNegatives() {
        try {
            const data = localStorage.getItem('model_false_negatives');
            if (data) {
                this.falseNegatives = JSON.parse(data);
            }
        } catch (error) {
            console.error('加载漏报记录失败:', error);
            this.falseNegatives = [];
        }
    },

    /**
     * 保存优化建议到本地存储
     */
    saveOptimizationSuggestions() {
        try {
            localStorage.setItem('model_optimization_suggestions', JSON.stringify(this.optimizationSuggestions));
        } catch (error) {
            console.error('保存优化建议失败:', error);
        }
    },

    /**
     * 加载优化建议从本地存储
     */
    loadOptimizationSuggestions() {
        try {
            const data = localStorage.getItem('model_optimization_suggestions');
            if (data) {
                this.optimizationSuggestions = JSON.parse(data);
            }
        } catch (error) {
            console.error('加载优化建议失败:', error);
            this.optimizationSuggestions = [];
        }
    },

    /**
     * 初始化服务
     */
    init() {
        this.loadFalsePositives();
        this.loadFalseNegatives();
        this.loadOptimizationSuggestions();
        
        // 生成模拟数据（仅用于演示）
        if (this.falsePositives.length === 0) {
            this.generateMockData();
        }
    },

    /**
     * 生成模拟数据
     */
    generateMockData() {
        // 模拟误报数据
        this.falsePositives = [
            {
                id: 'FP-001',
                alertId: 'YJ-2025-001',
                reason: '正常业务场景',
                category: '连号发票',
                description: '该批次发票为同一供应商连续开具，属于正常业务场景',
                markedBy: '张三',
                markedAt: '2025-10-20T10:30:00Z',
                ruleId: 'RULE-001',
                ruleName: '连号发票检测规则',
                evidenceData: { invoiceCount: 5, supplier: '某科技公司' },
                tags: ['正常业务', '供应商']
            },
            {
                id: 'FP-002',
                alertId: 'YJ-2025-005',
                reason: '规则阈值过低',
                category: '预算超支',
                description: '预算执行率达到90%触发预警，但实际仍在合理范围内',
                markedBy: '李四',
                markedAt: '2025-10-19T14:20:00Z',
                ruleId: 'RULE-002',
                ruleName: '预算超支预警规则',
                evidenceData: { executionRate: 0.90, budget: 300000 },
                tags: ['阈值问题']
            }
        ];

        // 模拟漏报数据
        this.falseNegatives = [
            {
                id: 'FN-001',
                title: '跨年度报销未检测',
                description: '发现有跨年度报销行为，但系统未生成预警',
                expectedRule: '跨年度报销检测规则',
                missingReason: '未配置相关规则',
                businessContext: '财务管理',
                suggestedRule: '检测报销日期与发票日期跨年度的情况',
                reportedBy: '王五',
                reportedAt: '2025-10-18T09:00:00Z',
                status: 'pending',
                priority: 'high',
                relatedData: { caseCount: 3 },
                analysis: {
                    reasons: ['未配置相关规则'],
                    suggestions: ['建议创建新规则覆盖此场景'],
                    analyzedAt: '2025-10-18T09:05:00Z'
                }
            }
        ];

        this.saveFalsePositives();
        this.saveFalseNegatives();
    }
};

// 初始化服务
ModelOptimizationService.init();
