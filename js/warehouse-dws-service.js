/**
 * 数据仓库DWS层服务
 * 负责DWS汇总层的数据聚合和查询
 */

class WarehouseDWSService {
    constructor() {
        this.summaries = {
            deptBudget: [],
            deptExpense: [],
            deptProcurement: [],
            deptResearch: [],
            deptAsset: [],
            dailyExpense: [],
            monthlyBudgetExecution: [],
            quarterlyProcurement: [],
            yearlyResearch: [],
            supplierTransaction: [],
            projectExecution: [],
            personResearch: [],
            personApproval: [],
            alertSummary: [],
            clueSummary: [],
            rectificationSummary: [],
            expenseTrend: [],
            alertTrend: []
        };
        
        this.refreshLogs = [];
        this.initializeMockData();
    }

    /**
     * 从DWD层聚合数据到DWS层
     * @param {string} targetTable - 目标汇总表
     * @param {Object} aggregateConfig - 聚合配置
     * @returns {Promise<Object>} 聚合结果
     */
    async aggregateFromDWD(targetTable, aggregateConfig) {
        const startTime = new Date();
        
        try {
            const { sourceTable, groupBy, metrics, filter } = aggregateConfig;
            
            // 从DWD层查询数据
            const dwdData = await window.warehouseDWDService.queryFact(
                sourceTable.replace('fact_', ''),
                filter
            );
            
            // 执行聚合
            const aggregatedData = this.performAggregation(
                dwdData.data,
                groupBy,
                metrics
            );
            
            // 保存到DWS层
            const summaryName = this.getTableSummaryName(targetTable);
            this.summaries[summaryName] = aggregatedData;
            
            // 记录刷新日志
            const refreshLog = {
                log_id: this.generateId(),
                table_name: targetTable,
                refresh_type: 'INCREMENTAL',
                refresh_start_time: startTime,
                refresh_end_time: new Date(),
                source_record_count: dwdData.total,
                target_record_count: aggregatedData.length,
                status: 'SUCCESS',
                error_message: null,
                created_at: new Date()
            };
            
            this.refreshLogs.push(refreshLog);
            
            return refreshLog;
        } catch (error) {
            const refreshLog = {
                log_id: this.generateId(),
                table_name: targetTable,
                refresh_type: 'INCREMENTAL',
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
     * 执行数据聚合
     * @param {Array} data - 源数据
     * @param {Array} groupBy - 分组字段
     * @param {Object} metrics - 指标配置
     * @returns {Array} 聚合结果
     */
    performAggregation(data, groupBy, metrics) {
        const groups = {};
        
        // 分组
        data.forEach(record => {
            const key = groupBy.map(field => record[field]).join('_');
            
            if (!groups[key]) {
                groups[key] = {
                    groupKey: key,
                    records: [],
                    ...groupBy.reduce((acc, field) => {
                        acc[field] = record[field];
                        return acc;
                    }, {})
                };
            }
            
            groups[key].records.push(record);
        });
        
        // 计算指标
        const results = [];
        for (const key in groups) {
            const group = groups[key];
            const summary = { ...group };
            delete summary.records;
            
            // 计算各种指标
            for (const metricName in metrics) {
                const metricConfig = metrics[metricName];
                summary[metricName] = this.calculateMetric(
                    group.records,
                    metricConfig
                );
            }
            
            summary.summary_id = this.generateId();
            summary.updated_at = new Date();
            results.push(summary);
        }
        
        return results;
    }

    /**
     * 计算指标
     * @param {Array} records - 记录数组
     * @param {Object} config - 指标配置
     * @returns {number} 指标值
     */
    calculateMetric(records, config) {
        const { type, field } = config;
        
        switch (type) {
            case 'SUM':
                return records.reduce((sum, r) => sum + (parseFloat(r[field]) || 0), 0);
            
            case 'AVG':
                const sum = records.reduce((s, r) => s + (parseFloat(r[field]) || 0), 0);
                return records.length > 0 ? sum / records.length : 0;
            
            case 'COUNT':
                return records.length;
            
            case 'MAX':
                return Math.max(...records.map(r => parseFloat(r[field]) || 0));
            
            case 'MIN':
                return Math.min(...records.map(r => parseFloat(r[field]) || 0));
            
            case 'COUNT_DISTINCT':
                const uniqueValues = new Set(records.map(r => r[field]));
                return uniqueValues.size;
            
            default:
                return 0;
        }
    }

    /**
     * 查询汇总数据
     * @param {string} summaryName - 汇总表名称
     * @param {Object} filter - 过滤条件
     * @returns {Promise<Array>} 查询结果
     */
    async querySummary(summaryName, filter = {}) {
        let data = this.summaries[summaryName] || [];
        
        // 按年份过滤
        if (filter.year) {
            data = data.filter(s => s.year === filter.year);
        }
        
        // 按月份过滤
        if (filter.month) {
            data = data.filter(s => s.month === filter.month);
        }
        
        // 按季度过滤
        if (filter.quarter) {
            data = data.filter(s => s.quarter === filter.quarter);
        }
        
        // 按部门过滤
        if (filter.departmentId) {
            data = data.filter(s => s.department_id === filter.departmentId);
        }
        
        // 排序
        if (filter.orderBy) {
            const { field, direction = 'DESC' } = filter.orderBy;
            data.sort((a, b) => {
                const aVal = a[field];
                const bVal = b[field];
                return direction === 'DESC' ? bVal - aVal : aVal - bVal;
            });
        }
        
        return data;
    }

    /**
     * 计算趋势
     * @param {string} summaryName - 汇总表名称
     * @param {string} metricField - 指标字段
     * @param {Object} config - 配置
     * @returns {Promise<Array>} 趋势数据
     */
    async calculateTrend(summaryName, metricField, config = {}) {
        const { departmentId, startYear, startMonth, endYear, endMonth } = config;
        
        let data = this.summaries[summaryName] || [];
        
        // 过滤数据
        if (departmentId) {
            data = data.filter(s => s.department_id === departmentId);
        }
        
        // 按时间排序
        data.sort((a, b) => {
            const aTime = a.year * 100 + (a.month || a.quarter || 0);
            const bTime = b.year * 100 + (b.month || b.quarter || 0);
            return aTime - bTime;
        });
        
        // 计算趋势指标
        const trends = [];
        for (let i = 0; i < data.length; i++) {
            const current = data[i];
            const last = i > 0 ? data[i - 1] : null;
            const sameLastYear = data.find(d => 
                d.year === current.year - 1 && 
                d.month === current.month &&
                d.department_id === current.department_id
            );
            
            const currentValue = parseFloat(current[metricField]) || 0;
            const lastValue = last ? (parseFloat(last[metricField]) || 0) : 0;
            const lastYearValue = sameLastYear ? (parseFloat(sameLastYear[metricField]) || 0) : 0;
            
            // 环比增长率
            const momGrowthRate = lastValue > 0 
                ? ((currentValue - lastValue) / lastValue * 100).toFixed(2)
                : 0;
            
            // 同比增长率
            const yoyGrowthRate = lastYearValue > 0
                ? ((currentValue - lastYearValue) / lastYearValue * 100).toFixed(2)
                : 0;
            
            // 移动平均
            const movingAvg3 = this.calculateMovingAverage(data, i, metricField, 3);
            const movingAvg6 = this.calculateMovingAverage(data, i, metricField, 6);
            
            // 趋势方向
            let trendDirection = 'STABLE';
            if (Math.abs(momGrowthRate) > 10) {
                trendDirection = momGrowthRate > 0 ? 'UP' : 'DOWN';
            }
            
            trends.push({
                trend_id: this.generateId(),
                department_id: current.department_id,
                year: current.year,
                month: current.month,
                current_value: currentValue,
                last_value: lastValue,
                last_year_value: lastYearValue,
                mom_growth_rate: parseFloat(momGrowthRate),
                yoy_growth_rate: parseFloat(yoyGrowthRate),
                moving_avg_3month: movingAvg3,
                moving_avg_6month: movingAvg6,
                trend_direction: trendDirection,
                updated_at: new Date()
            });
        }
        
        return trends;
    }

    /**
     * 计算移动平均
     * @param {Array} data - 数据数组
     * @param {number} currentIndex - 当前索引
     * @param {string} field - 字段名
     * @param {number} window - 窗口大小
     * @returns {number} 移动平均值
     */
    calculateMovingAverage(data, currentIndex, field, window) {
        const start = Math.max(0, currentIndex - window + 1);
        const end = currentIndex + 1;
        const slice = data.slice(start, end);
        
        const sum = slice.reduce((s, d) => s + (parseFloat(d[field]) || 0), 0);
        return slice.length > 0 ? (sum / slice.length).toFixed(2) : 0;
    }

    /**
     * 刷新所有汇总表
     * @returns {Promise<Array>} 刷新结果
     */
    async refreshAllSummaries() {
        const results = [];
        
        // 部门支出汇总
        results.push(await this.refreshDeptExpenseSummary());
        
        // 部门采购汇总
        results.push(await this.refreshDeptProcurementSummary());
        
        // 月度预算执行汇总
        results.push(await this.refreshMonthlyBudgetExecution());
        
        return results;
    }

    /**
     * 刷新部门支出汇总
     * @returns {Promise<Object>} 刷新结果
     */
    async refreshDeptExpenseSummary() {
        return await this.aggregateFromDWD('dws_dept_expense_summary', {
            sourceTable: 'fact_expense',
            groupBy: ['department_id', 'year', 'month'],
            metrics: {
                total_expense: { type: 'SUM', field: 'amount' },
                expense_count: { type: 'COUNT' },
                avg_expense: { type: 'AVG', field: 'amount' },
                max_expense: { type: 'MAX', field: 'amount' },
                supplier_count: { type: 'COUNT_DISTINCT', field: 'supplier_id' }
            },
            filter: {}
        });
    }

    /**
     * 刷新部门采购汇总
     * @returns {Promise<Object>} 刷新结果
     */
    async refreshDeptProcurementSummary() {
        return await this.aggregateFromDWD('dws_dept_procurement_summary', {
            sourceTable: 'fact_procurement',
            groupBy: ['department_id', 'year', 'quarter'],
            metrics: {
                total_procurement_amount: { type: 'SUM', field: 'budget_amount' },
                total_contract_amount: { type: 'SUM', field: 'contract_amount' },
                total_actual_amount: { type: 'SUM', field: 'actual_amount' },
                total_savings_amount: { type: 'SUM', field: 'savings_amount' },
                project_count: { type: 'COUNT' },
                supplier_count: { type: 'COUNT_DISTINCT', field: 'supplier_id' }
            },
            filter: {}
        });
    }

    /**
     * 刷新月度预算执行汇总
     * @returns {Promise<Object>} 刷新结果
     */
    async refreshMonthlyBudgetExecution() {
        // 这里需要联合预算和支出数据
        // 简化实现,实际应该从DWD层查询并计算
        const startTime = new Date();
        
        const refreshLog = {
            log_id: this.generateId(),
            table_name: 'dws_monthly_budget_execution',
            refresh_type: 'FULL',
            refresh_start_time: startTime,
            refresh_end_time: new Date(),
            source_record_count: 0,
            target_record_count: 0,
            status: 'SUCCESS',
            error_message: null,
            created_at: new Date()
        };
        
        this.refreshLogs.push(refreshLog);
        return refreshLog;
    }

    /**
     * 获取刷新日志
     * @param {Object} filter - 过滤条件
     * @returns {Promise<Array>} 刷新日志
     */
    async getRefreshLogs(filter = {}) {
        let logs = [...this.refreshLogs];
        
        if (filter.tableName) {
            logs = logs.filter(log => log.table_name === filter.tableName);
        }
        
        if (filter.status) {
            logs = logs.filter(log => log.status === filter.status);
        }
        
        // 按时间倒序
        logs.sort((a, b) => new Date(b.refresh_start_time) - new Date(a.refresh_start_time));
        
        return logs;
    }

    /**
     * 获取表的汇总名称
     * @param {string} tableName - 表名
     * @returns {string} 汇总名称
     */
    getTableSummaryName(tableName) {
        const nameMap = {
            'dws_dept_budget_summary': 'deptBudget',
            'dws_dept_expense_summary': 'deptExpense',
            'dws_dept_procurement_summary': 'deptProcurement',
            'dws_dept_research_summary': 'deptResearch',
            'dws_dept_asset_summary': 'deptAsset',
            'dws_daily_expense_summary': 'dailyExpense',
            'dws_monthly_budget_execution': 'monthlyBudgetExecution',
            'dws_quarterly_procurement_summary': 'quarterlyProcurement',
            'dws_yearly_research_summary': 'yearlyResearch'
        };
        
        return nameMap[tableName] || tableName;
    }

    /**
     * 生成唯一ID
     * @returns {string} UUID
     */
    generateId() {
        return 'dws_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 初始化模拟数据
     */
    initializeMockData() {
        // 部门支出汇总
        this.summaries.deptExpense = [
            {
                summary_id: 'SUM_EXP001',
                department_id: 'DEPT001',
                year: 2024,
                month: 3,
                total_expense: 120000,
                normal_expense: 120000,
                three_public_expense: 0,
                research_expense: 0,
                expense_count: 1,
                avg_expense: 120000,
                max_expense: 120000,
                supplier_count: 1,
                invoice_count: 1,
                updated_at: new Date()
            },
            {
                summary_id: 'SUM_EXP002',
                department_id: 'DEPT001',
                year: 2024,
                month: 2,
                total_expense: 80000,
                normal_expense: 80000,
                three_public_expense: 0,
                research_expense: 0,
                expense_count: 2,
                avg_expense: 40000,
                max_expense: 50000,
                supplier_count: 2,
                invoice_count: 2,
                updated_at: new Date()
            }
        ];

        // 部门采购汇总
        this.summaries.deptProcurement = [
            {
                summary_id: 'SUM_PROC001',
                department_id: 'DEPT001',
                year: 2024,
                quarter: 1,
                total_procurement_amount: 500000,
                total_contract_amount: 450000,
                total_actual_amount: 450000,
                total_savings_amount: 50000,
                avg_savings_rate: 10.0,
                project_count: 1,
                public_bidding_count: 1,
                invitation_bidding_count: 0,
                inquiry_count: 0,
                single_source_count: 0,
                supplier_count: 1,
                high_risk_count: 0,
                updated_at: new Date()
            }
        ];

        // 月度预算执行
        this.summaries.monthlyBudgetExecution = [
            {
                summary_id: 'SUM_BUD001',
                year: 2024,
                month: 3,
                total_budget: 2000000,
                total_expense: 500000,
                total_remaining: 1500000,
                execution_rate: 25.0,
                department_count: 10,
                over_budget_dept_count: 0,
                under_execution_dept_count: 3,
                updated_at: new Date()
            }
        ];

        // 支出趋势
        this.summaries.expenseTrend = [
            {
                trend_id: 'TREND001',
                department_id: 'DEPT001',
                year: 2024,
                month: 3,
                current_month_expense: 120000,
                last_month_expense: 80000,
                same_month_last_year_expense: 100000,
                mom_growth_rate: 50.0,
                yoy_growth_rate: 20.0,
                moving_avg_3month: 100000,
                moving_avg_6month: 95000,
                trend_direction: 'UP',
                updated_at: new Date()
            }
        ];
    }
}

// 创建全局实例
window.warehouseDWSService = new WarehouseDWSService();
