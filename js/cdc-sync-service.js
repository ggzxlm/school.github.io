/**
 * CDC增量同步服务
 * CDC (Change Data Capture) Incremental Sync Service
 * 
 * 模拟Debezium/Canal的CDC变更捕获功能
 */

class CDCSyncService {
    constructor() {
        this.storageKey = 'cdc_sync_tasks';
        this.changeLogKey = 'cdc_change_logs';
        this.syncInterval = 5 * 60 * 1000; // 5分钟
        this.activeSyncTasks = new Map(); // taskId -> timer
        this.init();
    }

    init() {
        // 初始化存储
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.changeLogKey)) {
            localStorage.setItem(this.changeLogKey, JSON.stringify([]));
        }

        console.log('[CDC同步] 服务已初始化');
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'cdc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * 创建CDC同步任务
     */
    createSyncTask(config) {
        try {
            const task = {
                id: this.generateId(),
                dataSourceId: config.dataSourceId,
                taskName: config.taskName,
                tables: config.tables || [], // 监听的表列表
                operations: config.operations || ['INSERT', 'UPDATE', 'DELETE'], // 监听的操作类型
                syncInterval: config.syncInterval || this.syncInterval,
                status: 'STOPPED', // 'RUNNING', 'STOPPED', 'ERROR'
                lastSyncTime: null,
                lastChangeSequence: 0, // 最后处理的变更序号
                totalChanges: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const tasks = this.getAllTasks();
            tasks.push(task);
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));

            console.log('[CDC同步] 创建同步任务:', task.taskName);
            return { success: true, data: task };
        } catch (error) {
            console.error('创建CDC同步任务失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 获取所有CDC同步任务
     */
    getAllTasks() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return JSON.parse(data) || [];
        } catch (error) {
            console.error('获取CDC同步任务失败:', error);
            return [];
        }
    }

    /**
     * 根据ID获取任务
     */
    getTaskById(id) {
        const tasks = this.getAllTasks();
        return tasks.find(task => task.id === id);
    }

    /**
     * 更新CDC同步任务
     */
    updateTask(id, updates) {
        try {
            const tasks = this.getAllTasks();
            const index = tasks.findIndex(task => task.id === id);

            if (index === -1) {
                return { success: false, error: 'CDC同步任务不存在' };
            }

            tasks[index] = {
                ...tasks[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return { success: true, data: tasks[index] };
        } catch (error) {
            console.error('更新CDC同步任务失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 启动CDC同步
     */
    startSync(taskId) {
        try {
            const task = this.getTaskById(taskId);
            if (!task) {
                return { success: false, error: 'CDC同步任务不存在' };
            }

            if (this.activeSyncTasks.has(taskId)) {
                return { success: false, error: '同步任务已在运行中' };
            }

            // 更新任务状态
            this.updateTask(taskId, { status: 'RUNNING' });

            // 立即执行一次同步
            this.performSync(taskId);

            // 设置定时同步
            const timer = setInterval(() => {
                this.performSync(taskId);
            }, task.syncInterval);

            this.activeSyncTasks.set(taskId, timer);

            console.log('[CDC同步] 启动同步任务:', task.taskName);
            return { success: true };
        } catch (error) {
            console.error('启动CDC同步失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 停止CDC同步
     */
    stopSync(taskId) {
        try {
            const task = this.getTaskById(taskId);
            if (!task) {
                return { success: false, error: 'CDC同步任务不存在' };
            }

            // 清除定时器
            if (this.activeSyncTasks.has(taskId)) {
                clearInterval(this.activeSyncTasks.get(taskId));
                this.activeSyncTasks.delete(taskId);
            }

            // 更新任务状态
            this.updateTask(taskId, { status: 'STOPPED' });

            console.log('[CDC同步] 停止同步任务:', task.taskName);
            return { success: true };
        } catch (error) {
            console.error('停止CDC同步失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 执行同步
     */
    async performSync(taskId) {
        const task = this.getTaskById(taskId);
        if (!task) {
            console.error('[CDC同步] 任务不存在:', taskId);
            return;
        }

        const startTime = new Date();
        console.log('[CDC同步] 开始同步:', task.taskName);

        try {
            // 捕获变更数据
            const changes = await this.captureChanges(task);

            // 处理变更
            const result = await this.processChanges(task, changes);

            const endTime = new Date();
            const duration = endTime - startTime;

            // 更新任务统计
            this.updateTask(taskId, {
                lastSyncTime: endTime.toISOString(),
                lastChangeSequence: task.lastChangeSequence + changes.length,
                totalChanges: task.totalChanges + changes.length
            });

            console.log(`[CDC同步] 同步完成: ${task.taskName}, 捕获${changes.length}条变更, 耗时${duration}ms`);

            // 记录同步结果
            this.recordSyncResult(task, {
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                changesCount: changes.length,
                recordsProcessed: result.recordsProcessed,
                status: 'SUCCESS'
            });

        } catch (error) {
            console.error('[CDC同步] 同步失败:', task.taskName, error);

            // 更新任务状态为错误
            this.updateTask(taskId, { status: 'ERROR' });

            // 记录失败结果
            this.recordSyncResult(task, {
                startTime: startTime.toISOString(),
                endTime: new Date().toISOString(),
                changesCount: 0,
                recordsProcessed: 0,
                status: 'FAILED',
                errorMessage: error.message
            });

            // 停止同步
            this.stopSync(taskId);
        }
    }

    /**
     * 捕获变更数据（模拟实现）
     */
    async captureChanges(task) {
        // 模拟从数据库binlog或CDC工具捕获变更
        await new Promise(resolve => setTimeout(resolve, 500));

        // 模拟生成变更数据
        const changes = [];
        const changeCount = Math.floor(Math.random() * 50); // 随机0-50条变更

        for (let i = 0; i < changeCount; i++) {
            const table = task.tables[Math.floor(Math.random() * task.tables.length)] || 'unknown_table';
            const operation = task.operations[Math.floor(Math.random() * task.operations.length)];

            changes.push({
                id: this.generateId(),
                taskId: task.id,
                table: table,
                operation: operation, // 'INSERT', 'UPDATE', 'DELETE'
                timestamp: new Date().toISOString(),
                sequence: task.lastChangeSequence + i + 1,
                before: operation === 'DELETE' || operation === 'UPDATE' ? this.generateMockData() : null,
                after: operation === 'INSERT' || operation === 'UPDATE' ? this.generateMockData() : null
            });
        }

        return changes;
    }

    /**
     * 生成模拟数据
     */
    generateMockData() {
        return {
            id: Math.floor(Math.random() * 10000),
            name: '数据_' + Math.random().toString(36).substring(2, 8),
            value: Math.floor(Math.random() * 1000),
            updated_at: new Date().toISOString()
        };
    }

    /**
     * 处理变更数据
     */
    async processChanges(task, changes) {
        // 保存变更日志
        this.saveChangeLogs(changes);

        // 模拟处理变更（应用到目标系统）
        await new Promise(resolve => setTimeout(resolve, 300));

        // 模拟处理结果
        const recordsProcessed = changes.length;

        return {
            recordsProcessed
        };
    }

    /**
     * 保存变更日志
     */
    saveChangeLogs(changes) {
        try {
            const logs = this.getChangeLogs();
            logs.unshift(...changes);

            // 只保留最近10000条变更日志
            if (logs.length > 10000) {
                logs.splice(10000);
            }

            localStorage.setItem(this.changeLogKey, JSON.stringify(logs));
        } catch (error) {
            console.error('保存变更日志失败:', error);
        }
    }

    /**
     * 获取变更日志
     */
    getChangeLogs(taskId = null, limit = 100) {
        try {
            const data = localStorage.getItem(this.changeLogKey);
            let logs = JSON.parse(data) || [];

            if (taskId) {
                logs = logs.filter(log => log.taskId === taskId);
            }

            return logs.slice(0, limit);
        } catch (error) {
            console.error('获取变更日志失败:', error);
            return [];
        }
    }

    /**
     * 记录同步结果
     */
    recordSyncResult(task, result) {
        const syncResults = this.getSyncResults();
        
        syncResults.unshift({
            id: this.generateId(),
            taskId: task.id,
            taskName: task.taskName,
            ...result
        });

        // 只保留最近1000条结果
        if (syncResults.length > 1000) {
            syncResults.splice(1000);
        }

        try {
            localStorage.setItem('cdc_sync_results', JSON.stringify(syncResults));
        } catch (error) {
            console.error('记录同步结果失败:', error);
        }
    }

    /**
     * 获取同步结果
     */
    getSyncResults(taskId = null, limit = 50) {
        try {
            const data = localStorage.getItem('cdc_sync_results');
            let results = JSON.parse(data) || [];

            if (taskId) {
                results = results.filter(r => r.taskId === taskId);
            }

            return results.slice(0, limit);
        } catch (error) {
            console.error('获取同步结果失败:', error);
            return [];
        }
    }

    /**
     * 获取任务统计
     */
    getTaskStatistics(taskId) {
        const results = this.getSyncResults(taskId);
        
        const total = results.length;
        const success = results.filter(r => r.status === 'SUCCESS').length;
        const failed = results.filter(r => r.status === 'FAILED').length;

        const totalChanges = results
            .filter(r => r.status === 'SUCCESS')
            .reduce((sum, r) => sum + (r.changesCount || 0), 0);

        const totalRecords = results
            .filter(r => r.status === 'SUCCESS')
            .reduce((sum, r) => sum + (r.recordsProcessed || 0), 0);

        return {
            total,
            success,
            failed,
            successRate: total > 0 ? ((success / total) * 100).toFixed(2) + '%' : '0%',
            totalChanges,
            totalRecords,
            avgChangesPerSync: success > 0 ? Math.floor(totalChanges / success) : 0
        };
    }

    /**
     * 删除CDC同步任务
     */
    deleteTask(taskId) {
        try {
            // 先停止同步
            this.stopSync(taskId);

            const tasks = this.getAllTasks();
            const filtered = tasks.filter(task => task.id !== taskId);

            if (filtered.length === tasks.length) {
                return { success: false, error: 'CDC同步任务不存在' };
            }

            localStorage.setItem(this.storageKey, JSON.stringify(filtered));

            console.log('[CDC同步] 删除同步任务成功');
            return { success: true };
        } catch (error) {
            console.error('删除CDC同步任务失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        const tasks = this.getAllTasks();
        return {
            total: tasks.length,
            running: tasks.filter(t => t.status === 'RUNNING').length,
            stopped: tasks.filter(t => t.status === 'STOPPED').length,
            error: tasks.filter(t => t.status === 'ERROR').length,
            totalChanges: tasks.reduce((sum, t) => sum + (t.totalChanges || 0), 0)
        };
    }
}

// 创建全局实例
window.cdcSyncService = new CDCSyncService();
