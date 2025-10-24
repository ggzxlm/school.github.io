/**
 * 高校纪检审计监管一体化平台 - 公共JavaScript
 * 
 * 本文件包含系统的公共工具函数和组件，包括：
 * - 全局配置
 * - 工具函数（日期格式化、数字格式化、防抖节流等）
 * - 本地存储管理
 * - Toast消息提示
 * - Modal模态框
 * - Loading加载状态
 * 
 * @author 开发团队
 * @version 1.0.0
 * @date 2025-10-22
 */

// ============================================================================
// 全局配置
// ============================================================================

/**
 * 应用全局配置对象
 * @type {Object}
 * @property {string} name - 应用名称
 * @property {string} version - 应用版本号
 * @property {string} apiBaseUrl - API基础URL
 * @property {number} sessionTimeout - 会话超时时间（毫秒）
 */
const APP_CONFIG = {
    name: '高校纪检审计监管一体化平台',
    version: '1.0.0',
    apiBaseUrl: '/api',
    sessionTimeout: 30 * 60 * 1000, // 30分钟
};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 工具函数集合
 * 提供常用的工具方法，如日期格式化、数字格式化、防抖节流等
 */
const Utils = {
    /**
     * 格式化日期
     * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
     * @param {string} format - 日期格式，默认 'YYYY-MM-DD HH:mm:ss'
     * @returns {string} 格式化后的日期字符串
     * @example
     * Utils.formatDate(new Date(), 'YYYY-MM-DD'); // '2025-10-22'
     * Utils.formatDate('2025-10-22', 'YYYY年MM月DD日'); // '2025年10月22日'
     */
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    /**
     * 格式化数字，添加千分位分隔符
     * @param {number|string} num - 要格式化的数字
     * @returns {string} 格式化后的数字字符串
     * @example
     * Utils.formatNumber(1234567); // '1,234,567'
     * Utils.formatNumber('1234567.89'); // '1,234,567.89'
     */
    formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * 防抖函数 - 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
     * 常用于搜索框输入、窗口resize等场景
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间（毫秒），默认300ms
     * @returns {Function} 防抖后的函数
     * @example
     * const debouncedSearch = Utils.debounce((keyword) => {
     *     console.log('搜索:', keyword);
     * }, 500);
     * input.addEventListener('input', (e) => debouncedSearch(e.target.value));
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 获取URL参数
     */
    getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    /**
     * 设置URL参数
     */
    setUrlParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },

    /**
     * 深拷贝
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * 生成唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// 存储管理
const Storage = {
    /**
     * 设置本地存储
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },

    /**
     * 获取本地存储
     */
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },

    /**
     * 删除本地存储
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    },

    /**
     * 清空本地存储
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
};

// ============================================================================
// 注意：UI 组件定义
// ============================================================================
// Toast、Modal、Loading、Confirm、Skeleton 等UI组件已移至 components.js
// 避免重复定义，如需使用这些组件，请确保引入 components.js

// ============================================================================
// 页面增强工具
// ============================================================================
// 以下是保留在 common.js 中的辅助增强功能，用于特定页面的功能增强

// 表格增强工具
const TableEnhancer = {
    /**
     * 初始化表格固定表头
     */
    initFixedHeader(tableContainer) {
        if (!tableContainer) return;
        
        // 添加固定表头类
        tableContainer.classList.add('table-fixed-header');
        
        // 监听滚动事件，添加阴影效果
        tableContainer.addEventListener('scroll', Utils.throttle(() => {
            const table = tableContainer.querySelector('table');
            const thead = table?.querySelector('thead');
            
            if (thead && tableContainer.scrollTop > 0) {
                thead.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            } else if (thead) {
                thead.style.boxShadow = 'none';
            }
        }, 100));
    },

    /**
     * 初始化所有表格容器
     */
    initAll() {
        const containers = document.querySelectorAll('.table-container');
        containers.forEach(container => {
            this.initFixedHeader(container);
        });
    }
};

