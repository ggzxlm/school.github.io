// 智能分析页面脚本

let textAnalysisService;
let currentAnalysisType = 'meeting';
let currentResult = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('智能分析页面初始化...');
    
    // 初始化文本分析服务
    textAnalysisService = new TextAnalysisService();
    
    // 绑定事件
    bindEvents();
});

// 绑定事件
function bindEvents() {
    // 分析类型选择
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentAnalysisType = this.dataset.type;
        });
    });
}

// 开始分析
function startAnalysis() {
    const text = document.getElementById('textInput').value.trim();
    
    if (!text) {
        showToast('请输入需要分析的文本', 'warning');
        return;
    }
    
    // 显示加载遮罩
    document.getElementById('loadingOverlay').classList.add('active');
    
    // 模拟异步分析
    setTimeout(() => {
        let result;
        
        switch (currentAnalysisType) {
            case 'meeting':
                result = textAnalysisService.analyzeMeetingMinutes(text);
                break;
            case 'tender':
                result = textAnalysisService.analyzeTenderDocument(text);
                break;
            case 'contract':
                result = textAnalysisService.analyzeContract(text);
                break;
            default:
                result = null;
        }
        
        if (result) {
            currentResult = result;
            displayResult(result);
        }
        
        // 隐藏加载遮罩
        document.getElementById('loadingOverlay').classList.remove('active');
    }, 1500);
}

// 显示结果
function displayResult(result) {
    // 隐藏输入区域，显示结果区域
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('resultSection').classList.add('active');
    
    // 设置风险等级标签
    const riskBadge = document.getElementById('riskBadge');
    riskBadge.className = 'risk-badge risk-' + result.riskLevel;
    riskBadge.textContent = getRiskLevelText(result.riskLevel);
    
    // 根据分析类型显示不同的结果
    const resultContent = document.getElementById('resultContent');
    
    switch (result.type) {
        case 'meeting_minutes':
            resultContent.innerHTML = renderMeetingResult(result);
            break;
        case 'tender_document':
            resultContent.innerHTML = renderTenderResult(result);
            break;
        case 'contract':
            resultContent.innerHTML = renderContractResult(result);
            break;
    }
}

