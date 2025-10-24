/**
 * 报表生成服务
 * 负责定时报表生成、生成历史记录、任务调度等功能
 */

class ReportGenerationService {
    constructor() {
        this.generationTasks = [];
        this.generationHistory = [];
        this.scheduledJobs = new Map();
        this.isRunning = false;
    }

    /**
     * 创建生成任务
     */
    createGenerationTask(config) {
        const task = {
            id: this.generateId(),
            reportId: config.reportId,
            reportName: config.reportName,
            schedule: config.schedule, // Cron表达式或频率配置
            frequency: config.frequency, // 'daily', 'weekly', 'monthly', 'custom'
            scheduleConfig: config.scheduleConfig || {},
            format: config.format || 'PDF',
            parameters: config.parameters || {},
            enabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastGeneratedAt: null,
            nextGenerationAt: this.calculateNextGeneration(config.frequency, config.scheduleConfig),
            generationCount: 0,
            failureCount: 0
        };

        this.generationTasks.push(task);
        
        if (task.enabled) {
            this.scheduleTask(task);
        }

        return task;
    }

    /**
     * 计算下次生成时间
     */
    calculateNextGeneration(frequency, scheduleConfig = {}) {
        const now = new Date();
        const time = scheduleConfig.time || '09:00';
        const [hours, minutes] = time.split(':').map(Number);

        let nextGeneration = new Date(now);
        nextGeneration.setHours(hours, minutes, 0, 0);

        switch (frequency) {
            case 'daily':
                if (nextGeneration <= now) {
                    nextGeneration.setDate(nextGeneration.getDate() + 1);
                }
                break;
            case 'weekly':
                const targetDay = scheduleConfig.dayOfWeek || 1;
                const currentDay = nextGeneration.getDay();
                let daysToAdd = targetDay - currentDay;
                if (daysToAdd <= 0 || (daysToAdd === 0 && nextGeneration <= now)) {
                    daysToAdd += 7;
                }
                nextGeneration.setDate(nextGeneration.getDate() + daysToAdd);
                break;
            case 'monthly':
                const targetDate = scheduleConfig.dayOfMonth || 1;
                nextGeneration.setDate(targetDate);
                if (nextGeneration <= now) {
                    nextGeneration.setMonth(nextGeneration.getMonth() + 1);
                }
                break;
            case 'custom':
                // 简化处理,实际应解析cron表达式
                nextGeneration.setDate(nextGeneration.getDate() + 1);
                break;
        }

        return nextGeneration.toISOString();
    }

    /**
     * 调度任务
     */
    scheduleTask(task) {
        if (!task.enabled) {
            return;
        }

        // 取消已存在的调度
        this.cancelSchedule(task.id);

        const delay = new Date(task.nextGenerationAt) - new Date();
        
        if (delay > 0) {
            const timerId = setTimeout(() => {
                this.executeGeneration(task.id);
            }, delay);

            this.scheduledJobs.set(task.id, {
                taskId: task.id,
                timerId,
                scheduledAt: new Date().toISOString(),
                nextRunAt: task.nextGenerationAt
            });
        }
    }

    /**
     * 取消调度
     */
    cancelSchedule(taskId) {
        const job = this.scheduledJobs.get(taskId);
        if (job && job.timerId) {
            clearTimeout(job.timerId);
            this.scheduledJobs.delete(taskId);
        }
    }

    /**
     * 执行报表生成
     */
    async executeGeneration(taskId) {
        const task = this.getTaskById(taskId);
        if (!task || !task.enabled) {
            return;
        }

        const startTime = new Date();
        const historyRecord = {
            id: this.generateId(),
            taskId: task.id,
            reportId: task.reportId,
            reportName: task.reportName,
            startTime: startTime.toISOString(),
            endTime: null,
            duration: null,
            status: 'RUNNING',
            format: task.format,
            parameters: task.parameters,
            fileSize: null,
            filePath: null,
            error: null
        };

        this.generationHistory.push(historyRecord);

        try {
            // 生成报表
            const result = await this.generateReport(task);

            const endTime = new Date();
            historyRecord.endTime = endTime.toISOString();
            historyRecord.duration = endTime - startTime;
            historyRecord.status = 'SUCCESS';
            historyRecord.fileSize = result.fileSize;
            historyRecord.filePath = result.filePath;
            historyRecord.recordCount = result.recordCount;

            // 更新任务信息
            task.lastGeneratedAt = endTime.toISOString();
            task.generationCount++;
            task.failureCount = 0; // 重置失败计数
            task.nextGenerationAt = this.calculateNextGeneration(task.frequency, task.scheduleConfig);
            task.updatedAt = endTime.toISOString();

            // 重新调度下次生成
            this.scheduleTask(task);

            return historyRecord;
        } catch (error) {
            console.error('报表生成失败:', error);

            const endTime = new Date();
            historyRecord.endTime = endTime.toISOString();
            historyRecord.duration = endTime - startTime;
            historyRecord.status = 'FAILED';
            historyRecord.error = error.message;

            // 更新失败计数
            task.failureCount++;
            task.updatedAt = endTime.toISOString();

            // 如果失败次数未超过限制,重试
            if (task.failureCount < 3) {
                this.scheduleRetry(taskId, task.failureCount);
            } else {
                // 失败次数过多,禁用任务
                task.enabled = false;
                console.error(`任务 ${taskId} 失败次数过多,已自动禁用`);
            }

            throw error;
        }
    }

