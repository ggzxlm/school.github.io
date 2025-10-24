/**
 * 数据质量管理服务
 */

class DataQualityService {
    constructor() {
        this.rules = [];
        this.checks = [];
        this.tickets = [];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await this.loadMockData();
        this.initialized = true;
    }

    async loadMockData() {
        // 质量规则
        this.rules = [
            {
                id: 'QR001',
                name: '学生身份证号完整性检查',
                ruleType: '完整性',
                targetTable: 'student_info',
                targetField: 'id_card',
                severity: 'HIGH',
                threshold: 95,
                checkExpression: 'id_card IS NOT NULL AND LENGTH(id_card) = 18',
                description: '检查学生身份证号是否完整且长度为18位',
                enabled: true,
                lastCheckTime: '2024-10-23 08:00:00',
                lastScore: 98.5,
                status: 'PASS',
                createTime: '2024-01-15 10:00:00'
            },
            {
                id: 'QR002',
                name: '手机号格式校验',
                ruleType: '准确性',
                targetTable: 'student_info',
                targetField: 'phone',
                severity: 'MEDIUM',
                threshold: 90,
                checkExpression: 'phone REGEXP \'^1[3-9][0-9]{9}$\'',
                description: '检查手机号格式是否符合规范',
                enabled: true,
                lastCheckTime: '2024-10-23 08:00:00',
                lastScore: 92.3,
                status: 'PASS',
                createTime: '2024-01-15 10:30:00'
            },
            {
                id: 'QR003',
                name: '财务金额一致性检查',
                ruleType: '一致性',
                targetTable: 'financial_transaction',
                targetField: 'amount',
                severity: 'HIGH',
                threshold: 99,
                checkExpression: 'amount = debit_amount - credit_amount',
                description: '检查交易金额与借贷金额是否一致',
                enabled: true,
                lastCheckTime: '2024-10-23 07:30:00',
                lastScore: 99.8,
                status: 'PASS',
                createTime: '2024-01-20 09:00:00'
            },
            {
                id: 'QR004',
                name: '采购项目预算合理性',
                ruleType: '合理性',
                targetTable: 'procurement_project',
                targetField: 'budget',
                severity: 'MEDIUM',
                threshold: 85,
                checkExpression: 'budget > 0 AND budget <= 10000000',
                description: '检查采购项目预算是否在合理范围内',
                enabled: true,
                lastCheckTime: '2024-10-23 09:00:00',
                lastScore: 88.5,
                status: 'PASS',
                createTime: '2024-02-01 11:00:00'
            },
            {
                id: 'QR005',
                name: '教师信息唯一性检查',
                ruleType: '唯一性',
                targetTable: 'teacher_info',
                targetField: 'teacher_id',
                severity: 'HIGH',
                threshold: 100,
                checkExpression: 'COUNT(DISTINCT teacher_id) = COUNT(*)',
                description: '检查教师ID是否唯一',
                enabled: true,
                lastCheckTime: '2024-10-23 08:30:00',
                lastScore: 100,
                status: 'PASS',
                createTime: '2024-02-10 14:00:00'
            },
            {
                id: 'QR006',
                name: '邮箱格式验证',
                ruleType: '准确性',
                targetTable: 'student_info',
                targetField: 'email',
                severity: 'LOW',
                threshold: 80,
                checkExpression: 'email REGEXP \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$\'',
                description: '检查邮箱格式是否正确',
                enabled: true,
                lastCheckTime: '2024-10-23 08:00:00',
                lastScore: 75.2,
                status: 'FAIL',
                createTime: '2024-02-15 10:00:00'
            },
            {
                id: 'QR007',
                name: '科研项目时间逻辑检查',
                ruleType: '一致性',
                targetTable: 'research_project',
                targetField: 'start_date,end_date',
                severity: 'MEDIUM',
                threshold: 95,
                checkExpression: 'start_date < end_date',
                description: '检查项目开始时间是否早于结束时间',
                enabled: true,
                lastCheckTime: '2024-10-23 09:30:00',
                lastScore: 96.8,
                status: 'PASS',
                createTime: '2024-03-01 09:00:00'
            },
            {
                id: 'QR008',
                name: '资产编号重复检查',
                ruleType: '唯一性',
                targetTable: 'asset_info',
                targetField: 'asset_code',
                severity: 'HIGH',
                threshold: 100,
                checkExpression: 'COUNT(DISTINCT asset_code) = COUNT(*)',
                description: '检查资产编号是否存在重复',
                enabled: false,
                lastCheckTime: '2024-10-22 10:00:00',
                lastScore: 99.5,
                status: 'PASS',
                createTime: '2024-03-10 11:00:00'
            },
            {
                id: 'QR009',
                name: '学生姓名非空检查',
                ruleType: '完整性',
                targetTable: 'student_info',
                targetField: 'student_name',
                severity: 'HIGH',
                threshold: 100,
                checkExpression: 'student_name IS NOT NULL AND LENGTH(TRIM(student_name)) > 0',
                description: '检查学生姓名是否为空',
                enabled: true,
                lastCheckTime: '2024-10-23 08:00:00',
                lastScore: 99.9,
                status: 'PASS',
                createTime: '2024-03-15 10:00:00'
            },
            {
                id: 'QR010',
                name: '教师职称有效性检查',
                ruleType: '准确性',
                targetTable: 'teacher_info',
                targetField: 'title',
                severity: 'MEDIUM',
                threshold: 95,
                checkExpression: 'title IN (\'教授\', \'副教授\', \'讲师\', \'助教\')',
                description: '检查教师职称是否在有效范围内',
                enabled: true,
                lastCheckTime: '2024-10-23 08:30:00',
                lastScore: 97.5,
                status: 'PASS',
                createTime: '2024-03-20 11:00:00'
            },
            {
                id: 'QR011',
                name: '财务科目代码格式检查',
                ruleType: '准确性',
                targetTable: 'financial_transaction',
                targetField: 'subject_code',
                severity: 'HIGH',
                threshold: 98,
                checkExpression: 'subject_code REGEXP \'^[0-9]{4}$\'',
                description: '检查财务科目代码是否为4位数字',
                enabled: true,
                lastCheckTime: '2024-10-23 07:30:00',
                lastScore: 99.2,
                status: 'PASS',
                createTime: '2024-03-25 09:00:00'
            },
            {
                id: 'QR012',
                name: '采购金额非负检查',
                ruleType: '合理性',
                targetTable: 'procurement_project',
                targetField: 'actual_amount',
                severity: 'HIGH',
                threshold: 100,
                checkExpression: 'actual_amount >= 0',
                description: '检查采购实际金额是否为非负数',
                enabled: true,
                lastCheckTime: '2024-10-23 09:00:00',
                lastScore: 100,
                status: 'PASS',
                createTime: '2024-04-01 10:00:00'
            },
            {
                id: 'QR013',
                name: '科研经费余额合理性',
                ruleType: '一致性',
                targetTable: 'research_project',
                targetField: 'balance',
                severity: 'HIGH',
                threshold: 99,
                checkExpression: 'balance = total_funding - spent_amount',
                description: '检查科研经费余额计算是否正确',
                enabled: true,
                lastCheckTime: '2024-10-23 09:30:00',
                lastScore: 99.5,
                status: 'PASS',
                createTime: '2024-04-05 11:00:00'
            },
            {
                id: 'QR014',
                name: '学生年龄合理性检查',
                ruleType: '合理性',
                targetTable: 'student_info',
                targetField: 'birth_date',
                severity: 'MEDIUM',
                threshold: 95,
                checkExpression: 'YEAR(CURRENT_DATE) - YEAR(birth_date) BETWEEN 16 AND 35',
                description: '检查学生年龄是否在16-35岁之间',
                enabled: true,
                lastCheckTime: '2024-10-23 08:00:00',
                lastScore: 96.8,
                status: 'PASS',
                createTime: '2024-04-10 10:00:00'
            },
            {
                id: 'QR015',
                name: '资产价值非空检查',
                ruleType: '完整性',
                targetTable: 'asset_info',
                targetField: 'asset_value',
                severity: 'HIGH',
                threshold: 98,
                checkExpression: 'asset_value IS NOT NULL AND asset_value > 0',
                description: '检查资产价值是否为空或小于等于0',
                enabled: true,
                lastCheckTime: '2024-10-22 10:00:00',
                lastScore: 98.8,
                status: 'PASS',
                createTime: '2024-04-15 14:00:00'
            },
            {
                id: 'QR016',
                name: '供应商信用代码唯一性',
                ruleType: '唯一性',
                targetTable: 'supplier_info',
                targetField: 'credit_code',
                severity: 'HIGH',
                threshold: 100,
                checkExpression: 'COUNT(DISTINCT credit_code) = COUNT(*)',
                description: '检查供应商统一社会信用代码是否唯一',
                enabled: true,
                lastCheckTime: '2024-10-23 10:00:00',
                lastScore: 100,
                status: 'PASS',
                createTime: '2024-04-20 09:00:00'
            },
            {
                id: 'QR017',
                name: '合同金额与预算对比',
                ruleType: '一致性',
                targetTable: 'contract_info',
                targetField: 'contract_amount',
                severity: 'MEDIUM',
                threshold: 90,
                checkExpression: 'contract_amount <= budget_amount * 1.1',
                description: '检查合同金额是否超出预算10%以上',
                enabled: true,
                lastCheckTime: '2024-10-23 10:30:00',
                lastScore: 94.2,
                status: 'PASS',
                createTime: '2024-04-25 11:00:00'
            },
            {
                id: 'QR018',
                name: '发票号码格式检查',
                ruleType: '准确性',
                targetTable: 'invoice_info',
                targetField: 'invoice_no',
                severity: 'HIGH',
                threshold: 98,
                checkExpression: 'invoice_no REGEXP \'^[0-9]{8}$\'',
                description: '检查发票号码是否为8位数字',
                enabled: true,
                lastCheckTime: '2024-10-23 11:00:00',
                lastScore: 98.5,
                status: 'PASS',
                createTime: '2024-05-01 10:00:00'
            },
            {
                id: 'QR019',
                name: '部门编码标准化检查',
                ruleType: '准确性',
                targetTable: 'department_info',
                targetField: 'dept_code',
                severity: 'MEDIUM',
                threshold: 95,
                checkExpression: 'dept_code REGEXP \'^[A-Z]{2}[0-9]{3}$\'',
                description: '检查部门编码格式(2位大写字母+3位数字)',
                enabled: true,
                lastCheckTime: '2024-10-23 11:30:00',
                lastScore: 96.5,
                status: 'PASS',
                createTime: '2024-05-05 09:00:00'
            },
            {
                id: 'QR020',
                name: '项目状态有效性检查',
                ruleType: '准确性',
                targetTable: 'research_project',
                targetField: 'status',
                severity: 'MEDIUM',
                threshold: 98,
                checkExpression: 'status IN (\'计划中\', \'进行中\', \'已完成\', \'已取消\')',
                description: '检查项目状态是否在有效值范围内',
                enabled: true,
                lastCheckTime: '2024-10-23 09:30:00',
                lastScore: 99.1,
                status: 'PASS',
                createTime: '2024-05-10 10:00:00'
            }
        ];

        // 检查历史
        this.checks = [
            {
                id: 'CHK001',
                ruleId: 'QR001',
                ruleName: '学生身份证号完整性检查',
                ruleType: '完整性',
                checkTime: '2024-10-23 08:00:00',
                totalRecords: 15000,
                passRecords: 14775,
                failRecords: 225,
                score: 98.5,
                status: 'PASS',
                duration: 1250,
                errorMessage: null
            },
            {
                id: 'CHK002',
                ruleId: 'QR002',
                ruleName: '手机号格式校验',
                ruleType: '准确性',
                checkTime: '2024-10-23 08:00:00',
                totalRecords: 15000,
                passRecords: 13845,
                failRecords: 1155,
                score: 92.3,
                status: 'PASS',
                duration: 980,
                errorMessage: null
            },
            {
                id: 'CHK003',
                ruleId: 'QR003',
                ruleName: '财务金额一致性检查',
                ruleType: '一致性',
                checkTime: '2024-10-23 07:30:00',
                totalRecords: 50000,
                passRecords: 49900,
                failRecords: 100,
                score: 99.8,
                status: 'PASS',
                duration: 3200,
                errorMessage: null
            },
            {
                id: 'CHK004',
                ruleId: 'QR006',
                ruleName: '邮箱格式验证',
                ruleType: '准确性',
                checkTime: '2024-10-23 08:00:00',
                totalRecords: 15000,
                passRecords: 11280,
                failRecords: 3720,
                score: 75.2,
                status: 'FAIL',
                duration: 850,
                errorMessage: null
            },
            {
                id: 'CHK005',
                ruleId: 'QR004',
                ruleName: '采购项目预算合理性',
                ruleType: '合理性',
                checkTime: '2024-10-23 09:00:00',
                totalRecords: 500,
                passRecords: 442,
                failRecords: 58,
                score: 88.4,
                status: 'PASS',
                duration: 320,
                errorMessage: null
            },
            {
                id: 'CHK006',
                ruleId: 'QR005',
                ruleName: '教师信息唯一性检查',
                ruleType: '唯一性',
                checkTime: '2024-10-23 08:30:00',
                totalRecords: 800,
                passRecords: 800,
                failRecords: 0,
                score: 100,
                status: 'PASS',
                duration: 180,
                errorMessage: null
            },
            {
                id: 'CHK007',
                ruleId: 'QR007',
                ruleName: '科研项目时间逻辑检查',
                ruleType: '一致性',
                checkTime: '2024-10-23 09:30:00',
                totalRecords: 1200,
                passRecords: 1162,
                failRecords: 38,
                score: 96.8,
                status: 'PASS',
                duration: 450,
                errorMessage: null
            },
            {
                id: 'CHK008',
                ruleId: 'QR001',
                ruleName: '学生身份证号完整性检查',
                ruleType: '完整性',
                checkTime: '2024-10-22 08:00:00',
                totalRecords: 15000,
                passRecords: 14760,
                failRecords: 240,
                score: 98.4,
                status: 'PASS',
                duration: 1280,
                errorMessage: null
            },
            {
                id: 'CHK009',
                ruleId: 'QR009',
                ruleName: '学生姓名非空检查',
                ruleType: '完整性',
                checkTime: '2024-10-23 08:00:00',
                totalRecords: 15000,
                passRecords: 14985,
                failRecords: 15,
                score: 99.9,
                status: 'PASS',
                duration: 680,
                errorMessage: null
            },
            {
                id: 'CHK010',
                ruleId: 'QR010',
                ruleName: '教师职称有效性检查',
                ruleType: '准确性',
                checkTime: '2024-10-23 08:30:00',
                totalRecords: 800,
                passRecords: 780,
                failRecords: 20,
                score: 97.5,
                status: 'PASS',
                duration: 220,
                errorMessage: null
            },
            {
                id: 'CHK011',
                ruleId: 'QR011',
                ruleName: '财务科目代码格式检查',
                ruleType: '准确性',
                checkTime: '2024-10-23 07:30:00',
                totalRecords: 50000,
                passRecords: 49600,
                failRecords: 400,
                score: 99.2,
                status: 'PASS',
                duration: 2800,
                errorMessage: null
            },
            {
                id: 'CHK012',
                ruleId: 'QR012',
                ruleName: '采购金额非负检查',
                ruleType: '合理性',
                checkTime: '2024-10-23 09:00:00',
                totalRecords: 500,
                passRecords: 500,
                failRecords: 0,
                score: 100,
                status: 'PASS',
                duration: 180,
                errorMessage: null
            },
            {
                id: 'CHK013',
                ruleId: 'QR013',
                ruleName: '科研经费余额合理性',
                ruleType: '一致性',
                checkTime: '2024-10-23 09:30:00',
                totalRecords: 1200,
                passRecords: 1194,
                failRecords: 6,
                score: 99.5,
                status: 'PASS',
                duration: 520,
                errorMessage: null
            },
            {
                id: 'CHK014',
                ruleId: 'QR014',
                ruleName: '学生年龄合理性检查',
                ruleType: '合理性',
                checkTime: '2024-10-23 08:00:00',
                totalRecords: 15000,
                passRecords: 14520,
                failRecords: 480,
                score: 96.8,
                status: 'PASS',
                duration: 1100,
                errorMessage: null
            },
            {
                id: 'CHK015',
                ruleId: 'QR015',
                ruleName: '资产价值非空检查',
                ruleType: '完整性',
                checkTime: '2024-10-22 10:00:00',
                totalRecords: 5000,
                passRecords: 4940,
                failRecords: 60,
                score: 98.8,
                status: 'PASS',
                duration: 420,
                errorMessage: null
            },
            {
                id: 'CHK016',
                ruleId: 'QR016',
                ruleName: '供应商信用代码唯一性',
                ruleType: '唯一性',
                checkTime: '2024-10-23 10:00:00',
                totalRecords: 300,
                passRecords: 300,
                failRecords: 0,
                score: 100,
                status: 'PASS',
                duration: 150,
                errorMessage: null
            },
            {
                id: 'CHK017',
                ruleId: 'QR017',
                ruleName: '合同金额与预算对比',
                ruleType: '一致性',
                checkTime: '2024-10-23 10:30:00',
                totalRecords: 450,
                passRecords: 424,
                failRecords: 26,
                score: 94.2,
                status: 'PASS',
                duration: 280,
                errorMessage: null
            },
            {
                id: 'CHK018',
                ruleId: 'QR018',
                ruleName: '发票号码格式检查',
                ruleType: '准确性',
                checkTime: '2024-10-23 11:00:00',
                totalRecords: 8000,
                passRecords: 7880,
                failRecords: 120,
                score: 98.5,
                status: 'PASS',
                duration: 650,
                errorMessage: null
            },
            {
                id: 'CHK019',
                ruleId: 'QR019',
                ruleName: '部门编码标准化检查',
                ruleType: '准确性',
                checkTime: '2024-10-23 11:30:00',
                totalRecords: 50,
                passRecords: 48,
                failRecords: 2,
                score: 96.0,
                status: 'PASS',
                duration: 80,
                errorMessage: null
            },
            {
                id: 'CHK020',
                ruleId: 'QR020',
                ruleName: '项目状态有效性检查',
                ruleType: '准确性',
                checkTime: '2024-10-23 09:30:00',
                totalRecords: 1200,
                passRecords: 1189,
                failRecords: 11,
                score: 99.1,
                status: 'PASS',
                duration: 380,
                errorMessage: null
            }
        ];

        // 质量工单
        this.tickets = [
            {
                id: 'TK001',
                title: '学生邮箱格式问题批量修复',
                ruleId: 'QR006',
                ruleName: '邮箱格式验证',
                severity: 'LOW',
                status: 'OPEN',
                assignee: null,
                description: '检测到3720条学生邮箱格式不正确，需要批量修复',
                affectedRecords: 3720,
                createTime: '2024-10-23 08:15:00',
                updateTime: '2024-10-23 08:15:00'
            },
            {
                id: 'TK002',
                title: '手机号格式异常数据清理',
                ruleId: 'QR002',
                ruleName: '手机号格式校验',
                severity: 'MEDIUM',
                status: 'ASSIGNED',
                assignee: '张三',
                description: '发现1155条手机号格式不符合规范，需要联系学生更新',
                affectedRecords: 1155,
                createTime: '2024-10-23 08:10:00',
                updateTime: '2024-10-23 09:30:00'
            },
            {
                id: 'TK003',
                title: '身份证号缺失数据补录',
                ruleId: 'QR001',
                ruleName: '学生身份证号完整性检查',
                severity: 'HIGH',
                status: 'PROCESSING',
                assignee: '李四',
                description: '225名学生身份证号信息缺失，需要补录',
                affectedRecords: 225,
                createTime: '2024-10-23 08:05:00',
                updateTime: '2024-10-23 10:00:00'
            },
            {
                id: 'TK004',
                title: '财务金额不一致问题核查',
                ruleId: 'QR003',
                ruleName: '财务金额一致性检查',
                severity: 'HIGH',
                status: 'RESOLVED',
                assignee: '王五',
                description: '100笔财务交易金额与借贷金额不一致，已核查并修正',
                affectedRecords: 100,
                createTime: '2024-10-23 07:45:00',
                updateTime: '2024-10-23 11:30:00',
                resolveTime: '2024-10-23 11:30:00'
            },
            {
                id: 'TK005',
                title: '采购项目预算异常值处理',
                ruleId: 'QR004',
                ruleName: '采购项目预算合理性',
                severity: 'MEDIUM',
                status: 'ASSIGNED',
                assignee: '赵六',
                description: '58个采购项目预算超出合理范围，需要核实',
                affectedRecords: 58,
                createTime: '2024-10-23 09:15:00',
                updateTime: '2024-10-23 09:45:00'
            },
            {
                id: 'TK006',
                title: '学生姓名空值数据处理',
                ruleId: 'QR009',
                ruleName: '学生姓名非空检查',
                severity: 'HIGH',
                status: 'OPEN',
                assignee: null,
                description: '发现15条学生姓名为空的记录，需要补充完整',
                affectedRecords: 15,
                createTime: '2024-10-23 08:20:00',
                updateTime: '2024-10-23 08:20:00'
            },
            {
                id: 'TK007',
                title: '教师职称数据规范化',
                ruleId: 'QR010',
                ruleName: '教师职称有效性检查',
                severity: 'MEDIUM',
                status: 'ASSIGNED',
                assignee: '孙七',
                description: '20条教师职称数据不在标准范围内，需要规范化处理',
                affectedRecords: 20,
                createTime: '2024-10-23 08:45:00',
                updateTime: '2024-10-23 09:15:00'
            },
            {
                id: 'TK008',
                title: '财务科目代码格式修正',
                ruleId: 'QR011',
                ruleName: '财务科目代码格式检查',
                severity: 'HIGH',
                status: 'PROCESSING',
                assignee: '周八',
                description: '400条财务科目代码格式不正确，需要批量修正',
                affectedRecords: 400,
                createTime: '2024-10-23 07:50:00',
                updateTime: '2024-10-23 10:30:00'
            },
            {
                id: 'TK009',
                title: '科研经费余额核对',
                ruleId: 'QR013',
                ruleName: '科研经费余额合理性',
                severity: 'HIGH',
                status: 'ASSIGNED',
                assignee: '吴九',
                description: '6个科研项目经费余额计算不正确，需要核对并修正',
                affectedRecords: 6,
                createTime: '2024-10-23 09:45:00',
                updateTime: '2024-10-23 10:15:00'
            },
            {
                id: 'TK010',
                title: '学生年龄异常数据核查',
                ruleId: 'QR014',
                ruleName: '学生年龄合理性检查',
                severity: 'MEDIUM',
                status: 'OPEN',
                assignee: null,
                description: '480名学生年龄不在合理范围，需要核查出生日期',
                affectedRecords: 480,
                createTime: '2024-10-23 08:25:00',
                updateTime: '2024-10-23 08:25:00'
            },
            {
                id: 'TK011',
                title: '资产价值缺失数据补录',
                ruleId: 'QR015',
                ruleName: '资产价值非空检查',
                severity: 'HIGH',
                status: 'RESOLVED',
                assignee: '郑十',
                description: '60条资产价值数据缺失，已完成补录',
                affectedRecords: 60,
                createTime: '2024-10-22 10:15:00',
                updateTime: '2024-10-22 16:30:00',
                resolveTime: '2024-10-22 16:30:00'
            },
            {
                id: 'TK012',
                title: '合同金额超预算问题处理',
                ruleId: 'QR017',
                ruleName: '合同金额与预算对比',
                severity: 'MEDIUM',
                status: 'PROCESSING',
                assignee: '钱十一',
                description: '26个合同金额超出预算10%以上，需要审核处理',
                affectedRecords: 26,
                createTime: '2024-10-23 10:45:00',
                updateTime: '2024-10-23 11:20:00'
            },
            {
                id: 'TK013',
                title: '发票号码格式统一',
                ruleId: 'QR018',
                ruleName: '发票号码格式检查',
                severity: 'MEDIUM',
                status: 'ASSIGNED',
                assignee: '陈十二',
                description: '120条发票号码格式不符合8位数字标准，需要统一格式',
                affectedRecords: 120,
                createTime: '2024-10-23 11:15:00',
                updateTime: '2024-10-23 11:45:00'
            },
            {
                id: 'TK014',
                title: '部门编码标准化整改',
                ruleId: 'QR019',
                ruleName: '部门编码标准化检查',
                severity: 'LOW',
                status: 'OPEN',
                assignee: null,
                description: '2个部门编码不符合标准格式，需要修改',
                affectedRecords: 2,
                createTime: '2024-10-23 11:45:00',
                updateTime: '2024-10-23 11:45:00'
            },
            {
                id: 'TK015',
                title: '项目状态数据清理',
                ruleId: 'QR020',
                ruleName: '项目状态有效性检查',
                severity: 'MEDIUM',
                status: 'ASSIGNED',
                assignee: '林十三',
                description: '11个项目状态值不在有效范围内，需要清理规范',
                affectedRecords: 11,
                createTime: '2024-10-23 09:50:00',
                updateTime: '2024-10-23 10:20:00'
            }
        ];
    }

