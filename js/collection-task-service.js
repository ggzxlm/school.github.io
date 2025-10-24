/**
 * 采集任务管理服务
 * Collection Task Management Service
 */

class CollectionTaskService {
    constructor() {
        this.storageKey = 'collection_tasks';
        this.executionStorageKey = 'task_executions';
        this.schedulerTimer = null;
        this.runningTasks = new Map(); // taskId -> execution info
        this.init();
    }

    init() {
        // 初始化存储
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.executionStorageKey)) {
            localStorage.setItem(this.executionStorageKey, JSON.stringify([]));
        }
        
        // 启动调度器
        this.startScheduler();
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * 生成执行ID
     */
    generateExecutionId() {
        return 'exec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * 获取所有采集任务
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return JSON.parse(data) || [];
        } catch (error) {
            console.error('获取采集任务列表失败:', error);
            return [];
        }
    }

    /**
     * 根据ID获取采集任务
     */
    getById(id) {
        const tasks = this.getAll();
        return tasks.find(task => task.id === id);
    }

    /**
     * 创建采集任务
     */
    create(task) {
        try {
            const tasks = this.getAll();
            
            // 验证数据源是否存在
            if (window.dataSourceService) {
                const dataSource = window.dataSourceService.getById(task.dataSourceId);
                if (!dataSource) {
                    return { success: false, error: '数据源不存在' };
                }
            }

            const newTask = {
                id: this.generateId(),
                dataSourceId: task.dataSourceId,
                taskName: task.taskName,
                taskType: task.taskType, // 'FULL', 'INCREMENTAL', 'CDC'
                schedule: task.schedule, // Cron表达式
                query: task.query || '', // SQL查询或API路径
                incrementalField: task.incrementalField || null, // 增量字段
                lastValue: task.lastValue || null, // 上次采集的最大值
                status: 'STOPPED', // 'RUNNING', 'STOPPED', 'ERROR'
                enabled: task.enabled !== false, // 是否启用
                retryCount: 0,
                maxRetries: task.maxRetries || 3,
                retryInterval: task.retryInterval || 5 * 60 * 1000, // 5分钟
                lastExecutionTime: null,
                lastExecutionStatus: null,
                nextExecutionTime: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // 计算下次执行时间
            if (newTask.enabled && newTask.schedule) {
                newTask.nextExecutionTime = this.calculateNextExecution(newTask.schedule);
            }

            tasks.push(newTask);
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            
            console.log('[采集任务] 创建成功:', newTask.taskName);
            return { success: true, data: newTask };
        } catch (error) {
            console.error('创建采集任务失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 更新采集任务
     */
    update(id, updates) {
        try {
            const tasks = this.getAll();
            const index = tasks.findIndex(task => task.id === id);
            
            if (index === -1) {
                return { success: false, error: '采集任务不存在' };
            }

            tasks[index] = {
                ...tasks[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            // 重新计算下次执行时间
            if (tasks[index].enabled && tasks[index].schedule) {
                tasks[index].nextExecutionTime = this.calculateNextExecution(tasks[index].schedule);
            } else {
                tasks[index].nextExecutionTime = null;
            }

            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            
            console.log('[采集任务] 更新成功:', tasks[index].taskName);
            return { success: true, data: tasks[index] };
        } catch (error) {
            console.error('更新采集任务失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 删除采集任务
     */
    delete(id) {
        try {
            // 如果任务正在运行，先停止
            if (this.runningTasks.has(id)) {
                this.stopTask(id);
            }

            const tasks = this.getAll();
            const filtered = tasks.filter(task => task.id !== id);
            
            if (filtered.length === tasks.length) {
                return { success: false, error: '采集任务不存在' };
            }

            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            
            console.log('[采集任务] 删除成功');
            return { success: true };
        } catch (error) {
            console.error('删除采集任务失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 计算下次执行时间（简化的Cron解析）
     */
    calculateNextExecution(cronExpression) {
        // 简化实现：支持常见的Cron表达式
        // 格式: 分 时 日 月 周
        // 示例: "0 */5 * * *" 表示每5小时执行一次
        // 示例: "0 0 * * *" 表示每天0点执行
        
        const now = new Date();
        const next = new Date(now);

        // 简单解析：如果包含 */数字，表示间隔
        if (cronExpression.includes('*/')) {
            const match = cronExpression.match(/\*\/(\d+)/);
            if (match) {
                const interval = parseInt(match[1]);
                // 假设是分钟间隔
                if (cronExpression.startsWith('*/')) {
                    next.setMinutes(next.getMinutes() + interval);
                } else {
                    // 假设是小时间隔
                    next.setHours(next.getHours() + interval);
                }
            }
        } else if (cronExpression === '0 0 * * *') {
            // 每天0点
            next.setDate(next.getDate() + 1);
            next.setHours(0, 0, 0, 0);
        } else {
            // 默认5分钟后
            next.setMinutes(next.getMinutes() + 5);
        }

        return next.toISOString();
    }

    /**
     * 执行采集任务
     */
    async executeTask(taskId, isManual = false) {
        const task = this.getById(taskId);
        if (!task) {
            return { success: false, error: '采集任务不存在' };
        }

        // 检查是否已在运行
        if (this.runningTasks.has(taskId)) {
            return { success: false, error: '任务正在运行中' };
        }

        // 创建执行记录
        const execution = {
            id: this.generateExecutionId(),
            taskId: taskId,
            taskName: task.taskName,
            taskType: task.taskType,
            startTime: new Date().toISOString(),
            endTime: null,
            status: 'RUNNING', // 'RUNNING', 'SUCCESS', 'FAILED'
            recordsCollected: 0,
            recordsFailed: 0,
            errorMessage: null,
            errorStack: null,
            retryAttempt: task.retryCount,
            isManual: isManual
        };

        // 保存执行记录
        this.saveExecution(execution);

        // 标记任务为运行中
        this.runningTasks.set(taskId, execution);
        this.update(taskId, { 
            status: 'RUNNING',
            lastExecutionTime: execution.startTime
        });

        console.log('[采集任务] 开始执行:', task.taskName);

        try {
            // 执行数据采集
            const result = await this.performCollection(task, execution);

            // 更新执行记录
            execution.endTime = new Date().toISOString();
            execution.status = 'SUCCESS';
            execution.recordsCollected = result.recordsCollected;
            execution.recordsFailed = result.recordsFailed;

            // 更新任务状态
            const updates = {
                status: 'STOPPED',
                lastExecutionStatus: 'SUCCESS',
                retryCount: 0,
                lastExecutionTime: execution.endTime
            };

            // 如果是增量采集，更新lastValue
            if (task.taskType === 'INCREMENTAL' && result.lastValue) {
                updates.lastValue = result.lastValue;
            }

            // 计算下次执行时间
            if (task.enabled && task.schedule) {
                updates.nextExecutionTime = this.calculateNextExecution(task.schedule);
            }

            this.update(taskId, updates);
            this.saveExecution(execution);
            this.runningTasks.delete(taskId);

            console.log('[采集任务] 执行成功:', task.taskName, '采集记录数:', result.recordsCollected);
            return { success: true, data: execution };

        } catch (error) {
            // 更新执行记录
            execution.endTime = new Date().toISOString();
            execution.status = 'FAILED';
            execution.errorMessage = error.message;
            execution.errorStack = error.stack;

            this.saveExecution(execution);
            this.runningTasks.delete(taskId);

            // 处理失败重试
            await this.handleTaskFailure(taskId, error);

            console.error('[采集任务] 执行失败:', task.taskName, error);
            return { success: false, error: error.message, data: execution };
        }
    }

    /**
     * 执行数据采集（模拟实现）
     */
    async performCollection(task, execution) {
        // 获取数据源
        const dataSource = window.dataSourceService?.getById(task.dataSourceId);
        if (!dataSource) {
            throw new Error('数据源不存在或未连接');
        }

        // 模拟采集过程
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 模拟采集结果
        const recordsCollected = Math.floor(Math.random() * 1000) + 100;
        const recordsFailed = Math.floor(Math.random() * 10);

        let lastValue = null;
        if (task.taskType === 'INCREMENTAL' && task.incrementalField) {
            // 模拟增量字段的最大值
            lastValue = new Date().toISOString();
        }

        // 模拟10%的失败率
        if (Math.random() < 0.1) {
            throw new Error('数据采集失败: 连接超时或数据格式错误');
        }

        return {
            recordsCollected,
            recordsFailed,
            lastValue
        };
    }

    /**
     * 处理任务失败
     */
    async handleTaskFailure(taskId, error) {
        const task = this.getById(taskId);
        if (!task) return;

        const newRetryCount = task.retryCount + 1;

        if (newRetryCount <= task.maxRetries) {
            // 还可以重试
            console.log(`[采集任务] 将在${task.retryInterval / 1000}秒后重试 (${newRetryCount}/${task.maxRetries})`);
            
            this.update(taskId, {
                status: 'ERROR',
                lastExecutionStatus: 'FAILED',
                retryCount: newRetryCount
            });

            // 延迟重试
            setTimeout(() => {
                this.executeTask(taskId, false);
            }, task.retryInterval);

        } else {
            // 重试次数用尽，发送告警
            console.error(`[采集任务] 重试${task.maxRetries}次后仍失败，发送告警`);
            
            this.update(taskId, {
                status: 'ERROR',
                lastExecutionStatus: 'FAILED',
                retryCount: 0 // 重置重试计数
            });

            // 发送告警通知
            this.sendFailureAlert(task, error);
        }
    }

    /**
     * 发送失败告警
     */
    sendFailureAlert(task, error) {
        const alert = {
            id: 'alert_task_' + Date.now(),
            type: 'COLLECTION_TASK_FAILED',
            level: 'HIGH',
            title: `采集任务失败: ${task.taskName}`,
            message: `任务在重试${task.maxRetries}次后仍然失败。错误信息: ${error.message}`,
            taskId: task.id,
            taskName: task.taskName,
            errorMessage: error.message,
            errorStack: error.stack,
            timestamp: new Date().toISOString()
        };

        // 保存告警
        if (window.dataSourceService) {
            window.dataSourceService.saveAlert(alert);
            window.dataSourceService.notifyAlert(alert);
        }

        console.error('[告警]', alert);
    }

    /**
     * 停止采集任务
     */
    stopTask(taskId) {
        try {
            const task = this.getById(taskId);
            if (!task) {
                return { success: false, error: '采集任务不存在' };
            }

            // 从运行列表中移除
            this.runningTasks.delete(taskId);

            // 更新任务状态
            this.update(taskId, { status: 'STOPPED' });

            console.log('[采集任务] 已停止:', task.taskName);
            return { success: true };
        } catch (error) {
            console.error('停止采集任务失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 启用/禁用任务
     */
    toggleTask(taskId, enabled) {
        try {
            const task = this.getById(taskId);
            if (!task) {
                return { success: false, error: '采集任务不存在' };
            }

            const updates = { enabled };
            
            if (enabled && task.schedule) {
                updates.nextExecutionTime = this.calculateNextExecution(task.schedule);
            } else {
                updates.nextExecutionTime = null;
            }

            return this.update(taskId, updates);
        } catch (error) {
            console.error('切换任务状态失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 保存执行记录
     */
    saveExecution(execution) {
        try {
            const executions = this.getExecutions();
            
            // 查找是否已存在
            const index = executions.findIndex(e => e.id === execution.id);
            if (index >= 0) {
                executions[index] = execution;
            } else {
                executions.unshift(execution);
            }

            // 只保留最近1000条记录
            if (executions.length > 1000) {
                executions.splice(1000);
            }

            localStorage.setItem(this.executionStorageKey, JSON.stringify(executions));
        } catch (error) {
            console.error('保存执行记录失败:', error);
        }
    }

    /**
     * 获取执行记录
     */
    getExecutions(taskId = null, limit = 100) {
        try {
            const data = localStorage.getItem(this.executionStorageKey);
            let executions = JSON.parse(data) || [];

            if (taskId) {
                executions = executions.filter(e => e.taskId === taskId);
            }

            return executions.slice(0, limit);
        } catch (error) {
            console.error('获取执行记录失败:', error);
            return [];
        }
    }

    /**
     * 获取任务日志
     */
    getTaskLogs(taskId, limit = 50) {
        return this.getExecutions(taskId, limit);
    }

    /**
     * 获取任务统计
     */
    getTaskStatistics(taskId) {
        const executions = this.getExecutions(taskId);
        
        const total = executions.length;
        const success = executions.filter(e => e.status === 'SUCCESS').length;
        const failed = executions.filter(e => e.status === 'FAILED').length;
        const running = executions.filter(e => e.status === 'RUNNING').length;

        const totalRecords = executions
            .filter(e => e.status === 'SUCCESS')
            .reduce((sum, e) => sum + (e.recordsCollected || 0), 0);

        const avgRecords = success > 0 ? Math.floor(totalRecords / success) : 0;

        return {
            total,
            success,
            failed,
            running,
            successRate: total > 0 ? ((success / total) * 100).toFixed(2) + '%' : '0%',
            totalRecords,
            avgRecords
        };
    }

    /**
     * 启动调度器
     */
    startScheduler() {
        if (this.schedulerTimer) {
            clearInterval(this.schedulerTimer);
        }

        // 每分钟检查一次
        this.schedulerTimer = setInterval(() => {
            this.checkScheduledTasks();
        }, 60 * 1000);

        console.log('[调度器] 已启动');
    }

    /**
     * 停止调度器
     */
    stopScheduler() {
        if (this.schedulerTimer) {
            clearInterval(this.schedulerTimer);
            this.schedulerTimer = null;
        }
        console.log('[调度器] 已停止');
    }

    /**
     * 检查需要执行的任务
     */
    checkScheduledTasks() {
        const tasks = this.getAll();
        const now = new Date();

        tasks.forEach(task => {
            if (!task.enabled || !task.nextExecutionTime) {
                return;
            }

            const nextTime = new Date(task.nextExecutionTime);
            if (now >= nextTime && task.status !== 'RUNNING') {
                console.log('[调度器] 触发定时任务:', task.taskName);
                this.executeTask(task.id, false);
            }
        });
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        const tasks = this.getAll();
        return {
            total: tasks.length,
            running: tasks.filter(t => t.status === 'RUNNING').length,
            stopped: tasks.filter(t => t.status === 'STOPPED').length,
            error: tasks.filter(t => t.status === 'ERROR').length,
            enabled: tasks.filter(t => t.enabled).length,
            disabled: tasks.filter(t => !t.enabled).length,
            byType: {
                FULL: tasks.filter(t => t.taskType === 'FULL').length,
                INCREMENTAL: tasks.filter(t => t.taskType === 'INCREMENTAL').length,
                CDC: tasks.filter(t => t.taskType === 'CDC').length
            }
        };
    }
}

// 创建全局实例
window.collectionTaskService = new CollectionTaskService();
