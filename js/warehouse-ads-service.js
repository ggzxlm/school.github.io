/**
 * 数据仓库ADS层服务
 * 负责ADS应用层的指标计算和报表生成
 */

class WarehouseADSService {
    constructor() {
        this.metrics = {
            supervision: [],
            budgetExecution: [],
            procurement: [],
            research: [],
            asset: []
        };
        
        this.reports = {
            deptDashboard: [],
            budgetExecution: [],
            procurementAnalysis: [],
            researchMonitoring: [],
            supplierEvaluation: [],
            approvalEfficiency: []
        };
        
        this.cockpit = [];
        this.rankings = [];
        this.forecasts = {
            budget: [],
            risk: []
        };
        
        this.refreshLogs = [];
        this.initializeMockData();
    }

    /**
     * 从DWS层生成ADS指标
     * @param {string} metricType - 指标类型
     * @param {Object} config - 配置
     * @returns {Promise<Object>} 生成结果
     */
    async generateMetrics(metricType, config = {}) {
        const startTime = new Date();
        
        try {
            let metrics = [];
            
            switch (metricType) {
                case 'supervision':
                    metrics = await this.generateSupervisionMetrics(config);
                    break;
                case 'budgetExecution':
                    metrics = await this.generateBudgetExecutionMetrics(config);
                    break;
                case 'procurement':
                    metrics = await this.generateProcurementMetrics(config);
                    break;
                case 'research':
                    metrics = await this.generateResearchMetrics(config);
                    break;
                case 'asset':
                    metrics = await this.generateAssetMetrics(config);
                    break;
                default:
                    throw new Error(`Unknown metric type: ${metricType}`);
            }
            
            this.metrics[metricType] = metrics;
            
            const refreshLog = {
                log_id: this.generateId(),
                table_name: `ads_${metricType}_metrics`,
                refresh_type: 'FULL',
                refresh_start_time: startTime,
                refresh_end_time: new Date(),
                source_record_count: 0,
                target_record_count: metrics.length,
                status: 'SUCCESS',
                error_message: null,
                created_at: new Date()
            };
            
            this.refreshLogs.push(refreshLog);
            return refreshLog;
        } catch (error) {
            const refreshLog = {
                log_id: this.generateId(),
                table_name: `ads_${metricType}_metrics`,
                refresh_type: 'FULL',
                refresh_start_time: startTime,
                refresh_end_time: new Date(),
                source_record_count: 0,
                target_record_count: 0,
                status: 'FAILED',
                error_message: error.message,
                created_at: new Date()
            };
            
            this.refreshLogs.push(refreshLog);
            throw error;
        }
    }

