# function_logic.md – Giải thích hàm `renderProjects`

## 1. Mục tiêu
Thay vì viết tay từng thẻ `<article class="project-card">` trong HTML, mình lưu thông tin dự án trong **một mảng dữ liệu** và dùng **hàm + vòng lặp** để tự động sinh giao diện. Muốn thêm/sửa/xóa dự án chỉ cần sửa mảng, không đụng vào HTML.

## 2. Dữ liệu mẫu (`projectList`)
Mảng các object, mỗi object là một dự án:

```js
const projectList = [
    { title: "Smart Color Palette App", time: "Tháng 2 / 2026",
      description: "...", buttonText: "Xem Source Code", link: "#" },
    // ... các dự án khác
];
```

| Thuộc tính | Ý nghĩa |
|---|---|
| `title` | Tên dự án |
| `time` | Thời gian thực hiện |
| `description` | Mô tả ngắn |
| `buttonText` | Chữ trên nút |
| `link` | Đường dẫn khi bấm nút |

## 3. Cách truyền dữ liệu vào hàm
Hàm có **2 tham số**:

```js
function renderProjects(items, containerId) { ... }
```

- `items`: mảng dữ liệu cần hiển thị (ở đây là `projectList`).
- `containerId`: id của thẻ HTML sẽ chứa kết quả (ở đây là `"projectsGrid"`).

Lời gọi hàm (dữ liệu được truyền vào lúc này):

```js
renderProjects(projectList, "projectsGrid");
```

Trong HTML chỉ còn một thẻ chứa rỗng:

```html
<div class="projects-grid" id="projectsGrid"></div>
```

## 4. Các bước hoạt động bên trong hàm
1. `document.getElementById(containerId)` tìm thẻ chứa; nếu không có thì dừng.
2. `container.innerHTML = ""` xóa nội dung cũ để không bị nhân đôi thẻ khi gọi lại hàm.
3. Nếu mảng rỗng (`items.length === 0`) thì hiện thông báo "Chưa có dự án nào." rồi dừng.
4. **Vòng lặp** `for (const item of items)` duyệt từng dự án:
   - `document.createElement("article")` tạo thẻ mới, gán `className = "project-card"`.
   - Dùng template literal `${item.title}`, `${item.time}`... để chèn dữ liệu vào HTML của thẻ.
   - `container.appendChild(card)` gắn thẻ vào trang.
5. Kết quả: 3 dự án trong mảng → 3 thẻ hiện trên trang, dùng lại CSS `.project-card` có sẵn.

## 5. Ưu điểm
- Không lặp code HTML; thêm dự án mới chỉ cần thêm 1 object vào mảng.
- Hàm tái sử dụng được: truyền mảng và id khác để hiển thị danh sách khác.
- Dữ liệu và giao diện tách biệt, dễ bảo trì.
