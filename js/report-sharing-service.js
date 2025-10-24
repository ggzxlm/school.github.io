/**
 * 报表共享服务
 * 支持报表保存、共享、模板管理、复制编辑等功能
 */

class ReportSharingService {
    constructor() {
        this.savedReports = [];
        this.sharedReports = [];
        this.templates = [];
        this.permissions = new Map();
        this.favorites = new Set();
    }

    /**
     * 保存报表
     */
    saveReport(report, saveAs = 'personal') {
        const savedReport = {
            ...report,
            id: report.id || this.generateId(),
            saveType: saveAs, // 'personal' or 'shared'
            savedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: (report.version || 0) + 1,
            owner: report.owner || 'current_user'
        };

        // 检查是否已存在
        const existingIndex = this.savedReports.findIndex(r => r.id === savedReport.id);
        if (existingIndex !== -1) {
            // 更新现有报表
            this.savedReports[existingIndex] = savedReport;
        } else {
            // 添加新报表
            this.savedReports.push(savedReport);
        }

        // 如果是共享报表,添加到共享列表
        if (saveAs === 'shared') {
            this.shareReport(savedReport.id, {
                shareType: 'public',
                permissions: ['read']
            });
        }

        return savedReport;
    }

    /**
     * 共享报表
     */
    shareReport(reportId, shareConfig) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const shareInfo = {
            reportId,
            shareType: shareConfig.shareType || 'public', // 'public', 'private', 'link'
            sharedWith: shareConfig.sharedWith || [], // 用户ID列表
            permissions: shareConfig.permissions || ['read'], // 'read', 'write', 'execute', 'share'
            shareLink: shareConfig.shareType === 'link' ? this.generateShareLink(reportId) : null,
            expiresAt: shareConfig.expiresAt || null,
            sharedBy: report.owner,
            sharedAt: new Date().toISOString()
        };

        // 更新报表的共享状态
        report.isPublic = shareConfig.shareType === 'public';
        report.sharedAt = shareInfo.sharedAt;

        // 保存共享信息
        const existingIndex = this.sharedReports.findIndex(s => s.reportId === reportId);
        if (existingIndex !== -1) {
            this.sharedReports[existingIndex] = shareInfo;
        } else {
            this.sharedReports.push(shareInfo);
        }

        // 设置权限
        this.setPermissions(reportId, shareInfo);

