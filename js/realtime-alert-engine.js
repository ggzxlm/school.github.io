/**
 * 实时预警引擎服务
 * Real-time Alert Engine Service
 * 
 * 功能:
 * - 数据变更监听
 * - 规则自动检查
 * - 预警自动分级
 * - 预警通知推送
 * - 流式处理引擎
 */

class RealtimeAlertEngine {
    constructor() {
        this.storageKey = 'realtime_alert_engine';
        this.changeQueueKey = 'data_change_queue';
        this.alertQueueKey = 'alert_queue';
        this.notificationKey = 'notification_queue';
        
        // 监听器配置
        this.listeners = new Map(); // dataSourceId -> listener config
        this.changeQueue = []; // 数据变更事件队列
        this.processingInterval = 5 * 60 * 1000; // 5分钟处理间隔
        this.processingTimer = null;
        
        // 规则引擎实例
        this.ruleEngine = window.ruleEngineService || new RuleEngineService();
        
        this.init();
    }

    /**
     * 初始化引擎
     */
    init() {
        // 初始化存储
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                enabled: true,
                listeners: [],
                statistics: {
                    totalChanges: 0,
                    totalAlerts: 0,
                    totalNotifications: 0
                }
            }));
        }
        
        // 加载监听器配置
        this.loadListeners();
        
        // 启动处理定时器
        this.startProcessing();
        
        console.log('[实时预警引擎] 引擎已初始化');
    }

    /**
     * 生成唯一ID
     */
    generateId(prefix = 'ID') {
        return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * 加载监听器配置
     */
    loadListeners() {
        const config = this.getConfig();
        if (config.listeners && Array.isArray(config.listeners)) {
            config.listeners.forEach(listener => {
                this.listeners.set(listener.dataSourceId, listener);
            });
        }
    }

    /**
     * 获取配置
     */
    getConfig() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (error) {
            console.error('获取配置失败:', error);
            return {};
        }
    }

    /**
     * 保存配置
     */
    saveConfig(config) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(config));
        } catch (error) {
            console.error('保存配置失败:', error);
        }
    }

    // ==================== 任务 11.1: 数据变更监听 ====================

    /**
     * 注册数据源监听器
     * @param {Object} config - 监听器配置
     * @param {string} config.dataSourceId - 数据源ID
     * @param {string} config.dataSourceName - 数据源名称
     * @param {Array} config.tables - 监听的表列表
     * @param {Array} config.operations - 监听的操作类型 ['INSERT', 'UPDATE', 'DELETE']
     * @param {number} config.checkInterval - 检查间隔(毫秒)
     */
    registerListener(config) {
        try {
            const listener = {
                id: this.generateId('LISTENER'),
                dataSourceId: config.dataSourceId,
                dataSourceName: config.dataSourceName,
                tables: config.tables || [],
                operations: config.operations || ['INSERT', 'UPDATE', 'DELETE'],
                checkInterval: config.checkInterval || this.processingInterval,
                enabled: true,
                lastCheckTime: null,
                totalChanges: 0,
                createdAt: new Date().toISOString()
            };

            this.listeners.set(config.dataSourceId, listener);

            // 保存到配置
            const engineConfig = this.getConfig();
            engineConfig.listeners = Array.from(this.listeners.values());
            this.saveConfig(engineConfig);

            console.log('[数据变更监听] 注册监听器:', listener.dataSourceName);
            return { success: true, data: listener };
        } catch (error) {
            console.error('注册监听器失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 移除监听器
     */
    removeListener(dataSourceId) {
        this.listeners.delete(dataSourceId);
        
        const config = this.getConfig();
        config.listeners = Array.from(this.listeners.values());
        this.saveConfig(config);
        
        console.log('[数据变更监听] 移除监听器:', dataSourceId);
        return { success: true };
    }

    /**
     * 监听数据变更（模拟实现）
     * 实际应该集成CDC工具或数据库触发器
     */
    async monitorDataChanges(dataSourceId) {
        const listener = this.listeners.get(dataSourceId);
        if (!listener || !listener.enabled) {
            return [];
        }

        // 模拟捕获数据变更
        const changes = await this.captureChanges(listener);
        
        // 更新监听器统计
        listener.lastCheckTime = new Date().toISOString();
        listener.totalChanges += changes.length;

        return changes;
    }

    /**
     * 捕获数据变更（模拟实现）
     */
    async captureChanges(listener) {
        // 模拟异步捕获
        await new Promise(resolve => setTimeout(resolve, 100));

        const changes = [];
        const changeCount = Math.floor(Math.random() * 20); // 随机0-20条变更

        for (let i = 0; i < changeCount; i++) {
            const table = listener.tables[Math.floor(Math.random() * listener.tables.length)] || 'unknown_table';
            const operation = listener.operations[Math.floor(Math.random() * listener.operations.length)];

            changes.push({
                id: this.generateId('CHANGE'),
                dataSourceId: listener.dataSourceId,
                dataSourceName: listener.dataSourceName,
                table: table,
                operation: operation,
                timestamp: new Date().toISOString(),
                data: this.generateMockChangeData(table, operation),
                processed: false
            });
        }

        return changes;
    }

    /**
     * 生成模拟变更数据
     */
    generateMockChangeData(table, operation) {
        const baseData = {
            id: Math.floor(Math.random() * 100000),
            timestamp: new Date().toISOString()
        };

        // 根据表类型生成不同的数据
        if (table.includes('procurement') || table.includes('采购')) {
            return {
                ...baseData,
                projectName: '采购项目_' + Math.random().toString(36).substring(2, 8),
                amount: Math.floor(Math.random() * 1000000),
                supplierId: 'SUP' + Math.floor(Math.random() * 1000),
                status: ['pending', 'approved', 'completed'][Math.floor(Math.random() * 3)]
            };
        } else if (table.includes('expense') || table.includes('报销')) {
            return {
                ...baseData,
                employeeName: '员工_' + Math.random().toString(36).substring(2, 6),
                amount: Math.floor(Math.random() * 50000),
                category: ['差旅费', '办公费', '会议费'][Math.floor(Math.random() * 3)],
                invoiceCount: Math.floor(Math.random() * 10) + 1
            };
        } else {
            return {
                ...baseData,
                name: '数据_' + Math.random().toString(36).substring(2, 8),
                value: Math.floor(Math.random() * 10000)
            };
        }
    }

    /**
     * 将变更事件加入队列
     */
    enqueueChange(change) {
        this.changeQueue.push(change);
        
        // 持久化队列（只保留最近1000条）
        if (this.changeQueue.length > 1000) {
            this.changeQueue = this.changeQueue.slice(-1000);
        }
        
        try {
            localStorage.setItem(this.changeQueueKey, JSON.stringify(this.changeQueue));
        } catch (error) {
            console.error('保存变更队列失败:', error);
        }
    }

    /**
     * 批量加入变更队列
     */
    enqueueChanges(changes) {
        changes.forEach(change => this.enqueueChange(change));
        console.log(`[数据变更监听] 加入${changes.length}条变更到队列`);
    }

    /**
     * 获取变更队列
     */
    getChangeQueue(limit = 100) {
        return this.changeQueue.slice(0, limit);
    }

    /**
     * 清空已处理的变更
     */
    clearProcessedChanges() {
        this.changeQueue = this.changeQueue.filter(change => !change.processed);
        try {
            localStorage.setItem(this.changeQueueKey, JSON.stringify(this.changeQueue));
        } catch (error) {
            console.error('清空变更队列失败:', error);
        }
    }

    // ==================== 任务 11.2: 规则自动检查 ====================

    /**
     * 对新数据自动触发规则检查
     * @param {Array} changes - 数据变更列表
     */
    async autoCheckRules(changes) {
        if (!changes || changes.length === 0) {
            return { alerts: [], executionResults: [] };
        }

        console.log(`[规则自动检查] 开始检查${changes.length}条数据变更`);
        const startTime = Date.now();

        // 获取所有启用的规则
        const enabledRules = this.ruleEngine.getAllRules().filter(rule => rule.enabled);
        
        if (enabledRules.length === 0) {
            console.log('[规则自动检查] 没有启用的规则');
            return { alerts: [], executionResults: [] };
        }

        // 并行执行规则检查
        const executionResults = await this.executeRulesInParallel(enabledRules, changes);

        // 收集所有生成的预警
        const alerts = [];
        executionResults.forEach(result => {
            if (result.alerts && result.alerts.length > 0) {
                alerts.push(...result.alerts);
            }
        });

        const duration = Date.now() - startTime;
        console.log(`[规则自动检查] 完成检查，触发${alerts.length}条预警，耗时${duration}ms`);

        // 标记变更已处理
        changes.forEach(change => {
            change.processed = true;
        });

        return { alerts, executionResults };
    }

    /**
     * 并行执行规则
     */
    async executeRulesInParallel(rules, changes) {
        const promises = rules.map(rule => this.executeRuleOnChanges(rule, changes));
        
        try {
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            console.error('[规则自动检查] 并行执行规则失败:', error);
            return [];
        }
    }

    /**
     * 对变更数据执行单个规则
     */
    async executeRuleOnChanges(rule, changes) {
        const startTime = Date.now();
        
        try {
            // 根据规则类型过滤相关数据
            const relevantChanges = this.filterRelevantChanges(rule, changes);
            
            if (relevantChanges.length === 0) {
                return {
                    ruleId: rule.id,
                    ruleName: rule.ruleName,
                    status: 'SKIPPED',
                    alerts: []
                };
            }

            // 执行规则检查
            const matchedData = await this.checkRuleConditions(rule, relevantChanges);
            
            // 生成预警
            const alerts = matchedData.map(data => this.createAlert(rule, data));

            const duration = Date.now() - startTime;

            return {
                ruleId: rule.id,
                ruleName: rule.ruleName,
                ruleType: rule.ruleType,
                status: 'SUCCESS',
                dataCount: relevantChanges.length,
                matchedCount: matchedData.length,
                alerts: alerts,
                executionDuration: duration,
                executionTime: new Date().toISOString()
            };
        } catch (error) {
            console.error(`[规则自动检查] 执行规则失败: ${rule.ruleName}`, error);
            return {
                ruleId: rule.id,
                ruleName: rule.ruleName,
                status: 'ERROR',
                error: error.message,
                alerts: []
            };
        }
    }

    /**
     * 过滤与规则相关的变更数据
     */
    filterRelevantChanges(rule, changes) {
        // 根据规则配置过滤相关数据
        // 这里简化处理，实际应该根据规则的目标表、字段等进行精确过滤
        return changes.filter(change => {
            // 如果规则有指定表，只处理相关表的变更
            if (rule.config && rule.config.targetTable) {
                return change.table === rule.config.targetTable;
            }
            return true;
        });
    }

    /**
     * 检查规则条件
     */
    async checkRuleConditions(rule, changes) {
        // 模拟规则检查逻辑
        await new Promise(resolve => setTimeout(resolve, 50));

        const matchedData = [];
        
        // 根据规则类型执行不同的检查逻辑
        switch (rule.ruleType) {
            case 'THRESHOLD':
                matchedData.push(...this.checkThresholdRule(rule, changes));
                break;
            case 'TREND':
                matchedData.push(...this.checkTrendRule(rule, changes));
                break;
            case 'CORRELATION':
                matchedData.push(...this.checkCorrelationRule(rule, changes));
                break;
            case 'SEQUENCE':
                matchedData.push(...this.checkSequenceRule(rule, changes));
                break;
            case 'GRAPH':
                matchedData.push(...this.checkGraphRule(rule, changes));
                break;
            default:
                // 默认检查逻辑
                matchedData.push(...this.checkDefaultRule(rule, changes));
        }

        return matchedData;
    }

    /**
     * 检查阈值规则
     */
    checkThresholdRule(rule, changes) {
        const matched = [];
        const threshold = rule.config.threshold || 0;
        const field = rule.config.field || 'amount';
        const operator = rule.config.operator || '>';

        changes.forEach(change => {
            const value = change.data[field];
            if (value !== undefined && this.compareValue(value, operator, threshold)) {
                matched.push({
                    change: change,
                    matchedValue: value,
                    threshold: threshold,
                    operator: operator
                });
            }
        });

        return matched;
    }

    /**
     * 检查趋势规则
     */
    checkTrendRule(rule, changes) {
        // 简化实现：随机匹配部分数据
        const matchRate = 0.1; // 10%匹配率
        return changes
            .filter(() => Math.random() < matchRate)
            .map(change => ({
                change: change,
                trendType: 'increase',
                trendValue: '50%'
            }));
    }

    /**
     * 检查关联规则
     */
    checkCorrelationRule(rule, changes) {
        // 简化实现：随机匹配部分数据
        const matchRate = 0.05; // 5%匹配率
        return changes
            .filter(() => Math.random() < matchRate)
            .map(change => ({
                change: change,
                correlationType: 'family_relation',
                relatedEntities: ['person_A', 'supplier_B']
            }));
    }

    /**
     * 检查时序规则
     */
    checkSequenceRule(rule, changes) {
        // 简化实现：随机匹配部分数据
        const matchRate = 0.03; // 3%匹配率
        return changes
            .filter(() => Math.random() < matchRate)
            .map(change => ({
                change: change,
                sequencePattern: ['event_A', 'event_B'],
                timeWindow: '7d'
            }));
    }

    /**
     * 检查图谱规则
     */
    checkGraphRule(rule, changes) {
        // 简化实现：随机匹配部分数据
        const matchRate = 0.02; // 2%匹配率
        return changes
            .filter(() => Math.random() < matchRate)
            .map(change => ({
                change: change,
                graphPattern: 'person->company->contract',
                riskPath: ['node_A', 'node_B', 'node_C']
            }));
    }

    /**
     * 默认规则检查
     */
    checkDefaultRule(rule, changes) {
        // 简化实现：随机匹配部分数据
        const matchRate = 0.05; // 5%匹配率
        return changes
            .filter(() => Math.random() < matchRate)
            .map(change => ({
                change: change,
                matched: true
            }));
    }

    /**
     * 比较值
     */
    compareValue(value, operator, threshold) {
        switch (operator) {
            case '>': return value > threshold;
            case '>=': return value >= threshold;
            case '<': return value < threshold;
            case '<=': return value <= threshold;
            case '==': return value == threshold;
            case '!=': return value != threshold;
            default: return false;
        }
    }

    // ==================== 任务 11.3: 预警自动分级 ====================

    /**
     * 创建预警记录
     */
    createAlert(rule, matchedData) {
        const alert = {
            id: this.generateId('ALERT'),
            alertCode: this.generateAlertCode(),
            ruleId: rule.id,
            ruleName: rule.ruleName,
            ruleType: rule.ruleType,
            category: rule.category,
            
            // 基础信息
            title: this.generateAlertTitle(rule, matchedData),
            description: this.generateAlertDescription(rule, matchedData),
            
            // 涉及对象和证据数据
            involvedEntities: this.extractInvolvedEntities(matchedData),
            evidenceData: this.extractEvidenceData(matchedData),
            
            // 自动分级
            alertLevel: this.calculateAlertLevel(rule, matchedData),
            levelScore: this.calculateLevelScore(rule, matchedData),
            levelReason: this.generateLevelReason(rule, matchedData),
            
            // 状态
            status: 'NEW',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            
            // 来源信息
            source: 'realtime_engine',
            dataSourceId: matchedData.change?.dataSourceId,
            dataSourceName: matchedData.change?.dataSourceName
        };

        return alert;
    }

    /**
     * 生成预警编号
     */
    generateAlertCode() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const seq = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
        return `YJ-${year}${month}${day}-${seq}`;
    }

    /**
     * 计算预警等级
     * 根据规则配置和匹配数据自动分级为高、中、低
     */
    calculateAlertLevel(rule, matchedData) {
        // 获取规则配置的基础等级
        let baseLevel = rule.alertLevel || 'MEDIUM';
        
        // 计算评分
        const score = this.calculateLevelScore(rule, matchedData);
        
        // 根据评分动态调整等级
        if (score >= 80) {
            return 'HIGH';
        } else if (score >= 50) {
            return 'MEDIUM';
        } else {
            return 'LOW';
        }
    }

    /**
     * 计算等级评分 (0-100)
     */
    calculateLevelScore(rule, matchedData) {
        let score = 50; // 基础分数

        // 根据规则优先级调整
        if (rule.priority) {
            score += rule.priority * 5;
        }

        // 根据规则类型调整
        const typeScores = {
            'THRESHOLD': 10,
            'TREND': 15,
            'CORRELATION': 20,
            'SEQUENCE': 25,
            'GRAPH': 30
        };
        score += typeScores[rule.ruleType] || 0;

        // 根据匹配数据的严重程度调整
        if (matchedData.matchedValue && matchedData.threshold) {
            const ratio = matchedData.matchedValue / matchedData.threshold;
            if (ratio > 2) {
                score += 20;
            } else if (ratio > 1.5) {
                score += 10;
            }
        }

        // 根据涉及金额调整
        if (matchedData.change?.data?.amount) {
            const amount = matchedData.change.data.amount;
            if (amount > 1000000) {
                score += 15;
            } else if (amount > 100000) {
                score += 10;
            } else if (amount > 10000) {
                score += 5;
            }
        }

        // 确保分数在0-100范围内
        return Math.min(100, Math.max(0, score));
    }

    /**
     * 生成分级依据
     */
    generateLevelReason(rule, matchedData) {
        const reasons = [];

        // 规则类型
        reasons.push(`规则类型: ${rule.ruleType}`);

        // 规则优先级
        if (rule.priority) {
            reasons.push(`规则优先级: ${rule.priority}`);
        }

        // 匹配情况
        if (matchedData.matchedValue && matchedData.threshold) {
            const ratio = ((matchedData.matchedValue / matchedData.threshold) * 100).toFixed(0);
            reasons.push(`超出阈值: ${ratio}%`);
        }

        // 涉及金额
        if (matchedData.change?.data?.amount) {
            reasons.push(`涉及金额: ${matchedData.change.data.amount}元`);
        }

        return reasons.join('; ');
    }

    /**
     * 动态调整预警等级
     * 根据新的信息或用户反馈调整等级
     */
    adjustAlertLevel(alertId, newLevel, reason) {
        try {
            // 这里应该更新存储中的预警记录
            console.log(`[预警自动分级] 调整预警等级: ${alertId} -> ${newLevel}, 原因: ${reason}`);
            
            return {
                success: true,
                alertId: alertId,
                newLevel: newLevel,
                adjustedAt: new Date().toISOString(),
                reason: reason
            };
        } catch (error) {
            console.error('调整预警等级失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 生成预警标题
     */
    generateAlertTitle(rule, matchedData) {
        const templates = {
            'THRESHOLD': `${rule.ruleName} - 阈值超标预警`,
            'TREND': `${rule.ruleName} - 趋势异常预警`,
            'CORRELATION': `${rule.ruleName} - 关联风险预警`,
            'SEQUENCE': `${rule.ruleName} - 时序异常预警`,
            'GRAPH': `${rule.ruleName} - 关系网络预警`
        };
        return templates[rule.ruleType] || `${rule.ruleName} - 风险预警`;
    }

    /**
     * 生成预警描述
     */
    generateAlertDescription(rule, matchedData) {
        let description = `规则"${rule.ruleName}"检测到异常情况。`;

        if (matchedData.matchedValue && matchedData.threshold) {
            description += ` 检测值${matchedData.matchedValue}${matchedData.operator || ''}阈值${matchedData.threshold}。`;
        }

        if (matchedData.change?.data) {
            const data = matchedData.change.data;
            if (data.amount) {
                description += ` 涉及金额${data.amount}元。`;
            }
            if (data.projectName) {
                description += ` 项目名称: ${data.projectName}。`;
            }
        }

        description += ' 请及时核查处理。';

        return description;
    }

    /**
     * 提取涉及对象
     */
    extractInvolvedEntities(matchedData) {
        const entities = [];

        if (matchedData.change?.data) {
            const data = matchedData.change.data;
            
            if (data.employeeName) {
                entities.push({
                    entityType: 'person',
                    entityId: data.id,
                    entityName: data.employeeName
                });
            }
            
            if (data.supplierId) {
                entities.push({
                    entityType: 'supplier',
                    entityId: data.supplierId,
                    entityName: `供应商${data.supplierId}`
                });
            }
            
            if (data.projectName) {
                entities.push({
                    entityType: 'project',
                    entityId: data.id,
                    entityName: data.projectName
                });
            }
        }

        return entities;
    }

    /**
     * 提取证据数据
     */
    extractEvidenceData(matchedData) {
        return {
            changeId: matchedData.change?.id,
            table: matchedData.change?.table,
            operation: matchedData.change?.operation,
            timestamp: matchedData.change?.timestamp,
            data: matchedData.change?.data,
            matchedValue: matchedData.matchedValue,
            threshold: matchedData.threshold,
            operator: matchedData.operator
        };
    }

    // ==================== 任务 11.4: 预警通知推送 ====================

    /**
     * 推送预警通知
     * @param {Array} alerts - 预警列表
     */
    async pushAlertNotifications(alerts) {
        if (!alerts || alerts.length === 0) {
            return { success: true, sent: 0, failed: 0 };
        }

        console.log(`[预警通知推送] 开始推送${alerts.length}条预警通知`);

        const results = {
            success: 0,
            failed: 0,
            notifications: []
        };

        // 批量发送通知
        for (const alert of alerts) {
            try {
                const notification = await this.sendAlertNotification(alert);
                results.notifications.push(notification);
                results.success++;
            } catch (error) {
                console.error(`[预警通知推送] 发送通知失败: ${alert.id}`, error);
                results.failed++;
                
                // 失败重试
                await this.retryNotification(alert);
            }
        }

        console.log(`[预警通知推送] 推送完成，成功${results.success}条，失败${results.failed}条`);
        return results;
    }

    /**
     * 发送单条预警通知
     */
    async sendAlertNotification(alert) {
        // 获取通知策略
        const strategy = this.getNotificationStrategy(alert);
        
        // 确定接收人
        const recipients = this.determineRecipients(alert, strategy);
        
        // 构建通知内容
        const content = this.buildNotificationContent(alert);
        
        // 根据策略发送到不同渠道
        const channelResults = [];
        
        for (const channel of strategy.channels) {
            try {
                const result = await this.sendToChannel(channel, recipients, content, alert);
                channelResults.push(result);
            } catch (error) {
                console.error(`[预警通知推送] 渠道${channel}发送失败:`, error);
                channelResults.push({
                    channel: channel,
                    status: 'FAILED',
                    error: error.message
                });
            }
        }

        const notification = {
            id: this.generateId('NOTIF'),
            alertId: alert.id,
            alertCode: alert.alertCode,
            alertLevel: alert.alertLevel,
            recipients: recipients,
            channels: strategy.channels,
            content: content,
            channelResults: channelResults,
            status: channelResults.every(r => r.status === 'SUCCESS') ? 'SUCCESS' : 'PARTIAL',
            sentAt: new Date().toISOString(),
            retryCount: 0
        };

        // 保存通知记录
        this.saveNotification(notification);

        return notification;
    }

    /**
     * 获取通知策略
     */
    getNotificationStrategy(alert) {
        // 根据预警等级确定通知策略
        const strategies = {
            'HIGH': {
                channels: ['email', 'sms', 'system'],
                immediate: true,
                retryTimes: 3,
                retryInterval: 5 * 60 * 1000 // 5分钟
            },
            'MEDIUM': {
                channels: ['email', 'system'],
                immediate: true,
                retryTimes: 2,
                retryInterval: 10 * 60 * 1000 // 10分钟
            },
            'LOW': {
                channels: ['system'],
                immediate: false,
                retryTimes: 1,
                retryInterval: 30 * 60 * 1000 // 30分钟
            }
        };

        return strategies[alert.alertLevel] || strategies['MEDIUM'];
    }

    /**
     * 确定接收人
     */
    determineRecipients(alert, strategy) {
        // 根据预警类型和涉及对象确定接收人
        const recipients = [];

        // 默认接收人（系统管理员）
        recipients.push({
            userId: 'admin',
            userName: '系统管理员',
            email: 'admin@example.com',
            phone: '13800138000'
        });

        // 根据预警类别添加相关责任人
        if (alert.category) {
            const categoryRecipients = this.getCategoryRecipients(alert.category);
            recipients.push(...categoryRecipients);
        }

        // 根据涉及部门添加部门负责人
        if (alert.involvedEntities) {
            alert.involvedEntities.forEach(entity => {
                if (entity.entityType === 'department') {
                    const deptRecipients = this.getDepartmentRecipients(entity.entityId);
                    recipients.push(...deptRecipients);
                }
            });
        }

        // 去重
        const uniqueRecipients = recipients.filter((recipient, index, self) =>
            index === self.findIndex(r => r.userId === recipient.userId)
        );

        return uniqueRecipients;
    }

    /**
     * 获取分类对应的接收人
     */
    getCategoryRecipients(category) {
        const categoryMap = {
            '科研经费': [{ userId: 'research_admin', userName: '科研处负责人', email: 'research@example.com', phone: '13800138001' }],
            '财务管理': [{ userId: 'finance_admin', userName: '财务处负责人', email: 'finance@example.com', phone: '13800138002' }],
            '采购管理': [{ userId: 'procurement_admin', userName: '采购中心负责人', email: 'procurement@example.com', phone: '13800138003' }],
            '固定资产': [{ userId: 'asset_admin', userName: '资产处负责人', email: 'asset@example.com', phone: '13800138004' }]
        };
        return categoryMap[category] || [];
    }

    /**
     * 获取部门对应的接收人
     */
    getDepartmentRecipients(departmentId) {
        // 模拟实现，实际应该从用户管理系统获取
        return [{
            userId: `dept_${departmentId}_admin`,
            userName: `部门${departmentId}负责人`,
            email: `dept${departmentId}@example.com`,
            phone: '13800138000'
        }];
    }

    /**
     * 构建通知内容
     */
    buildNotificationContent(alert) {
        return {
            subject: `【${this.getLevelText(alert.alertLevel)}】${alert.title}`,
            body: this.buildNotificationBody(alert),
            summary: alert.description,
            link: `/alert-center.html?id=${alert.id}`
        };
    }

    /**
     * 构建通知正文
     */
    buildNotificationBody(alert) {
        let body = `预警编号: ${alert.alertCode}\n`;
        body += `预警等级: ${this.getLevelText(alert.alertLevel)}\n`;
        body += `预警标题: ${alert.title}\n`;
        body += `预警描述: ${alert.description}\n`;
        body += `触发时间: ${alert.createdAt}\n`;
        
        if (alert.involvedEntities && alert.involvedEntities.length > 0) {
            body += `涉及对象: ${alert.involvedEntities.map(e => e.entityName).join(', ')}\n`;
        }
        
        body += `\n请及时登录系统查看详情并处理。`;
        
        return body;
    }

    /**
     * 获取等级文本
     */
    getLevelText(level) {
        const map = {
            'HIGH': '高风险',
            'MEDIUM': '中风险',
            'LOW': '低风险'
        };
        return map[level] || level;
    }

    /**
     * 发送到指定渠道
     */
    async sendToChannel(channel, recipients, content, alert) {
        // 模拟发送延迟
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log(`[预警通知推送] 通过${channel}渠道发送通知给${recipients.length}个接收人`);

        switch (channel) {
            case 'email':
                return await this.sendEmail(recipients, content);
            case 'sms':
                return await this.sendSMS(recipients, content);
            case 'system':
                return await this.sendSystemNotification(recipients, content, alert);
            case 'wechat':
                return await this.sendWeChatNotification(recipients, content);
            case 'webhook':
                return await this.sendWebhook(content, alert);
            default:
                throw new Error(`不支持的通知渠道: ${channel}`);
        }
    }

    /**
     * 发送邮件
     */
    async sendEmail(recipients, content) {
        // 模拟邮件发送
        console.log(`[邮件通知] 发送给: ${recipients.map(r => r.email).join(', ')}`);
        console.log(`[邮件通知] 主题: ${content.subject}`);
        
        return {
            channel: 'email',
            status: 'SUCCESS',
            recipients: recipients.length,
            sentAt: new Date().toISOString()
        };
    }

    /**
     * 发送短信
     */
    async sendSMS(recipients, content) {
        // 模拟短信发送
        console.log(`[短信通知] 发送给: ${recipients.map(r => r.phone).join(', ')}`);
        console.log(`[短信通知] 内容: ${content.summary}`);
        
        return {
            channel: 'sms',
            status: 'SUCCESS',
            recipients: recipients.length,
            sentAt: new Date().toISOString()
        };
    }

    /**
     * 发送系统通知
     */
    async sendSystemNotification(recipients, content, alert) {
        // 保存到系统通知表
        console.log(`[系统通知] 发送给: ${recipients.map(r => r.userName).join(', ')}`);
        
        return {
            channel: 'system',
            status: 'SUCCESS',
            recipients: recipients.length,
            sentAt: new Date().toISOString()
        };
    }

    /**
     * 发送微信通知
     */
    async sendWeChatNotification(recipients, content) {
        // 模拟微信通知发送
        console.log(`[微信通知] 发送给: ${recipients.map(r => r.userName).join(', ')}`);
        
        return {
            channel: 'wechat',
            status: 'SUCCESS',
            recipients: recipients.length,
            sentAt: new Date().toISOString()
        };
    }

    /**
     * 发送Webhook
     */
    async sendWebhook(content, alert) {
        // 模拟Webhook发送
        console.log(`[Webhook通知] 发送预警: ${alert.alertCode}`);
        
        return {
            channel: 'webhook',
            status: 'SUCCESS',
            sentAt: new Date().toISOString()
        };
    }

    /**
     * 失败重试
     */
    async retryNotification(alert, retryCount = 0) {
        const strategy = this.getNotificationStrategy(alert);
        
        if (retryCount >= strategy.retryTimes) {
            console.log(`[预警通知推送] 达到最大重试次数，放弃重试: ${alert.id}`);
            return { success: false, reason: 'MAX_RETRIES_REACHED' };
        }

        console.log(`[预警通知推送] 第${retryCount + 1}次重试: ${alert.id}`);

        // 等待重试间隔
        await new Promise(resolve => setTimeout(resolve, strategy.retryInterval));

        try {
            const notification = await this.sendAlertNotification(alert);
            notification.retryCount = retryCount + 1;
            return { success: true, notification };
        } catch (error) {
            console.error(`[预警通知推送] 重试失败:`, error);
            return await this.retryNotification(alert, retryCount + 1);
        }
    }

    /**
     * 保存通知记录
     */
    saveNotification(notification) {
        try {
            const notifications = this.getNotifications();
            notifications.unshift(notification);
            
            // 只保留最近1000条
            if (notifications.length > 1000) {
                notifications.splice(1000);
            }
            
            localStorage.setItem(this.notificationKey, JSON.stringify(notifications));
        } catch (error) {
            console.error('保存通知记录失败:', error);
        }
    }

    /**
     * 获取通知记录
     */
    getNotifications(limit = 100) {
        try {
            const data = localStorage.getItem(this.notificationKey);
            const notifications = JSON.parse(data) || [];
            return notifications.slice(0, limit);
        } catch (error) {
            console.error('获取通知记录失败:', error);
            return [];
        }
    }

    /**
     * 批量发送通知
     */
    async batchSendNotifications(alerts, batchSize = 10) {
        const results = [];
        
        // 分批发送，避免一次性发送过多
        for (let i = 0; i < alerts.length; i += batchSize) {
            const batch = alerts.slice(i, i + batchSize);
            const batchResults = await this.pushAlertNotifications(batch);
            results.push(batchResults);
            
            // 批次间延迟
            if (i + batchSize < alerts.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        return results;
    }

    // ==================== 任务 11.5: 流式处理引擎 ====================

    /**
     * 启动流式处理引擎
     * 模拟Apache Flink或Kafka Streams的流式处理能力
     */
    startStreamProcessing() {
        if (this.streamProcessingEnabled) {
            console.log('[流式处理引擎] 引擎已在运行中');
            return { success: false, message: '引擎已在运行中' };
        }

        console.log('[流式处理引擎] 启动流式处理引擎');
        
        this.streamProcessingEnabled = true;
        this.streamBuffer = []; // 流式数据缓冲区
        this.streamWindowSize = 1000; // 窗口大小（毫秒）
        this.streamBatchSize = 100; // 批次大小
        
        // 启动流式处理循环
        this.startStreamLoop();
        
        return { success: true, message: '流式处理引擎已启动' };
    }

    /**
     * 停止流式处理引擎
     */
    stopStreamProcessing() {
        console.log('[流式处理引擎] 停止流式处理引擎');
        this.streamProcessingEnabled = false;
        
        if (this.streamProcessingTimer) {
            clearInterval(this.streamProcessingTimer);
            this.streamProcessingTimer = null;
        }
        
        return { success: true, message: '流式处理引擎已停止' };
    }

    /**
     * 启动流式处理循环
     */
    startStreamLoop() {
        // 使用较短的间隔实现准实时处理（秒级）
        this.streamProcessingTimer = setInterval(async () => {
            await this.processStreamBatch();
        }, this.streamWindowSize);
    }

    /**
     * 处理流式批次
     */
    async processStreamBatch() {
        if (this.streamBuffer.length === 0) {
            return;
        }

        const startTime = Date.now();
        const batch = this.streamBuffer.splice(0, this.streamBatchSize);
        
        console.log(`[流式处理引擎] 处理批次: ${batch.length}条数据`);

        try {
            // 流式规则检查
            const checkResult = await this.autoCheckRules(batch);
            
            // 流式预警生成
            if (checkResult.alerts && checkResult.alerts.length > 0) {
                console.log(`[流式处理引擎] 生成${checkResult.alerts.length}条预警`);
                
                // 流式通知推送
                await this.pushAlertNotifications(checkResult.alerts);
            }
            
            const duration = Date.now() - startTime;
            console.log(`[流式处理引擎] 批次处理完成，耗时${duration}ms`);
            
            // 记录流式处理统计
            this.recordStreamStatistics({
                batchSize: batch.length,
                alertsGenerated: checkResult.alerts?.length || 0,
                processingTime: duration,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('[流式处理引擎] 批次处理失败:', error);
        }
    }

    /**
     * 向流式缓冲区添加数据
     */
    addToStreamBuffer(data) {
        if (!this.streamProcessingEnabled) {
            return;
        }

        if (Array.isArray(data)) {
            this.streamBuffer.push(...data);
        } else {
            this.streamBuffer.push(data);
        }

        // 限制缓冲区大小
        if (this.streamBuffer.length > 10000) {
            console.warn('[流式处理引擎] 缓冲区溢出，丢弃旧数据');
            this.streamBuffer = this.streamBuffer.slice(-10000);
        }
    }

    /**
     * 记录流式处理统计
     */
    recordStreamStatistics(stats) {
        try {
            const streamStats = this.getStreamStatistics();
            streamStats.history.unshift(stats);
            
            // 只保留最近1000条记录
            if (streamStats.history.length > 1000) {
                streamStats.history.splice(1000);
            }
            
            // 更新汇总统计
            streamStats.summary.totalBatches++;
            streamStats.summary.totalRecords += stats.batchSize;
            streamStats.summary.totalAlerts += stats.alertsGenerated;
            streamStats.summary.avgProcessingTime = 
                (streamStats.summary.avgProcessingTime * (streamStats.summary.totalBatches - 1) + stats.processingTime) 
                / streamStats.summary.totalBatches;
            
            localStorage.setItem('stream_statistics', JSON.stringify(streamStats));
        } catch (error) {
            console.error('记录流式处理统计失败:', error);
        }
    }

    /**
     * 获取流式处理统计
     */
    getStreamStatistics() {
        try {
            const data = localStorage.getItem('stream_statistics');
            return JSON.parse(data) || {
                summary: {
                    totalBatches: 0,
                    totalRecords: 0,
                    totalAlerts: 0,
                    avgProcessingTime: 0
                },
                history: []
            };
        } catch (error) {
            return {
                summary: {
                    totalBatches: 0,
                    totalRecords: 0,
                    totalAlerts: 0,
                    avgProcessingTime: 0
                },
                history: []
            };
        }
    }

    /**
     * 配置流式处理参数
     */
    configureStreamProcessing(config) {
        if (config.windowSize) {
            this.streamWindowSize = config.windowSize;
        }
        if (config.batchSize) {
            this.streamBatchSize = config.batchSize;
        }
        
        console.log('[流式处理引擎] 配置已更新:', config);
        
        // 如果引擎正在运行，重启以应用新配置
        if (this.streamProcessingEnabled) {
            this.stopStreamProcessing();
            this.startStreamProcessing();
        }
        
        return { success: true, config: { windowSize: this.streamWindowSize, batchSize: this.streamBatchSize } };
    }

    // ==================== 主处理循环 ====================

    /**
     * 启动定时处理
     */
    startProcessing() {
        if (this.processingTimer) {
            clearInterval(this.processingTimer);
        }

        // 定时处理队列中的变更
        this.processingTimer = setInterval(async () => {
            await this.processChangeQueue();
        }, this.processingInterval);

        console.log('[实时预警引擎] 定时处理已启动');
    }

    /**
     * 停止定时处理
     */
    stopProcessing() {
        if (this.processingTimer) {
            clearInterval(this.processingTimer);
            this.processingTimer = null;
        }
        console.log('[实时预警引擎] 定时处理已停止');
    }

    /**
     * 处理变更队列
     */
    async processChangeQueue() {
        console.log('[实时预警引擎] 开始处理变更队列');

        // 1. 监听所有数据源的变更
        const allChanges = [];
        for (const [dataSourceId, listener] of this.listeners) {
            if (listener.enabled) {
                const changes = await this.monitorDataChanges(dataSourceId);
                allChanges.push(...changes);
            }
        }

        if (allChanges.length === 0) {
            console.log('[实时预警引擎] 没有新的数据变更');
            return;
        }

        // 2. 加入变更队列
        this.enqueueChanges(allChanges);

        // 3. 如果启用了流式处理，加入流式缓冲区
        if (this.streamProcessingEnabled) {
            this.addToStreamBuffer(allChanges);
        } else {
            // 4. 否则使用批处理模式
            const unprocessedChanges = this.changeQueue.filter(c => !c.processed);
            
            if (unprocessedChanges.length > 0) {
                // 执行规则检查
                const checkResult = await this.autoCheckRules(unprocessedChanges);
                
                // 推送预警通知
                if (checkResult.alerts && checkResult.alerts.length > 0) {
                    await this.pushAlertNotifications(checkResult.alerts);
                }
                
                // 清理已处理的变更
                this.clearProcessedChanges();
            }
        }

        // 5. 更新统计
        this.updateStatistics(allChanges.length);
    }

    /**
     * 更新统计信息
     */
    updateStatistics(changesCount) {
        const config = this.getConfig();
        if (!config.statistics) {
            config.statistics = {
                totalChanges: 0,
                totalAlerts: 0,
                totalNotifications: 0
            };
        }
        
        config.statistics.totalChanges += changesCount;
        this.saveConfig(config);
    }

    /**
     * 获取引擎统计
     */
    getEngineStatistics() {
        const config = this.getConfig();
        const notifications = this.getNotifications();
        const streamStats = this.getStreamStatistics();
        
        return {
            listeners: {
                total: this.listeners.size,
                enabled: Array.from(this.listeners.values()).filter(l => l.enabled).length
            },
            changes: {
                total: config.statistics?.totalChanges || 0,
                queued: this.changeQueue.length,
                unprocessed: this.changeQueue.filter(c => !c.processed).length
            },
            alerts: {
                total: config.statistics?.totalAlerts || 0
            },
            notifications: {
                total: notifications.length,
                success: notifications.filter(n => n.status === 'SUCCESS').length,
                failed: notifications.filter(n => n.status === 'FAILED').length
            },
            streamProcessing: {
                enabled: this.streamProcessingEnabled,
                bufferSize: this.streamBuffer?.length || 0,
                ...streamStats.summary
            }
        };
    }

    /**
     * 手动触发处理
     */
    async triggerProcessing() {
        console.log('[实时预警引擎] 手动触发处理');
        await this.processChangeQueue();
        return { success: true, message: '处理已触发' };
    }

    /**
     * 重置引擎
     */
    reset() {
        this.stopProcessing();
        this.stopStreamProcessing();
        this.changeQueue = [];
        this.streamBuffer = [];
        this.listeners.clear();
        
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.changeQueueKey);
        localStorage.removeItem(this.notificationKey);
        localStorage.removeItem('stream_statistics');
        
        this.init();
        
        console.log('[实时预警引擎] 引擎已重置');
        return { success: true, message: '引擎已重置' };
    }
}

// 创建全局实例
window.realtimeAlertEngine = new RealtimeAlertEngine();

// 导出类
window.RealtimeAlertEngine = RealtimeAlertEngine;
