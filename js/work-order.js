// 工单管理页面脚本

// 全局变量
let currentOrderId = null; // 当前查看的工单ID

// 模拟工单数据
const mockOrders = [
    {
        id: 1,
        orderNo: 'WO202510210001',
        title: '科研经费异常报销核查',
        type: '纪检核查',
        priority: '高',
        status: '进行中',
        leader: '张三',
        assignee: '张三',
        creator: '李四',
        createTime: '2025-10-15 09:30:00',
        deadline: '2025-10-25',
        description: '发现某教授科研经费报销存在连号发票和异常支出，需要进行详细核查。',
        team: [
            { name: '张三', role: '组长', department: '纪检监察室' },
            { name: '王五', role: '成员', department: '纪检监察室' },
            { name: '赵六', role: '成员', department: '审计处' }
        ],
        tasks: [
            { name: '调取报销凭证', assignee: '王五', status: '已完成', progress: 100 },
            { name: '核实发票真伪', assignee: '赵六', status: '进行中', progress: 60 },
            { name: '约谈当事人', assignee: '张三', status: '待开始', progress: 0 }
        ],
        discussions: [
            { user: '张三', time: '2025-10-20 14:30', content: '已调取相关报销凭证，发现5张连号发票，需要进一步核实。' },
            { user: '赵六', time: '2025-10-20 16:45', content: '已联系税务部门，正在核实发票真伪。' },
            { user: '王五', time: '2025-10-21 09:15', content: '建议尽快约谈当事人了解情况。' }
        ]
    },
    {
        id: 2,
        orderNo: 'WO202510200002',
        title: '基建项目招标文件审查',
        type: '审计核查',
        priority: '中',
        status: '待审核',
        leader: '李明',
        assignee: '李明',
        creator: '王强',
        createTime: '2025-10-18 14:20:00',
        deadline: '2025-10-28',
        description: '对新建实验楼招标文件进行合规性审查，重点关注排他性条款。',
        team: [
            { name: '李明', role: '组长', department: '审计处' },
            { name: '陈七', role: '成员', department: '审计处' }
        ],
        tasks: [
            { name: '审查招标文件', assignee: '李明', status: '已完成', progress: 100 },
            { name: '编写审查报告', assignee: '陈七', status: '已完成', progress: 100 }
        ],
        discussions: [
            { user: '李明', time: '2025-10-19 10:00', content: '招标文件中发现2处疑似排他性条款。' },
            { user: '陈七', time: '2025-10-19 15:30', content: '审查报告已完成，建议要求修改招标文件。' }
        ]
    },
    {
        id: 3,
        orderNo: 'WO202510190003',
        title: '三公经费支出专项检查',
        type: '联合核查',
        priority: '高',
        status: '进行中',
        leader: '刘芳',
        assignee: '刘芳',
        creator: '张伟',
        createTime: '2025-10-16 11:00:00',
        deadline: '2025-10-30',
        description: '对本年度三公经费支出进行专项检查，重点关注公务接待和公车使用。',
        team: [
            { name: '刘芳', role: '组长', department: '纪检监察室' },
            { name: '孙八', role: '成员', department: '纪检监察室' },
            { name: '周九', role: '成员', department: '审计处' },
            { name: '吴十', role: '成员', department: '财务处' }
        ],
        tasks: [
            { name: '调取支出明细', assignee: '吴十', status: '已完成', progress: 100 },
            { name: '分析异常支出', assignee: '周九', status: '进行中', progress: 75 },
            { name: '现场核查', assignee: '孙八', status: '进行中', progress: 40 },
            { name: '形成检查报告', assignee: '刘芳', status: '待开始', progress: 0 }
        ],
        discussions: [
            { user: '吴十', time: '2025-10-17 09:00', content: '已提供本年度三公经费支出明细。' },
            { user: '周九', time: '2025-10-18 14:20', content: '发现3笔疑似隐蔽吃喝的支出。' },
            { user: '孙八', time: '2025-10-19 16:00', content: '正在对相关单位进行现场核查。' }
        ]
    },
    {
        id: 4,
        orderNo: 'WO202510170004',
        title: '招生录取数据异常核查',
        type: '专项核查',
        priority: '高',
        status: '已完成',
        leader: '郑十一',
        assignee: '郑十一',
        creator: '钱十二',
        createTime: '2025-10-10 10:15:00',
        deadline: '2025-10-20',
        description: '系统预警发现某专业存在低分高录情况，需要核查录取过程。',
        team: [
            { name: '郑十一', role: '组长', department: '纪检监察室' },
            { name: '冯十三', role: '成员', department: '纪检监察室' }
        ],
        tasks: [
            { name: '调取录取数据', assignee: '冯十三', status: '已完成', progress: 100 },
            { name: '核实录取规则', assignee: '郑十一', status: '已完成', progress: 100 },
            { name: '形成核查结论', assignee: '郑十一', status: '已完成', progress: 100 }
        ],
        discussions: [
            { user: '冯十三', time: '2025-10-11 09:30', content: '已调取相关录取数据和招生章程。' },
            { user: '郑十一', time: '2025-10-12 14:00', content: '经核查，录取过程符合招生章程规定，不存在违规情况。' }
        ]
    },
    {
        id: 5,
        orderNo: 'WO202510160005',
        title: '固定资产盘点差异核查',
        type: '审计核查',
        priority: '中',
        status: '进行中',
        leader: '褚十四',
        assignee: '褚十四',
        creator: '卫十五',
        createTime: '2025-10-14 15:45:00',
        deadline: '2025-10-28',
        description: '年度资产盘点发现部分设备账实不符，需要核查原因。',
        team: [
            { name: '褚十四', role: '组长', department: '审计处' },
            { name: '蒋十六', role: '成员', department: '审计处' },
            { name: '沈十七', role: '成员', department: '资产处' }
        ],
        tasks: [
            { name: '核对资产台账', assignee: '沈十七', status: '已完成', progress: 100 },
            { name: '现场盘点', assignee: '蒋十六', status: '进行中', progress: 80 },
            { name: '分析差异原因', assignee: '褚十四', status: '待开始', progress: 0 }
        ],
        discussions: [
            { user: '沈十七', time: '2025-10-15 10:00', content: '已提供资产台账，共发现15件设备存在差异。' },
            { user: '蒋十六', time: '2025-10-16 11:30', content: '现场盘点进行中，已核实10件设备。' }
        ]
    },
    {
        id: 6,
        orderNo: 'WO202510150006',
        title: '科研项目结题审计',
        type: '审计核查',
        priority: '低',
        status: '待分配',
        leader: '',
        assignee: '',
        creator: '韩十八',
        createTime: '2025-10-13 09:00:00',
        deadline: '2025-11-13',
        description: '对已结题的国家级科研项目进行经费使用审计。',
        team: [],
        tasks: [],
        discussions: []
    }
];

