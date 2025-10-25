/**
 * 数据安全管理服务
 */

class DataSecurityService {
    constructor() {
        this.policies = [];
        this.maskingRules = [];
        this.accessControls = [];
        this.auditLogs = [];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await this.loadMockData();
        this.initialized = true;
    }

    async loadMockData() {
        // 安全策略
        this.policies = [
            { id: 'P001', name: '敏感数据访问策略', type: '访问控制', level: '高', status: 'enabled', description: '限制敏感数据的访问权限', createTime: '2024-01-15 10:00:00' },
            { id: 'P002', name: '数据脱敏策略', type: '数据脱敏', level: '中', status: 'enabled', description: '对个人信息进行脱敏处理', createTime: '2024-02-01 11:00:00' },
            { id: 'P003', name: '数据加密策略', type: '数据加密', level: '高', status: 'enabled', description: '对核心数据进行加密存储', createTime: '2024-02-15 14:00:00' },
            { id: 'P004', name: '审计日志策略', type: '审计监控', level: '中', status: 'enabled', description: '记录所有数据访问日志', createTime: '2024-03-01 09:00:00' },
            { id: 'P005', name: '数据备份策略', type: '数据备份', level: '高', status: 'enabled', description: '定期备份重要数据', createTime: '2024-03-10 16:00:00' }
        ];

        // 脱敏规则
        this.maskingRules = [
            { id: 'M001', name: '身份证号脱敏', field: 'id_card', maskType: '中间遮挡', pattern: '保留前6位和后4位', status: 'enabled', applyCount: 15, createTime: '2024-01-20 10:00:00' },
            { id: 'M002', name: '手机号脱敏', field: 'phone', maskType: '中间遮挡', pattern: '保留前3位和后4位', status: 'enabled', applyCount: 20, createTime: '2024-01-20 10:30:00' },
            { id: 'M003', name: '银行卡号脱敏', field: 'bank_card', maskType: '中间遮挡', pattern: '保留后4位', status: 'enabled', applyCount: 8, createTime: '2024-02-05 11:00:00' },
            { id: 'M004', name: '邮箱脱敏', field: 'email', maskType: '部分遮挡', pattern: '保留@前2位', status: 'enabled', applyCount: 12, createTime: '2024-02-10 14:00:00' },
            { id: 'M005', name: '姓名脱敏', field: 'name', maskType: '部分遮挡', pattern: '保留姓氏', status: 'disabled', applyCount: 0, createTime: '2024-03-01 09:00:00' }
        ];

        // 访问控制
        this.accessControls = [
            { id: 'A001', resource: 'student_info', user: '张三', role: '纪检人员', permission: '读取', status: 'enabled', grantTime: '2024-01-15 10:00:00', expireTime: '2025-01-15' },
            { id: 'A002', resource: 'financial_transaction', user: '李四', role: '审计人员', permission: '读取,导出', status: 'enabled', grantTime: '2024-02-01 11:00:00', expireTime: '2025-02-01' },
            { id: 'A003', resource: 'procurement_project', user: '王五', role: '采购管理员', permission: '读取,写入', status: 'enabled', grantTime: '2024-02-15 14:00:00', expireTime: '2025-02-15' },
            { id: 'A004', resource: 'teacher_info', user: '赵六', role: '人事管理员', permission: '完全控制', status: 'enabled', grantTime: '2024-03-01 09:00:00', expireTime: '2025-03-01' }
        ];

        // 审计日志
        this.auditLogs = [
            { id: 'L001', user: '张三', action: '查询', resource: 'student_info', result: '成功', ip: '192.168.1.100', time: '2024-10-23 09:15:30' },
            { id: 'L002', user: '李四', action: '导出', resource: 'financial_transaction', result: '成功', ip: '192.168.1.101', time: '2024-10-23 10:20:15' },
            { id: 'L003', user: '王五', action: '修改', resource: 'procurement_project', result: '成功', ip: '192.168.1.102', time: '2024-10-23 11:30:45' },
            { id: 'L004', user: '未授权用户', action: '查询', resource: 'teacher_info', result: '失败', ip: '192.168.1.200', time: '2024-10-23 14:05:20' },
            { id: 'L005', user: '赵六', action: '删除', resource: 'old_data', result: '成功', ip: '192.168.1.103', time: '2024-10-23 15:40:10' }
        ];
    }

