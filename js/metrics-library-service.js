/**
 * 指标库服务
 * 提供预置指标管理、指标计算、指标分类等功能
 */

class MetricsLibraryService {
    constructor() {
        this.metrics = this.initializePresetMetrics();
        this.categories = this.initializeCategories();
    }

    /**
     * 初始化指标分类体系
     */
    initializeCategories() {
        return [
            { id: 'alert', name: '预警指标', icon: 'warning', color: '#ff4d4f' },
            { id: 'clue', name: '线索指标', icon: 'search', color: '#1890ff' },
            { id: 'rectification', name: '整改指标', icon: 'check-circle', color: '#52c41a' },
            { id: 'supervision', name: '监督指标', icon: 'eye', color: '#722ed1' },
            { id: 'finance', name: '财务指标', icon: 'dollar', color: '#fa8c16' },
            { id: 'procurement', name: '采购指标', icon: 'shopping-cart', color: '#13c2c2' },
            { id: 'research', name: '科研指标', icon: 'experiment', color: '#eb2f96' },
            { id: 'asset', name: '资产指标', icon: 'database', color: '#2f54eb' },
            { id: 'quality', name: '质量指标', icon: 'safety', color: '#faad14' },
            { id: 'efficiency', name: '效率指标', icon: 'dashboard', color: '#52c41a' }
        ];
    }

