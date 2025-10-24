// 数据源管理页面脚本

// 全局变量
let currentDatasourceId = null;

// 模拟数据源数据 - 包含监管模型需要的各类数据源
const mockDatasources = [
    {
        id: 1,
        name: '财务管理系统',
        type: 'Oracle',
        status: '运行中',
        connection: 'oracle://192.168.1.100:1521/finance',
        host: '192.168.1.100',
        port: 1521,
        database: 'finance',
        username: 'fin_user',
        lastSync: '2025-10-24 10:30:00',
        syncFrequency: '每小时',
        dataCount: '1,250,000',
        successRate: '99.8%',
        createTime: '2024-01-15 09:00:00',
        description: '学校财务管理系统，包含预算、报销、采购等财务数据',
        syncHistory: [
            { time: '2025-10-24 10:30:00', status: '成功', records: 1250, duration: '2.3秒' },
            { time: '2025-10-24 09:30:00', status: '成功', records: 980, duration: '1.8秒' },
            { time: '2025-10-24 08:30:00', status: '成功', records: 1100, duration: '2.1秒' }
        ]
    },
    {
        id: 2,
        name: '人事管理系统',
        type: 'MySQL',
        status: '运行中',
        connection: 'mysql://192.168.1.101:3306/hr',
        host: '192.168.1.101',
        port: 3306,
        database: 'hr',
        username: 'hr_user',
        lastSync: '2025-10-24 10:15:00',
        syncFrequency: '每天',
        dataCount: '85,600',
        successRate: '100%',
        createTime: '2024-01-20 10:30:00',
        description: '人事管理系统，包含教职工信息、考勤、薪酬等数据',
        syncHistory: [
            { time: '2025-10-24 10:15:00', status: '成功', records: 856, duration: '1.2秒' },
            { time: '2025-10-23 10:15:00', status: '成功', records: 850, duration: '1.1秒' },
            { time: '2025-10-22 10:15:00', status: '成功', records: 845, duration: '1.0秒' }
        ]
    },
    {
        id: 3,
        name: '科研管理系统',
        type: 'MySQL',
        status: '运行中',
        connection: 'mysql://192.168.1.102:3306/research',
        host: '192.168.1.102',
        port: 3306,
        database: 'research',
        username: 'research_user',
        lastSync: '2025-10-24 10:00:00',
        syncFrequency: '每天',
        dataCount: '156,800',
        successRate: '99.5%',
        createTime: '2024-02-01 14:00:00',
        description: '科研项目管理系统，包含项目申报、经费使用、成果管理等数据',
        syncHistory: [
            { time: '2025-10-24 10:00:00', status: '成功', records: 1568, duration: '2.5秒' },
            { time: '2025-10-23 10:00:00', status: '成功', records: 1560, duration: '2.4秒' },
            { time: '2025-10-22 10:00:00', status: '失败', records: 0, duration: '0秒', error: '连接超时' }
        ]
    },
    {
        id: 4,
        name: '招生管理系统',
        type: 'SQL Server',
        status: '运行中',
        connection: 'sqlserver://192.168.1.103:1433/admission',
        host: '192.168.1.103',
        port: 1433,
        database: 'admission',
        username: 'admission_user',
        lastSync: '2025-10-24 09:45:00',
        syncFrequency: '每天',
        dataCount: '98,500',
        successRate: '100%',
        createTime: '2024-02-10 11:00:00',
        description: '招生录取系统，包含考生信息、录取数据、招生计划等',
        syncHistory: [
            { time: '2025-10-24 09:45:00', status: '成功', records: 985, duration: '1.8秒' },
            { time: '2025-10-23 09:45:00', status: '成功', records: 980, duration: '1.7秒' },
            { time: '2025-10-22 09:45:00', status: '成功', records: 975, duration: '1.6秒' }
        ]
    },
    {
        id: 5,
        name: '资产管理系统',
        type: 'MySQL',
        status: '运行中',
        connection: 'mysql://192.168.1.104:3306/asset',
        host: '192.168.1.104',
        port: 3306,
        database: 'asset',
        username: 'asset_user',
        lastSync: '2025-10-24 09:30:00',
        syncFrequency: '每天',
        dataCount: '245,300',
        successRate: '99.9%',
        createTime: '2024-02-15 15:30:00',
        description: '固定资产管理系统，包含资产登记、盘点、处置等数据',
        syncHistory: [
            { time: '2025-10-24 09:30:00', status: '成功', records: 2453, duration: '3.2秒' },
            { time: '2025-10-23 09:30:00', status: '成功', records: 2450, duration: '3.1秒' },
            { time: '2025-10-22 09:30:00', status: '成功', records: 2448, duration: '3.0秒' }
        ]
    },
    {
        id: 6,
        name: '采购管理系统',
        type: 'Oracle',
        status: '异常',
        connection: 'oracle://192.168.1.105:1521/procurement',
        host: '192.168.1.105',
        port: 1521,
        database: 'procurement',
        username: 'proc_user',
        lastSync: '2025-10-23 18:00:00',
        syncFrequency: '每天',
        dataCount: '67,800',
        successRate: '95.2%',
        createTime: '2024-03-01 09:00:00',
        description: '采购招标系统，包含采购计划、招标文件、合同管理等数据',
        syncHistory: [
            { time: '2025-10-24 09:00:00', status: '失败', records: 0, duration: '0秒', error: '数据库连接失败' },
            { time: '2025-10-23 18:00:00', status: '成功', records: 678, duration: '1.5秒' },
            { time: '2025-10-23 09:00:00', status: '成功', records: 675, duration: '1.4秒' }
        ]
    },
    {
        id: 7,
        name: '学生管理系统',
        type: 'MySQL',
        status: '运行中',
        connection: 'mysql://192.168.1.106:3306/student',
        host: '192.168.1.106',
        port: 3306,
        database: 'student',
        username: 'student_user',
        lastSync: '2025-10-24 10:20:00',
        syncFrequency: '每天',
        dataCount: '325,600',
        successRate: '99.7%',
        createTime: '2024-01-10 08:00:00',
        description: '学生信息管理系统，包含学籍、成绩、奖助学金等数据',
        syncHistory: [
            { time: '2025-10-24 10:20:00', status: '成功', records: 3256, duration: '4.1秒' },
            { time: '2025-10-23 10:20:00', status: '成功', records: 3250, duration: '4.0秒' },
            { time: '2025-10-22 10:20:00', status: '成功', records: 3245, duration: '3.9秒' }
        ]
    },
    {
        id: 8,
        name: '公务接待系统',
        type: 'PostgreSQL',
        status: '运行中',
        connection: 'postgresql://192.168.1.107:5432/reception',
        host: '192.168.1.107',
        port: 5432,
        database: 'reception',
        username: 'reception_user',
        lastSync: '2025-10-24 09:00:00',
        syncFrequency: '每天',
        dataCount: '12,450',
        successRate: '100%',
        createTime: '2024-03-15 10:00:00',
        description: '公务接待管理系统，包含接待申请、费用报销等数据',
        syncHistory: [
            { time: '2025-10-24 09:00:00', status: '成功', records: 125, duration: '0.8秒' },
            { time: '2025-10-23 09:00:00', status: '成功', records: 120, duration: '0.7秒' },
            { time: '2025-10-22 09:00:00', status: '成功', records: 118, duration: '0.7秒' }
        ]
    },
    {
        id: 9,
        name: '车辆管理系统',
        type: 'MySQL',
        status: '运行中',
        connection: 'mysql://192.168.1.108:3306/vehicle',
        host: '192.168.1.108',
        port: 3306,
        database: 'vehicle',
        username: 'vehicle_user',
        lastSync: '2025-10-24 08:45:00',
        syncFrequency: '每天',
        dataCount: '8,900',
        successRate: '99.8%',
        createTime: '2024-03-20 11:30:00',
        description: '公务用车管理系统，包含车辆信息、用车申请、维修保养等数据',
        syncHistory: [
            { time: '2025-10-24 08:45:00', status: '成功', records: 89, duration: '0.5秒' },
            { time: '2025-10-23 08:45:00', status: '成功', records: 88, duration: '0.5秒' },
            { time: '2025-10-22 08:45:00', status: '成功', records: 87, duration: '0.4秒' }
        ]
    },
    {
        id: 10,
        name: '基建项目系统',
        type: 'Oracle',
        status: '运行中',
        connection: 'oracle://192.168.1.109:1521/construction',
        host: '192.168.1.109',
        port: 1521,
        database: 'construction',
        username: 'const_user',
        lastSync: '2025-10-24 08:30:00',
        syncFrequency: '每天',
        dataCount: '45,600',
        successRate: '99.5%',
        createTime: '2024-04-01 14:00:00',
        description: '基建项目管理系统，包含项目立项、招标、施工、验收等数据',
        syncHistory: [
            { time: '2025-10-24 08:30:00', status: '成功', records: 456, duration: '1.2秒' },
            { time: '2025-10-23 08:30:00', status: '成功', records: 455, duration: '1.1秒' },
            { time: '2025-10-22 08:30:00', status: '成功', records: 454, duration: '1.1秒' }
        ]
    },
    {
        id: 11,
        name: '教育部数据接口',
        type: 'API',
        status: '运行中',
        connection: 'https://api.moe.gov.cn/data/v1',
        apiUrl: 'https://api.moe.gov.cn/data/v1',
        apiMethod: 'GET',
        lastSync: '2025-10-24 10:00:00',
        syncFrequency: '每周',
        dataCount: '5,600',
        successRate: '98.5%',
        createTime: '2024-05-01 09:00:00',
        description: '教育部数据接口，获取政策文件、统计数据等',
        syncHistory: [
            { time: '2025-10-24 10:00:00', status: '成功', records: 56, duration: '3.5秒' },
            { time: '2025-10-17 10:00:00', status: '成功', records: 52, duration: '3.2秒' },
            { time: '2025-10-10 10:00:00', status: '成功', records: 48, duration: '3.0秒' }
        ]
    },
    {
        id: 12,
        name: '财政拨款数据',
        type: '文件',
        status: '未激活',
        connection: '/data/finance/budget_2025.xlsx',
        filePath: '/data/finance/budget_2025.xlsx',
        fileFormat: 'Excel',
        fileEncoding: 'UTF-8',
        lastSync: '2025-10-01 09:00:00',
        syncFrequency: '手动',
        dataCount: '1,200',
        successRate: '100%',
        createTime: '2024-06-01 10:00:00',
        description: '年度财政拨款数据文件，包含预算分配、执行情况等',
        syncHistory: [
            { time: '2025-10-01 09:00:00', status: '成功', records: 1200, duration: '2.0秒' },
            { time: '2025-09-01 09:00:00', status: '成功', records: 1150, duration: '1.9秒' },
            { time: '2025-08-01 09:00:00', status: '成功', records: 1100, duration: '1.8秒' }
        ]
    }
];

