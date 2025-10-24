/**
 * 审批系统整合服务
 * Approval System Integration Service
 * 
 * 功能:
 * - 整合多系统审批数据
 * - 形成完整审批链路
 * - 处理跨系统审批流转
 */

class ApprovalSystemIntegration {
    constructor() {
        this.systems = new Map();
        this.integrationRules = [];
        this.dataMappers = new Map();
        this.initializeSystems();
        this.initializeMappers();
    }

    /**
     * 初始化系统配置
     */
    initializeSystems() {
        // 采购系统
        this.systems.set('procurement', {
            id: 'SYS_PROCUREMENT',
            name: '采购系统',
            type: 'PROCUREMENT',
            apiEndpoint: '/api/procurement/approvals',
            enabled: true,
            priority: 1,
            dataFormat: 'json',
            authType: 'api_key',
            syncInterval: 300, // 5分钟
            lastSyncTime: new Date(),
            status: 'ACTIVE',
            nodeTypes: ['采购申请', '采购审批', '合同签订'],
            fields: {
                businessId: 'procurement_id',
                businessTitle: 'procurement_title',
                amount: 'total_amount',
                applicant: 'applicant_name',
                department: 'dept_name',
                approvalNodes: 'approval_records'
            }
        });

        // 财务系统
        this.systems.set('finance', {
            id: 'SYS_FINANCE',
            name: '财务系统',
            type: 'FINANCE',
            apiEndpoint: '/api/finance/approvals',
            enabled: true,
            priority: 2,
            dataFormat: 'json',
            authType: 'oauth2',
            syncInterval: 300,
            lastSyncTime: new Date(),
            status: 'ACTIVE',
            nodeTypes: ['报销申请', '付款审批', '预算审批'],
            fields: {
                businessId: 'finance_id',
                businessTitle: 'finance_title',
                amount: 'amount',
                applicant: 'applicant',
                department: 'department',
                approvalNodes: 'approvals'
            }
        });

        // 合同系统
        this.systems.set('contract', {
            id: 'SYS_CONTRACT',
            name: '合同系统',
            type: 'CONTRACT',
            apiEndpoint: '/api/contract/approvals',
            enabled: true,
            priority: 3,
            dataFormat: 'json',
            authType: 'api_key',
            syncInterval: 600,
            lastSyncTime: new Date(),
            status: 'ACTIVE',
            nodeTypes: ['合同审批', '法务审核', '领导签字'],
            fields: {
                businessId: 'contract_no',
                businessTitle: 'contract_name',
                amount: 'contract_amount',
                applicant: 'creator',
                department: 'dept',
                approvalNodes: 'approval_flow'
            }
        });

        // 人事系统
        this.systems.set('hr', {
            id: 'SYS_HR',
            name: '人事系统',
            type: 'HR',
            apiEndpoint: '/api/hr/approvals',
            enabled: true,
            priority: 4,
            dataFormat: 'xml',
            authType: 'basic',
            syncInterval: 600,
            lastSyncTime: new Date(),
            status: 'ACTIVE',
            nodeTypes: ['请假审批', '招聘审批', '调动审批'],
            fields: {
                businessId: 'hr_id',
                businessTitle: 'title',
                amount: null,
                applicant: 'employee_name',
                department: 'dept_name',
                approvalNodes: 'approval_list'
            }
        });

        // 科研系统
        this.systems.set('research', {
            id: 'SYS_RESEARCH',
            name: '科研系统',
            type: 'RESEARCH',
            apiEndpoint: '/api/research/approvals',
            enabled: true,
            priority: 5,
            dataFormat: 'json',
            authType: 'api_key',
            syncInterval: 600,
            lastSyncTime: new Date(),
            status: 'ACTIVE',
            nodeTypes: ['项目申请', '经费审批', '结题审批'],
            fields: {
                businessId: 'project_id',
                businessTitle: 'project_name',
                amount: 'budget',
                applicant: 'pi_name',
                department: 'department',
                approvalNodes: 'approval_records'
            }
        });
    }