    getPolicies(filters = {}) {
        let data = [...this.policies];
        if (filters.status) data = data.filter(p => p.status === filters.status);
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(p => p.name.toLowerCase().includes(search));
        }
        return data;
    }

    getMaskingRules(filters = {}) {
        let data = [...this.maskingRules];
        if (filters.status) data = data.filter(m => m.status === filters.status);
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(m => m.name.toLowerCase().includes(search) || m.field.toLowerCase().includes(search));
        }
        return data;
    }

    getAccessControls(filters = {}) {
        let data = [...this.accessControls];
        if (filters.status) data = data.filter(a => a.status === filters.status);
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(a => a.resource.toLowerCase().includes(search) || a.user.toLowerCase().includes(search));
        }
        return data;
    }

    getAuditLogs(filters = {}) {
        let data = [...this.auditLogs];
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(l => l.user.toLowerCase().includes(search) || l.resource.toLowerCase().includes(search));
        }
        return data;
    }

    getStatistics() {
        return {
            policyCount: this.policies.length,
            maskingCount: this.maskingRules.filter(m => m.status === 'enabled').length,
            accessCount: this.accessControls.filter(a => a.status === 'enabled').length,
            todayAccessCount: this.auditLogs.filter(l => l.time.startsWith('2024-10-23')).length
        };
    }
    
    /**
     * 创建安全策略
     */
    createPolicy(data) {
        try {
            const newPolicy = {
                id: 'P' + String(this.policies.length + 1).padStart(3, '0'),
                name: data.name,
                type: data.type,
                level: data.level,
                status: data.status || 'enabled',
                description: data.description,
                scope: data.scope || '',
                rules: data.rules || '',
                applyCount: 0,
                successCount: 0,
                failCount: 0,
                createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            
            this.policies.push(newPolicy);
            this.saveToStorage();
            
            console.log('[数据安全] 策略创建成功:', newPolicy);
            
            return {
                success: true,
                data: newPolicy
            };
        } catch (error) {
            console.error('[数据安全] 策略创建失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    /**
     * 获取单个策略
     */
    getPolicyById(id) {
        return this.policies.find(p => p.id === id);
    }
    
    /**
     * 更新策略
     */
    updatePolicy(id, data) {
        try {
            const index = this.policies.findIndex(p => p.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: '策略不存在'
                };
            }
            
            this.policies[index] = {
                ...this.policies[index],
                ...data,
                updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            
            this.saveToStorage();
            
            console.log('[数据安全] 策略更新成功:', this.policies[index]);
            
            return {
                success: true,
                data: this.policies[index]
            };
        } catch (error) {
            console.error('[数据安全] 策略更新失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    /**
     * 删除策略
     */
    deletePolicy(id) {
        try {
            const index = this.policies.findIndex(p => p.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: '策略不存在'
                };
            }
            
            this.policies.splice(index, 1);
            this.saveToStorage();
            
            return {
                success: true
            };
        } catch (error) {
            console.error('[数据安全] 策略删除失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    /**
     * 保存到localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('data_security_policies', JSON.stringify(this.policies));
            localStorage.setItem('data_security_masking', JSON.stringify(this.maskingRules));
            localStorage.setItem('data_security_access', JSON.stringify(this.accessControls));
        } catch (error) {
            console.error('[数据安全] 保存失败:', error);
        }
    }
    
    /**
     * 从localStorage加载
     */
    loadFromStorage() {
        try {
            const policies = localStorage.getItem('data_security_policies');
            const masking = localStorage.getItem('data_security_masking');
            const access = localStorage.getItem('data_security_access');
            
            if (policies) this.policies = JSON.parse(policies);
            if (masking) this.maskingRules = JSON.parse(masking);
            if (access) this.accessControls = JSON.parse(access);
            
            return true;
        } catch (error) {
            console.error('[数据安全] 加载失败:', error);
            return false;
        }
    }
}

window.dataSecurityService = new DataSecurityService();
