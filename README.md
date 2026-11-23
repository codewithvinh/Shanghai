# Shanghai / Hangzhou trip notes

Sổ tay chuyến đi (PWA): lịch trình Hàng Châu + kế hoạch Thượng Hải. Mở trên điện thoại, có thể cài lên màn hình chính và dùng offline sau khi host bằng HTTPS.

## Chạy local

```bash
node src/preview.mjs
```

Mở `http://127.0.0.1:8765/hangzhou-trip.html` (cùng Wi‑Fi LAN thì điện thoại dùng IP máy tính).

## Deploy (để dùng offline trên điện thoại)

1. Đẩy repo lên GitHub.
2. **Settings → Pages → Build from branch** → thư mục `/public` (hoặc GitHub Action tương đương).
3. Mở URL `https://<user>.github.io/<repo>/hangzhou-trip.html` **một lần khi có mạng** để service worker cache.
4. Add to Home Screen → tắt Wi‑Fi vẫn mở được nội dung đã cache.

Bản đồ Amap (nếu dùng) vẫn cần mạng + Web Key riêng trên trang Bản đồ.

## Cấu trúc

| Thư mục | Nội dung |
|--------|----------|
| `public/` | Site tĩnh (HTML/CSS/JS/ảnh) — publish cái này |
| `src/` | Preview server + build helpers |
| `tools/` | Script chỉnh sửa / sync |
| `plans/`, `notes/` | Ghi chú kế hoạch |
| `skill/` | Skill hỗ trợ lên kế hoạch |

Thư mục `visa/` và file PDF được bỏ qua bởi `.gitignore` (tài liệu cá nhân).
