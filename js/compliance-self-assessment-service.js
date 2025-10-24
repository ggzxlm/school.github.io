/**
 * 等保合规自查服务
 * Compliance Self-Assessment Service
 */

class ComplianceSelfAssessmentService {
    constructor() {
        this.assessments = [];
        this.checkItems = this.initializeCheckItems();
        this.assessmentHistory = [];
        this.reminders = [];
        this.init();
    }

    init() {
        this.loadAssessments();
        this.loadHistory();
        this.loadReminders();
    }

    /**
     * 初始化等保三级自查清单
     */
    initializeCheckItems() {
        return [
            // 安全物理环境
            {
                id: 'PE-01',
                category: '安全物理环境',
                name: '物理位置选择',
                description: '机房应选择在具有防震、防风和防雨等能力的建筑内',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-02',
                category: '安全物理环境',
                name: '物理访问控制',
                description: '机房出入口应配置电子门禁系统，控制、鉴别和记录进入的人员',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-03',
                category: '安全物理环境',
                name: '防盗窃和防破坏',
                description: '应设置机房防盗报警系统或设置有专人值守的视频监控系统',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-04',
                category: '安全物理环境',
                name: '防雷击',
                description: '应设置防雷保安器，建筑物应设置避雷装置',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-05',
                category: '安全物理环境',
                name: '防火',
                description: '机房应设置火灾自动消防系统，能够自动检测火情、自动报警，并自动灭火',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-06',
                category: '安全物理环境',
                name: '防水和防潮',
                description: '应采取措施防止雨水通过机房窗户、屋顶和墙壁渗透',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-07',
                category: '安全物理环境',
                name: '防静电',
                description: '应采用防静电地板或地面并采用必要的接地防静电措施',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-08',
                category: '安全物理环境',
                name: '温湿度控制',
                description: '应设置温湿度自动调节设施，使机房温湿度的变化在设备运行所允许的范围之内',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-09',
                category: '安全物理环境',
                name: '电力供应',
                description: '应在机房供电线路上配置稳压器和过电压防护设备',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'PE-10',
                category: '安全物理环境',
                name: '电磁防护',
                description: '应采用接地方式防止外界电磁干扰和设备寄生耦合干扰',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全通信网络
            {
                id: 'CN-01',
                category: '安全通信网络',
                name: '网络架构',
                description: '应保证网络设备的业务处理能力满足业务高峰期需要',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CN-02',
                category: '安全通信网络',
                name: '通信传输',
                description: '应采用校验技术或密码技术保证通信过程中数据的完整性',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CN-03',
                category: '安全通信网络',
                name: '可信验证',
                description: '可基于可信根对通信设备的系统引导程序、系统程序等进行可信验证',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全区域边界
            {
                id: 'ZB-01',
                category: '安全区域边界',
                name: '边界防护',
                description: '应保证跨越边界的访问和数据流通过边界设备提供的受控接口进行通信',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'ZB-02',
                category: '安全区域边界',
                name: '访问控制',
                description: '应能根据会话状态信息为数据流提供明确的允许/拒绝访问的能力',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'ZB-03',
                category: '安全区域边界',
                name: '入侵防范',
                description: '应在关键网络节点处检测、防止或限制从外部发起的网络攻击行为',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'ZB-04',
                category: '安全区域边界',
                name: '恶意代码和垃圾邮件防范',
                description: '应在关键网络节点处对恶意代码进行检测和清除',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'ZB-05',
                category: '安全区域边界',
                name: '安全审计',
                description: '应在网络边界、重要网络节点进行安全审计',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'ZB-06',
                category: '安全区域边界',
                name: '可信验证',
                description: '可基于可信根对边界设备的系统引导程序、系统程序等进行可信验证',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全计算环境
            {
                id: 'CE-01',
                category: '安全计算环境',
                name: '身份鉴别',
                description: '应对登录的用户进行身份标识和鉴别，身份标识具有唯一性',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-02',
                category: '安全计算环境',
                name: '访问控制',
                description: '应启用访问控制功能，依据安全策略控制用户对资源的访问',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-03',
                category: '安全计算环境',
                name: '安全审计',
                description: '应启用安全审计功能，审计覆盖到每个用户',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-04',
                category: '安全计算环境',
                name: '入侵防范',
                description: '应遵循最小安装的原则，仅安装需要的组件和应用程序',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-05',
                category: '安全计算环境',
                name: '恶意代码防范',
                description: '应安装防恶意代码软件或配置具有相应功能的软件',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-06',
                category: '安全计算环境',
                name: '可信验证',
                description: '可基于可信根对计算设备的系统引导程序、系统程序等进行可信验证',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-07',
                category: '安全计算环境',
                name: '数据完整性',
                description: '应采用校验技术或密码技术保证重要数据在传输过程中的完整性',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-08',
                category: '安全计算环境',
                name: '数据保密性',
                description: '应采用密码技术保证重要数据在传输过程中的保密性',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-09',
                category: '安全计算环境',
                name: '数据备份恢复',
                description: '应提供重要数据的本地数据备份与恢复功能',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'CE-10',
                category: '安全计算环境',
                name: '剩余信息保护',
                description: '应保证鉴别信息所在的存储空间被释放或再分配给其他用户前得到完全清除',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全管理中心
            {
                id: 'MC-01',
                category: '安全管理中心',
                name: '系统管理',
                description: '应对系统管理员进行身份鉴别，只允许其通过特定的命令或操作界面进行系统管理操作',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MC-02',
                category: '安全管理中心',
                name: '审计管理',
                description: '应对审计记录进行保护，定期备份，避免受到未预期的删除、修改或覆盖等',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MC-03',
                category: '安全管理中心',
                name: '安全管理',
                description: '应对系统中的安全策略、安全配置等进行统一管理',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MC-04',
                category: '安全管理中心',
                name: '集中管控',
                description: '应能对分散在各个设备上的审计数据进行收集汇总和集中分析',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全管理制度
            {
                id: 'MP-01',
                category: '安全管理制度',
                name: '安全策略',
                description: '应制定信息安全工作的总体方针和安全策略',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MP-02',
                category: '安全管理制度',
                name: '管理制度',
                description: '应制定信息安全管理制度，包括安全管理制度、岗位安全管理制度等',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MP-03',
                category: '安全管理制度',
                name: '制度发布和更新',
                description: '应将安全管理制度以某种方式发布到相关人员，并定期进行审定和修订',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全管理机构
            {
                id: 'MO-01',
                category: '安全管理机构',
                name: '岗位设置',
                description: '应设立信息安全管理工作的职能部门，设立安全主管、安全管理各个方面的负责人岗位',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MO-02',
                category: '安全管理机构',
                name: '人员配备',
                description: '应配备一定数量的系统管理员、审计管理员和安全管理员等',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MO-03',
                category: '安全管理机构',
                name: '授权和审批',
                description: '应根据各个部门和岗位的职责明确授权审批事项、审批部门和批准人等',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MO-04',
                category: '安全管理机构',
                name: '沟通和合作',
                description: '应加强各类管理人员之间、组织内部机构之间以及信息安全职能部门内部的合作与沟通',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MO-05',
                category: '安全管理机构',
                name: '审核和检查',
                description: '应定期进行常规安全检查，检查内容包括系统日常运行、系统漏洞和数据备份等情况',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全管理人员
            {
                id: 'MH-01',
                category: '安全管理人员',
                name: '人员录用',
                description: '应指定或授权专门的部门或人员负责人员录用',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MH-02',
                category: '安全管理人员',
                name: '人员离岗',
                description: '应及时终止离岗人员的所有访问权限，取回各种身份证件、钥匙、徽章等以及机构提供的软硬件设备',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MH-03',
                category: '安全管理人员',
                name: '安全意识教育和培训',
                description: '应对各类人员进行安全意识教育和岗位技能培训',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MH-04',
                category: '安全管理人员',
                name: '外部人员访问管理',
                description: '应在外部人员物理访问受控区域前先提出书面申请，批准后由专人全程陪同',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全建设管理
            {
                id: 'MB-01',
                category: '安全建设管理',
                name: '定级和备案',
                description: '应以书面的形式说明保护对象的安全保护等级及确定等级的方法和理由',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MB-02',
                category: '安全建设管理',
                name: '安全方案设计',
                description: '应根据安全保护等级选择基本安全措施，依据风险分析的结果补充和调整安全措施',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MB-03',
                category: '安全建设管理',
                name: '产品采购和使用',
                description: '应确保安全产品采购和使用符合国家的有关规定',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MB-04',
                category: '安全建设管理',
                name: '自行软件开发',
                description: '应将开发环境与实际运行环境物理分开，测试数据和测试结果受到控制',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MB-05',
                category: '安全建设管理',
                name: '工程实施',
                description: '应指定或授权专门的部门或人员负责工程实施过程的管理',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MB-06',
                category: '安全建设管理',
                name: '测试验收',
                description: '应制定测试验收方案，并在测试验收前根据测试验收方案进行测试',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MB-07',
                category: '安全建设管理',
                name: '系统交付',
                description: '应制定系统交付清单，并根据交付清单对所交接的设备、软件和文档等进行清点',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MB-08',
                category: '安全建设管理',
                name: '等级测评',
                description: '应定期进行等级测评，发现不符合相应等级保护标准要求的及时整改',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MB-09',
                category: '安全建设管理',
                name: '服务供应商管理',
                description: '应确保服务供应商的选择符合国家的有关规定',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            // 安全运维管理
            {
                id: 'MR-01',
                category: '安全运维管理',
                name: '环境管理',
                description: '应指定专门的部门或人员定期对机房供配电、空调、温湿度控制等设施进行维护管理',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-02',
                category: '安全运维管理',
                name: '资产管理',
                description: '应编制并保存与信息系统相关的资产清单，包括资产责任部门、重要程度和所处位置等内容',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-03',
                category: '安全运维管理',
                name: '介质管理',
                description: '应将介质存放在安全的环境中，对各类介质进行控制和保护',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-04',
                category: '安全运维管理',
                name: '设备维护管理',
                description: '应对信息系统相关的各种设备（包括备份和冗余设备）、线路等指定专门的部门或人员定期进行维护管理',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-05',
                category: '安全运维管理',
                name: '漏洞和风险管理',
                description: '应采取必要的措施识别安全漏洞和隐患，对发现的安全漏洞和隐患及时进行修补或评估可能的影响后进行修补',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-06',
                category: '安全运维管理',
                name: '网络和系统安全管理',
                description: '应划分不同的管理员角色进行网络和系统的运维管理，明确各个角色的责任和权限',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-07',
                category: '安全运维管理',
                name: '恶意代码防范管理',
                description: '应提高所有用户的防恶意代码意识，告知及时升级防恶意代码软件',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-08',
                category: '安全运维管理',
                name: '配置管理',
                description: '应记录和保存基本配置信息，包括网络拓扑结构、各个设备安装的软件组件等',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-09',
                category: '安全运维管理',
                name: '密码管理',
                description: '应使用国家密码管理主管部门认可的密码技术和产品',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-10',
                category: '安全运维管理',
                name: '变更管理',
                description: '应明确变更需求，变更前根据变更需求制定变更方案',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-11',
                category: '安全运维管理',
                name: '备份与恢复管理',
                description: '应识别需要定期备份的重要业务信息、系统数据及软件系统等',
                checkType: 'AUTO',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-12',
                category: '安全运维管理',
                name: '安全事件处置',
                description: '应及时向安全管理部门报告所发现的安全弱点和可疑事件',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            },
            {
                id: 'MR-13',
                category: '安全运维管理',
                name: '应急预案管理',
                description: '应制定重要事件的应急预案，包括应急处理流程、系统恢复流程等内容',
                checkType: 'MANUAL',
                level: 'LEVEL3',
                status: 'PENDING'
            }
        ];
    }

    /**
     * 创建自查评估
     */
    createAssessment(assessmentData) {
        const assessment = {
            id: 'ASSESS-' + Date.now(),
            name: assessmentData.name || '等保三级自查',
            description: assessmentData.description || '',
            level: assessmentData.level || 'LEVEL3',
            assessor: assessmentData.assessor || '系统管理员',
            startDate: assessmentData.startDate || new Date().toISOString().split('T')[0],
            endDate: assessmentData.endDate || null,
            status: 'IN_PROGRESS',
            checkItems: JSON.parse(JSON.stringify(this.checkItems)),
            overallScore: 0,
            passRate: 0,
            findings: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.assessments.push(assessment);
        this.saveAssessments();
        return assessment;
    }

    /**
     * 执行自动化检查
     */
    async executeAutoCheck(assessmentId) {
        const assessment = this.assessments.find(a => a.id === assessmentId);
        if (!assessment) {
            throw new Error('评估不存在');
        }

        const autoCheckItems = assessment.checkItems.filter(item => item.checkType === 'AUTO');
        const results = [];

        for (const item of autoCheckItems) {
            const result = await this.performAutoCheck(item);
            item.status = result.passed ? 'PASS' : 'FAIL';
            item.checkResult = result.message;
            item.checkTime = new Date().toISOString();
            item.evidence = result.evidence;
            
            if (!result.passed) {
                assessment.findings.push({
                    id: 'FIND-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    itemId: item.id,
                    itemName: item.name,
                    category: item.category,
                    severity: this.calculateSeverity(item),
                    description: result.message,
                    recommendation: result.recommendation,
                    status: 'OPEN',
                    createdAt: new Date().toISOString()
                });
            }
            
            results.push({
                itemId: item.id,
                itemName: item.name,
                passed: result.passed,
                message: result.message
            });
        }

        this.updateAssessmentScore(assessment);
        this.saveAssessments();
        
        return {
            assessmentId,
            totalChecked: autoCheckItems.length,
            passed: results.filter(r => r.passed).length,
            failed: results.filter(r => !r.passed).length,
            results
        };
    }

    /**
     * 执行单项自动检查
     */
    async performAutoCheck(item) {
        // 模拟自动化检查逻辑
        const checks = {
            'CN-01': () => this.checkNetworkCapacity(),
            'CN-02': () => this.checkDataIntegrity(),
            'CN-03': () => this.checkTrustedVerification(),
            'ZB-01': () => this.checkBoundaryProtection(),
            'ZB-02': () => this.checkAccessControl(),
            'ZB-03': () => this.checkIntrusionPrevention(),
            'ZB-04': () => this.checkMalwareProtection(),
            'ZB-05': () => this.checkSecurityAudit(),
            'ZB-06': () => this.checkBoundaryTrustedVerification(),
            'CE-01': () => this.checkIdentityAuthentication(),
            'CE-02': () => this.checkAccessControlSystem(),
            'CE-03': () => this.checkAuditFunction(),
            'CE-04': () => this.checkMinimalInstallation(),
            'CE-05': () => this.checkAntiMalware(),
            'CE-06': () => this.checkComputeTrustedVerification(),
            'CE-07': () => this.checkDataIntegrityProtection(),
            'CE-08': () => this.checkDataConfidentiality(),
            'CE-09': () => this.checkDataBackup(),
            'CE-10': () => this.checkResidualInfoProtection(),
            'MC-01': () => this.checkSystemManagement(),
            'MC-02': () => this.checkAuditManagement(),
            'MC-03': () => this.checkSecurityManagement(),
            'MC-04': () => this.checkCentralizedControl(),
            'MR-05': () => this.checkVulnerabilityManagement(),
            'MR-08': () => this.checkConfigurationManagement(),
            'MR-11': () => this.checkBackupManagement()
        };

        const checkFunction = checks[item.id];
        if (checkFunction) {
            return await checkFunction();
        }

        // 默认返回需要人工检查
        return {
            passed: false,
            message: '需要人工检查',
            recommendation: '请根据检查项要求进行人工核查',
            evidence: []
        };
    }

    // 具体检查方法实现
    checkNetworkCapacity() {
        // 检查网络设备处理能力
        const cpuUsage = Math.random() * 100;
        const passed = cpuUsage < 80;
        return {
            passed,
            message: passed ? '网络设备处理能力充足' : `网络设备CPU使用率过高: ${cpuUsage.toFixed(2)}%`,
            recommendation: passed ? '' : '建议扩容网络设备或优化网络架构',
            evidence: [{ type: 'metric', name: 'CPU使用率', value: cpuUsage.toFixed(2) + '%' }]
        };
    }

    checkDataIntegrity() {
        // 检查数据完整性保护
        const hasIntegrityCheck = true; // 模拟检查结果
        return {
            passed: hasIntegrityCheck,
            message: hasIntegrityCheck ? '已启用数据完整性校验' : '未启用数据完整性校验',
            recommendation: hasIntegrityCheck ? '' : '建议启用HTTPS和数据签名机制',
            evidence: [{ type: 'config', name: 'HTTPS', value: 'enabled' }]
        };
    }

    checkTrustedVerification() {
        // 检查可信验证
        const hasTrustedBoot = false; // 模拟检查结果
        return {
            passed: hasTrustedBoot,
            message: hasTrustedBoot ? '已配置可信验证' : '未配置可信验证',
            recommendation: hasTrustedBoot ? '' : '建议配置可信根和系统引导程序验证',
            evidence: []
        };
    }

    checkBoundaryProtection() {
        // 检查边界防护
        const hasFirewall = true;
        return {
            passed: hasFirewall,
            message: hasFirewall ? '已部署边界防护设备' : '未部署边界防护设备',
            recommendation: hasFirewall ? '' : '建议部署防火墙或网关设备',
            evidence: [{ type: 'device', name: '防火墙', value: 'active' }]
        };
    }

    checkAccessControl() {
        // 检查访问控制
        const hasAccessControl = true;
        return {
            passed: hasAccessControl,
            message: hasAccessControl ? '已配置访问控制策略' : '未配置访问控制策略',
            recommendation: hasAccessControl ? '' : '建议配置基于角色的访问控制',
            evidence: [{ type: 'policy', name: '访问控制', value: 'enabled' }]
        };
    }

    checkIntrusionPrevention() {
        // 检查入侵防范
        const hasIPS = true;
        return {
            passed: hasIPS,
            message: hasIPS ? '已部署入侵防范系统' : '未部署入侵防范系统',
            recommendation: hasIPS ? '' : '建议部署IPS/IDS系统',
            evidence: [{ type: 'system', name: 'IPS', value: 'running' }]
        };
    }

    checkMalwareProtection() {
        // 检查恶意代码防范
        const hasAntivirus = true;
        return {
            passed: hasAntivirus,
            message: hasAntivirus ? '已部署恶意代码防护' : '未部署恶意代码防护',
            recommendation: hasAntivirus ? '' : '建议部署防病毒软件和邮件过滤系统',
            evidence: [{ type: 'software', name: '防病毒', value: 'installed' }]
        };
    }

    checkSecurityAudit() {
        // 检查安全审计
        const hasAudit = true;
        return {
            passed: hasAudit,
            message: hasAudit ? '已启用安全审计功能' : '未启用安全审计功能',
            recommendation: hasAudit ? '' : '建议启用日志审计和行为分析',
            evidence: [{ type: 'feature', name: '审计日志', value: 'enabled' }]
        };
    }

    checkBoundaryTrustedVerification() {
        return this.checkTrustedVerification();
    }

    checkIdentityAuthentication() {
        // 检查身份鉴别
        const hasAuth = true;
        return {
            passed: hasAuth,
            message: hasAuth ? '已实现身份鉴别功能' : '未实现身份鉴别功能',
            recommendation: hasAuth ? '' : '建议实现用户名密码+双因素认证',
            evidence: [{ type: 'auth', name: '认证方式', value: 'username+password' }]
        };
    }

    checkAccessControlSystem() {
        return this.checkAccessControl();
    }

    checkAuditFunction() {
        return this.checkSecurityAudit();
    }

    checkMinimalInstallation() {
        // 检查最小化安装
        const isMinimal = true;
        return {
            passed: isMinimal,
            message: isMinimal ? '遵循最小化安装原则' : '存在不必要的组件',
            recommendation: isMinimal ? '' : '建议移除不必要的服务和组件',
            evidence: []
        };
    }

    checkAntiMalware() {
        return this.checkMalwareProtection();
    }

    checkComputeTrustedVerification() {
        return this.checkTrustedVerification();
    }

    checkDataIntegrityProtection() {
        return this.checkDataIntegrity();
    }

    checkDataConfidentiality() {
        // 检查数据保密性
        const hasEncryption = true;
        return {
            passed: hasEncryption,
            message: hasEncryption ? '已启用数据加密' : '未启用数据加密',
            recommendation: hasEncryption ? '' : '建议对敏感数据进行加密存储和传输',
            evidence: [{ type: 'encryption', name: 'TLS', value: 'enabled' }]
        };
    }

    checkDataBackup() {
        // 检查数据备份
        const hasBackup = true;
        return {
            passed: hasBackup,
            message: hasBackup ? '已配置数据备份' : '未配置数据备份',
            recommendation: hasBackup ? '' : '建议配置定期自动备份',
            evidence: [{ type: 'backup', name: '备份策略', value: 'daily' }]
        };
    }

    checkResidualInfoProtection() {
        // 检查剩余信息保护
        const hasProtection = true;
        return {
            passed: hasProtection,
            message: hasProtection ? '已实现剩余信息保护' : '未实现剩余信息保护',
            recommendation: hasProtection ? '' : '建议实现数据清除和覆盖机制',
            evidence: []
        };
    }

    checkSystemManagement() {
        // 检查系统管理
        const hasManagement = true;
        return {
            passed: hasManagement,
            message: hasManagement ? '已实现系统管理功能' : '未实现系统管理功能',
            recommendation: hasManagement ? '' : '建议实现管理员权限分离和操作审计',
            evidence: [{ type: 'management', name: '管理员', value: 'configured' }]
        };
    }

    checkAuditManagement() {
        // 检查审计管理
        const hasAuditMgmt = true;
        return {
            passed: hasAuditMgmt,
            message: hasAuditMgmt ? '已实现审计管理' : '未实现审计管理',
            recommendation: hasAuditMgmt ? '' : '建议实现审计日志保护和备份',
            evidence: [{ type: 'audit', name: '审计日志', value: 'protected' }]
        };
    }

    checkSecurityManagement() {
        // 检查安全管理
        const hasSecMgmt = true;
        return {
            passed: hasSecMgmt,
            message: hasSecMgmt ? '已实现安全管理' : '未实现安全管理',
            recommendation: hasSecMgmt ? '' : '建议实现统一安全策略管理',
            evidence: [{ type: 'policy', name: '安全策略', value: 'configured' }]
        };
    }

    checkCentralizedControl() {
        // 检查集中管控
        const hasCentralized = true;
        return {
            passed: hasCentralized,
            message: hasCentralized ? '已实现集中管控' : '未实现集中管控',
            recommendation: hasCentralized ? '' : '建议部署集中日志和监控系统',
            evidence: [{ type: 'system', name: '集中管控', value: 'deployed' }]
        };
    }

    checkVulnerabilityManagement() {
        // 检查漏洞管理
        const hasVulnMgmt = true;
        return {
            passed: hasVulnMgmt,
            message: hasVulnMgmt ? '已实现漏洞管理' : '未实现漏洞管理',
            recommendation: hasVulnMgmt ? '' : '建议定期进行漏洞扫描和修复',
            evidence: [{ type: 'scan', name: '漏洞扫描', value: 'scheduled' }]
        };
    }

    checkConfigurationManagement() {
        // 检查配置管理
        const hasConfigMgmt = true;
        return {
            passed: hasConfigMgmt,
            message: hasConfigMgmt ? '已实现配置管理' : '未实现配置管理',
            recommendation: hasConfigMgmt ? '' : '建议记录和管理系统配置信息',
            evidence: [{ type: 'config', name: '配置管理', value: 'enabled' }]
        };
    }

    checkBackupManagement() {
        return this.checkDataBackup();
    }

    /**
     * 更新检查项状态
     */
    updateCheckItem(assessmentId, itemId, updateData) {
        const assessment = this.assessments.find(a => a.id === assessmentId);
        if (!assessment) {
            throw new Error('评估不存在');
        }

        const item = assessment.checkItems.find(i => i.id === itemId);
        if (!item) {
            throw new Error('检查项不存在');
        }

        Object.assign(item, updateData);
        item.checkTime = new Date().toISOString();

        // 如果是失败项,添加到发现问题列表
        if (updateData.status === 'FAIL' && !assessment.findings.find(f => f.itemId === itemId)) {
            assessment.findings.push({
                id: 'FIND-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                itemId: item.id,
                itemName: item.name,
                category: item.category,
                severity: this.calculateSeverity(item),
                description: updateData.checkResult || '不符合要求',
                recommendation: updateData.recommendation || '请按照标准要求进行整改',
                status: 'OPEN',
                createdAt: new Date().toISOString()
            });
        }

        this.updateAssessmentScore(assessment);
        this.saveAssessments();
        return item;
    }

    /**
     * 计算问题严重程度
     */
    calculateSeverity(item) {
        // 根据类别判断严重程度
        const highSeverityCategories = ['安全计算环境', '安全区域边界', '安全管理中心'];
        const mediumSeverityCategories = ['安全通信网络', '安全管理制度', '安全建设管理'];
        
        if (highSeverityCategories.includes(item.category)) {
            return 'HIGH';
        } else if (mediumSeverityCategories.includes(item.category)) {
            return 'MEDIUM';
        }
        return 'LOW';
    }

    /**
     * 更新评估得分
     */
    updateAssessmentScore(assessment) {
        const totalItems = assessment.checkItems.length;
        const checkedItems = assessment.checkItems.filter(i => i.status !== 'PENDING');
        const passedItems = assessment.checkItems.filter(i => i.status === 'PASS');

        assessment.passRate = totalItems > 0 ? (passedItems.length / totalItems * 100).toFixed(2) : 0;
        assessment.overallScore = assessment.passRate;
        assessment.updatedAt = new Date().toISOString();

        // 如果所有项都检查完成,更新状态
        if (checkedItems.length === totalItems) {
            assessment.status = 'COMPLETED';
            assessment.endDate = new Date().toISOString().split('T')[0];
        }
    }

    /**
     * 生成自查报告
     */
    generateReport(assessmentId) {
        const assessment = this.assessments.find(a => a.id === assessmentId);
        if (!assessment) {
            throw new Error('评估不存在');
        }

        const categorySummary = this.getCategorySummary(assessment);
        const findingsSummary = this.getFindingsSummary(assessment);

        const report = {
            id: 'REPORT-' + Date.now(),
            assessmentId: assessment.id,
            assessmentName: assessment.name,
            level: assessment.level,
            assessor: assessment.assessor,
            startDate: assessment.startDate,
            endDate: assessment.endDate || new Date().toISOString().split('T')[0],
            overallScore: assessment.overallScore,
            passRate: assessment.passRate,
            summary: {
                totalItems: assessment.checkItems.length,
                passedItems: assessment.checkItems.filter(i => i.status === 'PASS').length,
                failedItems: assessment.checkItems.filter(i => i.status === 'FAIL').length,
                pendingItems: assessment.checkItems.filter(i => i.status === 'PENDING').length,
                totalFindings: assessment.findings.length,
                highSeverityFindings: assessment.findings.filter(f => f.severity === 'HIGH').length,
                mediumSeverityFindings: assessment.findings.filter(f => f.severity === 'MEDIUM').length,
                lowSeverityFindings: assessment.findings.filter(f => f.severity === 'LOW').length
            },
            categorySummary,
            findingsSummary,
            recommendations: this.generateRecommendations(assessment),
            generatedAt: new Date().toISOString()
        };

        return report;
    }

    /**
     * 获取分类汇总
     */
    getCategorySummary(assessment) {
        const categories = {};
        
        assessment.checkItems.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = {
                    category: item.category,
                    total: 0,
                    passed: 0,
                    failed: 0,
                    pending: 0,
                    passRate: 0
                };
            }
            
            categories[item.category].total++;
            if (item.status === 'PASS') categories[item.category].passed++;
            if (item.status === 'FAIL') categories[item.category].failed++;
            if (item.status === 'PENDING') categories[item.category].pending++;
        });

        Object.values(categories).forEach(cat => {
            cat.passRate = cat.total > 0 ? (cat.passed / cat.total * 100).toFixed(2) : 0;
        });

        return Object.values(categories);
    }

    /**
     * 获取问题汇总
     */
    getFindingsSummary(assessment) {
        return assessment.findings.map(finding => ({
            id: finding.id,
            itemId: finding.itemId,
            itemName: finding.itemName,
            category: finding.category,
            severity: finding.severity,
            description: finding.description,
            recommendation: finding.recommendation,
            status: finding.status
        }));
    }

    /**
     * 生成整改建议
     */
    generateRecommendations(assessment) {
        const recommendations = [];
        
        // 按严重程度分组
        const highFindings = assessment.findings.filter(f => f.severity === 'HIGH' && f.status === 'OPEN');
        const mediumFindings = assessment.findings.filter(f => f.severity === 'MEDIUM' && f.status === 'OPEN');
        const lowFindings = assessment.findings.filter(f => f.severity === 'LOW' && f.status === 'OPEN');

        if (highFindings.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                title: '高风险问题整改',
                description: `发现${highFindings.length}个高风险问题,建议立即整改`,
                items: highFindings.map(f => f.itemName)
            });
        }

        if (mediumFindings.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                title: '中风险问题整改',
                description: `发现${mediumFindings.length}个中风险问题,建议在1个月内完成整改`,
                items: mediumFindings.map(f => f.itemName)
            });
        }

        if (lowFindings.length > 0) {
            recommendations.push({
                priority: 'LOW',
                title: '低风险问题整改',
                description: `发现${lowFindings.length}个低风险问题,建议在3个月内完成整改`,
                items: lowFindings.map(f => f.itemName)
            });
        }

        return recommendations;
    }

    /**
     * 获取评估列表
     */
    getAssessments(filter = {}) {
        let result = [...this.assessments];

        if (filter.status) {
            result = result.filter(a => a.status === filter.status);
        }

        if (filter.level) {
            result = result.filter(a => a.level === filter.level);
        }

        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    /**
     * 获取评估详情
     */
    getAssessment(assessmentId) {
        return this.assessments.find(a => a.id === assessmentId);
    }

    /**
     * 删除评估
     */
    deleteAssessment(assessmentId) {
        const index = this.assessments.findIndex(a => a.id === assessmentId);
        if (index > -1) {
            this.assessments.splice(index, 1);
            this.saveAssessments();
            return true;
        }
        return false;
    }

    /**
     * 保存评估数据
     */
    saveAssessments() {
        try {
            localStorage.setItem('compliance_assessments', JSON.stringify(this.assessments));
        } catch (error) {
            console.error('保存评估数据失败:', error);
        }
    }

    /**
     * 加载评估数据
     */
    loadAssessments() {
        try {
            const data = localStorage.getItem('compliance_assessments');
            if (data) {
                this.assessments = JSON.parse(data);
            }
        } catch (error) {
            console.error('加载评估数据失败:', error);
            this.assessments = [];
        }
    }

    /**
     * 加载历史记录
     */
    loadHistory() {
        try {
            const data = localStorage.getItem('compliance_assessment_history');
            if (data) {
                this.assessmentHistory = JSON.parse(data);
            }
        } catch (error) {
            console.error('加载历史记录失败:', error);
            this.assessmentHistory = [];
        }
    }

    /**
     * 保存历史记录
     */
    saveHistory() {
        try {
            localStorage.setItem('compliance_assessment_history', JSON.stringify(this.assessmentHistory));
        } catch (error) {
            console.error('保存历史记录失败:', error);
        }
    }

    /**
     * 添加历史记录
     */
    addHistory(assessmentId, action, details) {
        this.assessmentHistory.push({
            id: 'HIST-' + Date.now(),
            assessmentId,
            action,
            details,
            timestamp: new Date().toISOString()
        });
        this.saveHistory();
    }

    /**
     * 加载提醒配置
     */
    loadReminders() {
        try {
            const data = localStorage.getItem('compliance_reminders');
            if (data) {
                this.reminders = JSON.parse(data);
            }
        } catch (error) {
            console.error('加载提醒配置失败:', error);
            this.reminders = [];
        }
    }

    /**
     * 保存提醒配置
     */
    saveReminders() {
        try {
            localStorage.setItem('compliance_reminders', JSON.stringify(this.reminders));
        } catch (error) {
            console.error('保存提醒配置失败:', error);
        }
    }

    /**
     * 创建测评提醒
     */
    createReminder(reminderData) {
        const reminder = {
            id: 'REM-' + Date.now(),
            name: reminderData.name || '等保测评提醒',
            cycle: reminderData.cycle || 'YEARLY', // MONTHLY, QUARTERLY, YEARLY
            nextDate: reminderData.nextDate,
            notifyDays: reminderData.notifyDays || 30, // 提前多少天提醒
            notifyUsers: reminderData.notifyUsers || [],
            enabled: true,
            createdAt: new Date().toISOString()
        };

        this.reminders.push(reminder);
        this.saveReminders();
        return reminder;
    }

    /**
     * 更新提醒
     */
    updateReminder(reminderId, updateData) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (reminder) {
            Object.assign(reminder, updateData);
            this.saveReminders();
            return reminder;
        }
        return null;
    }

    /**
     * 删除提醒
     */
    deleteReminder(reminderId) {
        const index = this.reminders.findIndex(r => r.id === reminderId);
        if (index > -1) {
            this.reminders.splice(index, 1);
            this.saveReminders();
            return true;
        }
        return false;
    }

    /**
     * 获取提醒列表
     */
    getReminders() {
        return this.reminders;
    }

    /**
     * 检查待提醒事项
     */
    checkPendingReminders() {
        const today = new Date();
        const pendingReminders = [];

        this.reminders.forEach(reminder => {
            if (!reminder.enabled) return;

            const nextDate = new Date(reminder.nextDate);
            const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

            if (daysUntil <= reminder.notifyDays && daysUntil >= 0) {
                pendingReminders.push({
                    ...reminder,
                    daysUntil
                });
            }
        });

        return pendingReminders;
    }
}

// 导出服务实例
window.ComplianceSelfAssessmentService = ComplianceSelfAssessmentService;

/**
 * 测评报表生成服务扩展
 */
class ComplianceAssessmentReportService extends ComplianceSelfAssessmentService {
    constructor() {
        super();
    }

    /**
     * 生成测评报表
     */
    generateAssessmentReport(assessmentId) {
        const assessment = this.getAssessment(assessmentId);
        if (!assessment) {
            throw new Error('评估不存在');
        }

        const report = {
            id: 'ARPT-' + Date.now(),
            assessmentId,
            reportType: 'ASSESSMENT',
            title: `${assessment.name} - 测评报告`,
            generatedAt: new Date().toISOString(),
            sections: [
                this.generateExecutiveSummary(assessment),
                this.generateAccessLogSummary(),
                this.generateOperationLogSummary(),
                this.generateSecurityConfigSummary(),
                this.generateComplianceMatrix(assessment),
                this.generateFindingsDetail(assessment),
                this.generateRecommendations(assessment)
            ]
        };

        return report;
    }

    /**
     * 生成执行摘要
     */
    generateExecutiveSummary(assessment) {
        return {
            title: '执行摘要',
            content: {
                assessmentName: assessment.name,
                level: assessment.level,
                assessor: assessment.assessor,
                period: `${assessment.startDate} 至 ${assessment.endDate || '进行中'}`,
                overallScore: assessment.overallScore,
                passRate: assessment.passRate,
                status: assessment.status,
                summary: `本次等保${assessment.level}自查共检查${assessment.checkItems.length}项,` +
                        `通过${assessment.checkItems.filter(i => i.status === 'PASS').length}项,` +
                        `不通过${assessment.checkItems.filter(i => i.status === 'FAIL').length}项,` +
                        `待检查${assessment.checkItems.filter(i => i.status === 'PENDING').length}项。` +
                        `总体合规率为${assessment.passRate}%。`
            }
        };
    }

    /**
     * 汇总访问日志
     */
    generateAccessLogSummary() {
        // 模拟访问日志统计
        const logs = this.getAccessLogs();
        
        return {
            title: '访问日志汇总',
            content: {
                totalAccess: logs.total,
                successfulAccess: logs.successful,
                failedAccess: logs.failed,
                uniqueUsers: logs.uniqueUsers,
                topUsers: logs.topUsers,
                accessByHour: logs.byHour,
                accessByDay: logs.byDay,
                suspiciousAccess: logs.suspicious
            }
        };
    }

    /**
     * 获取访问日志统计
     */
    getAccessLogs() {
        // 模拟数据
        return {
            total: 15234,
            successful: 14892,
            failed: 342,
            uniqueUsers: 156,
            topUsers: [
                { username: 'admin', count: 1234 },
                { username: 'user001', count: 892 },
                { username: 'user002', count: 756 }
            ],
            byHour: this.generateHourlyData(),
            byDay: this.generateDailyData(),
            suspicious: [
                { time: '2024-01-15 03:24:15', user: 'unknown', ip: '192.168.1.100', action: '多次登录失败' },
                { time: '2024-01-16 22:45:32', user: 'user003', ip: '10.0.0.50', action: '异常时间访问' }
            ]
        };
    }

    /**
     * 汇总操作日志
     */
    generateOperationLogSummary() {
        const logs = this.getOperationLogs();
        
        return {
            title: '操作日志汇总',
            content: {
                totalOperations: logs.total,
                byType: logs.byType,
                byUser: logs.byUser,
                criticalOperations: logs.critical,
                failedOperations: logs.failed
            }
        };
    }

    /**
     * 获取操作日志统计
     */
    getOperationLogs() {
        return {
            total: 8765,
            byType: {
                'CREATE': 2345,
                'UPDATE': 3456,
                'DELETE': 234,
                'QUERY': 2730
            },
            byUser: [
                { username: 'admin', operations: 3456 },
                { username: 'user001', operations: 2345 },
                { username: 'user002', operations: 1234 }
            ],
            critical: [
                { time: '2024-01-15 10:30:00', user: 'admin', action: '删除用户', target: 'user005' },
                { time: '2024-01-16 14:20:00', user: 'admin', action: '修改权限', target: 'role_admin' }
            ],
            failed: [
                { time: '2024-01-15 11:45:00', user: 'user003', action: '删除数据', reason: '权限不足' },
                { time: '2024-01-16 16:30:00', user: 'user004', action: '导出数据', reason: '权限不足' }
            ]
        };
    }

    /**
     * 汇总安全配置信息
     */
    generateSecurityConfigSummary() {
        const config = this.getSecurityConfig();
        
        return {
            title: '安全配置汇总',
            content: {
                authentication: config.authentication,
                authorization: config.authorization,
                encryption: config.encryption,
                audit: config.audit,
                backup: config.backup,
                network: config.network,
                system: config.system
            }
        };
    }

    /**
     * 获取安全配置信息
     */
    getSecurityConfig() {
        return {
            authentication: {
                method: '用户名密码',
                passwordPolicy: {
                    minLength: 8,
                    complexity: '包含大小写字母、数字、特殊字符',
                    expireDays: 90,
                    historyCount: 5
                },
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                lockoutDuration: 30
            },
            authorization: {
                model: 'RBAC',
                roles: ['管理员', '审计员', '操作员', '查看员'],
                permissionGranularity: '功能级+数据级'
            },
            encryption: {
                dataAtRest: 'AES-256',
                dataInTransit: 'TLS 1.2+',
                sensitiveFields: ['身份证号', '手机号', '银行卡号']
            },
            audit: {
                enabled: true,
                logLevel: 'INFO',
                retention: 180,
                logTypes: ['访问日志', '操作日志', '安全日志', '系统日志']
            },
            backup: {
                frequency: 'Daily',
                retention: 30,
                location: '本地+异地',
                encryption: true
            },
            network: {
                firewall: 'Enabled',
                ips: 'Enabled',
                antivirus: 'Enabled',
                vpn: 'Available'
            },
            system: {
                os: 'Linux',
                patchLevel: 'Up-to-date',
                services: 'Minimal',
                monitoring: 'Enabled'
            }
        };
    }

    /**
     * 生成合规矩阵
     */
    generateComplianceMatrix(assessment) {
        const matrix = [];
        
        assessment.checkItems.forEach(item => {
            matrix.push({
                id: item.id,
                category: item.category,
                name: item.name,
                requirement: item.description,
                status: item.status,
                checkType: item.checkType,
                checkResult: item.checkResult || '',
                evidence: item.evidence || []
            });
        });

        return {
            title: '合规检查矩阵',
            content: {
                items: matrix,
                summary: this.getCategorySummary(assessment)
            }
        };
    }

    /**
     * 生成问题详情
     */
    generateFindingsDetail(assessment) {
        return {
            title: '发现问题详情',
            content: {
                findings: assessment.findings.map(finding => ({
                    id: finding.id,
                    itemId: finding.itemId,
                    itemName: finding.itemName,
                    category: finding.category,
                    severity: finding.severity,
                    description: finding.description,
                    recommendation: finding.recommendation,
                    status: finding.status,
                    createdAt: finding.createdAt
                })),
                statistics: {
                    total: assessment.findings.length,
                    high: assessment.findings.filter(f => f.severity === 'HIGH').length,
                    medium: assessment.findings.filter(f => f.severity === 'MEDIUM').length,
                    low: assessment.findings.filter(f => f.severity === 'LOW').length,
                    open: assessment.findings.filter(f => f.status === 'OPEN').length,
                    inProgress: assessment.findings.filter(f => f.status === 'IN_PROGRESS').length,
                    resolved: assessment.findings.filter(f => f.status === 'RESOLVED').length
                }
            }
        };
    }

    /**
     * 生成小时数据
     */
    generateHourlyData() {
        const data = [];
        for (let i = 0; i < 24; i++) {
            data.push({
                hour: i,
                count: Math.floor(Math.random() * 1000) + 100
            });
        }
        return data;
    }

    /**
     * 生成每日数据
     */
    generateDailyData() {
        const data = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                count: Math.floor(Math.random() * 5000) + 1000
            });
        }
        return data.reverse();
    }