    getRules(filters = {}) {
        let data = [...this.rules];
        
        if (filters.ruleType) {
            data = data.filter(r => r.ruleType === filters.ruleType);
        }
        
        if (filters.severity) {
            data = data.filter(r => r.severity === filters.severity);
        }
        
        if (filters.status) {
            data = data.filter(r => r.status === filters.status);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            data = data.filter(r => 
                r.name.toLowerCase().includes(search) ||
                r.targetTable.toLowerCase().includes(search)
            );
        }
        
        return data;
    }

    getChecks(filters = {}) {
        let data = [...this.checks];
        
        if (filters.status) {
            data = data.filter(c => c.status === filters.status);
        }
        
        if (filters.startDate && filters.endDate) {
            data = data.filter(c => 
                c.checkTime >= filters.startDate && c.checkTime <= filters.endDate
            );
        }
        
        return data;
    }

    getTickets(filters = {}) {
        let data = [...this.tickets];
        
        if (filters.status) {
            data = data.filter(t => t.status === filters.status);
        }
        
        if (filters.severity) {
            data = data.filter(t => t.severity === filters.severity);
        }
        
        return data;
    }

    getStatistics() {
        const enabledRules = this.rules.filter(r => r.enabled);
        const totalScore = enabledRules.reduce((sum, r) => sum + (r.lastScore || 0), 0);
        const avgScore = enabledRules.length > 0 ? (totalScore / enabledRules.length).toFixed(1) : 0;
        
        return {
            totalRules: this.rules.length,
            avgScore: avgScore,
            totalChecks: this.checks.length,
            openTickets: this.tickets.filter(t => t.status === 'OPEN' || t.status === 'ASSIGNED' || t.status === 'PROCESSING').length
        };
    }

