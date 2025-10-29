/**
 * 预警处置中心页面逻辑
 */

const AlertCenter = {
    // 当前页码
    currentPage: 1,
    pageSize: 12,
    
    // 筛选条件
    filters: {
        risk: '',
        type: '',
        status: '',
        department: '',
        time: ''
    },
    
    // 当前选中的预警ID（用于分发）
    selectedAlertIds: [],

    // 模拟数据
    mockData: {
        stats: [
            {
                id: 'total',
                title: '预警总数',
                value: 268,
                icon: 'fa-exclamation-triangle',
                color: 'primary'
            },
            {
                id: 'high',
                title: '高风险',
                value: 64,
                icon: 'fa-exclamation-circle',
                color: 'danger'
            },
            {
                id: 'medium',
                title: '中风险',
                value: 124,
                icon: 'fa-exclamation',
                color: 'warning'
            },
            {
                id: 'low',
                title: '低风险',
                value: 80,
                icon: 'fa-info-circle',
                color: 'info'
            },
            {
                id: 'pending',
                title: '待处理',
                value: 97,
                icon: 'fa-clock',
                color: 'secondary'
            }
        ],

        alerts: [
            {
                id: 'ALERT001',
                code: 'YJ-2025-022',
                title: '采购人员与供应商关联关系预警',
                type: 'procurement',
                typeName: '采购管理',
                risk: 'high',
                status: 'pending',
                statusName: '待核实',
                department: '设备处',
                person: '张三',
                amount: '500万元',
                project: '实验室设备采购项目',
                source: '规则引擎',
                rule: '采购人员关联关系检测规则',
                threshold: '存在关联关系',
                ruleDescription: '系统自动检测采购人员与供应商之间的关联关系，包括亲属关系、股权关系等',
                description: '检测到采购经理张三与中标供应商某某科技公司存在关联关系。关系路径：张三(采购经理) → 配偶 → 李四 → 股东(30%) → 某某科技公司。涉及采购项目金额500万元，风险等级：高。',
                time: '2025-10-22 09:15:00',
                createdAt: '2025-10-22 09:15:00',
                deadline: '2025-10-25',
                handler: null
            },
            {
                id: 1,
                code: 'YJ-2025-001',
                title: '科研经费异常报销 - 连号发票检测',
                type: 'research',
                typeName: '科研经费',
                risk: 'high',
                status: 'pending',
                statusName: '待处理',
                department: '计算机学院',
                person: '张三教授',
                amount: '52,000元',
                project: '人工智能研究项目',
                source: '规则引擎',
                rule: '连号发票检测规则',
                threshold: '连续3张及以上',
                ruleDescription: '系统自动检测报销单中的发票号码，当发现连续号码的发票时触发预警',
                description: '检测到张三教授课题组在2025年10月提交的报销单中存在5张连号发票，发票号码为：No.12345-12349，涉及金额52,000元。根据财务管理规定，连号发票存在虚假报销风险。',
                time: '2025-10-21 09:30:00',
                createdAt: '2025-10-21 09:30:00',
                deadline: '2025-10-24',
                handler: null
            },
            {
                id: 2,
                code: 'YJ-2025-002',
                title: '三公经费超预算预警',
                type: 'finance',
                typeName: '财务管理',
                risk: 'high',
                status: 'assigned',
                statusName: '已分发',
                department: '行政办公室',
                person: '行政办主任',
                amount: '285,000元',
                project: '-',
                percentage: '95%',
                source: '规则引擎',
                rule: '预算超支预警规则',
                threshold: '达到预算90%',
                ruleDescription: '监控各部门预算执行情况，当支出达到预算的90%时触发预警',
                description: '行政办公室本月三公经费支出已达预算的95%，距离预算红线仅剩5%。当前支出：285,000元，预算总额：300,000元。请注意控制后续支出。',
                time: '2025-10-21 08:15:00',
                createdAt: '2025-10-21 08:15:00',
                deadline: '2025-10-23',
                handler: '李四',
                assignedTo: '李四'
            },
            {
                id: 3,
                code: 'YJ-2025-003',
                title: '招生录取低分高录异常',
                type: 'enrollment',
                typeName: '招生录取',
                risk: 'high',
                status: 'processing',
                statusName: '处理中',
                department: '计算机学院',
                person: '王某某、李某某、赵某某',
                amount: '-',
                project: '2025年本科招生',
                count: '3例',
                source: '审计发现',
                rule: '录取分数异常检测',
                threshold: '低于最低分数线10分',
                ruleDescription: '检测录取学生分数是否符合专业最低分数线要求',
                description: '2025年招生录取中发现计算机学院有3名学生录取分数低于专业最低分数线10分以上，但未见特殊类型招生审批材料。涉及学生：王某某、李某某、赵某某。',
                time: '2025-10-20 16:45:00',
                createdAt: '2025-10-20 16:45:00',
                deadline: '2025-10-27',
                handler: '王五',
                assignedTo: '王五'
            },
            {
                id: 4,
                title: '固定资产账实不符',
                type: 'asset',
                typeName: '固定资产',
                risk: 'medium',
                status: 'completed',
                statusName: '已完成',
                department: '物理学院',
                count: '2台设备',
                source: '巡查发现',
                description: '物理学院实验室盘点发现2台高精度光谱仪账面存在但实物缺失，资产编号：ZC-2023-0156、ZC-2023-0157，单价约15万元/台。',
                createdAt: '2025-10-20 11:20:00',
                completedAt: '2025-10-21 10:00:00'
            },
            {
                id: 5,
                title: '工程变更频率异常',
                type: 'construction',
                typeName: '基建工程',
                risk: 'medium',
                status: 'pending',
                statusName: '待处理',
                department: '基建处',
                count: '8次变更',
                source: '规则引擎',
                description: '体育馆改造项目自开工以来已发生8次工程变更，变更频率超过正常范围（标准≤5次）。累计变更金额达120万元，占合同总额的12%。',
                createdAt: '2025-10-20 10:00:00',
                deadline: '2025-10-27'
            },
            {
                id: 6,
                code: 'YJ-2025-006',
                title: '供应商关联冲突预警',
                type: 'procurement',
                typeName: '采购管理',
                risk: 'high',
                status: 'pending',
                statusName: '待处理',
                department: '采购中心',
                person: '采购负责人',
                amount: '380万元',
                project: '实验设备采购项目',
                source: '规则引擎',
                rule: '供应商关联关系检测规则',
                threshold: '2家及以上',
                ruleDescription: '系统自动检测投标供应商之间的关联关系，包括法人代表、注册地址、股东结构等',
                description: '在实验设备采购项目中，检测到3家投标供应商存在关联关系：法人代表为同一人的亲属关系，且注册地址相同。涉及项目金额：380万元。',
                time: '2025-10-19 15:30:00',
                createdAt: '2025-10-19 15:30:00',
                deadline: '2025-10-22',
                handler: null
            },
            {
                id: 7,
                title: '预算执行偏离度过大',
                type: 'budget',
                typeName: '预算执行',
                risk: 'medium',
                status: 'assigned',
                statusName: '已分发',
                department: '科研处',
                percentage: '145%',
                source: '审计发现',
                description: '某科研项目经费使用进度与时间进度严重不匹配，项目进度仅完成60%，但经费已使用145%。存在预算执行不规范问题。',
                createdAt: '2025-10-19 13:45:00',
                deadline: '2025-10-26',
                assignedTo: '赵六'
            },
            {
                id: 8,
                title: '公车使用轨迹异常',
                type: 'discipline',
                typeName: '八项规定',
                risk: 'medium',
                status: 'completed',
                statusName: '已完成',
                department: '后勤处',
                source: '规则引擎',
                description: '车牌号为京A12345的公务用车在非工作时间（周六晚上22:00-23:30）出现在娱乐场所附近，行驶轨迹异常。',
                createdAt: '2025-10-19 09:20:00',
                completedAt: '2025-10-20 16:00:00'
            },
            {
                id: 9,
                title: '设备重复采购预警',
                type: 'asset',
                typeName: '固定资产',
                risk: 'low',
                status: 'ignored',
                statusName: '已忽略',
                department: '物理学院',
                source: '规则引擎',
                description: '物理学院申请采购的高速离心机与2023年已采购设备型号相同，存在重复采购可能。经核实为不同实验室合理需求。',
                createdAt: '2025-10-18 14:30:00'
            },
            {
                id: 10,
                title: '津补贴发放异常',
                type: 'budget',
                typeName: '预算执行',
                risk: 'medium',
                status: 'processing',
                statusName: '处理中',
                department: '人事处',
                source: '审计发现',
                description: '某部门津贴发放标准不一致，同岗位人员津贴差异达30%，未见相关审批文件。涉及人员15人。',
                createdAt: '2025-10-18 11:00:00',
                deadline: '2025-10-25',
                assignedTo: '孙七'
            },
            {
                id: 11,
                title: '专项资金使用不规范',
                type: 'finance',
                typeName: '财务管理',
                risk: 'high',
                status: 'pending',
                statusName: '待处理',
                department: '教务处',
                amount: '80,000元',
                source: '巡查发现',
                description: '教学改革专项经费被用于购买办公设备和日常办公用品，与专项资金使用范围不符。涉及金额8万元。',
                createdAt: '2025-10-18 10:20:00',
                deadline: '2025-10-21'
            },
            {
                id: 12,
                title: '权限异常访问',
                type: 'it',
                typeName: 'IT治理',
                risk: 'high',
                status: 'pending',
                statusName: '待处理',
                department: '信息中心',
                source: '规则引擎',
                description: '检测到某账号在非工作时段（凌晨2:00-3:00）访问学生成绩数据库，且访问频次异常（200次/小时）。账号：admin_zhang。',
                createdAt: '2025-10-17 08:45:00',
                deadline: '2025-10-20'
            },
            {
                id: 13,
                code: 'YJ-2025-013',
                title: '招生学籍异常变动',
                type: 'enrollment',
                typeName: '招生学籍',
                risk: 'high',
                status: 'pending',
                statusName: '待处理',
                department: '教务处',
                person: '学籍管理员',
                count: '5例',
                source: '审计发现',
                rule: '学籍异常变动检测',
                threshold: '3例及以上',
                ruleDescription: '监控学籍异常变动情况，包括转专业、休学、退学等',
                description: '发现5名学生在未提交完整审批材料的情况下完成了转专业操作，涉及计算机、金融等热门专业。',
                time: '2025-10-16 14:20:00',
                createdAt: '2025-10-16 14:20:00',
                deadline: '2025-10-19',
                handler: null
            },
            {
                id: 14,
                code: 'YJ-2025-014',
                title: '薪酬发放异常',
                type: 'salary',
                typeName: '薪酬社保',
                risk: 'medium',
                status: 'assigned',
                statusName: '已分发',
                department: '人事处',
                person: '薪酬专员',
                amount: '120,000元',
                source: '规则引擎',
                rule: '薪酬异常检测规则',
                threshold: '超过标准30%',
                ruleDescription: '检测薪酬发放是否符合标准，包括基本工资、津贴、奖金等',
                description: '某部门本月薪酬发放总额超出预算30%，其中绩效奖金部分异常增长，涉及金额12万元。',
                time: '2025-10-15 10:30:00',
                createdAt: '2025-10-15 10:30:00',
                deadline: '2025-10-22',
                handler: '张经理',
                assignedTo: '张经理'
            },
            {
                id: 15,
                title: '第一议题执行不规范',
                type: 'first-topic',
                typeName: '第一议题',
                risk: 'medium',
                status: 'processing',
                statusName: '处理中',
                department: '党委办公室',
                source: '巡查发现',
                description: '某二级学院党委会议记录显示，连续3次会议未将学习贯彻习近平新时代中国特色社会主义思想作为第一议题。',
                createdAt: '2025-10-14 16:00:00',
                deadline: '2025-10-21',
                assignedTo: '党办主任'
            },
            {
                id: 16,
                code: 'YJ-2025-016',
                title: '重大决策程序不完整',
                type: 'major-decision',
                typeName: '重大决策',
                risk: 'high',
                status: 'pending',
                statusName: '待处理',
                department: '校长办公室',
                amount: '500万元',
                source: '纪检监督',
                rule: '重大决策程序检查',
                threshold: '金额≥500万',
                ruleDescription: '监督重大决策是否履行集体讨论、专家论证、风险评估等程序',
                description: '某重大采购项目（金额500万元）在决策过程中缺少专家论证和风险评估环节，未完全履行重大决策程序。',
                time: '2025-10-13 09:00:00',
                createdAt: '2025-10-13 09:00:00',
                deadline: '2025-10-16',
                handler: null
            },
            {
                id: 17,
                title: '三重一大事项未报备',
                type: 'three-major',
                typeName: '三重一大',
                risk: 'high',
                status: 'pending',
                statusName: '待处理',
                department: '后勤处',
                amount: '300万元',
                source: '纪检监督',
                description: '后勤处与某物业公司签订3年期服务合同，金额300万元，属于"三重一大"事项，但未按规定提交党委会集体研究。',
                createdAt: '2025-10-12 11:30:00',
                deadline: '2025-10-15'
            },
            {
                id: 18,
                code: 'YJ-2025-018',
                title: 'IT系统安全漏洞',
                type: 'it',
                typeName: 'IT治理',
                risk: 'high',
                status: 'processing',
                statusName: '处理中',
                department: '信息中心',
                count: '12个漏洞',
                source: '安全扫描',
                rule: '系统安全检测',
                threshold: '高危漏洞≥5个',
                ruleDescription: '定期扫描系统安全漏洞，发现高危漏洞及时预警',
                description: '教务系统安全扫描发现12个安全漏洞，其中高危漏洞5个，可能导致学生信息泄露风险。',
                time: '2025-10-11 15:45:00',
                createdAt: '2025-10-11 15:45:00',
                deadline: '2025-10-14',
                handler: '技术主管',
                assignedTo: '技术主管'
            },
            {
                id: 19,
                title: '社保缴纳基数异常',
                type: 'salary',
                typeName: '薪酬社保',
                risk: 'medium',
                status: 'completed',
                statusName: '已完成',
                department: '人事处',
                count: '8人',
                source: '审计发现',
                description: '发现8名员工社保缴纳基数低于实际工资标准，存在合规风险。已要求人事处整改并补缴。',
                createdAt: '2025-10-10 10:00:00',
                completedAt: '2025-10-12 16:00:00'
            },
            {
                id: 20,
                code: 'YJ-2025-020',
                title: '基建采购串标嫌疑',
                type: 'infrastructure',
                typeName: '基建采购',
                risk: 'high',
                status: 'pending',
                statusName: '待处理',
                department: '基建处',
                amount: '1200万元',
                project: '图书馆改造工程',
                source: '纪检监督',
                rule: '串标围标检测',
                threshold: '投标文件相似度≥80%',
                ruleDescription: '通过技术手段检测投标文件相似度，发现串标围标行为',
                description: '图书馆改造工程招标中，3家投标单位的技术方案高度相似，相似度达85%，存在串标嫌疑。',
                time: '2025-10-09 14:00:00',
                createdAt: '2025-10-09 14:00:00',
                deadline: '2025-10-12',
                handler: null
            }
        ]
    },

    /**
     * 初始化
     */
    init() {
        this.renderStatsCards();
        this.renderAlertList();
        this.bindEvents();
        
        // 检查URL参数，如果有id参数则自动打开详情
        const urlParams = new URLSearchParams(window.location.search);
        const alertId = urlParams.get('id');
        if (alertId) {
            // 根据预警编号查找预警
            const alert = this.mockData.alerts.find(a => a.code === alertId || a.id == alertId);
            if (alert) {
                // 延迟打开详情，确保页面已完全加载
                setTimeout(() => {
                    this.viewAlertDetail(alert.id);
                }, 300);
            } else {
                Toast.warning(`未找到预警：${alertId}`);
            }
        }
    },

    /**
     * 渲染统计卡片
     */
    renderStatsCards() {
        const container = document.getElementById('stats-cards');
        if (!container) return;

        const html = this.mockData.stats.map(stat => `
            <div class="stat-card stat-card-${stat.color}" onclick="AlertCenter.filterByRisk('${stat.id}')">
                <div class="stat-icon">
                    <i class="fas ${stat.icon}"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">${stat.title}</div>
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-extra">实时监控</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    /**
     * 渲染预警列表
     */
    renderAlertList() {
        const container = document.getElementById('alert-list');
        if (!container) return;

        // 应用筛选
        let filteredAlerts = this.applyFiltersToData();

        // 分页
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const paginatedAlerts = filteredAlerts.slice(start, end);

        if (paginatedAlerts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>暂无预警数据</p>
                </div>
            `;
            return;
        }

        const html = paginatedAlerts.map(alert => this.renderAlertCard(alert)).join('');
        container.innerHTML = html;

        // 渲染分页
        this.renderPagination(filteredAlerts.length);
    },

    /**
     * 渲染预警卡片
     */
    renderAlertCard(alert) {
        const riskText = this.getRiskText(alert.risk);
        const riskIcon = this.getRiskIcon(alert.risk);
        
        // 构建关键信息
        let keyInfo = '';
        if (alert.person) {
            keyInfo += `
                <div class="alert-info-item">
                    <span class="alert-info-label">涉及人员</span>
                    <span class="alert-info-value">${alert.person}</span>
                </div>
            `;
        }
        if (alert.amount) {
            keyInfo += `
                <div class="alert-info-item">
                    <span class="alert-info-label">涉及金额</span>
                    <span class="alert-info-value highlight">${alert.amount}</span>
                </div>
            `;
        }
        if (alert.percentage) {
            keyInfo += `
                <div class="alert-info-item">
                    <span class="alert-info-label">执行进度</span>
                    <span class="alert-info-value highlight">${alert.percentage}</span>
                </div>
            `;
        }
        if (alert.count) {
            keyInfo += `
                <div class="alert-info-item">
                    <span class="alert-info-label">异常数量</span>
                    <span class="alert-info-value">${alert.count}</span>
                </div>
            `;
        }
        
        // 补充来源和责任单位信息
        keyInfo += `
            <div class="alert-info-item">
                <span class="alert-info-label">预警来源</span>
                <span class="alert-info-value">${alert.source}</span>
            </div>
            <div class="alert-info-item">
                <span class="alert-info-label">责任单位</span>
                <span class="alert-info-value">${alert.department}</span>
            </div>
        `;

        return `
            <div class="alert-card ${alert.risk}" onclick="AlertCenter.viewAlertDetail('${alert.id}')">
                <div class="alert-card-header">
                    <div class="alert-card-meta">
                        <span class="alert-risk-badge ${alert.risk}">
                            <i class="fas ${riskIcon}"></i>
                            ${riskText}
                        </span>
                        <input 
                            type="checkbox" 
                            class="alert-checkbox" 
                            data-id="${alert.id}"
                            onclick="event.stopPropagation(); AlertCenter.toggleAlertSelection('${alert.id}')"
                        >
                    </div>
                    <h3 class="alert-title">${alert.title}</h3>
                    <span class="alert-type">
                        <i class="fas fa-tag"></i>
                        ${alert.typeName}
                    </span>
                </div>
                <div class="alert-card-body">
                    <div class="alert-info-grid">
                        ${keyInfo}
                    </div>
                    <p class="alert-description">${alert.description}</p>
                </div>
                <div class="alert-card-footer">
                    <div class="alert-time">
                        <i class="fas fa-clock"></i>
                        <span>${Utils.formatDate(alert.createdAt, 'YYYY-MM-DD HH:mm')}</span>
                    </div>
                    <div class="alert-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-sm btn-primary" onclick="AlertCenter.viewAlertDetail('${alert.id}')">
                            <i class="fas fa-eye"></i>
                            查看
                        </button>
                        ${alert.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="AlertCenter.createClueFromAlert('${alert.id}')">
                                <i class="fas fa-lightbulb"></i>
                                生成线索
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="AlertCenter.assignAlert('${alert.id}')">
                                <i class="fas fa-share"></i>
                                分发
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="AlertCenter.ignoreAlert('${alert.id}')">
                                <i class="fas fa-eye-slash"></i>
                                忽略
                            </button>
                        ` : `
                            <span class="status-badge ${alert.status}">${alert.statusName}</span>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 应用筛选条件到数据
     */
    applyFiltersToData() {
        let filtered = [...this.mockData.alerts];

        // 风险等级
        if (this.filters.risk) {
            filtered = filtered.filter(alert => alert.risk === this.filters.risk);
        }

        // 预警类型
        if (this.filters.type) {
            filtered = filtered.filter(alert => alert.type === this.filters.type);
        }

        // 处理状态
        if (this.filters.status) {
            filtered = filtered.filter(alert => alert.status === this.filters.status);
        }

        // 责任单位
        if (this.filters.department) {
            filtered = filtered.filter(alert => alert.department.includes(this.filters.department));
        }

        // 时间范围
        if (this.filters.time) {
            const now = new Date();
            filtered = filtered.filter(alert => {
                const alertDate = new Date(alert.createdAt);
                switch (this.filters.time) {
                    case 'today':
                        return alertDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return alertDate >= weekAgo;
                    case 'month':
                        return alertDate.getMonth() === now.getMonth() && 
                               alertDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        return filtered;
    },

    /**
     * 渲染分页
     */
    renderPagination(totalItems) {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Math.ceil(totalItems / this.pageSize);
        
        if (totalPages <= 1) {
            container.innerHTML = `<span class="pagination-info">共 ${totalItems} 条预警</span>`;
            return;
        }

        let html = `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="AlertCenter.changePage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `
                    <button class="${i === this.currentPage ? 'active' : ''}" onclick="AlertCenter.changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span>...</span>';
            }
        }

        html += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="AlertCenter.changePage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
            <span class="pagination-info">共 ${totalItems} 条预警</span>
        `;

        container.innerHTML = html;
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 责任部门选择变化时更新责任人列表
        const deptSelect = document.getElementById('assign-department');
        if (deptSelect) {
            deptSelect.addEventListener('change', (e) => {
                this.updatePersonList(e.target.value);
            });
        }

        // 处置时限单选按钮变化
        const deadlineRadios = document.querySelectorAll('input[name="deadline"]');
        deadlineRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const customDeadline = document.getElementById('custom-deadline');
                if (e.target.value === 'custom') {
                    customDeadline.style.display = 'block';
                } else {
                    customDeadline.style.display = 'none';
                }
            });
        });
    },

    /**
     * 获取风险等级文本
     */
    getRiskText(risk) {
        const map = {
            high: '高风险',
            medium: '中风险',
            low: '低风险'
        };
        return map[risk] || risk;
    },

    /**
     * 获取风险等级图标
     */
    getRiskIcon(risk) {
        const map = {
            high: 'fa-exclamation-circle',
            medium: 'fa-exclamation',
            low: 'fa-info-circle'
        };
        return map[risk] || 'fa-circle';
    },

    /**
     * 应用筛选
     */
    applyFilters() {
        this.filters.risk = document.getElementById('filter-risk').value;
        this.filters.type = document.getElementById('filter-type').value;
        this.filters.status = document.getElementById('filter-status').value;
        this.filters.department = document.getElementById('filter-department').value;
        this.filters.time = document.getElementById('filter-time').value;
        
        this.currentPage = 1;
        this.renderAlertList();
        Toast.success('筛选条件已应用');
    },

    /**
     * 重置筛选
     */
    resetFilters() {
        this.filters = {
            risk: '',
            type: '',
            status: '',
            department: '',
            time: ''
        };
        
        document.getElementById('filter-risk').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-department').value = '';
        document.getElementById('filter-time').value = '';
        
        this.currentPage = 1;
        this.renderAlertList();
        Toast.success('筛选条件已重置');
    },

    /**
     * 按风险等级筛选
     */
    filterByRisk(riskId) {
        const riskMap = {
            'total': '',
            'high': 'high',
            'medium': 'medium',
            'low': 'low',
            'pending': ''
        };
        
        this.filters.risk = riskMap[riskId] || '';
        if (riskId === 'pending') {
            this.filters.status = 'pending';
        } else {
            this.filters.status = '';
        }
        
        document.getElementById('filter-risk').value = this.filters.risk;
        document.getElementById('filter-status').value = this.filters.status;
        this.currentPage = 1;
        this.renderAlertList();
    },

    /**
     * 切换页码
     */
    changePage(page) {
        this.currentPage = page;
        this.renderAlertList();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * 刷新预警列表
     */
    refreshAlerts() {
        Toast.info('正在刷新预警列表...');
        setTimeout(() => {
            this.renderAlertList();
            Toast.success('刷新成功');
        }, 500);
    },

    /**
     * 查看预警详情
     */
    viewAlertDetail(id) {
        const alert = this.mockData.alerts.find(a => a.id === id);
        if (!alert) {
            Toast.error('预警不存在');
            return;
        }
        
        this.currentAlertId = id;
        
        // 填充基本信息
        document.getElementById('detail-code').textContent = alert.code;
        document.getElementById('detail-type').innerHTML = `<span class="source-badge"><i class="fas fa-tag"></i> ${alert.typeName}</span>`;
        document.getElementById('detail-risk').innerHTML = `<span class="alert-risk-badge ${alert.risk}"><i class="fas fa-circle"></i> ${this.getRiskText(alert.risk)}</span>`;
        document.getElementById('detail-status').innerHTML = `<span class="status-badge status-${alert.status}">${alert.statusName}</span>`;
        document.getElementById('detail-time').textContent = alert.time;
        document.getElementById('detail-handler').textContent = alert.handler || '未分配';
        document.getElementById('detail-title').innerHTML = `<strong>${alert.title}</strong>`;
        
        // 填充预警内容
        document.getElementById('detail-description').textContent = alert.description;
        
        // 填充涉及对象
        document.getElementById('detail-department').textContent = alert.department;
        document.getElementById('detail-person').textContent = alert.person;
        document.getElementById('detail-amount').innerHTML = `<span style="color: var(--color-danger); font-weight: 600;">${alert.amount}</span>`;
        document.getElementById('detail-project').textContent = alert.project || '-';
        
        // 填充规则信息
        document.getElementById('detail-rule').textContent = alert.rule;
        document.getElementById('detail-threshold').textContent = alert.threshold || '-';
        document.getElementById('detail-rule-desc').textContent = alert.ruleDescription || '系统自动检测到异常行为，触发预警机制';
        
        // 填充处理记录
        const timeline = document.getElementById('detail-timeline');
        const records = alert.records || [
            { time: alert.time, action: '预警触发', user: '系统', description: '系统自动检测到异常，生成预警', completed: true },
            { time: alert.time, action: '待处理', user: '-', description: '等待相关人员处理', completed: false }
        ];
        
        timeline.innerHTML = records.map(record => `
            <div class="timeline-item ${record.completed ? 'completed' : ''}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${record.action}</h4>
                    <div class="timeline-time">${record.time} · ${record.user}</div>
                    <div class="timeline-description">${record.description}</div>
                </div>
            </div>
        `).join('');
        
        // 显示模态框
        document.getElementById('alertDetailModal').classList.add('active');
    },

    /**
     * 关闭详情模态框
     */
    closeDetailModal() {
        document.getElementById('alertDetailModal').classList.remove('active');
        this.currentAlertId = null;
    },

    /**
     * 从详情页分发
     */
    assignFromDetail() {
        this.closeDetailModal();
        this.assignAlert(this.currentAlertId);
    },

    /**
     * 从详情页标记处理
     */
    handleFromDetail() {
        Modal.confirm({
            title: '标记处理',
            content: '确定要将此预警标记为已处理吗？',
            onConfirm: () => {
                const alert = this.mockData.alerts.find(a => a.id === this.currentAlertId);
                if (alert) {
                    alert.status = 'completed';
                    alert.statusName = '已处理';
                }
                Toast.success('预警已标记为处理完成');
                this.closeDetailModal();
                this.renderAlertList();
                this.renderStatsCards();
            }
        });
    },

    /**
     * 标注误报
     */
    markAsFalsePositive(alertId) {
        const alert = this.mockData.alerts.find(a => a.id === alertId);
        if (!alert) {
            Toast.error('预警不存在');
            return;
        }

        this.currentAlertId = alertId;
        this.openFalsePositiveModal();
    },

    /**
     * 打开误报标注弹窗
     */
    openFalsePositiveModal() {
        const modal = document.getElementById('false-positive-modal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('fp-form').reset();
        }
    },

    /**
     * 关闭误报标注弹窗
     */
    closeFalsePositiveModal() {
        const modal = document.getElementById('false-positive-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    /**
     * 提交误报标注
     */
    async submitFalsePositive() {
        const alert = this.mockData.alerts.find(a => a.id === this.currentAlertId);
        if (!alert) return;

        const reason = document.getElementById('fp-reason').value;
        const category = document.getElementById('fp-category').value;
        const description = document.getElementById('fp-description').value;

        if (!reason || !category || !description) {
            Toast.warning('请填写完整信息');
            return;
        }

        const feedback = {
            reason: reason,
            category: category,
            description: description,
            ruleId: alert.rule || 'RULE-001',
            ruleName: alert.rule || '未知规则',
            evidenceData: {
                alertCode: alert.code,
                department: alert.department,
                amount: alert.amount
            },
            tags: [alert.typeName]
        };

        const result = await ModelOptimizationService.markFalsePositive(this.currentAlertId, feedback);
        
        if (result.success) {
            Toast.success('误报标注成功，已记录为训练样本');
            this.closeFalsePositiveModal();
            
            // 更新预警状态为已忽略
            alert.status = 'ignored';
            alert.statusName = '已忽略（误报）';
            this.renderAlertList();
        } else {
            Toast.error(result.message);
        }
    },

    /**
     * 记录漏报
     */
    openFalseNegativeModal() {
        const modal = document.getElementById('false-negative-modal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('fn-form').reset();
        }
    },

    /**
     * 关闭漏报记录弹窗
     */
    closeFalseNegativeModal() {
        const modal = document.getElementById('false-negative-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    /**
     * 提交漏报记录
     */
    async submitFalseNegative() {
        const title = document.getElementById('fn-title').value;
        const description = document.getElementById('fn-description').value;
        const expectedRule = document.getElementById('fn-expected-rule').value;
        const missingReason = document.getElementById('fn-missing-reason').value;
        const priority = document.getElementById('fn-priority').value;

        if (!title || !description) {
            Toast.warning('请填写标题和描述');
            return;
        }

        const scenario = {
            title: title,
            description: description,
            expectedRule: expectedRule,
            missingReason: missingReason,
            businessContext: '监督预警',
            priority: priority
        };

        const result = await ModelOptimizationService.recordFalseNegative(scenario);
        
        if (result.success) {
            Toast.success('漏报记录成功，系统将分析规则缺失原因');
            this.closeFalseNegativeModal();
        } else {
            Toast.error(result.message);
        }
    },

    /**
     * 打开规则优化页面
     */
    openRuleOptimization() {
        window.location.href = 'model-optimization.html';
    },

    /**
     * 获取风险等级文本
     */
    getRiskText(risk) {
        const riskMap = {
            'high': '高风险',
            'medium': '中风险',
            'low': '低风险'
        };
        return riskMap[risk] || risk;
    },

    /**
     * 切换预警选中状态
     */
    toggleAlertSelection(id) {
        const index = this.selectedAlertIds.indexOf(id);
        if (index > -1) {
            this.selectedAlertIds.splice(index, 1);
        } else {
            this.selectedAlertIds.push(id);
        }
    },

    /**
     * 分发预警
     */
    assignAlert(id) {
        this.selectedAlertIds = [id];
        this.openAssignModal();
    },

    /**
     * 忽略预警
     */
    ignoreAlert(id) {
        Modal.confirm({
            title: '忽略预警',
            content: '确定要忽略这条预警吗？忽略后可在已忽略列表中查看。',
            onConfirm: () => {
                Toast.success('预警已忽略');
                this.renderAlertList();
            }
        });
    },

    /**
     * 批量分发
     */
    batchAssign() {
        const checked = document.querySelectorAll('.alert-checkbox:checked');
        if (checked.length === 0) {
            Toast.warning('请先选择要分发的预警');
            return;
        }
        
        this.selectedAlertIds = Array.from(checked).map(cb => {
            const id = cb.dataset.id;
            // 如果id是纯数字字符串，转换为数字，否则保持字符串
            return /^\d+$/.test(id) ? parseInt(id) : id;
        });
        this.openAssignModal();
    },

    /**
     * 批量忽略
     */
    batchIgnore() {
        const checked = document.querySelectorAll('.alert-checkbox:checked');
        if (checked.length === 0) {
            Toast.warning('请先选择要忽略的预警');
            return;
        }
        
        Modal.confirm({
            title: '批量忽略',
            content: `确定要忽略选中的 ${checked.length} 条预警吗？`,
            onConfirm: () => {
                Toast.success(`已忽略 ${checked.length} 条预警`);
                this.selectedAlertIds = [];
                this.renderAlertList();
            }
        });
    },

    /**
     * 批量导出
     */
    batchExport() {
        const checked = document.querySelectorAll('.alert-checkbox:checked');
        if (checked.length === 0) {
            Toast.warning('请先选择要导出的预警');
            return;
        }
        
        // 获取选中的预警ID
        const selectedIds = Array.from(checked).map(cb => {
            const id = cb.dataset.id;
            // 如果id是纯数字字符串，转换为数字，否则保持字符串
            return /^\d+$/.test(id) ? parseInt(id) : id;
        });
        const selectedAlerts = this.mockData.alerts.filter(alert => selectedIds.includes(alert.id));
        
        this.exportAlertsData(selectedAlerts);
        Toast.success(`已导出 ${checked.length} 条预警`);
    },

    /**
     * 导出预警
     */
    exportAlerts() {
        // 获取当前筛选的预警数据
        const filteredAlerts = this.getFilteredAlerts();
        
        if (filteredAlerts.length === 0) {
            Toast.warning('没有可导出的数据');
            return;
        }
        
        this.exportAlertsData(filteredAlerts);
        Toast.success(`已导出 ${filteredAlerts.length} 条预警`);
    },

    /**
     * 导出预警数据为CSV
     */
    exportAlertsData(alerts) {
        // 创建CSV内容
        const headers = ['预警编号', '预警标题', '预警类型', '风险等级', '涉及部门', '涉及人员', '涉及金额', '状态', '触发时间', '处理人'];
        const rows = alerts.map(alert => [
            alert.code,
            alert.title,
            alert.typeName,
            this.getRiskText(alert.risk),
            alert.department,
            alert.person,
            alert.amount,
            alert.statusName,
            alert.time,
            alert.handler || '未分配'
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // 创建下载链接
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `预警数据导出_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    },

    /**
     * 打开分发弹窗
     */
    openAssignModal() {
        const modal = document.getElementById('assign-modal');
        if (modal) {
            modal.classList.add('active');
            // 重置表单
            document.getElementById('assign-form').reset();
            document.getElementById('custom-deadline').style.display = 'none';
        }
    },

    /**
     * 关闭分发弹窗
     */
    closeAssignModal() {
        const modal = document.getElementById('assign-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    /**
     * 更新责任人列表
     */
    updatePersonList(department) {
        const personSelect = document.getElementById('assign-person');
        if (!personSelect) return;

        // 模拟不同部门的人员列表
        const personMap = {
            'dept1': ['张三', '李四', '王五'],
            'dept2': ['赵六', '孙七', '周八'],
            'dept3': ['吴九', '郑十', '钱一'],
            'dept4': ['陈二', '褚三', '卫四'],
            'dept5': ['蒋五', '沈六', '韩七'],
            'dept6': ['杨八', '朱九', '秦十'],
            'dept7': ['尤一', '许二', '何三'],
            'dept8': ['吕四', '施五', '张六']
        };

        const persons = personMap[department] || [];
        
        if (persons.length === 0) {
            personSelect.innerHTML = '<option value="">请先选择责任部门</option>';
            return;
        }

        personSelect.innerHTML = '<option value="">请选择责任人</option>' +
            persons.map(person => `<option value="${person}">${person}</option>`).join('');
    },

    /**
     * 提交分发
     */
    submitAssign() {
        const form = document.getElementById('assign-form');
        const department = document.getElementById('assign-department').value;
        const person = document.getElementById('assign-person').value;
        const priority = document.getElementById('assign-priority').value;
        const requirements = document.getElementById('assign-requirements').value;

        // 验证必填项
        if (!department) {
            Toast.warning('请选择责任部门');
            return;
        }
        if (!person) {
            Toast.warning('请选择责任人');
            return;
        }

        // 获取处置时限
        const deadlineRadio = document.querySelector('input[name="deadline"]:checked');
        let deadline = '';
        if (deadlineRadio.value === 'custom') {
            deadline = document.getElementById('custom-deadline').value;
            if (!deadline) {
                Toast.warning('请选择自定义时限');
                return;
            }
        } else {
            const days = parseInt(deadlineRadio.value);
            const date = new Date();
            date.setDate(date.getDate() + days);
            deadline = date.toISOString().split('T')[0];
        }

        // 提交分发
        Toast.success(`已成功分发 ${this.selectedAlertIds.length} 条预警给 ${person}`);
        this.closeAssignModal();
        this.selectedAlertIds = [];
        
        // 取消所有复选框选中状态
        document.querySelectorAll('.alert-checkbox:checked').forEach(cb => cb.checked = false);
        
        // 刷新列表
        this.renderAlertList();
    },

    /**
     * 从预警生成线索
     * @param {number} alertId - 预警ID
     */
    createClueFromAlert(alertId) {
        const alert = this.mockData.alerts.find(a => a.id === alertId);
        if (!alert) {
            Toast.error('预警不存在');
            return;
        }

        // 确认对话框
        Modal.show({
            title: '生成线索',
            content: `
                <div class="confirm-content">
                    <div class="confirm-icon" style="color: #10B981">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="confirm-message">
                        <p style="font-weight: 600; margin-bottom: 12px;">确定要将此预警转换为线索吗？</p>
                        <div style="margin-top: 16px; padding: 12px; background: #F3F4F6; border-radius: 8px; text-align: left;">
                            <div style="font-weight: 600; margin-bottom: 8px;">${alert.title}</div>
                            <div style="font-size: 13px; color: #6B7280;">
                                <div>风险等级：<span class="risk-badge ${alert.risk}">${this.getRiskText(alert.risk)}</span></div>
                                <div style="margin-top: 4px;">责任单位：${alert.department}</div>
                            </div>
                        </div>
                        <div style="margin-top: 16px; padding: 12px; background: #EFF6FF; border-left: 3px solid #3B82F6; border-radius: 4px;">
                            <div style="font-size: 13px; color: #1E40AF; line-height: 1.6;">
                                <div style="font-weight: 600; margin-bottom: 6px;"><i class="fas fa-info-circle"></i> 生成线索后：</div>
                                <div>• 线索将进入线索库，可进行深入调查和跟踪</div>
                                <div>• 支持分发工单、整改管理等完整流程</div>
                                <div>• 适用于需要正式立案调查的问题</div>
                            </div>
                        </div>
                        <div style="margin-top: 12px; padding: 10px; background: #FEF3C7; border-left: 3px solid #F59E0B; border-radius: 4px;">
                            <div style="font-size: 12px; color: #92400E;">
                                <strong>提示：</strong>如果只需快速处理，可使用"分发处置"功能直接指派责任人
                            </div>
                        </div>
                    </div>
                </div>
            `,
            size: 'md',
            confirmText: '确认生成',
            cancelText: '取消',
            onConfirm: () => {
                // 模拟生成线索
                const clueCode = `XS-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
                
                // 显示成功提示
                Toast.success(`线索已生成！线索编号：${clueCode}`);
                
                // 更新预警状态
                alert.status = 'processing';
                alert.statusName = '处理中';
                
                // 刷新列表
                this.renderAlertList();
                
                // 关闭详情模态框（如果打开）
                this.closeDetailModal();
                
                // 询问是否跳转到线索详情
                setTimeout(() => {
                    Modal.show({
                        title: '操作成功',
                        content: `
                            <div class="confirm-content">
                                <div class="confirm-icon" style="color: #10B981">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="confirm-message">
                                    <p>线索已成功生成！</p>
                                    <p style="margin-top: 8px; font-size: 14px; color: #6B7280;">
                                        线索编号：<strong>${clueCode}</strong>
                                    </p>
                                    <p style="margin-top: 12px; font-size: 13px; color: #6B7280;">
                                        是否立即跳转到线索库查看？
                                    </p>
                                </div>
                            </div>
                        `,
                        size: 'sm',
                        confirmText: '立即查看',
                        cancelText: '稍后查看',
                        onConfirm: () => {
                            window.location.href = 'clue-library.html';
                        }
                    });
                }, 500);
            }
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    AlertCenter.init();
});