    /**
     * 生成监督指标
     * @param {Object} config - 配置
     * @returns {Promise<Array>} 指标数据
     */
    async generateSupervisionMetrics(config) {
        const metrics = [];
        const metricDate = config.metricDate || new Date();
        
        // 从DWS层获取预警汇总数据
        const alertSummary = await window.warehouseDWSService.querySummary('alertSummary', {
            year: metricDate.getFullYear(),
            month: metricDate.getMonth() + 1
        });
        
        // 从DWS层获取线索汇总数据
        const clueSummary = await window.warehouseDWSService.querySummary('clueSummary', {
            year: metricDate.getFullYear(),
            month: metricDate.getMonth() + 1
        });
        
        // 从DWS层获取整改汇总数据
        const rectificationSummary = await window.warehouseDWSService.querySummary('rectificationSummary', {
            year: metricDate.getFullYear(),
            month: metricDate.getMonth() + 1
        });
        
        // 按部门聚合生成指标
        const deptMap = {};
        
        alertSummary.forEach(alert => {
            if (!deptMap[alert.department_id]) {
                deptMap[alert.department_id] = {
                    metric_id: this.generateId(),
                    metric_date: metricDate,
                    department_id: alert.department_id,
                    total_alert_count: 0,
                    high_alert_count: 0,
                    medium_alert_count: 0,
                    low_alert_count: 0,
                    alert_resolution_rate: 0,
                    total_clue_count: 0,
                    clue_completion_rate: 0,
                    total_rectification_count: 0,
                    rectification_completion_rate: 0,
                    rectification_on_time_rate: 0,
                    high_risk_project_count: 0,
                    high_risk_supplier_count: 0,
                    risk_score: 0,
                    compliance_rate: 0,
                    violation_count: 0
                };
            }
            
            deptMap[alert.department_id].total_alert_count += alert.total_alert_count || 0;
            deptMap[alert.department_id].high_alert_count += alert.high_level_count || 0;
            deptMap[alert.department_id].medium_alert_count += alert.medium_level_count || 0;
            deptMap[alert.department_id].low_alert_count += alert.low_level_count || 0;
            deptMap[alert.department_id].alert_resolution_rate = alert.resolution_rate || 0;
        });
        
        clueSummary.forEach(clue => {
            if (deptMap[clue.department_id]) {
                deptMap[clue.department_id].total_clue_count += clue.total_clue_count || 0;
                deptMap[clue.department_id].clue_completion_rate = clue.completion_rate || 0;
            }
        });
        
        rectificationSummary.forEach(rect => {
            if (deptMap[rect.department_id]) {
                deptMap[rect.department_id].total_rectification_count += rect.total_rectification_count || 0;
                deptMap[rect.department_id].rectification_completion_rate = rect.completion_rate || 0;
                deptMap[rect.department_id].rectification_on_time_rate = rect.on_time_rate || 0;
            }
        });
        
        // 计算风险评分和合规率
        for (const deptId in deptMap) {
            const metric = deptMap[deptId];
            
            // 风险评分 = 高级预警数 * 10 + 中级预警数 * 5 + 低级预警数 * 1
            metric.risk_score = (
                metric.high_alert_count * 10 +
                metric.medium_alert_count * 5 +
                metric.low_alert_count * 1
            ) / 10;
            
            // 合规率 = (1 - 违规数 / 总业务数) * 100
            metric.compliance_rate = 95.0; // 简化计算
            metric.violation_count = metric.total_alert_count;
            
            metrics.push(metric);
        }
        
        return metrics;
    }

    /**
     * 生成预算执行指标
     * @param {Object} config - 配置
     * @returns {Promise<Array>} 指标数据
     */
    async generateBudgetExecutionMetrics(config) {
        const metrics = [];
        const metricDate = config.metricDate || new Date();
        const budgetYear = config.budgetYear || metricDate.getFullYear();
        
        // 从DWS层获取部门预算汇总
        const budgetSummary = await window.warehouseDWSService.querySummary('deptBudget', {
            year: budgetYear
        });
        
        // 从DWS层获取部门支出汇总
        const expenseSummary = await window.warehouseDWSService.querySummary('deptExpense', {
            year: budgetYear
        });
        
        // 按部门聚合
        const deptMap = {};
        
        budgetSummary.forEach(budget => {
            if (!deptMap[budget.department_id]) {
                deptMap[budget.department_id] = {
                    metric_id: this.generateId(),
                    metric_date: metricDate,
                    department_id: budget.department_id,
                    budget_year: budgetYear,
                    total_budget: 0,
                    total_expense: 0,
                    total_remaining: 0,
                    execution_rate: 0,
                    over_budget_amount: 0,
                    over_budget_item_count: 0,
                    expected_execution_rate: 0,
                    execution_deviation: 0,
                    three_public_budget: 0,
                    three_public_expense: 0,
                    three_public_execution_rate: 0
                };
            }
            
            deptMap[budget.department_id].total_budget += budget.total_approved_amount || 0;
        });
        
        expenseSummary.forEach(expense => {
            if (deptMap[expense.department_id]) {
                deptMap[expense.department_id].total_expense += expense.total_expense || 0;
                deptMap[expense.department_id].three_public_expense += expense.three_public_expense || 0;
            }
        });
        
        // 计算执行率和偏差
        for (const deptId in deptMap) {
            const metric = deptMap[deptId];
            
            metric.total_remaining = metric.total_budget - metric.total_expense;
            metric.execution_rate = metric.total_budget > 0
                ? (metric.total_expense / metric.total_budget * 100).toFixed(2)
                : 0;
            
            // 期望执行率 = 当前月份 / 12 * 100
            const currentMonth = metricDate.getMonth() + 1;
            metric.expected_execution_rate = (currentMonth / 12 * 100).toFixed(2);
            
            // 执行偏差 = 实际执行率 - 期望执行率
            metric.execution_deviation = (metric.execution_rate - metric.expected_execution_rate).toFixed(2);
            
            // 超预算判断
            if (metric.total_expense > metric.total_budget) {
                metric.over_budget_amount = metric.total_expense - metric.total_budget;
                metric.over_budget_item_count = 1;
            }
            
            metrics.push(metric);
        }
        
        return metrics;
    }

