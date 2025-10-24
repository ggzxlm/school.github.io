/**
 * 主数据管理服务
 * 负责主数据的去重识别、合并、查询和变更历史管理
 */

class MasterDataService {
    constructor() {
        this.masterData = [];
        this.duplicateGroups = [];
        this.changeHistory = [];
        this.initialized = false;
    }

    /**
     * 初始化主数据服务
     */
    async initialize() {
        if (this.initialized) return;

        // 加载模拟主数据
        await this.loadMockData();
        this.initialized = true;
    }

    /**
     * 加载模拟主数据
     */
    async loadMockData() {
        // 模拟人员主数据
        const persons = [
            {
                id: 'P001',
                entityType: 'PERSON',
                name: '张三',
                idCard: '110101199001011234',
                phone: '13812345678',
                email: 'zhangsan@example.com',
                department: '财务处',
                sources: ['财务系统', '人事系统'],
                createdAt: '2025-01-15 10:00:00',
                updatedAt: '2025-01-15 10:00:00',
                version: 1
            },
            {
                id: 'P002',
                entityType: 'PERSON',
                name: '张三',
                idCard: '110101199001011234',
                phone: '13812345679',
                email: 'zs@example.com',
                department: '财务处',
                sources: ['科研系统'],
                createdAt: '2025-01-16 11:00:00',
                updatedAt: '2025-01-16 11:00:00',
                version: 1
            },
            {
                id: 'P003',
                entityType: 'PERSON',
                name: '李四',
                idCard: '110101199002022345',
                phone: '13912345678',
                email: 'lisi@example.com',
                department: '科研处',
                sources: ['科研系统'],
                createdAt: '2025-01-17 09:00:00',
                updatedAt: '2025-01-17 09:00:00',
                version: 1
            },
            {
                id: 'P004',
                entityType: 'PERSON',
                name: '王五',
                idCard: '110101199003033456',
                phone: '13712345678',
                email: 'wangwu@example.com',
                department: '资产处',
                sources: ['资产系统'],
                createdAt: '2025-01-18 14:00:00',
                updatedAt: '2025-01-18 14:00:00',
                version: 1
            }
        ];

        // 模拟供应商主数据
        const suppliers = [
            {
                id: 'S001',
                entityType: 'SUPPLIER',
                name: '北京科技有限公司',
                creditCode: '91110000MA001234XY',
                legalPerson: '张三',
                phone: '010-12345678',
                address: '北京市海淀区',
                sources: ['采购系统'],
                createdAt: '2025-01-10 10:00:00',
                updatedAt: '2025-01-10 10:00:00',
                version: 1
            },
            {
                id: 'S002',
                entityType: 'SUPPLIER',
                name: '北京科技有限公司',
                creditCode: '91110000MA001234XY',
                legalPerson: '张三',
                phone: '010-12345679',
                address: '北京市海淀区中关村',
                sources: ['财务系统'],
                createdAt: '2025-01-11 11:00:00',
                updatedAt: '2025-01-11 11:00:00',
                version: 1
            },
            {
                id: 'S003',
                entityType: 'SUPPLIER',
                name: '上海信息技术公司',
                creditCode: '91310000MA002345ZA',
                legalPerson: '李四',
                phone: '021-87654321',
                address: '上海市浦东新区',
                sources: ['采购系统'],
                createdAt: '2025-01-12 09:00:00',
                updatedAt: '2025-01-12 09:00:00',
                version: 1
            }
        ];

        // 模拟组织主数据
        const organizations = [
            {
                id: 'O001',
                entityType: 'ORGANIZATION',
                name: '财务处',
                code: 'FIN',
                parentId: null,
                level: 1,
                sources: ['人事系统', '财务系统'],
                createdAt: '2025-01-01 08:00:00',
                updatedAt: '2025-01-01 08:00:00',
                version: 1
            },
            {
                id: 'O002',
                entityType: 'ORGANIZATION',
                name: '科研处',
                code: 'RES',
                parentId: null,
                level: 1,
                sources: ['人事系统', '科研系统'],
                createdAt: '2025-01-01 08:00:00',
                updatedAt: '2025-01-01 08:00:00',
                version: 1
            }
        ];

        // 模拟采购项目主数据
        const procurementProjects = [
            {
                id: 'PP001',
                entityType: 'PROCUREMENT_PROJECT',
                projectCode: 'CG-2024-001',
                projectName: '实验室设备采购项目',
                projectType: '货物采购',
                budget: 500000,
                department: '计算机学院',
                applicant: '张三',
                startDate: '2024-11-01',
                endDate: '2024-12-31',
                status: '进行中',
                sources: ['采购系统'],
                createdAt: '2024-10-01 09:00:00',
                updatedAt: '2024-10-15 14:30:00',
                version: 1
            },
            {
                id: 'PP002',
                entityType: 'PROCUREMENT_PROJECT',
                projectCode: 'CG-2024-002',
                projectName: '图书馆图书采购',
                projectType: '货物采购',
                budget: 300000,
                department: '图书馆',
                applicant: '李四',
                startDate: '2024-10-15',
                endDate: '2024-11-30',
                status: '进行中',
                sources: ['采购系统', '图书管理系统'],
                createdAt: '2024-09-20 10:00:00',
                updatedAt: '2024-10-10 16:00:00',
                version: 1
            },
            {
                id: 'PP003',
                entityType: 'PROCUREMENT_PROJECT',
                projectCode: 'CG-2024-003',
                projectName: '校园网络升级改造',
                projectType: '工程项目',
                budget: 1200000,
                department: '信息中心',
                applicant: '王五',
                startDate: '2024-12-01',
                endDate: '2025-03-31',
                status: '计划中',
                sources: ['采购系统'],
                createdAt: '2024-10-10 11:00:00',
                updatedAt: '2024-10-20 09:00:00',
                version: 1
            },
            {
                id: 'PP004',
                entityType: 'PROCUREMENT_PROJECT',
                projectCode: 'CG-2024-004',
                projectName: '办公家具采购',
                projectType: '货物采购',
                budget: 150000,
                department: '行政办公室',
                applicant: '赵六',
                startDate: '2024-09-01',
                endDate: '2024-10-31',
                status: '已完成',
                sources: ['采购系统'],
                createdAt: '2024-08-15 14:00:00',
                updatedAt: '2024-10-31 17:00:00',
                version: 1
            },
            {
                id: 'PP005',
                entityType: 'PROCUREMENT_PROJECT',
                projectCode: 'CG-2024-005',
                projectName: '教学软件采购',
                projectType: '服务采购',
                budget: 800000,
                department: '教务处',
                applicant: '孙七',
                startDate: '2024-11-15',
                endDate: '2025-01-15',
                status: '计划中',
                sources: ['采购系统', '教务系统'],
                createdAt: '2024-10-18 10:30:00',
                updatedAt: '2024-10-22 15:00:00',
                version: 1
            }
        ];

        this.masterData = [...persons, ...suppliers, ...organizations, ...procurementProjects];
    }

