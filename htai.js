/**
 * ==============================================================================
 * DỰ ÁN GIỮA KỲ: PORTFOLIO NGUYỄN LÊ HỮU TÀI - CT113
 * THÁCH THỨC TUẦN 8: "THE LOGIC PUZZLE" - REAL-TIME GREETING SYSTEM
 * ==============================================================================
 * Mô tả: Hệ thống thông báo chào mừng thông minh dựa trên thời gian thực
 * Sử dụng: Đối tượng Date và phương thức new Date().getHours()
 * Tính năng cao cấp:
 *   1. Phân loại 5 khung giờ chuẩn mực (Sáng, Trưa, Chiều, Tối, Đêm)
 *   2. Toast HUD kính mờ (Glassmorphism) tự động xuất hiện với hiệu ứng Spring
 *   3. Đồng hồ thời gian thực (Live Digital Clock & Vietnamese Calendar)
 *   4. Bộ mô phỏng các mốc giờ (Time Simulator) dành cho Giảng viên chấm điểm
 *   5. Âm thanh chuông báo tinh tế (Harmonic Chime qua Web Audio API)
 *   6. Thanh tiến trình tự động đóng (Auto-dismiss countdown với Pause on Hover)
 *   7. Nút thu gọn / mở lại linh hoạt (Mini floating badge)
 *   8. Đồng bộ lời chào vào trực tiếp Hero Section của trang web
 * ==============================================================================
 */

'use strict';

class RealtimeGreetingSystem {
    constructor() {
        // Trạng thái hệ thống
        this.simulatedHour = null; // null = dùng thời gian thực tế
        this.isMuted = localStorage.getItem('greeting_sound_muted') === 'true';
        this.autoDismissDuration = 10000; // 10 giây
        this.remainingTime = this.autoDismissDuration;
        this.dismissTimer = null;
        this.progressInterval = null;
        this.isPaused = false;
        this.audioCtx = null;

        // Khởi tạo khi DOM sẵn sàng
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Khởi tạo toàn bộ các thành phần
     */
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.startLiveClock();
        this.updateGreetingUI();
        this.showToastWithAnimation();
        this.printDevToolsConsole();
        this.initScrollProgress();
        this.initActiveNavSpy();
    }

    /**
     * Lưu trữ tham chiếu DOM elements
     */
    cacheDOM() {
        // Toast Elements
        this.toastContainer = document.getElementById('greetingToast');
        this.toastIcon = document.getElementById('toastIcon');
        this.toastGreeting = document.getElementById('toastGreeting');
        this.toastMessage = document.getElementById('toastMessage');
        this.toastPeriod = document.getElementById('toastPeriod');
        this.toastDate = document.getElementById('toastDate');
        this.toastClock = document.getElementById('toastClock');
        this.toastProgressBar = document.getElementById('toastProgressBar');
        this.toastCloseBtn = document.getElementById('toastCloseBtn');
        this.toastSoundBtn = document.getElementById('toastSoundBtn');
        this.toastSimulator = document.getElementById('timeSimulator');
        this.toastReopenBtn = document.getElementById('reopenGreetingBtn');
        this.navLiveBadge = document.getElementById('navLiveBadge');

        // Hero Elements (Đồng bộ vào Hero)
        this.heroGreetingIcon = document.getElementById('heroGreetingIcon');
        this.heroGreetingText = document.getElementById('heroGreetingText');
        this.heroClockText = document.getElementById('heroClockText');
    }

