/**
 * 报表图表服务
 * 集成ECharts,支持柱状图、折线图、饼图、表格等多种展示方式
 */

class ReportChartService {
    constructor() {
        this.chartInstances = new Map();
        this.chartTypes = this.initializeChartTypes();
    }

    /**
     * 初始化图表类型定义
     */
    initializeChartTypes() {
        return [
            {
                id: 'bar',
                name: '柱状图',
                icon: 'bar-chart',
                description: '用于比较不同类别的数值',
                supportedDimensions: ['single', 'multiple'],
                supportedMetrics: ['single', 'multiple'],
                options: ['horizontal', 'stacked', 'grouped']
            },
            {
                id: 'line',
                name: '折线图',
                icon: 'line-chart',
                description: '用于展示数据随时间的变化趋势',
                supportedDimensions: ['single'],
                supportedMetrics: ['single', 'multiple'],
                options: ['smooth', 'area', 'stacked']
            },
            {
                id: 'pie',
                name: '饼图',
                icon: 'pie-chart',
                description: '用于展示数据的占比关系',
                supportedDimensions: ['single'],
                supportedMetrics: ['single'],
                options: ['donut', 'rose']
            },
            {
                id: 'scatter',
                name: '散点图',
                icon: 'scatter-chart',
                description: '用于展示两个变量之间的关系',
                supportedDimensions: ['single'],
                supportedMetrics: ['two'],
                options: ['bubble']
            },
            {
                id: 'radar',
                name: '雷达图',
                icon: 'radar-chart',
                description: '用于多维度数据对比',
                supportedDimensions: ['single'],
                supportedMetrics: ['multiple'],
                options: []
            },
            {
                id: 'gauge',
                name: '仪表盘',
                icon: 'gauge',
                description: '用于展示单个指标的完成度',
                supportedDimensions: [],
                supportedMetrics: ['single'],
                options: []
            },
            {
                id: 'funnel',
                name: '漏斗图',
                icon: 'funnel',
                description: '用于展示流程转化率',
                supportedDimensions: ['single'],
                supportedMetrics: ['single'],
                options: []
            },
            {
                id: 'heatmap',
                name: '热力图',
                icon: 'heatmap',
                description: '用于展示数据密度分布',
                supportedDimensions: ['two'],
                supportedMetrics: ['single'],
                options: []
            },
            {
                id: 'table',
                name: '表格',
                icon: 'table',
                description: '用于展示详细数据列表',
                supportedDimensions: ['multiple'],
                supportedMetrics: ['multiple'],
                options: ['pagination', 'sorting', 'filtering']
            }
        ];
    }

