// Version
const APP_VERSION = '1.1.0';
console.log(`APEC Notice Board v${APP_VERSION}`);

// Google Sheets configuration
const SHEET_ID = '1eNbtOWkGkxssPvnwQmcojzM4vz8EbRTG68YGasMd70A';
const API_KEY = 'AIzaSyBsDCggkg91Cw8xr-8ryN-HLFhj_m34oeg';
const SHEET_NAME = 'notices';

let notices = [];
let modalNotices = []; // 모든 모달 공지
let bannerNotices = []; // 모든 배너 공지
let currentModalIndex = 0; // 현재 모달 인덱스
let currentBannerIndex = 0; // 현재 배너 인덱스

// LocalStorage keys
const READ_NOTICES_KEY = 'readNotices';

// Get read notices from localStorage
function getReadNotices() {
    const stored = localStorage.getItem(READ_NOTICES_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Mark notice as read
function markAsRead(noticeId) {
    const readNotices = getReadNotices();
    const noticeKey = `${notices[noticeId].title}_${notices[noticeId].date}`;

    if (!readNotices.includes(noticeKey)) {
        readNotices.push(noticeKey);
        localStorage.setItem(READ_NOTICES_KEY, JSON.stringify(readNotices));
        updateNoticeBadge();
    }
}

// Check if notice is read
function isNoticeRead(notice) {
    const readNotices = getReadNotices();
    const noticeKey = `${notice.title}_${notice.date}`;
    return readNotices.includes(noticeKey);
}

// Get unread count
function getUnreadCount() {
    return notices.filter(notice => !isNoticeRead(notice)).length;
}

// Fetch notices from Google Sheets
async function loadNoticesFromGoogleSheets() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 1) {
            // Skip header row and parse data
            notices = data.values.slice(1).map((row, index) => ({
                id: index,
                title: row[0] || '',
                date: row[1] || '',
                category: row[2] || 'NOTICE',
                tag: (row[2] || 'general').toLowerCase(),
                type: (row[3] || 'list').toLowerCase(), // 새로운 필드: modal, banner, list
                content: row[4] || row[3] || '' // type이 있으면 row[4], 없으면 row[3] (하위 호환)
            })).filter(notice => notice.title); // Filter out empty rows

            renderNoticeList();
            updateNoticeBadge();
            handleSpecialNotices(); // 모달/배너 처리
        } else {
            showErrorMessage('No notices found');
        }
    } catch (error) {
        console.error('Error loading notices:', error);
        showErrorMessage('Failed to load notices. Please check configuration.');
    }
}

// Render notice list
function renderNoticeList() {
    const listView = document.getElementById('noticeListView');

    if (notices.length === 0) {
        listView.innerHTML = '<div class="loading">No notices available</div>';
        return;
    }

    listView.innerHTML = notices.map(notice => {
        const tagClass = notice.tag === 'urgent' ? '' : notice.tag === 'info' ? 'info' : 'general';
        return `
            <div class="notice-item" onclick="showNoticeDetail(${notice.id})">
                <div class="notice-item-header">
                    <span class="notice-tag ${tagClass}">${notice.category}</span>
                    <div class="notice-item-title">${notice.title}</div>
                </div>
                <div class="notice-item-meta">${notice.date}</div>
            </div>
        `;
    }).join('');
}

// Show error message
function showErrorMessage(message) {
    document.getElementById('noticeListView').innerHTML = `
        <div class="loading" style="color: #d32f2f;">${message}</div>
    `;
}

// Update notice badge
function updateNoticeBadge() {
    const badge = document.getElementById('noticeBadge');
    const unreadCount = getUnreadCount();
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

// Panel controls
function openNoticePanel() {
    document.getElementById('panelOverlay').classList.add('active');
    document.getElementById('sidePanel').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNoticePanel() {
    document.getElementById('panelOverlay').classList.remove('active');
    document.getElementById('sidePanel').classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
        backToList();
    }, 300);
}


// Show notice detail
function showNoticeDetail(noticeId) {
    const notice = notices[noticeId];

    if (!notice) return;

    // Mark as read
    markAsRead(noticeId);

    document.getElementById('detailTitle').textContent = notice.title;
    document.getElementById('detailDate').textContent = notice.date;
    document.getElementById('detailCategory').textContent = notice.category;
    document.getElementById('detailBody').innerHTML = notice.content;

    document.getElementById('noticeListView').style.display = 'none';
    document.getElementById('noticeDetailView').classList.add('active');
}

// Back to list
function backToList() {
    document.getElementById('noticeListView').style.display = 'block';
    document.getElementById('noticeDetailView').classList.remove('active');
}

