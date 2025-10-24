/**
 * 报表设计器服务
 * 提供拖拽式报表设计、维度指标选择、筛选条件配置等功能
 */

class ReportDesignerService {
    constructor() {
        this.reports = [];
        this.dimensions = this.initializeDimensions();
        this.filters = [];
        this.currentReport = null;
    }

    /**
     * 初始化维度定义
     */
    initializeDimensions() {
        return [
            // 时间维度
            { id: 'dim_date', name: '日期', type: 'DATE', category: 'time', format: 'YYYY-MM-DD' },
            { id: 'dim_week', name: '周', type: 'DATE', category: 'time', format: 'YYYY-WW' },
            { id: 'dim_month', name: '月份', type: 'DATE', category: 'time', format: 'YYYY-MM' },
            { id: 'dim_quarter', name: '季度', type: 'DATE', category: 'time', format: 'YYYY-Q' },
            { id: 'dim_year', name: '年份', type: 'DATE', category: 'time', format: 'YYYY' },
            
            // 组织维度
            { id: 'dim_dept', name: '部门', type: 'STRING', category: 'organization' },
            { id: 'dim_college', name: '学院', type: 'STRING', category: 'organization' },
            { id: 'dim_campus', name: '校区', type: 'STRING', category: 'organization' },
            
            // 业务维度
            { id: 'dim_alert_level', name: '预警等级', type: 'ENUM', category: 'business', values: ['高', '中', '低'] },
            { id: 'dim_alert_category', name: '预警类别', type: 'STRING', category: 'business' },
            { id: 'dim_clue_source', name: '线索来源', type: 'STRING', category: 'business' },
            { id: 'dim_clue_category', name: '线索类别', type: 'STRING', category: 'business' },
            { id: 'dim_rectification_status', name: '整改状态', type: 'ENUM', category: 'business', values: ['待处理', '进行中', '已完成', '已逾期'] },
            { id: 'dim_supervision_type', name: '监督类型', type: 'STRING', category: 'business' },
            { id: 'dim_procurement_type', name: '采购类型', type: 'ENUM', category: 'business', values: ['公开招标', '竞争性谈判', '单一来源', '询价'] },
            
            // 人员维度
            { id: 'dim_responsible_person', name: '责任人', type: 'STRING', category: 'person' },
            { id: 'dim_handler', name: '处理人', type: 'STRING', category: 'person' },
            { id: 'dim_creator', name: '创建人', type: 'STRING', category: 'person' }
        ];
    }

    /**
     * 创建新报表
     */
    createReport(config) {
        const report = {
            id: this.generateId(),
            name: config.name || '未命名报表',
            description: config.description || '',
            reportType: config.reportType || 'TABLE', // TABLE, CHART, DASHBOARD
            dimensions: config.dimensions || [],
            metrics: config.metrics || [],
            filters: config.filters || [],
            chartType: config.chartType || null,
            layout: config.layout || this.getDefaultLayout(config.reportType),
            owner: config.owner || 'current_user',
            isPublic: config.isPublic || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'DRAFT'
        };

        this.reports.push(report);
        this.currentReport = report;
        return report;
    }

    /**
     * 更新报表配置
     */
    updateReport(reportId, updates) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        Object.assign(report, updates, {
            updatedAt: new Date().toISOString()
        });

