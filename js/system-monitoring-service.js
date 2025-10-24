/**
 * 系统监控服务
 * 实现资源监控、告警、任务监控、规则引擎监控和容量规划
 */

class SystemMonitoringService {
    constructor() {
        this.monitoringData = [];
        this.alerts = [];
        this.thresholds = {
            cpu: 80,
            memory: 80,
            disk: 80,
            network: 80
        };
        this.monitoringInterval = null;
        this.isMonitoring = false;
    }

    /**
     * 启动资源监控
     */
    startMonitoring() {
        if (this.isMonitoring) {
            return;
        }

        this.isMonitoring = true;
        
        // 立即执行一次监控
        this.collectResourceMetrics();
        
        // 每30秒采集一次资源指标
        this.monitoringInterval = setInterval(() => {
            this.collectResourceMetrics();
        }, 30000);

        console.log('系统监控已启动');
    }

    /**
     * 停止资源监控
     */
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.isMonitoring = false;
        console.log('系统监控已停止');
    }

    /**
     * 采集资源指标
     */
    collectResourceMetrics() {
        const timestamp = new Date();
        
        // 模拟采集系统资源数据
        const metrics = {
            timestamp: timestamp,
            cpu: this.simulateCPUUsage(),
            memory: this.simulateMemoryUsage(),
            disk: this.simulateDiskUsage(),
            network: this.simulateNetworkUsage()
        };

        // 保存监控数据
        this.monitoringData.push(metrics);

        // 只保留最近1000条记录
        if (this.monitoringData.length > 1000) {
            this.monitoringData.shift();
        }

        // 检查是否需要告警
        this.checkResourceAlerts(metrics);

        return metrics;
    }

    /**
     * 模拟CPU使用率
     */
    simulateCPUUsage() {
        // 基础使用率 20-40%，随机波动
        const base = 30 + Math.random() * 10;
        // 偶尔出现高峰
        const spike = Math.random() > 0.95 ? Math.random() * 40 : 0;
        return Math.min(100, base + spike);
    }

    /**
     * 模拟内存使用率
     */
    simulateMemoryUsage() {
        const base = 50 + Math.random() * 15;
        const spike = Math.random() > 0.97 ? Math.random() * 30 : 0;
        return Math.min(100, base + spike);
    }

    /**
     * 模拟磁盘使用率
     */
    simulateDiskUsage() {
        // 磁盘使用率相对稳定，缓慢增长
        const base = 60 + Math.random() * 5;
        return Math.min(100, base);
    }

    /**
     * 模拟网络使用率
     */
    simulateNetworkUsage() {
        const base = 15 + Math.random() * 20;
        const spike = Math.random() > 0.9 ? Math.random() * 50 : 0;
        return Math.min(100, base + spike);
    }

    /**
     * 检查资源告警
     */
    checkResourceAlerts(metrics) {
        const alerts = [];

        // 检查CPU告警
        if (metrics.cpu > this.thresholds.cpu) {
            alerts.push({
                id: `alert-cpu-${Date.now()}`,
                type: 'RESOURCE',
                resource: 'CPU',
                level: metrics.cpu > 90 ? 'HIGH' : 'MEDIUM',
                value: metrics.cpu,
                threshold: this.thresholds.cpu,
                message: `CPU使用率达到 ${metrics.cpu.toFixed(2)}%，超过阈值 ${this.thresholds.cpu}%`,
                timestamp: metrics.timestamp,
                status: 'NEW'
            });
        }

        // 检查内存告警
        if (metrics.memory > this.thresholds.memory) {
            alerts.push({
                id: `alert-memory-${Date.now()}`,
                type: 'RESOURCE',
                resource: 'MEMORY',
                level: metrics.memory > 90 ? 'HIGH' : 'MEDIUM',
                value: metrics.memory,
                threshold: this.thresholds.memory,
                message: `内存使用率达到 ${metrics.memory.toFixed(2)}%，超过阈值 ${this.thresholds.memory}%`,
                timestamp: metrics.timestamp,
                status: 'NEW'
            });
        }

        // 检查磁盘告警
        if (metrics.disk > this.thresholds.disk) {
            alerts.push({
                id: `alert-disk-${Date.now()}`,
                type: 'RESOURCE',
                resource: 'DISK',
                level: metrics.disk > 90 ? 'HIGH' : 'MEDIUM',
                value: metrics.disk,
                threshold: this.thresholds.disk,
                message: `磁盘使用率达到 ${metrics.disk.toFixed(2)}%，超过阈值 ${this.thresholds.disk}%`,
                timestamp: metrics.timestamp,
                status: 'NEW'
            });
        }

        // 检查网络告警
        if (metrics.network > this.thresholds.network) {
            alerts.push({
                id: `alert-network-${Date.now()}`,
                type: 'RESOURCE',
                resource: 'NETWORK',
                level: metrics.network > 90 ? 'HIGH' : 'MEDIUM',
                value: metrics.network,
                threshold: this.thresholds.network,
                message: `网络使用率达到 ${metrics.network.toFixed(2)}%，超过阈值 ${this.thresholds.network}%`,
                timestamp: metrics.timestamp,
                status: 'NEW'
            });
        }

        // 保存告警
        if (alerts.length > 0) {
            this.alerts.push(...alerts);
            // 发送告警通知
            alerts.forEach(alert => this.sendAlertNotification(alert));
        }

        return alerts;
    }

    /**
     * 发送告警通知
     */
    sendAlertNotification(alert) {
        console.log(`[告警通知] ${alert.level} - ${alert.message}`);
        
        // 在实际应用中，这里会调用邮件、短信、即时通讯等通知服务
        // 这里仅模拟通知发送
        return {
            success: true,
            alertId: alert.id,
            notifiedAt: new Date(),
            channels: ['email', 'sms']
        };
    }

    /**
     * 获取最新的资源指标
     */
    getLatestMetrics() {
        if (this.monitoringData.length === 0) {
            return null;
        }
        return this.monitoringData[this.monitoringData.length - 1];
    }

    /**
     * 获取指定时间范围的监控数据
     */
    getMetricsInRange(startTime, endTime) {
        return this.monitoringData.filter(m => 
            m.timestamp >= startTime && m.timestamp <= endTime
        );
    }

    /**
     * 获取最近N条监控数据
     */
    getRecentMetrics(count = 100) {
        return this.monitoringData.slice(-count);
    }

    /**
     * 更新告警阈值
     */
    updateThresholds(thresholds) {
        this.thresholds = { ...this.thresholds, ...thresholds };
        return this.thresholds;
    }

    /**
     * 获取告警列表
     */
    getAlerts(filter = {}) {
        let alerts = [...this.alerts];

        if (filter.type) {
            alerts = alerts.filter(a => a.type === filter.type);
        }

        if (filter.level) {
            alerts = alerts.filter(a => a.level === filter.level);
        }

        if (filter.status) {
            alerts = alerts.filter(a => a.status === filter.status);
        }

        if (filter.resource) {
            alerts = alerts.filter(a => a.resource === filter.resource);
        }

        // 按时间倒序排列
        alerts.sort((a, b) => b.timestamp - a.timestamp);

        return alerts;
    }

    /**
     * 确认告警
     */
    acknowledgeAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.status = 'ACKNOWLEDGED';
            alert.acknowledgedAt = new Date();
            return alert;
        }
        return null;
    }

    /**
     * 解决告警
     */
    resolveAlert(alertId, resolution) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.status = 'RESOLVED';
            alert.resolvedAt = new Date();
            alert.resolution = resolution;
            return alert;
        }
        return null;
    }

    /**
     * 监控数据同步任务
     */
    monitorCollectionTask(taskId, taskName, status, details = {}) {
        const taskMonitor = {
            id: `task-monitor-${Date.now()}`,
            taskId: taskId,
            taskName: taskName,
            status: status,
            timestamp: new Date(),
            details: details
        };

        // 如果任务失败，创建告警
        if (status === 'FAILED') {
            const alert = {
                id: `alert-task-${Date.now()}`,
                type: 'TASK',
                taskId: taskId,
                taskName: taskName,
                level: 'HIGH',
                message: `数据同步任务 "${taskName}" 执行失败`,
                details: details,
                timestamp: new Date(),
                status: 'NEW'
            };
            this.alerts.push(alert);
            this.sendAlertNotification(alert);
        }

        return taskMonitor;
    }

    /**
     * 监控规则引擎执行
     */
    monitorRuleExecution(ruleId, ruleName, status, details = {}) {
        const ruleMonitor = {
            id: `rule-monitor-${Date.now()}`,
            ruleId: ruleId,
            ruleName: ruleName,
            status: status,
            timestamp: new Date(),
            details: details
        };

        // 如果规则执行异常，创建告警
        if (status === 'ERROR') {
            const alert = {
                id: `alert-rule-${Date.now()}`,
                type: 'RULE_ENGINE',
                ruleId: ruleId,
                ruleName: ruleName,
                level: 'HIGH',
                message: `规则引擎执行异常: "${ruleName}"`,
                details: details,
                stackTrace: details.stackTrace || '',
                timestamp: new Date(),
                status: 'NEW'
            };
            this.alerts.push(alert);
            this.sendAlertNotification(alert);
        }

        return ruleMonitor;
    }

    /**
     * 容量规划分析
     */
    analyzeCapacity() {
        if (this.monitoringData.length < 10) {
            return {
                status: 'INSUFFICIENT_DATA',
                message: '监控数据不足，无法进行容量分析'
            };
        }

        // 获取最近的监控数据
        const recentData = this.getRecentMetrics(100);

        // 计算平均使用率
        const avgCPU = recentData.reduce((sum, m) => sum + m.cpu, 0) / recentData.length;
        const avgMemory = recentData.reduce((sum, m) => sum + m.memory, 0) / recentData.length;
        const avgDisk = recentData.reduce((sum, m) => sum + m.disk, 0) / recentData.length;
        const avgNetwork = recentData.reduce((sum, m) => sum + m.network, 0) / recentData.length;

        // 计算峰值使用率
        const maxCPU = Math.max(...recentData.map(m => m.cpu));
        const maxMemory = Math.max(...recentData.map(m => m.memory));
        const maxDisk = Math.max(...recentData.map(m => m.disk));
        const maxNetwork = Math.max(...recentData.map(m => m.network));

        // 计算趋势（简单线性回归）
        const cpuTrend = this.calculateTrend(recentData.map(m => m.cpu));
        const memoryTrend = this.calculateTrend(recentData.map(m => m.memory));
        const diskTrend = this.calculateTrend(recentData.map(m => m.disk));

        // 生成建议
        const recommendations = [];

        if (avgCPU > 70 || maxCPU > 90) {
            recommendations.push({
                resource: 'CPU',
                severity: maxCPU > 90 ? 'HIGH' : 'MEDIUM',
                message: 'CPU使用率较高，建议增加CPU资源或优化应用性能',
                currentAvg: avgCPU.toFixed(2),
                currentMax: maxCPU.toFixed(2),
                trend: cpuTrend
            });
        }

        if (avgMemory > 70 || maxMemory > 90) {
            recommendations.push({
                resource: 'MEMORY',
                severity: maxMemory > 90 ? 'HIGH' : 'MEDIUM',
                message: '内存使用率较高，建议增加内存容量',
                currentAvg: avgMemory.toFixed(2),
                currentMax: maxMemory.toFixed(2),
                trend: memoryTrend
            });
        }

        if (avgDisk > 70 || maxDisk > 85) {
            recommendations.push({
                resource: 'DISK',
                severity: maxDisk > 85 ? 'HIGH' : 'MEDIUM',
                message: '磁盘使用率较高，建议扩容磁盘或清理历史数据',
                currentAvg: avgDisk.toFixed(2),
                currentMax: maxDisk.toFixed(2),
                trend: diskTrend
            });
        }

        // 预测未来容量需求（基于趋势）
        const predictions = {
            cpu: this.predictFutureUsage(avgCPU, cpuTrend, 30), // 30天后
            memory: this.predictFutureUsage(avgMemory, memoryTrend, 30),
            disk: this.predictFutureUsage(avgDisk, diskTrend, 30)
        };

        return {
            status: 'SUCCESS',
            timestamp: new Date(),
            current: {
                cpu: { avg: avgCPU.toFixed(2), max: maxCPU.toFixed(2) },
                memory: { avg: avgMemory.toFixed(2), max: maxMemory.toFixed(2) },
                disk: { avg: avgDisk.toFixed(2), max: maxDisk.toFixed(2) },
                network: { avg: avgNetwork.toFixed(2), max: maxNetwork.toFixed(2) }
            },
            trends: {
                cpu: cpuTrend,
                memory: memoryTrend,
                disk: diskTrend
            },
            predictions: predictions,
            recommendations: recommendations
        };
    }

    /**
     * 计算趋势（简单线性回归斜率）
     */
    calculateTrend(values) {
        const n = values.length;
        if (n < 2) return 0;

        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += values[i];
            sumXY += i * values[i];
            sumX2 += i * i;
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        
        // 返回趋势描述
        if (slope > 0.1) return 'INCREASING';
        if (slope < -0.1) return 'DECREASING';
        return 'STABLE';
    }

    /**
     * 预测未来使用率
     */
    predictFutureUsage(currentAvg, trend, days) {
        let prediction = currentAvg;
        
        if (trend === 'INCREASING') {
            // 假设每天增长0.5%
            prediction = currentAvg + (days * 0.5);
        } else if (trend === 'DECREASING') {
            prediction = currentAvg - (days * 0.3);
        }

        return Math.max(0, Math.min(100, prediction)).toFixed(2);
    }

    /**
     * 获取监控统计信息
     */
    getMonitoringStats() {
        const recentData = this.getRecentMetrics(100);
        
        if (recentData.length === 0) {
            return null;
        }

        return {
            totalDataPoints: this.monitoringData.length,
            recentDataPoints: recentData.length,
            isMonitoring: this.isMonitoring,
            thresholds: this.thresholds,
            alertCount: {
                total: this.alerts.length,
                new: this.alerts.filter(a => a.status === 'NEW').length,
                acknowledged: this.alerts.filter(a => a.status === 'ACKNOWLEDGED').length,
                resolved: this.alerts.filter(a => a.status === 'RESOLVED').length
            },
            latestMetrics: this.getLatestMetrics()
        };
    }

    /**
     * 清除历史数据
     */
    clearHistory(olderThan) {
        const cutoffDate = olderThan || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 默认7天前
        
        this.monitoringData = this.monitoringData.filter(m => m.timestamp > cutoffDate);
        this.alerts = this.alerts.filter(a => a.timestamp > cutoffDate);
        
        return {
            success: true,
            message: `已清除 ${cutoffDate.toISOString()} 之前的历史数据`
        };
    }
}

// 创建全局实例
window.SystemMonitoringService = SystemMonitoringService;