// Alert Modal controls
function showAlertModal() {
    document.getElementById('alertModalOverlay').classList.add('active');
    document.getElementById('alertModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAlertModal() {
    document.getElementById('alertModalOverlay').classList.remove('active');
    document.getElementById('alertModal').classList.remove('active');
    document.body.style.overflow = '';
}

function viewFullDetails() {
    closeAlertModal();
    openNoticePanel();
    setTimeout(() => {
        if (notices.length > 0) {
            showNoticeDetail(0);
        }
    }, 100);
}

function handleDontShowAgain(checkbox) {
    if (checkbox.checked && modalNotices.length > 0) {
        const notice = modalNotices[currentModalIndex];
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000));
        const cookieName = `alertModal_${notice.id}_closed`;
        document.cookie = `${cookieName}=true; expires=${expiryDate.toUTCString()}; path=/`;
    }
}

// Handle special notices (modal, banner)
function handleSpecialNotices() {
    console.log('📋 Total notices:', notices.length);
    console.log('📋 All notices:', notices);

    // 1. 모든 모달 타입 공지 수집
    modalNotices = notices.filter(n => n.type === 'modal');
    console.log('🔔 Modal notices found:', modalNotices.length, modalNotices);

    if (modalNotices.length > 0) {
        // 쿠키 확인해서 안 본 모달만 필터링
        const unviewedModals = modalNotices.filter(notice => {
            const cookieName = `alertModal_${notice.id}_closed`;
            const isClosed = document.cookie.includes(`${cookieName}=true`);
            console.log(`  - Notice #${notice.id} (${notice.title}): ${isClosed ? '이미 닫음' : '표시 대상'}`);
            return !isClosed;
        });

        console.log('✅ Unviewed modals:', unviewedModals.length);

        if (unviewedModals.length > 0) {
            modalNotices = unviewedModals;
            currentModalIndex = 0;
            console.log('🚀 Showing modal carousel...');
            showModalCarousel();
        } else {
            console.log('⏭️ All modals already viewed');
        }
    } else {
        console.log('❌ No modal type notices found');
    }

    // 2. 모든 배너 타입 공지 수집
    bannerNotices = notices.filter(n => n.type === 'banner');
    if (bannerNotices.length > 0) {
        // 쿠키 확인해서 안 본 배너만 필터링
        const unviewedBanners = bannerNotices.filter(notice => {
            const cookieName = `alertBanner_${notice.id}_closed`;
            return !document.cookie.includes(`${cookieName}=true`);
        });

        if (unviewedBanners.length > 0) {
            bannerNotices = unviewedBanners;
            currentBannerIndex = 0;
            showBannerCarousel();
        }
    }
}

// Show modal carousel
function showModalCarousel() {
    const notice = modalNotices[currentModalIndex];

    // 모달 내용 업데이트
    document.getElementById('alertModal').querySelector('.alert-modal-title').textContent = notice.title;
    document.getElementById('alertModal').querySelector('.alert-modal-subtitle').textContent = notice.date;
    document.getElementById('alertModal').querySelector('.alert-modal-body').innerHTML = notice.content;

    // 페이지 인디케이터 업데이트
    updateModalIndicator();

    // 모달 표시
    setTimeout(() => {
        showAlertModal();
    }, 500);
}

// Update modal page indicator
function updateModalIndicator() {
    const indicator = document.getElementById('modalIndicator');
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');

    indicator.textContent = `${currentModalIndex + 1} / ${modalNotices.length}`;

    // 버튼 표시/숨김
    if (modalNotices.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        indicator.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        indicator.style.display = 'block';

        // 첫/마지막 페이지 버튼 비활성화
        prevBtn.disabled = currentModalIndex === 0;
        nextBtn.disabled = currentModalIndex === modalNotices.length - 1;
        prevBtn.style.opacity = currentModalIndex === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentModalIndex === modalNotices.length - 1 ? '0.3' : '1';
    }
}

// Navigate modal carousel
function navigateModal(direction) {
    const newIndex = currentModalIndex + direction;
    if (newIndex >= 0 && newIndex < modalNotices.length) {
        const wrapper = document.getElementById('modalContentWrapper');

        // 슬라이드 아웃 애니메이션
        wrapper.classList.add(direction > 0 ? 'slide-left' : 'slide-right');

        setTimeout(() => {
            currentModalIndex = newIndex;
            const notice = modalNotices[currentModalIndex];

            // 콘텐츠 업데이트
            document.getElementById('alertModal').querySelector('.alert-modal-title').textContent = notice.title;
            document.getElementById('alertModal').querySelector('.alert-modal-subtitle').textContent = notice.date;
            document.getElementById('alertModal').querySelector('.alert-modal-body').innerHTML = notice.content;

            // 페이지 인디케이터 업데이트
            updateModalIndicator();

            // 반대 방향에서 슬라이드 인
            wrapper.classList.remove('slide-left', 'slide-right');
            wrapper.classList.add(direction > 0 ? 'slide-right' : 'slide-left');

            // 다음 프레임에서 원위치로
            requestAnimationFrame(() => {
                wrapper.classList.remove('slide-left', 'slide-right');
            });
        }, 150);
    }
}

