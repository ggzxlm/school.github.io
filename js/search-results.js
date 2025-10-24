/**
 * 搜索结果页面
 */

// 模拟搜索数据
const mockSearchData = [
    {
        id: 'P2025001',
        type: 'procurement',
        title: '新图书馆智能化系统采购项目',
        description: '项目金额850万元，当前处于评标阶段。发现13个预警，包括论证专家专业背景不匹配、技术参数存在明显倾向性、收到实名举报等高风险问题。',
        category: '基建采购监督',
        time: '2025-09-15 09:00',
        status: '评标中',
        alertCount: 13,
        riskLevel: '高'
    },
    {
        id: 'P2025002',
        type: 'procurement',
        title: '学生宿舍家具采购项目',
        description: '项目金额320万元，已完成合同签订。全流程规范，仅发现1个低风险预警，整体风险可控。',
        category: '基建采购监督',
        time: '2025-08-01 10:00',
        status: '合同签订',
        alertCount: 1,
        riskLevel: '低'
    },
    {
        id: 1,
        type: 'alert',
        title: '科研经费异常支出预警',
        description: '检测到计算机学院张教授科研项目经费支出存在异常，单笔支出金额超过项目预算的30%，建议进行核查。',
        category: '科研经费监督',
        time: '2025-10-20 14:30',
        status: '待处理',
        level: '高'
    },
    {
        id: 2,
        type: 'clue',
        title: '招生录取异常线索',
        description: '发现某专业录取分数线异常波动，部分考生录取分数低于最低控制线，需要进一步调查核实。',
        category: '招生录取监督',
        time: '2025-10-19 10:15',
        status: '调查中',
        source: '数据分析'
    },
    {
        id: 3,
        type: 'workorder',
        title: '基建采购项目审计工单',
        description: '新图书馆建设项目采购流程审计，需要核查招标文件、评标过程、合同签订等环节的合规性。',
        category: '基建采购审计',
        time: '2025-10-18 16:45',
        status: '进行中',
        assignee: '李审计'
    },
    {
        id: 4,
        type: 'model',
        title: '科研经费监督模型',
        description: '基于历史数据和规则引擎构建的科研经费监督模型，可自动识别异常支出、虚假发票、关联交易等风险。',
        category: '监督模型库',
        time: '2025-10-15 09:00',
        accuracy: '92%',
        usage: 156
    },
    {
        id: 5,
        type: 'report',
        title: '2025年第三季度科研经费审计报告',
        description: '本季度共审计科研项目128个，发现问题线索23条，涉及金额约580万元，主要问题包括预算执行不规范、票据管理不严格等。',
        category: '审计报告',
        time: '2025-10-10 11:20',
        author: '审计处',
        views: 342
    },
    {
        id: 6,
        type: 'alert',
        title: '财务管理异常预警',
        description: '检测到某部门差旅费报销频次异常增加，单月报销次数超过历史平均值的200%，建议关注。',
        category: '财务管理监督',
        time: '2025-10-08 15:30',
        status: '已处理',
        level: '中'
    },
    {
        id: 7,
        type: 'clue',
        title: '固定资产管理线索',
        description: '资产盘点发现部分高值设备账实不符，存在资产流失风险，需要进一步核查资产去向。',
        category: '资产管理监督',
        time: '2025-10-05 13:45',
        status: '待分配',
        source: '资产盘点'
    },
    {
        id: 8,
        type: 'workorder',
        title: '八项规定执行检查工单',
        description: '对全校各部门八项规定执行情况进行专项检查，重点关注公务接待、公车使用、办公用房等方面。',
        category: '纪检监督',
        time: '2025-10-03 10:00',
        status: '已完成',
        assignee: '王纪检'
    },
    {
        id: 9,
        type: 'model',
        title: '招生录取监督模型',
        description: '通过分析历年招生数据，建立招生录取异常识别模型，可自动发现录取分数异常、加分不规范等问题。',
        category: '监督模型库',
        time: '2025-09-28 14:20',
        accuracy: '88%',
        usage: 89
    },
    {
        id: 10,
        type: 'report',
        title: '基建项目专项审计报告',
        description: '对学校近三年基建项目进行专项审计，发现部分项目存在预算超支、变更管理不规范、结算审核不严格等问题。',
        category: '审计报告',
        time: '2025-09-25 16:30',
        author: '审计处',
        views: 567
    }
];

// 页面状态
let currentPage = 1;
let pageSize = 10;
let currentFilter = 'all';
let searchKeyword = '';
let filteredResults = [];

/**
 * 初始化页面
 */
function initPage() {
    // 获取搜索关键词
    const urlParams = new URLSearchParams(window.location.search);
    searchKeyword = urlParams.get('q') || '';
    
    // 显示搜索关键词
    document.getElementById('searchKeyword').textContent = searchKeyword;
    
    // 执行搜索
    performSearch();
    
    // 绑定事件
    bindEvents();
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 过滤按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新过滤类型
            currentFilter = btn.dataset.type;
            currentPage = 1;
            
            // 重新搜索
            performSearch();
        });
    });
}

