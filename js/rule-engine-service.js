/**
 * 规则引擎服务
 * Rule Engine Service
 * 提供规则配置、执行、测试、批量管理等功能
 */

class RuleEngineService {
    constructor() {
        console.log('初始化 RuleEngineService...');
        this.storageKey = 'rule_engine_rules';
        this.executionKey = 'rule_executions';
        this.testResultsKey = 'rule_test_results';
        this.initializeStorage();
        console.log('RuleEngineService 初始化完成');
    }

    /**
     * 初始化存储
     */
    initializeStorage() {
        console.log('初始化存储...');
        const existingRules = localStorage.getItem(this.storageKey);
        
        // 检查是否需要更新规则数据
        let needsUpdate = false;
        if (!existingRules || existingRules === '[]') {
            needsUpdate = true;
            console.log('localStorage 中没有规则数据');
        } else {
            try {
                const rules = JSON.parse(existingRules);
                // 如果规则数量少于30条，说明是旧数据，需要更新
                if (rules.length < 30) {
                    needsUpdate = true;
                    console.log('规则数据过旧，需要更新。当前数量:', rules.length);
                }
            } catch (e) {
                needsUpdate = true;
                console.error('解析规则数据失败:', e);
            }
        }
        
        // 强制更新数据以包含新的dataSources字段
        console.log('加载预置数据...');
        const presetRules = this.getPresetRules();
        console.log('预置规则数量:', presetRules.length);
        localStorage.setItem(this.storageKey, JSON.stringify(presetRules));
        
        const existingExecutions = localStorage.getItem(this.executionKey);
        if (!existingExecutions || existingExecutions === '[]') {
            const presetExecutions = this.getPresetExecutions();
            console.log('预置执行历史数量:', presetExecutions.length);
            localStorage.setItem(this.executionKey, JSON.stringify(presetExecutions));
        }
        
        if (!localStorage.getItem(this.testResultsKey)) {
            localStorage.setItem(this.testResultsKey, JSON.stringify([]));
        }
        console.log('存储初始化完成');
    }

    /**
     * 重置为预置数据（用于测试）
     */
    resetToPresetData() {
        console.log('重置为预置数据...');
        localStorage.setItem(this.storageKey, JSON.stringify(this.getPresetRules()));
        localStorage.setItem(this.executionKey, JSON.stringify(this.getPresetExecutions()));
        localStorage.setItem(this.testResultsKey, JSON.stringify([]));
        console.log('重置完成');
    }

