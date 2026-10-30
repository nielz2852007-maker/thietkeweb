// 1. Lấy giờ hiện tại từ hệ thống thiết bị (từ 0 đến 23)
const currentHour = new Date().getHours();
let greetingMessage = "";

// 2. Phân loại nội dung thông báo ngắn gọn theo 3 khung giờ
if (currentHour >= 0 && currentHour <= 11) {
    // Sáng: 0h - 11h59
    greetingMessage = "Chào buổi sáng! ☀️ Chúc bạn ngày mới tốt lành!";
} else if (currentHour >= 12 && currentHour <= 17) {
    // Chiều: 12h - 17h59
    greetingMessage = "Chào buổi chiều! ☕ Làm việc hiệu quả nhé!";
} else {
    // Tối: 18h - 23h59
    greetingMessage = "Chào buổi tối! 🌙 Chúc bạn buổi tối thư giãn!";
}

// 3. Hiển thị thông báo Toast ở góc dưới bên phải khi vừa vào trang web
window.onload = function () {
    const toast = document.getElementById("greetingToast");
    const toastMessage = document.getElementById("toastMessage");
    const toastCloseBtn = document.getElementById("toastCloseBtn");
    const greetingText = document.getElementById("greetingText");

    // Gán nội dung lời chào vào phần tử giao diện
    if (toastMessage) {
        toastMessage.innerText = greetingMessage;
    }
    if (greetingText) {
        greetingText.innerText = greetingMessage;
    }

    // Tự động kích hoạt hiệu ứng trượt vào góc dưới bên phải
    if (toast) {
        setTimeout(function () {
            toast.classList.add("show");
        }, 500);

        // Nút đóng thông báo khi người dùng nhấn [X]
        if (toastCloseBtn) {
            toastCloseBtn.onclick = function () {
                toast.classList.remove("show");
            };
        }

        // Tự động ẩn thông báo sau 5 giây
        setTimeout(function () {
            toast.classList.remove("show");
        }, 5500);
    }
};

// 4. Xử lý bật / tắt Hamburger Menu trên điện thoại di động
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.onclick = function () {
        navLinks.classList.toggle("active");
        menuBtn.classList.toggle("open");
    };
}

// 5. HIỂN THỊ DANH SÁCH DỰ ÁN BẰNG VÒNG LẶP (KHÔNG VIẾT HTML TỪNG THẺ)

// 5.1. Dữ liệu mẫu: mỗi phần tử là 1 dự án (object)
const projectList = [
    {
        title: "Smart Color Palette App",
        time: "Tháng 2 / 2026",
        description: "Ứng dụng web giúp quản lý mã màu và tùy biến biến CSS trực tiếp trên trình duyệt.",
        buttonText: "Xem Source Code",
        actionText: "Liên hệ",
        link: "#"
    },
    {
        title: "E-commerce Landing Page",
        time: "Tháng 1 / 2026",
        description: "Trang thương mại điện tử tương thích đa thiết bị sử dụng CSS Grid và Flexbox.",
        buttonText: "Xem Trang Trực Tuyến",
        actionText: "Mua hàng",
        link: "#"
    },
    {
        title: "Task Manager App",
        time: "Tháng 12 / 2025",
        description: "Ứng dụng quản lý công việc với thêm, xóa, đánh dấu hoàn thành bằng JavaScript thuần.",
        buttonText: "Xem Source Code",
        actionText: "Liên hệ",
        link: "#"
    }
];

// 5.2. Hàm nhận vào: (items) = mảng dữ liệu, (containerId) = id của thẻ chứa
function renderProjects(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;           // Không tìm thấy thẻ chứa thì dừng

    container.innerHTML = "";         // Xóa nội dung cũ để tránh bị lặp thẻ

    if (items.length === 0) {
        container.innerHTML = "<p>Chưa có dự án nào.</p>";
        return;
    }

    // Vòng lặp: mỗi dự án trong mảng sinh ra 1 thẻ <article>
    for (const item of items) {
        const card = document.createElement("article");
        card.className = "project-card";
        card.innerHTML = `
            <div class="item-title"><h3>${item.title}</h3></div>
            <div class="item-time">${item.time}</div>
            <p>${item.description}</p>
            <a href="${item.link}" class="btn" style="display:inline-block; margin-top:10px; padding:8px 15px; background:var(--primary-color); color:#fff; border-radius:4px;">${item.buttonText}</a>
            <button type="button" class="btn-open-modal" data-project="${item.title}" data-action="${item.actionText}">${item.actionText}</button>
        `;
        container.appendChild(card);  // Gắn thẻ vừa tạo vào trang
    }
}