// 侧边栏交互增强
const SidebarEnhancer = {
    /**
     * 初始化侧边栏
     */
    init() {
        const sidebar = document.querySelector('.side-navbar');
        const toggleBtn = document.querySelector('.sidebar-toggle-btn');
        const contentArea = document.querySelector('.content-area');
        
        if (!sidebar || !toggleBtn) return;
        
        // 从本地存储恢复侧边栏状态
        const isCollapsed = Storage.get('sidebar-collapsed', false);
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            if (contentArea) {
                contentArea.style.marginLeft = '0';
            }
        }
        
        // 切换侧边栏
        toggleBtn.addEventListener('click', () => {
            const collapsed = sidebar.classList.toggle('collapsed');
            Storage.set('sidebar-collapsed', collapsed);
            
            // 触发窗口resize事件，让图表重新渲染
            window.dispatchEvent(new Event('resize'));
        });
        
        // 初始化菜单折叠/展开
        this.initMenuToggle();
    },

    /**
     * 初始化菜单折叠/展开
     */
    initMenuToggle() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const link = item.querySelector('.menu-link');
            const submenu = item.querySelector('.submenu');
            const arrow = link?.querySelector('.menu-arrow');
            
            if (!submenu || !link) return;
            
            // 从本地存储恢复展开状态
            const menuId = link.getAttribute('data-menu-id');
            if (menuId) {
                const isExpanded = Storage.get(`menu-${menuId}-expanded`, false);
                if (isExpanded) {
                    item.classList.add('expanded');
                }
            }
            
            link.addEventListener('click', (e) => {
                // 如果点击的是有子菜单的项，阻止默认跳转
                if (submenu) {
                    e.preventDefault();
                    const expanded = item.classList.toggle('expanded');
                    
                    // 保存展开状态
                    if (menuId) {
                        Storage.set(`menu-${menuId}-expanded`, expanded);
                    }
                }
            });
        });
    },

    /**
     * 设置当前激活菜单
     */
    setActiveMenu(path) {
        const menuLinks = document.querySelectorAll('.menu-link');
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
                
                // 展开父菜单
                const parentItem = link.closest('.menu-item');
                if (parentItem) {
                    const parentMenu = parentItem.parentElement.closest('.menu-item');
                    if (parentMenu) {
                        parentMenu.classList.add('expanded');
                    }
                }
            } else {
                link.classList.remove('active');
            }
        });
    }
};

