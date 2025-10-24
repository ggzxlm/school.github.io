/**
 * 报表订阅服务
 * 支持报表订阅、定时生成、自动分发等功能
 */

class ReportSubscriptionService {
    constructor() {
        this.subscriptions = [];
        this.schedules = [];
        this.deliveryHistory = [];
        this.notificationChannels = this.initializeChannels();
    }

    /**
     * 初始化通知渠道
     */
    initializeChannels() {
        return [
            { id: 'email', name: '邮件', icon: 'mail', enabled: true },
            { id: 'sms', name: '短信', icon: 'message', enabled: true },
            { id: 'wechat', name: '微信', icon: 'wechat', enabled: true },
            { id: 'dingtalk', name: '钉钉', icon: 'dingtalk', enabled: true },
            { id: 'webhook', name: 'Webhook', icon: 'api', enabled: true }
        ];
    }

    /**
     * 创建订阅
     */
    createSubscription(config) {
        const subscription = {
            id: this.generateId(),
            reportId: config.reportId,
            reportName: config.reportName,
            subscriberId: config.subscriberId || 'current_user',
            subscriberName: config.subscriberName,
            frequency: config.frequency, // 'daily', 'weekly', 'monthly', 'custom'
            schedule: this.parseSchedule(config.frequency, config.scheduleConfig),
            channels: config.channels || ['email'],
            recipients: config.recipients || [],
            format: config.format || 'PDF', // 'PDF', 'EXCEL', 'IMAGE', 'HTML'
            filters: config.filters || [],
            enabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastDeliveredAt: null,
            nextDeliveryAt: this.calculateNextDelivery(config.frequency, config.scheduleConfig),
            deliveryCount: 0
        };

        this.subscriptions.push(subscription);
        this.scheduleDelivery(subscription);

        return subscription;
    }

    /**
     * 解析调度配置
     */
    parseSchedule(frequency, scheduleConfig = {}) {
        switch (frequency) {
            case 'daily':
                return {
                    type: 'daily',
                    time: scheduleConfig.time || '09:00',
                    timezone: scheduleConfig.timezone || 'Asia/Shanghai'
                };
            case 'weekly':
                return {
                    type: 'weekly',
                    dayOfWeek: scheduleConfig.dayOfWeek || 1, // 1=Monday
                    time: scheduleConfig.time || '09:00',
                    timezone: scheduleConfig.timezone || 'Asia/Shanghai'
                };
            case 'monthly':
                return {
                    type: 'monthly',
                    dayOfMonth: scheduleConfig.dayOfMonth || 1,
                    time: scheduleConfig.time || '09:00',
                    timezone: scheduleConfig.timezone || 'Asia/Shanghai'
                };
            case 'custom':
                return {
                    type: 'custom',
                    cron: scheduleConfig.cron,
                    timezone: scheduleConfig.timezone || 'Asia/Shanghai'
                };
            default:
                throw new Error(`不支持的频率: ${frequency}`);
        }
    }

    /**
     * 计算下次发送时间
     */
    calculateNextDelivery(frequency, scheduleConfig = {}) {
        const now = new Date();
        const time = scheduleConfig.time || '09:00';
        const [hours, minutes] = time.split(':').map(Number);

        let nextDelivery = new Date(now);
        nextDelivery.setHours(hours, minutes, 0, 0);

        switch (frequency) {
            case 'daily':
                if (nextDelivery <= now) {
                    nextDelivery.setDate(nextDelivery.getDate() + 1);
                }
                break;
            case 'weekly':
                const targetDay = scheduleConfig.dayOfWeek || 1;
                const currentDay = nextDelivery.getDay();
                let daysToAdd = targetDay - currentDay;
                if (daysToAdd <= 0 || (daysToAdd === 0 && nextDelivery <= now)) {
                    daysToAdd += 7;
                }
                nextDelivery.setDate(nextDelivery.getDate() + daysToAdd);
                break;
            case 'monthly':
                const targetDate = scheduleConfig.dayOfMonth || 1;
                nextDelivery.setDate(targetDate);
                if (nextDelivery <= now) {
                    nextDelivery.setMonth(nextDelivery.getMonth() + 1);
                }
                break;
            case 'custom':
                // 对于自定义cron表达式,这里简化处理
                nextDelivery.setDate(nextDelivery.getDate() + 1);
                break;
        }

        return nextDelivery.toISOString();
    }

