// 系统管理页面脚本

// 模态框辅助函数 - 适配 Modal 组件
function showModal(title, content, buttons, size) {
    // 如果 buttons 是字符串（旧的调用方式），转换为新格式
    if (typeof buttons === 'string') {
        size = buttons;
        buttons = [
            { text: '取消', type: 'default', onClick: () => Modal.hide() },
            { text: '确定', type: 'primary', onClick: () => Modal.hide() }
        ];
    }
    
    // 如果没有提供 buttons，使用默认按钮
    if (!buttons || buttons.length === 0) {
        buttons = [
            { text: '取消', type: 'default', onClick: () => Modal.hide() },
            { text: '确定', type: 'primary', onClick: () => Modal.hide() }
        ];
    }
    
    // 转换按钮格式以适配 Modal 组件
    const modalButtons = buttons.map(btn => ({
        text: btn.text,
        type: btn.type || btn.class?.replace('btn-', '') || 'default',
        onClick: typeof btn.onClick === 'string' ? () => Modal.hide() : btn.onClick
    }));
    
    Modal.show({
        title: title,
        content: content,
        buttons: modalButtons,
        size: size || 'md'
    });
}

// Toast 辅助函数
function showToast(message, type) {
    Toast.show(message, type);
}

// Confirm 辅助函数
function showConfirm(message, onConfirm) {
    Confirm.show({
        message: message,
        onConfirm: onConfirm
    });
}

// 模拟数据
const mockData = {
    users: [
        { id: 1, username: 'admin', name: '系统管理员', department: '信息中心', role: '系统管理员', status: 'active', email: 'admin@university.edu.cn', phone: '13800138000' },
        { id: 2, username: 'jiwei001', name: '张三', department: '纪委办公室', role: '纪检人员', status: 'active', email: 'zhangsan@university.edu.cn', phone: '13800138001' },
        { id: 3, username: 'shenji001', name: '李四', department: '审计处', role: '审计人员', status: 'active', email: 'lisi@university.edu.cn', phone: '13800138002' },
        { id: 4, username: 'leader001', name: '王五', department: '校办', role: '校领导', status: 'active', email: 'wangwu@university.edu.cn', phone: '13800138003' },
        { id: 5, username: 'unit001', name: '赵六', department: '计算机学院', role: '二级单位管理员', status: 'inactive', email: 'zhaoliu@university.edu.cn', phone: '13800138004' }
    ],
    roles: [
        { id: 1, name: '系统管理员', description: '拥有系统所有权限', permissions: 120, userCount: 2, createTime: '2024-01-01' },
        { id: 2, name: '纪检人员', description: '纪检监督相关权限', permissions: 45, userCount: 15, createTime: '2024-01-01' },
        { id: 3, name: '审计人员', description: '审计监督相关权限', permissions: 38, userCount: 12, createTime: '2024-01-01' },
        { id: 4, name: '校领导', description: '查看监督态势和报表', permissions: 25, userCount: 8, createTime: '2024-01-01' },
        { id: 5, name: '二级单位管理员', description: '本单位数据查看和整改', permissions: 18, userCount: 35, createTime: '2024-01-01' }
    ],
    organizations: [
        { id: 1, name: '某某大学', parentId: null, type: 'university', level: 1, memberCount: 3500 },
        { id: 2, name: '纪委办公室', parentId: 1, type: 'department', level: 2, memberCount: 15 },
        { id: 3, name: '审计处', parentId: 1, type: 'department', level: 2, memberCount: 12 },
        { id: 4, name: '计算机学院', parentId: 1, type: 'college', level: 2, memberCount: 450 },
        { id: 5, name: '经济管理学院', parentId: 1, type: 'college', level: 2, memberCount: 520 }
    ],
    parameters: {
        system: [
            { key: 'session_timeout', name: '会话超时时间', value: '30', unit: '分钟', description: '用户无操作自动登出时间' },
            { key: 'password_expire', name: '密码有效期', value: '90', unit: '天', description: '密码到期后需要修改' }
        ],
        alert: [
            { key: 'alert_check_interval', name: '预警检查间隔', value: '5', unit: '分钟', description: '规则引擎检查数据的时间间隔' },
            { key: 'alert_retention', name: '预警保留期限', value: '365', unit: '天', description: '预警数据保留时长' }
        ],
        workflow: [
            { key: 'clue_sla', name: '线索处置时限', value: '7', unit: '天', description: '线索分发后的处置时限' },
            { key: 'rectification_sla', name: '整改完成时限', value: '30', unit: '天', description: '整改任务的默认完成时限' }
        ]
    },
    logs: [
        { id: 1, time: '2025-10-22 14:35:22', user: '张三', action: '查看线索详情', module: '线索管理', ip: '192.168.1.100', result: '成功' },
        { id: 2, time: '2025-10-22 14:32:15', user: '李四', action: '导出审计报表', module: '报表中心', ip: '192.168.1.101', result: '成功' },
        { id: 3, time: '2025-10-22 14:28:43', user: '王五', action: '登录系统', module: '系统登录', ip: '192.168.1.102', result: '成功' },
        { id: 4, time: '2025-10-22 14:25:10', user: 'admin', action: '修改用户权限', module: '用户管理', ip: '192.168.1.103', result: '成功' },
        { id: 5, time: '2025-10-22 14:20:05', user: '赵六', action: '上传整改材料', module: '整改管理', ip: '192.168.1.104', result: '失败' }
    ]
};

