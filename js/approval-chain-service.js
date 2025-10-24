/**
 * 审批链还原服务
 * Approval Chain Restoration Service
 * 
 * 功能:
 * - 从业务系统采集审批数据
 * - 还原完整的审批流程节点
 * - 检测审批异常
 * - 整合多系统审批数据
 */

class ApprovalChainService {
    constructor() {
        this.approvalChains = new Map();
        this.approvalNodes = new Map();
        this.systemIntegrations = new Map();
        this.anomalyDetectors = [];
        this.initializeMockData();
    }

    /**
     * 初始化模拟数据
     */
    initializeMockData() {
        // 模拟审批链数据
        const mockChains = [
            {
                id: 'AC001',
                businessId: 'BIZ2024001',
                businessType: '采购申请',
                businessTitle: '办公设备采购申请',
                amount: 150000,
                applicant: '张三',
                applicantId: 'U001',
                department: '行政部',
                status: 'COMPLETED',
                startTime: new Date('2024-01-15T09:00:00'),
                endTime: new Date('2024-01-18T16:30:00'),
                totalDuration: 3.5 * 24 * 60, // 分钟
                sourceSystem: '采购系统',
                nodes: [
                    {
                        id: 'N001',
                        nodeType: '申请提交',
                        nodeName: '提交申请',
                        approver: '张三',
                        approverId: 'U001',
                        approverRole: '申请人',
                        approvalTime: new Date('2024-01-15T09:00:00'),
                        opinion: '申请采购办公设备',
                        result: 'SUBMITTED',
                        duration: 0,
                        isRequired: true,
                        sequence: 1
                    },
                    {
                        id: 'N002',
                        nodeType: '部门审批',
                        nodeName: '部门负责人审批',
                        approver: '李四',
                        approverId: 'U002',
                        approverRole: '部门负责人',
                        approvalTime: new Date('2024-01-15T14:30:00'),
                        opinion: '同意采购',
                        result: 'APPROVED',
                        duration: 330, // 5.5小时
                        isRequired: true,
                        sequence: 2
                    },
                    {
                        id: 'N003',
                        nodeType: '财务审批',
                        nodeName: '财务部门审批',
                        approver: '王五',
                        approverId: 'U003',
                        approverRole: '财务负责人',
                        approvalTime: new Date('2024-01-16T10:00:00'),
                        opinion: '预算充足,同意',
                        result: 'APPROVED',
                        duration: 1170, // 19.5小时
                        isRequired: true,
                        sequence: 3
                    },
                    {
                        id: 'N004',
                        nodeType: '领导审批',
                        nodeName: '分管领导审批',
                        approver: '赵六',
                        approverId: 'U004',
                        approverRole: '分管副校长',
                        approvalTime: new Date('2024-01-18T16:30:00'),
                        opinion: '同意采购',
                        result: 'APPROVED',
                        duration: 3390, // 56.5小时
                        isRequired: true,
                        sequence: 4
                    }
                ],
                anomalies: []
            },
            {
                id: 'AC002',
                businessId: 'BIZ2024002',
                businessType: '报销申请',
                businessTitle: '差旅费报销',
                amount: 8500,
                applicant: '孙七',
                applicantId: 'U005',
                department: '科研处',
                status: 'COMPLETED',
                startTime: new Date('2024-01-20T10:00:00'),
                endTime: new Date('2024-01-20T15:00:00'),
                totalDuration: 300, // 5小时
                sourceSystem: '财务系统',
                nodes: [
                    {
                        id: 'N005',
                        nodeType: '申请提交',
                        nodeName: '提交报销',
                        approver: '孙七',
                        approverId: 'U005',
                        approverRole: '申请人',
                        approvalTime: new Date('2024-01-20T10:00:00'),
                        opinion: '出差北京参加学术会议',
                        result: 'SUBMITTED',
                        duration: 0,
                        isRequired: true,
                        sequence: 1
                    },
                    {
                        id: 'N006',
                        nodeType: '部门审批',
                        nodeName: '部门负责人审批',
                        approver: null,
                        approverId: null,
                        approverRole: '部门负责人',
                        approvalTime: null,
                        opinion: null,
                        result: 'SKIPPED',
                        duration: 0,
                        isRequired: true,
                        sequence: 2,
                        skipped: true
                    },
                    {
                        id: 'N007',
                        nodeType: '财务审批',
                        nodeName: '财务审核',
                        approver: '周八',
                        approverId: 'U006',
                        approverRole: '财务审核员',
                        approvalTime: new Date('2024-01-20T15:00:00'),
                        opinion: '票据齐全,同意报销',
                        result: 'APPROVED',
                        duration: 300,
                        isRequired: true,
                        sequence: 3
                    }
                ],
                anomalies: [
                    {
                        type: 'SKIPPED_NODE',
                        nodeId: 'N006',
                        nodeName: '部门负责人审批',
                        description: '跳过必需审批节点',
                        severity: 'HIGH',
                        detectedTime: new Date()
                    }
                ]
            },
            {
                id: 'AC003',
                businessId: 'BIZ2024003',
                businessType: '合同审批',
                businessTitle: '实验室设备采购合同',
                amount: 500000,
                applicant: '吴九',
                applicantId: 'U007',
                department: '实验室管理处',
                status: 'IN_PROGRESS',
                startTime: new Date('2024-01-10T09:00:00'),
                endTime: null,
                totalDuration: null,
                sourceSystem: '合同系统',
                nodes: [
                    {
                        id: 'N008',
                        nodeType: '申请提交',
                        nodeName: '提交合同',
                        approver: '吴九',
                        approverId: 'U007',
                        approverRole: '申请人',
                        approvalTime: new Date('2024-01-10T09:00:00'),
                        opinion: '提交设备采购合同',
                        result: 'SUBMITTED',
                        duration: 0,
                        isRequired: true,
                        sequence: 1
                    },
                    {
                        id: 'N009',
                        nodeType: '法务审批',
                        nodeName: '法务审核',
                        approver: '郑十',
                        approverId: 'U008',
                        approverRole: '法务专员',
                        approvalTime: new Date('2024-01-12T16:00:00'),
                        opinion: '合同条款需修改',
                        result: 'REJECTED',
                        duration: 3420, // 57小时
                        isRequired: true,
                        sequence: 2
                    },
                    {
                        id: 'N010',
                        nodeType: '申请修改',
                        nodeName: '修改后重新提交',
                        approver: '吴九',
                        approverId: 'U007',
                        approverRole: '申请人',
                        approvalTime: new Date('2024-01-15T10:00:00'),
                        opinion: '已按要求修改合同',
                        result: 'RESUBMITTED',
                        duration: 3960, // 66小时
                        isRequired: true,
                        sequence: 3
                    },
                    {
                        id: 'N011',
                        nodeType: '法务审批',
                        nodeName: '法务复审',
                        approver: '郑十',
                        approverId: 'U008',
                        approverRole: '法务专员',
                        approvalTime: new Date('2024-01-16T14:00:00'),
                        opinion: '合同条款符合要求',
                        result: 'APPROVED',
                        duration: 1680, // 28小时
                        isRequired: true,
                        sequence: 4
                    },
                    {
                        id: 'N012',
                        nodeType: '领导审批',
                        nodeName: '校长审批',
                        approver: null,
                        approverId: null,
                        approverRole: '校长',
                        approvalTime: null,
                        opinion: null,
                        result: 'PENDING',
                        duration: null,
                        isRequired: true,
                        sequence: 5,
                        pending: true,
                        pendingDays: Math.floor((new Date() - new Date('2024-01-16T14:00:00')) / (1000 * 60 * 60 * 24))
                    }
                ],
                anomalies: [
                    {
                        type: 'TIMEOUT',
                        nodeId: 'N012',
                        nodeName: '校长审批',
                        description: '审批超时,已超过标准时限(3个工作日)',
                        severity: 'MEDIUM',
                        detectedTime: new Date(),
                        timeoutDays: Math.floor((new Date() - new Date('2024-01-16T14:00:00')) / (1000 * 60 * 60 * 24))
                    }
                ]
            }
        ];

        mockChains.forEach(chain => {
            this.approvalChains.set(chain.id, chain);
            chain.nodes.forEach(node => {
                this.approvalNodes.set(node.id, { ...node, chainId: chain.id });
            });
        });

        // 初始化系统集成配置
        this.systemIntegrations.set('采购系统', {
            systemId: 'SYS001',
            systemName: '采购系统',
            apiEndpoint: '/api/procurement/approvals',
            enabled: true,
            lastSyncTime: new Date()
        });
        this.systemIntegrations.set('财务系统', {
            systemId: 'SYS002',
            systemName: '财务系统',
            apiEndpoint: '/api/finance/approvals',
            enabled: true,
            lastSyncTime: new Date()
        });
        this.systemIntegrations.set('合同系统', {
            systemId: 'SYS003',
            systemName: '合同系统',
            apiEndpoint: '/api/contract/approvals',
            enabled: true,
            lastSyncTime: new Date()
        });
    }