// Close current modal and show next
function closeCurrentModal() {
    const notice = modalNotices[currentModalIndex];
    const cookieName = `alertModal_${notice.id}_closed`;
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `${cookieName}=true; expires=${expiryDate.toUTCString()}; path=/`;

    closeAlertModal();
}

// Show banner carousel
function showBannerCarousel() {
    const notice = bannerNotices[currentBannerIndex];

    // 배너가 없으면 생성
    let banner = document.getElementById('dynamicBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'dynamicBanner';
        banner.className = 'dynamic-banner';
        document.body.insertBefore(banner, document.body.firstChild);

        // Add swipe listeners to banner
        banner.addEventListener('touchstart', (e) => {
            bannerTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        banner.addEventListener('touchend', (e) => {
            bannerTouchEndX = e.changedTouches[0].screenX;
            handleBannerSwipe();
        }, { passive: true });
    }

    // 배너 내용
    banner.innerHTML = `
        <div class="dynamic-banner-content" onclick="openBannerDetail(${notice.id})" style="cursor: pointer;">
            <span class="dynamic-banner-icon">${notice.tag === 'urgent' ? '⚠️' : 'ℹ️'}</span>
            <span class="dynamic-banner-text">${notice.title}</span>
            <span class="banner-indicator" ${bannerNotices.length <= 1 ? 'style="display:none"' : ''}>${currentBannerIndex + 1}/${bannerNotices.length}</span>
        </div>
        <div class="banner-controls">
            <div class="banner-nav-group" ${bannerNotices.length <= 1 ? 'style="display:none"' : ''}>
                <button class="banner-nav-btn banner-prev" onclick="navigateBanner(-1)">
                    ‹
                </button>
                <button class="banner-nav-btn banner-next" onclick="navigateBanner(1)">
                    ›
                </button>
            </div>
            <button class="dynamic-banner-close" onclick="closeBanner(event)" aria-label="Close">&times;</button>
        </div>
    `;
    banner.classList.add('active');

    // 첫/마지막 버튼 비활성화
    updateBannerButtons();
}

// Update banner navigation buttons
function updateBannerButtons() {
    const prevBtn = document.querySelector('.banner-prev');
    const nextBtn = document.querySelector('.banner-next');

    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentBannerIndex === 0;
        nextBtn.disabled = currentBannerIndex === bannerNotices.length - 1;
        prevBtn.style.opacity = currentBannerIndex === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentBannerIndex === bannerNotices.length - 1 ? '0.3' : '1';
    }
}

// Navigate banner carousel
function navigateBanner(direction) {
    const newIndex = currentBannerIndex + direction;
    if (newIndex >= 0 && newIndex < bannerNotices.length) {
        const banner = document.getElementById('dynamicBanner');

        // 슬라이드 애니메이션
        banner.style.transition = 'transform 0.3s ease, opacity 0.2s';
        banner.style.transform = `translateX(${direction > 0 ? '-20px' : '20px'})`;
        banner.style.opacity = '0.5';

        setTimeout(() => {
            currentBannerIndex = newIndex;
            showBannerCarousel();

            banner.style.transform = `translateX(${direction > 0 ? '20px' : '-20px'})`;

            requestAnimationFrame(() => {
                banner.style.transform = 'translateX(0)';
                banner.style.opacity = '1';
            });
        }, 150);
    }
}

// Open banner detail in notice panel
function openBannerDetail(noticeId) {
    openNoticePanel();
    setTimeout(() => {
        showNoticeDetail(noticeId);
    }, 100);
}

// Close dynamic banner
function closeBanner(event) {
    if (event) {
        event.stopPropagation();
    }

    const notice = bannerNotices[currentBannerIndex];
    const cookieName = `alertBanner_${notice.id}_closed`;
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `${cookieName}=true; expires=${expiryDate.toUTCString()}; path=/`;

    const banner = document.getElementById('dynamicBanner');
    banner.classList.remove('active');
}

// Touch swipe support for modal
let modalTouchStartX = 0;
let modalTouchEndX = 0;

function handleModalSwipe() {
    const swipeThreshold = 50;
    const diff = modalTouchStartX - modalTouchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next
            navigateModal(1);
        } else {
            // Swipe right - previous
            navigateModal(-1);
        }
    }
}

// Touch swipe support for banner
let bannerTouchStartX = 0;
let bannerTouchEndX = 0;

function handleBannerSwipe() {
    const swipeThreshold = 50;
    const diff = bannerTouchStartX - bannerTouchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next
            navigateBanner(1);
        } else {
            // Swipe right - previous
            navigateBanner(-1);
        }
    }
}

// Check cookie and show modal on load
window.addEventListener('load', () => {
    // Load notices from Google Sheets
    loadNoticesFromGoogleSheets();

    // Add swipe listeners to modal
    const modal = document.getElementById('alertModal');
    modal.addEventListener('touchstart', (e) => {
        modalTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        modalTouchEndX = e.changedTouches[0].screenX;
        handleModalSwipe();
    }, { passive: true });
});

// Close panel on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeNoticePanel();
    }
});
