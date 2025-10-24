# 数据质量管理 - 编辑和查看功能实现

## 功能说明

已为数据质量管理页面实现完整的编辑和查看规则功能。

## 实现的功能

### 1. 查看规则详情 ✅

点击规则行的"查看"按钮，会弹出模态框显示规则的完整信息。

#### 显示内容

**基本信息**
- 规则ID
- 规则名称
- 规则类型（带徽章）
- 严重程度（带徽章）
- 目标表
- 目标字段
- 质量阈值
- 启用状态
- 规则表达式（代码块显示）
- 描述

**检查结果**
- 最后检查时间
- 最后评分（带颜色徽章）
- 检查状态（通过/失败/未检查）
- 创建时间

#### 技术实现

```javascript
viewRuleDetail(ruleId) {
    const rule = dataQualityService.getRuleById(ruleId);
    
    // 构建详情HTML
    const detailHtml = `
        <div class="detail-section">
            <h3 class="detail-section-title">基本信息</h3>
            <div class="detail-grid">
                <!-- 详情字段 -->
            </div>
        </div>
    `;
    
    // 使用Modal组件显示
    Modal.alert({
        title: '规则详情',
        content: detailHtml,
        width: '800px'
    });
}
```

### 2. 编辑规则 ✅

点击规则行的"编辑"按钮，会打开创建规则模态框并填充现有数据。

#### 编辑流程

1. 点击"编辑"按钮
2. 获取规则数据
3. 填充表单字段
4. 更改模态框标题为"编辑规则"
5. 设置编辑模式标识
6. 显示模态框

#### 保存逻辑

- **创建模式**：`editingRuleId` 为 `null`，调用 `createRule()`
- **编辑模式**：`editingRuleId` 有值，调用 `updateRule()`

#### 技术实现

```javascript
editRule(ruleId) {
    const rule = dataQualityService.getRuleById(ruleId);
    
    // 设置编辑模式
    this.editingRuleId = ruleId;
    
    // 更新标题
    modalTitle.innerHTML = '<i class="fas fa-edit"></i>编辑规则';
    
    // 填充表单
    document.getElementById('ruleName').value = rule.name;
    document.getElementById('ruleType').value = this.getRuleTypeValue(rule.ruleType);
    // ... 其他字段
    
    // 显示模态框
    modal.style.display = 'flex';
}

submitRule() {
    const ruleData = { /* 表单数据 */ };
    
    if (this.editingRuleId) {
        // 更新规则
        dataQualityService.updateRule(this.editingRuleId, ruleData);
        Toast.success('规则更新成功');
    } else {
        // 创建规则
        dataQualityService.createRule(ruleData);
        Toast.success('规则创建成功');
    }
}
```

### 3. 规则类型映射 ✅

添加了规则类型标签到值的映射方法，用于编辑时正确填充下拉框。

```javascript
getRuleTypeValue(typeLabel) {
    const typeMap = {
        '完整性': 'COMPLETENESS',
        '准确性': 'ACCURACY',
        '一致性': 'CONSISTENCY',
        '唯一性': 'UNIQUENESS',
        '有效性': 'VALIDITY',
        '及时性': 'TIMELINESS'
    };
    return typeMap[typeLabel] || '';
}
```

## 修改的文件

### JavaScript（js/data-quality-management.js）

#### 新增/修改的方法

1. **构造函数**
   ```javascript
   constructor() {
       this.currentTab = 'dashboard';
       this.editingRuleId = null;  // 新增
   }
   ```

2. **showCreateRuleModal()**
   - 添加重置 `editingRuleId` 的逻辑

3. **submitRule()**
   - 添加编辑/创建模式判断
   - 根据模式调用不同的服务方法

4. **editRule(ruleId)** - 完整实现
   - 获取规则数据
   - 填充表单
   - 显示模态框

5. **viewRuleDetail(ruleId)** - 完整实现
   - 获取规则数据
   - 构建详情HTML
   - 使用Modal组件显示

6. **getRuleTypeValue(typeLabel)** - 新增
   - 规则类型标签到值的映射

### CSS（css/data-quality-management.css）

新增详情显示样式：
- `.detail-section` - 详情区块
- `.detail-section-title` - 区块标题
- `.detail-grid` - 详情网格布局
- `.detail-item` - 详情项
- `.detail-item.full-width` - 全宽详情项
- 响应式样式

## 使用说明

### 查看规则详情

