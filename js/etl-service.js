/**
 * ETL作业管理服务
 * ETL Job Management Service
 */

class ETLService {
    constructor() {
        this.storageKey = 'etl_jobs';
        this.executionStorageKey = 'etl_executions';
        this.versionStorageKey = 'etl_versions';
        this.runningJobs = new Map(); // jobId -> execution info
        this.init();
    }

    init() {
        // 检查是否需要初始化演示数据
        const needsInit = !localStorage.getItem(this.storageKey);
        
        // 初始化存储
        if (needsInit) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.executionStorageKey)) {
            localStorage.setItem(this.executionStorageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.versionStorageKey)) {
            localStorage.setItem(this.versionStorageKey, JSON.stringify([]));
        }
        
        // 如果是首次初始化，添加演示数据
        if (needsInit) {
            console.log('[ETL服务] 首次初始化，创建演示数据');
            this.initSampleData();
        }
        
        console.log('[ETL服务] 已初始化');
    }

    /**
     * 初始化演示数据
     */
    initSampleData() {
        const sampleJobs = [
            {
                jobName: '财务数据日度同步',
                description: '每日凌晨同步财务系统数据到数据仓库ODS层',
                sourceConfig: {
                    dataSourceId: 'ds_finance',
                    query: 'SELECT * FROM finance_transactions WHERE date = CURRENT_DATE'
                },
                transformRules: [
                    {
                        type: 'FILTER',
                        field: 'amount',
                        condition: 'value > 0',
                        description: '过滤金额大于0的记录'
                    },
                    {
                        type: 'MAP',
                        sourceField: 'trans_date',
                        targetField: 'transaction_date',
                        description: '字段名称映射'
                    }
                ],
                targetConfig: {
                    tableName: 'ods_finance_transactions',
                    writeMode: 'INSERT'
                },
                schedule: '0 0 * * *',
                enabled: true,
                status: 'PUBLISHED',
                createdBy: '系统管理员'
            },
            {
                jobName: '人事数据增量同步',
                description: '实时同步人事系统变更数据',
                sourceConfig: {
                    dataSourceId: 'ds_hr',
                    query: 'SELECT * FROM hr_employees WHERE updated_at > :last_sync_time'
                },
                transformRules: [
                    {
                        type: 'CALCULATE',
                        targetField: 'age',
                        expression: 'YEAR(CURRENT_DATE) - YEAR(birth_date)',
                        description: '计算年龄'
                    },
                    {
                        type: 'MERGE',
                        sourceFields: ['first_name', 'last_name'],
                        targetField: 'full_name',
                        separator: ' ',
                        description: '合并姓名字段'
                    }
                ],
                targetConfig: {
                    tableName: 'ods_hr_employees',
                    writeMode: 'UPSERT'
                },
                schedule: '*/15 * * * *',
                enabled: true,
                status: 'PUBLISHED',
                createdBy: '数据管理员'
            },
            {
                jobName: '采购数据月度汇总',
                description: '每月汇总采购数据到DWS层',
                sourceConfig: {
                    dataSourceId: 'ds_procurement',
                    query: `
                        SELECT 
                            department_id,
                            supplier_id,
                            SUM(amount) as total_amount,
                            COUNT(*) as order_count
                        FROM ods_procurement_orders
                        WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
                        GROUP BY department_id, supplier_id
                    `
                },
                transformRules: [
                    {
                        type: 'CALCULATE',
                        targetField: 'avg_order_amount',
                        expression: 'total_amount / order_count',
                        description: '计算平均订单金额'
                    }
                ],
                targetConfig: {
                    tableName: 'dws_procurement_monthly',
                    writeMode: 'INSERT'
                },
                schedule: '0 2 1 * *',
                enabled: true,
                status: 'PUBLISHED',
                createdBy: '数据分析师'
            },
            {
                jobName: '学生成绩数据清洗',
                description: '清洗和标准化学生成绩数据',
                sourceConfig: {
                    dataSourceId: 'ds_academic',
                    query: 'SELECT * FROM raw_student_scores'
                },
                transformRules: [
                    {
                        type: 'FILTER',
                        field: 'score',
                        condition: 'value >= 0 AND value <= 100',
                        description: '过滤无效成绩'
                    },
                    {
                        type: 'CALCULATE',
                        targetField: 'grade_level',
                        expression: `
                            CASE 
                                WHEN score >= 90 THEN 'A'
                                WHEN score >= 80 THEN 'B'
                                WHEN score >= 70 THEN 'C'
                                WHEN score >= 60 THEN 'D'
                                ELSE 'F'
                            END
                        `,
                        description: '计算等级'
                    },
                    {
                        type: 'MAP',
                        sourceField: 'stu_id',
                        targetField: 'student_id',
                        description: '标准化字段名'
                    }
                ],
                targetConfig: {
                    tableName: 'dwd_student_scores',
                    writeMode: 'INSERT'
                },
                schedule: '0 3 * * *',
                enabled: true,
                status: 'PUBLISHED',
                createdBy: '教务管理员'
            },
            {
                jobName: '科研项目数据整合',
                description: '整合多个系统的科研项目数据',
                sourceConfig: {
                    dataSourceId: 'ds_research',
                    query: 'SELECT * FROM research_projects'
                },
                transformRules: [
                    {
                        type: 'SPLIT',
                        sourceField: 'project_members',
                        targetFields: ['member1', 'member2', 'member3'],
                        separator: ',',
                        description: '拆分项目成员'
                    },
                    {
                        type: 'CALCULATE',
                        targetField: 'project_duration_days',
                        expression: 'DATEDIFF(end_date, start_date)',
                        description: '计算项目持续天数'
                    }
                ],
                targetConfig: {
                    tableName: 'dwd_research_projects',
                    writeMode: 'UPSERT'
                },
                schedule: null,
                enabled: false,
                status: 'DRAFT',
                createdBy: '科研管理员'
            }
        ];

        sampleJobs.forEach(jobData => {
            this.create(jobData);
        });

        // 为已发布的作业创建一些执行历史
        const jobs = this.getAll();
        jobs.filter(j => j.status === 'PUBLISHED').forEach(job => {
            // 创建3-5条历史执行记录
            const executionCount = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < executionCount; i++) {
                const daysAgo = i + 1;
                const startTime = new Date();
                startTime.setDate(startTime.getDate() - daysAgo);
                startTime.setHours(Math.floor(Math.random() * 24));
                
                const endTime = new Date(startTime);
                endTime.setMinutes(endTime.getMinutes() + Math.floor(Math.random() * 30) + 5);
                
                const recordsProcessed = Math.floor(Math.random() * 10000) + 1000;
                const successRate = Math.random() > 0.1 ? 1 : 0.95; // 90%成功率
                const recordsSuccess = Math.floor(recordsProcessed * successRate);
                const recordsFailed = recordsProcessed - recordsSuccess;
                
                const execution = {
                    id: this.generateExecutionId(),
                    jobId: job.id,
                    jobName: job.jobName,
                    status: recordsFailed === 0 ? 'SUCCESS' : 'FAILED',
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    recordsProcessed,
                    recordsSuccess,
                    recordsFailed,
                    logs: [
                        { time: startTime.toISOString(), level: 'INFO', message: '开始执行ETL作业' },
                        { time: new Date(startTime.getTime() + 1000).toISOString(), level: 'INFO', message: '连接数据源成功' },
                        { time: new Date(startTime.getTime() + 2000).toISOString(), level: 'INFO', message: `读取 ${recordsProcessed} 条记录` },
                        { time: new Date(startTime.getTime() + 3000).toISOString(), level: 'INFO', message: '开始数据转换' },
                        { time: new Date(endTime.getTime() - 1000).toISOString(), level: 'INFO', message: `成功处理 ${recordsSuccess} 条，失败 ${recordsFailed} 条` },
                        { time: endTime.toISOString(), level: 'INFO', message: 'ETL作业执行完成' }
                    ]
                };
                
                this.saveExecution(execution);
                
                // 更新作业的最后执行信息
                if (i === 0) { // 最近的一次
                    this.update(job.id, {
                        lastExecutionTime: execution.endTime,
                        lastExecutionStatus: execution.status
                    });
                }
            }
        });

        console.log('[ETL服务] 已初始化演示数据');
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'etl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * 生成执行ID
     */
    generateExecutionId() {
        return 'exec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * 生成版本号
     */
    generateVersion() {
        const now = new Date();
        return `v${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    }

    /**
     * 获取所有ETL作业
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return JSON.parse(data) || [];
        } catch (error) {
            console.error('获取ETL作业列表失败:', error);
            return [];
        }
    }

    /**
     * 根据ID获取ETL作业
     */
    getById(id) {
        const jobs = this.getAll();
        return jobs.find(job => job.id === id);
    }

    /**
     * 创建ETL作业
     */
    create(job) {
        try {
            const jobs = this.getAll();
            
            const newJob = {
                id: this.generateId(),
                jobName: job.jobName,
                description: job.description || '',
                version: this.generateVersion(),
                sourceConfig: job.sourceConfig || {
                    dataSourceId: null,
                    query: ''
                },
                transformRules: job.transformRules || [],
                targetConfig: job.targetConfig || {
                    tableName: '',
                    writeMode: 'INSERT'
                },
                schedule: job.schedule || null,
                enabled: job.enabled !== false,
                status: job.status || 'DRAFT', // 'DRAFT', 'PUBLISHED', 'ARCHIVED'
                lastExecutionTime: job.lastExecutionTime || null,
                lastExecutionStatus: job.lastExecutionStatus || null,
                createdBy: job.createdBy || 'system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            jobs.push(newJob);
            localStorage.setItem(this.storageKey, JSON.stringify(jobs));
            
            // 保存初始版本
            this.saveVersion(newJob);
            
            console.log('[ETL服务] 创建作业成功:', newJob.jobName);
            return { success: true, data: newJob };
        } catch (error) {
            console.error('创建ETL作业失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 更新ETL作业
     */
    update(id, updates) {
        try {
            const jobs = this.getAll();
            const index = jobs.findIndex(job => job.id === id);
            
            if (index === -1) {
                return { success: false, error: 'ETL作业不存在' };
            }

            const oldJob = { ...jobs[index] };
            
            jobs[index] = {
                ...jobs[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            // 如果是重要更新，生成新版本
            if (this.isSignificantUpdate(updates)) {
                jobs[index].version = this.generateVersion();
                this.saveVersion(jobs[index]);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(jobs));
            
            console.log('[ETL服务] 更新作业成功:', jobs[index].jobName);
            return { success: true, data: jobs[index], oldData: oldJob };
        } catch (error) {
            console.error('更新ETL作业失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 判断是否为重要更新（需要保存版本）
     */
    isSignificantUpdate(updates) {
        const significantFields = ['sourceConfig', 'transformRules', 'targetConfig'];
        return significantFields.some(field => updates.hasOwnProperty(field));
    }

    /**
     * 删除ETL作业
     */
    delete(id) {
        try {
            // 如果作业正在运行，先停止
            if (this.runningJobs.has(id)) {
                return { success: false, error: '作业正在运行中，无法删除' };
            }

            const jobs = this.getAll();
            const filtered = jobs.filter(job => job.id !== id);
            
            if (filtered.length === jobs.length) {
                return { success: false, error: 'ETL作业不存在' };
            }

            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            
            console.log('[ETL服务] 删除作业成功');
            return { success: true };
        } catch (error) {
            console.error('删除ETL作业失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 保存作业版本
     */
    saveVersion(job) {
        try {
            const versions = this.getVersions(job.id);
            
            const version = {
                id: this.generateId(),
                jobId: job.id,
                version: job.version,
                jobName: job.jobName,
                sourceConfig: JSON.parse(JSON.stringify(job.sourceConfig)),
                transformRules: JSON.parse(JSON.stringify(job.transformRules)),
                targetConfig: JSON.parse(JSON.stringify(job.targetConfig)),
                createdBy: job.createdBy || 'system',
                createdAt: new Date().toISOString()
            };

            versions.unshift(version);
            
            // 只保留最近50个版本
            if (versions.length > 50) {
                versions.splice(50);
            }

            this.saveVersions(versions);
            
            console.log('[ETL服务] 保存版本成功:', version.version);
            return { success: true, data: version };
        } catch (error) {
            console.error('保存作业版本失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 获取作业版本历史
     */
    getVersions(jobId) {
        try {
            const data = localStorage.getItem(this.versionStorageKey);
            const allVersions = JSON.parse(data) || [];
            return allVersions.filter(v => v.jobId === jobId);
        } catch (error) {
            console.error('获取版本历史失败:', error);
            return [];
        }
    }

    /**
     * 保存所有版本
     */
    saveVersions(versions) {
        try {
            const data = localStorage.getItem(this.versionStorageKey);
            const allVersions = JSON.parse(data) || [];
            
            // 移除当前作业的旧版本
            const jobId = versions[0]?.jobId;
            const filtered = allVersions.filter(v => v.jobId !== jobId);
            
            // 添加新版本
            const updated = [...versions, ...filtered];
            
            localStorage.setItem(this.versionStorageKey, JSON.stringify(updated));
        } catch (error) {
            console.error('保存版本失败:', error);
        }
    }

    /**
     * 回退到指定版本
     */
    rollbackVersion(jobId, versionId) {
        try {
            const versions = this.getVersions(jobId);
            const version = versions.find(v => v.id === versionId);
            
            if (!version) {
                return { success: false, error: '版本不存在' };
            }

            // 更新作业配置
            const updates = {
                sourceConfig: version.sourceConfig,
                transformRules: version.transformRules,
                targetConfig: version.targetConfig
            };

            return this.update(jobId, updates);
        } catch (error) {
            console.error('回退版本失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 比较两个版本
     */
    compareVersions(versionId1, versionId2) {
        try {
            const data = localStorage.getItem(this.versionStorageKey);
            const allVersions = JSON.parse(data) || [];
            
            const version1 = allVersions.find(v => v.id === versionId1);
            const version2 = allVersions.find(v => v.id === versionId2);
            
            if (!version1 || !version2) {
                return { success: false, error: '版本不存在' };
            }

            const differences = {
                sourceConfig: this.compareObjects(version1.sourceConfig, version2.sourceConfig),
                transformRules: this.compareArrays(version1.transformRules, version2.transformRules),
                targetConfig: this.compareObjects(version1.targetConfig, version2.targetConfig)
            };

            return { success: true, data: differences };
        } catch (error) {
            console.error('比较版本失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 比较两个对象
     */
    compareObjects(obj1, obj2) {
        const changes = [];
        const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
        
        allKeys.forEach(key => {
            const val1 = obj1?.[key];
            const val2 = obj2?.[key];
            
            if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                changes.push({
                    field: key,
                    oldValue: val1,
                    newValue: val2
                });
            }
        });
        
        return changes;
    }

    /**
     * 比较两个数组
     */
    compareArrays(arr1, arr2) {
        const changes = [];
        
        if ((arr1?.length || 0) !== (arr2?.length || 0)) {
            changes.push({
                field: 'length',
                oldValue: arr1?.length || 0,
                newValue: arr2?.length || 0
            });
        }
        
        return changes;
    }

    /**
     * 执行ETL作业
     */
    async executeJob(jobId, params = {}) {
        const job = this.getById(jobId);
        if (!job) {
            return { success: false, error: 'ETL作业不存在' };
        }

        // 检查是否已在运行
        if (this.runningJobs.has(jobId)) {
            return { success: false, error: '作业正在运行中' };
        }

        // 创建执行记录
        const execution = {
            id: this.generateExecutionId(),
            jobId: jobId,
            jobName: job.jobName,
            version: job.version,
            startTime: new Date().toISOString(),
            endTime: null,
            status: 'RUNNING', // 'RUNNING', 'SUCCESS', 'FAILED'
            progress: 0,
            recordsProcessed: 0,
            recordsSuccess: 0,
            recordsFailed: 0,
            errorMessage: null,
            errorStack: null,
            logs: []
        };

        // 保存执行记录
        this.saveExecution(execution);

        // 标记作业为运行中
        this.runningJobs.set(jobId, execution);
        this.update(jobId, { 
            lastExecutionTime: execution.startTime
        });

        console.log('[ETL服务] 开始执行作业:', job.jobName);

        try {
            // 执行ETL流程
            await this.performETL(job, execution, params);

            // 更新执行记录
            execution.endTime = new Date().toISOString();
            execution.status = 'SUCCESS';
            execution.progress = 100;

            // 更新作业状态
            this.update(jobId, {
                lastExecutionStatus: 'SUCCESS',
                lastExecutionTime: execution.endTime
            });

            this.saveExecution(execution);
            this.runningJobs.delete(jobId);

            console.log('[ETL服务] 执行成功:', job.jobName);
            return { success: true, data: execution };

        } catch (error) {
            // 更新执行记录
            execution.endTime = new Date().toISOString();
            execution.status = 'FAILED';
            execution.errorMessage = error.message;
            execution.errorStack = error.stack;

            this.saveExecution(execution);
            this.runningJobs.delete(jobId);

            // 更新作业状态
            this.update(jobId, {
                lastExecutionStatus: 'FAILED',
                lastExecutionTime: execution.endTime
            });

            console.error('[ETL服务] 执行失败:', job.jobName, error);
            return { success: false, error: error.message, data: execution };
        }
    }

    /**
     * 执行ETL流程
     */
    async performETL(job, execution, params) {
        // 1. 抽取数据 (Extract)
        execution.logs.push({ time: new Date().toISOString(), message: '开始抽取数据...' });
        execution.progress = 10;
        this.saveExecution(execution);
        
        const extractedData = await this.extractData(job.sourceConfig);
        execution.logs.push({ time: new Date().toISOString(), message: `抽取完成，共 ${extractedData.length} 条记录` });
        execution.progress = 30;
        this.saveExecution(execution);

        // 2. 转换数据 (Transform)
        execution.logs.push({ time: new Date().toISOString(), message: '开始转换数据...' });
        execution.progress = 40;
        this.saveExecution(execution);
        
        const transformedData = await this.transformData(extractedData, job.transformRules);
        execution.logs.push({ time: new Date().toISOString(), message: `转换完成，成功 ${transformedData.success.length} 条，失败 ${transformedData.failed.length} 条` });
        execution.progress = 70;
        this.saveExecution(execution);

        // 3. 加载数据 (Load)
        execution.logs.push({ time: new Date().toISOString(), message: '开始加载数据...' });
        execution.progress = 80;
        this.saveExecution(execution);
        
        const loadResult = await this.loadData(transformedData.success, job.targetConfig);
        execution.logs.push({ time: new Date().toISOString(), message: `加载完成，成功 ${loadResult.success} 条，失败 ${loadResult.failed} 条` });
        execution.progress = 100;

        // 更新统计信息
        execution.recordsProcessed = extractedData.length;
        execution.recordsSuccess = loadResult.success;
        execution.recordsFailed = transformedData.failed.length + loadResult.failed;

        this.saveExecution(execution);
    }

    /**
     * 抽取数据
     */
    async extractData(sourceConfig) {
        // 模拟数据抽取
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 获取数据源
        if (window.dataSourceService && sourceConfig.dataSourceId) {
            const dataSource = window.dataSourceService.getById(sourceConfig.dataSourceId);
            if (!dataSource) {
                throw new Error('数据源不存在');
            }
        }

        // 模拟抽取的数据
        const mockData = [];
        const recordCount = Math.floor(Math.random() * 500) + 100;
        
        for (let i = 0; i < recordCount; i++) {
            mockData.push({
                id: i + 1,
                name: `数据${i + 1}`,
                value: Math.floor(Math.random() * 10000),
                date: new Date().toISOString(),
                status: Math.random() > 0.5 ? 'active' : 'inactive'
            });
        }

        return mockData;
    }

    /**
     * 转换数据
     */
    async transformData(data, transformRules) {
        // 模拟数据转换
        await new Promise(resolve => setTimeout(resolve, 1500));

        const success = [];
        const failed = [];

        data.forEach(record => {
            try {
                let transformed = { ...record };

                // 应用转换规则
                transformRules.forEach(rule => {
                    transformed = this.applyTransformRule(transformed, rule);
                });

                success.push(transformed);
            } catch (error) {
                failed.push({
                    record,
                    error: error.message
                });
            }
        });

        return { success, failed };
    }

    /**
     * 应用转换规则
     */
    applyTransformRule(record, rule) {
        const result = { ...record };

        switch (rule.type) {
            case 'MAP':
                // 字段映射
                if (rule.sourceFields && rule.targetField) {
                    result[rule.targetField] = record[rule.sourceFields[0]];
                }
                break;

            case 'FILTER':
                // 数据过滤
                if (rule.condition) {
                    // 简单的条件判断
                    const shouldKeep = this.evaluateCondition(record, rule.condition);
                    if (!shouldKeep) {
                        throw new Error('记录被过滤');
                    }
                }
                break;

            case 'CALCULATE':
                // 计算字段
                if (rule.expression && rule.targetField) {
                    result[rule.targetField] = this.evaluateExpression(record, rule.expression);
                }
                break;

            case 'SPLIT':
                // 字段拆分
                if (rule.sourceFields && rule.targetField) {
                    const value = record[rule.sourceFields[0]];
                    if (typeof value === 'string') {
                        result[rule.targetField] = value.split(rule.delimiter || ',');
                    }
                }
                break;

            case 'MERGE':
                // 字段合并
                if (rule.sourceFields && rule.targetField) {
                    const values = rule.sourceFields.map(field => record[field]);
                    result[rule.targetField] = values.join(rule.delimiter || ' ');
                }
                break;
        }

        return result;
    }

    /**
     * 评估条件表达式
     */
    evaluateCondition(record, condition) {
        // 简单实现：支持基本的比较
        // 示例: "value > 100"
        try {
            // 注意：实际生产环境应使用更安全的表达式解析器
            const func = new Function('record', `with(record) { return ${condition}; }`);
            return func(record);
        } catch (error) {
            console.warn('条件评估失败:', error);
            return true;
        }
    }

    /**
     * 评估计算表达式
     */
    evaluateExpression(record, expression) {
        // 简单实现：支持基本的计算
        // 示例: "value * 1.1"
        try {
            const func = new Function('record', `with(record) { return ${expression}; }`);
            return func(record);
        } catch (error) {
            console.warn('表达式评估失败:', error);
            return null;
        }
    }

    /**
     * 加载数据
     */
    async loadData(data, targetConfig) {
        // 模拟数据加载
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟加载结果
        const success = Math.floor(data.length * 0.95);
        const failed = data.length - success;

        return { success, failed };
    }

    /**
     * 停止作业执行
     */
    stopJob(jobId) {
        try {
            if (!this.runningJobs.has(jobId)) {
                return { success: false, error: '作业未在运行' };
            }

            const execution = this.runningJobs.get(jobId);
            execution.status = 'STOPPED';
            execution.endTime = new Date().toISOString();
            execution.logs.push({ time: new Date().toISOString(), message: '作业已被手动停止' });

            this.saveExecution(execution);
            this.runningJobs.delete(jobId);

            console.log('[ETL服务] 作业已停止');
            return { success: true };
        } catch (error) {
            console.error('停止作业失败:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 保存执行记录
     */
    saveExecution(execution) {
        try {
            const executions = this.getExecutions();
            
            const index = executions.findIndex(e => e.id === execution.id);
            if (index >= 0) {
                executions[index] = execution;
            } else {
                executions.unshift(execution);
            }

            // 只保留最近1000条记录
            if (executions.length > 1000) {
                executions.splice(1000);
            }

            localStorage.setItem(this.executionStorageKey, JSON.stringify(executions));
        } catch (error) {
            console.error('保存执行记录失败:', error);
        }
    }

    /**
     * 获取执行记录
     */
    getExecutions(jobId = null, limit = 100) {
        try {
            const data = localStorage.getItem(this.executionStorageKey);
            let executions = JSON.parse(data) || [];

            if (jobId) {
                executions = executions.filter(e => e.jobId === jobId);
            }

            return executions.slice(0, limit);
        } catch (error) {
            console.error('获取执行记录失败:', error);
            return [];
        }
    }

    /**
     * 获取作业统计
     */
    getJobStatistics(jobId) {
        const executions = this.getExecutions(jobId);
        
        const total = executions.length;
        const success = executions.filter(e => e.status === 'SUCCESS').length;
        const failed = executions.filter(e => e.status === 'FAILED').length;
        const running = executions.filter(e => e.status === 'RUNNING').length;

        const totalRecords = executions
            .filter(e => e.status === 'SUCCESS')
            .reduce((sum, e) => sum + (e.recordsProcessed || 0), 0);

        const avgRecords = success > 0 ? Math.floor(totalRecords / success) : 0;

        return {
            total,
            success,
            failed,
            running,
            successRate: total > 0 ? ((success / total) * 100).toFixed(2) + '%' : '0%',
            totalRecords,
            avgRecords
        };
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        const jobs = this.getAll();
        return {
            total: jobs.length,
            draft: jobs.filter(j => j.status === 'DRAFT').length,
            published: jobs.filter(j => j.status === 'PUBLISHED').length,
            archived: jobs.filter(j => j.status === 'ARCHIVED').length,
            enabled: jobs.filter(j => j.enabled).length,
            disabled: jobs.filter(j => !j.enabled).length
        };
    }
}

// 创建全局实例
window.etlService = new ETLService();
