/**
 * 报表导出服务
 * 支持导出为Excel、PDF、图片格式,实现导出权限控制,对敏感字段进行脱敏处理
 */

class ReportExportService {
    constructor() {
        this.exportHistory = [];
        this.exportFormats = this.initializeFormats();
        this.sensitiveFields = this.initializeSensitiveFields();
        this.maskingRules = this.initializeMaskingRules();
    }

    /**
     * 初始化导出格式
     */
    initializeFormats() {
        return {
            EXCEL: {
                id: 'EXCEL',
                name: 'Excel',
                extension: 'xlsx',
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                icon: 'file-excel',
                maxRows: 1000000,
                supportsMasking: true,
                supportsWatermark: true
            },
            PDF: {
                id: 'PDF',
                name: 'PDF',
                extension: 'pdf',
                mimeType: 'application/pdf',
                icon: 'file-pdf',
                maxRows: 100000,
                supportsMasking: true,
                supportsWatermark: true
            },
            IMAGE: {
                id: 'IMAGE',
                name: '图片',
                extension: 'png',
                mimeType: 'image/png',
                icon: 'file-image',
                maxRows: null,
                supportsMasking: false,
                supportsWatermark: true
            },
            CSV: {
                id: 'CSV',
                name: 'CSV',
                extension: 'csv',
                mimeType: 'text/csv',
                icon: 'file-text',
                maxRows: 1000000,
                supportsMasking: true,
                supportsWatermark: false
            },
            HTML: {
                id: 'HTML',
                name: 'HTML',
                extension: 'html',
                mimeType: 'text/html',
                icon: 'file-code',
                maxRows: 10000,
                supportsMasking: true,
                supportsWatermark: true
            }
        };
    }

    /**
     * 初始化敏感字段
     */
    initializeSensitiveFields() {
        return [
            'idCard', 'identityCard', '身份证', '身份证号',
            'phone', 'mobile', 'telephone', '手机', '电话',
            'bankCard', 'bankAccount', '银行卡', '银行账号',
            'email', '邮箱',
            'address', '地址',
            'salary', 'income', '工资', '收入',
            'password', '密码'
        ];
    }

    /**
     * 初始化脱敏规则
     */
    initializeMaskingRules() {
        return {
            idCard: {
                pattern: /^(\d{6})\d{8}(\d{4})$/,
                replacement: '$1********$2',
                description: '身份证号脱敏'
            },
            phone: {
                pattern: /^(\d{3})\d{4}(\d{4})$/,
                replacement: '$1****$2',
                description: '手机号脱敏'
            },
            bankCard: {
                pattern: /^(\d{4})\d+(\d{4})$/,
                replacement: '$1 **** **** $2',
                description: '银行卡号脱敏'
            },
            email: {
                pattern: /^(.{1,3}).*(@.*)$/,
                replacement: '$1***$2',
                description: '邮箱脱敏'
            },
            name: {
                pattern: /^(.)(.+)$/,
                replacement: '$1*',
                description: '姓名脱敏'
            },
            address: {
                pattern: /^(.{6}).*$/,
                replacement: '$1***',
                description: '地址脱敏'
            }
        };
    }

    /**
     * 导出报表
     */
    async exportReport(reportId, format, options = {}) {
        const exportTask = {
            id: this.generateId(),
            reportId: reportId,
            reportName: options.reportName || '报表',
            format: format,
            userId: options.userId || 'current_user',
            userName: options.userName || '当前用户',
            startTime: new Date().toISOString(),
            endTime: null,
            status: 'PROCESSING',
            fileSize: null,
            filePath: null,
            error: null,
            options: {
                applyMasking: options.applyMasking !== false,
                addWatermark: options.addWatermark !== false,
                includeCharts: options.includeCharts !== false,
                pageSize: options.pageSize || 'A4',
                orientation: options.orientation || 'portrait',
                filters: options.filters || []
            }
        };

        this.exportHistory.push(exportTask);

        try {
            // 检查权限
            this.checkExportPermission(exportTask);

            // 获取报表数据
            const reportData = await this.fetchReportData(reportId, options);

            // 应用脱敏
            let processedData = reportData;
            if (exportTask.options.applyMasking) {
                processedData = this.applyMasking(reportData, options.userRole);
            }

            // 根据格式导出
            const result = await this.exportByFormat(format, processedData, exportTask);

            exportTask.endTime = new Date().toISOString();
            exportTask.status = 'SUCCESS';
            exportTask.fileSize = result.fileSize;
            exportTask.filePath = result.filePath;
            exportTask.downloadUrl = result.downloadUrl;

            return exportTask;
        } catch (error) {
            console.error('导出失败:', error);

            exportTask.endTime = new Date().toISOString();
            exportTask.status = 'FAILED';
            exportTask.error = error.message;

            throw error;
        }
    }