    /**
     * 更新订阅
     */
    updateSubscription(subscriptionId, updates) {
        const subscription = this.getSubscriptionById(subscriptionId);
        if (!subscription) {
            throw new Error(`订阅不存在: ${subscriptionId}`);
        }

        // 如果更新了频率或调度配置,重新计算下次发送时间
        if (updates.frequency || updates.scheduleConfig) {
            const frequency = updates.frequency || subscription.frequency;
            const scheduleConfig = updates.scheduleConfig || subscription.schedule;
            updates.schedule = this.parseSchedule(frequency, scheduleConfig);
            updates.nextDeliveryAt = this.calculateNextDelivery(frequency, scheduleConfig);
        }

        Object.assign(subscription, updates, {
            updatedAt: new Date().toISOString()
        });

        return subscription;
    }

    /**
     * 删除订阅
     */
    deleteSubscription(subscriptionId) {
        const index = this.subscriptions.findIndex(s => s.id === subscriptionId);
        if (index !== -1) {
            this.subscriptions.splice(index, 1);
            this.cancelSchedule(subscriptionId);
            return true;
        }
        return false;
    }

    /**
     * 启用/禁用订阅
     */
    toggleSubscription(subscriptionId, enabled) {
        const subscription = this.getSubscriptionById(subscriptionId);
        if (!subscription) {
            throw new Error(`订阅不存在: ${subscriptionId}`);
        }

        subscription.enabled = enabled;
        subscription.updatedAt = new Date().toISOString();

        if (enabled) {
            this.scheduleDelivery(subscription);
        } else {
            this.cancelSchedule(subscriptionId);
        }

        return subscription;
    }

    /**
     * 调度发送
     */
    scheduleDelivery(subscription) {
        if (!subscription.enabled) {
            return;
        }

        const schedule = {
            subscriptionId: subscription.id,
            nextDeliveryAt: subscription.nextDeliveryAt,
            timerId: null
        };

        // 计算延迟时间
        const delay = new Date(subscription.nextDeliveryAt) - new Date();
        if (delay > 0) {
            schedule.timerId = setTimeout(() => {
                this.deliverReport(subscription.id);
            }, delay);
        }

        this.schedules.push(schedule);
    }

    /**
     * 取消调度
     */
    cancelSchedule(subscriptionId) {
        const index = this.schedules.findIndex(s => s.subscriptionId === subscriptionId);
        if (index !== -1) {
            const schedule = this.schedules[index];
            if (schedule.timerId) {
                clearTimeout(schedule.timerId);
            }
            this.schedules.splice(index, 1);
        }
    }

    /**
     * 发送报表
     */
    async deliverReport(subscriptionId) {
        const subscription = this.getSubscriptionById(subscriptionId);
        if (!subscription || !subscription.enabled) {
            return;
        }

        try {
            // 生成报表
            const report = await this.generateReport(subscription);

            // 通过各个渠道发送
            const deliveryResults = [];
            for (const channel of subscription.channels) {
                const result = await this.sendViaChannel(channel, subscription, report);
                deliveryResults.push(result);
            }

            // 记录发送历史
            const delivery = {
                id: this.generateId(),
                subscriptionId: subscription.id,
                reportId: subscription.reportId,
                deliveredAt: new Date().toISOString(),
                channels: subscription.channels,
                recipients: subscription.recipients,
                format: subscription.format,
                status: 'SUCCESS',
                results: deliveryResults
            };

            this.deliveryHistory.push(delivery);

            // 更新订阅信息
            subscription.lastDeliveredAt = delivery.deliveredAt;
            subscription.deliveryCount++;
            subscription.nextDeliveryAt = this.calculateNextDelivery(
                subscription.frequency,
                subscription.schedule
            );

            // 重新调度下次发送
            this.cancelSchedule(subscriptionId);
            this.scheduleDelivery(subscription);

            return delivery;
        } catch (error) {
            console.error('报表发送失败:', error);

            // 记录失败历史
            const delivery = {
                id: this.generateId(),
                subscriptionId: subscription.id,
                reportId: subscription.reportId,
                deliveredAt: new Date().toISOString(),
                status: 'FAILED',
                error: error.message
            };

            this.deliveryHistory.push(delivery);

            // 重试逻辑
            this.scheduleRetry(subscriptionId);

            throw error;
        }
    }

