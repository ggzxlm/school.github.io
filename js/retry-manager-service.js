/**
 * 重试管理服务
 * Retry Manager Service
 * 
 * 统一管理采集任务和CDC同步的失败重试机制
 */

class RetryManagerService {
    constructor() {
        this.storageKey = 'retry_records';
        this.retryQueue = new Map(); // taskId -> retry info
        this.init();
    }

    init() {
        // 初始化存储
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }

        console.log('[重试管理] 服务已初始化');
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'retry_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * 记录失败任务
     */
    recordFailure(taskInfo) {
        try {
            const record = {
                id: this.generateId(),
                taskId: taskInfo.taskId,
                taskName: taskInfo.taskName,
                taskType: taskInfo.taskType, // 'COLLECTION' or 'CDC'
                failureTime: new Date().toISOString(),
                errorMessage: taskInfo.errorMessage,
                errorStack: taskInfo.errorStack,
                retryAttempt: taskInfo.retryAttempt || 0,
                maxRetries: taskInfo.maxRetries || 3,
                retryInterval: taskInfo.retryInterval || 5 * 60 * 1000, // 5分钟
                status: 'PENDING', // 'PENDING', 'RETRYING', 'SUCCESS', 'FAILED'
                nextRetryTime: null,
                lastRetryTime: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // 计算下次重试时间
            if (record.retryAttempt < record.maxRetries) {
                const nextTime = new Date(Date.now() + record.retryInterval);
                record.nextRetryTime = nextTime.toISOString();
                record.status = 'PENDING';
            } else {
                record.status = 'FAILED';
            }

            // 保存记录
            const records = this.getRecords();
            records.unshift(record);

            // 只保留最近1000条记录
            if (records.length > 1000) {
                records.splice(1000);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(records));

            // 如果还可以重试，加入重试队列
            if (record.status === 'PENDING') {
                this.scheduleRetry(record);
            } else {
                // 重试次数用尽，发送告警
                this.sendFailureAlert(record);
            }

            console.log('[重试管理] 记录失败任务:', record.taskName, `(${record.retryAttempt}/${record.maxRetries})`);
            return { success: true, data: record };

        } catch (error) {
            console.error('记录失败任务失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 调度重试
     */
    scheduleRetry(record) {
        const delay = new Date(record.nextRetryTime) - new Date();
        
        if (delay <= 0) {
            // 立即重试
            this.executeRetry(record);
        } else {
            // 延迟重试
            console.log(`[重试管理] 将在${Math.floor(delay / 1000)}秒后重试: ${record.taskName}`);
            
            const timer = setTimeout(() => {
                this.executeRetry(record);
            }, delay);

            this.retryQueue.set(record.id, {
                record,
                timer
            });
        }
    }

    /**
     * 执行重试
     */
    async executeRetry(record) {
        console.log('[重试管理] 开始重试:', record.taskName, `(${record.retryAttempt + 1}/${record.maxRetries})`);

        // 更新记录状态
        this.updateRecord(record.id, {
            status: 'RETRYING',
            lastRetryTime: new Date().toISOString()
        });

        try {
            let result;

            // 根据任务类型执行重试
            if (record.taskType === 'COLLECTION') {
                result = await this.retryCollectionTask(record);
            } else if (record.taskType === 'CDC') {
                result = await this.retryCDCTask(record);
            } else {
                throw new Error('未知的任务类型: ' + record.taskType);
            }

            if (result.success) {
                // 重试成功
                console.log('[重试管理] 重试成功:', record.taskName);
                
                this.updateRecord(record.id, {
                    status: 'SUCCESS'
                });

                // 从重试队列移除
                this.retryQueue.delete(record.id);

            } else {
                // 重试失败
                throw new Error(result.error || '重试失败');
            }

        } catch (error) {
            console.error('[重试管理] 重试失败:', record.taskName, error);

            const newAttempt = record.retryAttempt + 1;

            if (newAttempt < record.maxRetries) {
                // 还可以继续重试
                const nextTime = new Date(Date.now() + record.retryInterval);
                
                this.updateRecord(record.id, {
                    status: 'PENDING',
                    retryAttempt: newAttempt,
                    nextRetryTime: nextTime.toISOString(),
                    errorMessage: error.message
                });

                // 重新调度
                const updatedRecord = this.getRecordById(record.id);
                if (updatedRecord) {
                    this.scheduleRetry(updatedRecord);
                }

            } else {
                // 重试次数用尽
                console.error(`[重试管理] 重试${record.maxRetries}次后仍失败: ${record.taskName}`);
                
                this.updateRecord(record.id, {
                    status: 'FAILED',
                    retryAttempt: newAttempt,
                    errorMessage: error.message
                });

                // 发送告警
                this.sendFailureAlert({
                    ...record,
                    retryAttempt: newAttempt,
                    errorMessage: error.message
                });

                // 从重试队列移除
                this.retryQueue.delete(record.id);
            }
        }
    }

    /**
     * 重试采集任务
     */
    async retryCollectionTask(record) {
        if (!window.collectionTaskService) {
            return { success: false, error: '采集任务服务未初始化' };
        }

        try {
            const result = await window.collectionTaskService.executeTask(record.taskId, false);
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 重试CDC同步任务
     */
    async retryCDCTask(record) {
        if (!window.cdcSyncService) {
            return { success: false, error: 'CDC同步服务未初始化' };
        }

        try {
            // 重新启动CDC同步
            const result = window.cdcSyncService.startSync(record.taskId);
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 发送失败告警
     */
    sendFailureAlert(record) {
        const alert = {
            id: 'alert_retry_' + Date.now(),
            type: 'TASK_RETRY_FAILED',
            level: 'HIGH',
            title: `任务重试失败: ${record.taskName}`,
            message: `任务在重试${record.maxRetries}次后仍然失败。\n` +
                     `任务类型: ${record.taskType}\n` +
                     `错误信息: ${record.errorMessage}\n` +
                     `首次失败时间: ${record.failureTime}\n` +
                     `最后重试时间: ${record.lastRetryTime || '未重试'}`,
            taskId: record.taskId,
            taskName: record.taskName,
            taskType: record.taskType,
            errorMessage: record.errorMessage,
            errorStack: record.errorStack,
            retryAttempts: record.retryAttempt,
            timestamp: new Date().toISOString()
        };

        // 保存告警
        if (window.dataSourceService) {
            window.dataSourceService.saveAlert(alert);
            window.dataSourceService.notifyAlert(alert);
        }

        // 记录到重试失败日志
        this.recordFailureAlert(alert);

        console.error('[告警]', alert);
    }

    /**
     * 记录失败告警
     */
    recordFailureAlert(alert) {
        try {
            const alertsKey = 'retry_failure_alerts';
            const alerts = JSON.parse(localStorage.getItem(alertsKey) || '[]');
            alerts.unshift(alert);

            // 只保留最近100条
            if (alerts.length > 100) {
                alerts.splice(100);
            }

            localStorage.setItem(alertsKey, JSON.stringify(alerts));
        } catch (error) {
            console.error('记录失败告警失败:', error);
        }
    }

    /**
     * 获取失败告警列表
     */
    getFailureAlerts(limit = 50) {
        try {
            const alertsKey = 'retry_failure_alerts';
            const alerts = JSON.parse(localStorage.getItem(alertsKey) || '[]');
            return alerts.slice(0, limit);
        } catch (error) {
            console.error('获取失败告警失败:', error);
            return [];
        }
    }

    /**
     * 获取重试记录
     */
    getRecords(taskId = null, limit = 100) {
        try {
            const data = localStorage.getItem(this.storageKey);
            let records = JSON.parse(data) || [];

            if (taskId) {
                records = records.filter(r => r.taskId === taskId);
            }

            return records.slice(0, limit);
        } catch (error) {
            console.error('获取重试记录失败:', error);
            return [];
        }
    }

    /**
     * 根据ID获取记录
     */
    getRecordById(id) {
        const records = this.getRecords();
        return records.find(r => r.id === id);
    }

    /**
     * 更新重试记录
     */
    updateRecord(id, updates) {
        try {
            const records = this.getRecords();
            const index = records.findIndex(r => r.id === id);

            if (index === -1) {
                return { success: false, error: '重试记录不存在' };
            }

            records[index] = {
                ...records[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(records));
            return { success: true, data: records[index] };

        } catch (error) {
            console.error('更新重试记录失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 取消重试
     */
    cancelRetry(recordId) {
        try {
            // 从重试队列移除
            if (this.retryQueue.has(recordId)) {
                const { timer } = this.retryQueue.get(recordId);
                clearTimeout(timer);
                this.retryQueue.delete(recordId);
            }

            // 更新记录状态
            this.updateRecord(recordId, {
                status: 'CANCELLED'
            });

            console.log('[重试管理] 取消重试:', recordId);
            return { success: true };

        } catch (error) {
            console.error('取消重试失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 手动触发重试
     */
    async manualRetry(recordId) {
        try {
            const record = this.getRecordById(recordId);
            if (!record) {
                return { success: false, error: '重试记录不存在' };
            }

            if (record.status === 'RETRYING') {
                return { success: false, error: '任务正在重试中' };
            }

            // 执行重试
            await this.executeRetry(record);

            return { success: true };

        } catch (error) {
            console.error('手动重试失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        const records = this.getRecords();
        
        return {
            total: records.length,
            pending: records.filter(r => r.status === 'PENDING').length,
            retrying: records.filter(r => r.status === 'RETRYING').length,
            success: records.filter(r => r.status === 'SUCCESS').length,
            failed: records.filter(r => r.status === 'FAILED').length,
            cancelled: records.filter(r => r.status === 'CANCELLED').length,
            successRate: records.length > 0 
                ? ((records.filter(r => r.status === 'SUCCESS').length / records.length) * 100).toFixed(2) + '%'
                : '0%',
            byTaskType: {
                COLLECTION: records.filter(r => r.taskType === 'COLLECTION').length,
                CDC: records.filter(r => r.taskType === 'CDC').length
            }
        };
    }

    /**
     * 清理旧记录
     */
    cleanupOldRecords(daysToKeep = 30) {
        try {
            const records = this.getRecords();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

            const filtered = records.filter(r => {
                const createdDate = new Date(r.createdAt);
                return createdDate >= cutoffDate;
            });

            localStorage.setItem(this.storageKey, JSON.stringify(filtered));

            const removed = records.length - filtered.length;
            console.log(`[重试管理] 清理了${removed}条旧记录`);

            return { success: true, removed };

        } catch (error) {
            console.error('清理旧记录失败:', error);
            return { success: false, error: error.message };
        }
    }
}

// 创建全局实例
window.retryManagerService = new RetryManagerService();
