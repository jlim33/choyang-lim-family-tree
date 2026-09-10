/**
 * 조양 임씨(兆陽 林氏) 가문 친척 족보 데이터 관리
 * 7대 거점 좌표 사전 및 부모 성명, 프로필 사진, 각종 SNS가 연동된 샘플 데이터
 */

// 주요 도시 및 7대 핵심 거점 위도/경도 좌표 사전 (한글 및 영문/약어 동시 지원)
const CITY_COORDINATES = {
  // 대한민국
  '전주': { lat: 35.8242, lng: 127.1480, country: '대한민국', countryEn: 'South Korea', isMajorHub: true },
  'jeonju': { lat: 35.8242, lng: 127.1480, country: '대한민국', countryEn: 'South Korea', isMajorHub: true },
  '용인': { lat: 37.2411, lng: 127.1776, country: '대한민국', countryEn: 'South Korea', isMajorHub: true },
  'yongin': { lat: 37.2411, lng: 127.1776, country: '대한민국', countryEn: 'South Korea', isMajorHub: true },
  '서울': { lat: 37.5665, lng: 126.9780, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  'seoul': { lat: 37.5665, lng: 126.9780, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  '부산': { lat: 35.1796, lng: 129.0756, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  'busan': { lat: 35.1796, lng: 129.0756, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  '대전': { lat: 36.3504, lng: 127.3845, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  'daejeon': { lat: 36.3504, lng: 127.3845, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  '광주': { lat: 35.1595, lng: 126.8526, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  'gwangju': { lat: 35.1595, lng: 126.8526, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  '대구': { lat: 35.8714, lng: 128.6014, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  'daegu': { lat: 35.8714, lng: 128.6014, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  '인천': { lat: 37.4563, lng: 126.7052, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  'incheon': { lat: 37.4563, lng: 126.7052, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  '수원': { lat: 37.2636, lng: 127.0286, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },
  'suwon': { lat: 37.2636, lng: 127.0286, country: '대한민국', countryEn: 'South Korea', isMajorHub: false },

  // 캐나다
  '토론토': { lat: 43.6532, lng: -79.3832, country: '캐나다', countryEn: 'Canada', isMajorHub: true },
  'toronto': { lat: 43.6532, lng: -79.3832, country: '캐나다', countryEn: 'Canada', isMajorHub: true },
  '밴쿠버': { lat: 49.2827, lng: -123.1207, country: '캐나다', countryEn: 'Canada', isMajorHub: false },
  'vancouver': { lat: 49.2827, lng: -123.1207, country: '캐나다', countryEn: 'Canada', isMajorHub: false },
  '몬트리올': { lat: 45.5017, lng: -73.5673, country: '캐나다', countryEn: 'Canada', isMajorHub: false },
  'montreal': { lat: 45.5017, lng: -73.5673, country: '캐나다', countryEn: 'Canada', isMajorHub: false },

  // 미국
  '샌프란시스코': { lat: 37.7749, lng: -122.4194, country: '미국', countryEn: 'USA', isMajorHub: true },
  'san francisco': { lat: 37.7749, lng: -122.4194, country: '미국', countryEn: 'USA', isMajorHub: true },
  'sanfrancisco': { lat: 37.7749, lng: -122.4194, country: '미국', countryEn: 'USA', isMajorHub: true },
  'sf': { lat: 37.7749, lng: -122.4194, country: '미국', countryEn: 'USA', isMajorHub: true },
  'san francisco, ca': { lat: 37.7749, lng: -122.4194, country: '미국', countryEn: 'USA', isMajorHub: true },
  'san francisco ca': { lat: 37.7749, lng: -122.4194, country: '미국', countryEn: 'USA', isMajorHub: true },
  'bay area': { lat: 37.7749, lng: -122.4194, country: '미국', countryEn: 'USA', isMajorHub: true },

  '버클리': { lat: 37.8716, lng: -122.2727, country: '미국', countryEn: 'USA', isMajorHub: true },
  'berkeley': { lat: 37.8716, lng: -122.2727, country: '미국', countryEn: 'USA', isMajorHub: true },
  'berkeley, ca': { lat: 37.8716, lng: -122.2727, country: '미국', countryEn: 'USA', isMajorHub: true },

  '팔로 알토': { lat: 37.4419, lng: -122.1430, country: '미국', countryEn: 'USA', isMajorHub: true },
  '팔로알토': { lat: 37.4419, lng: -122.1430, country: '미국', countryEn: 'USA', isMajorHub: true },
  'palo alto': { lat: 37.4419, lng: -122.1430, country: '미국', countryEn: 'USA', isMajorHub: true },
  'paloalto': { lat: 37.4419, lng: -122.1430, country: '미국', countryEn: 'USA', isMajorHub: true },
  'palo alto, ca': { lat: 37.4419, lng: -122.1430, country: '미국', countryEn: 'USA', isMajorHub: true },

  '엘에이': { lat: 34.0522, lng: -118.2437, country: '미국', countryEn: 'USA', isMajorHub: true },
  '로스앤젤레스': { lat: 34.0522, lng: -118.2437, country: '미국', countryEn: 'USA', isMajorHub: true },
  '로스엔젤레스': { lat: 34.0522, lng: -118.2437, country: '미국', countryEn: 'USA', isMajorHub: true },
  'los angeles': { lat: 34.0522, lng: -118.2437, country: '미국', countryEn: 'USA', isMajorHub: true },
  'losangeles': { lat: 34.0522, lng: -118.2437, country: '미국', countryEn: 'USA', isMajorHub: true },
  'la': { lat: 34.0522, lng: -118.2437, country: '미국', countryEn: 'USA', isMajorHub: true },
  'los angeles, ca': { lat: 34.0522, lng: -118.2437, country: '미국', countryEn: 'USA', isMajorHub: true },

  '뉴욕': { lat: 40.7128, lng: -74.0060, country: '미국', countryEn: 'USA', isMajorHub: false },
  'new york': { lat: 40.7128, lng: -74.0060, country: '미국', countryEn: 'USA', isMajorHub: false },
  'newyork': { lat: 40.7128, lng: -74.0060, country: '미국', countryEn: 'USA', isMajorHub: false },
  'nyc': { lat: 40.7128, lng: -74.0060, country: '미국', countryEn: 'USA', isMajorHub: false },

  '시애틀': { lat: 47.6062, lng: -122.3321, country: '미국', countryEn: 'USA', isMajorHub: false },
  'seattle': { lat: 47.6062, lng: -122.3321, country: '미국', countryEn: 'USA', isMajorHub: false },

  '산호세': { lat: 37.3382, lng: -121.8863, country: '미국', countryEn: 'USA', isMajorHub: false },
  'san jose': { lat: 37.3382, lng: -121.8863, country: '미국', countryEn: 'USA', isMajorHub: false },
  'sanjose': { lat: 37.3382, lng: -121.8863, country: '미국', countryEn: 'USA', isMajorHub: false },

  '시카고': { lat: 41.8781, lng: -87.6298, country: '미국', countryEn: 'USA', isMajorHub: false },
  'chicago': { lat: 41.8781, lng: -87.6298, country: '미국', countryEn: 'USA', isMajorHub: false },

  '보스턴': { lat: 42.3601, lng: -71.0589, country: '미국', countryEn: 'USA', isMajorHub: false },
  'boston': { lat: 42.3601, lng: -71.0589, country: '미국', countryEn: 'USA', isMajorHub: false }
};

// 도시 정규화 매핑 사전
const CITY_CANONICAL_MAP = {
  '샌프란시스코': '샌프란시스코',
  'san francisco': '샌프란시스코',
  'sanfrancisco': '샌프란시스코',
  'sf': '샌프란시스코',
  'san francisco, ca': '샌프란시스코',
  'san francisco ca': '샌프란시스코',
  'bay area': '샌프란시스코',

  '버클리': '버클리',
  'berkeley': '버클리',
  'berkeley, ca': '버클리',

  '팔로 알토': '팔로 알토',
  '팔로알토': '팔로 알토',
  'palo alto': '팔로 알토',
  'paloalto': '팔로 알토',
  'palo alto, ca': '팔로 알토',

  '엘에이': '엘에이',
  '로스앤젤레스': '엘에이',
  '로스엔젤레스': '엘에이',
  'los angeles': '엘에이',
  'losangeles': '엘에이',
  'la': '엘에이',

  '토론토': '토론토',
  'toronto': '토론토',

  '밴쿠버': '밴쿠버',
  'vancouver': '밴쿠버',

  '전주': '전주',
  'jeonju': '전주',

  '용인': '용인',
  'yongin': '용인',

  '서울': '서울',
  'seoul': '서울',

  '부산': '부산',
  'busan': '부산',

  '뉴욕': '뉴욕',
  'new york': '뉴욕',
  'nyc': '뉴욕',

  '시애틀': '시애틀',
  'seattle': '시애틀',

  '산호세': '산호세',
  'san jose': '산호세'
};

// 도시 표준명 추출 함수
function getCanonicalCity(cityName) {
  if (!cityName) return '';
  const trimmed = cityName.toString().trim();
  const lower = trimmed.toLowerCase();

  if (CITY_CANONICAL_MAP[lower]) {
    return CITY_CANONICAL_MAP[lower];
  }

  const stripped = lower.replace(/[\s,_-]+/g, '');
  for (const [k, v] of Object.entries(CITY_CANONICAL_MAP)) {
    if (k.replace(/[\s,_-]+/g, '') === stripped) {
      return v;
    }
  }

  if (typeof MAJOR_HUBS !== 'undefined') {
    const hub = MAJOR_HUBS.find(h => {
      const hCity = h.city.toLowerCase().replace(/[\s,_-]+/g, '');
      const hCityEn = h.cityEn.toLowerCase().replace(/[\s,_-]+/g, '');
      return hCity === stripped || hCityEn === stripped;
    });
    if (hub) return hub.city;
  }

  for (const [k, v] of Object.entries(CITY_CANONICAL_MAP)) {
    if (lower.includes(k) && k.length >= 2) {
      return v;
    }
  }

  return trimmed;
}

// 두 도시명이 동일한지 판별 (한글/영문/대소문자/약어 무관)
function isCityMatch(city1, city2) {
  if (!city1 || !city2) return false;
  if (city1 === city2) return true;

  const s1 = city1.toString().toLowerCase().trim().replace(/[\s,_-]+/g, '');
  const s2 = city2.toString().toLowerCase().trim().replace(/[\s,_-]+/g, '');
  if (s1 === s2) return true;

  const c1 = getCanonicalCity(city1);
  const c2 = getCanonicalCity(city2);
  if (c1 && c2 && c1 === c2) return true;

  const cs1 = c1.toLowerCase().replace(/[\s,_-]+/g, '');
  const cs2 = c2.toLowerCase().replace(/[\s,_-]+/g, '');
  if (cs1 === cs2) return true;

  if (typeof MAJOR_HUBS !== 'undefined') {
    const findHub = (name) => {
      const target = name.toString().toLowerCase().trim().replace(/[\s,_-]+/g, '');
      const canon = getCanonicalCity(name).toLowerCase().replace(/[\s,_-]+/g, '');
      return MAJOR_HUBS.find(h => {
        const hc = h.city.toLowerCase().replace(/[\s,_-]+/g, '');
        const he = h.cityEn.toLowerCase().replace(/[\s,_-]+/g, '');
        const hi = (h.id || '').toLowerCase();
        return hc === target || he === target || hi === target || hc === canon || he === canon;
      });
    };

    const h1 = findHub(city1);
    const h2 = findHub(city2);
    if (h1 && h2 && h1.id === h2.id) return true;
  }

  return false;
}

// 사용자 표시용 도시명 (현재 언어에 따라 표시)
function getCityDisplayName(cityName, lang = 'ko') {
  if (!cityName) return '';
  const canonical = getCanonicalCity(cityName);
  if (typeof MAJOR_HUBS !== 'undefined') {
    const hub = MAJOR_HUBS.find(h => isCityMatch(h.city, canonical) || isCityMatch(h.city, cityName));
    if (hub) {
      return lang === 'en' ? hub.cityEn : hub.city;
    }
  }
  return cityName;
}


// 7대 핵심 거점 메타 정보
const MAJOR_HUBS = [
  {
    id: 'jeonju',
    country: '대한민국',
    countryEn: 'South Korea',
    city: '전주',
    cityEn: 'Jeonju',
    label: '대한민국 전주',
    labelEn: 'Jeonju, South Korea',
    flag: '🇰🇷',
    description: '가문의 뿌리와 종친회 본관 중심지',
    descriptionEn: 'Ancestral root and seat of the Clan Association',
    lat: 35.8242,
    lng: 127.1480,
    zoom: 12
  },
  {
    id: 'yongin',
    country: '대한민국',
    countryEn: 'South Korea',
    city: '용인',
    cityEn: 'Yongin',
    label: '대한민국 용인',
    labelEn: 'Yongin, South Korea',
    flag: '🇰🇷',
    description: '수도권 가문 친족 밀집 집성촌',
    descriptionEn: 'Metropolitan clan family community settlement',
    lat: 37.2411,
    lng: 127.1776,
    zoom: 12
  },
  {
    id: 'toronto',
    country: '캐나다',
    countryEn: 'Canada',
    city: '토론토',
    cityEn: 'Toronto',
    label: '캐나다 토론토',
    labelEn: 'Toronto, Canada',
    flag: '🇨🇦',
    description: '캐나다 동부 조양 임씨 교민 네트워크',
    descriptionEn: 'Eastern Canada clan overseas network',
    lat: 43.6532,
    lng: -79.3832,
    zoom: 11
  },
  {
    id: 'san_francisco',
    country: '미국',
    countryEn: 'USA',
    city: '샌프란시스코',
    cityEn: 'San Francisco',
    label: '미국 샌프란시스코',
    labelEn: 'San Francisco, USA',
    flag: '🇺🇸',
    description: '미 서부 베이 에어리어 금융/문화 허브',
    descriptionEn: 'West Coast Bay Area finance & culture hub',
    lat: 37.7749,
    lng: -122.4194,
    zoom: 12
  },
  {
    id: 'berkeley',
    country: '미국',
    countryEn: 'USA',
    city: '버클리',
    cityEn: 'Berkeley',
    label: '미국 버클리',
    labelEn: 'Berkeley, USA',
    flag: '🇺🇸',
    description: 'UC 버클리 및 이스트 베이 학술 연구진',
    descriptionEn: 'UC Berkeley & East Bay academic community',
    lat: 37.8716,
    lng: -122.2727,
    zoom: 13
  },
  {
    id: 'palo_alto',
    country: '미국',
    countryEn: 'USA',
    city: '팔로 알토',
    cityEn: 'Palo Alto',
    label: '미국 팔로 알토',
    labelEn: 'Palo Alto, USA',
    flag: '🇺🇸',
    description: '실리콘밸리 테크 및 스탠퍼드 연구 인맥',
    descriptionEn: 'Silicon Valley tech & Stanford research circle',
    lat: 37.4419,
    lng: -122.1430,
    zoom: 13
  },
  {
    id: 'la',
    country: '미국',
    countryEn: 'USA',
    city: '엘에이',
    cityEn: 'Los Angeles',
    label: '미국 엘에이',
    labelEn: 'Los Angeles, USA',
    flag: '🇺🇸',
    description: '미국 최대 한인 사회 및 남가주 종친회',
    descriptionEn: 'Largest Korean community & Southern CA branch',
    lat: 34.0522,
    lng: -118.2437,
    zoom: 11
  }
];

// 조양 임씨 가문 생존 친척 초기 샘플 데이터 (사진 및 각종 SNS 정보 포함)
const INITIAL_RELATIVES_DATA = [
  // --- 27대손 (가문 원로) ---
  {
    id: 'rel-0',
    name: '임한식',
    parentName: '',
    generation: 27,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    email: 'hanshik.im@choyang-im.org',
    country: '대한민국',
    city: '전주',
    phone: '010-3301-4490',
    address: '전북특별자치도 전주시 완산구 은행로 22 (한옥마을 본가)',
    workplace: '조양 임씨 대종회',
    jobTitle: '명예 대종손 / 고문',
    workAddress: '전주시 완산구 풍남문로 15',
    birthday: '1932-03-10',
    notes: '조양 임씨 27대손, 전주 본가 지킴이, 문중의 정신적 지주',
    sns: {
      website: 'https://choyang-im.org'
    },
    createdAt: '2026-01-01T09:00:00.000Z'
  },

  // --- 28대손 ---
  {
    id: 'rel-1',
    name: '임종원',
    parentName: '임한식',
    generation: 28,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    email: 'jongwon.im@choyang-im.org',
    country: '대한민국',
    city: '전주',
    phone: '010-3842-7102',
    address: '전북특별자치도 전주시 완산구 풍남문3길 18',
    workplace: '전주 한옥전통문화연구소',
    jobTitle: '상임이사 / 종친회 총무',
    workAddress: '전주시 완산구 기린대로 99',
    birthday: '1954-04-12',
    notes: '조양 임씨 28대손 (임한식의 장남), 가문 문중 행사 및 시제(時祭) 총괄 주관',
    sns: {
      facebook: 'https://facebook.com/jongwon.im',
      website: 'https://jeonju-culture.org'
    },
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'rel-9',
    name: '임성택',
    parentName: '임한식',
    generation: 28,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    email: 'daniel.im@berkeley.edu',
    country: '미국',
    city: '버클리',
    phone: '+1-510-555-3392',
    address: '110 Sproul Hall, Berkeley, CA 94720',
    workplace: 'UC 버클리 (UC Berkeley)',
    jobTitle: '컴퓨터과학과 석좌교수',
    workAddress: 'Soda Hall, UC Berkeley, Berkeley, CA 94720',
    birthday: '1965-02-20',
    notes: '조양 임씨 28대손 (임한식의 차남), 인공지능 연구 권위자, 버클리 한인 학술모임 회장',
    sns: {
      linkedin: 'https://linkedin.com/in/prof-daniel-im',
      twitter: 'daniel_im_ai',
      website: 'https://eecs.berkeley.edu/~danielim'
    },
    createdAt: '2026-02-22T15:00:00.000Z'
  },
  {
    id: 'rel-5',
    name: '임병호',
    parentName: '임한식',
    generation: 28,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    email: 'david.im@torontotech.ca',
    country: '캐나다',
    city: '토론토',
    phone: '+1-416-555-0198',
    address: '120 Bloor St E, Suite 800, Toronto, ON M4W 1B7',
    workplace: 'RBC Royal Bank Canada',
    jobTitle: 'Senior Vice President of Wealth Mgmt',
    workAddress: '200 Bay St, Toronto, ON M5J 2J5',
    birthday: '1968-09-15',
    notes: '조양 임씨 28대손 (임한식의 3남), 토론토 향우회 회장, 북미 친족 야유회 주최',
    sns: {
      linkedin: 'https://linkedin.com/in/david-im-rbc',
      facebook: 'https://facebook.com/david.im.toronto'
    },
    createdAt: '2026-02-05T16:20:00.000Z'
  },

  // --- 29대손 ---
  {
    id: 'rel-2',
    name: '임수연',
    parentName: '임종원',
    generation: 29,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    email: 'sooyeon.im@jbnu.ac.kr',
    country: '대한민국',
    city: '전주',
    phone: '010-9123-5582',
    address: '전북특별자치도 전주시 덕진구 백제대로 567',
    workplace: '전북대학교 병원',
    jobTitle: '소아청소년과 교수',
    workAddress: '전주시 덕진구 건지로 20',
    birthday: '1982-11-23',
    notes: '29대손, 임종원 이사의 장녀, 가문 청년회 멘토링 활동 중',
    sns: {
      instagram: 'dr.sooyeon_im',
      linkedin: 'https://linkedin.com/in/sooyeon-im-md'
    },
    createdAt: '2026-01-15T14:30:00.000Z'
  },
  {
    id: 'rel-3',
    name: '임태훈',
    parentName: '임종원',
    generation: 29,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    email: 'taehoon.im@samsung.com',
    country: '대한민국',
    city: '용인',
    phone: '010-4491-8831',
    address: '경기도 용인시 수지구 수지로 342, 102동 1401호',
    workplace: '삼성전자 반도체연구소 (기흥)',
    jobTitle: '수석연구원 (VP of Engineering)',
    workAddress: '경기도 용인시 기흥구 삼성로 1',
    birthday: '1976-07-19',
    notes: '29대손 태(泰)자 항렬 (임종원 이사의 장남), 수도권 친족 모임 간사',
    sns: {
      linkedin: 'https://linkedin.com/in/taehoon-im-semi'
    },
    createdAt: '2026-01-20T09:15:00.000Z'
  },
  {
    id: 'rel-7',
    name: '임재형',
    parentName: '임성택',
    generation: 29,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    email: 'justin.im@sfvcfirm.com',
    country: '미국',
    city: '샌프란시스코',
    phone: '+1-415-555-2468',
    address: '555 California St, Suite 4200, San Francisco, CA 94104',
    workplace: 'Pacific Horizon Ventures',
    jobTitle: 'Managing Partner (대표 파트너)',
    workAddress: 'Financial District, San Francisco, CA',
    birthday: '1979-05-28',
    notes: '29대손 (임성택 교수의 장남), 실리콘밸리 및 SF 한인 벤처 투자 협회 이사',
    sns: {
      linkedin: 'https://linkedin.com/in/justin-im-vc',
      twitter: 'justinim_vc'
    },
    createdAt: '2026-02-12T08:00:00.000Z'
  },
  {
    id: 'rel-10',
    name: '임동준',
    parentName: '임성택',
    generation: 29,
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    email: 'alex.im@stanfordalumni.org',
    country: '미국',
    city: '팔로 알토',
    phone: '+1-650-555-9012',
    address: '450 Jane Stanford Way, Stanford, CA 94305',
    workplace: 'DeepHealth AI Labs',
    jobTitle: 'Co-Founder & CEO (창업자)',
    workAddress: 'University Ave, Palo Alto, CA 94301',
    birthday: '1986-06-30',
    notes: '29대손 (임성택 교수의 차남), 스탠퍼드 박사 출신 테크 창업가',
    sns: {
      linkedin: 'https://linkedin.com/in/alex-im-deephealth',
      twitter: 'alexim_ai',
      youtube: 'https://youtube.com/@AlexImTech'
    },
    createdAt: '2026-02-25T11:20:00.000Z'
  },
  {
    id: 'rel-11',
    name: '임유나',
    parentName: '임성택',
    generation: 29,
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    email: 'grace.im@palolaw.com',
    country: '미국',
    city: '팔로 알토',
    phone: '+1-650-555-4421',
    address: '2600 El Camino Real, Palo Alto, CA 94306',
    workplace: 'Wilson Sonsini Goodrich & Rosati',
    jobTitle: '국제특허 및 M&A 전담 파트너 변호사',
    workAddress: '650 Page Mill Rd, Palo Alto, CA 94304',
    birthday: '1984-10-09',
    notes: '29대손 (임성택 교수의 장녀), 해외 종친 법률 자문 봉사',
    sns: {
      linkedin: 'https://linkedin.com/in/grace-yuna-im',
      instagram: 'grace_im_law'
    },
    createdAt: '2026-02-28T14:40:00.000Z'
  },
  {
    id: 'rel-6',
    name: '임채원',
    parentName: '임병호',
    generation: 29,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    email: 'chloe.im@utoronto.ca',
    country: '캐나다',
    city: '토론토',
    phone: '+1-647-555-8371',
    address: '27 King\'s College Cir, Toronto, ON M5S 1A1',
    workplace: '토론토 대학교 (U of T)',
    jobTitle: '생명공학 박사과정 연구원',
    workAddress: 'Toronto, ON M5S 3E1',
    birthday: '1997-12-04',
    notes: '29대손 (임병호 회장의 차녀), 북미 차세대 종친 네트워크 운영자',
    sns: {
      instagram: 'chloe.im_to',
      linkedin: 'https://linkedin.com/in/chloe-im-biotech'
    },
    createdAt: '2026-02-10T13:45:00.000Z'
  },
  {
    id: 'rel-12',
    name: '임건우',
    parentName: '임병호',
    generation: 29,
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    email: 'kevin.im@lamedical.org',
    country: '미국',
    city: '엘에이',
    phone: '+1-213-555-6677',
    address: '3700 Wilshire Blvd, Suite 500, Los Angeles, CA 90010',
    workplace: '굿사마리탄 종합병원 / 윌셔 메디컬',
    jobTitle: '원장 / 심장내과 전문의',
    workAddress: 'Wilshire Blvd, Los Angeles, CA 90017',
    birthday: '1971-01-25',
    notes: '29대손 (임병호 회장의 장남), 남가주 조양 임씨 종친회 부회장',
    sns: {
      linkedin: 'https://linkedin.com/in/kevin-im-cardiology',
      facebook: 'https://facebook.com/dr.kevin.im'
    },
    createdAt: '2026-03-01T09:30:00.000Z'
  },

  // --- 30대손 ---
  {
    id: 'rel-4',
    name: '임서현',
    parentName: '임태훈',
    generation: 30,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    email: 'seohyun.im@artline.kr',
    country: '대한민국',
    city: '용인',
    phone: '010-8274-1903',
    address: '경기도 용인시 기흥구 동백중앙로 16',
    workplace: '아트라인 디자인 스튜디오',
    jobTitle: '대표 디렉터',
    workAddress: '용인시 수지구 포은대로 410',
    birthday: '1990-03-08',
    notes: '30대손 (임태훈 수석의 장녀), 가문 웹사이트 디자인 자문',
    sns: {
      instagram: 'seohyun.artline',
      website: 'https://artline.kr'
    },
    createdAt: '2026-02-01T11:00:00.000Z'
  },
  {
    id: 'rel-8',
    name: '임지민',
    parentName: '임재형',
    generation: 30,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    email: 'rachel.im@designstudio.org',
    country: '미국',
    city: '샌프란시스코',
    phone: '+1-415-555-7890',
    address: '350 Mission St, San Francisco, CA 94105',
    workplace: 'Salesforce Global HQ',
    jobTitle: 'Principal Product Designer',
    workAddress: '415 Mission St, San Francisco, CA 94105',
    birthday: '1988-08-14',
    notes: '30대손 (임재형 파트너의 장녀), SF 현대미술관 후원회 회원',
    sns: {
      instagram: 'rachel_im_sf',
      linkedin: 'https://linkedin.com/in/rachel-jimin-im',
      twitter: 'rachelim_design'
    },
    createdAt: '2026-02-18T10:10:00.000Z'
  },
  {
    id: 'rel-13',
    name: '임하늘',
    parentName: '임건우',
    generation: 30,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    email: 'hannah.im@hollywoodmedia.com',
    country: '미국',
    city: '엘에이',
    phone: '+1-323-555-1204',
    address: '6801 Hollywood Blvd, Los Angeles, CA 90028',
    workplace: '글로벌 엔터테인먼트 픽처스',
    jobTitle: '콘텐츠 총괄 프로듀서',
    workAddress: 'Sunset Blvd, Hollywood, CA 90028',
    birthday: '1993-07-07',
    notes: '30대손 (임건우 원장의 장녀), 가문 역사 영상 아카이빙 참여',
    sns: {
      instagram: 'hannah.im_la',
      youtube: 'https://youtube.com/@HannahImFilms'
    },
    createdAt: '2026-03-03T17:05:00.000Z'
  }
];