// 5.3. Gọi hàm: truyền dữ liệu mẫu và id vùng hiển thị
renderProjects(projectList, "projectsGrid");

// 6. MODAL (HỘP THOẠI) ĐĂNG KÝ - MỞ / ĐÓNG BẰNG JS, KHÔNG TẢI LẠI TRANG

// 6.1. Lấy các phần tử cần dùng trong DOM
const modalOverlay = document.getElementById("modalOverlay");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const registerForm = document.getElementById("registerForm");
const modalError = document.getElementById("modalError");
const modalSuccess = document.getElementById("modalSuccess");
const modalSuccessText = document.getElementById("modalSuccessText");
const projectsGrid = document.getElementById("projectsGrid");

let lastTriggerButton = null;   // Nút đã bấm để mở modal (trả focus về khi đóng)
let autoCloseTimer = null;      // Bộ đếm tự đóng sau khi gửi thành công

// 6.2. Hàm MỞ modal
function openModal(projectName, actionName, triggerButton) {
    lastTriggerButton = triggerButton || null;

    modalTitle.textContent = actionName + " - Đăng ký thông tin";
    modalSubtitle.textContent = "Dự án: " + projectName;

    // Đưa modal về trạng thái ban đầu: hiện form, ẩn thông báo thành công
    registerForm.hidden = false;
    modalSuccess.hidden = true;
    modalError.textContent = "";

    modalOverlay.classList.add("show");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");   // Khóa cuộn trang phía sau

    document.getElementById("regName").focus();  // Đặt con trỏ vào ô đầu tiên
}

// 6.3. Hàm ĐÓNG modal
function closeModal() {
    clearTimeout(autoCloseTimer);
    modalOverlay.classList.remove("show");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    registerForm.reset();

    const inputs = registerForm.querySelectorAll("input");
    inputs.forEach(function (input) { input.classList.remove("invalid"); });

    if (lastTriggerButton) lastTriggerButton.focus();   // Trả focus về nút ban đầu
}

// 6.4. SỰ KIỆN: click vào nút "Mua hàng" / "Liên hệ" trong danh sách dự án
// (Event Delegation: gắn 1 listener lên khung chứa, vì các nút được JS sinh ra sau)
if (projectsGrid) {
    projectsGrid.addEventListener("click", function (event) {
        const btn = event.target.closest(".btn-open-modal");
        if (!btn) return;                                // Click chỗ khác thì bỏ qua
        openModal(btn.dataset.project, btn.dataset.action, btn);
    });
}

// 6.5. SỰ KIỆN: click nút [X] để đóng
if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
}

// 6.6. SỰ KIỆN: click vào vùng nền tối bên ngoài hộp thoại để đóng
if (modalOverlay) {
    modalOverlay.addEventListener("click", function (event) {
        if (event.target === modalOverlay) closeModal();  // Chỉ đóng khi click đúng nền
    });
}

// 6.7. SỰ KIỆN: nhấn phím Escape để đóng
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modalOverlay.classList.contains("show")) {
        closeModal();
    }
});

// 6.8. SỰ KIỆN: submit form - chặn tải lại trang, kiểm tra dữ liệu
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();                          // KHÔNG cho trang tải lại

        const nameInput = document.getElementById("regName");
        const emailInput = document.getElementById("regEmail");
        const phoneInput = document.getElementById("regPhone");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const phoneOk = /^[0-9]{9,11}$/.test(phone);

        [nameInput, emailInput, phoneInput].forEach(function (i) { i.classList.remove("invalid"); });

        if (name === "") {
            modalError.textContent = "Vui lòng nhập họ và tên.";
            nameInput.classList.add("invalid");
            nameInput.focus();
            return;
        }
        if (!emailOk) {
            modalError.textContent = "Email chưa đúng định dạng.";
            emailInput.classList.add("invalid");
            emailInput.focus();
            return;
        }
        if (!phoneOk) {
            modalError.textContent = "Số điện thoại gồm 9 - 11 chữ số.";
            phoneInput.classList.add("invalid");
            phoneInput.focus();
            return;
        }

        // Hợp lệ: ẩn form, hiện thông báo thành công, tự đóng sau 2 giây
        modalError.textContent = "";
        registerForm.hidden = true;
        modalSuccess.hidden = false;
        modalSuccessText.textContent = "Cảm ơn " + name + "! Chúng tôi sẽ liên hệ với bạn sớm.";
        autoCloseTimer = setTimeout(closeModal, 2000);
    });

    // 6.9. SỰ KIỆN: input - người dùng gõ lại thì xóa thông báo lỗi
    registerForm.addEventListener("input", function (event) {
        modalError.textContent = "";
        event.target.classList.remove("invalid");
    });
}