        return shareInfo;
    }

    /**
     * 取消共享
     */
    unshareReport(reportId) {
        const report = this.getReportById(reportId);
        if (report) {
            report.isPublic = false;
            report.sharedAt = null;
        }

        const index = this.sharedReports.findIndex(s => s.reportId === reportId);
        if (index !== -1) {
            this.sharedReports.splice(index, 1);
        }

        this.permissions.delete(reportId);

        return true;
    }

    /**
     * 设置权限
     */
    setPermissions(reportId, shareInfo) {
        const permissions = {
            reportId,
            owner: shareInfo.sharedBy,
            public: shareInfo.shareType === 'public',
            users: new Map()
        };

        // 设置特定用户权限
        if (shareInfo.sharedWith && shareInfo.sharedWith.length > 0) {
            shareInfo.sharedWith.forEach(userId => {
                permissions.users.set(userId, shareInfo.permissions);
            });
        }

        this.permissions.set(reportId, permissions);
    }

    /**
     * 检查权限
     */
    checkPermission(reportId, userId, permission) {
        const report = this.getReportById(reportId);
        if (!report) {
            return false;
        }

        // 所有者拥有所有权限
        if (report.owner === userId) {
            return true;
        }

        const permissions = this.permissions.get(reportId);
        if (!permissions) {
            return false;
        }

        // 公开报表的读权限
        if (permissions.public && permission === 'read') {
            return true;
        }

        // 检查用户特定权限
        const userPermissions = permissions.users.get(userId);
        if (userPermissions && userPermissions.includes(permission)) {
            return true;
        }

        return false;
    }

    /**
     * 生成分享链接
     */
    generateShareLink(reportId) {
        const token = this.generateToken();
        return `${window.location.origin}/report/share/${reportId}?token=${token}`;
    }

    /**
     * 保存为模板
     */
    saveAsTemplate(reportId, templateConfig) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const template = {
            id: this.generateId(),
            name: templateConfig.name || `${report.name} 模板`,
            description: templateConfig.description || '',
            category: templateConfig.category || 'custom',
            thumbnail: templateConfig.thumbnail || null,
            config: {
                reportType: report.reportType,
                dimensions: report.dimensions,
                metrics: report.metrics,
                filters: report.filters,
                chartType: report.chartType,
                layout: report.layout
            },
            isPublic: templateConfig.isPublic || false,
            createdBy: report.owner,
            createdAt: new Date().toISOString(),
            usageCount: 0
        };

        this.templates.push(template);

        return template;
    }

    /**
     * 获取模板列表
     */
    getTemplates(filter = {}) {
        let filtered = [...this.templates];

        if (filter.category) {
            filtered = filtered.filter(t => t.category === filter.category);
        }

        if (filter.isPublic !== undefined) {
            filtered = filtered.filter(t => t.isPublic === filter.isPublic);
        }

        if (filter.createdBy) {
            filtered = filtered.filter(t => t.createdBy === filter.createdBy);
        }

        // 按使用次数排序
        if (filter.sortBy === 'popular') {
            filtered.sort((a, b) => b.usageCount - a.usageCount);
        }

        return filtered;
    }

    /**
     * 从模板创建报表
     */
    createFromTemplate(templateId, reportName) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) {
            throw new Error(`模板不存在: ${templateId}`);
        }

        // 增加使用次数
        template.usageCount++;

        const report = {
            id: this.generateId(),
            name: reportName || `${template.name} - 副本`,
            ...template.config,
            owner: 'current_user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'DRAFT',
            templateId: templateId
        };

        return report;
    }

    /**
     * 复制报表
     */
    copyReport(reportId, newName, copyOptions = {}) {
        const original = this.getReportById(reportId);
        if (!original) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const copy = {
            ...JSON.parse(JSON.stringify(original)),
            id: this.generateId(),
            name: newName || `${original.name} (副本)`,
            owner: copyOptions.owner || 'current_user',
            isPublic: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'DRAFT',
            copiedFrom: reportId
        };

        // 是否复制数据
        if (!copyOptions.copyData) {
            delete copy.data;
        }

        this.savedReports.push(copy);

        return copy;
    }

    /**
     * 编辑报表
     */
    editReport(reportId, updates) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        // 创建版本历史
        if (!report.history) {
            report.history = [];
        }

        report.history.push({
            version: report.version,
            snapshot: JSON.parse(JSON.stringify(report)),
            updatedAt: report.updatedAt
        });

        // 应用更新
        Object.assign(report, updates, {
            version: (report.version || 0) + 1,
            updatedAt: new Date().toISOString()
        });

        return report;
    }

    /**
     * 恢复历史版本
     */
    restoreVersion(reportId, version) {
        const report = this.getReportById(reportId);
        if (!report || !report.history) {
            throw new Error(`报表或历史版本不存在: ${reportId}`);
        }

        const historyItem = report.history.find(h => h.version === version);
        if (!historyItem) {
            throw new Error(`版本不存在: ${version}`);
        }

        // 保存当前版本到历史
        report.history.push({
            version: report.version,
            snapshot: JSON.parse(JSON.stringify(report)),
            updatedAt: report.updatedAt
        });

        // 恢复历史版本
        Object.assign(report, historyItem.snapshot, {
            version: (report.version || 0) + 1,
            updatedAt: new Date().toISOString(),
            restoredFrom: version
        });

        return report;
    }

    /**
     * 获取报表历史
     */
    getReportHistory(reportId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        return report.history || [];
    }

    /**
     * 添加到收藏
     */
    addToFavorites(reportId, userId = 'current_user') {
        const key = `${userId}:${reportId}`;
        this.favorites.add(key);

        const report = this.getReportById(reportId);
        if (report) {
            report.favoriteCount = (report.favoriteCount || 0) + 1;
        }

        return true;
    }

    /**
     * 从收藏移除
     */
    removeFromFavorites(reportId, userId = 'current_user') {
        const key = `${userId}:${reportId}`;
        const removed = this.favorites.delete(key);

        if (removed) {
            const report = this.getReportById(reportId);
            if (report && report.favoriteCount > 0) {
                report.favoriteCount--;
            }
        }

        return removed;
    }

    /**
     * 检查是否收藏
     */
    isFavorite(reportId, userId = 'current_user') {
        const key = `${userId}:${reportId}`;
        return this.favorites.has(key);
    }

    /**
     * 获取收藏列表
     */
    getFavorites(userId = 'current_user') {
        const favoriteReportIds = [];
        this.favorites.forEach(key => {
            if (key.startsWith(`${userId}:`)) {
                const reportId = key.split(':')[1];
                favoriteReportIds.push(reportId);
            }
        });

        return this.savedReports.filter(r => favoriteReportIds.includes(r.id));
    }

    /**
     * 获取我的报表
     */
    getMyReports(userId = 'current_user') {
        return this.savedReports.filter(r => r.owner === userId);
    }

    /**
     * 获取共享给我的报表
     */
    getSharedWithMe(userId = 'current_user') {
        const sharedReportIds = [];

        this.sharedReports.forEach(share => {
            if (share.shareType === 'public' || 
                (share.sharedWith && share.sharedWith.includes(userId))) {
                sharedReportIds.push(share.reportId);
            }
        });

        return this.savedReports.filter(r => sharedReportIds.includes(r.id));
    }

    /**
     * 获取公开报表
     */
    getPublicReports() {
        return this.savedReports.filter(r => r.isPublic);
    }

    /**
     * 获取报表
     */
    getReportById(reportId) {
        return this.savedReports.find(r => r.id === reportId);
    }

    /**
     * 删除报表
     */
    deleteReport(reportId, userId = 'current_user') {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        // 检查权限
        if (report.owner !== userId) {
            throw new Error('没有权限删除此报表');
        }

        // 删除报表
        const index = this.savedReports.findIndex(r => r.id === reportId);
        if (index !== -1) {
            this.savedReports.splice(index, 1);
        }

        // 删除共享信息
        this.unshareReport(reportId);

        // 从收藏中移除
        this.favorites.forEach(key => {
            if (key.endsWith(`:${reportId}`)) {
                this.favorites.delete(key);
            }
        });

        return true;
    }

    /**
     * 搜索报表
     */
    searchReports(keyword, userId = 'current_user') {
        const lowerKeyword = keyword.toLowerCase();

        return this.savedReports.filter(r => {
            // 检查访问权限
            const hasAccess = r.owner === userId || 
                             r.isPublic || 
                             this.checkPermission(r.id, userId, 'read');

            if (!hasAccess) {
                return false;
            }

            // 搜索匹配
            return r.name.toLowerCase().includes(lowerKeyword) ||
                   (r.description && r.description.toLowerCase().includes(lowerKeyword));
        });
    }

    /**
     * 获取报表统计
     */
    getReportStatistics(userId = 'current_user') {
        const myReports = this.getMyReports(userId);
        const sharedWithMe = this.getSharedWithMe(userId);
        const favorites = this.getFavorites(userId);

        return {
            total: this.savedReports.length,
            myReports: myReports.length,
            sharedWithMe: sharedWithMe.length,
            favorites: favorites.length,
            public: this.getPublicReports().length,
            templates: this.templates.length,
            byType: {
                TABLE: myReports.filter(r => r.reportType === 'TABLE').length,
                CHART: myReports.filter(r => r.reportType === 'CHART').length,
                DASHBOARD: myReports.filter(r => r.reportType === 'DASHBOARD').length
            },
            recentlyUpdated: myReports
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
        };
    }

    /**
     * 导出报表配置
     */
    exportReport(reportId) {
        const report = this.getReportById(reportId);
        if (!report) {
            throw new Error(`报表不存在: ${reportId}`);
        }

        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            report: JSON.parse(JSON.stringify(report))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.name}.json`;
        link.click();
        URL.revokeObjectURL(url);

        return exportData;
    }

    /**
     * 导入报表配置
     */
    importReport(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.report) {
                        throw new Error('无效的报表配置文件');
                    }

                    const report = {
                        ...data.report,
                        id: this.generateId(),
                        owner: 'current_user',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        status: 'DRAFT',
                        importedAt: new Date().toISOString()
                    };

                    this.savedReports.push(report);
                    resolve(report);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('读取文件失败'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * 生成ID
     */
    generateId() {
        return 'RPT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 生成Token
     */
    generateToken() {
        return Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    /**
     * 批量操作
     */
    batchOperation(reportIds, operation, params = {}) {
        const results = [];

        reportIds.forEach(reportId => {
            try {
                let result;
                switch (operation) {
                    case 'delete':
                        result = this.deleteReport(reportId, params.userId);
                        break;
                    case 'share':
                        result = this.shareReport(reportId, params.shareConfig);
                        break;
                    case 'unshare':
                        result = this.unshareReport(reportId);
                        break;
                    case 'favorite':
                        result = this.addToFavorites(reportId, params.userId);
                        break;
                    case 'unfavorite':
                        result = this.removeFromFavorites(reportId, params.userId);
                        break;
                    default:
                        throw new Error(`不支持的操作: ${operation}`);
                }

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
        });

        return results;
    }

    /**
     * 清理过期共享
     */
    cleanupExpiredShares() {
        const now = new Date();
        const expired = [];

        this.sharedReports.forEach((share, index) => {
            if (share.expiresAt && new Date(share.expiresAt) < now) {
                expired.push(index);
                this.unshareReport(share.reportId);
            }
        });

        return expired.length;
    }
}

// 导出服务实例
window.ReportSharingService = ReportSharingService;
