class AssetReport {
    constructor() { this.init(); }
    init() {
        this.renderTable();
        this.initCharts();
    }
    renderTable() {
        const data = [
            { name: '计算机学院', count: 285, value: 8500, usage: 82.5, idle: 18, repair: 8 },
            { name: '经济管理学院', count: 198, value: 4200, usage: 78.3, idle: 15, repair: 5 },
            { name: '机械工程学院', count: 312, value: 12500, usage: 75.8, idle: 25, repair: 12 },
            { name: '化学学院', count: 245, value: 9800, usage: 73.2, idle: 22, repair: 9 },
            { name: '物理学院', count: 228, value: 8900, usage: 76.5, idle: 19, repair: 7 },
            { name: '后勤管理处', count: 156, value: 3200, usage: 68.9, idle: 18, repair: 4 }
        ];
        document.getElementById('detailTableBody').innerHTML = data.map(d => `
            <tr>
                <td><strong>${d.name}</strong></td>
                <td>${d.count}</td>
                <td>${d.value.toLocaleString()}</td>
                <td><strong>${d.usage}%</strong></td>
                <td><span style="color: var(--color-warning);">${d.idle}</span></td>
                <td>${d.repair}</td>
            </tr>
        `).join('');
    }
    initCharts() {
        const usageChart = echarts.init(document.getElementById('usageChart'));
        usageChart.setOption({
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'] },
            yAxis: { type: 'value', name: '资产数量' },
            series: [{
                type: 'bar',
                data: [128, 85, 156, 342, 512],
                itemStyle: {
                    color: function(params) {
                        const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#059669'];
                        return colors[params.dataIndex];
                    }
                },
                label: { show: true, position: 'top' }
            }]
        });

        const typeChart = echarts.init(document.getElementById('typeChart'));
        typeChart.setOption({
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                data: [
                    { name: '教学设备', value: 485 },
                    { name: '科研设备', value: 358 },
                    { name: '办公设备', value: 245 },
                    { name: '房屋建筑', value: 128 },
                    { name: '车辆', value: 45 },
                    { name: '其他', value: 162 }
                ],
                label: { formatter: '{b}\n{c}件' }
            }],
            color: ['#1e40af', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280']
        });
    }
    refresh() { showNotification('success', '数据已刷新'); }
    exportExcel() { showNotification('success', 'Excel已导出'); }
    print() { window.print(); }
}
document.addEventListener('DOMContentLoaded', () => {
    window.assetReport = new AssetReport();
});