    /**
     * 生成采购指标
     * @param {Object} config - 配置
     * @returns {Promise<Array>} 指标数据
     */
    async generateProcurementMetrics(config) {
        const metrics = [];
        const metricDate = config.metricDate || new Date();
        
        // 从DWS层获取部门采购汇总
        const procurementSummary = await window.warehouseDWSService.querySummary('deptProcurement', {
            year: metricDate.getFullYear(),
            quarter: Math.floor(metricDate.getMonth() / 3) + 1
        });
        
        procurementSummary.forEach(proc => {
            const metric = {
                metric_id: this.generateId(),
                metric_date: metricDate,
                department_id: proc.department_id,
                total_procurement_amount: proc.total_procurement_amount || 0,
                total_contract_amount: proc.total_contract_amount || 0,
                project_count: proc.project_count || 0,
                public_bidding_count: proc.public_bidding_count || 0,
                public_bidding_rate: proc.project_count > 0
                    ? ((proc.public_bidding_count / proc.project_count) * 100).toFixed(2)
                    : 0,
                single_source_count: proc.single_source_count || 0,
                single_source_rate: proc.project_count > 0
                    ? ((proc.single_source_count / proc.project_count) * 100).toFixed(2)
                    : 0,
                total_savings_amount: proc.total_savings_amount || 0,
                avg_savings_rate: proc.avg_savings_rate || 0,
                compliance_rate: 95.0,
                violation_count: 0,
                high_risk_count: proc.high_risk_count || 0,
                split_procurement_count: 0,
                related_party_count: 0
            };
            
            metrics.push(metric);
        });
        
        return metrics;
    }

    /**
     * 生成科研指标
     * @param {Object} config - 配置
     * @returns {Promise<Array>} 指标数据
     */
    async generateResearchMetrics(config) {
        const metrics = [];
        const metricDate = config.metricDate || new Date();
        
        // 从DWS层获取部门科研汇总
        const researchSummary = await window.warehouseDWSService.querySummary('deptResearch', {
            year: metricDate.getFullYear(),
            quarter: Math.floor(metricDate.getMonth() / 3) + 1
        });
        
        researchSummary.forEach(research => {
            const metric = {
                metric_id: this.generateId(),
                metric_date: metricDate,
                department_id: research.department_id,
                total_funding: research.total_funding || 0,
                total_spent: research.total_spent || 0,
                project_count: research.project_count || 0,
                national_project_count: research.national_project_count || 0,
                provincial_project_count: research.provincial_project_count || 0,
                horizontal_project_count: research.horizontal_project_count || 0,
                avg_spending_rate: research.avg_spending_rate || 0,
                overbudget_count: research.overbudget_count || 0,
                delayed_count: research.delayed_count || 0,
                compliance_rate: 95.0,
                violation_count: 0,
                high_risk_count: research.high_risk_count || 0,
                misuse_count: 0
            };
            
            metrics.push(metric);
        });
        
        return metrics;
    }

