/**
 * 数据源管理服务
 * Data Source Management Service
 */

class DataSourceService {
    constructor() {
        this.storageKey = 'datasources';
        this.healthCheckInterval = 5 * 60 * 1000; // 5分钟
        this.healthCheckTimer = null;
        this.init();
    }

    init() {
        // 初始化存储
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
            // 初始化示例数据
            this.initSampleData();
        }
        // 启动健康检查
        this.startHealthCheck();
    }

    /**
     * 初始化示例数据
     */
    initSampleData() {
        const sampleDataSources = [
            {
                name: '财务系统API',
                type: 'API',
                config: {
                    apiUrl: 'https://finance.university.edu.cn/api',
                    apiKey: 'sample-api-key-12345',
                    method: 'GET'
                }
            },
            {
                name: '人事数据库',
                type: 'DATABASE',
                config: {
                    dbType: 'mysql',
                    host: 'hr-db.university.edu.cn',
                    port: 3306,
                    database: 'hr_system',
                    username: 'readonly_user',
                    password: '********'
                }
            },
            {
                name: '采购数据文件',
                type: 'FILE',
                config: {
                    filePath: '/data/procurement/monthly_report.csv',
                    format: 'csv',
                    encoding: 'utf-8'
                }
            }
        ];

        sampleDataSources.forEach(ds => {
            this.create(ds);
        });

        console.log('[数据源服务] 已初始化示例数据');
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'ds_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 获取所有数据源
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return JSON.parse(data) || [];
        } catch (error) {
            console.error('获取数据源列表失败:', error);
            return [];
        }
    }

    /**
     * 根据ID获取数据源
     */
    getById(id) {
        const dataSources = this.getAll();
        return dataSources.find(ds => ds.id === id);
    }

    /**
     * 创建数据源
     */
    create(dataSource) {
        try {
            const dataSources = this.getAll();
            const newDataSource = {
                id: this.generateId(),
                name: dataSource.name,
                type: dataSource.type, // 'API', 'DATABASE', 'FILE'
                config: dataSource.config,
                status: 'INACTIVE', // 'ACTIVE', 'INACTIVE', 'ERROR'
                lastSyncTime: null,
                lastCheckTime: null,
                errorMessage: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            dataSources.push(newDataSource);
            localStorage.setItem(this.storageKey, JSON.stringify(dataSources));
            return { success: true, data: newDataSource };
        } catch (error) {
            console.error('创建数据源失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 更新数据源
     */
    update(id, updates) {
        try {
            const dataSources = this.getAll();
            const index = dataSources.findIndex(ds => ds.id === id);
            if (index === -1) {
                return { success: false, error: '数据源不存在' };
            }
            dataSources[index] = {
                ...dataSources[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataSources));
            return { success: true, data: dataSources[index] };
        } catch (error) {
            console.error('更新数据源失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 删除数据源
     */
    delete(id) {
        try {
            const dataSources = this.getAll();
            const filtered = dataSources.filter(ds => ds.id !== id);
            if (filtered.length === dataSources.length) {
                return { success: false, error: '数据源不存在' };
            }
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            return { success: true };
        } catch (error) {
            console.error('删除数据源失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 测试连接
     */
    async testConnection(id) {
        const dataSource = this.getById(id);
        if (!dataSource) {
            return { success: false, error: '数据源不存在' };
        }

        try {
            // 模拟连接测试
            await this.simulateConnectionTest(dataSource);
            
            // 更新状态
            this.update(id, {
                status: 'ACTIVE',
                lastCheckTime: new Date().toISOString(),
                errorMessage: null
            });

            return { success: true, message: '连接测试成功' };
        } catch (error) {
            // 更新错误状态
            this.update(id, {
                status: 'ERROR',
                lastCheckTime: new Date().toISOString(),
                errorMessage: error.message
            });

            return { success: false, error: error.message };
        }
    }

    /**
     * 模拟连接测试
     */
    async simulateConnectionTest(dataSource) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟95%成功率（降低告警频率）
                if (Math.random() > 0.05) {
                    resolve();
                } else {
                    reject(new Error('连接超时或配置错误'));
                }
            }, 1000);
        });
    }

    /**
     * 获取健康状态
     */
    async getHealthStatus(id) {
        const dataSource = this.getById(id);
        if (!dataSource) {
            return { success: false, error: '数据源不存在' };
        }

        try {
            await this.simulateConnectionTest(dataSource);
            
            const healthStatus = {
                id: dataSource.id,
                name: dataSource.name,
                status: 'HEALTHY',
                lastCheckTime: new Date().toISOString(),
                responseTime: Math.floor(Math.random() * 500) + 100, // 模拟响应时间
                uptime: this.calculateUptime(dataSource)
            };

            // 更新数据源状态
            this.update(id, {
                status: 'ACTIVE',
                lastCheckTime: healthStatus.lastCheckTime,
                errorMessage: null
            });

            return { success: true, data: healthStatus };
        } catch (error) {
            const healthStatus = {
                id: dataSource.id,
                name: dataSource.name,
                status: 'UNHEALTHY',
                lastCheckTime: new Date().toISOString(),
                error: error.message
            };

            // 更新数据源状态
            this.update(id, {
                status: 'ERROR',
                lastCheckTime: healthStatus.lastCheckTime,
                errorMessage: error.message
            });

            // 发送告警
            this.sendAlert(dataSource, error.message);

            return { success: true, data: healthStatus };
        }
    }

    /**
     * 计算运行时间
     */
    calculateUptime(dataSource) {
        if (!dataSource.createdAt) return '0天';
        const created = new Date(dataSource.createdAt);
        const now = new Date();
        const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        return `${days}天`;
    }

    /**
     * 启动健康检查
     */
    startHealthCheck() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
        }

        this.healthCheckTimer = setInterval(() => {
            this.performHealthCheck();
        }, this.healthCheckInterval);

        // 立即执行一次
        this.performHealthCheck();
    }

    /**
     * 停止健康检查
     */
    stopHealthCheck() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
            this.healthCheckTimer = null;
        }
    }

    /**
     * 执行健康检查
     */
    async performHealthCheck() {
        const dataSources = this.getAll();
        console.log(`[健康检查] 开始检查 ${dataSources.length} 个数据源`);

        for (const ds of dataSources) {
            if (ds.status !== 'INACTIVE') {
                await this.getHealthStatus(ds.id);
            }
        }
    }

    /**
     * 发送告警
     */
    sendAlert(dataSource, errorMessage) {
        const alert = {
            id: 'alert_' + Date.now(),
            type: 'DATASOURCE_ERROR',
            level: 'HIGH',
            title: `数据源连接异常: ${dataSource.name}`,
            message: errorMessage,
            dataSourceId: dataSource.id,
            dataSourceName: dataSource.name,
            timestamp: new Date().toISOString()
        };

        // 存储告警
        this.saveAlert(alert);

        // 触发告警通知
        this.notifyAlert(alert);

        console.warn(`[数据源告警] ${dataSource.name}: ${errorMessage}`);
    }

    /**
     * 保存告警
     */
    saveAlert(alert) {
        try {
            const alertsKey = 'datasource_alerts';
            const alerts = JSON.parse(localStorage.getItem(alertsKey) || '[]');
            alerts.unshift(alert);
            // 只保留最近100条告警
            if (alerts.length > 100) {
                alerts.splice(100);
            }
            localStorage.setItem(alertsKey, JSON.stringify(alerts));
        } catch (error) {
            console.error('保存告警失败:', error);
        }
    }

    /**
     * 通知告警
     */
    notifyAlert(alert) {
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('datasource-alert', { detail: alert }));

        // 显示浏览器通知
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(alert.title, {
                body: alert.message,
                icon: '/favicon.svg'
            });
        }
    }

    /**
     * 获取告警列表
     */
    getAlerts(limit = 50) {
        try {
            const alertsKey = 'datasource_alerts';
            const alerts = JSON.parse(localStorage.getItem(alertsKey) || '[]');
            return alerts.slice(0, limit);
        } catch (error) {
            console.error('获取告警列表失败:', error);
            return [];
        }
    }

    /**
     * 清除告警
     */
    clearAlerts() {
        try {
            const alertsKey = 'datasource_alerts';
            localStorage.setItem(alertsKey, JSON.stringify([]));
            return { success: true };
        } catch (error) {
            console.error('清除告警失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        const dataSources = this.getAll();
        return {
            total: dataSources.length,
            active: dataSources.filter(ds => ds.status === 'ACTIVE').length,
            inactive: dataSources.filter(ds => ds.status === 'INACTIVE').length,
            error: dataSources.filter(ds => ds.status === 'ERROR').length,
            byType: {
                API: dataSources.filter(ds => ds.type === 'API').length,
                DATABASE: dataSources.filter(ds => ds.type === 'DATABASE').length,
                FILE: dataSources.filter(ds => ds.type === 'FILE').length
            }
        };
    }
}

// 创建全局实例
window.dataSourceService = new DataSourceService();