    /**
     * 初始化50+个预置指标
     */
    initializePresetMetrics() {
        return [
            // 预警指标 (1-10)
            {
                id: 'M001',
                code: 'alert_total_count',
                name: '预警总数',
                category: 'alert',
                description: '系统生成的预警总数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM alerts',
                refreshFrequency: 'REALTIME',
                enabled: true
            },
            {
                id: 'M002',
                code: 'alert_new_count',
                name: '新增预警数',
                category: 'alert',
                description: '状态为新增的预警数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM alerts WHERE status = "NEW"',
                refreshFrequency: 'REALTIME',
                enabled: true
            },
            {
                id: 'M003',
                code: 'alert_high_count',
                name: '高风险预警数',
                category: 'alert',
                description: '高风险等级的预警数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM alerts WHERE alert_level = "HIGH"',
                refreshFrequency: 'HOURLY',
                enabled: true
            },
            {
                id: 'M004',
                code: 'alert_processing_count',
                name: '处理中预警数',
                category: 'alert',
                description: '正在处理的预警数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM alerts WHERE status = "PROCESSING"',
                refreshFrequency: 'HOURLY',
                enabled: true
            },
            {
                id: 'M005',
                code: 'alert_resolved_count',
                name: '已解决预警数',
                category: 'alert',
                description: '已解决的预警数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM alerts WHERE status = "RESOLVED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M006',
                code: 'alert_resolution_rate',
                name: '预警解决率',
                category: 'alert',
                description: '已解决预警占总预警的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN status="RESOLVED" THEN 1 END) * 100.0 / COUNT(*)) FROM alerts',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M007',
                code: 'alert_avg_resolution_time',
                name: '预警平均处理时长',
                category: 'alert',
                description: '预警从创建到解决的平均时长',
                unit: '小时',
                dataType: 'NUMBER',
                calculation: 'SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) FROM alerts WHERE status = "RESOLVED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M008',
                code: 'alert_cluster_count',
                name: '预警聚类数',
                category: 'alert',
                description: '预警聚类的批次数量',
                unit: '批',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(DISTINCT cluster_id) FROM alerts WHERE cluster_id IS NOT NULL',
                refreshFrequency: 'HOURLY',
                enabled: true
            },
            {
                id: 'M009',
                code: 'alert_false_positive_rate',
                name: '预警误报率',
                category: 'alert',
                description: '被标记为误报的预警比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN is_false_positive=1 THEN 1 END) * 100.0 / COUNT(*)) FROM alerts',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M010',
                code: 'alert_trend_7d',
                name: '预警7日趋势',
                category: 'alert',
                description: '最近7天预警数量变化趋势',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM alerts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
                refreshFrequency: 'DAILY',
                enabled: true
            },

            // 线索指标 (11-20)
            {
                id: 'M011',
                code: 'clue_total_count',
                name: '线索总数',
                category: 'clue',
                description: '系统中的线索总数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM clues',
                refreshFrequency: 'REALTIME',
                enabled: true
            },
            {
                id: 'M012',
                code: 'clue_verified_count',
                name: '已核实线索数',
                category: 'clue',
                description: '已完成核实的线索数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM clues WHERE status = "VERIFIED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M013',
                code: 'clue_conversion_rate',
                name: '线索转化率',
                category: 'clue',
                description: '线索转化为案件的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN converted_to_case=1 THEN 1 END) * 100.0 / COUNT(*)) FROM clues',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M014',
                code: 'clue_high_value_count',
                name: '高价值线索数',
                category: 'clue',
                description: '被评估为高价值的线索数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM clues WHERE value_level = "HIGH"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M015',
                code: 'clue_avg_verification_time',
                name: '线索平均核实时长',
                category: 'clue',
                description: '线索从创建到核实完成的平均时长',
                unit: '天',
                dataType: 'NUMBER',
                calculation: 'SELECT AVG(DATEDIFF(verified_at, created_at)) FROM clues WHERE status = "VERIFIED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M016',
                code: 'clue_source_distribution',
                name: '线索来源分布',
                category: 'clue',
                description: '不同来源渠道的线索数量分布',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT source, COUNT(*) as count FROM clues GROUP BY source',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M017',
                code: 'clue_pending_count',
                name: '待处理线索数',
                category: 'clue',
                description: '等待处理的线索数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM clues WHERE status = "PENDING"',
                refreshFrequency: 'HOURLY',
                enabled: true
            },
            {
                id: 'M018',
                code: 'clue_category_distribution',
                name: '线索类别分布',
                category: 'clue',
                description: '不同类别线索的数量分布',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT category, COUNT(*) as count FROM clues GROUP BY category',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M019',
                code: 'clue_monthly_growth',
                name: '线索月度增长',
                category: 'clue',
                description: '本月新增线索数量',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM clues WHERE YEAR(created_at) = YEAR(NOW()) AND MONTH(created_at) = MONTH(NOW())',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M020',
                code: 'clue_quality_score',
                name: '线索质量评分',
                category: 'clue',
                description: '线索的平均质量评分',
                unit: '分',
                dataType: 'NUMBER',
                calculation: 'SELECT AVG(quality_score) FROM clues',
                refreshFrequency: 'DAILY',
                enabled: true
            },

            // 整改指标 (21-30)
            {
                id: 'M021',
                code: 'rectification_total_count',
                name: '整改任务总数',
                category: 'rectification',
                description: '系统中的整改任务总数',
                unit: '项',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM rectifications',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M022',
                code: 'rectification_completion_rate',
                name: '整改完成率',
                category: 'rectification',
                description: '已完成整改占总整改任务的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN status="COMPLETED" THEN 1 END) * 100.0 / COUNT(*)) FROM rectifications',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M023',
                code: 'rectification_on_time_rate',
                name: '整改按时完成率',
                category: 'rectification',
                description: '在截止日期前完成的整改比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN completed_at <= deadline THEN 1 END) * 100.0 / COUNT(*)) FROM rectifications WHERE status="COMPLETED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M024',
                code: 'rectification_overdue_count',
                name: '逾期整改数',
                category: 'rectification',
                description: '超过截止日期未完成的整改数量',
                unit: '项',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM rectifications WHERE status != "COMPLETED" AND deadline < NOW()',
                refreshFrequency: 'HOURLY',
                enabled: true
            },
            {
                id: 'M025',
                code: 'rectification_avg_duration',
                name: '整改平均时长',
                category: 'rectification',
                description: '整改任务的平均完成时长',
                unit: '天',
                dataType: 'NUMBER',
                calculation: 'SELECT AVG(DATEDIFF(completed_at, created_at)) FROM rectifications WHERE status = "COMPLETED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M026',
                code: 'rectification_reopen_rate',
                name: '整改重开率',
                category: 'rectification',
                description: '整改完成后被重新打开的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN reopen_count > 0 THEN 1 END) * 100.0 / COUNT(*)) FROM rectifications',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M027',
                code: 'rectification_dept_ranking',
                name: '部门整改排名',
                category: 'rectification',
                description: '各部门整改完成率排名',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT dept_id, (COUNT(CASE WHEN status="COMPLETED" THEN 1 END) * 100.0 / COUNT(*)) as rate FROM rectifications GROUP BY dept_id ORDER BY rate DESC',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M028',
                code: 'rectification_in_progress_count',
                name: '进行中整改数',
                category: 'rectification',
                description: '正在进行的整改任务数量',
                unit: '项',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM rectifications WHERE status = "IN_PROGRESS"',
                refreshFrequency: 'HOURLY',
                enabled: true
            },
            {
                id: 'M029',
                code: 'rectification_acceptance_rate',
                name: '整改验收通过率',
                category: 'rectification',
                description: '整改验收一次通过的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN acceptance_result="PASS" AND acceptance_count=1 THEN 1 END) * 100.0 / COUNT(*)) FROM rectifications WHERE status="COMPLETED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M030',
                code: 'rectification_severity_distribution',
                name: '整改严重程度分布',
                category: 'rectification',
                description: '不同严重程度整改任务的分布',
                unit: '项',
                dataType: 'NUMBER',
                calculation: 'SELECT severity, COUNT(*) as count FROM rectifications GROUP BY severity',
                refreshFrequency: 'DAILY',
                enabled: true
            },

            // 监督指标 (31-40)
            {
                id: 'M031',
                code: 'supervision_case_count',
                name: '监督案件数',
                category: 'supervision',
                description: '正在监督的案件总数',
                unit: '件',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM supervision_cases',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M032',
                code: 'supervision_coverage_rate',
                name: '监督覆盖率',
                category: 'supervision',
                description: '被监督部门占总部门的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(DISTINCT dept_id) * 100.0 / (SELECT COUNT(*) FROM departments)) FROM supervision_cases',
                refreshFrequency: 'WEEKLY',
                enabled: true
            },
            {
                id: 'M033',
                code: 'supervision_risk_discovery_rate',
                name: '风险发现率',
                category: 'supervision',
                description: '监督检查中发现风险的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN risk_found=1 THEN 1 END) * 100.0 / COUNT(*)) FROM supervision_inspections',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M034',
                code: 'supervision_inspection_count',
                name: '监督检查次数',
                category: 'supervision',
                description: '执行的监督检查总次数',
                unit: '次',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM supervision_inspections',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M035',
                code: 'supervision_avg_cycle',
                name: '监督平均周期',
                category: 'supervision',
                description: '监督案件的平均处理周期',
                unit: '天',
                dataType: 'NUMBER',
                calculation: 'SELECT AVG(DATEDIFF(closed_at, created_at)) FROM supervision_cases WHERE status = "CLOSED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M036',
                code: 'supervision_model_effectiveness',
                name: '监督模型有效性',
                category: 'supervision',
                description: '监督模型预警准确率',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN is_accurate=1 THEN 1 END) * 100.0 / COUNT(*)) FROM model_predictions',
                refreshFrequency: 'WEEKLY',
                enabled: true
            },
            {
                id: 'M037',
                code: 'supervision_dept_risk_score',
                name: '部门风险评分',
                category: 'supervision',
                description: '各部门的综合风险评分',
                unit: '分',
                dataType: 'NUMBER',
                calculation: 'SELECT dept_id, AVG(risk_score) as score FROM dept_risk_assessments GROUP BY dept_id',
                refreshFrequency: 'WEEKLY',
                enabled: true
            },
            {
                id: 'M038',
                code: 'supervision_recommendation_count',
                name: '监督建议数',
                category: 'supervision',
                description: '提出的监督建议总数',
                unit: '条',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM supervision_recommendations',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M039',
                code: 'supervision_recommendation_adoption_rate',
                name: '监督建议采纳率',
                category: 'supervision',
                description: '被采纳的监督建议比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN adopted=1 THEN 1 END) * 100.0 / COUNT(*)) FROM supervision_recommendations',
                refreshFrequency: 'WEEKLY',
                enabled: true
            },
            {
                id: 'M040',
                code: 'supervision_quarterly_report_count',
                name: '季度监督报告数',
                category: 'supervision',
                description: '本季度生成的监督报告数量',
                unit: '份',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM supervision_reports WHERE QUARTER(created_at) = QUARTER(NOW()) AND YEAR(created_at) = YEAR(NOW())',
                refreshFrequency: 'DAILY',
                enabled: true
            },

