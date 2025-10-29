// 数据分析页面脚本

// 模拟数据
const mockData = {
    indicatorData: [
        { department: '计算机学院', alerts: 45, clues: 23, completionRate: 85.5, avgDays: 12.3, overdueRate: 8.2 },
        { department: '经济管理学院', alerts: 38, clues: 19, completionRate: 92.1, avgDays: 9.8, overdueRate: 5.3 },
        { department: '外国语学院', alerts: 28, clues: 15, completionRate: 88.7, avgDays: 11.2, overdueRate: 6.7 },
        { department: '机械工程学院', alerts: 52, clues: 28, completionRate: 78.9, avgDays: 15.6, overdueRate: 12.1 },
        { department: '化学化工学院', alerts: 41, clues: 21, completionRate: 90.3, avgDays: 10.5, overdueRate: 4.8 },
        { department: '生命科学学院', alerts: 35, clues: 18, completionRate: 86.4, avgDays: 11.8, overdueRate: 7.5 },
        { department: '物理学院', alerts: 31, clues: 16, completionRate: 91.2, avgDays: 9.2, overdueRate: 5.1 },
        { department: '数学学院', alerts: 26, clues: 14, completionRate: 93.5, avgDays: 8.7, overdueRate: 3.9 }
    ],
    
    relationData: {
        nodes: [
            { id: 'person1', name: '张三', type: 'person', title: '采购部主任' },
            { id: 'person2', name: '李四', type: 'person', title: '项目负责人' },
            { id: 'person3', name: '王五', type: 'person', title: '供应商法人' },
            { id: 'person4', name: '赵六', type: 'person', title: '财务处长' },
            { id: 'person5', name: '钱七', type: 'person', title: '基建处主任' },
            { id: 'company1', name: '科技有限公司', type: 'company', regCapital: '500万' },
            { id: 'company2', name: '工程建设公司', type: 'company', regCapital: '1000万' },
            { id: 'company3', name: '设备供应公司', type: 'company', regCapital: '300万' },
            { id: 'contract1', name: '设备采购合同', type: 'contract', amount: '120万' },
            { id: 'contract2', name: '工程建设合同', type: 'contract', amount: '800万' },
            { id: 'contract3', name: '实验器材采购', type: 'contract', amount: '50万' },
            { id: 'bid1', name: '实验室设备招标', type: 'bid', date: '2025-03-15' },
            { id: 'bid2', name: '教学楼建设招标', type: 'bid', date: '2025-05-20' },
            { id: 'bid3', name: '图书馆装修招标', type: 'bid', date: '2025-06-10' }
        ],
        edges: [
            { source: 'person1', target: 'contract1', relation: '签订' },
            { source: 'person2', target: 'contract2', relation: '负责' },
            { source: 'person3', target: 'company1', relation: '法人' },
            { source: 'person4', target: 'contract1', relation: '审批' },
            { source: 'person5', target: 'contract2', relation: '监督' },
            { source: 'company1', target: 'contract1', relation: '中标' },
            { source: 'company2', target: 'contract2', relation: '承建' },
            { source: 'company3', target: 'contract3', relation: '供应' },
            { source: 'company1', target: 'bid1', relation: '参与' },
            { source: 'company2', target: 'bid2', relation: '参与' },
            { source: 'company3', target: 'bid1', relation: '参与' },
            { source: 'company3', target: 'bid3', relation: '参与' },
            { source: 'person1', target: 'person3', relation: '亲属关系', risk: true },
            { source: 'person2', target: 'company2', relation: '曾任职', risk: true },
            { source: 'contract1', target: 'bid1', relation: '来源' },
            { source: 'contract2', target: 'bid2', relation: '来源' },
            { source: 'contract3', target: 'bid1', relation: '来源' }
        ]
    }
};

// 当前图表实例
let currentChart = null;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initToolbarSwitch();
    initIndicatorAnalysis();
    initTrendAnalysis();
    initKnowledgeGraph();
});

// 初始化工具栏切换
function initToolbarSwitch() {
    const toolbarItems = document.querySelectorAll('.toolbar-item');
    const analysisModules = document.querySelectorAll('.analysis-module');
    
    toolbarItems.forEach(item => {
        item.addEventListener('click', function() {
            const analysisType = this.dataset.analysisType;
            
            // 更新工具栏激活状态
            toolbarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 切换分析模块
            analysisModules.forEach(module => {
                module.classList.remove('active');
            });
            
            const targetModule = document.getElementById(`${analysisType}-analysis`);
            if (targetModule) {
                targetModule.classList.add('active');
                
                // 切换到对应模块时，初始化或重新渲染图表
                setTimeout(() => {
                    if (analysisType === 'trend') {
                        if (!trendChartInitialized) {
                            updateTrendChart();
                            trendChartInitialized = true;
                        } else if (trendChart) {
                            trendChart.resize();
                        }
                    } else if (analysisType === 'graph') {
                        if (!knowledgeGraphChart) {
                            updateKnowledgeGraph();
                        } else {
                            knowledgeGraphChart.resize();
                        }
                    } else if (analysisType === 'indicator' && currentChart) {
                        currentChart.resize();
                    }
                }, 100);
            }
        });
    });
}

// 获取选中的指标
function getSelectedIndicators() {
    const checkboxes = document.querySelectorAll('.indicator-checkbox input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const label = checkbox.parentElement.querySelector('span').textContent;
            selected.push(label);
        }
    });
    return selected;
}

// 初始化指标分析
function initIndicatorAnalysis() {
    // 维度切换
    const dimensionTags = document.querySelectorAll('.dimension-tag');
    dimensionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            dimensionTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateIndicatorChart();
        });
    });
    
    // 图表类型切换
    const chartTypeBtns = document.querySelectorAll('.chart-type-btn');
    chartTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const chartType = this.dataset.chartType;
            updateIndicatorChart(chartType);
        });
    });
    
    // 指标复选框切换
    const indicatorCheckboxes = document.querySelectorAll('.indicator-checkbox input[type="checkbox"]');
    indicatorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 获取当前选中的图表类型
            const activeChartTypeBtn = document.querySelector('.chart-type-btn.active');
            const chartType = activeChartTypeBtn ? activeChartTypeBtn.dataset.chartType : 'bar';
            updateIndicatorChart(chartType);
        });
    });
    
    // 初始化图表和表格
    updateIndicatorChart('bar');
    renderIndicatorTable();
}

