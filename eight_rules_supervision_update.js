// 隐蔽吃喝识别数据
const hiddenDiningData = [
    {
        unit: '机关办公室',
        unitId: 'EIGHT-001',
        person: '张某',
        personId: 'P001',
        project: '办公用品采购',
        actual: '餐饮消费',
        amount: 8500,
        date: '2025-10-18',
        risk: 'high',
        merchant: '某高档餐厅',
        invoiceNo: 'FP20251018001',
        participants: 8,
        evidence: [
            '报销项目为办公用品，但发票为餐饮发票',
            '消费金额较大，人均超过1000元',
            '消费时间为晚上，非工作时间',
            '商家为高档餐厅，不符合接待标准'
        ],
        suggestedAction: '要求退回违规报销款项，对相关责任人进行诫勉谈话，加强财务报销审核'
    },
    {
        unit: '后勤服务中心',
        unitId: 'EIGHT-002',
        person: '李某',
        personId: 'P002',
        project: '会议费',
        actual: '高档餐厅消费',
        amount: 12000,
        date: '2025-10-15',
        risk: 'high',
        merchant: '某五星级酒店餐厅',
        invoiceNo: 'FP20251015002',
        participants: 10,
        evidence: [
            '以会议费名义报销，但无会议记录',
            '消费地点为五星级酒店，超出接待标准',
            '人均消费1200元，明显超标',
            '发票内容包含高档酒水'
        ],
        suggestedAction: '追回违规报销款项，对责任人进行党纪处分，通报批评'
    },
    {
        unit: '学生工作处',
        unitId: 'EIGHT-003',
        person: '王某',
        personId: 'P003',
        project: '培训费',
        actual: '餐饮娱乐',
        amount: 6800,
        date: '2025-10-12',
        risk: 'medium',
        merchant: '某餐饮娱乐会所',
        invoiceNo: 'FP20251012003',
        participants: 6,
        evidence: [
            '培训费报销中包含餐饮和娱乐费用',
            '消费地点为娱乐会所，不符合规定',
            '无培训相关资料和签到记录'
        ],
        suggestedAction: '要求退回不合规费用，加强培训费用管理'
    },
    {
        unit: '科研处',
        unitId: 'EIGHT-004',
        person: '赵某',
        personId: 'P004',
        project: '差旅费',
        actual: '餐饮消费',
        amount: 5200,
        date: '2025-10-10',
        risk: 'medium',
        merchant: '某特色餐厅',
        invoiceNo: 'FP20251010004',
        participants: 4,
        evidence: [
            '差旅费中餐饮费用超出标准',
            '消费地点与出差地点不符',
            '人均消费超过差旅餐饮补助标准'
        ],
        suggestedAction: '要求补充说明并退回超标部分，加强差旅费审核'
    }
];