            // 财务指标 (41-45)
            {
                id: 'M041',
                code: 'finance_budget_execution_rate',
                name: '预算执行率',
                category: 'finance',
                description: '实际支出占预算的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (SUM(actual_amount) * 100.0 / SUM(budget_amount)) FROM budget_execution',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M042',
                code: 'finance_over_budget_count',
                name: '超预算项目数',
                category: 'finance',
                description: '支出超过预算的项目数量',
                unit: '项',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM budget_execution WHERE actual_amount > budget_amount',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M043',
                code: 'finance_three_public_expense',
                name: '三公经费总额',
                category: 'finance',
                description: '三公经费支出总额',
                unit: '元',
                dataType: 'CURRENCY',
                calculation: 'SELECT SUM(amount) FROM expenses WHERE category IN ("公务接待", "公务用车", "因公出国")',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M044',
                code: 'finance_invoice_verification_rate',
                name: '发票核验率',
                category: 'finance',
                description: '已核验发票占总发票的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN verified=1 THEN 1 END) * 100.0 / COUNT(*)) FROM invoices',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M045',
                code: 'finance_abnormal_transaction_count',
                name: '异常交易数',
                category: 'finance',
                description: '检测到的异常财务交易数量',
                unit: '笔',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM transactions WHERE is_abnormal = 1',
                refreshFrequency: 'HOURLY',
                enabled: true
            },

