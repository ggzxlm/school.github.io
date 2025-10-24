/**
 * 账号设置页面
 */

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    loadSettings();
    bindEvents();
}

/**
 * 加载设置
 */
function loadSettings() {
    // 从本地存储加载设置
    const settings = Storage.get('user-settings', {});
    
    // 应用设置
    if (settings.theme) {
        document.querySelector('select[value="' + settings.theme + '"]')?.setAttribute('selected', 'selected');
    }
    
    if (settings.language) {
        document.querySelector('select[value="' + settings.language + '"]')?.setAttribute('selected', 'selected');
    }
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 保存按钮
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', saveSettings);

    // 开关变化监听
    document.querySelectorAll('.switch input').forEach(input => {
        input.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h4').textContent;
            const status = this.checked ? '已启用' : '已禁用';
            Toast.info(`${settingName}${status}`);
        });
    });

    // 主题切换
    const themeSelect = document.querySelector('select[value="light"]').closest('select');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            const theme = this.value;
            applyTheme(theme);
        });
    }
}

/**
 * 保存设置
 */
function saveSettings() {
    Loading.show('保存中...');

    // 收集所有设置
    const settings = {
        // 通知设置
        notifications: {
            system: document.querySelector('.setting-item:nth-child(1) input').checked,
            alert: document.querySelector('.setting-item:nth-child(2) input').checked,
            workOrder: document.querySelector('.setting-item:nth-child(3) input').checked,
            email: document.querySelector('.setting-item:nth-child(4) input').checked
        },
        // 隐私设置
        privacy: {
            showOnlineStatus: document.querySelectorAll('.settings-card')[1].querySelector('.setting-item:nth-child(1) input').checked,
            showPhone: document.querySelectorAll('.settings-card')[1].querySelector('.setting-item:nth-child(2) input').checked,
            showEmail: document.querySelectorAll('.settings-card')[1].querySelector('.setting-item:nth-child(3) input').checked
        },
        // 界面设置
        interface: {
            theme: document.querySelectorAll('.settings-card')[2].querySelector('.setting-item:nth-child(1) select').value,
            language: document.querySelectorAll('.settings-card')[2].querySelector('.setting-item:nth-child(2) select').value,
            sidebarState: document.querySelectorAll('.settings-card')[2].querySelector('.setting-item:nth-child(3) select').value
        },
        // 安全设置
        security: {
            twoFactor: document.querySelectorAll('.settings-card')[3].querySelector('.setting-item:nth-child(1) input').checked,
            loginAlert: document.querySelectorAll('.settings-card')[3].querySelector('.setting-item:nth-child(2) input').checked,
            sessionTimeout: document.querySelectorAll('.settings-card')[3].querySelector('.setting-item:nth-child(3) select').value
        }
    };

    // 保存到本地存储
    Storage.set('user-settings', settings);

    // 模拟API请求
    setTimeout(() => {
        Loading.hide();
        Toast.success('设置保存成功');
    }, 1000);
}

/**
 * 应用主题
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        Toast.info('深色模式功能开发中');
    } else if (theme === 'auto') {
        Toast.info('自动主题功能开发中');
    } else {
        Toast.info('已切换到浅色模式');
    }
}