// 快捷键管理
const KeyboardShortcuts = {
    shortcuts: new Map(),

    /**
     * 注册快捷键
     */
    register(key, callback, description = '') {
        this.shortcuts.set(key, { callback, description });
    },

    /**
     * 初始化快捷键监听
     */
    init() {
        document.addEventListener('keydown', (e) => {
            // 检查 e.key 是否存在
            if (!e.key) return;
            
            // 构建快捷键字符串
            const keys = [];
            if (e.ctrlKey || e.metaKey) keys.push('ctrl');
            if (e.altKey) keys.push('alt');
            if (e.shiftKey) keys.push('shift');
            keys.push(e.key.toLowerCase());
            
            const shortcut = keys.join('+');
            
            // 查找并执行快捷键回调
            const handler = this.shortcuts.get(shortcut);
            if (handler) {
                e.preventDefault();
                handler.callback(e);
            }
        });

        // 注册默认快捷键
        this.registerDefaults();
    },

    /**
     * 注册默认快捷键
     */
    registerDefaults() {
        // Esc - 关闭模态框
        this.register('escape', () => {
            const overlay = document.querySelector('.modal-overlay');
            if (overlay) {
                overlay.click();
            }
        }, '关闭模态框');

        // Ctrl+S - 保存（需要在具体页面实现）
        this.register('ctrl+s', (e) => {
            // 触发自定义保存事件
            const saveEvent = new CustomEvent('app:save', { detail: { event: e } });
            document.dispatchEvent(saveEvent);
        }, '保存');

        // Ctrl+F - 聚焦搜索框
        this.register('ctrl+f', (e) => {
            const searchInput = document.querySelector('.navbar-search input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }, '聚焦搜索框');
    },

    /**
     * 显示快捷键帮助
     */
    showHelp() {
        const shortcuts = Array.from(this.shortcuts.entries())
            .map(([key, { description }]) => `<tr><td><code>${key}</code></td><td>${description}</td></tr>`)
            .join('');

        Modal.alert({
            title: '快捷键帮助',
            content: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid #E5E7EB;">
                            <th style="padding: 8px; text-align: left;">快捷键</th>
                            <th style="padding: 8px; text-align: left;">说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${shortcuts}
                    </tbody>
                </table>
            `
        });
    }
};

// 右键菜单
const ContextMenu = {
    currentMenu: null,

    /**
     * 显示右键菜单
     */
    show(e, items) {
        e.preventDefault();
        
        // 移除已存在的菜单
        this.hide();

        // 创建菜单
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;

        items.forEach(item => {
            if (item.divider) {
                const divider = document.createElement('div');
                divider.className = 'context-menu-divider';
                menu.appendChild(divider);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = `context-menu-item ${item.danger ? 'danger' : ''} ${item.disabled ? 'disabled' : ''}`;

                if (item.icon) {
                    menuItem.innerHTML = `
                        <i class="${item.icon}"></i>
                        <span>${item.label}</span>
                    `;
                } else {
                    menuItem.textContent = item.label;
                }

                if (!item.disabled) {
                    menuItem.addEventListener('click', () => {
                        if (item.onClick) item.onClick();
                        this.hide();
                    });
                }

                menu.appendChild(menuItem);
            }
        });

        document.body.appendChild(menu);
        this.currentMenu = menu;

        // 调整位置，确保不超出视口
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = `${window.innerWidth - rect.width - 10}px`;
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = `${window.innerHeight - rect.height - 10}px`;
        }

        // 点击其他地方关闭菜单
        setTimeout(() => {
            document.addEventListener('click', this.hide.bind(this), { once: true });
            document.addEventListener('contextmenu', this.hide.bind(this), { once: true });
        }, 0);
    },

    /**
     * 隐藏右键菜单
     */
    hide() {
        if (this.currentMenu) {
            this.currentMenu.remove();
            this.currentMenu = null;
        }
    },

    /**
     * 为表格行启用右键菜单
     * @param {string} tableSelector - 表格选择器
     * @param {Function} getMenuItems - 获取菜单项的函数，接收行数据作为参数
     */
    enableForTable(tableSelector, getMenuItems) {
        const table = document.querySelector(tableSelector);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        tbody.addEventListener('contextmenu', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;

            // 高亮当前行
            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach(r => r.classList.remove('context-menu-active'));
            row.classList.add('context-menu-active');

            // 获取行数据（可以从 data 属性或其他方式获取）
            const rowData = {
                element: row,
                index: Array.from(allRows).indexOf(row),
                // 可以添加更多数据
            };

            // 获取菜单项
            const items = getMenuItems(rowData);
            
            // 显示菜单
            this.show(e, items);
        });

        // 添加样式
        if (!document.getElementById('context-menu-table-style')) {
            const style = document.createElement('style');
            style.id = 'context-menu-table-style';
            style.textContent = `
                tr.context-menu-active {
                    background-color: rgba(30, 64, 175, 0.1) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} 已加载`);
    
    // 初始化表格增强
    TableEnhancer.initAll();
    
    // 初始化侧边栏
    SidebarEnhancer.init();
    
    // 初始化快捷键
    KeyboardShortcuts.init();
    
    // 设置当前页面的激活菜单
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    SidebarEnhancer.setActiveMenu(currentPath);
});

// ============================================================================
// 通知提示函数
// ============================================================================

/**
 * 显示通知消息
 * @param {string} type - 消息类型：'success', 'error', 'warning', 'info'
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长（毫秒），默认3000
 */
function showNotification(type, message, duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // 图标映射
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    // 添加样式（如果还没有）
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                min-width: 250px;
                max-width: 400px;
            }
            
            .notification i {
                font-size: 18px;
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-warning {
                background: #f59e0b;
                color: white;
            }
            
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}
