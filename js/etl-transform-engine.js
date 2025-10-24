/**
 * ETL数据转换规则引擎
 * ETL Data Transformation Rule Engine
 */

class ETLTransformEngine {
    constructor() {
        this.transformers = new Map();
        this.registerDefaultTransformers();
    }

    /**
     * 注册默认转换器
     */
    registerDefaultTransformers() {
        // 字段映射转换器
        this.registerTransformer('MAP', this.mapTransformer.bind(this));
        
        // 数据过滤转换器
        this.registerTransformer('FILTER', this.filterTransformer.bind(this));
        
        // 计算字段转换器
        this.registerTransformer('CALCULATE', this.calculateTransformer.bind(this));
        
        // 字段拆分转换器
        this.registerTransformer('SPLIT', this.splitTransformer.bind(this));
        
        // 字段合并转换器
        this.registerTransformer('MERGE', this.mergeTransformer.bind(this));
        
        // 数据类型转换器
        this.registerTransformer('CAST', this.castTransformer.bind(this));
        
        // 字符串处理转换器
        this.registerTransformer('STRING', this.stringTransformer.bind(this));
        
        // 日期处理转换器
        this.registerTransformer('DATE', this.dateTransformer.bind(this));
    }

    /**
     * 注册转换器
     */
    registerTransformer(type, transformer) {
        this.transformers.set(type, transformer);
    }

    /**
     * 应用转换规则
     */
    applyRule(record, rule) {
        const transformer = this.transformers.get(rule.type);
        if (!transformer) {
            throw new Error(`未知的转换类型: ${rule.type}`);
        }
        return transformer(record, rule);
    }

    /**
     * 批量应用转换规则
     */
    applyRules(record, rules) {
        let result = { ...record };
        
        for (const rule of rules) {
            try {
                result = this.applyRule(result, rule);
            } catch (error) {
                console.error('转换规则应用失败:', rule, error);
                throw error;
            }
        }
        
        return result;
    }

    /**
     * 字段映射转换器
     */
    mapTransformer(record, rule) {
        const result = { ...record };
        
        if (rule.sourceFields && rule.targetField) {
            const sourceField = rule.sourceFields[0];
            if (record.hasOwnProperty(sourceField)) {
                result[rule.targetField] = record[sourceField];
                
                // 如果配置了删除源字段
                if (rule.removeSource) {
                    delete result[sourceField];
                }
            }
        }
        
        return result;
    }

    /**
     * 数据过滤转换器
     */
    filterTransformer(record, rule) {
        if (!rule.condition) {
            return record;
        }

        const shouldKeep = this.evaluateCondition(record, rule.condition);
        
        if (!shouldKeep) {
            throw new Error('FILTERED'); // 特殊错误，表示记录被过滤
        }
        
        return record;
    }

    /**
     * 计算字段转换器
     */
    calculateTransformer(record, rule) {
        const result = { ...record };
        
        if (rule.expression && rule.targetField) {
            try {
                result[rule.targetField] = this.evaluateExpression(record, rule.expression);
            } catch (error) {
                console.error('计算表达式失败:', rule.expression, error);
                result[rule.targetField] = null;
            }
        }
        
        return result;
    }

    /**
     * 字段拆分转换器
     */
    splitTransformer(record, rule) {
        const result = { ...record };
        
        if (rule.sourceFields && rule.targetField) {
            const sourceField = rule.sourceFields[0];
            const value = record[sourceField];
            
            if (typeof value === 'string') {
                const delimiter = rule.delimiter || ',';
                const parts = value.split(delimiter).map(p => p.trim());
                
                if (rule.splitMode === 'array') {
                    // 拆分为数组
                    result[rule.targetField] = parts;
                } else {
                    // 拆分为多个字段
                    parts.forEach((part, index) => {
                        result[`${rule.targetField}_${index + 1}`] = part;
                    });
                }
            }
        }
        
        return result;
    }

    /**
     * 字段合并转换器
     */
    mergeTransformer(record, rule) {
        const result = { ...record };
        
        if (rule.sourceFields && rule.targetField) {
            const values = rule.sourceFields
                .map(field => record[field])
                .filter(v => v !== null && v !== undefined);
            
            const delimiter = rule.delimiter || ' ';
            result[rule.targetField] = values.join(delimiter);
        }
        
        return result;
    }

