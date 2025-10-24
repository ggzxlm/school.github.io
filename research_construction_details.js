// 科研经费监督 - 查看发票详情
function viewInvoiceDetail(projectNo) {
    const invoice = serialInvoiceData.find(i => i.projectNo === projectNo);
    if (!invoice) {
        Toast.error('未找到发票信息');
        return;
    }
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (invoice.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (invoice.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 生成发票明细表格
    const invoiceDetails = [];
    const avgAmount = (invoice.amount / invoice.count).toFixed(2);
    for (let i = 0; i < invoice.count; i++) {
        const invoiceNo = parseInt(invoice.invoiceStart) + i;
        invoiceDetails.push(`
            <tr>
                <td>No.${invoiceNo}</td>
                <td>¥${formatNumber(avgAmount)}</td>
                <td>办公用品/耗材</td>
                <td>${invoice.date}</td>
            </tr>
        `);
    }
    
    // 构建问题清单
    let issuesHtml = '';
    if (invoice.issues && invoice.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 风险分析
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${invoice.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                    <p style="margin: 0; color: #991B1B; font-size: 13px;">
                        <strong>处理建议：</strong>需核实采购真实性，检查是否存在虚开发票、虚假报销等问题
                    </p>
                </div>
            </div>
        `;
    }
    
    // 发票明细表格HTML
    const invoiceTableHtml = `
        <div style="margin-top: 16px;">
            <h4 style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 12px;">发票明细</h4>
            <table class="data-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>发票号</th>
                        <th>金额</th>
                        <th>内容</th>
                        <th>日期</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceDetails.join('')}
                </tbody>
            </table>
        </div>
    `;
    
    showDetailModal('连号发票详情', invoice.project, {
        '项目信息': {
            '项目名称': invoice.project,
            '项目编号': invoice.projectNo,
            '项目负责人': invoice.leader,
            '所属学院': invoice.college,
            '项目总经费': `¥${formatNumber(invoice.totalBudget)}`
        },
        '连号发票信息': {
            '发票号段': invoice.invoiceRange,
            '发票数量': `${invoice.count}张`,
            '总金额': `¥${formatNumber(invoice.amount)}`,
            '开票日期': invoice.date,
            '开票单位': invoice.vendor,
            '纳税人识别号': invoice.vendorTaxNo,
            '风险等级': riskBadge
        },
        '发票明细': invoiceTableHtml,
        '风险分析': issuesHtml
    });
}

// 科研经费监督 - 查看预算详情
function viewBudgetDetail(projectNo) {
    const budget = budgetDeviationData.find(b => b.projectNo === projectNo);
    if (!budget) {
        Toast.error('未找到预算信息');
        return;
    }
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (budget.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (budget.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建预算明细表格
    const budgetBreakdownHtml = `
        <div style="margin-top: 16px;">
            <h4 style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 12px;">预算明细</h4>
            <table class="data-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>科目</th>
                        <th>预算金额</th>
                        <th>已执行</th>
                        <th>执行率</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>设备费</td>
                        <td>¥${formatNumber(budget.budgetBreakdown.equipment.budget)}</td>
                        <td>¥${formatNumber(budget.budgetBreakdown.equipment.executed)}</td>
                        <td style="color: ${budget.budgetBreakdown.equipment.rate < 50 ? '#DC2626' : '#059669'};">${budget.budgetBreakdown.equipment.rate}%</td>
                    </tr>
                    <tr>
                        <td>材料费</td>
                        <td>¥${formatNumber(budget.budgetBreakdown.materials.budget)}</td>
                        <td>¥${formatNumber(budget.budgetBreakdown.materials.executed)}</td>
                        <td style="color: ${budget.budgetBreakdown.materials.rate < 50 ? '#DC2626' : '#059669'};">${budget.budgetBreakdown.materials.rate}%</td>
                    </tr>
                    <tr>
                        <td>劳务费</td>
                        <td>¥${formatNumber(budget.budgetBreakdown.labor.budget)}</td>
                        <td>¥${formatNumber(budget.budgetBreakdown.labor.executed)}</td>
                        <td style="color: ${budget.budgetBreakdown.labor.rate < 50 ? '#DC2626' : '#059669'};">${budget.budgetBreakdown.labor.rate}%</td>
                    </tr>
                    <tr>
                        <td>其他费用</td>
                        <td>¥${formatNumber(budget.budgetBreakdown.other.budget)}</td>
                        <td>¥${formatNumber(budget.budgetBreakdown.other.executed)}</td>
                        <td style="color: ${budget.budgetBreakdown.other.rate < 50 ? '#DC2626' : '#059669'};">${budget.budgetBreakdown.other.rate}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // 构建问题清单或合规评价
    let issuesHtml = '';
    if (budget.issues && budget.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${budget.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                    <p style="margin: 0; color: #991B1B; font-size: 13px;">
                        <strong>处理建议：</strong>需核查项目实际进展情况，分析预算执行偏离原因，督促项目组合理使用经费
                    </p>
                </div>
            </div>
        `;
    } else {
        issuesHtml = `
            <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; margin-top: 16px;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                    <i class="fas fa-check-circle" style="color: #10B981; margin-right: 8px;"></i>
                    <strong>该项目预算执行情况正常，与项目进度基本匹配。</strong>
                </p>
            </div>
        `;
    }
    
    showDetailModal('预算执行偏离度分析', budget.project, {
        '项目信息': {
            '项目名称': budget.project,
            '项目编号': budget.projectNo,
            '项目负责人': budget.leader,
            '所属学院': budget.college,
            '项目周期': `${budget.startDate} 至 ${budget.endDate}`
        },
        '预算执行情况': {
            '预算总额': `¥${formatNumber(budget.budget)}`,
            '已执行': `¥${formatNumber(budget.executed)}`,
            '执行率': `${budget.rate}%`,
            '项目进度': `${budget.progress}%`,
            '偏离度': `<span style="color: ${Math.abs(budget.deviation) > 30 ? '#DC2626' : '#D97706'}; font-weight: 600;">${budget.deviation > 0 ? '+' : ''}${budget.deviation}%</span>`,
            '风险等级': riskBadge
        },
        '预算明细': budgetBreakdownHtml,
        '偏离分析': issuesHtml
    });
}

// 科研经费监督 - 查看设备详情
function viewEquipmentDetail(projectNo) {
    const equipment = duplicateEquipmentData.find(e => e.projectNo === projectNo);
    if (!equipment) {
        Toast.error('未找到设备信息');
        return;
    }
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (equipment.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (equipment.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建现有设备分布表格
    const existingEquipmentHtml = `
        <div style="margin-top: 16px;">
            <h4 style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 12px;">现有设备分布</h4>
            <table class="data-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>存放位置</th>
                        <th>数量</th>
                        <th>采购日期</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    ${equipment.existingLocations.map(loc => `
                        <tr>
                            <td>${loc.location}</td>
                            <td>${loc.quantity}台</td>
                            <td>${loc.purchaseDate}</td>
                            <td><span style="color: ${loc.status === '闲置' ? '#DC2626' : '#059669'}; font-weight: 600;">${loc.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // 构建问题清单
    let issuesHtml = '';
    if (equipment.issues && equipment.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 重复采购风险
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${equipment.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    showDetailModal('设备重复采购预警', equipment.equipment, {
        '设备信息': {
            '设备名称': equipment.equipment,
            '设备型号': equipment.model,
            '拟采购数量': `${equipment.quantity}台`,
            '采购金额': `¥${formatNumber(equipment.amount)}`
        },
        '项目信息': {
            '项目名称': equipment.project,
            '项目编号': equipment.projectNo,
            '项目负责人': equipment.leader,
            '所属学院': equipment.college
        },
        '现有设备情况': {
            '现有数量': `${equipment.existing}台`,
            '设备利用率': `${equipment.utilizationRate}%`,
            '风险等级': riskBadge
        },
        '现有设备分布': existingEquipmentHtml,
        '风险分析': issuesHtml
    });
}
