/**
 * 高校纪检审计监管一体化平台 - 公共组件
 * 
 * 本文件包含系统的公共UI组件，包括：
 * - TopNavbar: 顶部导航栏组件
 * - SideNavbar: 侧边导航栏组件
 * - Footer: 页脚组件
 * 
 * 这些组件在所有页面中共享使用，确保界面的一致性
 * 
 * @author 开发团队
 * @version 1.0.0
 * @date 2025-10-22
 */

// ============================================================================
// 顶部导航栏组件
// ============================================================================

/**
 * 顶部导航栏组件
 * 包含系统Logo、全局搜索、消息通知、用户信息等功能
 * @namespace TopNavbar
 */
const TopNavbar = {
    /**
     * 渲染顶部导航栏HTML
     * @returns {string} 导航栏HTML字符串
     */
    render() {
        return `
            <div class="top-navbar">
                <div class="navbar-left">
                    <div class="navbar-logo">
                        <i class="fas fa-shield-alt"></i>
                        <span>高校纪检审计监管一体化平台</span>
                    </div>
                </div>
                
                <div class="navbar-center">
                    <div class="navbar-search">
                        <input type="text" placeholder="搜索线索、预警、项目、合同、人员..." />
                        <i class="fas fa-search"></i>
                    </div>
                </div>
                
                <div class="navbar-right">
                    <div class="navbar-icon" title="消息通知">
                        <i class="fas fa-bell"></i>
                        <span class="navbar-badge">5</span>
                    </div>
                    
                    <div class="navbar-user">
                        <div class="navbar-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="navbar-user-info">
                            <div class="navbar-username">张三</div>
                            <div class="navbar-role">纪检监察人员</div>
                        </div>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 初始化顶部导航栏
     * 将导航栏HTML插入到页面中，并绑定事件
     */
    init() {
        const navbar = document.getElementById('top-navbar');
        if (navbar) {
            navbar.innerHTML = this.render();
            this.bindEvents();
        }
    },

    /**
     * 绑定导航栏事件
     * 包括搜索、消息通知、用户菜单等交互事件
     */
    bindEvents() {
        // 搜索功能
        const searchInput = document.querySelector('.navbar-search input');
        const searchIcon = document.querySelector('.navbar-search i');

        if (searchInput) {
            // 输入时显示搜索建议
            searchInput.addEventListener('input', (e) => {
                const keyword = e.target.value.trim();
                if (keyword.length > 0) {
                    this.showSearchSuggestions(keyword);
                } else {
                    this.showSearchPanel();
                }
            });

            // 获得焦点时显示搜索面板
            searchInput.addEventListener('focus', () => {
                const keyword = searchInput.value.trim();
                if (keyword.length > 0) {
                    this.showSearchSuggestions(keyword);
                } else {
                    this.showSearchPanel();
                }
            });

            // 回车搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const keyword = e.target.value.trim();
                    if (keyword) {
                        this.performSearch(keyword);
                    }
                }
            });
        }

        // 搜索图标点击
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    this.performSearch(keyword);
                }
            });
        }

        // 消息通知
        const notificationIcon = document.querySelector('.navbar-icon');
        if (notificationIcon) {
            notificationIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showNotificationPanel();
            });
        }

        // 用户菜单
        const userMenu = document.querySelector('.navbar-user');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showUserMenu();
            });
        }

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });
    },

    /**
     * 执行搜索
     */
    performSearch(keyword) {
        // 保存搜索历史
        this.saveSearchHistory(keyword);

        // 关闭搜索面板
        this.closeAllDropdowns();

        // 跳转到搜索结果页面
        window.location.href = `search-results.html?q=${encodeURIComponent(keyword)}`;
    },

    /**
     * 显示搜索面板（历史记录和热门搜索）
     */
    showSearchPanel() {
        this.closeAllDropdowns();

        const searchContainer = document.querySelector('.navbar-search');
        if (!searchContainer) return;

        // 获取搜索历史
        const searchHistory = this.getSearchHistory();

        // 热门搜索数据
        const hotSearches = [
            { keyword: '科研经费异常', count: 156 },
            { keyword: '招生录取监督', count: 142 },
            { keyword: '基建采购审计', count: 128 },
            { keyword: '财务管理预警', count: 115 },
            { keyword: '八项规定检查', count: 98 },
            { keyword: '三重一大决策', count: 87 },
            { keyword: '固定资产管理', count: 76 },
            { keyword: '预算执行审计', count: 65 }
        ];

        const dropdown = document.createElement('div');
        dropdown.className = 'navbar-dropdown search-dropdown';
        dropdown.innerHTML = `
            ${searchHistory.length > 0 ? `
                <div class="search-section">
                    <div class="search-section-header">
                        <span class="search-section-title">
                            <i class="fas fa-history"></i> 搜索历史
                        </span>
                        <a href="javascript:void(0)" class="search-clear-history">清空</a>
                    </div>
                    <div class="search-history-list">
                        ${searchHistory.map(item => `
                            <div class="search-history-item" data-keyword="${item}">
                                <i class="fas fa-clock"></i>
                                <span>${item}</span>
                                <i class="fas fa-times search-history-delete"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="search-section">
                <div class="search-section-header">
                    <span class="search-section-title">
                        <i class="fas fa-fire"></i> 热门搜索
                    </span>
                </div>
                <div class="search-hot-list">
                    ${hotSearches.map((item, index) => `
                        <div class="search-hot-item" data-keyword="${item.keyword}">
                            <span class="search-hot-rank ${index < 3 ? 'hot' : ''}">${index + 1}</span>
                            <span class="search-hot-keyword">${item.keyword}</span>
                            <span class="search-hot-count">${item.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        searchContainer.appendChild(dropdown);

        setTimeout(() => {
            dropdown.classList.add('show');
        }, 10);

        // 绑定事件
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 点击历史记录
        dropdown.querySelectorAll('.search-history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('search-history-delete')) {
                    const keyword = item.dataset.keyword;
                    this.performSearch(keyword);
                }
            });
        });

        // 删除单个历史记录
        dropdown.querySelectorAll('.search-history-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = btn.closest('.search-history-item');
                const keyword = item.dataset.keyword;
                this.removeSearchHistory(keyword);
                item.remove();

                // 如果没有历史记录了，移除整个历史区域
                const historyList = dropdown.querySelector('.search-history-list');
                if (historyList && historyList.children.length === 0) {
                    const historySection = dropdown.querySelector('.search-section');
                    if (historySection) historySection.remove();
                }
            });
        });

        // 清空历史记录
        const clearBtn = dropdown.querySelector('.search-clear-history');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Confirm.show({
                    title: '清空搜索历史',
                    message: '确定要清空所有搜索历史吗？',
                    type: 'warning',
                    onConfirm: () => {
                        this.clearSearchHistory();
                        const historySection = dropdown.querySelector('.search-section');
                        if (historySection) historySection.remove();
                        Toast.success('已清空搜索历史');
                    }
                });
            });
        }

        // 点击热门搜索
        dropdown.querySelectorAll('.search-hot-item').forEach(item => {
            item.addEventListener('click', () => {
                const keyword = item.dataset.keyword;
                this.performSearch(keyword);
            });
        });
    },

    /**
     * 显示搜索建议
     */
    showSearchSuggestions(keyword) {
        this.closeAllDropdowns();

        const searchContainer = document.querySelector('.navbar-search');
        if (!searchContainer) return;

        // 模拟搜索建议数据
        const suggestions = this.getSearchSuggestions(keyword);

        if (suggestions.length === 0) {
            return;
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'navbar-dropdown search-dropdown';
        dropdown.innerHTML = `
            <div class="search-section">
                <div class="search-section-header">
                    <span class="search-section-title">
                        <i class="fas fa-search"></i> 搜索建议
                    </span>
                </div>
                <div class="search-suggestions-list">
                    ${suggestions.map(item => `
                        <div class="search-suggestion-item" data-keyword="${item.keyword}">
                            <i class="fas fa-${item.icon}"></i>
                            <div class="search-suggestion-content">
                                <div class="search-suggestion-title">${this.highlightKeyword(item.title, keyword)}</div>
                                <div class="search-suggestion-desc">${item.type}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        searchContainer.appendChild(dropdown);

        setTimeout(() => {
            dropdown.classList.add('show');
        }, 10);

        // 绑定事件
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 点击建议项
        dropdown.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const keyword = item.dataset.keyword;
                this.performSearch(keyword);
            });
        });
    },

    /**
     * 获取搜索建议
     */
    getSearchSuggestions(keyword) {
        // 模拟搜索建议数据
        const allSuggestions = [
            { keyword: '科研经费异常支出', title: '科研经费异常支出', type: '预警线索', icon: 'exclamation-triangle' },
            { keyword: '科研经费管理', title: '科研经费管理', type: '监督模型', icon: 'cube' },
            { keyword: '科研项目审计', title: '科研项目审计', type: '审计监督', icon: 'file-invoice' },
            { keyword: '招生录取异常', title: '招生录取异常', type: '预警线索', icon: 'exclamation-triangle' },
            { keyword: '招生录取监督', title: '招生录取监督', type: '纪检监督', icon: 'gavel' },
            { keyword: '基建采购审计', title: '基建采购审计', type: '审计监督', icon: 'file-invoice' },
            { keyword: '基建项目监督', title: '基建项目监督', type: '纪检监督', icon: 'gavel' },
            { keyword: '财务管理预警', title: '财务管理预警', type: '预警线索', icon: 'exclamation-triangle' },
            { keyword: '财务审计报告', title: '财务审计报告', type: '报表中心', icon: 'file-alt' },
            { keyword: '八项规定检查', title: '八项规定检查', type: '纪检监督', icon: 'gavel' },
            { keyword: '三重一大决策', title: '三重一大决策', type: '纪检监督', icon: 'gavel' },
            { keyword: '固定资产管理', title: '固定资产管理', type: '审计监督', icon: 'file-invoice' },
            { keyword: '预算执行审计', title: '预算执行审计', type: '审计监督', icon: 'file-invoice' },
            { keyword: '工单处理', title: '工单处理', type: '工单管理', icon: 'clipboard-list' },
            { keyword: '整改任务', title: '整改任务', type: '整改管理', icon: 'tasks' }
        ];

        // 过滤匹配的建议
        const filtered = allSuggestions.filter(item =>
            item.keyword.toLowerCase().includes(keyword.toLowerCase()) ||
            item.title.toLowerCase().includes(keyword.toLowerCase())
        );

        return filtered.slice(0, 8);
    },

    /**
     * 高亮关键词
     */
    highlightKeyword(text, keyword) {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    },

    /**
     * 保存搜索历史
     */
    saveSearchHistory(keyword) {
        let history = this.getSearchHistory();

        // 移除重复项
        history = history.filter(item => item !== keyword);

        // 添加到开头
        history.unshift(keyword);

        // 限制数量
        if (history.length > 10) {
            history = history.slice(0, 10);
        }

        Storage.set('search-history', history);
    },

    /**
     * 获取搜索历史
     */
    getSearchHistory() {
        return Storage.get('search-history', []);
    },

    /**
     * 移除单个搜索历史
     */
    removeSearchHistory(keyword) {
        let history = this.getSearchHistory();
        history = history.filter(item => item !== keyword);
        Storage.set('search-history', history);
    },

    /**
     * 清空搜索历史
     */
    clearSearchHistory() {
        Storage.set('search-history', []);
    },

    /**
     * 显示消息通知面板
     */
    showNotificationPanel() {
        this.closeAllDropdowns();

        const notificationIcon = document.querySelector('.navbar-icon');
        if (!notificationIcon) return;

        // 模拟消息数据
        const notifications = [
            {
                id: 1,
                type: 'warning',
                title: '预警提醒',
                content: '发现科研经费异常支出，请及时处理',
                time: '5分钟前',
                read: false
            },
            {
                id: 2,
                type: 'info',
                title: '工单分配',
                content: '您有新的工单待处理：招生录取异常核查',
                time: '1小时前',
                read: false
            },
            {
                id: 3,
                type: 'success',
                title: '整改完成',
                content: '财务管理整改任务已完成审核',
                time: '2小时前',
                read: true
            },
            {
                id: 4,
                type: 'info',
                title: '系统通知',
                content: '系统将于今晚22:00进行维护，预计1小时',
                time: '3小时前',
                read: true
            },
            {
                id: 5,
                type: 'warning',
                title: '待办提醒',
                content: '您有3个待办事项即将超期',
                time: '昨天',
                read: true
            }
        ];

        const unreadCount = notifications.filter(n => !n.read).length;

        const dropdown = document.createElement('div');
        dropdown.className = 'navbar-dropdown notification-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-header">
                <h4>消息通知</h4>
                <span class="notification-count">${unreadCount}条未读</span>
            </div>
            <div class="dropdown-body">
                <div class="notification-list">
                    ${notifications.map(notif => `
                        <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                            <div class="notification-icon notification-${notif.type}">
                                <i class="fas fa-${this.getNotificationIcon(notif.type)}"></i>
                            </div>
                            <div class="notification-content">
                                <div class="notification-title">${notif.title}</div>
                                <div class="notification-text">${notif.content}</div>
                                <div class="notification-time">${notif.time}</div>
                            </div>
                            ${!notif.read ? '<span class="notification-badge"></span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="dropdown-footer">
                <a href="javascript:void(0)" class="mark-all-read">全部标记为已读</a>
                <a href="notification-center.html" class="view-all">查看全部</a>
            </div>
        `;

        notificationIcon.appendChild(dropdown);

        setTimeout(() => {
            dropdown.classList.add('show');
        }, 10);

        // 绑定事件
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 点击通知项
        dropdown.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                item.classList.remove('unread');
                item.classList.add('read');
                const badge = item.querySelector('.notification-badge');
                if (badge) badge.remove();
                Toast.info('已标记为已读');
            });
        });

        // 全部标记为已读
        const markAllBtn = dropdown.querySelector('.mark-all-read');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                    item.classList.add('read');
                    const badge = item.querySelector('.notification-badge');
                    if (badge) badge.remove();
                });
                const countEl = dropdown.querySelector('.notification-count');
                if (countEl) countEl.textContent = '0条未读';
                const navbarBadge = document.querySelector('.navbar-badge');
                if (navbarBadge) navbarBadge.style.display = 'none';
                Toast.success('已全部标记为已读');
            });
        }
    },

    /**
     * 显示用户菜单
     */
    showUserMenu() {
        this.closeAllDropdowns();

        const userMenu = document.querySelector('.navbar-user');
        if (!userMenu) return;

        const dropdown = document.createElement('div');
        dropdown.className = 'navbar-dropdown user-dropdown';
        dropdown.innerHTML = `
            <div class="user-dropdown-header">
                <div class="user-dropdown-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-dropdown-info">
                    <div class="user-dropdown-name">张三</div>
                    <div class="user-dropdown-role">纪检监察人员</div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-body">
                <a href="user-profile.html" class="dropdown-item">
                    <i class="fas fa-user-circle"></i>
                    <span>个人资料</span>
                </a>
                <a href="user-settings.html" class="dropdown-item">
                    <i class="fas fa-cog"></i>
                    <span>账号设置</span>
                </a>
                <a href="change-password.html" class="dropdown-item">
                    <i class="fas fa-key"></i>
                    <span>修改密码</span>
                </a>
                <a href="notification-settings.html" class="dropdown-item">
                    <i class="fas fa-bell"></i>
                    <span>消息设置</span>
                </a>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-body">
                <a href="help-center.html" class="dropdown-item">
                    <i class="fas fa-question-circle"></i>
                    <span>帮助中心</span>
                </a>
                <a href="javascript:void(0)" class="dropdown-item" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>退出登录</span>
                </a>
            </div>
        `;

        userMenu.appendChild(dropdown);

        setTimeout(() => {
            dropdown.classList.add('show');
        }, 10);

        // 绑定事件
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 退出登录
        const logoutBtn = dropdown.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Confirm.show({
                    title: '退出登录',
                    message: '确定要退出登录吗？',
                    type: 'warning',
                    confirmText: '退出',
                    cancelText: '取消',
                    onConfirm: () => {
                        Loading.show('正在退出...');
                        setTimeout(() => {
                            Loading.hide();
                            Toast.success('已退出登录');
                            window.location.href = 'login.html';
                        }, 1000);
                    }
                });
            });
        }
    },

    /**
     * 关闭所有下拉菜单
     */
    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.navbar-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
            setTimeout(() => {
                if (dropdown.parentNode) {
                    dropdown.parentNode.removeChild(dropdown);
                }
            }, 300);
        });
    },

    /**
     * 获取通知图标
     */
    getNotificationIcon(type) {
        const icons = {
            warning: 'exclamation-triangle',
            error: 'times-circle',
            success: 'check-circle',
            info: 'info-circle'
        };
        return icons[type] || 'bell';
    }
};

// ============================================================================
// 侧边导航栏组件
// ============================================================================

/**
 * 侧边导航栏组件
 * 包含系统主要功能模块的导航菜单，支持多级菜单和收起/展开功能
 * @namespace SideNavbar
 */
const SideNavbar = {
    /**
     * 菜单项配置
     * @type {Array<Object>}
     * @property {string} id - 菜单项唯一标识
     * @property {string} icon - Font Awesome图标类名
     * @property {string} text - 菜单项文本
     * @property {string} link - 菜单项链接
     * @property {Array} children - 子菜单项（可选）
     */
    menuItems: [
        {
            id: 'dashboard',
            icon: 'fa-home',
            text: '个人工作台',
            link: 'dashboard.html'
        },
        {
            id: 'command-center',
            icon: 'fa-chart-line',
            text: '监督指挥大屏',
            link: 'command-center.html'
        },
        {
            id: 'clue',
            icon: 'fa-lightbulb',
            text: '线索管理',
            children: [
                { id: 'alert-center', icon: 'fa-bell', text: '预警中心', link: 'alert-center.html' },
                { id: 'clue-library', icon: 'fa-folder-open', text: '线索库', link: 'clue-library.html' },
                { id: 'work-order', icon: 'fa-clipboard-list', text: '工单管理', link: 'work-order.html' },
                { id: 'rectification', icon: 'fa-tasks', text: '整改管理', link: 'rectification.html' }
            ]
        },
        {
            id: 'discipline',
            icon: 'fa-gavel',
            text: '纪检监督',
            children: [
                { id: 'first-topic', icon: 'fa-flag', text: '第一议题', link: 'discipline-supervision.html?type=first-topic' },
                { id: 'major-decision', icon: 'fa-balance-scale', text: '重大决策', link: 'discipline-supervision.html?type=major-decision' },
                { id: 'enrollment', icon: 'fa-user-graduate', text: '招生录取', link: 'discipline-supervision.html?type=enrollment' },
                { id: 'research-fund', icon: 'fa-flask', text: '科研经费', link: 'discipline-supervision.html?type=research-fund' },
                { id: 'construction', icon: 'fa-building', text: '基建采购', link: 'discipline-supervision.html?type=construction' },
                { id: 'procurement-projects', icon: 'fa-tasks', text: '采购项目监督', link: 'test-procurement-project.html' },
                { id: 'finance', icon: 'fa-coins', text: '财务管理', link: 'discipline-supervision.html?type=finance' },
                { id: 'eight-rules', icon: 'fa-list-ol', text: '八项规定', link: 'discipline-supervision.html?type=eight-rules' },
                { id: 'three-major', icon: 'fa-star', text: '三重一大', link: 'discipline-supervision.html?type=three-major' }
            ]
        },
        {
            id: 'audit',
            icon: 'fa-file-invoice',
            text: '审计监督',
            children: [
                { id: 'budget', icon: 'fa-calculator', text: '预算执行', link: 'audit-supervision.html?type=budget' },
                { id: 'research-audit', icon: 'fa-microscope', text: '科研经费', link: 'audit-supervision.html?type=research' },
                { id: 'procurement', icon: 'fa-shopping-cart', text: '采购管理', link: 'audit-supervision.html?type=procurement' },
                { id: 'assets', icon: 'fa-warehouse', text: '固定资产', link: 'audit-supervision.html?type=assets' },
                { id: 'enrollment-audit', icon: 'fa-id-card', text: '招生学籍', link: 'audit-supervision.html?type=enrollment' },
                { id: 'project', icon: 'fa-hard-hat', text: '工程项目', link: 'audit-supervision.html?type=project' },
                { id: 'salary', icon: 'fa-money-check-alt', text: '薪酬社保', link: 'audit-supervision.html?type=salary' },
                { id: 'it-governance', icon: 'fa-server', text: 'IT治理', link: 'audit-supervision.html?type=it' }
            ]
        },
        {
            id: 'model',
            icon: 'fa-cubes',
            text: '监督模型',
            children: [
                { id: 'supervision-model-library', icon: 'fa-cube', text: '监督模型库', link: 'supervision-model-library.html' },
                { id: 'custom-model-builder', icon: 'fa-drafting-compass', text: '自定义建模', link: 'custom-model-builder.html' },
                { id: 'model-evaluation', icon: 'fa-chart-bar', text: '模型评估', link: 'model-evaluation.html' },
                { id: 'model-optimization', icon: 'fa-sliders-h', text: '模型优化', link: 'model-optimization.html' }
            ]
        },
        {
            id: 'rule-engine',
            icon: 'fa-cogs',
            text: '规则引擎',
            link: 'rule-engine-management.html'
        },
        {
            id: 'analysis',
            icon: 'fa-chart-pie',
            text: '智能分析',
            children: [
                { id: 'data-analysis', icon: 'fa-chart-area', text: '数据分析', link: 'data-analysis.html' },
                { id: 'relation-analysis', icon: 'fa-project-diagram', text: '关联分析', link: 'relation-analysis.html' },
                { id: 'text-analysis', icon: 'fa-file-alt', text: '文本分析', link: 'text-analysis.html' },
                { id: 'invoice-ocr', icon: 'fa-receipt', text: '票据OCR', link: 'invoice-ocr.html' }
            ]
        },
        {
            id: 'report',
            icon: 'fa-file-alt',
            text: '报表中心',
            link: 'report-center.html'
        },
        {
            id: 'data-governance',
            icon: 'fa-database',
            text: '数据治理',
            children: [
                { id: 'datasource-mgmt', icon: 'fa-plug', text: '数据源管理', link: 'datasource-management.html' },
                { id: 'collection-task', icon: 'fa-download', text: '采集任务', link: 'collection-task-management.html' },
                { id: 'etl-mgmt', icon: 'fa-exchange-alt', text: 'ETL管理', link: 'etl-management.html' },
                { id: 'master-data', icon: 'fa-table', text: '主数据管理', link: 'master-data-management.html' },
                { id: 'data-quality', icon: 'fa-check-circle', text: '数据质量', link: 'data-quality-management.html' },
                { id: 'metadata-mgmt', icon: 'fa-tags', text: '元数据管理', link: 'metadata-management.html' },
                { id: 'data-security', icon: 'fa-shield-alt', text: '数据安全', link: 'data-security-management.html' },
                { id: 'data-classification', icon: 'fa-layer-group', text: '数据分类分级', link: 'data-classification.html' },
                { id: 'external-data', icon: 'fa-cloud-download-alt', text: '外部数据接入', link: 'external-data.html' }
            ]
        },
        {
            id: 'system',
            icon: 'fa-cog',
            text: '系统管理',
            children: [
                { id: 'user-mgmt', icon: 'fa-users', text: '用户管理', link: 'system-management.html?type=user' },
                { id: 'role-mgmt', icon: 'fa-user-tag', text: '角色管理', link: 'system-management.html?type=role' },
                { id: 'org-mgmt', icon: 'fa-sitemap', text: '组织管理', link: 'system-management.html?type=org' },
                { id: 'param-config', icon: 'fa-wrench', text: '参数配置', link: 'system-management.html?type=param' },
                { id: 'system-monitoring', icon: 'fa-desktop', text: '系统监控', link: 'system-monitoring.html' },
                { id: 'log-audit', icon: 'fa-history', text: '日志审计', link: 'system-management.html?type=log' }
            ]
        }
    ],

    render() {
        const renderMenuItem = (item, level = 0) => {
            const hasChildren = item.children && item.children.length > 0;
            const isActive = this.isActive(item);

            if (hasChildren) {
                return `
                    <li class="menu-item ${isActive ? 'expanded' : ''}">
                        <a href="javascript:void(0)" class="menu-link ${isActive ? 'active' : ''}" data-id="${item.id}" data-menu-id="${item.id}" data-tooltip="${item.text}">
                            <i class="fas ${item.icon} menu-icon"></i>
                            <span class="menu-text">${item.text}</span>
                            <i class="fas fa-chevron-right menu-arrow"></i>
                        </a>
                        <ul class="submenu">
                            ${item.children.map(child => renderMenuItem(child, level + 1)).join('')}
                        </ul>
                    </li>
                `;
            } else {
                return `
                    <li class="menu-item">
                        <a href="${item.link || 'javascript:void(0)'}" class="menu-link ${isActive ? 'active' : ''}" data-id="${item.id}" data-menu-id="${item.id}" data-tooltip="${item.text}">
                            ${item.icon ? `<i class="fas ${item.icon} menu-icon"></i>` : '<span class="menu-icon"></span>'}
                            <span class="menu-text">${item.text}</span>
                        </a>
                    </li>
                `;
            }
        };

        return `
            <div class="side-navbar">
                <div class="sidebar-toggle">
                    <button class="sidebar-toggle-btn" title="收起/展开">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
                <ul class="sidebar-menu">
                    ${this.menuItems.map(item => renderMenuItem(item)).join('')}
                </ul>
            </div>
        `;
    },

    isActive(item) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (item.link && item.link.includes(currentPage)) {
            return true;
        }

        if (item.children) {
            return item.children.some(child => child.link && child.link.includes(currentPage));
        }

        return false;
    },

    init() {
        const sidebar = document.getElementById('side-navbar');
        if (sidebar) {
            sidebar.innerHTML = this.render();
            this.bindEvents();
        }
    },

    bindEvents() {
        // 侧边栏收起/展开
        const toggleBtn = document.querySelector('.sidebar-toggle-btn');
        const sidebar = document.querySelector('.side-navbar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                Storage.set('sidebar-collapsed', sidebar.classList.contains('collapsed'));
            });

            // 恢复侧边栏状态
            const isCollapsed = Storage.get('sidebar-collapsed', false);
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
            }
        }

        // 菜单展开/折叠
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const menuItem = link.closest('.menu-item');
                const submenu = menuItem.querySelector('.submenu');

                if (submenu) {
                    e.preventDefault();
                    menuItem.classList.toggle('expanded');
                }
            });
        });
    }
};

// 页脚组件
const Footer = {
    render() {
        const currentYear = new Date().getFullYear();
        return `
            <div class="footer">
                <p>© ${currentYear} 高校纪检审计监管一体化平台</p>
                <p style="margin-top: 4px; font-size: 12px; color: #9CA3AF;">
                    版权所有：广东绿力网格科技有限公司 | 联系电话：400-xxx-xxxx
                </p>
            </div>
        `;
    },

    init() {
        const footer = document.getElementById('footer');
        if (footer) {
            footer.innerHTML = this.render();
        }
    }
};

// 模态对话框组件
const Modal = {
    currentModal: null,

    /**
     * 显示模态框
     * @param {Object} options - 配置选项
     * @param {string} options.title - 标题
     * @param {string} options.content - 内容（HTML字符串）
     * @param {Array} options.buttons - 按钮配置数组
     * @param {string} options.size - 尺寸 ('sm', 'md', 'lg', 'xl')
     * @param {string} options.width - 自定义宽度（如 '600px'）
     * @param {boolean} options.showFooter - 是否显示底部按钮
     * @param {string} options.confirmText - 确认按钮文本
     * @param {string} options.cancelText - 取消按钮文本
     * @param {Function} options.onConfirm - 确认回调
     * @param {Function} options.onCancel - 取消回调
     * @param {boolean} options.closeOnOverlay - 点击遮罩层是否关闭
     * @param {Function} options.onClose - 关闭回调
     */
    show(options = {}) {
        const {
            title = '提示',
            content = '',
            buttons = null,
            size = 'md',
            width = null,
            showFooter = true,
            confirmText = '确定',
            cancelText = '取消',
            onConfirm = null,
            onCancel = null,
            closeOnOverlay = true,
            onClose = null
        } = options;

        // 如果没有提供buttons，使用showFooter和confirmText/cancelText
        let finalButtons = buttons;
        if (!finalButtons && showFooter) {
            finalButtons = [
                {
                    text: cancelText,
                    type: 'secondary',
                    onClick: () => {
                        if (onCancel) onCancel();
                        this.hide();
                    }
                },
                {
                    text: confirmText,
                    type: 'primary',
                    onClick: () => {
                        if (onConfirm) {
                            const shouldClose = onConfirm();
                            if (shouldClose !== false) {
                                this.hide();
                            }
                        } else {
                            this.hide();
                        }
                    }
                }
            ];
        } else if (!finalButtons) {
            finalButtons = [{ text: '确定', type: 'primary', onClick: () => this.hide() }];
        }

        // 如果已有模态框，先关闭
        if (this.currentModal) {
            this.hide();
        }

        // 创建模态框元素
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        const containerStyle = width ? `style="width: ${width}"` : '';
        const containerClass = width ? 'modal-container' : `modal-container modal-${size}`;

        modal.innerHTML = `
            <div class="${containerClass}" ${containerStyle}>
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close-btn" aria-label="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${showFooter ? `
                <div class="modal-footer">
                    ${finalButtons.map((btn, index) => `
                        <button class="btn btn-${btn.type || 'default'}" data-index="${index}">
                            ${btn.icon ? `<i class="fas fa-${btn.icon}"></i>` : ''}
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;

        // 添加到页面
        document.body.appendChild(modal);
        this.currentModal = modal;

        // 添加动画
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);

        // 绑定事件
        this.bindEvents(modal, finalButtons, closeOnOverlay, onClose);

        return modal;
    },

    bindEvents(modal, buttons, closeOnOverlay, onClose) {
        // 关闭按钮
        const closeBtn = modal.querySelector('.modal-close-btn');
        closeBtn.addEventListener('click', () => {
            this.hide();
            if (onClose) onClose();
        });

        // 遮罩层点击
        if (closeOnOverlay) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hide();
                    if (onClose) onClose();
                }
            });
        }

        // 按钮点击
        const btnElements = modal.querySelectorAll('.modal-footer button');
        btnElements.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (buttons[index].onClick) {
                    buttons[index].onClick();
                }
            });
        });

        // ESC 键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.hide();
                if (onClose) onClose();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    },

    hide() {
        if (this.currentModal) {
            this.currentModal.classList.remove('modal-show');
            setTimeout(() => {
                if (this.currentModal && this.currentModal.parentNode) {
                    this.currentModal.parentNode.removeChild(this.currentModal);
                }
                this.currentModal = null;
            }, 300);
        }
    }
};

