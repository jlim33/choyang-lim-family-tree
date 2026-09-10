/**
 * 조양 임씨(兆陽 林氏) 가문 족보 다국어(한글/영어) 번역 사전
 * Choyang Im Clan Genealogy Internationalization (KO / EN)
 */

const I18N_DICTIONARY = {
  ko: {
    // 헤더 & 테마
    brandSub: "CHOYANG IM CLAN GENEALOGY NETWORK",
    brandTitle: "조양 임씨",
    brandHanja: "(兆陽 林氏)",
    fontSizeLabel: "글자크기",
    fontNormal: "보통",
    fontLarge: "크게",
    fontXLarge: "아주 크게",
    langLabel: "언어",
    themeLabel: "디자인",
    themeClassic: "클래식",
    themePastel: "파스텔",
    themeDark: "다크",
    btnAddRelative: "친척 등록하기",
    btnExportExcel: "엑셀 저장",
    btnBackup: "백업",
    btnRestore: "복원",
    btnTop: "맨 위로",

    // 뷰 탭
    tabMap: "거주지 지도 & 7대 거점",
    tabTree: "가계도 계통도 (Family Tree)",
    tabDirectory: "친척 명부 목록",

    // 7대 거점 스포트라이트
    spotlightBadge: "가문 7대 거점",
    spotlightTitle: "친척 최다 거주 중심지",
    spotlightDesc: "클릭 시 해당 도시로 지도 이동 및 친척 명부가 바로 필터링됩니다.",
    btnViewAll: "전체 보기",
    residentCountSuffix: "명 거주",

    // 통계 요약 바
    statTotalRelatives: "등록 생존 친척",
    statTotalCountries: "글로벌 거주 국가",
    statTotalCities: "거주 도시",
    statMajorHubs: "7대 핵심 거점 거주",
    unitPeople: "명",
    unitCountries: "개국",
    unitCities: "개 도시",

    // 검색 및 툴바
    searchPlaceholder: "성명, 도시, 직장, 이메일, SNS 검색...",
    countryFilterAll: "모든 국가 전체",
    viewCard: "카드",
    viewTable: "목록",

    // 지도 섹션
    mapTitle: "조양 임씨 글로벌 & 국내 거주 친척 지도",
    mapQuickLabel: "빠른 시점:",
    mapWorld: "전세계 조망",
    mapKorea: "대한민국",
    mapNorthAmerica: "북미 (미국/캐나다)",
    mapPopupHubBadge: "★ 가문 핵심 7대 거점",
    mapPopupNormalBadge: "친족 거주지",
    mapPopupResidents: "거주 친척",
    mapPopupViewList: "이 지역 친척 명부 보기",
    mapPopupNoRelatives: "등록된 친척이 없습니다.",

    // 가계도 섹션
    treeTitle: "조양 임씨 직계·방계 가계도 계통도 (Family Tree Hierarchy)",
    treeDesc: "등록된 부모 성명을 바탕으로 세대별(항렬) 계통과 친족 관계가 자동으로 연결됩니다. 카드를 클릭하면 상세 정보를 열람할 수 있습니다.",
    treeSearchPlaceholder: "가계도 내 친척 검색...",
    treeZoomIn: "확대",
    treeZoomOut: "축소",
    treeZoomReset: "초기화",
    treeRootNote: "가문 시조 및 선조의 맥을 잇는 생존 친족 계통",
    treeParentLabel: "부모:",
    treeNoParent: "최상위(선조 세대)",
    treeGenerationSuffix: "대손",

    // 친척 명부 섹션
    directoryTitle: "생존 친척 인적사항 명부",
    searchResultPrefix: "검색 결과:",
    btnResetSample: "샘플 복원",
    btnAddNew: "새 친척 등록",
    activeFilterHubPrefix: "선택 거점:",
    activeFilterCountryPrefix: "선택 국가:",
    hubSpotlightBadge: "7대 거점",
    emptyTitle: "조건에 일치하는 친척 정보가 없습니다.",
    emptyDesc: "검색어를 변경하시거나 필터를 초기화해 보세요.",

    // 테이블 헤더
    thName: "성명 (이름)",
    thLocation: "거주 국가/도시",
    thEmail: "이메일 주소",
    thPhone: "전화번호",
    thJob: "직장 및 직책",
    thParent: "부모 성명",
    thBirthday: "생년월일",
    thSns: "SNS 소셜",
    thManage: "관리",

    // 카드 및 상세 보기
    btnViewDetail: "상세 보기",
    btnEdit: "수정",
    btnDelete: "삭제",
    btnCall: "전화 걸기",
    btnSendEmail: "이메일 보내기",
    btnCopyAddress: "주소 복사",
    btnFlyMap: "지도에서 거점 보기",
    btnClose: "닫기",
    notRegistered: "미등록",
    noNotes: "등록된 메모 없음",

    // 모달: 등록 / 수정
    modalAddTitle: "새로운 친척 인적사항 등록",
    modalAddSub: "이름과 이메일은 필수이며, 사진과 SNS 등 원하시는 정보를 자유롭게 입력하세요.",
    modalEditTitle: "친척 인적사항 수정",
    modalEditSub: "친척분의 사진, SNS 및 프로필 정보를 수정합니다.",

    // 폼 필드 라벨 (사진 & SNS 포함)
    formPhoto: "프로필 사진",
    formPhotoUpload: "사진 선택",
    formPhotoRemove: "사진 제거",
    formPhotoHelper: "친척분의 인물 사진을 등록하면 가계도와 명부 카드에 멋지게 표시됩니다.",
    formName: "성명 (이름)",
    formEmail: "이메일 주소",
    formCountry: "거주 국가",
    formCity: "거주 도시",
    formCityPlaceholder: "예: 샌프란시스코, San Francisco, 전주, 토론토 등",
    formPhone: "전화번호",
    formBirthday: "생년월일",
    formAddress: "자택 주소",
    formWorkplace: "직장 (회사명/소속)",
    formJobTitle: "직책 / 담당 업무",
    formWorkAddress: "회사 (직장) 주소",
    formNotes: "기타 항목 (항렬, 촌수/가계 관계, 특이사항 메모)",
    formParentName: "부모 성명 (가계도 연결 필수 입력)",
    formParentHelper: "가계도(Family Tree Hierarchy) 연결에 사용됩니다. 기존 등록된 부모님의 이름을 선택하거나 직접 입력하세요.",

    // SNS 필드
    snsSectionTitle: "각종 SNS & 소셜 네트워크 (선택)",
    snsSectionDesc: "인스타그램, 링크드인 등 친족들과 연결될 수 있는 계정을 편하게 남겨주세요.",
    snsInstagram: "인스타그램 (Instagram)",
    snsLinkedIn: "링크드인 (LinkedIn)",
    snsFacebook: "페이스북 (Facebook)",
    snsYouTube: "유튜브 (YouTube)",
    snsTwitter: "X / 트위터 (X/Twitter)",
    snsWebsite: "웹사이트 / 카카오톡",

    badgeRequired: "*필수",
    badgeOptional: "(선택)",
    quickHubsLabel: "7대거점:",
    btnCancel: "취소",
    btnSave: "인적사항 저장하기",

    // 에러 메시지
    errNameRequired: "친척분의 이름을 반드시 입력해주세요.",
    errEmailRequired: "이메일 주소를 반드시 입력해주세요.",
    errEmailInvalid: "올바른 이메일 형식(예: name@domain.com)을 입력해주세요.",

    // 상세 모달
    detailTitle: "친척 상세 정보 열람",
    detailSub: "등록된 인적사항, 프로필 사진 및 소셜 미디어를 확인하실 수 있습니다.",
    detailParentLabel: "부모 성명 (가계도)",
    detailEmailLabel: "이메일 주소",
    detailPhoneLabel: "연락처 (전화번호)",
    detailAddressLabel: "자택 주소",
    detailJobLabel: "직장 및 직책",
    detailBirthdayLabel: "생년월일",
    detailWorkAddressLabel: "직장 주소",
    detailSnsLabel: "소셜 미디어 (SNS)",
    detailNotesLabel: "기타 비고 및 가문 메모",

    // 토스트 및 컨펌
    toastSaved: "친척분의 정보가 저장되었습니다.",
    toastUpdated: "친척분의 정보가 수정되었습니다.",
    toastDeleted: "친척분의 정보가 삭제되었습니다.",
    toastFontSizeChanged: "글자 크기가 변경되었습니다.",
    toastLangChanged: "언어가 한국어로 전환되었습니다.",
    toastThemeChanged: "디자인 테마가 변경되었습니다.",
    toastBackupExported: "족보 데이터 백업 파일(JSON)을 다운로드했습니다.",
    toastCsvExported: "엑셀 호환 CSV 명부를 다운로드했습니다.",
    toastSampleRestored: "초기 가문 친척 데이터로 복원되었습니다.",
    confirmDelete: "정말로 이 친척 정보를 명부에서 삭제하시겠습니까?",
    confirmReset: "정말로 모든 데이터를 초기 샘플 데이터로 복원하시겠습니까? 현재 입력된 변경사항은 대체됩니다.",

    // 클래식 뮤직 라운지
    musicLoungeBadge: "Classic Best 5선",
    musicLoungeTitle: "🎻 조양 임씨 클래식 뮤직 라운지",
    musicLoungeDesc: "선조들의 숭고한 정신과 가문의 화합을 기리는 불멸의 클래식 명곡 마스터 사운드",
    musicPlaylistTitle: "클래식 5선 명곡 목록",
    musicTrackCount: "총 5곡 연속 스트리밍",
    musicFooterTip: "가문 족보 열람 및 가계도 탐색 중에도 배경음악이 끊김 없이 연속 재생됩니다.",
    musicContinuousBadge: "연속 자동 재생 중",
    musicIdleBadge: "클래식 명곡 5선"
  },

  en: {
    // Header & Themes
    brandSub: "CHOYANG IM CLAN GENEALOGY NETWORK",
    brandTitle: "Choyang Im Clan",
    brandHanja: "(兆陽 林氏)",
    fontSizeLabel: "Font Size",
    fontNormal: "Normal",
    fontLarge: "Large",
    fontXLarge: "Extra Large",
    langLabel: "Language",
    themeLabel: "Theme",
    themeClassic: "Classic",
    themePastel: "Pastel",
    themeDark: "Dark",
    btnAddRelative: "Add Relative",
    btnExportExcel: "Excel Export",
    btnBackup: "Backup",
    btnRestore: "Restore",
    btnTop: "To Top",

    // View Tabs
    tabMap: "Location Map & 7 Hubs",
    tabTree: "Family Tree Hierarchy",
    tabDirectory: "Relatives Directory",

    // 7 Major Hubs Spotlight
    spotlightBadge: "7 Major Clan Hubs",
    spotlightTitle: "Major Global Clan Settlements",
    spotlightDesc: "Click a hub to navigate the map and instantly filter living relatives.",
    btnViewAll: "View All",
    residentCountSuffix: " Residents",

    // Statistics Bar
    statTotalRelatives: "Living Relatives",
    statTotalCountries: "Countries",
    statTotalCities: "Cities",
    statMajorHubs: "In 7 Major Hubs",
    unitPeople: " People",
    unitCountries: " Countries",
    unitCities: " Cities",

    // Search and Toolbar
    searchPlaceholder: "Search by name, city, workplace, email, SNS...",
    countryFilterAll: "All Countries",
    viewCard: "Cards",
    viewTable: "Table",

    // Map Section
    mapTitle: "Choyang Im Clan Global & Korea Location Map",
    mapQuickLabel: "Quick View:",
    mapWorld: "Global View",
    mapKorea: "South Korea",
    mapNorthAmerica: "North America (USA/Canada)",
    mapPopupHubBadge: "★ 7 Major Clan Hub",
    mapPopupNormalBadge: "Settlement",
    mapPopupResidents: "Living Relatives",
    mapPopupViewList: "View Relatives in this City",
    mapPopupNoRelatives: "No registered relatives in this city.",

    // Family Tree Section
    treeTitle: "Choyang Im Clan Family Tree Hierarchy & Lineage Diagram",
    treeDesc: "Generations and familial relationships are automatically linked based on registered parent names. Click any card to view detailed profiles.",
    treeSearchPlaceholder: "Search in family tree...",
    treeZoomIn: "Zoom In",
    treeZoomOut: "Zoom Out",
    treeZoomReset: "Reset View",
    treeRootNote: "Lineage of living relatives connected to Clan Ancestors",
    treeParentLabel: "Parent:",
    treeNoParent: "Patriarch / Ancestor Gen",
    treeGenerationSuffix: "th Gen",

    // Relatives Directory Section
    directoryTitle: "Living Relatives Directory",
    searchResultPrefix: "Results:",
    btnResetSample: "Reset Sample",
    btnAddNew: "Add Relative",
    activeFilterHubPrefix: "Selected Hub:",
    activeFilterCountryPrefix: "Selected Country:",
    hubSpotlightBadge: "7 Hubs",
    emptyTitle: "No relatives found matching your criteria.",
    emptyDesc: "Try adjusting your search keyword or clearing the filters.",

    // Table Headers
    thName: "Full Name",
    thLocation: "Country / City",
    thEmail: "Email Address",
    thPhone: "Phone Number",
    thJob: "Workplace & Title",
    thParent: "Parent Name",
    thBirthday: "Date of Birth",
    thSns: "SNS Channels",
    thManage: "Actions",

    // Cards and Detail View
    btnViewDetail: "Details",
    btnEdit: "Edit",
    btnDelete: "Delete",
    btnCall: "Call",
    btnSendEmail: "Send Email",
    btnCopyAddress: "Copy Address",
    btnFlyMap: "View on Map",
    btnClose: "Close",
    notRegistered: "Not registered",
    noNotes: "No notes registered",

    // Modal: Add / Edit
    modalAddTitle: "Register New Relative",
    modalAddSub: "Name and email are mandatory. You can optionally add a portrait photo, social media, and parent's name.",
    modalEditTitle: "Edit Relative Information",
    modalEditSub: "Update portrait photo, social media, and profile details.",

    // Form Field Labels (Photo & SNS)
    formPhoto: "Profile Photo",
    formPhotoUpload: "Select Photo",
    formPhotoRemove: "Remove",
    formPhotoHelper: "Adding a portrait photo enhances the family tree and directory cards.",
    formName: "Full Name",
    formEmail: "Email Address",
    formCountry: "Country",
    formCity: "City",
    formCityPlaceholder: "e.g., San Francisco, Toronto, Jeonju, Yongin...",
    formPhone: "Phone Number",
    formBirthday: "Date of Birth",
    formAddress: "Home Address",
    formWorkplace: "Workplace / Organization",
    formJobTitle: "Job Title / Role",
    formWorkAddress: "Company Address",
    formNotes: "Notes (Generation, Family branch, Special remarks)",
    formParentName: "Parent's Name (Required for Family Tree Hierarchy)",
    formParentHelper: "Used to build the Family Tree Hierarchy. Select an existing relative or type the parent's full name.",

    // SNS Fields
    snsSectionTitle: "Social Media & SNS Channels (Optional)",
    snsSectionDesc: "Add Instagram, LinkedIn, or website handles to connect with family members worldwide.",
    snsInstagram: "Instagram",
    snsLinkedIn: "LinkedIn",
    snsFacebook: "Facebook",
    snsYouTube: "YouTube",
    snsTwitter: "X / Twitter",
    snsWebsite: "Website / KakaoTalk",

    badgeRequired: "*Required",
    badgeOptional: "(Optional)",
    quickHubsLabel: "7 Hubs:",
    btnCancel: "Cancel",
    btnSave: "Save Profile",

    // Error Messages
    errNameRequired: "Please enter the relative's full name.",
    errEmailRequired: "Please enter a valid email address.",
    errEmailInvalid: "Please enter a valid email format (e.g. name@domain.com).",

    // Detail Modal
    detailTitle: "Relative Detailed Profile",
    detailSub: "Review complete profile information, portrait photo, and social channels.",
    detailParentLabel: "Parent Name (Family Tree)",
    detailEmailLabel: "Email Address",
    detailPhoneLabel: "Phone Number",
    detailAddressLabel: "Home Address",
    detailJobLabel: "Workplace & Job Title",
    detailBirthdayLabel: "Date of Birth",
    detailWorkAddressLabel: "Company Address",
    detailSnsLabel: "Social Media & Networks",
    detailNotesLabel: "Notes & Family Heritage Remarks",

    // Toast and Confirm
    toastSaved: "Relative information has been saved successfully.",
    toastUpdated: "Relative information has been updated.",
    toastDeleted: "Relative record has been deleted.",
    toastFontSizeChanged: "Font size updated.",
    toastLangChanged: "Language switched to English.",
    toastThemeChanged: "Design theme updated.",
    toastBackupExported: "Family tree backup file (JSON) has been downloaded.",
    toastCsvExported: "Excel-compatible CSV directory has been downloaded.",
    toastSampleRestored: "Restored to initial 7-hub sample dataset.",
    confirmDelete: "Are you sure you want to delete this relative from the clan directory?",
    confirmReset: "Reset all records to initial sample dataset? Current changes will be replaced.",

    // Classic Music Lounge
    musicLoungeBadge: "Classic Best 5 Masterpieces",
    musicLoungeTitle: "🎻 Choyang Lim Classical Music Lounge",
    musicLoungeDesc: "Master recordings of timeless classical masterpieces celebrating heritage and family unity",
    musicPlaylistTitle: "Classic Best 5 Track List",
    musicTrackCount: "5 Tracks Continuous Stream",
    musicFooterTip: "Background music plays seamlessly while exploring genealogy records and the family tree.",
    musicContinuousBadge: "Continuous Play",
    musicIdleBadge: "Classic Best 5"
  }
};
