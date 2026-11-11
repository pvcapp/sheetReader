function renderDetail() {
          const card = $('#student-detail');
          if (!card) return;
          const student = currentStore()?.students.find(item => recordIdentity(item) === APP.state.selectedStudentId);
          card.replaceChildren();
          if (!student) {
              card.append(el('div', 'reader-empty', `Chọn ${currentStore()?.config.objectCaption?.toLowerCase() || 'một đối tượng'} để xem thông tin.`));
              return;
          }
          const heading = el('div', 'reader-section-title');
          heading.append(el('h2', '', `Thông tin ${currentStore()?.config.objectCaption?.toLowerCase() || 'đối tượng'}`));
          card.append(heading);
          const detail = el('div', 'reader-detail');
          (currentStore().columns.filter(column => column.visible)).forEach(column => {
              const item = el('div', 'reader-detail-item');
              item.append(el('div', 'reader-detail-label', column.label), el('div', 'reader-detail-value', student[column.key] || '—'));
              detail.append(item);
          });
          card.append(detail);

          const actions = el('div', 'reader-detail-actions');
          const close = el('button', 'reader-button secondary small reader-detail-close', 'OK');
          close.type = 'button';
          close.addEventListener('click', closeStudentDetail);
          if (APP.mode === 'demo') {
              const edit = el('button', 'reader-button small', 'Cập nhật');
              edit.type = 'button';
              edit.addEventListener('click', () => showStudentForm(student));
              actions.append(edit);
          }
          actions.append(close);
          card.append(actions);
      }

      function closeStudentDetail() {
          $('#student-detail-overlay')?.classList.remove('is-open');
      }

      function onDetailKeydown(event) {
          if (event.key === 'Escape') closeStudentDetail();
      }

      function getRecordTitle(record) {
          const columns = currentStore()?.columns || [];
          const titleColumn = columns.find(column => column.key === 'name') ||
              columns.find(column => column.required && column.key !== 'id') ||
              columns.find(column => column.key !== 'id' && column.visible);
          return attr(record[titleColumn?.key] || record.id || 'Bản ghi');
      }

      function recordIdentity(record) {
          const columns = currentStore()?.columns || [];
          const identityColumn = columns.find(column => column.key === 'id') ||
              columns.find(column => column.required);
          return attr(record[identityColumn?.key] || record.id || getRecordTitle(record));
      }

      function getRecordSummary(record) {
          const columns = currentStore()?.columns || [];
          const idColumn = columns.find(column => column.key === 'id') || columns.find(column => column.required);
          const descriptor = ['className', 'department', 'company', 'position']
              .map(key => record[key])
              .find(Boolean);
          return [idColumn ? record[idColumn.key] : '', descriptor || ''].filter(Boolean).join(' · ');
      }