// 全局变量
let currentPage = 1;
const pageSize = 10;
let filteredDatasources = [...mockDatasources];
let sortField = '';
let sortOrder = 'asc';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    bindEvents();
});

// 初始化页面
function initPage() {
    // 初始化模态框为隐藏状态
    const detailModal = document.getElementById('datasourceDetailModal');
    if (detailModal) {
        detailModal.style.display = 'none';
    }
    
    const createModal = document.getElementById('createDatasourceModal');
    if (createModal) {
        createModal.style.display = 'none';
    }
    
    updateStatistics();
    renderDatasourceTable();
}

// 更新统计数据
function updateStatistics() {
    const total = mockDatasources.length;
    const active = mockDatasources.filter(d => d.status === '运行中').length;
    const error = mockDatasources.filter(d => d.status === '异常').length;
    const inactive = mockDatasources.filter(d => d.status === '未激活').length;
    
    document.getElementById('totalDatasources').textContent = total;
    document.getElementById('activeDatasources').textContent = active;
    document.getElementById('errorDatasources').textContent = error;
    document.getElementById('inactiveDatasources').textContent = inactive;
}

// 渲染数据源表格
function renderDatasourceTable() {
    const tbody = document.getElementById('datasourceTableBody');
    
    // 应用排序
    if (sortField) {
        filteredDatasources.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            
            if (sortField === 'lastSync') {
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
    const pageDatasources = filteredDatasources.slice(start, end);
    
    if (pageDatasources.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12">
                    <div class="empty-state">
                        <i class="fas fa-database"></i>
                        <p>暂无数据源</p>
                    </div>
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }
    
    tbody.innerHTML = pageDatasources.map(ds => `
        <tr>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="datasource-icon ${getTypeIconClass(ds.type)}">
                        <i class="${getTypeIcon(ds.type)}"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-900 ml-3">${ds.name}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${ds.type}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-xs text-gray-500 font-mono">${ds.connection}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getStatusBadge(ds.status)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${ds.lastSync}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">${ds.dataCount}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="action-btn action-btn-primary mr-2" onclick="viewDatasourceDetail(${ds.id})">
                    <i class="fas fa-eye mr-1"></i>查看
                </button>
                <button class="action-btn action-btn-info mr-2" onclick="testConnection(${ds.id})">
                    <i class="fas fa-plug mr-1"></i>测试
                </button>
                ${ds.status !== '异常' ? `
                    <button class="action-btn action-btn-success mr-2" onclick="syncNow(${ds.id})">
                        <i class="fas fa-sync mr-1"></i>同步
                    </button>
                ` : ''}
                <button class="action-btn action-btn-secondary mr-2" onclick="editDatasource(${ds.id})">
                    <i class="fas fa-edit mr-1"></i>编辑
                </button>
                <button class="action-btn action-btn-danger" onclick="deleteDatasource(${ds.id})">
                    <i class="fas fa-trash mr-1"></i>删除
                </button>
            </td>
        </tr>
    `).join('');
    
    updatePagination();
}

// 获取类型图标
function getTypeIcon(type) {
    const iconMap = {
        'MySQL': 'fas fa-database',
        'Oracle': 'fas fa-database',
        'SQL Server': 'fas fa-database',
        'PostgreSQL': 'fas fa-database',
        'API': 'fas fa-plug',
        '文件': 'fas fa-file-alt'
    };
    return iconMap[type] || 'fas fa-database';
}

// 获取类型图标样式类
function getTypeIconClass(type) {
    const classMap = {
        'MySQL': 'bg-blue-100 text-blue-600',
        'Oracle': 'bg-red-100 text-red-600',
        'SQL Server': 'bg-yellow-100 text-yellow-600',
        'PostgreSQL': 'bg-indigo-100 text-indigo-600',
        'API': 'bg-green-100 text-green-600',
        '文件': 'bg-purple-100 text-purple-600'
    };
    return classMap[type] || 'bg-gray-100 text-gray-600';
}

// 获取状态标签
function getStatusBadge(status) {
    const statusMap = {
        '运行中': 'status-completed',
        '异常': 'status-closed',
        '未激活': 'status-pending'
    };
    
    return `<span class="status-badge ${statusMap[status]}">${status}</span>`;
}

// 更新分页器
function updatePagination() {
    const total = filteredDatasources.length;
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
    renderDatasourceTable();
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
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // 新建数据源按钮
    const createBtn = document.getElementById('createDatasourceBtn');
    if (createBtn) {
        createBtn.addEventListener('click', createDatasource);
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
            renderDatasourceTable();
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
            const totalPages = Math.ceil(filteredDatasources.length / pageSize);
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }
    
    // 详情模态框关闭按钮
    const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
    if (closeDetailModalBtn) {
        closeDetailModalBtn.addEventListener('click', closeDetailModal);
    }
    
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', closeDetailModal);
    }
    
    // 详情模态框操作按钮
    const testConnectionBtn = document.getElementById('testConnectionBtn');
    if (testConnectionBtn) {
        testConnectionBtn.addEventListener('click', function() {
            if (currentDatasourceId) {
                testConnection(currentDatasourceId);
            }
        });
    }
    
    const syncNowBtn = document.getElementById('syncNowBtn');
    if (syncNowBtn) {
        syncNowBtn.addEventListener('click', function() {
            if (currentDatasourceId) {
                syncNow(currentDatasourceId);
            }
        });
    }
    
    const editDatasourceBtn = document.getElementById('editDatasourceBtn');
    if (editDatasourceBtn) {
        editDatasourceBtn.addEventListener('click', function() {
            if (currentDatasourceId) {
                closeDetailModal();
                editDatasource(currentDatasourceId);
            }
        });
    }
    
    // 创建模态框关闭按钮
    const closeCreateModalBtn = document.getElementById('closeCreateModalBtn');
    if (closeCreateModalBtn) {
        closeCreateModalBtn.addEventListener('click', closeCreateModal);
    }
    
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    if (cancelCreateBtn) {
        cancelCreateBtn.addEventListener('click', closeCreateModal);
    }
    
    // 创建模态框提交按钮
    const submitCreateBtn = document.getElementById('submitCreateBtn');
    if (submitCreateBtn) {
        submitCreateBtn.addEventListener('click', submitDatasource);
    }
    
    const testConnBtn = document.getElementById('testConnBtn');
    if (testConnBtn) {
        testConnBtn.addEventListener('click', testNewConnection);
    }
    
    // 数据源类型变化
    const datasourceType = document.getElementById('datasourceType');
    if (datasourceType) {
        datasourceType.addEventListener('change', handleTypeChange);
    }
    
    // 点击模态框外部关闭
    const detailModal = document.getElementById('datasourceDetailModal');
    if (detailModal) {
        detailModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDetailModal();
            }
        });
    }
    
    const createModal = document.getElementById('createDatasourceModal');
    if (createModal) {
        createModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCreateModal();
            }
        });
    }
}