    /**
     * 数据类型转换器
     */
    castTransformer(record, rule) {
        const result = { ...record };
        
        if (rule.sourceFields && rule.targetType) {
            rule.sourceFields.forEach(field => {
                if (record.hasOwnProperty(field)) {
                    result[field] = this.castValue(record[field], rule.targetType);
                }
            });
        }
        
        return result;
    }

    /**
     * 字符串处理转换器
     */
    stringTransformer(record, rule) {
        const result = { ...record };
        
        if (rule.sourceFields && rule.operation) {
            rule.sourceFields.forEach(field => {
                if (record.hasOwnProperty(field)) {
                    const value = String(record[field]);
                    
                    switch (rule.operation) {
                        case 'uppercase':
                            result[field] = value.toUpperCase();
                            break;
                        case 'lowercase':
                            result[field] = value.toLowerCase();
                            break;
                        case 'trim':
                            result[field] = value.trim();
                            break;
                        case 'replace':
                            result[field] = value.replace(
                                new RegExp(rule.pattern, 'g'),
                                rule.replacement || ''
                            );
                            break;
                        case 'substring':
                            result[field] = value.substring(
                                rule.start || 0,
                                rule.end
                            );
                            break;
                    }
                }
            });
        }
        
        return result;
    }

    /**
     * 日期处理转换器
     */
    dateTransformer(record, rule) {
        const result = { ...record };
        
        if (rule.sourceFields && rule.operation) {
            rule.sourceFields.forEach(field => {
                if (record.hasOwnProperty(field)) {
                    const value = record[field];
                    
                    switch (rule.operation) {
                        case 'parse':
                            // 解析日期字符串
                            result[field] = new Date(value);
                            break;
                        case 'format':
                            // 格式化日期
                            const date = new Date(value);
                            result[field] = this.formatDate(date, rule.format);
                            break;
                        case 'extract':
                            // 提取日期部分
                            const d = new Date(value);
                            switch (rule.part) {
                                case 'year':
                                    result[field] = d.getFullYear();
                                    break;
                                case 'month':
                                    result[field] = d.getMonth() + 1;
                                    break;
                                case 'day':
                                    result[field] = d.getDate();
                                    break;
                                case 'hour':
                                    result[field] = d.getHours();
                                    break;
                            }
                            break;
                    }
                }
            });
        }
        
        return result;
    }

    /**
     * 评估条件表达式
     */
    evaluateCondition(record, condition) {
        try {
            // 支持简单的条件表达式
            // 例如: "value > 100", "status === 'active'", "amount >= 1000 && type === 'A'"
            
            // 创建一个安全的上下文
            const context = { ...record };
            
            // 使用Function构造函数评估表达式
            const func = new Function(...Object.keys(context), `return ${condition};`);
            return func(...Object.values(context));
        } catch (error) {
            console.warn('条件评估失败:', condition, error);
            return true; // 默认保留记录
        }
    }

    /**
     * 评估计算表达式
     */
    evaluateExpression(record, expression) {
        try {
            // 支持JavaScript表达式
            // 例如: "value * 1.1", "price * quantity", "Math.round(amount)"
            
            const context = { ...record, Math };
            const func = new Function(...Object.keys(context), `return ${expression};`);
            return func(...Object.values(context));
        } catch (error) {
            console.warn('表达式评估失败:', expression, error);
            return null;
        }
    }

    /**
     * 类型转换
     */
    castValue(value, targetType) {
        if (value === null || value === undefined) {
            return null;
        }

        switch (targetType.toLowerCase()) {
            case 'string':
                return String(value);
            case 'number':
            case 'int':
            case 'integer':
                return parseInt(value, 10);
            case 'float':
            case 'double':
                return parseFloat(value);
            case 'boolean':
            case 'bool':
                if (typeof value === 'string') {
                    return value.toLowerCase() === 'true' || value === '1';
                }
                return Boolean(value);
            case 'date':
            case 'datetime':
                return new Date(value);
            default:
                return value;
        }
    }

