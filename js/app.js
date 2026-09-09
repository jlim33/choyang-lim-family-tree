/**
 * 조양 임씨(兆陽 林氏) 가문 족보 & 친척 관리 메인 애플리케이션
 * - 상태 관리, 필수 유효성 검사 (성명, 이메일) 및 부모 성명 연동
 * - 가계도 계통도(Family Tree Hierarchy) 수형도 다이어그램 연동
 * - 한글 / 영어 (KO / EN) 원클릭 전환 다국어 엔진
 * - 7대 거점 스포트라이트 연동 및 지도 관리
 * - 어르신용 폰트 크기 토글 (LocalStorage 연동)
 * - 데이터 내보내기/가져오기 (JSON, CSV)
 */

class ChoyangClanApp {
  constructor() {
    this.STORAGE_KEY = 'choyang_im_clan_relatives_v2';
    this.FONT_KEY = 'choyang_im_font_size_mode';
    this.LANG_KEY = 'choyang_im_lang';
    this.VIEW_KEY = 'choyang_im_view_mode';

    this.relatives = [];
    this.currentLang = localStorage.getItem(this.LANG_KEY) || 'ko';
    this.currentFilter = {
      keyword: '',
      country: 'all',
      city: 'all'
    };
    this.currentView = localStorage.getItem(this.VIEW_KEY) || 'grid';
    this.currentTab = 'map'; // 'map' | 'tree' | 'directory'

    this.mapManager = null;
    this.treeManager = null;
    this.editingId = null;

    this.init();
  }

  init() {
    // 1. 데이터 로드
    this.loadRelativesData();

    // 2. 어르신 글자 크기 모드 복원
    this.initFontSizeMode();

    // 3. 지도 및 가계도 매니저 초기화
    this.mapManager = new ClanMapManager('clan-leaflet-map');
    this.mapManager.init();

    this.treeManager = new FamilyTreeManager('clan-tree-canvas');
    this.treeManager.init();

    // 4. 언어 설정 적용
    this.setLanguage(this.currentLang, false);

    // 5. 이벤트 리스너 등록
    this.bindEvents();

    // 6. 화면 렌더링
    this.renderAll();
  }

