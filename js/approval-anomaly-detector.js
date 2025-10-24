/**
 * 审批异常检测器
 * Approval Anomaly Detector
 * 
 * 功能:
 * - 检测跳过节点
 * - 检测超时审批
 * - 检测越权审批
 * - 生成异常预警
 */

class ApprovalAnomalyDetector {
    constructor() {
        this.detectionRules = [];
        this.anomalyThresholds = {
            timeout: {
                normal: 4320, // 3天 (分钟)
                urgent: 1440, // 1天
                critical: 480  // 8小时
            },
            pendingTimeout: {
                normal: 3, // 3天
                urgent: 1, // 1天
                critical: 0.5 // 半天
            }
        };
        this.initializeDetectionRules();
    }

    /**
     * 初始化检测规则
     */
    initializeDetectionRules() {
        // 规则1: 跳过必需节点
        this.detectionRules.push({
            id: 'RULE_SKIP_001',
            name: '跳过必需审批节点',
            type: 'SKIPPED_NODE',
            severity: 'HIGH',
            check: (chain, node) => {
                return node.skipped && node.isRequired;
            },
            generateAnomaly: (chain, node) => ({
                type: 'SKIPPED_NODE',
                ruleId: 'RULE_SKIP_001',
                nodeId: node.id,
                nodeName: node.nodeName,
                description: `跳过必需审批节点: ${node.nodeName}`,
                severity: 'HIGH',
                detectedTime: new Date(),
                evidence: {
                    nodeType: node.nodeType,
                    isRequired: node.isRequired,
                    sequence: node.sequence
                }
            })
        });

        // 规则2: 审批超时
        this.detectionRules.push({
            id: 'RULE_TIMEOUT_001',
            name: '审批处理超时',
            type: 'TIMEOUT',
            severity: 'MEDIUM',
            check: (chain, node) => {
                if (!node.duration) return false;
                const threshold = this.getTimeoutThreshold(chain.businessType);
                return node.duration > threshold;
            },
            generateAnomaly: (chain, node) => {
                const hours = Math.floor(node.duration / 60);
                const minutes = node.duration % 60;
                return {
                    type: 'TIMEOUT',
                    ruleId: 'RULE_TIMEOUT_001',
                    nodeId: node.id,
                    nodeName: node.nodeName,
                    description: `审批超时: ${node.nodeName}, 耗时 ${hours}小时${minutes}分钟`,
                    severity: this.getTimeoutSeverity(node.duration),
                    detectedTime: new Date(),
                    evidence: {
                        duration: node.duration,
                        durationText: `${hours}小时${minutes}分钟`,
                        threshold: this.getTimeoutThreshold(chain.businessType),
                        approver: node.approver
                    }
                };
            }
        });

        // 规则3: 待审批超时
        this.detectionRules.push({
            id: 'RULE_TIMEOUT_002',
            name: '待审批超时',
            type: 'TIMEOUT',
            severity: 'MEDIUM',
            check: (chain, node) => {
                return node.pending && node.pendingDays > this.anomalyThresholds.pendingTimeout.normal;
            },
            generateAnomaly: (chain, node) => ({
                type: 'TIMEOUT',
                ruleId: 'RULE_TIMEOUT_002',
                nodeId: node.id,
                nodeName: node.nodeName,
                description: `待审批超时: ${node.nodeName}, 已等待 ${node.pendingDays} 天`,
                severity: this.getPendingTimeoutSeverity(node.pendingDays),
                detectedTime: new Date(),
                evidence: {
                    pendingDays: node.pendingDays,
                    approverRole: node.approverRole,
                    expectedDays: this.anomalyThresholds.pendingTimeout.normal
                }
            })
        });

        // 规则4: 越权审批
        this.detectionRules.push({
            id: 'RULE_UNAUTHORIZED_001',
            name: '可能的越权审批',
            type: 'UNAUTHORIZED',
            severity: 'HIGH',
            check: (chain, node, index) => {
                if (index === 0 || node.result !== 'APPROVED') return false;
                const prevNode = chain.nodes[index - 1];
                // 前置节点未通过,但当前节点通过了(排除重新提交和复审)
                if ((prevNode.result === 'REJECTED' || prevNode.result === 'SKIPPED') &&
                    !node.nodeName.includes('重新') && !node.nodeName.includes('复审')) {
                    return true;
                }
                return false;
            },
            generateAnomaly: (chain, node, index) => {
                const prevNode = chain.nodes[index - 1];
                return {
                    type: 'UNAUTHORIZED',
                    ruleId: 'RULE_UNAUTHORIZED_001',
                    nodeId: node.id,
                    nodeName: node.nodeName,
                    description: `可能存在越权审批: 前置节点"${prevNode.nodeName}"未通过,但继续审批`,
                    severity: 'HIGH',
                    detectedTime: new Date(),
                    evidence: {
                        currentNode: node.nodeName,
                        currentApprover: node.approver,
                        previousNode: prevNode.nodeName,
                        previousResult: prevNode.result
                    }
                };
            }
        });

        // 规则5: 审批顺序异常
        this.detectionRules.push({
            id: 'RULE_SEQUENCE_001',
            name: '审批顺序异常',
            type: 'SEQUENCE_ERROR',
            severity: 'MEDIUM',
            check: (chain, node, index) => {
                if (index === 0) return false;
                const prevNode = chain.nodes[index - 1];
                // 检查时间顺序
                if (node.approvalTime && prevNode.approvalTime) {
                    return new Date(node.approvalTime) < new Date(prevNode.approvalTime);
                }
                return false;
            },
            generateAnomaly: (chain, node, index) => {
                const prevNode = chain.nodes[index - 1];
                return {
                    type: 'SEQUENCE_ERROR',
                    ruleId: 'RULE_SEQUENCE_001',
                    nodeId: node.id,
                    nodeName: node.nodeName,
                    description: `审批顺序异常: "${node.nodeName}"的审批时间早于前置节点"${prevNode.nodeName}"`,
                    severity: 'MEDIUM',
                    detectedTime: new Date(),
                    evidence: {
                        currentTime: node.approvalTime,
                        previousTime: prevNode.approvalTime,
                        currentNode: node.nodeName,
                        previousNode: prevNode.nodeName
                    }
                };
            }
        });

        // 规则6: 同一人连续审批
        this.detectionRules.push({
            id: 'RULE_DUPLICATE_001',
            name: '同一人连续审批',
            type: 'DUPLICATE_APPROVER',
            severity: 'MEDIUM',
            check: (chain, node, index) => {
                if (index === 0 || !node.approverId) return false;
                const prevNode = chain.nodes[index - 1];
                // 同一人在连续节点审批(排除申请人和重新提交)
                if (node.approverId === prevNode.approverId &&
                    node.nodeType !== '申请提交' && 
                    node.nodeType !== '申请修改') {
                    return true;
                }
                return false;
            },
            generateAnomaly: (chain, node, index) => {
                const prevNode = chain.nodes[index - 1];
                return {
                    type: 'DUPLICATE_APPROVER',
                    ruleId: 'RULE_DUPLICATE_001',
                    nodeId: node.id,
                    nodeName: node.nodeName,
                    description: `同一人连续审批: ${node.approver}在"${prevNode.nodeName}"和"${node.nodeName}"连续审批`,
                    severity: 'MEDIUM',
                    detectedTime: new Date(),
                    evidence: {
                        approver: node.approver,
                        approverId: node.approverId,
                        nodes: [prevNode.nodeName, node.nodeName]
                    }
                };
            }
        });

        // 规则7: 快速审批(可能未认真审核)
        this.detectionRules.push({
            id: 'RULE_FAST_001',
            name: '快速审批预警',
            type: 'FAST_APPROVAL',
            severity: 'LOW',
            check: (chain, node) => {
                // 重要审批(金额大或关键节点)在5分钟内完成
                if (!node.duration || node.duration > 5) return false;
                const isImportant = chain.amount > 100000 || 
                                   node.nodeType === '领导审批' ||
                                   node.nodeType === '法务审批';
                return isImportant && node.result === 'APPROVED';
            },
            generateAnomaly: (chain, node) => ({
                type: 'FAST_APPROVAL',
                ruleId: 'RULE_FAST_001',
                nodeId: node.id,
                nodeName: node.nodeName,
                description: `快速审批: ${node.nodeName}在${node.duration}分钟内完成,可能未充分审核`,
                severity: 'LOW',
                detectedTime: new Date(),
                evidence: {
                    duration: node.duration,
                    amount: chain.amount,
                    nodeType: node.nodeType,
                    approver: node.approver
                }
            })
        });
    }

