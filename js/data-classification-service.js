/**
 * 数据分类分级服务
 */

class DataClassificationService {
    constructor() {
        this.categories = [];
        this.levels = [];
        this.mappings = [];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await this.loadMockData();
        this.initialized = true;
    }

    async loadMockData() {
        // 数据分类
        this.categories = [
            { id: 'C001', name: '个人信息', code: 'PERSONAL_INFO', level: 'L3', description: '包含姓名、身份证、联系方式等', tableCount: 5, createTime: '2024-01-15 10:00:00' },
            { id: 'C002', name: '财务数据', code: 'FINANCIAL_DATA', level: 'L4', description: '包含交易记录、账户信息等', tableCount: 8, createTime: '2024-01-15 10:30:00' },
            { id: 'C003', name: '业务数据', code: 'BUSINESS_DATA', level: 'L2', description: '包含项目、合同等业务信息', tableCount: 12, createTime: '2024-01-15 11:00:00' },
            { id: 'C004', name: '系统数据', code: 'SYSTEM_DATA', level: 'L1', description: '包含日志、配置等系统信息', tableCount: 6, createTime: '2024-01-15 11:30:00' },
            { id: 'C005', name: '科研数据', code: 'RESEARCH_DATA', level: 'L3', description: '包含科研项目、成果等信息', tableCount: 4, createTime: '2024-02-01 09:00:00' }
        ];

        // 数据分级
        this.levels = [
            { id: 'L1', name: '公开', code: 'PUBLIC', color: '#10B981', description: '可以公开访问的数据', controlMeasure: '无特殊限制', dataCount: 6 },
            { id: 'L2', name: '内部', code: 'INTERNAL', color: '#3B82F6', description: '仅限内部人员访问', controlMeasure: '需要身份认证', dataCount: 12 },
            { id: 'L3', name: '敏感', code: 'SENSITIVE', color: '#F59E0B', description: '包含敏感信息，需严格控制', controlMeasure: '需要授权+脱敏', dataCount: 9 },
            { id: 'L4', name: '机密', code: 'CONFIDENTIAL', color: '#EF4444', description: '高度机密数据，最高级别保护', controlMeasure: '需要特殊授权+加密+审计', dataCount: 8 }
        ];

        // 分类映射
        this.mappings = [
            { id: 'M001', tableName: 'student_info', category: '个人信息', level: 'L3', fields: ['student_name', 'id_card', 'phone'], autoClassified: true, updateTime: '2024-03-01 10:00:00' },
            { id: 'M002', tableName: 'teacher_info', category: '个人信息', level: 'L3', fields: ['teacher_name', 'id_card', 'phone'], autoClassified: true, updateTime: '2024-03-01 10:30:00' },
            { id: 'M003', tableName: 'financial_transaction', category: '财务数据', level: 'L4', fields: ['amount', 'account_no'], autoClassified: false, updateTime: '2024-03-05 11:00:00' },
            { id: 'M004', tableName: 'procurement_project', category: '业务数据', level: 'L2', fields: ['project_name', 'budget'], autoClassified: true, updateTime: '2024-03-10 14:00:00' },
            { id: 'M005', tableName: 'research_project', category: '科研数据', level: 'L3', fields: ['project_name', 'funding'], autoClassified: false, updateTime: '2024-03-15 09:00:00' }
        ];
    }

    getCategories(filters = {}) {
        let data = [...this.categories];
        if (filters.level) data = data.filter(c => c.level === filters.level);
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(c => c.name.toLowerCase().includes(search) || c.code.toLowerCase().includes(search));
        }
        return data;
    }

    getLevels() {
        return [...this.levels];
    }

    getMappings(filters = {}) {
        let data = [...this.mappings];
        if (filters.level) data = data.filter(m => m.level === filters.level);
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(m => m.tableName.toLowerCase().includes(search) || m.category.toLowerCase().includes(search));
        }
        return data;
    }

    getStatistics() {
        return {
            categoryCount: this.categories.length,
            sensitiveCount: this.mappings.filter(m => m.level === 'L3').length,
            importantCount: this.mappings.filter(m => m.level === 'L4').length,
            normalCount: this.mappings.filter(m => m.level === 'L1' || m.level === 'L2').length
        };
    }
}

window.dataClassificationService = new DataClassificationService();
