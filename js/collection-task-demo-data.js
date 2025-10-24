/**
 * 采集任务管理 - 演示数据
 * Collection Task Management - Demo Data
 */

(function() {
    'use strict';

    /**
     * 初始化演示数据
     */
    function initDemoData() {
        // 检查是否已有数据
        const existingTasks = localStorage.getItem('collection_tasks');
        if (existingTasks && JSON.parse(existingTasks).length > 0) {
            console.log('[采集任务] 已存在数据，跳过初始化演示数据');
            return;
        }

        console.log('[采集任务] 初始化演示数据...');

        // 演示采集任务数据
        const demoTasks = [
            {
                id: 'task_001',
                dataSourceId: 'ds_001', // 财务系统API
                taskName: '财务报销数据采集',
                taskType: 'INCREMENTAL',
                schedule: '0 */30 * * * *', // 每30分钟执行一次
                query: '/api/finance/reimbursement',
                incrementalField: 'updated_at',
                lastValue: '2025-10-22 10:00:00',
                status: 'RUNNING',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-23 09:30:00',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: '2025-10-23 10:00:00',
                totalExecutions: 156,
                successExecutions: 154,
                failedExecutions: 2,
                totalRecords: 45678,
                createdAt: '2025-09-01 08:00:00',
                updatedAt: '2025-10-23 09:30:00'
            },
            {
                id: 'task_002',
                dataSourceId: 'ds_002', // 人事系统数据库
                taskName: '教职工信息全量同步',
                taskType: 'FULL',
                schedule: '0 0 2 * * *', // 每天凌晨2点执行
                query: 'SELECT * FROM employees WHERE status = "ACTIVE"',
                incrementalField: null,
                lastValue: null,
                status: 'STOPPED',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-23 02:00:00',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: '2025-10-24 02:00:00',
                totalExecutions: 52,
                successExecutions: 52,
                failedExecutions: 0,
                totalRecords: 3456,
                createdAt: '2025-08-15 10:00:00',
                updatedAt: '2025-10-23 02:00:00'
            },
            {
                id: 'task_003',
                dataSourceId: 'ds_003', // 学生系统CDC
                taskName: '学生信息实时同步',
                taskType: 'CDC',
                schedule: null, // CDC是实时的，不需要调度
                query: null,
                incrementalField: null,
                lastValue: null,
                status: 'RUNNING',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-23 09:45:23',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: null,
                totalExecutions: 8934,
                successExecutions: 8920,
                failedExecutions: 14,
                totalRecords: 125678,
                createdAt: '2025-09-10 14:00:00',
                updatedAt: '2025-10-23 09:45:23'
            },
            {
                id: 'task_004',
                dataSourceId: 'ds_004', // 科研系统API
                taskName: '科研项目数据采集',
                taskType: 'INCREMENTAL',
                schedule: '0 0 */6 * * *', // 每6小时执行一次
                query: '/api/research/projects',
                incrementalField: 'modified_date',
                lastValue: '2025-10-23 06:00:00',
                status: 'RUNNING',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-23 06:00:00',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: '2025-10-23 12:00:00',
                totalExecutions: 124,
                successExecutions: 122,
                failedExecutions: 2,
                totalRecords: 2345,
                createdAt: '2025-09-05 09:00:00',
                updatedAt: '2025-10-23 06:00:00'
            },
            {
                id: 'task_005',
                dataSourceId: 'ds_005', // 资产系统数据库
                taskName: '固定资产数据采集',
                taskType: 'FULL',
                schedule: '0 0 3 * * 0', // 每周日凌晨3点执行
                query: 'SELECT * FROM assets WHERE status != "DISPOSED"',
                incrementalField: null,
                lastValue: null,
                status: 'STOPPED',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-22 03:00:00',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: '2025-10-29 03:00:00',
                totalExecutions: 8,
                successExecutions: 8,
                failedExecutions: 0,
                totalRecords: 15678,
                createdAt: '2025-08-20 11:00:00',
                updatedAt: '2025-10-22 03:00:00'
            },
            {
                id: 'task_006',
                dataSourceId: 'ds_006', // 采购系统API
                taskName: '采购订单增量采集',
                taskType: 'INCREMENTAL',
                schedule: '0 */15 * * * *', // 每15分钟执行一次
                query: '/api/procurement/orders',
                incrementalField: 'order_date',
                lastValue: '2025-10-23 09:30:00',
                status: 'ERROR',
                enabled: true,
                retryCount: 2,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-23 09:45:00',
                lastExecutionStatus: 'FAILED',
                nextExecutionTime: '2025-10-23 10:00:00',
                errorMessage: '连接超时：无法连接到采购系统API',
                totalExecutions: 2456,
                successExecutions: 2440,
                failedExecutions: 16,
                totalRecords: 34567,
                createdAt: '2025-09-01 10:00:00',
                updatedAt: '2025-10-23 09:45:00'
            },
            {
                id: 'task_007',
                dataSourceId: 'ds_007', // 图书馆系统
                taskName: '图书借阅记录采集',
                taskType: 'INCREMENTAL',
                schedule: '0 0 */4 * * *', // 每4小时执行一次
                query: 'SELECT * FROM borrow_records WHERE borrow_date > ?',
                incrementalField: 'borrow_date',
                lastValue: '2025-10-23 04:00:00',
                status: 'RUNNING',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-23 08:00:00',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: '2025-10-23 12:00:00',
                totalExecutions: 186,
                successExecutions: 185,
                failedExecutions: 1,
                totalRecords: 89234,
                createdAt: '2025-09-03 13:00:00',
                updatedAt: '2025-10-23 08:00:00'
            },
            {
                id: 'task_008',
                dataSourceId: 'ds_008', // 教务系统
                taskName: '课程成绩数据采集',
                taskType: 'INCREMENTAL',
                schedule: '0 0 1 * * *', // 每天凌晨1点执行
                query: '/api/academic/grades',
                incrementalField: 'grade_date',
                lastValue: '2025-10-23 01:00:00',
                status: 'STOPPED',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-23 01:00:00',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: '2025-10-24 01:00:00',
                totalExecutions: 53,
                successExecutions: 53,
                failedExecutions: 0,
                totalRecords: 234567,
                createdAt: '2025-08-25 09:00:00',
                updatedAt: '2025-10-23 01:00:00'
            },
            {
                id: 'task_009',
                dataSourceId: 'ds_009', // 后勤系统
                taskName: '水电费用数据采集',
                taskType: 'FULL',
                schedule: '0 0 4 1 * *', // 每月1号凌晨4点执行
                query: 'SELECT * FROM utility_bills WHERE bill_month = CURRENT_MONTH',
                incrementalField: null,
                lastValue: null,
                status: 'STOPPED',
                enabled: true,
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-01 04:00:00',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: '2025-11-01 04:00:00',
                totalExecutions: 3,
                successExecutions: 3,
                failedExecutions: 0,
                totalRecords: 4567,
                createdAt: '2025-08-01 10:00:00',
                updatedAt: '2025-10-01 04:00:00'
            },
            {
                id: 'task_010',
                dataSourceId: 'ds_010', // 会议系统
                taskName: '会议纪要文档采集',
                taskType: 'INCREMENTAL',
                schedule: '0 0 */12 * * *', // 每12小时执行一次
                query: '/api/meetings/minutes',
                incrementalField: 'meeting_date',
                lastValue: '2025-10-22 20:00:00',
                status: 'STOPPED',
                enabled: false, // 已禁用
                retryCount: 0,
                maxRetries: 3,
                retryInterval: 300000,
                lastExecutionTime: '2025-10-22 20:00:00',
                lastExecutionStatus: 'SUCCESS',
                nextExecutionTime: null,
                totalExecutions: 62,
                successExecutions: 60,
                failedExecutions: 2,
                totalRecords: 1234,
                createdAt: '2025-09-08 15:00:00',
                updatedAt: '2025-10-22 20:00:00'
            }
        ];

        // 演示执行历史数据
        const demoExecutions = [];
        const now = new Date();
        
        // 为每个任务生成最近的执行历史
        demoTasks.forEach(task => {
            const executionCount = Math.min(task.totalExecutions || 0, 20); // 最多显示20条
            
            for (let i = 0; i < executionCount; i++) {
                const executionTime = new Date(now.getTime() - (i * 3600000)); // 每小时一条
                const isSuccess = Math.random() > 0.05; // 95%成功率
                const recordCount = Math.floor(Math.random() * 1000) + 100;
                
                demoExecutions.push({
                    id: `exec_${task.id}_${i}`,
                    taskId: task.id,
                    taskName: task.taskName,
                    startTime: executionTime.toISOString(),
                    endTime: new Date(executionTime.getTime() + 60000).toISOString(), // 1分钟后结束
                    status: isSuccess ? 'SUCCESS' : 'FAILED',
                    recordCount: isSuccess ? recordCount : 0,
                    errorMessage: isSuccess ? null : '数据源连接超时',
                    duration: isSuccess ? Math.floor(Math.random() * 50000) + 10000 : 5000, // 10-60秒
                    retryCount: isSuccess ? 0 : Math.floor(Math.random() * 3)
                });
            }
        });

        // 保存到 localStorage
        try {
            localStorage.setItem('collection_tasks', JSON.stringify(demoTasks));
            localStorage.setItem('task_executions', JSON.stringify(demoExecutions));
            console.log(`[采集任务] 成功初始化 ${demoTasks.length} 个演示任务`);
            console.log(`[采集任务] 成功初始化 ${demoExecutions.length} 条执行历史`);
        } catch (error) {
            console.error('[采集任务] 初始化演示数据失败:', error);
        }
    }

    /**
     * 清除演示数据
     */
    function clearDemoData() {
        localStorage.removeItem('collection_tasks');
        localStorage.removeItem('task_executions');
        console.log('[采集任务] 已清除演示数据');
    }

    /**
     * 重置演示数据
     */
    function resetDemoData() {
        clearDemoData();
        initDemoData();
        console.log('[采集任务] 已重置演示数据');
    }

    // 页面加载时自动初始化演示数据
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDemoData);
    } else {
        initDemoData();
    }

    // 暴露到全局，方便调试
    window.collectionTaskDemoData = {
        init: initDemoData,
        clear: clearDemoData,
        reset: resetDemoData
    };

})();