    /**
     * 生成报表
     */
    async generateReport(subscription) {
        // 模拟报表生成
        // 实际应用中应该调用报表服务生成报表
        return {
            reportId: subscription.reportId,
            reportName: subscription.reportName,
            format: subscription.format,
            generatedAt: new Date().toISOString(),
            data: this.generateMockReportData(),
            size: Math.floor(Math.random() * 1000000) // 模拟文件大小
        };
    }

    /**
     * 通过渠道发送
     */
    async sendViaChannel(channel, subscription, report) {
        const channelInfo = this.notificationChannels.find(c => c.id === channel);
        if (!channelInfo || !channelInfo.enabled) {
            throw new Error(`渠道不可用: ${channel}`);
        }

        // 模拟发送
        // 实际应用中应该调用相应的发送服务
        await this.simulateDelay(1000);

        return {
            channel,
            recipients: subscription.recipients,
            sentAt: new Date().toISOString(),
            status: 'SUCCESS',
            messageId: this.generateId()
        };
    }

    /**
     * 调度重试
     */
    scheduleRetry(subscriptionId, retryCount = 0) {
        if (retryCount >= 3) {
            console.error('重试次数已达上限:', subscriptionId);
            return;
        }

        const delay = Math.pow(2, retryCount) * 60000; // 指数退避: 1分钟, 2分钟, 4分钟

        setTimeout(() => {
            this.deliverReport(subscriptionId).catch(() => {
                this.scheduleRetry(subscriptionId, retryCount + 1);
            });
        }, delay);
    }

    /**
     * 手动发送
     */
    async manualDelivery(subscriptionId) {
        return await this.deliverReport(subscriptionId);
    }

    /**
     * 获取订阅
     */
    getSubscriptionById(subscriptionId) {
        return this.subscriptions.find(s => s.id === subscriptionId);
    }

    /**
     * 获取所有订阅
     */
    getAllSubscriptions(filter = {}) {
        let filtered = [...this.subscriptions];

        if (filter.subscriberId) {
            filtered = filtered.filter(s => s.subscriberId === filter.subscriberId);
        }

        if (filter.reportId) {
            filtered = filtered.filter(s => s.reportId === filter.reportId);
        }

        if (filter.frequency) {
            filtered = filtered.filter(s => s.frequency === filter.frequency);
        }

        if (filter.enabled !== undefined) {
            filtered = filtered.filter(s => s.enabled === filter.enabled);
        }

        return filtered;
    }

    /**
     * 获取我的订阅
     */
    getMySubscriptions(userId = 'current_user') {
        return this.subscriptions.filter(s => s.subscriberId === userId);
    }

    /**
     * 获取发送历史
     */
    getDeliveryHistory(subscriptionId = null, limit = 50) {
        let history = [...this.deliveryHistory];

        if (subscriptionId) {
            history = history.filter(h => h.subscriptionId === subscriptionId);
        }

        // 按时间倒序排序
        history.sort((a, b) => new Date(b.deliveredAt) - new Date(a.deliveredAt));

        return history.slice(0, limit);
    }

    /**
     * 获取订阅统计
     */
    getSubscriptionStatistics(userId = 'current_user') {
        const mySubscriptions = this.getMySubscriptions(userId);

        return {
            total: mySubscriptions.length,
            enabled: mySubscriptions.filter(s => s.enabled).length,
            disabled: mySubscriptions.filter(s => !s.enabled).length,
            byFrequency: {
                daily: mySubscriptions.filter(s => s.frequency === 'daily').length,
                weekly: mySubscriptions.filter(s => s.frequency === 'weekly').length,
                monthly: mySubscriptions.filter(s => s.frequency === 'monthly').length,
                custom: mySubscriptions.filter(s => s.frequency === 'custom').length
            },
            byFormat: {
                PDF: mySubscriptions.filter(s => s.format === 'PDF').length,
                EXCEL: mySubscriptions.filter(s => s.format === 'EXCEL').length,
                IMAGE: mySubscriptions.filter(s => s.format === 'IMAGE').length,
                HTML: mySubscriptions.filter(s => s.format === 'HTML').length
            },
            totalDeliveries: mySubscriptions.reduce((sum, s) => sum + s.deliveryCount, 0),
            recentDeliveries: this.getDeliveryHistory(null, 10)
        };
    }

