// Google Sheets configuration
const SHEET_ID = '1eNbtOWkGkxssPvnwQmcojzM4vz8EbRTG68YGasMd70A';
const API_KEY = 'AIzaSyBsDCggkg91Cw8xr-8ryN-HLFhj_m34oeg';
const SHEET_NAME = 'notices';

let notices = [];

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
                content: row[3] || ''
            })).filter(notice => notice.title); // Filter out empty rows

            renderNoticeList();
            updateNoticeBadge();
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

// Open alert detail directly from banner
function openAlertDetail() {
    openNoticePanel();
    setTimeout(() => {
        if (notices.length > 0) {
            showNoticeDetail(0);
        }
    }, 100);
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

// Close alert banner
function closeAlert(event) {
    if (event) {
        event.stopPropagation();
    }
    const banner = document.getElementById('alertBanner');
    banner.style.animation = 'slideDown 0.3s ease-out reverse';
    setTimeout(() => {
        banner.classList.add('hidden');
    }, 300);

    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `alertClosed=true; expires=${expiryDate.toUTCString()}; path=/`;
}

// Check cookie on load
window.addEventListener('load', () => {
    if (document.cookie.includes('alertClosed=true')) {
        document.getElementById('alertBanner').classList.add('hidden');
    }

    // Load notices from Google Sheets
    loadNoticesFromGoogleSheets();
});

// Close panel on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeNoticePanel();
    }
});
