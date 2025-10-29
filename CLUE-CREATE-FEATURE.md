# 线索库新增线索功能实现

## 更新时间
2025-10-28

## 功能说明
实现了clue-library.html页面的"新增线索"按钮功能，用户可以通过表单创建新的线索记录。

## 实现内容

### 1. 新增线索模态框
在clue-library.html中添加了新增线索的模态框，包含以下字段：

**必填字段**：
- 线索标题
- 线索类型（科研经费、采购管理、招生录取等）
- 风险等级（高、中、低）
- 线索来源（预警转化、群众举报、日常监督等）
- 线索描述

**选填字段**：
- 涉及部门
- 涉及人员
- 涉及金额
- 发现时间
- 证据材料

### 2. JavaScript功能实现

#### createClue() - 打开新增模态框
```javascript
function createClue() {
    const modal = document.getElementById('createClueModal');
    modal.classList.add('active');
    document.getElementById('createClueForm').reset();
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('clueDate').value = today;
}
```

#### closeCreateModal() - 关闭模态框
```javascript
function closeCreateModal() {
    const modal = document.getElementById('createClueModal');
    modal.classList.remove('active');
}
```

#### submitNewClue() - 提交新线索
```javascript
function submitNewClue() {
    // 1. 验证表单
    // 2. 获取表单数据
    // 3. 生成线索编号（XS-2025-XXX）
    // 4. 添加到数据列表
    // 5. 刷新页面显示
    // 6. 显示成功提示
}
```

### 3. CSS样式
添加了完整的表单样式：
- form-grid：2列网格布局
- form-group：表单项容器
- form-label：标签样式（支持必填标记）
- form-input：输入框样式（包含focus效果）
- 响应式支持（移动端单列布局）

## 使用流程

1. 点击页面右上角的"新增线索"按钮
2. 填写线索信息（必填项标有红色*号）
3. 点击"提交"按钮
4. 系统自动生成线索编号
5. 新线索显示在列表顶部
6. 显示成功提示

## 数据结构

新创建的线索包含以下字段：
```javascript
{
    id: 自增ID,
    code: 'XS-2025-XXX',  // 自动生成
    title: '线索标题',
    type: '线索类型',
    risk: 'high|medium|low',
    source: '线索来源',
    department: '涉及部门',
    person: '涉及人员',
    amount: '涉及金额',
    date: '发现时间',
    description: '线索描述',
    evidence: '证据材料',
    status: 'pending',  // 默认待核查
    statusText: '待核查',
    handler: '未分配',
    createdAt: '创建日期',
    workOrder: null,
    rectification: null
}
```

## 表单验证

- 使用HTML5原生验证（required属性）
- 提交前检查表单有效性
- 无效时显示浏览器默认提示

## 文件更新

- `clue-library.html` - 添加新增线索模态框（v4）
- `js/clue-library.js` - 实现新增线索功能（v4）
- `css/clue-library.css` - 添加表单样式

## 测试步骤

1. 强制刷新浏览器（Ctrl+Shift+R）
2. 打开clue-library.html页面
3. 点击"新增线索"按钮
4. 验证模态框正常打开
5. 填写表单（测试必填项验证）
6. 点击"提交"按钮
7. 验证新线索出现在列表顶部
8. 验证线索编号自动生成
9. 验证成功提示显示

## 后续优化建议

1. 添加文件上传功能（证据材料附件）
2. 支持选择多个涉及部门和人员
3. 添加线索模板功能
4. 实现草稿保存功能
5. 添加表单自动保存
6. 支持从预警直接转化线索
7. 添加线索重复检测

## 注意事项

- 新增的线索只保存在前端内存中
- 刷新页面后数据会丢失
- 需要对接后端API实现数据持久化
- 线索编号生成逻辑需要后端支持

## 常见问题

**Q: 点击"新增线索"按钮没反应？**
A: 检查浏览器控制台是否有错误，确保已强制刷新。

**Q: 提交后线索没有显示？**
A: 检查是否有筛选条件，新线索可能被过滤掉了。

**Q: 刷新页面后新增的线索消失了？**
A: 正常现象，数据只保存在内存中，需要后端API支持持久化。

**Q: 如何修改线索编号格式？**
A: 在submitNewClue函数中修改code生成逻辑。
