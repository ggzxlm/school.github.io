class OverviewReport {
    constructor() {
        this.init();
    }
    init() {
        this.initCharts();
    }
    initCharts() {
        // 趋势图
        const trendChart = echarts.init(document.getElementById('trendChart'));
        trendChart.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['预警', '线索', '工单', '整改'] },
            xAxis: { type: 'category', data: ['5月', '6月', '7月', '8月', '9月', '10月'] },
            yAxis: { type: 'value' },
            series: [
                { name: '预警', type: 'line', data: [128, 135, 142, 138, 139, 156], smooth: true },
                { name: '线索', type: 'line', data: [45, 52, 48, 55, 51, 58], smooth: true },
                { name: '工单', type: 'line', data: [68, 72, 75, 71, 78, 82], smooth: true },
                { name: '整改', type: 'line', data: [95, 102, 98, 105, 108, 115], smooth: true }
            ],
            color: ['#1e40af', '#f59e0b', '#10b981', '#8b5cf6']
        });

        // 分类图
        const categoryChart = echarts.init(document.getElementById('categoryChart'));
        categoryChart.setOption({
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: ['科研监督', '财务监督', '采购监督', '资产监督', '招生监督', '作风监督'] },
            yAxis: { type: 'value' },
            series: [{
                type: 'bar',
                data: [245, 198, 176, 145, 132, 158],
                itemStyle: { color: '#1e40af' }
            }]
        });

        // 风险图
        const riskChart = echarts.init(document.getElementById('riskChart'));
        riskChart.setOption({
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                data: [
                    { name: '高风险', value: 8 },
                    { name: '中风险', value: 15 },
                    { name: '低风险', value: 22 },
                    { name: '正常', value: 35 }
                ]
            }],
            color: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
        });
    }
    refresh() { showNotification('success', '数据已刷新'); }
    exportPDF() { showNotification('success', 'PDF已导出'); }
}
document.addEventListener('DOMContentLoaded', () => {
    window.overviewReport = new OverviewReport();
});
