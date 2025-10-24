/**
 * 数据仓库DWD层服务
 * 负责DWD中间层的维度表和事实表管理
 */

class WarehouseDWDService {
    constructor() {
        this.dimensions = {
            date: [],
            department: [],
            person: [],
            supplier: [],
            project: [],
            contract: [],
            assetCategory: [],
            budgetItem: []
        };
        
        this.facts = {
            budget: [],
            expense: [],
            procurement: [],
            research: [],
            asset: [],
            contractPerformance: [],
            enrollment: [],
            approval: []
        };
        
        this.dataLineage = [];
        this.qualityLogs = [];
        
        this.initializeMockData();
    }

    /**
     * 从ODS层加载数据到DWD层
     * @param {string} sourceTable - ODS源表
     * @param {string} targetTable - DWD目标表
     * @param {Function} transformFunc - 转换函数
     * @returns {Promise<Object>} 加载结果
     */
    async loadFromODS(sourceTable, targetTable, transformFunc) {
        try {
            // 获取ODS数据
            const odsData = await window.warehouseODSService.queryData(sourceTable);
            
            // 应用转换逻辑
            const transformedData = odsData.data.map(transformFunc);
            
            // 加载到DWD层
            const result = await this.loadData(targetTable, transformedData);
            
            // 记录血缘关系
            this.recordLineage(sourceTable, targetTable, 'ETL_TRANSFORM');
            
            return result;
        } catch (error) {
            console.error('Load from ODS failed:', error);
            throw error;
        }
    }

    /**
     * 加载数据到DWD层
     * @param {string} tableName - 表名
     * @param {Array} data - 数据数组
     * @returns {Promise<Object>} 加载结果
     */
    async loadData(tableName, data) {
        const startTime = new Date();
        let successCount = 0;
        let failedCount = 0;

        try {
            // 根据表类型加载数据
            if (tableName.startsWith('dim_')) {
                // 维度表: 使用SCD Type 2 (缓慢变化维度)
                const dimName = tableName.replace('dim_', '');
                successCount = await this.loadDimension(dimName, data);
            } else if (tableName.startsWith('fact_')) {
                // 事实表: 追加数据
                const factName = tableName.replace('fact_', '');
                successCount = await this.loadFact(factName, data);
            }

            return {
                tableName,
                startTime,
                endTime: new Date(),
                recordsCount: data.length,
                successCount,
                failedCount,
                status: 'SUCCESS'
            };
        } catch (error) {
            return {
                tableName,
                startTime,
                endTime: new Date(),
                recordsCount: data.length,
                successCount,
                failedCount: data.length - successCount,
                status: 'FAILED',
                errorMessage: error.message
            };
        }
    }

    /**
     * 加载维度数据 (SCD Type 2)
     * @param {string} dimName - 维度名称
     * @param {Array} data - 数据数组
     * @returns {Promise<number>} 成功加载的记录数
     */
    async loadDimension(dimName, data) {
        let successCount = 0;
        const currentDate = new Date();

        for (const record of data) {
            // 查找现有记录
            const existing = this.dimensions[dimName].find(
                d => d[`${dimName}_id`] === record[`${dimName}_id`] && d.is_active
            );

            if (existing) {
                // 检查是否有变化
                const hasChanged = this.hasRecordChanged(existing, record);
                
                if (hasChanged) {
                    // 关闭旧记录
                    existing.is_active = false;
                    existing.expiry_date = currentDate;
                    existing.updated_at = currentDate;
                    
                    // 插入新记录
                    const newRecord = {
                        ...record,
                        is_active: true,
                        effective_date: currentDate,
                        expiry_date: null,
                        created_at: currentDate,
                        updated_at: currentDate
                    };
                    this.dimensions[dimName].push(newRecord);
                }
            } else {
                // 新记录
                const newRecord = {
                    ...record,
                    is_active: true,
                    effective_date: currentDate,
                    expiry_date: null,
                    created_at: currentDate,
                    updated_at: currentDate
                };
                this.dimensions[dimName].push(newRecord);
            }
            
            successCount++;
        }

        return successCount;
    }

