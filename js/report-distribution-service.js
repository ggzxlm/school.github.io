/**
 * 报表分发服务
 * 支持多渠道分发(邮件、短信、即时通讯、Webhook)、失败重试等功能
 */

class ReportDistributionService {
    constructor() {
        this.channels = this.initializeChannels();
        this.distributionQueue = [];
        this.distributionHistory = [];
        this.retryQueue = [];
        this.maxRetries = 3;
        this.retryDelay = 60000; // 1分钟
    }

    /**
     * 初始化分发渠道
     */
    initializeChannels() {
        return {
            email: {
                id: 'email',
                name: '邮件',
                icon: 'mail',
                enabled: true,
                config: {
                    smtpHost: 'smtp.example.com',
                    smtpPort: 587,
                    from: 'reports@example.com',
                    useTLS: true
                },
                rateLimit: {
                    maxPerMinute: 60,
                    maxPerHour: 1000
                }
            },
            sms: {
                id: 'sms',
                name: '短信',
                icon: 'message',
                enabled: true,
                config: {
                    provider: 'aliyun',
                    apiKey: 'your-api-key',
                    signName: '监管平台'
                },
                rateLimit: {
                    maxPerMinute: 30,
                    maxPerHour: 500
                }
            },
            wechat: {
                id: 'wechat',
                name: '微信',
                icon: 'wechat',
                enabled: true,
                config: {
                    appId: 'your-app-id',
                    appSecret: 'your-app-secret',
                    templateId: 'your-template-id'
                },
                rateLimit: {
                    maxPerMinute: 100,
                    maxPerHour: 2000
                }
            },
            dingtalk: {
                id: 'dingtalk',
                name: '钉钉',
                icon: 'dingtalk',
                enabled: true,
                config: {
                    webhook: 'https://oapi.dingtalk.com/robot/send?access_token=xxx',
                    secret: 'your-secret'
                },
                rateLimit: {
                    maxPerMinute: 20,
                    maxPerHour: 500
                }
            },
            webhook: {
                id: 'webhook',
                name: 'Webhook',
                icon: 'api',
                enabled: true,
                config: {
                    url: '',
                    method: 'POST',
                    headers: {},
                    timeout: 30000
                },
                rateLimit: {
                    maxPerMinute: 60,
                    maxPerHour: 1000
                }
            }
        };
    }

    /**
     * 分发报表
     */
    async distributeReport(config) {
        const distribution = {
            id: this.generateId(),
            reportId: config.reportId,
            reportName: config.reportName,
            reportFile: config.reportFile,
            channels: config.channels || ['email'],
            recipients: config.recipients || [],
            subject: config.subject || `报表: ${config.reportName}`,
            message: config.message || '',
            attachments: config.attachments || [],
            priority: config.priority || 'NORMAL', // HIGH, NORMAL, LOW
            scheduledAt: config.scheduledAt || new Date().toISOString(),
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            results: []
        };

        this.distributionQueue.push(distribution);

        try {
            await this.processDistribution(distribution);
            return distribution;
        } catch (error) {
            console.error('分发失败:', error);
            throw error;
        }
    }

