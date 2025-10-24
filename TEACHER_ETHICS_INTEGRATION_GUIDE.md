# 师德师风监督模块集成指南

## 完成的工作

已完善师德师风监督模块，包含三个子功能：
1. **师德预警** - 5条记录
2. **学术不端检测** - 4条记录  
3. **违规补课监控** - 4条记录

## 文件说明

- `teacher_ethics_supervision_complete.js` - 完整的师德师风模块代码
- `discipline-supervision.html` - 已更新HTML结构（添加了三个表格）

## 集成步骤

### 1. 更新 HTML（已完成）
已在 `discipline-supervision.html` 中：
- 更新了师德预警表格，添加ID `teacherEthicsTable`
- 添加了学术不端检测表格，ID `academicMisconductTable`
- 添加了违规补课监控表格，ID `illegalTutoringTable`

### 2. 更新 JS 文件

需要在 `js/discipline-supervision.js` 中：

#### 步骤 A：在文件开头添加数据数组
在文件开头（第1行之后）添加以下数据：
```javascript
// ==================== 师德师风监督数据 ====================
const teacherEthicsWarningData = [/* 从 teacher_ethics_supervision_complete.js 复制 */];
const academicMisconductData = [/* 从 teacher_ethics_supervision_complete.js 复制 */];
const illegalTutoringData = [/* 从 teacher_ethics_supervision_complete.js 复制 */];
```

#### 步骤 B：替换 loadTeacherEthicsModule 函数
找到第3836行的 `function loadTeacherEthicsModule()` 函数，替换为：
```javascript
function loadTeacherEthicsModule() {
    loadTeacherEthicsWarning();
    loadAcademicMisconductDetection();
    loadIllegalTutoringMonitoring();
}
```

#### 步骤 C：添加三个加载函数
在 loadTeacherEthicsModule 之后添加：
- `loadTeacherEthicsWarning()`
- `loadAcademicMisconductDetection()`
- `loadIllegalTutoringMonitoring()`

#### 步骤 D：替换详情函数
替换现有的 `viewTeacherEthicsDetail()` 函数，并添加：
- `viewTeacherWarningDetail(teacherId)`
- `viewAcademicMisconductDetail(teacherId)`
- `viewTutoringDetail(teacherId)`

## 数据特点

### 师德预警数据
- 包含教师基本信息、预警类型、综合评分、举报次数
- 数据来源：学生评教、同事举报、督导反馈等
- 详情展示：教师信息、预警评估、数据来源表格、问题与建议

### 学术不端检测数据
- 包含论文信息、不端类型（抄袭/造假/一稿多投/署名争议）
- 相似度检测、风险等级评估
- 详情展示：教师信息、论文信息、详细信息、证据与建议

### 违规补课监控数据
- 包含培训机构、补课科目、学生人数、违规收入
- 举报来源、调查结果
- 详情展示：教师信息、补课信息、调查情况、违规证据与建议

## 数据一致性

所有详情函数都通过 `teacherId` 从数据数组中查找对应记录，确保：
- 列表页面显示的数据与详情页面完全一致
- 不会出现数据不匹配的情况
- 所有字段都有对应的数据源

## 典型案例

### 案例1：张某某 - 师德失范（高风险）
- 综合评分：2.8分
- 举报次数：3次
- 主要问题：课堂言论不当、对学生态度恶劣
- 数据来源：学生评教(2.5分)、同事举报、学生投诉

### 案例2：李某某 - 论文抄袭（高风险）
- 相似度：45%
- 论文：《关于微分方程的数值解法研究》
- 主要问题：第3-7页内容高度相似、核心算法照搬

### 案例3：王某某 - 违规补课（高风险）
- 违规收入：4.5万元
- 培训机构：某某培训机构
- 主要问题：教授本校学生、收费较高

## 注意事项

1. 确保 `formatNumber()` 函数已定义（用于格式化金额）
2. 确保 `Toast.error()` 函数已定义（用于错误提示）
3. 确保 `showDetailModal()` 函数已定义（用于显示详情弹窗）
4. 所有数据数组需要在函数定义之前声明

## 完整代码位置

完整代码在 `teacher_ethics_supervision_complete.js` 文件中，包含：
- 3个数据数组（共13条记录）
- 1个主加载函数
- 3个子加载函数
- 3个详情函数

总计约700行代码。