    getTableStats() {
        const tableMap = new Map();
        
        this.checks.forEach(check => {
            const rule = this.rules.find(r => r.id === check.ruleId);
            if (!rule) return;
            
            const tableName = rule.targetTable;
            if (!tableMap.has(tableName)) {
                tableMap.set(tableName, {
                    tableName: tableName,
                    checkCount: 0,
                    totalScore: 0,
                    passCount: 0,
                    failCount: 0
                });
            }
            
            const stats = tableMap.get(tableName);
            stats.checkCount++;
            stats.totalScore += check.score;
            if (check.status === 'PASS') {
                stats.passCount++;
            } else {
                stats.failCount++;
            }
        });
        
        return Array.from(tableMap.values()).map(stats => ({
            ...stats,
            avgScore: (stats.totalScore / stats.checkCount).toFixed(1),
            passRate: ((stats.passCount / stats.checkCount) * 100).toFixed(1)
        }));
    }

    getRuleTypeStats() {
        const typeMap = new Map();
        
        this.rules.forEach(rule => {
            if (!typeMap.has(rule.ruleType)) {
                typeMap.set(rule.ruleType, 0);
            }
            typeMap.set(rule.ruleType, typeMap.get(rule.ruleType) + 1);
        });
        
        return Array.from(typeMap.entries()).map(([name, value]) => ({
            name,
            value
        }));
    }

