/**
 * 数据服务模块
 * 负责加载、筛选、排序、分页等数据操作
 */

class DataService {
    constructor() {
        this.data = null;
        this.loading = false;
    }

    /**
     * 加载模拟数据
     */
    async loadData() {
        if (this.data) {
            return this.data;
        }

        if (this.loading) {
            // 等待加载完成
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (!this.loading) {
                        clearInterval(checkInterval);
                        resolve(this.data);
                    }
                }, 100);
            });
        }

        this.loading = true;
        try {
            // 直接使用内嵌的模拟数据
            this.data = this.getMockData();
            return this.data;
        } catch (error) {
            console.error('Error loading mock data:', error);
            throw error;
        } finally {
            this.loading = false;
        }
    }

    /**
     * 获取内嵌的模拟数据
     */
    getMockData() {
        return window.MOCK_DATA || {};
    }

    /**
     * 获取用户列表
     */
    async getUsers(filters = {}) {
        const data = await this.loadData();
        let users = [...data.users];

        // 应用筛选
        if (filters.department) {
            users = users.filter(u => u.department === filters.department);
        }
        if (filters.role) {
            users = users.filter(u => u.role === filters.role);
        }
        if (filters.status) {
            users = users.filter(u => u.status === filters.status);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            users = users.filter(u => 
                u.name.toLowerCase().includes(search) ||
                u.username.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search)
            );
        }

        return users;
    }

    /**
     * 获取线索列表
     */
    async getClues(filters = {}, sort = {}, pagination = {}) {
        const data = await this.loadData();
        let clues = [...data.clues];

        // 应用筛选
        if (filters.source) {
            clues = clues.filter(c => c.source === filters.source);
        }
        if (filters.riskLevel) {
            clues = clues.filter(c => c.riskLevel === filters.riskLevel);
        }
        if (filters.status) {
            clues = clues.filter(c => c.status === filters.status);
        }
        if (filters.department) {
            clues = clues.filter(c => c.involvedDepartment === filters.department);
        }
        if (filters.dateRange) {
            const [start, end] = filters.dateRange;
            clues = clues.filter(c => {
                const createTime = new Date(c.createTime);
                return createTime >= new Date(start) && createTime <= new Date(end);
            });
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            clues = clues.filter(c => 
                c.title.toLowerCase().includes(search) ||
                c.description.toLowerCase().includes(search) ||
                c.involvedPerson.toLowerCase().includes(search)
            );
        }

        // 应用排序
        if (sort.field) {
            clues.sort((a, b) => {
                const aVal = a[sort.field];
                const bVal = b[sort.field];
                const order = sort.order === 'desc' ? -1 : 1;
                
                if (typeof aVal === 'string') {
                    return aVal.localeCompare(bVal) * order;
                }
                return (aVal - bVal) * order;
            });
        }

        // 应用分页
        const total = clues.length;
        if (pagination.page && pagination.pageSize) {
            const start = (pagination.page - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            clues = clues.slice(start, end);
        }

        return { data: clues, total };
    }

    /**
     * 获取单个线索详情
     */
    async getClueById(id) {
        const data = await this.loadData();
        return data.clues.find(c => c.id === id);
    }

    /**
     * 获取预警列表
     */
    async getAlerts(filters = {}, sort = {}, pagination = {}) {
        const data = await this.loadData();
        let alerts = [...data.alerts];

        // 应用筛选
        if (filters.type) {
            alerts = alerts.filter(a => a.type === filters.type);
        }
        if (filters.riskLevel) {
            alerts = alerts.filter(a => a.riskLevel === filters.riskLevel);
        }
        if (filters.status) {
            alerts = alerts.filter(a => a.status === filters.status);
        }
        if (filters.department) {
            alerts = alerts.filter(a => a.involvedDepartment === filters.department);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            alerts = alerts.filter(a => 
                a.title.toLowerCase().includes(search) ||
                a.description.toLowerCase().includes(search)
            );
        }

        // 应用排序
        if (sort.field) {
            alerts.sort((a, b) => {
                const aVal = a[sort.field];
                const bVal = b[sort.field];
                const order = sort.order === 'desc' ? -1 : 1;
                
                if (typeof aVal === 'string') {
                    return aVal.localeCompare(bVal) * order;
                }
                return (aVal - bVal) * order;
            });
        }

        // 应用分页
        const total = alerts.length;
        if (pagination.page && pagination.pageSize) {
            const start = (pagination.page - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            alerts = alerts.slice(start, end);
        }

        return { data: alerts, total };
    }

    /**
     * 获取工单列表
     */
    async getWorkOrders(filters = {}, sort = {}, pagination = {}) {
        const data = await this.loadData();
        let workOrders = [...data.workOrders];

        // 应用筛选
        if (filters.type) {
            workOrders = workOrders.filter(w => w.type === filters.type);
        }
        if (filters.priority) {
            workOrders = workOrders.filter(w => w.priority === filters.priority);
        }
        if (filters.status) {
            workOrders = workOrders.filter(w => w.status === filters.status);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            workOrders = workOrders.filter(w => 
                w.title.toLowerCase().includes(search) ||
                w.description.toLowerCase().includes(search)
            );
        }

        // 应用排序
        if (sort.field) {
            workOrders.sort((a, b) => {
                const aVal = a[sort.field];
                const bVal = b[sort.field];
                const order = sort.order === 'desc' ? -1 : 1;
                
                if (typeof aVal === 'string') {
                    return aVal.localeCompare(bVal) * order;
                }
                return (aVal - bVal) * order;
            });
        }

        // 应用分页
        const total = workOrders.length;
        if (pagination.page && pagination.pageSize) {
            const start = (pagination.page - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            workOrders = workOrders.slice(start, end);
        }

        return { data: workOrders, total };
    }

    /**
     * 获取工单详情
     */
    async getWorkOrderById(id) {
        const data = await this.loadData();
        return data.workOrders.find(w => w.id === id);
    }

    /**
     * 获取整改任务列表
     */
    async getRectifications(filters = {}, sort = {}, pagination = {}) {
        const data = await this.loadData();
        let rectifications = [...data.rectifications];

        // 应用筛选
        if (filters.status) {
            rectifications = rectifications.filter(r => r.status === filters.status);
        }
        if (filters.priority) {
            rectifications = rectifications.filter(r => r.priority === filters.priority);
        }
        if (filters.department) {
            rectifications = rectifications.filter(r => r.responsibleDepartment === filters.department);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            rectifications = rectifications.filter(r => 
                r.title.toLowerCase().includes(search) ||
                r.description.toLowerCase().includes(search)
            );
        }

        // 应用排序
        if (sort.field) {
            rectifications.sort((a, b) => {
                const aVal = a[sort.field];
                const bVal = b[sort.field];
                const order = sort.order === 'desc' ? -1 : 1;
                
                if (typeof aVal === 'string') {
                    return aVal.localeCompare(bVal) * order;
                }
                return (aVal - bVal) * order;
            });
        }

        // 应用分页
        const total = rectifications.length;
        if (pagination.page && pagination.pageSize) {
            const start = (pagination.page - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            rectifications = rectifications.slice(start, end);
        }

        return { data: rectifications, total };
    }

    /**
     * 获取整改任务详情
     */
    async getRectificationById(id) {
        const data = await this.loadData();
        return data.rectifications.find(r => r.id === id);
    }

    /**
     * 获取工作台统计数据
     */
    async getDashboardStats() {
        const data = await this.loadData();
        return data.dashboardStats;
    }

    /**
     * 获取待办事项
     */
    async getTodos(filters = {}) {
        const data = await this.loadData();
        let todos = [...data.todos];

        if (filters.type) {
            todos = todos.filter(t => t.type === filters.type);
        }
        if (filters.priority) {
            todos = todos.filter(t => t.priority === filters.priority);
        }
        if (filters.status) {
            todos = todos.filter(t => t.status === filters.status);
        }

        return todos;
    }

    /**
     * 获取最近动态
     */
    async getRecentActivities(limit = 10) {
        const data = await this.loadData();
        return data.recentActivities.slice(0, limit);
    }

    /**
     * 获取指挥中心统计数据
     */
    async getCommandCenterStats() {
        const data = await this.loadData();
        return {
            stats: data.commandCenterStats,
            alertTrend: data.alertTrend,
            departmentRisk: data.departmentRisk,
            problemCategories: data.problemCategories,
            rectificationProgress: data.rectificationProgress,
            realtimeAlerts: data.realtimeAlerts
        };
    }

    /**
     * 获取纪检监督数据
     */
    async getDisciplineSupervision() {
        const data = await this.loadData();
        return data.disciplineSupervision;
    }

    /**
     * 获取审计监督数据
     */
    async getAuditSupervision() {
        const data = await this.loadData();
        return data.auditSupervision;
    }

    /**
     * 获取部门列表
     */
    async getDepartments(filters = {}) {
        const data = await this.loadData();
        let departments = [...data.departments];

        if (filters.type) {
            departments = departments.filter(d => d.type === filters.type);
        }

        return departments;
    }

    /**
     * 获取角色列表
     */
    async getRoles() {
        const data = await this.loadData();
        return data.roles;
    }

    /**
     * 获取数据源列表
     */
    async getDataSources(filters = {}) {
        const data = await this.loadData();
        let dataSources = [...data.dataSources];

        if (filters.status) {
            dataSources = dataSources.filter(ds => ds.status === filters.status);
        }

        return dataSources;
    }

    /**
     * 获取规则列表
     */
    async getRules(filters = {}) {
        const data = await this.loadData();
        let rules = [...data.rules];

        if (filters.type) {
            rules = rules.filter(r => r.type === filters.type);
        }
        if (filters.status) {
            rules = rules.filter(r => r.status === filters.status);
        }

        return rules;
    }

    /**
     * 获取审计日志
     */
    async getAuditLogs(filters = {}, pagination = {}) {
        const data = await this.loadData();
        let logs = [...data.auditLogs];

        if (filters.user) {
            logs = logs.filter(l => l.user === filters.user);
        }
        if (filters.action) {
            logs = logs.filter(l => l.action === filters.action);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            logs = logs.filter(l => 
                l.user.toLowerCase().includes(search) ||
                l.action.toLowerCase().includes(search) ||
                l.target.toLowerCase().includes(search)
            );
        }

        // 应用分页
        const total = logs.length;
        if (pagination.page && pagination.pageSize) {
            const start = (pagination.page - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            logs = logs.slice(start, end);
        }

        return { data: logs, total };
    }

    /**
     * 获取报表列表
     */
    async getReports(filters = {}) {
        const data = await this.loadData();
        let reports = [...data.reports];

        if (filters.type) {
            reports = reports.filter(r => r.type === filters.type);
        }
        if (filters.category) {
            reports = reports.filter(r => r.category === filters.category);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            reports = reports.filter(r => 
                r.name.toLowerCase().includes(search)
            );
        }

        return reports;
    }

    /**
     * 刷新数据（重新加载）
     */
    async refreshData() {
        this.data = null;
        return await this.loadData();
    }
}

// 创建全局实例
window.dataService = new DataService();
