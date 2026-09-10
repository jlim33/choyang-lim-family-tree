/**
 * 조양 임씨(兆陽 林氏) 인터랙티브 글로벌/국내 지도 모듈
 * Leaflet.js 기반 7대 핵심 거점 펄스 핀 및 다국어 팝업 관리
 */

class ClanMapManager {
  constructor(mapContainerId) {
    this.mapContainerId = mapContainerId;
    this.map = null;
    this.markersLayer = null;
    this.currentRelatives = [];
    this.activeCity = null;
  }

  // 지도 초기화
  init() {
    if (!document.getElementById(this.mapContainerId)) return;

    this.map = L.map(this.mapContainerId, {
      center: [36.5, -40.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 250);
  }

  // 도시별 친척 집계 및 마커 렌더링
  renderMarkers(relatives) {
    if (!this.map) return;
    this.currentRelatives = relatives;
    this.markersLayer.clearLayers();

    const isEn = window.app && window.app.currentLang === 'en';
    const dict = (typeof I18N_DICTIONARY !== 'undefined' && I18N_DICTIONARY[isEn ? 'en' : 'ko']) || {};

    const cityGroups = {};

    // 1. 7대 주요 거점 기본 보장 등록
    MAJOR_HUBS.forEach(hub => {
      cityGroups[hub.city] = {
        city: hub.city,
        cityEn: hub.cityEn,
        country: hub.country,
        relatives: [],
        coords: { lat: hub.lat, lng: hub.lng, isMajorHub: true }
      };
    });

    // 2. 친척별 정규화 도시 매핑 및 집계
    relatives.forEach(rel => {
      const rawCity = rel.city ? rel.city.trim() : '';
      if (!rawCity || rawCity === '미지정' || rawCity === 'Undisclosed') return;

      const canonicalCity = typeof getCanonicalCity === 'function' ? getCanonicalCity(rawCity) : rawCity;

      // 기존 등록된 그룹(7대 거점 포함) 중 매칭 탐색
      let targetKey = null;
      for (const key of Object.keys(cityGroups)) {
        if (key === canonicalCity || (typeof isCityMatch === 'function' && isCityMatch(key, canonicalCity))) {
          targetKey = key;
          break;
        }
      }

      if (!targetKey) {
        targetKey = canonicalCity;
        cityGroups[targetKey] = {
          city: canonicalCity,
          cityEn: typeof getCityDisplayName === 'function' ? getCityDisplayName(canonicalCity, 'en') : canonicalCity,
          country: rel.country || (isEn ? 'South Korea' : '대한민국'),
          relatives: [],
          coords: this.resolveCityCoords(canonicalCity, rel.country)
        };
      }

      cityGroups[targetKey].relatives.push(rel);
    });

    // 마커 생성 및 지도에 추가
    Object.values(cityGroups).forEach(group => {
      if (!group.coords) return;

      const isMajor = !!group.coords.isMajorHub;
      const count = group.relatives.length;
      const displayCity = isEn ? (this.getEnCityName(group.city) || group.city) : group.city;

      const customIcon = L.divIcon({
        className: 'custom-hub-marker-container',
        html: `
          <div class="custom-hub-marker ${isMajor ? 'major' : 'standard'}">
            ${isMajor ? '<div class="hub-marker-pulse"></div>' : ''}
            <div class="hub-marker-pin" title="${displayCity} (${count})">
              ${isMajor ? '林' : count}
            </div>
            <div class="hub-marker-label">
              ${displayCity} (${count})
            </div>
          </div>
        `,
        iconSize: [80, 50],
        iconAnchor: [40, 25],
        popupAnchor: [0, -25]
      });

      const marker = L.marker([group.coords.lat, group.coords.lng], { icon: customIcon });

      const popupContent = this.createPopupHtml(group);
      marker.bindPopup(popupContent, { maxWidth: 280 });

      marker.on('click', () => {
        this.activeCity = group.city;
      });

      this.markersLayer.addLayer(marker);
    });
  }

  getEnCityName(city) {
    if (typeof getCityDisplayName === 'function') {
      return getCityDisplayName(city, 'en');
    }
    const hub = MAJOR_HUBS.find(h => typeof isCityMatch === 'function' ? isCityMatch(h.city, city) : h.city === city);
    return hub ? hub.cityEn : city;
  }

  // 도시 좌표 확인 (사전 lookup 및 fallback)
  resolveCityCoords(cityName, countryName) {
    if (!cityName) return null;
    const cleanName = cityName.trim();

    if (CITY_COORDINATES[cleanName]) {
      return CITY_COORDINATES[cleanName];
    }
    const lower = cleanName.toLowerCase();
    if (CITY_COORDINATES[lower]) {
      return CITY_COORDINATES[lower];
    }

    const canonical = typeof getCanonicalCity === 'function' ? getCanonicalCity(cleanName) : cleanName;
    if (CITY_COORDINATES[canonical]) {
      return CITY_COORDINATES[canonical];
    }

    for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
      if (typeof isCityMatch === 'function' && isCityMatch(key, cleanName)) {
        return coords;
      }
      if (cleanName.includes(key) || key.includes(cleanName)) {
        return coords;
      }
    }

    if (countryName === '미국' || countryName === 'USA') return { lat: 37.0902, lng: -95.7129, isMajorHub: false };
    if (countryName === '캐나다' || countryName === 'Canada') return { lat: 56.1304, lng: -106.3468, isMajorHub: false };
    return { lat: 36.5, lng: 127.5, isMajorHub: false };
  }

  // 팝업 HTML 템플릿
  createPopupHtml(group) {
    const isEn = window.app && window.app.currentLang === 'en';
    const dict = (typeof I18N_DICTIONARY !== 'undefined' && I18N_DICTIONARY[isEn ? 'en' : 'ko']) || {};

    const isMajor = !!group.coords.isMajorHub;
    const flag = group.country === '대한민국' || group.country === 'South Korea' ? '🇰🇷' : group.country === '미국' || group.country === 'USA' ? '🇺🇸' : group.country === '캐나다' || group.country === 'Canada' ? '🇨🇦' : '🌐';
    const displayCity = isEn ? (this.getEnCityName(group.city) || group.city) : group.city;
    const displayCountry = isEn ? (group.country === '미국' ? 'USA' : group.country === '대한민국' ? 'South Korea' : group.country === '캐나다' ? 'Canada' : group.country) : (group.country === 'USA' ? '미국' : group.country === 'South Korea' ? '대한민국' : group.country === 'Canada' ? '캐나다' : group.country);
    
    let relativesListHtml = '';
    if (group.relatives.length === 0) {
      relativesListHtml = `<li style="color:#94a3b8; font-size:0.82rem; padding: 0.5rem 0; text-align:center;">${dict.mapPopupNoRelatives || '등록된 친척이 없습니다.'}</li>`;
    } else {
      relativesListHtml = group.relatives.map(r => `
        <li>
          <span style="font-weight:700; color:#0f1e36;">${r.name}</span>
          <span style="font-size:0.78rem; color:#64748b;">${r.jobTitle || r.workplace || (isEn ? 'Relative' : '친족')}</span>
        </li>
      `).join('');
    }

    return `
      <div class="map-popup-card">
        <div class="map-popup-header">
          <h4>${flag} ${displayCountry} · ${displayCity}</h4>
          <p>${isMajor ? (dict.mapPopupHubBadge || '★ 가문 핵심 7대 거점') : (dict.mapPopupNormalBadge || '친족 거주지')} (${dict.mapPopupResidents || '거주 친척'}: <strong>${group.relatives.length}${dict.unitPeople || '명'}</strong>)</p>
        </div>
        <div class="map-popup-body">
          <ul class="map-popup-relatives-list">
            ${relativesListHtml}
          </ul>
        </div>
        <div class="map-popup-footer">
          <button class="btn btn-gold" style="width:100%; padding:0.35rem 0.6rem; font-size:0.82rem;" onclick="window.app.switchMainTab('directory'); window.app.filterByCity('${group.city}')">
            ${dict.mapPopupViewList || '이 지역 친척 명부 보기'}
          </button>
        </div>
      </div>
    `;
  }

  flyToCity(cityName) {
    if (!this.map || !cityName) return;
    const hub = MAJOR_HUBS.find(h => 
      typeof isCityMatch === 'function' 
        ? isCityMatch(h.city, cityName) || isCityMatch(h.cityEn, cityName)
        : (h.city === cityName || h.cityEn === cityName || h.id === cityName)
    );
    if (hub) {
      this.map.flyTo([hub.lat, hub.lng], hub.zoom, { duration: 1.2 });
      return;
    }

    const coords = this.resolveCityCoords(cityName);
    if (coords) {
      this.map.flyTo([coords.lat, coords.lng], 12, { duration: 1.2 });
    }
  }

  resetView() {
    if (!this.map) return;
    this.map.flyTo([36.5, -40.0], 3, { duration: 1.2 });
  }

  viewKorea() {
    if (!this.map) return;
    this.map.flyTo([36.5, 127.8], 7, { duration: 1.0 });
  }

  viewNorthAmerica() {
    if (!this.map) return;
    this.map.flyTo([38.5, -100.0], 4, { duration: 1.0 });
  }
}
