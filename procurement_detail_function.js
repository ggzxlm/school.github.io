/**
 * 采购管理审计详情
 * 
 * 使用说明：
 * 1. 在 js/audit-supervision.js 中找到 getProcurementDetail 函数（约1097-1243行）
 * 2. 用下面的代码完整替换原函数
 */

function getProcurementDetail(project) {
    // 不同采购项目的问题类型数据
    const projectData = {
        '实验耗材采购': { 
            amount: 85.00, department: '化学学院', method: '单一来源', 
            issueType: 'single_source', supplier: 'XX耗材公司'
        },
        '高端仪器采购': { 
            amount: 120.00, department: '物理学院', method: '单一来源', 
            issueType: 'single_source', supplier: 'YY仪器公司'
        },
        '办公设备采购': { 
            amount: 68.00, department: '行政办', method: '询价采购', 
            issueType: 'procedure_irregular', supplier: 'ZZ设备公司'
        },
        '实验设备采购': { 
            amount: 850.00, department: '物理学院', method: '公开招标', 
            issueType: 'split_procurement', supplier: 'AA科技公司',
            splitAmount: 850, splitCount: 5
        },
        '图书馆图书采购': { 
            amount: 230.00, department: '图书馆', method: '竞争性谈判', 
            issueType: 'normal', supplier: 'BB图书公司'
        },
        '网络设备采购': { 
            amount: 450.00, department: '信息中心', method: '公开招标', 
            issueType: 'normal', supplier: 'CC网络公司'
        },
        '实验室家具采购': { 
            amount: 95.00, department: '生命科学学院', method: '单一来源', 
            issueType: 'single_source', supplier: 'DD家具公司'
        },
        '教学设备采购': { 
            amount: 320.00, department: '计算机学院', method: '竞争性谈判', 
            issueType: 'price_high', supplier: 'EE教学设备公司',
            actualPrice: 320, marketPrice: 285
        }
    };
    
    const data = projectData[project] || projectData['网络设备采购'];
    
    let issueTitle = '';
    let issueColor = '#059669';
    let statusBadge = '';
    let findings = '';
    let suggestions = '';
    
    // 根据问题类型生成不同的审计结论
    if (data.issueType === 'single_source') {
        issueTitle = '该采购项目存在单一来源采购问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">单一来源</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未经审批采用单一来源采购</strong>，违反政府采购规定</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未提供单一来源采购理由说明</strong></li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 采购金额${data.amount}万元，应采用公开招标或竞争性谈判</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 缺少市场调研和价格比对</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 存在利益输送风险</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 采购程序不规范</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>对单一来源采购进行<strong>专项审查</strong></li>
                <li>补充单一来源采购<strong>理由说明</strong></li>
                <li>如不符合单一来源条件，应<strong>重新采购</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>严格执行采购<strong>审批程序</strong></li>
                <li>加强采购方式<strong>合规性审查</strong></li>
                <li>建立采购<strong>监督机制</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'split_procurement') {
        issueTitle = '该采购项目存在化整为零问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">化整为零</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>将${data.splitAmount}万元采购项目拆分为${data.splitCount}个子项目</strong>，规避公开招标</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>拆分后单个项目金额均低于招标限额</strong></li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 采购内容相同或相近，应合并采购</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 采购时间集中，存在故意拆分嫌疑</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 违反政府采购法相关规定</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 可能导致采购成本增加</li>
            </ul>
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">该项目明显存在<strong>化整为零、规避招标</strong>行为，已移交纪检部门调查。</p>
            </div>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>对拆分采购进行<strong>全面清查</strong></li>
                <li>对相关责任人进行<strong>严肃问责</strong></li>
                <li>移交纪检部门进行<strong>深入调查</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立采购项目<strong>合并审查机制</strong></li>
                <li>加强采购计划<strong>统筹管理</strong></li>
                <li>严格执行<strong>招标限额规定</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'procedure_irregular') {
        issueTitle = '该采购项目程序不规范！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">程序不规范</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>采购申请审批手续不完整</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>询价单位数量不足3家</strong>，不符合询价采购要求</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 采购文件缺少必要的技术参数</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 采购结果公示不及时</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 采购档案不完整</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>补充完善采购<strong>审批手续</strong></li>
                <li>规范询价采购<strong>程序</strong></li>
                <li>完善采购<strong>档案资料</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立采购<strong>流程规范</strong></li>
                <li>加强采购人员<strong>培训</strong></li>
                <li>完善采购<strong>档案管理</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'price_high') {
        issueTitle = '该采购项目价格偏高！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">价格偏高</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>采购价格${data.actualPrice}万元</strong>，市场价格约${data.marketPrice}万元，高出${((data.actualPrice - data.marketPrice) / data.marketPrice * 100).toFixed(1)}%</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>采购前未充分进行市场调研</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 谈判过程议价不充分</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 缺少价格比对分析</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 采购成本控制不力</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>对采购价格进行<strong>核查</strong></li>
                <li>加强采购<strong>市场调研</strong></li>
                <li>提高采购<strong>议价能力</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立采购<strong>价格数据库</strong></li>
                <li>完善采购<strong>比价机制</strong></li>
                <li>加强采购<strong>成本控制</strong></li>
            </ul>
        `;
    } else {
        issueTitle = '该采购项目程序规范，符合政府采购相关规定';
        statusBadge = '<span class="badge badge-success">合规</span>';
        findings = `
            <p><strong>合规性评价：</strong>该采购项目程序规范。</p>
            <ul>
                <li><i class="fas fa-check-circle text-green-600"></i> 采购方式选择合理，符合金额要求</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 招标程序完整，公告期限符合规定</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 评标过程公正，评分标准明确</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 中标结果合理，价格优势明显</li>
            </ul>
        `;
        suggestions = `
            <p>1. 继续保持规范的采购管理</p>
            <p>2. 加强采购过程监督，确保公平公正</p>
        `;
    }
    
    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">采购项目信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>项目名称</label><p>${project}</p></div>
                    <div class="detail-item"><label>采购部门</label><p>${data.department}</p></div>
                    <div class="detail-item"><label>采购编号</label><p>CG2024-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}</p></div>
                    <div class="detail-item"><label>采购方式</label><p>${data.method}</p></div>
                    <div class="detail-item"><label>采购金额</label><p style="font-size: 18px; font-weight: 600; color: #2563EB;">¥${data.amount.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>供应商</label><p>${data.supplier}</p></div>
                    <div class="detail-item"><label>采购状态</label><p><span class="badge badge-${data.issueType === 'normal' ? 'success' : 'info'}">已完成</span></p></div>
                    <div class="detail-item"><label>合规性</label><p>${statusBadge}</p></div>
                </div>
            </div>
            
            ${data.issueType !== 'single_source' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">${data.method === '公开招标' ? '投标情况' : '报价情况'}</h4>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>${data.method === '公开招标' ? '投标单位' : '报价单位'}</th>
                            <th>报价金额</th>
                            ${data.method === '公开招标' ? '<th>技术得分</th><th>商务得分</th>' : ''}
                            <th>综合得分</th>
                            <th>结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: ${data.issueType === 'normal' ? '#F0FDF4' : '#FFFBEB'};">
                            <td><strong>${data.supplier}</strong></td>
                            <td><strong>¥${data.amount.toFixed(2)}万</strong></td>
                            ${data.method === '公开招标' ? '<td>92分</td><td>88分</td>' : ''}
                            <td><strong>90.0分</strong></td>
                            <td><span class="badge badge-success">中标</span></td>
                        </tr>
                        <tr>
                            <td>竞争单位A</td>
                            <td>¥${(data.amount * 1.05).toFixed(2)}万</td>
                            ${data.method === '公开招标' ? '<td>88分</td><td>85分</td>' : ''}
                            <td>86.5分</td>
                            <td><span class="badge badge-secondary">未中标</span></td>
                        </tr>
                        <tr>
                            <td>竞争单位B</td>
                            <td>¥${(data.amount * 1.08).toFixed(2)}万</td>
                            ${data.method === '公开招标' ? '<td>85分</td><td>82分</td>' : ''}
                            <td>83.5分</td>
                            <td><span class="badge badge-secondary">未中标</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">审计结论：${issueTitle}</strong></p>
                    ${findings}
                </div>
            </div>
            
            ${data.issueType !== 'normal' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">整改要求</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">${data.issueType === 'single_source' || data.issueType === 'split_procurement' ? '严重违规，要求立即整改（限期15天）' : '要求限期整改（限期20天）'}：</strong></p>
                    ${suggestions}
                    <p><strong>3. 责任追究：</strong></p>
                    <ul>
                        <li>对采购负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                        ${data.issueType === 'split_procurement' ? '<li>对涉嫌违规人员进行<strong>立案调查</strong></li>' : ''}
                        <li>将整改情况纳入部门<strong>年度考核</strong></li>
                    </ul>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. ${data.issueType === 'single_source' || data.issueType === 'split_procurement' ? '15' : '20'}天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立采购审计<strong>回访制度</strong>，跟踪整改落实情况</p>
                </div>
            </div>
            ` : `
            <div class="detail-section">
                <h4 class="detail-section-title">工作建议</h4>
                <div class="detail-text">
                    ${suggestions}
                </div>
            </div>
            `}
        </div>
    `;
}