// Toast 消息提示组件
const Toast = {
    container: null,
    queue: [],
    maxVisible: 5,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    /**
     * 显示消息
     * @param {string} message - 消息内容
     * @param {string} type - 类型 ('success', 'warning', 'error', 'info')
     * @param {number} duration - 持续时间（毫秒），0表示不自动关闭
     */
    show(message, type = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icons[type]}"></i>
            </div>
            <div class="toast-content">${message}</div>
            <button class="toast-close" aria-label="关闭">
                <i class="fas fa-times"></i>
            </button>
        `;

        // 添加到容器
        this.container.appendChild(toast);
        this.queue.push(toast);

        // 限制显示数量
        if (this.queue.length > this.maxVisible) {
            const oldToast = this.queue.shift();
            this.remove(oldToast);
        }

        // 添加动画
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        // 绑定关闭按钮
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(toast);
        });

        // 自动关闭
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }

        return toast;
    },

    remove(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.remove('toast-show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            const index = this.queue.indexOf(toast);
            if (index > -1) {
                this.queue.splice(index, 1);
            }
        }, 300);
    },

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    },

    warning(message, duration = 3000) {
        return this.show(message, 'warning', duration);
    },

    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    },

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
};

// 确认对话框组件
const Confirm = {
    /**
     * 显示确认对话框
     * @param {Object} options - 配置选项
     * @param {string} options.title - 标题
     * @param {string} options.message - 消息内容
     * @param {string} options.type - 类型 ('warning', 'danger', 'info')
     * @param {string} options.confirmText - 确认按钮文字
     * @param {string} options.cancelText - 取消按钮文字
     * @param {Function} options.onConfirm - 确认回调
     * @param {Function} options.onCancel - 取消回调
     */
    show(options = {}) {
        const {
            title = '确认操作',
            message = '确定要执行此操作吗？',
            type = 'warning',
            confirmText = '确定',
            cancelText = '取消',
            onConfirm = null,
            onCancel = null
        } = options;

        const icons = {
            warning: { icon: 'exclamation-triangle', color: '#F59E0B' },
            danger: { icon: 'exclamation-circle', color: '#EF4444' },
            info: { icon: 'info-circle', color: '#06B6D4' }
        };

        const iconConfig = icons[type] || icons.warning;

        const content = `
            <div class="confirm-content">
                <div class="confirm-icon" style="color: ${iconConfig.color}">
                    <i class="fas fa-${iconConfig.icon}"></i>
                </div>
                <div class="confirm-message">${message}</div>
            </div>
        `;

        Modal.show({
            title,
            content,
            size: 'sm',
            closeOnOverlay: false,
            buttons: [
                {
                    text: cancelText,
                    type: 'default',
                    onClick: () => {
                        Modal.hide();
                        if (onCancel) onCancel();
                    }
                },
                {
                    text: confirmText,
                    type: type === 'danger' ? 'danger' : 'primary',
                    onClick: () => {
                        Modal.hide();
                        if (onConfirm) onConfirm();
                    }
                }
            ]
        });
    },

    delete(message = '确定要删除吗？此操作不可恢复。', onConfirm = null) {
        this.show({
            title: '删除确认',
            message,
            type: 'danger',
            confirmText: '删除',
            cancelText: '取消',
            onConfirm
        });
    },

    submit(message = '确定要提交吗？', onConfirm = null) {
        this.show({
            title: '提交确认',
            message,
            type: 'info',
            confirmText: '提交',
            cancelText: '取消',
            onConfirm
        });
    }
};

// 加载状态组件
const Loading = {
    overlay: null,

    /**
     * 显示全局加载遮罩
     * @param {string} text - 加载文字
     */
    show(text = '加载中...') {
        if (this.overlay) {
            this.hide();
        }

        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-text">${text}</div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        setTimeout(() => {
            this.overlay.classList.add('loading-show');
        }, 10);
    },

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('loading-show');
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                this.overlay = null;
            }, 300);
        }
    },

    /**
     * 创建局部加载动画
     * @param {HTMLElement} element - 目标元素
     */
    showInElement(element) {
        if (!element) return;

        const loader = document.createElement('div');
        loader.className = 'element-loading';
        loader.innerHTML = '<div class="spinner"></div>';

        element.style.position = 'relative';
        element.appendChild(loader);

        return loader;
    },

    /**
     * 移除局部加载动画
     * @param {HTMLElement} element - 目标元素
     */
    hideInElement(element) {
        if (!element) return;

        const loader = element.querySelector('.element-loading');
        if (loader) {
            loader.parentNode.removeChild(loader);
        }
    }
};

// 骨架屏组件
const Skeleton = {
    /**
     * 创建骨架屏
     * @param {string} type - 类型 ('text', 'card', 'table', 'list')
     * @param {Object} options - 配置选项
     */
    create(type = 'text', options = {}) {
        const { rows = 3, columns = 4 } = options;

        const templates = {
            text: `
                <div class="skeleton-text">
                    ${Array(rows).fill(0).map(() => '<div class="skeleton-line"></div>').join('')}
                </div>
            `,
            card: `
                <div class="skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line" style="width: 60%"></div>
                    </div>
                </div>
            `,
            table: `
                <div class="skeleton-table">
                    <div class="skeleton-table-header">
                        ${Array(columns).fill(0).map(() => '<div class="skeleton-cell"></div>').join('')}
                    </div>
                    ${Array(rows).fill(0).map(() => `
                        <div class="skeleton-table-row">
                            ${Array(columns).fill(0).map(() => '<div class="skeleton-cell"></div>').join('')}
                        </div>
                    `).join('')}
                </div>
            `,
            list: `
                <div class="skeleton-list">
                    ${Array(rows).fill(0).map(() => `
                        <div class="skeleton-list-item">
                            <div class="skeleton-avatar"></div>
                            <div class="skeleton-content">
                                <div class="skeleton-line"></div>
                                <div class="skeleton-line" style="width: 70%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `
        };

        return templates[type] || templates.text;
    },

    /**
     * 在元素中显示骨架屏
     * @param {HTMLElement} element - 目标元素
     * @param {string} type - 类型
     * @param {Object} options - 配置选项
     */
    showInElement(element, type = 'text', options = {}) {
        if (!element) return;

        element.innerHTML = this.create(type, options);
        element.classList.add('skeleton-container');
    },

    /**
     * 移除骨架屏
     * @param {HTMLElement} element - 目标元素
     */
    hideInElement(element) {
        if (!element) return;

        element.classList.remove('skeleton-container');
    }
};

// 初始化所有组件
document.addEventListener('DOMContentLoaded', () => {
    TopNavbar.init();
    SideNavbar.init();
    Footer.init();
    Toast.init();
});

/**
 * 初始化通用组件
 * 用于在页面中手动初始化组件
 */
function initializeCommonComponents() {
    // 初始化导航菜单
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.innerHTML = SideNavbar.render().match(/<ul class="sidebar-menu">[\s\S]*<\/ul>/)[0];
        SideNavbar.bindEvents();
    }

    // 初始化用户信息
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="user-details">
                <div class="user-name">管理员</div>
                <div class="user-role">系统管理员</div>
            </div>
        `;
    }
}
