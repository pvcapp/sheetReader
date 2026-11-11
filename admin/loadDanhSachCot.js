      function renderColumnRow(column) {
          const row = element('div', 'reader-column-row');
          row.dataset.key = column.key;
          row.append(element('div', 'reader-column-name', column.label));
          const typeSelect = element('select', 'reader-select');
          typeSelect.dataset.property = 'type';
          typeSelect.setAttribute('aria-label', `Kiểu dữ liệu ${column.label}`);
          TYPES.forEach(([value, label]) => typeSelect.append(option(label, value)));
          typeSelect.value = column.type;
          const settings = element('div', 'reader-column-settings');
          [['visible', 'Hiển thị'], ['editable', 'Cho sửa'], ['required', 'Bắt buộc']].forEach(([property, label]) => {
              const wrapper = element('label', 'reader-checkbox');
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.checked = Boolean(column[property]);
              checkbox.dataset.property = property;
              checkbox.setAttribute('aria-label', `${label}: ${column.label}`);
              wrapper.append(checkbox, element('span', '', label));
              settings.append(wrapper);
          });
          row.append(typeSelect, settings);
          return row;
      }

      function renderColumnsCard() {
          const card = element('section', 'reader-card');
          const title = element('div', 'reader-section-title');
          title.append(element('h2', '', 'Cấu hình các cột'), element('span', 'reader-badge', `${state.columns.length} cột`));
          card.append(title, element('p', 'reader-help', 'Chọn kiểu dữ liệu, cột hiển thị, cột có thể sửa và cột bắt buộc.'));
          const list = element('div', 'reader-column-list');
          list.id = 'column-list';
          if (!state.columns.length) {
              list.append(element('div', 'reader-empty', 'Tải danh sách cột của bảng để bắt đầu cấu hình.'));
          } else {
              state.columns.forEach(column => list.append(renderColumnRow(column)));
          }
          card.append(list);
          return card;
      }

      function renderConfigurationSummary() {
          const summary = element('section', 'reader-card reader-summary');
          summary.append(element('h2', '', `Thông tin bảng dữ liệu: ${state.spreadsheetName || state.form.tableName}`));
          const details = element('dl', 'reader-summary-grid');
          [
              ['Caption', state.form.caption],
              ['Tên đối tượng', state.form.objectCaption],
              ['Bảng dữ liệu', state.form.tableName],
              ['Cho phép thêm bản ghi', state.form.allowNew ? 'Có' : 'Không']
          ].forEach(([label, value]) => {
              const item = element('div', 'reader-summary-item');
              item.append(element('dt', '', label), element('dd', '', value || '—'));
              details.append(item);
          });
          summary.append(details);
          return summary;
      }

      function renderColumnPreview() {
          const card = element('section', 'reader-card');
          card.append(element('h2', '', 'Danh sách các cột'));
          const wrapper = element('div', 'reader-preview-scroll');
          const table = element('table', 'reader-preview-table');
          const head = document.createElement('thead');
          const headerRow = document.createElement('tr');
          ['Tên cột', 'Kiểu dữ liệu', 'Hiển thị', 'Cho sửa', 'Bắt buộc'].forEach(label => {
              headerRow.append(element('th', '', label));
          });
          head.append(headerRow);
          const body = document.createElement('tbody');
          state.columns.forEach(column => {
              const row = document.createElement('tr');
              row.append(
                  element('th', '', column.label),
                  element('td', '', TYPES.find(([value]) => value === column.type)?.[1] || column.type),
                  element('td', '', column.visible ? 'Có' : 'Không'),
                  element('td', '', column.editable ? 'Có' : 'Không'),
                  element('td', '', column.required ? 'Có' : 'Không')
              );
              body.append(row);
          });
          table.append(head, body);
          wrapper.append(table);
          card.append(wrapper);
          return card;
      }

      function renderStepThree() {
          const page = element('div', 'reader-step-content');
          page.append(renderColumnsCard());
          const actions = element('div', 'reader-wizard-actions');
          const back = element('button', 'reader-button secondary', 'Quay lại');
          back.type = 'button';
          back.addEventListener('click', () => navigateToStep(2));
          const next = element('button', 'reader-button', 'Tiếp theo');
          next.type = 'button';
          next.addEventListener('click', () => {
              state.columns = collectColumns();
              navigateToStep(4);
          });
          actions.append(back, next);
          page.append(actions);
          return page;
      }

      function renderStepFour() {
          const page = element('div', 'reader-step-content');
          page.append(renderConfigurationSummary(), renderColumnPreview());
          const actions = element('div', 'reader-wizard-actions');
          const back = element('button', 'reader-button secondary', 'Quay lại');
          back.type = 'button';
          back.addEventListener('click', () => navigateToStep(3));
          const save = element('button', 'reader-button', 'Lưu cấu hình');
          save.type = 'button';
          save.addEventListener('click', onSaveConfiguration);
          actions.append(back, save);
          page.append(actions);
          return page;
      }

      async function onLoadColumns() {
          syncForm();
          if (!state.form.caption || !state.form.objectCaption) {
              return setMessage('Vui lòng nhập caption và tên đối tượng trước khi tiếp tục.', 'error');
          }
          if (!state.form.spreadsheetId || !state.form.tableName) {
              return setMessage('Thiếu spreadsheet hoặc bảng dữ liệu. Hãy quay lại bước chọn bảng.', 'error');
          }
          try {
              state.columns = await withLoading(() => callServer('adminGetColumns', state.form.spreadsheetId, state.form.tableName));
              state.step = 3;
              setMessage(`Đã tải ${state.columns.length} cột từ bảng "${state.form.tableName}".`, 'success');
          } catch (error) {
              setMessage(error.message, 'error');
          }
          render();
      }
