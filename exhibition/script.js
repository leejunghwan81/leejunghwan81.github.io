// 전역 변수
let presentations = [];
let currentOpenItem = null;

// DOM 요소
const presentationList = document.getElementById('presentationList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const presentationFrame = document.getElementById('presentationFrame');
const closeModal = document.getElementById('closeModal');

// 초기화 함수
async function init() {
    try {
        await loadPresentations();
        renderPresentations();
        setupEventListeners();
    } catch (error) {
        console.error('초기화 중 오류 발생:', error);
        showError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
}

// JSON 데이터 로드
async function loadPresentations() {
    try {
        const response = await fetch('list.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        presentations = await response.json();
    } catch (error) {
        console.error('발표자료 데이터 로드 실패:', error);
        throw error;
    }
}

// 발표자료 목록 렌더링
function renderPresentations() {
    presentationList.innerHTML = '';

    presentations.forEach((presentation, index) => {
        const presentationItem = createPresentationItem(presentation, index);
        presentationList.appendChild(presentationItem);
    });
}

// 개별 발표자료 아이템 생성
function createPresentationItem(presentation, index) {
    const item = document.createElement('div');
    item.className = 'presentation-item';
    item.dataset.index = index;

    item.innerHTML = `
        <div class="accordion-header" onclick="toggleAccordion(${index})">
            <h3>${presentation.title}</h3>
            <span class="accordion-toggle">▼</span>
        </div>
        <div class="accordion-content">
            <div class="presentation-description">
                ${presentation.description}
            </div>
            <button class="run-button" onclick="openPresentation(${index})">
                🚀 실행하기
            </button>
        </div>
    `;

    return item;
}

// 아코디언 토글 함수
function toggleAccordion(index) {
    const item = document.querySelector(`[data-index="${index}"]`);
    const isCurrentlyOpen = item.classList.contains('active');

    // 현재 열린 아이템이 있다면 닫기
    if (currentOpenItem !== null && currentOpenItem !== index) {
        const currentItem = document.querySelector(`[data-index="${currentOpenItem}"]`);
        if (currentItem) {
            currentItem.classList.remove('active');
        }
    }

    // 클릭한 아이템 토글
    if (isCurrentlyOpen) {
        item.classList.remove('active');
        currentOpenItem = null;
    } else {
        item.classList.add('active');
        currentOpenItem = index;
    }
}

// 발표자료 실행 (모달 열기)
function openPresentation(index) {
    const presentation = presentations[index];

    modalTitle.textContent = presentation.title;
    presentationFrame.src = presentation.url;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

// 모달 닫기
function closeModalFunction() {
    modal.classList.remove('show');
    presentationFrame.src = ''; // iframe 정리
    document.body.style.overflow = 'auto'; // 배경 스크롤 복구
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 모달 닫기 버튼
    closeModal.addEventListener('click', closeModalFunction);

    // 모달 배경 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunction();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModalFunction();
        }
    });

    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', handleResize);
}

// 윈도우 리사이즈 처리
function handleResize() {
    // 필요시 반응형 처리 로직 추가
}

// 오류 메시지 표시
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #ff6b6b;
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: center;
        font-weight: 600;
    `;
    errorDiv.textContent = message;

    presentationList.appendChild(errorDiv);
}

// 로딩 상태 표시
function showLoading() {
    presentationList.innerHTML = `
        <div style="text-align: center; padding: 50px; color: white;">
            <div style="font-size: 2rem; margin-bottom: 10px;">🔄</div>
            <div>발표자료를 불러오는 중...</div>
        </div>
    `;
}

// 페이지 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    showLoading();
    init();
});

// 전역 함수로 노출 (HTML에서 onclick으로 사용)
window.toggleAccordion = toggleAccordion;
window.openPresentation = openPresentation;
