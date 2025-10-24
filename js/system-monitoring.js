/**
 * 系统监控页面脚本
 */

// 全局变量
let monitoringService;
let charts = {};
let currentThresholdResource = null;
let currentFilter = 'all';
let updateInterval = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initMonitoring();
    setupEventListeners();
});

/**
 * 初始化监控服务
 */
function initMonitoring() {
    monitoringService = new SystemMonitoringService();
    initCharts();
    updateUI();
}

/**
 * 初始化图表
 */
function initCharts() {
    const chartConfig = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    display: false
                }
            },
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    radius: 0
                }
            }
        }
    };

    // CPU图表
    const cpuCtx = document.getElementById('cpuChart').getContext('2d');
    charts.cpu = new Chart(cpuCtx, {
        ...chartConfig,
        data: {
            labels: [],
            datasets: [{
                label: 'CPU',
                data: [],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true
            }]
        }
    });

    // 内存图表
    const memoryCtx = document.getElementById('memoryChart').getContext('2d');
    charts.memory = new Chart(memoryCtx, {
        ...chartConfig,
        data: {
            labels: [],
            datasets: [{
                label: 'Memory',
                data: [],
                borderColor: '#9b59b6',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                fill: true
            }]
        }
    });

    // 磁盘图表
    const diskCtx = document.getElementById('diskChart').getContext('2d');
    charts.disk = new Chart(diskCtx, {
        ...chartConfig,
        data: {
            labels: [],
            datasets: [{
                label: 'Disk',
                data: [],
                borderColor: '#e67e22',
                backgroundColor: 'rgba(230, 126, 34, 0.1)',
                fill: true
            }]
        }
    });

    // 网络图表
    const networkCtx = document.getElementById('networkChart').getContext('2d');
    charts.network = new Chart(networkCtx, {
        ...chartConfig,
        data: {
            labels: [],
            datasets: [{
                label: 'Network',
                data: [],
                borderColor: '#1abc9c',
                backgroundColor: 'rgba(26, 188, 156, 0.1)',
                fill: true
            }]
        }
    });
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 启动监控按钮
    document.getElementById('startMonitoringBtn').addEventListener('click', startMonitoring);
    
    // 停止监控按钮
    document.getElementById('stopMonitoringBtn').addEventListener('click', stopMonitoring);
    
    // 刷新按钮
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    
    // 过滤按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            updateAlertsList();
        });
    });
}

/**
 * 启动监控
 */
function startMonitoring() {
    monitoringService.startMonitoring();
    
    document.getElementById('startMonitoringBtn').disabled = true;
    document.getElementById('stopMonitoringBtn').disabled = false;
    
    // 每2秒更新一次UI
    updateInterval = setInterval(updateUI, 2000);
    
    updateUI();
    showNotification('监控已启动', 'success');
}

/**
 * 停止监控
 */
function stopMonitoring() {
    monitoringService.stopMonitoring();
    
    document.getElementById('startMonitoringBtn').disabled = false;
    document.getElementById('stopMonitoringBtn').disabled = true;
    
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
    
    updateUI();
    showNotification('监控已停止', 'info');
}

/**
 * 刷新数据
 */
function refreshData() {
    updateUI();
    showNotification('数据已刷新', 'success');
}

/**
 * 更新UI
 */
function updateUI() {
    updateMonitoringStatus();
    updateMetrics();
    updateCharts();
    updateAlertsList();
}

/**
 * 更新监控状态
 */
function updateMonitoringStatus() {
    const stats = monitoringService.getMonitoringStats();
    
    if (!stats) {
        return;
    }
    
    const statusBadge = document.getElementById('monitoringStatus');
    if (stats.isMonitoring) {
        statusBadge.textContent = '运行中';
        statusBadge.className = 'status-badge status-active';
    } else {
        statusBadge.textContent = '未启动';
        statusBadge.className = 'status-badge status-inactive';
    }
    
    document.getElementById('dataPointsCount').textContent = stats.totalDataPoints;
    document.getElementById('alertCount').textContent = stats.alertCount.new;
}

/**
 * 更新指标值
 */
