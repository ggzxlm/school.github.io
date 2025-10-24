/**
 * 数据仓库ODS层服务
 * 负责ODS明细层的数据加载、查询和管理
 */

class WarehouseODSService {
    constructor() {
        this.odsLoadLogs = [];
        this.odsData = {
            budget: [],
            expense: [],
            threePublicExpense: [],
            procurement: [],
            bidding: [],
            bidRecord: [],
            researchProject: [],
            researchExpense: [],
            asset: [],
            assetChange: [],
            personnel: [],
            salary: [],
            contract: [],
            contractPayment: [],
            enrollmentPlan: [],
            admission: [],
            approvalFlow: [],
            approvalNode: [],
            supplier: []
        };
        this.initializeMockData();
    }

    /**
     * 加载数据到ODS层
     * @param {string} tableName - 表名
     * @param {Array} data - 数据数组
     * @param {string} sourceSystem - 来源系统
     * @param {string} loadType - 加载类型 (FULL/INCREMENTAL)
     * @returns {Promise<Object>} 加载结果
     */
    async loadData(tableName, data, sourceSystem, loadType = 'INCREMENTAL') {
        const loadLog = {
            id: this.generateId(),
            tableName,
            sourceSystem,
            loadType,
            loadStartTime: new Date(),
            loadEndTime: null,
            recordsCount: data.length,
            successCount: 0,
            failedCount: 0,
            status: 'RUNNING',
            errorMessage: null
        };

        try {
            // 模拟数据加载过程
            const processedData = data.map(record => ({
                ...record,
                source_system: sourceSystem,
                load_time: new Date(),
                load_type: loadType,
                is_deleted: false
            }));

            // 根据加载类型处理数据
            if (loadType === 'FULL') {
                // 全量加载: 清空现有数据
                this.odsData[tableName] = processedData;
            } else {
                // 增量加载: 追加或更新数据
                processedData.forEach(newRecord => {
                    const existingIndex = this.odsData[tableName].findIndex(
                        r => r.id === newRecord.id
                    );
                    if (existingIndex >= 0) {
                        this.odsData[tableName][existingIndex] = newRecord;
                    } else {
                        this.odsData[tableName].push(newRecord);
                    }
                });
            }

            loadLog.successCount = data.length;
            loadLog.status = 'SUCCESS';
            loadLog.loadEndTime = new Date();

        } catch (error) {
            loadLog.failedCount = data.length;
            loadLog.status = 'FAILED';
            loadLog.errorMessage = error.message;
            loadLog.loadEndTime = new Date();
        }

        this.odsLoadLogs.push(loadLog);
        return loadLog;
    }

    /**
     * 查询ODS层数据
     * @param {string} tableName - 表名
     * @param {Object} filter - 过滤条件
     * @returns {Promise<Array>} 查询结果
     */
    async queryData(tableName, filter = {}) {
        let data = this.odsData[tableName] || [];

        // 过滤已删除的数据
        data = data.filter(record => !record.is_deleted);

        // 应用过滤条件
        if (filter.startDate) {
            data = data.filter(record => {
                const recordDate = new Date(record.load_time);
                return recordDate >= new Date(filter.startDate);
            });
        }

        if (filter.endDate) {
            data = data.filter(record => {
                const recordDate = new Date(record.load_time);
                return recordDate <= new Date(filter.endDate);
            });
        }

        if (filter.sourceSystem) {
            data = data.filter(record => record.source_system === filter.sourceSystem);
        }

        if (filter.departmentCode) {
            data = data.filter(record => record.department_code === filter.departmentCode);
        }

        // 分页
        const page = filter.page || 1;
        const pageSize = filter.pageSize || 50;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        return {
            data: data.slice(start, end),
            total: data.length,
            page,
            pageSize
        };
    }

    /**
     * 获取ODS层表统计信息
     * @param {string} tableName - 表名
     * @returns {Promise<Object>} 统计信息
     */
    async getTableStats(tableName) {
        const data = this.odsData[tableName] || [];
        const activeData = data.filter(record => !record.is_deleted);

        // 按来源系统统计
        const bySourceSystem = {};
        activeData.forEach(record => {
            const system = record.source_system || 'UNKNOWN';
            bySourceSystem[system] = (bySourceSystem[system] || 0) + 1;
        });

        // 按加载类型统计
        const byLoadType = {};
        activeData.forEach(record => {
            const type = record.load_type || 'UNKNOWN';
            byLoadType[type] = (byLoadType[type] || 0) + 1;
        });

        // 最近加载时间
        const loadTimes = activeData.map(r => new Date(r.load_time).getTime());
        const lastLoadTime = loadTimes.length > 0 ? new Date(Math.max(...loadTimes)) : null;

        return {
            tableName,
            totalRecords: data.length,
            activeRecords: activeData.length,
            deletedRecords: data.length - activeData.length,
            bySourceSystem,
            byLoadType,
            lastLoadTime
        };
    }