// 更新指标图表
function updateIndicatorChart(chartType = 'bar') {
    const chartDom = document.getElementById('indicator-chart');
    
    if (currentChart) {
        currentChart.dispose();
    }
    
    currentChart = echarts.init(chartDom);
    
    // 获取当前选中的维度
    const activeDimension = document.querySelector('.dimension-tag.active');
    const dimension = activeDimension ? activeDimension.dataset.dimension : 'department';
    
    // 获取选中的指标
    const selectedIndicators = getSelectedIndicators();
    
    // 根据维度获取数据
    let categories;
    const dataMap = {};
    
    if (dimension === 'department') {
        categories = mockData.indicatorData.map(d => d.department);
        dataMap['预警数量'] = mockData.indicatorData.map(d => d.alerts);
        dataMap['线索数量'] = mockData.indicatorData.map(d => d.clues);
        dataMap['整改完成率'] = mockData.indicatorData.map(d => d.completionRate);
        dataMap['平均处置时长'] = mockData.indicatorData.map(d => d.avgDays);
        dataMap['超期率'] = mockData.indicatorData.map(d => d.overdueRate);
    } else if (dimension === 'time') {
        // 按时间维度的模拟数据
        categories = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'];
        dataMap['预警数量'] = [32, 38, 35, 42, 45, 61, 52, 48, 55, 58];
        dataMap['线索数量'] = [18, 22, 20, 25, 28, 35, 30, 28, 32, 34];
        dataMap['整改完成率'] = [85, 87, 86, 88, 90, 89, 91, 92, 90, 91];
        dataMap['平均处置时长'] = [12, 11, 13, 12, 10, 11, 10, 9, 10, 9];
        dataMap['超期率'] = [8, 7, 9, 8, 6, 7, 6, 5, 6, 5];
    } else if (dimension === 'type') {
        // 按类型维度的模拟数据
        categories = ['科研经费', '采购管理', '招生录取', '基建工程', '财务管理', '资产管理'];
        dataMap['预警数量'] = [85, 62, 48, 55, 42, 38];
        dataMap['线索数量'] = [45, 32, 25, 28, 22, 20];
        dataMap['整改完成率'] = [88, 92, 90, 85, 93, 91];
        dataMap['平均处置时长'] = [11, 9, 10, 13, 8, 9];
        dataMap['超期率'] = [7, 5, 6, 9, 4, 5];
    } else if (dimension === 'level') {
        // 按等级维度的模拟数据
        categories = ['高风险', '中风险', '低风险'];
        dataMap['预警数量'] = [56, 112, 80];
        dataMap['线索数量'] = [28, 58, 42];
        dataMap['整改完成率'] = [82, 89, 94];
        dataMap['平均处置时长'] = [15, 11, 8];
        dataMap['超期率'] = [12, 7, 3];
    }
    
    // 构建系列数据
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const series = selectedIndicators.map((indicator, index) => ({
        name: indicator,
        type: chartType === 'pie' ? 'pie' : chartType,
        data: dataMap[indicator] || [],
        smooth: chartType === 'line',
        itemStyle: {
            color: colors[index % colors.length]
        }
    }));
    
    let option;
    
    if (chartType === 'bar' || chartType === 'line') {
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: chartType === 'bar' ? 'shadow' : 'line'
                }
            },
            legend: {
                data: selectedIndicators
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: categories,
                axisLabel: {
                    rotate: 30,
                    interval: 0
                }
            },
            yAxis: {
                type: 'value'
            },
            series: series
        };
    } else if (chartType === 'pie') {
        // 饼图只显示第一个选中的指标
        const firstIndicator = selectedIndicators[0] || '预警数量';
        const pieData = categories.map((name, index) => ({
            name: name,
            value: dataMap[firstIndicator][index]
        }));
        
        option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                data: categories
            },
            series: [
                {
                    name: firstIndicator,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: pieData
                }
            ]
        };
    }
    
    currentChart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        if (currentChart) {
            currentChart.resize();
        }
    });
}