// 全局变量
let currentPage = 1;
const pageSize = 10;
let filteredOrders = [...mockOrders];
let sortField = '';
let sortOrder = 'asc';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 公共组件已在 components.js 中自动初始化
    // TopNavbar.init(), SideNavbar.init(), Footer.init() 会自动执行
    
    // 初始化页面
    initPage();
    
    // 绑定事件
    bindEvents();
});

// 初始化页面
function initPage() {
    // 初始化模态框为隐藏状态
    const orderDetailModal = document.getElementById('orderDetailModal');
    if (orderDetailModal) {
        orderDetailModal.style.display = 'none';
    }
    
    const createOrderModal = document.getElementById('createOrderModal');
    if (createOrderModal) {
        createOrderModal.style.display = 'none';
    }
    
    updateStatistics();
    renderOrderTable();
}

// 更新统计数据
function updateStatistics() {
    const total = mockOrders.length;
    const inProgress = mockOrders.filter(o => o.status === '进行中').length;
    const completed = mockOrders.filter(o => o.status === '已完成').length;
    const overdue = mockOrders.filter(o => {
        // 简单模拟：创建时间超过7天且未完成的视为超期
        const createDate = new Date(o.createTime);
        const now = new Date();
        const days = Math.floor((now - createDate) / (1000 * 60 * 60 * 24));
        return days > 7 && o.status !== '已完成' && o.status !== '已关闭';
    }).length;
    
    document.getElementById('totalOrders').textContent = total;
    document.getElementById('inProgressOrders').textContent = inProgress;
    document.getElementById('completedOrders').textContent = completed;
    document.getElementById('overdueOrders').textContent = overdue;
}