    /**
     * 初始化数据映射器
     */
    initializeMappers() {
        // 采购系统数据映射器
        this.dataMappers.set('procurement', (rawData) => {
            return {
                businessId: rawData.procurement_id,
                businessType: '采购申请',
                businessTitle: rawData.procurement_title,
                amount: rawData.total_amount,
                applicant: rawData.applicant_name,
                applicantId: rawData.applicant_id,
                department: rawData.dept_name,
                sourceSystem: '采购系统',
                nodes: rawData.approval_records.map((record, index) => ({
                    id: `${rawData.procurement_id}_N${index + 1}`,
                    nodeType: record.node_type,
                    nodeName: record.node_name,
                    approver: record.approver_name,
                    approverId: record.approver_id,
                    approverRole: record.role,
                    approvalTime: new Date(record.approval_time),
                    opinion: record.opinion,
                    result: this.mapResult(record.result),
                    duration: record.duration_minutes,
                    isRequired: record.is_required,
                    sequence: index + 1,
                    sourceSystem: '采购系统'
                }))
            };
        });

        // 财务系统数据映射器
        this.dataMappers.set('finance', (rawData) => {
            return {
                businessId: rawData.finance_id,
                businessType: '报销申请',
                businessTitle: rawData.finance_title,
                amount: rawData.amount,
                applicant: rawData.applicant,
                applicantId: rawData.applicant_id,
                department: rawData.department,
                sourceSystem: '财务系统',
                nodes: rawData.approvals.map((approval, index) => ({
                    id: `${rawData.finance_id}_N${index + 1}`,
                    nodeType: approval.type,
                    nodeName: approval.name,
                    approver: approval.approver,
                    approverId: approval.approver_id,
                    approverRole: approval.role,
                    approvalTime: approval.time ? new Date(approval.time) : null,
                    opinion: approval.comment,
                    result: this.mapResult(approval.status),
                    duration: approval.duration,
                    isRequired: true,
                    sequence: index + 1,
                    sourceSystem: '财务系统'
                }))
            };
        });

        // 合同系统数据映射器
        this.dataMappers.set('contract', (rawData) => {
            return {
                businessId: rawData.contract_no,
                businessType: '合同审批',
                businessTitle: rawData.contract_name,
                amount: rawData.contract_amount,
                applicant: rawData.creator,
                applicantId: rawData.creator_id,
                department: rawData.dept,
                sourceSystem: '合同系统',
                nodes: rawData.approval_flow.map((flow, index) => ({
                    id: `${rawData.contract_no}_N${index + 1}`,
                    nodeType: flow.step_type,
                    nodeName: flow.step_name,
                    approver: flow.approver_name,
                    approverId: flow.approver_id,
                    approverRole: flow.approver_role,
                    approvalTime: flow.approved_at ? new Date(flow.approved_at) : null,
                    opinion: flow.remarks,
                    result: this.mapResult(flow.state),
                    duration: flow.time_spent,
                    isRequired: flow.required,
                    sequence: index + 1,
                    sourceSystem: '合同系统'
                }))
            };
        });
    }

    /**
     * 映射审批结果
     * @param {string} result - 原始结果
     * @returns {string} 标准结果
     */
    mapResult(result) {
        const resultMap = {
            'submitted': 'SUBMITTED',
            'approved': 'APPROVED',
            'rejected': 'REJECTED',
            'pending': 'PENDING',
            'skipped': 'SKIPPED',
            'pass': 'APPROVED',
            'reject': 'REJECTED',
            'agree': 'APPROVED',
            'disagree': 'REJECTED',
            '已提交': 'SUBMITTED',
            '已通过': 'APPROVED',
            '已拒绝': 'REJECTED',
            '待审批': 'PENDING',
            '已跳过': 'SKIPPED'
        };
        return resultMap[result?.toLowerCase()] || result;
    }