    /**
     * 批量订阅
     */
    batchSubscribe(reportIds, config) {
        const results = [];

        reportIds.forEach(reportId => {
            try {
                const subscription = this.createSubscription({
                    ...config,
                    reportId
                });
                results.push({
                    reportId,
                    success: true,
                    subscription
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
     * 批量取消订阅
     */
    batchUnsubscribe(subscriptionIds) {
        const results = [];

        subscriptionIds.forEach(subscriptionId => {
            try {
                const success = this.deleteSubscription(subscriptionId);
                results.push({
                    subscriptionId,
                    success
                });
            } catch (error) {
                results.push({
                    subscriptionId,
                    success: false,
                    error: error.message
                });
            }
        });

        return results;
    }

    /**
     * 测试发送
     */
    async testDelivery(config) {
        const testSubscription = {
            id: 'TEST_' + Date.now(),
            ...config,
            enabled: true
        };

        try {
            const report = await this.generateReport(testSubscription);
            const results = [];

            for (const channel of config.channels) {
                const result = await this.sendViaChannel(channel, testSubscription, report);
                results.push(result);
            }

            return {
                success: true,
                results,
                testedAt: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                testedAt: new Date().toISOString()
            };
        }
    }

    /**
     * 获取可用渠道
     */
    getAvailableChannels() {
        return this.notificationChannels.filter(c => c.enabled);
    }

    /**
     * 配置渠道
     */
    configureChannel(channelId, config) {
        const channel = this.notificationChannels.find(c => c.id === channelId);
        if (!channel) {
            throw new Error(`渠道不存在: ${channelId}`);
        }

        Object.assign(channel, config);
        return channel;
    }

    /**
     * 生成模拟报表数据
     */
    generateMockReportData() {
        return {
            summary: {
                totalAlerts: Math.floor(Math.random() * 1000),
                totalClues: Math.floor(Math.random() * 500),
                completionRate: (Math.random() * 100).toFixed(2)
            },
            charts: [
                {
                    type: 'bar',
                    title: '预警趋势',
                    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
                }
            ]
        };
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
        return 'SUB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 导出订阅配置
     */
    exportSubscriptions(userId = 'current_user') {
        const subscriptions = this.getMySubscriptions(userId);

        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            subscriptions: subscriptions.map(s => ({
                reportId: s.reportId,
                reportName: s.reportName,
                frequency: s.frequency,
                schedule: s.schedule,
                channels: s.channels,
                recipients: s.recipients,
                format: s.format,
                filters: s.filters
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'subscriptions.json';
        link.click();
        URL.revokeObjectURL(url);

        return exportData;
    }

    /**
     * 导入订阅配置
     */
    importSubscriptions(file, userId = 'current_user') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.subscriptions) {
                        throw new Error('无效的订阅配置文件');
                    }

                    const results = [];
                    data.subscriptions.forEach(subConfig => {
                        try {
                            const subscription = this.createSubscription({
                                ...subConfig,
                                subscriberId: userId
                            });
                            results.push({
                                success: true,
                                subscription
                            });
                        } catch (error) {
                            results.push({
                                success: false,
                                error: error.message,
                                config: subConfig
                            });
                        }
                    });

                    resolve(results);
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
     * 清理过期历史
     */
    cleanupHistory(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const before = this.deliveryHistory.length;
        this.deliveryHistory = this.deliveryHistory.filter(h => 
            new Date(h.deliveredAt) > cutoffDate
        );
        const after = this.deliveryHistory.length;

        return before - after;
    }
}

// 导出服务实例
window.ReportSubscriptionService = ReportSubscriptionService;
