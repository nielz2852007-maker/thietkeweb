/**
 * ==========================================================================
 * PORTFOLIO CÁ NHÂN - LÊ NGUYỄN NHẬT KHÁNH
 * Script: Real-time Greeting, Typewriter, 3D Flip Card, Theme Switcher & UI Interactivity
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initRealTimeGreeting();
    initTypewriter();
    initThemeToggle();
    initFlipCard();
    initScrollSpyAndBackToTop();
    initMobileNav();
});

/* --------------------------------------------------------------------------
   1. PRELOADER LOGIC
   -------------------------------------------------------------------------- */
function initPreloader() {
    const preloader = document.getElementById('page-loader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 600);
    });

    // Fallback nếu tài nguyên tải lâu
    setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
        }
    }, 2000);
}

/* --------------------------------------------------------------------------
   2. REAL-TIME GREETING & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function initRealTimeGreeting() {
    const greetingText = document.getElementById('greetingText');
    const greetingIcon = document.getElementById('greetingIcon');
    const greetingLiveTime = document.getElementById('greetingLiveTime');
    const greetingBanner = document.getElementById('greeting-banner');
    const greetingClose = document.getElementById('greetingClose');

    const greetingToast = document.getElementById('greetingToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    const toastCloseBtn = document.getElementById('toastCloseBtn');

    function updateGreeting() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');

        if (greetingLiveTime) {
            greetingLiveTime.textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
        }

        let greeting = '';
        let icon = '☀️';

        if (hours >= 5 && hours < 11) {
            greeting = 'Chào buổi sáng! 🌅 Chúc bạn một ngày mới tràn ngập năng lượng và may mắn!';
            icon = '🌅';
        } else if (hours >= 11 && hours < 14) {
            greeting = 'Chào buổi trưa! ☀️ Đừng quên ăn trưa và nghỉ ngơi để nạp lại năng lượng nhé!';
            icon = '☀️';
        } else if (hours >= 14 && hours < 18) {
            greeting = 'Chào buổi chiều! ☕ Làm việc và học tập thật hiệu quả nhé!';
            icon = '☕';
        } else if (hours >= 18 && hours < 23) {
            greeting = 'Chào buổi tối! 🌆 Chúc bạn có thời gian thư giãn thật tuyệt vời bên gia đình!';
            icon = '🌆';
        } else {
            greeting = 'Đêm đã khuya rồi! 🌙 Hãy giữ gìn sức khoẻ và đi ngủ sớm nhé!';
            icon = '🌙';
        }

        if (greetingText) greetingText.textContent = greeting;
        if (greetingIcon) greetingIcon.textContent = icon;
        if (toastMessage) toastMessage.textContent = greeting;
        if (toastIcon) toastIcon.textContent = icon;
    }

    // Cập nhật ngay khi tải
    updateGreeting();

    // Cập nhật đồng hồ mỗi phút
    setInterval(updateGreeting, 60000);

    // Xử lý đóng banner lời chào
    if (greetingClose && greetingBanner) {
        greetingClose.addEventListener('click', () => {
            greetingBanner.style.display = 'none';
            const nav = document.querySelector('.main-nav');
            if (nav) nav.style.top = '15px';
        });
    }

    // Kích hoạt Toast thông báo góc phải
    if (greetingToast) {
        setTimeout(() => {
            greetingToast.classList.add('show');

            // Tự động ẩn sau 7 giây
            const autoHide = setTimeout(() => {
                greetingToast.classList.remove('show');
            }, 7000);

            if (toastCloseBtn) {
                toastCloseBtn.addEventListener('click', () => {
                    clearTimeout(autoHide);
                    greetingToast.classList.remove('show');
                });
            }
        }, 1200);
    }
}

/* --------------------------------------------------------------------------
   3. TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
    const textElement = document.getElementById('typingEffect');
    if (!textElement) return;

    const phrases = [
        'Web Developer...',
        'Front-End Enthusiast...',
        'UI/UX Design Lover...',
        'Sinh viên ĐH Lạc Hồng...',
        'Người kiến tạo trải nghiệm web...'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 110;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Tạm dừng khi gõ xong
            typingSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* --------------------------------------------------------------------------
   4. THEME TOGGLE (DARK / LIGHT MODE)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;

    // Đọc theme đã lưu
    const savedTheme = localStorage.getItem('lnnk_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('lnnk_theme', newTheme);
    });
}

/* --------------------------------------------------------------------------
   5. 3D FLIP CARD INTERACTION
   -------------------------------------------------------------------------- */
