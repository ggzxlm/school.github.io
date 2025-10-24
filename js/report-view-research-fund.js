class ResearchFundReport {
    constructor() { this.init(); }
    init() {
        this.renderTable();
        this.initCharts();
    }
    renderTable() {
        const data = [
            { name: '计算机学院', total: 12500, used: 9800, anomaly: 5, compliant: 38 },
            { name: '经济管理学院', total: 8900, used: 7100, anomaly: 3, compliant: 32 },
            { name: '机械工程学院', total: 10200, used: 8500, anomaly: 4, compliant: 35 },
            { name: '化学学院', total: 9500, used: 7400, anomaly: 6, compliant: 28 },
            { name: '物理学院', total: 8800, used: 6900, anomaly: 4, compliant: 30 }
        ];
        document.getElementById('detailTableBody').innerHTML = data.map(d => `
            <tr>
                <td><strong>${d.name}</strong></td>
                <td>${d.total.toLocaleString()}</td>
                <td>${d.used.toLocaleString()}</td>
                <td><strong>${((d.used/d.total)*100).toFixed(1)}%</strong></td>
                <td><span style="color: var(--color-warning);">${d.anomaly}</span></td>
                <td>${d.compliant}</td>
            </tr>
        `).join('');
    }
    initCharts() {
        const trendChart = echarts.init(document.getElementById('trendChart'));
        trendChart.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['经费总额', '已使用', '执行率'] },
            xAxis: { type: 'category', data: ['7月', '8月', '9月'] },
            yAxis: [
                { type: 'value', name: '金额(亿元)' },
                { type: 'value', name: '执行率(%)', min: 70, max: 85 }
            ],
            series: [
                { name: '经费总额', type: 'bar', data: [2.7, 2.9, 2.9], itemStyle: { color: '#3b82f6' } },
                { name: '已使用', type: 'bar', data: [2.0, 2.2, 2.3], itemStyle: { color: '#10b981' } },
                { name: '执行率', type: 'line', yAxisIndex: 1, data: [74.1, 75.9, 79.3], itemStyle: { color: '#f59e0b' } }
            ]
        });

        const anomalyChart = echarts.init(document.getElementById('anomalyChart'));
        anomalyChart.setOption({
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: ['超额使用', '使用不合规', '结题延期', '经费挪用', '其他'] },
            yAxis: { type: 'value' },
            series: [{
                type: 'bar',
                data: [12, 8, 7, 5, 3],
                itemStyle: { color: '#ef4444' },
                label: { show: true, position: 'top' }
            }]
        });
    }
    refresh() { showNotification('success', '数据已刷新'); }
    exportExcel() { showNotification('success', 'Excel已导出'); }
    print() { window.print(); }
}
document.addEventListener('DOMContentLoaded', () => {
    window.researchFundReport = new ResearchFundReport();
});