    /**
     * 从单个系统采集数据
     * @param {string} systemKey - 系统标识
     * @param {string} businessId - 业务ID
     * @returns {Promise<Object>} 采集结果
     */
    async collectFromSystem(systemKey, businessId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const system = this.systems.get(systemKey);
                if (!system) {
                    reject(new Error(`系统 ${systemKey} 不存在`));
                    return;
                }

                if (!system.enabled) {
                    reject(new Error(`系统 ${system.name} 未启用`));
                    return;
                }

                // 模拟API调用
                const mockData = this.generateMockData(systemKey, businessId);
                const mapper = this.dataMappers.get(systemKey);
                
                if (!mapper) {
                    reject(new Error(`系统 ${systemKey} 缺少数据映射器`));
                    return;
                }

                const mappedData = mapper(mockData);
                
                resolve({
                    systemKey,
                    systemName: system.name,
                    businessId,
                    data: mappedData,
                    collectTime: new Date(),
                    status: 'SUCCESS'
                });
            }, 300);
        });
    }

    /**
     * 从多个系统采集并整合数据
     * @param {string} businessId - 业务ID
     * @param {Array<string>} systemKeys - 系统列表
     * @returns {Promise<Object>} 整合结果
     */
    async integrateMultipleSystems(businessId, systemKeys) {
        return new Promise(async (resolve, reject) => {
            try {
                const results = [];
                const errors = [];

                // 并行采集各系统数据
                const promises = systemKeys.map(key => 
                    this.collectFromSystem(key, businessId)
                        .catch(error => ({ error, systemKey: key }))
                );

                const responses = await Promise.all(promises);

                // 分离成功和失败的结果
                responses.forEach(response => {
                    if (response.error) {
                        errors.push({
                            systemKey: response.systemKey,
                            error: response.error.message
                        });
                    } else {
                        results.push(response);
                    }
                });

                // 整合数据
                const integrated = this.mergeApprovalChains(results);

                resolve({
                    businessId,
                    systemCount: systemKeys.length,
                    successCount: results.length,
                    errorCount: errors.length,
                    systems: results.map(r => r.systemName),
                    errors,
                    integratedChain: integrated,
                    integratedAt: new Date()
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 合并多个审批链
     * @param {Array} results - 采集结果列表
     * @returns {Object} 合并后的审批链
     */
    mergeApprovalChains(results) {
        if (results.length === 0) {
            return null;
        }

        // 使用第一个系统的基本信息
        const baseData = results[0].data;
        
        // 合并所有节点
        const allNodes = [];
        results.forEach(result => {
            allNodes.push(...result.data.nodes);
        });

        // 按时间排序节点
        allNodes.sort((a, b) => {
            if (!a.approvalTime) return 1;
            if (!b.approvalTime) return -1;
            return new Date(a.approvalTime) - new Date(b.approvalTime);
        });

        // 重新分配序号
        allNodes.forEach((node, index) => {
            node.sequence = index + 1;
        });

        // 检测跨系统流转
        const crossSystemFlows = this.detectCrossSystemFlows(allNodes);

        return {
            businessId: baseData.businessId,
            businessType: baseData.businessType,
            businessTitle: baseData.businessTitle,
            amount: baseData.amount,
            applicant: baseData.applicant,
            department: baseData.department,
            status: this.determineOverallStatus(allNodes),
            startTime: allNodes[0]?.approvalTime,
            endTime: allNodes[allNodes.length - 1]?.approvalTime,
            nodes: allNodes,
            sourceSystems: results.map(r => r.systemName),
            crossSystemFlows,
            integrated: true,
            integratedAt: new Date()
        };
    }

    /**
     * 检测跨系统流转
     * @param {Array} nodes - 节点列表
     * @returns {Array} 跨系统流转记录
     */
    detectCrossSystemFlows(nodes) {
        const flows = [];
        
        for (let i = 1; i < nodes.length; i++) {
            const prevNode = nodes[i - 1];
            const currNode = nodes[i];
            
            if (prevNode.sourceSystem !== currNode.sourceSystem) {
                flows.push({
                    fromSystem: prevNode.sourceSystem,
                    toSystem: currNode.sourceSystem,
                    fromNode: prevNode.nodeName,
                    toNode: currNode.nodeName,
                    flowTime: currNode.approvalTime,
                    description: `从${prevNode.sourceSystem}流转到${currNode.sourceSystem}`
                });
            }
        }
        
        return flows;
    }

    /**
     * 确定整体状态
     * @param {Array} nodes - 节点列表
     * @returns {string} 状态
     */
    determineOverallStatus(nodes) {
        const hasRejected = nodes.some(n => n.result === 'REJECTED');
        const hasPending = nodes.some(n => n.result === 'PENDING' || !n.approvalTime);
        const allApproved = nodes.every(n => n.result === 'APPROVED' || n.result === 'SUBMITTED');

        if (hasRejected) return 'REJECTED';
        if (hasPending) return 'IN_PROGRESS';
        if (allApproved) return 'COMPLETED';
        return 'IN_PROGRESS';
    }

    /**
     * 生成模拟数据
     * @param {string} systemKey - 系统标识
     * @param {string} businessId - 业务ID
     * @returns {Object} 模拟数据
     */
    generateMockData(systemKey, businessId) {
        // 这里返回模拟数据,实际应该调用真实API
        if (systemKey === 'procurement') {
            return {
                procurement_id: businessId,
                procurement_title: '办公设备采购',
                total_amount: 150000,
                applicant_name: '张三',
                applicant_id: 'U001',
                dept_name: '行政部',
                approval_records: [
                    {
                        node_type: '申请提交',
                        node_name: '提交申请',
                        approver_name: '张三',
                        approver_id: 'U001',
                        role: '申请人',
                        approval_time: '2024-01-15T09:00:00',
                        opinion: '申请采购办公设备',
                        result: 'submitted',
                        duration_minutes: 0,
                        is_required: true
                    },
                    {
                        node_type: '部门审批',
                        node_name: '部门负责人审批',
                        approver_name: '李四',
                        approver_id: 'U002',
                        role: '部门负责人',
                        approval_time: '2024-01-15T14:30:00',
                        opinion: '同意采购',
                        result: 'approved',
                        duration_minutes: 330,
                        is_required: true
                    }
                ]
            };
        }
        
        return {};
    }

    /**
     * 获取系统列表
     * @returns {Array} 系统列表
     */
    getSystems() {
        return Array.from(this.systems.values());
    }

    /**
     * 获取系统详情
     * @param {string} systemKey - 系统标识
     * @returns {Object} 系统详情
     */
    getSystem(systemKey) {
        return this.systems.get(systemKey);
    }

    /**
     * 更新系统配置
     * @param {string} systemKey - 系统标识
     * @param {Object} config - 配置信息
     * @returns {Promise<Object>} 更新结果
     */
    async updateSystemConfig(systemKey, config) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const system = this.systems.get(systemKey);
                if (!system) {
                    reject(new Error(`系统 ${systemKey} 不存在`));
                    return;
                }

                Object.assign(system, config);
                this.systems.set(systemKey, system);

                resolve({
                    systemKey,
                    system,
                    updatedAt: new Date()
                });
            }, 100);
        });
    }

    /**
     * 测试系统连接
     * @param {string} systemKey - 系统标识
     * @returns {Promise<Object>} 测试结果
     */
    async testConnection(systemKey) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const system = this.systems.get(systemKey);
                if (!system) {
                    reject(new Error(`系统 ${systemKey} 不存在`));
                    return;
                }

                // 模拟连接测试
                const success = Math.random() > 0.1; // 90%成功率

                resolve({
                    systemKey,
                    systemName: system.name,
                    success,
                    message: success ? '连接成功' : '连接失败',
                    responseTime: Math.floor(Math.random() * 500) + 100,
                    testedAt: new Date()
                });
            }, 500);
        });
    }

    /**
     * 同步系统数据
     * @param {string} systemKey - 系统标识
     * @returns {Promise<Object>} 同步结果
     */
    async syncSystem(systemKey) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const system = this.systems.get(systemKey);
                if (!system) {
                    reject(new Error(`系统 ${systemKey} 不存在`));
                    return;
                }

                system.lastSyncTime = new Date();
                this.systems.set(systemKey, system);

                resolve({
                    systemKey,
                    systemName: system.name,
                    syncedRecords: Math.floor(Math.random() * 100) + 10,
                    syncTime: new Date()
                });
            }, 1000);
        });
    }
}

// 创建全局实例
window.approvalSystemIntegration = new ApprovalSystemIntegration();