    /**
     * 检查导出权限
     */
    checkExportPermission(exportTask) {
        // 实际应用中应该检查用户权限
        // 这里简化处理

        const format = this.exportFormats[exportTask.format];
        if (!format) {
            throw new Error(`不支持的导出格式: ${exportTask.format}`);
        }

        // 检查用户是否有导出权限
        // if (!hasPermission(exportTask.userId, 'EXPORT')) {
        //     throw new Error('没有导出权限');
        // }

        return true;
    }

    /**
     * 获取报表数据
     */
    async fetchReportData(reportId, options) {
        // 模拟获取报表数据
        await this.simulateDelay(1000);

        // 实际应用中应该从数据库或API获取数据
        return this.generateMockReportData(options);
    }

    /**
     * 生成模拟报表数据
     */
    generateMockReportData(options) {
        const rowCount = options.rowCount || 100;
        const data = {
            title: options.reportName || '报表',
            generatedAt: new Date().toISOString(),
            columns: [
                { field: 'id', header: 'ID', type: 'number' },
                { field: 'name', header: '姓名', type: 'string', sensitive: true },
                { field: 'department', header: '部门', type: 'string' },
                { field: 'idCard', header: '身份证号', type: 'string', sensitive: true },
                { field: 'phone', header: '手机号', type: 'string', sensitive: true },
                { field: 'email', header: '邮箱', type: 'string', sensitive: true },
                { field: 'amount', header: '金额', type: 'number' },
                { field: 'date', header: '日期', type: 'date' }
            ],
            rows: []
        };

        for (let i = 0; i < rowCount; i++) {
            data.rows.push({
                id: i + 1,
                name: `张${i}`,
                department: ['财务处', '科研处', '资产处', '采购中心'][i % 4],
                idCard: `11010119900101${String(i).padStart(4, '0')}`,
                phone: `138${String(i).padStart(8, '0')}`,
                email: `user${i}@example.com`,
                amount: (Math.random() * 100000).toFixed(2),
                date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        }

        return data;
    }

    /**
     * 应用脱敏
     */
    applyMasking(reportData, userRole) {
        const maskedData = JSON.parse(JSON.stringify(reportData));

        // 根据用户角色决定脱敏级别
        const maskingLevel = this.getMaskingLevel(userRole);

        maskedData.rows = maskedData.rows.map(row => {
            const maskedRow = { ...row };

            maskedData.columns.forEach(column => {
                if (column.sensitive && maskingLevel !== 'NONE') {
                    const value = maskedRow[column.field];
                    if (value) {
                        maskedRow[column.field] = this.maskValue(column.field, value, maskingLevel);
                    }
                }
            });

            return maskedRow;
        });

        return maskedData;
    }

    /**
     * 获取脱敏级别
     */
    getMaskingLevel(userRole) {
        // 根据用户角色返回脱敏级别
        const roleMaskingMap = {
            'admin': 'NONE',        // 管理员不脱敏
            'auditor': 'PARTIAL',   // 审计员部分脱敏
            'viewer': 'FULL'        // 普通查看者完全脱敏
        };

        return roleMaskingMap[userRole] || 'FULL';
    }

    /**
     * 脱敏值
     */
    maskValue(fieldName, value, level) {
        if (level === 'NONE') {
            return value;
        }

        // 查找匹配的脱敏规则
        for (const [ruleKey, rule] of Object.entries(this.maskingRules)) {
            if (fieldName.toLowerCase().includes(ruleKey) || 
                this.sensitiveFields.some(sf => fieldName.toLowerCase().includes(sf.toLowerCase()))) {
                
                if (rule.pattern && rule.pattern.test(value)) {
                    return value.replace(rule.pattern, rule.replacement);
                }
            }
        }

        // 默认脱敏:保留前后各1/4,中间用*替换
        const len = value.length;
        if (len <= 2) {
            return '*'.repeat(len);
        }

        const keepLen = Math.floor(len / 4);
        const prefix = value.substring(0, keepLen);
        const suffix = value.substring(len - keepLen);
        const maskLen = len - 2 * keepLen;

        return prefix + '*'.repeat(maskLen) + suffix;
    }

    /**
     * 根据格式导出
     */
    async exportByFormat(format, data, exportTask) {
        switch (format) {
            case 'EXCEL':
                return await this.exportToExcel(data, exportTask);
            case 'PDF':
                return await this.exportToPDF(data, exportTask);
            case 'IMAGE':
                return await this.exportToImage(data, exportTask);
            case 'CSV':
                return await this.exportToCSV(data, exportTask);
            case 'HTML':
                return await this.exportToHTML(data, exportTask);
            default:
                throw new Error(`不支持的导出格式: ${format}`);
        }
    }

    /**
     * 导出为Excel
     */
    async exportToExcel(data, exportTask) {
        await this.simulateDelay(1500);

        // 实际应用中应该使用 SheetJS (xlsx) 或类似库
        const content = this.generateExcelContent(data, exportTask);
        const fileSize = content.length * 2; // 估算文件大小
        const fileName = `${exportTask.reportName}_${Date.now()}.xlsx`;
        const filePath = `/exports/${fileName}`;

        // 模拟文件下载
        this.downloadFile(content, fileName, this.exportFormats.EXCEL.mimeType);

        return {
            fileSize,
            filePath,
            downloadUrl: filePath
        };
    }

    /**
     * 生成Excel内容
     */
    generateExcelContent(data, exportTask) {
        // 简化的Excel内容生成
        let content = `${data.title}\n`;
        content += `生成时间: ${data.generatedAt}\n\n`;

        // 添加水印信息
        if (exportTask.options.addWatermark) {
            content += `水印: ${exportTask.userName} - ${exportTask.userId} - ${new Date().toLocaleString('zh-CN')}\n\n`;
        }

        // 表头
        content += data.columns.map(col => col.header).join('\t') + '\n';

        // 数据行
        data.rows.forEach(row => {
            content += data.columns.map(col => row[col.field] || '').join('\t') + '\n';
        });

        return content;
    }

    /**
     * 导出为PDF
     */
    async exportToPDF(data, exportTask) {
        await this.simulateDelay(2000);

        // 实际应用中应该使用 jsPDF 或类似库
        const content = this.generatePDFContent(data, exportTask);
        const fileSize = content.length * 3; // 估算文件大小
        const fileName = `${exportTask.reportName}_${Date.now()}.pdf`;
        const filePath = `/exports/${fileName}`;

        // 模拟文件下载
        this.downloadFile(content, fileName, this.exportFormats.PDF.mimeType);

        return {
            fileSize,
            filePath,
            downloadUrl: filePath
        };
    }

    /**
     * 生成PDF内容
     */
    generatePDFContent(data, exportTask) {
        // 简化的PDF内容生成
        let content = `PDF Report: ${data.title}\n`;
        content += `Generated: ${data.generatedAt}\n\n`;

        if (exportTask.options.addWatermark) {
            content += `Watermark: ${exportTask.userName} - ${new Date().toLocaleString('zh-CN')}\n\n`;
        }

        content += this.generateTableContent(data);

        return content;
    }

    /**
     * 导出为图片
     */
    async exportToImage(data, exportTask) {
        await this.simulateDelay(1000);

        // 实际应用中应该使用 html2canvas 或类似库
        const fileSize = Math.floor(Math.random() * 1000000) + 100000;
        const fileName = `${exportTask.reportName}_${Date.now()}.png`;
        const filePath = `/exports/${fileName}`;

        return {
            fileSize,
            filePath,
            downloadUrl: filePath
        };
    }

    /**
     * 导出为CSV
     */
    async exportToCSV(data, exportTask) {
        await this.simulateDelay(500);

        const content = this.generateCSVContent(data, exportTask);
        const fileSize = content.length;
        const fileName = `${exportTask.reportName}_${Date.now()}.csv`;
        const filePath = `/exports/${fileName}`;

        // 模拟文件下载
        this.downloadFile(content, fileName, this.exportFormats.CSV.mimeType);

        return {
            fileSize,
            filePath,
            downloadUrl: filePath
        };
    }

    /**
     * 生成CSV内容
     */
    generateCSVContent(data, exportTask) {
        const rows = [];

        // 表头
        rows.push(data.columns.map(col => `"${col.header}"`).join(','));

        // 数据行
        data.rows.forEach(row => {
            rows.push(data.columns.map(col => `"${row[col.field] || ''}"`).join(','));
        });

        return rows.join('\n');
    }

    /**
     * 导出为HTML
     */
    async exportToHTML(data, exportTask) {
        await this.simulateDelay(800);

        const content = this.generateHTMLContent(data, exportTask);
        const fileSize = content.length;
        const fileName = `${exportTask.reportName}_${Date.now()}.html`;
        const filePath = `/exports/${fileName}`;

        // 模拟文件下载
        this.downloadFile(content, fileName, this.exportFormats.HTML.mimeType);

        return {
            fileSize,
            filePath,
            downloadUrl: filePath
        };
    }

    /**
     * 生成HTML内容
     */
    generateHTMLContent(data, exportTask) {
        let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${data.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .watermark { color: #999; font-size: 12px; margin: 10px 0; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>${data.title}</h1>
    <p>生成时间: ${data.generatedAt}</p>`;

        if (exportTask.options.addWatermark) {
            html += `    <p class="watermark">水印: ${exportTask.userName} - ${exportTask.userId} - ${new Date().toLocaleString('zh-CN')}</p>\n`;
        }

        html += `    <table>\n        <thead>\n            <tr>\n`;
        
        data.columns.forEach(col => {
            html += `                <th>${col.header}</th>\n`;
        });
        
        html += `            </tr>\n        </thead>\n        <tbody>\n`;
        
        data.rows.forEach(row => {
            html += `            <tr>\n`;
            data.columns.forEach(col => {
                html += `                <td>${row[col.field] || ''}</td>\n`;
            });
            html += `            </tr>\n`;
        });
        
        html += `        </tbody>\n    </table>\n</body>\n</html>`;

        return html;
    }

    /**
     * 生成表格内容
     */
    generateTableContent(data) {
        let content = '';

        // 表头
        content += data.columns.map(col => col.header).join(' | ') + '\n';
        content += data.columns.map(() => '---').join(' | ') + '\n';

        // 数据行
        data.rows.forEach(row => {
            content += data.columns.map(col => row[col.field] || '').join(' | ') + '\n';
        });

        return content;
    }

    /**
     * 下载文件
     */
    downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * 批量导出
     */
    async batchExport(reportIds, format, options = {}) {
        const results = [];

        for (const reportId of reportIds) {
            try {
                const result = await this.exportReport(reportId, format, {
                    ...options,
                    reportName: `报表_${reportId}`
                });
                results.push({
                    reportId,
                    success: true,
                    result
                });
            } catch (error) {
                results.push({
                    reportId,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * 获取导出历史
     */
    getExportHistory(filter = {}, limit = 50) {
        let history = [...this.exportHistory];

        if (filter.reportId) {
            history = history.filter(h => h.reportId === filter.reportId);
        }

        if (filter.userId) {
            history = history.filter(h => h.userId === filter.userId);
        }

        if (filter.format) {
            history = history.filter(h => h.format === filter.format);
        }

        if (filter.status) {
            history = history.filter(h => h.status === filter.status);
        }

        // 按时间倒序排序
        history.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        return history.slice(0, limit);
    }

    /**
     * 获取导出统计
     */
    getExportStatistics() {
        const history = this.exportHistory;

        return {
            total: history.length,
            byFormat: {
                EXCEL: history.filter(h => h.format === 'EXCEL').length,
                PDF: history.filter(h => h.format === 'PDF').length,
                IMAGE: history.filter(h => h.format === 'IMAGE').length,
                CSV: history.filter(h => h.format === 'CSV').length,
                HTML: history.filter(h => h.format === 'HTML').length
            },
            byStatus: {
                success: history.filter(h => h.status === 'SUCCESS').length,
                failed: history.filter(h => h.status === 'FAILED').length,
                processing: history.filter(h => h.status === 'PROCESSING').length
            },
            successRate: history.length > 0
                ? ((history.filter(h => h.status === 'SUCCESS').length / history.length) * 100).toFixed(2)
                : 0,
            totalFileSize: history
                .filter(h => h.fileSize)
                .reduce((sum, h) => sum + h.fileSize, 0),
            recentExports: history.slice(0, 10)
        };
    }

    /**
     * 获取支持的格式
     */
    getSupportedFormats() {
        return Object.values(this.exportFormats);
    }

    /**
     * 添加敏感字段
     */
    addSensitiveField(fieldName) {
        if (!this.sensitiveFields.includes(fieldName)) {
            this.sensitiveFields.push(fieldName);
        }
    }

    /**
     * 移除敏感字段
     */
    removeSensitiveField(fieldName) {
        const index = this.sensitiveFields.indexOf(fieldName);
        if (index !== -1) {
            this.sensitiveFields.splice(index, 1);
        }
    }

    /**
     * 添加脱敏规则
     */
    addMaskingRule(name, rule) {
        this.maskingRules[name] = rule;
    }

    /**
     * 清理历史记录
     */
    cleanupHistory(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const before = this.exportHistory.length;
        this.exportHistory = this.exportHistory.filter(h => 
            new Date(h.startTime) > cutoffDate
        );
        const after = this.exportHistory.length;

        return {
            removed: before - after,
            remaining: after
        };
    }

    /**
     * 模拟延迟
     */
    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 生成ID
     */
    generateId() {
        return 'EXP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// 导出服务实例
window.ReportExportService = ReportExportService;
