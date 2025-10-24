/**
 * 外部数据接入服务
 */

class ExternalDataService {
    constructor() {
        this.connections = [];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await this.loadMockData();
        this.initialized = true;
    }

    async loadMockData() {
        this.connections = [
            {
                id: 'E001',
                name: '教育部学籍数据接入',
                type: 'API',
                datasource: '教育部学籍系统',
                frequency: '每日',
                lastSync: '2024-10-23 06:00:00',
                nextSync: '2024-10-24 06:00:00',
                status: 'running',
                syncCount: 15000,
                errorCount: 0,
                createTime: '2024-01-15 10:00:00'
            },
            {
                id: 'E002',
                name: '财政系统预算数据',
                type: 'API',
                datasource: '财政厅预算系统',
                frequency: '每周',
                lastSync: '2024-10-21 08:00:00',
                nextSync: '2024-10-28 08:00:00',
                status: 'running',
                syncCount: 500,
                errorCount: 0,
                createTime: '2024-01-20 11:00:00'
            },
            {
                id: 'E003',
                name: '银行对账单导入',
                type: 'file',
                datasource: '工商银行',
                frequency: '每月',
                lastSync: '2024-10-01 09:00:00',
                nextSync: '2024-11-01 09:00:00',
                status: 'running',
                syncCount: 2000,
                errorCount: 5,
                createTime: '2024-02-01 14:00:00'
            },
            {
                id: 'E004',
                name: '科研管理系统对接',
                type: 'system',
                datasource: '科研管理系统',
                frequency: '实时',
                lastSync: '2024-10-23 10:30:00',
                nextSync: '-',
                status: 'running',
                syncCount: 1200,
                errorCount: 0,
                createTime: '2024-02-15 09:00:00'
            },
            {
                id: 'E005',
                name: '采购平台数据同步',
                type: 'API',
                datasource: '政府采购平台',
                frequency: '每日',
                lastSync: '2024-10-22 18:00:00',
                nextSync: '2024-10-23 18:00:00',
                status: 'failed',
                syncCount: 800,
                errorCount: 15,
                createTime: '2024-03-01 10:00:00'
            },
            {
                id: 'E006',
                name: '人事系统数据接入',
                type: 'system',
                datasource: '人事管理系统',
                frequency: '每日',
                lastSync: '2024-10-23 07:00:00',
                nextSync: '2024-10-24 07:00:00',
                status: 'running',
                syncCount: 800,
                errorCount: 0,
                createTime: '2024-03-10 11:00:00'
            },
            {
                id: 'E007',
                name: '资产管理系统对接',
                type: 'system',
                datasource: '资产管理系统',
                frequency: '每周',
                lastSync: '2024-10-20 10:00:00',
                nextSync: '2024-10-27 10:00:00',
                status: 'stopped',
                syncCount: 5000,
                errorCount: 0,
                createTime: '2024-03-15 14:00:00'
            }
        ];
    }

    getConnections(filters = {}) {
        let data = [...this.connections];
        
        if (filters.type && filters.type !== 'all') {
            data = data.filter(c => c.type === filters.type);
        }
        
        if (filters.status) {
            data = data.filter(c => c.status === filters.status);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(c => 
                c.name.toLowerCase().includes(search) ||
                c.datasource.toLowerCase().includes(search)
            );
        }
        
        return data;
    }

    getStatistics() {
        const today = '2024-10-23';
        return {
            totalCount: this.connections.length,
            runningCount: this.connections.filter(c => c.status === 'running').length,
            todaySyncCount: this.connections.filter(c => c.lastSync.startsWith(today)).length,
            failedCount: this.connections.filter(c => c.status === 'failed').length
        };
    }
}

window.externalDataService = new ExternalDataService();
