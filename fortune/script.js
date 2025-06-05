document.addEventListener('DOMContentLoaded', () => {
    const cookieWrapper = document.getElementById('cookie-wrapper');
    const cookieImg = document.getElementById('fortune-cookie-img');
    const openCookieBtn = document.getElementById('open-cookie-btn'); // 초기 버튼
    const messageArea = document.getElementById('message-area');
    const fortuneMessageElem = document.getElementById('fortune-message');
    const retryBtn = document.getElementById('retry-btn');

    let fortunes = [];

    // 1. 메시지 로드 (JSON)
    async function loadFortunes() {
        try {
            const response = await fetch('fortunes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fortunes = await response.json();
            if (fortunes.length === 0) {
                console.error("No fortunes loaded from JSON.");
                fortuneMessageElem.textContent = "운세 메시지를 불러오는 데 실패했어요. 잠시 후 다시 시도해주세요.";
            }
        } catch (error) {
            console.error("Error loading fortunes:", error);
            fortuneMessageElem.textContent = "운세 메시지를 불러오는 데 문제가 발생했습니다.";
            // 사용자에게 보여줄 기본 메시지 세팅 또는 오류 처리
            fortunes = ["오늘은 왠지 좋은 일이 생길 것 같은 날입니다!"];
        }
    }

    function getRandomFortune() {
        if (fortunes.length === 0) {
            return "메시지를 준비 중입니다. 잠시만 기다려주세요!";
        }
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        return fortunes[randomIndex];
    }

    function showFortune() {
        // 쿠키 이미지와 초기 버튼 숨기기
        cookieImg.classList.add('hidden');
        openCookieBtn.classList.add('hidden');

        // 메시지 표시
        const message = getRandomFortune();
        fortuneMessageElem.textContent = message;
        messageArea.classList.remove('hidden');

        // 다시 하기 버튼 표시
        retryBtn.classList.remove('hidden');
    }

    function resetCookie() {
        messageArea.classList.add('hidden');
        retryBtn.classList.add('hidden');

        cookieImg.classList.remove('hidden');
        openCookieBtn.classList.remove('hidden'); // 초기 버튼 다시 표시
    }

    // 이벤트 리스너
    // 쿠키 이미지 또는 "내용 확인" 버튼 클릭 시
    cookieWrapper.addEventListener('click', () => {
        // 이미 메시지가 표시된 상태에서는 작동하지 않도록 (선택적)
        if (!messageArea.classList.contains('hidden')) return;
        showFortune();
    });
    // openCookieBtn.addEventListener('click', showFortune); // 버튼에만 이벤트를 걸고 싶다면

    retryBtn.addEventListener('click', resetCookie);

    // 초기화
    loadFortunes();
});