    /**
     * 格式化日期
     */
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        if (!(date instanceof Date) || isNaN(date)) {
            return null;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    /**
     * 执行SQL风格的转换
     * 支持简单的SQL SELECT语句
     */
    executeSQLTransform(records, sql) {
        try {
            // 简化的SQL解析和执行
            // 支持: SELECT field1, field2, field1 * 2 as calculated FROM data WHERE condition
            
            const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/i);
            const whereMatch = sql.match(/WHERE\s+(.+?)(?:$|ORDER|GROUP|LIMIT)/i);
            
            if (!selectMatch) {
                throw new Error('无效的SQL语句');
            }

            const selectClause = selectMatch[1].trim();
            const whereClause = whereMatch ? whereMatch[1].trim() : null;

            // 过滤记录
            let filteredRecords = records;
            if (whereClause) {
                filteredRecords = records.filter(record => {
                    return this.evaluateCondition(record, whereClause);
                });
            }

            // 选择和计算字段
            if (selectClause === '*') {
                return filteredRecords;
            }

            const fields = selectClause.split(',').map(f => f.trim());
            
            return filteredRecords.map(record => {
                const result = {};
                
                fields.forEach(field => {
                    const asMatch = field.match(/(.+?)\s+as\s+(\w+)/i);
                    
                    if (asMatch) {
                        // 带别名的字段或表达式
                        const expression = asMatch[1].trim();
                        const alias = asMatch[2].trim();
                        result[alias] = this.evaluateExpression(record, expression);
                    } else {
                        // 简单字段
                        result[field] = record[field];
                    }
                });
                
                return result;
            });
        } catch (error) {
            console.error('SQL转换失败:', error);
            throw error;
        }
    }

    /**
     * 验证转换规则
     */
    validateRule(rule) {
        const errors = [];

        if (!rule.type) {
            errors.push('缺少转换类型');
        }

        if (!this.transformers.has(rule.type)) {
            errors.push(`不支持的转换类型: ${rule.type}`);
        }

        switch (rule.type) {
            case 'MAP':
                if (!rule.sourceFields || rule.sourceFields.length === 0) {
                    errors.push('字段映射需要指定源字段');
                }
                if (!rule.targetField) {
                    errors.push('字段映射需要指定目标字段');
                }
                break;

            case 'FILTER':
                if (!rule.condition) {
                    errors.push('数据过滤需要指定条件');
                }
                break;

            case 'CALCULATE':
                if (!rule.expression) {
                    errors.push('计算字段需要指定表达式');
                }
                if (!rule.targetField) {
                    errors.push('计算字段需要指定目标字段');
                }
                break;

            case 'SPLIT':
            case 'MERGE':
                if (!rule.sourceFields || rule.sourceFields.length === 0) {
                    errors.push('需要指定源字段');
                }
                if (!rule.targetField) {
                    errors.push('需要指定目标字段');
                }
                break;
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * 获取转换规则模板
     */
    getRuleTemplate(type) {
        const templates = {
            MAP: {
                type: 'MAP',
                sourceFields: ['source_field'],
                targetField: 'target_field',
                removeSource: false
            },
            FILTER: {
                type: 'FILTER',
                condition: 'value > 0'
            },
            CALCULATE: {
                type: 'CALCULATE',
                targetField: 'calculated_field',
                expression: 'field1 + field2'
            },
            SPLIT: {
                type: 'SPLIT',
                sourceFields: ['source_field'],
                targetField: 'target_field',
                delimiter: ',',
                splitMode: 'array'
            },
            MERGE: {
                type: 'MERGE',
                sourceFields: ['field1', 'field2'],
                targetField: 'merged_field',
                delimiter: ' '
            },
            CAST: {
                type: 'CAST',
                sourceFields: ['field'],
                targetType: 'string'
            },
            STRING: {
                type: 'STRING',
                sourceFields: ['field'],
                operation: 'uppercase'
            },
            DATE: {
                type: 'DATE',
                sourceFields: ['date_field'],
                operation: 'format',
                format: 'YYYY-MM-DD'
            }
        };

        return templates[type] || null;
    }
}

// 创建全局实例
window.etlTransformEngine = new ETLTransformEngine();