    /**
     * 生成资产指标
     * @param {Object} config - 配置
     * @returns {Promise<Array>} 指标数据
     */
    async generateAssetMetrics(config) {
        const metrics = [];
        const metricDate = config.metricDate || new Date();
        
        // 从DWS层获取部门资产汇总
        const assetSummary = await window.warehouseDWSService.querySummary('deptAsset', {
            year: metricDate.getFullYear(),
            month: metricDate.getMonth() + 1
        });
        
        assetSummary.forEach(asset => {
            const metric = {
                metric_id: this.generateId(),
                metric_date: metricDate,
                department_id: asset.department_id,
                total_asset_value: asset.total_asset_value || 0,
                total_net_value: asset.total_net_value || 0,
                asset_count: asset.asset_count || 0,
                in_use_count: asset.in_use_count || 0,
                idle_count: asset.idle_count || 0,
                idle_rate: asset.asset_count > 0
                    ? ((asset.idle_count / asset.asset_count) * 100).toFixed(2)
                    : 0,
                avg_utilization_rate: asset.avg_utilization_rate || 0,
                low_utilization_count: 0,
                new_asset_count: asset.new_asset_count || 0,
                disposed_asset_count: asset.disposed_asset_count || 0,
                transfer_count: 0,
                missing_count: 0,
                unauthorized_disposal_count: 0
            };
            
            metrics.push(metric);
        });
        
        return metrics;
    }

    /**
     * 生成领导驾驶舱数据
     * @param {Date} reportDate - 报告日期
     * @returns {Promise<Object>} 驾驶舱数据
     */
    async generateLeadershipCockpit(reportDate = new Date()) {
        const cockpit = {
            cockpit_id: this.generateId(),
            report_date: reportDate,
            total_alert_count: 0,
            high_alert_count: 0,
            alert_resolution_rate: 0,
            total_clue_count: 0,
            clue_completion_rate: 0,
            total_budget: 0,
            total_expense: 0,
            budget_execution_rate: 0,
            over_budget_dept_count: 0,
            total_procurement_amount: 0,
            procurement_compliance_rate: 95.0,
            procurement_savings_rate: 10.0,
            total_research_funding: 0,
            research_project_count: 0,
            research_compliance_rate: 95.0,
            total_asset_value: 0,
            asset_utilization_rate: 85.0,
            high_risk_dept_count: 0,
            high_risk_project_count: 0,
            high_risk_supplier_count: 0,
            overall_risk_level: 'MEDIUM',
            alert_mom_growth: 0,
            expense_mom_growth: 0,
            updated_at: new Date()
        };
        
        // 聚合各类指标
        const supervisionMetrics = this.metrics.supervision || [];
        const budgetMetrics = this.metrics.budgetExecution || [];
        const procurementMetrics = this.metrics.procurement || [];
        const researchMetrics = this.metrics.research || [];
        const assetMetrics = this.metrics.asset || [];
        
        supervisionMetrics.forEach(m => {
            cockpit.total_alert_count += m.total_alert_count || 0;
            cockpit.high_alert_count += m.high_alert_count || 0;
            cockpit.total_clue_count += m.total_clue_count || 0;
        });
        
        budgetMetrics.forEach(m => {
            cockpit.total_budget += m.total_budget || 0;
            cockpit.total_expense += m.total_expense || 0;
            if (m.total_expense > m.total_budget) {
                cockpit.over_budget_dept_count++;
            }
        });
        
        procurementMetrics.forEach(m => {
            cockpit.total_procurement_amount += m.total_procurement_amount || 0;
        });
        
        researchMetrics.forEach(m => {
            cockpit.total_research_funding += m.total_funding || 0;
            cockpit.research_project_count += m.project_count || 0;
        });
        
        assetMetrics.forEach(m => {
            cockpit.total_asset_value += m.total_asset_value || 0;
        });
        
        // 计算率
        if (cockpit.total_budget > 0) {
            cockpit.budget_execution_rate = (cockpit.total_expense / cockpit.total_budget * 100).toFixed(2);
        }
        
        this.cockpit.push(cockpit);
        return cockpit;
    }

