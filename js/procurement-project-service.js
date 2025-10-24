/**
 * 采购项目服务
 * 提供采购项目全流程预警数据
 */

const ProcurementProjectService = {
    /**
     * 获取采购项目详情（包含全流程预警）
     */
    getProjectDetail(projectId) {
        // 模拟采购项目数据
        const projects = {
            'P2025001': {
                id: 'P2025001',
                name: '新图书馆智能化系统采购项目',
                code: 'CG-2025-001',
                type: '货物类',
                amount: 850,
                unit: '万元',
                department: '图书馆',
                status: '评标中',
                createTime: '2025-09-15',
                
                // 全流程数据
                phases: [
                    {
                        id: 1,
                        name: '论证',
                        status: 'completed',
                        completedTime: '2025-09-20',
                        alerts: [
                            {
                                id: 'A001',
                                level: 'high',
                                type: '人员专业性不足',
                                title: '论证专家专业背景不匹配',
                                description: '参与论证的5名专家中，仅2名具有图书馆智能化系统相关专业背景，其余3名为建筑工程专业，专业匹配度仅40%',
                                suggestion: '建议增加图书馆学、信息技术、智能化系统等相关专业的专家',
                                riskScore: 85
                            },
                            {
                                id: 'A002',
                                level: 'medium',
                                type: '倾向性风险',
                                title: '论证意见存在明显倾向性',
                                description: '论证会议记录显示，某专家多次强调特定品牌产品优势，且该专家曾在该品牌供应商担任顾问',
                                suggestion: '建议重新审查专家利益关联，必要时更换专家重新论证',
                                riskScore: 72
                            }
                        ],
                        data: {
                            meetingDate: '2025-09-20',
                            participants: [
                                { name: '张教授', title: '图书馆学专家', organization: '本校', professional: true },
                                { name: '李工程师', title: '智能化系统专家', organization: '外校', professional: true },
                                { name: '王主任', title: '建筑工程专家', organization: '本校', professional: false },
                                { name: '赵经理', title: '工程管理专家', organization: '外校', professional: false },
                                { name: '刘总监', title: '项目管理专家', organization: '企业', professional: false }
                            ],
                            professionalRate: 40,
                            conclusion: '项目具有必要性和可行性，建议立项'
                        }
                    },
                    {
                        id: 2,
                        name: '立项',
                        status: 'completed',
                        completedTime: '2025-09-25',
                        alerts: [
                            {
                                id: 'A003',
                                level: 'high',
                                type: '重复建设',
                                title: '发现类似项目重复建设风险',
                                description: '2023年已实施"图书馆数字化管理系统"项目（投资320万元），与本次采购的智能化系统存在功能重叠，重叠率约35%',
                                suggestion: '建议与原有系统进行整合评估，避免重复投资',
                                riskScore: 88
                            },
                            {
                                id: 'A004',
                                level: 'medium',
                                type: '资料不完整',
                                title: '立项资料不够详细',
                                description: '缺少详细的需求分析报告、技术方案对比、投资效益分析等关键文档',
                                suggestion: '补充完善立项资料，特别是技术方案和效益分析',
                                riskScore: 65
                            }
                        ],
                        data: {
                            approvalDate: '2025-09-25',
                            approvalDepartment: '校长办公会',
                            budget: 850,
                            similarProjects: [
                                { name: '图书馆数字化管理系统', year: 2023, amount: 320, overlap: '35%' },
                                { name: '智慧校园一期建设', year: 2022, amount: 1200, overlap: '15%' }
                            ],
                            documents: [
                                { name: '项目建议书', status: 'complete' },
                                { name: '可行性研究报告', status: 'incomplete' },
                                { name: '需求分析报告', status: 'missing' },
                                { name: '技术方案', status: 'incomplete' }
                            ]
                        }
                    },
                    {
                        id: 3,
                        name: '需求',
                        status: 'completed',
                        completedTime: '2025-10-05',
                        alerts: [
                            {
                                id: 'A005',
                                level: 'high',
                                type: '举报线索',
                                title: '收到实名举报信息',
                                description: '有供应商实名举报称，需求文件中的技术参数明显倾向于某特定品牌，存在"量身定制"嫌疑',
                                suggestion: '立即暂停采购流程，组织专家重新审查需求文件的公平性',
                                riskScore: 92
                            },
                            {
                                id: 'A006',
                                level: 'high',
                                type: '倾向性明显',
                                title: '技术参数存在明显倾向性',
                                description: '需求文件中有3项技术参数仅有1-2家供应商能够满足，限制了市场竞争',
                                suggestion: '修改技术参数，确保至少3家以上供应商能够参与竞争',
                                riskScore: 86
                            },
                            {
                                id: 'A007',
                                level: 'medium',
                                type: '内定嫌疑',
                                title: '疑似存在内定情况',
                                description: '需求编制人员与某供应商有频繁联系记录，且该供应商提前了解项目信息',
                                suggestion: '调查需求编制过程，确保程序公正',
                                riskScore: 78
                            }
                        ],
                        data: {
                            demandDate: '2025-10-05',
                            demandDepartment: '图书馆、信息中心',
                            technicalParams: 15,
                            restrictiveParams: 3,
                            potentialSuppliers: 2,
                            complaints: [
                                {
                                    date: '2025-10-08',
                                    complainant: '某科技公司',
                                    type: '实名举报',
                                    content: '技术参数倾向性明显',
                                    status: '调查中'
                                }
                            ]
                        }
                    },
                    {
                        id: 4,
                        name: '公告',
                        status: 'completed',
                        completedTime: '2025-10-12',
                        alerts: [
                            {
                                id: 'A008',
                                level: 'medium',
                                type: '公告不规范',
                                title: '未在省级采购平台公告',
                                description: '项目金额超过500万元，按规定应在省级政府采购平台公告，但仅在学校网站发布',
                                suggestion: '立即在省级政府采购平台补充发布公告',
                                riskScore: 70
                            },
                            {
                                id: 'A009',
                                level: 'low',
                                type: '公告期限不足',
                                title: '公告时间略显仓促',
                                description: '公告期仅为法定最低期限20天，建议适当延长以吸引更多供应商',
                                suggestion: '考虑延长公告期至25-30天',
                                riskScore: 45
                            }
                        ],
                        data: {
                            announcementDate: '2025-10-12',
                            platforms: [
                                { name: '学校官网', published: true, url: 'http://xxx.edu.cn/notice/123' },
                                { name: '省政府采购平台', published: false, url: '' },
                                { name: '中国政府采购网', published: false, url: '' }
                            ],
                            announcementPeriod: 20,
                            requiredPeriod: 20,
                            views: 156,
                            downloads: 23
                        }
                    },
                    {
                        id: 5,
                        name: '专家抽取',
                        status: 'completed',
                        completedTime: '2025-10-18',
                        alerts: [
                            {
                                id: 'A010',
                                level: 'high',
                                type: '关键部门缺席',
                                title: '财务和审计部门未参与',
                                description: '专家组中未包含财务处和审计处人员，缺少对预算合理性和合规性的专业审查',
                                suggestion: '增加财务处和审计处代表参与评审',
                                riskScore: 82
                            },
                            {
                                id: 'A011',
                                level: 'medium',
                                type: '专家结构不合理',
                                title: '校外专家比例偏低',
                                description: '7名专家中仅2名为校外专家，校外专家比例仅28.6%，低于建议的40%',
                                suggestion: '增加校外专家比例，提高评审公正性',
                                riskScore: 68
                            }
                        ],
                        data: {
                            extractDate: '2025-10-18',
                            extractMethod: '随机抽取',
                            experts: [
                                { name: '专家A', type: '校内', specialty: '图书馆学', hasFinance: false, hasAudit: false },
                                { name: '专家B', type: '校内', specialty: '信息技术', hasFinance: false, hasAudit: false },
                                { name: '专家C', type: '校内', specialty: '工程管理', hasFinance: false, hasAudit: false },
                                { name: '专家D', type: '校内', specialty: '采购管理', hasFinance: false, hasAudit: false },
                                { name: '专家E', type: '校内', specialty: '技术专家', hasFinance: false, hasAudit: false },
                                { name: '专家F', type: '校外', specialty: '智能化系统', hasFinance: false, hasAudit: false },
                                { name: '专家G', type: '校外', specialty: '项目评审', hasFinance: false, hasAudit: false }
                            ],
                            internalRate: 71.4,
                            externalRate: 28.6,
                            financeParticipation: false,
                            auditParticipation: false
                        }
                    },
                    {
                        id: 6,
                        name: '评标',
                        status: 'ongoing',
                        completedTime: null,
                        alerts: [
                            {
                                id: 'A012',
                                level: 'high',
                                type: '投诉质疑',
                                title: '收到供应商投诉',
                                description: '有2家供应商对评分标准提出质疑，认为评分细则不够明确，存在主观性过强的问题',
                                suggestion: '暂停评标，组织专家重新审查评分标准',
                                riskScore: 80
                            },
                            {
                                id: 'A013',
                                level: 'medium',
                                type: '评分异常',
                                title: '专家评分差异过大',
                                description: '同一投标文件，不同专家评分差异超过20分，存在评分标准理解不一致的问题',
                                suggestion: '组织专家讨论统一评分标准',
                                riskScore: 72
                            }
                        ],
                        data: {
                            biddingDate: '2025-10-20',
                            bidders: 3,
                            validBids: 3,
                            complaints: [
                                {
                                    date: '2025-10-21',
                                    complainant: 'A公司',
                                    type: '质疑',
                                    content: '评分标准不明确',
                                    status: '处理中',
                                    response: '正在组织专家研究'
                                },
                                {
                                    date: '2025-10-22',
                                    complainant: 'B公司',
                                    type: '投诉',
                                    content: '评分过程不公正',
                                    status: '待处理',
                                    response: ''
                                }
                            ],
                            evaluationProgress: 60
                        }
                    },
                    {
                        id: 7,
                        name: '结果公示',
                        status: 'pending',
                        completedTime: null,
                        alerts: [],
                        data: null
                    },
                    {
                        id: 8,
                        name: '合同签订',
                        status: 'pending',
                        completedTime: null,
                        alerts: [],
                        data: null
                    }
                ],
                
                // 统计信息
                statistics: {
                    totalAlerts: 13,
                    highAlerts: 7,
                    mediumAlerts: 5,
                    lowAlerts: 1,
                    totalRiskScore: 78,
                    completedPhases: 6,
                    totalPhases: 8,
                    progress: 75
                }
            },
            
            'P2025002': {
                id: 'P2025002',
                name: '学生宿舍家具采购项目',
                code: 'CG-2025-002',
                type: '货物类',
                amount: 320,
                unit: '万元',
                department: '后勤处',
                status: '合同签订',
                createTime: '2025-08-01',
                
                phases: [
                    {
                        id: 1,
                        name: '论证',
                        status: 'completed',
                        completedTime: '2025-08-10',
                        alerts: [],
                        data: {
                            meetingDate: '2025-08-10',
                            participants: [
                                { name: '张主任', title: '后勤管理专家', organization: '本校', professional: true },
                                { name: '李经理', title: '家具采购专家', organization: '外校', professional: true },
                                { name: '王工程师', title: '质量检测专家', organization: '外校', professional: true }
                            ],
                            professionalRate: 100,
                            conclusion: '项目必要且可行'
                        }
                    },
                    {
                        id: 2,
                        name: '立项',
                        status: 'completed',
                        completedTime: '2025-08-15',
                        alerts: [],
                        data: {
                            approvalDate: '2025-08-15',
                            approvalDepartment: '校长办公会',
                            budget: 320,
                            similarProjects: [],
                            documents: [
                                { name: '项目建议书', status: 'complete' },
                                { name: '可行性研究报告', status: 'complete' },
                                { name: '需求分析报告', status: 'complete' },
                                { name: '技术方案', status: 'complete' }
                            ]
                        }
                    },
                    {
                        id: 3,
                        name: '需求',
                        status: 'completed',
                        completedTime: '2025-08-20',
                        alerts: [],
                        data: {
                            demandDate: '2025-08-20',
                            demandDepartment: '后勤处',
                            technicalParams: 8,
                            restrictiveParams: 0,
                            potentialSuppliers: 5,
                            complaints: []
                        }
                    },
                    {
                        id: 4,
                        name: '公告',
                        status: 'completed',
                        completedTime: '2025-08-25',
                        alerts: [],
                        data: {
                            announcementDate: '2025-08-25',
                            platforms: [
                                { name: '学校官网', published: true, url: 'http://xxx.edu.cn/notice/124' },
                                { name: '省政府采购平台', published: true, url: 'http://xxx.gov.cn/124' }
                            ],
                            announcementPeriod: 25,
                            requiredPeriod: 20,
                            views: 234,
                            downloads: 45
                        }
                    },
                    {
                        id: 5,
                        name: '专家抽取',
                        status: 'completed',
                        completedTime: '2025-09-10',
                        alerts: [],
                        data: {
                            extractDate: '2025-09-10',
                            extractMethod: '随机抽取',
                            experts: [
                                { name: '专家A', type: '校内', specialty: '后勤管理', hasFinance: false, hasAudit: false },
                                { name: '专家B', type: '校外', specialty: '家具质量', hasFinance: false, hasAudit: false },
                                { name: '专家C', type: '校外', specialty: '采购管理', hasFinance: false, hasAudit: false },
                                { name: '财务代表', type: '校内', specialty: '财务审核', hasFinance: true, hasAudit: false },
                                { name: '审计代表', type: '校内', specialty: '审计监督', hasFinance: false, hasAudit: true }
                            ],
                            internalRate: 40,
                            externalRate: 60,
                            financeParticipation: true,
                            auditParticipation: true
                        }
                    },
                    {
                        id: 6,
                        name: '评标',
                        status: 'completed',
                        completedTime: '2025-09-15',
                        alerts: [],
                        data: {
                            biddingDate: '2025-09-15',
                            bidders: 5,
                            validBids: 5,
                            complaints: [],
                            evaluationProgress: 100
                        }
                    },
                    {
                        id: 7,
                        name: '结果公示',
                        status: 'completed',
                        completedTime: '2025-09-20',
                        alerts: [],
                        data: {
                            publicityDate: '2025-09-20',
                            publicityPeriod: 5,
                            winner: 'XX家具有限公司',
                            winAmount: 318,
                            objections: []
                        }
                    },
                    {
                        id: 8,
                        name: '合同签订',
                        status: 'completed',
                        completedTime: '2025-09-28',
                        alerts: [
                            {
                                id: 'A014',
                                level: 'low',
                                type: '合同条款',
                                title: '合同金额与中标金额存在微小差异',
                                description: '合同金额318.5万元，中标金额318万元，差异0.5万元（0.16%）',
                                suggestion: '核实差异原因，确保合理合规',
                                riskScore: 35
                            }
                        ],
                        data: {
                            contractDate: '2025-09-28',
                            contractAmount: 318.5,
                            bidAmount: 318,
                            difference: 0.5,
                            differenceRate: 0.16,
                            contentMatch: true,
                            matchRate: 99.5
                        }
                    }
                ],
                
                statistics: {
                    totalAlerts: 1,
                    highAlerts: 0,
                    mediumAlerts: 0,
                    lowAlerts: 1,
                    totalRiskScore: 15,
                    completedPhases: 8,
                    totalPhases: 8,
                    progress: 100
                }
            }
        };
        
        return projects[projectId] || null;
    },
    
    /**
     * 获取采购项目列表
     */
    getProjectList() {
        return [
            {
                id: 'P2025001',
                name: '新图书馆智能化系统采购项目',
                code: 'CG-2025-001',
                type: '货物类',
                amount: 850,
                department: '图书馆',
                status: '评标中',
                alertCount: 13,
                riskLevel: 'high',
                createTime: '2025-09-15'
            },
            {
                id: 'P2025002',
                name: '学生宿舍家具采购项目',
                code: 'CG-2025-002',
                type: '货物类',
                amount: 320,
                department: '后勤处',
                status: '合同签订',
                alertCount: 1,
                riskLevel: 'low',
                createTime: '2025-08-01'
            }
        ];
    }
};