// 渲染指标表格
function renderIndicatorTable() {
    const tbody = document.getElementById('indicator-table-body');
    
    const rows = mockData.indicatorData.map(data => `
        <tr>
            <td class="font-medium">${data.department}</td>
            <td>${data.alerts}</td>
            <td>${data.clues}</td>
            <td>
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: ${data.completionRate}%"></div>
                    </div>
                    <span class="text-sm">${data.completionRate}%</span>
                </div>
            </td>
            <td>${data.avgDays}</td>
            <td>
                <span class="px-2 py-1 rounded text-xs ${data.overdueRate > 10 ? 'bg-red-100 text-red-700' : data.overdueRate > 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}">
                    ${data.overdueRate}%
                </span>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = rows;
}

// 趋势分析相关变量
let trendChart = null;
let trendChartInitialized = false;
const trendMockData = {
    alerts: [32, 38, 35, 42, 45, 61, 52, 48, 55, 58, 54, 60],
    clues: [18, 22, 20, 25, 28, 35, 30, 28, 32, 34, 31, 36],
    rectification: [15, 18, 16, 20, 22, 28, 25, 23, 26, 28, 25, 30],
    workorder: [25, 30, 28, 33, 36, 45, 40, 38, 42, 44, 41, 48],
    months: ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月']
};

// 初始化趋势分析
function initTrendAnalysis() {
    // 指标切换
    const metricTags = document.querySelectorAll('[data-trend-metric]');
    metricTags.forEach(tag => {
        tag.addEventListener('click', function() {
            metricTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    });
    
    // 粒度切换
    const granularityTags = document.querySelectorAll('[data-trend-granularity]');
    granularityTags.forEach(tag => {
        tag.addEventListener('click', function() {
            granularityTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    });
    
    // 时间范围选择器事件
    const timeRangeSelect = document.getElementById('trend-time-range');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    }
    
    // 复选框事件
    const showForecast = document.getElementById('show-forecast');
    const showAverage = document.getElementById('show-average');
    
    if (showForecast) {
        showForecast.addEventListener('change', function() {
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    }
    
    if (showAverage) {
        showAverage.addEventListener('change', function() {
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    }
    
    // 不在这里初始化图表，等到模块显示时再初始化
}

// 生成日期分类
function generateDateCategories(count, granularity) {
    const categories = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now);
        
        if (granularity === 'day') {
            date.setDate(date.getDate() - i);
            categories.push(date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }));
        } else if (granularity === 'week') {
            date.setDate(date.getDate() - i * 7);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            categories.push(`第${Math.ceil((now - weekStart) / (7 * 24 * 60 * 60 * 1000))}周`);
        } else if (granularity === 'month') {
            date.setMonth(date.getMonth() - i);
            categories.push(date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' }));
        } else if (granularity === 'quarter') {
            date.setMonth(date.getMonth() - i * 3);
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            categories.push(`${date.getFullYear()}Q${quarter}`);
        }
    }
    
    return categories;
}

// 生成趋势数据
function generateTrendData(count, metric) {
    const data = [];
    const baseValues = {
        alerts: 45,
        clues: 25,
        rectification: 15,
        workorder: 35
    };
    
    const baseValue = baseValues[metric] || 30;
    
    for (let i = 0; i < count; i++) {
        // 生成带趋势的随机数据
        const trend = Math.sin(i * 0.3) * 5; // 周期性波动
        const growth = i * 0.5; // 增长趋势
        const random = (Math.random() - 0.5) * 10; // 随机波动
        const value = Math.max(0, Math.round(baseValue + trend + growth + random));
        data.push(value);
    }
    
    return data;
}

// 分析趋势数据并生成结论
function analyzeTrendData(data, metric, granularity, categories) {
    const metricNames = {
        alerts: '预警数量',
        clues: '线索数量',
        rectification: '整改任务',
        workorder: '工单数量'
    };
    
    const metricName = metricNames[metric] || '数据';
    
    // 1. 计算整体趋势
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const growthRate = ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1);
    
    let trendText = '';
    if (growthRate > 10) {
        trendText = `${metricName}呈现明显上升趋势，后半期平均值较前半期增长${Math.abs(growthRate)}%，需要重点关注`;
    } else if (growthRate > 0) {
        trendText = `${metricName}呈现平稳上升趋势，后半期平均值较前半期增长${Math.abs(growthRate)}%`;
    } else if (growthRate > -10) {
        trendText = `${metricName}呈现小幅下降趋势，后半期平均值较前半期下降${Math.abs(growthRate)}%`;
    } else {
        trendText = `${metricName}呈现明显下降趋势，后半期平均值较前半期下降${Math.abs(growthRate)}%，情况有所改善`;
    }
    
    // 2. 检测异常波动
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / data.length);
    
    let anomalyText = '数据波动在正常范围内，未发现明显异常';
    let maxVal = Math.max(...data);
    let maxIdx = data.indexOf(maxVal);
    let minVal = Math.min(...data);
    let minIdx = data.indexOf(minVal);
    
    if (maxVal > avg + 1.5 * stdDev) {
        const prevVal = maxIdx > 0 ? data[maxIdx - 1] : maxVal;
        const increase = ((maxVal - prevVal) / prevVal * 100).toFixed(0);
        anomalyText = `${categories[maxIdx]}出现峰值（${maxVal}），较前期增长${increase}%，需重点关注`;
    } else if (minVal < avg - 1.5 * stdDev) {
        const prevVal = minIdx > 0 ? data[minIdx - 1] : minVal;
        const decrease = ((prevVal - minVal) / prevVal * 100).toFixed(0);
        anomalyText = `${categories[minIdx]}出现低谷（${minVal}），较前期下降${decrease}%`;
    }
    
    // 3. 预测分析
    const lastThree = data.slice(-3);
    const recentTrend = (lastThree[2] - lastThree[0]) / 2;
    const nextValue = Math.round(data[data.length - 1] + recentTrend);
    const nextValueMin = Math.max(0, Math.round(nextValue * 0.9));
    const nextValueMax = Math.round(nextValue * 1.1);
    
    let forecastText = '';
    if (recentTrend > 0) {
        forecastText = `基于近期上升趋势，预测下期${metricName}约为${nextValueMin}-${nextValueMax}，建议提前做好应对准备`;
    } else if (recentTrend < 0) {
        forecastText = `基于近期下降趋势，预测下期${metricName}约为${nextValueMin}-${nextValueMax}，情况持续改善`;
    } else {
        forecastText = `近期数据相对稳定，预测下期${metricName}约为${nextValueMin}-${nextValueMax}，保持现有管理水平`;
    }
    
    // 4. 建议措施
    let suggestionText = '';
    if (metric === 'alerts') {
        if (growthRate > 10) {
            suggestionText = '建议加强重点部门监督，优化预警规则配置，提高预警处置效率';
        } else if (growthRate > 0) {
            suggestionText = '建议持续关注预警趋势，加强日常监督检查，防止风险累积';
        } else {
            suggestionText = '预警管理效果良好，建议继续保持现有管理措施，巩固成果';
        }
    } else if (metric === 'clues') {
        if (growthRate > 10) {
            suggestionText = '线索数量增长较快，建议加强线索核查力度，提高转化效率';
        } else if (growthRate > 0) {
            suggestionText = '建议优化线索管理流程，提升线索质量和处置速度';
        } else {
            suggestionText = '线索管理稳定，建议继续完善线索发现和处置机制';
        }
    } else if (metric === 'rectification') {
        if (growthRate > 10) {
            suggestionText = '整改任务增多，建议加强整改督办，确保按期完成整改';
        } else if (growthRate > 0) {
            suggestionText = '建议优化整改流程，提高整改效率和质量';
        } else {
            suggestionText = '整改工作推进顺利，建议继续加强整改效果评估';
        }
    } else if (metric === 'workorder') {
        if (growthRate > 10) {
            suggestionText = '工单量增长明显，建议优化工单分配机制，提升处理效率';
        } else if (growthRate > 0) {
            suggestionText = '建议加强工单管理，缩短平均处理时长';
        } else {
            suggestionText = '工单处理效果良好，建议继续优化服务质量';
        }
    }
    
    return {
        overall: trendText,
        anomaly: anomalyText,
        forecast: forecastText,
        suggestion: suggestionText
    };
}

// 更新趋势分析结论
function updateTrendConclusions(analysis) {
    document.getElementById('trend-overall').textContent = analysis.overall;
    document.getElementById('trend-anomaly').textContent = analysis.anomaly;
    document.getElementById('trend-forecast').textContent = analysis.forecast;
    document.getElementById('trend-suggestion').textContent = analysis.suggestion;
}

// 更新趋势图表
function updateTrendChart() {
    const chartDom = document.getElementById('trend-chart');
    
    if (trendChart) {
        trendChart.dispose();
    }
    
    trendChart = echarts.init(chartDom);
    
    // 获取当前选中的指标
    const activeMetric = document.querySelector('[data-trend-metric].active');
    const metric = activeMetric ? activeMetric.dataset.trendMetric : 'alerts';
    
    // 获取当前选中的粒度
    const activeGranularity = document.querySelector('[data-trend-granularity].active');
    const granularity = activeGranularity ? activeGranularity.dataset.trendGranularity : 'month';
    
    // 获取时间范围
    const timeRangeSelect = document.getElementById('trend-time-range');
    const timeRange = timeRangeSelect ? parseInt(timeRangeSelect.value) : 6;
    
    const metricNames = {
        alerts: '预警数量',
        clues: '线索数量',
        rectification: '整改任务',
        workorder: '工单数量'
    };
    
    // 根据粒度和时间范围生成数据
    let categories, data;
    
    if (granularity === 'day') {
        // 按日粒度
        const days = timeRange === 3 ? 90 : timeRange === 6 ? 180 : timeRange === 12 ? 365 : 730;
        categories = generateDateCategories(days, 'day');
        data = generateTrendData(days, metric);
    } else if (granularity === 'week') {
        // 按周粒度
        const weeks = timeRange === 3 ? 12 : timeRange === 6 ? 24 : timeRange === 12 ? 52 : 104;
        categories = generateDateCategories(weeks, 'week');
        data = generateTrendData(weeks, metric);
    } else if (granularity === 'month') {
        // 按月粒度
        categories = generateDateCategories(timeRange, 'month');
        data = generateTrendData(timeRange, metric);
    } else if (granularity === 'quarter') {
        // 按季度粒度
        const quarters = Math.ceil(timeRange / 3);
        categories = generateDateCategories(quarters, 'quarter');
        data = generateTrendData(quarters, metric);
    }
    
    const months = categories;
    
    // 计算平均值
    const average = data.reduce((a, b) => a + b, 0) / data.length;
    const averageLine = new Array(data.length).fill(average);
    
    // 简单预测（线性回归）
    const forecast = [];
    const lastThree = data.slice(-3);
    const avgGrowth = (lastThree[2] - lastThree[0]) / 2;
    forecast.push(Math.round(data[data.length - 1] + avgGrowth));
    forecast.push(Math.round(data[data.length - 1] + avgGrowth * 2));
    
    const showForecast = document.getElementById('show-forecast')?.checked !== false;
    const showAverage = document.getElementById('show-average')?.checked !== false;
    
    const series = [
        {
            name: metricNames[metric],
            type: 'line',
            data: data,
            smooth: true,
            itemStyle: {
                color: '#3b82f6'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(59, 130, 246, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(59, 130, 246, 0.05)'
                    }]
                }
            }
        }
    ];
    
    if (showAverage) {
        series.push({
            name: '平均值',
            type: 'line',
            data: averageLine,
            lineStyle: {
                type: 'dashed',
                color: '#10b981'
            },
            itemStyle: {
                color: '#10b981'
            },
            symbol: 'none'
        });
    }
    
    if (showForecast) {
        series.push({
            name: '预测值',
            type: 'line',
            data: [...new Array(data.length - 1).fill(null), data[data.length - 1], ...forecast],
            lineStyle: {
                type: 'dashed',
                color: '#f59e0b'
            },
            itemStyle: {
                color: '#f59e0b'
            }
        });
    }
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: series.map(s => s.name)
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [...months, '预测1', '预测2'],
            boundaryGap: false
        },
        yAxis: {
            type: 'value'
        },
        series: series
    };
    
    trendChart.setOption(option);
    
    // 生成并更新趋势分析结论
    const analysis = analyzeTrendData(data, metric, granularity, categories);
    updateTrendConclusions(analysis);
    
    // 响应式
    window.addEventListener('resize', function() {
        if (trendChart) {
            trendChart.resize();
        }
    });
}

// 知识图谱相关变量
let knowledgeGraphChart = null;
const knowledgeGraphData = {
    risk: {
        nodes: [
            { id: 'alert-001', name: '高风险预警#2025-001', type: 'alert', risk: 'high', level: 0 },
            { id: 'dept-cs', name: '计算机学院', type: 'department', risk: 'medium', level: 1 },
            { id: 'person1', name: '张三', type: 'person', risk: 'high', level: 1 },
            { id: 'person2', name: '李四', type: 'person', risk: 'medium', level: 2 },
            { id: 'contract1', name: '采购合同A', type: 'contract', risk: 'high', level: 2 },
            { id: 'company1', name: '供应商X', type: 'company', risk: 'medium', level: 3 },
            { id: 'process-procurement', name: '采购流程', type: 'process', risk: 'low', level: 3 },
            { id: 'clue1', name: '线索#001', type: 'clue', risk: 'high', level: 1 },
            { id: 'event-corruption', name: '廉政风险事件', type: 'event', risk: 'high', level: 2 }
        ],
        edges: [
            { source: 'alert-001', target: 'dept-cs', relation: '涉及部门' },
            { source: 'alert-001', target: 'person1', relation: '涉及人员' },
            { source: 'person1', target: 'dept-cs', relation: '所属部门' },
            { source: 'person1', target: 'contract1', relation: '签订合同' },
            { source: 'contract1', target: 'company1', relation: '合同方' },
            { source: 'person2', target: 'company1', relation: '关联关系', risk: true },
            { source: 'contract1', target: 'process-procurement', relation: '执行流程' },
            { source: 'alert-001', target: 'clue1', relation: '转化线索' },
            { source: 'clue1', target: 'event-corruption', relation: '关联事件' }
        ]
    },
    department: {
        nodes: [
            { id: 'dept-cs', name: '计算机学院', type: 'department', risk: 'medium', level: 0 },
            { id: 'dept-econ', name: '经济管理学院', type: 'department', risk: 'low', level: 1 },
            { id: 'dept-foreign', name: '外国语学院', type: 'department', risk: 'low', level: 1 },
            { id: 'person1', name: '张三', type: 'person', risk: 'high', level: 1 },
            { id: 'person3', name: '王五', type: 'person', risk: 'low', level: 2 },
            { id: 'project1', name: '实验室建设项目', type: 'project', risk: 'medium', level: 2 }
        ],
        edges: [
            { source: 'dept-cs', target: 'person1', relation: '部门成员' },
            { source: 'dept-cs', target: 'dept-econ', relation: '协作关系' },
            { source: 'dept-cs', target: 'project1', relation: '负责项目' },
            { source: 'person1', target: 'person3', relation: '上下级' },
            { source: 'project1', target: 'dept-foreign', relation: '合作单位' }
        ]
    },
    process: {
        nodes: [
            { id: 'process-procurement', name: '采购流程', type: 'process', risk: 'low', level: 0 },
            { id: 'step1', name: '需求申请', type: 'step', risk: 'low', level: 1 },
            { id: 'step2', name: '审批环节', type: 'step', risk: 'medium', level: 1 },
            { id: 'step3', name: '招标环节', type: 'step', risk: 'high', level: 1 },
            { id: 'step4', name: '合同签订', type: 'step', risk: 'medium', level: 2 },
            { id: 'step5', name: '执行验收', type: 'step', risk: 'low', level: 2 }
        ],
        edges: [
            { source: 'process-procurement', target: 'step1', relation: '第一步' },
            { source: 'step1', target: 'step2', relation: '流转' },
            { source: 'step2', target: 'step3', relation: '流转' },
            { source: 'step3', target: 'step4', relation: '流转' },
            { source: 'step4', target: 'step5', relation: '流转' }
        ]
    },
    event: {
        nodes: [
            { id: 'event-corruption', name: '廉政风险事件', type: 'event', risk: 'high', level: 0 },
            { id: 'alert-001', name: '高风险预警', type: 'alert', risk: 'high', level: 1 },
            { id: 'person1', name: '张三', type: 'person', risk: 'high', level: 1 },
            { id: 'company1', name: '供应商X', type: 'company', risk: 'medium', level: 2 },
            { id: 'contract1', name: '采购合同A', type: 'contract', risk: 'high', level: 2 }
        ],
        edges: [
            { source: 'event-corruption', target: 'alert-001', relation: '触发预警' },
            { source: 'event-corruption', target: 'person1', relation: '涉及人员' },
            { source: 'person1', target: 'company1', relation: '关联企业', risk: true },
            { source: 'person1', target: 'contract1', relation: '签订合同' }
        ]
    }
};

// 更新中心节点选项
function updateCenterNodeOptions(graphType) {
    const centerNodeSelect = document.getElementById('center-node-select');
    if (!centerNodeSelect) return;
    
    // 定义不同图谱类型的中心节点选项
    const nodeOptions = {
        risk: [
            { value: 'alert-001', text: '高风险预警 #2025-001' },
            { value: 'person1', text: '张三（采购部主任）' },
            { value: 'dept-cs', text: '计算机学院' },
            { value: 'clue1', text: '线索#001' }
        ],
        department: [
            { value: 'dept-cs', text: '计算机学院' },
            { value: 'dept-econ', text: '经济管理学院' },
            { value: 'dept-foreign', text: '外国语学院' },
            { value: 'person1', text: '张三（部门成员）' }
        ],
        process: [
            { value: 'process-procurement', text: '采购流程' },
            { value: 'step1', text: '需求申请环节' },
            { value: 'step2', text: '审批环节' },
            { value: 'step3', text: '招标环节' }
        ],
        event: [
            { value: 'event-corruption', text: '廉政风险事件' },
            { value: 'alert-001', text: '高风险预警' },
            { value: 'person1', text: '张三' },
            { value: 'company1', text: '供应商X' }
        ]
    };
    
    const options = nodeOptions[graphType] || nodeOptions.risk;
    
    // 清空现有选项
    centerNodeSelect.innerHTML = '';
    
    // 添加新选项
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        centerNodeSelect.appendChild(optionElement);
    });
}

// 根据条件生成知识图谱数据
function generateKnowledgeGraphData(graphType, depth, centerNode) {
    const baseData = knowledgeGraphData[graphType] || knowledgeGraphData.risk;
    
    // 如果深度为最大值，返回所有数据
    if (depth >= 5) {
        return baseData;
    }
    
    // 根据深度过滤节点
    const filteredNodes = baseData.nodes.filter(node => node.level <= depth);
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    
    // 过滤边（只保留两端节点都存在的边）
    const filteredEdges = baseData.edges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
    
    return {
        nodes: filteredNodes,
        edges: filteredEdges
    };
}

// 初始化知识图谱
function initKnowledgeGraph() {
    // 图谱类型切换
    const graphTypeTags = document.querySelectorAll('[data-graph-type]');
    graphTypeTags.forEach(tag => {
        tag.addEventListener('click', function() {
            graphTypeTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 更新中心节点选项
            updateCenterNodeOptions(this.dataset.graphType);
            
            updateKnowledgeGraph();
        });
    });
    
    // 深度滑块
    const depthSlider = document.getElementById('graph-depth-slider');
    const depthValue = document.getElementById('graph-depth-value');
    if (depthSlider && depthValue) {
        depthSlider.addEventListener('input', function() {
            depthValue.textContent = this.value + '层';
        });
        
        // 滑块变化时更新图谱
        depthSlider.addEventListener('change', function() {
            if (knowledgeGraphChart) {
                updateKnowledgeGraph();
            }
        });
    }
    
    // 中心节点选择
    const centerNodeSelect = document.getElementById('center-node-select');
    if (centerNodeSelect) {
        centerNodeSelect.addEventListener('change', function() {
            if (knowledgeGraphChart) {
                updateKnowledgeGraph();
            }
        });
    }
    
    // 初始化中心节点选项（默认为风险传导图谱）
    updateCenterNodeOptions('risk');
    
    // 不在这里初始化图谱，等到模块显示时再初始化
}

// 更新知识图谱
function updateKnowledgeGraph() {
    const chartDom = document.getElementById('knowledge-graph');
    
    if (!chartDom) {
        console.error('Knowledge graph container not found');
        return;
    }
    
    if (knowledgeGraphChart) {
        knowledgeGraphChart.dispose();
    }
    
    // 确保容器有明确的尺寸
    if (chartDom.offsetWidth === 0 || chartDom.offsetHeight === 0) {
        chartDom.style.width = '100%';
        chartDom.style.height = '600px';
    }
    
    knowledgeGraphChart = echarts.init(chartDom, null, {
        width: chartDom.offsetWidth,
        height: chartDom.offsetHeight
    });
    
    // 获取当前选择的条件
    const graphType = document.querySelector('[data-graph-type].active')?.dataset.graphType || 'risk';
    const depthSlider = document.getElementById('graph-depth-slider');
    const depth = depthSlider ? parseInt(depthSlider.value) : 3;
    const centerNodeSelect = document.getElementById('center-node-select');
    const centerNode = centerNodeSelect ? centerNodeSelect.value : 'alert-001';
    
    // 根据条件生成图谱数据
    const graphData = generateKnowledgeGraphData(graphType, depth, centerNode);
    
    // 准备节点数据
    const nodes = graphData.nodes.map(node => {
        let symbolSize = 50;
        let color = '#10b981';
        
        // 根据风险等级设置颜色
        if (node.risk === 'high') {
            color = '#ef4444';
            symbolSize = 60;
        } else if (node.risk === 'medium') {
            color = '#f59e0b';
            symbolSize = 55;
        } else if (node.risk === 'low') {
            color = '#3b82f6';
        }
        
        return {
            id: node.id,
            name: node.name,
            symbolSize: symbolSize,
            itemStyle: {
                color: color
            },
            label: {
                show: true,
                fontSize: 12
            },
            data: node
        };
    });
    
    // 准备边数据
    const links = graphData.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        label: {
            show: true,
            formatter: edge.relation,
            fontSize: 10
        },
        lineStyle: {
            color: edge.risk ? '#ef4444' : '#9ca3af',
            width: edge.risk ? 3 : 2,
            type: edge.risk ? 'dashed' : 'solid'
        }
    }));
    
    const option = {
        tooltip: {
            formatter: function(params) {
                if (params.dataType === 'node') {
                    const data = params.data.data;
                    return `<strong>${data.name}</strong><br/>类型: ${data.type}<br/>风险: ${data.risk || '正常'}`;
                } else if (params.dataType === 'edge') {
                    return `关系: ${params.data.label.formatter}`;
                }
            }
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                roam: true,
                zoom: 1,
                scaleLimit: {
                    min: 0.2,
                    max: 3
                },
                label: {
                    position: 'bottom'
                },
                force: {
                    repulsion: 150,
                    edgeLength: 120,
                    gravity: 0.05,
                    layoutAnimation: true
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5
                    }
                }
            }
        ]
    };
    
    knowledgeGraphChart.setOption(option);
    
    // 监听布局完成事件
    knowledgeGraphChart.on('finished', function() {
        // 布局完成后，确保图表正确显示
        if (knowledgeGraphChart) {
            knowledgeGraphChart.resize();
        }
    });
    
    // 监听节点点击事件
    knowledgeGraphChart.on('click', function(params) {
        if (params.dataType === 'node') {
            showNodeRiskDetail(params.data.data, graphType);
        }
    });
    
    // 立即调整一次尺寸
    knowledgeGraphChart.resize();
    
    // 延迟再调整一次，确保布局稳定
    setTimeout(() => {
        if (knowledgeGraphChart) {
            knowledgeGraphChart.resize();
        }
    }, 100);
    
    // 响应式
    const resizeHandler = function() {
        if (knowledgeGraphChart) {
            knowledgeGraphChart.resize();
        }
    };
    window.removeEventListener('resize', resizeHandler);
    window.addEventListener('resize', resizeHandler);
    
    // 更新统计信息和分析说明
    updateGraphStatistics(graphData, graphType);
    updateGraphAnalysisDescription(graphData, graphType, depth);
}

// 更新图谱统计信息
function updateGraphStatistics(graphData, graphType) {
    const nodeCount = graphData.nodes.length;
    const edgeCount = graphData.edges.length;
    
    // 计算风险路径（有风险标记的边）
    const riskPathCount = graphData.edges.filter(e => e.risk).length;
    
    // 计算关键节点（高风险节点）
    const keyNodeCount = graphData.nodes.filter(n => n.risk === 'high').length;
    
    document.getElementById('graph-node-count').textContent = nodeCount;
    document.getElementById('graph-edge-count').textContent = edgeCount;
    document.getElementById('graph-risk-path').textContent = riskPathCount;
    document.getElementById('graph-key-node').textContent = keyNodeCount;
}

// 更新图谱分析说明
function updateGraphAnalysisDescription(graphData, graphType, depth) {
    const nodeCount = graphData.nodes.length;
    const edgeCount = graphData.edges.length;
    const highRiskNodes = graphData.nodes.filter(n => n.risk === 'high');
    const mediumRiskNodes = graphData.nodes.filter(n => n.risk === 'medium');
    const riskEdges = graphData.edges.filter(e => e.risk);
    
    // 图谱类型名称
    const graphTypeNames = {
        risk: '风险传导图谱',
        department: '部门关系图谱',
        process: '流程监控图谱',
        event: '事件关联图谱'
    };
    const graphTypeName = graphTypeNames[graphType] || '知识图谱';
    
    // 1. 图谱概览
    let overviewText = `当前展示${graphTypeName}，共包含${nodeCount}个节点和${edgeCount}条关系`;
    if (depth < 5) {
        overviewText += `，显示层级为${depth}层`;
    } else {
        overviewText += `，显示全部层级`;
    }
    overviewText += '。';
    
    if (graphType === 'risk') {
        overviewText += '图中红色节点表示高风险实体，橙色表示中风险，蓝色表示低风险。';
    } else if (graphType === 'department') {
        overviewText += '图中展示了部门间的协作关系和人员分布。';
    } else if (graphType === 'process') {
        overviewText += '图中展示了业务流程的各个环节及其流转关系。';
    } else if (graphType === 'event') {
        overviewText += '图中展示了事件与相关实体的关联关系。';
    }
    
    // 2. 风险识别
    let riskText = '';
    if (highRiskNodes.length === 0 && mediumRiskNodes.length === 0 && riskEdges.length === 0) {
        riskText = '当前图谱中未发现明显风险点，整体风险水平较低。';
    } else {
        const riskParts = [];
        if (highRiskNodes.length > 0) {
            const nodeNames = highRiskNodes.slice(0, 3).map(n => n.name).join('、');
            riskParts.push(`发现${highRiskNodes.length}个高风险节点（如：${nodeNames}${highRiskNodes.length > 3 ? '等' : ''}）`);
        }
        if (mediumRiskNodes.length > 0) {
            riskParts.push(`${mediumRiskNodes.length}个中风险节点`);
        }
        if (riskEdges.length > 0) {
            riskParts.push(`${riskEdges.length}条风险关系`);
        }
        riskText = riskParts.join('，') + '。建议重点关注高风险节点及其关联关系。';
    }
    
    // 3. 关键路径
    let pathText = '';
    if (graphType === 'risk') {
        if (riskEdges.length > 0) {
            pathText = `识别出${riskEdges.length}条风险传导路径，这些路径可能导致风险扩散。建议切断关键风险节点的关联，阻断风险传播。`;
        } else {
            pathText = '当前未发现明显的风险传导路径，各实体间的关联相对独立。';
        }
    } else if (graphType === 'department') {
        const deptNodes = graphData.nodes.filter(n => n.type === 'department');
        pathText = `图中包含${deptNodes.length}个部门节点，通过协作关系形成部门网络。建议加强跨部门协作，提升工作效率。`;
    } else if (graphType === 'process') {
        const stepNodes = graphData.nodes.filter(n => n.type === 'step');
        pathText = `流程包含${stepNodes.length}个环节，各环节按顺序流转。建议重点监控高风险环节，确保流程合规。`;
    } else if (graphType === 'event') {
        pathText = `事件关联了${nodeCount - 1}个相关实体，形成完整的事件关系网络。建议深入分析事件成因，防止类似事件再次发生。`;
    }
    
    // 4. 建议措施
    let suggestionText = '';
    if (graphType === 'risk') {
        if (highRiskNodes.length > 0) {
            suggestionText = '建议：1) 立即核查高风险节点，评估风险程度；2) 加强对风险关系的监控；3) 建立风险预警机制；4) 定期更新风险评估。';
        } else if (mediumRiskNodes.length > 0) {
            suggestionText = '建议：1) 持续关注中风险节点的变化；2) 完善风险管理制度；3) 加强日常监督检查。';
        } else {
            suggestionText = '建议：1) 保持现有管理水平；2) 建立长效监督机制；3) 定期开展风险排查。';
        }
    } else if (graphType === 'department') {
        suggestionText = '建议：1) 优化部门协作机制；2) 加强跨部门沟通；3) 明确部门职责边界；4) 建立协同工作平台。';
    } else if (graphType === 'process') {
        const highRiskSteps = graphData.nodes.filter(n => n.type === 'step' && n.risk === 'high');
        if (highRiskSteps.length > 0) {
            suggestionText = '建议：1) 重点监控高风险环节；2) 完善流程审批机制；3) 加强过程监督；4) 建立异常预警。';
        } else {
            suggestionText = '建议：1) 持续优化流程效率；2) 加强流程合规性检查；3) 定期评估流程执行情况。';
        }
    } else if (graphType === 'event') {
        suggestionText = '建议：1) 深入分析事件根源；2) 追溯责任主体；3) 完善管理制度；4) 建立预防机制，避免类似事件重复发生。';
    }
    
    // 更新页面显示
    document.getElementById('graph-overview-text').textContent = overviewText;
    document.getElementById('graph-risk-text').textContent = riskText;
    document.getElementById('graph-path-text').textContent = pathText;
    document.getElementById('graph-suggestion-text').textContent = suggestionText;
}

// 显示节点风险详情
function showNodeRiskDetail(nodeData, graphType) {
    const detailSection = document.getElementById('node-detail-section');
    const detailContent = document.getElementById('node-detail-content');
    
    if (!detailSection || !detailContent) return;
    
    // 生成详情HTML
    let html = `
        <div class="space-y-4">
            <!-- 基本信息 -->
            <div class="border-b border-gray-200 pb-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">${nodeData.name}</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-500">节点类型</span>
                        <p class="text-sm font-medium text-gray-900">${getNodeTypeName(nodeData.type)}</p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">风险等级</span>
                        <p class="text-sm font-medium">
                            <span class="px-2 py-1 rounded text-xs ${getRiskBadgeClass(nodeData.risk)}">
                                ${getRiskLevelName(nodeData.risk)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- 风险分析 -->
            <div class="border-b border-gray-200 pb-4">
                <h5 class="font-semibold text-gray-900 mb-2 flex items-center">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    风险分析
                </h5>
                <div class="bg-red-50 p-3 rounded">
                    <p class="text-sm text-gray-700">${generateRiskAnalysis(nodeData, graphType)}</p>
                </div>
            </div>
            
            <!-- 相关预警 -->
            <div class="border-b border-gray-200 pb-4">
                <h5 class="font-semibold text-gray-900 mb-2 flex items-center">
                    <i class="fas fa-bell text-yellow-600 mr-2"></i>
                    相关预警
                </h5>
                ${generateRelatedAlerts(nodeData)}
            </div>
            
            <!-- 关联实体 -->
            <div class="border-b border-gray-200 pb-4">
                <h5 class="font-semibold text-gray-900 mb-2 flex items-center">
                    <i class="fas fa-link text-blue-600 mr-2"></i>
                    关联实体
                </h5>
                ${generateRelatedEntities(nodeData, graphType)}
            </div>
            
            <!-- 处置建议 -->
            <div>
                <h5 class="font-semibold text-gray-900 mb-2 flex items-center">
                    <i class="fas fa-lightbulb text-green-600 mr-2"></i>
                    处置建议
                </h5>
                <div class="bg-green-50 p-3 rounded">
                    <p class="text-sm text-gray-700">${generateActionSuggestions(nodeData)}</p>
                </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2 pt-2">
                <button class="btn-primary btn-sm" onclick="viewFullDetails('${nodeData.id}')">
                    <i class="fas fa-search"></i>
                    查看完整档案
                </button>
                <button class="btn-secondary btn-sm" onclick="createWorkOrder('${nodeData.id}')">
                    <i class="fas fa-tasks"></i>
                    创建工单
                </button>
                <button class="btn-secondary btn-sm" onclick="exportNodeReport('${nodeData.id}')">
                    <i class="fas fa-download"></i>
                    导出报告
                </button>
            </div>
        </div>
    `;
    
    detailContent.innerHTML = html;
    detailSection.style.display = 'block';
    
    // 滚动到详情面板
    detailSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 关闭节点详情
function closeNodeDetail() {
    const detailSection = document.getElementById('node-detail-section');
    if (detailSection) {
        detailSection.style.display = 'none';
    }
}

// 获取节点类型名称
function getNodeTypeName(type) {
    const typeNames = {
        alert: '预警',
        department: '部门',
        person: '人员',
        contract: '合同',
        company: '企业',
        process: '流程',
        clue: '线索',
        event: '事件',
        step: '流程环节',
        project: '项目'
    };
    return typeNames[type] || type;
}

// 获取风险等级名称
function getRiskLevelName(risk) {
    const riskNames = {
        high: '高风险',
        medium: '中风险',
        low: '低风险'
    };
    return riskNames[risk] || '正常';
}

// 获取风险徽章样式
function getRiskBadgeClass(risk) {
    const classes = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-yellow-100 text-yellow-700',
        low: 'bg-blue-100 text-blue-700'
    };
    return classes[risk] || 'bg-green-100 text-green-700';
}

// 生成风险分析
function generateRiskAnalysis(nodeData, graphType) {
    if (nodeData.risk === 'high') {
        if (nodeData.type === 'person') {
            return `${nodeData.name}被标记为高风险人员，可能涉及：1) 利益输送或收受贿赂；2) 违规操作或滥用职权；3) 与供应商存在不当关联。建议立即启动核查程序。`;
        } else if (nodeData.type === 'alert') {
            return `该预警为高风险级别，触发了多项风险规则。涉及金额较大或情节严重，需要优先处理。建议立即组织专项调查。`;
        } else if (nodeData.type === 'contract') {
            return `该合同存在高风险，可能存在：1) 招标程序不规范；2) 合同条款异常；3) 执行过程中的违规行为。需要重点审查。`;
        }
    } else if (nodeData.risk === 'medium') {
        return `该节点存在中等风险，建议持续关注并加强监督。定期评估风险变化，必要时升级处置措施。`;
    }
    return `当前风险等级较低，保持常规监督即可。建议定期开展风险排查，防止风险升级。`;
}

// 生成相关预警
function generateRelatedAlerts(nodeData) {
    // 模拟预警数据
    const alerts = [
        { 
            id: 'YJ2025001', 
            no: 'YJ2025-001',
            title: '采购金额异常预警', 
            level: 'high', 
            date: '2025-10-20', 
            status: '待处理',
            description: '该采购项目金额超出预算30%，且未经过必要的审批程序'
        },
        { 
            id: 'YJ2025002', 
            no: 'YJ2025-002',
            title: '关联关系预警', 
            level: 'medium', 
            date: '2025-10-15', 
            status: '处理中',
            description: '发现采购人员与供应商存在亲属关系，可能存在利益输送'
        },
        { 
            id: 'YJ2025003', 
            no: 'YJ2025-003',
            title: '流程合规性预警', 
            level: 'low', 
            date: '2025-10-10', 
            status: '已处理',
            description: '采购流程中部分审批环节未按规定时限完成'
        }
    ];
    
    if (nodeData.risk !== 'high' && nodeData.risk !== 'medium') {
        return '<p class="text-sm text-gray-500">暂无相关预警</p>';
    }
    
    let html = '<div class="space-y-2">';
    alerts.slice(0, 3).forEach(alert => {
        html += `
            <div class="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer" 
                 onclick="viewAlertDetail('${alert.id}', '${alert.no}')">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-xs font-mono text-blue-600">${alert.no}</span>
                            <span class="px-2 py-0.5 rounded text-xs ${getRiskBadgeClass(alert.level)}">
                                ${getRiskLevelName(alert.level)}
                            </span>
                        </div>
                        <p class="text-sm font-medium text-gray-900">${alert.title}</p>
                        <p class="text-xs text-gray-500 mt-1">${alert.date} · ${alert.status}</p>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400 text-sm mt-1"></i>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// 生成关联实体
