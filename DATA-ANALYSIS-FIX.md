# 数据分析页面维度切换修复

## 问题描述
在data-analysis.html页面中，点击不同的维度按钮（按部门、按时间、按类型、按等级）后，图表没有相应变化，始终显示按部门的数据。

## 问题原因
`updateIndicatorChart`函数没有根据选中的维度来获取不同的数据，始终使用`mockData.indicatorData`（部门数据）。

## 解决方案

### 1. 获取当前选中的维度
```javascript
const activeDimension = document.querySelector('.dimension-tag.active');
const dimension = activeDimension ? activeDimension.dataset.dimension : 'department';
```

### 2. 根据维度获取不同的数据
- **按部门**：显示各部门的预警和线索数量
- **按时间**：显示各月份的预警和线索数量
- **按类型**：显示各类型（科研经费、采购管理等）的数量
- **按等级**：显示各风险等级（高、中、低）的数量

### 3. 更新图表配置
将所有图表类型（柱状图、折线图、饼图）中的`departments`变量改为`categories`，使其能够适应不同维度的数据。

## 测试步骤

1. 强制刷新浏览器（Ctrl+Shift+R）
2. 打开data-analysis.html页面
3. 点击"按时间"按钮，验证图表显示月份数据
4. 点击"按类型"按钮，验证图表显示类型数据
5. 点击"按等级"按钮，验证图表显示等级数据
6. 切换图表类型（柱状图、折线图、饼图），验证都能正常显示

## 文件更新
- `js/data-analysis.js` - 修复维度切换逻辑（v2.0）
- `data-analysis.html` - 更新版本号（v2.0）

## 更新时间
2025-10-28
