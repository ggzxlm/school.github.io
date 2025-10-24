/**
 * 数据加载器工具
 * 为各个页面提供便捷的数据加载方法
 */

const DataLoader = {
    /**
     * 加载并渲染工作台数据
     */
    async loadDashboardData(callback) {
        try {
            const stats = await window.dataService.getDashboardStats();
            const todos = await window.dataService.getTodos();
            const alertsResult = await window.dataService.getAlerts({ status: 'unprocessed' });
            const activities = await window.dataService.getRecentActivities(6);

            if (callback) {
                callback({
                    stats,
                    todos,
                    alerts: alertsResult.data.slice(0, 5),
                    activities
                });
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            throw error;
        }
    },

    /**
     * 加载并渲染线索库数据
     */
    async loadClueLibraryData(filters = {}, sort = {}, pagination = {}, callback) {
        try {
            const result = await window.dataService.getClues(filters, sort, pagination);
            
            // 计算统计数据
            const allClues = await window.dataService.getClues();
            const stats = {
                total: allClues.total,
                pending: allClues.data.filter(c => c.status === 'pending').length,
                processing: allClues.data.filter(c => c.status === 'processing').length,
                completed: allClues.data.filter(c => c.status === 'completed').length
            };

            if (callback) {
                callback({
                    clues: result.data,
                    total: result.total,
                    stats
                });
            }
        } catch (error) {
            console.error('Failed to load clue library data:', error);
            throw error;
        }
    },

    /**
     * 加载并渲染预警中心数据
     */
    async loadAlertCenterData(filters = {}, sort = {}, pagination = {}, callback) {
        try {
            const result = await window.dataService.getAlerts(filters, sort, pagination);
            
            // 计算统计数据
            const allAlerts = await window.dataService.getAlerts();
            const stats = {
                total: allAlerts.total,
                unprocessed: allAlerts.data.filter(a => a.status === 'unprocessed').length,
                processing: allAlerts.data.filter(a => a.status === 'processing').length,
                completed: allAlerts.data.filter(a => a.status === 'assigned' || a.status === 'ignored').length
            };

            if (callback) {
                callback({
                    alerts: result.data,
                    total: result.total,
                    stats
                });
            }
        } catch (error) {
            console.error('Failed to load alert center data:', error);
            throw error;
        }
    },

    /**
     * 加载并渲染工单管理数据
     */
    async loadWorkOrderData(filters = {}, sort = {}, pagination = {}, callback) {
        try {
            const result = await window.dataService.getWorkOrders(filters, sort, pagination);
            
            // 计算统计数据
            const allOrders = await window.dataService.getWorkOrders();
            const stats = {
                total: allOrders.total,
                pending: allOrders.data.filter(w => w.status === 'pending').length,
                processing: allOrders.data.filter(w => w.status === 'processing').length,
                completed: allOrders.data.filter(w => w.status === 'completed').length
            };

            if (callback) {
                callback({
                    workOrders: result.data,
                    total: result.total,
                    stats
                });
            }
        } catch (error) {
            console.error('Failed to load work order data:', error);
            throw error;
        }
    },

    /**
     * 加载并渲染整改管理数据
     */
    async loadRectificationData(filters = {}, sort = {}, pagination = {}, callback) {
        try {
            const result = await window.dataService.getRectifications(filters, sort, pagination);
            
            // 计算统计数据
            const allRectifications = await window.dataService.getRectifications();
            const stats = {
                total: allRectifications.total,
                pending: allRectifications.data.filter(r => r.status === 'pending').length,
                processing: allRectifications.data.filter(r => r.status === 'processing').length,
                completed: allRectifications.data.filter(r => r.status === 'completed').length,
                overdue: allRectifications.data.filter(r => {
                    if (r.status === 'completed') return false;
                    return new Date(r.deadline) < new Date();
                }).length
            };

            if (callback) {
                callback({
                    rectifications: result.data,
                    total: result.total,
                    stats
                });
            }
        } catch (error) {
            console.error('Failed to load rectification data:', error);
            throw error;
        }
    },

    /**
     * 加载指挥中心数据
     */
    async loadCommandCenterData(callback) {
        try {
            const data = await window.dataService.getCommandCenterStats();
            
            if (callback) {
                callback(data);
            }
        } catch (error) {
            console.error('Failed to load command center data:', error);
            throw error;
        }
    },

    /**
     * 加载纪检监督数据
     */
    async loadDisciplineSupervisionData(callback) {
        try {
            const data = await window.dataService.getDisciplineSupervision();
            
            if (callback) {
                callback(data);
            }
        } catch (error) {
            console.error('Failed to load discipline supervision data:', error);
            throw error;
        }
    },

    /**
     * 加载审计监督数据
     */
    async loadAuditSupervisionData(callback) {
        try {
            const data = await window.dataService.getAuditSupervision();
            
            if (callback) {
                callback(data);
            }
        } catch (error) {
            console.error('Failed to load audit supervision data:', error);
            throw error;
        }
    },

    /**
     * 加载系统管理数据
     */
    async loadSystemManagementData(type, filters = {}, callback) {
        try {
            let data;
            
            switch (type) {
                case 'users':
                    data = await window.dataService.getUsers(filters);
                    break;
                case 'roles':
                    data = await window.dataService.getRoles();
                    break;
                case 'departments':
                    data = await window.dataService.getDepartments(filters);
                    break;
                case 'dataSources':
                    data = await window.dataService.getDataSources(filters);
                    break;
                case 'rules':
                    data = await window.dataService.getRules(filters);
                    break;
                case 'auditLogs':
                    data = await window.dataService.getAuditLogs(filters);
                    break;
                default:
                    throw new Error(`Unknown type: ${type}`);
            }
            
            if (callback) {
                callback(data);
            }
        } catch (error) {
            console.error(`Failed to load ${type} data:`, error);
            throw error;
        }
    },

    /**
     * 加载报表中心数据
     */
    async loadReportCenterData(filters = {}, callback) {
        try {
            const reports = await window.dataService.getReports(filters);
            
            if (callback) {
                callback({ reports });
            }
        } catch (error) {
            console.error('Failed to load report center data:', error);
            throw error;
        }
    }
};

// 导出到全局
window.DataLoader = DataLoader;