// 应用筛选
function applyFilters() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredDatasources = mockDatasources.filter(ds => {
        const matchSearch = !searchText || 
            ds.name.toLowerCase().includes(searchText) ||
            ds.type.toLowerCase().includes(searchText);
        const matchType = !typeFilter || ds.type === typeFilter;
        const matchStatus = !statusFilter || ds.status === statusFilter;
        
        return matchSearch && matchType && matchStatus;
    });
    
    currentPage = 1;
    renderDatasourceTable();
}

// 重置筛选
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('statusFilter').value = '';
    
    filteredDatasources = [...mockDatasources];
    currentPage = 1;
    renderDatasourceTable();
}

// 查看数据源详情
function viewDatasourceDetail(datasourceId) {
    const ds = mockDatasources.find(d => d.id === datasourceId);
    if (!ds) {
        return;
    }
    
    currentDatasourceId = datasourceId;
    
    // 填充基本信息
    document.getElementById('detailName').textContent = ds.name;
    document.getElementById('detailType').textContent = ds.type;
    document.getElementById('detailStatus').innerHTML = getStatusBadge(ds.status);
    document.getElementById('detailCreateTime').textContent = ds.createTime;
    document.getElementById('detailConnection').textContent = ds.connection;
    document.getElementById('detailDescription').textContent = ds.description;
    
    // 填充同步统计
    document.getElementById('detailLastSync').textContent = ds.lastSync;
    document.getElementById('detailSyncFreq').textContent = ds.syncFrequency;
    document.getElementById('detailDataCount').textContent = ds.dataCount;
    document.getElementById('detailSuccessRate').textContent = ds.successRate;
    
    // 填充同步历史
    const syncHistory = document.getElementById('syncHistory');
    if (ds.syncHistory && ds.syncHistory.length > 0) {
        syncHistory.innerHTML = ds.syncHistory.map(history => `
            <div class="sync-history-item">
                <div class="sync-history-header">
                    <span class="sync-history-time">
                        <i class="fas fa-clock"></i> ${history.time}
                    </span>
                    <span class="status-badge ${history.status === '成功' ? 'status-completed' : 'status-closed'}">
                        ${history.status}
                    </span>
                </div>
                <div class="sync-history-details">
                    ${history.status === '成功' ? `
                        <span><i class="fas fa-database"></i> 同步记录数: ${history.records}</span>
                        <span><i class="fas fa-stopwatch"></i> 耗时: ${history.duration}</span>
                    ` : `
                        <span class="text-red-600"><i class="fas fa-exclamation-circle"></i> 错误: ${history.error}</span>
                    `}
                </div>
            </div>
        `).join('');
    } else {
        syncHistory.innerHTML = '<p style="color: #6B7280; font-size: 13px;">暂无同步历史</p>';
    }
    
    // 显示模态框
    const modal = document.getElementById('datasourceDetailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

// 关闭详情模态框
function closeDetailModal() {
    const modal = document.getElementById('datasourceDetailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    currentDatasourceId = null;
}

// 新建数据源
function createDatasource() {
    console.log('[数据源管理] 打开新建数据源模态框');
    const modal = document.getElementById('createDatasourceModal');
    
    if (!modal) {
        console.error('[数据源管理] 找不到模态框元素 #createDatasourceModal');
        return;
    }
    
    console.log('[数据源管理] 模态框元素找到，准备显示');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
        console.log('[数据源管理] 模态框已显示');
    }, 10);
    
    // 重置表单
    const form = document.getElementById('createDatasourceForm');
    if (form) form.reset();
    
    const datasourceId = document.getElementById('datasourceId');
    if (datasourceId) datasourceId.value = '';
    
    // 隐藏所有配置区域
    const databaseConfig = document.getElementById('databaseConfig');
    const apiConfig = document.getElementById('apiConfig');
    const fileConfig = document.getElementById('fileConfig');
    
    if (databaseConfig) databaseConfig.style.display = 'none';
    if (apiConfig) apiConfig.style.display = 'none';
    if (fileConfig) fileConfig.style.display = 'none';
    
    // 设置标题
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>新建数据源';
    }
}

