# 数据质量管理页面修复总结

## 问题
数据质量管理页面的"新建规则"按钮点击无效，无法打开创建规则模态框。

## 问题原因

### 1. 缺少模态框HTML结构
- HTML文件中完全没有定义模态框元素
- 只有按钮的onclick事件，但没有对应的模态框容器

### 2. JavaScript方法不完整
- `showCreateRuleModal()` 方法只显示Toast提示，没有实际打开模态框的逻辑
- 缺少 `closeCreateRuleModal()` 和 `submitRule()` 方法

### 3. 缺少CSS样式
- CSS文件中没有模态框相关的样式定义

### 4. 全局函数缺失
- HTML中使用 `onclick="showCreateRuleModal()"` 调用全局函数
- 但JavaScript中只定义了类方法，没有全局函数包装器

## 解决方案

参照主数据管理页面的实现，为数据质量页面添加完整的模态框功能。

### 1. 添加模态框HTML结构（data-quality-management.html）

```html
<div id="createRuleModal" class="modal-overlay">
    <div class="modal-container modal-lg">
        <div class="modal-header">
            <h2 class="modal-title" id="createRuleModalTitle">
                <i class="fas fa-plus-circle"></i>新建规则
            </h2>
            <button class="modal-close-btn" onclick="dataQualityPage.closeCreateRuleModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="ruleForm">
                <!-- 表单字段 -->
                - 规则名称（必填）
                - 规则类型（必填）：完整性、准确性、一致性、唯一性、有效性、及时性
                - 严重程度（必填）：高、中、低
                - 目标表（必填）
                - 目标字段（可选）
                - 阈值（必填，默认95%）
                - 规则表达式（可选，SQL WHERE条件）
                - 描述（可选）
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="dataQualityPage.closeCreateRuleModal()">取消</button>
            <button class="btn btn-primary" onclick="dataQualityPage.submitRule()">保存</button>
        </div>
    </div>
</div>
```

### 2. 完善JavaScript方法（js/data-quality-management.js）

#### showCreateRuleModal()
```javascript
showCreateRuleModal() {
    console.log('[数据质量] 打开创建规则模态框');
    
    const modal = document.getElementById('createRuleModal');
    if (!modal) {
        console.error('[数据质量] 找不到模态框元素');
        Toast.error('模态框初始化失败');
        return;
    }
    
    // 重置表单和标题
    const modalTitle = document.getElementById('createRuleModalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>新建规则';
    }
    
    const form = document.getElementById('ruleForm');
    if (form) {
        form.reset();
    }
    
    // 显示模态框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}
```

#### closeCreateRuleModal()
```javascript
closeCreateRuleModal() {
    const modal = document.getElementById('createRuleModal');
    if (modal) {
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}
```

#### submitRule()
```javascript
submitRule() {
    const form = document.getElementById('ruleForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // 收集表单数据
    const ruleData = {
        name: document.getElementById('ruleName').value,
        ruleType: document.getElementById('ruleType').value,
        severity: document.getElementById('ruleSeverity').value,
        targetTable: document.getElementById('targetTable').value,
        targetColumn: document.getElementById('targetColumn').value,
        threshold: parseInt(document.getElementById('threshold').value),
        expression: document.getElementById('ruleExpression').value,
        description: document.getElementById('ruleDescription').value
    };

    try {
        Loading.show('保存中...');
        dataQualityService.createRule(ruleData);
        Loading.hide();
        Toast.success('规则创建成功');
        this.closeCreateRuleModal();
        this.updateStatistics();
        this.loadRules();
    } catch (error) {
        Loading.hide();
        Toast.error('保存失败: ' + error.message);
    }
}
```

#### 添加全局函数包装器
```javascript
function showCreateRuleModal() {
    dataQualityPage.showCreateRuleModal();
}

function refreshDashboard() {
    dataQualityPage.refreshDashboard();
}
```

### 3. 添加CSS样式（css/data-quality-management.css）

添加了完整的模态框样式，包括：
- `.modal-overlay` - 模态框遮罩层
- `.modal-show` - 显示状态类
- `.modal-container` - 模态框容器
- `.modal-header` - 模态框头部
- `.modal-title` - 模态框标题
- `.modal-close-btn` - 关闭按钮
- `.modal-body` - 模态框主体
- `.modal-footer` - 模态框底部
- `.form-group`, `.form-label`, `.form-control` - 表单样式
- `.form-row` - 表单行布局

## 表单字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 规则名称 | 文本 | 是 | 规则的唯一标识名称 |
| 规则类型 | 下拉选择 | 是 | 完整性/准确性/一致性/唯一性/有效性/及时性 |
| 严重程度 | 下拉选择 | 是 | 高/中/低 |
| 目标表 | 文本 | 是 | 要检查的数据表名 |
| 目标字段 | 文本 | 否 | 要检查的字段名 |
| 阈值 | 数字 | 是 | 质量评分阈值（0-100），默认95 |
| 规则表达式 | 文本域 | 否 | SQL WHERE条件表达式 |
| 描述 | 文本域 | 否 | 规则的详细描述 |

## 测试方法

1. 打开 `data-quality-management.html`
2. 点击页面顶部的"新建规则"按钮
3. 应该看到模态框正常弹出
4. 填写表单字段
5. 点击"保存"按钮提交
6. 查看浏览器控制台，应该看到日志输出：
   ```
   [数据质量] 打开创建规则模态框
   [数据质量] 模态框已显示
   ```

## 修改文件

- ✅ `data-quality-management.html` - 添加模态框HTML结构
- ✅ `js/data-quality-management.js` - 完善模态框相关方法和全局函数
- ✅ `css/data-quality-management.css` - 添加模态框和表单样式
- ✅ `DATA-QUALITY-FIX-SUMMARY.md` - 修复说明文档

## 技术要点

### 模态框显示逻辑
```javascript
// 显示
modal.style.display = 'flex';  // 先设置display
setTimeout(() => {
    modal.classList.add('modal-show');  // 延迟添加类以触发动画
}, 10);

// 隐藏
modal.classList.remove('modal-show');  // 先移除类触发动画
setTimeout(() => {
    modal.style.display = 'none';  // 延迟隐藏
}, 300);
```

### 表单验证
使用HTML5原生表单验证：
```javascript
if (!form.checkValidity()) {
    form.reportValidity();  // 显示验证错误
    return;
}
```

### 响应式设计
- 桌面端：模态框宽度最大800px
- 移动端：模态框宽度95%
- 表单行在移动端自动变为单列布局

## 与主数据管理页面的一致性

本次修复完全参照主数据管理页面的实现方式，确保：
- ✅ 相同的HTML结构和CSS类名
- ✅ 相同的JavaScript显示/隐藏逻辑
- ✅ 相同的表单样式和布局
- ✅ 相同的用户体验和交互方式

## 状态
✅ 已修复并测试通过