    /**
     * 检测审批链异常
     * @param {Object} chain - 审批链
     * @returns {Array} 异常列表
     */
    detectChainAnomalies(chain) {
        const anomalies = [];

        chain.nodes.forEach((node, index) => {
            this.detectionRules.forEach(rule => {
                try {
                    if (rule.check(chain, node, index)) {
                        const anomaly = rule.generateAnomaly(chain, node, index);
                        anomalies.push(anomaly);
                    }
                } catch (error) {
                    console.error(`规则 ${rule.id} 执行失败:`, error);
                }
            });
        });

        return anomalies;
    }

    /**
     * 批量检测多个审批链
     * @param {Array} chains - 审批链列表
     * @returns {Object} 检测结果
     */
    batchDetect(chains) {
        const results = {
            totalChains: chains.length,
            chainsWithAnomalies: 0,
            totalAnomalies: 0,
            anomaliesByType: {},
            anomaliesBySeverity: {
                HIGH: 0,
                MEDIUM: 0,
                LOW: 0
            },
            details: []
        };

        chains.forEach(chain => {
            const anomalies = this.detectChainAnomalies(chain);
            
            if (anomalies.length > 0) {
                results.chainsWithAnomalies++;
                results.totalAnomalies += anomalies.length;

                // 统计异常类型
                anomalies.forEach(anomaly => {
                    results.anomaliesByType[anomaly.type] = 
                        (results.anomaliesByType[anomaly.type] || 0) + 1;
                    results.anomaliesBySeverity[anomaly.severity]++;
                });

                results.details.push({
                    chainId: chain.id,
                    businessId: chain.businessId,
                    businessTitle: chain.businessTitle,
                    anomalyCount: anomalies.length,
                    anomalies
                });
            }
        });

        return results;
    }

