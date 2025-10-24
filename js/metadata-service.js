/**
 * 元数据管理服务
 */

class MetadataService {
    constructor() {
        this.tables = [];
        this.fields = [];
        this.lineages = [];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await this.loadMockData();
        this.initialized = true;
    }

    async loadMockData() {
        // 模拟数据表
        this.tables = [
            {
                id: 'T001',
                tableName: 'student_info',
                tableComment: '学生信息表',
                datasource: '教务系统',
                schema: 'public',
                rowCount: 15000,
                size: '2.5 MB',
                createTime: '2024-01-15 10:00:00',
                updateTime: '2024-10-20 15:30:00',
                owner: '教务处'
            },
            {
                id: 'T002',
                tableName: 'teacher_info',
                tableComment: '教师信息表',
                datasource: '人事系统',
                schema: 'public',
                rowCount: 800,
                size: '150 KB',
                createTime: '2024-01-15 10:00:00',
                updateTime: '2024-10-18 09:20:00',
                owner: '人事处'
            },
            {
                id: 'T003',
                tableName: 'procurement_project',
                tableComment: '采购项目表',
                datasource: '采购系统',
                schema: 'public',
                rowCount: 500,
                size: '80 KB',
                createTime: '2024-02-01 14:00:00',
                updateTime: '2024-10-22 16:45:00',
                owner: '采购办'
            },
            {
                id: 'T004',
                tableName: 'financial_transaction',
                tableComment: '财务交易表',
                datasource: '财务系统',
                schema: 'public',
                rowCount: 50000,
                size: '8.5 MB',
                createTime: '2024-01-10 08:00:00',
                updateTime: '2024-10-23 10:15:00',
                owner: '财务处'
            },
            {
                id: 'T005',
                tableName: 'research_project',
                tableComment: '科研项目表',
                datasource: '科研系统',
                schema: 'public',
                rowCount: 1200,
                size: '200 KB',
                createTime: '2024-01-20 11:00:00',
                updateTime: '2024-10-21 14:30:00',
                owner: '科研处'
            }
        ];

        // 模拟字段信息
        this.fields = [
            { id: 'F001', tableId: 'T001', fieldName: 'student_id', fieldComment: '学生ID', dataType: 'VARCHAR(20)', isPrimaryKey: true, isNullable: false, defaultValue: null },
            { id: 'F002', tableId: 'T001', fieldName: 'student_name', fieldComment: '学生姓名', dataType: 'VARCHAR(50)', isPrimaryKey: false, isNullable: false, defaultValue: null },
            { id: 'F003', tableId: 'T001', fieldName: 'id_card', fieldComment: '身份证号', dataType: 'VARCHAR(18)', isPrimaryKey: false, isNullable: false, defaultValue: null },
            { id: 'F004', tableId: 'T001', fieldName: 'phone', fieldComment: '手机号', dataType: 'VARCHAR(11)', isPrimaryKey: false, isNullable: true, defaultValue: null },
            { id: 'F005', tableId: 'T001', fieldName: 'email', fieldComment: '邮箱', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: true, defaultValue: null },
            { id: 'F006', tableId: 'T002', fieldName: 'teacher_id', fieldComment: '教师ID', dataType: 'VARCHAR(20)', isPrimaryKey: true, isNullable: false, defaultValue: null },
            { id: 'F007', tableId: 'T002', fieldName: 'teacher_name', fieldComment: '教师姓名', dataType: 'VARCHAR(50)', isPrimaryKey: false, isNullable: false, defaultValue: null },
            { id: 'F008', tableId: 'T002', fieldName: 'department', fieldComment: '所属部门', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, defaultValue: null },
            { id: 'F009', tableId: 'T003', fieldName: 'project_code', fieldComment: '项目编号', dataType: 'VARCHAR(30)', isPrimaryKey: true, isNullable: false, defaultValue: null },
            { id: 'F010', tableId: 'T003', fieldName: 'project_name', fieldComment: '项目名称', dataType: 'VARCHAR(200)', isPrimaryKey: false, isNullable: false, defaultValue: null },
            { id: 'F011', tableId: 'T003', fieldName: 'budget', fieldComment: '预算金额', dataType: 'DECIMAL(15,2)', isPrimaryKey: false, isNullable: false, defaultValue: '0' },
            { id: 'F012', tableId: 'T004', fieldName: 'transaction_id', fieldComment: '交易ID', dataType: 'VARCHAR(30)', isPrimaryKey: true, isNullable: false, defaultValue: null },
            { id: 'F013', tableId: 'T004', fieldName: 'amount', fieldComment: '交易金额', dataType: 'DECIMAL(15,2)', isPrimaryKey: false, isNullable: false, defaultValue: '0' },
            { id: 'F014', tableId: 'T004', fieldName: 'transaction_date', fieldComment: '交易日期', dataType: 'DATE', isPrimaryKey: false, isNullable: false, defaultValue: null }
        ];

        // 模拟血缘关系
        this.lineages = [
            {
                id: 'L001',
                sourceTable: 'student_info',
                sourceField: 'student_id',
                targetTable: 'enrollment_record',
                targetField: 'student_id',
                lineageType: '字段级',
                transformRule: '直接映射',
                createTime: '2024-03-01 10:00:00'
            },
            {
                id: 'L002',
                sourceTable: 'teacher_info',
                sourceField: 'teacher_id',
                targetTable: 'course_schedule',
                targetField: 'teacher_id',
                lineageType: '字段级',
                transformRule: '直接映射',
                createTime: '2024-03-05 11:00:00'
            },
            {
                id: 'L003',
                sourceTable: 'procurement_project',
                sourceField: 'project_code',
                targetTable: 'financial_transaction',
                targetField: 'project_code',
                lineageType: '字段级',
                transformRule: '关联映射',
                createTime: '2024-03-10 14:00:00'
            }
        ];
    }