function initFlipCard() {
    const flipCard = document.getElementById('flipCardElement');
    if (!flipCard) return;

    // Hỗ trợ chạm trên điện thoại hoặc click trên máy tính
    flipCard.addEventListener('click', () => {
        flipCard.classList.toggle('flipped');
    });

    // Hỗ trợ phím Enter/Space khi focus
    flipCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flipCard.classList.toggle('flipped');
        }
    });
}

/* --------------------------------------------------------------------------
   6. SCROLL SPY & BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollSpyAndBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // Xử lý nút Back to Top
        if (backToTopBtn) {
            if (scrollPosition > 350) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Xử lý Scroll Spy active class
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* --------------------------------------------------------------------------
   7. MOBILE NAVIGATION AUTO-CLOSE
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && menuToggle.checked) {
                menuToggle.checked = false;
            }
        });
    });
}

/* --------------------------------------------------------------------------
   8. COPY TO CLIPBOARD UTILITY
   -------------------------------------------------------------------------- */
function copyToClipboard(text, buttonElement) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(buttonElement);
        }).catch(err => {
            fallbackCopyText(text, buttonElement);
        });
    } else {
        fallbackCopyText(text, buttonElement);
    }
}

function fallbackCopyText(text, buttonElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback(buttonElement);
    } catch (err) {
        alert('Không thể sao chép, vui lòng copy thủ công: ' + text);
    }
    document.body.removeChild(textArea);
}

function showCopyFeedback(buttonElement) {
    if (!buttonElement) return;
    const originalHtml = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i> <span style="color:#10b981;">Đã sao chép!</span>';
    setTimeout(() => {
        buttonElement.innerHTML = originalHtml;
    }, 2000);
}

/* --------------------------------------------------------------------------
   9. CERTIFICATE LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function openCertModal(title, imgSrc, desc) {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('modalCertImg');
    const modalTitle = document.getElementById('modalCertTitle');
    const modalDesc = document.getElementById('modalCertDesc');

    if (!modal) return;

    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Đóng modal khi nhấn phím ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});

/* --------------------------------------------------------------------------
   10. CONTACT FORM SUBMISSION HANDLER
   -------------------------------------------------------------------------- */
function handleFormSubmit(event) {
    event.preventDefault();
    const btnSubmit = document.getElementById('btnSubmit');
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');

    if (!form || !btnSubmit) return;

    const originalContent = btnSubmit.innerHTML;
    const senderName = nameInput ? nameInput.value : 'bạn';

    // Hiệu ứng gửi
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Đang gửi tin nhắn...</span>';

    setTimeout(() => {
        btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> <span>Đã gửi thành công!</span>';
        btnSubmit.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        // Hiển thị thông báo Toast thành công
        const toastMessage = document.getElementById('toastMessage');
        const greetingToast = document.getElementById('greetingToast');
        if (toastMessage && greetingToast) {
            toastMessage.textContent = `Cảm ơn ${senderName}! Nhật Khánh đã nhận được tin nhắn và sẽ phản hồi sớm nhất!`;
            greetingToast.classList.add('show');
            setTimeout(() => {
                greetingToast.classList.remove('show');
            }, 6000);
        }

        form.reset();

        setTimeout(() => {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalContent;
            btnSubmit.style.background = '';
        }, 3000);
    }, 1200);
}