  // 데이터 로드 (로컬 스토리지 또는 초기 샘플 데이터)
  loadRelativesData() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.relatives = JSON.parse(saved);
      } else {
        this.relatives = [...INITIAL_RELATIVES_DATA];
        this.saveRelativesData();
      }
    } catch (e) {
      console.error('데이터 로드 실패, 초기 데이터로 복구:', e);
      this.relatives = [...INITIAL_RELATIVES_DATA];
    }
  }

  // 데이터 저장
  saveRelativesData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.relatives));
  }

  // 다국어 전환 (KO / EN)
  setLanguage(lang, showNotification = true) {
    this.currentLang = lang === 'en' ? 'en' : 'ko';
    localStorage.setItem(this.LANG_KEY, this.currentLang);

    // 버튼 활성화 클래스 동기화
    const koBtn = document.getElementById('lang-btn-ko');
    const enBtn = document.getElementById('lang-btn-en');
    if (koBtn) koBtn.classList.toggle('active', this.currentLang === 'ko');
    if (enBtn) enBtn.classList.toggle('active', this.currentLang === 'en');

    // DOM 번역 적용
    this.applyTranslations();

    // 동적 컴포넌트 재렌더링
    this.renderAll();

    if (showNotification) {
      const dict = I18N_DICTIONARY[this.currentLang];
      this.showToast(dict.toastLangChanged);
    }
  }

  // DOM 텍스트 번역 치환
  applyTranslations() {
    const dict = I18N_DICTIONARY[this.currentLang];
    if (!dict) return;

    // data-i18n 텍스트 치환
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // data-i18n-placeholder 치환
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });
  }

  // 탭 전환 (지도 뷰 / 가계도 뷰 / 명부 뷰)
  switchMainTab(tab) {
    this.currentTab = tab;

    // 탭 버튼 활성화 상태
    const tabMapBtn = document.getElementById('tab-btn-map');
    const tabTreeBtn = document.getElementById('tab-btn-tree');
    const tabDirBtn = document.getElementById('tab-btn-directory');

    if (tabMapBtn) tabMapBtn.classList.toggle('active', tab === 'map');
    if (tabTreeBtn) tabTreeBtn.classList.toggle('active', tab === 'tree');
    if (tabDirBtn) tabDirBtn.classList.toggle('active', tab === 'directory');

    // 섹션 표시/숨김
    const mapSec = document.getElementById('clan-map-section');
    const treeSec = document.getElementById('clan-tree-section');
    const dirSec = document.getElementById('relatives-section');

    if (tab === 'map') {
      if (mapSec) mapSec.style.display = 'block';
      if (treeSec) treeSec.style.display = 'none';
      if (dirSec) dirSec.style.display = 'block';
      if (this.mapManager && this.mapManager.map) {
        setTimeout(() => this.mapManager.map.invalidateSize(), 150);
      }
    } else if (tab === 'tree') {
      if (mapSec) mapSec.style.display = 'none';
      if (treeSec) treeSec.style.display = 'block';
      if (dirSec) dirSec.style.display = 'block';
      if (this.treeManager) {
        this.treeManager.render(this.relatives);
      }
    } else {
      // directory focus
      if (mapSec) mapSec.style.display = 'block';
      if (treeSec) treeSec.style.display = 'none';
      if (dirSec) {
        dirSec.style.display = 'block';
        dirSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // 어르신 글자 크기 초기화
  initFontSizeMode() {
    const savedMode = localStorage.getItem(this.FONT_KEY) || 'normal';
    this.setFontSize(savedMode, false);
  }

  // 글자 크기 변경 (normal: 100%, large: 125%, xlarge: 150%)
  setFontSize(mode, showNotification = true) {
    document.body.classList.remove('font-large', 'font-xlarge');

    if (mode === 'large') {
      document.body.classList.add('font-large');
    } else if (mode === 'xlarge') {
      document.body.classList.add('font-xlarge');
    }

    localStorage.setItem(this.FONT_KEY, mode);

    // 버튼 활성화 클래스 동기화
    document.querySelectorAll('.font-toggle-btn').forEach(btn => {
      if (btn.dataset.size === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (showNotification) {
      const isEn = this.currentLang === 'en';
      const labels = isEn 
        ? { normal: 'Normal (100%)', large: 'Large (125%)', xlarge: 'Extra Large (150%)' }
        : { normal: '보통 (100%)', large: '크게 (125%)', xlarge: '아주 크게 (150%)' };
      this.showToast(isEn ? `Font size adjusted to ${labels[mode]}` : `글자 크기가 '${labels[mode]}'로 변경되었습니다.`);
    }

    // 지도 크기 재계산
    if (this.mapManager && this.mapManager.map) {
      setTimeout(() => this.mapManager.map.invalidateSize(), 200);
    }
  }

  // 전체 화면 갱신
  renderAll() {
    this.renderStats();
    this.renderHubCards();
    this.updateCountryFilterOptions();
    this.updateParentNameOptions();
    this.renderRelativesList();

    if (this.mapManager) {
      this.mapManager.renderMarkers(this.relatives);
    }
    if (this.treeManager) {
      this.treeManager.render(this.relatives);
    }
  }

  // 상단 통계 요약 갱신
  renderStats() {
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const totalCount = this.relatives.length;
    const countries = new Set(this.relatives.map(r => r.country).filter(Boolean));
    const cities = new Set(this.relatives.map(r => r.city).filter(Boolean));

    const majorCities = MAJOR_HUBS.map(h => h.city);
    const majorHubsCount = this.relatives.filter(r => majorCities.includes(r.city)).length;

    const elTotal = document.getElementById('stat-total-relatives');
    const elCountries = document.getElementById('stat-total-countries');
    const elCities = document.getElementById('stat-total-cities');
    const elHubs = document.getElementById('stat-major-hubs');

    if (elTotal) elTotal.textContent = `${totalCount}${dict.unitPeople}`;
    if (elCountries) elCountries.textContent = `${countries.size}${dict.unitCountries}`;
    if (elCities) elCities.textContent = `${cities.size}${dict.unitCities}`;
    if (elHubs) elHubs.textContent = `${majorHubsCount}${dict.unitPeople}`;
  }

  // 7대 거점 스포트라이트 카드 렌더링
  renderHubCards() {
    const container = document.getElementById('spotlight-hubs-grid');
    if (!container) return;

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    container.innerHTML = MAJOR_HUBS.map(hub => {
      const count = this.relatives.filter(r => r.city === hub.city).length;
      const isActive = this.currentFilter.city === hub.city;
      const cityName = isEn ? hub.cityEn : hub.city;
      const countryName = isEn ? hub.countryEn : hub.country;

      return `
        <div class="hub-card ${isActive ? 'active' : ''}" onclick="window.app.handleHubClick('${hub.city}')">
          <div class="hub-card-top">
            <span class="hub-flag">${hub.flag}</span>
            <span class="hub-count-badge">${count}${dict.residentCountSuffix}</span>
          </div>
          <div class="hub-city-name">${cityName}</div>
          <div class="hub-country-name">${countryName}</div>
        </div>
      `;
    }).join('');
  }

  // 7대 거점 카드 클릭 핸들러
  handleHubClick(cityName) {
    if (this.currentFilter.city === cityName) {
      this.clearCityFilter();
    } else {
      this.filterByCity(cityName);
      if (this.mapManager) {
        this.mapManager.flyToCity(cityName);
      }
    }
  }

  // 국가 필터 드롭다운 옵션 구성
  updateCountryFilterOptions() {
    const select = document.getElementById('filter-country');
    if (!select) return;

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const countries = Array.from(new Set(this.relatives.map(r => r.country).filter(Boolean)));
    const currentVal = this.currentFilter.country;

    let html = `<option value="all">${dict.countryFilterAll} (${this.relatives.length})</option>`;
    countries.forEach(country => {
      const count = this.relatives.filter(r => r.country === country).length;
      html += `<option value="${country}" ${currentVal === country ? 'selected' : ''}>${country} (${count})</option>`;
    });

    select.innerHTML = html;
  }

  // 부모 성명 자동완성 Datalist 갱신
  updateParentNameOptions() {
    const datalist = document.getElementById('parent-name-options');
    if (!datalist) return;

    // 현재 등록된 고유 친척 이름 목록 추출
    const names = Array.from(new Set(this.relatives.map(r => r.name.trim()).filter(Boolean)));
    names.sort();

    datalist.innerHTML = names.map(name => `<option value="${this.escapeHtml(name)}">`).join('');
  }

  // 도시 필터 적용
  filterByCity(cityName) {
    this.currentFilter.city = cityName;
    this.updateActiveFilterUI();
    this.renderRelativesList();
    this.renderHubCards();

    // 친척 명부 영역으로 스크롤 이동
    const target = document.getElementById('relatives-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 도시 필터 해제
  clearCityFilter() {
    this.currentFilter.city = 'all';
    this.updateActiveFilterUI();
    this.renderRelativesList();
    this.renderHubCards();
    if (this.mapManager) {
      this.mapManager.resetView();
    }
  }

  // 활성 필터 배지 표시 갱신
  updateActiveFilterUI() {
    const badgeContainer = document.getElementById('active-filter-container');
    if (!badgeContainer) return;

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    if (this.currentFilter.city !== 'all') {
      badgeContainer.innerHTML = `
        <div class="active-filter-badge">
          <span>${dict.activeFilterHubPrefix} <strong>${this.currentFilter.city}</strong></span>
          <span class="active-filter-clear" onclick="window.app.clearCityFilter()" title="Clear">&times;</span>
        </div>
      `;
    } else if (this.currentFilter.country !== 'all') {
      badgeContainer.innerHTML = `
        <div class="active-filter-badge">
          <span>${dict.activeFilterCountryPrefix} <strong>${this.currentFilter.country}</strong></span>
          <span class="active-filter-clear" onclick="window.app.clearCountryFilter()" title="Clear">&times;</span>
        </div>
      `;
    } else {
      badgeContainer.innerHTML = '';
    }
  }

  clearCountryFilter() {
    this.currentFilter.country = 'all';
    const select = document.getElementById('filter-country');
    if (select) select.value = 'all';
    this.updateActiveFilterUI();
    this.renderRelativesList();
  }

  // 친척 목록 필터링 및 렌더링
  renderRelativesList() {
    const containerCards = document.getElementById('relatives-grid-container');
    const containerTable = document.getElementById('relatives-table-container');
    const emptyState = document.getElementById('relatives-empty-state');

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const q = this.currentFilter.keyword.toLowerCase().trim();
    const filtered = this.relatives.filter(item => {
      if (this.currentFilter.country !== 'all' && item.country !== this.currentFilter.country) {
        return false;
      }
      if (this.currentFilter.city !== 'all' && item.city !== this.currentFilter.city) {
        return false;
      }
      if (q) {
        const fullText = `${item.name || ''} ${item.parentName || ''} ${item.email || ''} ${item.phone || ''} ${item.city || ''} ${item.country || ''} ${item.workplace || ''} ${item.jobTitle || ''} ${item.notes || ''}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }
      return true;
    });

    const countEl = document.getElementById('filtered-relatives-count');
    if (countEl) countEl.textContent = `${filtered.length}${dict.unitPeople}`;

    if (filtered.length === 0) {
      if (containerCards) containerCards.style.display = 'none';
      if (containerTable) containerTable.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (this.currentView === 'grid') {
      if (containerCards) {
        containerCards.style.display = 'grid';
        containerCards.innerHTML = filtered.map(rel => this.createCardHtml(rel)).join('');
      }
      if (containerTable) containerTable.style.display = 'none';
    } else {
      if (containerCards) containerCards.style.display = 'none';
      if (containerTable) {
        containerTable.style.display = 'block';
        containerTable.innerHTML = this.createTableHtml(filtered);
      }
    }
  }

  // 카드 HTML 생성
  createCardHtml(rel) {
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const isMajor = MAJOR_HUBS.some(h => h.city === rel.city);
    const flag = rel.country === '대한민국' ? '🇰🇷' : rel.country === '미국' ? '🇺🇸' : rel.country === '캐나다' ? '🇨🇦' : '🌐';

    return `
      <div class="relative-card">
        <div>
          <div class="card-top">
            <div class="card-person-info">
              <div class="card-name">${this.escapeHtml(rel.name)}</div>
              <div class="card-location-badge ${isMajor ? 'hub-spotlight' : ''}">
                <span>${flag}</span>
                <span>${rel.country || (isEn ? 'Global' : '국가 미지정')} · ${rel.city || (isEn ? 'Undisclosed' : '도시 미지정')}</span>
                ${isMajor ? `<span style="font-size:0.7rem;">(${dict.hubSpotlightBadge})</span>` : ''}
              </div>
            </div>
            <div class="card-actions-dropdown">
              <button class="btn-icon-sm" title="${dict.btnViewDetail}" onclick="window.app.openDetailModal('${rel.id}')">
                <i class="fa-solid fa-expand"></i>
              </button>
              <button class="btn-icon-sm" title="${dict.btnEdit}" onclick="window.app.openEditModal('${rel.id}')">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-icon-sm delete" title="${dict.btnDelete}" onclick="window.app.deleteRelative('${rel.id}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>

          <div class="card-details-list">
            <div class="card-detail-row">
              <span class="card-detail-icon"><i class="fa-regular fa-envelope"></i></span>
              <span class="card-detail-text"><strong>${this.escapeHtml(rel.email)}</strong></span>
            </div>
            ${rel.phone ? `
              <div class="card-detail-row">
                <span class="card-detail-icon"><i class="fa-solid fa-phone"></i></span>
                <span class="card-detail-text">${this.escapeHtml(rel.phone)}</span>
              </div>
            ` : ''}
            ${(rel.workplace || rel.jobTitle) ? `
              <div class="card-detail-row">
                <span class="card-detail-icon"><i class="fa-solid fa-briefcase"></i></span>
                <span class="card-detail-text">${this.escapeHtml([rel.workplace, rel.jobTitle].filter(Boolean).join(' · '))}</span>
              </div>
            ` : ''}
            ${rel.parentName ? `
              <div class="card-detail-row">
                <span class="card-detail-icon"><i class="fa-solid fa-people-roof"></i></span>
                <span class="card-detail-text" style="color:var(--color-gold); font-weight:600;">
                  ${dict.treeParentLabel} ${this.escapeHtml(rel.parentName)}
                </span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="card-footer">
          <span class="card-notes-preview" title="${this.escapeHtml(rel.notes || '')}">
            ${rel.notes ? '“ ' + this.escapeHtml(rel.notes) + ' ”' : dict.noNotes}
          </span>
          <button class="btn btn-secondary" style="padding:0.3rem 0.65rem; font-size:0.8rem;" onclick="window.app.openDetailModal('${rel.id}')">
            ${dict.btnViewDetail}
          </button>
        </div>
      </div>
    `;
  }

  // 테이블 HTML 생성
  createTableHtml(relatives) {
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    return `
      <div class="table-responsive">
        <table class="clan-table">
          <thead>
            <tr>
              <th>${dict.thName}</th>
              <th>${dict.thLocation}</th>
              <th>${dict.thParent}</th>
              <th>${dict.thEmail}</th>
              <th>${dict.thPhone}</th>
              <th>${dict.thJob}</th>
              <th>${dict.thBirthday}</th>
              <th style="text-align:right;">${dict.thManage}</th>
            </tr>
          </thead>
          <tbody>
            ${relatives.map(rel => {
              const isMajor = MAJOR_HUBS.some(h => h.city === rel.city);
              const flag = rel.country === '대한민국' ? '🇰🇷' : rel.country === '미국' ? '🇺🇸' : rel.country === '캐나다' ? '🇨🇦' : '🌐';
              return `
                <tr>
                  <td>
                    <strong>${this.escapeHtml(rel.name)}</strong>
                  </td>
                  <td>
                    <span>${flag} ${rel.country || '-'} / <strong>${rel.city || '-'}</strong></span>
                    ${isMajor ? `<span style="color:#c59b27; font-weight:bold; font-size:0.75rem; margin-left:4px;">★${dict.hubSpotlightBadge}</span>` : ''}
                  </td>
                  <td>
                    <span style="color:var(--color-gold); font-weight:600;">${this.escapeHtml(rel.parentName || '-')}</span>
                  </td>
                  <td>${this.escapeHtml(rel.email)}</td>
                  <td>${this.escapeHtml(rel.phone || '-')}</td>
                  <td>${this.escapeHtml([rel.workplace, rel.jobTitle].filter(Boolean).join(' / ') || '-')}</td>
                  <td>${this.escapeHtml(rel.birthday || '-')}</td>
                  <td style="text-align:right; white-space:nowrap;">
                    <button class="btn-icon-sm" style="display:inline-flex;" title="${dict.btnViewDetail}" onclick="window.app.openDetailModal('${rel.id}')">
                      <i class="fa-solid fa-expand"></i>
                    </button>
                    <button class="btn-icon-sm" style="display:inline-flex; margin-left:4px;" title="${dict.btnEdit}" onclick="window.app.openEditModal('${rel.id}')">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon-sm delete" style="display:inline-flex; margin-left:4px;" title="${dict.btnDelete}" onclick="window.app.deleteRelative('${rel.id}')">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 뷰 모드 전환 (카드 / 표)
  setViewMode(mode) {
    this.currentView = mode;
    localStorage.setItem(this.VIEW_KEY, mode);

    document.getElementById('view-grid-btn').classList.toggle('active', mode === 'grid');
    document.getElementById('view-table-btn').classList.toggle('active', mode === 'table');

    this.renderRelativesList();
  }

  // 신규 등록 모달 열기
  openAddModal() {
    this.editingId = null;
    const form = document.getElementById('relative-form');
    if (form) form.reset();

    this.clearValidationErrors();
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    document.getElementById('modal-title-text').textContent = dict.modalAddTitle;
    document.getElementById('modal-sub-text').textContent = dict.modalAddSub;
    
    document.getElementById('form-country').value = isEn ? '대한민국' : '대한민국';
    document.getElementById('form-parent-name').value = '';

    this.updateParentNameOptions();
    this.showModal('relative-edit-modal');
  }

  // 수정 모달 열기
  openEditModal(id) {
    const rel = this.relatives.find(r => r.id === id);
    if (!rel) return;

    this.editingId = id;
    this.clearValidationErrors();

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    document.getElementById('modal-title-text').textContent = dict.modalEditTitle;
    document.getElementById('modal-sub-text').textContent = `'${rel.name}' - ${dict.modalEditSub}`;

    document.getElementById('form-name').value = rel.name || '';
    document.getElementById('form-email').value = rel.email || '';
    document.getElementById('form-country').value = rel.country || '대한민국';
    document.getElementById('form-city').value = rel.city || '';
    document.getElementById('form-phone').value = rel.phone || '';
    document.getElementById('form-address').value = rel.address || '';
    document.getElementById('form-workplace').value = rel.workplace || '';
    document.getElementById('form-job-title').value = rel.jobTitle || '';
    document.getElementById('form-work-address').value = rel.workAddress || '';
    document.getElementById('form-birthday').value = rel.birthday || '';
    document.getElementById('form-notes').value = rel.notes || '';
    document.getElementById('form-parent-name').value = rel.parentName || '';

    this.updateParentNameOptions();
    this.showModal('relative-edit-modal');
  }

  // 상세 보기 모달 열기
  openDetailModal(id) {
    const rel = this.relatives.find(r => r.id === id);
    if (!rel) return;

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const isMajor = MAJOR_HUBS.some(h => h.city === rel.city);
    const flag = rel.country === '대한민국' ? '🇰🇷' : rel.country === '미국' ? '🇺🇸' : rel.country === '캐나다' ? '🇨🇦' : '🌐';

    document.getElementById('detail-avatar-text').textContent = (rel.name || '임')[0];
    document.getElementById('detail-name-text').textContent = rel.name;
    document.getElementById('detail-location-text').innerHTML = `
      <span>${flag}</span>
      <span>${rel.country || (isEn ? 'Global' : '국가 미지정')} · <strong>${rel.city || (isEn ? 'Undisclosed' : '도시 미지정')}</strong></span>
      ${isMajor ? `<span style="color:#c59b27; font-weight:bold; margin-left:6px;">(${dict.spotlightBadge})</span>` : ''}
    `;

    document.getElementById('detail-parent').textContent = rel.parentName || (isEn ? 'Ancestor / Patriarch Lineage' : '선조 / 최상위 세대');
    document.getElementById('detail-email').innerHTML = `<a href="mailto:${rel.email}">${this.escapeHtml(rel.email)}</a>`;
    document.getElementById('detail-phone').innerHTML = rel.phone ? `<a href="tel:${rel.phone}">${this.escapeHtml(rel.phone)}</a>` : `<span style="color:#94a3b8;">${dict.notRegistered}</span>`;
    document.getElementById('detail-address').textContent = rel.address || dict.notRegistered;
    document.getElementById('detail-workplace').textContent = [rel.workplace, rel.jobTitle].filter(Boolean).join(' · ') || dict.notRegistered;
    document.getElementById('detail-work-address').textContent = rel.workAddress || dict.notRegistered;
    document.getElementById('detail-birthday').textContent = rel.birthday || dict.notRegistered;
    document.getElementById('detail-notes').textContent = rel.notes || dict.noNotes;

    const flyBtn = document.getElementById('detail-fly-map-btn');
    if (flyBtn) {
      if (rel.city) {
        flyBtn.style.display = 'inline-flex';
        flyBtn.onclick = () => {
          this.closeModal('relative-detail-modal');
          this.switchMainTab('map');
          this.filterByCity(rel.city);
          if (this.mapManager) {
            this.mapManager.flyToCity(rel.city);
          }
        };
      } else {
        flyBtn.style.display = 'none';
      }
    }

    this.showModal('relative-detail-modal');
  }

  // 폼 저장 처리 (필수 항목 및 부모 성명 검증)
  saveRelativeForm(e) {
    if (e) e.preventDefault();

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();

    this.clearValidationErrors();
    let hasError = false;

    // 1. 필수 성명(이름) 검증
    if (!nameVal) {
      this.showFieldError('form-name', 'name-error', dict.errNameRequired);
      hasError = true;
    }

    // 2. 필수 이메일 주소 검증
    if (!emailVal) {
      this.showFieldError('form-email', 'email-error', dict.errEmailRequired);
      hasError = true;
    } else if (!this.isValidEmail(emailVal)) {
      this.showFieldError('form-email', 'email-error', dict.errEmailInvalid);
      hasError = true;
    }

    if (hasError) {
      return false;
    }

    const relativeData = {
      name: nameVal,
      email: emailVal,
      country: document.getElementById('form-country').value.trim() || '대한민국',
      city: document.getElementById('form-city').value.trim(),
      phone: document.getElementById('form-phone').value.trim(),
      address: document.getElementById('form-address').value.trim(),
      workplace: document.getElementById('form-workplace').value.trim(),
      jobTitle: document.getElementById('form-job-title').value.trim(),
      workAddress: document.getElementById('form-work-address').value.trim(),
      birthday: document.getElementById('form-birthday').value.trim(),
      notes: document.getElementById('form-notes').value.trim(),
      parentName: document.getElementById('form-parent-name').value.trim(),
      updatedAt: new Date().toISOString()
    };

    if (this.editingId) {
      const idx = this.relatives.findIndex(r => r.id === this.editingId);
      if (idx !== -1) {
        this.relatives[idx] = { ...this.relatives[idx], ...relativeData };
        this.showToast(dict.toastUpdated);
      }
    } else {
      const newRelative = {
        id: 'rel-' + Date.now(),
        ...relativeData,
        createdAt: new Date().toISOString()
      };
      this.relatives.unshift(newRelative);
      this.showToast(dict.toastSaved);
    }

    this.saveRelativesData();
    this.closeModal('relative-edit-modal');
    this.renderAll();

    // 입력한 도시로 지도 안내
    if (relativeData.city && this.mapManager && this.currentTab === 'map') {
      this.mapManager.flyToCity(relativeData.city);
    }

    return true;
  }

  // 친척 정보 삭제
  deleteRelative(id) {
    const rel = this.relatives.find(r => r.id === id);
    if (!rel) return;

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    if (confirm(`'${rel.name}' - ${dict.confirmDelete}`)) {
      this.relatives = this.relatives.filter(r => r.id !== id);
      this.saveRelativesData();
      this.renderAll();
      this.showToast(dict.toastDeleted);
    }
  }

  setFormCity(cityName, countryName) {
    document.getElementById('form-city').value = cityName;
    if (countryName) {
      document.getElementById('form-country').value = countryName;
    }
  }

  showFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) {
      error.textContent = message;
      error.classList.add('visible');
    }
    input.focus();
  }

  clearValidationErrors() {
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.field-error-text').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#c59b27;"></i> <span>${this.escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // JSON 백업 다운로드
  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.relatives, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `choyang_im_clan_family_tree_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    dlAnchor.remove();

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];
    this.showToast(dict.toastBackupExported);
  }

  // JSON 백업 복원
  importJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          this.relatives = imported;
          this.saveRelativesData();
          this.renderAll();
          this.showToast(`성공적으로 ${imported.length}명의 친척 데이터를 복원했습니다.`);
        } else {
          alert('유효하지 않은 족보 데이터 파일 형식입니다.');
        }
      } catch (err) {
        alert('파일을 읽는 중 오류가 발생했습니다: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // 엑셀 호환 CSV 내보내기 (부모 성명 포함)
  exportCSV() {
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const headers = [dict.thName, dict.thLocation, dict.thParent, dict.thEmail, dict.thPhone, dict.formAddress, dict.thJob, dict.thBirthday, dict.detailNotesLabel];
    const rows = this.relatives.map(r => [
      r.name || '',
      `${r.country || ''} ${r.city || ''}`.trim(),
      r.parentName || '',
      r.email || '',
      r.phone || '',
      r.address || '',
      [r.workplace, r.jobTitle].filter(Boolean).join(' / '),
      r.birthday || '',
      (r.notes || '').replace(/"/g, '""')
    ]);

    let csvContent = '\uFEFF';
    csvContent += headers.map(h => `"${h}"`).join(',') + '\r\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `choyang_im_relatives_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
    this.showToast(dict.toastCsvExported);
  }

  // 초기 샘플 복원
  resetToInitial() {
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    if (confirm(dict.confirmReset)) {
      this.relatives = [...INITIAL_RELATIVES_DATA];
      this.saveRelativesData();
      this.renderAll();
      this.showToast(dict.toastSampleRestored);
    }
  }

  bindEvents() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilter.keyword = e.target.value;
        this.renderRelativesList();
      });
    }

    const countrySelect = document.getElementById('filter-country');
    if (countrySelect) {
      countrySelect.addEventListener('change', (e) => {
        this.currentFilter.country = e.target.value;
        this.updateActiveFilterUI();
        this.renderRelativesList();
      });
    }

    const gridBtn = document.getElementById('view-grid-btn');
    const tableBtn = document.getElementById('view-table-btn');
    if (gridBtn) gridBtn.addEventListener('click', () => this.setViewMode('grid'));
    if (tableBtn) tableBtn.addEventListener('click', () => this.setViewMode('table'));

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(m => this.closeModal(m.id));
      }
    });

    const fileInput = document.getElementById('import-json-file');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.importJSON(e.target.files[0]);
          e.target.value = '';
        }
      });
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new ChoyangClanApp();
});
