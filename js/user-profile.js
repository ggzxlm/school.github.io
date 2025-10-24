/**
 * 个人资料页面
 */

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    // 编辑按钮
    const editBtn = document.getElementById('editBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const profileForm = document.getElementById('profileForm');
    const formInputs = profileForm.querySelectorAll('.form-control');
    const formActions = profileForm.querySelector('.form-actions');

    editBtn.addEventListener('click', () => {
        // 启用表单
        formInputs.forEach(input => {
            if (input.name !== 'username' && input.name !== 'employeeId') {
                input.disabled = false;
            }
        });
        formActions.style.display = 'flex';
        editBtn.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        // 禁用表单
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formActions.style.display = 'none';
        editBtn.style.display = 'block';
        // 重置表单
        profileForm.reset();
    });

    // 表单提交
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        Loading.show('保存中...');
        
        // 模拟保存
        setTimeout(() => {
            Loading.hide();
            Toast.success('保存成功');
            
            // 禁用表单
            formInputs.forEach(input => {
                input.disabled = true;
            });
            formActions.style.display = 'none';
            editBtn.style.display = 'block';
        }, 1000);
    });

    // 头像上传
    const avatarInput = document.getElementById('avatarInput');
    const avatarImage = document.getElementById('avatarImage');

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                Toast.error('图片大小不能超过2MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                avatarImage.innerHTML = `<img src="${e.target.result}" alt="头像">`;
                Toast.success('头像上传成功');
            };
            reader.readAsDataURL(file);
        }
    });
}
