# 公共交互组件使用指南

本文档介绍高校纪检审计监管一体化平台的公共交互组件使用方法。

## 组件列表

### 1. Modal - 模态对话框组件

用于显示模态对话框，支持自定义标题、内容、按钮和尺寸。

#### 基本用法

```javascript
Modal.show({
    title: '对话框标题',
    content: '<p>对话框内容</p>',
    size: 'md', // 'sm', 'md', 'lg', 'xl'
    closeOnOverlay: true, // 点击遮罩层是否关闭
    buttons: [
        { 
            text: '取消', 
            type: 'secondary', 
            onClick: () => Modal.hide() 
        },
        { 
            text: '确定', 
            type: 'primary', 
            icon: 'check',
            onClick: () => {
                // 处理确定逻辑
                Modal.hide();
            }
        }
    ],
    onClose: () => {
        // 关闭回调
    }
});
```

#### 关闭对话框

```javascript
Modal.hide();
```

### 2. Toast - 消息提示组件

用于显示轻量级的消息提示，支持自动消失和手动关闭。

#### 基本用法

```javascript
// 成功消息
Toast.success('操作成功！');

// 警告消息
Toast.warning('请注意检查输入内容');

// 错误消息
Toast.error('操作失败，请重试');

// 信息消息
Toast.info('系统将在5分钟后维护');

// 自定义持续时间（毫秒）
Toast.success('保存成功', 5000);

// 不自动关闭（duration = 0）
Toast.show('重要通知', 'info', 0);
```

#### 特性

- 支持消息队列管理，最多同时显示 5 条消息
- 自动消失（默认 3 秒）
- 支持手动关闭
- 四种消息类型：success, warning, error, info

### 3. Confirm - 确认对话框组件

用于需要用户确认的操作，如删除、提交等。

#### 基本用法

```javascript
// 删除确认
Confirm.delete('确定要删除这条记录吗？', () => {
    // 确认后的操作
    console.log('已删除');
});

// 提交确认
Confirm.submit('确定要提交这份报告吗？', () => {
    // 确认后的操作
    console.log('已提交');
});

// 自定义确认对话框
Confirm.show({
    title: '确认操作',
    message: '确定要执行此操作吗？',
    type: 'warning', // 'warning', 'danger', 'info'
    confirmText: '确定',
    cancelText: '取消',
    onConfirm: () => {
        // 确认回调
    },
    onCancel: () => {
        // 取消回调
    }
});
```

### 4. Loading - 加载状态组件

用于显示加载状态，支持全局加载遮罩和局部加载动画。

#### 全局加载

```javascript
// 显示全局加载
Loading.show('正在加载数据...');

// 隐藏全局加载
Loading.hide();
```

#### 局部加载

```javascript
const element = document.getElementById('my-element');

// 显示局部加载
Loading.showInElement(element);

// 隐藏局部加载
Loading.hideInElement(element);
```

### 5. Skeleton - 骨架屏组件

用于在内容加载时显示占位符，提升用户体验。

#### 基本用法

```javascript
const element = document.getElementById('content-area');

// 显示文本骨架屏
Skeleton.showInElement(element, 'text', { rows: 5 });

// 显示卡片骨架屏
Skeleton.showInElement(element, 'card');

// 显示表格骨架屏
Skeleton.showInElement(element, 'table', { rows: 5, columns: 4 });

// 显示列表骨架屏
Skeleton.showInElement(element, 'list', { rows: 4 });

// 隐藏骨架屏
Skeleton.hideInElement(element);
```

#### 支持的类型

- `text` - 文本骨架屏
- `card` - 卡片骨架屏
- `table` - 表格骨架屏
- `list` - 列表骨架屏

## 使用示例

### 完整的数据加载流程

```javascript
function loadData() {
    // 1. 显示骨架屏
    const contentArea = document.getElementById('content-area');
    Skeleton.showInElement(contentArea, 'table', { rows: 10, columns: 5 });
    
    // 2. 加载数据
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // 3. 隐藏骨架屏
            Skeleton.hideInElement(contentArea);
            
            // 4. 渲染数据
            renderData(contentArea, data);
            
            // 5. 显示成功消息
            Toast.success('数据加载成功！');
        })
        .catch(error => {
            // 隐藏骨架屏
            Skeleton.hideInElement(contentArea);
            
            // 显示错误消息
            Toast.error('数据加载失败：' + error.message);
        });
}
```

### 删除操作流程

```javascript
function deleteRecord(id) {
    Confirm.delete('确定要删除这条记录吗？此操作不可恢复。', () => {
        // 显示加载状态
        Loading.show('正在删除...');
        
        // 执行删除
        fetch(`/api/records/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => {
                // 隐藏加载状态
                Loading.hide();
                
                // 显示成功消息
                Toast.success('删除成功！');
                
                // 刷新列表
                loadData();
            })
            .catch(error => {
                Loading.hide();
                Toast.error('删除失败：' + error.message);
            });
    });
}
```

### 表单提交流程

```javascript
function submitForm() {
    // 显示表单对话框
    Modal.show({
        title: '编辑信息',
        size: 'md',
        content: `
            <div class="form-group">
                <label class="form-label required">名称</label>
                <input type="text" class="form-input" id="name-input">
            </div>
            <div class="form-group">
                <label class="form-label">描述</label>
                <textarea class="form-textarea" id="desc-input"></textarea>
            </div>
        `,
        buttons: [
            { text: '取消', type: 'secondary', onClick: () => Modal.hide() },
            { 
                text: '保存', 
                type: 'primary', 
                icon: 'save',
                onClick: () => {
                    const name = document.getElementById('name-input').value;
                    const desc = document.getElementById('desc-input').value;
                    
                    if (!name) {
                        Toast.warning('请输入名称');
                        return;
                    }
                    
                    Modal.hide();
                    Loading.show('正在保存...');
                    
                    fetch('/api/save', {
                        method: 'POST',
                        body: JSON.stringify({ name, desc })
                    })
                    .then(() => {
                        Loading.hide();
                        Toast.success('保存成功！');
                    })
                    .catch(error => {
                        Loading.hide();
                        Toast.error('保存失败：' + error.message);
                    });
                }
            }
        ]
    });
}
```

## 演示页面

访问 `components-demo.html` 查看所有组件的交互演示。

## 注意事项

1. 所有组件都已在 `js/components.js` 中定义，并在页面加载时自动初始化
2. 样式已在 `css/common.css` 中定义
3. 确保在使用组件前已引入必要的 CSS 和 JS 文件
4. Toast 组件会自动管理消息队列，避免屏幕上显示过多消息
5. Modal 和 Loading 同时只能显示一个实例
6. 骨架屏适合在首次加载时使用，后续刷新建议使用 Loading 组件

## 浏览器兼容性

- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

## 键盘快捷键

- `ESC` - 关闭模态对话框
- 模态对话框打开时会自动聚焦，支持 Tab 键切换焦点
