/**
 * 采购项目详情页面
 */

let currentProject = null;

/**
 * 初始化页面
 */
function initPage() {
    // 获取项目ID
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || 'P2025001';
    
    // 加载项目数据
    loadProjectDetail(projectId);
}

/**
 * 加载项目详情
 */
function loadProjectDetail(projectId) {
    Loading.show('加载项目数据...');
    
    setTimeout(() => {
        currentProject = ProcurementProjectService.getProjectDetail(projectId);
        
        if (currentProject) {
            renderProjectHeader();
            renderRiskStatistics();
            renderProcessTimeline();
            Loading.hide();
        } else {
            Loading.hide();
            Toast.error('项目不存在');
            setTimeout(() => {
                window.history.back();
            }, 2000);
        }
    }, 500);
}

/**
 * 渲染项目头部
 */
function renderProjectHeader() {
    const header = document.getElementById('projectHeader');
    const statusClass = currentProject.status === '合同签订' ? 'completed' : 'ongoing';
    
    header.innerHTML = `
        <div class="project-title-row">
            <div class="project-title-left">
                <h1 class="project-title">${currentProject.name}</h1>
                <p class="project-code">项目编号：${currentProject.code}</p>
            </div>
            <div class="project-status-badge ${statusClass}">
                ${currentProject.status}
            </div>
        </div>
        
        <div class="project-info-grid">
            <div class="project-info-item">
                <span class="project-info-label">项目类型</span>
                <span class="project-info-value">${currentProject.type}</span>
            </div>
            <div class="project-info-item">
                <span class="project-info-label">项目金额</span>
                <span class="project-info-value">${currentProject.amount} ${currentProject.unit}</span>
            </div>
            <div class="project-info-item">
                <span class="project-info-label">申请部门</span>
                <span class="project-info-value">${currentProject.department}</span>
            </div>
            <div class="project-info-item">
                <span class="project-info-label">创建时间</span>
                <span class="project-info-value">${currentProject.createTime}</span>
            </div>
        </div>
    `;
}

/**
 * 渲染风险统计
 */
function renderRiskStatistics() {
    const stats = currentProject.statistics;
    const container = document.getElementById('riskStatistics');
    
    container.innerHTML = `
        <div class="risk-stats-header">
            <h2 class="risk-stats-title">
                <i class="fas fa-chart-bar"></i>
                风险统计
            </h2>
        </div>
        
        <div class="risk-stats-grid">
            <div class="risk-stat-card total">
                <div class="risk-stat-label">预警总数</div>
                <div class="risk-stat-value">${stats.totalAlerts}</div>
                <div class="risk-stat-desc">全流程预警数量</div>
            </div>
            
            <div class="risk-stat-card high">
                <div class="risk-stat-label">高风险预警</div>
                <div class="risk-stat-value">${stats.highAlerts}</div>
                <div class="risk-stat-desc">需要立即处理</div>
            </div>
            
            <div class="risk-stat-card medium">
                <div class="risk-stat-label">中风险预警</div>
                <div class="risk-stat-value">${stats.mediumAlerts}</div>
                <div class="risk-stat-desc">需要关注处理</div>
            </div>
            
            <div class="risk-stat-card low">
                <div class="risk-stat-label">低风险预警</div>
                <div class="risk-stat-value">${stats.lowAlerts}</div>
                <div class="risk-stat-desc">建议优化改进</div>
            </div>
            
            <div class="risk-stat-card score">
                <div class="risk-stat-label">综合风险评分</div>
                <div class="risk-stat-value">${stats.totalRiskScore}</div>
                <div class="risk-stat-desc">满分100分</div>
            </div>
        </div>
    `;
}

/**
 * 渲染流程时间轴
 */
function renderProcessTimeline() {
    const container = document.getElementById('processTimeline');
    
    container.innerHTML = `
        <div class="timeline-header">
            <h2 class="timeline-title">
                <i class="fas fa-stream"></i>
                采购全流程预警
            </h2>
        </div>
        
        <div class="timeline-list">
            ${currentProject.phases.map(phase => renderPhaseItem(phase)).join('')}
        </div>
    `;
}

/**
 * 渲染阶段项
 */
