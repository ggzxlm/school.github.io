// 线索库管理页面脚本

// 模拟预警数据（用于预警转化选择）
const mockAlerts = [
    {
        id: 'YJ-2025-001',
        title: '科研经费异常报销 - 连号发票检测',
        type: '科研经费',
        risk: 'high',
        department: '计算机学院',
        person: '张教授',
        amount: '5.2万元',
        time: '2025-09-28 09:30',
        status: 'pending',
        description: '检测到张教授课题组存在连号发票报销，涉及金额 5.2 万元'
    },
    {
        id: 'YJ-2025-002',
        title: '三公经费超预算预警',
        type: '财务管理',
        risk: 'high',
        department: '行政办公室',
        person: '办公室主任',
        amount: '28.5万元',
        time: '2025-10-15 14:20',
        status: 'pending',
        description: '行政办公室三公经费支出已超预算85%，存在超支风险'
    },
    {
        id: 'YJ-2025-003',
        title: '招生录取低分高录异常',
        type: '招生录取',
        risk: 'high',
        department: '计算机学院',
        person: '招生负责人',
        amount: '-',
        time: '2025-10-08 14:20',
        status: 'pending',
        description: '发现3例低分高录情况，需要核查录取流程是否规范'
    },
    {
        id: 'YJ-2025-004',
        title: '基建项目资金使用异常',
        type: '基建工程',
        risk: 'medium',
        department: '基建处',
        person: '项目负责人',
        amount: '120万元',
        time: '2025-10-12 10:15',
        status: 'pending',
        description: '图书馆改造项目资金使用进度与工程进度不匹配'
    },
    {
        id: 'YJ-2025-005',
        title: '采购项目供应商关联异常',
        type: '采购管理',
        risk: 'medium',
        department: '采购中心',
        person: '采购负责人',
        amount: '380万元',
        time: '2025-10-19 15:30',
        status: 'pending',
        description: '实验设备采购项目中检测到3家投标供应商存在关联关系'
    },
    {
        id: 'YJ-2025-006',
        title: '学术不端行为预警',
        type: '学术诚信',
        risk: 'high',
        department: '数学学院',
        person: '某教师',
        amount: '-',
        time: '2025-10-18 16:45',
        status: 'pending',
        description: '论文查重率达到45%，存在大段抄袭嫌疑'
    }
];