    getTables(filters = {}) {
        let data = [...this.tables];
        
        if (filters.datasource) {
            data = data.filter(t => t.datasource === filters.datasource);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(t => 
                t.tableName.toLowerCase().includes(search) ||
                t.tableComment.toLowerCase().includes(search)
            );
        }
        
        return data;
    }

    getFields(filters = {}) {
        let data = [...this.fields];
        
        if (filters.tableId) {
            data = data.filter(f => f.tableId === filters.tableId);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(f => 
                f.fieldName.toLowerCase().includes(search) ||
                f.fieldComment.toLowerCase().includes(search)
            );
        }
        
        return data;
    }

    getLineages(filters = {}) {
        let data = [...this.lineages];
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(l => 
                l.sourceTable.toLowerCase().includes(search) ||
                l.targetTable.toLowerCase().includes(search)
            );
        }
        
        return data;
    }

    getDatasources() {
        return [...new Set(this.tables.map(t => t.datasource))];
    }

    getStatistics() {
        return {
            tableCount: this.tables.length,
            fieldCount: this.fields.length,
            datasourceCount: this.getDatasources().length,
            lineageCount: this.lineages.length
        };
    }
    
    /**
     * 根据ID获取表信息
     */
    getTableById(id) {
        const table = this.tables.find(t => t.id === id);
        if (!table) return null;
        
        // 获取该表的字段
        const fields = this.fields.filter(f => f.tableId === id);
        
        // 生成模拟索引信息
        const indexes = this.generateMockIndexes(table, fields);
        
        return {
            ...table,
            fields,
            indexes
        };
    }
    
    /**
     * 生成模拟索引信息
     */
    generateMockIndexes(table, fields) {
        const indexes = [];
        
        // 主键索引
        const primaryKeyFields = fields.filter(f => f.isPrimaryKey);
        if (primaryKeyFields.length > 0) {
            indexes.push({
                indexName: 'PRIMARY',
                isUnique: true,
                fields: primaryKeyFields.map(f => f.fieldName)
            });
        }
        
        // 添加一些模拟的普通索引
        if (table.tableName === 'student_info') {
            indexes.push({
                indexName: 'idx_id_card',
                isUnique: true,
                fields: ['id_card']
            });
            indexes.push({
                indexName: 'idx_phone',
                isUnique: false,
                fields: ['phone']
            });
        } else if (table.tableName === 'teacher_info') {
            indexes.push({
                indexName: 'idx_department',
                isUnique: false,
                fields: ['department']
            });
        }
        
        return indexes;
    }
    
    /**
     * 创建表
     */
    createTable(data) {
        const newTable = {
            id: 'T' + String(this.tables.length + 1).padStart(3, '0'),
            tableName: data.tableName,
            tableComment: data.tableComment,
            datasource: data.datasource,
            schema: 'public',
            rowCount: data.rowCount || 0,
            size: this.calculateSize(data.rowCount || 0),
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            owner: data.owner || '系统管理员'
        };
        
        this.tables.push(newTable);
        
        // 添加字段
        if (data.fields && data.fields.length > 0) {
            data.fields.forEach((field, index) => {
                const newField = {
                    id: 'F' + String(this.fields.length + 1).padStart(3, '0'),
                    tableId: newTable.id,
                    fieldName: field.fieldName,
                    fieldComment: field.fieldComment,
                    dataType: field.dataType,
                    isPrimaryKey: field.isPrimaryKey || false,
                    isNullable: field.isNullable !== false,
                    defaultValue: field.defaultValue || null
                };
                this.fields.push(newField);
            });
        }
        
        return newTable;
    }
    
    /**
     * 更新表
     */
    updateTable(id, data) {
        const index = this.tables.findIndex(t => t.id === id);
        if (index === -1) return null;
        
        this.tables[index] = {
            ...this.tables[index],
            tableName: data.tableName,
            tableComment: data.tableComment,
            datasource: data.datasource,
            rowCount: data.rowCount || this.tables[index].rowCount,
            owner: data.owner || this.tables[index].owner,
            updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        // 更新字段
        if (data.fields) {
            // 删除旧字段
            this.fields = this.fields.filter(f => f.tableId !== id);
            
            // 添加新字段
            data.fields.forEach(field => {
                const newField = {
                    id: 'F' + String(this.fields.length + 1).padStart(3, '0'),
                    tableId: id,
                    fieldName: field.fieldName,
                    fieldComment: field.fieldComment,
                    dataType: field.dataType,
                    isPrimaryKey: field.isPrimaryKey || false,
                    isNullable: field.isNullable !== false,
                    defaultValue: field.defaultValue || null
                };
                this.fields.push(newField);
            });
        }
        
        return this.tables[index];
    }
    
    /**
     * 计算大小
     */
    calculateSize(rowCount) {
        if (rowCount < 1000) {
            return Math.round(rowCount * 0.1) + ' KB';
        } else if (rowCount < 100000) {
            return (rowCount * 0.1 / 1024).toFixed(1) + ' MB';
        } else {
            return (rowCount * 0.1 / 1024 / 1024).toFixed(2) + ' GB';
        }
    }
}

window.metadataService = new MetadataService();