    /**
     * 导出报表为PDF
     */
    exportToPDF(report) {
        // 模拟PDF导出
        console.log('导出PDF报表:', report.title);
        return {
            success: true,
            filename: `${report.title}_${Date.now()}.pdf`,
            size: '2.5MB'
        };
    }

    /**
     * 导出报表为Excel
     */
    exportToExcel(report) {
        // 模拟Excel导出
        console.log('导出Excel报表:', report.title);
        return {
            success: true,
            filename: `${report.title}_${Date.now()}.xlsx`,
            size: '1.2MB'
        };
    }

    /**
     * 导出报表为Word
     */
    exportToWord(report) {
        // 模拟Word导出
        console.log('导出Word报表:', report.title);
        return {
            success: true,
            filename: `${report.title}_${Date.now()}.docx`,
            size: '1.8MB'
        };
    }
}

// 导出报表服务实例
window.ComplianceAssessmentReportService = ComplianceAssessmentReportService;

/**
 * 问题整改管理服务扩展
 */
class ComplianceRectificationService extends ComplianceAssessmentReportService {
    constructor() {
        super();
        this.rectifications = [];
        this.loadRectifications();
    }

    /**
     * 从发现问题创建整改工单
     */
    createRectificationFromFinding(assessmentId, findingId) {
        const assessment = this.getAssessment(assessmentId);
        if (!assessment) {
            throw new Error('评估不存在');
        }

        const finding = assessment.findings.find(f => f.id === findingId);
        if (!finding) {
            throw new Error('问题不存在');
        }

        const rectification = {
            id: 'RECT-' + Date.now(),
            assessmentId,
            findingId,
            ticketNo: 'T' + Date.now(),
            title: `整改: ${finding.itemName}`,
            category: finding.category,
            severity: finding.severity,
            description: finding.description,
            recommendation: finding.recommendation,
            status: 'OPEN',
            assignedTo: null,
            assignedAt: null,
            dueDate: this.calculateDueDate(finding.severity),
            progress: 0,
            activities: [],
            attachments: [],
            createdBy: '系统',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.rectifications.push(rectification);
        this.saveRectifications();

        // 更新问题状态
        finding.rectificationId = rectification.id;
        finding.status = 'IN_PROGRESS';
        this.saveAssessments();

        // 添加活动记录
        this.addActivity(rectification.id, 'CREATE', '创建整改工单');

        return rectification;
    }

    /**
     * 计算截止日期
     */
    calculateDueDate(severity) {
        const today = new Date();
        let days = 90; // 默认90天

        switch (severity) {
            case 'HIGH':
                days = 30; // 高风险30天
                break;
            case 'MEDIUM':
                days = 60; // 中风险60天
                break;
            case 'LOW':
                days = 90; // 低风险90天
                break;
        }

        today.setDate(today.getDate() + days);
        return today.toISOString().split('T')[0];
    }

    /**
     * 分配整改工单
     */
    assignRectification(rectificationId, assignee) {
        const rectification = this.rectifications.find(r => r.id === rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        rectification.assignedTo = assignee;
        rectification.assignedAt = new Date().toISOString();
        rectification.status = 'ASSIGNED';
        rectification.updatedAt = new Date().toISOString();

        this.saveRectifications();
        this.addActivity(rectificationId, 'ASSIGN', `分配给 ${assignee}`);

        return rectification;
    }

    /**
     * 更新整改进度
     */
    updateProgress(rectificationId, progress, comment) {
        const rectification = this.rectifications.find(r => r.id === rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        rectification.progress = progress;
        rectification.updatedAt = new Date().toISOString();

        if (progress > 0 && rectification.status === 'ASSIGNED') {
            rectification.status = 'IN_PROGRESS';
        }

        this.saveRectifications();
        this.addActivity(rectificationId, 'UPDATE_PROGRESS', `更新进度至 ${progress}%: ${comment}`);

        return rectification;
    }

    /**
     * 提交整改完成
     */
    submitCompletion(rectificationId, completionData) {
        const rectification = this.rectifications.find(r => r.id === rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        rectification.status = 'PENDING_REVIEW';
        rectification.progress = 100;
        rectification.completionData = {
            completedBy: completionData.completedBy,
            completedAt: new Date().toISOString(),
            description: completionData.description,
            evidence: completionData.evidence || []
        };
        rectification.updatedAt = new Date().toISOString();

        this.saveRectifications();
        this.addActivity(rectificationId, 'SUBMIT', '提交整改完成,等待复核');

        return rectification;
    }

    /**
     * 添加附件
     */
    addAttachment(rectificationId, attachment) {
        const rectification = this.rectifications.find(r => r.id === rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        const file = {
            id: 'ATT-' + Date.now(),
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            url: attachment.url,
            uploadedBy: attachment.uploadedBy,
            uploadedAt: new Date().toISOString()
        };

        rectification.attachments.push(file);
        rectification.updatedAt = new Date().toISOString();

        this.saveRectifications();
        this.addActivity(rectificationId, 'ADD_ATTACHMENT', `上传附件: ${attachment.name}`);

        return file;
    }

    /**
     * 添加活动记录
     */
    addActivity(rectificationId, action, description) {
        const rectification = this.rectifications.find(r => r.id === rectificationId);
        if (!rectification) {
            return;
        }

        rectification.activities.push({
            id: 'ACT-' + Date.now(),
            action,
            description,
            timestamp: new Date().toISOString(),
            user: '当前用户'
        });

        this.saveRectifications();
    }

    /**
     * 获取整改工单列表
     */
    getRectifications(filter = {}) {
        let result = [...this.rectifications];

        if (filter.status) {
            result = result.filter(r => r.status === filter.status);
        }

        if (filter.severity) {
            result = result.filter(r => r.severity === filter.severity);
        }

        if (filter.assignedTo) {
            result = result.filter(r => r.assignedTo === filter.assignedTo);
        }

        if (filter.assessmentId) {
            result = result.filter(r => r.assessmentId === filter.assessmentId);
        }

        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    /**
     * 获取整改工单详情
     */
    getRectification(rectificationId) {
        return this.rectifications.find(r => r.id === rectificationId);
    }

    /**
     * 获取整改统计
     */
    getRectificationStatistics(assessmentId = null) {
        let rectifications = this.rectifications;
        
        if (assessmentId) {
            rectifications = rectifications.filter(r => r.assessmentId === assessmentId);
        }

        return {
            total: rectifications.length,
            byStatus: {
                open: rectifications.filter(r => r.status === 'OPEN').length,
                assigned: rectifications.filter(r => r.status === 'ASSIGNED').length,
                inProgress: rectifications.filter(r => r.status === 'IN_PROGRESS').length,
                pendingReview: rectifications.filter(r => r.status === 'PENDING_REVIEW').length,
                completed: rectifications.filter(r => r.status === 'COMPLETED').length,
                rejected: rectifications.filter(r => r.status === 'REJECTED').length
            },
            bySeverity: {
                high: rectifications.filter(r => r.severity === 'HIGH').length,
                medium: rectifications.filter(r => r.severity === 'MEDIUM').length,
                low: rectifications.filter(r => r.severity === 'LOW').length
            },
            overdue: rectifications.filter(r => {
                const dueDate = new Date(r.dueDate);
                const today = new Date();
                return dueDate < today && !['COMPLETED', 'REJECTED'].includes(r.status);
            }).length,
            avgProgress: rectifications.length > 0 
                ? (rectifications.reduce((sum, r) => sum + r.progress, 0) / rectifications.length).toFixed(2)
                : 0
        };
    }

    /**
     * 获取即将到期的整改工单
     */
    getUpcomingDueRectifications(days = 7) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        return this.rectifications.filter(r => {
            if (['COMPLETED', 'REJECTED'].includes(r.status)) {
                return false;
            }
            const dueDate = new Date(r.dueDate);
            return dueDate >= today && dueDate <= futureDate;
        });
    }

    /**
     * 保存整改数据
     */
    saveRectifications() {
        try {
            localStorage.setItem('compliance_rectifications', JSON.stringify(this.rectifications));
        } catch (error) {
            console.error('保存整改数据失败:', error);
        }
    }

    /**
     * 加载整改数据
     */
    loadRectifications() {
        try {
            const data = localStorage.getItem('compliance_rectifications');
            if (data) {
                this.rectifications = JSON.parse(data);
            }
        } catch (error) {
            console.error('加载整改数据失败:', error);
            this.rectifications = [];
        }
    }

    /**
     * 批量创建整改工单
     */
    batchCreateRectifications(assessmentId) {
        const assessment = this.getAssessment(assessmentId);
        if (!assessment) {
            throw new Error('评估不存在');
        }

        const openFindings = assessment.findings.filter(f => f.status === 'OPEN');
        const created = [];

        openFindings.forEach(finding => {
            const rectification = this.createRectificationFromFinding(assessmentId, finding.id);
            created.push(rectification);
        });

        return {
            total: created.length,
            rectifications: created
        };
    }

    /**
     * 关闭整改工单
     */
    closeRectification(rectificationId, reason) {
        const rectification = this.rectifications.find(r => r.id === rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        rectification.status = 'CLOSED';
        rectification.closeReason = reason;
        rectification.closedAt = new Date().toISOString();
        rectification.updatedAt = new Date().toISOString();

        this.saveRectifications();
        this.addActivity(rectificationId, 'CLOSE', `关闭工单: ${reason}`);

        return rectification;
    }
}

// 导出整改服务实例
window.ComplianceRectificationService = ComplianceRectificationService;

/**
 * 复核验证服务扩展
 */
class ComplianceReviewService extends ComplianceRectificationService {
    constructor() {
        super();
        this.reviews = [];
        this.loadReviews();
    }

    /**
     * 创建复核任务
     */
    createReview(rectificationId, reviewerData) {
        const rectification = this.getRectification(rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        if (rectification.status !== 'PENDING_REVIEW') {
            throw new Error('整改工单状态不正确,无法创建复核任务');
        }

        const review = {
            id: 'REV-' + Date.now(),
            rectificationId,
            assessmentId: rectification.assessmentId,
            findingId: rectification.findingId,
            reviewNo: 'R' + Date.now(),
            title: `复核: ${rectification.title}`,
            reviewer: reviewerData.reviewer,
            reviewType: reviewerData.reviewType || 'STANDARD', // STANDARD, DETAILED, SAMPLING
            status: 'PENDING',
            checkItems: this.generateReviewCheckItems(rectification),
            result: null,
            comments: [],
            evidence: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.reviews.push(review);
        this.saveReviews();

        // 更新整改工单状态
        rectification.reviewId = review.id;
        rectification.status = 'UNDER_REVIEW';
        this.saveRectifications();

        this.addActivity(rectificationId, 'START_REVIEW', `开始复核,复核人: ${reviewerData.reviewer}`);

        return review;
    }

    /**
     * 生成复核检查项
     */
    generateReviewCheckItems(rectification) {
        return [
            {
                id: 'RC-01',
                name: '整改措施完整性',
                description: '检查整改措施是否完整,是否覆盖所有问题点',
                status: 'PENDING',
                result: null,
                comments: ''
            },
            {
                id: 'RC-02',
                name: '整改措施有效性',
                description: '检查整改措施是否有效,是否能够解决根本问题',
                status: 'PENDING',
                result: null,
                comments: ''
            },
            {
                id: 'RC-03',
                name: '整改证据充分性',
                description: '检查整改证据是否充分,是否能够证明整改完成',
                status: 'PENDING',
                result: null,
                comments: ''
            },
            {
                id: 'RC-04',
                name: '整改效果验证',
                description: '实际验证整改效果,确认问题已解决',
                status: 'PENDING',
                result: null,
                comments: ''
            },
            {
                id: 'RC-05',
                name: '文档完整性',
                description: '检查整改文档是否完整,包括整改方案、实施记录、测试报告等',
                status: 'PENDING',
                result: null,
                comments: ''
            }
        ];
    }

    /**
     * 更新复核检查项
     */
    updateReviewCheckItem(reviewId, itemId, updateData) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) {
            throw new Error('复核任务不存在');
        }

        const item = review.checkItems.find(i => i.id === itemId);
        if (!item) {
            throw new Error('检查项不存在');
        }

        Object.assign(item, updateData);
        item.status = 'CHECKED';
        review.updatedAt = new Date().toISOString();

        this.saveReviews();

        return item;
    }

    /**
     * 添加复核意见
     */
    addReviewComment(reviewId, comment) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) {
            throw new Error('复核任务不存在');
        }

        review.comments.push({
            id: 'CMT-' + Date.now(),
            content: comment.content,
            type: comment.type || 'GENERAL', // GENERAL, QUESTION, SUGGESTION, ISSUE
            author: comment.author,
            createdAt: new Date().toISOString()
        });

        review.updatedAt = new Date().toISOString();
        this.saveReviews();

        return review;
    }

    /**
     * 添加复核证据
     */
    addReviewEvidence(reviewId, evidence) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) {
            throw new Error('复核任务不存在');
        }

        review.evidence.push({
            id: 'EVD-' + Date.now(),
            type: evidence.type, // SCREENSHOT, DOCUMENT, LOG, OTHER
            name: evidence.name,
            description: evidence.description,
            url: evidence.url,
            uploadedBy: evidence.uploadedBy,
            uploadedAt: new Date().toISOString()
        });

        review.updatedAt = new Date().toISOString();
        this.saveReviews();

        return review;
    }

    /**
     * 提交复核结果
     */
    submitReviewResult(reviewId, resultData) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) {
            throw new Error('复核任务不存在');
        }

        const rectification = this.getRectification(review.rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        // 检查所有检查项是否已完成
        const allChecked = review.checkItems.every(item => item.status === 'CHECKED');
        if (!allChecked) {
            throw new Error('还有检查项未完成');
        }

        review.result = {
            decision: resultData.decision, // APPROVED, REJECTED, CONDITIONAL
            overallScore: resultData.overallScore,
            summary: resultData.summary,
            strengths: resultData.strengths || [],
            weaknesses: resultData.weaknesses || [],
            recommendations: resultData.recommendations || [],
            reviewedBy: resultData.reviewedBy,
            reviewedAt: new Date().toISOString()
        };

        review.status = 'COMPLETED';
        review.updatedAt = new Date().toISOString();

        // 更新整改工单状态
        if (resultData.decision === 'APPROVED') {
            rectification.status = 'COMPLETED';
            rectification.completedAt = new Date().toISOString();
            this.addActivity(rectification.id, 'APPROVE', '复核通过,整改完成');

            // 更新评估中的问题状态
            const assessment = this.getAssessment(rectification.assessmentId);
            if (assessment) {
                const finding = assessment.findings.find(f => f.id === rectification.findingId);
                if (finding) {
                    finding.status = 'RESOLVED';
                    this.saveAssessments();
                }
            }
        } else if (resultData.decision === 'REJECTED') {
            rectification.status = 'REJECTED';
            rectification.rejectedAt = new Date().toISOString();
            rectification.rejectReason = resultData.summary;
            this.addActivity(rectification.id, 'REJECT', `复核不通过: ${resultData.summary}`);
        } else if (resultData.decision === 'CONDITIONAL') {
            rectification.status = 'IN_PROGRESS';
            this.addActivity(rectification.id, 'CONDITIONAL', `有条件通过,需要补充: ${resultData.summary}`);
        }

        this.saveReviews();
        this.saveRectifications();

        return review;
    }

    /**
     * 生成整改报告
     */
    generateRectificationReport(rectificationId) {
        const rectification = this.getRectification(rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        const review = this.reviews.find(r => r.rectificationId === rectificationId);
        const assessment = this.getAssessment(rectification.assessmentId);

        const report = {
            id: 'RRPT-' + Date.now(),
            rectificationId,
            title: `整改报告 - ${rectification.title}`,
            generatedAt: new Date().toISOString(),
            sections: [
                {
                    title: '整改概况',
                    content: {
                        ticketNo: rectification.ticketNo,
                        title: rectification.title,
                        category: rectification.category,
                        severity: rectification.severity,
                        status: rectification.status,
                        assignedTo: rectification.assignedTo,
                        createdAt: rectification.createdAt,
                        completedAt: rectification.completedAt,
                        dueDate: rectification.dueDate
                    }
                },
                {
                    title: '问题描述',
                    content: {
                        description: rectification.description,
                        recommendation: rectification.recommendation
                    }
                },
                {
                    title: '整改过程',
                    content: {
                        activities: rectification.activities,
                        progress: rectification.progress,
                        attachments: rectification.attachments
                    }
                },
                {
                    title: '整改措施',
                    content: rectification.completionData || {}
                },
                {
                    title: '复核结果',
                    content: review ? {
                        reviewNo: review.reviewNo,
                        reviewer: review.reviewer,
                        checkItems: review.checkItems,
                        result: review.result,
                        comments: review.comments,
                        evidence: review.evidence
                    } : { message: '暂无复核记录' }
                },
                {
                    title: '总结与建议',
                    content: {
                        summary: review?.result?.summary || '',
                        recommendations: review?.result?.recommendations || []
                    }
                }
            ]
        };

        return report;
    }

    /**
     * 获取复核任务列表
     */
    getReviews(filter = {}) {
        let result = [...this.reviews];

        if (filter.status) {
            result = result.filter(r => r.status === filter.status);
        }

        if (filter.reviewer) {
            result = result.filter(r => r.reviewer === filter.reviewer);
        }

        if (filter.assessmentId) {
            result = result.filter(r => r.assessmentId === filter.assessmentId);
        }

        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    /**
     * 获取复核任务详情
     */
    getReview(reviewId) {
        return this.reviews.find(r => r.id === reviewId);
    }

    /**
     * 获取复核统计
     */
    getReviewStatistics(assessmentId = null) {
        let reviews = this.reviews;
        
        if (assessmentId) {
            reviews = reviews.filter(r => r.assessmentId === assessmentId);
        }

        const completed = reviews.filter(r => r.status === 'COMPLETED');

        return {
            total: reviews.length,
            byStatus: {
                pending: reviews.filter(r => r.status === 'PENDING').length,
                inProgress: reviews.filter(r => r.status === 'IN_PROGRESS').length,
                completed: completed.length
            },
            byResult: {
                approved: completed.filter(r => r.result?.decision === 'APPROVED').length,
                rejected: completed.filter(r => r.result?.decision === 'REJECTED').length,
                conditional: completed.filter(r => r.result?.decision === 'CONDITIONAL').length
            },
            avgScore: completed.length > 0
                ? (completed.reduce((sum, r) => sum + (r.result?.overallScore || 0), 0) / completed.length).toFixed(2)
                : 0
        };
    }

    /**
     * 保存复核数据
     */
    saveReviews() {
        try {
            localStorage.setItem('compliance_reviews', JSON.stringify(this.reviews));
        } catch (error) {
            console.error('保存复核数据失败:', error);
        }
    }

    /**
     * 加载复核数据
     */
    loadReviews() {
        try {
            const data = localStorage.getItem('compliance_reviews');
            if (data) {
                this.reviews = JSON.parse(data);
            }
        } catch (error) {
            console.error('加载复核数据失败:', error);
            this.reviews = [];
        }
    }

    /**
     * 重新开启复核
     */
    reopenReview(reviewId, reason) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) {
            throw new Error('复核任务不存在');
        }

        const rectification = this.getRectification(review.rectificationId);
        if (!rectification) {
            throw new Error('整改工单不存在');
        }

        review.status = 'PENDING';
        review.result = null;
        review.updatedAt = new Date().toISOString();

        rectification.status = 'PENDING_REVIEW';
        rectification.updatedAt = new Date().toISOString();

        this.saveReviews();
        this.saveRectifications();

        this.addActivity(rectification.id, 'REOPEN_REVIEW', `重新开启复核: ${reason}`);

        return review;
    }
}

// 导出完整的合规服务实例
window.ComplianceService = ComplianceReviewService;
