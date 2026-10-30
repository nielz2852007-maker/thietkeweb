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
        link: "#"
    },
    {
        title: "E-commerce Landing Page",
        time: "Tháng 1 / 2026",
        description: "Trang thương mại điện tử tương thích đa thiết bị sử dụng CSS Grid và Flexbox.",
        buttonText: "Xem Trang Trực Tuyến",
        link: "#"
    },
    {
        title: "Task Manager App",
        time: "Tháng 12 / 2025",
        description: "Ứng dụng quản lý công việc với thêm, xóa, đánh dấu hoàn thành bằng JavaScript thuần.",
        buttonText: "Xem Source Code",
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
        `;
        container.appendChild(card);  // Gắn thẻ vừa tạo vào trang
    }
}

// 5.3. Gọi hàm: truyền dữ liệu mẫu và id vùng hiển thị
renderProjects(projectList, "projectsGrid");
