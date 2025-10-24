# ETL管理创建作业弹框修复

## 问题描述
创建作业弹框不正常，需要参照数据源管理的弹框实现方式进行修复。

## 修复内容

### 1. HTML结构调整

#### 修复前
```html
<div id="jobModal" class="modal-overlay" style="display: none;">
    <div class="modal-dialog modal-lg">
        <div class="modal-header">
            <h3 id="modalTitle">创建ETL作业</h3>
            <button class="modal-close" onclick="closeJobModal()">×</button>
        </div>
```

#### 修复后
```html
<div id="jobModal" class="modal-overlay">
    <div class="modal-container modal-lg">
        <div class="modal-header">
            <h2 class="modal-title" id="modalTitle">
                <i class="fas fa-plus-circle"></i>创建ETL作业
            </h2>
            <button class="modal-close-btn" id="closeJobModalBtn">
                <i class="fas fa-times"></i>
            </button>
        </div>
```

**改进点**：
- `modal-dialog` → `modal-container` (统一类名)
- 移除内联 `style="display: none;"` (通过CSS控制)
- `h3` → `h2.modal-title` (统一标题样式)
- 添加图标到标题
- `modal-close` → `modal-close-btn` (统一按钮样式)
- 使用Font Awesome图标替代×符号
- 添加按钮ID用于事件绑定

### 2. 底部按钮调整

#### 修复前
```html
<div class="modal-footer">
    <button class="btn btn-secondary" onclick="closeJobModal()">取消</button>
    <button class="btn btn-primary" onclick="saveJob()">保存</button>
</div>
```

#### 修复后
```html
<div class="modal-footer">
    <button class="btn btn-secondary" id="cancelJobBtn">取消</button>
    <button class="btn btn-primary" id="saveJobBtn">
        <i class="fas fa-check"></i> 保存
    </button>
</div>
```

**改进点**：
- 移除内联onclick事件
- 添加按钮ID用于事件绑定
- 保存按钮添加图标

### 3. JavaScript事件绑定

#### 新增事件绑定
```javascript
// 模态框关闭按钮
const closeJobModalBtn = document.getElementById('closeJobModalBtn');
if (closeJobModalBtn) {
    closeJobModalBtn.addEventListener('click', closeJobModal);
}

const cancelJobBtn = document.getElementById('cancelJobBtn');
if (cancelJobBtn) {
    cancelJobBtn.addEventListener('click', closeJobModal);
}

// 保存按钮
const saveJobBtn = document.getElementById('saveJobBtn');
if (saveJobBtn) {
    saveJobBtn.addEventListener('click', saveJob);
}

// 点击模态框外部关闭
const jobModal = document.getElementById('jobModal');
if (jobModal) {
    jobModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeJobModal();
        }
    });
}
```

### 4. 模态框显示/隐藏函数优化

#### showCreateJobModal
```javascript
function showCreateJobModal() {
    const modal = document.getElementById('jobModal');
    if (!modal) return;
    
    // 重置表单
    document.getElementById('jobForm').reset();
    document.getElementById('jobId').value = '';
    document.getElementById('enabled').checked = true;
    
    // 设置标题
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>创建ETL作业';
    }
    
    // 显示模态框（带动画）
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}
```

#### closeJobModal
```javascript
function closeJobModal() {
    const modal = document.getElementById('jobModal');
    if (!modal) return;
    
    // 移除动画类
    modal.classList.remove('modal-show');
    
    // 延迟隐藏（等待动画完成）
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    
    // 重置表单
    document.getElementById('jobForm').reset();
}
```

#### editJob
```javascript
function editJob(jobId) {
    const job = window.etlService.getById(jobId);
    if (!job) {
        showToast('作业不存在', 'error');
        return;
    }
    
    // 设置标题
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-edit"></i>编辑ETL作业';
    }
    
    // 填充表单...
    
    // 显示模态框（带动画）
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}
```

### 5. 新增showToast函数

参照数据源管理，添加统一的提示消息函数：

```javascript
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    // ... toast内容和自动消失逻辑
}
```

## 与数据源管理的一致性

| 特性 | 数据源管理 | ETL管理（修复后） |
|------|-----------|------------------|
| 容器类名 | modal-container | modal-container ✅ |
| 标题样式 | h2.modal-title | h2.modal-title ✅ |
| 关闭按钮 | modal-close-btn | modal-close-btn ✅ |
| 事件绑定 | addEventListener | addEventListener ✅ |
| 显示动画 | modal-show类 | modal-show类 ✅ |
| 外部点击关闭 | 支持 | 支持 ✅ |
| Toast提示 | showToast | showToast ✅ |

## 测试清单

- [x] 点击"创建作业"按钮能正常打开弹框
- [x] 弹框有淡入动画效果
- [x] 点击关闭按钮能关闭弹框
- [x] 点击取消按钮能关闭弹框
- [x] 点击弹框外部能关闭弹框
- [x] 弹框有淡出动画效果
- [x] 编辑作业时标题正确显示
- [x] 表单重置功能正常
- [x] 样式与数据源管理一致