// 渲染会议纪要结果
function renderMeetingResult(result) {
    let html = '';
    
    // 摘要
    html += `
        <div class="result-card">
            <div class="result-card-title">
                <i class="fas fa-file-alt"></i> 分析摘要
            </div>
            <div class="result-card-content">
                ${result.summary}
            </div>
        </div>
    `;
    
    // 提取信息
    html += `
        <div class="result-card">
            <div class="result-card-title">
                <i class="fas fa-info-circle"></i> 提取信息
            </div>
            <div class="result-card-content">
                ${result.extracted.topic ? `
                    <div class="extracted-item">
                        <div class="extracted-label">会议主题</div>
                        <div class="extracted-value">${result.extracted.topic}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.date ? `
                    <div class="extracted-item">
                        <div class="extracted-label">会议时间</div>
                        <div class="extracted-value">${result.extracted.date}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.location ? `
                    <div class="extracted-item">
                        <div class="extracted-label">会议地点</div>
                        <div class="extracted-value">${result.extracted.location}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.participants.length > 0 ? `
                    <div class="extracted-item">
                        <div class="extracted-label">参会人员 (${result.extracted.participants.length}人)</div>
                        <div class="extracted-value">${result.extracted.participants.join('、')}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.decisions.length > 0 ? `
                    <div class="extracted-item">
                        <div class="extracted-label">决策事项 (${result.extracted.decisions.length}项)</div>
                        <div class="extracted-value">
                            <ol style="margin: 8px 0 0 20px; padding: 0;">
                                ${result.extracted.decisions.map(d => `<li style="margin-bottom: 8px;">${d}</li>`).join('')}
                            </ol>
                        </div>
                    </div>
                ` : ''}
                
                ${result.extracted.actionItems.length > 0 ? `
                    <div class="extracted-item">
                        <div class="extracted-label">行动事项 (${result.extracted.actionItems.length}项)</div>
                        <div class="extracted-value">
                            <ul style="margin: 8px 0 0 20px; padding: 0;">
                                ${result.extracted.actionItems.map(a => `<li style="margin-bottom: 8px;">${a}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // 敏感词检测
    if (result.sensitiveWords.length > 0) {
        html += `
            <div class="result-card">
                <div class="result-card-title">
                    <i class="fas fa-exclamation-triangle"></i> 敏感词检测 (${result.sensitiveWords.length}个)
                </div>
                <div class="result-card-content">
                    ${result.sensitiveWords.map(sw => `
                        <div class="sensitive-word-item">
                            <div class="sensitive-word-text">
                                <i class="fas fa-flag"></i> ${sw.word} 
                                <span style="font-size: 12px; color: #6b7280;">(${getCategoryText(sw.category)})</span>
                            </div>
                            <div class="sensitive-word-context">
                                第${sw.line}行: ...${sw.context}...
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    return html;
}

// 渲染招标文件结果
function renderTenderResult(result) {
    let html = '';
    
    // 摘要
    html += `
        <div class="result-card">
            <div class="result-card-title">
                <i class="fas fa-file-alt"></i> 分析摘要
            </div>
            <div class="result-card-content">
                ${result.summary}
            </div>
        </div>
    `;
    
    // 基本信息
    html += `
        <div class="result-card">
            <div class="result-card-title">
                <i class="fas fa-info-circle"></i> 基本信息
            </div>
            <div class="result-card-content">
                ${result.extracted.projectName ? `
                    <div class="extracted-item">
                        <div class="extracted-label">项目名称</div>
                        <div class="extracted-value">${result.extracted.projectName}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.budget ? `
                    <div class="extracted-item">
                        <div class="extracted-label">预算金额</div>
                        <div class="extracted-value">${result.extracted.budget} 万元</div>
                    </div>
                ` : ''}
                
                ${result.extracted.deadline ? `
                    <div class="extracted-item">
                        <div class="extracted-label">截止时间</div>
                        <div class="extracted-value">${result.extracted.deadline}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // 风险检测
    if (result.risks.length > 0) {
        html += `
            <div class="result-card">
                <div class="result-card-title">
                    <i class="fas fa-shield-alt"></i> 风险检测 (${result.risks.length}项)
                </div>
                <div class="result-card-content">
                    ${result.risks.map(risk => `
                        <div class="risk-item">
                            <div class="risk-item-header">
                                <div class="risk-item-title">${risk.description || '风险项'}</div>
                                <span class="risk-item-level risk-${risk.level}">${getRiskLevelText(risk.level)}</span>
                            </div>
                            ${risk.details && Array.isArray(risk.details) && risk.details.length > 0 ? `
                                <div style="margin-top: 12px;">
                                    ${risk.details.slice(0, 3).map(detail => `
                                        <div style="padding: 8px; background: #f9fafb; border-radius: 4px; margin-bottom: 8px; font-size: 13px;">
                                            <strong>第${detail.line || '?'}行:</strong> ${detail.content || detail}
                                        </div>
                                    `).join('')}
                                    ${risk.details.length > 3 ? `<div style="color: #6b7280; font-size: 13px;">还有 ${risk.details.length - 3} 处...</div>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 敏感词检测
    if (result.sensitiveWords.length > 0) {
        html += `
            <div class="result-card">
                <div class="result-card-title">
                    <i class="fas fa-exclamation-triangle"></i> 敏感词检测 (${result.sensitiveWords.length}个)
                </div>
                <div class="result-card-content">
                    ${result.sensitiveWords.slice(0, 5).map(sw => `
                        <div class="sensitive-word-item">
                            <div class="sensitive-word-text">
                                <i class="fas fa-flag"></i> ${sw.word}
                            </div>
                            <div class="sensitive-word-context">
                                第${sw.line}行: ...${sw.context}...
                            </div>
                        </div>
                    `).join('')}
                    ${result.sensitiveWords.length > 5 ? `<div style="color: #6b7280; font-size: 13px; margin-top: 8px;">还有 ${result.sensitiveWords.length - 5} 个敏感词...</div>` : ''}
                </div>
            </div>
        `;
    }
    
    return html;
}

// 渲染合同文本结果
function renderContractResult(result) {
    let html = '';
    
    // 摘要
    html += `
        <div class="result-card">
            <div class="result-card-title">
                <i class="fas fa-file-alt"></i> 分析摘要
            </div>
            <div class="result-card-content">
                ${result.summary}
            </div>
        </div>
    `;
    
    // 合同要素
    html += `
        <div class="result-card">
            <div class="result-card-title">
                <i class="fas fa-info-circle"></i> 合同要素
            </div>
            <div class="result-card-content">
                ${result.extracted.contractNumber ? `
                    <div class="extracted-item">
                        <div class="extracted-label">合同编号</div>
                        <div class="extracted-value">${result.extracted.contractNumber}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.parties.partyA ? `
                    <div class="extracted-item">
                        <div class="extracted-label">甲方</div>
                        <div class="extracted-value">${result.extracted.parties.partyA}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.parties.partyB ? `
                    <div class="extracted-item">
                        <div class="extracted-label">乙方</div>
                        <div class="extracted-value">${result.extracted.parties.partyB}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.amount ? `
                    <div class="extracted-item">
                        <div class="extracted-label">合同金额</div>
                        <div class="extracted-value">${result.extracted.amount} 元</div>
                    </div>
                ` : ''}
                
                ${result.extracted.duration ? `
                    <div class="extracted-item">
                        <div class="extracted-label">履约期限</div>
                        <div class="extracted-value">${result.extracted.duration}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.startDate ? `
                    <div class="extracted-item">
                        <div class="extracted-label">开始日期</div>
                        <div class="extracted-value">${result.extracted.startDate}</div>
                    </div>
                ` : ''}
                
                ${result.extracted.endDate ? `
                    <div class="extracted-item">
                        <div class="extracted-label">结束日期</div>
                        <div class="extracted-value">${result.extracted.endDate}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // 关键条款
    if (result.extracted.keyTerms.length > 0) {
        html += `
            <div class="result-card">
                <div class="result-card-title">
                    <i class="fas fa-key"></i> 关键条款
                </div>
                <div class="result-card-content">
                    ${result.extracted.keyTerms.map(term => `
                        <div class="extracted-item">
                            <div class="extracted-label">${term.type}</div>
                            <div class="extracted-value">${term.content}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 敏感词检测
    if (result.sensitiveWords.length > 0) {
        html += `
            <div class="result-card">
                <div class="result-card-title">
                    <i class="fas fa-exclamation-triangle"></i> 敏感词检测 (${result.sensitiveWords.length}个)
                </div>
                <div class="result-card-content">
                    ${result.sensitiveWords.map(sw => `
                        <div class="sensitive-word-item">
                            <div class="sensitive-word-text">
                                <i class="fas fa-flag"></i> ${sw.word}
                            </div>
                            <div class="sensitive-word-context">
                                第${sw.line}行: ...${sw.context}...
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    return html;
}

// 返回输入界面
function backToInput() {
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('resultSection').classList.remove('active');
}

// 清空输入
function clearInput() {
    document.getElementById('textInput').value = '';
}

// 加载示例文本
function loadSample(type) {
    const samples = {
        meeting: `会议纪要

会议主题：2025年度实验室设备采购项目论证会
时间：2025年10月28日 14:00-16:30
地点：行政楼三楼会议室
主持人：张明（采购办主任）
参会人员：李华（财务处处长）、王建（设备处处长）、赵强（科研处副处长）、刘洋（审计处科长）、陈杰（信息中心主任）

会议内容：

一、项目背景介绍
张明主任介绍了本次实验室设备采购项目的基本情况。项目预算800万元，主要采购高性能计算服务器、存储设备及配套软件。该项目已列入年度采购计划，经过前期调研，目前有三家供应商具备供货能力。

二、技术方案讨论
陈杰主任详细介绍了技术需求。他特别强调，根据实验室现有环境和未来发展需要，设备必须与现有系统完全兼容。经过技术团队反复测试，唯一能够满足所有技术指标要求的是华为品牌服务器。其他品牌虽然参数相近，但在实际测试中存在兼容性问题。

王建处长补充说明，设备处之前与华为公司有过多次合作，该公司是我们的老朋友公司了，对方技术支持响应及时，售后服务到位。建议本次采购继续指定该品牌，以确保项目顺利实施。

三、采购方式讨论
李华处长提出，考虑到项目的特殊性和紧迫性，建议采用竞争性谈判方式进行采购。该方式既能保证采购效率，又符合相关规定。经过讨论，大家一致同意该建议。

赵强副处长表示，科研处对设备性能要求较高，希望能够优先考虑技术先进、服务优质的供应商。他提到，之前有供应商主动联系科研处，表示愿意提供优惠价格和延长质保期，还承诺会给予一定的感谢费作为项目支持，建议采购办与该供应商深入沟通。

四、资金安排
李华处长介绍了资金筹措方案。项目资金来源包括：财政拨款500万元、科研经费配套200万元、其他渠道筹措100万元。为加快项目进度，建议预付款比例提高到40%，以便供应商尽快备货。

张明主任提出，部分配套资金可以通过科研项目经费列支，这样既能解决资金问题，又能提高经费使用效率。另外，考虑到项目的特殊性，部分小额支出可以通过现金交易方式处理，避免繁琐的报销程序。大家表示认可。

五、验收标准
王建处长提出，鉴于设备技术复杂，建议邀请供应商技术人员参与验收过程，以确保设备安装调试顺利。验收标准以供应商提供的技术文档为准，适当简化验收程序，避免影响项目进度。

刘洋科长建议，验收过程要注意留存相关资料，确保符合审计要求。但考虑到项目紧急，可以先完成初步验收，详细资料后续补充完善。

六、供应商关系说明
王建处长补充说明，本次推荐的华为供应商代理商深圳某某科技有限公司，其负责人李总是其亲属，在业内口碑很好，合作过程中从未出现问题。虽然存在亲属关系，但完全是基于业务考虑，产品质量和服务都有保障，不存在利益输送。

七、会议决定
1. 采用竞争性谈判方式进行采购，邀请三家供应商参与
2. 技术参数以实验室实际需求为准，确保设备兼容性，优先考虑华为品牌
3. 预付款比例设定为40%，以加快项目实施进度
4. 验收工作由设备处牵头，供应商技术人员配合
5. 项目资金通过多渠道筹措，确保按时到位
6. 部分小额支出可灵活处理，提高办事效率

八、工作安排
1. 采购办负责起草采购文件，11月5日前完成
2. 财务处负责资金筹措和拨付，11月10日前到位
3. 设备处负责技术对接和验收准备工作
4. 审计处负责全程监督，确保程序合规

九、其他事项
张明主任强调，本项目时间紧、任务重，各部门要密切配合，确保项目顺利实施。同时要注意保密工作，采购过程中的商业信息不得泄露，特别是供应商提供的优惠条件和感谢费等敏感信息。

会议于16:30结束。

记录人：李明
审核人：张明
日期：2025年10月28日`,

        tender: `招标公告

项目名称：校园网络设备采购项目
项目预算：500万元
招标编号：ZB2025-001

一、项目概况
本项目拟采购校园网络核心交换机、汇聚交换机、接入交换机等设备。

二、技术要求
1. 核心交换机：交换容量不低于10Tbps，必须为华为品牌
2. 汇聚交换机：端口数量不少于48个，指定思科品牌
3. 接入交换机：支持POE供电，唯一支持H3C品牌

三、资质要求
1. 具有网络设备销售资质
2. 具有厂商授权证书
3. 具有3年以上同类项目经验

四、投标截止时间
2025年11月15日 10:00

五、联系方式
联系人：张经理
电话：138****1234`,

        contract: `设备采购合同

合同编号：CGHT-2025-088

甲方（采购方）：某某大学
法定代表人：王校长
地址：某市某区某路123号
联系人：张明  电话：0755-88888888

乙方（供应方）：深圳某某科技有限公司
法定代表人：李总
地址：深圳市南山区科技园某大厦
联系人：陈经理  电话：0755-99999999

根据《中华人民共和国民法典》《中华人民共和国政府采购法》及相关法律法规，经双方友好协商，就实验室设备采购事宜达成如下协议：

第一条 合同标的
甲方向乙方采购高性能计算服务器及配套设备一批，具体型号、数量、技术参数详见附件《设备清单》。

第二条 合同金额
合同总价：人民币捌佰万元整（¥8,000,000.00）
其中：设备款7,200,000元，安装调试费500,000元，培训费300,000元。

备注：经市场调研，同类设备市场均价约为650万元，本合同价格包含了三年延保服务和定制化开发费用。价格差异部分将作为辛苦费，用于项目协调和后续服务保障。

第三条 技术要求
1. 设备性能指标应满足甲方实验室使用需求
2. 设备品牌和型号以甲方技术部门确认的配置为准
3. 乙方应提供原厂授权证明和质量保证书
4. 设备应与甲方现有系统完全兼容

第四条 交货及验收
1. 交货期限：合同签订后60个工作日内完成设备交付
2. 交货地点：甲方指定地点
3. 验收标准：按照国家相关标准及合同约定的技术参数进行验收
4. 验收方式：由甲方组织验收小组进行验收，乙方技术人员应到场配合
5. 验收时限：设备到货后15个工作日内完成验收

第五条 付款方式
1. 预付款：合同签订后5个工作日内，甲方支付合同总价的40%（320万元）
2. 到货款：设备到货并初步验收合格后，甲方支付合同总价的50%（400万元）
3. 尾款：项目最终验收合格后，甲方支付合同总价的10%（80万元）

备注：预付款比例高于常规标准（通常为30%），主要考虑到设备需要定制化生产，供应商需要提前采购原材料。为提高资金使用效率，部分小额款项可采用现金交易方式支付，相关手续后续补办。

第六条 质量保证
1. 设备质保期为三年，自验收合格之日起计算
2. 质保期内，乙方负责免费维修和更换故障部件
3. 乙方应在接到故障通知后24小时内响应，48小时内到达现场
4. 质保期满后，乙方应继续提供有偿技术支持服务

第七条 违约责任
1. 乙方逾期交货的，每逾期一日，按合同总价的0.3%支付违约金
2. 甲方逾期付款的，每逾期一日，按应付款项的0.2%支付违约金
3. 设备质量不符合合同约定的，乙方应负责免费更换或退货
4. 因不可抗力导致合同无法履行的，双方互不承担违约责任

第八条 保密条款
1. 双方对合同内容及执行过程中获知的对方商业秘密负有保密义务
2. 未经对方书面同意，任何一方不得向第三方披露合同相关信息
3. 保密期限为合同签订之日起至合同履行完毕后两年

第九条 争议解决
本合同履行过程中发生的争议，双方应友好协商解决；协商不成的，任何一方均可向甲方所在地人民法院提起诉讼。

第十条 其他约定
1. 本合同未尽事宜，双方可另行签订补充协议，补充协议与本合同具有同等法律效力
2. 本合同一式肆份，甲乙双方各执贰份，具有同等法律效力
3. 本合同自双方法定代表人或授权代表签字并加盖公章之日起生效
4. 鉴于乙方在项目前期提供了大量技术支持和咨询服务，甲方同意在项目验收后，向乙方支付一定的回扣作为感谢，具体金额和支付方式双方另行商定

第十一条 附件
附件1：设备清单及技术参数
附件2：验收标准
附件3：培训计划
附件4：售后服务承诺书

甲方（盖章）：某某大学          乙方（盖章）：深圳某某科技有限公司
法定代表人：                    法定代表人：
授权代表：张明                  授权代表：陈经理
日期：2025年10月30日            日期：2025年10月30日

备注：本合同已经学校采购领导小组审议通过，采购方式为竞争性谈判，符合政府采购相关规定。合同签订前已完成资金审批和预算审核程序。`
    };
    
    const textarea = document.getElementById('textInput');
    textarea.value = samples[type] || '';
    
    // 自动选择对应的分析类型
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
            currentAnalysisType = type;
        }
    });
    
    showToast('已加载示例文本', 'success');
}

// 获取风险等级文本
function getRiskLevelText(level) {
    const texts = {
        'high': '高风险',
        'medium': '中风险',
        'low': '低风险'
    };
    return texts[level] || '未知';
}

// 获取分类文本
function getCategoryText(category) {
    const texts = {
        'corruption': '腐败相关',
        'discrimination': '歧视性条款',
        'violation': '违规违法',
        'relationship': '关系相关',
        'financial': '财务相关'
    };
    return texts[category] || '其他';
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-times-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 2000);
}
