// ==================== 第一议题监督数据 ====================

// 异常单位数据
const abnormalUnitsData = [
    {
        unitId: 'UNIT-001',
        unit: '计算机学院',
        actualCount: 2,
        requiredCount: 4,
        missing: 2,
        risk: 'high',
        responsible: '张三',
        responsibleTitle: '党委书记',
        phone: '138****1234',
        lastStudyDate: '2025-09-15',
        missingTopics: [
            '学习习近平总书记关于科技创新的重要论述',
            '学习党的二十大报告关于教育科技人才的论述'
        ],
        reason: '因学院工作繁忙，部分会议未能按时召开',
        plan: '计划在11月补齐缺失的学习内容，加强会议组织管理'
    },
    {
        unitId: 'UNIT-002',
        unit: '经济管理学院',
        actualCount: 3,
        requiredCount: 4,
        missing: 1,
        risk: 'medium',
        responsible: '李四',
        responsibleTitle: '党委书记',
        phone: '139****5678',
        lastStudyDate: '2025-10-15',
        missingTopics: [
            '学习中央经济工作会议精神'
        ],
        reason: '10月份有重要学术会议，调整了部分党委会议安排',
        plan: '已安排在10月底补学'
    },
    {
        unitId: 'UNIT-003',
        unit: '外国语学院',
        actualCount: 2,
        requiredCount: 4,
        missing: 2,
        risk: 'high',
        responsible: '王五',
        responsibleTitle: '党委书记',
        phone: '136****9012',
        lastStudyDate: '2025-10-12',
        missingTopics: [
            '学习习近平总书记关于文化建设的重要论述',
            '学习全国宣传思想文化工作会议精神'
        ],
        reason: '学院党委书记外出学习，部分会议延期',
        plan: '书记已返校，将在近期组织补学'
    },
    {
        unitId: 'UNIT-004',
        unit: '机械工程学院',
        actualCount: 3,
        requiredCount: 4,
        missing: 1,
        risk: 'medium',
        responsible: '赵六',
        responsibleTitle: '党委书记',
        phone: '137****3456',
        lastStudyDate: '2025-10-10',
        missingTopics: [
            '学习习近平总书记关于制造强国的重要论述'
        ],
        reason: '学院承办全国性学术会议，会议安排较紧',
        plan: '会议结束后立即安排补学'
    },
    {
        unitId: 'UNIT-005',
        unit: '化学化工学院',
        actualCount: 1,
        requiredCount: 4,
        missing: 3,
        risk: 'high',
        responsible: '孙七',
        responsibleTitle: '党委书记',
        phone: '135****7890',
        lastStudyDate: '2025-10-08',
        missingTopics: [
            '学习习近平总书记关于生态文明建设的重要论述',
            '学习党的二十大报告关于绿色发展的论述',
            '学习中央环保督察工作要求'
        ],
        reason: '学院实验室安全整改工作占用较多时间',
        plan: '整改工作已基本完成，将集中补齐学习内容'
    }
];