    /**
     * 获取所有ODS表的统计信息
     * @returns {Promise<Array>} 所有表的统计信息
     */
    async getAllTablesStats() {
        const tableNames = Object.keys(this.odsData);
        const stats = [];

        for (const tableName of tableNames) {
            const stat = await this.getTableStats(tableName);
            stats.push(stat);
        }

        return stats;
    }

    /**
     * 获取数据加载日志
     * @param {Object} filter - 过滤条件
     * @returns {Promise<Array>} 加载日志
     */
    async getLoadLogs(filter = {}) {
        let logs = [...this.odsLoadLogs];

        if (filter.tableName) {
            logs = logs.filter(log => log.tableName === filter.tableName);
        }

        if (filter.status) {
            logs = logs.filter(log => log.status === filter.status);
        }

        if (filter.startDate) {
            logs = logs.filter(log => {
                const logDate = new Date(log.loadStartTime);
                return logDate >= new Date(filter.startDate);
            });
        }

        // 按时间倒序排序
        logs.sort((a, b) => new Date(b.loadStartTime) - new Date(a.loadStartTime));

        return logs;
    }

    /**
     * 逻辑删除数据
     * @param {string} tableName - 表名
     * @param {string} id - 记录ID
     * @returns {Promise<boolean>} 是否成功
     */
    async softDelete(tableName, id) {
        const data = this.odsData[tableName] || [];
        const record = data.find(r => r.id === id);
        
        if (record) {
            record.is_deleted = true;
            record.delete_time = new Date();
            return true;
        }
        
        return false;
    }

