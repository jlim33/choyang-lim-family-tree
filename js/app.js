/**
 * 조양 임씨(兆陽 林氏) 가문 족보 & 친척 관리 메인 애플리케이션
 * - 3가지 디자인 테마 전환 (클래식 골드 / 모던 파스텔 / 미드나잇 다크)
 * - 프로필 사진(Photo) 업로드 & 실시간 미리보기
 * - 각종 SNS(Instagram, LinkedIn, Facebook, YouTube, X, Website) 연동
 * - 부모 성명 기반 가계도 계통도(Family Tree) 연동
 * - 한글 / 영어(KO / EN) 원클릭 전환
 * - 7대 거점 스포트라이트 및 인터랙티브 지도
 */

class ChoyangClanApp {
  constructor() {
    this.STORAGE_KEY = 'choyang_im_clan_relatives_v3';
    this.FONT_KEY = 'choyang_im_font_size_mode';
    this.LANG_KEY = 'choyang_im_lang';
    this.THEME_KEY = 'choyang_im_theme';
    this.VIEW_KEY = 'choyang_im_view_mode';

    this.relatives = [];
    this.currentLang = localStorage.getItem(this.LANG_KEY) || 'ko';
    this.currentTheme = localStorage.getItem(this.THEME_KEY) || 'royal'; // 'royal' | 'pastel' | 'dark'
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
    this.currentPhotoData = ''; // 현재 폼의 사진 Base64 또는 URL

    this.init();
  }

  init() {
    // 1. 데이터 로드
    this.loadRelativesData();

    // 2. 어르신 글자 크기 복원
    this.initFontSizeMode();

    // 3. 3가지 디자인 테마 적용
    this.setTheme(this.currentTheme, false);

    // 4. 지도 및 가계도 매니저 초기화
    this.mapManager = new ClanMapManager('clan-leaflet-map');
    this.mapManager.init();

    this.treeManager = new FamilyTreeManager('clan-tree-canvas');
    this.treeManager.init();

    // 5. 언어 설정 적용
    this.setLanguage(this.currentLang, false);

    // 6. 이벤트 바인딩
    this.bindEvents();

    // 7. 전체 렌더링
    this.renderAll();
  }

  // 데이터 로드
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