/**
 * 执行搜索
 */
function performSearch() {
    // 显示加载状态
    showLoading();
    
    // 模拟异步搜索
    setTimeout(() => {
        // 过滤结果
        filteredResults = mockSearchData.filter(item => {
            // 关键词匹配
            const keywordMatch = !searchKeyword || 
                item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.category.toLowerCase().includes(searchKeyword.toLowerCase());
            
            // 类型过滤
            const typeMatch = currentFilter === 'all' || item.type === currentFilter;
            
            return keywordMatch && typeMatch;
        });
        
        // 显示结果
        displayResults();
    }, 500);
}

/**
 * 显示加载状态
 */
function showLoading() {
    const resultsList = document.getElementById('searchResultsList');
    resultsList.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>正在搜索...</p>
        </div>
    `;
}

/**
 * 显示搜索结果
 */
function displayResults() {
    const resultsList = document.getElementById('searchResultsList');
    const resultCount = document.getElementById('resultCount');
    
    // 更新结果数量
    resultCount.textContent = filteredResults.length;
    
    // 如果没有结果
    if (filteredResults.length === 0) {
        resultsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>未找到相关结果</h3>
                <p>请尝试使用其他关键词或调整筛选条件</p>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    // 分页
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredResults.length);
    const pageResults = filteredResults.slice(startIndex, endIndex);
    
    // 渲染结果
    resultsList.innerHTML = pageResults.map(item => renderResultItem(item)).join('');
    
    // 渲染分页
    renderPagination();
    
    // 绑定结果项点击事件
    bindResultItemEvents();
}

/**
 * 渲染结果项
 */
function renderResultItem(item) {
    const typeIcons = {
        procurement: 'shopping-cart',
        clue: 'lightbulb',
        alert: 'exclamation-triangle',
        workorder: 'clipboard-list',
        model: 'cube',
        report: 'file-alt'
    };
    
    const typeNames = {
        procurement: '采购项目',
        clue: '线索',
        alert: '预警',
        workorder: '工单',
        model: '模型',
        report: '报表'
    };
    
    // 高亮关键词
    const highlightText = (text) => {
        if (!searchKeyword) return text;
        const regex = new RegExp(`(${searchKeyword})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    };
    
    return `
        <div class="search-result-item" data-id="${item.id}" data-type="${item.type}">
            <div class="result-header">
                <div class="result-icon ${item.type}">
                    <i class="fas fa-${typeIcons[item.type]}"></i>
                </div>
                <div class="result-content">
                    <h3 class="result-title">${highlightText(item.title)}</h3>
                    <p class="result-description">${highlightText(item.description)}</p>
                    <div class="result-meta">
                        <span class="result-type ${item.type}">${typeNames[item.type]}</span>
                        <span class="result-meta-item">
                            <i class="fas fa-folder"></i>
                            ${item.category}
                        </span>
                        <span class="result-meta-item">
                            <i class="fas fa-clock"></i>
                            ${item.time}
                        </span>
                        ${item.status ? `
                            <span class="result-meta-item">
                                <i class="fas fa-info-circle"></i>
                                ${item.status}
                            </span>
                        ` : ''}
                        ${item.level ? `
                            <span class="result-meta-item">
                                <i class="fas fa-signal"></i>
                                ${item.level}
                            </span>
                        ` : ''}
                        ${item.accuracy ? `
                            <span class="result-meta-item">
                                <i class="fas fa-chart-line"></i>
                                准确率 ${item.accuracy}
                            </span>
                        ` : ''}
                        ${item.views ? `
                            <span class="result-meta-item">
                                <i class="fas fa-eye"></i>
                                ${item.views} 次查看
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染分页
 */
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredResults.length / pageSize);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // 显示页码
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        html += `<button onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            html += `<span class="pagination-info">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="pagination-info">...</span>`;
        }
        html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    html += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    html += `<span class="pagination-info">共 ${totalPages} 页</span>`;
    
    pagination.innerHTML = html;
}

/**
 * 跳转到指定页
 */
function goToPage(page) {
    currentPage = page;
    displayResults();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 绑定结果项点击事件
 */
function bindResultItemEvents() {
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            const type = item.dataset.type;
            
            // 根据类型跳转到对应页面
            const pageMap = {
                clue: 'clue-detail.html',
                alert: 'alert-center.html',
                workorder: 'work-order.html',
                model: 'supervision-model-detail.html',
                report: 'report-center.html',
                procurement: 'procurement-project-detail.html'
            };
            
            const page = pageMap[type] || 'index.html';
            window.location.href = `${page}?id=${id}`;
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);