    /**
     * 清理历史数据
     * @param {string} tableName - 表名
     * @param {number} daysToKeep - 保留天数
     * @returns {Promise<number>} 清理的记录数
     */
    async cleanupOldData(tableName, daysToKeep = 90) {
        const data = this.odsData[tableName] || [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        let cleanedCount = 0;
        data.forEach(record => {
            const loadTime = new Date(record.load_time);
            if (loadTime < cutoffDate && !record.is_deleted) {
                record.is_deleted = true;
                record.delete_time = new Date();
                cleanedCount++;
            }
        });

        return cleanedCount;
    }

    /**
     * 生成唯一ID
     * @returns {string} UUID
     */
    generateId() {
        return 'ods_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 初始化模拟数据
     */
    initializeMockData() {
        // 预算数据
        this.odsData.budget = [
            {
                id: 'BUD001',
                budget_year: 2024,
                department_code: 'DEPT001',
                department_name: '计算机学院',
                budget_category: '教学经费',
                budget_item: '实验室建设',
                budget_amount: 500000,
                approved_amount: 480000,
                approved_date: '2024-01-15',
                status: 'APPROVED',
                source_system: 'FINANCE',
                load_time: new Date('2024-01-16'),
                load_type: 'INCREMENTAL',
                is_deleted: false
            },
            {
                id: 'BUD002',
                budget_year: 2024,
                department_code: 'DEPT002',
                department_name: '经济管理学院',
                budget_category: '科研经费',
                budget_item: '课题研究',
                budget_amount: 800000,
                approved_amount: 800000,
                approved_date: '2024-01-15',
                status: 'APPROVED',
                source_system: 'FINANCE',
                load_time: new Date('2024-01-16'),
                load_type: 'INCREMENTAL',
                is_deleted: false
            }
        ];

        // 支出数据
        this.odsData.expense = [
            {
                id: 'EXP001',
                expense_date: '2024-03-10',
                department_code: 'DEPT001',
                department_name: '计算机学院',
                expense_category: '设备采购',
                expense_item: '服务器',
                amount: 120000,
                budget_id: 'BUD001',
                payee: '某科技公司',
                payment_method: '银行转账',
                invoice_number: 'INV20240310001',
                purpose: '实验室服务器采购',
                approver: '张主任',
                approval_date: '2024-03-08',
                status: 'PAID',
                source_system: 'FINANCE',
                load_time: new Date('2024-03-11'),
                load_type: 'INCREMENTAL',
                is_deleted: false
            }
        ];

        // 采购数据
        this.odsData.procurement = [
            {
                id: 'PROC001',
                project_code: 'PROC2024001',
                project_name: '实验室设备采购',
                department_code: 'DEPT001',
                department_name: '计算机学院',
                procurement_type: 'PUBLIC_BIDDING',
                procurement_method: '公开招标',
                budget_amount: 500000,
                estimated_amount: 480000,
                actual_amount: 450000,
                supplier_id: 'SUP001',
                supplier_name: '某科技公司',
                contract_id: 'CON001',
                contract_date: '2024-02-20',
                start_date: '2024-03-01',
                end_date: '2024-06-30',
                status: 'IN_PROGRESS',
                project_manager: '李工',
                source_system: 'PROCUREMENT',
                load_time: new Date('2024-02-21'),
                load_type: 'INCREMENTAL',
                is_deleted: false
            }
        ];

        // 科研项目数据
        this.odsData.researchProject = [
            {
                id: 'RES001',
                project_code: 'RES2024001',
                project_name: '人工智能算法研究',
                project_type: 'NATIONAL',
                project_level: '国家级',
                principal_investigator: '王教授',
                pi_id_card: '110101197001011234',
                department_code: 'DEPT001',
                department_name: '计算机学院',
                start_date: '2024-01-01',
                end_date: '2026-12-31',
                total_funding: 1000000,
                funding_source: '国家自然科学基金',
                status: 'IN_PROGRESS',
                source_system: 'RESEARCH',
                load_time: new Date('2024-01-05'),
                load_type: 'INCREMENTAL',
                is_deleted: false
            }
        ];

        // 资产数据
        this.odsData.asset = [
            {
                id: 'AST001',
                asset_code: 'AST2024001',
                asset_name: '高性能服务器',
                asset_category: '电子设备',
                asset_type: '服务器',
                specification: 'Dell PowerEdge R740',
                unit: '台',
                quantity: 2,
                unit_price: 60000,
                total_price: 120000,
                purchase_date: '2024-03-15',
                supplier_id: 'SUP001',
                supplier_name: '某科技公司',
                department_code: 'DEPT001',
                department_name: '计算机学院',
                custodian: '张老师',
                location: '实验楼301',
                status: 'IN_USE',
                source_system: 'ASSET',
                load_time: new Date('2024-03-16'),
                load_type: 'INCREMENTAL',
                is_deleted: false
            }
        ];

        // 人员数据
        this.odsData.personnel = [
            {
                id: 'PER001',
                employee_code: 'EMP001',
                name: '王教授',
                id_card: '110101197001011234',
                gender: '男',
                birth_date: '1970-01-01',
                department_code: 'DEPT001',
                department_name: '计算机学院',
                position: '教授',
                title: '博士生导师',
                employment_type: 'FULL_TIME',
                entry_date: '2000-09-01',
                status: 'ACTIVE',
                phone: '13800138001',
                email: 'wang@university.edu',
                source_system: 'HR',
                load_time: new Date('2024-01-01'),
                load_type: 'FULL',
                is_deleted: false
            }
        ];

        // 供应商数据
        this.odsData.supplier = [
            {
                id: 'SUP001',
                supplier_code: 'SUP2024001',
                supplier_name: '某科技公司',
                unified_social_credit_code: '91110000123456789X',
                legal_representative: '李总',
                registered_capital: 10000000,
                registration_date: '2010-05-20',
                business_scope: '计算机软硬件销售',
                contact_person: '张经理',
                contact_phone: '13900139001',
                contact_email: 'zhang@company.com',
                address: '北京市海淀区某街道',
                qualification_level: 'A级',
                status: 'ACTIVE',
                source_system: 'SUPPLIER',
                load_time: new Date('2024-01-01'),
                load_type: 'FULL',
                is_deleted: false
            }
        ];

        // 添加一些加载日志
        this.odsLoadLogs = [
            {
                id: 'LOG001',
                tableName: 'budget',
                sourceSystem: 'FINANCE',
                loadType: 'INCREMENTAL',
                loadStartTime: new Date('2024-01-16T08:00:00'),
                loadEndTime: new Date('2024-01-16T08:05:00'),
                recordsCount: 2,
                successCount: 2,
                failedCount: 0,
                status: 'SUCCESS',
                errorMessage: null
            },
            {
                id: 'LOG002',
                tableName: 'procurement',
                sourceSystem: 'PROCUREMENT',
                loadType: 'INCREMENTAL',
                loadStartTime: new Date('2024-02-21T09:00:00'),
                loadEndTime: new Date('2024-02-21T09:03:00'),
                recordsCount: 1,
                successCount: 1,
                failedCount: 0,
                status: 'SUCCESS',
                errorMessage: null
            }
        ];
    }
}

// 创建全局实例
window.warehouseODSService = new WarehouseODSService();
