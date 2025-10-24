/**
 * 等保合规测评提醒服务
 * 提供测评周期配置、自动提醒、历史记录等功能
 */

class ComplianceAssessmentService {
    constructor() {
        this.storageKey = 'compliance_assessments';
        this.configKey = 'assessment_config';
        this.historyKey = 'assessment_history';
        this.remindersKey = 'assessment_reminders';
        this.initializeStorage();
        this.startReminderCheck();
    }

    /**
     * 初始化存储
     */
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.configKey)) {
            // 默认配置：等保三级每年测评一次
            const defaultConfig = {
                assessmentLevel: '等保三级',
                cycleMonths: 12, // 测评周期（月）
                advanceNoticeDays: 30, // 提前提醒天数
                reminderEnabled: true,
                notificationChannels: ['EMAIL', 'SMS', 'SYSTEM'],
                responsiblePerson: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(this.configKey, JSON.stringify(defaultConfig));
        }
        if (!localStorage.getItem(this.historyKey)) {
            localStorage.setItem(this.historyKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.remindersKey)) {
            localStorage.setItem(this.remindersKey, JSON.stringify([]));
        }
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'CA' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 配置测评周期
     */
    configureAssessmentCycle(config) {
        const currentConfig = this.getAssessmentConfig();
        const updatedConfig = {
            ...currentConfig,
            ...config,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.configKey, JSON.stringify(updatedConfig));
        
        // 配置更新后，重新计算提醒
        this.recalculateReminders();
        
        return updatedConfig;
    }

    /**
     * 获取测评配置
     */
    getAssessmentConfig() {
        return JSON.parse(localStorage.getItem(this.configKey));
    }

    /**
     * 创建测评任务
     */
    createAssessment(assessment) {
        const assessments = this.getAllAssessments();
        const newAssessment = {
            id: this.generateId(),
            assessmentType: assessment.assessmentType || '等保测评',
            assessmentLevel: assessment.assessmentLevel || '等保三级',
            scheduledDate: assessment.scheduledDate,
            actualDate: assessment.actualDate || null,
            status: assessment.status || 'SCHEDULED', // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
            assessmentOrg: assessment.assessmentOrg || '',
            responsiblePerson: assessment.responsiblePerson || '',
            description: assessment.description || '',
            result: assessment.result || null,
            issues: assessment.issues || [],
            documents: assessment.documents || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        assessments.push(newAssessment);
        localStorage.setItem(this.storageKey, JSON.stringify(assessments));
        
        // 创建测评任务后，生成提醒
        this.createReminder(newAssessment);
        
        return newAssessment;
    }

    /**
     * 获取所有测评任务
     */
    getAllAssessments() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    /**
     * 根据ID获取测评任务
     */
    getAssessmentById(id) {
        const assessments = this.getAllAssessments();
        return assessments.find(a => a.id === id);
    }

    /**
     * 更新测评任务
     */
    updateAssessment(id, updates) {
        const assessments = this.getAllAssessments();
        const index = assessments.findIndex(a => a.id === id);
        if (index === -1) {
            throw new Error('测评任务不存在');
        }
        
        const oldAssessment = assessments[index];
        assessments[index] = {
            ...oldAssessment,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(assessments));
        
        // 如果测评完成，记录到历史
        if (updates.status === 'COMPLETED' && oldAssessment.status !== 'COMPLETED') {
            this.recordAssessmentHistory(assessments[index]);
            // 根据周期自动创建下一次测评任务
            this.scheduleNextAssessment(assessments[index]);
        }
        
        return assessments[index];
    }

    /**
     * 删除测评任务
     */
    deleteAssessment(id) {
        const assessments = this.getAllAssessments();
        const filtered = assessments.filter(a => a.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        
        // 同时删除相关提醒
        this.deleteRemindersByAssessmentId(id);
    }

    /**
     * 记录测评历史
     */
    recordAssessmentHistory(assessment) {
        const history = this.getAssessmentHistory();
        const historyRecord = {
            id: this.generateId(),
            assessmentId: assessment.id,
            assessmentType: assessment.assessmentType,
            assessmentLevel: assessment.assessmentLevel,
            scheduledDate: assessment.scheduledDate,
            actualDate: assessment.actualDate,
            assessmentOrg: assessment.assessmentOrg,
            responsiblePerson: assessment.responsiblePerson,
            result: assessment.result,
            issueCount: assessment.issues ? assessment.issues.length : 0,
            issues: assessment.issues || [],
            documents: assessment.documents || [],
            recordedAt: new Date().toISOString()
        };
        history.push(historyRecord);
        localStorage.setItem(this.historyKey, JSON.stringify(history));
        return historyRecord;
    }

    /**
     * 获取测评历史
     */
    getAssessmentHistory(filter = {}) {
        let history = JSON.parse(localStorage.getItem(this.historyKey) || '[]');
        
        // 按时间倒序排列
        history.sort((a, b) => new Date(b.actualDate) - new Date(a.actualDate));
        
        // 应用过滤器
        if (filter.assessmentType) {
            history = history.filter(h => h.assessmentType === filter.assessmentType);
        }
        if (filter.startDate) {
            history = history.filter(h => new Date(h.actualDate) >= new Date(filter.startDate));
        }
        if (filter.endDate) {
            history = history.filter(h => new Date(h.actualDate) <= new Date(filter.endDate));
        }
        
        return history;
    }

    /**
     * 创建提醒
     */
    createReminder(assessment) {
        const config = this.getAssessmentConfig();
        if (!config.reminderEnabled) {
            return null;
        }
        
        const reminders = this.getAllReminders();
        const scheduledDate = new Date(assessment.scheduledDate);
        const reminderDate = new Date(scheduledDate);
        reminderDate.setDate(reminderDate.getDate() - config.advanceNoticeDays);
        
        const newReminder = {
            id: this.generateId(),
            assessmentId: assessment.id,
            reminderDate: reminderDate.toISOString(),
            scheduledDate: assessment.scheduledDate,
            assessmentType: assessment.assessmentType,
            status: 'PENDING', // PENDING, SENT, DISMISSED
            notificationChannels: config.notificationChannels,
            responsiblePerson: assessment.responsiblePerson || config.responsiblePerson,
            message: `测评任务提醒：${assessment.assessmentType}计划于${assessment.scheduledDate}进行，请提前准备相关材料。`,
            createdAt: new Date().toISOString()
        };
        
        reminders.push(newReminder);
        localStorage.setItem(this.remindersKey, JSON.stringify(reminders));
        return newReminder;
    }

    /**
     * 获取所有提醒
     */
    getAllReminders() {
        return JSON.parse(localStorage.getItem(this.remindersKey) || '[]');
    }

    /**
     * 获取待发送的提醒
     */
    getPendingReminders() {
        const reminders = this.getAllReminders();
        const now = new Date();
        return reminders.filter(r => 
            r.status === 'PENDING' && 
            new Date(r.reminderDate) <= now
        );
    }

    /**
     * 更新提醒状态
     */
    updateReminderStatus(id, status) {
        const reminders = this.getAllReminders();
        const index = reminders.findIndex(r => r.id === id);
        if (index !== -1) {
            reminders[index].status = status;
            reminders[index].sentAt = new Date().toISOString();
            localStorage.setItem(this.remindersKey, JSON.stringify(reminders));
        }
    }

    /**
     * 删除测评任务相关的提醒
     */
    deleteRemindersByAssessmentId(assessmentId) {
        const reminders = this.getAllReminders();
        const filtered = reminders.filter(r => r.assessmentId !== assessmentId);
        localStorage.setItem(this.remindersKey, JSON.stringify(filtered));
    }

    /**
     * 启动提醒检查（定时任务）
     */
    startReminderCheck() {
        // 每小时检查一次待发送的提醒
        setInterval(() => {
            this.checkAndSendReminders();
        }, 60 * 60 * 1000); // 1小时
        
        // 立即执行一次检查
        this.checkAndSendReminders();
    }

    /**
     * 检查并发送提醒
     */
    checkAndSendReminders() {
        const pendingReminders = this.getPendingReminders();
        
        pendingReminders.forEach(reminder => {
            this.sendReminder(reminder);
        });
    }

    /**
     * 发送提醒
     */
    sendReminder(reminder) {
        console.log('发送测评提醒:', reminder);
        
        // 模拟发送通知到各个渠道
        reminder.notificationChannels.forEach(channel => {
            switch(channel) {
                case 'EMAIL':
                    this.sendEmailNotification(reminder);
                    break;
                case 'SMS':
                    this.sendSMSNotification(reminder);
                    break;
                case 'SYSTEM':
                    this.sendSystemNotification(reminder);
                    break;
            }
        });
        
        // 更新提醒状态为已发送
        this.updateReminderStatus(reminder.id, 'SENT');
    }

    /**
     * 发送邮件通知
     */
    sendEmailNotification(reminder) {
        console.log(`[邮件通知] 发送给: ${reminder.responsiblePerson}`);
        console.log(`[邮件内容] ${reminder.message}`);
        // 实际实现中应调用邮件服务API
    }

    /**
     * 发送短信通知
     */
    sendSMSNotification(reminder) {
        console.log(`[短信通知] 发送给: ${reminder.responsiblePerson}`);
        console.log(`[短信内容] ${reminder.message}`);
        // 实际实现中应调用短信服务API
    }

    /**
     * 发送系统通知
     */
    sendSystemNotification(reminder) {
        console.log(`[系统通知] ${reminder.message}`);
        // 实际实现中应调用系统通知API
        // 可以在页面上显示通知弹窗
        if (typeof window !== 'undefined' && window.showNotification) {
            window.showNotification({
                type: 'warning',
                title: '测评任务提醒',
                message: reminder.message,
                duration: 0 // 不自动关闭
            });
        }
    }

    /**
     * 根据周期自动创建下一次测评任务
     */
    scheduleNextAssessment(completedAssessment) {
        const config = this.getAssessmentConfig();
        const nextDate = new Date(completedAssessment.actualDate || completedAssessment.scheduledDate);
        nextDate.setMonth(nextDate.getMonth() + config.cycleMonths);
        
        const nextAssessment = {
            assessmentType: completedAssessment.assessmentType,
            assessmentLevel: completedAssessment.assessmentLevel,
            scheduledDate: nextDate.toISOString().split('T')[0],
            assessmentOrg: completedAssessment.assessmentOrg,
            responsiblePerson: completedAssessment.responsiblePerson,
            description: `根据测评周期自动生成的下一次${completedAssessment.assessmentType}任务`
        };
        
        return this.createAssessment(nextAssessment);
    }

    /**
     * 重新计算所有提醒
     */
    recalculateReminders() {
        // 清除所有待发送的提醒
        const reminders = this.getAllReminders();
        const filtered = reminders.filter(r => r.status !== 'PENDING');
        localStorage.setItem(this.remindersKey, JSON.stringify(filtered));
        
        // 为所有未完成的测评任务重新创建提醒
        const assessments = this.getAllAssessments();
        assessments.forEach(assessment => {
            if (assessment.status === 'SCHEDULED' || assessment.status === 'IN_PROGRESS') {
                this.createReminder(assessment);
            }
        });
    }

    /**
     * 获取即将到期的测评任务
     */
    getUpcomingAssessments(days = 30) {
        const assessments = this.getAllAssessments();
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        
        return assessments.filter(a => {
            if (a.status !== 'SCHEDULED' && a.status !== 'IN_PROGRESS') {
                return false;
            }
            const scheduledDate = new Date(a.scheduledDate);
            return scheduledDate >= now && scheduledDate <= futureDate;
        }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    }

    /**
     * 获取逾期的测评任务
     */
    getOverdueAssessments() {
        const assessments = this.getAllAssessments();
        const now = new Date();
        
        return assessments.filter(a => {
            if (a.status === 'COMPLETED' || a.status === 'CANCELLED') {
                return false;
            }
            const scheduledDate = new Date(a.scheduledDate);
            return scheduledDate < now;
        }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    }

    /**
     * 获取测评统计信息
     */
    getAssessmentStatistics() {
        const assessments = this.getAllAssessments();
        const history = this.getAssessmentHistory();
        
        return {
            total: assessments.length,
            scheduled: assessments.filter(a => a.status === 'SCHEDULED').length,
            inProgress: assessments.filter(a => a.status === 'IN_PROGRESS').length,
            completed: assessments.filter(a => a.status === 'COMPLETED').length,
            cancelled: assessments.filter(a => a.status === 'CANCELLED').length,
            overdue: this.getOverdueAssessments().length,
            upcoming: this.getUpcomingAssessments(30).length,
            historyCount: history.length,
            lastAssessmentDate: history.length > 0 ? history[0].actualDate : null
        };
    }

    /**
     * 导出测评历史报告
     */
    exportAssessmentReport(startDate, endDate) {
        const history = this.getAssessmentHistory({
            startDate,
            endDate
        });
        
        const report = {
            reportTitle: '等保合规测评历史报告',
            reportDate: new Date().toISOString(),
            period: {
                startDate,
                endDate
            },
            summary: {
                totalAssessments: history.length,
                totalIssues: history.reduce((sum, h) => sum + h.issueCount, 0),
                averageIssuesPerAssessment: history.length > 0 
                    ? (history.reduce((sum, h) => sum + h.issueCount, 0) / history.length).toFixed(2)
                    : 0
            },
            assessments: history
        };
        
        return report;
    }
}

// 创建全局实例
window.complianceAssessmentService = new ComplianceAssessmentService();
