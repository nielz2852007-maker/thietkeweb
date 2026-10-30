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
