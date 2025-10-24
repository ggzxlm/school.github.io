/**
 * 报表水印服务
 * 支持自动添加用户水印、记录报表查看日志、实现访问追踪等功能
 */

class ReportWatermarkService {
    constructor() {
        this.accessLogs = [];
        this.watermarkConfig = this.initializeWatermarkConfig();
        this.trackingEnabled = true;
    }

    /**
     * 初始化水印配置
     */
    initializeWatermarkConfig() {
        return {
            enabled: true,
            position: 'diagonal', // 'diagonal', 'footer', 'header', 'center'
            opacity: 0.15,
            fontSize: 14,
            fontFamily: 'Arial',
            color: '#000000',
            rotation: -45,
            spacing: 200,
            includeTimestamp: true,
            includeUserId: true,
            includeUserName: true,
            includeIpAddress: true,
            format: '{userName} - {userId} - {timestamp}'
        };
    }

    /**
     * 添加水印
     */
    addWatermark(content, userInfo, options = {}) {
        const config = { ...this.watermarkConfig, ...options };

        if (!config.enabled) {
            return content;
        }

        const watermarkText = this.generateWatermarkText(userInfo, config);
        const watermarkId = this.generateId();

        // 记录水印添加日志
        this.logWatermarkAddition(watermarkId, userInfo, watermarkText);

        // 根据内容类型添加水印
        if (content instanceof HTMLElement) {
            return this.addHTMLWatermark(content, watermarkText, config);
        } else if (typeof content === 'string') {
            return this.addTextWatermark(content, watermarkText, config);
        } else if (content instanceof Blob || content instanceof File) {
            return this.addFileWatermark(content, watermarkText, config);
        }

        return content;
    }

    /**
     * 生成水印文本
     */
    generateWatermarkText(userInfo, config) {
        let text = config.format;

        const replacements = {
            '{userName}': userInfo.userName || userInfo.name || '未知用户',
            '{userId}': userInfo.userId || userInfo.id || '',
            '{timestamp}': config.includeTimestamp ? new Date().toLocaleString('zh-CN') : '',
            '{date}': new Date().toLocaleDateString('zh-CN'),
            '{time}': new Date().toLocaleTimeString('zh-CN'),
            '{ipAddress}': config.includeIpAddress ? (userInfo.ipAddress || '') : ''
        };

        Object.keys(replacements).forEach(key => {
            text = text.replace(key, replacements[key]);
        });

        // 清理多余的分隔符
        text = text.replace(/\s*-\s*-\s*/g, ' - ').trim();
        text = text.replace(/^-\s*|\s*-$/g, '').trim();

        return text;
    }

    /**
     * 添加HTML水印
     */
    addHTMLWatermark(element, watermarkText, config) {
        const watermarkContainer = document.createElement('div');
        watermarkContainer.className = 'report-watermark-container';
        watermarkContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;

        if (config.position === 'diagonal') {
            this.addDiagonalWatermarks(watermarkContainer, watermarkText, config);
        } else if (config.position === 'footer') {
            this.addFooterWatermark(watermarkContainer, watermarkText, config);
        } else if (config.position === 'header') {
            this.addHeaderWatermark(watermarkContainer, watermarkText, config);
        } else if (config.position === 'center') {
            this.addCenterWatermark(watermarkContainer, watermarkText, config);
        }

        // 确保元素有相对定位
        if (element.style.position !== 'absolute' && element.style.position !== 'fixed') {
            element.style.position = 'relative';
        }

        element.appendChild(watermarkContainer);

        return element;
    }

