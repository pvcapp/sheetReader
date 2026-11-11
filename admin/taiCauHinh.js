      function hienThiTheTrangTinhGanDay() {
          const the = element('section', 'reader-card');
          the.id = 'saved-configurations';
          the.tabIndex = -1;
          the.append(element('h2', '', 'Cấu hình đã lưu'));
          if (!state.recentSheets.length) {
              the.append(element('p', 'reader-help', 'Chưa có cấu hình nào được lưu.'));
              return the;
          }
          const danhSach = element('div', 'reader-recent-sheets');
          state.recentSheets.forEach(trangTinh => {
              const dong = element('div', 'reader-recent-sheet');
              const thongTin = element('div');
              thongTin.append(
                  element('strong', '', trangTinh.caption || trangTinh.tableName),
                  element('span', 'reader-help', `${trangTinh.objectCaption} · ${trangTinh.recordCount} bản ghi · ${trangTinh.columns} cột`)
              );
              const nutSua = element('button', 'reader-button secondary small', 'Chỉnh sửa');
              nutSua.type = 'button';
              nutSua.addEventListener('click', () => napCauHinhDaLuu(trangTinh));
              dong.append(thongTin, nutSua);
              danhSach.append(dong);
          });
          the.append(danhSach);
          return the;
      }

      async function taiDanhSachTrangTinhGanDay() {
          state.recentSheets = await callServer('adminListRecentSheets');
      }

      async function napCauHinhDaLuu(trangTinh) {
          try {
              await withLoading(async () => {
                  const cauHinh = await callServer('adminGetConfiguration', trangTinh.spreadsheetId, trangTinh.tableName);
                  const ketQua = await callServer('adminListTables', trangTinh.spreadsheetId);
                  state.form = {
                      spreadsheetId: cauHinh.spreadsheetId,
                      tableName: cauHinh.tableName,
                      caption: cauHinh.caption,
                      objectCaption: cauHinh.objectCaption,
                      allowNew: cauHinh.allowNew
                  };
                  state.tables = ketQua.tables;
                  state.spreadsheetName = ketQua.spreadsheetName;
                  state.columns = cauHinh.columns;
                  state.step = 4;
              });
              setMessage('Đã nạp cấu hình đã lưu.', 'success');
          } catch (loi) {
              setMessage(loi.message, 'error');
          }
          render();
      }