    /**
     * HÀM CỐT LÕI YÊU CẦU TUẦN 8:
     * Sử dụng `new Date().getHours()` để xác định thời gian hiện tại
     * Trả về thông tin chi tiết tương ứng với từng buổi trong ngày
     * 
     * @param {number|null} customHour - Giờ mô phỏng (0-23) hoặc null nếu lấy thời gian thực
     * @returns {Object} Dữ liệu thông điệp chào mừng
     */
    getGreetingData(customHour = null) {
        // Lấy thời gian thực từ đối tượng Date, hoặc sử dụng giờ mô phỏng
        const now = new Date();
        const hour = (customHour !== null && customHour !== undefined) ? customHour : now.getHours();

        /**
         * BẢNG PHÂN CHIA KHUNG GIỜ THỰC TẾ:
         * 1. 05:00 - 10:59: Buổi Sáng (Morning)
         * 2. 11:00 - 13:59: Buổi Trưa (Noon)
         * 3. 14:00 - 17:59: Buổi Chiều (Afternoon)
         * 4. 18:00 - 21:59: Buổi Tối (Evening)
         * 5. 22:00 - 04:59: Đêm Muộn (Late Night)
         */
        if (hour >= 5 && hour < 11) {
            return {
                hour: hour,
                periodId: 'morning',
                periodName: 'Buổi Sáng',
                greeting: 'Chào buổi sáng!',
                subGreeting: 'Good Morning',
                emoji: '🌅',
                iconClass: 'fa-solid fa-sun',
                themeClass: 'theme-morning',
                message: 'Chúc bạn một ngày mới tràn đầy năng lượng, sảng khoái và làm việc thật hiệu quả!',
                advice: 'Khởi đầu ngày mới với một tách cà phê và nụ cười rạng rỡ nhé!',
                accentColor: '#f59e0b'
            };
        } else if (hour >= 11 && hour < 14) {
            return {
                hour: hour,
                periodId: 'noon',
                periodName: 'Buổi Trưa',
                greeting: 'Chào buổi trưa!',
                subGreeting: 'Good Midday',
                emoji: '☀️',
                iconClass: 'fa-solid fa-cloud-sun',
                themeClass: 'theme-noon',
                message: 'Đã đến giờ nghỉ ngơi giữa ngày! Chúc bạn có một bữa trưa ngon miệng và nạp lại năng lượng.',
                advice: 'Dành 15-20 phút chợp mắt để tinh thần luôn minh mẫn cho buổi chiều.',
                accentColor: '#eab308'
            };
        } else if (hour >= 14 && hour < 18) {
            return {
                hour: hour,
                periodId: 'afternoon',
                periodName: 'Buổi Chiều',
                greeting: 'Chào buổi chiều!',
                subGreeting: 'Good Afternoon',
                emoji: '🌤️',
                iconClass: 'fa-solid fa-sun-plant-wilt',
                themeClass: 'theme-afternoon',
                message: 'Chúc bạn một buổi chiều làm việc tập trung cao độ, bứt phá và gặt hái nhiều kết quả tốt đẹp!',
                advice: 'Đừng quên uống đủ nước để duy trì sự tỉnh táo và sáng tạo nhé!',
                accentColor: '#06b6d4'
            };
        } else if (hour >= 18 && hour < 22) {
            return {
                hour: hour,
                periodId: 'evening',
                periodName: 'Buổi Tối',
                greeting: 'Chào buổi tối!',
                subGreeting: 'Good Evening',
                emoji: '🌆',
                iconClass: 'fa-solid fa-cloud-moon',
                themeClass: 'theme-evening',
                message: 'Chúc bạn một buổi tối ấm áp, thư thái và bình yên bên người thân sau ngày dài học tập!',
                advice: 'Hãy gác lại âu lo công việc và dành thời gian thư giãn cho bản thân.',
                accentColor: '#8b5cf6'
            };
        } else {
            return {
                hour: hour,
                periodId: 'night',
                periodName: 'Đêm Muộn',
                greeting: 'Chào đêm muộn!',
                subGreeting: 'Good Late Night',
                emoji: '🌙',
                iconClass: 'fa-solid fa-moon',
                themeClass: 'theme-night',
                message: 'Chào mừng bạn ghé thăm Portfolio của Hữu Tài! Trời đã về khuya, đừng thức quá muộn nhé.',
                advice: 'Hãy giữ gìn sức khỏe và có một giấc ngủ thật ngon lành để nạp lại pin nhé!',
                accentColor: '#3b82f6'
            };
        }
    }

