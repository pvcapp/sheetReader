function renderClient() {
          const page = el('div');
          const store = currentStore();
          const tableName = store?.config.tableName || 'Danh sách dữ liệu';
          const objectCaption = store?.config.objectCaption || 'đối tượng';
          page.append(pageHeader('', tableName, ''));
          if (APP.cache.data?.sheets?.length > 1) {
              const selector = el('select', 'reader-select');
              selector.setAttribute('aria-label', 'Chọn danh sách');
              APP.cache.data.sheets.forEach(sheet => {
                  const option = el('option', '', sheet.config.caption || sheet.config.tableName);
                  option.value = sheet.config.key;
                  option.selected = sheet.config.key === APP.cache.data.activeSheetId;
                  selector.append(option);
              });
              selector.addEventListener('change', () => {
                  APP.cache.selectSheet(selector.value);
                  APP.state.search = '';
                  APP.state.selectedStudentId = '';
                  render();
              });
              page.append(selector);
          }
          const grid = el('div', 'reader-grid');
          const listCard = el('section', 'reader-card');
          const listHeading = el('div', 'reader-section-title');
          listHeading.append(el('span', 'reader-count', `${store?.students.length || 0} bản ghi`));
          listCard.append(listHeading);
          const search = el('div', 'reader-search');
          search.innerHTML = '<span class="reader-search-icon" aria-hidden="true">⌕</span>';
          const searchInput = el('input', 'reader-input');
          searchInput.id = 'student-search';
          searchInput.type = 'search';
          searchInput.placeholder = `Tìm ${objectCaption.toLowerCase()} theo tên hoặc thông tin`;
          searchInput.setAttribute('aria-label', `Tìm ${objectCaption.toLowerCase()}`);
          search.append(searchInput);
          listCard.append(search);
          const studentList = el('div', 'reader-student-list');
          studentList.id = 'student-list';
          listCard.append(studentList);
          const detailColumn = el('div', 'reader-detail-overlay');
          detailColumn.id = 'student-detail-overlay';
          const detailCard = el('section', 'reader-card');
          detailCard.id = 'student-detail';
          detailColumn.append(detailCard);
          grid.append(listCard, detailColumn);
          page.append(grid);
          const actions = el('div', 'reader-actions');
          actions.style.marginTop = '18px';
          actions.id = 'client-actions';
          if (APP.mode === 'demo' && store?.config.allowNew) {
              const add = el('button', 'reader-button', `+ Thêm ${objectCaption.toLowerCase()}`);
              add.type = 'button';
              add.id = 'add-student';
              add.classList.add('reader-floating-add');
              actions.append(add);
          }
          page.append(actions, createStatus());
          searchInput.addEventListener('input', () => {
              APP.state.search = searchInput.value;
              renderStudentList();
          });
          studentList.addEventListener('click', event => {
              const button = event.target.closest('[data-student-id]');
              if (!button) return;
              APP.state.selectedStudentId = button.dataset.studentId;
              renderStudentList();
              renderDetail();
              if (window.matchMedia('(max-width: 576px)').matches) {
                  $('#student-detail-overlay').classList.add('is-open');
              }
          });
          detailColumn.addEventListener('click', event => {
              if (event.target === detailColumn) closeStudentDetail();
          });
          document.addEventListener('keydown', onDetailKeydown);
          $('#add-student', actions)?.addEventListener('click', () => showStudentForm(null));
          renderStudentList();
          renderDetail();
          return page;
      }

      function renderStudentList() {
          const list = $('#student-list');
          if (!list) return;
          const students = currentStore()?.students || [];
          const query = normalize(APP.state.search);
          const matches = students.filter(student => normalize(Object.values(student).join(' ')).includes(query));
          if (!matches.some(student => recordIdentity(student) === APP.state.selectedStudentId)) {
              APP.state.selectedStudentId = matches[0] ? recordIdentity(matches[0]) : '';
          }
          list.replaceChildren();
          if (!matches.length) {
              list.append(el('div', 'reader-empty', `Không tìm thấy ${currentStore()?.config.objectCaption?.toLowerCase() || 'đối tượng'} phù hợp.`));
              return;
          }
          matches.forEach(student => {
              const button = el('button', 'reader-student');
              button.type = 'button';
              button.dataset.studentId = recordIdentity(student);
              button.setAttribute('aria-current', recordIdentity(student) === APP.state.selectedStudentId ? 'true' : 'false');
              const title = getRecordTitle(student);
              const initials = title.trim().split(/\s+/).slice(-2).map(part => part.charAt(0)).join('');
              button.append(el('span', 'reader-avatar', initials));
              const info = el('span');
              info.append(el('span', 'reader-student-name', title), el('span', 'reader-student-meta', getRecordSummary(student)));
              button.append(info);
              list.append(button);
          });
          const count = $('.reader-count');
          if (count) count.textContent = `${matches.length} kết quả`;
      }