// 公车轨迹监控数据
const vehicleTrackData = [
    {
        plate: '京A12345',
        vehicleId: 'VEH-001',
        dept: '机关办公室',
        driver: '张某某',
        time: '2025-10-20 19:30',
        location: '某高档会所',
        address: '朝阳区某某路88号',
        type: '非工作时间使用',
        risk: 'high',
        duration: '2小时30分钟',
        mileage: 25,
        trackPoints: [
            { time: '19:30', location: '学校出发' },
            { time: '19:50', location: '到达会所' },
            { time: '22:00', location: '离开会所' },
            { time: '22:20', location: '返回学校' }
        ],
        evidence: [
            '非工作时间使用公车（19:30-22:20）',
            '目的地为高档会所，非公务场所',
            '停留时间长达2小时30分钟',
            '无公务出行审批记录'
        ],
        suggestedAction: '对驾驶员和审批人进行问责，追究私用公车责任，加强公车管理'
    },
    {
        plate: '京B67890',
        vehicleId: 'VEH-002',
        dept: '后勤服务中心',
        driver: '李某某',
        time: '2025-10-19 14:20',
        location: '某景区',
        address: '怀柔区某某景区',
        type: '工作时间私用',
        risk: 'high',
        duration: '4小时',
        mileage: 80,
        trackPoints: [
            { time: '14:20', location: '学校出发' },
            { time: '15:30', location: '到达景区' },
            { time: '18:30', location: '离开景区' },
            { time: '19:40', location: '返回学校' }
        ],
        evidence: [
            '工作时间驾驶公车前往景区',
            '停留时间长达3小时',
            '行驶里程80公里，明显超出正常公务范围',
            '无相关公务活动记录'
        ],
        suggestedAction: '严肃处理私用公车行为，追缴相关费用，给予纪律处分'
    },
    {
        plate: '京C11111',
        vehicleId: 'VEH-003',
        dept: '学生工作处',
        driver: '王某某',
        time: '2025-10-18 21:00',
        location: '某娱乐场所',
        address: '海淀区某某街99号',
        type: '非工作时间使用',
        risk: 'high',
        duration: '3小时',
        mileage: 30,
        trackPoints: [
            { time: '21:00', location: '学校出发' },
            { time: '21:20', location: '到达娱乐场所' },
            { time: '00:00', location: '离开娱乐场所' },
            { time: '00:20', location: '返回学校' }
        ],
        evidence: [
            '深夜使用公车（21:00-00:20）',
            '目的地为娱乐场所',
            '停留时间长达3小时',
            '严重违反公车使用规定'
        ],
        suggestedAction: '严肃查处违规行为，给予党纪政纪处分，通报批评'
    },
    {
        plate: '京D22222',
        vehicleId: 'VEH-004',
        dept: '科研处',
        driver: '赵某某',
        time: '2025-10-17 12:30',
        location: '某高档餐厅',
        address: '西城区某某大厦',
        type: '午餐时间异常',
        risk: 'medium',
        duration: '2小时',
        mileage: 15,
        trackPoints: [
            { time: '12:30', location: '学校出发' },
            { time: '12:45', location: '到达餐厅' },
            { time: '14:30', location: '离开餐厅' },
            { time: '14:45', location: '返回学校' }
        ],
        evidence: [
            '午餐时间使用公车前往高档餐厅',
            '停留时间2小时，超出正常午餐时间',
            '餐厅消费水平较高'
        ],
        suggestedAction: '核实公务用车情况，如属私用需追究责任'
    },
    {
        plate: '京E33333',
        vehicleId: 'VEH-005',
        dept: '教务处',
        driver: '孙某某',
        time: '2025-10-16 周末',
        location: '某商场',
        address: '朝阳区某某购物中心',
        type: '周末私用',
        risk: 'medium',
        duration: '3小时',
        mileage: 20,
        trackPoints: [
            { time: '10:00', location: '学校出发' },
            { time: '10:20', location: '到达商场' },
            { time: '13:00', location: '离开商场' },
            { time: '13:20', location: '返回学校' }
        ],
        evidence: [
            '周末使用公车前往商场',
            '无公务活动安排',
            '明显属于私人用途'
        ],
        suggestedAction: '对周末私用公车行为进行处理，加强节假日公车管理'
    }
];