    /**
     * Cập nhật toàn bộ giao diện theo thời gian (Toast + Hero + Navbar)
     */
    updateGreetingUI() {
        const data = this.getGreetingData(this.simulatedHour);

        // 1. Cập nhật nội dung trong Toast Notification
        if (this.toastGreeting) {
            this.toastGreeting.innerHTML = `${data.greeting} <span class="greeting-emoji">${data.emoji}</span>`;
        }
        if (this.toastMessage) {
            this.toastMessage.textContent = data.message;
        }
        if (this.toastPeriod) {
            this.toastPeriod.textContent = data.periodName;
        }
        if (this.toastIcon) {
            this.toastIcon.innerHTML = `<i class="${data.iconClass}"></i>`;
        }

        // Đổi theme màu sắc trên Toast HUD
        if (this.toastContainer) {
            this.toastContainer.classList.remove('theme-morning', 'theme-noon', 'theme-afternoon', 'theme-evening', 'theme-night');
            this.toastContainer.classList.add(data.themeClass);
        }

        // 2. Đồng bộ hiển thị vào Hero Section
        if (this.heroGreetingText) {
            this.heroGreetingText.textContent = data.greeting;
        }
        if (this.heroGreetingIcon) {
            this.heroGreetingIcon.innerHTML = `<i class="${data.iconClass}"></i>`;
        }

        // 3. Đồng bộ hiển thị vào Mini Reopen Button
        if (this.toastReopenBtn) {
            const btnText = this.toastReopenBtn.querySelector('.reopen-text');
            const btnIcon = this.toastReopenBtn.querySelector('.reopen-icon');
            if (btnText) btnText.textContent = `${data.periodName}`;
            if (btnIcon) btnIcon.innerHTML = `<i class="${data.iconClass}"></i>`;
        }

        // Cập nhật trạng thái active trên Simulator pills
        if (this.toastSimulator) {
            const buttons = this.toastSimulator.querySelectorAll('.sim-btn');
            buttons.forEach(btn => {
                const hourVal = btn.getAttribute('data-hour');
                if (this.simulatedHour === null && hourVal === 'auto') {
                    btn.classList.add('active');
                } else if (this.simulatedHour !== null && hourVal === String(this.simulatedHour)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    /**
     * Vòng lặp đồng hồ thời gian thực (Cập nhật mỗi 1000ms)
     */
    startLiveClock() {
        const updateClocks = () => {
            const now = new Date();

            // Format Giờ : Phút : Giây
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            const timeString = `${hh}:${mm}:${ss}`;

            // Format ngày tiếng Việt
            const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const dayName = daysOfWeek[now.getDay()];
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const dateString = `${dayName}, ngày ${day}/${month}/${year}`;

            // Cập nhật DOM
            if (this.toastClock) {
                this.toastClock.innerHTML = `<i class="fa-regular fa-clock"></i> <span>${timeString}</span> <small>GMT+7</small>`;
            }
            if (this.toastDate) {
                this.toastDate.textContent = dateString;
            }
            if (this.heroClockText) {
                this.heroClockText.textContent = timeString;
            }

            // Nếu đang chạy thời gian thực (không mô phỏng), tự động cập nhật greeting khi đổi giờ
            if (this.simulatedHour === null && (now.getMinutes() === 0 && now.getSeconds() === 0)) {
                this.updateGreetingUI();
            }
        };

        updateClocks();
        setInterval(updateClocks, 1000);
    }

    /**
     * Hiển thị Toast với hiệu ứng Spring mượt mà và âm thanh chuông nhẹ
     */
    showToastWithAnimation() {
        if (!this.toastContainer) return;

        // Trì hoãn 400ms sau khi mở trang để tạo trải nghiệm mượt mà
        setTimeout(() => {
            this.toastContainer.classList.add('toast-visible');
            this.playHarmonicChime();
            this.startAutoDismiss();
        }, 400);
    }

    /**
     * Phát âm thanh Harmonic Chime tinh tế bằng Web Audio API
     * (Không cần tải file mp3 bên ngoài, cực nhẹ và hiện đại)
     */
    playHarmonicChime() {
        if (this.isMuted) return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            if (!this.audioCtx) {
                this.audioCtx = new AudioContextClass();
            }

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const ctx = this.audioCtx;
            const now = ctx.currentTime;

            // Nốt 1 (E5 - 659.25 Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, now);
            gain1.gain.setValueAtTime(0.04, now);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.6);

            // Nốt 2 (B5 - 987.77 Hz) tạo hợp âm ngân vang ấm áp
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(987.77, now + 0.12);
            gain2.gain.setValueAtTime(0.03, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.9);
        } catch (e) {
            // Trình duyệt chặn autoplay audio khi chưa có user gesture
            console.warn('Audio note skipped due to browser autoplay policy.');
        }
    }

    /**
     * Quản lý bộ đếm tự động ẩn Toast (Auto-Dismiss)
     */
    startAutoDismiss() {
        this.clearDismissTimers();
        const step = 50; // ms
        const totalSteps = this.autoDismissDuration;

        this.progressInterval = setInterval(() => {
            if (!this.isPaused) {
                this.remainingTime -= step;
                const percentage = Math.max(0, (this.remainingTime / totalSteps) * 100);
                if (this.toastProgressBar) {
                    this.toastProgressBar.style.width = `${percentage}%`;
                }

                if (this.remainingTime <= 0) {
                    this.closeToast();
                }
            }
        }, step);
    }

    clearDismissTimers() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    /**
     * Đóng Toast và chuyển sang nút thu gọn
     */
    closeToast() {
        this.clearDismissTimers();
        if (this.toastContainer) {
            this.toastContainer.classList.remove('toast-visible');
        }
        if (this.toastReopenBtn) {
            this.toastReopenBtn.classList.add('visible');
        }
    }

    /**
     * Mở lại Toast khi bấm vào nút mini
     */
    reopenToast() {
        if (this.toastReopenBtn) {
            this.toastReopenBtn.classList.remove('visible');
        }
        if (this.toastContainer) {
            this.toastContainer.classList.add('toast-visible');
            this.remainingTime = this.autoDismissDuration;
            this.startAutoDismiss();
            this.playHarmonicChime();
        }
    }

    /**
     * Lắng nghe các sự kiện tương tác
     */
    bindEvents() {
        // Nút đóng Toast
        if (this.toastCloseBtn) {
            this.toastCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeToast();
            });
        }

        // Nút mở lại Toast
        if (this.toastReopenBtn) {
            this.toastReopenBtn.addEventListener('click', () => {
                this.reopenToast();
            });
        }

        // Tạm dừng đếm ngược khi rê chuột vào Toast
        if (this.toastContainer) {
            this.toastContainer.addEventListener('mouseenter', () => {
                this.isPaused = true;
            });
            this.toastContainer.addEventListener('mouseleave', () => {
                this.isPaused = false;
            });
        }

        // Bật/tắt âm thanh
        if (this.toastSoundBtn) {
            this.updateSoundBtnUI();
            this.toastSoundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isMuted = !this.isMuted;
                localStorage.setItem('greeting_sound_muted', this.isMuted);
                this.updateSoundBtnUI();
                if (!this.isMuted) {
                    this.playHarmonicChime();
                }
            });
        }