    /**
     * 计算两个字符串的相似度（使用编辑距离算法）
     * @param {string} str1 - 字符串1
     * @param {string} str2 - 字符串2
     * @returns {number} 相似度 (0-1)
     */
    calculateSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        if (str1 === str2) return 1;

        const len1 = str1.length;
        const len2 = str2.length;
        const maxLen = Math.max(len1, len2);

        if (maxLen === 0) return 1;

        // 计算编辑距离
        const distance = this.levenshteinDistance(str1, str2);
        
        // 转换为相似度
        return 1 - distance / maxLen;
    }

    /**
     * 计算编辑距离（Levenshtein Distance）
     * @param {string} str1 - 字符串1
     * @param {string} str2 - 字符串2
     * @returns {number} 编辑距离
     */
    levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

        for (let i = 0; i <= len1; i++) dp[i][0] = i;
        for (let j = 0; j <= len2; j++) dp[0][j] = j;

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,      // 删除
                        dp[i][j - 1] + 1,      // 插入
                        dp[i - 1][j - 1] + 1   // 替换
                    );
                }
            }
        }

        return dp[len1][len2];
    }

    /**
     * 识别重复的主数据
     * @param {Object} entity - 要检查的实体
     * @returns {Array} 重复的实体列表
     */
    findDuplicates(entity) {
        const duplicates = [];
        const threshold = 0.8; // 相似度阈值

        for (const existing of this.masterData) {
            // 跳过自己
            if (existing.id === entity.id) continue;

            // 只比较相同类型的实体
            if (existing.entityType !== entity.entityType) continue;

            let similarity = 0;
            let matchCount = 0;

            // 根据实体类型使用不同的匹配策略
            if (entity.entityType === 'PERSON') {
                // 人员：姓名、身份证号、手机号
                if (entity.idCard && existing.idCard && entity.idCard === existing.idCard) {
                    similarity = 1; // 身份证号完全匹配
                    matchCount = 3;
                } else {
                    if (entity.name && existing.name) {
                        similarity += this.calculateSimilarity(entity.name, existing.name);
                        matchCount++;
                    }
                    if (entity.phone && existing.phone) {
                        similarity += this.calculateSimilarity(entity.phone, existing.phone);
                        matchCount++;
                    }
                    if (entity.email && existing.email) {
                        similarity += this.calculateSimilarity(entity.email, existing.email);
                        matchCount++;
                    }
                }
            } else if (entity.entityType === 'SUPPLIER') {
                // 供应商：统一社会信用代码、名称
                if (entity.creditCode && existing.creditCode && entity.creditCode === existing.creditCode) {
                    similarity = 1; // 信用代码完全匹配
                    matchCount = 2;
                } else {
                    if (entity.name && existing.name) {
                        similarity += this.calculateSimilarity(entity.name, existing.name);
                        matchCount++;
                    }
                    if (entity.legalPerson && existing.legalPerson) {
                        similarity += this.calculateSimilarity(entity.legalPerson, existing.legalPerson);
                        matchCount++;
                    }
                }
            } else if (entity.entityType === 'ORGANIZATION') {
                // 组织：名称、编码
                if (entity.code && existing.code && entity.code === existing.code) {
                    similarity = 1; // 编码完全匹配
                    matchCount = 2;
                } else {
                    if (entity.name && existing.name) {
                        similarity += this.calculateSimilarity(entity.name, existing.name);
                        matchCount++;
                    }
                }
            } else if (entity.entityType === 'PROCUREMENT_PROJECT') {
                // 采购项目：项目编号、项目名称
                if (entity.projectCode && existing.projectCode && entity.projectCode === existing.projectCode) {
                    similarity = 1; // 项目编号完全匹配
                    matchCount = 2;
                } else {
                    if (entity.projectName && existing.projectName) {
                        similarity += this.calculateSimilarity(entity.projectName, existing.projectName);
                        matchCount++;
                    }
                    if (entity.department && existing.department) {
                        similarity += this.calculateSimilarity(entity.department, existing.department);
                        matchCount++;
                    }
                }
            }

            // 计算平均相似度
            if (matchCount > 0) {
                const avgSimilarity = similarity / matchCount;
                if (avgSimilarity >= threshold) {
                    duplicates.push({
                        entity: existing,
                        similarity: avgSimilarity,
                        matchFields: this.getMatchFields(entity, existing)
                    });
                }
            }
        }

        // 按相似度降序排序
        duplicates.sort((a, b) => b.similarity - a.similarity);

        return duplicates;
    }

    /**
     * 获取匹配的字段
     * @param {Object} entity1 - 实体1
     * @param {Object} entity2 - 实体2
     * @returns {Array} 匹配的字段列表
     */
    getMatchFields(entity1, entity2) {
        const matchFields = [];

        if (entity1.entityType === 'PERSON') {
            if (entity1.idCard === entity2.idCard) matchFields.push('身份证号');
            if (entity1.name === entity2.name) matchFields.push('姓名');
            if (entity1.phone === entity2.phone) matchFields.push('手机号');
            if (entity1.email === entity2.email) matchFields.push('邮箱');
        } else if (entity1.entityType === 'SUPPLIER') {
            if (entity1.creditCode === entity2.creditCode) matchFields.push('统一社会信用代码');
            if (entity1.name === entity2.name) matchFields.push('名称');
            if (entity1.legalPerson === entity2.legalPerson) matchFields.push('法人');
        } else if (entity1.entityType === 'ORGANIZATION') {
            if (entity1.code === entity2.code) matchFields.push('编码');
            if (entity1.name === entity2.name) matchFields.push('名称');
        } else if (entity1.entityType === 'PROCUREMENT_PROJECT') {
            if (entity1.projectCode === entity2.projectCode) matchFields.push('项目编号');
            if (entity1.projectName === entity2.projectName) matchFields.push('项目名称');
            if (entity1.department === entity2.department) matchFields.push('申请部门');
        }

        return matchFields;
    }

    /**
     * 自动识别所有重复数据
     * @returns {Array} 重复数据组列表
     */
    identifyAllDuplicates() {
        const duplicateGroups = [];
        const processed = new Set();

        for (const entity of this.masterData) {
            if (processed.has(entity.id)) continue;

            const duplicates = this.findDuplicates(entity);
            
            if (duplicates.length > 0) {
                const group = {
                    id: Utils.generateId(),
                    entityType: entity.entityType,
                    master: entity,
                    duplicates: duplicates,
                    status: 'PENDING', // PENDING, MERGED, IGNORED
                    createdAt: new Date().toISOString()
                };

                duplicateGroups.push(group);
                processed.add(entity.id);
                duplicates.forEach(d => processed.add(d.entity.id));
            }
        }

        this.duplicateGroups = duplicateGroups;
        return duplicateGroups;
    }

    /**
     * 获取重复数据组列表
     * @param {Object} filters - 筛选条件
     * @returns {Array} 重复数据组列表
     */
    getDuplicateGroups(filters = {}) {
        let groups = [...this.duplicateGroups];

        if (filters.entityType) {
            groups = groups.filter(g => g.entityType === filters.entityType);
        }

        if (filters.status) {
            groups = groups.filter(g => g.status === filters.status);
        }

        return groups;
    }

    /**
     * 获取主数据列表
     * @param {Object} filters - 筛选条件
     * @returns {Array} 主数据列表
     */
    getMasterData(filters = {}) {
        let data = [...this.masterData];

        if (filters.entityType) {
            data = data.filter(d => d.entityType === filters.entityType);
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(d => {
                return d.name?.toLowerCase().includes(search) ||
                       d.idCard?.toLowerCase().includes(search) ||
                       d.creditCode?.toLowerCase().includes(search) ||
                       d.code?.toLowerCase().includes(search) ||
                       d.projectCode?.toLowerCase().includes(search) ||
                       d.projectName?.toLowerCase().includes(search);
            });
        }

        return data;
    }

    /**
     * 获取主数据详情
     * @param {string} id - 主数据ID
     * @returns {Object} 主数据详情
     */
    getMasterDataById(id) {
        return this.masterData.find(d => d.id === id);
    }

    /**
     * 合并主数据
     * @param {Array} sourceIds - 源数据ID列表
     * @param {string} targetId - 目标数据ID
     * @param {Object} mergedData - 合并后的数据
     * @returns {Object} 合并结果
     */
    async mergeMasterData(sourceIds, targetId, mergedData) {
        const target = this.getMasterDataById(targetId);
        if (!target) {
            throw new Error('目标数据不存在');
        }

        const sources = sourceIds.map(id => this.getMasterDataById(id)).filter(Boolean);
        if (sources.length === 0) {
            throw new Error('源数据不存在');
        }

        // 生成新的UUID
        const newId = 'M' + Utils.generateId().toUpperCase();

        // 合并来源系统
        const allSources = new Set([...target.sources]);
        sources.forEach(source => {
            source.sources.forEach(s => allSources.add(s));
        });

        // 创建合并后的主数据
        const merged = {
            ...mergedData,
            id: newId,
            sources: Array.from(allSources),
            mergedFrom: [targetId, ...sourceIds],
            version: target.version + 1,
            updatedAt: new Date().toISOString()
        };

        // 记录变更历史
        this.recordChange({
            id: Utils.generateId(),
            masterDataId: newId,
            changeType: 'MERGE',
            changeBy: '当前用户',
            changeTime: new Date().toISOString(),
            oldValue: { target, sources },
            newValue: merged,
            description: `合并了 ${sources.length + 1} 条数据`
        });

        // 更新主数据列表
        this.masterData = this.masterData.filter(d => 
            d.id !== targetId && !sourceIds.includes(d.id)
        );
        this.masterData.push(merged);

        // 更新重复数据组状态
        const group = this.duplicateGroups.find(g => 
            g.master.id === targetId || g.duplicates.some(d => d.entity.id === targetId)
        );
        if (group) {
            group.status = 'MERGED';
        }

        return merged;
    }

    /**
     * 忽略重复数据组
     * @param {string} groupId - 重复数据组ID
     * @returns {boolean} 是否成功
     */
    ignoreDuplicateGroup(groupId) {
        const group = this.duplicateGroups.find(g => g.id === groupId);
        if (group) {
            group.status = 'IGNORED';
            return true;
        }
        return false;
    }

    /**
     * 记录变更历史
     * @param {Object} change - 变更记录
     */
    recordChange(change) {
        this.changeHistory.push(change);
    }

    /**
     * 获取变更历史
     * @param {string} masterDataId - 主数据ID
     * @returns {Array} 变更历史列表
     */
    getChangeHistory(masterDataId) {
        return this.changeHistory
            .filter(c => c.masterDataId === masterDataId)
            .sort((a, b) => new Date(b.changeTime) - new Date(a.changeTime));
    }

    /**
     * 获取所有变更历史
     * @param {Object} filters - 筛选条件
     * @returns {Array} 变更历史列表
     */
    getAllChangeHistory(filters = {}) {
        let history = [...this.changeHistory];

        if (filters.masterDataId) {
            history = history.filter(h => h.masterDataId === filters.masterDataId);
        }

        if (filters.changeType) {
            history = history.filter(h => h.changeType === filters.changeType);
        }

        if (filters.dateRange) {
            const [start, end] = filters.dateRange;
            history = history.filter(h => {
                const changeTime = new Date(h.changeTime);
                return changeTime >= new Date(start) && changeTime <= new Date(end);
            });
        }

        return history.sort((a, b) => new Date(b.changeTime) - new Date(a.changeTime));
    }

    /**
     * 创建主数据
     * @param {Object} data - 主数据
     * @returns {Object} 创建的主数据
     */
    async createMasterData(data) {
        const newData = {
            ...data,
            id: data.entityType.charAt(0) + Utils.generateId().toUpperCase(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1
        };

        // 检查是否有重复
        const duplicates = this.findDuplicates(newData);
        if (duplicates.length > 0) {
            return {
                success: false,
                duplicates: duplicates,
                message: '发现可能重复的数据'
            };
        }

        this.masterData.push(newData);

        // 记录变更历史
        this.recordChange({
            id: Utils.generateId(),
            masterDataId: newData.id,
            changeType: 'CREATE',
            changeBy: '当前用户',
            changeTime: new Date().toISOString(),
            oldValue: null,
            newValue: newData,
            description: '创建主数据'
        });

        return {
            success: true,
            data: newData
        };
    }

    /**
     * 更新主数据
     * @param {string} id - 主数据ID
     * @param {Object} updates - 更新的数据
     * @returns {Object} 更新后的主数据
     */
    async updateMasterData(id, updates) {
        const index = this.masterData.findIndex(d => d.id === id);
        if (index === -1) {
            throw new Error('主数据不存在');
        }

        const oldData = { ...this.masterData[index] };
        const newData = {
            ...oldData,
            ...updates,
            version: oldData.version + 1,
            updatedAt: new Date().toISOString()
        };

        this.masterData[index] = newData;

        // 记录变更历史
        this.recordChange({
            id: Utils.generateId(),
            masterDataId: id,
            changeType: 'UPDATE',
            changeBy: '当前用户',
            changeTime: new Date().toISOString(),
            oldValue: oldData,
            newValue: newData,
            description: '更新主数据'
        });

        return newData;
    }

    /**
     * 删除主数据
     * @param {string} id - 主数据ID
     * @returns {boolean} 是否成功
     */
    async deleteMasterData(id) {
        const index = this.masterData.findIndex(d => d.id === id);
        if (index === -1) {
            throw new Error('主数据不存在');
        }

        const oldData = { ...this.masterData[index] };
        this.masterData.splice(index, 1);

        // 记录变更历史
        this.recordChange({
            id: Utils.generateId(),
            masterDataId: id,
            changeType: 'DELETE',
            changeBy: '当前用户',
            changeTime: new Date().toISOString(),
            oldValue: oldData,
            newValue: null,
            description: '删除主数据'
        });

        return true;
    }
}

// 创建全局实例
window.masterDataService = new MasterDataService();