// 礼品票据筛查数据
const giftReceiptData = [
    {
        unit: '机关办公室',
        unitId: 'GIFT-001',
        person: '孙某',
        personId: 'P005',
        content: '高档烟酒',
        amount: 15000,
        merchant: '某烟酒专卖店',
        merchantAddress: '某某区某某路',
        reason: '高档烟酒采购',
        risk: 'high',
        date: '2025-10-18',
        invoiceNo: 'FP20251018005',
        items: [
            { name: '某品牌白酒', quantity: 10, unitPrice: 1000, total: 10000 },
            { name: '某品牌香烟', quantity: 20, unitPrice: 250, total: 5000 }
        ],
        evidence: [
            '采购高档烟酒，单价过高',
            '数量较大，超出正常接待需求',
            '无相关接待审批手续',
            '违反禁止公款购买高档烟酒规定'
        ],
        suggestedAction: '立即停止违规采购，追回已购烟酒或款项，对责任人进行严肃处理'
    },
    {
        unit: '外事办公室',
        unitId: 'GIFT-002',
        person: '周某',
        personId: 'P006',
        content: '礼品卡',
        amount: 20000,
        merchant: '某商场',
        merchantAddress: '某某区某某广场',
        reason: '大额礼品卡采购',
        risk: 'high',
        date: '2025-10-15',
        invoiceNo: 'FP20251015006',
        items: [
            { name: '购物卡', quantity: 20, unitPrice: 1000, total: 20000 }
        ],
        evidence: [
            '大额采购礼品卡，用途不明',
            '无具体使用计划和审批',
            '存在变相发放福利嫌疑',
            '违反禁止发放购物卡规定'
        ],
        suggestedAction: '追回礼品卡，调查使用去向，对违规发放行为严肃处理'
    },
    {
        unit: '后勤服务中心',
        unitId: 'GIFT-003',
        person: '吴某',
        personId: 'P007',
        content: '高档茶叶',
        amount: 8000,
        merchant: '某茶叶店',
        merchantAddress: '某某区某某街',
        reason: '高档茶叶采购',
        risk: 'medium',
        date: '2025-10-12',
        invoiceNo: 'FP20251012007',
        items: [
            { name: '某品牌茶叶', quantity: 4, unitPrice: 2000, total: 8000 }
        ],
        evidence: [
            '采购高档茶叶，单价过高',
            '超出正常办公用品标准',
            '缺少采购审批手续'
        ],
        suggestedAction: '核实采购用途，如属违规需追回款项并处理'
    },
    {
        unit: '科研处',
        unitId: 'GIFT-004',
        person: '郑某',
        personId: 'P008',
        content: '工艺品',
        amount: 12000,
        merchant: '某工艺品店',
        merchantAddress: '某某区某某路',
        reason: '高价工艺品采购',
        risk: 'medium',
        date: '2025-10-10',
        invoiceNo: 'FP20251010008',
        items: [
            { name: '某工艺品', quantity: 3, unitPrice: 4000, total: 12000 }
        ],
        evidence: [
            '采购高价工艺品，用途不明',
            '单价较高，超出合理范围',
            '可能用于送礼'
        ],
        suggestedAction: '核实采购用途和去向，如属送礼需严肃处理'
    },
    {
        unit: '学生工作处',
        unitId: 'GIFT-005',
        person: '钱某',
        personId: 'P009',
        content: '购物卡',
        amount: 10000,
        merchant: '某超市',
        merchantAddress: '某某区某某商业街',
        reason: '购物卡采购',
        risk: 'high',
        date: '2025-10-08',
        invoiceNo: 'FP20251008009',
        items: [
            { name: '超市购物卡', quantity: 10, unitPrice: 1000, total: 10000 }
        ],
        evidence: [
            '采购购物卡，违反规定',
            '可能用于变相发放福利',
            '无合理用途说明'
        ],
        suggestedAction: '追回购物卡，调查发放情况，对违规行为进行处理'
    }
];

