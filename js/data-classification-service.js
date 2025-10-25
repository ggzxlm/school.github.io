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
    
    /**
     * 自动分类
     */
    performAutoClassification() {
        try {
            // 模拟扫描数据库表
            const mockTables = [
                { name: 'user_account', fields: ['username', 'password', 'email', 'phone'] },
                { name: 'employee_salary', fields: ['employee_id', 'salary', 'bonus', 'bank_account'] },
                { name: 'contract_info', fields: ['contract_no', 'party_a', 'party_b', 'amount'] },
                { name: 'system_log', fields: ['log_id', 'log_time', 'log_level', 'message'] },
                { name: 'research_funding', fields: ['project_id', 'funding_amount', 'source'] }
            ];
            
            let newClassifications = 0;
            let updatedClassifications = 0;
            
            mockTables.forEach(table => {
                const classification = this.classifyTable(table);
                
                // 检查是否已存在映射
                const existing = this.mappings.find(m => m.tableName === table.name);
                
                if (existing) {
                    // 更新现有映射
                    existing.category = classification.category;
                    existing.level = classification.level;
                    existing.fields = classification.keyFields;
                    existing.autoClassified = true;
                    existing.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
                    updatedClassifications++;
                } else {
                    // 创建新映射
                    const newMapping = {
                        id: 'M' + String(this.mappings.length + 1).padStart(3, '0'),
                        tableName: table.name,
                        category: classification.category,
                        level: classification.level,
                        fields: classification.keyFields,
                        autoClassified: true,
                        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
                    };
                    this.mappings.push(newMapping);
                    newClassifications++;
                }
            });
            
            this.saveToStorage();
            
            return {
                success: true,
                scannedTables: mockTables.length,
                classifiedTables: newClassifications + updatedClassifications,
                newClassifications,
                updatedClassifications
            };
        } catch (error) {
            console.error('[数据分类] 自动分类失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    /**
     * 根据表结构分类
     */
    classifyTable(table) {
        const fields = table.fields.map(f => f.toLowerCase());
        
        // 个人信息识别
        const personalFields = ['name', 'id_card', 'phone', 'email', 'address', 'birthday'];
        if (fields.some(f => personalFields.some(pf => f.includes(pf)))) {
            return {
                category: '个人信息',
                level: 'L3',
                keyFields: fields.filter(f => personalFields.some(pf => f.includes(pf)))
            };
        }
        
        // 财务数据识别
        const financialFields = ['salary', 'amount', 'account', 'payment', 'invoice', 'budget'];
        if (fields.some(f => financialFields.some(ff => f.includes(ff)))) {
            return {
                category: '财务数据',
                level: 'L4',
                keyFields: fields.filter(f => financialFields.some(ff => f.includes(ff)))
            };
        }
        
        // 业务数据识别
        const businessFields = ['contract', 'project', 'order', 'customer', 'supplier'];
        if (fields.some(f => businessFields.some(bf => f.includes(bf)))) {
            return {
                category: '业务数据',
                level: 'L2',
                keyFields: fields.filter(f => businessFields.some(bf => f.includes(bf)))
            };
        }
        
        // 科研数据识别
        const researchFields = ['research', 'funding', 'publication', 'patent'];
        if (fields.some(f => researchFields.some(rf => f.includes(rf)))) {
            return {
                category: '科研数据',
                level: 'L3',
                keyFields: fields.filter(f => researchFields.some(rf => f.includes(rf)))
            };
        }
        
        // 默认为系统数据
        return {
            category: '系统数据',
            level: 'L1',
            keyFields: []
        };
    }
    
    /**
     * 创建分类
     */
    createCategory(data) {
        try {
            // 检查编码是否已存在
            if (this.categories.some(c => c.code === data.code)) {
                return {
                    success: false,
                    message: '分类编码已存在'
                };
            }
            
            const newCategory = {
                id: 'C' + String(this.categories.length + 1).padStart(3, '0'),
                name: data.name,
                code: data.code,
                level: data.level,
                description: data.description,
                fields: data.fields,
                controlMeasure: data.controlMeasure,
                tableCount: 0,
                active: data.active !== false,
                createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            
            this.categories.push(newCategory);
            this.saveToStorage();
            
            console.log('[数据分类] 创建成功:', newCategory);
            
            return {
                success: true,
                data: newCategory
            };
        } catch (error) {
            console.error('[数据分类] 创建失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    /**
     * 获取单个分类
     */
    getCategoryById(id) {
        return this.categories.find(c => c.id === id);
    }
    
    /**
     * 更新分类
     */
    updateCategory(id, data) {
        try {
            const index = this.categories.findIndex(c => c.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: '分类不存在'
                };
            }
            
            // 检查编码是否与其他分类冲突
            if (data.code && data.code !== this.categories[index].code) {
                if (this.categories.some(c => c.code === data.code && c.id !== id)) {
                    return {
                        success: false,
                        message: '分类编码已被使用'
                    };
                }
            }
            
            this.categories[index] = {
                ...this.categories[index],
                ...data,
                updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            
            // 如果级别改变，更新相关映射
            if (data.level && data.level !== this.categories[index].level) {
                this.mappings.forEach(m => {
                    if (m.category === this.categories[index].name) {
                        m.level = data.level;
                    }
                });
            }
            
            this.saveToStorage();
            
            console.log('[数据分类] 更新成功:', this.categories[index]);
            
            return {
                success: true,
                data: this.categories[index]
            };
        } catch (error) {
            console.error('[数据分类] 更新失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    /**
     * 删除分类
     */
    deleteCategory(id) {
        try {
            const index = this.categories.findIndex(c => c.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: '分类不存在'
                };
            }
            
            // 检查是否有关联的映射
            const relatedMappings = this.mappings.filter(m => m.category === this.categories[index].name);
            if (relatedMappings.length > 0) {
                return {
                    success: false,
                    message: `该分类下还有 ${relatedMappings.length} 个数据表，无法删除`
                };
            }
            
            this.categories.splice(index, 1);
            this.saveToStorage();
            
            return {
                success: true
            };
        } catch (error) {
            console.error('[数据分类] 删除失败:', error);
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
            localStorage.setItem('data_classification_categories', JSON.stringify(this.categories));
            localStorage.setItem('data_classification_mappings', JSON.stringify(this.mappings));
        } catch (error) {
            console.error('[数据分类] 保存失败:', error);
        }
    }
    
    /**
     * 从localStorage加载
     */
    loadFromStorage() {
        try {
            const categories = localStorage.getItem('data_classification_categories');
            const mappings = localStorage.getItem('data_classification_mappings');
            
            if (categories) this.categories = JSON.parse(categories);
            if (mappings) this.mappings = JSON.parse(mappings);
            
            return true;
        } catch (error) {
            console.error('[数据分类] 加载失败:', error);
            return false;
        }
    }
    
    /**
     * 获取单个映射
     */
    getMappingById(id) {
        return this.mappings.find(m => m.id === id);
    }
    
    /**
     * 更新映射
     */
    updateMapping(id, data) {
        try {
            const index = this.mappings.findIndex(m => m.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: '映射不存在'
                };
            }
            
            this.mappings[index] = {
                ...this.mappings[index],
                ...data,
                updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            
            this.saveToStorage();
            
            console.log('[数据分类] 映射更新成功:', this.mappings[index]);
            
            return {
                success: true,
                data: this.mappings[index]
            };
        } catch (error) {
            console.error('[数据分类] 映射更新失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    /**
     * 删除映射
     */
    deleteMapping(id) {
        try {
            const index = this.mappings.findIndex(m => m.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: '映射不存在'
                };
            }
            
            this.mappings.splice(index, 1);
            this.saveToStorage();
            
            return {
                success: true
            };
        } catch (error) {
            console.error('[数据分类] 映射删除失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
}

window.dataClassificationService = new DataClassificationService();
