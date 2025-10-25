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
    
    createConnection(data) {
        try {
            // 验证必填字段
            if (!data.name || !data.type || !data.datasource || !data.syncFrequency) {
                return {
                    success: false,
                    message: '请填写所有必填字段'
                };
            }
            
            // 生成ID
            const id = 'E' + String(this.connections.length + 1).padStart(3, '0');
            
            // 创建新连接
            const newConnection = {
                id: id,
                name: data.name,
                type: data.type,
                datasource: data.datasource,
                description: data.description || '',
                frequency: data.frequency,
                syncFrequency: data.syncFrequency,
                targetTable: data.targetTable || '',
                config: data.config || {},
                lastSync: '-',
                nextSync: this.calculateNextSync(data.syncFrequency),
                status: data.autoStart ? 'running' : 'stopped',
                syncCount: 0,
                errorCount: 0,
                createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            
            // 添加到列表
            this.connections.push(newConnection);
            
            // 保存到localStorage（可选）
            this.saveToStorage();
            
            console.log('[外部数据接入] 创建成功:', newConnection);
            
            return {
                success: true,
                data: newConnection
            };
        } catch (error) {
            console.error('[外部数据接入] 创建失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    calculateNextSync(frequency) {
        const now = new Date();
        let next = new Date(now);
        
        switch (frequency) {
            case 'realtime':
                return '-';
            case 'hourly':
                next.setHours(next.getHours() + 1);
                break;
            case 'daily':
                next.setDate(next.getDate() + 1);
                break;
            case 'weekly':
                next.setDate(next.getDate() + 7);
                break;
            case 'monthly':
                next.setMonth(next.getMonth() + 1);
                break;
            case 'manual':
                return '-';
            default:
                return '-';
        }
        
        return next.toISOString().replace('T', ' ').substring(0, 19);
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('external_data_connections', JSON.stringify(this.connections));
        } catch (error) {
            console.error('[外部数据接入] 保存失败:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const data = localStorage.getItem('external_data_connections');
            if (data) {
                this.connections = JSON.parse(data);
                return true;
            }
        } catch (error) {
            console.error('[外部数据接入] 加载失败:', error);
        }
        return false;
    }
    
    getConnectionById(id) {
        return this.connections.find(c => c.id === id);
    }
    
    updateConnection(id, data) {
        const index = this.connections.findIndex(c => c.id === id);
        if (index === -1) {
            return {
                success: false,
                message: '接入不存在'
            };
        }
        
        this.connections[index] = {
            ...this.connections[index],
            ...data,
            updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        this.saveToStorage();
        
        return {
            success: true,
            data: this.connections[index]
        };
    }
    
    deleteConnection(id) {
        const index = this.connections.findIndex(c => c.id === id);
        if (index === -1) {
            return {
                success: false,
                message: '接入不存在'
            };
        }
        
        this.connections.splice(index, 1);
        this.saveToStorage();
        
        return {
            success: true
        };
    }
}

window.externalDataService = new ExternalDataService();
