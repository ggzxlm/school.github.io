/**
 * 系统集成测试脚本
 * 
 * 测试数据采集与治理、数据分析与预警模块的集成情况
 * 
 * @author 开发团队
 * @version 1.0.0
 * @date 2025-10-23
 */

const IntegrationTest = {
    testResults: {
        auth: [],
        navigation: [],
        eventBus: [],
        api: []
    },
    
    logs: [],
    
    /**
     * 记录日志
     */
    log(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            level,
            message
        };
        
        this.logs.push(logEntry);
        
        const logContainer = document.getElementById('testLog');
        if (logContainer) {
            const logHtml = `
                <div class="log-entry">
                    <span class="log-time">[${timestamp}]</span>
                    <span class="log-level-${level}">[${level.toUpperCase()}]</span>
                    ${message}
                </div>
            `;
            logContainer.innerHTML += logHtml;
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        
        console.log(`[${level.toUpperCase()}] ${message}`);
    },
    
    /**
     * 运行测试项
     */
    async runTest(name, testFn, category) {
        this.log(`开始测试: ${name}`, 'info');
        
        try {
            const result = await testFn();
            const testResult = {
                name,
                status: result ? 'success' : 'error',
                message: result ? '测试通过' : '测试失败'
            };
            
            this.testResults[category].push(testResult);
            this.log(`测试完成: ${name} - ${testResult.message}`, result ? 'success' : 'error');
            
            return testResult;
        } catch (error) {
            const testResult = {
                name,
                status: 'error',
                message: error.message
            };
            
            this.testResults[category].push(testResult);
            this.log(`测试异常: ${name} - ${error.message}`, 'error');
            
            return testResult;
        }
    },
    
    /**
     * 渲染测试结果
     */
    renderTestResults(containerId, results) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let html = '';
        results.forEach(result => {
            const statusClass = result.status === 'success' ? 'status-success' : 'status-error';
            const statusIcon = result.status === 'success' ? 'fa-check' : 'fa-times';
            
            html += `
                <div class="test-item">
                    <span class="test-label">${result.name}</span>
                    <div class="test-status">
                        <span>${result.message}</span>
                        <div class="status-icon ${statusClass}">
                            <i class="fas ${statusIcon}"></i>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },
    
    /**
     * 更新统计数据
     */
    updateStats() {
        const allResults = [
            ...this.testResults.auth,
            ...this.testResults.navigation,
            ...this.testResults.eventBus,
            ...this.testResults.api
        ];
        
        const totalTests = allResults.length;
        const passedTests = allResults.filter(r => r.status === 'success').length;
        const failedTests = allResults.filter(r => r.status === 'error').length;
        const progress = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        
        document.getElementById('totalModules').textContent = '18';
        document.getElementById('passedTests').textContent = passedTests;
        document.getElementById('failedTests').textContent = failedTests;
        document.getElementById('integrationProgress').textContent = `${progress}%`;
    }
};

/**
 * 运行用户认证测试
 */
async function runAuthTests() {
    IntegrationTest.log('========== 开始用户认证测试 ==========', 'info');
    IntegrationTest.testResults.auth = [];
    
    // 测试1: 检查IntegrationService是否加载
    await IntegrationTest.runTest(
        '集成服务加载',
        () => typeof IntegrationService !== 'undefined',
        'auth'
    );
    
    // 测试2: 获取当前用户
    await IntegrationTest.runTest(
        '获取当前用户信息',
        () => {
            const user = IntegrationService.getCurrentUser();
            return user && user.username && user.role;
        },
        'auth'
    );
    
    // 测试3: 权限检查
    await IntegrationTest.runTest(
        '权限检查功能',
        () => {
            const hasPermission = IntegrationService.hasPermission('dashboard:view');
            return typeof hasPermission === 'boolean';
        },
        'auth'
    );
    
    // 测试4: 用户信息存储
    await IntegrationTest.runTest(
        '用户信息本地存储',
        () => {
            const user = Storage.get('current-user');
            return user !== null;
        },
        'auth'
    );
    
    IntegrationTest.renderTestResults('authTests', IntegrationTest.testResults.auth);
    IntegrationTest.updateStats();
    IntegrationTest.log('========== 用户认证测试完成 ==========', 'success');
}

/**
 * 运行导航菜单测试
 */
async function runNavigationTests() {
    IntegrationTest.log('========== 开始导航菜单测试 ==========', 'info');
    IntegrationTest.testResults.navigation = [];
    
    // 测试1: 侧边栏渲染
    await IntegrationTest.runTest(
        '侧边栏组件渲染',
        () => {
            const sidebar = document.querySelector('.side-navbar');
            return sidebar !== null;
        },
        'navigation'
    );
    
    // 测试2: 数据治理菜单
    await IntegrationTest.runTest(
        '数据治理菜单项',
        () => {
            const menuItem = document.querySelector('[data-id="data-governance"]');
            return menuItem !== null;
        },
        'navigation'
    );
    
    // 测试3: 数据分析菜单
    await IntegrationTest.runTest(
        '数据分析与预警菜单项',
        () => {
            const menuItem = document.querySelector('[data-id="data-analysis"]');
            return menuItem !== null;
        },
        'navigation'
    );
    
    // 测试4: 子菜单项
    await IntegrationTest.runTest(
        '数据源管理子菜单',
        () => {
            const menuItem = document.querySelector('[data-id="datasource-mgmt"]');
            return menuItem !== null;
        },
        'navigation'
    );
    
    // 测试5: 规则配置子菜单
    await IntegrationTest.runTest(
        '规则配置子菜单',
        () => {
            const menuItem = document.querySelector('[data-id="rule-config"]');
            return menuItem !== null;
        },
        'navigation'
    );
    
    // 测试6: 菜单展开功能
    await IntegrationTest.runTest(
        '菜单展开/折叠功能',
        () => {
            const menuItem = document.querySelector('.menu-item');
            return menuItem && menuItem.classList !== undefined;
        },
        'navigation'
    );
    
    IntegrationTest.renderTestResults('navigationTests', IntegrationTest.testResults.navigation);
    IntegrationTest.updateStats();
    IntegrationTest.log('========== 导航菜单测试完成 ==========', 'success');
}

/**
 * 运行事件总线测试
 */
async function runEventBusTests() {
    IntegrationTest.log('========== 开始事件总线测试 ==========', 'info');
    IntegrationTest.testResults.eventBus = [];
    
    // 测试1: EventBus存在性
    await IntegrationTest.runTest(
        '事件总线初始化',
        () => typeof EventBus !== 'undefined',
        'eventBus'
    );
    
    // 测试2: 事件注册
    await IntegrationTest.runTest(
        '事件注册功能',
        () => {
            let eventFired = false;
            EventBus.on('test:event', () => {
                eventFired = true;
            });
            EventBus.emit('test:event');
            return eventFired;
        },
        'eventBus'
    );
    
    // 测试3: 数据源事件
    await IntegrationTest.runTest(
        '数据源状态变更事件',
        () => {
            let received = false;
            const handler = () => { received = true; };
            EventBus.on('datasource:status-changed', handler);
            EventBus.emit('datasource:status-changed', { name: 'test' });
            EventBus.off('datasource:status-changed', handler);
            return received;
        },
        'eventBus'
    );
    
    // 测试4: 采集任务事件
    await IntegrationTest.runTest(
        '采集任务完成事件',
        () => {
            let received = false;
            const handler = () => { received = true; };
            EventBus.on('collection:task-completed', handler);
            EventBus.emit('collection:task-completed', { taskName: 'test' });
            EventBus.off('collection:task-completed', handler);
            return received;
        },
        'eventBus'
    );
    
    // 测试5: 预警生成事件
    await IntegrationTest.runTest(
        '预警生成事件',
        () => {
            let received = false;
            const handler = () => { received = true; };
            EventBus.on('alert:generated', handler);
            EventBus.emit('alert:generated', { title: 'test' });
            EventBus.off('alert:generated', handler);
            return received;
        },
        'eventBus'
    );
    
    IntegrationTest.renderTestResults('eventBusTests', IntegrationTest.testResults.eventBus);
    IntegrationTest.updateStats();
    IntegrationTest.log('========== 事件总线测试完成 ==========', 'success');
}

/**
 * 运行API集成测试
 */
async function runApiTests() {
    IntegrationTest.log('========== 开始API集成测试 ==========', 'info');
    IntegrationTest.testResults.api = [];
    
    // 测试1: request方法存在
    await IntegrationTest.runTest(
        'API请求方法',
        () => typeof IntegrationService.request === 'function',
        'api'
    );
    
    // 测试2: 错误处理
    await IntegrationTest.runTest(
        '错误处理功能',
        () => typeof IntegrationService.handleError === 'function',
        'api'
    );
    
    // 测试3: 导出功能
    await IntegrationTest.runTest(
        '数据导出功能',
        () => typeof IntegrationService.exportData === 'function',
        'api'
    );
    
    // 测试4: URL参数解析
    await IntegrationTest.runTest(
        'URL参数解析',
        () => {
            const params = IntegrationService.getUrlParams();
            return typeof params === 'object';
        },
        'api'
    );
    
    // 测试5: 日期格式化
    await IntegrationTest.runTest(
        '日期格式化功能',
        () => {
            const formatted = IntegrationService.formatDateTime(new Date());
            return typeof formatted === 'string' && formatted.length > 0;
        },
        'api'
    );
    
    // 测试6: 数字格式化
    await IntegrationTest.runTest(
        '数字格式化功能',
        () => {
            const formatted = IntegrationService.formatNumber(1234567);
            return formatted === '1,234,567';
        },
        'api'
    );
    
    IntegrationTest.renderTestResults('apiTests', IntegrationTest.testResults.api);
    IntegrationTest.updateStats();
    IntegrationTest.log('========== API集成测试完成 ==========', 'success');
}

/**
 * 测试事件发送
 */
function testEventEmit() {
    IntegrationTest.log('发送测试事件...', 'info');
    
    // 发送各种测试事件
    EventBus.emit('datasource:status-changed', {
        name: '财务系统数据源',
        status: 'ACTIVE'
    });
    
    setTimeout(() => {
        EventBus.emit('collection:task-completed', {
            taskName: '财务数据采集',
            recordCount: 1250
        });
    }, 1000);
    
    setTimeout(() => {
        EventBus.emit('quality:check-completed', {
            tableName: 'ods_finance',
            score: 85
        });
    }, 2000);
    
    setTimeout(() => {
        EventBus.emit('alert:generated', {
            title: '预算超支预警',
            level: 'HIGH'
        });
    }, 3000);
    
    Toast.info('已发送4个测试事件，请查看效果');
}

/**
 * 运行所有测试
 */
async function runAllTests() {
    IntegrationTest.log('========================================', 'info');
    IntegrationTest.log('开始运行所有集成测试', 'info');
    IntegrationTest.log('========================================', 'info');
    
    Loading.show('正在运行测试...');
    
    try {
        await runAuthTests();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await runNavigationTests();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await runEventBusTests();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await runApiTests();
        
        Loading.hide();
        
        IntegrationTest.log('========================================', 'success');
        IntegrationTest.log('所有测试运行完成', 'success');
        IntegrationTest.log('========================================', 'success');
        
        Toast.success('所有测试运行完成');
    } catch (error) {
        Loading.hide();
        IntegrationTest.log(`测试运行失败: ${error.message}`, 'error');
        Toast.error('测试运行失败');
    }
}

/**
 * 生成测试报告
 */
function generateReport() {
    const allResults = [
        ...IntegrationTest.testResults.auth,
        ...IntegrationTest.testResults.navigation,
        ...IntegrationTest.testResults.eventBus,
        ...IntegrationTest.testResults.api
    ];
    
    const totalTests = allResults.length;
    const passedTests = allResults.filter(r => r.status === 'success').length;
    const failedTests = allResults.filter(r => r.status === 'error').length;
    const progress = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalModules: 18,
            totalTests,
            passedTests,
            failedTests,
            progress: `${progress}%`
        },
        results: {
            auth: IntegrationTest.testResults.auth,
            navigation: IntegrationTest.testResults.navigation,
            eventBus: IntegrationTest.testResults.eventBus,
            api: IntegrationTest.testResults.api
        },
        logs: IntegrationTest.logs
    };
    
    // 生成HTML报告
    const reportHtml = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>系统集成测试报告</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #1E40AF; }
                h2 { color: #374151; margin-top: 30px; }
                .summary { background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .summary-item { display: inline-block; margin-right: 30px; }
                .summary-label { font-weight: bold; }
                .test-section { margin: 20px 0; }
                .test-item { padding: 10px; border-bottom: 1px solid #E5E7EB; }
                .status-success { color: #10B981; }
                .status-error { color: #EF4444; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB; }
                th { background-color: #F3F4F6; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>系统集成测试报告</h1>
            <p>生成时间: ${new Date().toLocaleString()}</p>
            
            <div class="summary">
                <h2>测试概要</h2>
                <div class="summary-item">
                    <span class="summary-label">集成模块:</span> ${report.summary.totalModules}
                </div>
                <div class="summary-item">
                    <span class="summary-label">测试总数:</span> ${report.summary.totalTests}
                </div>
                <div class="summary-item">
                    <span class="summary-label">通过:</span> <span class="status-success">${report.summary.passedTests}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">失败:</span> <span class="status-error">${report.summary.failedTests}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">完成度:</span> ${report.summary.progress}
                </div>
            </div>
            
            <h2>测试详情</h2>
            
            <h3>用户认证与权限控制</h3>
            <table>
                <tr><th>测试项</th><th>状态</th><th>说明</th></tr>
                ${report.results.auth.map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td class="status-${r.status}">${r.status === 'success' ? '✓ 通过' : '✗ 失败'}</td>
                        <td>${r.message}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h3>导航菜单集成</h3>
            <table>
                <tr><th>测试项</th><th>状态</th><th>说明</th></tr>
                ${report.results.navigation.map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td class="status-${r.status}">${r.status === 'success' ? '✓ 通过' : '✗ 失败'}</td>
                        <td>${r.message}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h3>事件总线通信</h3>
            <table>
                <tr><th>测试项</th><th>状态</th><th>说明</th></tr>
                ${report.results.eventBus.map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td class="status-${r.status}">${r.status === 'success' ? '✓ 通过' : '✗ 失败'}</td>
                        <td>${r.message}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h3>API接口集成</h3>
            <table>
                <tr><th>测试项</th><th>状态</th><th>说明</th></tr>
                ${report.results.api.map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td class="status-${r.status}">${r.status === 'success' ? '✓ 通过' : '✗ 失败'}</td>
                        <td>${r.message}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `;
    
    // 下载HTML报告
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `integration-test-report-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // 同时导出JSON格式
    IntegrationService.exportData(report, `integration-test-report-${Date.now()}`, 'json');
    
    Toast.success('测试报告已生成并下载');
    IntegrationTest.log('测试报告已生成', 'success');
}

/**
 * 清空日志
 */
function clearLog() {
    IntegrationTest.logs = [];
    const logContainer = document.getElementById('testLog');
    if (logContainer) {
        logContainer.innerHTML = '';
    }
    Toast.info('日志已清空');
}

/**
 * 导出日志
 */
function exportLog() {
    if (IntegrationTest.logs.length === 0) {
        Toast.warning('没有日志可导出');
        return;
    }
    
    const logText = IntegrationTest.logs.map(log => 
        `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `integration-test-log-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    Toast.success('日志已导出');
}

// 页面加载完成后自动运行基础测试
document.addEventListener('DOMContentLoaded', () => {
    IntegrationTest.log('系统集成测试页面已加载', 'info');
    IntegrationTest.log('点击"运行所有测试"按钮开始测试', 'info');
});
