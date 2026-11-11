      function collectColumns() {
          return $$('.reader-column-row', $('#column-list')).map(row => {
              const column = state.columns.find(item => item.key === row.dataset.key);
              const result = { ...column };
              $$('[data-property]', row).forEach(control => {
                  result[control.dataset.property] = control.type === 'checkbox' ? control.checked : control.value;
              });
              return result;
          });
      }

      async function onSaveConfiguration() {
          syncForm();
          if (!state.form.spreadsheetId || !state.form.tableName || !state.form.caption || !state.form.objectCaption) {
              return setMessage('Vui lòng nhập đầy đủ ID Google Sheet, tên bảng, tiêu đề và tên đối tượng.', 'error');
          }
          if (!state.columns.length) return setMessage('Hãy tải danh sách cột trước khi lưu cấu hình.', 'error');
          try {
              const result = await withLoading(async () => {
                  const saved = await callServer('adminSaveConfiguration', {
                      ...state.form,
                      columns: state.columns.map(column => ({ ...column }))
                  });
                  await taiDanhSachTrangTinhGanDay();
                  return saved;
              });
              setMessage(`Đã lưu cấu hình lúc ${new Date(result.savedAt).toLocaleString('vi-VN')}.`, 'success');
          } catch (error) {
              setMessage(error.message, 'error');
          }
          render();
      }