        return report;
    }

    /**
     * 删除报表
     */
    deleteReport(reportId) {
        const index = this.reports.findIndex(r => r.id === reportId);
        if (index !== -1) {
            this.reports.splice(index, 1);
            if (this.currentReport && this.currentReport.id === reportId) {
                this.currentReport = null;
            }
            return true;
        }
        return false;
    }

    /**
     * 获取报表
     */
    getReportById(reportId) {
        return this.reports.find(r => r.id === reportId);
    }

    /**
     * 获取所有报表
     */
    getAllReports(filter = {}) {
        let filtered = [...this.reports];

        if (filter.owner) {
            filtered = filtered.filter(r => r.owner === filter.owner);
        }

        if (filter.isPublic !== undefined) {
            filtered = filtered.filter(r => r.isPublic === filter.isPublic);
        }

        if (filter.reportType) {
            filtered = filtered.filter(r => r.reportType === filter.reportType);
        }

        if (filter.status) {
            filtered = filtered.filter(r => r.status === filter.status);
        }

        return filtered;
    }

    /**
     * 添加维度到报表
     */
    addDimension(reportId, dimensionId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const dimension = this.dimensions.find(d => d.id === dimensionId);
        if (!dimension) {
            throw new Error(`维度不存在: ${dimensionId}`);
        }

        if (!report.dimensions.includes(dimensionId)) {
            report.dimensions.push(dimensionId);
            report.updatedAt = new Date().toISOString();
        }

        return report;
    }

    /**
     * 移除维度
     */
    removeDimension(reportId, dimensionId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const index = report.dimensions.indexOf(dimensionId);
        if (index !== -1) {
            report.dimensions.splice(index, 1);
            report.updatedAt = new Date().toISOString();
        }

        return report;
    }

    /**
     * 添加指标到报表
     */
    addMetric(reportId, metricId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        if (!report.metrics.includes(metricId)) {
            report.metrics.push(metricId);
            report.updatedAt = new Date().toISOString();
        }

        return report;
    }

    /**
     * 移除指标
     */
    removeMetric(reportId, metricId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const index = report.metrics.indexOf(metricId);
        if (index !== -1) {
            report.metrics.splice(index, 1);
            report.updatedAt = new Date().toISOString();
        }

        return report;
    }

    /**
     * 添加筛选条件
     */
    addFilter(reportId, filter) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const filterConfig = {
            id: this.generateId(),
            field: filter.field,
            operator: filter.operator, // =, !=, >, <, >=, <=, IN, BETWEEN, LIKE
            value: filter.value,
            dataType: filter.dataType || 'STRING'
        };

        report.filters.push(filterConfig);
        report.updatedAt = new Date().toISOString();

        return report;
    }

    /**
     * 移除筛选条件
     */
    removeFilter(reportId, filterId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const index = report.filters.findIndex(f => f.id === filterId);
        if (index !== -1) {
            report.filters.splice(index, 1);
            report.updatedAt = new Date().toISOString();
        }

        return report;
    }

    /**
     * 更新筛选条件
     */
    updateFilter(reportId, filterId, updates) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const filter = report.filters.find(f => f.id === filterId);
        if (filter) {
            Object.assign(filter, updates);
            report.updatedAt = new Date().toISOString();
        }

        return report;
    }

    /**
     * 设置报表布局
     */
    setLayout(reportId, layout) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        report.layout = layout;
        report.updatedAt = new Date().toISOString();

        return report;
    }

    /**
     * 获取默认布局
     */
    getDefaultLayout(reportType) {
        switch (reportType) {
            case 'TABLE':
                return {
                    type: 'table',
                    showHeader: true,
                    showFooter: true,
                    pageSize: 20,
                    bordered: true,
                    striped: true
                };
            case 'CHART':
                return {
                    type: 'chart',
                    width: '100%',
                    height: 400,
                    showLegend: true,
                    showTooltip: true,
                    showDataLabels: false
                };
            case 'DASHBOARD':
                return {
                    type: 'dashboard',
                    columns: 2,
                    gap: 16,
                    widgets: []
                };
            default:
                return {};
        }
    }

    /**
     * 获取所有维度
     */
    getAllDimensions() {
        return this.dimensions;
    }

    /**
     * 根据分类获取维度
     */
    getDimensionsByCategory(category) {
        return this.dimensions.filter(d => d.category === category);
    }

    /**
     * 复制报表
     */
    copyReport(reportId, newName) {
        const original = this.getReportById(reportId);
        if (!original) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const copy = {
            ...JSON.parse(JSON.stringify(original)),
            id: this.generateId(),
            name: newName || `${original.name} (副本)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'DRAFT'
        };

        this.reports.push(copy);
        return copy;
    }

    /**
     * 发布报表
     */
    publishReport(reportId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        // 验证报表配置
        if (report.metrics.length === 0) {
            throw new Error('报表至少需要一个指标');
        }

        report.status = 'PUBLISHED';
        report.publishedAt = new Date().toISOString();
        report.updatedAt = new Date().toISOString();

        return report;
    }

    /**
     * 保存为模板
     */
    saveAsTemplate(reportId, templateName) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const template = {
            ...JSON.parse(JSON.stringify(report)),
            id: this.generateId(),
            name: templateName,
            isTemplate: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.reports.push(template);
        return template;
    }

    /**
     * 从模板创建报表
     */
    createFromTemplate(templateId, reportName) {
        const template = this.getReportById(templateId);
        if (!template || !template.isTemplate) {
            throw new Error(`模板不存在: ${templateId}`);
        }

        const report = {
            ...JSON.parse(JSON.stringify(template)),
            id: this.generateId(),
            name: reportName,
            isTemplate: false,
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.reports.push(report);
        return report;
    }

    /**
     * 验证报表配置
     */
    validateReport(reportId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const errors = [];

        if (!report.name || report.name.trim() === '') {
            errors.push('报表名称不能为空');
        }

        if (report.metrics.length === 0) {
            errors.push('至少需要选择一个指标');
        }

        if (report.reportType === 'CHART' && !report.chartType) {
            errors.push('图表类型不能为空');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * 生成ID
     */
    generateId() {
        return 'RPT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 导出报表配置
     */
    exportReportConfig(reportId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        return {
            exportedAt: new Date().toISOString(),
            report: JSON.parse(JSON.stringify(report))
        };
    }

    /**
     * 导入报表配置
     */
    importReportConfig(config) {
        const report = {
            ...config.report,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'DRAFT'
        };

        this.reports.push(report);
        return report;
    }

    /**
     * 获取报表统计
     */
    getReportStatistics() {
        return {
            total: this.reports.length,
            byType: {
                TABLE: this.reports.filter(r => r.reportType === 'TABLE').length,
                CHART: this.reports.filter(r => r.reportType === 'CHART').length,
                DASHBOARD: this.reports.filter(r => r.reportType === 'DASHBOARD').length
            },
            byStatus: {
                DRAFT: this.reports.filter(r => r.status === 'DRAFT').length,
                PUBLISHED: this.reports.filter(r => r.status === 'PUBLISHED').length
            },
            public: this.reports.filter(r => r.isPublic).length,
            private: this.reports.filter(r => !r.isPublic).length,
            templates: this.reports.filter(r => r.isTemplate).length
        };
    }
}

// 导出服务实例
window.ReportDesignerService = ReportDesignerService;
