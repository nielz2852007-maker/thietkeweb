# dom_interaction.md – Các sự kiện (event) đã sử dụng

## 1. Mục tiêu
Trong mục **Dự án tiêu biểu**, mỗi thẻ dự án có nút **"Mua hàng" / "Liên hệ"**. Khi bấm vào, một **Modal (hộp thoại)** chứa form đăng ký hiện lên ngay trên trang, **không tải lại trang**. Modal được mở / đóng hoàn toàn bằng JavaScript (thêm / bỏ class `show`).

## 2. Cấu trúc
- **HTML (`index.html`)**: `div#modalOverlay` (nền tối) chứa `div.modal-box` (hộp thoại) gồm nút đóng, form đăng ký (họ tên, email, số điện thoại) và khối thông báo thành công.
- **CSS (`style.css`)**: modal mặc định ẩn (`opacity: 0; visibility: hidden`). Khi có class `.show` thì hiện ra kèm hiệu ứng mờ dần và trượt lên.
- **JS (`script.js`, phần 6)**: hai hàm `openModal()` và `closeModal()` cùng các sự kiện bên dưới.

## 3. Các sự kiện (event) đã sử dụng

| # | Sự kiện | Gắn vào | Tác dụng |
|---|---|---|---|
| 1 | `click` | `#projectsGrid` (event delegation) | Bấm nút "Mua hàng" / "Liên hệ" → gọi `openModal()` |
| 2 | `click` | `#modalCloseBtn` (nút ×) | Đóng modal |
| 3 | `click` | `#modalOverlay` (nền tối) | Bấm ra ngoài hộp thoại → đóng modal |
| 4 | `keydown` | `document` | Nhấn phím **Escape** → đóng modal |
| 5 | `submit` | `#registerForm` | Chặn tải lại trang, kiểm tra dữ liệu, hiện thông báo thành công |
| 6 | `input` | `#registerForm` | Người dùng gõ lại → xóa thông báo lỗi và viền đỏ |

### Giải thích chi tiết

**1. `click` + Event Delegation (nút mở modal)**
Các nút được JS sinh ra sau khi trang tải (từ hàm `renderProjects`), nên không thể gắn sự kiện trực tiếp lúc đầu. Mình gắn **một** listener lên khung chứa `#projectsGrid`, rồi dùng `event.target.closest(".btn-open-modal")` để biết người dùng có bấm đúng nút hay không. Thông tin dự án lấy từ thuộc tính `data-project` và `data-action` qua `btn.dataset`.

```js
projectsGrid.addEventListener("click", function (event) {
    const btn = event.target.closest(".btn-open-modal");
    if (!btn) return;
    openModal(btn.dataset.project, btn.dataset.action, btn);
});
```

**2. `click` (nút ×)**: gọi thẳng `closeModal()`.

**3. `click` (nền tối)**: kiểm tra `event.target === modalOverlay` để chỉ đóng khi bấm đúng vào nền, còn bấm bên trong hộp thoại thì không đóng.

**4. `keydown` (phím Escape)**: gắn lên `document`, kiểm tra `event.key === "Escape"` và modal đang mở rồi mới đóng.

**5. `submit` (gửi form)**: `event.preventDefault()` ngăn trình duyệt tải lại trang. Sau đó kiểm tra: họ tên không rỗng, email đúng định dạng (regex), số điện thoại 9–11 chữ số. Nếu sai thì hiện lỗi trong `#modalError` và đưa con trỏ về ô sai. Nếu đúng thì ẩn form, hiện lời cảm ơn và tự đóng modal sau 2 giây bằng `setTimeout`.

**6. `input`**: mỗi lần gõ phím trong form, xóa thông báo lỗi và bỏ class `invalid` của ô đang gõ.

## 4. Các thao tác DOM đã dùng
- Tìm phần tử: `getElementById`, `querySelectorAll`, `closest`.
- Đổi nội dung: `textContent` (hiện tên dự án, lỗi, lời cảm ơn).
- Đổi giao diện: `classList.add / remove / contains` (class `show`, `invalid`, `modal-open`).
- Đổi thuộc tính: `setAttribute("aria-hidden", ...)`, thuộc tính `hidden`, `dataset`.
- Điều khiển form và focus: `form.reset()`, `element.focus()` (đưa con trỏ vào ô đầu tiên khi mở, trả focus về nút ban đầu khi đóng).
- Khóa cuộn trang phía sau modal bằng class `modal-open` trên `<body>`.
- Tạo thẻ động: `createElement`, `appendChild` (trong `renderProjects`).

## 5. Luồng hoạt động
1. Trang tải → `renderProjects()` sinh các thẻ dự án, mỗi thẻ có nút mở modal.
2. Bấm nút → sự kiện `click` → `openModal()` điền tiêu đề, hiện modal, focus vào ô họ tên.
3. Nhập thông tin → sự kiện `input` xóa lỗi cũ.
4. Bấm "Gửi đăng ký" → sự kiện `submit` → kiểm tra → hiện thông báo thành công.
5. Modal đóng bằng một trong 4 cách: tự đóng sau 2 giây, nút ×, bấm nền tối, phím Escape.
