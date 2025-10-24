/**
 * 预警响应时效分析报表
 */

class AlertResponseReport {
    constructor() {
        this.init();
    }

    init() {
        this.loadData();
        this.renderDetailTable();
        this.initCharts();
    }

    // 加载数据
    loadData() {
        this.data = {
            departments: [
                { name: '计算机学院', total: 52, avgHours: 1.8, onTime: 48, overdue: 4 },
                { name: '经济管理学院', total: 45, avgHours: 2.1, onTime: 41, overdue: 4 },
                { name: '后勤管理处', total: 38, avgHours: 2.8, onTime: 32, overdue: 6 },
                { name: '财务处', total: 35, avgHours: 2.2, onTime: 32, overdue: 3 },
                { name: '科研处', total: 32, avgHours: 2.5, onTime: 28, overdue: 4 },
                { name: '教务处', total: 28, avgHours: 2.0, onTime: 26, overdue: 2 },
                { name: '学生处', total: 26, avgHours: 2.3, onTime: 23, overdue: 3 },
                { name: '人事处', total: 24, avgHours: 1.9, onTime: 22, overdue: 2 },
                { name: '资产管理处', total: 22, avgHours: 3.2, onTime: 18, overdue: 4 },
                { name: '招生办', total: 20, avgHours: 2.1, onTime: 18, overdue: 2 }
            ],
            durationDistribution: [
                { range: '0-1小时', count: 125 },
                { range: '1-2小时', count: 98 },
                { range: '2-4小时', count: 85 },
                { range: '4-8小时', count: 60 },
                { range: '8-24小时', count: 32 },
                { range: '24小时以上', count: 12 }
            ],
            riskLevelResponse: [
                { level: '高风险', avgHours: 1.5, onTimeRate: 92.5 },
                { level: '中风险', avgHours: 2.3, onTimeRate: 88.8 },
                { level: '低风险', avgHours: 3.1, onTimeRate: 86.2 }
            ]
        };
    }

    // 渲染详细数据表格
    renderDetailTable() {
        const tbody = document.getElementById('detailTableBody');
        tbody.innerHTML = this.data.departments.map(dept => {
            const rate = ((dept.onTime / dept.total) * 100).toFixed(1);
            return `
                <tr>
                    <td><strong>${dept.name}</strong></td>
                    <td>${dept.total}</td>
                    <td><strong>${dept.avgHours}小时</strong></td>
                    <td><span style="color: var(--color-success); font-weight: 600;">${dept.onTime}</span></td>
                    <td><span style="color: var(--color-danger); font-weight: 600;">${dept.overdue}</span></td>
                    <td><strong>${rate}%</strong></td>
                </tr>
            `;
        }).join('');
    }

    // 初始化图表
    initCharts() {
        this.initDurationChart();
        this.initDeptEfficiencyChart();
        this.initRiskLevelChart();
    }

    // 响应时长分布图表
    initDurationChart() {
        const chart = echarts.init(document.getElementById('durationChart'));
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.durationDistribution.map(d => d.range)
            },
            yAxis: {
                type: 'value',
                name: '预警数量'
            },
            series: [
                {
                    name: '预警数量',
                    type: 'bar',
                    data: this.data.durationDistribution.map(d => d.count),
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#1e40af' },
                            { offset: 1, color: '#3b82f6' }
                        ]),
                        borderRadius: [4, 4, 0, 0]
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}条'
                    }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 部门响应效率图表
    initDeptEfficiencyChart() {
        const chart = echarts.init(document.getElementById('deptEfficiencyChart'));
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['预警总数', '平均响应时长(小时)']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.departments.map(d => d.name)
            },
            yAxis: [
                {
                    type: 'value',
                    name: '预警数量',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '响应时长(小时)',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '预警总数',
                    type: 'bar',
                    data: this.data.departments.map(d => d.total),
                    itemStyle: {
                        color: '#3b82f6'
                    }
                },
                {
                    name: '平均响应时长(小时)',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.data.departments.map(d => d.avgHours),
                    itemStyle: {
                        color: '#f59e0b'
                    },
                    smooth: true
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 风险等级响应时效图表
    initRiskLevelChart() {
        const chart = echarts.init(document.getElementById('riskLevelChart'));
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['平均响应时长(小时)', '及时响应率(%)']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.riskLevelResponse.map(d => d.level)
            },
            yAxis: [
                {
                    type: 'value',
                    name: '响应时长(小时)',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '及时率(%)',
                    position: 'right',
                    min: 80,
                    max: 100
                }
            ],
            series: [
                {
                    name: '平均响应时长(小时)',
                    type: 'bar',
                    data: this.data.riskLevelResponse.map(d => d.avgHours),
                    itemStyle: {
                        color: '#3b82f6'
                    }
                },
                {
                    name: '及时响应率(%)',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.data.riskLevelResponse.map(d => d.onTimeRate),
                    itemStyle: {
                        color: '#10b981'
                    },
                    smooth: true
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 切换周期
    changePeriod() {
        const period = document.getElementById('periodSelect').value;
        showNotification('info', `正在加载${period}的数据...`);
        setTimeout(() => {
            showNotification('success', '数据已更新');
        }, 1000);
    }

    // 切换等级
    changeLevel() {
        const level = document.getElementById('levelSelect').value;
        if (level) {
            showNotification('info', '正在筛选数据...');
        } else {
            showNotification('info', '正在加载全部数据...');
        }
        setTimeout(() => {
            showNotification('success', '数据已更新');
        }, 1000);
    }

    // 刷新数据
    refresh() {
        showNotification('info', '正在刷新数据...');
        setTimeout(() => {
            this.loadData();
            this.renderDetailTable();
            this.initCharts();
            showNotification('success', '数据已刷新');
        }, 1000);
    }

    // 导出Excel
    exportExcel() {
        showNotification('success', 'Excel文件已生成并下载');
    }

    // 打印
    print() {
        window.print();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.alertResponseReport = new AlertResponseReport();
});