function updateMetrics() {
    const latest = monitoringService.getLatestMetrics();
    
    if (!latest) {
        return;
    }
    
    updateMetricValue('cpu', latest.cpu);
    updateMetricValue('memory', latest.memory);
    updateMetricValue('disk', latest.disk);
    updateMetricValue('network', latest.network);
}

/**
 * 更新单个指标值
 */
function updateMetricValue(resource, value) {
    const element = document.getElementById(`${resource}Value`);
    const threshold = monitoringService.thresholds[resource];
    
    element.textContent = value.toFixed(1) + '%';
    
    // 根据阈值设置颜色
    element.className = 'metric-value';
    if (value > 90) {
        element.classList.add('danger');
    } else if (value > threshold) {
        element.classList.add('warning');
    }
}

/**
 * 更新图表
 */
function updateCharts() {
    const recentData = monitoringService.getRecentMetrics(30);
    
    if (recentData.length === 0) {
        return;
    }
    
    const labels = recentData.map(m => {
        const time = new Date(m.timestamp);
        return time.toLocaleTimeString();
    });
    
    // 更新CPU图表
    charts.cpu.data.labels = labels;
    charts.cpu.data.datasets[0].data = recentData.map(m => m.cpu);
    charts.cpu.update('none');
    
    // 更新内存图表
    charts.memory.data.labels = labels;
    charts.memory.data.datasets[0].data = recentData.map(m => m.memory);
    charts.memory.update('none');
    
    // 更新磁盘图表
    charts.disk.data.labels = labels;
    charts.disk.data.datasets[0].data = recentData.map(m => m.disk);
    charts.disk.update('none');
    
    // 更新网络图表
    charts.network.data.labels = labels;
    charts.network.data.datasets[0].data = recentData.map(m => m.network);
    charts.network.update('none');
}

/**
 * 更新告警列表
 */
