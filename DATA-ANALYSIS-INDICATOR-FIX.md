# 数据分析指标选择功能修复说明

## 🐛 问题描述

在数据分析页面（`data-analysis.html`）的指标分析模块中，选择不同的指标复选框后，图表没有相应更新。

## 🔍 问题原因

1. **缺少事件绑定**：指标复选框没有绑定 `change` 事件监听器
2. **数据结构固定**：图表只显示固定的"预警数量"和"线索数量"两个指标
3. **未读取选中状态**：代码没有读取复选框的选中状态

## ✅ 修复方案

### 1. 添加复选框事件监听

在 `initIndicatorAnalysis()` 函数中添加：

```javascript
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
```

### 2. 新增获取选中指标函数

```javascript
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
```

### 3. 重构数据结构

将原来的固定数据结构：
```javascript
let categories, alerts, clues;
```

改为动态数据映射：
```javascript
let categories;
const dataMap = {};

// 为每个指标准备数据
dataMap['预警数量'] = [...];
dataMap['线索数量'] = [...];
dataMap['整改完成率'] = [...];
dataMap['平均处置时长'] = [...];
dataMap['超期率'] = [...];
```

### 4. 动态构建图表系列

根据选中的指标动态构建系列数据：

```javascript
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
```

## 📊 支持的指标

现在支持以下5个指标的动态切换：

1. ✅ **预警数量** - 默认选中
2. ✅ **线索数量** - 默认选中
3. ✅ **整改完成率**
4. ✅ **平均处置时长**
5. ✅ **超期率**

## 🎯 功能特点

### 1. 多指标同时显示
- 可以同时选中多个指标
- 图表会显示所有选中指标的数据
- 每个指标使用不同的颜色区分

### 2. 支持所有图表类型
- **柱状图**：多个指标并排显示
- **折线图**：多条折线同时显示
- **饼图**：显示第一个选中指标的分布

### 3. 支持所有维度
- **按部门**：显示各部门的指标数据
- **按时间**：显示时间序列的指标数据
- **按类型**：显示各类型的指标数据
- **按等级**：显示各风险等级的指标数据

## 🧪 测试步骤

### 测试1：单个指标切换
1. 打开数据分析页面
2. 取消勾选"预警数量"
3. 勾选"整改完成率"
4. 观察图表是否更新为整改完成率数据

### 测试2：多个指标同时显示
1. 同时勾选"预警数量"、"线索数量"、"整改完成率"
2. 观察图表是否显示3个系列的数据
3. 检查图例是否正确显示

### 测试3：图表类型切换
1. 选中多个指标
2. 切换柱状图、折线图、饼图
3. 观察每种图表类型是否正确显示

### 测试4：维度切换
1. 选中指标后
2. 切换"按部门"、"按时间"、"按类型"、"按等级"
3. 观察数据是否正确更新

## 📝 使用示例

### 示例1：查看各部门的预警和线索情况
```
1. 选择维度：按部门
2. 选择指标：预警数量 ✓、线索数量 ✓
3. 图表类型：柱状图
结果：显示各部门的预警和线索对比
```

### 示例2：查看整改完成率趋势
```
1. 选择维度：按时间
2. 选择指标：整改完成率 ✓
3. 图表类型：折线图
结果：显示整改完成率的时间趋势
```

### 示例3：查看多个指标的综合情况
```
1. 选择维度：按部门
2. 选择指标：预警数量 ✓、整改完成率 ✓、超期率 ✓
3. 图表类型：柱状图
结果：同时显示3个指标的对比
```

## 🎨 颜色方案

指标使用以下颜色进行区分：
- 第1个指标：蓝色 (#3b82f6)
- 第2个指标：绿色 (#10b981)
- 第3个指标：橙色 (#f59e0b)
- 第4个指标：红色 (#ef4444)
- 第5个指标：紫色 (#8b5cf6)

## 🔄 数据流程

```
用户勾选指标
    ↓
触发 change 事件
    ↓
调用 getSelectedIndicators()
    ↓
获取选中的指标列表
    ↓
调用 updateIndicatorChart()
    ↓
从 dataMap 获取对应数据
    ↓
构建图表系列
    ↓
更新 ECharts 图表
```

## 📈 性能优化

1. **图表复用**：使用 `dispose()` 销毁旧图表，避免内存泄漏
2. **事件委托**：使用 `forEach` 绑定事件，确保所有复选框都响应
3. **数据缓存**：数据存储在 `dataMap` 中，避免重复计算

## 🚀 后续优化建议

1. **数据持久化**：记住用户的指标选择偏好
2. **自定义颜色**：允许用户自定义指标颜色
3. **数据导出**：支持导出选中指标的数据
4. **对比分析**：支持不同时间段的指标对比

---

**修复时间**：2025-10-28  
**版本**：v1.0  
**状态**：✅ 已修复
