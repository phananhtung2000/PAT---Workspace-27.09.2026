# PAT Workspace — hướng dẫn deploy PWA

## 1. Đưa lên GitHub Pages
1. Tạo repo mới trên GitHub (public), ví dụ `pat-workspace`.
2. Đẩy **cả 6 file** này lên **thư mục gốc** của repo (không để trong thư mục con):
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `icon-512-maskable.png`
3. Vào **Settings → Pages** → chọn branch `main`, thư mục `/ (root)` → Save.
4. Chờ 1–2 phút, app sẽ chạy tại: `https://<username>.github.io/<ten-repo>/`
   (không cần sửa gì thêm — `start_url` và `scope` trong `manifest.json` đều dùng đường dẫn tương đối `./`, tự hoạt động đúng ở subpath này).

## 2. Cài vào Android (qua Chrome)
1. Mở link app bằng **Chrome**.
2. Bấm menu 3 chấm (góc phải trên) → **"Cài đặt ứng dụng"** (hoặc "Thêm vào Màn hình chính").
3. Xác nhận → icon app xuất hiện trên màn hình chính, mở full-screen không thanh địa chỉ.

## 3. Cài vào Windows 11 (qua Edge/Chrome)
1. Mở link app bằng **Edge** hoặc **Chrome**.
2. Bấm icon **"Cài đặt"** ở cuối thanh địa chỉ (biểu tượng màn hình có dấu +).
   - Hoặc: menu (3 chấm) → **Ứng dụng** → **"Cài đặt trang này như một ứng dụng"**.
3. App mở trong cửa sổ riêng như phần mềm desktop, có icon riêng trong Start Menu.

## 4. Kiểm tra bằng Lighthouse
1. Mở app bằng Chrome (bản deploy trên GitHub Pages, không phải mở qua `file://`).
2. Mở DevTools (F12) → tab **Lighthouse**.
3. Chọn mục **"Progressive Web App"** → bấm **Analyze**.
4. Kết quả nên báo đạt các tiêu chí cơ bản: manifest hợp lệ, có service worker, có icon đúng kích thước.

## Lưu ý quan trọng
- File `index.html` vẫn mở được bình thường qua **double-click (file://)**, chạy offline hoàn toàn như trước — phần đăng ký service worker tự bỏ qua (fail-silent) khi mở theo cách này.
- Toàn bộ dữ liệu nghiệp vụ (đồng hồ, lịch, các tool PAT...) vẫn lưu bằng `localStorage` / `IndexedDB` ngay trong trình duyệt như cũ — service worker **không** đụng vào các luồng này, chỉ cache app shell (HTML, manifest, icon).
- App không gọi thư viện CDN ngoài nào (font và mọi tài nguyên đã được nhúng sẵn trong `index.html`), nên không cần cache thêm gì ngoài 5 file tĩnh nói trên.
