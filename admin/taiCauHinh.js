      function renderRecentSheetsCard() {
          const card = element('section', 'reader-card');
          card.id = 'saved-configurations';
          card.tabIndex = -1;
          card.append(element('h2', '', 'Cấu hình đã lưu'));
          if (!state.recentSheets.length) {
              card.append(element('p', 'reader-help', 'Chưa có cấu hình nào được lưu.'));
              return card;
          }
          const list = element('div', 'reader-recent-sheets');
          state.recentSheets.forEach(sheet => {
              const row = element('div', 'reader-recent-sheet');
              const info = element('div');
              info.append(
                  element('strong', '', sheet.caption || sheet.tableName),
                  element('span', 'reader-help', `${sheet.objectCaption} · ${sheet.recordCount} bản ghi · ${sheet.columns} cột`)
              );
              const edit = element('button', 'reader-button secondary small', 'Chỉnh sửa');
              edit.type = 'button';
              edit.addEventListener('click', () => loadSavedConfiguration(sheet));
              row.append(info, edit);
              list.append(row);
          });
          card.append(list);
          return card;
      }

      async function loadRecentSheets() {
          state.recentSheets = await callServer('adminListRecentSheets');
      }

      async function loadSavedConfiguration(sheet) {
          try {
              await withLoading(async () => {
                  const configuration = await callServer('adminGetConfiguration', sheet.spreadsheetId, sheet.tableName);
                  const result = await callServer('adminListTables', sheet.spreadsheetId);
                  state.form = {
                      spreadsheetId: configuration.spreadsheetId,
                      tableName: configuration.tableName,
                      caption: configuration.caption,
                      objectCaption: configuration.objectCaption,
                      allowNew: configuration.allowNew
                  };
                  state.tables = result.tables;
                  state.spreadsheetName = result.spreadsheetName;
                  state.columns = configuration.columns;
                  state.step = 4;
              });
              setMessage('Đã nạp cấu hình đã lưu.', 'success');
          } catch (error) {
              setMessage(error.message, 'error');
          }
          render();
      }
