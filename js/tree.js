/**
 * 조양 임씨(兆陽 林氏) 가계도 계통도 다이어그램 모듈
 * Family Tree Hierarchy & Lineage Diagram Engine
 * - 부모-자녀(parentName) 기반의 세대별 계층 트리 자동 구성
 * - 노드 카드 렌더링, 줌/패닝, 검색 하이라이트 및 상세 모달 연동
 */

class FamilyTreeManager {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = null;
    this.zoomLevel = 1.0;
    this.relatives = [];
    this.searchKeyword = '';
  }

  init() {
    this.container = document.getElementById(this.containerId);
    this.bindControls();
  }

  bindControls() {
    const zoomInBtn = document.getElementById('tree-zoom-in');
    const zoomOutBtn = document.getElementById('tree-zoom-out');
    const zoomResetBtn = document.getElementById('tree-zoom-reset');
    const searchInput = document.getElementById('tree-search-input');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoom(0.15));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoom(-0.15));
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => this.resetZoom());

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchKeyword = e.target.value.trim().toLowerCase();
        this.highlightMatchingNodes();
      });
    }
  }

  zoom(delta) {
    this.zoomLevel = Math.min(Math.max(this.zoomLevel + delta, 0.5), 1.8);
    this.applyZoom();
  }

  resetZoom() {
    this.zoomLevel = 1.0;
    this.applyZoom();
  }

  applyZoom() {
    const content = document.getElementById('tree-render-root');
    if (content) {
      content.style.transform = `scale(${this.zoomLevel})`;
      content.style.transformOrigin = 'top center';
    }
  }

  // 가계도 데이터 트리 빌드 및 렌더링
  render(relatives) {
    this.relatives = relatives || [];
    if (!this.container) {
      this.container = document.getElementById(this.containerId);
    }
    if (!this.container) return;

    if (this.relatives.length === 0) {
      this.container.innerHTML = `
        <div class="tree-empty-notice">
          <i class="fa-solid fa-seedling" style="font-size:2.5rem; color:var(--color-gold);"></i>
          <p style="margin-top:0.8rem; font-weight:700;">등록된 친척 데이터가 없습니다.</p>
        </div>
      `;
      return;
    }

    // 1. 이름별 매핑 및 자녀 목록 초기화
    const nameMap = new Map();
    const childrenMap = new Map();

    this.relatives.forEach(r => {
      nameMap.set(r.name.trim(), r);
      childrenMap.set(r.name.trim(), []);
    });

    // 2. 부모-자녀 연결
    const roots = [];
    this.relatives.forEach(r => {
      const parent = r.parentName ? r.parentName.trim() : '';
      if (parent && nameMap.has(parent)) {
        childrenMap.get(parent).push(r);
      } else {
        roots.push(r);
      }
    });

    // 세대(generation)가 명시된 경우 세대 오름차순 정렬
    roots.sort((a, b) => (a.generation || 99) - (b.generation || 99));

    // 3. 트리 HTML 생성
    const isEn = window.app && window.app.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    let treeHtml = `
      <div class="tree-wrapper" id="tree-render-root">
        <!-- 가문 최상위 조양 임씨 선조 루트 헤더 -->
        <div class="tree-ancestor-banner">
          <div class="ancestor-crest">林</div>
          <div class="ancestor-text">
            <h3>${isEn ? 'Choyang Im Clan Ancestral Heritage' : '조양 임씨(兆陽 林氏) 선조의 맥'}</h3>
            <p>${dict.treeRootNote}</p>
          </div>
        </div>

        <!-- 계통도 브랜치 컨테이너 -->
        <div class="tree-forest">
          ${roots.map(rootNode => this.renderTreeNodeHtml(rootNode, childrenMap, 1)).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = treeHtml;
    this.applyZoom();
    this.highlightMatchingNodes();
  }

  // 개별 노드 및 그 자녀들 재귀적 HTML 렌더링
  renderTreeNodeHtml(node, childrenMap, level) {
    const isEn = window.app && window.app.currentLang === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'ko'];

    const children = childrenMap.get(node.name.trim()) || [];
    const hasChildren = children.length > 0;

    const isMajor = MAJOR_HUBS.some(h => h.city === node.city);
    const flag = node.country === '대한민국' ? '🇰🇷' : node.country === '미국' ? '🇺🇸' : node.country === '캐나다' ? '🇨🇦' : '🌐';

    // 세대 텍스트
    let genBadge = '';
    if (node.generation) {
      genBadge = `${node.generation}${dict.treeGenerationSuffix}`;
    } else {
      genBadge = `${level + 26}${dict.treeGenerationSuffix}`;
    }

    const nodeCardHtml = `
      <div class="tree-node-card ${isMajor ? 'major-hub-node' : ''}" 
           id="tree-node-${node.id}" 
           data-name="${this.escape(node.name)}"
           data-city="${this.escape(node.city || '')}"
           data-workplace="${this.escape(node.workplace || '')}"
           onclick="window.app.openDetailModal('${node.id}')"
           title="${isEn ? 'Click to view details' : '클릭하여 상세 정보 열람'}">
        
        <div class="tree-node-header">
          <span class="tree-gen-badge">${genBadge}</span>
          ${isMajor ? `<span class="tree-hub-star" title="${dict.hubSpotlightBadge}"><i class="fa-solid fa-crown"></i></span>` : ''}
        </div>

        <div class="tree-node-body">
          <div class="tree-node-avatar">${(node.name || '임')[0]}</div>
          <div class="tree-node-info">
            <h4 class="tree-node-name">${this.escape(node.name)}</h4>
            <div class="tree-node-loc">
              <span>${flag}</span>
              <span>${this.escape(node.city || (isEn ? 'Undisclosed' : '도시 미지정'))}</span>
            </div>
          </div>
        </div>

        ${(node.workplace || node.jobTitle) ? `
          <div class="tree-node-job">
            <i class="fa-solid fa-briefcase"></i>
            <span>${this.escape([node.workplace, node.jobTitle].filter(Boolean).join(' · '))}</span>
          </div>
        ` : ''}

        ${node.parentName ? `
          <div class="tree-node-parent-note">
            <span>${dict.treeParentLabel} <strong>${this.escape(node.parentName)}</strong></span>
          </div>
        ` : `
          <div class="tree-node-parent-note patriarch">
            <span>${dict.treeNoParent}</span>
          </div>
        `}
      </div>
    `;

    if (!hasChildren) {
      return `
        <div class="tree-leaf-item">
          ${nodeCardHtml}
        </div>
      `;
    }

    // 자녀가 있는 경우 서브트리 브랜치 구성
    return `
      <div class="tree-branch-item">
        ${nodeCardHtml}
        <div class="tree-children-connector"></div>
        <div class="tree-children-container">
          ${children.map(child => this.renderTreeNodeHtml(child, childrenMap, level + 1)).join('')}
        </div>
      </div>
    `;
  }

  // 가계도 내 검색어 일치 노드 하이라이트
  highlightMatchingNodes() {
    const q = this.searchKeyword;
    const cards = document.querySelectorAll('.tree-node-card');

    cards.forEach(card => {
      card.classList.remove('tree-search-match', 'tree-search-dim');
      if (!q) return;

      const name = (card.dataset.name || '').toLowerCase();
      const city = (card.dataset.city || '').toLowerCase();
      const work = (card.dataset.workplace || '').toLowerCase();

      if (name.includes(q) || city.includes(q) || work.includes(q)) {
        card.classList.add('tree-search-match');
      } else {
        card.classList.add('tree-search-dim');
      }
    });

    // 첫 번째 일치 노드로 자동 스크롤
    if (q) {
      const firstMatch = document.querySelector('.tree-search-match');
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