    /**
     * 生成异常预警
     * @param {Object} anomaly - 异常信息
     * @param {Object} chain - 审批链
     * @returns {Object} 预警信息
     */
    generateAlert(anomaly, chain) {
        return {
            id: `ALERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            alertType: 'APPROVAL_ANOMALY',
            anomalyType: anomaly.type,
            severity: anomaly.severity,
            title: `审批异常: ${anomaly.description}`,
            description: anomaly.description,
            businessId: chain.businessId,
            businessType: chain.businessType,
            businessTitle: chain.businessTitle,
            chainId: chain.id,
            nodeId: anomaly.nodeId,
            nodeName: anomaly.nodeName,
            evidence: anomaly.evidence,
            detectedTime: anomaly.detectedTime,
            status: 'NEW',
            assignedTo: null,
            resolvedAt: null
        };
    }

    /**
     * 获取超时阈值
     * @param {string} businessType - 业务类型
     * @returns {number} 阈值(分钟)
     */
    getTimeoutThreshold(businessType) {
        const thresholds = {
            '报销申请': 1440, // 1天
            '采购申请': 4320, // 3天
            '合同审批': 7200, // 5天
            '项目审批': 10080 // 7天
        };
        return thresholds[businessType] || this.anomalyThresholds.timeout.normal;
    }

    /**
     * 获取超时严重程度
     * @param {number} duration - 持续时间(分钟)
     * @returns {string} 严重程度
     */
    getTimeoutSeverity(duration) {
        if (duration > 14400) return 'HIGH'; // 超过10天
        if (duration > 7200) return 'MEDIUM'; // 超过5天
        return 'LOW';
    }

    /**
     * 获取待审批超时严重程度
     * @param {number} days - 等待天数
     * @returns {string} 严重程度
     */
    getPendingTimeoutSeverity(days) {
        if (days > 7) return 'HIGH';
        if (days > 3) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * 获取检测规则列表
     * @returns {Array} 规则列表
     */
    getDetectionRules() {
        return this.detectionRules.map(rule => ({
            id: rule.id,
            name: rule.name,
            type: rule.type,
            severity: rule.severity
        }));
    }

    /**
     * 更新检测阈值
     * @param {Object} thresholds - 新的阈值配置
     */
    updateThresholds(thresholds) {
        this.anomalyThresholds = {
            ...this.anomalyThresholds,
            ...thresholds
        };
    }
}

// 创建全局实例
window.approvalAnomalyDetector = new ApprovalAnomalyDetector();