// 当前选中的标签页
let currentTab = 'users';

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 公共组件已在 components.js 中自动初始化
    // TopNavbar.init(), SideNavbar.init(), Footer.init() 会自动执行
    
    // 初始化标签页切换
    initTabSwitching();
    
    // 加载默认模块
    loadUsersModule();
});

// 初始化标签页切换
function initTabSwitching() {
    const tabs = document.querySelectorAll('.management-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
}

// 切换标签页
function switchTab(tabName) {
    // 更新标签页状态
    document.querySelectorAll('.management-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // 隐藏所有模块
    document.querySelectorAll('.management-module').forEach(module => {
        module.classList.add('hidden');
        module.classList.remove('active');
    });
    
    // 显示选中的模块
    const moduleMap = {
        'users': 'usersModule',
        'roles': 'rolesModule',
        'organizations': 'organizationsModule',
        'parameters': 'parametersModule',
        'logs': 'logsModule'
    };
    
    const moduleId = moduleMap[tabName];
    const module = document.getElementById(moduleId);
    if (module) {
        module.classList.remove('hidden');
        module.classList.add('active');
    }
    
    // 加载对应模块内容
    currentTab = tabName;
    loadModuleContent(tabName);
}

// 加载模块内容
function loadModuleContent(tabName) {
    switch(tabName) {
        case 'users':
            loadUsersModule();
            break;
        case 'roles':
            loadRolesModule();
            break;
        case 'organizations':
            loadOrganizationsModule();
            break;
        case 'parameters':
            loadParametersModule();
            break;
        case 'logs':
            loadLogsModule();
            break;
    }
}

// ========== 用户管理模块 ==========
function loadUsersModule() {
    const module = document.getElementById('usersModule');
    module.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm">
            <!-- 工具栏 -->
            <div class="p-4 border-b border-gray-200">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜索用户名、姓名、部门..." id="userSearch">
                        </div>
                        <select class="filter-select" id="userDeptFilter">
                            <option value="">全部部门</option>
                            <option value="纪委办公室">纪委办公室</option>
                            <option value="审计处">审计处</option>
                            <option value="校办">校办</option>
                        </select>
                        <select class="filter-select" id="userStatusFilter">
                            <option value="">全部状态</option>
                            <option value="active">启用</option>
                            <option value="inactive">停用</option>
                        </select>
                    </div>
                    <div class="toolbar-right">
                        <button class="btn btn-primary" onclick="showAddUserModal()">
                            <i class="fas fa-plus mr-2"></i>新增用户
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 用户列表表格 -->
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>用户名</th>
                            <th>姓名</th>
                            <th>部门</th>
                            <th>角色</th>
                            <th>邮箱</th>
                            <th>手机号</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody">
                        ${renderUserRows()}
                    </tbody>
                </table>
            </div>
            
            <!-- 分页器 -->
            <div class="pagination">
                <div class="pagination-info">显示 1-5 条，共 5 条</div>
                <div class="pagination-buttons">
                    <button class="pagination-btn" disabled>上一页</button>
                    <button class="pagination-btn active">1</button>
                    <button class="pagination-btn" disabled>下一页</button>
                </div>
            </div>
        </div>
    `;
    
    // 绑定搜索和筛选事件
    document.getElementById('userSearch').addEventListener('input', filterUsers);
    document.getElementById('userDeptFilter').addEventListener('change', filterUsers);
    document.getElementById('userStatusFilter').addEventListener('change', filterUsers);
}

function renderUserRows() {
    return mockData.users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.department}</td>
            <td>${user.role}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <span class="status-badge ${user.status}">
                    ${user.status === 'active' ? '启用' : '停用'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="action-btn" onclick="resetPassword(${user.id})">
                        <i class="fas fa-key"></i> 重置密码
                    </button>
                    <button class="action-btn danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterUsers() {
    // 实际应用中这里会进行真实的筛选逻辑
    console.log('筛选用户');
}

function showAddUserModal() {
    showModal('新增用户', `
        <form class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">用户名 *</label>
                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">部门 *</label>
                    <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>纪委办公室</option>
                        <option>审计处</option>
                        <option>校办</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">角色 *</label>
                    <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>纪检人员</option>
                        <option>审计人员</option>
                        <option>校领导</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                    <input type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
            </div>
        </form>
    `, [
        { text: '取消', class: 'btn-secondary', onClick: 'closeModal' },
        { text: '保存', class: 'btn-primary', onClick: () => { showToast('用户创建成功', 'success'); closeModal(); } }
    ]);
}

function editUser(id) {
    const user = mockData.users.find(u => u.id === id);
    showToast(`编辑用户: ${user.name}`, 'info');
}

function resetPassword(id) {
    const user = mockData.users.find(u => u.id === id);
    showConfirm(`确定要重置用户 ${user.name} 的密码吗？`, () => {
        showToast('密码重置成功，新密码已发送到用户邮箱', 'success');
    });
}

function deleteUser(id) {
    const user = mockData.users.find(u => u.id === id);
    showConfirm(`确定要删除用户 ${user.name} 吗？此操作不可恢复。`, () => {
        showToast('用户删除成功', 'success');
    });
}

// ========== 角色管理模块 ==========
function loadRolesModule() {
    const module = document.getElementById('rolesModule');
    module.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm">
            <!-- 工具栏 -->
            <div class="p-4 border-b border-gray-200">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜索角色名称..." id="roleSearch">
                        </div>
                    </div>
                    <div class="toolbar-right">
                        <button class="btn btn-primary" onclick="showAddRoleModal()">
                            <i class="fas fa-plus mr-2"></i>新增角色
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 角色列表表格 -->
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>角色名称</th>
                            <th>描述</th>
                            <th>权限数量</th>
                            <th>用户数量</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderRoleRows()}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderRoleRows() {
    return mockData.roles.map(role => `
        <tr>
            <td><strong>${role.name}</strong></td>
            <td>${role.description}</td>
            <td>${role.permissions} 项</td>
            <td>${role.userCount} 人</td>
            <td>${role.createTime}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="configurePermissions(${role.id})">
                        <i class="fas fa-shield-alt"></i> 配置权限
                    </button>
                    <button class="action-btn" onclick="editRole(${role.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="action-btn danger" onclick="deleteRole(${role.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddRoleModal() {
    showModal('新增角色', `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色名称 *</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色描述</label>
                <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3"></textarea>
            </div>
        </form>
    `, [
        { text: '取消', class: 'btn-secondary', onClick: 'closeModal' },
        { text: '保存', class: 'btn-primary', onClick: () => { showToast('角色创建成功', 'success'); closeModal(); } }
    ]);
}

function configurePermissions(id) {
    const role = mockData.roles.find(r => r.id === id);
    showModal(`配置权限 - ${role.name}`, `
        <div class="permission-tree">
            <div class="permission-node">
                <label>
                    <input type="checkbox" checked>
                    <span class="font-medium">线索管理</span>
                </label>
                <div class="permission-children">
                    <div class="permission-node">
                        <label><input type="checkbox" checked> 查看线索</label>
                    </div>
                    <div class="permission-node">
                        <label><input type="checkbox" checked> 创建线索</label>
                    </div>
                    <div class="permission-node">
                        <label><input type="checkbox"> 删除线索</label>
                    </div>
                </div>
            </div>
            <div class="permission-node">
                <label>
                    <input type="checkbox" checked>
                    <span class="font-medium">预警管理</span>
                </label>
                <div class="permission-children">
                    <div class="permission-node">
                        <label><input type="checkbox" checked> 查看预警</label>
                    </div>
                    <div class="permission-node">
                        <label><input type="checkbox" checked> 处置预警</label>
                    </div>
                </div>
            </div>
            <div class="permission-node">
                <label>
                    <input type="checkbox">
                    <span class="font-medium">系统管理</span>
                </label>
                <div class="permission-children">
                    <div class="permission-node">
                        <label><input type="checkbox"> 用户管理</label>
                    </div>
                    <div class="permission-node">
                        <label><input type="checkbox"> 角色管理</label>
                    </div>
                </div>
            </div>
        </div>
    `, [
        { text: '取消', class: 'btn-secondary', onClick: 'closeModal' },
        { text: '保存', class: 'btn-primary', onClick: () => { showToast('权限配置成功', 'success'); closeModal(); } }
    ], 'large');
}

function editRole(id) {
    const role = mockData.roles.find(r => r.id === id);
    showToast(`编辑角色: ${role.name}`, 'info');
}

function deleteRole(id) {
    const role = mockData.roles.find(r => r.id === id);
    showConfirm(`确定要删除角色 ${role.name} 吗？`, () => {
        showToast('角色删除成功', 'success');
    });
}

// ========== 组织管理模块 ==========
function loadOrganizationsModule() {
    const module = document.getElementById('organizationsModule');
    module.innerHTML = `
        <div class="grid grid-cols-3 gap-6">
            <!-- 组织树 -->
            <div class="col-span-1">
                <div class="org-tree">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">组织架构</h3>
                        <button class="btn btn-sm btn-primary" onclick="showAddOrgModal()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div id="orgTreeContainer">
                        ${renderOrgTree()}
                    </div>
                </div>
            </div>
            
            <!-- 组织详情和人员列表 -->
            <div class="col-span-2">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold mb-4">组织详情</h3>
                    <div class="space-y-4" id="orgDetailContainer">
                        <p class="text-gray-500">请从左侧选择一个组织</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderOrgTree() {
    const renderNode = (org, level = 0) => {
        const children = mockData.organizations.filter(o => o.parentId === org.id);
        const hasChildren = children.length > 0;
        const icon = org.type === 'university' ? 'fa-university' : 
                     org.type === 'department' ? 'fa-building' : 'fa-graduation-cap';
        
        return `
            <div class="tree-node" onclick="selectOrg(${org.id})" data-org-id="${org.id}">
                <div class="tree-node-content">
                    <i class="fas ${icon} tree-node-icon"></i>
                    <span>${org.name}</span>
                    <span class="text-xs text-gray-500 ml-2">(${org.memberCount})</span>
                </div>
                ${hasChildren ? `
                    <div class="tree-node-children">
                        ${children.map(child => renderNode(child, level + 1)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    };
    
    const rootOrg = mockData.organizations.find(o => o.parentId === null);
    return renderNode(rootOrg);
}

function selectOrg(id) {
    // 更新选中状态
    document.querySelectorAll('.tree-node').forEach(node => {
        node.classList.remove('selected');
    });
    document.querySelector(`[data-org-id="${id}"]`).classList.add('selected');
    
    // 显示组织详情
    const org = mockData.organizations.find(o => o.id === id);
    const detailContainer = document.getElementById('orgDetailContainer');
    detailContainer.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="text-sm text-gray-600">组织名称</label>
                <p class="font-medium">${org.name}</p>
            </div>
            <div>
                <label class="text-sm text-gray-600">组织类型</label>
                <p class="font-medium">${org.type === 'university' ? '大学' : org.type === 'department' ? '部门' : '学院'}</p>
            </div>
            <div>
                <label class="text-sm text-gray-600">层级</label>
                <p class="font-medium">第 ${org.level} 级</p>
            </div>
            <div>
                <label class="text-sm text-gray-600">人员数量</label>
                <p class="font-medium">${org.memberCount} 人</p>
            </div>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold">组织人员</h4>
                <button class="btn btn-sm btn-primary" onclick="showAddMemberModal(${id})">
                    <i class="fas fa-user-plus mr-1"></i>添加人员
                </button>
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-user-circle text-2xl text-gray-400"></i>
                        <div>
                            <p class="font-medium">张三</p>
                            <p class="text-sm text-gray-600">纪检人员</p>
                        </div>
                    </div>
                    <button class="action-btn danger" onclick="removeMember(${id}, 1)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="mt-6 flex gap-2">
            <button class="btn btn-secondary" onclick="editOrg(${id})">
                <i class="fas fa-edit mr-2"></i>编辑
            </button>
            <button class="btn btn-secondary" onclick="moveOrg(${id})">
                <i class="fas fa-arrows-alt mr-2"></i>移动
            </button>
            <button class="btn btn-danger" onclick="deleteOrg(${id})">
                <i class="fas fa-trash mr-2"></i>删除
            </button>
        </div>
    `;
}

function showAddOrgModal() {
    showModal('新增组织', `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">组织名称 *</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">上级组织</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>某某大学</option>
                    <option>纪委办公室</option>
                    <option>审计处</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">组织类型 *</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>部门</option>
                    <option>学院</option>
                </select>
            </div>
        </form>
    `, [
        { text: '取消', class: 'btn-secondary', onClick: 'closeModal' },
        { text: '保存', class: 'btn-primary', onClick: () => { showToast('组织创建成功', 'success'); closeModal(); } }
    ]);
}

function showAddMemberModal(orgId) {
    showToast('添加人员功能', 'info');
}

function removeMember(orgId, memberId) {
    showConfirm('确定要移除该人员吗？', () => {
        showToast('人员移除成功', 'success');
    });
}

function editOrg(id) {
    showToast('编辑组织功能', 'info');
}

function moveOrg(id) {
    showToast('移动组织功能', 'info');
}

function deleteOrg(id) {
    showConfirm('确定要删除该组织吗？', () => {
        showToast('组织删除成功', 'success');
    });
}

// ========== 参数配置模块 ==========
function loadParametersModule() {
    const module = document.getElementById('parametersModule');
    module.innerHTML = `
        <div class="space-y-4">
            <!-- 系统参数 -->
            <div class="param-group">
                <h3 class="param-group-title">
                    <i class="fas fa-cog mr-2"></i>系统参数
                </h3>
                ${renderParamItems(mockData.parameters.system)}
            </div>
            
            <!-- 预警参数 -->
            <div class="param-group">
                <h3 class="param-group-title">
                    <i class="fas fa-bell mr-2"></i>预警参数
                </h3>
                ${renderParamItems(mockData.parameters.alert)}
            </div>
            
            <!-- 流程参数 -->
            <div class="param-group">
                <h3 class="param-group-title">
                    <i class="fas fa-project-diagram mr-2"></i>流程参数
                </h3>
                ${renderParamItems(mockData.parameters.workflow)}
            </div>
            
            <!-- 保存按钮 -->
            <div class="flex justify-end">
                <button class="btn btn-primary" onclick="saveParameters()">
                    <i class="fas fa-save mr-2"></i>保存配置
                </button>
            </div>
        </div>
    `;
}

function renderParamItems(params) {
    return params.map(param => `
        <div class="param-item">
            <div>
                <div class="param-label">${param.name}</div>
                <div class="param-description">${param.description}</div>
            </div>
            <div class="flex items-center gap-2">
                <input type="text" class="param-input flex-1" value="${param.value}" data-key="${param.key}">
                <span class="text-sm text-gray-600">${param.unit}</span>
            </div>
        </div>
    `).join('');
}

function saveParameters() {
    showToast('参数配置保存成功', 'success');
}

// ========== 日志审计模块 ==========
function loadLogsModule() {
    const module = document.getElementById('logsModule');
    module.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm">
            <!-- 工具栏 -->
            <div class="p-4 border-b border-gray-200">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜索用户、操作、IP..." id="logSearch">
                        </div>
                        <select class="filter-select" id="logModuleFilter">
                            <option value="">全部模块</option>
                            <option value="线索管理">线索管理</option>
                            <option value="报表中心">报表中心</option>
                            <option value="用户管理">用户管理</option>
                            <option value="整改管理">整改管理</option>
                        </select>
                        <select class="filter-select" id="logResultFilter">
                            <option value="">全部结果</option>
                            <option value="成功">成功</option>
                            <option value="失败">失败</option>
                        </select>
                        <input type="date" class="filter-select" id="logDateFilter">
                    </div>
                    <div class="toolbar-right">
                        <button class="btn btn-secondary" onclick="exportLogs()">
                            <i class="fas fa-download mr-2"></i>导出日志
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 日志列表表格 -->
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th>用户</th>
                            <th>操作</th>
                            <th>模块</th>
                            <th>IP地址</th>
                            <th>结果</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderLogRows()}
                    </tbody>
                </table>
            </div>
            
            <!-- 分页器 -->
            <div class="pagination">
                <div class="pagination-info">显示 1-5 条，共 5 条</div>
                <div class="pagination-buttons">
                    <button class="pagination-btn" disabled>上一页</button>
                    <button class="pagination-btn active">1</button>
                    <button class="pagination-btn" disabled>下一页</button>
                </div>
            </div>
        </div>
    `;
}

function renderLogRows() {
    return mockData.logs.map(log => `
        <tr>
            <td>${log.time}</td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td>${log.module}</td>
            <td><code class="text-xs">${log.ip}</code></td>
            <td>
                <span class="status-badge ${log.result === '成功' ? 'active' : 'inactive'}">
                    ${log.result}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="viewLogDetail(${log.id})">
                    <i class="fas fa-eye"></i> 详情
                </button>
            </td>
        </tr>
    `).join('');
}

function viewLogDetail(id) {
    const log = mockData.logs.find(l => l.id === id);
    showModal('日志详情', `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-sm text-gray-600">操作时间</label>
                    <p class="font-medium">${log.time}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-600">操作用户</label>
                    <p class="font-medium">${log.user}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-600">操作内容</label>
                    <p class="font-medium">${log.action}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-600">所属模块</label>
                    <p class="font-medium">${log.module}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-600">IP地址</label>
                    <p class="font-medium"><code>${log.ip}</code></p>
                </div>
                <div>
                    <label class="text-sm text-gray-600">操作结果</label>
                    <p class="font-medium">
                        <span class="status-badge ${log.result === '成功' ? 'active' : 'inactive'}">
                            ${log.result}
                        </span>
                    </p>
                </div>
            </div>
            <div class="log-detail">
                <div class="text-xs font-medium text-gray-700 mb-2">请求详情</div>
                <pre class="text-xs">URL: /api/clues/detail/12345
Method: GET
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
Session-ID: a1b2c3d4e5f6g7h8i9j0</pre>
            </div>
            ${log.result === '失败' ? `
                <div class="log-detail bg-red-50 border-red-200">
                    <div class="text-xs font-medium text-red-700 mb-2">错误信息</div>
                    <pre class="text-xs text-red-600">Error: Permission denied
Stack trace: at uploadFile (rectification.js:245)</pre>
                </div>
            ` : ''}
        </div>
    `, [
        { text: '关闭', class: 'btn-secondary', onClick: 'closeModal' }
    ], 'large');
}

function exportLogs() {
    showToast('正在导出日志...', 'info');
    setTimeout(() => {
        showToast('日志导出成功', 'success');
    }, 1000);
}
