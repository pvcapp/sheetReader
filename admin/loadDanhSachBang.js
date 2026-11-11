      function renderTablePicker() {
          const list = element('div', 'reader-table-radio-list');
          if (!state.tables.length) {
              list.append(element('p', 'reader-empty', 'Nhập URL hoặc ID Google Sheets rồi tải danh sách bảng.'));
              return list;
          }
          state.tables.forEach(name => {
              const label = element('label', 'reader-table-radio');
              const radio = document.createElement('input');
              radio.type = 'radio';
              radio.name = 'selected-table';
              radio.value = name;
              radio.checked = state.form.tableName === name;
              radio.addEventListener('change', () => {
                  state.form.tableName = name;
                  state.columns = [];
                  const next = $('#continue-to-details');
                  if (next) next.disabled = false;
              });
              label.append(radio, element('span', '', name));
              list.append(label);
          });
          return list;
      }

      function renderStepOne() {
          const card = element('section', 'reader-card');
          card.append(element('h2', '', 'Bước 1 · Chọn bảng dữ liệu'));
          const loadTables = element('button', 'reader-button secondary reader-button-regular', 'Lấy thông tin');
          loadTables.type = 'button';
          loadTables.addEventListener('click', onLoadTables);
          card.append(renderTextField({
              id: 'field-sheetUrl',
              label: 'URL hoặc ID Google Sheet',
              value: state.form.spreadsheetId,
              required: true,
              hint: 'Dán URL Google Sheet hoặc nhập ID'
          }));
          const fetchInfo = element('div', 'reader-fetch-info');
          fetchInfo.append(loadTables);
          if (state.spreadsheetName) {
              fetchInfo.append(element('span', 'reader-spreadsheet-name', state.spreadsheetName));
          }
          card.append(fetchInfo);
          card.append(renderTablePicker());
          const actions = element('div', 'reader-wizard-actions');
          const next = element('button', 'reader-button', 'Tiếp theo');
          next.type = 'button';
          next.id = 'continue-to-details';
          next.disabled = !state.form.tableName || !state.tables.includes(state.form.tableName);
          next.addEventListener('click', onContinueToDetails);
          actions.append(next);
          card.append(actions);
          return card;
      }

      function onContinueToDetails() {
          if (!state.form.tableName || !state.tables.includes(state.form.tableName)) {
              return setMessage('Hãy tải và chọn một bảng dữ liệu trước khi tiếp tục.', 'error');
          }
          state.form.caption = state.form.caption || state.form.tableName;
          navigateToStep(2);
      }

      async function onLoadTables() {
          const previousSpreadsheetId = state.form.spreadsheetId;
          syncForm();
          if (!state.form.spreadsheetId) return setMessage('Vui lòng nhập URL hoặc ID Google Sheets.', 'error');
          try {
              const result = await withLoading(() => callServer('adminListTables', state.form.spreadsheetId));
              state.form.spreadsheetId = result.spreadsheetId;
              state.spreadsheetName = result.spreadsheetName;
              state.tables = result.tables;
              if (previousSpreadsheetId && previousSpreadsheetId !== result.spreadsheetId) {
                  state.form.tableName = '';
                  state.columns = [];
              }
              setMessage(
                  state.tables.length ? `Đã tải ${state.tables.length} bảng.` : 'Spreadsheet chưa có bảng nào.',
                  state.tables.length ? 'success' : 'info'
              );
          } catch (error) {
              setMessage(error.message, 'error');
          }
          render();
      }