            // 采购指标 (46-50)
            {
                id: 'M046',
                code: 'procurement_total_amount',
                name: '采购总金额',
                category: 'procurement',
                description: '采购项目的总金额',
                unit: '元',
                dataType: 'CURRENCY',
                calculation: 'SELECT SUM(amount) FROM procurements',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M047',
                code: 'procurement_competitive_rate',
                name: '竞争性采购率',
                category: 'procurement',
                description: '竞争性采购占总采购的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN procurement_type="COMPETITIVE" THEN 1 END) * 100.0 / COUNT(*)) FROM procurements',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M048',
                code: 'procurement_supplier_concentration',
                name: '供应商集中度',
                category: 'procurement',
                description: '前10大供应商采购额占比',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (SUM(top10_amount) * 100.0 / SUM(total_amount)) FROM (SELECT supplier_id, SUM(amount) as top10_amount FROM procurements GROUP BY supplier_id ORDER BY top10_amount DESC LIMIT 10) t, (SELECT SUM(amount) as total_amount FROM procurements) t2',
                refreshFrequency: 'WEEKLY',
                enabled: true
            },
            {
                id: 'M049',
                code: 'procurement_split_purchase_count',
                name: '拆分采购数',
                category: 'procurement',
                description: '检测到的拆分采购数量',
                unit: '项',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM procurements WHERE is_split_purchase = 1',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M050',
                code: 'procurement_avg_cycle',
                name: '采购平均周期',
                category: 'procurement',
                description: '采购项目的平均完成周期',
                unit: '天',
                dataType: 'NUMBER',
                calculation: 'SELECT AVG(DATEDIFF(completed_at, created_at)) FROM procurements WHERE status = "COMPLETED"',
                refreshFrequency: 'DAILY',
                enabled: true
            },

            // 科研指标 (51-53)
            {
                id: 'M051',
                code: 'research_fund_total',
                name: '科研经费总额',
                category: 'research',
                description: '科研项目经费总额',
                unit: '元',
                dataType: 'CURRENCY',
                calculation: 'SELECT SUM(fund_amount) FROM research_projects',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M052',
                code: 'research_fund_usage_rate',
                name: '科研经费使用率',
                category: 'research',
                description: '科研经费实际使用占总额的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (SUM(used_amount) * 100.0 / SUM(fund_amount)) FROM research_projects',
                refreshFrequency: 'DAILY',
                enabled: true
            },
            {
                id: 'M053',
                code: 'research_irregular_usage_count',
                name: '科研经费违规使用数',
                category: 'research',
                description: '检测到的科研经费违规使用数量',
                unit: '项',
                dataType: 'NUMBER',
                calculation: 'SELECT COUNT(*) FROM research_fund_usage WHERE is_irregular = 1',
                refreshFrequency: 'DAILY',
                enabled: true
            },

