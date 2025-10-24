/**
 * 主数据类型管理服务
 * 支持用户动态定义主数据类型及其字段
 */

class MasterDataTypeService {
    constructor() {
        this.storageKey = 'master_data_types';
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        if (!localStorage.getItem(this.storageKey)) {
            // 初始化默认类型
            this.initDefaultTypes();
        }
        console.log('[主数据类型服务] 已初始化');
    }

    /**
     * 初始化默认类型
     */
    initDefaultTypes() {
        const defaultTypes = [
            {
                id: 'PERSON',
                name: '人员',
                icon: 'fa-user',
                description: '人员主数据，包括教职工、学生等',
                isSystem: true, // 系统预置类型，不可删除
                fields: [
                    {
                        id: 'name',
                        label: '姓名',
                        type: 'text',
                        required: true,
                        unique: false,
                        matchWeight: 0.3 // 用于重复识别的权重
                    },
                    {
                        id: 'idCard',
                        label: '身份证号',
                        type: 'text',
                        required: true,
                        unique: true,
                        matchWeight: 1.0,
                        pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$'
                    },
                    {
                        id: 'phone',
                        label: '手机号',
                        type: 'text',
                        required: false,
                        unique: false,
                        matchWeight: 0.5,
                        pattern: '^1[3-9]\\d{9}$'
                    },
                    {
                        id: 'email',
                        label: '邮箱',
                        type: 'email',
                        required: false,
                        unique: false,
                        matchWeight: 0.4
                    },
                    {
                        id: 'department',
                        label: '部门',
                        type: 'text',
                        required: false,
                        unique: false,
                        matchWeight: 0.1
                    }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SUPPLIER',
                name: '供应商',
                icon: 'fa-building',
                description: '供应商主数据',
                isSystem: true,
                fields: [
                    {
                        id: 'name',
                        label: '供应商名称',
                        type: 'text',
                        required: true,
                        unique: false,
                        matchWeight: 0.4
                    },
                    {
                        id: 'creditCode',
                        label: '统一社会信用代码',
                        type: 'text',
                        required: true,
                        unique: true,
                        matchWeight: 1.0,
                        pattern: '^[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}$'
                    },
                    {
                        id: 'legalPerson',
                        label: '法人代表',
                        type: 'text',
                        required: false,
                        unique: false,
                        matchWeight: 0.3
                    },
                    {
                        id: 'phone',
                        label: '联系电话',
                        type: 'text',
                        required: false,
                        unique: false,
                        matchWeight: 0.2
                    },
                    {
                        id: 'address',
                        label: '地址',
                        type: 'text',
                        required: false,
                        unique: false,
                        matchWeight: 0.1
                    }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'ORGANIZATION',
                name: '组织',
                icon: 'fa-sitemap',
                description: '组织机构主数据',
                isSystem: true,
                fields: [
                    {
                        id: 'name',
                        label: '组织名称',
                        type: 'text',
                        required: true,
                        unique: false,
                        matchWeight: 0.5
                    },
                    {
                        id: 'code',
                        label: '组织编码',
                        type: 'text',
                        required: true,
                        unique: true,
                        matchWeight: 1.0
                    },
                    {
                        id: 'parentCode',
                        label: '上级组织编码',
                        type: 'text',
                        required: false,
                        unique: false,
                        matchWeight: 0
                    },
                    {
                        id: 'level',
                        label: '组织层级',
                        type: 'number',
                        required: false,
                        unique: false,
                        matchWeight: 0
                    }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'PROCUREMENT_PROJECT',
                name: '采购项目',
                icon: 'fa-shopping-cart',
                description: '采购项目主数据，包括采购计划、项目信息等',
                isSystem: false,
                fields: [
                    {
                        id: 'projectCode',
                        label: '项目编号',
                        type: 'text',
                        required: true,
                        unique: true,
                        matchWeight: 1.0
                    },
                    {
                        id: 'projectName',
                        label: '项目名称',
                        type: 'text',
                        required: true,
                        unique: false,
                        matchWeight: 0.4
                    },
                    {
                        id: 'projectType',
                        label: '采购类型',
                        type: 'text',
                        required: true,
                        unique: false,
                        matchWeight: 0.1
                    },
                    {
                        id: 'budget',
                        label: '预算金额',
                        type: 'number',
                        required: true,
                        unique: false,
                        matchWeight: 0.2
                    },
                    {
                        id: 'department',
                        label: '申请部门',
                        type: 'text',
                        required: true,
                        unique: false,
                        matchWeight: 0.2
                    },
                    {
                        id: 'applicant',
                        label: '申请人',
                        type: 'text',
                        required: true,
                        unique: false,
                        matchWeight: 0.1
                    },
                    {
                        id: 'startDate',
                        label: '计划开始日期',
                        type: 'date',
                        required: false,
                        unique: false,
                        matchWeight: 0
                    },
                    {
                        id: 'endDate',
                        label: '计划结束日期',
                        type: 'date',
                        required: false,
                        unique: false,
                        matchWeight: 0
                    },
                    {
                        id: 'status',
                        label: '项目状态',
                        type: 'text',
                        required: false,
                        unique: false,
                        matchWeight: 0
                    }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        localStorage.setItem(this.storageKey, JSON.stringify(defaultTypes));
        console.log('[主数据类型服务] 已初始化默认类型');
    }

    /**
     * 获取所有类型
     */
    getAllTypes() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return JSON.parse(data) || [];
        } catch (error) {
            console.error('获取类型列表失败:', error);
            return [];
        }
    }

    /**
     * 根据ID获取类型
     */
    getTypeById(id) {
        const types = this.getAllTypes();
        return types.find(t => t.id === id);
    }

    /**
     * 创建新类型
     */
    createType(typeData) {
        try {
            const types = this.getAllTypes();
            
            // 检查ID是否已存在
            if (types.some(t => t.id === typeData.id)) {
                return { success: false, error: '类型ID已存在' };
            }

            const newType = {
                id: typeData.id,
                name: typeData.name,
                icon: typeData.icon || 'fa-cube',
                description: typeData.description || '',
                isSystem: false,
                fields: typeData.fields || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            types.push(newType);
            localStorage.setItem(this.storageKey, JSON.stringify(types));
            
            console.log('[主数据类型服务] 创建类型成功:', newType.name);
            return { success: true, data: newType };
        } catch (error) {
            console.error('创建类型失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 更新类型
     */
    updateType(id, updates) {
        try {
            const types = this.getAllTypes();
            const index = types.findIndex(t => t.id === id);
            
            if (index === -1) {
                return { success: false, error: '类型不存在' };
            }

            // 系统类型只能更新部分字段
            if (types[index].isSystem) {
                // 只允许更新描述和字段（不能删除必填字段）
                if (updates.name || updates.id || updates.isSystem === false) {
                    return { success: false, error: '系统类型不能修改名称和ID' };
                }
            }

            types[index] = {
                ...types[index],
                ...updates,
                id: types[index].id, // 保持ID不变
                isSystem: types[index].isSystem, // 保持系统标志不变
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(types));
            
            console.log('[主数据类型服务] 更新类型成功:', types[index].name);
            return { success: true, data: types[index] };
        } catch (error) {
            console.error('更新类型失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 删除类型
     */
    deleteType(id) {
        try {
            const types = this.getAllTypes();
            const type = types.find(t => t.id === id);
            
            if (!type) {
                return { success: false, error: '类型不存在' };
            }

            if (type.isSystem) {
                return { success: false, error: '系统类型不能删除' };
            }

            // TODO: 检查是否有数据使用此类型
            // 如果有数据，应该提示用户或阻止删除

            const newTypes = types.filter(t => t.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(newTypes));
            
            console.log('[主数据类型服务] 删除类型成功:', type.name);
            return { success: true };
        } catch (error) {
            console.error('删除类型失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 获取类型的字段定义
     */
    getTypeFields(typeId) {
        const type = this.getTypeById(typeId);
        return type ? type.fields : [];
    }

    /**
     * 验证数据是否符合类型定义
     */
    validateData(typeId, data) {
        const type = this.getTypeById(typeId);
        if (!type) {
            return { valid: false, errors: ['类型不存在'] };
        }

        const errors = [];

        type.fields.forEach(field => {
            const value = data[field.id];

            // 检查必填字段
            if (field.required && !value) {
                errors.push(`${field.label}为必填项`);
            }

            // 检查格式
            if (value && field.pattern) {
                const regex = new RegExp(field.pattern);
                if (!regex.test(value)) {
                    errors.push(`${field.label}格式不正确`);
                }
            }

            // 检查类型
            if (value && field.type === 'number' && isNaN(value)) {
                errors.push(`${field.label}必须是数字`);
            }

            if (value && field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push(`${field.label}格式不正确`);
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        const types = this.getAllTypes();
        return {
            total: types.length,
            system: types.filter(t => t.isSystem).length,
            custom: types.filter(t => !t.isSystem).length
        };
    }
}

// 创建全局实例
window.masterDataTypeService = new MasterDataTypeService();