        // Bộ mô phỏng các mốc giờ (Time Simulator cho Giảng viên kiểm tra)
        if (this.toastSimulator) {
            this.toastSimulator.addEventListener('click', (e) => {
                const btn = e.target.closest('.sim-btn');
                if (!btn) return;

                const val = btn.getAttribute('data-hour');
                if (val === 'auto') {
                    this.simulatedHour = null;
                } else {
                    this.simulatedHour = parseInt(val, 10);
                }

                // Cập nhật giao diện tức thì
                this.updateGreetingUI();
                this.playHarmonicChime();

                // Reset tiến trình tự đóng
                this.remainingTime = this.autoDismissDuration;
            });
        }

        // Phím tắt bàn phím: ESC để đóng Toast
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.toastContainer && this.toastContainer.classList.contains('toast-visible')) {
                this.closeToast();
            }
        });
    }

    updateSoundBtnUI() {
        if (!this.toastSoundBtn) return;
        if (this.isMuted) {
            this.toastSoundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            this.toastSoundBtn.setAttribute('title', 'Bật âm thanh chuông');
            this.toastSoundBtn.classList.add('muted');
        } else {
            this.toastSoundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            this.toastSoundBtn.setAttribute('title', 'Tắt âm thanh chuông');
            this.toastSoundBtn.classList.remove('muted');
        }
    }

    /**
     * Thanh cuộn tiến trình trang web (Scroll Progress Bar)
     */
    initScrollProgress() {
        const progressBar = document.getElementById('scrollProgressBar');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }, { passive: true });
    }

    /**
     * Tự động highlight mục menu tương ứng khi cuộn trang
     */
    initActiveNavSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        if (sections.length === 0 || navLinks.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active-nav');
                        } else {
                            link.classList.remove('active-nav');
                        }
                    });
                }
            });
        }, { threshold: 0.35 });

        sections.forEach(sec => observer.observe(sec));
    }

    /**
     * In thông điệp chuyên nghiệp lên DevTools Console
     */
    printDevToolsConsole() {
        const now = new Date();
        const hour = now.getHours();
        const data = this.getGreetingData();

        console.log(
            `%c ✨ PORTFOLIO NGUYỄN LÊ HỮU TÀI - CT113 ✨ %c\n` +
            `%c🎯 THÁCH THỨC TUẦN 8: "THE LOGIC PUZZLE"%c\n` +
            `• Phương thức sử dụng: new Date().getHours() -> Kết quả: ${hour}h\n` +
            `• Phân loại thời gian: ${data.periodName} (${data.greeting})\n` +
            `• Trạng thái hệ thống: Hoạt động trơn tru 100% 🚀`,
            'background: linear-gradient(135deg, #2563eb, #06b6d4); color: #fff; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 6px;',
            '',
            'color: #06b6d4; font-size: 13px; font-weight: bold;',
            ''
        );
    }
}

// Khởi chạy hệ thống chào mừng thông minh
window.greetingApp = new RealtimeGreetingSystem();
