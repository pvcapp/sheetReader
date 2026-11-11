function showStudentForm(student) {
    const isNew = !student;
    if (isNew && APP.mode !== 'demo') {
        status('Chế độ trực tiếp hiện chỉ cho phép cập nhật bản ghi.', 'error');
        return;
    }
    if (isNew && !currentStore().config.allowNew) {
        status('Cấu hình hiện không cho phép thêm bản ghi mới.', 'error');
        return;
          }
          const backdrop = el('div', 'reader-modal-backdrop');
          backdrop.id = 'student-modal';
          const modal = el('section', 'reader-modal');
          modal.setAttribute('role', 'dialog');
          modal.setAttribute('aria-modal', 'true');
          modal.setAttribute('aria-labelledby', 'student-form-title');
          const modalHead = el('div', 'reader-modal-head');
          const titleGroup = el('div');
          const objectCaption = currentStore().config.objectCaption?.toLowerCase() || 'đối tượng';
          titleGroup.append(el('h2', '', isNew ? `Thêm ${objectCaption}` : 'Cập nhật thông tin'), el('p', 'reader-help', 'Các trường có dấu * là bắt buộc.'));
          const close = el('button', 'reader-icon-button', '×');
          close.type = 'button';
          close.setAttribute('aria-label', 'Đóng');
          close.addEventListener('click', () => backdrop.remove());
          modalHead.append(titleGroup, close);
          const form = el('form');
          form.id = 'student-form';
          const grid = el('div', 'reader-form-grid');
          const columns = currentStore().columns.filter(column => isNew
              ? column.visible || column.required
              : column.editable && column.visible);
          if (!columns.length) {
              status('Chưa có cột nào được bật cho phép cập nhật.', 'error');
              return;
          }
          columns.forEach(column => {
              const type = column.type === 'date' ? 'date' : column.type === 'email' ? 'email' : column.type === 'number' ? 'number' : 'text';
              const field = inputField({
                  key: column.key,
                  label: column.label,
                  value: student?.[column.key] || (isNew && column.key === 'id' ? `HS${String(Date.now()).slice(-5)}` : ''),
                  type: column.key === 'notes' ? 'textarea' : type,
                  required: column.required,
                  full: column.key === 'notes'
              });
              grid.append(field);
          });
          if (isNew && !columns.some(column => column.key === 'id')) {
              grid.prepend(inputField({ key: 'id', label: 'Mã bản ghi', value: `ID${String(Date.now()).slice(-5)}`, required: true }));
          }
          form.append(grid);
          const formStatus = el('div', 'reader-status');
          formStatus.id = 'student-form-status';
          formStatus.setAttribute('role', 'status');
          formStatus.setAttribute('aria-live', 'polite');
          form.append(formStatus);
          const actions = el('div', 'reader-actions');
          actions.style.justifyContent = 'flex-end';
          const cancel = el('button', 'reader-button secondary', 'Hủy');
          cancel.type = 'button';
          cancel.addEventListener('click', () => backdrop.remove());
          const save = el('button', 'reader-button', isNew ? 'Thêm bản ghi' : 'Lưu cập nhật');
          save.type = 'submit';
          actions.append(cancel, save);
          form.append(actions);
          form.addEventListener('submit', event => {
              event.preventDefault();
              saveStudent(form, student, isNew, backdrop).catch(error => {
                  console.error('Không thể lưu bản ghi:', error);
                  setFormStatus(form, error.message || 'Không thể lưu bản ghi.', 'error');
              });
          });
          form.addEventListener('invalid', event => {
              const label = event.target.labels?.[0]?.textContent?.replace(/\s*\*$/, '');
              setFormStatus(form, label
                  ? `Vui lòng kiểm tra trường "${label}".`
                  : 'Vui lòng kiểm tra các trường bắt buộc.', 'error');
          }, true);
          form.addEventListener('input', () => {
              const message = $('#student-form-status', form);
              if (message?.dataset.kind === 'error') {
                  message.textContent = '';
                  message.dataset.kind = '';
              }
          });
          backdrop.addEventListener('click', event => {
              if (event.target === backdrop) backdrop.remove();
          });
          modal.append(modalHead, form);
          backdrop.append(modal);
          document.body.append(backdrop);
          $('#field-' + columns[0]?.key, form)?.focus();
      }

      function setFormStatus(form, message, kind = 'info') {
          const target = $('#student-form-status', form);
          if (!target) return;
          target.textContent = message;
          target.dataset.kind = kind;
      }

      async function saveStudent(form, oldStudent, isNew, backdrop) 
      {
          setFormStatus(form, '');
          const store = currentStore();
          const result = oldStudent ? { ...oldStudent } : {};
          const fields = $$('input[name], textarea[name]', form);
          fields.forEach(field => { result[field.name] = field.value.trim(); });
          const identityColumn = store.columns.find(column => column.key === 'id') ||
              store.columns.find(column => column.required);
          const displayColumn = store.columns.find(column => column.key === 'name') ||
              store.columns.find(column => column.required && column.key !== identityColumn?.key);
          if (identityColumn && !attr(result[identityColumn.key]).trim()) {
              return setFormStatus(form, `${identityColumn.label} không được để trống.`, 'error');
          }
          if (displayColumn && !attr(result[displayColumn.key]).trim()) {
              return setFormStatus(form, `${displayColumn.label} không được để trống.`, 'error');
          }
          if (identityColumn && store.students.some(item =>
              item[identityColumn.key] === result[identityColumn.key] &&
              item[identityColumn.key] !== oldStudent?.[identityColumn.key]
          )) {
              return setFormStatus(form, `${identityColumn.label} đã tồn tại. Vui lòng nhập giá trị khác.`, 'error');
          }
          for (const column of store.columns.filter(item => item.editable || (isNew && item.required))) {
              if (column.required && !attr(result[column.key]).trim()) {
                  return setFormStatus(form, `Vui lòng nhập ${column.label.toLowerCase()}.`, 'error');
              }
              if (column.type === 'email' && result[column.key] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result[column.key])) {
                  return setFormStatus(form, 'Địa chỉ email chưa đúng định dạng.', 'error');
              }
          }
          if (!isNew && (!identityColumn || !oldStudent)) {
              return setFormStatus(form, 'Không xác định được bản ghi cần cập nhật.', 'error');
          }

          const changes = {};
          store.columns.filter(column => column.editable && column.visible).forEach(column => {
              changes[column.key] = result[column.key] ?? '';
          });
          const submit = $('button[type="submit"]', form);
          if (submit) {
              submit.disabled = true;
              submit.textContent = 'Đang lưu...';
          }
          setFormStatus(form, 'Đang lưu cập nhật...');
          try {
              if (isNew) {
                  store.students.push(result);
              } else if (APP.mode === 'live') {
                  await APP.api.saveStudent({
                      sheetKey: store.config.key,
                      identityKey: identityColumn.key,
                      identityValue: oldStudent[identityColumn.key],
                      values: changes
                  }, false);
                  const index = store.students.findIndex(item => recordIdentity(item) === recordIdentity(oldStudent));
                  if (index < 0) throw new Error('Đã lưu trên Google Sheets nhưng không tìm thấy bản ghi trong danh sách hiện tại.');
                  store.students[index] = result;
              } else {
                  const index = store.students.findIndex(item => recordIdentity(item) === recordIdentity(oldStudent));
                  if (index < 0) throw new Error('Không tìm thấy bản ghi cần cập nhật.');
                  store.students[index] = result;
              }
              APP.cache.recordActivity(isNew ? 'add' : 'update');
              APP.state.selectedStudentId = recordIdentity(result);
              backdrop.remove();
              renderStudentList();
              renderDetail();
              status(isNew ? 'Đã thêm bản ghi.' : 'Đã cập nhật thông tin.', 'success');
          } catch (error) {
              if (submit) {
                  submit.disabled = false;
                  submit.textContent = isNew ? 'Thêm bản ghi' : 'Lưu cập nhật';
              }
              setFormStatus(form, error.message || 'Không thể lưu bản ghi.', 'error');
          }
      }
