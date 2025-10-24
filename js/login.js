/**
 * 登录页面交互逻辑
 */

// 验证码生成
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (let i = 0; i < 4; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
}

// 当前验证码
let currentCaptcha = generateCaptcha();

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 显示验证码
    document.getElementById('captchaText').textContent = currentCaptcha;
    
    // 验证码点击刷新
    document.getElementById('captchaImage').addEventListener('click', function() {
        currentCaptcha = generateCaptcha();
        document.getElementById('captchaText').textContent = currentCaptcha;
        document.getElementById('captcha').value = '';
        hideError('captcha');
    });
    
    // 密码显示/隐藏切换
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eyeIcon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    });
    
    // 表单提交
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // 统一身份认证登录
    document.getElementById('ssoLogin').addEventListener('click', function() {
        handleSSOLogin();
    });
    
    // 输入框失焦验证
    document.getElementById('username').addEventListener('blur', function() {
        validateUsername();
    });
    
    document.getElementById('password').addEventListener('blur', function() {
        validatePassword();
    });
    
    document.getElementById('captcha').addEventListener('blur', function() {
        validateCaptcha();
    });
    
    // 输入时清除错误提示
    document.getElementById('username').addEventListener('input', function() {
        hideError('username');
    });
    
    document.getElementById('password').addEventListener('input', function() {
        hideError('password');
    });
    
    document.getElementById('captcha').addEventListener('input', function() {
        hideError('captcha');
    });
});

// 显示错误信息
function showError(field, message) {
    const errorElement = document.getElementById(field + 'Error');
    const inputElement = document.getElementById(field);
    
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    inputElement.classList.add('border-red-500');
    inputElement.classList.remove('border-gray-300');
}

// 隐藏错误信息
function hideError(field) {
    const errorElement = document.getElementById(field + 'Error');
    const inputElement = document.getElementById(field);
    
    errorElement.classList.add('hidden');
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
}

// 验证用户名
function validateUsername() {
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        showError('username', '请输入用户名');
        return false;
    }
    
    if (username.length < 3) {
        showError('username', '用户名至少3个字符');
        return false;
    }
    
    if (username.length > 20) {
        showError('username', '用户名不能超过20个字符');
        return false;
    }
    
    // 验证用户名格式（字母、数字、下划线）
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        showError('username', '用户名只能包含字母、数字和下划线');
        return false;
    }
    
    hideError('username');
    return true;
}

// 验证密码
function validatePassword() {
    const password = document.getElementById('password').value;
    
    if (!password) {
        showError('password', '请输入密码');
        return false;
    }
    
    if (password.length < 6) {
        showError('password', '密码至少6个字符');
        return false;
    }
    
    if (password.length > 20) {
        showError('password', '密码不能超过20个字符');
        return false;
    }
    
    hideError('password');
    return true;
}

// 验证验证码
function validateCaptcha() {
    const captcha = document.getElementById('captcha').value.trim();
    
    if (!captcha) {
        showError('captcha', '请输入验证码');
        return false;
    }
    
    if (captcha.toUpperCase() !== currentCaptcha) {
        showError('captcha', '验证码错误');
        return false;
    }
    
    hideError('captcha');
    return true;
}

// 处理登录
function handleLogin() {
    // 验证所有字段
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    const isCaptchaValid = validateCaptcha();
    
    if (!isUsernameValid || !isPasswordValid || !isCaptchaValid) {
        return;
    }
    
    // 获取表单数据
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // 显示加载状态
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>登录中...';
    
    // 模拟登录请求
    setTimeout(function() {
        // 这里应该是实际的登录 API 调用
        // 示例：演示登录成功
        if (username === 'admin' && password === 'admin123') {
            // 保存登录状态
            if (remember) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            
            // 保存用户信息
            sessionStorage.setItem('userInfo', JSON.stringify({
                username: username,
                name: '系统管理员',
                role: '管理员',
                loginTime: new Date().toISOString()
            }));
            
            // 跳转到工作台
            window.location.href = 'index.html';
        } else {
            // 登录失败
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            showError('password', '用户名或密码错误');
            
            // 刷新验证码
            currentCaptcha = generateCaptcha();
            document.getElementById('captchaText').textContent = currentCaptcha;
            document.getElementById('captcha').value = '';
        }
    }, 1000);
}

// 处理统一身份认证登录
function handleSSOLogin() {
    // 这里应该跳转到统一身份认证页面
    // 示例：显示提示信息
    alert('即将跳转到统一身份认证系统...\n\n实际应用中，这里会跳转到学校的统一身份认证平台（如 CAS、LDAP 等）');
    
    // 实际应用中的代码示例：
    // window.location.href = 'https://sso.university.edu.cn/login?service=' + encodeURIComponent(window.location.origin);
}

// 页面加载时检查是否有记住的用户名
window.addEventListener('load', function() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        document.getElementById('username').value = rememberedUsername;
        document.getElementById('remember').checked = true;
    }
});