    /**
     * 处理分发
     */
    async processDistribution(distribution) {
        distribution.status = 'PROCESSING';
        distribution.startedAt = new Date().toISOString();

        const results = [];

        for (const channelId of distribution.channels) {
            const channel = this.channels[channelId];
            
            if (!channel || !channel.enabled) {
                results.push({
                    channel: channelId,
                    status: 'SKIPPED',
                    reason: '渠道未启用',
                    timestamp: new Date().toISOString()
                });
                continue;
            }

            try {
                const result = await this.sendViaChannel(channelId, distribution);
                results.push(result);
            } catch (error) {
                results.push({
                    channel: channelId,
                    status: 'FAILED',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        distribution.results = results;
        distribution.completedAt = new Date().toISOString();
        
        // 检查是否所有渠道都成功
        const allSuccess = results.every(r => r.status === 'SUCCESS');
        const anySuccess = results.some(r => r.status === 'SUCCESS');
        
        if (allSuccess) {
            distribution.status = 'SUCCESS';
        } else if (anySuccess) {
            distribution.status = 'PARTIAL_SUCCESS';
        } else {
            distribution.status = 'FAILED';
            // 加入重试队列
            this.addToRetryQueue(distribution);
        }

        // 记录到历史
        this.distributionHistory.push(distribution);

        return distribution;
    }

    /**
     * 通过指定渠道发送
     */
    async sendViaChannel(channelId, distribution) {
        const channel = this.channels[channelId];
        const startTime = new Date();

        try {
            let result;

            switch (channelId) {
                case 'email':
                    result = await this.sendEmail(distribution, channel);
                    break;
                case 'sms':
                    result = await this.sendSMS(distribution, channel);
                    break;
                case 'wechat':
                    result = await this.sendWechat(distribution, channel);
                    break;
                case 'dingtalk':
                    result = await this.sendDingtalk(distribution, channel);
                    break;
                case 'webhook':
                    result = await this.sendWebhook(distribution, channel);
                    break;
                default:
                    throw new Error(`不支持的渠道: ${channelId}`);
            }

            const endTime = new Date();

            return {
                channel: channelId,
                status: 'SUCCESS',
                messageId: result.messageId,
                recipients: distribution.recipients,
                sentAt: endTime.toISOString(),
                duration: endTime - startTime,
                details: result.details
            };
        } catch (error) {
            const endTime = new Date();

            return {
                channel: channelId,
                status: 'FAILED',
                error: error.message,
                timestamp: endTime.toISOString(),
                duration: endTime - startTime
            };
        }
    }

    /**
     * 发送邮件
     */
    async sendEmail(distribution, channel) {
        // 模拟邮件发送
        await this.simulateDelay(1000);

        // 实际应用中应该使用nodemailer或类似库
        console.log('发送邮件:', {
            from: channel.config.from,
            to: distribution.recipients,
            subject: distribution.subject,
            body: distribution.message,
            attachments: distribution.attachments
        });

        return {
            messageId: this.generateMessageId('email'),
            details: {
                from: channel.config.from,
                to: distribution.recipients,
                subject: distribution.subject
            }
        };
    }

    /**
     * 发送短信
     */
    async sendSMS(distribution, channel) {
        // 模拟短信发送
        await this.simulateDelay(800);

        // 实际应用中应该调用短信服务商API
        console.log('发送短信:', {
            provider: channel.config.provider,
            to: distribution.recipients,
            message: distribution.message,
            signName: channel.config.signName
        });

        return {
            messageId: this.generateMessageId('sms'),
            details: {
                provider: channel.config.provider,
                recipients: distribution.recipients.length
            }
        };
    }

    /**
     * 发送微信消息
     */
    async sendWechat(distribution, channel) {
        // 模拟微信发送
        await this.simulateDelay(1200);

        // 实际应用中应该调用微信API
        console.log('发送微信消息:', {
            appId: channel.config.appId,
            templateId: channel.config.templateId,
            to: distribution.recipients,
            data: {
                reportName: distribution.reportName,
                message: distribution.message
            }
        });

        return {
            messageId: this.generateMessageId('wechat'),
            details: {
                templateId: channel.config.templateId,
                recipients: distribution.recipients.length
            }
        };
    }

    /**
     * 发送钉钉消息
     */
    async sendDingtalk(distribution, channel) {
        // 模拟钉钉发送
        await this.simulateDelay(900);

        // 实际应用中应该调用钉钉机器人API
        console.log('发送钉钉消息:', {
            webhook: channel.config.webhook,
            msgtype: 'markdown',
            markdown: {
                title: distribution.subject,
                text: distribution.message
            }
        });

        return {
            messageId: this.generateMessageId('dingtalk'),
            details: {
                msgtype: 'markdown',
                recipients: distribution.recipients.length
            }
        };
    }

    /**
     * 发送Webhook
     */
    async sendWebhook(distribution, channel) {
        // 模拟Webhook发送
        await this.simulateDelay(1500);

        // 实际应用中应该使用fetch或axios
        console.log('发送Webhook:', {
            url: channel.config.url,
            method: channel.config.method,
            payload: {
                reportId: distribution.reportId,
                reportName: distribution.reportName,
                reportFile: distribution.reportFile,
                timestamp: new Date().toISOString()
            }
        });

        return {
            messageId: this.generateMessageId('webhook'),
            details: {
                url: channel.config.url,
                method: channel.config.method,
                statusCode: 200
            }
        };
    }

    /**
     * 添加到重试队列
     */
    addToRetryQueue(distribution) {
        const retryItem = {
            distributionId: distribution.id,
            distribution: distribution,
            retryCount: 0,
            maxRetries: this.maxRetries,
            nextRetryAt: new Date(Date.now() + this.retryDelay).toISOString(),
            addedAt: new Date().toISOString()
        };

        this.retryQueue.push(retryItem);
        this.scheduleRetry(retryItem);
    }

    /**
     * 调度重试
     */
    scheduleRetry(retryItem) {
        const delay = new Date(retryItem.nextRetryAt) - new Date();

        if (delay > 0) {
            setTimeout(async () => {
                await this.processRetry(retryItem);
            }, delay);
        }
    }

    /**
     * 处理重试
     */
    async processRetry(retryItem) {
        retryItem.retryCount++;

        console.log(`重试分发 ${retryItem.distributionId}, 第 ${retryItem.retryCount} 次重试`);

        try {
            // 只重试失败的渠道
            const failedChannels = retryItem.distribution.results
                .filter(r => r.status === 'FAILED')
                .map(r => r.channel);

            if (failedChannels.length === 0) {
                // 移除重试项
                this.removeFromRetryQueue(retryItem.distributionId);
                return;
            }

            const retryDistribution = {
                ...retryItem.distribution,
                channels: failedChannels,
                retryCount: retryItem.retryCount
            };

            await this.processDistribution(retryDistribution);

            // 如果成功,移除重试项
            if (retryDistribution.status === 'SUCCESS') {
                this.removeFromRetryQueue(retryItem.distributionId);
            } else if (retryItem.retryCount < retryItem.maxRetries) {
                // 继续重试,使用指数退避
                retryItem.nextRetryAt = new Date(
                    Date.now() + this.retryDelay * Math.pow(2, retryItem.retryCount)
                ).toISOString();
                this.scheduleRetry(retryItem);
            } else {
                // 达到最大重试次数
                console.error(`分发 ${retryItem.distributionId} 达到最大重试次数`);
                this.removeFromRetryQueue(retryItem.distributionId);
            }
        } catch (error) {
            console.error('重试失败:', error);
            
            if (retryItem.retryCount < retryItem.maxRetries) {
                retryItem.nextRetryAt = new Date(
                    Date.now() + this.retryDelay * Math.pow(2, retryItem.retryCount)
                ).toISOString();
                this.scheduleRetry(retryItem);
            } else {
                this.removeFromRetryQueue(retryItem.distributionId);
            }
        }
    }

    /**
     * 从重试队列移除
     */
    removeFromRetryQueue(distributionId) {
        const index = this.retryQueue.findIndex(r => r.distributionId === distributionId);
        if (index !== -1) {
            this.retryQueue.splice(index, 1);
        }
    }

    /**
     * 手动重试
     */
    async manualRetry(distributionId) {
        const distribution = this.distributionHistory.find(d => d.id === distributionId);
        if (!distribution) {
            throw new Error(`分发记录不存在: ${distributionId}`);
        }

        return await this.processDistribution(distribution);
    }

    /**
     * 配置渠道
     */
    configureChannel(channelId, config) {
        const channel = this.channels[channelId];
        if (!channel) {
            throw new Error(`渠道不存在: ${channelId}`);
        }

        Object.assign(channel.config, config);
        return channel;
    }

    /**
     * 启用/禁用渠道
     */
    toggleChannel(channelId, enabled) {
        const channel = this.channels[channelId];
        if (!channel) {
            throw new Error(`渠道不存在: ${channelId}`);
        }

        channel.enabled = enabled;
        return channel;
    }

    /**
     * 获取渠道列表
     */
    getChannels() {
        return Object.values(this.channels);
    }

    /**
     * 获取可用渠道
     */
    getAvailableChannels() {
        return Object.values(this.channels).filter(c => c.enabled);
    }

    /**
     * 获取分发历史
     */
    getDistributionHistory(filter = {}, limit = 50) {
        let history = [...this.distributionHistory];

        if (filter.reportId) {
            history = history.filter(d => d.reportId === filter.reportId);
        }

        if (filter.status) {
            history = history.filter(d => d.status === filter.status);
        }

        if (filter.channel) {
            history = history.filter(d => d.channels.includes(filter.channel));
        }

        // 按时间倒序排序
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return history.slice(0, limit);
    }

    /**
     * 获取重试队列
     */
    getRetryQueue() {
        return [...this.retryQueue];
    }

    /**
     * 获取分发统计
     */
    getDistributionStatistics() {
        const history = this.distributionHistory;

        return {
            total: history.length,
            byStatus: {
                success: history.filter(d => d.status === 'SUCCESS').length,
                partialSuccess: history.filter(d => d.status === 'PARTIAL_SUCCESS').length,
                failed: history.filter(d => d.status === 'FAILED').length,
                pending: history.filter(d => d.status === 'PENDING').length
            },
            byChannel: this.getChannelStatistics(history),
            successRate: history.length > 0
                ? ((history.filter(d => d.status === 'SUCCESS').length / history.length) * 100).toFixed(2)
                : 0,
            retryQueueSize: this.retryQueue.length,
            recentDistributions: history.slice(0, 10)
        };
    }

    /**
     * 获取渠道统计
     */
    getChannelStatistics(history) {
        const stats = {};

        Object.keys(this.channels).forEach(channelId => {
            const channelResults = [];
            
            history.forEach(d => {
                const result = d.results.find(r => r.channel === channelId);
                if (result) {
                    channelResults.push(result);
                }
            });

            stats[channelId] = {
                total: channelResults.length,
                success: channelResults.filter(r => r.status === 'SUCCESS').length,
                failed: channelResults.filter(r => r.status === 'FAILED').length,
                successRate: channelResults.length > 0
                    ? ((channelResults.filter(r => r.status === 'SUCCESS').length / channelResults.length) * 100).toFixed(2)
                    : 0
            };
        });

        return stats;
    }

    /**
     * 批量分发
     */
    async batchDistribute(distributions) {
        const results = [];

        for (const config of distributions) {
            try {
                const result = await this.distributeReport(config);
                results.push({
                    success: true,
                    distribution: result
                });
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message,
                    config
                });
            }
        }

        return results;
    }

    /**
     * 测试渠道
     */
    async testChannel(channelId, testConfig) {
        const channel = this.channels[channelId];
        if (!channel) {
            throw new Error(`渠道不存在: ${channelId}`);
        }

        const testDistribution = {
            id: 'TEST_' + Date.now(),
            reportName: '测试报表',
            subject: '测试消息',
            message: '这是一条测试消息',
            recipients: testConfig.recipients || ['test@example.com'],
            channels: [channelId]
        };

        try {
            const result = await this.sendViaChannel(channelId, testDistribution);
            return {
                success: true,
                result,
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
     * 清理历史记录
     */
    cleanupHistory(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const before = this.distributionHistory.length;
        this.distributionHistory = this.distributionHistory.filter(d => 
            new Date(d.createdAt) > cutoffDate
        );
        const after = this.distributionHistory.length;

        return {
            removed: before - after,
            remaining: after
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
        return 'DIST_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 生成消息ID
     */
    generateMessageId(channel) {
        return `${channel.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// 导出服务实例
window.ReportDistributionService = ReportDistributionService;