    /**
     * 添加对角线水印
     */
    addDiagonalWatermarks(container, text, config) {
        const rows = Math.ceil(container.offsetHeight / config.spacing) + 2;
        const cols = Math.ceil(container.offsetWidth / config.spacing) + 2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const watermark = document.createElement('div');
                watermark.textContent = text;
                watermark.style.cssText = `
                    position: absolute;
                    top: ${i * config.spacing}px;
                    left: ${j * config.spacing}px;
                    font-size: ${config.fontSize}px;
                    font-family: ${config.fontFamily};
                    color: ${config.color};
                    opacity: ${config.opacity};
                    transform: rotate(${config.rotation}deg);
                    white-space: nowrap;
                    user-select: none;
                `;
                container.appendChild(watermark);
            }
        }
    }

    /**
     * 添加页脚水印
     */
    addFooterWatermark(container, text, config) {
        const watermark = document.createElement('div');
        watermark.textContent = text;
        watermark.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 20px;
            font-size: ${config.fontSize}px;
            font-family: ${config.fontFamily};
            color: ${config.color};
            opacity: ${config.opacity};
            user-select: none;
        `;
        container.appendChild(watermark);
    }

    /**
     * 添加页眉水印
     */
    addHeaderWatermark(container, text, config) {
        const watermark = document.createElement('div');
        watermark.textContent = text;
        watermark.style.cssText = `
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: ${config.fontSize}px;
            font-family: ${config.fontFamily};
            color: ${config.color};
            opacity: ${config.opacity};
            user-select: none;
        `;
        container.appendChild(watermark);
    }

    /**
     * 添加居中水印
     */
    addCenterWatermark(container, text, config) {
        const watermark = document.createElement('div');
        watermark.textContent = text;
        watermark.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(${config.rotation}deg);
            font-size: ${config.fontSize * 2}px;
            font-family: ${config.fontFamily};
            color: ${config.color};
            opacity: ${config.opacity};
            user-select: none;
            white-space: nowrap;
        `;
        container.appendChild(watermark);
    }

    /**
     * 添加文本水印
     */
    addTextWatermark(content, watermarkText, config) {
        const separator = '\n' + '='.repeat(50) + '\n';
        const watermark = `${separator}水印: ${watermarkText}${separator}`;
        
        if (config.position === 'header') {
            return watermark + content;
        } else {
            return content + watermark;
        }
    }

    /**
     * 添加文件水印
     */
    async addFileWatermark(file, watermarkText, config) {
        // 对于文件,我们返回一个包含水印信息的元数据对象
        // 实际应用中应该根据文件类型(PDF, Excel, 图片等)进行相应处理
        return {
            file: file,
            watermark: watermarkText,
            watermarkedAt: new Date().toISOString(),
            config: config
        };
    }

    /**
     * 记录访问日志
     */
    logAccess(reportId, userInfo, action, details = {}) {
        if (!this.trackingEnabled) {
            return null;
        }

        const log = {
            id: this.generateId(),
            reportId: reportId,
            reportName: details.reportName || '',
            userId: userInfo.userId || userInfo.id,
            userName: userInfo.userName || userInfo.name,
            userRole: userInfo.role || '',
            action: action, // 'VIEW', 'DOWNLOAD', 'EXPORT', 'PRINT', 'SHARE'
            accessTime: new Date().toISOString(),
            ipAddress: userInfo.ipAddress || this.getClientIP(),
            userAgent: navigator.userAgent,
            sessionId: userInfo.sessionId || this.getSessionId(),
            duration: details.duration || null,
            format: details.format || null,
            parameters: details.parameters || {},
            success: details.success !== false,
            error: details.error || null
        };

        this.accessLogs.push(log);

        // 触发访问事件
        this.triggerAccessEvent(log);

        return log;
    }

    /**
     * 记录报表查看
     */
    logView(reportId, userInfo, details = {}) {
        return this.logAccess(reportId, userInfo, 'VIEW', details);
    }

    /**
     * 记录报表下载
     */
    logDownload(reportId, userInfo, details = {}) {
        return this.logAccess(reportId, userInfo, 'DOWNLOAD', details);
    }

    /**
     * 记录报表导出
     */
    logExport(reportId, userInfo, details = {}) {
        return this.logAccess(reportId, userInfo, 'EXPORT', details);
    }

    /**
     * 记录报表打印
     */
    logPrint(reportId, userInfo, details = {}) {
        return this.logAccess(reportId, userInfo, 'PRINT', details);
    }

    /**
     * 记录报表分享
     */
    logShare(reportId, userInfo, details = {}) {
        return this.logAccess(reportId, userInfo, 'SHARE', details);
    }

    /**
     * 记录水印添加
     */
    logWatermarkAddition(watermarkId, userInfo, watermarkText) {
        const log = {
            id: this.generateId(),
            watermarkId: watermarkId,
            userId: userInfo.userId || userInfo.id,
            userName: userInfo.userName || userInfo.name,
            watermarkText: watermarkText,
            addedAt: new Date().toISOString(),
            ipAddress: userInfo.ipAddress || this.getClientIP()
        };

        // 可以存储到单独的水印日志中
        return log;
    }

    /**
     * 获取访问日志
     */
    getAccessLogs(filter = {}, limit = 100) {
        let logs = [...this.accessLogs];

        if (filter.reportId) {
            logs = logs.filter(l => l.reportId === filter.reportId);
        }

        if (filter.userId) {
            logs = logs.filter(l => l.userId === filter.userId);
        }

        if (filter.action) {
            logs = logs.filter(l => l.action === filter.action);
        }

        if (filter.startDate) {
            logs = logs.filter(l => new Date(l.accessTime) >= new Date(filter.startDate));
        }

        if (filter.endDate) {
            logs = logs.filter(l => new Date(l.accessTime) <= new Date(filter.endDate));
        }

        // 按时间倒序排序
        logs.sort((a, b) => new Date(b.accessTime) - new Date(a.accessTime));

        return logs.slice(0, limit);
    }

    /**
     * 获取用户访问历史
     */
    getUserAccessHistory(userId, limit = 50) {
        return this.getAccessLogs({ userId }, limit);
    }

    /**
     * 获取报表访问历史
     */
    getReportAccessHistory(reportId, limit = 50) {
        return this.getAccessLogs({ reportId }, limit);
    }

    /**
     * 获取访问统计
     */
    getAccessStatistics(filter = {}) {
        const logs = this.getAccessLogs(filter, 10000);

        return {
            total: logs.length,
            byAction: {
                view: logs.filter(l => l.action === 'VIEW').length,
                download: logs.filter(l => l.action === 'DOWNLOAD').length,
                export: logs.filter(l => l.action === 'EXPORT').length,
                print: logs.filter(l => l.action === 'PRINT').length,
                share: logs.filter(l => l.action === 'SHARE').length
            },
            uniqueUsers: new Set(logs.map(l => l.userId)).size,
            uniqueReports: new Set(logs.map(l => l.reportId)).size,
            successRate: logs.length > 0
                ? ((logs.filter(l => l.success).length / logs.length) * 100).toFixed(2)
                : 0,
            topUsers: this.getTopUsers(logs, 10),
            topReports: this.getTopReports(logs, 10),
            accessByHour: this.getAccessByHour(logs),
            accessByDay: this.getAccessByDay(logs)
        };
    }

    /**
     * 获取访问最多的用户
     */
    getTopUsers(logs, limit = 10) {
        const userCounts = {};

        logs.forEach(log => {
            if (!userCounts[log.userId]) {
                userCounts[log.userId] = {
                    userId: log.userId,
                    userName: log.userName,
                    count: 0
                };
            }
            userCounts[log.userId].count++;
        });

        return Object.values(userCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * 获取访问最多的报表
     */
    getTopReports(logs, limit = 10) {
        const reportCounts = {};

        logs.forEach(log => {
            if (!reportCounts[log.reportId]) {
                reportCounts[log.reportId] = {
                    reportId: log.reportId,
                    reportName: log.reportName,
                    count: 0
                };
            }
            reportCounts[log.reportId].count++;
        });

        return Object.values(reportCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * 按小时统计访问
     */
    getAccessByHour(logs) {
        const hourCounts = Array(24).fill(0);

        logs.forEach(log => {
            const hour = new Date(log.accessTime).getHours();
            hourCounts[hour]++;
        });

        return hourCounts.map((count, hour) => ({
            hour: `${hour}:00`,
            count
        }));
    }

    /**
     * 按天统计访问
     */
    getAccessByDay(logs) {
        const dayCounts = {};

        logs.forEach(log => {
            const day = new Date(log.accessTime).toLocaleDateString('zh-CN');
            dayCounts[day] = (dayCounts[day] || 0) + 1;
        });

        return Object.entries(dayCounts)
            .map(([day, count]) => ({ day, count }))
            .sort((a, b) => new Date(a.day) - new Date(b.day));
    }

    /**
     * 追踪用户行为
     */
    trackUserBehavior(userId, reportId, behavior) {
        const tracking = {
            id: this.generateId(),
            userId: userId,
            reportId: reportId,
            behavior: behavior, // 'scroll', 'click', 'hover', 'filter', 'sort'
            timestamp: new Date().toISOString(),
            details: behavior.details || {}
        };

        // 可以存储到单独的行为追踪日志中
        return tracking;
    }

    /**
     * 检测异常访问
     */
    detectAnomalousAccess(userId, reportId) {
        const recentLogs = this.getAccessLogs({
            userId,
            reportId,
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
        });

        const anomalies = [];

        // 检测频繁访问
        if (recentLogs.length > 100) {
            anomalies.push({
                type: 'FREQUENT_ACCESS',
                severity: 'HIGH',
                message: '24小时内访问次数超过100次',
                count: recentLogs.length
            });
        }

        // 检测批量下载
        const downloads = recentLogs.filter(l => l.action === 'DOWNLOAD');
        if (downloads.length > 20) {
            anomalies.push({
                type: 'BULK_DOWNLOAD',
                severity: 'MEDIUM',
                message: '24小时内下载次数超过20次',
                count: downloads.length
            });
        }

        // 检测异常时间访问
        const nightAccess = recentLogs.filter(l => {
            const hour = new Date(l.accessTime).getHours();
            return hour >= 0 && hour < 6;
        });
        if (nightAccess.length > 10) {
            anomalies.push({
                type: 'NIGHT_ACCESS',
                severity: 'MEDIUM',
                message: '深夜访问次数异常',
                count: nightAccess.length
            });
        }

        return anomalies;
    }

    /**
     * 导出访问日志
     */
    exportAccessLogs(filter = {}) {
        const logs = this.getAccessLogs(filter, 10000);

        const csvContent = this.convertToCSV(logs);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `access-logs-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        return logs;
    }

    /**
     * 转换为CSV
     */
    convertToCSV(logs) {
        const headers = ['访问时间', '用户ID', '用户名', '报表ID', '报表名称', '操作', 'IP地址', '成功'];
        const rows = logs.map(log => [
            log.accessTime,
            log.userId,
            log.userName,
            log.reportId,
            log.reportName,
            log.action,
            log.ipAddress,
            log.success ? '是' : '否'
        ]);

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    /**
     * 清理日志
     */
    cleanupLogs(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const before = this.accessLogs.length;
        this.accessLogs = this.accessLogs.filter(l => 
            new Date(l.accessTime) > cutoffDate
        );
        const after = this.accessLogs.length;

        return {
            removed: before - after,
            remaining: after
        };
    }

    /**
     * 配置水印
     */
    configureWatermark(config) {
        Object.assign(this.watermarkConfig, config);
        return this.watermarkConfig;
    }

    /**
     * 启用/禁用追踪
     */
    toggleTracking(enabled) {
        this.trackingEnabled = enabled;
        return this.trackingEnabled;
    }

    /**
     * 触发访问事件
     */
    triggerAccessEvent(log) {
        const event = new CustomEvent('reportAccess', {
            detail: log
        });
        window.dispatchEvent(event);
    }

    /**
     * 获取客户端IP
     */
    getClientIP() {
        // 实际应用中应该从服务器获取
        return '127.0.0.1';
    }

    /**
     * 获取会话ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    /**
     * 生成ID
     */
    generateId() {
        return 'LOG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// 导出服务实例
window.ReportWatermarkService = ReportWatermarkService;