// 渲染工单表格
function renderOrderTable() {
    const tbody = document.getElementById('orderTableBody');
    
    // 应用排序
    if (sortField) {
        filteredOrders.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            
            if (sortField === 'createTime') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }
    
    // 分页
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageOrders = filteredOrders.slice(start, end);
    
    if (pageOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-12">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>暂无工单数据</p>
                    </div>
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }
    
    tbody.innerHTML = pageOrders.map(order => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-blue-600">${order.orderNo}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-900">${order.title}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${order.type}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getPriorityBadge(order.priority)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">${order.leader || '-'}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getStatusBadge(order.status)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${order.createTime}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="action-btn action-btn-primary mr-2" onclick="event.preventDefault(); event.stopPropagation(); viewOrderDetail(${order.id}); return false;">
                    <i class="fas fa-eye mr-1"></i>查看
                </button>
                ${order.status !== '已完成' && order.status !== '已关闭' ? `
                    <button class="action-btn action-btn-secondary mr-2" onclick="event.preventDefault(); event.stopPropagation(); editOrder(${order.id}); return false;">
                        <i class="fas fa-edit mr-1"></i>编辑
                    </button>
                    <button class="action-btn action-btn-danger" onclick="event.preventDefault(); event.stopPropagation(); closeOrder(${order.id}); return false;">
                        <i class="fas fa-times-circle mr-1"></i>关闭
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
    
    updatePagination();
}

// 获取状态标签
function getStatusBadge(status) {
    const statusMap = {
        '待分配': 'status-pending',
        '进行中': 'status-in-progress',
        '待审核': 'status-review',
        '已完成': 'status-completed',
        '已关闭': 'status-closed'
    };
    
    return `<span class="status-badge ${statusMap[status]}">${status}</span>`;
}

// 获取优先级标签
function getPriorityBadge(priority) {
    const priorityMap = {
        '高': 'priority-high',
        '中': 'priority-medium',
        '低': 'priority-low'
    };
    
    return `<span class="priority-badge ${priorityMap[priority]}">${priority}</span>`;
}

// 更新分页器
function updatePagination() {
    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    
    document.getElementById('pageStart').textContent = total > 0 ? start : 0;
    document.getElementById('pageEnd').textContent = end;
    document.getElementById('totalCount').textContent = total;
    
    // 更新页码按钮
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => goToPage(i);
            pageNumbers.appendChild(btn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const span = document.createElement('span');
            span.className = 'px-2 text-gray-400';
            span.textContent = '...';
            pageNumbers.appendChild(span);
        }
    }
    
    // 更新上一页/下一页按钮状态
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

// 跳转到指定页
function goToPage(page) {
    currentPage = page;
    renderOrderTable();
}

// 绑定事件
function bindEvents() {
    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // 筛选器
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    
    const priorityFilter = document.getElementById('priorityFilter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', applyFilters);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // 新建工单按钮
    const createOrderBtn = document.getElementById('createOrderBtn');
    if (createOrderBtn) {
        createOrderBtn.addEventListener('click', createOrder);
        console.log('新建工单按钮已绑定');
    } else {
        console.error('找不到新建工单按钮');
    }
    
    // 排序
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const field = this.dataset.sort;
            if (sortField === field) {
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                sortField = field;
                sortOrder = 'asc';
            }
            renderOrderTable();
        });
    });
    
    // 分页按钮
    const prevPage = document.getElementById('prevPage');
    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }
    
    const nextPage = document.getElementById('nextPage');
    if (nextPage) {
        nextPage.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredOrders.length / pageSize);
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }
    
    // 工单详情模态框关闭按钮
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDetailModal);
    }
    
    const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
    if (closeDetailModalBtn) {
        closeDetailModalBtn.addEventListener('click', closeDetailModal);
    }
    
    // 点击模态框外部关闭
    const orderDetailModal = document.getElementById('orderDetailModal');
    if (orderDetailModal) {
        orderDetailModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDetailModal();
            }
        });
    }
    
    // 编辑工单按钮
    const editOrderBtn = document.getElementById('editOrderBtn');
    if (editOrderBtn) {
        editOrderBtn.addEventListener('click', function() {
            if (currentOrderId) {
                closeDetailModal();
                editOrder(currentOrderId);
            }
        });
    }
}

// 应用筛选
function applyFilters() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredOrders = mockOrders.filter(order => {
        const matchSearch = !searchText || 
            order.orderNo.toLowerCase().includes(searchText) ||
            order.title.toLowerCase().includes(searchText);
        const matchType = !typeFilter || order.type === typeFilter;
        const matchPriority = !priorityFilter || order.priority === priorityFilter;
        const matchStatus = !statusFilter || order.status === statusFilter;
        
        return matchSearch && matchType && matchPriority && matchStatus;
    });
    
    currentPage = 1;
    renderOrderTable();
}

// 重置筛选
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    document.getElementById('statusFilter').value = '';
    
    filteredOrders = [...mockOrders];
    currentPage = 1;
    renderOrderTable();
}

// 查看工单详情
function viewOrderDetail(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
        return;
    }
    
    // 保存当前工单ID
    currentOrderId = orderId;
    
    // 填充基本信息
    document.getElementById('detailOrderNo').textContent = order.orderNo;
    document.getElementById('detailStatus').innerHTML = getStatusBadge(order.status);
    document.getElementById('detailTitle').textContent = order.title;
    document.getElementById('detailType').textContent = order.type;
    document.getElementById('detailPriority').innerHTML = getPriorityBadge(order.priority);
    document.getElementById('detailCreator').textContent = order.creator;
    document.getElementById('detailCreateTime').textContent = order.createTime;
    document.getElementById('detailDescription').textContent = order.description;
    
    // 渲染核查组成员
    renderTeamMembers(order.team);
    
    // 渲染任务分解
    renderTaskList(order.tasks);
    
    // 渲染讨论记录
    renderDiscussions(order.discussions)
    
    // 显示/隐藏生成整改单按钮
    const createRectBtn = document.getElementById('createRectificationBtn');
    if (createRectBtn) {
        // 只有已完成或待审核的工单才显示生成整改单按钮
        if (order.status === '已完成' || order.status === '待审核') {
            createRectBtn.style.display = 'inline-flex';
            createRectBtn.onclick = () => createRectificationFromOrder(orderId);
        } else {
            createRectBtn.style.display = 'none';
        }
    }
    
    // 显示模态框
    const modal = document.getElementById('orderDetailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

// 关闭工单详情模态框
function closeDetailModal() {
    const modal = document.getElementById('orderDetailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    
    // 清除当前工单ID
    currentOrderId = null;
}

// 编辑工单
function editOrder(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
        showToast('工单不存在', 'error');
        return;
    }
    
    // 打开新建模态框并填充数据
    const modal = document.getElementById('createOrderModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    // 修改标题
    modal.querySelector('h2').innerHTML = '<i class="fas fa-edit text-blue-600 mr-2"></i>编辑工单';
    
    // 填充表单
    document.getElementById('createOrderTitle').value = order.title || '';
    document.getElementById('createOrderType').value = order.type || '';
    document.getElementById('createOrderPriority').value = order.priority || '';
    document.getElementById('createOrderAssignee').value = order.assignee || order.leader || '';
    document.getElementById('createOrderDeadline').value = order.deadline || '';
    document.getElementById('createOrderDescription').value = order.description || '';
    
    // 绑定关闭按钮
    document.getElementById('closeCreateModalBtn').onclick = closeCreateModal;
    document.getElementById('cancelCreateBtn').onclick = closeCreateModal;
    
    // 绑定提交按钮（更新而不是创建）
    document.getElementById('submitCreateBtn').onclick = function() {
        submitEditOrder(orderId);
    };
    document.getElementById('submitCreateBtn').innerHTML = '<i class="fas fa-check mr-2"></i>保存修改';
}

// 提交编辑工单
function submitEditOrder(orderId) {
    const form = document.getElementById('createOrderForm');
    if (!form.checkValidity()) {
        showToast('请填写所有必填项', 'warning');
        return;
    }
    
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // 更新工单信息
    order.title = document.getElementById('createOrderTitle').value;
    order.type = document.getElementById('createOrderType').value;
    order.priority = document.getElementById('createOrderPriority').value;
    order.assignee = document.getElementById('createOrderAssignee').value;
    order.deadline = document.getElementById('createOrderDeadline').value;
    order.description = document.getElementById('createOrderDescription').value;
    
    showToast('工单更新成功', 'success');
    closeCreateModal();
    renderOrders();
}

// 关闭工单
function closeOrder(orderId) {
    if (confirm('确定要关闭此工单吗？')) {
        const order = mockOrders.find(o => o.id === orderId);
        if (order) {
            order.status = '已关闭';
            updateStatistics();
            renderOrderTable();
            showToast('工单已关闭', 'success');
        }
    }
}

// 新建工单
function createOrder() {
    const modal = document.getElementById('createOrderModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    // 设置默认截止日期为7天后
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    document.getElementById('createOrderDeadline').value = deadline.toISOString().split('T')[0];
    
    // 绑定关闭按钮
    document.getElementById('closeCreateModalBtn').onclick = closeCreateModal;
    document.getElementById('cancelCreateBtn').onclick = closeCreateModal;
    
    // 绑定提交按钮
    document.getElementById('submitCreateBtn').onclick = submitCreateOrder;
}

// 关闭新建工单模态框
function closeCreateModal() {
    const modal = document.getElementById('createOrderModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.getElementById('createOrderForm').reset();
    
    // 恢复标题和按钮文本
    modal.querySelector('h2').innerHTML = '<i class="fas fa-plus-circle"></i>新建工单';
    document.getElementById('submitCreateBtn').innerHTML = '<i class="fas fa-check"></i> 创建工单';
    document.getElementById('submitCreateBtn').onclick = submitCreateOrder;
}

// 提交新建工单
function submitCreateOrder() {
    const form = document.getElementById('createOrderForm');
    if (!form.checkValidity()) {
        showToast('请填写所有必填项', 'warning');
        return;
    }
    
    const title = document.getElementById('createOrderTitle').value;
    const type = document.getElementById('createOrderType').value;
    const priority = document.getElementById('createOrderPriority').value;
    const assignee = document.getElementById('createOrderAssignee').value;
    const deadline = document.getElementById('createOrderDeadline').value;
    const description = document.getElementById('createOrderDescription').value;
    
    // 获取核查组成员和任务数据
    const teamMembers = getTeamMembersData();
    const tasks = getTasksData();
    
    // 生成新工单编号
    const newOrderNo = `WO-2025-${String(mockOrders.length + 1).padStart(4, '0')}`;
    
    // 创建新工单对象
    const newOrder = {
        id: mockOrders.length + 1,
        orderNo: newOrderNo,
        title: title,
        type: type,
        priority: priority,
        status: '待处理',
        leader: assignee,
        assignee: assignee,
        creator: '当前用户',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        deadline: deadline,
        description: description,
        team: teamMembers.length > 0 ? teamMembers : [{ name: assignee, role: '负责人', department: '纪检监察室' }],
        tasks: tasks,
        discussions: []
    };
    
    // 添加到数据中
    mockOrders.unshift(newOrder);
    
    showToast('工单创建成功', 'success');
    closeCreateModal();
    renderOrders();
    updateStats();
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建 toast 元素
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
    
    // 2秒后自动移除
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}


// 添加核查组成员
function addTeamMember() {
    const section = document.getElementById('teamMembersSection');
    const memberItem = document.createElement('div');
    memberItem.className = 'team-member-item';
    memberItem.innerHTML = `
        <select class="form-control member-select">
            <option value="">选择成员</option>
            <option value="张三">张三</option>
            <option value="李四">李四</option>
            <option value="王五">王五</option>
            <option value="赵六">赵六</option>
            <option value="钱七">钱七</option>
            <option value="孙八">孙八</option>
        </select>
        <select class="form-control role-select">
            <option value="组长">组长</option>
            <option value="成员">成员</option>
            <option value="协助">协助</option>
        </select>
        <button type="button" class="btn btn-sm btn-danger remove-member-btn" onclick="removeMember(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    section.appendChild(memberItem);
    
    // 显示所有删除按钮
    updateRemoveButtons('teamMembersSection', 'remove-member-btn');
}

// 移除核查组成员
function removeMember(button) {
    const section = document.getElementById('teamMembersSection');
    const memberItem = button.closest('.team-member-item');
    memberItem.remove();
    
    // 更新删除按钮显示状态
    updateRemoveButtons('teamMembersSection', 'remove-member-btn');
}

// 添加任务
function addTask() {
    const section = document.getElementById('tasksSection');
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <input type="text" class="form-control task-title" placeholder="任务标题">
        <select class="form-control task-assignee">
            <option value="">负责人</option>
            <option value="张三">张三</option>
            <option value="李四">李四</option>
            <option value="王五">王五</option>
            <option value="赵六">赵六</option>
        </select>
        <input type="date" class="form-control task-deadline" placeholder="截止日期">
        <button type="button" class="btn btn-sm btn-danger remove-task-btn" onclick="removeTask(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    section.appendChild(taskItem);
    
    // 显示所有删除按钮
    updateRemoveButtons('tasksSection', 'remove-task-btn');
}

// 移除任务
function removeTask(button) {
    const section = document.getElementById('tasksSection');
    const taskItem = button.closest('.task-item');
    taskItem.remove();
    
    // 更新删除按钮显示状态
    updateRemoveButtons('tasksSection', 'remove-task-btn');
}

// 更新删除按钮的显示状态
function updateRemoveButtons(sectionId, buttonClass) {
    const section = document.getElementById(sectionId);
    const items = section.children;
    const removeButtons = section.querySelectorAll('.' + buttonClass);
    
    // 如果只有一个项目，隐藏删除按钮；否则显示所有删除按钮
    if (items.length <= 1) {
        removeButtons.forEach(btn => btn.style.display = 'none');
    } else {
        removeButtons.forEach(btn => btn.style.display = 'flex');
    }
}

// 获取核查组成员数据
function getTeamMembersData() {
    const section = document.getElementById('teamMembersSection');
    const memberItems = section.querySelectorAll('.team-member-item');
    const members = [];
    
    memberItems.forEach(item => {
        const name = item.querySelector('.member-select').value;
        const role = item.querySelector('.role-select').value;
        
        if (name) {
            members.push({
                name: name,
                role: role,
                department: '纪检监察室' // 可以根据实际情况设置
            });
        }
    });
    
    return members;
}

// 获取任务数据
function getTasksData() {
    const section = document.getElementById('tasksSection');
    const taskItems = section.querySelectorAll('.task-item');
    const tasks = [];
    
    taskItems.forEach(item => {
        const title = item.querySelector('.task-title').value;
        const assignee = item.querySelector('.task-assignee').value;
        const deadline = item.querySelector('.task-deadline').value;
        
        if (title) {
            tasks.push({
                name: title,
                assignee: assignee || '未分配',
                deadline: deadline || '',
                status: '待开始',
                progress: 0
            });
        }
    });
    
    return tasks;
}

// 渲染核查组成员（详情页）
function renderTeamMembers(members) {
    const container = document.getElementById('teamMembers');
    
    if (!members || members.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">暂无核查组成员</p>';
        return;
    }
    
    container.innerHTML = members.map(member => `
        <div class="team-member-card">
            <div class="member-avatar">${member.name.charAt(0)}</div>
            <div class="member-info">
                <div class="member-name">${member.name}</div>
                <div class="member-role">${member.role} · ${member.department}</div>
            </div>
        </div>
    `).join('');
}

// 渲染任务列表（详情页）
function renderTaskList(tasks) {
    const container = document.getElementById('taskList');
    
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">暂无任务分解</p>';
        return;
    }
    
    container.innerHTML = tasks.map(task => {
        const statusClass = task.status === '已完成' ? 'completed' : 
                           task.status === '进行中' ? 'in-progress' : 'pending';
        const statusText = task.status || '待开始';
        
        return `
            <div class="task-card">
                <div class="task-header">
                    <div class="task-title-text">${task.name}</div>
                    <div class="task-status ${statusClass}">${statusText}</div>
                </div>
                <div class="task-meta">
                    <div class="task-meta-item">
                        <i class="fas fa-user"></i>
                        <span>${task.assignee}</span>
                    </div>
                    ${task.deadline ? `
                        <div class="task-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${task.deadline}</span>
                        </div>
                    ` : ''}
                    ${task.progress !== undefined ? `
                        <div class="task-meta-item">
                            <i class="fas fa-chart-line"></i>
                            <span>进度 ${task.progress}%</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// 渲染讨论记录（详情页）
function renderDiscussions(discussions) {
    const container = document.getElementById('discussionList');
    
    if (!discussions || discussions.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">暂无讨论记录</p>';
        return;
    }
    
    container.innerHTML = discussions.map(discussion => `
        <div class="discussion-item">
            <div class="discussion-avatar">${discussion.user.charAt(0)}</div>
            <div class="discussion-content">
                <div class="discussion-header">
                    <span class="discussion-author">${discussion.user}</span>
                    <span class="discussion-time">${discussion.time}</span>
                </div>
                <div class="discussion-text">${discussion.content}</div>
            </div>
        </div>
    `).join('');
}

// 从工单生成整改单
function createRectificationFromOrder(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
        showToast('工单不存在', 'error');
        return;
    }
    
    // 检查工单状态
    if (order.status !== '已完成' && order.status !== '待审核') {
        showToast('只有已完成或待审核的工单才能生成整改单', 'warning');
        return;
    }
    
    // 确认对话框
    if (!confirm(`确认要从工单"${order.title}"生成整改单吗？`)) {
        return;
    }
    
    // 构建URL参数
    const params = new URLSearchParams({
        action: 'create',
        workOrderId: order.orderNo,
        workOrderTitle: order.title,
        workOrderType: order.type,
        description: order.description,
        clueId: order.clueId || '',
        clueTitle: order.clueTitle || ''
    });
    
    // 跳转到整改管理页面
    showToast('正在跳转到整改管理页面...', 'info');
    setTimeout(() => {
        window.location.href = 'rectification.html?' + params.toString();
    }, 500);
}
