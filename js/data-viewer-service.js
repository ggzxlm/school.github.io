/**
 * 数据查看服务
 */

(function() {
    'use strict';

    // 模拟数据表列表
    const dataTables = {
        raw: [
            {
                id: 'raw_personnel',
                name: 'raw_personnel',
                displayName: '人员信息（原始）',
                recordCount: 1250,
                fieldCount: 15,
                lastUpdate: '2024-01-15 14:30:00',
                dataSource: '人事系统',
                collectionTask: '人员信息全量采集',
                fields: ['id', 'name', 'id_card', 'phone', 'email', 'department', 'position', 'hire_date', 'status', 'created_at', 'updated_at', 'source_system', 'source_id', 'data_quality_score', 'remarks']
            },
            {
                id: 'raw_suppliers',
                name: 'raw_suppliers',
                displayName: '供应商信息（原始）',
                recordCount: 580,
                fieldCount: 12,
                lastUpdate: '2024-01-15 10:20:00',
                dataSource: '采购系统',
                collectionTask: '供应商信息增量采集',
                fields: ['id', 'name', 'credit_code', 'legal_person', 'phone', 'address', 'capital', 'establish_date', 'status', 'created_at', 'source_system', 'source_id']
            },
            {
                id: 'raw_procurement',
                name: 'raw_procurement',
                displayName: '采购项目（原始）',
                recordCount: 320,
                fieldCount: 18,
                lastUpdate: '2024-01-15 09:15:00',
                dataSource: '采购系统',
                collectionTask: '采购项目全量采集',
                fields: ['id', 'project_name', 'project_code', 'amount', 'method', 'leader', 'status', 'start_date', 'end_date', 'supplier_id', 'department', 'created_at', 'updated_at', 'source_system', 'source_id', 'budget', 'actual_amount', 'remarks']
            },
            {
                id: 'raw_financial',
                name: 'raw_financial',
                displayName: '财务数据（原始）',
                recordCount: 8500,
                fieldCount: 20,
                lastUpdate: '2024-01-15 16:00:00',
                dataSource: '财务系统',
                collectionTask: '财务数据增量采集',
                fields: ['id', 'voucher_no', 'date', 'account', 'subject', 'amount', 'debit', 'credit', 'balance', 'department', 'project', 'person', 'summary', 'created_at', 'updated_at', 'source_system', 'source_id', 'status', 'auditor', 'audit_date']
            },
            {
                id: 'raw_research',
                name: 'raw_research',
                displayName: '科研项目（原始）',
                recordCount: 450,
                fieldCount: 16,
                lastUpdate: '2024-01-15 11:00:00',
                dataSource: '科研系统',
                collectionTask: '科研项目全量采集',
                fields: ['id', 'project_name', 'project_code', 'leader', 'department', 'budget', 'actual_expense', 'start_date', 'end_date', 'status', 'progress', 'created_at', 'updated_at', 'source_system', 'source_id', 'remarks']
            },
            {
                id: 'raw_assets',
                name: 'raw_assets',
                displayName: '资产信息（原始）',
                recordCount: 3200,
                fieldCount: 18,
                lastUpdate: '2024-01-15 13:00:00',
                dataSource: '资产系统',
                collectionTask: '资产信息增量采集',
                fields: ['id', 'asset_name', 'asset_code', 'category', 'purchase_date', 'purchase_price', 'department', 'custodian', 'location', 'status', 'usage_rate', 'last_check_date', 'created_at', 'updated_at', 'source_system', 'source_id', 'appraisal_price', 'remarks']
            },
            {
                id: 'raw_contracts',
                name: 'raw_contracts',
                displayName: '合同信息（原始）',
                recordCount: 680,
                fieldCount: 15,
                lastUpdate: '2024-01-15 10:45:00',
                dataSource: '合同系统',
                collectionTask: '合同信息全量采集',
                fields: ['id', 'contract_no', 'contract_name', 'supplier_id', 'amount', 'sign_date', 'start_date', 'end_date', 'department', 'person_in_charge', 'status', 'change_count', 'created_at', 'source_system', 'source_id']
            },
            {
                id: 'raw_admission',
                name: 'raw_admission',
                displayName: '招生数据（原始）',
                recordCount: 5200,
                fieldCount: 14,
                lastUpdate: '2024-01-15 09:30:00',
                dataSource: '招生系统',
                collectionTask: '招生数据全量采集',
                fields: ['id', 'student_name', 'id_card', 'admission_score', 'major', 'admission_type', 'bonus_points', 'province', 'admission_date', 'status', 'created_at', 'source_system', 'source_id', 'remarks']
            },
            {
                id: 'raw_student_aid',
                name: 'raw_student_aid',
                displayName: '学生资助（原始）',
                recordCount: 2800,
                fieldCount: 12,
                lastUpdate: '2024-01-15 15:20:00',
                dataSource: '学工系统',
                collectionTask: '学生资助增量采集',
                fields: ['id', 'student_id', 'student_name', 'aid_type', 'amount', 'academic_year', 'issue_date', 'status', 'created_at', 'source_system', 'source_id', 'remarks']
            },
            {
                id: 'raw_family_relation',
                name: 'raw_family_relation',
                displayName: '人员家庭关系（原始）',
                recordCount: 1500,
                fieldCount: 12,
                lastUpdate: '2024-01-15 10:00:00',
                dataSource: '公安系统',
                collectionTask: '家庭关系全量采集',
                fields: ['id', 'person_id', 'person_name', 'person_id_card', 'related_person_id', 'related_person_name', 'related_person_id_card', 'relation_type', 'verified', 'data_source', 'created_at', 'updated_at', 'source_system', 'source_id', 'remarks']
            },
            {
                id: 'raw_equity_relation',
                name: 'raw_equity_relation',
                displayName: '企业股权关系（原始）',
                recordCount: 2200,
                fieldCount: 14,
                lastUpdate: '2024-01-15 10:00:00',
                dataSource: '工商系统',
                collectionTask: '股权关系增量采集',
                fields: ['id', 'company_id', 'company_name', 'company_credit_code', 'person_id', 'person_name', 'person_id_card', 'position', 'equity_ratio', 'start_date', 'end_date', 'status', 'data_source', 'created_at', 'updated_at', 'source_system', 'source_id', 'remarks']
            },
            {
                id: 'raw_relation_alert',
                name: 'raw_relation_alert',
                displayName: '关联关系预警（原始）',
                recordCount: 380,
                fieldCount: 20,
                lastUpdate: '2024-01-15 10:00:00',
                dataSource: '关联分析系统',
                collectionTask: '关联预警实时采集',
                fields: ['id', 'alert_type', 'person_a_id', 'person_a_name', 'person_a_role', 'person_b_id', 'person_b_name', 'person_b_role', 'company_id', 'company_name', 'relation_path', 'relation_depth', 'risk_level', 'confidence_score', 'related_procurement_id', 'related_procurement_name', 'procurement_amount', 'alert_date', 'status', 'verification_result', 'created_at', 'updated_at', 'source_system', 'source_id', 'remarks']
            }
        ],
        cleaned: [
            {
                id: 'cleaned_personnel',
                name: 'cleaned_personnel',
                displayName: '人员信息（治理后）',
                recordCount: 1180,
                fieldCount: 14,
                lastUpdate: '2024-01-15 15:00:00',
                dataSource: '人事系统',
                collectionTask: '人员信息全量采集',
                fields: ['id', 'name', 'id_card', 'phone', 'email', 'department', 'position', 'hire_date', 'status', 'created_at', 'updated_at', 'master_data_id', 'data_quality_score', 'remarks']
            },
            {
                id: 'cleaned_suppliers',
                name: 'cleaned_suppliers',
                displayName: '供应商信息（治理后）',
                recordCount: 520,
                fieldCount: 11,
                lastUpdate: '2024-01-15 10:45:00',
                dataSource: '采购系统',
                collectionTask: '供应商信息增量采集',
                fields: ['id', 'name', 'credit_code', 'legal_person', 'phone', 'address', 'capital', 'establish_date', 'status', 'created_at', 'master_data_id']
            },
            {
                id: 'cleaned_procurement',
                name: 'cleaned_procurement',
                displayName: '采购项目（治理后）',
                recordCount: 315,
                fieldCount: 16,
                lastUpdate: '2024-01-15 09:30:00',
                dataSource: '采购系统',
                collectionTask: '采购项目全量采集',
                fields: ['id', 'project_name', 'project_code', 'amount', 'method', 'leader', 'status', 'start_date', 'end_date', 'supplier_id', 'department', 'created_at', 'updated_at', 'master_data_id', 'budget', 'actual_amount']
            },
            {
                id: 'cleaned_financial',
                name: 'cleaned_financial',
                displayName: '财务数据（治理后）',
                recordCount: 8350,
                fieldCount: 18,
                lastUpdate: '2024-01-15 16:15:00',
                dataSource: '财务系统',
                collectionTask: '财务数据增量采集',
                fields: ['id', 'voucher_no', 'date', 'account', 'subject', 'amount', 'debit', 'credit', 'balance', 'department', 'project', 'person', 'summary', 'created_at', 'updated_at', 'status', 'auditor', 'audit_date']
            },
            {
                id: 'cleaned_research',
                name: 'cleaned_research',
                displayName: '科研项目（治理后）',
                recordCount: 445,
                fieldCount: 15,
                lastUpdate: '2024-01-15 11:15:00',
                dataSource: '科研系统',
                collectionTask: '科研项目全量采集',
                fields: ['id', 'project_name', 'project_code', 'leader', 'department', 'budget', 'actual_expense', 'start_date', 'end_date', 'status', 'progress', 'created_at', 'updated_at', 'master_data_id', 'remarks']
            },
            {
                id: 'cleaned_assets',
                name: 'cleaned_assets',
                displayName: '资产信息（治理后）',
                recordCount: 3150,
                fieldCount: 17,
                lastUpdate: '2024-01-15 13:15:00',
                dataSource: '资产系统',
                collectionTask: '资产信息增量采集',
                fields: ['id', 'asset_name', 'asset_code', 'category', 'purchase_date', 'purchase_price', 'department', 'custodian', 'location', 'status', 'usage_rate', 'last_check_date', 'created_at', 'updated_at', 'master_data_id', 'appraisal_price', 'remarks']
            },
            {
                id: 'cleaned_contracts',
                name: 'cleaned_contracts',
                displayName: '合同信息（治理后）',
                recordCount: 675,
                fieldCount: 14,
                lastUpdate: '2024-01-15 11:00:00',
                dataSource: '合同系统',
                collectionTask: '合同信息全量采集',
                fields: ['id', 'contract_no', 'contract_name', 'supplier_id', 'amount', 'sign_date', 'start_date', 'end_date', 'department', 'person_in_charge', 'status', 'change_count', 'created_at', 'master_data_id']
            },
            {
                id: 'cleaned_admission',
                name: 'cleaned_admission',
                displayName: '招生数据（治理后）',
                recordCount: 5180,
                fieldCount: 13,
                lastUpdate: '2024-01-15 09:45:00',
                dataSource: '招生系统',
                collectionTask: '招生数据全量采集',
                fields: ['id', 'student_name', 'id_card', 'admission_score', 'major', 'admission_type', 'bonus_points', 'province', 'admission_date', 'status', 'created_at', 'master_data_id', 'remarks']
            },
            {
                id: 'cleaned_student_aid',
                name: 'cleaned_student_aid',
                displayName: '学生资助（治理后）',
                recordCount: 2780,
                fieldCount: 11,
                lastUpdate: '2024-01-15 15:30:00',
                dataSource: '学工系统',
                collectionTask: '学生资助增量采集',
                fields: ['id', 'student_id', 'student_name', 'aid_type', 'amount', 'academic_year', 'issue_date', 'status', 'created_at', 'master_data_id', 'remarks']
            },
            {
                id: 'cleaned_family_relation',
                name: 'cleaned_family_relation',
                displayName: '人员家庭关系（治理后）',
                recordCount: 1450,
                fieldCount: 11,
                lastUpdate: '2024-01-15 10:15:00',
                dataSource: '公安系统',
                collectionTask: '家庭关系全量采集',
                fields: ['id', 'person_id', 'person_name', 'person_id_card', 'related_person_id', 'related_person_name', 'related_person_id_card', 'relation_type', 'verified', 'data_source', 'created_at', 'updated_at', 'master_data_id', 'remarks']
            },
            {
                id: 'cleaned_equity_relation',
                name: 'cleaned_equity_relation',
                displayName: '企业股权关系（治理后）',
                recordCount: 2180,
                fieldCount: 13,
                lastUpdate: '2024-01-15 10:15:00',
                dataSource: '工商系统',
                collectionTask: '股权关系增量采集',
                fields: ['id', 'company_id', 'company_name', 'company_credit_code', 'person_id', 'person_name', 'person_id_card', 'position', 'equity_ratio', 'start_date', 'end_date', 'status', 'data_source', 'created_at', 'updated_at', 'master_data_id', 'remarks']
            },
            {
                id: 'cleaned_relation_alert',
                name: 'cleaned_relation_alert',
                displayName: '关联关系预警（治理后）',
                recordCount: 375,
                fieldCount: 19,
                lastUpdate: '2024-01-15 10:15:00',
                dataSource: '关联分析系统',
                collectionTask: '关联预警实时采集',
                fields: ['id', 'alert_type', 'person_a_id', 'person_a_name', 'person_a_role', 'person_b_id', 'person_b_name', 'person_b_role', 'company_id', 'company_name', 'relation_path', 'relation_depth', 'risk_level', 'confidence_score', 'related_procurement_id', 'related_procurement_name', 'procurement_amount', 'alert_date', 'status', 'verification_result', 'created_at', 'updated_at', 'master_data_id', 'remarks']
            }
        ]
    };

    // 模拟数据记录
    const sampleData = {
        raw_personnel: generatePersonnelData(50, true),
        cleaned_personnel: generatePersonnelData(50, false),
        raw_suppliers: generateSupplierData(30, true),
        cleaned_suppliers: generateSupplierData(30, false),
        raw_procurement: generateProcurementData(20, true),
        cleaned_procurement: generateProcurementData(20, false),
        raw_financial: generateFinancialData(40, true),
        cleaned_financial: generateFinancialData(40, false),
        raw_research: generateResearchData(25, true),
        cleaned_research: generateResearchData(25, false),
        raw_assets: generateAssetData(35, true),
        cleaned_assets: generateAssetData(35, false),
        raw_contracts: generateContractData(30, true),
        cleaned_contracts: generateContractData(30, false),
        raw_admission: generateAdmissionData(40, true),
        cleaned_admission: generateAdmissionData(40, false),
        raw_student_aid: generateStudentAidData(30, true),
        cleaned_student_aid: generateStudentAidData(30, false),
        raw_family_relation: generateFamilyRelationData(30, true),
        cleaned_family_relation: generateFamilyRelationData(30, false),
        raw_equity_relation: generateEquityRelationData(35, true),
        cleaned_equity_relation: generateEquityRelationData(35, false),
        raw_relation_alert: generateRelationAlertData(25, true),
        cleaned_relation_alert: generateRelationAlertData(25, false)
    };

    /**
     * 生成人员数据
     */
    function generatePersonnelData(count, isRaw) {
        const data = [];
        const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二'];
        const departments = ['计算机学院', '经济管理学院', '外国语学院', '机械工程学院', '化学学院'];
        const positions = ['教授', '副教授', '讲师', '助教', '行政人员'];
        
        for (let i = 0; i < count; i++) {
            const record = {
                id: 10000 + i,
                name: names[i % names.length] + (i > 9 ? i : ''),
                id_card: `${110000 + i}19${80 + (i % 20)}0101${1000 + i}`,
                phone: `138${String(i).padStart(8, '0')}`,
                email: `user${i}@university.edu.cn`,
                department: departments[i % departments.length],
                position: positions[i % positions.length],
                hire_date: `20${10 + (i % 15)}-0${1 + (i % 9)}-15`,
                status: i % 10 === 0 ? '离职' : '在职',
                created_at: '2024-01-10 10:00:00',
                updated_at: '2024-01-15 14:30:00'
            };
            
            if (isRaw) {
                record.source_system = '人事系统';
                record.source_id = `HR_${10000 + i}`;
                record.data_quality_score = 75 + (i % 25);
                record.remarks = i % 5 === 0 ? '数据存在重复' : '';
            } else {
                record.master_data_id = `MD_PERSON_${10000 + i}`;
                record.data_quality_score = 90 + (i % 10);
                record.remarks = '';
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成供应商数据
     */
    function generateSupplierData(count, isRaw) {
        const data = [];
        const companies = ['科技有限公司', '贸易有限公司', '建筑工程有限公司', '教育科技公司', '信息技术公司'];
        
        for (let i = 0; i < count; i++) {
            const record = {
                id: 20000 + i,
                name: `${String.fromCharCode(65 + (i % 26))}公司${companies[i % companies.length]}`,
                credit_code: `91110000${String(100000000 + i).substring(0, 9)}`,
                legal_person: `法人${i}`,
                phone: `010-${String(i).padStart(8, '0')}`,
                address: `北京市海淀区某某路${i}号`,
                capital: 100 + (i * 50),
                establish_date: `20${5 + (i % 15)}-0${1 + (i % 9)}-01`,
                status: i % 15 === 0 ? '注销' : '正常',
                created_at: '2024-01-10 09:00:00'
            };
            
            if (isRaw) {
                record.source_system = '采购系统';
                record.source_id = `PROC_SUP_${20000 + i}`;
            } else {
                record.master_data_id = `MD_SUPPLIER_${20000 + i}`;
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成采购项目数据
     */
    function generateProcurementData(count, isRaw) {
        const data = [];
        const methods = ['公开招标', '邀请招标', '竞争性谈判', '单一来源'];
        const statuses = ['计划中', '招标中', '执行中', '已完成'];
        
        for (let i = 0; i < count; i++) {
            const record = {
                id: 30000 + i,
                project_name: `采购项目${i + 1}`,
                project_code: `PROC-2024-${String(i + 1).padStart(4, '0')}`,
                amount: 50 + (i * 10),
                method: methods[i % methods.length],
                leader: `负责人${i}`,
                status: statuses[i % statuses.length],
                start_date: `2024-01-${String(1 + (i % 28)).padStart(2, '0')}`,
                end_date: `2024-06-${String(1 + (i % 28)).padStart(2, '0')}`,
                supplier_id: 20000 + (i % 30),
                department: '采购部',
                created_at: '2024-01-05 09:00:00',
                updated_at: '2024-01-15 09:15:00'
            };
            
            if (isRaw) {
                record.source_system = '采购系统';
                record.source_id = `PROC_PRJ_${30000 + i}`;
                record.budget = record.amount + 10;
                record.actual_amount = record.amount - 5;
                record.remarks = i % 3 === 0 ? '预算超支' : '';
            } else {
                record.master_data_id = `MD_PROJECT_${30000 + i}`;
                record.budget = record.amount + 10;
                record.actual_amount = record.amount - 5;
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成财务数据
     */
    function generateFinancialData(count, isRaw) {
        const data = [];
        const subjects = ['办公费', '差旅费', '培训费', '设备采购', '维修费'];
        const departments = ['计算机学院', '经济管理学院', '外国语学院', '机械工程学院', '化学学院'];
        
        for (let i = 0; i < count; i++) {
            const amount = 1000 + (i * 500);
            const record = {
                id: 40000 + i,
                voucher_no: `V-2024-${String(i + 1).padStart(6, '0')}`,
                date: `2024-01-${String(1 + (i % 28)).padStart(2, '0')}`,
                account: `1001${String(i % 10)}`,
                subject: subjects[i % subjects.length],
                amount: amount,
                debit: i % 2 === 0 ? amount : 0,
                credit: i % 2 === 1 ? amount : 0,
                balance: amount * (i % 2 === 0 ? 1 : -1),
                department: departments[i % departments.length],
                project: i % 3 === 0 ? `PROC-2024-${String((i % 20) + 1).padStart(4, '0')}` : '',
                person: `张三${i % 10}`,
                summary: `${subjects[i % subjects.length]}支出`,
                created_at: '2024-01-10 08:00:00',
                updated_at: '2024-01-15 16:00:00'
            };
            
            if (isRaw) {
                record.source_system = '财务系统';
                record.source_id = `FIN_${40000 + i}`;
                record.status = i % 10 === 0 ? '待审核' : '已审核';
                record.auditor = i % 10 === 0 ? '' : `审核员${i % 5}`;
                record.audit_date = i % 10 === 0 ? '' : '2024-01-15 12:00:00';
            } else {
                record.status = '已审核';
                record.auditor = `审核员${i % 5}`;
                record.audit_date = '2024-01-15 12:00:00';
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成科研项目数据
     */
    function generateResearchData(count, isRaw) {
        const data = [];
        const projectTypes = ['国家自然科学基金', '省部级项目', '横向课题', '校级项目'];
        const statuses = ['进行中', '已结题', '延期', '暂停'];
        const departments = ['计算机学院', '经济管理学院', '化学学院', '机械工程学院'];
        
        for (let i = 0; i < count; i++) {
            const budget = 50 + (i * 20);
            const record = {
                id: 50000 + i,
                project_name: `${projectTypes[i % projectTypes.length]}-${i + 1}`,
                project_code: `RES-2024-${String(i + 1).padStart(4, '0')}`,
                leader: `研究员${i}`,
                department: departments[i % departments.length],
                budget: budget,
                actual_expense: budget * (0.5 + (i % 5) * 0.1),
                start_date: `2024-01-${String(1 + (i % 28)).padStart(2, '0')}`,
                end_date: `2025-12-${String(1 + (i % 28)).padStart(2, '0')}`,
                status: statuses[i % statuses.length],
                progress: 30 + (i % 70),
                created_at: '2024-01-05 09:00:00',
                updated_at: '2024-01-15 11:00:00'
            };
            
            if (isRaw) {
                record.source_system = '科研系统';
                record.source_id = `SCI_${50000 + i}`;
                record.remarks = i % 5 === 0 ? '预算执行偏差较大' : '';
            } else {
                record.master_data_id = `MD_RESEARCH_${50000 + i}`;
                record.remarks = '';
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成资产数据
     */
    function generateAssetData(count, isRaw) {
        const data = [];
        const categories = ['电子设备', '实验仪器', '办公家具', '车辆', '图书资料'];
        const statuses = ['在用', '闲置', '维修中', '报废'];
        const departments = ['计算机学院', '经济管理学院', '化学学院', '机械工程学院', '图书馆'];
        
        for (let i = 0; i < count; i++) {
            const price = 5 + (i * 2);
            const record = {
                id: 60000 + i,
                asset_name: `${categories[i % categories.length]}${i + 1}`,
                asset_code: `ASSET-${String(i + 1).padStart(6, '0')}`,
                category: categories[i % categories.length],
                purchase_date: `20${18 + (i % 7)}-0${1 + (i % 9)}-15`,
                purchase_price: price,
                department: departments[i % departments.length],
                custodian: `保管员${i % 10}`,
                location: `${departments[i % departments.length]}-${101 + i}室`,
                status: statuses[i % statuses.length],
                usage_rate: i % 4 === 0 ? 25 : 75 + (i % 20),
                last_check_date: '2024-01-10',
                created_at: '2023-01-01 10:00:00',
                updated_at: '2024-01-15 13:00:00'
            };
            
            if (isRaw) {
                record.source_system = '资产系统';
                record.source_id = `ASSET_SYS_${60000 + i}`;
                record.appraisal_price = price * 0.8;
                record.remarks = i % 6 === 0 ? '长期闲置' : '';
            } else {
                record.master_data_id = `MD_ASSET_${60000 + i}`;
                record.appraisal_price = price * 0.8;
                record.remarks = '';
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成合同数据
     */
    function generateContractData(count, isRaw) {
        const data = [];
        const contractTypes = ['采购合同', '服务合同', '建设合同', '技术合同'];
        const statuses = ['执行中', '已完成', '已终止', '待签署'];
        const departments = ['采购中心', '基建处', '科研处', '后勤处'];
        
        for (let i = 0; i < count; i++) {
            const record = {
                id: 70000 + i,
                contract_no: `CON-2024-${String(i + 1).padStart(5, '0')}`,
                contract_name: `${contractTypes[i % contractTypes.length]}${i + 1}`,
                supplier_id: 20000 + (i % 30),
                amount: 100 + (i * 50),
                sign_date: `2024-01-${String(1 + (i % 28)).padStart(2, '0')}`,
                start_date: `2024-02-01`,
                end_date: `2024-12-31`,
                department: departments[i % departments.length],
                person_in_charge: `负责人${i % 10}`,
                status: statuses[i % statuses.length],
                change_count: i % 5,
                created_at: '2024-01-01 09:00:00'
            };
            
            if (isRaw) {
                record.source_system = '合同系统';
                record.source_id = `CONTRACT_${70000 + i}`;
            } else {
                record.master_data_id = `MD_CONTRACT_${70000 + i}`;
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成招生数据
     */
    function generateAdmissionData(count, isRaw) {
        const data = [];
        const majors = ['计算机科学与技术', '软件工程', '经济学', '会计学', '机械工程', '化学工程'];
        const types = ['普通批次', '提前批', '艺术类', '体育类'];
        const provinces = ['北京', '上海', '广东', '江苏', '浙江', '山东', '河南', '四川'];
        
        for (let i = 0; i < count; i++) {
            const baseScore = 550 + (i % 100);
            const record = {
                id: 80000 + i,
                student_name: `学生${i}`,
                id_card: `${110000 + i}20${5 + (i % 3)}0101${1000 + i}`,
                admission_score: i % 10 === 0 ? baseScore - 15 : baseScore,
                major: majors[i % majors.length],
                admission_type: types[i % types.length],
                bonus_points: i % 5 === 0 ? 10 : 0,
                province: provinces[i % provinces.length],
                admission_date: '2024-07-15',
                status: '已录取',
                created_at: '2024-07-01 10:00:00'
            };
            
            if (isRaw) {
                record.source_system = '招生系统';
                record.source_id = `ADM_${80000 + i}`;
                record.remarks = i % 10 === 0 ? '分数异常' : '';
            } else {
                record.master_data_id = `MD_STUDENT_${80000 + i}`;
                record.remarks = '';
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成学生资助数据
     */
    function generateStudentAidData(count, isRaw) {
        const data = [];
        const aidTypes = ['国家奖学金', '国家励志奖学金', '国家助学金', '校级奖学金', '社会奖学金'];
        const statuses = ['已发放', '待发放', '审核中'];
        
        for (let i = 0; i < count; i++) {
            const aidType = aidTypes[i % aidTypes.length];
            let amount = 3000;
            if (aidType === '国家奖学金') amount = 8000;
            else if (aidType === '国家励志奖学金') amount = 5000;
            else if (aidType === '国家助学金') amount = 3000;
            else if (aidType === '校级奖学金') amount = 2000;
            
            const record = {
                id: 90000 + i,
                student_id: `STU${String(2024000 + i).padStart(10, '0')}`,
                student_name: `学生${i}`,
                aid_type: aidType,
                amount: i % 8 === 0 ? amount * 1.5 : amount,
                academic_year: '2023-2024',
                issue_date: `2024-0${1 + (i % 9)}-15`,
                status: statuses[i % statuses.length],
                created_at: '2024-01-01 10:00:00'
            };
            
            if (isRaw) {
                record.source_system = '学工系统';
                record.source_id = `AID_${90000 + i}`;
                record.remarks = i % 8 === 0 ? '金额超标' : '';
            } else {
                record.master_data_id = `MD_AID_${90000 + i}`;
                record.remarks = '';
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成人员家庭关系数据
     */
    function generateFamilyRelationData(count, isRaw) {
        const data = [];
        const relationTypes = ['配偶', '子女', '父母', '兄弟姐妹', '岳父母/公婆'];
        
        for (let i = 0; i < count; i++) {
            const record = {
                id: 100000 + i,
                person_id: 10000 + (i % 50),
                person_name: `张三${i % 50}`,
                person_id_card: `${110000 + (i % 50)}19800101${1000 + (i % 50)}`,
                related_person_id: 10000 + ((i + 10) % 50),
                related_person_name: `李四${(i + 10) % 50}`,
                related_person_id_card: `${110000 + ((i + 10) % 50)}19820101${1000 + ((i + 10) % 50)}`,
                relation_type: relationTypes[i % relationTypes.length],
                verified: i % 3 !== 0,
                data_source: '公安系统',
                created_at: '2024-01-01 10:00:00',
                updated_at: '2024-01-15 10:00:00'
            };
            
            if (isRaw) {
                record.source_system = '公安系统';
                record.source_id = `FAMILY_${100000 + i}`;
                record.remarks = i % 3 === 0 ? '待核实' : '';
            } else {
                record.master_data_id = `MD_FAMILY_${100000 + i}`;
                record.remarks = '';
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成企业股权关系数据
     */
    function generateEquityRelationData(count, isRaw) {
        const data = [];
        const positionTypes = ['法定代表人', '股东', '实际控制人', '董事', '监事', '高管'];
        
        for (let i = 0; i < count; i++) {
            const record = {
                id: 110000 + i,
                company_id: 20000 + (i % 30),
                company_name: `某某科技有限公司${i % 30}`,
                company_credit_code: `91110000${String(100000000 + (i % 30)).substring(0, 9)}`,
                person_id: 10000 + (i % 50),
                person_name: `张三${i % 50}`,
                person_id_card: `${110000 + (i % 50)}19800101${1000 + (i % 50)}`,
                position: positionTypes[i % positionTypes.length],
                equity_ratio: positionTypes[i % positionTypes.length] === '股东' ? (10 + (i % 40)) : null,
                start_date: `20${10 + (i % 15)}-01-01`,
                end_date: i % 10 === 0 ? `20${20 + (i % 5)}-12-31` : null,
                status: i % 10 === 0 ? '已退出' : '在任',
                data_source: '工商系统',
                created_at: '2024-01-01 10:00:00',
                updated_at: '2024-01-15 10:00:00'
            };
            
            if (isRaw) {
                record.source_system = '工商系统';
                record.source_id = `EQUITY_${110000 + i}`;
                record.remarks = '';
            } else {
                record.master_data_id = `MD_EQUITY_${110000 + i}`;
                record.remarks = '';
            }
            
            data.push(record);
        }
        
        return data;
    }

    /**
     * 生成关联关系预警数据
     */
    function generateRelationAlertData(count, isRaw) {
        const data = [];
        const alertTypes = ['采购人员-供应商关联', '审批人员-项目关联', '财务人员-供应商关联', '招生人员-考生关联'];
        const riskLevels = ['高', '中', '低'];
        const relationPaths = [
            '张三(采购经理) -> 配偶 -> 李四 -> 股东 -> 某某科技公司',
            '王五(审批人) -> 子女 -> 赵六 -> 法人 -> 某某建筑公司',
            '钱七(财务) -> 兄弟 -> 孙八 -> 实际控制人 -> 某某贸易公司',
            '周九(招生办) -> 配偶 -> 吴十 -> 父母 -> 考生郑十一'
        ];
        
        for (let i = 0; i < count; i++) {
            const record = {
                id: 120000 + i,
                alert_type: alertTypes[i % alertTypes.length],
                person_a_id: 10000 + (i % 50),
                person_a_name: `张三${i % 50}`,
                person_a_role: '采购经理',
                person_b_id: 10000 + ((i + 20) % 50),
                person_b_name: `李四${(i + 20) % 50}`,
                person_b_role: '供应商法人',
                company_id: 20000 + (i % 30),
                company_name: `某某科技有限公司${i % 30}`,
                relation_path: relationPaths[i % relationPaths.length],
                relation_depth: 2 + (i % 3),
                risk_level: riskLevels[i % riskLevels.length],
                confidence_score: 75 + (i % 25),
                related_procurement_id: 30000 + (i % 20),
                related_procurement_name: `采购项目${i % 20}`,
                procurement_amount: 100 + (i * 50),
                alert_date: `2024-01-${String(1 + (i % 28)).padStart(2, '0')}`,
                status: i % 3 === 0 ? '已核实' : '待核实',
                verification_result: i % 3 === 0 ? (i % 2 === 0 ? '确认关联' : '排除关联') : null,
                created_at: '2024-01-10 10:00:00',
                updated_at: '2024-01-15 10:00:00'
            };
            
            if (isRaw) {
                record.source_system = '关联分析系统';
                record.source_id = `ALERT_${120000 + i}`;
                record.remarks = i % 3 === 0 ? '' : '需人工核实';
            } else {
                record.master_data_id = `MD_ALERT_${120000 + i}`;
                record.remarks = '';
            }
            
            data.push(record);
        }
        
        return data;
    }

    // 数据查看服务
    window.dataViewerService = {
        /**
         * 获取统计信息
         */
        getStatistics: function() {
            const rawCount = dataTables.raw.length;
            const cleanedCount = dataTables.cleaned.length;
            const totalRecords = [...dataTables.raw, ...dataTables.cleaned]
                .reduce((sum, table) => sum + table.recordCount, 0);
            
            return {
                totalTables: rawCount + cleanedCount,
                rawTables: rawCount,
                cleanedTables: cleanedCount,
                totalRecords: totalRecords
            };
        },

        /**
         * 获取数据表列表
         */
        getTables: function(type) {
            return dataTables[type] || [];
        },

        /**
         * 获取数据表信息
         */
        getTableInfo: function(tableId) {
            const allTables = [...dataTables.raw, ...dataTables.cleaned];
            return allTables.find(t => t.id === tableId);
        },

        /**
         * 获取表数据
         */
        getTableData: function(tableId, page = 1, pageSize = 20, searchTerm = '') {
            const data = sampleData[tableId] || [];
            
            // 搜索过滤
            let filteredData = data;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filteredData = data.filter(record => {
                    return Object.values(record).some(value => 
                        String(value).toLowerCase().includes(term)
                    );
                });
            }
            
            // 分页
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const pageData = filteredData.slice(start, end);
            
            return {
                data: pageData,
                total: filteredData.length,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(filteredData.length / pageSize)
            };
        },

        /**
         * 获取记录详情
         */
        getRecordDetail: function(tableId, recordId) {
            const data = sampleData[tableId] || [];
            return data.find(r => r.id === recordId);
        },

        /**
         * 对比数据
         */
        compareData: function(rawTableId, cleanedTableId) {
            const rawData = sampleData[rawTableId] || [];
            const cleanedData = sampleData[cleanedTableId] || [];
            
            const rawCount = rawData.length;
            const cleanedCount = cleanedData.length;
            const removedCount = rawCount - cleanedCount;
            const cleanRate = rawCount > 0 ? ((cleanedCount / rawCount) * 100).toFixed(1) : 0;
            
            // 字段对比
            const rawTable = this.getTableInfo(rawTableId);
            const cleanedTable = this.getTableInfo(cleanedTableId);
            
            const rawFields = new Set(rawTable?.fields || []);
            const cleanedFields = new Set(cleanedTable?.fields || []);
            
            const addedFields = [...cleanedFields].filter(f => !rawFields.has(f));
            const removedFields = [...rawFields].filter(f => !cleanedFields.has(f));
            
            // 数据质量对比
            const qualityImprovements = [];
            if (rawTableId.includes('personnel')) {
                qualityImprovements.push({
                    field: 'data_quality_score',
                    rawValue: '平均 85 分',
                    cleanedValue: '平均 95 分',
                    improvement: '+10 分'
                });
                qualityImprovements.push({
                    field: '重复数据',
                    rawValue: '70 条',
                    cleanedValue: '0 条',
                    improvement: '已清理'
                });
            }
            
            return {
                statistics: {
                    rawCount,
                    cleanedCount,
                    removedCount,
                    cleanRate
                },
                fieldChanges: {
                    added: addedFields,
                    removed: removedFields
                },
                qualityImprovements
            };
        },

        /**
         * 导出数据
         */
        exportData: function(tableId, format = 'csv') {
            const data = sampleData[tableId] || [];
            const table = this.getTableInfo(tableId);
            
            if (format === 'csv') {
                // 生成CSV
                const headers = table.fields.join(',');
                const rows = data.map(record => 
                    table.fields.map(field => record[field] || '').join(',')
                );
                
                return {
                    success: true,
                    data: [headers, ...rows].join('\n'),
                    filename: `${table.name}_${new Date().getTime()}.csv`
                };
            }
            
            return {
                success: false,
                error: '不支持的导出格式'
            };
        }
    };

})();