// 编辑数据源
function editDatasource(datasourceId) {
    const ds = mockDatasources.find(d => d.id === datasourceId);
    if (!ds) {
        showToast('数据源不存在', 'error');
        return;
    }
    
    const modal = document.getElementById('createDatasourceModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    // 设置标题
    modal.querySelector('.modal-title').innerHTML = '<i class="fas fa-edit"></i>编辑数据源';
    
    // 填充表单
    document.getElementById('datasourceId').value = ds.id;
    document.getElementById('datasourceName').value = ds.name;
    document.getElementById('datasourceType').value = ds.type;
    document.getElementById('syncFrequency').value = ds.syncFrequency;
    document.getElementById('datasourceDescription').value = ds.description;
    
    // 根据类型显示对应配置
    handleTypeChange();
    
    // 填充具体配置
    if (ds.type === 'MySQL' || ds.type === 'Oracle' || ds.type === 'SQL Server' || ds.type === 'PostgreSQL') {
        document.getElementById('dbHost').value = ds.host || '';
        document.getElementById('dbPort').value = ds.port || '';
        document.getElementById('dbName').value = ds.database || '';
        document.getElementById('dbUsername').value = ds.username || '';
    } else if (ds.type === 'API') {
        document.getElementById('apiUrl').value = ds.apiUrl || '';
        document.getElementById('apiMethod').value = ds.apiMethod || 'GET';
    } else if (ds.type === '文件') {
        document.getElementById('filePath').value = ds.filePath || '';
        document.getElementById('fileFormat').value = ds.fileFormat || 'CSV';
        document.getElementById('fileEncoding').value = ds.fileEncoding || 'UTF-8';
    }
}

// 处理数据源类型变化
function handleTypeChange() {
    const type = document.getElementById('datasourceType').value;
    
    // 隐藏所有配置区域
    document.getElementById('databaseConfig').style.display = 'none';
    document.getElementById('apiConfig').style.display = 'none';
    document.getElementById('fileConfig').style.display = 'none';
    
    // 根据类型显示对应配置
    if (type === 'MySQL' || type === 'Oracle' || type === 'SQL Server' || type === 'PostgreSQL') {
        document.getElementById('databaseConfig').style.display = 'block';
        
        // 设置默认端口
        const portMap = {
            'MySQL': 3306,
            'Oracle': 1521,
            'SQL Server': 1433,
            'PostgreSQL': 5432
        };
        document.getElementById('dbPort').value = portMap[type] || '';
    } else if (type === 'API') {
        document.getElementById('apiConfig').style.display = 'block';
    } else if (type === '文件') {
        document.getElementById('fileConfig').style.display = 'block';
    }
}

// 关闭创建模态框
function closeCreateModal() {
    const modal = document.getElementById('createDatasourceModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.getElementById('createDatasourceForm').reset();
}

// 提交数据源
function submitDatasource() {
    const form = document.getElementById('createDatasourceForm');
    if (!form.checkValidity()) {
        showToast('请填写所有必填项', 'warning');
        return;
    }
    
    const id = document.getElementById('datasourceId').value;
    const name = document.getElementById('datasourceName').value;
    const type = document.getElementById('datasourceType').value;
    const syncFreq = document.getElementById('syncFrequency').value;
    const description = document.getElementById('datasourceDescription').value;
    
    if (id) {
        // 编辑
        const ds = mockDatasources.find(d => d.id === parseInt(id));
        if (ds) {
            ds.name = name;
            ds.type = type;
            ds.syncFrequency = syncFreq;
            ds.description = description;
            
            // 更新配置信息
            if (type === 'MySQL' || type === 'Oracle' || type === 'SQL Server' || type === 'PostgreSQL') {
                ds.host = document.getElementById('dbHost').value;
                ds.port = document.getElementById('dbPort').value;
                ds.database = document.getElementById('dbName').value;
                ds.username = document.getElementById('dbUsername').value;
                ds.connection = `${type.toLowerCase()}://${ds.host}:${ds.port}/${ds.database}`;
            } else if (type === 'API') {
                ds.apiUrl = document.getElementById('apiUrl').value;
                ds.apiMethod = document.getElementById('apiMethod').value;
                ds.connection = ds.apiUrl;
            } else if (type === '文件') {
                ds.filePath = document.getElementById('filePath').value;
                ds.fileFormat = document.getElementById('fileFormat').value;
                ds.fileEncoding = document.getElementById('fileEncoding').value;
                ds.connection = ds.filePath;
            }
            
            showToast('数据源更新成功', 'success');
        }
    } else {
        // 新建
        const newDs = {
            id: mockDatasources.length + 1,
            name: name,
            type: type,
            status: '未激活',
            syncFrequency: syncFreq,
            lastSync: '-',
            dataCount: '0',
            successRate: '-',
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            description: description,
            syncHistory: []
        };
        
        // 设置配置信息
        if (type === 'MySQL' || type === 'Oracle' || type === 'SQL Server' || type === 'PostgreSQL') {
            newDs.host = document.getElementById('dbHost').value;
            newDs.port = document.getElementById('dbPort').value;
            newDs.database = document.getElementById('dbName').value;
            newDs.username = document.getElementById('dbUsername').value;
            newDs.connection = `${type.toLowerCase()}://${newDs.host}:${newDs.port}/${newDs.database}`;
        } else if (type === 'API') {
            newDs.apiUrl = document.getElementById('apiUrl').value;
            newDs.apiMethod = document.getElementById('apiMethod').value;
            newDs.connection = newDs.apiUrl;
        } else if (type === '文件') {
            newDs.filePath = document.getElementById('filePath').value;
            newDs.fileFormat = document.getElementById('fileFormat').value;
            newDs.fileEncoding = document.getElementById('fileEncoding').value;
            newDs.connection = newDs.filePath;
        }
        
        mockDatasources.push(newDs);
        showToast('数据源创建成功', 'success');
    }
    
    closeCreateModal();
    updateStatistics();
    applyFilters();
}

// 测试新连接
function testNewConnection() {
    const type = document.getElementById('datasourceType').value;
    if (!type) {
        showToast('请先选择数据源类型', 'warning');
        return;
    }
    
    showToast('正在测试连接...', 'info');
    
    // 模拟测试
    setTimeout(() => {
        showToast('连接测试成功', 'success');
    }, 1500);
}

// 测试连接
function testConnection(datasourceId) {
    const ds = mockDatasources.find(d => d.id === datasourceId);
    if (!ds) {
        return;
    }
    
    showToast('正在测试连接...', 'info');
    
    // 模拟测试
    setTimeout(() => {
        if (ds.status === '异常') {
            showToast('连接测试失败：数据库连接超时', 'error');
        } else {
            showToast('连接测试成功', 'success');
        }
    }, 1500);
}

// 立即同步
function syncNow(datasourceId) {
    const ds = mockDatasources.find(d => d.id === datasourceId);
    if (!ds) {
        return;
    }
    
    if (ds.status === '异常') {
        showToast('数据源状态异常，无法同步', 'error');
        return;
    }
    
    showToast('正在同步数据...', 'info');
    
    // 模拟同步
    setTimeout(() => {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const records = Math.floor(Math.random() * 1000) + 500;
        const duration = (Math.random() * 3 + 1).toFixed(1) + '秒';
        
        ds.lastSync = now;
        ds.syncHistory.unshift({
            time: now,
            status: '成功',
            records: records,
            duration: duration
        });
        
        // 只保留最近10条历史
        if (ds.syncHistory.length > 10) {
            ds.syncHistory = ds.syncHistory.slice(0, 10);
        }
        
        showToast('数据同步成功', 'success');
        
        // 如果详情模态框打开，刷新显示
        if (currentDatasourceId === datasourceId) {
            viewDatasourceDetail(datasourceId);
        }
        
        renderDatasourceTable();
    }, 2000);
}

// 删除数据源
function deleteDatasource(datasourceId) {
    const ds = mockDatasources.find(d => d.id === datasourceId);
    if (!ds) {
        return;
    }
    
    if (confirm(`确定要删除数据源"${ds.name}"吗？`)) {
        const index = mockDatasources.findIndex(d => d.id === datasourceId);
        if (index > -1) {
            mockDatasources.splice(index, 1);
            showToast('数据源已删除', 'success');
            updateStatistics();
            applyFilters();
        }
    }
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
