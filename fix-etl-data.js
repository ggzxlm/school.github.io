/**
 * ETL数据修复脚本
 * 在浏览器控制台中运行此脚本来修复ETL数据问题
 */

(function() {
    console.log('=== ETL数据修复脚本 ===');
    
    // 1. 检查服务是否存在
    if (!window.etlService) {
        console.error('❌ window.etlService 不存在！请确保 etl-service.js 已加载。');
        return;
    }
    console.log('✓ ETL服务已加载');
    
    // 2. 检查当前数据
    const currentJobs = window.etlService.getAll();
    console.log(`当前作业数量: ${currentJobs.length}`);
    
    // 3. 如果没有数据，强制初始化
    if (currentJobs.length === 0) {
        console.log('⚠️ 没有找到作业数据，开始强制初始化...');
        
        // 清空现有存储
        localStorage.removeItem('etl_jobs');
        localStorage.removeItem('etl_executions');
        localStorage.removeItem('etl_versions');
        
        // 重新创建服务实例
        window.etlService = new ETLService();
        
        const newJobs = window.etlService.getAll();
        console.log(`✓ 初始化完成，新作业数量: ${newJobs.length}`);
        
        // 显示统计信息
        const stats = window.etlService.getStatistics();
        console.log('统计信息:', stats);
        
        // 如果页面有 loadJobs 函数，重新加载
        if (typeof loadJobs === 'function') {
            console.log('重新加载页面数据...');
            loadJobs();
        }
        
        console.log('✓ 修复完成！请刷新页面查看数据。');
    } else {
        console.log('✓ 数据正常，无需修复');
        console.log('统计信息:', window.etlService.getStatistics());
    }
})();