    getTrendData() {
        // 模拟7天的趋势数据
        return {
            dates: ['10-17', '10-18', '10-19', '10-20', '10-21', '10-22', '10-23'],
            scores: [95.2, 94.8, 96.1, 95.5, 96.3, 95.8, 96.5]
        };
    }

    /**
     * 创建新规则
     */
    createRule(ruleData) {
        const newRule = {
            id: `QR${String(this.rules.length + 1).padStart(3, '0')}`,
            name: ruleData.name,
            ruleType: this.getRuleTypeLabel(ruleData.ruleType),
            targetTable: ruleData.targetTable,
            targetField: ruleData.targetColumn || null,
            severity: ruleData.severity,
            threshold: ruleData.threshold,
            checkExpression: ruleData.expression || null,
            description: ruleData.description || '',
            enabled: true,
            lastCheckTime: null,
            lastScore: null,
            status: null,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        this.rules.unshift(newRule);
        return newRule;
    }

    /**
     * 获取规则类型标签
     */
    getRuleTypeLabel(type) {
        const typeMap = {
            'COMPLETENESS': '完整性',
            'ACCURACY': '准确性',
            'CONSISTENCY': '一致性',
            'UNIQUENESS': '唯一性',
            'VALIDITY': '有效性',
            'TIMELINESS': '及时性'
        };
        return typeMap[type] || type;
    }

    /**
     * 更新规则
     */
    updateRule(ruleId, ruleData) {
        const index = this.rules.findIndex(r => r.id === ruleId);
        if (index === -1) {
            throw new Error('规则不存在');
        }
        
        this.rules[index] = {
            ...this.rules[index],
            name: ruleData.name,
            ruleType: this.getRuleTypeLabel(ruleData.ruleType),
            targetTable: ruleData.targetTable,
            targetField: ruleData.targetColumn || null,
            severity: ruleData.severity,
            threshold: ruleData.threshold,
            checkExpression: ruleData.expression || null,
            description: ruleData.description || ''
        };
        
        return this.rules[index];
    }

    /**
     * 删除规则
     */
    deleteRule(ruleId) {
        const index = this.rules.findIndex(r => r.id === ruleId);
        if (index === -1) {
            throw new Error('规则不存在');
        }
        
        this.rules.splice(index, 1);
    }

    /**
     * 获取规则详情
     */
    getRuleById(ruleId) {
        return this.rules.find(r => r.id === ruleId);
    }
}

window.dataQualityService = new DataQualityService();