function generateRelatedEntities(nodeData, graphType) {
    // 模拟关联实体数据
    const entities = {
        person: [
            { name: '采购合同A', type: 'contract', relation: '签订' },
            { name: '供应商X', type: 'company', relation: '关联' },
            { name: '计算机学院', type: 'department', relation: '所属' }
        ],
        department: [
            { name: '张三', type: 'person', relation: '部门成员' },
            { name: '实验室建设项目', type: 'project', relation: '负责' },
            { name: '经济管理学院', type: 'department', relation: '协作' }
        ]
    };
    
    const related = entities[nodeData.type] || [];
    
    if (related.length === 0) {
        return '<p class="text-sm text-gray-500">暂无关联实体</p>';
    }
    
    let html = '<div class="space-y-2">';
    related.forEach(entity => {
        html += `
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">${entity.name}</span>
                    <span class="text-xs text-gray-500">(${getNodeTypeName(entity.type)})</span>
                </div>
                <span class="text-xs text-blue-600">${entity.relation}</span>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// 生成处置建议
function generateActionSuggestions(nodeData) {
    if (nodeData.risk === 'high') {
        return `1. 立即暂停相关业务活动；2. 启动专项调查程序；3. 固定相关证据材料；4. 必要时采取组织措施；5. 及时上报上级部门。`;
    } else if (nodeData.risk === 'medium') {
        return `1. 加强日常监督检查；2. 约谈相关责任人；3. 完善相关管理制度；4. 定期跟踪风险变化；5. 做好预防性工作。`;
    }
    return `1. 保持常规监督；2. 定期开展风险排查；3. 加强教育培训；4. 完善内控机制；5. 建立长效管理制度。`;
}

// 查看预警详情
function viewAlertDetail(alertId, alertNo) {
    console.log('viewAlertDetail called with:', alertId, alertNo);
    
    // 模拟预警详细数据
    const alertDetails = {
        'YJ2025001': {
            no: 'YJ2025-001',
            title: '采购金额异常预警',
            level: 'high',
            status: '待处理',
            createTime: '2025-10-20 14:30:25',
            updateTime: '2025-10-20 14:30:25',
            department: '计算机学院',
            person: '张三',
            amount: '120万元',
            description: '该采购项目金额超出预算30%，且未经过必要的审批程序。经系统自动比对发现，该项目预算为92万元，实际采购金额达到120万元，超出预算28万元。',
            riskPoints: [
                '采购金额超出预算30%',
                '未按规定履行追加预算审批程序',
                '采购需求论证不充分',
                '供应商选择过程存在疑点'
            ],
            relatedContracts: ['合同编号：HT2025-CS-001'],
            relatedCompanies: ['某某科技有限公司'],
            suggestions: [
                '立即暂停合同执行',
                '启动专项审计调查',
                '约谈相关责任人',
                '完善采购管理制度'
            ]
        },
        'YJ2025002': {
            no: 'YJ2025-002',
            title: '关联关系预警',
            level: 'medium',
            status: '处理中',
            createTime: '2025-10-15 09:15:30',
            updateTime: '2025-10-22 16:20:10',
            department: '计算机学院',
            person: '张三',
            description: '通过大数据比对发现，采购负责人张三与中标供应商法人王五存在亲属关系（表兄弟关系），可能存在利益输送风险。',
            riskPoints: [
                '采购人员与供应商存在亲属关系',
                '未按规定进行回避',
                '该供应商近期中标率异常偏高',
                '合同价格高于市场平均水平15%'
            ],
            relatedContracts: ['HT2025-CS-001', 'HT2024-CS-089'],
            relatedCompanies: ['某某科技有限公司'],
            suggestions: [
                '调查关联关系的具体情况',
                '核查历史采购记录',
                '评估是否存在利益输送',
                '完善回避制度'
            ]
        },
        'YJ2025003': {
            no: 'YJ2025-003',
            title: '流程合规性预警',
            level: 'low',
            status: '已处理',
            createTime: '2025-10-10 11:20:15',
            updateTime: '2025-10-18 15:45:30',
            department: '计算机学院',
            person: '张三',
            description: '采购流程中部分审批环节未按规定时限完成，审批环节耗时超过规定时限3天。',
            riskPoints: [
                '审批时限超期3天',
                '部分审批意见填写不规范',
                '缺少必要的附件材料'
            ],
            relatedContracts: ['HT2025-CS-001'],
            relatedCompanies: ['某某科技有限公司'],
            suggestions: [
                '加强流程时限管理',
                '规范审批意见填写',
                '完善材料审核机制'
            ],
            handleResult: '已督促相关部门完善流程，补充相关材料，加强时限管理。'
        }
    };
    
    const detail = alertDetails[alertId];
    
    if (!detail) {
        alert('预警详情加载失败');
        return;
    }
    
    // 创建模态框显示预警详情
    const modal = document.createElement('div');
    modal.id = 'alertDetailModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); max-width: 48rem; width: 100%; margin: 0 1rem; max-height: 90vh; overflow-y: auto;" 
             onclick="event.stopPropagation()">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900">预警详情</h3>
                <button onclick="document.getElementById('alertDetailModal').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- 基本信息 -->
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-3">
                            <span class="text-lg font-mono font-semibold text-blue-600">${detail.no}</span>
                            <span class="px-3 py-1 rounded ${getRiskBadgeClass(detail.level)}">
                                ${getRiskLevelName(detail.level)}
                            </span>
                            <span class="px-3 py-1 rounded text-xs ${getStatusBadgeClass(detail.status)}">
                                ${detail.status}
                            </span>
                        </div>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-2">${detail.title}</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-500">涉及部门：</span>
                            <span class="text-gray-900">${detail.department}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">涉及人员：</span>
                            <span class="text-gray-900">${detail.person}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">创建时间：</span>
                            <span class="text-gray-900">${detail.createTime}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">更新时间：</span>
                            <span class="text-gray-900">${detail.updateTime}</span>
                        </div>
                    </div>
                </div>
                
                <!-- 预警描述 -->
                <div>
                    <h5 class="font-semibold text-gray-900 mb-2 flex items-center">
                        <i class="fas fa-file-alt text-blue-600 mr-2"></i>
                        预警描述
                    </h5>
                    <p class="text-sm text-gray-700 leading-relaxed">${detail.description}</p>
                </div>
                
                <!-- 风险点 -->
                <div>
                    <h5 class="font-semibold text-gray-900 mb-2 flex items-center">
                        <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                        风险点识别
                    </h5>
                    <ul class="space-y-2">
                        ${detail.riskPoints.map(point => `
                            <li class="flex items-start text-sm">
                                <i class="fas fa-circle text-red-500 text-xs mr-2 mt-1"></i>
                                <span class="text-gray-700">${point}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- 关联信息 -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <h5 class="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                            <i class="fas fa-file-contract text-purple-600 mr-2"></i>
                            关联合同
                        </h5>
                        <div class="space-y-1">
                            ${(detail.relatedContracts || []).map(contract => `
                                <p class="text-sm text-gray-700">${contract}</p>
                            `).join('') || '<p class="text-sm text-gray-500">暂无</p>'}
                        </div>
                    </div>
                    <div>
                        <h5 class="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                            <i class="fas fa-building text-green-600 mr-2"></i>
                            关联企业
                        </h5>
                        <div class="space-y-1">
                            ${(detail.relatedCompanies || []).map(company => `
                                <p class="text-sm text-gray-700">${company}</p>
                            `).join('') || '<p class="text-sm text-gray-500">暂无</p>'}
                        </div>
                    </div>
                </div>
                
                <!-- 处置建议 -->
                <div>
                    <h5 class="font-semibold text-gray-900 mb-2 flex items-center">
                        <i class="fas fa-lightbulb text-yellow-600 mr-2"></i>
                        处置建议
                    </h5>
                    <ul class="space-y-2">
                        ${detail.suggestions.map((suggestion, index) => `
                            <li class="flex items-start text-sm">
                                <span class="text-blue-600 font-medium mr-2">${index + 1}.</span>
                                <span class="text-gray-700">${suggestion}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                ${detail.handleResult ? `
                    <!-- 处理结果 -->
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h5 class="font-semibold text-gray-900 mb-2 flex items-center">
                            <i class="fas fa-check-circle text-green-600 mr-2"></i>
                            处理结果
                        </h5>
                        <p class="text-sm text-gray-700">${detail.handleResult}</p>
                    </div>
                ` : ''}
                
                <!-- 操作按钮 -->
                <div class="flex space-x-3 pt-4 border-t border-gray-200">
                    <button class="btn-primary flex-1" onclick="createWorkOrderFromAlert('${alertId}')">
                        <i class="fas fa-tasks mr-2"></i>
                        创建处置工单
                    </button>
                    <button class="btn-secondary flex-1" onclick="exportAlertReport('${alertId}')">
                        <i class="fas fa-download mr-2"></i>
                        导出预警报告
                    </button>
                    <button class="btn-secondary" onclick="document.getElementById('alertDetailModal').remove()">
                        关闭
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('Modal appended to body, z-index:', modal.style.zIndex);
}

// 获取状态徽章样式
function getStatusBadgeClass(status) {
    const classes = {
        '待处理': 'bg-yellow-100 text-yellow-700',
        '处理中': 'bg-blue-100 text-blue-700',
        '已处理': 'bg-green-100 text-green-700',
        '已关闭': 'bg-gray-100 text-gray-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
}

// 从预警创建工单
function createWorkOrderFromAlert(alertId) {
    alert('从预警创建工单功能开发中...\n预警ID: ' + alertId);
}

// 导出预警报告
function exportAlertReport(alertId) {
    alert('导出预警报告功能开发中...\n预警ID: ' + alertId);
}

// 查看完整档案（占位函数）
function viewFullDetails(nodeId) {
    alert('查看完整档案功能开发中...\n节点ID: ' + nodeId);
}

// 创建工单（占位函数）
function createWorkOrder(nodeId) {
    alert('创建工单功能开发中...\n节点ID: ' + nodeId);
}

// 导出报告（占位函数）
function exportNodeReport(nodeId) {
    alert('导出报告功能开发中...\n节点ID: ' + nodeId);
}

// 图谱工具函数
function zoomIn() {
    if (knowledgeGraphChart) {
        const option = knowledgeGraphChart.getOption();
        const currentZoom = option.series[0].zoom || 1;
        knowledgeGraphChart.setOption({
            series: [{
                zoom: Math.min(currentZoom * 1.2, 3)
            }]
        });
    }
}

function zoomOut() {
    if (knowledgeGraphChart) {
        const option = knowledgeGraphChart.getOption();
        const currentZoom = option.series[0].zoom || 1;
        knowledgeGraphChart.setOption({
            series: [{
                zoom: Math.max(currentZoom * 0.8, 0.3)
            }]
        });
    }
}

function fitView() {
    if (knowledgeGraphChart) {
        knowledgeGraphChart.setOption({
            series: [{
                zoom: 1,
                center: null
            }]
        });
        knowledgeGraphChart.resize();
    }
}

function relayout() {
    if (knowledgeGraphChart) {
        const option = knowledgeGraphChart.getOption();
        knowledgeGraphChart.setOption({
            series: [{
                layout: 'force',
                force: {
                    repulsion: 100,
                    edgeLength: 150
                }
            }]
        });
    }
}

function toggleLabels() {
    if (knowledgeGraphChart) {
        const option = knowledgeGraphChart.getOption();
        const showLabel = !option.series[0].label.show;
        knowledgeGraphChart.setOption({
            series: [{
                label: {
                    show: showLabel
                }
            }]
        });
    }
}

// 导出为全局函数供 HTML 调用
window.viewAlertDetail = viewAlertDetail;
window.createWorkOrderFromAlert = createWorkOrderFromAlert;
window.exportAlertReport = exportAlertReport;
window.closeNodeDetail = closeNodeDetail;
window.viewFullDetails = viewFullDetails;
window.createWorkOrder = createWorkOrder;
window.exportNodeReport = exportNodeReport;
window.updateTrendChart = updateTrendChart;
window.updateKnowledgeGraph = updateKnowledgeGraph;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.fitView = fitView;
window.relayout = relayout;
window.toggleLabels = toggleLabels;