    /**
     * 还原审批链
     * @param {string} businessId - 业务ID
     * @returns {Promise<Object>} 审批链信息
     */
    async restoreApprovalChain(businessId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 查找审批链
                const chain = Array.from(this.approvalChains.values())
                    .find(c => c.businessId === businessId);

                if (!chain) {
                    reject(new Error(`未找到业务ID为 ${businessId} 的审批链`));
                    return;
                }

                // 计算统计信息
                const stats = this.calculateChainStats(chain);

                resolve({
                    ...chain,
                    stats,
                    restoredAt: new Date()
                });
            }, 300);
        });
    }

    /**
     * 从多个系统采集审批数据
     * @param {string} businessId - 业务ID
     * @param {Array<string>} systems - 系统列表
     * @returns {Promise<Object>} 整合后的审批链
     */
    async collectFromMultipleSystems(businessId, systems = []) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const collectedData = {
                    businessId,
                    systems: [],
                    nodes: [],
                    integrationTime: new Date()
                };

                // 从各系统采集数据
                systems.forEach(systemName => {
                    const integration = this.systemIntegrations.get(systemName);
                    if (integration && integration.enabled) {
                        // 模拟从系统采集数据
                        const systemChain = Array.from(this.approvalChains.values())
                            .find(c => c.businessId === businessId && c.sourceSystem === systemName);

                        if (systemChain) {
                            collectedData.systems.push({
                                systemName,
                                systemId: integration.systemId,
                                nodeCount: systemChain.nodes.length,
                                collectTime: new Date()
                            });
                            collectedData.nodes.push(...systemChain.nodes.map(n => ({
                                ...n,
                                sourceSystem: systemName
                            })));
                        }
                    }
                });

                // 按时间排序节点
                collectedData.nodes.sort((a, b) => 
                    new Date(a.approvalTime) - new Date(b.approvalTime)
                );

                resolve(collectedData);
            }, 500);
        });
    }

    /**
     * 检测审批异常
     * @param {string} chainId - 审批链ID
     * @returns {Promise<Array>} 异常列表
     */
    async detectAnomalies(chainId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const chain = this.approvalChains.get(chainId);
                if (!chain) {
                    resolve([]);
                    return;
                }

                const anomalies = [];

                // 检测跳过节点
                chain.nodes.forEach(node => {
                    if (node.skipped && node.isRequired) {
                        anomalies.push({
                            type: 'SKIPPED_NODE',
                            nodeId: node.id,
                            nodeName: node.nodeName,
                            description: `跳过必需审批节点: ${node.nodeName}`,
                            severity: 'HIGH',
                            detectedTime: new Date()
                        });
                    }
                });

                // 检测超时审批
                chain.nodes.forEach(node => {
                    if (node.duration && node.duration > 4320) { // 超过3天(72小时)
                        anomalies.push({
                            type: 'TIMEOUT',
                            nodeId: node.id,
                            nodeName: node.nodeName,
                            description: `审批超时: ${node.nodeName}, 耗时 ${Math.floor(node.duration / 60)} 小时`,
                            severity: 'MEDIUM',
                            detectedTime: new Date(),
                            duration: node.duration
                        });
                    }
                });

                // 检测待审批超时
                chain.nodes.forEach(node => {
                    if (node.pending && node.pendingDays > 3) {
                        anomalies.push({
                            type: 'TIMEOUT',
                            nodeId: node.id,
                            nodeName: node.nodeName,
                            description: `审批超时: ${node.nodeName}, 已等待 ${node.pendingDays} 天`,
                            severity: 'MEDIUM',
                            detectedTime: new Date(),
                            timeoutDays: node.pendingDays
                        });
                    }
                });

                // 检测越权审批(简化版,实际需要权限配置)
                // 这里仅作示例
                chain.nodes.forEach((node, index) => {
                    if (index > 0 && node.result === 'APPROVED') {
                        const prevNode = chain.nodes[index - 1];
                        if (prevNode.result === 'REJECTED' || prevNode.result === 'SKIPPED') {
                            // 前置节点未通过,但当前节点通过了
                            if (!node.nodeName.includes('重新') && !node.nodeName.includes('复审')) {
                                anomalies.push({
                                    type: 'UNAUTHORIZED',
                                    nodeId: node.id,
                                    nodeName: node.nodeName,
                                    description: `可能存在越权审批: 前置节点未通过但继续审批`,
                                    severity: 'HIGH',
                                    detectedTime: new Date()
                                });
                            }
                        }
                    }
                });

                resolve(anomalies);
            }, 200);
        });
    }

    /**
     * 计算审批链统计信息
     * @param {Object} chain - 审批链
     * @returns {Object} 统计信息
     */
    calculateChainStats(chain) {
        const completedNodes = chain.nodes.filter(n => 
            n.result === 'APPROVED' || n.result === 'REJECTED'
        ).length;
        const pendingNodes = chain.nodes.filter(n => n.pending).length;
        const skippedNodes = chain.nodes.filter(n => n.skipped).length;
        
        const avgDuration = chain.nodes
            .filter(n => n.duration)
            .reduce((sum, n) => sum + n.duration, 0) / 
            (chain.nodes.filter(n => n.duration).length || 1);

        return {
            totalNodes: chain.nodes.length,
            completedNodes,
            pendingNodes,
            skippedNodes,
            avgDuration: Math.round(avgDuration),
            anomalyCount: chain.anomalies.length,
            completionRate: Math.round((completedNodes / chain.nodes.length) * 100)
        };
    }

    /**
     * 获取所有审批链
     * @param {Object} filter - 过滤条件
     * @returns {Promise<Array>} 审批链列表
     */
    async getApprovalChains(filter = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let chains = Array.from(this.approvalChains.values());

                // 应用过滤条件
                if (filter.status) {
                    chains = chains.filter(c => c.status === filter.status);
                }
                if (filter.businessType) {
                    chains = chains.filter(c => c.businessType === filter.businessType);
                }
                if (filter.department) {
                    chains = chains.filter(c => c.department === filter.department);
                }
                if (filter.hasAnomalies) {
                    chains = chains.filter(c => c.anomalies.length > 0);
                }
                if (filter.startDate) {
                    chains = chains.filter(c => new Date(c.startTime) >= new Date(filter.startDate));
                }
                if (filter.endDate) {
                    chains = chains.filter(c => new Date(c.startTime) <= new Date(filter.endDate));
                }

                // 添加统计信息
                chains = chains.map(chain => ({
                    ...chain,
                    stats: this.calculateChainStats(chain)
                }));

                resolve(chains);
            }, 200);
        });
    }

    /**
     * 获取审批链详情
     * @param {string} chainId - 审批链ID
     * @returns {Promise<Object>} 审批链详情
     */
    async getChainDetail(chainId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const chain = this.approvalChains.get(chainId);
                if (!chain) {
                    reject(new Error(`未找到ID为 ${chainId} 的审批链`));
                    return;
                }

                resolve({
                    ...chain,
                    stats: this.calculateChainStats(chain)
                });
            }, 100);
        });
    }

    /**
     * 导出审批链数据
     * @param {string} chainId - 审批链ID
     * @param {string} format - 导出格式 (json, csv, excel)
     * @returns {Promise<Object>} 导出数据
     */
    async exportChain(chainId, format = 'json') {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const chain = this.approvalChains.get(chainId);
                if (!chain) {
                    reject(new Error(`未找到ID为 ${chainId} 的审批链`));
                    return;
                }

                const exportData = {
                    chainId: chain.id,
                    businessId: chain.businessId,
                    businessType: chain.businessType,
                    businessTitle: chain.businessTitle,
                    applicant: chain.applicant,
                    department: chain.department,
                    status: chain.status,
                    startTime: chain.startTime,
                    endTime: chain.endTime,
                    nodes: chain.nodes.map(node => ({
                        序号: node.sequence,
                        节点名称: node.nodeName,
                        审批人: node.approver || '待审批',
                        审批角色: node.approverRole,
                        审批时间: node.approvalTime ? new Date(node.approvalTime).toLocaleString('zh-CN') : '-',
                        审批意见: node.opinion || '-',
                        审批结果: this.getResultText(node.result),
                        耗时: node.duration ? `${Math.floor(node.duration / 60)}小时${node.duration % 60}分钟` : '-'
                    })),
                    anomalies: chain.anomalies,
                    exportTime: new Date(),
                    format
                };

                resolve(exportData);
            }, 300);
        });
    }

    /**
     * 获取结果文本
     * @param {string} result - 结果代码
     * @returns {string} 结果文本
     */
    getResultText(result) {
        const resultMap = {
            'SUBMITTED': '已提交',
            'APPROVED': '已通过',
            'REJECTED': '已拒绝',
            'PENDING': '待审批',
            'SKIPPED': '已跳过',
            'RESUBMITTED': '重新提交'
        };
        return resultMap[result] || result;
    }

    /**
     * 获取系统集成配置
     * @returns {Array} 系统列表
     */
    getSystemIntegrations() {
        return Array.from(this.systemIntegrations.values());
    }

    /**
     * 分析审批效率
     * @param {string} chainId - 审批链ID
     * @returns {Promise<Object>} 效率分析结果
     */
    async analyzeEfficiency(chainId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const chain = this.approvalChains.get(chainId);
                if (!chain) {
                    reject(new Error(`未找到ID为 ${chainId} 的审批链`));
                    return;
                }

                const completedNodes = chain.nodes.filter(n => n.duration);
                const totalDuration = completedNodes.reduce((sum, n) => sum + n.duration, 0);
                const avgDuration = totalDuration / (completedNodes.length || 1);

                // 找出最慢的节点
                const slowestNode = completedNodes.reduce((max, node) => 
                    node.duration > (max?.duration || 0) ? node : max
                , null);

                // 找出最快的节点
                const fastestNode = completedNodes.reduce((min, node) => 
                    node.duration < (min?.duration || Infinity) ? node : min
                , null);

                resolve({
                    chainId,
                    totalDuration,
                    avgDuration: Math.round(avgDuration),
                    nodeCount: chain.nodes.length,
                    completedNodeCount: completedNodes.length,
                    slowestNode: slowestNode ? {
                        nodeName: slowestNode.nodeName,
                        approver: slowestNode.approver,
                        duration: slowestNode.duration,
                        durationText: `${Math.floor(slowestNode.duration / 60)}小时${slowestNode.duration % 60}分钟`
                    } : null,
                    fastestNode: fastestNode ? {
                        nodeName: fastestNode.nodeName,
                        approver: fastestNode.approver,
                        duration: fastestNode.duration,
                        durationText: `${Math.floor(fastestNode.duration / 60)}小时${fastestNode.duration % 60}分钟`
                    } : null,
                    efficiency: chain.status === 'COMPLETED' ? 
                        (totalDuration < 7200 ? 'HIGH' : totalDuration < 14400 ? 'MEDIUM' : 'LOW') : 
                        'PENDING'
                });
            }, 200);
        });
    }

    /**
     * 追溯责任人
     * @param {string} chainId - 审批链ID
     * @param {string} nodeId - 节点ID
     * @returns {Promise<Object>} 责任人信息
     */
    async traceResponsibility(chainId, nodeId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const node = this.approvalNodes.get(nodeId);
                if (!node || node.chainId !== chainId) {
                    reject(new Error(`未找到节点 ${nodeId}`));
                    return;
                }

                const chain = this.approvalChains.get(chainId);
                
                resolve({
                    nodeId,
                    nodeName: node.nodeName,
                    approver: node.approver,
                    approverId: node.approverId,
                    approverRole: node.approverRole,
                    department: chain.department,
                    approvalTime: node.approvalTime,
                    result: node.result,
                    opinion: node.opinion,
                    responsibility: {
                        isResponsible: node.result === 'APPROVED' || node.result === 'REJECTED',
                        action: this.getResultText(node.result),
                        timestamp: node.approvalTime
                    }
                });
            }, 100);
        });
    }
}

// 创建全局实例
window.approvalChainService = new ApprovalChainService();
