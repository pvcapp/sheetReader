const DEMO_KEY = 'pvcSheetReader_demo_v1';
      const CONFIG_KEY = 'pvcSheetReader_config';
      const STUDENTS_KEY = 'pvcSheetReader_students';
      const COLUMNS_KEY = 'pvcSheetReader_columns';
      const DEMO_STUDENTS = [
          { id: 'HS001', name: 'Nguyễn Minh Anh', className: 'Lớp 3A', guardian: 'Nguyễn Văn Bình', phone: '0901 234 567', email: 'binh.nguyen@example.test', birthDate: '2017-04-12', notes: 'Dị ứng hải sản' },
          { id: 'HS002', name: 'Trần Gia Bảo', className: 'Lớp 3A', guardian: 'Trần Thu Hà', phone: '0902 345 678', email: 'ha.tran@example.test', birthDate: '2017-08-03', notes: '' },
          { id: 'HS003', name: 'Lê Khánh Linh', className: 'Lớp 4B', guardian: 'Lê Hoàng Nam', phone: '0903 456 789', email: 'nam.le@example.test', birthDate: '2016-11-25', notes: 'Đón trẻ sau 16:00' },
          { id: 'HS004', name: 'Phạm Đức Minh', className: 'Lớp 5A', guardian: 'Phạm Thu Trang', phone: '0904 567 890', email: 'trang.pham@example.test', birthDate: '2015-02-14', notes: '' },
          { id: 'HS005', name: 'Đỗ Bảo Ngọc', className: 'Lớp 2B', guardian: 'Đỗ Quang Huy', phone: '0905 678 901', email: 'huy.do@example.test', birthDate: '2018-06-30', notes: '' }
      ];
      const DEFAULT_COLUMNS = [
          { key: 'id', label: 'Mã học sinh', type: 'text', visible: true, editable: false, required: true },
          { key: 'name', label: 'Họ và tên', type: 'text', visible: true, editable: false, required: true },
          { key: 'className', label: 'Lớp', type: 'text', visible: true, editable: false, required: false },
          { key: 'guardian', label: 'Tên phụ huynh', type: 'text', visible: true, editable: true, required: true },
          { key: 'phone', label: 'Số điện thoại', type: 'phone', visible: true, editable: true, required: true },
          { key: 'email', label: 'Email', type: 'email', visible: true, editable: true, required: false },
          { key: 'birthDate', label: 'Ngày sinh', type: 'date', visible: true, editable: true, required: false },
          { key: 'notes', label: 'Ghi chú', type: 'text', visible: true, editable: true, required: false }
      ];
      const DEMO_TABLES = [
          {
              name: 'DANH SACH HOC SINH',
              objectCaption: 'Học sinh',
              columns: structuredCloneSafe(DEFAULT_COLUMNS),
              records: structuredCloneSafe(DEMO_STUDENTS)
          },
          {
              name: 'DANH SACH CBCNV',
              objectCaption: 'Cán bộ, nhân viên',
              columns: [
                  { key: 'id', label: 'Mã nhân viên', type: 'text', visible: true, editable: false, required: true },
                  { key: 'name', label: 'Họ và tên', type: 'text', visible: true, editable: false, required: true },
                  { key: 'department', label: 'Phòng ban', type: 'text', visible: true, editable: true, required: false },
                  { key: 'position', label: 'Chức vụ', type: 'text', visible: true, editable: true, required: false },
                  { key: 'phone', label: 'Số điện thoại', type: 'phone', visible: true, editable: true, required: false },
                  { key: 'email', label: 'Email', type: 'email', visible: true, editable: true, required: false }
              ],
              records: [
                  { id: 'NV001', name: 'Nguyễn Thanh Hà', department: 'Kế toán', position: 'Kế toán trưởng', phone: '0912 345 678', email: 'ha.nguyen@example.test' },
                  { id: 'NV002', name: 'Trần Quốc Dũng', department: 'Kỹ thuật', position: 'Chuyên viên', phone: '0913 456 789', email: 'dung.tran@example.test' },
                  { id: 'NV003', name: 'Lê Thu Hương', department: 'Nhân sự', position: 'Trưởng phòng', phone: '0914 567 890', email: 'huong.le@example.test' }
              ]
          },
          {
              name: 'DANH SACH KHACH HANG',
              objectCaption: 'Khách hàng',
              columns: [
                  { key: 'id', label: 'Mã khách hàng', type: 'text', visible: true, editable: false, required: true },
                  { key: 'name', label: 'Tên khách hàng', type: 'text', visible: true, editable: false, required: true },
                  { key: 'company', label: 'Công ty', type: 'text', visible: true, editable: true, required: false },
                  { key: 'phone', label: 'Số điện thoại', type: 'phone', visible: true, editable: true, required: false },
                  { key: 'email', label: 'Email', type: 'email', visible: true, editable: true, required: false },
                  { key: 'notes', label: 'Ghi chú', type: 'text', visible: true, editable: true, required: false }
              ],
              records: [
                  { id: 'KH001', name: 'Công ty Minh Phát', company: 'Minh Phát', phone: '0921 111 222', email: 'lienhe@minhphat.example.test', notes: 'Khách hàng doanh nghiệp' },
                  { id: 'KH002', name: 'Trần Ngọc Mai', company: 'Cá nhân', phone: '0922 333 444', email: 'mai.tran@example.test', notes: '' },
                  { id: 'KH003', name: 'Công ty An Bình', company: 'An Bình', phone: '0923 555 666', email: 'info@anbinh.example.test', notes: 'Liên hệ giờ hành chính' }
              ]
          }
      ];
      const TYPE_OPTIONS = [
          ['text', 'Văn bản'], ['number', 'Số'], ['date', 'Ngày'], ['email', 'Email'], ['phone', 'Điện thoại'], ['boolean', 'Có/Không']
      ];
      const PAGE = 'client';
      const IS_GAS = Boolean(window.google && google.script && google.script.run);

      window.APP = window.APP || {};
      const requestedMode = window.PVC_APP_MODE || new URLSearchParams(location.search).get('mode');
      APP.mode = requestedMode === 'demo' ? 'demo' : requestedMode === 'live' || IS_GAS ? 'live' : 'demo';
      APP.state = APP.state || {};
      APP.state.page = PAGE;
      APP.state.selectedStudentId = '';
      APP.state.search = '';

      function safeRead(key, fallback) {
          try {
              const value = localStorage.getItem(key);
              return value === null ? fallback : JSON.parse(value);
          } catch (error) {
              console.error('Không thể đọc dữ liệu PVC Sheet Reader:', error);
              throw new Error('Không thể đọc dữ liệu lưu trên trình duyệt. Hãy kiểm tra quyền truy cập localStorage.');
          }
      }

      function safeWrite(key, value) {
          try {
              localStorage.setItem(key, JSON.stringify(value));
          } catch (error) {
              console.error('Không thể lưu dữ liệu PVC Sheet Reader:', error);
              throw new Error('Không thể lưu dữ liệu vào trình duyệt. Hãy kiểm tra dung lượng hoặc quyền truy cập localStorage.');
          }
      }

      function validStore(value) {
          return value && typeof value === 'object' && (
              (Array.isArray(value.sheets) && value.sheets.length > 0 && value.sheets.every(sheet =>
                  sheet && sheet.config && typeof sheet.config === 'object' &&
                  Array.isArray(sheet.students) && Array.isArray(sheet.columns)
              )) ||
              (value.config && typeof value.config === 'object' &&
                  Array.isArray(value.students) && Array.isArray(value.columns))
          );
      }

      function initialStore() {
          const table = DEMO_TABLES[0];
          const sheet = {
              config: {
                  sheetId: 'DEMO_SHEET_001',
                  tableName: table.name,
                  objectCaption: table.objectCaption,
                  caption: table.name,
                  allowNew: true,
                  key: `${'DEMO_SHEET_001'}::${table.name}`
              },
              columns: structuredCloneSafe(table.columns),
              students: structuredCloneSafe(table.records),
              stats: emptyStats(),
              createdAt: new Date().toISOString(),
              lastActivityAt: new Date().toISOString()
          };
          return { sheets: [sheet], activeSheetId: sheet.config.key };
      }

      function emptyStats() {
          return { viewCount: 0, addCount: 0, updateCount: 0, lastViewedAt: '', lastChangedAt: '' };
      }

      function normalizeStats(stats) {
          return {
              ...emptyStats(),
              ...(stats && typeof stats === 'object' ? stats : {})
          };
      }

      function normalizeStore(store) {
          if (Array.isArray(store.sheets) && store.sheets.length) {
              store.sheets.forEach(sheet => {
                  sheet.config.tableName = sheet.config.tableName || DEMO_TABLES[0].name;
                  sheet.config.objectCaption = sheet.config.objectCaption || 'Học sinh';
                  sheet.config.key = sheet.config.key || `${sheet.config.sheetId}::${sheet.config.tableName}`;
                  sheet.stats = normalizeStats(sheet.stats);
                  sheet.createdAt = sheet.createdAt || new Date().toISOString();
                  sheet.lastActivityAt = sheet.lastActivityAt || sheet.createdAt;
              });
          } else if (store.config && Array.isArray(store.students) && Array.isArray(store.columns)) {
              const sheet = {
                  config: store.config,
                  students: store.students,
                  columns: store.columns,
                  stats: emptyStats(),
                  createdAt: new Date().toISOString(),
                  lastActivityAt: new Date().toISOString()
              };
              sheet.config.tableName = sheet.config.tableName || DEMO_TABLES[0].name;
              sheet.config.objectCaption = sheet.config.objectCaption || 'Học sinh';
              sheet.config.key = `${sheet.config.sheetId}::${sheet.config.tableName}`;
              store.sheets = [sheet];
              store.activeSheetId = sheet.config.key;
          }
          if (!store.sheets.some(sheet => sheet.config.key === store.activeSheetId)) {
              const legacyActive = store.sheets.find(sheet => sheet.config.sheetId === store.activeSheetId);
              store.activeSheetId = legacyActive?.config.key || store.sheets[0]?.config.key || '';
          }
          return store;
      }

      function structuredCloneSafe(value) {
          return JSON.parse(JSON.stringify(value));
      }

      APP.cache = {
          data: null,
          init() {
              if (APP.mode === 'live') {
                  return APP.api.load().then(data => {
                      if (!validStore(data)) throw new Error('Dữ liệu client từ Google Sheets không đúng định dạng.');
                      this.data = normalizeStore(data);
                      return this.data;
                  });
              }
              const saved = safeRead(DEMO_KEY, null);
              if (saved !== null && !validStore(saved)) {
                  throw new Error('Dữ liệu đã lưu không đúng định dạng. Hãy xóa dữ liệu trang web trong trình duyệt rồi tải lại.');
              }
              this.data = normalizeStore(saved || initialStore());
              if (!saved) this.save();
              return Promise.resolve(this.data);
          },
          activeSheet() {
              return this.data?.sheets?.find(sheet => sheet.config.key === this.data.activeSheetId) || null;
          },
          selectSheet(sheetKey) {
              const sheet = this.data.sheets.find(item => item.config.key === sheetKey);
              if (!sheet) throw new Error('Không tìm thấy sheet đã chọn.');
              this.data.activeSheetId = sheetKey;
              this.save();
              return sheet;
          },
          recordActivity(type) {
              const sheet = this.activeSheet();
              if (!sheet) return;
              const now = new Date().toISOString();
              sheet.stats = normalizeStats(sheet.stats);
              if (type === 'view') {
                  sheet.stats.viewCount += 1;
                  sheet.stats.lastViewedAt = now;
              } else if (type === 'add' || type === 'update') {
                  if (type === 'add') sheet.stats.addCount += 1;
                  if (type === 'update') sheet.stats.updateCount += 1;
                  sheet.stats.lastChangedAt = now;
              } else {
                  throw new Error(`Loại hoạt động không hợp lệ: ${type}`);
              }
              sheet.lastActivityAt = now;
              this.save();
          },
          save() {
              if (APP.mode !== 'demo') return;
              safeWrite(DEMO_KEY, this.data);
              const active = this.activeSheet();
              if (active) {
                  safeWrite(CONFIG_KEY, active.config);
                  safeWrite(STUDENTS_KEY, active.students);
                  safeWrite(COLUMNS_KEY, active.columns);
              }
          },
          reset() {
              this.data = initialStore();
              this.save();
          }
      };

      APP.view = APP.view || {};
      APP.view.ui = {
          tabs: Object.create(null),
          init() {
              const root = document.getElementById('app');
              root.replaceChildren();
              const shell = document.createElement('div');
              shell.className = 'reader-shell';
              const header = document.createElement('header');
              header.className = 'reader-header';
              header.innerHTML = '<a class="reader-brand" href="index.html"><span class="reader-logo">PVC</span><span class="reader-brand-caption">PVC Sheet Reader</span></a>';
              const main = document.createElement('main');
              main.id = 'view';
              main.className = 'reader-main';
              shell.append(header, main);
              root.append(shell);
          },
          addTab(name, element) {
              if (!element || !(element instanceof Node)) throw new TypeError('Tab cần có một phần tử DOM hợp lệ.');
              const tab = document.createElement('section');
              tab.id = `${name}_tab`;
              tab.className = 'view__tab';
              tab.dataset.tab = name;
              tab.append(element);
              this.tabs[name] = tab;
              document.getElementById('view').append(tab);
              return tab;
          },
          showTab(name) {
              Object.values(this.tabs).forEach(tab => { tab.hidden = tab.dataset.tab !== name; });
          }
      };

      APP.api = {
          invoke(method, payload) {
              if (APP.mode === 'demo') return Promise.reject(new Error('API trực tiếp hiện không khả dụng.'));
              if (!IS_GAS) return Promise.reject(new Error('Không tìm thấy Google Apps Script. Mở ứng dụng đã triển khai để dùng chế độ trực tiếp.'));
              return new Promise((resolve, reject) => {
                  google.script.run
                      .withSuccessHandler(resolve)
                      .withFailureHandler(error => reject(new Error(error && error.message ? error.message : 'Lỗi từ Google Apps Script.')))
                      [method](payload);
              });
          },
          load() {
              return this.invoke('clientGetInitialData', {});
          },
          saveConfig(config) {
              return this.invoke('sv_pvcReader_saveConfig', config);
          },
          saveStudent(student, isNew) {
              return this.invoke(isNew ? 'sv_pvcReader_addStudent' : 'sv_pvcReader_updateStudent', student);
          }
      };

      const $ = (selector, root = document) => root.querySelector(selector);
      const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
      const el = (tag, className, text) => {
          const node = document.createElement(tag);
          if (className) node.className = className;
          if (text !== undefined) node.textContent = text;
          return node;
      };
      const attr = (value) => String(value ?? '');
      const escape = (value) => attr(value).replace(/[&<>"']/g, char => ({
          '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[char]);
      const normalize = (value) => attr(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();

      function status(message, kind = 'info', targetId = 'reader-status') {
          const target = document.getElementById(targetId);
          if (!target) return;
          target.textContent = message;
          target.dataset.kind = kind;
      }

      function createStatus() {
          const node = el('div', 'reader-status');
          node.id = 'reader-status';
          node.setAttribute('role', 'status');
          node.setAttribute('aria-live', 'polite');
          return node;
      }

      function pageHeader(eyebrow, title, subtitle) {
          const header = el('div', 'reader-page-heading');
          if (eyebrow) header.append(el('div', 'reader-eyebrow', eyebrow));
          header.append(el('h1', 'reader-title', title), el('p', 'reader-subtitle', subtitle));
          return header;
      }

      function banner(text, warning = false) {
          const node = el('div', `reader-banner${warning ? ' warning' : ''}`, text);
          node.setAttribute('role', 'note');
          return node;
      }

      function inputField({ key, label, value, type = 'text', required = false, hint = '', full = false }) {
          const wrap = el('div', `reader-field${full ? ' full' : ''}`);
          const id = `field-${key}`;
          const labelEl = el('label', '', label + (required ? ' *' : ''));
          labelEl.htmlFor = id;
          const control = type === 'textarea' ? el('textarea', 'reader-textarea') : el('input', 'reader-input');
          control.id = id;
          control.name = key;
          control.value = attr(value);
          if (type !== 'textarea') control.type = type;
          if (required) control.required = true;
          if (hint) control.placeholder = hint;
          wrap.append(labelEl, control);
          return wrap;
      }

      function currentStore() {
          if (!APP.cache.data) return null;
          return APP.cache.activeSheet();
      }

      function requireDemo() {
          if (APP.mode !== 'demo') {
              status('Chế độ trực tiếp chỉ hỗ trợ xem dữ liệu.', 'error');
              return false;
          }
          return true;
      }

      function parseSheetId(input) {
          const value = input.trim();
          if (!value) return '';
          const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
          if (match) return match[1];
          if (/^[a-zA-Z0-9_-]{10,}$/.test(value)) return value;
          return '';
      }

      function inferType(key, values) {
          const sample = values.filter(value => value !== '' && value !== null && value !== undefined).slice(0, 10);
          if (/date|ngay|sinh/i.test(key) || (sample.length && sample.every(value => !Number.isNaN(Date.parse(value)) && /^\d{4}-\d{2}-\d{2}$/.test(String(value))))) return 'date';
          if (/email|mail/i.test(key)) return 'email';
          if (/phone|dienThoai|sdt/i.test(key)) return 'phone';
          if (sample.length && sample.every(value => String(value).trim() !== '' && Number.isFinite(Number(value)))) return 'number';
          return 'text';
      }

      function formatActivityDate(value) {
          if (!value) return 'Chưa có';
          const date = new Date(value);
          return Number.isNaN(date.getTime()) ? 'Chưa có' : date.toLocaleString('vi-VN');
      }
