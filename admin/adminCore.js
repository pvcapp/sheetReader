      const state = {
          form: { spreadsheetId: '', tableName: '', caption: '', objectCaption: '', allowNew: false },
          spreadsheetName: '',
          tables: [],
          columns: [],
          recentSheets: [],
          loadingCount: 0,
          step: 1,
          message: '',
          messageKind: 'info'
      };
      const TYPES = [
          ['text', 'Văn bản'], ['number', 'Số'], ['date', 'Ngày'],
          ['email', 'Email'], ['phone', 'Điện thoại'], ['boolean', 'Có/Không']
      ];
      const $ = (selector, root = document) => root.querySelector(selector);
      const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

      function element(tag, className, text) {
          const node = document.createElement(tag);
          if (className) node.className = className;
          if (text !== undefined) node.textContent = text;
          return node;
      }

      function option(label, value) {
          const node = element('option', '', label);
          node.value = value;
          return node;
      }

      function callServer(method, ...args) {
          if (!window.google?.script?.run) {
              return Promise.reject(new Error('Hãy mở trang admin từ URL triển khai Google Apps Script.'));
          }
          return new Promise((resolve, reject) => {
              google.script.run
                  .withSuccessHandler(resolve)
                  .withFailureHandler(error => reject(new Error(error?.message || 'Lỗi từ Google Apps Script.')))
                  [method](...args);
          });
      }

      async function withLoading(callback) {
          state.loadingCount += 1;
          updateLoadingToast();
          try {
              return await callback();
          } finally {
              state.loadingCount -= 1;
              updateLoadingToast();
          }
      }

      function updateLoadingToast() {
          const toast = $('#loading-toast');
          if (toast) toast.hidden = state.loadingCount === 0;
      }

      function setMessage(message, kind = 'info') {
          state.message = message;
          state.messageKind = kind;
          const target = $('#reader-status');
          if (target) {
              target.textContent = message;
              target.dataset.kind = kind;
          }
      }

      function getSpreadsheetId(input) {
          const value = String(input || '').trim();
          const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
          return match ? match[1] : value;
      }

      function syncForm() {
          const spreadsheetInput = $('#field-sheetUrl');
          const tableInput = $('#field-tableName');
          const captionInput = $('#field-caption');
          const objectCaptionInput = $('#field-objectCaption');
          const allowNewInput = $('#allow-new');
          if (spreadsheetInput) state.form.spreadsheetId = getSpreadsheetId(spreadsheetInput.value);
          if (tableInput) state.form.tableName = tableInput.value.trim();
          if (captionInput) state.form.caption = captionInput.value.trim();
          if (objectCaptionInput) state.form.objectCaption = objectCaptionInput.value.trim();
          if (allowNewInput) state.form.allowNew = allowNewInput.checked;
      }

      function renderPageHeader() {
          const header = element('div', 'reader-page-heading');
          header.append(
              element('h1', 'reader-title', 'Chia sẻ trang tính Google'),
              element('p', 'reader-subtitle', 'Chia sẻ và cập nhật danh sách thật dễ dàng')
          );
          return header;
      }

      function renderWizardProgress() {
          const progress = element('ol', 'reader-wizard-progress');
          [
              ['1', 'Chọn bảng'],
              ['2', 'Thông tin hiển thị'],
              ['3', 'Cấu hình cột'],
              ['4', 'Xem lại']
          ].forEach(([number, label], index) => {
              const item = element('li', 'reader-wizard-step');
              if (state.step === index + 1) item.dataset.state = 'current';
              else if (state.step > index + 1) item.dataset.state = 'complete';
              item.append(element('span', 'reader-wizard-number', number), element('span', '', label));
              progress.append(item);
          });
          return progress;
      }

      function navigateToStep(step) {
          state.step = step;
          state.message = '';
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      function renderTextField({ id, label, value = '', required = false, hint = '' }) {
          const field = element('div', 'reader-field');
          const caption = element('label', '', `${label}${required ? ' *' : ''}`);
          caption.htmlFor = id;
          const input = element('input', 'reader-input');
          input.id = id;
          input.value = value;
          input.required = required;
          input.placeholder = hint;
          field.append(caption, input);
          return field;
      }

      function renderAllowNewToggle() {
          const label = element('label', 'reader-checkbox');
          const input = document.createElement('input');
          input.id = 'allow-new';
          input.type = 'checkbox';
          input.checked = state.form.allowNew;
          label.append(input, element('span', '', 'Cho phép thêm bản ghi mới'));
          return label;
      }

      function renderStepTwo() {
          const card = element('section', 'reader-card');
          card.append(element('h2', '', 'Bước 2 · Thông tin hiển thị'));
          card.append(
              element('p', 'reader-help', `Bảng đã chọn: ${state.form.tableName}`),
              renderTextField({
                  id: 'field-caption',
                  label: 'Caption hiển thị',
                  value: state.form.caption || state.form.tableName,
                  required: true,
                  hint: 'Ví dụ: Danh sách học sinh'
              }),
              renderTextField({
                  id: 'field-objectCaption',
                  label: 'Tên đối tượng',
                  value: state.form.objectCaption,
                  required: true,
                  hint: 'Ví dụ: học sinh, khách hàng'
              }),
              renderAllowNewToggle()
          );
          const actions = element('div', 'reader-wizard-actions');
          const back = element('button', 'reader-button secondary', 'Quay lại');
          back.type = 'button';
          back.addEventListener('click', () => navigateToStep(1));
          const next = element('button', 'reader-button', 'Tiếp theo');
          next.type = 'button';
          next.addEventListener('click', onLoadColumns);
          actions.append(back, next);
          card.append(actions);
          return card;
      }

      function renderAdmin() {
          const page = element('div');
          page.append(renderPageHeader());
          page.append(renderWizardProgress());
          if (state.step === 1) page.append(renderStepOne());
          if (state.step === 2) page.append(renderStepTwo());
          if (state.step === 3) page.append(renderStepThree());
          if (state.step === 4) page.append(renderStepFour());
          page.append(renderRecentSheetsCard());
          const status = element('div', 'reader-status');
          status.id = 'reader-status';
          status.setAttribute('role', 'status');
          status.setAttribute('aria-live', 'polite');
          status.textContent = state.message;
          if (state.message) status.dataset.kind = state.messageKind;
          page.append(status);
          return page;
      }

      function render() {
          const root = $('#app');
          root.replaceChildren();
          const shell = element('div', 'reader-shell');
          const header = element('header', 'reader-header');
          const brand = element('div', 'reader-brand');
          brand.append(element('span', 'reader-logo', 'PVC'), element('span', 'reader-brand-caption', 'PVC Sheet Reader (Admin)'));
          const headerActions = element('div', 'reader-header-actions');
          const viewList = element('a', 'reader-button secondary', 'Xem danh sách');
          viewList.href = '#saved-configurations';
          headerActions.append(viewList);
          header.append(brand, headerActions);
          const main = element('main', 'reader-main');
          main.append(renderAdmin());
          shell.append(header, main);
          root.append(shell);
      }

      async function start() {
          render();
          try {
              await withLoading(loadRecentSheets);
              render();
          } catch (error) {
              setMessage(error.message, 'error');
              render();
          }
      }

      start();