    /**
     * 生成报表
     */
    async generateReport(task) {
        // 模拟报表生成过程
        await this.simulateDelay(2000);

        // 实际应用中应该:
        // 1. 查询数据
        // 2. 应用筛选条件
        // 3. 计算指标
        // 4. 渲染报表
        // 5. 导出为指定格式

        const data = this.generateMockData(task);
        const fileSize = Math.floor(Math.random() * 5000000) + 100000; // 100KB - 5MB
        const filePath = `/reports/${task.reportId}/${Date.now()}.${task.format.toLowerCase()}`;

        return {
            data,
            fileSize,
            filePath,
            recordCount: data.length,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * 生成模拟数据
     */
    generateMockData(task) {
        const recordCount = Math.floor(Math.random() * 1000) + 100;
        const data = [];

        for (let i = 0; i < recordCount; i++) {
            data.push({
                id: i + 1,
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                department: ['财务处', '科研处', '资产处', '采购中心'][Math.floor(Math.random() * 4)],
                alertCount: Math.floor(Math.random() * 50),
                clueCount: Math.floor(Math.random() * 20),
                amount: (Math.random() * 1000000).toFixed(2)
            });
        }

        return data;
    }

    /**
     * 调度重试
     */
    scheduleRetry(taskId, retryCount) {
        const task = this.getTaskById(taskId);
        if (!task) {
            return;
        }

        // 指数退避: 5分钟, 10分钟, 20分钟
        const delay = Math.pow(2, retryCount - 1) * 5 * 60 * 1000;

        setTimeout(() => {
            console.log(`重试生成任务 ${taskId}, 第 ${retryCount} 次重试`);
            this.executeGeneration(taskId);
        }, delay);
    }

    /**
     * 手动触发生成
     */
    async manualGeneration(taskId) {
        const task = this.getTaskById(taskId);
        if (!task) {
            throw new Error(`任务不存在: ${taskId}`);
        }

        return await this.executeGeneration(taskId);
    }

    /**
     * 更新任务
     */
    updateTask(taskId, updates) {
        const task = this.getTaskById(taskId);
        if (!task) {
            throw new Error(`任务不存在: ${taskId}`);
        }

        // 如果更新了调度配置,重新计算下次生成时间
        if (updates.frequency || updates.scheduleConfig) {
            const frequency = updates.frequency || task.frequency;
            const scheduleConfig = updates.scheduleConfig || task.scheduleConfig;
            updates.nextGenerationAt = this.calculateNextGeneration(frequency, scheduleConfig);
        }

        Object.assign(task, updates, {
            updatedAt: new Date().toISOString()
        });

        // 如果任务被启用,重新调度
        if (task.enabled) {
            this.scheduleTask(task);
        } else {
            this.cancelSchedule(taskId);
        }

        return task;
    }

    /**
     * 删除任务
     */
    deleteTask(taskId) {
        this.cancelSchedule(taskId);
        
        const index = this.generationTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            this.generationTasks.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 启用/禁用任务
     */
    toggleTask(taskId, enabled) {
        const task = this.getTaskById(taskId);
        if (!task) {
            throw new Error(`任务不存在: ${taskId}`);
        }

        task.enabled = enabled;
        task.updatedAt = new Date().toISOString();

        if (enabled) {
            // 重置失败计数
            task.failureCount = 0;
            this.scheduleTask(task);
        } else {
            this.cancelSchedule(taskId);
        }

        return task;
    }

    /**
     * 获取任务
     */
    getTaskById(taskId) {
        return this.generationTasks.find(t => t.id === taskId);
    }

    /**
     * 获取所有任务
     */
    getAllTasks(filter = {}) {
        let filtered = [...this.generationTasks];

        if (filter.reportId) {
            filtered = filtered.filter(t => t.reportId === filter.reportId);
        }

        if (filter.frequency) {
            filtered = filtered.filter(t => t.frequency === filter.frequency);
        }

        if (filter.enabled !== undefined) {
            filtered = filtered.filter(t => t.enabled === filter.enabled);
        }

        return filtered;
    }

    /**
     * 获取生成历史
     */
    getGenerationHistory(taskId = null, limit = 50) {
        let history = [...this.generationHistory];

        if (taskId) {
            history = history.filter(h => h.taskId === taskId);
        }

        // 按时间倒序排序
        history.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        return history.slice(0, limit);
    }

    /**
     * 获取任务统计
     */
    getTaskStatistics() {
        const tasks = this.generationTasks;
        const history = this.generationHistory;

        return {
            totalTasks: tasks.length,
            enabledTasks: tasks.filter(t => t.enabled).length,
            disabledTasks: tasks.filter(t => !t.enabled).length,
            byFrequency: {
                daily: tasks.filter(t => t.frequency === 'daily').length,
                weekly: tasks.filter(t => t.frequency === 'weekly').length,
                monthly: tasks.filter(t => t.frequency === 'monthly').length,
                custom: tasks.filter(t => t.frequency === 'custom').length
            },
            totalGenerations: history.length,
            successfulGenerations: history.filter(h => h.status === 'SUCCESS').length,
            failedGenerations: history.filter(h => h.status === 'FAILED').length,
            successRate: history.length > 0 
                ? ((history.filter(h => h.status === 'SUCCESS').length / history.length) * 100).toFixed(2)
                : 0,
            averageDuration: this.calculateAverageDuration(history),
            recentHistory: history.slice(0, 10)
        };
    }

    /**
     * 计算平均生成时长
     */
    calculateAverageDuration(history) {
        const successfulHistory = history.filter(h => h.status === 'SUCCESS' && h.duration);
        
        if (successfulHistory.length === 0) {
            return 0;
        }

        const totalDuration = successfulHistory.reduce((sum, h) => sum + h.duration, 0);
        return Math.round(totalDuration / successfulHistory.length);
    }

    /**
     * 批量创建任务
     */
    batchCreateTasks(configs) {
        const results = [];

        configs.forEach(config => {
            try {
                const task = this.createGenerationTask(config);
                results.push({
                    success: true,
                    task
                });
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message,
                    config
                });
            }
        });

        return results;
    }

    /**
     * 批量删除任务
     */
    batchDeleteTasks(taskIds) {
        const results = [];

        taskIds.forEach(taskId => {
            try {
                const success = this.deleteTask(taskId);
                results.push({
                    taskId,
                    success
                });
            } catch (error) {
                results.push({
                    taskId,
                    success: false,
                    error: error.message
                });
            }
        });

        return results;
    }

    /**
     * 获取调度状态
     */
    getScheduleStatus() {
        const jobs = [];
        
        this.scheduledJobs.forEach((job, taskId) => {
            const task = this.getTaskById(taskId);
            if (task) {
                jobs.push({
                    taskId,
                    reportName: task.reportName,
                    nextRunAt: job.nextRunAt,
                    scheduledAt: job.scheduledAt,
                    timeUntilRun: new Date(job.nextRunAt) - new Date()
                });
            }
        });

        return {
            totalScheduled: jobs.length,
            jobs: jobs.sort((a, b) => new Date(a.nextRunAt) - new Date(b.nextRunAt))
        };
    }

    /**
     * 清理历史记录
     */
    cleanupHistory(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const before = this.generationHistory.length;
        this.generationHistory = this.generationHistory.filter(h => 
            new Date(h.startTime) > cutoffDate
        );
        const after = this.generationHistory.length;

        return {
            removed: before - after,
            remaining: after
        };
    }

    /**
     * 导出任务配置
     */
    exportTasks() {
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            tasks: this.generationTasks.map(t => ({
                reportId: t.reportId,
                reportName: t.reportName,
                frequency: t.frequency,
                scheduleConfig: t.scheduleConfig,
                format: t.format,
                parameters: t.parameters
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generation-tasks.json';
        link.click();
        URL.revokeObjectURL(url);

        return exportData;
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
        return 'GEN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// 导出服务实例
window.ReportGenerationService = ReportGenerationService;
