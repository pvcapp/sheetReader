function render() {
    APP.view.ui.init();
    const tab = APP.view.ui.addTab(PAGE, renderClient());
    APP.view.ui.showTab(PAGE);
    renderStudentList();
    renderDetail();
    return tab;
}

      async function start() {
          try {
              document.getElementById('app').textContent = 'Đang tải dữ liệu...';
              await APP.cache.init();
              if (APP.mode === 'demo') APP.cache.recordActivity('view');
              render();
              if (APP.mode === 'live') {
                  status(`Đã tải ${currentStore()?.students.length || 0} bản ghi.`, 'success');
              }
          } catch (error) {
              console.error(error);
              document.getElementById('app').textContent = error.message || 'Không thể khởi động ứng dụng.';
          }
      }

      start();