  saveRelativesData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.relatives));
  }

  // ★ 3가지 디자인 테마 전환 (royal: 클래식 골드, pastel: 모던 파스텔, dark: 미드나잇 다크)
  setTheme(themeName, showNotification = true) {
    const validThemes = ['royal', 'pastel', 'dark'];
    this.currentTheme = validThemes.includes(themeName) ? themeName : 'royal';

    document.documentElement.classList.remove('theme-royal', 'theme-pastel', 'theme-dark');
    document.documentElement.classList.add(`theme-${this.currentTheme}`);
    localStorage.setItem(this.THEME_KEY, this.currentTheme);

    // 테마 토글 버튼 활성화 상태 동기화
    ['royal', 'pastel', 'dark'].forEach(t => {
      const btn = document.getElementById(`theme-btn-${t}`);
      if (btn) btn.classList.toggle('active', t === this.currentTheme);
    });

    if (showNotification) {
      const dict = I18N_DICTIONARY[this.currentLang];
      this.showToast(dict.toastThemeChanged);
    }
  }

  // 다국어 전환 (KO / EN)
  setLanguage(lang, showNotification = true) {
    this.currentLang = lang === 'en' ? 'en' : 'ko';
    localStorage.setItem(this.LANG_KEY, this.currentLang);

    const koBtn = document.getElementById('lang-btn-ko');
    const enBtn = document.getElementById('lang-btn-en');
    if (koBtn) koBtn.classList.toggle('active', this.currentLang === 'ko');
    if (enBtn) enBtn.classList.toggle('active', this.currentLang === 'en');

    this.applyTranslations();
    this.renderAll();

    if (showNotification) {
      const dict = I18N_DICTIONARY[this.currentLang];
      this.showToast(dict.toastLangChanged);
    }
  }

  applyTranslations() {
    const dict = I18N_DICTIONARY[this.currentLang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });
  }

  // 뷰 탭 전환
  switchMainTab(tab) {
    this.currentTab = tab;

    const tabMapBtn = document.getElementById('tab-btn-map');
    const tabTreeBtn = document.getElementById('tab-btn-tree');
    const tabDirBtn = document.getElementById('tab-btn-directory');

    if (tabMapBtn) tabMapBtn.classList.toggle('active', tab === 'map');
    if (tabTreeBtn) tabTreeBtn.classList.toggle('active', tab === 'tree');
    if (tabDirBtn) tabDirBtn.classList.toggle('active', tab === 'directory');

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
      if (mapSec) mapSec.style.display = 'block';
      if (treeSec) treeSec.style.display = 'none';
      if (dirSec) {
        dirSec.style.display = 'block';
        dirSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // 어르신 글자 크기
  initFontSizeMode() {
    const savedMode = localStorage.getItem(this.FONT_KEY) || 'normal';
    this.setFontSize(savedMode, false);
  }

  setFontSize(mode, showNotification = true) {
    document.body.classList.remove('font-large', 'font-xlarge');

    if (mode === 'large') {
      document.body.classList.add('font-large');
    } else if (mode === 'xlarge') {
      document.body.classList.add('font-xlarge');
    }

    localStorage.setItem(this.FONT_KEY, mode);

    document.querySelectorAll('.font-toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === mode);
    });

    if (showNotification) {
      const isEn = this.currentLang === 'en';
      const labels = isEn 
        ? { normal: 'Normal (100%)', large: 'Large (125%)', xlarge: 'Extra Large (150%)' }
        : { normal: '보통 (100%)', large: '크게 (125%)', xlarge: '아주 크게 (150%)' };
      this.showToast(isEn ? `Font size adjusted to ${labels[mode]}` : `글자 크기가 '${labels[mode]}'로 변경되었습니다.`);
    }

    if (this.mapManager && this.mapManager.map) {
      setTimeout(() => this.mapManager.map.invalidateSize(), 200);
    }
  }

  // 화면 갱신
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

  updateParentNameOptions() {
    const datalist = document.getElementById('parent-name-options');
    if (!datalist) return;

    const names = Array.from(new Set(this.relatives.map(r => r.name.trim()).filter(Boolean)));
    names.sort();

    datalist.innerHTML = names.map(name => `<option value="${this.escapeHtml(name)}">`).join('');
  }

  filterByCity(cityName) {
    this.currentFilter.city = cityName;
    this.updateActiveFilterUI();
    this.renderRelativesList();
    this.renderHubCards();

    const target = document.getElementById('relatives-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  clearCityFilter() {
    this.currentFilter.city = 'all';
    this.updateActiveFilterUI();
    this.renderRelativesList();
    this.renderHubCards();
    if (this.mapManager) {
      this.mapManager.resetView();
    }
  }

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

  // ★ 사진 파일 업로드 처리 (FileReader Base64 변환)
  handlePhotoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentPhotoData = e.target.result;
      this.updatePhotoPreview(this.currentPhotoData);
    };
    reader.readAsDataURL(file);
  }

  handlePhotoUrlInput(event) {
    const url = event.target.value.trim();
    this.currentPhotoData = url;
    this.updatePhotoPreview(url);
  }

  removePhoto() {
    this.currentPhotoData = '';
    const fileInput = document.getElementById('form-photo-file');
    const urlInput = document.getElementById('form-photo-url');
    if (fileInput) fileInput.value = '';
    if (urlInput) urlInput.value = '';
    this.updatePhotoPreview('');
  }

  updatePhotoPreview(photoUrl) {
    const previewContainer = document.getElementById('form-photo-preview');
    const removeBtn = document.getElementById('btn-remove-photo');
    if (!previewContainer) return;

    if (photoUrl) {
      previewContainer.innerHTML = `<img src="${this.escapeHtml(photoUrl)}" alt="Preview">`;
      if (removeBtn) removeBtn.style.display = 'inline-flex';
    } else {
      previewContainer.innerHTML = `<span id="form-photo-preview-char">林</span>`;
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }

  // 친척 명부 필터링 및 렌더링
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
        const snsValues = item.sns ? Object.values(item.sns).join(' ') : '';
        const fullText = `${item.name || ''} ${item.parentName || ''} ${item.email || ''} ${item.phone || ''} ${item.city || ''} ${item.country || ''} ${item.workplace || ''} ${item.jobTitle || ''} ${item.notes || ''} ${snsValues}`.toLowerCase();
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

  // ★ 카드 HTML 생성 (사진 및 SNS 칩 포함)
  createCardHtml(rel) {
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const isMajor = MAJOR_HUBS.some(h => h.city === rel.city);
    const flag = rel.country === '대한민국' || rel.country === 'South Korea' ? '🇰🇷' : rel.country === '미국' || rel.country === 'USA' ? '🇺🇸' : rel.country === '캐나다' || rel.country === 'Canada' ? '🇨🇦' : '🌐';

    // 프로필 아바타 (사진 또는 성씨)
    const avatarHtml = rel.photo 
      ? `<img src="${this.escapeHtml(rel.photo)}" alt="${this.escapeHtml(rel.name)}" class="card-photo-img">`
      : `<span>${(rel.name || '임')[0]}</span>`;

    // SNS 칩스 생성
    const sns = rel.sns || {};
    let snsChipsHtml = '';
    const snsList = [];
    if (sns.instagram) snsList.push({ icon: 'fa-brands fa-instagram', class: 'instagram', url: sns.instagram.startsWith('http') ? sns.instagram : `https://instagram.com/${sns.instagram.replace('@', '')}`, title: 'Instagram' });
    if (sns.linkedin) snsList.push({ icon: 'fa-brands fa-linkedin-in', class: 'linkedin', url: sns.linkedin.startsWith('http') ? sns.linkedin : `https://linkedin.com/in/${sns.linkedin}`, title: 'LinkedIn' });
    if (sns.facebook) snsList.push({ icon: 'fa-brands fa-facebook-f', class: 'facebook', url: sns.facebook.startsWith('http') ? sns.facebook : `https://facebook.com/${sns.facebook}`, title: 'Facebook' });
    if (sns.youtube) snsList.push({ icon: 'fa-brands fa-youtube', class: 'youtube', url: sns.youtube.startsWith('http') ? sns.youtube : `https://youtube.com/${sns.youtube}`, title: 'YouTube' });
    if (sns.twitter) snsList.push({ icon: 'fa-brands fa-x-twitter', class: 'twitter', url: sns.twitter.startsWith('http') ? sns.twitter : `https://twitter.com/${sns.twitter.replace('@', '')}`, title: 'X / Twitter' });
    if (sns.website) snsList.push({ icon: 'fa-solid fa-globe', class: 'website', url: sns.website.startsWith('http') ? sns.website : `https://${sns.website}`, title: 'Website / Social' });

    if (snsList.length > 0) {
      snsChipsHtml = `
        <div class="card-sns-chips">
          ${snsList.map(s => `
            <a href="${this.escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="card-sns-chip ${s.class}" title="${s.title}">
              <i class="${s.icon}"></i>
            </a>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="relative-card">
        <div>
          <div class="card-top">
            <div class="card-person-header">
              <div class="card-photo-avatar">
                ${avatarHtml}
              </div>
              <div class="card-person-info">
                <div class="card-name">${this.escapeHtml(rel.name)}</div>
                <div class="card-location-badge ${isMajor ? 'hub-spotlight' : ''}">
                  <span>${flag}</span>
                  <span>${rel.country || (isEn ? 'Global' : '국가 미지정')} · ${rel.city || (isEn ? 'Undisclosed' : '도시 미지정')}</span>
                  ${isMajor ? `<span style="font-size:0.7rem;">(${dict.hubSpotlightBadge})</span>` : ''}
                </div>
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

          ${snsChipsHtml}
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
              <th>${dict.thSns}</th>
              <th>${dict.thBirthday}</th>
              <th style="text-align:right;">${dict.thManage}</th>
            </tr>
          </thead>
          <tbody>
            ${relatives.map(rel => {
              const isMajor = MAJOR_HUBS.some(h => h.city === rel.city);
              const flag = rel.country === '대한민국' || rel.country === 'South Korea' ? '🇰🇷' : rel.country === '미국' || rel.country === 'USA' ? '🇺🇸' : rel.country === '캐나다' || rel.country === 'Canada' ? '🇨🇦' : '🌐';
              
              const sns = rel.sns || {};
              const snsIcons = [];
              if (sns.instagram) snsIcons.push('<i class="fa-brands fa-instagram" style="color:#d6249f;" title="Instagram"></i>');
              if (sns.linkedin) snsIcons.push('<i class="fa-brands fa-linkedin-in" style="color:#0a66c2;" title="LinkedIn"></i>');
              if (sns.facebook) snsIcons.push('<i class="fa-brands fa-facebook-f" style="color:#1877f2;" title="Facebook"></i>');
              if (sns.youtube) snsIcons.push('<i class="fa-brands fa-youtube" style="color:#ff0000;" title="YouTube"></i>');
              if (sns.twitter) snsIcons.push('<i class="fa-brands fa-x-twitter" style="color:#000000;" title="X"></i>');
              if (sns.website) snsIcons.push('<i class="fa-solid fa-globe" style="color:#059669;" title="Web"></i>');

              return `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      ${rel.photo ? `<img src="${this.escapeHtml(rel.photo)}" alt="" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">` : ''}
                      <strong>${this.escapeHtml(rel.name)}</strong>
                    </div>
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
                  <td>
                    <div style="display:flex; gap:0.3rem;">
                      ${snsIcons.length > 0 ? snsIcons.join(' ') : '<span style="color:#94a3b8;">-</span>'}
                    </div>
                  </td>
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

  setViewMode(mode) {
    this.currentView = mode;
    localStorage.setItem(this.VIEW_KEY, mode);

    document.getElementById('view-grid-btn').classList.toggle('active', mode === 'grid');
    document.getElementById('view-table-btn').classList.toggle('active', mode === 'table');

    this.renderRelativesList();
  }

  openAddModal() {
    this.editingId = null;
    const form = document.getElementById('relative-form');
    if (form) form.reset();

    this.clearValidationErrors();
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    document.getElementById('modal-title-text').textContent = dict.modalAddTitle;
    document.getElementById('modal-sub-text').textContent = dict.modalAddSub;
    
    document.getElementById('form-country').value = '대한민국';
    document.getElementById('form-parent-name').value = '';

    // 사진 및 SNS 초기화
    this.currentPhotoData = '';
    this.updatePhotoPreview('');
    document.getElementById('form-sns-instagram').value = '';
    document.getElementById('form-sns-linkedin').value = '';
    document.getElementById('form-sns-facebook').value = '';
    document.getElementById('form-sns-youtube').value = '';
    document.getElementById('form-sns-twitter').value = '';
    document.getElementById('form-sns-website').value = '';

    this.updateParentNameOptions();
    this.showModal('relative-edit-modal');
  }

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

    // 사진 채우기
    this.currentPhotoData = rel.photo || '';
    this.updatePhotoPreview(this.currentPhotoData);
    const photoUrlInput = document.getElementById('form-photo-url');
    if (photoUrlInput) photoUrlInput.value = rel.photo && rel.photo.startsWith('http') ? rel.photo : '';

    // SNS 채우기
    const sns = rel.sns || {};
    document.getElementById('form-sns-instagram').value = sns.instagram || '';
    document.getElementById('form-sns-linkedin').value = sns.linkedin || '';
    document.getElementById('form-sns-facebook').value = sns.facebook || '';
    document.getElementById('form-sns-youtube').value = sns.youtube || '';
    document.getElementById('form-sns-twitter').value = sns.twitter || '';
    document.getElementById('form-sns-website').value = sns.website || '';

    this.updateParentNameOptions();
    this.showModal('relative-edit-modal');
  }

  // ★ 상세 보기 모달 (사진 포트레이트 & SNS 바로가기 버튼)
  openDetailModal(id) {
    const rel = this.relatives.find(r => r.id === id);
    if (!rel) return;

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const isMajor = MAJOR_HUBS.some(h => h.city === rel.city);
    const flag = rel.country === '대한민국' || rel.country === 'South Korea' ? '🇰🇷' : rel.country === '미국' || rel.country === 'USA' ? '🇺🇸' : rel.country === '캐나다' || rel.country === 'Canada' ? '🇨🇦' : '🌐';

    // 포트레이트 아바타
    const avatarContainer = document.getElementById('detail-avatar-container');
    if (avatarContainer) {
      if (rel.photo) {
        avatarContainer.innerHTML = `<img src="${this.escapeHtml(rel.photo)}" alt="${this.escapeHtml(rel.name)}" class="detail-avatar-img">`;
      } else {
        avatarContainer.innerHTML = `<span id="detail-avatar-text">${(rel.name || '임')[0]}</span>`;
      }
    }

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

    // SNS 버튼 렌더링
    const snsSec = document.getElementById('detail-sns-section');
    const snsContainer = document.getElementById('detail-sns-container');
    const sns = rel.sns || {};
    const snsButtons = [];

    if (sns.instagram) {
      const url = sns.instagram.startsWith('http') ? sns.instagram : `https://instagram.com/${sns.instagram.replace('@', '')}`;
      snsButtons.push(`<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="detail-sns-btn instagram"><i class="fa-brands fa-instagram"></i> Instagram</a>`);
    }
    if (sns.linkedin) {
      const url = sns.linkedin.startsWith('http') ? sns.linkedin : `https://linkedin.com/in/${sns.linkedin}`;
      snsButtons.push(`<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="detail-sns-btn linkedin"><i class="fa-brands fa-linkedin-in"></i> LinkedIn</a>`);
    }
    if (sns.facebook) {
      const url = sns.facebook.startsWith('http') ? sns.facebook : `https://facebook.com/${sns.facebook}`;
      snsButtons.push(`<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="detail-sns-btn facebook"><i class="fa-brands fa-facebook-f"></i> Facebook</a>`);
    }
    if (sns.youtube) {
      const url = sns.youtube.startsWith('http') ? sns.youtube : `https://youtube.com/${sns.youtube}`;
      snsButtons.push(`<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="detail-sns-btn youtube"><i class="fa-brands fa-youtube"></i> YouTube</a>`);
    }
    if (sns.twitter) {
      const url = sns.twitter.startsWith('http') ? sns.twitter : `https://twitter.com/${sns.twitter.replace('@', '')}`;
      snsButtons.push(`<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="detail-sns-btn twitter"><i class="fa-brands fa-x-twitter"></i> X / Twitter</a>`);
    }
    if (sns.website) {
      const url = sns.website.startsWith('http') ? sns.website : `https://${sns.website}`;
      snsButtons.push(`<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="detail-sns-btn website"><i class="fa-solid fa-globe"></i> Website / Kakao</a>`);
    }

    if (snsButtons.length > 0) {
      snsContainer.innerHTML = snsButtons.join('');
      snsSec.style.display = 'block';
    } else {
      snsSec.style.display = 'none';
    }

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

  // 폼 저장
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

    if (!nameVal) {
      this.showFieldError('form-name', 'name-error', dict.errNameRequired);
      hasError = true;
    }

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

    // SNS 수집
    const snsData = {
      instagram: document.getElementById('form-sns-instagram').value.trim(),
      linkedin: document.getElementById('form-sns-linkedin').value.trim(),
      facebook: document.getElementById('form-sns-facebook').value.trim(),
      youtube: document.getElementById('form-sns-youtube').value.trim(),
      twitter: document.getElementById('form-sns-twitter').value.trim(),
      website: document.getElementById('form-sns-website').value.trim()
    };

    const relativeData = {
      name: nameVal,
      email: emailVal,
      photo: this.currentPhotoData || '',
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
      sns: snsData,
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

    if (relativeData.city && this.mapManager && this.currentTab === 'map') {
      this.mapManager.flyToCity(relativeData.city);
    }

    return true;
  }

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
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--color-gold);"></i> <span>${this.escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.relatives, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `choyang_lim_clan_family_tree_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    dlAnchor.remove();

    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];
    this.showToast(dict.toastBackupExported);
  }

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

  exportCSV() {
    const isEn = this.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const headers = [dict.thName, dict.thLocation, dict.thParent, dict.thEmail, dict.thPhone, dict.formAddress, dict.thJob, dict.thBirthday, 'SNS Channels', dict.detailNotesLabel];
    const rows = this.relatives.map(r => {
      const sns = r.sns ? Object.entries(r.sns).filter(([k, v]) => v).map(([k, v]) => `${k}:${v}`).join('; ') : '';
      return [
        r.name || '',
        `${r.country || ''} ${r.city || ''}`.trim(),
        r.parentName || '',
        r.email || '',
        r.phone || '',
        r.address || '',
        [r.workplace, r.jobTitle].filter(Boolean).join(' / '),
        r.birthday || '',
        sns,
        (r.notes || '').replace(/"/g, '""')
      ];
    });

    let csvContent = '\uFEFF';
    csvContent += headers.map(h => `"${h}"`).join(',') + '\r\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `choyang_lim_relatives_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
    this.showToast(dict.toastCsvExported);
  }

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