            // 资产指标 (54-55)
            {
                id: 'M054',
                code: 'asset_total_value',
                name: '资产总值',
                category: 'asset',
                description: '学校资产总价值',
                unit: '元',
                dataType: 'CURRENCY',
                calculation: 'SELECT SUM(value) FROM assets',
                refreshFrequency: 'WEEKLY',
                enabled: true
            },
            {
                id: 'M055',
                code: 'asset_idle_rate',
                name: '资产闲置率',
                category: 'asset',
                description: '闲置资产占总资产的比例',
                unit: '%',
                dataType: 'PERCENTAGE',
                calculation: 'SELECT (COUNT(CASE WHEN status="IDLE" THEN 1 END) * 100.0 / COUNT(*)) FROM assets',
                refreshFrequency: 'WEEKLY',
                enabled: true
            }
        ];
    }

    /**
     * 获取所有指标
     */
    getAllMetrics() {
        return this.metrics;
    }

    /**
     * 根据ID获取指标
     */
    getMetricById(id) {
        return this.metrics.find(m => m.id === id);
    }

    /**
     * 根据代码获取指标
     */
    getMetricByCode(code) {
        return this.metrics.find(m => m.code === code);
    }

    /**
     * 根据分类获取指标
     */
    getMetricsByCategory(category) {
        return this.metrics.filter(m => m.category === category);
    }

    /**
     * 搜索指标
     */
    searchMetrics(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return this.metrics.filter(m => 
            m.name.toLowerCase().includes(lowerKeyword) ||
            m.code.toLowerCase().includes(lowerKeyword) ||
            m.description.toLowerCase().includes(lowerKeyword)
        );
    }

    /**
     * 获取所有分类
     */
    getCategories() {
        return this.categories;
    }

    /**
     * 计算指标值
     */
    async calculateMetric(metricId, params = {}) {
        const metric = this.getMetricById(metricId);
        if (!metric) {
            throw new Error(`指标不存在: ${metricId}`);
        }

        // 模拟计算指标值
        // 实际应用中应该执行SQL查询或调用API
        return {
            metricId: metric.id,
            metricCode: metric.code,
            metricName: metric.name,
            value: this.generateMockValue(metric),
            unit: metric.unit,
            dataType: metric.dataType,
            calculatedAt: new Date().toISOString(),
            params
        };
    }

    /**
     * 批量计算指标
     */
    async calculateMetrics(metricIds, params = {}) {
        const results = [];
        for (const metricId of metricIds) {
            try {
                const result = await this.calculateMetric(metricId, params);
                results.push(result);
            } catch (error) {
                console.error(`计算指标失败: ${metricId}`, error);
                results.push({
                    metricId,
                    error: error.message,
                    calculatedAt: new Date().toISOString()
                });
            }
        }
        return results;
    }

    /**
     * 生成模拟数据
     */
    generateMockValue(metric) {
        switch (metric.dataType) {
            case 'NUMBER':
                return Math.floor(Math.random() * 1000);
            case 'PERCENTAGE':
                return (Math.random() * 100).toFixed(2);
            case 'CURRENCY':
                return (Math.random() * 10000000).toFixed(2);
            default:
                return 0;
        }
    }

    /**
     * 获取指标趋势数据
     */
    async getMetricTrend(metricId, startDate, endDate, interval = 'day') {
        const metric = this.getMetricById(metricId);
        if (!metric) {
            throw new Error(`指标不存在: ${metricId}`);
        }

        // 生成模拟趋势数据
        const trendData = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const current = new Date(start);

        while (current <= end) {
            trendData.push({
                date: current.toISOString().split('T')[0],
                value: this.generateMockValue(metric)
            });

            // 根据间隔增加日期
            if (interval === 'day') {
                current.setDate(current.getDate() + 1);
            } else if (interval === 'week') {
                current.setDate(current.getDate() + 7);
            } else if (interval === 'month') {
                current.setMonth(current.getMonth() + 1);
            }
        }

        return {
            metricId: metric.id,
            metricName: metric.name,
            startDate,
            endDate,
            interval,
            data: trendData
        };
    }

    /**
     * 对比多个指标
     */
    async compareMetrics(metricIds, params = {}) {
        const results = await this.calculateMetrics(metricIds, params);
        return {
            comparedAt: new Date().toISOString(),
            metrics: results,
            params
        };
    }

    /**
     * 导出指标定义
     */
    exportMetrics(metricIds = null) {
        const metricsToExport = metricIds 
            ? this.metrics.filter(m => metricIds.includes(m.id))
            : this.metrics;

        return {
            exportedAt: new Date().toISOString(),
            count: metricsToExport.length,
            metrics: metricsToExport
        };
    }

    /**
     * 启用/禁用指标
     */
    toggleMetric(metricId, enabled) {
        const metric = this.getMetricById(metricId);
        if (metric) {
            metric.enabled = enabled;
            return true;
        }
        return false;
    }

    /**
     * 获取指标统计信息
     */
    getMetricsStatistics() {
        const stats = {
            total: this.metrics.length,
            enabled: this.metrics.filter(m => m.enabled).length,
            disabled: this.metrics.filter(m => !m.enabled).length,
            byCategory: {},
            byDataType: {},
            byRefreshFrequency: {}
        };

        // 按分类统计
        this.categories.forEach(cat => {
            stats.byCategory[cat.id] = this.metrics.filter(m => m.category === cat.id).length;
        });

        // 按数据类型统计
        this.metrics.forEach(m => {
            stats.byDataType[m.dataType] = (stats.byDataType[m.dataType] || 0) + 1;
        });

        // 按刷新频率统计
        this.metrics.forEach(m => {
            stats.byRefreshFrequency[m.refreshFrequency] = (stats.byRefreshFrequency[m.refreshFrequency] || 0) + 1;
        });

        return stats;
    }
}

// 导出服务实例
window.MetricsLibraryService = MetricsLibraryService;