    /**
     * 获取预置规则数据
     */
    getPresetRules() {
        const now = new Date().toISOString();
        const baseTime = new Date();
        
        return [
            // ========== 跨数据源关联规则示例 ==========
            {
                id: 'RULE_CROSS_001',
                ruleName: '采购人员与供应商关联关系预警',
                ruleType: 'CORRELATION',
                category: '采购监督',
                description: '检测采购人员与中标供应商之间是否存在亲属、股权等关联关系',
                dataSources: [
                    {
                        alias: 'procurement',
                        type: 'procurement_db',
                        table: 'procurement_orders',
                        joinField: 'buyer_id'
                    },
                    {
                        alias: 'hr',
                        type: 'hr_db',
                        table: 'employees',
                        joinField: 'employee_id'
                    },
                    {
                        alias: 'relation',
                        type: 'unified_db',
                        table: 'person_relations',
                        joinField: 'person_id'
                    }
                ],
                config: {
                    correlationFields: ['procurement.buyer_id', 'hr.employee_id', 'relation.person_id'],
                    relationTypes: ['FAMILY', 'EQUITY', 'EMPLOYMENT'],
                    alertCondition: 'relation.relation_type IN ("FAMILY", "EQUITY") AND procurement.amount > 100000'
                },
                priority: 95,
                enabled: true,
                alertLevel: 'HIGH',
                groupId: 'cross_source_rules',
                createdAt: new Date(baseTime.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: now,
                lastExecutionTime: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                executionCount: 156,
                matchCount: 8
            },
            {
                id: 'RULE_CROSS_002',
                ruleName: '合同金额超预算且无追加审批',
                ruleType: 'THRESHOLD',
                category: '财务监督',
                description: '检测合同金额超出预算且未履行追加预算审批程序的情况',
                dataSources: [
                    {
                        alias: 'contract',
                        type: 'contract_db',
                        table: 'contracts',
                        joinField: 'project_id'
                    },
                    {
                        alias: 'budget',
                        type: 'finance_db',
                        table: 'project_budgets',
                        joinField: 'project_id'
                    },
                    {
                        alias: 'approval',
                        type: 'unified_db',
                        table: 'approval_records',
                        joinField: 'project_id'
                    }
                ],
                config: {
                    condition: '(contract.amount - budget.approved_amount) / budget.approved_amount > 0.1',
                    checkApproval: 'approval.approval_type = "BUDGET_INCREASE" AND approval.status = "APPROVED"',
                    threshold: 0.1,
                    timeWindow: 'contract.sign_date'
                },
                priority: 90,
                enabled: true,
                alertLevel: 'HIGH',
                groupId: 'cross_source_rules',
                createdAt: new Date(baseTime.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: now,
                lastExecutionTime: new Date(baseTime.getTime() - 4 * 60 * 60 * 1000).toISOString(),
                executionCount: 203,
                matchCount: 12
            },
            // ========== 科研经费监督规则 ==========
            {
                id: 'RULE_RESEARCH_001',
                ruleName: '设备使用率<30%且重复购置>=2台',
                ruleType: 'THRESHOLD',
                category: '科研监督',
                description: '监测设备使用率低于30%且同类设备重复购置2台及以上的情况',
                dataSources: [
                    {
                        alias: 'asset',
                        type: 'asset_db',
                        table: 'equipment_usage',
                        joinField: null
                    }
                ],
                config: {
                    field: 'usage_rate',
                    operator: '<',
                    threshold: 0.3,
                    condition: 'duplicate_count >= 2',
                    timeWindow: 'yearly'
                },
                priority: 85,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['research@university.edu']
                },
                groupId: 'research',
                tags: ['科研经费', '设备管理', '资源浪费'],
                createdAt: new Date(baseTime.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '科研处',
                lastExecutionTime: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                executionCount: 89,
                matchCount: 12
            },
            {
                id: 'RULE_RESEARCH_002',
                ruleName: '团队成员在同一供应商频繁采购',
                ruleType: 'SEQUENCE',
                category: '科研监督',
                description: '检测团队成员在90天内向同一供应商采购超过3次的情况',
                config: {
                    events: ['purchase'],
                    timeWindow: '90d',
                    condition: 'same_supplier AND count > 3',
                    groupBy: 'team_id'
                },
                priority: 80,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '采购监督', '关联交易'],
                createdAt: new Date(baseTime.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '纪检监察室',
                lastExecutionTime: new Date(baseTime.getTime() - 5 * 60 * 60 * 1000).toISOString(),
                executionCount: 67,
                matchCount: 8
            },
            {
                id: 'RULE_RESEARCH_003',
                ruleName: '发票疑似伪造',
                ruleType: 'CORRELATION',
                category: '科研监督',
                description: '检测发票真伪，识别疑似伪造发票',
                config: {
                    entities: ['invoice', 'tax_system'],
                    relations: ['verification_failed', 'duplicate_number'],
                    checkFields: ['invoice_number', 'tax_code', 'amount']
                },
                priority: 95,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email', 'sms'],
                    recipients: ['discipline@university.edu']
                },
                groupId: 'research',
                tags: ['科研经费', '发票管理', '违规风险'],
                createdAt: new Date(baseTime.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 1 * 60 * 60 * 1000).toISOString(),
                executionCount: 234,
                matchCount: 5
            },
            {
                id: 'RULE_RESEARCH_004',
                ruleName: '预算执行偏差度',
                ruleType: 'THRESHOLD',
                category: '科研监督',
                description: '监测项目预算执行偏差超过50%的情况',
                config: {
                    field: 'ABS(actual_amount - budget_amount) / budget_amount',
                    operator: '>',
                    threshold: 0.5,
                    timeWindow: 'project'
                },
                priority: 75,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '预算管理', '执行监控'],
                createdAt: new Date(baseTime.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '科研处',
                lastExecutionTime: new Date(baseTime.getTime() - 8 * 60 * 60 * 1000).toISOString(),
                executionCount: 145,
                matchCount: 28
            },
            {
                id: 'RULE_RESEARCH_005',
                ruleName: '差旅费时空冲突',
                ruleType: 'SEQUENCE',
                category: '科研监督',
                description: '检测同时段多地报销差旅费的异常情况',
                config: {
                    events: ['travel_expense'],
                    timeWindow: '1d',
                    condition: 'different_locations AND overlapping_time'
                },
                priority: 88,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['audit@university.edu']
                },
                groupId: 'research',
                tags: ['科研经费', '差旅费', '异常检测'],
                createdAt: new Date(baseTime.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '审计处',
                lastExecutionTime: new Date(baseTime.getTime() - 3 * 60 * 60 * 1000).toISOString(),
                executionCount: 178,
                matchCount: 6
            },
            {
                id: 'RULE_RESEARCH_006',
                ruleName: '劳务费发放异常',
                ruleType: 'THRESHOLD',
                category: '科研监督',
                description: '监测劳务费超标准或重复发放的情况',
                config: {
                    field: 'labor_cost',
                    operator: '>',
                    threshold: 'standard_amount',
                    timeWindow: 'monthly'
                },
                priority: 82,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '劳务费', '标准管理'],
                createdAt: new Date(baseTime.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '人事处',
                lastExecutionTime: new Date(baseTime.getTime() - 6 * 60 * 60 * 1000).toISOString(),
                executionCount: 156,
                matchCount: 22
            },
            {
                id: 'RULE_RESEARCH_007',
                ruleName: '设备采购价格异常',
                ruleType: 'THRESHOLD',
                category: '科研监督',
                description: '检测设备采购价格高于市场价30%以上的情况',
                config: {
                    field: '(purchase_price - market_price) / market_price',
                    operator: '>',
                    threshold: 0.3,
                    timeWindow: 'single'
                },
                priority: 90,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '设备采购', '价格监控'],
                createdAt: new Date(baseTime.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '资产处',
                lastExecutionTime: new Date(baseTime.getTime() - 4 * 60 * 60 * 1000).toISOString(),
                executionCount: 98,
                matchCount: 15
            },
            {
                id: 'RULE_RESEARCH_008',
                ruleName: '项目结余资金',
                ruleType: 'THRESHOLD',
                category: '科研监督',
                description: '监测项目结题时结余资金超过20%的情况',
                config: {
                    field: 'surplus_amount / total_budget',
                    operator: '>',
                    threshold: 0.2,
                    timeWindow: 'project_end'
                },
                priority: 65,
                enabled: true,
                alertLevel: 'LOW',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '结余管理', '资金使用'],
                createdAt: new Date(baseTime.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '科研处',
                lastExecutionTime: new Date(baseTime.getTime() - 12 * 60 * 60 * 1000).toISOString(),
                executionCount: 45,
                matchCount: 9
            },
            {
                id: 'RULE_RESEARCH_009',
                ruleName: '外协费用比例',
                ruleType: 'THRESHOLD',
                category: '科研监督',
                description: '检测外协费用超过总预算40%的情况',
                config: {
                    field: 'outsourcing_cost / total_budget',
                    operator: '>',
                    threshold: 0.4,
                    timeWindow: 'project'
                },
                priority: 78,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '外协管理', '比例监控'],
                createdAt: new Date(baseTime.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '科研处',
                lastExecutionTime: new Date(baseTime.getTime() - 7 * 60 * 60 * 1000).toISOString(),
                executionCount: 67,
                matchCount: 11
            },
            {
                id: 'RULE_RESEARCH_010',
                ruleName: '材料费集中采购',
                ruleType: 'SEQUENCE',
                category: '科研监督',
                description: '检测未执行集中采购制度的材料费支出',
                config: {
                    events: ['material_purchase'],
                    condition: 'NOT centralized_procurement',
                    timeWindow: 'single'
                },
                priority: 70,
                enabled: true,
                alertLevel: 'LOW',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '材料采购', '制度执行'],
                createdAt: new Date(baseTime.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '采购中心',
                lastExecutionTime: new Date(baseTime.getTime() - 5 * 60 * 60 * 1000).toISOString(),
                executionCount: 123,
                matchCount: 18
            },
            {
                id: 'RULE_RESEARCH_011',
                ruleName: '项目进度与支出匹配',
                ruleType: 'CORRELATION',
                category: '科研监督',
                description: '检测项目进度与支出进度不匹配的情况（支出超前进度20%）',
                config: {
                    entities: ['project_progress', 'expense_progress'],
                    condition: 'expense_progress - project_progress > 0.2'
                },
                priority: 72,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '进度管理', '匹配监控'],
                createdAt: new Date(baseTime.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '科研处',
                lastExecutionTime: new Date(baseTime.getTime() - 9 * 60 * 60 * 1000).toISOString(),
                executionCount: 89,
                matchCount: 14
            },
            {
                id: 'RULE_RESEARCH_012',
                ruleName: '发票真伪验证',
                ruleType: 'CORRELATION',
                category: '科研监督',
                description: '通过税务系统验证发票真伪，检测发票验证失败的情况',
                config: {
                    entities: ['invoice', 'tax_verification'],
                    relations: ['verification_failed'],
                    checkFields: ['invoice_code', 'invoice_number']
                },
                priority: 98,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email', 'sms'],
                    recipients: ['finance@university.edu', 'discipline@university.edu']
                },
                groupId: 'research',
                tags: ['科研经费', '发票验证', '违规风险'],
                createdAt: new Date(baseTime.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                executionCount: 456,
                matchCount: 3
            },
            {
                id: 'RULE_RESEARCH_013',
                ruleName: '科研助理工资',
                ruleType: 'THRESHOLD',
                category: '科研监督',
                description: '监测科研助理工资超出规定标准的情况',
                config: {
                    field: 'assistant_salary',
                    operator: '>',
                    threshold: 'standard_salary',
                    timeWindow: 'monthly'
                },
                priority: 76,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研经费', '工资管理', '标准执行'],
                createdAt: new Date(baseTime.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '人事处',
                lastExecutionTime: new Date(baseTime.getTime() - 6 * 60 * 60 * 1000).toISOString(),
                executionCount: 134,
                matchCount: 19
            },

            // ========== 采购监督规则 ==========
            {
                id: 'RULE001',
                ruleName: '单笔采购金额超限预警',
                ruleType: 'THRESHOLD',
                category: '采购监督',
                description: '监测单笔采购金额超过50万元的情况，需要进行重点审查',
                config: {
                    field: 'amount',
                    operator: '>',
                    threshold: 500000,
                    timeWindow: 'single'
                },
                priority: 90,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['audit@university.edu']
                },
                groupId: 'procurement',
                tags: ['采购', '金额监控', '高风险'],
                createdAt: new Date(baseTime.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '系统管理员',
                lastExecutionTime: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                executionCount: 156,
                matchCount: 23
            },
            // ========== 财务监督规则 ==========
            {
                id: 'RULE_FINANCE_001',
                ruleName: '科研经费异常增长趋势',
                ruleType: 'TREND',
                category: '财务监督',
                description: '检测科研经费支出在30天内增长超过50%的异常情况',
                config: {
                    field: 'expense',
                    timeWindow: '30d',
                    condition: 'increase > 50%'
                },
                priority: 80,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'finance',
                tags: ['科研经费', '趋势分析', '异常检测'],
                createdAt: new Date(baseTime.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 6 * 60 * 60 * 1000).toISOString(),
                executionCount: 89,
                matchCount: 12
            },
            {
                id: 'RULE_FINANCE_002',
                ruleName: '发票连号异常',
                ruleType: 'SEQUENCE',
                category: '财务监督',
                description: '检测同一供应商同一天提交连号发票',
                config: {
                    groupBy: ['supplier_id', 'invoice_date'],
                    checkField: 'invoice_number',
                    condition: 'consecutive_count >= 3'
                },
                priority: 85,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'finance',
                tags: ['发票管理', '异常检测', '财务监督'],
                createdAt: new Date(baseTime.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 4 * 60 * 60 * 1000).toISOString(),
                executionCount: 234,
                matchCount: 18
            },
            {
                id: 'RULE_FINANCE_003',
                ruleName: '大额资金转账',
                ruleType: 'THRESHOLD',
                category: '财务监督',
                description: '单笔转账金额超过100万元',
                config: {
                    field: 'transfer_amount',
                    operator: '>',
                    threshold: 1000000
                },
                priority: 92,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['finance@university.edu']
                },
                groupId: 'finance',
                tags: ['资金监管', '大额交易', '风险控制'],
                createdAt: new Date(baseTime.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 3 * 60 * 60 * 1000).toISOString(),
                executionCount: 145,
                matchCount: 8
            },
            {
                id: 'RULE_FINANCE_004',
                ruleName: '报销金额异常',
                ruleType: 'THRESHOLD',
                category: '财务监督',
                description: '个人月度报销金额超过5万元',
                config: {
                    field: 'SUM(reimbursement_amount)',
                    operator: '>',
                    threshold: 50000,
                    timeWindow: 'monthly',
                    groupBy: 'person_id'
                },
                priority: 75,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'finance',
                tags: ['报销监控', '异常检测', '财务管理'],
                createdAt: new Date(baseTime.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 5 * 60 * 60 * 1000).toISOString(),
                executionCount: 178,
                matchCount: 23
            },
            {
                id: 'RULE_FINANCE_005',
                ruleName: '预算超支预警',
                ruleType: 'THRESHOLD',
                category: '财务监督',
                description: '部门支出超过预算额度',
                config: {
                    field: 'actual_amount / budget_amount',
                    operator: '>',
                    threshold: 1.0,
                    timeWindow: 'monthly'
                },
                priority: 88,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['budget@university.edu']
                },
                groupId: 'finance',
                tags: ['预算管理', '超支预警', '财务监督'],
                createdAt: new Date(baseTime.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                executionCount: 234,
                matchCount: 34
            },
            {
                id: 'RULE_FINANCE_006',
                ruleName: '预算执行率过低',
                ruleType: 'THRESHOLD',
                category: '财务监督',
                description: '年末预算执行率低于80%',
                config: {
                    field: 'execution_rate',
                    operator: '<',
                    threshold: 0.8,
                    timeWindow: 'yearly',
                    checkMonth: 11
                },
                priority: 70,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'finance',
                tags: ['预算管理', '执行率', '财务监督'],
                createdAt: new Date(baseTime.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
                executionCount: 56,
                matchCount: 12
            },
            {
                id: 'RULE_FINANCE_007',
                ruleName: '公务接待费用过高',
                ruleType: 'THRESHOLD',
                category: '财务监督',
                description: '单次公务接待费用超过5000元',
                config: {
                    field: 'reception_amount',
                    operator: '>',
                    threshold: 5000,
                    timeWindow: 'single'
                },
                priority: 90,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['discipline@university.edu']
                },
                groupId: 'finance',
                tags: ['三公经费', '接待费', '作风监督'],
                createdAt: new Date(baseTime.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '纪检监察室',
                lastExecutionTime: new Date(baseTime.getTime() - 6 * 60 * 60 * 1000).toISOString(),
                executionCount: 89,
                matchCount: 7
            },
            // ========== 采购监督规则（续） ==========
            {
                id: 'RULE_PROCUREMENT_001',
                ruleName: '供应商关联关系检测',
                ruleType: 'CORRELATION',
                category: '采购监督',
                description: '检测采购人员与供应商之间的亲属关系或投资关系',
                config: {
                    entities: ['person', 'supplier'],
                    relations: ['family_relation', 'investment_relation']
                },
                priority: 95,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email', 'sms'],
                    recipients: ['discipline@university.edu']
                },
                groupId: 'procurement',
                tags: ['关联关系', '利益冲突', '高风险'],
                createdAt: new Date(baseTime.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '纪检监察室',
                lastExecutionTime: new Date(baseTime.getTime() - 12 * 60 * 60 * 1000).toISOString(),
                executionCount: 67,
                matchCount: 8
            },
            {
                id: 'RULE_PROCUREMENT_002',
                ruleName: '招标围标串标检测',
                ruleType: 'CORRELATION',
                category: '采购监督',
                description: '检测多个投标单位之间的关联关系，识别围标串标风险',
                config: {
                    entities: ['bidder', 'company', 'person'],
                    relations: ['same_legal_person', 'same_address', 'same_contact']
                },
                priority: 92,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['procurement@university.edu']
                },
                groupId: 'procurement',
                tags: ['招标监督', '围标串标', '采购风险'],
                createdAt: new Date(baseTime.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '采购中心',
                lastExecutionTime: new Date(baseTime.getTime() - 18 * 60 * 60 * 1000).toISOString(),
                executionCount: 28,
                matchCount: 4
            },
            {
                id: 'RULE_PROCUREMENT_003',
                ruleName: '拆分采购规避招标',
                ruleType: 'THRESHOLD',
                category: '采购监督',
                description: '同一供应商30天内多笔采购总额超过招标限额',
                config: {
                    field: 'SUM(amount)',
                    operator: '>',
                    threshold: 200000,
                    timeWindow: '30d',
                    groupBy: 'supplier_id',
                    condition: 'each_amount < 200000'
                },
                priority: 93,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['audit@university.edu']
                },
                groupId: 'procurement',
                tags: ['拆分采购', '规避招标', '违规风险'],
                createdAt: new Date(baseTime.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '审计处',
                lastExecutionTime: new Date(baseTime.getTime() - 8 * 60 * 60 * 1000).toISOString(),
                executionCount: 156,
                matchCount: 12
            },
            {
                id: 'RULE_PROCUREMENT_004',
                ruleName: '合同变更频繁',
                ruleType: 'THRESHOLD',
                category: '采购监督',
                description: '单个合同变更次数超过3次或变更金额超过原合同30%',
                config: {
                    field: 'change_count',
                    operator: '>',
                    threshold: 3,
                    alternativeCondition: 'change_amount / original_amount > 0.3'
                },
                priority: 78,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'procurement',
                tags: ['合同管理', '变更监控', '采购监督'],
                createdAt: new Date(baseTime.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '采购中心',
                lastExecutionTime: new Date(baseTime.getTime() - 10 * 60 * 60 * 1000).toISOString(),
                executionCount: 89,
                matchCount: 15
            },

            // ========== 资产监督规则 ==========
            {
                id: 'RULE_ASSET_001',
                ruleName: '资产长期闲置',
                ruleType: 'THRESHOLD',
                category: '资产监督',
                description: '资产采购后超过6个月未使用',
                config: {
                    field: 'DATEDIFF(CURRENT_DATE, purchase_date)',
                    operator: '>',
                    threshold: 180,
                    condition: 'usage_count = 0'
                },
                priority: 72,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'asset',
                tags: ['资产管理', '闲置监控', '资源浪费'],
                createdAt: new Date(baseTime.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '资产处',
                lastExecutionTime: new Date(baseTime.getTime() - 12 * 60 * 60 * 1000).toISOString(),
                executionCount: 67,
                matchCount: 14
            },
            {
                id: 'RULE_ASSET_002',
                ruleName: '资产处置价格过低',
                ruleType: 'THRESHOLD',
                category: '资产监督',
                description: '资产处置价格低于评估价50%以上',
                config: {
                    field: 'disposal_price / appraisal_price',
                    operator: '<',
                    threshold: 0.5
                },
                priority: 85,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['asset@university.edu']
                },
                groupId: 'asset',
                tags: ['资产处置', '价格监控', '国有资产'],
                createdAt: new Date(baseTime.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '资产处',
                lastExecutionTime: new Date(baseTime.getTime() - 8 * 60 * 60 * 1000).toISOString(),
                executionCount: 45,
                matchCount: 6
            },
            {
                id: 'RULE_ASSET_003',
                ruleName: '资产重复采购',
                ruleType: 'THRESHOLD',
                category: '资产监督',
                description: '同一部门6个月内采购相同规格资产超过2次',
                config: {
                    field: 'COUNT(*)',
                    operator: '>',
                    threshold: 2,
                    timeWindow: '180d',
                    groupBy: ['department_id', 'asset_spec']
                },
                priority: 75,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'asset',
                tags: ['资产采购', '重复购置', '资源浪费'],
                createdAt: new Date(baseTime.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '资产处',
                lastExecutionTime: new Date(baseTime.getTime() - 6 * 60 * 60 * 1000).toISOString(),
                executionCount: 89,
                matchCount: 11
            },
            {
                id: 'RULE_ASSET_004',
                ruleName: '资产盘点差异',
                ruleType: 'THRESHOLD',
                category: '资产监督',
                description: '资产盘点差异率超过5%',
                config: {
                    field: 'ABS(actual_count - book_count) / book_count',
                    operator: '>',
                    threshold: 0.05,
                    timeWindow: 'inventory'
                },
                priority: 80,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'asset',
                tags: ['资产盘点', '账实不符', '资产管理'],
                createdAt: new Date(baseTime.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '资产处',
                lastExecutionTime: new Date(baseTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
                executionCount: 34,
                matchCount: 8
            },

            // ========== 招生监督规则 ==========
            {
                id: 'RULE_ADMISSION_001',
                ruleName: '录取分数异常',
                ruleType: 'THRESHOLD',
                category: '招生监督',
                description: '录取分数低于专业最低分数线10分以上',
                config: {
                    field: 'minimum_score - admission_score',
                    operator: '>',
                    threshold: 10,
                    groupBy: 'major_id'
                },
                priority: 95,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email', 'sms'],
                    recipients: ['admission@university.edu', 'discipline@university.edu']
                },
                groupId: 'admission',
                tags: ['招生监督', '分数异常', '公平公正'],
                createdAt: new Date(baseTime.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '招生办',
                lastExecutionTime: new Date(baseTime.getTime() - 48 * 60 * 60 * 1000).toISOString(),
                executionCount: 23,
                matchCount: 2
            },
            {
                id: 'RULE_ADMISSION_002',
                ruleName: '特殊类型招生比例过高',
                ruleType: 'THRESHOLD',
                category: '招生监督',
                description: '特殊类型招生人数超过计划的5%',
                config: {
                    field: 'special_admission_count / total_plan',
                    operator: '>',
                    threshold: 0.05,
                    groupBy: 'major_id'
                },
                priority: 82,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'admission',
                tags: ['招生监督', '特殊类型', '比例监控'],
                createdAt: new Date(baseTime.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '招生办',
                lastExecutionTime: new Date(baseTime.getTime() - 36 * 60 * 60 * 1000).toISOString(),
                executionCount: 15,
                matchCount: 3
            },
            {
                id: 'RULE_ADMISSION_003',
                ruleName: '加分资格可疑',
                ruleType: 'CORRELATION',
                category: '招生监督',
                description: '加分学生与招生人员存在关联关系',
                config: {
                    entities: ['student', 'admission_staff'],
                    relations: ['family_relation', 'social_relation']
                },
                priority: 98,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email', 'sms'],
                    recipients: ['discipline@university.edu']
                },
                groupId: 'admission',
                tags: ['招生监督', '加分资格', '利益冲突'],
                createdAt: new Date(baseTime.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '纪检监察室',
                lastExecutionTime: new Date(baseTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
                executionCount: 12,
                matchCount: 1
            },
            {
                id: 'RULE004',
                ruleName: '异常报销时序模式',
                ruleType: 'SEQUENCE',
                category: '财务监督',
                description: '检测7天内连续发生的异常报销行为模式',
                config: {
                    events: ['large_expense', 'split_payment', 'weekend_approval'],
                    timeWindow: '7d'
                },
                priority: 75,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'finance',
                tags: ['报销监控', '时序分析', '行为模式'],
                createdAt: new Date(baseTime.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '审计处',
                lastExecutionTime: new Date(baseTime.getTime() - 4 * 60 * 60 * 1000).toISOString(),
                executionCount: 124,
                matchCount: 15
            },
            {
                id: 'RULE005',
                ruleName: '复杂关系网络图谱分析',
                ruleType: 'GRAPH',
                category: '综合监督',
                description: '分析人员-公司-合同之间的复杂关系网络，发现潜在风险',
                config: {
                    pattern: 'person->company->contract',
                    condition: 'person.role=approver AND contract.amount>1000000'
                },
                priority: 85,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['risk@university.edu']
                },
                groupId: 'comprehensive',
                tags: ['图谱分析', '关系网络', '风险识别'],
                createdAt: new Date(baseTime.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '数据分析中心',
                lastExecutionTime: new Date(baseTime.getTime() - 8 * 60 * 60 * 1000).toISOString(),
                executionCount: 45,
                matchCount: 6
            },
            {
                id: 'RULE006',
                ruleName: '资产处置价格异常',
                ruleType: 'THRESHOLD',
                category: '资产监督',
                description: '监测资产处置价格低于评估价80%的情况',
                config: {
                    field: 'disposal_price_ratio',
                    operator: '<',
                    threshold: 0.8,
                    timeWindow: 'single'
                },
                priority: 70,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'asset',
                tags: ['资产处置', '价格监控', '国有资产'],
                createdAt: new Date(baseTime.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '资产处',
                lastExecutionTime: new Date(baseTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
                executionCount: 34,
                matchCount: 5
            },
            {
                id: 'RULE007',
                ruleName: '工程项目进度异常',
                ruleType: 'TREND',
                category: '基建监督',
                description: '检测工程项目进度连续两个月低于计划进度20%',
                config: {
                    field: 'progress_deviation',
                    timeWindow: '60d',
                    condition: 'below_plan > 20%'
                },
                priority: 65,
                enabled: false,
                alertLevel: 'LOW',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'construction',
                tags: ['工程监督', '进度管理', '基建项目'],
                createdAt: new Date(baseTime.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '基建处',
                lastExecutionTime: null,
                executionCount: 0,
                matchCount: 0
            },
            {
                id: 'RULE008',
                ruleName: '招标围标串标检测',
                ruleType: 'CORRELATION',
                category: '采购监督',
                description: '检测多个投标单位之间的关联关系，识别围标串标风险',
                config: {
                    entities: ['bidder', 'company', 'person'],
                    relations: ['same_legal_person', 'same_address', 'same_contact']
                },
                priority: 92,
                enabled: true,
                alertLevel: 'HIGH',
                notifyStrategy: {
                    channels: ['system', 'email'],
                    recipients: ['procurement@university.edu']
                },
                groupId: 'procurement',
                tags: ['招标监督', '围标串标', '采购风险'],
                createdAt: new Date(baseTime.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '采购中心',
                lastExecutionTime: new Date(baseTime.getTime() - 18 * 60 * 60 * 1000).toISOString(),
                executionCount: 28,
                matchCount: 4
            },
            {
                id: 'RULE009',
                ruleName: '科研项目结题率预警',
                ruleType: 'THRESHOLD',
                category: '科研监督',
                description: '监测部门科研项目结题率低于60%的情况',
                config: {
                    field: 'completion_rate',
                    operator: '<',
                    threshold: 0.6,
                    timeWindow: 'yearly'
                },
                priority: 60,
                enabled: true,
                alertLevel: 'LOW',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'research',
                tags: ['科研管理', '项目监督', '结题率'],
                createdAt: new Date(baseTime.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '科研处',
                lastExecutionTime: new Date(baseTime.getTime() - 48 * 60 * 60 * 1000).toISOString(),
                executionCount: 12,
                matchCount: 3
            },
            {
                id: 'RULE010',
                ruleName: '差旅费报销异常模式',
                ruleType: 'SEQUENCE',
                category: '财务监督',
                description: '检测差旅费报销中的异常行为序列模式',
                config: {
                    events: ['frequent_travel', 'high_expense', 'same_destination'],
                    timeWindow: '30d'
                },
                priority: 68,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'finance',
                tags: ['差旅费', '报销监控', '异常检测'],
                createdAt: new Date(baseTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: '财务处',
                lastExecutionTime: new Date(baseTime.getTime() - 10 * 60 * 60 * 1000).toISOString(),
                executionCount: 56,
                matchCount: 9
            },
            {
                id: 'RULE011',
                ruleName: '学生资助资金发放异常',
                ruleType: 'THRESHOLD',
                category: '学生工作',
                description: '监测单个学生资助金额超过年度标准的情况',
                config: {
                    field: 'subsidy_amount',
                    operator: '>',
                    threshold: 20000,
                    timeWindow: 'yearly'
                },
                priority: 72,
                enabled: true,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'student',
                tags: ['学生资助', '资金监管', '精准资助'],
                createdAt: new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: now,
                createdBy: '学生处',
                lastExecutionTime: new Date(baseTime.getTime() - 36 * 60 * 60 * 1000).toISOString(),
                executionCount: 23,
                matchCount: 2
            },
            {
                id: 'RULE012',
                ruleName: '教师兼职收入申报检测',
                ruleType: 'GRAPH',
                category: '人事监督',
                description: '分析教师兼职企业与学校合作项目的关联关系',
                config: {
                    pattern: 'teacher->company->project->university',
                    condition: 'teacher.position=professor AND project.amount>500000'
                },
                priority: 78,
                enabled: false,
                alertLevel: 'MEDIUM',
                notifyStrategy: {
                    channels: ['system'],
                    recipients: []
                },
                groupId: 'personnel',
                tags: ['兼职管理', '利益冲突', '人事监督'],
                createdAt: new Date(baseTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: now,
                createdBy: '人事处',
                lastExecutionTime: null,
                executionCount: 0,
                matchCount: 0
            }
        ];
    }

    /**
     * 获取预置执行历史
     */
    getPresetExecutions() {
        const executions = [];
        const baseTime = new Date();
        const ruleIds = ['RULE001', 'RULE002', 'RULE003', 'RULE004', 'RULE005', 'RULE008', 'RULE009', 'RULE010', 'RULE011'];
        
        // 生成最近7天的执行历史
        for (let day = 6; day >= 0; day--) {
            const date = new Date(baseTime.getTime() - day * 24 * 60 * 60 * 1000);
            
            // 每天随机执行几次
            const executionsPerDay = Math.floor(Math.random() * 5) + 3;
            for (let i = 0; i < executionsPerDay; i++) {
                const ruleId = ruleIds[Math.floor(Math.random() * ruleIds.length)];
                const dataCount = Math.floor(Math.random() * 1000) + 100;
                const matchedCount = Math.floor(dataCount * (0.01 + Math.random() * 0.1));
                
                executions.push({
                    id: 'EXEC' + date.getTime() + i + Math.random().toString(36).substr(2, 6),
                    ruleId: ruleId,
                    ruleName: this.getRuleNameById(ruleId),
                    ruleType: this.getRuleTypeById(ruleId),
                    executionTime: new Date(date.getTime() + i * 3600000).toISOString(),
                    dataCount: dataCount,
                    matchedCount: matchedCount,
                    alerts: [],
                    executionDuration: Math.floor(300 + Math.random() * 700),
                    status: Math.random() > 0.05 ? 'SUCCESS' : 'ERROR'
                });
            }
        }
        
        return executions.sort((a, b) => new Date(b.executionTime) - new Date(a.executionTime));
    }

    /**
     * 根据规则ID获取规则名称
     */
    getRuleNameById(ruleId) {
        const names = {
            'RULE001': '单笔采购金额超限预警',
            'RULE002': '科研经费异常增长趋势',
            'RULE003': '供应商关联关系检测',
            'RULE004': '异常报销时序模式',
            'RULE005': '复杂关系网络图谱分析',
            'RULE008': '招标围标串标检测',
            'RULE009': '科研项目结题率预警',
            'RULE010': '差旅费报销异常模式',
            'RULE011': '学生资助资金发放异常'
        };
        return names[ruleId] || '未知规则';
    }

    /**
     * 根据规则ID获取规则类型
     */
    getRuleTypeById(ruleId) {
        const types = {
            'RULE001': 'THRESHOLD',
            'RULE002': 'TREND',
            'RULE003': 'CORRELATION',
            'RULE004': 'SEQUENCE',
            'RULE005': 'GRAPH',
            'RULE008': 'CORRELATION',
            'RULE009': 'THRESHOLD',
            'RULE010': 'SEQUENCE',
            'RULE011': 'THRESHOLD'
        };
        return types[ruleId] || 'THRESHOLD';
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'RULE' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 创建规则
     */
    createRule(rule) {
        const rules = this.getAllRules();
        const newRule = {
            id: this.generateId(),
            ruleName: rule.ruleName,
            ruleType: rule.ruleType, // THRESHOLD, TREND, CORRELATION, SEQUENCE, GRAPH
            category: rule.category || '通用规则',
            description: rule.description || '',
            config: rule.config || {},
            priority: rule.priority || 0,
            enabled: rule.enabled !== false,
            alertLevel: rule.alertLevel || 'MEDIUM',
            notifyStrategy: rule.notifyStrategy || {
                channels: ['system'],
                recipients: []
            },
            groupId: rule.groupId || null,
            tags: rule.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: rule.createdBy || 'system',
            lastExecutionTime: null,
            executionCount: 0,
            matchCount: 0
        };
        rules.push(newRule);
        localStorage.setItem(this.storageKey, JSON.stringify(rules));
        return newRule;
    }

    /**
     * 获取所有规则
     */
    getAllRules() {
        const rulesJson = localStorage.getItem(this.storageKey) || '[]';
        console.log('从 localStorage 读取规则:', rulesJson.substring(0, 100) + '...');
        const rules = JSON.parse(rulesJson);
        console.log('解析后的规则数量:', rules.length);
        return rules;
    }

    /**
     * 根据ID获取规则
     */
    getRuleById(id) {
        const rules = this.getAllRules();
        return rules.find(r => r.id === id);
    }

    /**
     * 更新规则
     */
    updateRule(id, updates) {
        const rules = this.getAllRules();
        const index = rules.findIndex(r => r.id === id);
        if (index === -1) {
            throw new Error('规则不存在');
        }
        rules[index] = {
            ...rules[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(rules));
        return rules[index];
    }

    /**
     * 删除规则
     */
    deleteRule(id) {
        const rules = this.getAllRules();
        const filtered = rules.filter(r => r.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    }

    /**
     * 启用/禁用规则
     */
    toggleRule(id, enabled) {
        return this.updateRule(id, { enabled });
    }

    /**
     * 批量启用规则
     */
    batchEnableRules(ruleIds) {
        const rules = this.getAllRules();
        let count = 0;
        rules.forEach(rule => {
            if (ruleIds.includes(rule.id)) {
                rule.enabled = true;
                rule.updatedAt = new Date().toISOString();
                count++;
            }
        });
        localStorage.setItem(this.storageKey, JSON.stringify(rules));
        return { success: true, count };
    }

    /**
     * 批量禁用规则
     */
    batchDisableRules(ruleIds) {
        const rules = this.getAllRules();
        let count = 0;
        rules.forEach(rule => {
            if (ruleIds.includes(rule.id)) {
                rule.enabled = false;
                rule.updatedAt = new Date().toISOString();
                count++;
            }
        });
        localStorage.setItem(this.storageKey, JSON.stringify(rules));
        return { success: true, count };
    }

    /**
     * 批量删除规则
     */
    batchDeleteRules(ruleIds) {
        const rules = this.getAllRules();
        const filtered = rules.filter(r => !ruleIds.includes(r.id));
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return { success: true, count: rules.length - filtered.length };
    }

    /**
     * 复制规则
     */
    copyRule(id) {
        const rule = this.getRuleById(id);
        if (!rule) {
            throw new Error('规则不存在');
        }
        const newRule = {
            ...rule,
            id: this.generateId(),
            ruleName: rule.ruleName + ' (副本)',
            enabled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastExecutionTime: null,
            executionCount: 0,
            matchCount: 0
        };
        const rules = this.getAllRules();
        rules.push(newRule);
        localStorage.setItem(this.storageKey, JSON.stringify(rules));
        return newRule;
    }

    /**
     * 执行规则
     */
    async executeRule(ruleId, data = null) {
        const rule = this.getRuleById(ruleId);
        if (!rule) {
            throw new Error('规则不存在');
        }
        if (!rule.enabled) {
            throw new Error('规则未启用');
        }

        // 模拟规则执行
        const result = await this.simulateRuleExecution(rule, data);
        
        // 保存执行结果
        const execution = {
            id: 'EXEC' + Date.now() + Math.random().toString(36).substr(2, 9),
            ruleId: rule.id,
            ruleName: rule.ruleName,
            ruleType: rule.ruleType,
            executionTime: new Date().toISOString(),
            dataCount: result.dataCount,
            matchedCount: result.matchedCount,
            alerts: result.alerts,
            executionDuration: result.executionDuration,
            status: result.status
        };

        const executions = JSON.parse(localStorage.getItem(this.executionKey) || '[]');
        executions.unshift(execution);
        if (executions.length > 1000) {
            executions.splice(1000);
        }
        localStorage.setItem(this.executionKey, JSON.stringify(executions));

        // 更新规则统计
        this.updateRule(ruleId, {
            lastExecutionTime: execution.executionTime,
            executionCount: rule.executionCount + 1,
            matchCount: rule.matchCount + result.matchedCount
        });

        return execution;
    }

    /**
     * 模拟规则执行
     */
    async simulateRuleExecution(rule, data) {
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

        const dataCount = data ? data.length : Math.floor(Math.random() * 1000) + 100;
        let matchedCount = 0;
        const alerts = [];

        // 根据规则类型生成不同的匹配结果
        switch (rule.ruleType) {
            case 'THRESHOLD':
                matchedCount = Math.floor(dataCount * (0.05 + Math.random() * 0.10));
                break;
            case 'TREND':
                matchedCount = Math.floor(dataCount * (0.03 + Math.random() * 0.07));
                break;
            case 'CORRELATION':
                matchedCount = Math.floor(dataCount * (0.02 + Math.random() * 0.05));
                break;
            case 'SEQUENCE':
                matchedCount = Math.floor(dataCount * (0.01 + Math.random() * 0.04));
                break;
            case 'GRAPH':
                matchedCount = Math.floor(dataCount * (0.01 + Math.random() * 0.03));
                break;
            default:
                matchedCount = Math.floor(dataCount * 0.05);
        }

        // 生成预警记录
        for (let i = 0; i < Math.min(matchedCount, 10); i++) {
            alerts.push({
                alertId: 'ALT' + Date.now() + i + Math.random().toString(36).substr(2, 6),
                ruleId: rule.id,
                ruleName: rule.ruleName,
                alertLevel: rule.alertLevel,
                title: this.generateAlertTitle(rule),
                description: this.generateAlertDescription(rule),
                involvedEntities: this.generateInvolvedEntities(rule),
                evidenceData: this.generateEvidenceData(rule),
                createdAt: new Date().toISOString()
            });
        }

        return {
            dataCount,
            matchedCount,
            alerts,
            executionDuration: Math.floor(300 + Math.random() * 700),
            status: 'SUCCESS'
        };
    }

    /**
     * 生成预警标题
     */
    generateAlertTitle(rule) {
        const templates = {
            'THRESHOLD': ['检测到阈值超标', '发现异常数值', '超出限定范围'],
            'TREND': ['检测到异常趋势', '发现趋势变化', '趋势异常预警'],
            'CORRELATION': ['检测到关联关系', '发现关联异常', '关联风险预警'],
            'SEQUENCE': ['检测到时序异常', '发现序列模式', '时序风险预警'],
            'GRAPH': ['检测到图谱关系', '发现关系网络', '图谱风险预警']
        };
        const list = templates[rule.ruleType] || ['规则匹配预警'];
        return list[Math.floor(Math.random() * list.length)] + ' - ' + rule.ruleName;
    }

    /**
     * 生成预警描述
     */
    generateAlertDescription(rule) {
        return `规则"${rule.ruleName}"检测到异常情况，请及时核查处理。`;
    }

    /**
     * 生成涉及对象
     */
    generateInvolvedEntities(rule) {
        const entityTypes = ['person', 'department', 'project', 'contract', 'supplier'];
        const count = Math.floor(Math.random() * 3) + 1;
        const entities = [];
        for (let i = 0; i < count; i++) {
            const type = entityTypes[Math.floor(Math.random() * entityTypes.length)];
            entities.push({
                entityType: type,
                entityId: type.toUpperCase() + Math.floor(Math.random() * 10000),
                entityName: this.generateEntityName(type)
            });
        }
        return entities;
    }

    /**
     * 生成实体名称
     */
    generateEntityName(type) {
        const names = {
            'person': ['张三', '李四', '王五', '赵六'],
            'department': ['财务处', '科研处', '资产处', '采购中心'],
            'project': ['科研项目A', '基建项目B', '采购项目C'],
            'contract': ['合同001', '合同002', '合同003'],
            'supplier': ['供应商甲', '供应商乙', '供应商丙']
        };
        const list = names[type] || ['未知'];
        return list[Math.floor(Math.random() * list.length)];
    }

    /**
     * 生成证据数据
     */
    generateEvidenceData(rule) {
        return {
            ruleType: rule.ruleType,
            matchedValue: Math.floor(Math.random() * 100000),
            threshold: rule.config.threshold || 0,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 测试规则
     */
    async testRule(ruleId, testData) {
        const rule = this.getRuleById(ruleId);
        if (!rule) {
            throw new Error('规则不存在');
        }

        // 执行测试
        const result = await this.simulateRuleExecution(rule, testData);
        
        // 保存测试结果
        const testResult = {
            id: 'TEST' + Date.now() + Math.random().toString(36).substr(2, 9),
            ruleId: rule.id,
            ruleName: rule.ruleName,
            testTime: new Date().toISOString(),
            testDataCount: testData ? testData.length : 0,
            matchedCount: result.matchedCount,
            matchRate: result.dataCount > 0 ? (result.matchedCount / result.dataCount * 100).toFixed(2) : 0,
            alerts: result.alerts,
            executionDuration: result.executionDuration,
            status: 'SUCCESS'
        };

        const testResults = JSON.parse(localStorage.getItem(this.testResultsKey) || '[]');
        testResults.unshift(testResult);
        if (testResults.length > 500) {
            testResults.splice(500);
        }
        localStorage.setItem(this.testResultsKey, JSON.stringify(testResults));

        return testResult;
    }

    /**
     * 获取执行历史
     */
    getExecutionHistory(filter = {}) {
        let executions = JSON.parse(localStorage.getItem(this.executionKey) || '[]');
        
        if (filter.ruleId) {
            executions = executions.filter(e => e.ruleId === filter.ruleId);
        }
        if (filter.status) {
            executions = executions.filter(e => e.status === filter.status);
        }
        if (filter.startDate) {
            executions = executions.filter(e => new Date(e.executionTime) >= new Date(filter.startDate));
        }
        if (filter.endDate) {
            executions = executions.filter(e => new Date(e.executionTime) <= new Date(filter.endDate));
        }
        
        return executions;
    }

    /**
     * 获取测试历史
     */
    getTestHistory(ruleId = null) {
        let testResults = JSON.parse(localStorage.getItem(this.testResultsKey) || '[]');
        if (ruleId) {
            testResults = testResults.filter(t => t.ruleId === ruleId);
        }
        return testResults;
    }

    /**
     * 检测规则冲突
     */
    detectConflicts(ruleId = null) {
        const rules = ruleId 
            ? [this.getRuleById(ruleId)]
            : this.getAllRules().filter(r => r.enabled);
        
        const conflicts = [];
        
        for (let i = 0; i < rules.length; i++) {
            for (let j = i + 1; j < rules.length; j++) {
                const rule1 = rules[i];
                const rule2 = rules[j];
                
                // 检查是否有冲突
                if (this.hasConflict(rule1, rule2)) {
                    conflicts.push({
                        rule1: { id: rule1.id, name: rule1.ruleName },
                        rule2: { id: rule2.id, name: rule2.ruleName },
                        conflictType: this.getConflictType(rule1, rule2),
                        description: this.getConflictDescription(rule1, rule2)
                    });
                }
            }
        }
        
        return conflicts;
    }

    /**
     * 检查两个规则是否冲突
     */
    hasConflict(rule1, rule2) {
        // 简化的冲突检测逻辑
        // 实际应该根据规则配置进行更复杂的检测
        
        // 同一分组且优先级相同
        if (rule1.groupId && rule1.groupId === rule2.groupId && rule1.priority === rule2.priority) {
            return true;
        }
        
        // 相同类型且配置相似
        if (rule1.ruleType === rule2.ruleType && rule1.category === rule2.category) {
            if (JSON.stringify(rule1.config) === JSON.stringify(rule2.config)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 获取冲突类型
     */
    getConflictType(rule1, rule2) {
        if (rule1.groupId === rule2.groupId) {
            return 'PRIORITY_CONFLICT';
        }
        if (JSON.stringify(rule1.config) === JSON.stringify(rule2.config)) {
            return 'DUPLICATE_CONFIG';
        }
        return 'LOGIC_CONFLICT';
    }

    /**
     * 获取冲突描述
     */
    getConflictDescription(rule1, rule2) {
        const type = this.getConflictType(rule1, rule2);
        const descriptions = {
            'PRIORITY_CONFLICT': '两个规则在同一分组中具有相同的优先级',
            'DUPLICATE_CONFIG': '两个规则具有相同的配置',
            'LOGIC_CONFLICT': '两个规则的逻辑可能存在冲突'
        };
        return descriptions[type] || '规则可能存在冲突';
    }

    /**
     * 导出规则
     */
    exportRules(ruleIds = null) {
        const rules = ruleIds
            ? this.getAllRules().filter(r => ruleIds.includes(r.id))
            : this.getAllRules();
        
        const exportData = {
            version: '1.0',
            exportTime: new Date().toISOString(),
            rules: rules.map(rule => ({
                ...rule,
                // 移除运行时统计数据
                lastExecutionTime: null,
                executionCount: 0,
                matchCount: 0
            }))
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * 导入规则
     */
    importRules(jsonData, options = {}) {
        try {
            const importData = JSON.parse(jsonData);
            if (!importData.rules || !Array.isArray(importData.rules)) {
                throw new Error('无效的导入数据格式');
            }

            const rules = this.getAllRules();
            const imported = [];
            const skipped = [];

            importData.rules.forEach(rule => {
                // 检查是否已存在
                const existing = rules.find(r => r.ruleName === rule.ruleName);
                
                if (existing && !options.overwrite) {
                    skipped.push(rule.ruleName);
                } else {
                    const newRule = {
                        ...rule,
                        id: this.generateId(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        enabled: options.enableOnImport ? true : rule.enabled
                    };
                    rules.push(newRule);
                    imported.push(newRule.ruleName);
                }
            });

            localStorage.setItem(this.storageKey, JSON.stringify(rules));

            return {
                success: true,
                imported: imported.length,
                skipped: skipped.length,
                importedRules: imported,
                skippedRules: skipped
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取规则统计
     */
    getRuleStatistics() {
        const rules = this.getAllRules();
        const executions = this.getExecutionHistory();

        // 按类型统计
        const byType = {};
        rules.forEach(rule => {
            if (!byType[rule.ruleType]) {
                byType[rule.ruleType] = {
                    type: rule.ruleType,
                    total: 0,
                    enabled: 0,
                    disabled: 0
                };
            }
            byType[rule.ruleType].total++;
            if (rule.enabled) {
                byType[rule.ruleType].enabled++;
            } else {
                byType[rule.ruleType].disabled++;
            }
        });

        // 按分类统计
        const byCategory = {};
        rules.forEach(rule => {
            if (!byCategory[rule.category]) {
                byCategory[rule.category] = {
                    category: rule.category,
                    total: 0,
                    enabled: 0
                };
            }
            byCategory[rule.category].total++;
            if (rule.enabled) {
                byCategory[rule.category].enabled++;
            }
        });

        // 执行趋势（最近7天）
        const trend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayExecutions = executions.filter(e => 
                e.executionTime.startsWith(dateStr)
            );
            
            trend.push({
                date: dateStr,
                executionCount: dayExecutions.length,
                matchCount: dayExecutions.reduce((sum, e) => sum + e.matchedCount, 0)
            });
        }

        return {
            overall: {
                totalRules: rules.length,
                enabledRules: rules.filter(r => r.enabled).length,
                disabledRules: rules.filter(r => !r.enabled).length,
                totalExecutions: executions.length,
                totalMatches: executions.reduce((sum, e) => sum + e.matchedCount, 0),
                avgMatchRate: executions.length > 0
                    ? (executions.reduce((sum, e) => sum + (e.matchedCount / e.dataCount), 0) / executions.length * 100).toFixed(2)
                    : 0
            },
            byType: Object.values(byType),
            byCategory: Object.values(byCategory),
            trend
        };
    }

    /**
     * 批量执行规则
     */
    async batchExecuteRules(ruleIds = null, data = null) {
        const rules = ruleIds
            ? ruleIds.map(id => this.getRuleById(id)).filter(r => r && r.enabled)
            : this.getAllRules().filter(r => r.enabled);
        
        const results = [];
        for (const rule of rules) {
            try {
                const result = await this.executeRule(rule.id, data);
                results.push(result);
            } catch (error) {
                results.push({
                    ruleId: rule.id,
                    ruleName: rule.ruleName,
                    status: 'ERROR',
                    error: error.message
                });
            }
        }
        return results;
    }
}

// 导出服务类和实例
window.RuleEngineService = RuleEngineService;
window.ruleEngineService = new RuleEngineService();