1. 在规则列表中找到要查看的规则
2. 点击该行的"查看"按钮（眼睛图标）
3. 弹出模态框显示规则详细信息
4. 查看完毕后点击"确定"关闭

### 编辑规则

1. 在规则列表中找到要编辑的规则
2. 点击该行的"编辑"按钮（铅笔图标）
3. 模态框打开并自动填充现有数据
4. 修改需要更改的字段
5. 点击"保存"按钮提交更改
6. 系统提示"规则更新成功"
7. 列表自动刷新显示最新数据

### 创建新规则

1. 点击工具栏的"创建规则"按钮
2. 填写表单字段
3. 点击"保存"按钮
4. 系统提示"规则创建成功"
5. 列表自动刷新

## 数据流程

### 查看流程
```
点击查看按钮
  ↓
viewRuleDetail(ruleId)
  ↓
dataQualityService.getRuleById(ruleId)
  ↓
构建详情HTML
  ↓
Modal.alert() 显示
```

### 编辑流程
```
点击编辑按钮
  ↓
editRule(ruleId)
  ↓
dataQualityService.getRuleById(ruleId)
  ↓
填充表单数据
  ↓
显示模态框
  ↓
用户修改数据
  ↓
点击保存
  ↓
submitRule()
  ↓
dataQualityService.updateRule(ruleId, data)
  ↓
刷新列表
```

## 特性

### 1. 智能模式切换
- 同一个模态框支持创建和编辑两种模式
- 根据 `editingRuleId` 自动判断当前模式
- 标题自动更新（新建规则 / 编辑规则）

### 2. 数据验证
- 表单字段验证（HTML5原生验证）
- 必填字段检查
- 数据类型验证

### 3. 用户反馈
- 操作成功提示（Toast）
- 加载状态显示（Loading）
- 错误提示

### 4. 响应式设计
- 详情网格在移动端自动变为单列
- 模态框宽度自适应
- 触摸友好的按钮大小

## 样式特点

### 详情显示
- 清晰的区块划分
- 网格布局，信息对齐
- 标签和值分离显示
- 代码块特殊样式
- 徽章颜色区分状态

### 表单样式
- 统一的输入框样式
- 清晰的标签和提示
- 必填字段标记
- 焦点状态高亮

## 测试建议

### 测试查看功能
1. 点击任意规则的"查看"按钮
2. 确认所有字段正确显示
3. 确认徽章颜色正确
4. 确认代码块格式正确
5. 确认模态框可以正常关闭

### 测试编辑功能
1. 点击任意规则的"编辑"按钮
2. 确认表单自动填充现有数据
3. 修改部分字段
4. 点击"保存"
5. 确认提示"规则更新成功"
6. 确认列表中的数据已更新

### 测试创建功能
1. 点击"创建规则"按钮
2. 确认表单为空
3. 填写所有必填字段
4. 点击"保存"
5. 确认提示"规则创建成功"
6. 确认新规则出现在列表顶部

### 测试模式切换
1. 点击"创建规则"，确认标题为"新建规则"
2. 关闭模态框
3. 点击"编辑"，确认标题为"编辑规则"
4. 关闭模态框
5. 再次点击"创建规则"，确认表单已清空

## 依赖

### JavaScript依赖
- `dataQualityService.getRuleById()` - 获取规则详情
- `dataQualityService.updateRule()` - 更新规则
- `Modal.alert()` - 显示详情模态框
- `Toast.success()` / `Toast.error()` - 提示消息
- `Loading.show()` / `Loading.hide()` - 加载状态

### CSS依赖
- 徽章样式（badge-*）
- 模态框样式（modal-overlay, modal-container）
- 表单样式（form-group, form-control）

## 注意事项

1. **数据持久化**：当前数据存储在内存中，刷新页面后修改会丢失
2. **并发控制**：没有实现并发编辑检测
3. **权限控制**：没有实现编辑权限检查
4. **历史记录**：没有保存修改历史
5. **撤销功能**：没有实现撤销修改功能

## 未来改进

1. 添加删除规则功能
2. 添加批量编辑功能
3. 添加规则复制功能
4. 添加修改历史记录
5. 添加权限控制
6. 添加数据验证规则
7. 添加预览功能（执行前预览）
8. 添加导入导出功能

## 状态
✅ 查看功能已实现
✅ 编辑功能已实现
✅ 模式切换已实现
✅ 样式已完善
✅ 无语法错误
✅ 准备就绪