    /**
     * 加载事实数据
     * @param {string} factName - 事实表名称
     * @param {Array} data - 数据数组
     * @returns {Promise<number>} 成功加载的记录数
     */
    async loadFact(factName, data) {
        let successCount = 0;
        const currentDate = new Date();

        for (const record of data) {
            const newRecord = {
                ...record,
                fact_id: record.fact_id || this.generateId(),
                created_at: currentDate,
                updated_at: currentDate
            };
            
            this.facts[factName].push(newRecord);
            successCount++;
        }

        return successCount;
    }

    /**
     * 查询维度数据
     * @param {string} dimName - 维度名称
     * @param {Object} filter - 过滤条件
     * @returns {Promise<Array>} 查询结果
     */
    async queryDimension(dimName, filter = {}) {
        let data = this.dimensions[dimName] || [];

        // 默认只返回活动记录
        if (filter.includeInactive !== true) {
            data = data.filter(d => d.is_active);
        }

        // 应用其他过滤条件
        if (filter.id) {
            data = data.filter(d => d[`${dimName}_id`] === filter.id);
        }

        return data;
    }

    /**
     * 查询事实数据
     * @param {string} factName - 事实表名称
     * @param {Object} filter - 过滤条件
     * @returns {Promise<Object>} 查询结果
     */
    async queryFact(factName, filter = {}) {
        let data = this.facts[factName] || [];

        // 按日期过滤
        if (filter.startDate) {
            data = data.filter(f => f.date_id >= filter.startDate.replace(/-/g, ''));
        }

        if (filter.endDate) {
            data = data.filter(f => f.date_id <= filter.endDate.replace(/-/g, ''));
        }

        // 按部门过滤
        if (filter.departmentId) {
            data = data.filter(f => f.department_id === filter.departmentId);
        }

        // 按项目过滤
        if (filter.projectId) {
            data = data.filter(f => f.project_id === filter.projectId);
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
     * 执行数据质量检查
     * @param {string} tableName - 表名
     * @returns {Promise<Object>} 质量检查结果
     */
    async checkDataQuality(tableName) {
        const checkDate = new Date();
        let data = [];
        
        if (tableName.startsWith('dim_')) {
            const dimName = tableName.replace('dim_', '');
            data = this.dimensions[dimName] || [];
        } else if (tableName.startsWith('fact_')) {
            const factName = tableName.replace('fact_', '');
            data = this.facts[factName] || [];
        }

        const totalRecords = data.length;
        let validRecords = 0;
        let invalidRecords = 0;
        const issues = [];

        // 检查规则
        for (const record of data) {
            let isValid = true;

            // 检查必填字段
            const requiredFields = this.getRequiredFields(tableName);
            for (const field of requiredFields) {
                if (!record[field]) {
                    isValid = false;
                    issues.push({
                        recordId: record.fact_id || record[Object.keys(record)[0]],
                        field,
                        issue: 'Missing required field'
                    });
                }
            }

            // 检查外键完整性
            if (tableName.startsWith('fact_')) {
                const fkChecks = this.checkForeignKeys(tableName, record);
                if (!fkChecks.valid) {
                    isValid = false;
                    issues.push(...fkChecks.issues);
                }
            }

            if (isValid) {
                validRecords++;
            } else {
                invalidRecords++;
            }
        }

        const qualityScore = totalRecords > 0 ? (validRecords / totalRecords) * 100 : 100;

        const qualityLog = {
            log_id: this.generateId(),
            table_name: tableName,
            check_date: checkDate,
            total_records: totalRecords,
            valid_records: validRecords,
            invalid_records: invalidRecords,
            quality_score: qualityScore.toFixed(2),
            check_rules: JSON.stringify(this.getRequiredFields(tableName)),
            issues: JSON.stringify(issues.slice(0, 10)), // 只保存前10个问题
            created_at: checkDate
        };

        this.qualityLogs.push(qualityLog);

        return qualityLog;
    }

    /**
     * 记录数据血缘
     * @param {string} sourceTable - 源表
     * @param {string} targetTable - 目标表
     * @param {string} transformType - 转换类型
     */
    recordLineage(sourceTable, targetTable, transformType) {
        const lineage = {
            lineage_id: this.generateId(),
            source_table: sourceTable,
            source_field: '*',
            target_table: targetTable,
            target_field: '*',
            transform_logic: `ETL from ${sourceTable} to ${targetTable}`,
            transform_type: transformType,
            created_at: new Date(),
            updated_at: new Date()
        };

        this.dataLineage.push(lineage);
    }

    /**
     * 查询数据血缘
     * @param {string} tableName - 表名
     * @param {string} direction - 方向 (UPSTREAM/DOWNSTREAM)
     * @returns {Promise<Array>} 血缘关系
     */
    async queryLineage(tableName, direction = 'DOWNSTREAM') {
        if (direction === 'UPSTREAM') {
            return this.dataLineage.filter(l => l.target_table === tableName);
        } else {
            return this.dataLineage.filter(l => l.source_table === tableName);
        }
    }

    /**
     * 检查记录是否变化
     * @param {Object} oldRecord - 旧记录
     * @param {Object} newRecord - 新记录
     * @returns {boolean} 是否有变化
     */
    hasRecordChanged(oldRecord, newRecord) {
        const compareFields = Object.keys(newRecord).filter(
            key => !['is_active', 'effective_date', 'expiry_date', 'created_at', 'updated_at'].includes(key)
        );

        for (const field of compareFields) {
            if (oldRecord[field] !== newRecord[field]) {
                return true;
            }
        }

        return false;
    }

    /**
     * 获取必填字段
     * @param {string} tableName - 表名
     * @returns {Array} 必填字段列表
     */
    getRequiredFields(tableName) {
        const fieldMap = {
            'dim_department': ['department_id', 'department_code', 'department_name'],
            'dim_person': ['person_id', 'name'],
            'dim_supplier': ['supplier_id', 'supplier_name'],
            'fact_budget': ['fact_id', 'date_id', 'department_id', 'budget_item_id'],
            'fact_expense': ['fact_id', 'date_id', 'department_id', 'amount'],
            'fact_procurement': ['fact_id', 'date_id', 'department_id']
        };

        return fieldMap[tableName] || [];
    }

    /**
     * 检查外键完整性
     * @param {string} tableName - 表名
     * @param {Object} record - 记录
     * @returns {Object} 检查结果
     */
    checkForeignKeys(tableName, record) {
        const issues = [];
        let valid = true;

        // 检查日期维度
        if (record.date_id) {
            const dateExists = this.dimensions.date.some(d => d.date_id === record.date_id);
            if (!dateExists) {
                valid = false;
                issues.push({
                    recordId: record.fact_id,
                    field: 'date_id',
                    issue: 'Foreign key violation: date dimension not found'
                });
            }
        }

        // 检查部门维度
        if (record.department_id) {
            const deptExists = this.dimensions.department.some(
                d => d.department_id === record.department_id && d.is_active
            );
            if (!deptExists) {
                valid = false;
                issues.push({
                    recordId: record.fact_id,
                    field: 'department_id',
                    issue: 'Foreign key violation: department dimension not found'
                });
            }
        }

        return { valid, issues };
    }

    /**
     * 生成唯一ID
     * @returns {string} UUID
     */
    generateId() {
        return 'dwd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 初始化模拟数据
     */
    initializeMockData() {
        // 日期维度
        this.dimensions.date = this.generateDateDimension('2024-01-01', '2024-12-31');

        // 部门维度
        this.dimensions.department = [
            {
                department_id: 'DEPT001',
                department_code: 'CS',
                department_name: '计算机学院',
                parent_department_id: null,
                department_level: 1,
                department_type: 'TEACHING',
                leader: '张院长',
                is_active: true,
                effective_date: new Date('2024-01-01'),
                expiry_date: null
            },
            {
                department_id: 'DEPT002',
                department_code: 'ECON',
                department_name: '经济管理学院',
                parent_department_id: null,
                department_level: 1,
                department_type: 'TEACHING',
                leader: '李院长',
                is_active: true,
                effective_date: new Date('2024-01-01'),
                expiry_date: null
            }
        ];

        // 人员维度
        this.dimensions.person = [
            {
                person_id: 'PER001',
                employee_code: 'EMP001',
                name: '王教授',
                id_card: '110101197001011234',
                gender: '男',
                birth_date: new Date('1970-01-01'),
                department_id: 'DEPT001',
                position: '教授',
                title: '博士生导师',
                employment_type: 'FULL_TIME',
                status: 'ACTIVE',
                is_active: true,
                effective_date: new Date('2024-01-01'),
                expiry_date: null
            }
        ];

        // 供应商维度
        this.dimensions.supplier = [
            {
                supplier_id: 'SUP001',
                supplier_code: 'SUP2024001',
                supplier_name: '某科技公司',
                unified_social_credit_code: '91110000123456789X',
                legal_representative: '李总',
                qualification_level: 'A级',
                risk_level: 'LOW',
                blacklist_flag: false,
                status: 'ACTIVE',
                is_active: true,
                effective_date: new Date('2024-01-01'),
                expiry_date: null
            }
        ];

        // 预算科目维度
        this.dimensions.budgetItem = [
            {
                item_id: 'ITEM001',
                item_code: 'TEACH001',
                item_name: '教学经费',
                parent_item_id: null,
                item_level: 1,
                item_category: 'TEACHING',
                is_active: true
            },
            {
                item_id: 'ITEM002',
                item_code: 'TEACH001_01',
                item_name: '实验室建设',
                parent_item_id: 'ITEM001',
                item_level: 2,
                item_category: 'TEACHING',
                is_active: true
            }
        ];

        // 预算事实表
        this.facts.budget = [
            {
                fact_id: 'FACT_BUD001',
                date_id: '20240115',
                department_id: 'DEPT001',
                budget_item_id: 'ITEM002',
                budget_year: 2024,
                budget_amount: 500000,
                approved_amount: 480000,
                adjusted_amount: 480000,
                status: 'APPROVED',
                source_record_id: 'BUD001'
            }
        ];

        // 支出事实表
        this.facts.expense = [
            {
                fact_id: 'FACT_EXP001',
                date_id: '20240310',
                department_id: 'DEPT001',
                budget_item_id: 'ITEM002',
                person_id: 'PER001',
                supplier_id: 'SUP001',
                expense_category: '设备采购',
                expense_type: 'NORMAL',
                amount: 120000,
                payment_method: '银行转账',
                invoice_number: 'INV20240310001',
                approval_status: 'APPROVED',
                source_record_id: 'EXP001'
            }
        ];
    }

    /**
     * 生成日期维度数据
     * @param {string} startDate - 开始日期
     * @param {string} endDate - 结束日期
     * @returns {Array} 日期维度数据
     */
    generateDateDimension(startDate, endDate) {
        const dates = [];
        const current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            const dateId = current.toISOString().slice(0, 10).replace(/-/g, '');
            const dayOfWeek = current.getDay();
            
            dates.push({
                date_id: dateId,
                full_date: new Date(current),
                year: current.getFullYear(),
                quarter: Math.floor(current.getMonth() / 3) + 1,
                month: current.getMonth() + 1,
                week: this.getWeekNumber(current),
                day: current.getDate(),
                day_of_week: dayOfWeek,
                day_name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
                is_weekend: dayOfWeek === 0 || dayOfWeek === 6,
                is_holiday: false,
                fiscal_year: current.getFullYear(),
                fiscal_quarter: Math.floor(current.getMonth() / 3) + 1,
                fiscal_month: current.getMonth() + 1
            });

            current.setDate(current.getDate() + 1);
        }

        return dates;
    }

    /**
     * 获取周数
     * @param {Date} date - 日期
     * @returns {number} 周数
     */
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }
}

// 创建全局实例
window.warehouseDWDService = new WarehouseDWDService();