    /**
     * 查询指标数据
     * @param {string} metricType - 指标类型
     * @param {Object} filter - 过滤条件
     * @returns {Promise<Array>} 指标数据
     */
    async queryMetrics(metricType, filter = {}) {
        let data = this.metrics[metricType] || [];
        
        if (filter.departmentId) {
            data = data.filter(m => m.department_id === filter.departmentId);
        }
        
        if (filter.metricDate) {
            const filterDate = new Date(filter.metricDate).toDateString();
            data = data.filter(m => new Date(m.metric_date).toDateString() === filterDate);
        }
        
        return data;
    }

    /**
     * 查询驾驶舱数据
     * @param {Date} reportDate - 报告日期
     * @returns {Promise<Object>} 驾驶舱数据
     */
    async queryCockpit(reportDate) {
        if (reportDate) {
            const filterDate = new Date(reportDate).toDateString();
            return this.cockpit.find(c => new Date(c.report_date).toDateString() === filterDate);
        }
        
        // 返回最新的
        return this.cockpit.length > 0 ? this.cockpit[this.cockpit.length - 1] : null;
    }

    /**
     * 生成唯一ID
     * @returns {string} UUID
     */
    generateId() {
        return 'ads_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 初始化模拟数据
     */
    initializeMockData() {
        const today = new Date();
        
        // 监督指标
        this.metrics.supervision = [
            {
                metric_id: 'METRIC_SUP001',
                metric_date: today,
                department_id: 'DEPT001',
                department_name: '计算机学院',
                total_alert_count: 15,
                high_alert_count: 3,
                medium_alert_count: 7,
                low_alert_count: 5,
                alert_resolution_rate: 80.0,
                total_clue_count: 5,
                clue_completion_rate: 60.0,
                total_rectification_count: 8,
                rectification_completion_rate: 75.0,
                rectification_on_time_rate: 87.5,
                high_risk_project_count: 2,
                high_risk_supplier_count: 1,
                risk_score: 6.5,
                compliance_rate: 92.0,
                violation_count: 15
            }
        ];

        // 预算执行指标
        this.metrics.budgetExecution = [
            {
                metric_id: 'METRIC_BUD001',
                metric_date: today,
                department_id: 'DEPT001',
                department_name: '计算机学院',
                budget_year: 2024,
                total_budget: 2000000,
                total_expense: 500000,
                total_remaining: 1500000,
                execution_rate: 25.0,
                over_budget_amount: 0,
                over_budget_item_count: 0,
                expected_execution_rate: 25.0,
                execution_deviation: 0,
                three_public_budget: 100000,
                three_public_expense: 20000,
                three_public_execution_rate: 20.0
            }
        ];

        // 领导驾驶舱
        this.cockpit = [
            {
                cockpit_id: 'COCKPIT001',
                report_date: today,
                total_alert_count: 45,
                high_alert_count: 10,
                alert_resolution_rate: 78.0,
                total_clue_count: 15,
                clue_completion_rate: 65.0,
                total_budget: 50000000,
                total_expense: 12500000,
                budget_execution_rate: 25.0,
                over_budget_dept_count: 2,
                total_procurement_amount: 8000000,
                procurement_compliance_rate: 95.0,
                procurement_savings_rate: 10.5,
                total_research_funding: 15000000,
                research_project_count: 120,
                research_compliance_rate: 93.0,
                total_asset_value: 200000000,
                asset_utilization_rate: 85.0,
                high_risk_dept_count: 3,
                high_risk_project_count: 8,
                high_risk_supplier_count: 5,
                overall_risk_level: 'MEDIUM',
                alert_mom_growth: 15.0,
                expense_mom_growth: 8.5,
                updated_at: new Date()
            }
        ];
    }
}

// 创建全局实例
window.warehouseADSService = new WarehouseADSService();
