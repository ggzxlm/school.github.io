/**
 * 系统集成服务
 * 
 * 负责将数据采集与治理、数据分析与预警模块集成到现有平台
 * 提供统一的用户认证、权限控制、导航菜单等功能
 * 
 * @author 开发团队
 * @version 1.0.0
 * @date 2025-10-23
 */

const IntegrationService = {
    /**
     * 初始化集成服务
     */
    init() {
        console.log('初始化系统集成服务...');
        this.initAuth();
        this.initPermissions();
        this.initNavigation();
        this.initEventBus();
        console.log('系统集成服务初始化完成');
    },

    /**
     * 初始化用户认证
     */
    initAuth() {
        // 检查用户登录状态
        const user = this.getCurrentUser();
        if (!user) {
            console.warn('用户未登录，部分功能可能受限');
        } else {
            console.log('当前用户:', user.username, '角色:', user.role);
        }
    },

    /**
     * 获取当前用户信息
     */
    getCurrentUser() {
        // 从本地存储获取用户信息
        const user = Storage.get('current-user');
        if (user) {
            return user;
        }

        // 模拟用户信息（实际应从后端获取）
        const mockUser = {
            id: 'user001',
            username: '张三',
            role: '纪检监察人员',
            permissions: [
                'dashboard:view',
                'clue:view', 'clue:edit', 'clue:delete',
                'alert:view', 'alert:handle',
                'datasource:view', 'datasource:edit',
                'collection:view', 'collection:execute',
                'etl:view', 'etl:execute',
                'quality:view', 'quality:check',
                'rule:view', 'rule:edit',
                'report:view', 'report:export',
                'analysis:view'
            ],
            department: '纪检监察室',
            email: 'zhangsan@university.edu.cn',
            phone: '13800138000'
        };

        Storage.set('current-user', mockUser);
        return mockUser;
    },

    /**
     * 初始化权限控制
     */
    initPermissions() {
        const user = this.getCurrentUser();
        if (!user) return;

        // 根据用户权限显示/隐藏菜单项
        this.applyPermissions(user.permissions);
    },

    /**
     * 应用权限控制
     */
    applyPermissions(permissions) {
        // 权限映射表
        const permissionMap = {
            'datasource:view': ['datasource-mgmt'],
            'collection:view': ['collection-task'],
            'etl:view': ['etl-mgmt'],
            'quality:view': ['data-quality'],
            'metadata:view': ['metadata-mgmt'],
            'security:view': ['data-security'],
            'classification:view': ['data-classification'],
            'rule:view': ['rule-config'],
            'alert:view': ['alert-center'],
            'analysis:view': ['relation-analysis', 'text-analysis', 'invoice-ocr'],
            'model:view': ['supervision-model'],
            'report:view': ['report'],
            'monitoring:view': ['system-monitoring']
        };

        // 隐藏无权限的菜单项
        Object.entries(permissionMap).forEach(([permission, menuIds]) => {
            if (!permissions.includes(permission)) {
                menuIds.forEach(menuId => {
                    const menuItem = document.querySelector(`[data-id="${menuId}"]`);
                    if (menuItem) {
                        const parentLi = menuItem.closest('li');
                        if (parentLi) {
                            parentLi.style.display = 'none';
                        }
                    }
                });
            }
        });
    },

    /**
     * 检查用户是否有指定权限
     */
    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    },

    /**
     * 初始化导航菜单
     */
    initNavigation() {
        // 更新侧边栏菜单，添加数据治理和分析模块
        this.updateSidebarMenu();
        
        // 设置当前页面的激活状态
        this.setActiveMenu();
    },

    /**
     * 更新侧边栏菜单
     */
    updateSidebarMenu() {
        // 扩展的菜单项配置
        const extendedMenuItems = [
            {
                id: 'data-governance',
                icon: 'fa-database',
                text: '数据治理',
                children: [
                    { id: 'datasource-mgmt', text: '数据源管理', link: 'datasource-management.html' },
                    { id: 'collection-task', text: '采集任务管理', link: 'collection-task-management.html' },
                    { id: 'etl-mgmt', text: 'ETL管理', link: 'etl-management.html' },
                    { id: 'master-data', text: '主数据管理', link: 'master-data-management.html' },
                    { id: 'data-quality', text: '数据质量管理', link: 'data-quality-management.html' },
                    { id: 'metadata-mgmt', text: '元数据管理', link: 'metadata-management.html' },
                    { id: 'data-security', text: '数据安全管理', link: 'data-security-management.html' },
                    { id: 'data-classification', text: '数据分类分级', link: 'data-classification.html' },
                    { id: 'external-data', text: '外部数据接入', link: 'external-data.html' }
                ]
            },
            {
                id: 'data-analysis',
                icon: 'fa-chart-bar',
                text: '数据分析与预警',
                children: [
                    { id: 'rule-engine', text: '规则引擎', link: 'rule-engine-management.html' },
                    { id: 'relation-analysis', text: '关联分析', link: 'relation-analysis.html' },
                    { id: 'text-analysis', text: '文本分析', link: 'text-analysis.html' },
                    { id: 'invoice-ocr', text: '票据OCR', link: 'invoice-ocr.html' },
                    { id: 'supervision-model', text: '监督模型库', link: 'supervision-model-library.html' },
                    { id: 'model-optimization', text: '模型优化', link: 'model-optimization.html' }
                ]
            },
            {
                id: 'system-monitoring',
                icon: 'fa-server',
                text: '系统监控',
                link: 'system-monitoring.html'
            }
        ];

        // 将扩展菜单项添加到 SideNavbar 的 menuItems 中
        if (typeof SideNavbar !== 'undefined') {
            // 查找"数据分析"菜单项的位置
            const analysisIndex = SideNavbar.menuItems.findIndex(item => item.id === 'analysis');
            
            if (analysisIndex !== -1) {
                // 在"数据分析"后面插入新的菜单项
                SideNavbar.menuItems.splice(analysisIndex + 1, 0, ...extendedMenuItems);
                
                // 重新渲染侧边栏
                const sidebar = document.getElementById('side-navbar');
                if (sidebar) {
                    sidebar.innerHTML = SideNavbar.render();
                    SideNavbar.bindEvents();
                }
            }
        }
    },

    /**
     * 设置当前激活的菜单项
     */
    setActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('.menu-link');
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
                
                // 展开父菜单
                const parentItem = link.closest('.menu-item');
                if (parentItem) {
                    const parentMenu = parentItem.parentElement.closest('.menu-item');
                    if (parentMenu) {
                        parentMenu.classList.add('expanded');
                    }
                }
            }
        });
    },

    /**
     * 初始化事件总线
     */
    initEventBus() {
        // 创建全局事件总线
        window.EventBus = {
            events: {},
            
            on(event, callback) {
                if (!this.events[event]) {
                    this.events[event] = [];
                }
                this.events[event].push(callback);
            },
            
            off(event, callback) {
                if (!this.events[event]) return;
                this.events[event] = this.events[event].filter(cb => cb !== callback);
            },
            
            emit(event, data) {
                if (!this.events[event]) return;
                this.events[event].forEach(callback => callback(data));
            }
        };

        // 注册系统级事件
        this.registerSystemEvents();
    },

    /**
     * 注册系统级事件
     */
    registerSystemEvents() {
        // 数据源状态变更事件
        EventBus.on('datasource:status-changed', (data) => {
            console.log('数据源状态变更:', data);
            Toast.info(`数据源 ${data.name} 状态已更新`);
        });

        // 采集任务完成事件
        EventBus.on('collection:task-completed', (data) => {
            console.log('采集任务完成:', data);
            Toast.success(`采集任务 ${data.taskName} 已完成`);
        });

        // 质量检查完成事件
        EventBus.on('quality:check-completed', (data) => {
            console.log('质量检查完成:', data);
            if (data.score < 60) {
                Toast.warning(`质量检查完成，评分: ${data.score}分，存在质量问题`);
            } else {
                Toast.success(`质量检查完成，评分: ${data.score}分`);
            }
        });

        // 预警生成事件
        EventBus.on('alert:generated', (data) => {
            console.log('新预警生成:', data);
            Toast.warning(`新预警: ${data.title}`);
            
            // 更新预警数量徽章
            this.updateAlertBadge();
        });

        // 规则执行完成事件
        EventBus.on('rule:execution-completed', (data) => {
            console.log('规则执行完成:', data);
            Toast.info(`规则 ${data.ruleName} 执行完成，命中 ${data.matchedCount} 条`);
        });
    },

    /**
     * 更新预警数量徽章
     */
    updateAlertBadge() {
        const badge = document.querySelector('.navbar-badge');
        if (badge) {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
        }
    },

    /**
     * 统一的API请求方法
     */
    async request(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // 添加认证token
        const user = this.getCurrentUser();
        if (user && user.token) {
            defaultOptions.headers['Authorization'] = `Bearer ${user.token}`;
        }

        const finalOptions = { ...defaultOptions, ...options };

        try {
            Loading.show('请求中...');
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            Loading.hide();
            return data;
        } catch (error) {
            Loading.hide();
            console.error('API请求失败:', error);
            Toast.error(`请求失败: ${error.message}`);
            throw error;
        }
    },

    /**
     * 统一的错误处理
     */
    handleError(error, context = '') {
        console.error(`${context} 错误:`, error);
        
        let message = '操作失败';
        if (error.message) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }
        
        Toast.error(message);
    },

    /**
     * 页面跳转
     */
    navigateTo(page, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${page}?${queryString}` : page;
        window.location.href = url;
    },

    /**
     * 获取URL参数
     */
    getUrlParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    },

    /**
     * 格式化日期时间
     */
    formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
        return Utils.formatDate(date, format);
    },

    /**
     * 格式化数字
     */
    formatNumber(num) {
        return Utils.formatNumber(num);
    },

    /**
     * 导出数据
     */
    exportData(data, filename, type = 'json') {
        let content, mimeType;
        
        if (type === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
        } else if (type === 'csv') {
            content = this.convertToCSV(data);
            mimeType = 'text/csv';
        } else {
            Toast.error('不支持的导出格式');
            return;
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.${type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        Toast.success('导出成功');
    },

    /**
     * 转换为CSV格式
     */
    convertToCSV(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return '';
        }
        
        const headers = Object.keys(data[0]);
        const csvRows = [];
        
        // 添加表头
        csvRows.push(headers.join(','));
        
        // 添加数据行
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    },

    /**
     * 打印页面
     */
    printPage() {
        window.print();
    },

    /**
     * 全屏切换
     */
    toggleFullscreen(element = document.documentElement) {
        if (!document.fullscreenElement) {
            element.requestFullscreen().catch(err => {
                Toast.error(`无法进入全屏模式: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    },

    /**
     * 复制到剪贴板
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Toast.success('已复制到剪贴板');
        } catch (err) {
            Toast.error('复制失败');
            console.error('复制失败:', err);
        }
    },

    /**
     * 下载文件
     */
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// 页面加载完成后初始化集成服务
document.addEventListener('DOMContentLoaded', () => {
    IntegrationService.init();
});

// 导出到全局
window.IntegrationService = IntegrationService;