// 模拟线索数据 - 与工单和整改关联
const mockClues = [
    {
        id: 'CLUE2025001',
        title: '科研经费报销存在连号发票异常',
        type: '系统预警',
        risk: 'high',
        unit: '计算机学院',
        description: '监督模型发现某教授科研经费报销存在5张连号发票，金额合计8.5万元，存在虚假报销嫌疑。',
        source: '监督模型自动预警',
        createdAt: '2025-09-28',
        status: 'completed',
        // 来源预警信息
        alertSource: {
            alertId: 'YJ-2025-001',
            alertTitle: '科研经费异常报销 - 连号发票检测',
            alertType: '科研经费',
            alertRisk: '高风险',
            alertTime: '2025-09-28 09:30',
            alertDepartment: '计算机学院'
        },
        // 关联工单
        workOrderId: 'WO202510210001',
        workOrderTitle: '科研经费异常报销核查',
        workOrderStatus: '已完成',
        // 关联整改
        rectificationId: 'ZG2025001',
        rectificationTitle: '科研经费报销不规范问题整改',
        rectificationProgress: 75
    },
    {
        id: 'CLUE2025002',
        title: '固定资产账实不符',
        type: '审计发现',
        risk: 'medium',
        unit: '资产管理处',
        description: '年度资产盘点发现15件设备账实不符，涉及金额约120万元。',
        source: '年度审计报告',
        createdAt: '2025-08-15',
        status: 'completed',
        workOrderId: 'WO202509150001',
        workOrderTitle: '固定资产盘点差异核查',
        workOrderStatus: '已完成',
        rectificationId: 'ZG2025002',
        rectificationTitle: '固定资产管理不规范整改',
        rectificationProgress: 100
    },
    {
        id: 'CLUE2025003',
        title: '招生录取存在低分高录情况',
        type: '系统预警',
        risk: 'high',
        unit: '招生办',
        description: '系统预警发现某专业存在低分高录情况，需要核查录取过程是否规范。',
        source: '招生监督模型',
        createdAt: '2025-10-08',
        status: 'completed',
        // 来源预警信息
        alertSource: {
            alertId: 'YJ-2025-003',
            alertTitle: '招生录取低分高录异常',
            alertType: '招生录取',
            alertRisk: '高风险',
            alertTime: '2025-10-08 14:20',
            alertDepartment: '计算机学院'
        },
        workOrderId: 'WO202510170004',
        workOrderTitle: '招生录取数据异常核查',
        workOrderStatus: '已完成',
        rectificationId: 'ZG2025003',
        rectificationTitle: '招生录取数据异常问题整改',
        rectificationProgress: 90
    },
    {
        id: 'CLUE2025004',
        title: '基建项目招标文件存在排他性条款',
        type: '审计发现',
        risk: 'high',
        unit: '基建处',
        description: '新建实验楼招标文件中发现2处疑似排他性条款，限制了公平竞争。',
        source: '基建项目审计',
        createdAt: '2025-10-12',
        status: 'processing',
        workOrderId: 'WO202510200002',
        workOrderTitle: '基建项目招标文件审查',
        workOrderStatus: '待审核',
        rectificationId: 'ZG2025004',
        rectificationTitle: '基建项目招标文件排他性条款整改',
        rectificationProgress: 65
    },
    {
        id: 'CLUE2025005',
        title: '三公经费支出存在疑似隐蔽吃喝',
        type: '专项检查',
        risk: 'high',
        unit: '财务处',
        description: '三公经费专项检查中发现3笔疑似隐蔽吃喝的支出，需要进一步核查。',
        source: '三公经费专项检查',
        createdAt: '2025-10-10',
        status: 'processing',
        workOrderId: 'WO202510190003',
        workOrderTitle: '三公经费支出专项检查',
        workOrderStatus: '进行中',
        rectificationId: 'ZG2025005',
        rectificationTitle: '三公经费支出不规范整改',
        rectificationProgress: 45
    },
    {
        id: 'CLUE2025006',
        title: '教师课堂言论不当收到学生投诉',
        type: '举报线索',
        risk: 'high',
        unit: '文学院',
        description: '收到学生投诉，某教师课堂言论不当，对学生态度恶劣，存在师德失范行为。',
        source: '学生投诉',
        createdAt: '2025-10-12',
        status: 'processing',
        workOrderId: 'WO202510220001',
        workOrderTitle: '师德师风问题核查',
        workOrderStatus: '进行中',
        rectificationId: 'ZG2025006',
        rectificationTitle: '师德师风问题整改',
        rectificationProgress: 80
    },
    {
        id: 'CLUE2025007',
        title: '论文存在抄袭嫌疑',
        type: '学术检测',
        risk: 'high',
        unit: '数学学院',
        description: '学术检测发现某教师论文查重率达到45%，存在大段抄袭。',
        source: '学术不端检测系统',
        createdAt: '2025-10-15',
        status: 'processing',
        workOrderId: 'WO202510250001',
        workOrderTitle: '学术不端问题调查',
        workOrderStatus: '进行中',
        rectificationId: 'ZG2025007',
        rectificationTitle: '学术不端问题整改',
        rectificationProgress: 30
    },
    {
        id: 'CLUE2025008',
        title: '教师校外有偿补课',
        type: '举报线索',
        risk: 'medium',
        unit: '物理学院',
        description: '家长举报某教师在校外培训机构兼职，给本校学生补课。',
        source: '家长举报',
        createdAt: '2025-10-10',
        status: 'processing',
        workOrderId: 'WO202510280001',
        workOrderTitle: '违规补课问题核查',
        workOrderStatus: '进行中',
        rectificationId: 'ZG2025008',
        rectificationTitle: '违规补课问题整改',
        rectificationProgress: 85
    },
    {
        id: 'CLUE2025009',
        title: '第一议题学习次数不足',
        type: '巡查发现',
        risk: 'medium',
        unit: '计算机学院',
        description: '本月实际学习2次，要求4次，缺失2次学习内容。',
        source: '第一议题监督检查',
        createdAt: '2025-10-18',
        status: 'processing',
        workOrderId: 'WO202510300001',
        workOrderTitle: '第一议题学习情况核查',
        workOrderStatus: '进行中',
        rectificationId: 'ZG2025009',
        rectificationTitle: '第一议题学习不到位整改',
        rectificationProgress: 60
    },
    {
        id: 'CLUE2025010',
        title: '采购项目化整为零规避招标',
        type: '审计发现',
        risk: 'high',
        unit: '采购中心',
        description: '部分采购项目未按规定进行公开招标，存在化整为零、规避招标等问题。',
        source: '采购审计',
        createdAt: '2025-10-20',
        status: 'processing',
        workOrderId: 'WO202511010001',
        workOrderTitle: '采购流程合规性检查',
        workOrderStatus: '进行中',
        rectificationId: 'ZG2025010',
        rectificationTitle: '采购流程不规范整改',
        rectificationProgress: 55
    },
    {
        id: 'CLUE2025011',
        title: '实验室危化品管理不规范',
        type: '专项检查',
        risk: 'high',
        unit: '化学学院',
        description: '实验室存在危化品管理不规范、安全设施不完善等问题，存在安全隐患。',
        source: '实验室安全检查',
        createdAt: '2025-10-05',
        status: 'completed',
        workOrderId: 'WO202510150001',
        workOrderTitle: '实验室安全隐患排查',
        workOrderStatus: '已完成',
        rectificationId: 'ZG2025011',
        rectificationTitle: '实验室安全隐患整改',
        rectificationProgress: 95
    },
    {
        id: 'CLUE2025012',
        title: '学生资助资金发放不及时',
        type: '审计发现',
        risk: 'medium',
        unit: '学生处',
        description: '学生资助资金发放不及时，部分资助对象认定不准确。',
        source: '学生资助审计',
        createdAt: '2025-10-22',
        status: 'processing',
        workOrderId: 'WO202511050001',
        workOrderTitle: '学生资助管理检查',
        workOrderStatus: '进行中',
        rectificationId: 'ZG2025012',
        rectificationTitle: '学生资助资金管理不规范整改',
        rectificationProgress: 70
    },
    {
        id: 'CLUE2025013',
        title: '科研项目结题审计发现问题',
        type: '审计发现',
        risk: 'medium',
        unit: '科研处',
        description: '科研项目结题审计发现部分项目经费使用不规范，存在超范围支出。',
        source: '科研项目审计',
        createdAt: '2025-10-25',
        status: 'pending',
        workOrderId: null,
        workOrderTitle: null,
        workOrderStatus: null,
        rectificationId: null,
        rectificationTitle: null,
        rectificationProgress: 0
    },
    {
        id: 'CLUE2025014',
        title: '公车私用问题线索',
        type: '举报线索',
        risk: 'medium',
        unit: '后勤管理处',
        description: '匿名举报某部门存在公车私用问题，需要调查核实。',
        source: '匿名举报',
        createdAt: '2025-10-26',
        status: 'pending',
        workOrderId: null,
        workOrderTitle: null,
        workOrderStatus: null,
        rectificationId: null,
        rectificationTitle: null,
        rectificationProgress: 0
    },
    {
        id: 'CLUE2025015',
        title: '教材采购价格异常',
        type: '系统预警',
        risk: 'high',
        unit: '教务处',
        description: '系统预警发现某批次教材采购价格明显高于市场价，存在异常。',
        source: '采购监督模型',
        createdAt: '2025-10-27',
        status: 'pending',
        workOrderId: null,
        workOrderTitle: null,
        workOrderStatus: null,
        rectificationId: null,
        rectificationTitle: null,
        rectificationProgress: 0
    }
];