    /**
     * 渲染图表
     */
    renderChart(containerId, chartConfig, data) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`容器不存在: ${containerId}`);
        }

        // 销毁已存在的图表实例
        if (this.chartInstances.has(containerId)) {
            this.chartInstances.get(containerId).dispose();
        }

        // 创建新的图表实例
        const chart = echarts.init(container);
        this.chartInstances.set(containerId, chart);

        // 根据图表类型生成配置
        const option = this.generateChartOption(chartConfig, data);

        // 渲染图表
        chart.setOption(option);

        // 添加交互事件
        this.addChartInteractions(chart, chartConfig);

        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });

        return chart;
    }

    /**
     * 生成图表配置
     */
    generateChartOption(chartConfig, data) {
        const { chartType, title, subtitle, showLegend, showTooltip, showDataLabels } = chartConfig;

        const baseOption = {
            title: {
                text: title || '',
                subtext: subtitle || '',
                left: 'center'
            },
            tooltip: showTooltip !== false ? {
                trigger: chartType === 'pie' ? 'item' : 'axis',
                formatter: this.getTooltipFormatter(chartType)
            } : undefined,
            legend: showLegend !== false ? {
                orient: 'horizontal',
                bottom: 10
            } : undefined,
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            }
        };

        // 根据图表类型生成特定配置
        switch (chartType) {
            case 'bar':
                return this.generateBarChartOption(baseOption, chartConfig, data);
            case 'line':
                return this.generateLineChartOption(baseOption, chartConfig, data);
            case 'pie':
                return this.generatePieChartOption(baseOption, chartConfig, data);
            case 'scatter':
                return this.generateScatterChartOption(baseOption, chartConfig, data);
            case 'radar':
                return this.generateRadarChartOption(baseOption, chartConfig, data);
            case 'gauge':
                return this.generateGaugeChartOption(baseOption, chartConfig, data);
            case 'funnel':
                return this.generateFunnelChartOption(baseOption, chartConfig, data);
            case 'heatmap':
                return this.generateHeatmapChartOption(baseOption, chartConfig, data);
            default:
                throw new Error(`不支持的图表类型: ${chartType}`);
        }
    }

    /**
     * 生成柱状图配置
     */
    generateBarChartOption(baseOption, chartConfig, data) {
        const { horizontal, stacked, grouped } = chartConfig.options || {};

        return {
            ...baseOption,
            xAxis: {
                type: horizontal ? 'value' : 'category',
                data: horizontal ? undefined : data.categories,
                axisLabel: {
                    rotate: data.categories && data.categories.length > 10 ? 45 : 0
                }
            },
            yAxis: {
                type: horizontal ? 'category' : 'value',
                data: horizontal ? data.categories : undefined
            },
            series: data.series.map(s => ({
                name: s.name,
                type: 'bar',
                data: s.data,
                stack: stacked ? 'total' : undefined,
                label: {
                    show: chartConfig.showDataLabels,
                    position: horizontal ? 'right' : 'top'
                },
                emphasis: {
                    focus: 'series'
                }
            }))
        };
    }

    /**
     * 生成折线图配置
     */
    generateLineChartOption(baseOption, chartConfig, data) {
        const { smooth, area, stacked } = chartConfig.options || {};

        return {
            ...baseOption,
            xAxis: {
                type: 'category',
                data: data.categories,
                boundaryGap: false
            },
            yAxis: {
                type: 'value'
            },
            series: data.series.map(s => ({
                name: s.name,
                type: 'line',
                data: s.data,
                smooth: smooth,
                areaStyle: area ? {} : undefined,
                stack: stacked ? 'total' : undefined,
                label: {
                    show: chartConfig.showDataLabels,
                    position: 'top'
                },
                emphasis: {
                    focus: 'series'
                }
            }))
        };
    }

    /**
     * 生成饼图配置
     */
    generatePieChartOption(baseOption, chartConfig, data) {
        const { donut, rose } = chartConfig.options || {};

        return {
            ...baseOption,
            series: [{
                name: data.name || '数据',
                type: 'pie',
                radius: donut ? ['40%', '70%'] : '70%',
                roseType: rose ? 'radius' : undefined,
                data: data.data.map((value, index) => ({
                    value: value,
                    name: data.categories[index]
                })),
                label: {
                    show: chartConfig.showDataLabels,
                    formatter: '{b}: {c} ({d}%)'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    }

    /**
     * 生成散点图配置
     */
    generateScatterChartOption(baseOption, chartConfig, data) {
        const { bubble } = chartConfig.options || {};

        return {
            ...baseOption,
            xAxis: {
                type: 'value',
                name: data.xAxisName || ''
            },
            yAxis: {
                type: 'value',
                name: data.yAxisName || ''
            },
            series: data.series.map(s => ({
                name: s.name,
                type: 'scatter',
                data: s.data,
                symbolSize: bubble ? (val) => val[2] : 10,
                emphasis: {
                    focus: 'series'
                }
            }))
        };
    }

    /**
     * 生成雷达图配置
     */
    generateRadarChartOption(baseOption, chartConfig, data) {
        return {
            ...baseOption,
            radar: {
                indicator: data.indicators.map(ind => ({
                    name: ind.name,
                    max: ind.max
                }))
            },
            series: [{
                name: data.name || '数据',
                type: 'radar',
                data: data.series.map(s => ({
                    value: s.data,
                    name: s.name
                }))
            }]
        };
    }

    /**
     * 生成仪表盘配置
     */
    generateGaugeChartOption(baseOption, chartConfig, data) {
        return {
            ...baseOption,
            series: [{
                name: data.name || '指标',
                type: 'gauge',
                progress: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}%'
                },
                data: [{
                    value: data.value,
                    name: data.name
                }]
            }]
        };
    }

    /**
     * 生成漏斗图配置
     */
    generateFunnelChartOption(baseOption, chartConfig, data) {
        return {
            ...baseOption,
            series: [{
                name: data.name || '转化',
                type: 'funnel',
                left: '10%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    position: 'inside'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: data.data.map((value, index) => ({
                    value: value,
                    name: data.categories[index]
                }))
            }]
        };
    }

    /**
     * 生成热力图配置
     */
    generateHeatmapChartOption(baseOption, chartConfig, data) {
        return {
            ...baseOption,
            xAxis: {
                type: 'category',
                data: data.xCategories,
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                type: 'category',
                data: data.yCategories,
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                min: data.min || 0,
                max: data.max || 100,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%'
            },
            series: [{
                name: data.name || '数据',
                type: 'heatmap',
                data: data.data,
                label: {
                    show: chartConfig.showDataLabels
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    }

    /**
     * 获取提示框格式化器
     */
    getTooltipFormatter(chartType) {
        switch (chartType) {
            case 'pie':
                return '{b}: {c} ({d}%)';
            case 'scatter':
                return (params) => {
                    return `${params.seriesName}<br/>${params.marker}X: ${params.value[0]}<br/>Y: ${params.value[1]}`;
                };
            default:
                return undefined;
        }
    }

    /**
     * 添加图表交互
     */
    addChartInteractions(chart, chartConfig) {
        // 点击事件
        if (chartConfig.onClick) {
            chart.on('click', (params) => {
                chartConfig.onClick(params);
            });
        }

        // 双击事件 - 钻取
        if (chartConfig.onDrillDown) {
            chart.on('dblclick', (params) => {
                chartConfig.onDrillDown(params);
            });
        }

        // 图例选择事件
        if (chartConfig.onLegendSelect) {
            chart.on('legendselectchanged', (params) => {
                chartConfig.onLegendSelect(params);
            });
        }

        // 数据区域缩放事件
        if (chartConfig.onDataZoom) {
            chart.on('datazoom', (params) => {
                chartConfig.onDataZoom(params);
            });
        }
    }

    /**
     * 渲染表格
     */
    renderTable(containerId, tableConfig, data) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`容器不存在: ${containerId}`);
        }

        const { columns, pagination, sorting, filtering, showHeader, showFooter } = tableConfig;

        let html = '<div class="report-table-container">';

        // 表格头部
        if (showHeader !== false) {
            html += '<div class="table-header">';
            if (filtering) {
                html += this.generateTableFilters(columns);
            }
            html += '</div>';
        }

        // 表格主体
        html += '<table class="report-table">';
        html += '<thead><tr>';
        columns.forEach(col => {
            const sortable = sorting && col.sortable !== false;
            html += `<th data-field="${col.field}" ${sortable ? 'class="sortable"' : ''}>
                ${col.title}
                ${sortable ? '<span class="sort-icon"></span>' : ''}
            </th>`;
        });
        html += '</tr></thead>';

        html += '<tbody>';
        data.rows.forEach(row => {
            html += '<tr>';
            columns.forEach(col => {
                const value = row[col.field];
                const formatted = col.formatter ? col.formatter(value, row) : value;
                html += `<td>${formatted}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';

        // 表格底部
        if (showFooter !== false && pagination) {
            html += this.generateTablePagination(data.total, pagination);
        }

        html += '</div>';

        container.innerHTML = html;

        // 添加表格交互
        this.addTableInteractions(container, tableConfig);
    }

    /**
     * 生成表格筛选器
     */
    generateTableFilters(columns) {
        let html = '<div class="table-filters">';
        columns.forEach(col => {
            if (col.filterable !== false) {
                html += `<input type="text" placeholder="筛选${col.title}" data-field="${col.field}" class="filter-input">`;
            }
        });
        html += '</div>';
        return html;
    }

    /**
     * 生成表格分页
     */
    generateTablePagination(total, pagination) {
        const { pageSize = 20, currentPage = 1 } = pagination;
        const totalPages = Math.ceil(total / pageSize);

        let html = '<div class="table-pagination">';
        html += `<span class="pagination-info">共 ${total} 条记录</span>`;
        html += '<div class="pagination-controls">';
        html += `<button class="page-btn" data-page="1" ${currentPage === 1 ? 'disabled' : ''}>首页</button>`;
        html += `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>`;
        html += `<span class="page-number">第 ${currentPage} / ${totalPages} 页</span>`;
        html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>`;
        html += `<button class="page-btn" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''}>末页</button>`;
        html += '</div>';
        html += '</div>';

        return html;
    }

    /**
     * 添加表格交互
     */
    addTableInteractions(container, tableConfig) {
        // 排序
        if (tableConfig.sorting) {
            container.querySelectorAll('th.sortable').forEach(th => {
                th.addEventListener('click', () => {
                    const field = th.dataset.field;
                    if (tableConfig.onSort) {
                        tableConfig.onSort(field);
                    }
                });
            });
        }

        // 筛选
        if (tableConfig.filtering) {
            container.querySelectorAll('.filter-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const field = e.target.dataset.field;
                    const value = e.target.value;
                    if (tableConfig.onFilter) {
                        tableConfig.onFilter(field, value);
                    }
                });
            });
        }

        // 分页
        if (tableConfig.pagination) {
            container.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const page = parseInt(btn.dataset.page);
                    if (tableConfig.onPageChange) {
                        tableConfig.onPageChange(page);
                    }
                });
            });
        }

        // 行点击
        if (tableConfig.onRowClick) {
            container.querySelectorAll('tbody tr').forEach((tr, index) => {
                tr.addEventListener('click', () => {
                    tableConfig.onRowClick(index);
                });
            });
        }
    }

    /**
     * 更新图表数据
     */
    updateChartData(containerId, data) {
        const chart = this.chartInstances.get(containerId);
        if (!chart) {
            throw new Error(`图表实例不存在: ${containerId}`);
        }

        const option = chart.getOption();
        // 更新数据
        if (option.series) {
            option.series.forEach((series, index) => {
                if (data.series && data.series[index]) {
                    series.data = data.series[index].data;
                }
            });
        }

        chart.setOption(option);
    }

    /**
     * 导出图表为图片
     */
    exportChartAsImage(containerId, filename = 'chart.png') {
        const chart = this.chartInstances.get(containerId);
        if (!chart) {
            throw new Error(`图表实例不存在: ${containerId}`);
        }

        const url = chart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    }

    /**
     * 销毁图表
     */
    disposeChart(containerId) {
        const chart = this.chartInstances.get(containerId);
        if (chart) {
            chart.dispose();
            this.chartInstances.delete(containerId);
        }
    }

    /**
     * 销毁所有图表
     */
    disposeAllCharts() {
        this.chartInstances.forEach(chart => {
            chart.dispose();
        });
        this.chartInstances.clear();
    }

    /**
     * 获取图表类型列表
     */
    getChartTypes() {
        return this.chartTypes;
    }

    /**
     * 获取图表类型信息
     */
    getChartTypeInfo(chartType) {
        return this.chartTypes.find(t => t.id === chartType);
    }

    /**
     * 验证图表配置
     */
    validateChartConfig(chartConfig, data) {
        const errors = [];

        if (!chartConfig.chartType) {
            errors.push('图表类型不能为空');
        }

        const chartTypeInfo = this.getChartTypeInfo(chartConfig.chartType);
        if (!chartTypeInfo) {
            errors.push(`不支持的图表类型: ${chartConfig.chartType}`);
            return { valid: false, errors };
        }

        // 验证维度数量
        const dimensionCount = data.dimensions ? data.dimensions.length : 0;
        if (chartTypeInfo.supportedDimensions.includes('single') && dimensionCount !== 1) {
            errors.push(`${chartTypeInfo.name}需要1个维度`);
        }

        // 验证指标数量
        const metricCount = data.series ? data.series.length : 0;
        if (chartTypeInfo.supportedMetrics.includes('single') && metricCount !== 1) {
            errors.push(`${chartTypeInfo.name}需要1个指标`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * 生成示例数据
     */
    generateSampleData(chartType) {
        switch (chartType) {
            case 'bar':
            case 'line':
                return {
                    categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    series: [{
                        name: '预警数量',
                        data: [120, 200, 150, 80, 70, 110]
                    }]
                };
            case 'pie':
                return {
                    categories: ['高风险', '中风险', '低风险'],
                    data: [335, 310, 234]
                };
            case 'scatter':
                return {
                    xAxisName: '预警数',
                    yAxisName: '整改率',
                    series: [{
                        name: '部门',
                        data: [[10, 85], [20, 90], [15, 75], [25, 95], [30, 88]]
                    }]
                };
            case 'radar':
                return {
                    indicators: [
                        { name: '预警处理', max: 100 },
                        { name: '线索核实', max: 100 },
                        { name: '整改完成', max: 100 },
                        { name: '监督覆盖', max: 100 },
                        { name: '风险发现', max: 100 }
                    ],
                    series: [{
                        name: '本月',
                        data: [85, 90, 75, 88, 92]
                    }]
                };
            case 'gauge':
                return {
                    name: '整改完成率',
                    value: 85.5
                };
            case 'funnel':
                return {
                    categories: ['预警生成', '线索转化', '立案调查', '整改完成'],
                    data: [100, 80, 60, 45]
                };
            default:
                return {};
        }
    }
}

// 导出服务实例
window.ReportChartService = ReportChartService;