function updateAlertsList() {
    const container = document.getElementById('alertsList');
    
    let filter = {};
    if (currentFilter !== 'all') {
        if (currentFilter === 'NEW' || currentFilter === 'HIGH') {
            if (currentFilter === 'NEW') {
                filter.status = 'NEW';
            } else {
                filter.level = 'HIGH';
            }
        } else {
            filter.type = currentFilter;
        }
    }
    
    const alerts = monitoringService.getAlerts(filter);
    
    if (alerts.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无告警</div>';
        return;
    }
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item level-${alert.level}">
            <div class="alert-header">
                <div class="alert-title">
                    <span class="alert-level ${alert.level}">${alert.level}</span>
                    <span>${alert.type === 'RESOURCE' ? '资源告警' : alert.type === 'TASK' ? '任务告警' : '规则引擎告警'}</span>
                </div>
                <span class="alert-time">${formatTime(alert.timestamp)}</span>
            </div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-meta">
                <span>告警ID: ${alert.id}</span>
                ${alert.resource ? `<span>资源: ${alert.resource}</span>` : ''}
                ${alert.value ? `<span>当前值: ${alert.value.toFixed(2)}%</span>` : ''}
                <span>状态: ${getStatusText(alert.status)}</span>
            </div>
            ${alert.status === 'NEW' ? `
                <div class="alert-actions">
                    <button class="btn btn-sm btn-primary" onclick="acknowledgeAlert('${alert.id}')">确认</button>
                    <button class="btn btn-sm btn-success" onclick="resolveAlert('${alert.id}')">解决</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

/**
 * 确认告警
 */
function acknowledgeAlert(alertId) {
    const alert = monitoringService.acknowledgeAlert(alertId);
    if (alert) {
        updateAlertsList();
        showNotification('告警已确认', 'success');
    }
}

/**
 * 解决告警
 */
function resolveAlert(alertId) {
    const resolution = prompt('请输入解决方案:');
    if (resolution) {
        const alert = monitoringService.resolveAlert(alertId, resolution);
        if (alert) {
            updateAlertsList();
            showNotification('告警已解决', 'success');
        }
    }
}

/**
 * 执行容量分析
 */
function analyzeCapacity() {
    const result = monitoringService.analyzeCapacity();
    const container = document.getElementById('capacityAnalysis');
    
    if (result.status === 'INSUFFICIENT_DATA') {
        container.innerHTML = `<div class="empty-state">${result.message}</div>`;
        return;
    }
    
    let html = '<div class="capacity-summary">';
    
    // CPU
    html += `
        <div class="capacity-item">
            <h4>CPU使用率</h4>
            <div class="capacity-value">${result.current.cpu.avg}%</div>
            <div class="capacity-trend ${result.trends.cpu}">
                趋势: ${getTrendText(result.trends.cpu)}
            </div>
            <div class="capacity-prediction">
                30天预测: ${result.predictions.cpu}%
            </div>
        </div>
    `;
    
    // Memory
    html += `
        <div class="capacity-item">
            <h4>内存使用率</h4>
            <div class="capacity-value">${result.current.memory.avg}%</div>
            <div class="capacity-trend ${result.trends.memory}">
                趋势: ${getTrendText(result.trends.memory)}
            </div>
            <div class="capacity-prediction">
                30天预测: ${result.predictions.memory}%
            </div>
        </div>
    `;
    
    // Disk
    html += `
        <div class="capacity-item">
            <h4>磁盘使用率</h4>
            <div class="capacity-value">${result.current.disk.avg}%</div>
            <div class="capacity-trend ${result.trends.disk}">
                趋势: ${getTrendText(result.trends.disk)}
            </div>
            <div class="capacity-prediction">
                30天预测: ${result.predictions.disk}%
            </div>
        </div>
    `;
    
    // Network
    html += `
        <div class="capacity-item">
            <h4>网络使用率</h4>
            <div class="capacity-value">${result.current.network.avg}%</div>
            <div class="capacity-prediction">
                峰值: ${result.current.network.max}%
            </div>
        </div>
    `;
    
    html += '</div>';
    
    // 建议
    if (result.recommendations.length > 0) {
        html += '<div class="recommendations"><h3>容量规划建议</h3>';
        result.recommendations.forEach(rec => {
            html += `
                <div class="recommendation-item severity-${rec.severity}">
                    <div class="recommendation-header">
                        <span class="recommendation-resource">${rec.resource}</span>
                        <span class="recommendation-severity ${rec.severity}">${rec.severity}</span>
                    </div>
                    <div class="recommendation-message">${rec.message}</div>
                    <div class="recommendation-stats">
                        <span>平均: ${rec.currentAvg}%</span>
                        <span>峰值: ${rec.currentMax}%</span>
                        <span>趋势: ${getTrendText(rec.trend)}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    } else {
        html += '<div class="empty-state">当前资源使用正常，无需扩容</div>';
    }
    
    container.innerHTML = html;
    showNotification('容量分析完成', 'success');
}

/**
 * 更新阈值
 */
function updateThreshold(resource) {
    currentThresholdResource = resource;
    const currentValue = monitoringService.thresholds[resource];
    
    document.getElementById('thresholdLabel').textContent = `${resource.toUpperCase()} 阈值 (%)`;
    document.getElementById('thresholdInput').value = currentValue;
    
    document.getElementById('thresholdModal').classList.add('show');
}

/**
 * 保存阈值
 */
function saveThreshold() {
    const value = parseInt(document.getElementById('thresholdInput').value);
    
    if (isNaN(value) || value < 0 || value > 100) {
        alert('请输入0-100之间的数值');
        return;
    }
    
    const thresholds = {};
    thresholds[currentThresholdResource] = value;
    monitoringService.updateThresholds(thresholds);
    
    document.getElementById(`${currentThresholdResource}Threshold`).textContent = value;
    
    closeThresholdModal();
    showNotification('阈值已更新', 'success');
}

/**
 * 关闭阈值模态框
 */
function closeThresholdModal() {
    document.getElementById('thresholdModal').classList.remove('show');
}

/**
 * 获取状态文本
 */
function getStatusText(status) {
    const statusMap = {
        'NEW': '新告警',
        'ACKNOWLEDGED': '已确认',
        'RESOLVED': '已解决'
    };
    return statusMap[status] || status;
}

/**
 * 获取趋势文本
 */
function getTrendText(trend) {
    const trendMap = {
        'INCREASING': '上升',
        'DECREASING': '下降',
        'STABLE': '稳定'
    };
    return trendMap[trend] || trend;
}

/**
 * 格式化时间
 */
function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // 在实际应用中，这里可以使用toast通知组件
}