let currentPage = 1;
let pageSize = 10;
let filteredData = [...mockClues];
let currentClue = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('线索库页面初始化...');
    console.log('模拟数据数量:', mockClues.length);
    initializePage();
});

// 初始化页面
function initializePage() {
    const detailModal = document.getElementById('detailModal');
    if (detailModal) {
        detailModal.style.display = 'none';
    }
    
    updateDashboard();
    renderTable();
    bindEvents();
}

// 更新看板数据
function updateDashboard() {
    const total = mockClues.length;
    const pending = mockClues.filter(c => c.status === 'pending').length;
    const processing = mockClues.filter(c => c.status === 'processing').length;
    const completed = mockClues.filter(c => c.status === 'completed').length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('processingCount').textContent = processing;
    document.getElementById('completedCount').textContent = completed;
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('clueTableBody');
    if (!tbody) {
        console.error('找不到表格元素 clueTableBody');
        return;
    }
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--color-gray-500);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                    <p>暂无线索数据</p>
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }
    
    tbody.innerHTML = pageData.map(item => {
        const riskClass = item.risk === 'high' ? 'high' : item.risk === 'medium' ? 'medium' : 'low';
        const riskText = item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险';
        
        const statusMap = {
            'pending': { text: '待处置', class: 'status-pending' },
            'processing': { text: '处置中', class: 'status-in-progress' },
            'completed': { text: '已完成', class: 'status-completed' }
        };
        
        const status = statusMap[item.status] || statusMap['pending'];
        
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.type}</td>
                <td>
                    <span class="risk-badge ${riskClass}">${riskText}</span>
                </td>
                <td>${item.unit}</td>
                <td>${item.createdAt}</td>
                <td>
                    <span class="status-badge ${status.class}">${status.text}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewDetail('${item.id}')">
                        <i class="fas fa-eye"></i> 查看详情
                    </button>
                    ${item.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="createWorkOrderFromClueId('${item.id}')">
                            <i class="fas fa-plus"></i> 创建工单
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
    
    updatePagination();
}

// 更新分页
function updatePagination() {
    const total = filteredData.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    
    document.getElementById('pageStart').textContent = total > 0 ? start : 0;
    document.getElementById('pageEnd').textContent = end;
    document.getElementById('totalItems').textContent = total;
    
    const pagesContainer = document.getElementById('paginationPages');
    if (!pagesContainer) return;
    
    let pagesHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pagesHTML += `
                <button class="btn btn-sm ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pagesHTML += '<span style="padding: 0 8px;">...</span>';
        }
    }
    pagesContainer.innerHTML = pagesHTML;
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// 绑定事件
function bindEvents() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            setTimeout(filterData, 300);
        });
    }
    
    const typeFilter = document.getElementById('typeFilter');
    const riskFilter = document.getElementById('riskFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (typeFilter) typeFilter.addEventListener('change', filterData);
    if (riskFilter) riskFilter.addEventListener('change', filterData);
    if (statusFilter) statusFilter.addEventListener('change', filterData);
}

// 筛选数据
function filterData() {
    const searchText = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const typeValue = document.getElementById('typeFilter')?.value || '';
    const riskValue = document.getElementById('riskFilter')?.value || '';
    const statusValue = document.getElementById('statusFilter')?.value || '';
    
    filteredData = mockClues.filter(item => {
        const matchSearch = !searchText || 
            item.id.toLowerCase().includes(searchText) ||
            item.title.toLowerCase().includes(searchText) ||
            item.source.toLowerCase().includes(searchText);
        
        const matchType = !typeValue || item.type === typeValue;
        const matchRisk = !riskValue || item.risk === riskValue;
        const matchStatus = !statusValue || item.status === statusValue;
        
        return matchSearch && matchType && matchRisk && matchStatus;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置筛选
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('riskFilter').value = '';
    document.getElementById('statusFilter').value = '';
    filterData();
}

// 分页函数
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}

// 查看详情
function viewDetail(id) {
    currentClue = mockClues.find(c => c.id === id);
    if (!currentClue) return;
    
    // 填充基本信息
    document.getElementById('detailClueNo').textContent = currentClue.id;
    document.getElementById('detailType').textContent = currentClue.type;
    
    const riskText = currentClue.risk === 'high' ? '高风险' : currentClue.risk === 'medium' ? '中风险' : '低风险';
    const riskClass = currentClue.risk;
    document.getElementById('detailRisk').innerHTML = `<span class="risk-badge ${riskClass}">${riskText}</span>`;
    
    document.getElementById('detailUnit').textContent = currentClue.unit;
    document.getElementById('detailCreateTime').textContent = currentClue.createdAt;
    
    const statusMap = {
        'pending': '待处置',
        'processing': '处置中',
        'completed': '已完成'
    };
    document.getElementById('detailStatus').innerHTML = `<span class="status-badge status-${currentClue.status}">${statusMap[currentClue.status]}</span>`;
    
    document.getElementById('detailTitle').textContent = currentClue.title;
    document.getElementById('detailDescription').textContent = currentClue.description;
    
    // 处置信息
    const disposalSection = document.getElementById('disposalSection');
    const createWorkOrderBtn = document.getElementById('createWorkOrderBtn');
    
    if (currentClue.workOrderId) {
        disposalSection.style.display = 'block';
        createWorkOrderBtn.style.display = 'none';
        
        document.getElementById('workOrderTitle').textContent = currentClue.workOrderTitle;
        document.getElementById('workOrderMeta').textContent = `工单编号: ${currentClue.workOrderId} · 状态: ${currentClue.workOrderStatus}`;
        
        document.getElementById('viewWorkOrderBtn').onclick = function() {
            window.location.href = `work-order.html?id=${currentClue.workOrderId}`;
        };
    } else {
        disposalSection.style.display = 'none';
        createWorkOrderBtn.style.display = 'inline-flex';
    }
    
    // 来源信息（预警）
    const sourceSection = document.getElementById('sourceSection');
    if (currentClue.alertSource) {
        sourceSection.style.display = 'block';
        
        document.getElementById('alertTitle').textContent = currentClue.alertSource.alertTitle;
        document.getElementById('alertMeta').textContent = `预警编号: ${currentClue.alertSource.alertId} · 类型: ${currentClue.alertSource.alertType} · 时间: ${currentClue.alertSource.alertTime}`;
        
        document.getElementById('viewAlertBtn').onclick = function() {
            window.open(`alert-center.html?id=${currentClue.alertSource.alertId}`, '_blank');
        };
    } else {
        sourceSection.style.display = 'none';
    }
    
    // 整改信息
    const rectificationSection = document.getElementById('rectificationSection');
    if (currentClue.rectificationId) {
        rectificationSection.style.display = 'block';
        
        document.getElementById('rectificationTitle').textContent = currentClue.rectificationTitle;
        document.getElementById('rectificationMeta').textContent = `整改编号: ${currentClue.rectificationId} · 进度: ${currentClue.rectificationProgress}%`;
        
        document.getElementById('viewRectificationBtn').onclick = function() {
            window.location.href = `rectification.html?id=${currentClue.rectificationId}`;
        };
    } else {
        rectificationSection.style.display = 'none';
    }
    
    // 显示模态框
    const modal = document.getElementById('detailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

// 关闭详情模态框
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 从线索创建工单
function createWorkOrderFromClue() {
    if (!currentClue) return;
    
    // 跳转到工单页面并传递线索信息
    window.location.href = `work-order.html?action=create&clueId=${currentClue.id}`;
}

function createWorkOrderFromClueId(clueId) {
    window.location.href = `work-order.html?action=create&clueId=${clueId}`;
}

// 新增线索
function createClue() {
    const modal = document.getElementById('createClueModal');
    if (modal) {
        modal.classList.add('active');
        // 重置表单
        document.getElementById('createClueForm').reset();
        // 设置默认日期为今天
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('clueDate').value = today;
    }
}

// 关闭新增线索模态框
function closeCreateModal() {
    const modal = document.getElementById('createClueModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 全局变量：选中的预警
let selectedAlert = null;

// 监听线索来源选择变化
function onSourceChange() {
    const sourceSelect = document.getElementById('clueSource');
    if (sourceSelect.value === '预警转化') {
        // 打开预警选择模态框
        showAlertSelectModal();
    }
}

// 显示预警选择模态框
function showAlertSelectModal() {
    const modal = document.getElementById('alertSelectModal');
    modal.classList.add('active');
    
    // 渲染预警列表
    renderAlertList();
    
    // 绑定搜索事件
    const searchInput = document.getElementById('alertSearchInput');
    searchInput.value = ''; // 清空搜索框
    searchInput.addEventListener('input', filterAlerts);
}

// 关闭预警选择模态框
function closeAlertSelectModal() {
    const modal = document.getElementById('alertSelectModal');
    modal.classList.remove('active');
    
    // 如果没有选择预警，重置来源选择
    if (!selectedAlert) {
        document.getElementById('clueSource').value = '';
    }
}

// 渲染预警列表
function renderAlertList(alerts = mockAlerts) {
    const alertList = document.getElementById('alertList');
    
    if (alerts.length === 0) {
        alertList.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;">暂无可选择的预警</div>';
        return;
    }
    
    alertList.innerHTML = alerts.map(alert => `
        <div class="alert-item" data-alert-id="${alert.id}" onclick="selectAlert('${alert.id}')">
            <div class="alert-item-header">
                <div class="alert-item-title">${alert.title}</div>
                <div class="alert-item-badges">
                    <span class="badge badge-${alert.risk}">${alert.risk === 'high' ? '高风险' : alert.risk === 'medium' ? '中风险' : '低风险'}</span>
                    <span class="badge badge-type">${alert.type}</span>
                </div>
            </div>
            <div class="alert-item-meta">
                <span><i class="fas fa-hashtag"></i> ${alert.id}</span>
                <span><i class="fas fa-building"></i> ${alert.department}</span>
                <span><i class="fas fa-user"></i> ${alert.person}</span>
                <span><i class="fas fa-clock"></i> ${alert.time}</span>
            </div>
            <div class="alert-item-description">${alert.description}</div>
        </div>
    `).join('');
}

// 过滤预警
function filterAlerts() {
    const searchTerm = document.getElementById('alertSearchInput').value.toLowerCase();
    const filteredAlerts = mockAlerts.filter(alert => 
        alert.id.toLowerCase().includes(searchTerm) ||
        alert.title.toLowerCase().includes(searchTerm) ||
        alert.department.toLowerCase().includes(searchTerm) ||
        alert.person.toLowerCase().includes(searchTerm)
    );
    renderAlertList(filteredAlerts);
}

// 选择预警
function selectAlert(alertId) {
    // 移除之前的选中状态
    document.querySelectorAll('.alert-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 添加选中状态
    const selectedItem = document.querySelector(`[data-alert-id="${alertId}"]`);
    selectedItem.classList.add('selected');
    
    // 保存选中的预警
    selectedAlert = mockAlerts.find(alert => alert.id === alertId);
    
    // 启用确认按钮
    document.getElementById('confirmAlertBtn').disabled = false;
}

// 确认预警选择
function confirmAlertSelection() {
    if (!selectedAlert) return;
    
    // 自动填充表单
    document.getElementById('clueTitle').value = selectedAlert.title;
    document.getElementById('clueType').value = selectedAlert.type;
    document.getElementById('clueRisk').value = selectedAlert.risk;
    document.getElementById('clueDepartment').value = selectedAlert.department;
    document.getElementById('cluePerson').value = selectedAlert.person;
    document.getElementById('clueDescription').value = `基于预警"${selectedAlert.title}"转化而来。\n\n原预警描述：${selectedAlert.description}`;
    
    // 关闭预警选择模态框
    closeAlertSelectModal();
}

// 提交新线索
function submitNewClue() {
    const form = document.getElementById('createClueForm');
    
    // 验证表单
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 获取表单数据
    const newClue = {
        id: mockData.length + 1,
        code: `XS-2025-${String(mockData.length + 1).padStart(3, '0')}`,
        title: document.getElementById('clueTitle').value,
        type: document.getElementById('clueType').value,
        risk: document.getElementById('clueRisk').value,
        source: document.getElementById('clueSource').value,
        department: document.getElementById('clueDepartment').value || '-',
        person: document.getElementById('cluePerson').value || '-',
        amount: document.getElementById('clueAmount').value || '0',
        date: document.getElementById('clueDate').value,
        description: document.getElementById('clueDescription').value,
        evidence: document.getElementById('clueEvidence').value || '-',
        status: 'pending',
        statusText: '待核查',
        handler: '未分配',
        createdAt: new Date().toISOString().split('T')[0],
        workOrder: null,
        rectification: null
    };
    
    // 如果是预警转化，添加预警来源信息
    if (selectedAlert) {
        newClue.alertSource = {
            alertId: selectedAlert.id,
            alertTitle: selectedAlert.title,
            alertType: selectedAlert.type,
            alertRisk: selectedAlert.risk === 'high' ? '高风险' : selectedAlert.risk === 'medium' ? '中风险' : '低风险',
            alertTime: selectedAlert.time,
            alertDepartment: selectedAlert.department
        };
    }
    
    // 添加到数据列表
    mockData.unshift(newClue);
    
    // 重置选中的预警
    selectedAlert = null;
    
    // 关闭模态框
    closeCreateModal();
    
    // 刷新列表
    applyFilters();
    
    // 显示成功提示
    showToast('线索创建成功！', 'success');
}

// 导出数据
function exportData() {
    showToast('正在导出数据...', 'info');
    setTimeout(() => {
        showToast(`已导出 ${filteredData.length} 条数据`, 'success');
    }, 1000);
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
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}