// 加载隐蔽吃喝识别
function loadHiddenDiningDetection() {
    const tbody = document.querySelector('#hiddenDiningTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = hiddenDiningData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.person}</td>
            <td>${item.project}</td>
            <td class="text-red-600">${item.actual}</td>
            <td class="font-medium">¥${formatNumber(item.amount)}</td>
            <td>${item.date}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewDiningDetail('${item.unitId}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载公车轨迹监控
function loadVehicleTrackMonitoring() {
    const tbody = document.querySelector('#vehicleTrackTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = vehicleTrackData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.plate}</td>
            <td>${item.dept}</td>
            <td>${item.time}</td>
            <td class="text-red-600">${item.location}</td>
            <td>${item.type}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewTrackDetail('${item.vehicleId}')">
                    <i class="fas fa-map-marked-alt"></i> 轨迹
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载礼品票据筛查
function loadGiftReceiptScreening() {
    const tbody = document.querySelector('#giftReceiptTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = giftReceiptData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.person}</td>
            <td>${item.content}</td>
            <td class="font-medium">¥${formatNumber(item.amount)}</td>
            <td>${item.merchant}</td>
            <td class="text-red-600">${item.reason}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewReceiptDetail('${item.unitId}')">
                    <i class="fas fa-file-invoice"></i> 查看
                </button>
            </td>
        </tr>
    `).join('');
}

// 查看隐蔽吃喝详情
function viewDiningDetail(unitId) {
    const dining = hiddenDiningData.find(d => d.unitId === unitId);
    if (!dining) {
        Toast.error('未找到吃喝信息');
        return;
    }
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (dining.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (dining.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建证据列表
    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 违规证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${dining.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${dining.suggestedAction}
                </p>
            </div>
        </div>
    `;
    
    showDetailModal('隐蔽吃喝详情', `${dining.person} - ${dining.date}`, {
        '报销信息': {
            '报销人': dining.person,
            '所属单位': dining.unit,
            '报销项目': dining.project,
            '报销日期': dining.date,
            '报销金额': `<span style="color: #DC2626; font-weight: 600;">¥${formatNumber(dining.amount)}</span>`
        },
        '实际消费': {
            '实际用途': `<span style="color: #DC2626; font-weight: 600;">${dining.actual}</span>`,
            '消费商家': dining.merchant,
            '发票号码': dining.invoiceNo,
            '参与人数': `${dining.participants}人`,
            '人均消费': `¥${formatNumber(Math.round(dining.amount / dining.participants))}`,
            '风险等级': riskBadge
        },
        '违规证据与建议': evidenceHtml
    });
}

// 查看公车轨迹详情
function viewTrackDetail(vehicleId) {
    const track = vehicleTrackData.find(t => t.vehicleId === vehicleId);
    if (!track) {
        Toast.error('未找到轨迹信息');
        return;
    }
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (track.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (track.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建轨迹点表格
    const trackPointsHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>时间</th>
                    <th>位置</th>
                </tr>
            </thead>
            <tbody>
                ${track.trackPoints.map(point => `
                    <tr>
                        <td>${point.time}</td>
                        <td>${point.location}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // 构建证据列表
    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 违规证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${track.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${track.suggestedAction}
                </p>
            </div>
        </div>
    `;
    
    showDetailModal('公车轨迹详情', `${track.plate} - ${track.time}`, {
        '车辆信息': {
            '车牌号': track.plate,
            '所属部门': track.dept,
            '驾驶员': track.driver,
            '出行时间': track.time
        },
        '轨迹信息': {
            '目的地': `<span style="color: #DC2626; font-weight: 600;">${track.location}</span>`,
            '详细地址': track.address,
            '违规类型': track.type,
            '停留时长': track.duration,
            '行驶里程': `${track.mileage}公里`,
            '风险等级': riskBadge
        },
        '行驶轨迹': trackPointsHtml,
        '违规证据与建议': evidenceHtml
    });
}

// 查看礼品票据详情
function viewReceiptDetail(unitId) {
    const receipt = giftReceiptData.find(r => r.unitId === unitId);
    if (!receipt) {
        Toast.error('未找到票据信息');
        return;
    }
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (receipt.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (receipt.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建采购明细表格
    const itemsHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>物品名称</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>小计</th>
                </tr>
            </thead>
            <tbody>
                ${receipt.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>¥${formatNumber(item.unitPrice)}</td>
                        <td style="color: #DC2626; font-weight: 600;">¥${formatNumber(item.total)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // 构建证据列表
    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 违规证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${receipt.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${receipt.suggestedAction}
                </p>
            </div>
        </div>
    `;
    
    showDetailModal('礼品票据详情', `${receipt.person} - ${receipt.content}`, {
        '采购信息': {
            '采购人': receipt.person,
            '所属单位': receipt.unit,
            '采购内容': receipt.content,
            '采购日期': receipt.date,
            '采购金额': `<span style="color: #DC2626; font-weight: 600;">¥${formatNumber(receipt.amount)}</span>`
        },
        '商家信息': {
            '商家名称': receipt.merchant,
            '商家地址': receipt.merchantAddress,
            '发票号码': receipt.invoiceNo,
            '违规原因': `<span style="color: #DC2626; font-weight: 600;">${receipt.reason}</span>`,
            '风险等级': riskBadge
        },
        '采购明细': itemsHtml,
        '违规证据与建议': evidenceHtml
    });
}
