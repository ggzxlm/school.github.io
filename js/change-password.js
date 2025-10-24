/**
 * 修改密码页面
 */

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    const passwordForm = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // 密码显示/隐藏切换
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.classList.add('active');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.classList.remove('active');
            }
        });
    });

    // 密码强度检测
    newPasswordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        validatePasswordRequirements(this.value);
    });

    // 表单提交
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // 验证
        if (!oldPassword) {
            Toast.error('请输入当前密码');
            return;
        }

        if (!newPassword) {
            Toast.error('请输入新密码');
            return;
        }

        if (!validatePassword(newPassword)) {
            Toast.error('新密码不符合要求');
            return;
        }

        if (newPassword !== confirmPassword) {
            Toast.error('两次输入的密码不一致');
            return;
        }

        if (oldPassword === newPassword) {
            Toast.error('新密码不能与当前密码相同');
            return;
        }

        // 提交
        Confirm.show({
            title: '确认修改',
            message: '修改密码后需要重新登录，确定要继续吗？',
            type: 'warning',
            confirmText: '确定',
            cancelText: '取消',
            onConfirm: () => {
                submitPasswordChange(oldPassword, newPassword);
            }
        });
    });
}

/**
 * 检查密码强度
 */
function checkPasswordStrength(password) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthLevel = document.querySelector('.strength-level');

    if (!password) {
        strengthFill.className = 'strength-fill';
        strengthLevel.textContent = '-';
        strengthLevel.className = 'strength-level';
        return;
    }

    let strength = 0;

    // 长度
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // 包含小写字母
    if (/[a-z]/.test(password)) strength++;

    // 包含大写字母
    if (/[A-Z]/.test(password)) strength++;

    // 包含数字
    if (/[0-9]/.test(password)) strength++;

    // 包含特殊字符
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    // 设置强度显示
    if (strength <= 2) {
        strengthFill.className = 'strength-fill weak';
        strengthLevel.textContent = '弱';
        strengthLevel.className = 'strength-level weak';
    } else if (strength <= 4) {
        strengthFill.className = 'strength-fill medium';
        strengthLevel.textContent = '中';
        strengthLevel.className = 'strength-level medium';
    } else {
        strengthFill.className = 'strength-fill strong';
        strengthLevel.textContent = '强';
        strengthLevel.className = 'strength-level strong';
    }
}

/**
 * 验证密码要求
 */
function validatePasswordRequirements(password) {
    const tips = {
        'tip-length': password.length >= 8,
        'tip-uppercase': /[A-Z]/.test(password),
        'tip-lowercase': /[a-z]/.test(password),
        'tip-number': /[0-9]/.test(password),
        'tip-special': /[^a-zA-Z0-9]/.test(password)
    };

    Object.keys(tips).forEach(id => {
        const element = document.getElementById(id);
        if (tips[id]) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    });
}

/**
 * 验证密码
 */
function validatePassword(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^a-zA-Z0-9]/.test(password);
}

/**
 * 提交密码修改
 */
function submitPasswordChange(oldPassword, newPassword) {
    Loading.show('正在修改密码...');

    // 模拟API请求
    setTimeout(() => {
        Loading.hide();
        
        // 模拟成功
        Toast.success('密码修改成功，请重新登录');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 1500);
}
