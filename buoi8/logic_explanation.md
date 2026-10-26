# Tài Liệu Giải Thích Logic Tính Năng Thông Báo Chào Mừng Góc Phải Màn Hình (Bottom-Right Toast Notification)

> **Dự án**: Portfolio Cá Nhân - Tô Vũ Hoàng Anh  
> **Ngôn ngữ**: JavaScript, HTML5, CSS3  
> **Yêu cầu**: Giải thích cơ chế `new Date().getHours()` kết hợp với DOM và CSS để hiển thị thông báo popup dạng toast tự động trượt vào góc dưới bên phải màn hình khi vào web.

---

## 1. Toàn bộ mã nguồn `script.js`

Đoạn mã được viết ngắn gọn, dễ hiểu, sử dụng các hàm cơ bản của JavaScript:

```javascript
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
```

---

## 2. Giải thích chi tiết cách thức hoạt động

### 2.1. Lấy giờ hệ thống bằng `new Date().getHours()`
- **`new Date()`**: Khởi tạo một đối tượng ngày/giờ của JavaScript, lấy thời điểm hiện tại từ đồng hồ của thiết bị khách truy cập.
- **`.getHours()`**: Trả về một **số nguyên từ `0` đến `23`**:
  - `0`: Đúng 00:00 (12:00 AM - Nửa đêm).
  - `11`: 11:00 AM - 11:59 AM (Trưa sáng).
  - `12`: 12:00 PM (12:00 trưa).
  - `17`: 17:00 PM (5:59 PM - Chiều muộn).
  - `18`: 18:00 PM (6:00 PM - Đầu buổi tối).
  - `23`: 23:00 PM (11:59 PM - Đêm muộn).

---

### 2.2. Phân loại 3 khung giờ bằng câu lệnh điều kiện `if / else if / else`

Hệ thống phân chia 24 giờ trong ngày thành 3 mốc ngắn gọn:

| Khung giờ | Điều kiện `currentHour` | Nội dung thông báo hiển thị |
| :---: | :---: | :--- |
| **Buổi sáng** | `0h` – `11h59` (`currentHour >= 0 && currentHour <= 11`) | *"Chào buổi sáng! ☀️ Chúc bạn ngày mới tốt lành!"* |
| **Buổi chiều** | `12h` – `17h59` (`currentHour >= 12 && currentHour <= 17`) | *"Chào buổi chiều! ☕ Làm việc hiệu quả nhé!"* |
| **Buổi tối** | `18h` – `23h59` (`else`) | *"Chào buổi tối! 🌙 Chúc bạn buổi tối thư giãn!"* |

---

### 2.3. Cơ chế kết hợp JavaScript với DOM để hiển thị thông báo góc phải màn hình

Quy trình hiển thị thông báo popup góc dưới phải được thực hiện từng bước thông qua DOM (Document Object Model):

1. **Sự kiện tải trang `window.onload`**:
   - Được kích hoạt tự động ngay sau khi trang web tải xong toàn bộ cấu trúc HTML và hình ảnh.

2. **Truy xuất phần tử qua `document.getElementById(...)`**:
   - `toast`: Lấy khung thông báo `<div id="greetingToast">`.
   - `toastMessage`: Lấy thẻ chứa chữ `<span id="toastMessage">`.
   - `toastCloseBtn`: Lấy nút đóng `<button id="toastCloseBtn">`.

3. **Cập nhật nội dung văn bản qua `.innerText`**:
   ```javascript
   toastMessage.innerText = greetingMessage;
   ```
   Gán chuỗi thông báo chào mừng tương ứng với giờ thực tế vào thẻ hiển thị.

4. **Hiệu ứng trượt vào mượt mà bằng `setTimeout` và `.classList.add("show")`**:
   - Mặc định trong CSS, hộp thoại Toast được ghim cố định ở góc dưới phải (`position: fixed; bottom: 105px; right: 30px;`) nhưng bị đẩy ra ngoài mép màn hình nhờ thuộc tính `transform: translateX(125%); opacity: 0;`.
   - Sau khi vào trang khoảng `500ms`, JavaScript gọi `toast.classList.add("show")`.
   - Class `.show` thiết lập `transform: translateX(0); opacity: 1;`. Kết hợp với thuộc tính `transition: transform 0.4s ease, opacity 0.35s ease`, hộp thoại sẽ trượt nhẹ nhàng từ cạnh phải vào màn hình.

5. **Nút đóng thông báo chủ động**:
   ```javascript
   toastCloseBtn.onclick = function () {
       toast.classList.remove("show");
   };
   ```
   Khi người dùng nhấn vào nút **✕**, class `.show` được gỡ bỏ, thông báo lập tức trượt trở lại ra ngoài màn hình.

6. **Tự động ẩn đi sau 5 giây**:
   ```javascript
   setTimeout(function () {
       toast.classList.remove("show");
   }, 5500);
   ```
   Nếu người dùng không bấm đóng, sau 5.5 giây thông báo sẽ tự động biến mất để không làm che khuất nội dung trang web.

---

## 3. Cấu trúc CSS ghim góc dưới phải (Bottom-Right)

Trong file `style.css`:
```css
/* Ghim cố định ở góc dưới bên phải màn hình */
.greeting-toast {
    position: fixed;
    bottom: 105px;             /* Nằm ngay phía trên nút Liên hệ (FAB) */
    right: 30px;
    z-index: 99998;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: rgba(30, 41, 59, 0.96);
    color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    border-left: 4px solid var(--primary-color);
    
    /* Trạng thái ẩn: Nằm lệch sang phải 125% */
    transform: translateX(125%);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

/* Trạng thái hiển thị khi có class .show */
.greeting-toast.show {
    transform: translateX(0);
    opacity: 1;
}
```

---

## 4. Hướng dẫn thử nghiệm trên trình duyệt (F12)

Bạn có thể mở trang Portfolio trên trình duyệt, nhấn phím **F12**, chuyển sang tab **Console** và dán đoạn mã sau để kiểm tra hiệu ứng thông báo của từng buổi:

```javascript
// Thử nghiệm thông báo buổi sáng (8h)
currentHour = 8;
document.getElementById("toastMessage").innerText = "Chào buổi sáng! ☀️ Chúc bạn ngày mới tốt lành!";
document.getElementById("greetingToast").classList.add("show");
```

```javascript
// Thử nghiệm thông báo buổi chiều (14h)
currentHour = 14;
document.getElementById("toastMessage").innerText = "Chào buổi chiều! ☕ Làm việc hiệu quả nhé!";
document.getElementById("greetingToast").classList.add("show");
```

```javascript
// Thử nghiệm thông báo buổi tối (20h)
currentHour = 20;
document.getElementById("toastMessage").innerText = "Chào buổi tối! 🌙 Chúc bạn buổi tối thư giãn!";
document.getElementById("greetingToast").classList.add("show");
```