// 会议纪要分析数据
const minutesAnalysisData = [
    {
        recordId: 'RECORD-001',
        date: '2025-10-18',
        unit: '计算机学院',
        unitId: 'UNIT-001',
        topic: '党委会第10次会议',
        content: '学习习近平总书记关于教育工作的重要论述',
        duration: 45,
        result: '正常',
        participants: ['张三（书记）', '李明（副书记）', '王芳（组织委员）', '刘强（宣传委员）', '陈静（纪检委员）'],
        keyPoints: [
            '深入学习习近平总书记关于教育工作的重要论述',
            '讨论如何将总书记讲话精神贯彻到学院工作中',
            '研究制定学院人才培养改革方案',
            '部署下一阶段重点工作'
        ],
        studyMaterials: [
            '《习近平总书记关于教育的重要论述摘编》',
            '《求是》杂志相关文章',
            '教育部学习材料'
        ],
        discussion: '与会同志围绕总书记讲话精神进行了深入讨论，一致认为要坚持立德树人根本任务，培养德智体美劳全面发展的社会主义建设者和接班人。',
        nextStep: '要求各系部结合实际制定具体落实措施，下次会议进行汇报交流。'
    },
    {
        recordId: 'RECORD-002',
        date: '2025-10-15',
        unit: '经济管理学院',
        unitId: 'UNIT-002',
        topic: '党委会第9次会议',
        content: '学习党的二十大精神',
        duration: 50,
        result: '正常',
        participants: ['李四（书记）', '张伟（副书记）', '赵敏（组织委员）', '孙丽（宣传委员）', '周杰（纪检委员）'],
        keyPoints: [
            '系统学习党的二十大报告',
            '重点学习关于经济建设的重要论述',
            '研究学院如何服务国家经济发展战略',
            '讨论学科建设和人才培养方向'
        ],
        studyMaterials: [
            '党的二十大报告',
            '党的二十大报告辅导读本',
            '经济日报相关评论文章'
        ],
        discussion: '大家一致表示要深刻领会党的二十大精神，把思想和行动统一到党中央决策部署上来，为建设社会主义现代化国家贡献力量。',
        nextStep: '组织全院师生开展专题学习，将二十大精神融入教学科研工作。'
    },
    {
        recordId: 'RECORD-003',
        date: '2025-10-12',
        unit: '外国语学院',
        unitId: 'UNIT-003',
        topic: '党委会第8次会议',
        content: '学习中央经济工作会议精神',
        duration: 30,
        result: '时长偏短',
        participants: ['王五（书记）', '李娜（副书记）', '张华（组织委员）'],
        keyPoints: [
            '学习中央经济工作会议主要精神',
            '讨论学院如何做好外语人才培养工作'
        ],
        studyMaterials: [
            '中央经济工作会议公报',
            '人民日报评论员文章'
        ],
        discussion: '简要学习了会议精神，但讨论不够深入。',
        nextStep: '需要组织更深入的学习讨论。',
        issues: ['学习时长不足30分钟，未达到规定要求', '参会人员不齐，缺少部分委员', '学习讨论不够深入']
    },
    {
        recordId: 'RECORD-004',
        date: '2025-10-10',
        unit: '机械工程学院',
        unitId: 'UNIT-004',
        topic: '党委会第11次会议',
        content: '学习全国教育大会精神',
        duration: 55,
        result: '正常',
        participants: ['赵六（书记）', '钱七（副书记）', '孙八（组织委员）', '李九（宣传委员）', '周十（纪检委员）', '吴十一（统战委员）'],
        keyPoints: [
            '全面学习全国教育大会精神',
            '深入讨论新时代工程教育改革',
            '研究学院"新工科"建设方案',
            '部署产教融合工作'
        ],
        studyMaterials: [
            '全国教育大会文件汇编',
            '教育部关于新工科建设的指导意见',
            '工程教育认证标准'
        ],
        discussion: '与会同志结合学院实际，就如何推进新工科建设、深化产教融合进行了热烈讨论，提出了许多建设性意见。',
        nextStep: '成立新工科建设工作组，制定详细实施方案，下月提交党委会审议。'
    },
    {
        recordId: 'RECORD-005',
        date: '2025-10-08',
        unit: '化学化工学院',
        unitId: 'UNIT-005',
        topic: '党委会第7次会议',
        content: '学习党章党规',
        duration: 40,
        result: '正常',
        participants: ['孙七（书记）', '郑十二（副书记）', '王十三（组织委员）', '李十四（宣传委员）'],
        keyPoints: [
            '学习新修订的党章',
            '学习党内重要法规',
            '讨论加强党员教育管理',
            '研究党风廉政建设工作'
        ],
        studyMaterials: [
            '中国共产党章程',
            '中国共产党廉洁自律准则',
            '中国共产党纪律处分条例'
        ],
        discussion: '大家认真学习了党章党规，表示要严格遵守党的纪律规矩，做合格党员。',
        nextStep: '在全院党员中开展党章党规学习教育活动。'
    }
];

// ==================== 加载函数 ====================

// 加载第一议题监督模块
function loadFirstTopicModule() {
    loadFirstTopicStats();
    loadAbnormalUnits();
    loadMinutesAnalysis();
}

// 加载第一议题统计数据
function loadFirstTopicStats() {
    const stats = {
        monthlyStudyCount: 156,
        coveredUnits: 42,
        abnormalUnits: abnormalUnitsData.length,
        avgDuration: 45
    };

    document.getElementById('monthlyStudyCount').textContent = stats.monthlyStudyCount;
    document.getElementById('coveredUnits').textContent = stats.coveredUnits;
    document.getElementById('abnormalUnits').textContent = stats.abnormalUnits;
    document.getElementById('avgDuration').textContent = stats.avgDuration + '分钟';
}

