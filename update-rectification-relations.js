// 整改任务关联信息补丁
// 在每个整改任务的 sourceType 后面添加工单和线索关联信息

const relationPatches = {
    'ZG2025003': {
        workOrderId: 'WO202510170004',
        workOrderTitle: '招生录取数据异常核查',
        workOrderStatus: '已完成',
        clueId: 'CLUE2025003',
        clueTitle: '招生录取存在低分高录情况',
        clueType: '系统预警'
    },
    'ZG2025004': {
        workOrderId: 'WO202510200002',
        workOrderTitle: '基建项目招标文件审查',
        workOrderStatus: '待审核',
        clueId: 'CLUE2025004',
        clueTitle: '基建项目招标文件存在排他性条款',
        clueType: '审计发现'
    },
    'ZG2025005': {
        workOrderId: 'WO202510190003',
        workOrderTitle: '三公经费支出专项检查',
        workOrderStatus: '进行中',
        clueId: 'CLUE2025005',
        clueTitle: '三公经费支出存在疑似隐蔽吃喝',
        clueType: '专项检查'
    },
    'ZG2025006': {
        workOrderId: 'WO202510220001',
        workOrderTitle: '师德师风问题核查',
        workOrderStatus: '进行中',
        clueId: 'CLUE2025006',
        clueTitle: '教师课堂言论不当收到学生投诉',
        clueType: '举报线索'
    },
    'ZG2025007': {
        workOrderId: 'WO202510250001',
        workOrderTitle: '学术不端问题调查',
        workOrderStatus: '进行中',
        clueId: 'CLUE2025007',
        clueTitle: '论文存在抄袭嫌疑',
        clueType: '学术检测'
    },
    'ZG2025008': {
        workOrderId: 'WO202510280001',
        workOrderTitle: '违规补课问题核查',
        workOrderStatus: '进行中',
        clueId: 'CLUE2025008',
        clueTitle: '教师校外有偿补课',
        clueType: '举报线索'
    },
    'ZG2025009': {
        workOrderId: 'WO202510300001',
        workOrderTitle: '第一议题学习情况核查',
        workOrderStatus: '进行中',
        clueId: 'CLUE2025009',
        clueTitle: '第一议题学习次数不足',
        clueType: '巡查发现'
    },
    'ZG2025010': {
        workOrderId: 'WO202511010001',
        workOrderTitle: '采购流程合规性检查',
        workOrderStatus: '进行中',
        clueId: 'CLUE2025010',
        clueTitle: '采购项目化整为零规避招标',
        clueType: '审计发现'
    },
    'ZG2025011': {
        workOrderId: 'WO202510150001',
        workOrderTitle: '实验室安全隐患排查',
        workOrderStatus: '已完成',
        clueId: 'CLUE2025011',
        clueTitle: '实验室危化品管理不规范',
        clueType: '专项检查'
    },
    'ZG2025012': {
        workOrderId: 'WO202511050001',
        workOrderTitle: '学生资助管理检查',
        workOrderStatus: '进行中',
        clueId: 'CLUE2025012',
        clueTitle: '学生资助资金发放不及时',
        clueType: '审计发现'
    }
};

// 使用说明：
// 在 js/rectification.js 中，每个整改任务的 sourceType 后面添加：
// workOrderId, workOrderTitle, workOrderStatus, clueId, clueTitle, clueType

console.log('整改任务关联信息补丁');
console.log('需要更新的任务数量:', Object.keys(relationPatches).length);