function renderPhaseItem(phase) {
    const statusClass = phase.status;
    const alertCount = phase.alerts.length;
    const alertLevel = getAlertLevel(phase.alerts);
    
    return `
        <div class="timeline-item ${statusClass}">
            <div class="timeline-dot">
                ${statusClass === 'completed' ? '<i class="fas fa-check"></i>' : phase.id}
            </div>
            
            <div class="timeline-content">
                <div class="timeline-header-row">
                    <h3 class="timeline-phase-name">${phase.id}. ${phase.name}</h3>
                    <div class="timeline-phase-status">
                        ${phase.completedTime ? `
                            <span class="timeline-phase-time">
                                <i class="fas fa-clock"></i> ${phase.completedTime}
                            </span>
                        ` : ''}
                        <span class="timeline-alert-badge ${alertLevel}">
                            ${alertCount > 0 ? `${alertCount}个预警` : '无预警'}
                        </span>
                    </div>
                </div>
                
                ${alertCount > 0 ? `
                    <div class="alert-list">
                        ${phase.alerts.map(alert => renderAlertItem(alert)).join('')}
                    </div>
                ` : `
                    <div class="no-alerts">
                        <i class="fas fa-check-circle"></i>
                        <p>该阶段未发现风险预警</p>
                    </div>
                `}
                
                ${phase.data ? renderPhaseData(phase) : ''}
            </div>
        </div>
    `;
}

/**
 * 渲染预警项
 */
function renderAlertItem(alert) {
    return `
        <div class="alert-item ${alert.level}">
            <div class="alert-header">
                <div class="alert-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="alert-content">
                    <h4 class="alert-title">${alert.title}</h4>
                    <span class="alert-type">${alert.type}</span>
                </div>
            </div>
            
            <p class="alert-description">${alert.description}</p>
            
            <div class="alert-suggestion">
                <strong>处理建议：</strong>${alert.suggestion}
            </div>
            
            <div class="alert-risk-score">
                <span class="alert-risk-score-label">风险评分：</span>
                <div class="alert-risk-score-bar">
                    <div class="alert-risk-score-fill" style="width: ${alert.riskScore}%"></div>
                </div>
                <span class="alert-risk-score-value">${alert.riskScore}</span>
            </div>
        </div>
    `;
}

/**
 * 获取预警等级
 */
function getAlertLevel(alerts) {
    if (alerts.length === 0) return 'none';
    
    const hasHigh = alerts.some(a => a.level === 'high');
    const hasMedium = alerts.some(a => a.level === 'medium');
    
    if (hasHigh) return 'high';
    if (hasMedium) return 'medium';
    return 'low';
}

/**
 * 渲染阶段数据
 */
function renderPhaseData(phase) {
    if (!phase.data) return '';
    
    let dataHtml = '';
    
    // 根据不同阶段渲染不同的数据
    switch (phase.name) {
        case '论证':
            dataHtml = renderDemonstrationData(phase.data);
            break;
        case '立项':
            dataHtml = renderApprovalData(phase.data);
            break;
        case '需求':
            dataHtml = renderDemandData(phase.data);
            break;
        case '公告':
            dataHtml = renderAnnouncementData(phase.data);
            break;
        case '专家抽取':
            dataHtml = renderExpertData(phase.data);
            break;
        case '评标':
            dataHtml = renderEvaluationData(phase.data);
            break;
        case '合同签订':
            dataHtml = renderContractData(phase.data);
            break;
    }
    
    return dataHtml;
}

/**
 * 渲染论证数据
 */
