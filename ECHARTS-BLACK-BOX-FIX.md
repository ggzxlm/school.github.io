# ECharts 黑色矩形框修复方案

## 🐛 问题描述

在监督指挥中心页面，鼠标悬停在图表上时会出现一个黑色的矩形框，该框会：
- 随鼠标移动而移动
- 会放大缩小
- 遮挡图表内容
- 影响用户体验

## 🔍 问题分析

经过分析，黑色矩形框可能来自以下几个ECharts组件：

1. **axisPointer（坐标轴指示器）**
   - 用于在坐标轴上显示指示线或阴影
   - 默认可能有黑色边框

2. **visualMap手柄**
   - 视觉映射组件的拖动手柄
   - 可能有黑色边框

3. **SVG元素**
   - ECharts内部的SVG矩形元素
   - 可能使用了黑色填充

## ✅ 修复方案

### 1. JavaScript修复

#### 修改axisPointer配置
将所有图表的axisPointer从`shadow`或`cross`类型改为`line`类型：

```javascript
// 修改前
axisPointer: {
    type: 'cross',  // 或 'shadow'
    label: {
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
    }
}

// 修改后
axisPointer: {
    type: 'line',
    lineStyle: {
        color: 'rgba(59, 130, 246, 0.5)',
        width: 1,
        type: 'dashed'
    },
    label: {
        show: false  // 隐藏label
    }
}
```

#### 修改visualMap配置
为散点图的visualMap添加透明边框：

```javascript
visualMap: {
    // ... 其他配置
    handleStyle: {
        color: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'transparent'  // 透明边框
    },
    borderColor: 'transparent',
    backgroundColor: 'transparent'
}
```

### 2. CSS修复

添加强力的CSS规则来隐藏所有可能的黑色元素：

```css
/* 隐藏axisPointer的黑色矩形框 */
.chart-body div[class*="echarts-axis-pointer"] {
    display: none !important;
}

/* 隐藏所有可能的黑色边框元素 */
.chart-body rect[fill="#000"],
.chart-body rect[fill="#000000"],
.chart-body rect[fill="black"],
.chart-body rect[stroke="#000"],
.chart-body rect[stroke="#000000"],
.chart-body rect[stroke="black"] {
    display: none !important;
    opacity: 0 !important;
}

/* 隐藏所有SVG中的黑色矩形 */
.chart-body svg rect[fill="rgb(0,0,0)"],
.chart-body svg rect[fill="rgba(0,0,0,1)"] {
    fill: transparent !important;
    stroke: transparent !important;
}

/* 隐藏visualMap的手柄黑色边框 */
.chart-body .echarts-visual-map-handle {
    stroke: transparent !important;
    fill: rgba(59, 130, 246, 0.8) !important;
}

/* 确保所有黑色填充都被隐藏 */
.chart-body [fill="#000"],
.chart-body [fill="#000000"],
.chart-body [fill="rgb(0, 0, 0)"],
.chart-body [fill="rgba(0, 0, 0, 1)"] {
    fill: transparent !important;
    opacity: 0 !important;
}
```

## 📋 修改的文件

### js/command-center.js
1. 添加全局ECharts主题配置
2. 修改线索趋势分析图的axisPointer（第243行）
3. 修改单位风险排名图的axisPointer（第387行）
4. 修改风险热力分布图的visualMap（第555行）

### css/command-center.css
1. 添加隐藏axisPointer的CSS规则
2. 添加隐藏黑色SVG元素的CSS规则
3. 添加隐藏visualMap手柄边框的CSS规则
4. 添加通用的黑色元素隐藏规则

## 🎯 测试清单

- [ ] 线索趋势分析图 - 鼠标悬停无黑色框
- [ ] 单位风险排名图 - 鼠标悬停无黑色框
- [ ] 风险热力分布图 - 鼠标悬停无黑色框
- [ ] 问题类型分布图 - 鼠标悬停无黑色框
- [ ] 涉及单位分布图 - 鼠标悬停无黑色框
- [ ] visualMap拖动手柄无黑色边框
- [ ] 所有图表交互正常

## 🔧 调试技巧

如果问题仍然存在，可以使用浏览器开发者工具：

1. **检查元素**
   - 右键点击黑色框 → 检查元素
   - 查看是哪个SVG元素或div

2. **查看样式**
   - 检查该元素的fill、stroke属性
   - 查看是否有黑色值

3. **添加针对性CSS**
   ```css
   /* 根据实际元素添加规则 */
   .chart-body .具体类名 {
       display: none !important;
   }
   ```

## 💡 预防措施

### 1. 统一配置
创建通用的tooltip和axisPointer配置：

```javascript
const commonChartConfig = {
    tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'transparent',
        borderWidth: 0,
        textStyle: { color: '#e2e8f0', fontSize: 13 }
    },
    axisPointer: {
        type: 'line',
        lineStyle: {
            color: 'rgba(59, 130, 246, 0.5)',
            width: 1,
            type: 'dashed'
        },
        label: { show: false }
    }
};
```

### 2. 使用ECharts主题
定义自定义主题，避免默认的黑色元素：

```javascript
echarts.registerTheme('dark-custom', {
    backgroundColor: 'transparent',
    textStyle: { color: '#e2e8f0' },
    // 禁用默认的黑色边框
    axisPointer: {
        lineStyle: { color: 'rgba(59, 130, 246, 0.5)' }
    }
});
```

### 3. CSS全局规则
在全局CSS中添加规则，防止任何黑色元素出现：

```css
/* 全局禁用ECharts黑色元素 */
[class*="echarts"] rect[fill="#000"],
[class*="echarts"] rect[fill="black"],
[class*="echarts"] [fill="rgb(0,0,0)"] {
    fill: transparent !important;
    display: none !important;
}
```

## 📝 注意事项

1. **浏览器缓存**
   - 修改后需要强制刷新（Ctrl+Shift+R）
   - 或清除浏览器缓存

2. **CSS优先级**
   - 使用`!important`确保样式生效
   - 确保CSS文件在HTML中正确引入

3. **ECharts版本**
   - 确认使用的ECharts版本
   - 不同版本的API可能有差异

4. **性能影响**
   - CSS规则不会影响性能
   - JavaScript配置修改不影响图表功能

## 🚀 后续优化

1. **统一图表配置**
   - 创建配置文件统一管理
   - 避免重复代码

2. **主题系统**
   - 完善自定义主题
   - 支持主题切换

3. **组件封装**
   - 封装常用图表组件
   - 统一样式和交互

---

**修复时间**: 2025-10-28  
**修复状态**: 🔄 进行中  
**需要测试**: ✅ 是