// 加载异常单位清单
function loadAbnormalUnits() {
    const tbody = document.querySelector('#abnormalUnitsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = abnormalUnitsData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.actualCount}</td>
            <td>${item.requiredCount}</td>
            <td class="text-red-600 font-medium">${item.missing}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>${item.responsible}</td>
            <td>
                <button class="action-btn action-btn-primary mr-2" onclick="viewUnitDetail('${item.unitId}')">
                    <i class="fas fa-eye"></i> 查看
                </button>
                <button class="action-btn action-btn-secondary" onclick="sendReminder('${item.unitId}')">
                    <i class="fas fa-bell"></i> 提醒
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载会议纪要分析结果
function loadMinutesAnalysis() {
    const tbody = document.querySelector('#minutesAnalysisTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = minutesAnalysisData.map(item => `
        <tr>
            <td>${item.date}</td>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.topic}</td>
            <td>${item.content}</td>
            <td>${item.duration}分钟</td>
            <td>
                <span class="${item.result === '正常' ? 'text-green-600' : 'text-yellow-600'}">
                    ${item.result}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewMinutesDetail('${item.recordId}')">
                    <i class="fas fa-file-alt"></i> 查看纪要
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== 详情函数 ====================

// 查看单位详情
function viewUnitDetail(unitId) {
    const unit = abnormalUnitsData.find(u => u.unitId === unitId);
    if (!unit) {
        Toast.error('未找到单位信息');
        return;
    }
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (unit.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (unit.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建缺失议题列表
    const missingTopicsHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 缺失的学习议题
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${unit.missingTopics.map(topic => `<li><strong>${topic}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0 0 8px 0; color: #991B1B; font-size: 13px;">
                    <strong>原因说明：</strong>${unit.reason}
                </p>
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>整改计划：</strong>${unit.plan}
                </p>
            </div>
        </div>
    `;
    
    showDetailModal('异常单位详情', unit.unit, {
        '单位信息': {
            '单位名称': unit.unit,
            '责任人': `${unit.responsible}（${unit.responsibleTitle}）`,
            '联系电话': unit.phone,
            '最后学习日期': unit.lastStudyDate
        },
        '学习情况': {
            '本月实际学习次数': `${unit.actualCount}次`,
            '本月要求学习次数': `${unit.requiredCount}次`,
            '缺失次数': `<span style="color: #DC2626; font-weight: 600;">${unit.missing}次</span>`,
            '风险等级': riskBadge
        },
        '缺失议题与整改': missingTopicsHtml
    });
}

// 查看会议纪要详情
function viewMinutesDetail(recordId) {
    const record = minutesAnalysisData.find(r => r.recordId === recordId);
    if (!record) {
        Toast.error('未找到会议纪要');
        return;
    }
    
    // 构建参会人员列表
    const participantsHtml = `
        <div style="margin-top: 8px;">
            <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                <strong>参会人员：</strong>
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                ${record.participants.map(p => `<span style="background: #EFF6FF; color: #1E40AF; padding: 4px 12px; border-radius: 12px; font-size: 13px;">${p}</span>`).join('')}
            </div>
        </div>
    `;
    
    // 构建会议要点
    const keyPointsHtml = `
        <div style="margin-top: 8px;">
            <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                <strong>会议要点：</strong>
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px; line-height: 1.8;">
                ${record.keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 构建学习材料
    const materialsHtml = `
        <div style="margin-top: 8px;">
            <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                <strong>学习材料：</strong>
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #059669; font-size: 13px; line-height: 1.8; font-weight: 600;">
                ${record.studyMaterials.map(material => `<li>${material}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 构建问题清单（如有）
    let issuesHtml = '';
    if (record.issues && record.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${record.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    showDetailModal('会议纪要详情', `${record.unit} - ${record.topic}`, {
        '会议信息': {
            '会议日期': record.date,
            '单位名称': record.unit,
            '会议主题': record.topic,
            '学习内容': record.content,
            '学习时长': `${record.duration}分钟`,
            '分析结果': `<span class="${record.result === '正常' ? 'text-green-600' : 'text-yellow-600'}">${record.result}</span>`
        },
        '参会情况': participantsHtml,
        '会议要点': keyPointsHtml,
        '学习材料': materialsHtml,
        '讨论情况': record.discussion,
        '下一步工作': record.nextStep,
        '问题清单': issuesHtml || '<p style="color: #059669; margin-top: 16px;"><i class="fas fa-check-circle"></i> 未发现问题</p>'
    });
}

// 发送提醒
function sendReminder(unitId) {
    const unit = abnormalUnitsData.find(u => u.unitId === unitId);
    if (!unit) {
        Toast.error('未找到单位信息');
        return;
    }
    
    // 这里可以实现实际的提醒功能
    Toast.success(`已向${unit.unit}（${unit.responsible}）发送学习提醒`);
}