function renderDemonstrationData(data) {
    return `
        <div class="phase-data">
            <div class="phase-data-title">
                <i class="fas fa-users"></i>
                论证会议信息
            </div>
            <div class="phase-data-grid">
                <div class="phase-data-item">
                    <span class="phase-data-label">会议时间</span>
                    <span class="phase-data-value">${data.meetingDate}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">参会人数</span>
                    <span class="phase-data-value">${data.participants.length}人</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">专业匹配率</span>
                    <span class="phase-data-value">${data.professionalRate}%</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">论证结论</span>
                    <span class="phase-data-value">${data.conclusion}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染立项数据
 */
function renderApprovalData(data) {
    return `
        <div class="phase-data">
            <div class="phase-data-title">
                <i class="fas fa-file-alt"></i>
                立项审批信息
            </div>
            <div class="phase-data-grid">
                <div class="phase-data-item">
                    <span class="phase-data-label">审批时间</span>
                    <span class="phase-data-value">${data.approvalDate}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">审批部门</span>
                    <span class="phase-data-value">${data.approvalDepartment}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">预算金额</span>
                    <span class="phase-data-value">${data.budget}万元</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">类似项目</span>
                    <span class="phase-data-value">${data.similarProjects.length}个</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染需求数据
 */
function renderDemandData(data) {
    return `
        <div class="phase-data">
            <div class="phase-data-title">
                <i class="fas fa-clipboard-list"></i>
                需求编制信息
            </div>
            <div class="phase-data-grid">
                <div class="phase-data-item">
                    <span class="phase-data-label">编制时间</span>
                    <span class="phase-data-value">${data.demandDate}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">编制部门</span>
                    <span class="phase-data-value">${data.demandDepartment}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">技术参数</span>
                    <span class="phase-data-value">${data.technicalParams}项</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">限制性参数</span>
                    <span class="phase-data-value">${data.restrictiveParams}项</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">潜在供应商</span>
                    <span class="phase-data-value">${data.potentialSuppliers}家</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">投诉举报</span>
                    <span class="phase-data-value">${data.complaints.length}次</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染公告数据
 */
function renderAnnouncementData(data) {
    return `
        <div class="phase-data">
            <div class="phase-data-title">
                <i class="fas fa-bullhorn"></i>
                公告发布信息
            </div>
            <div class="phase-data-grid">
                <div class="phase-data-item">
                    <span class="phase-data-label">公告时间</span>
                    <span class="phase-data-value">${data.announcementDate}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">公告期限</span>
                    <span class="phase-data-value">${data.announcementPeriod}天</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">浏览次数</span>
                    <span class="phase-data-value">${data.views}次</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">下载次数</span>
                    <span class="phase-data-value">${data.downloads}次</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染专家数据
 */
function renderExpertData(data) {
    return `
        <div class="phase-data">
            <div class="phase-data-title">
                <i class="fas fa-user-tie"></i>
                专家组成信息
            </div>
            <div class="phase-data-grid">
                <div class="phase-data-item">
                    <span class="phase-data-label">抽取时间</span>
                    <span class="phase-data-value">${data.extractDate}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">专家人数</span>
                    <span class="phase-data-value">${data.experts.length}人</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">校外专家比例</span>
                    <span class="phase-data-value">${data.externalRate}%</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">财务参与</span>
                    <span class="phase-data-value">${data.financeParticipation ? '是' : '否'}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">审计参与</span>
                    <span class="phase-data-value">${data.auditParticipation ? '是' : '否'}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染评标数据
 */
function renderEvaluationData(data) {
    return `
        <div class="phase-data">
            <div class="phase-data-title">
                <i class="fas fa-gavel"></i>
                评标进展信息
            </div>
            <div class="phase-data-grid">
                <div class="phase-data-item">
                    <span class="phase-data-label">开标时间</span>
                    <span class="phase-data-value">${data.biddingDate}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">投标单位</span>
                    <span class="phase-data-value">${data.bidders}家</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">有效投标</span>
                    <span class="phase-data-value">${data.validBids}家</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">投诉质疑</span>
                    <span class="phase-data-value">${data.complaints.length}次</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">评标进度</span>
                    <span class="phase-data-value">${data.evaluationProgress}%</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染合同数据
 */
function renderContractData(data) {
    return `
        <div class="phase-data">
            <div class="phase-data-title">
                <i class="fas fa-file-contract"></i>
                合同签订信息
            </div>
            <div class="phase-data-grid">
                <div class="phase-data-item">
                    <span class="phase-data-label">签订时间</span>
                    <span class="phase-data-value">${data.contractDate}</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">合同金额</span>
                    <span class="phase-data-value">${data.contractAmount}万元</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">中标金额</span>
                    <span class="phase-data-value">${data.bidAmount}万元</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">金额差异</span>
                    <span class="phase-data-value">${data.difference}万元</span>
                </div>
                <div class="phase-data-item">
                    <span class="phase-data-label">内容匹配度</span>
                    <span class="phase-data-value">${data.matchRate}%</span>
                </div>
            </div>
        </div>
    `;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);
