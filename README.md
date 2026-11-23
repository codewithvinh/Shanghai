# Shanghai / Hangzhou trip notes

## Giang Nam PWA

Ghi công ảnh Wikimedia Commons. Các tệp là bản thu nhỏ và có thể được cắt khung khi hiển thị.

- Phố chợ Dự Viên về đêm · MiLu24 · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Yuyuang_market01.JPG) · [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)
- Bánh sinh tiễn · Maxim75 · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:2022-09-03_Sheng_Jian_Bao_-_Shanghai_Pan-Fried_Pork_Buns.jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Trà Long Tỉnh · Joriz De Guzman · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Longjing_tea_4.jpg) · [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)
- Ga Hồng Kiều · 猫猫的日记本 · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Shanghai_Hongqiao_Railway_Station_01_2015-09.JPG) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Ga Hàng Châu Đông · Astrid [aroma] · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Hangzhou_East_Railway_Station_concourse_(54002476316).jpg) · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- Ga Đồng Hương · N509FZ · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Platform_2_entrance_of_Tongxiang_Railway_Station_(20180101082753).jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Lôi Phong Tháp · Bjoertvedt · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:West_Lake_IMG_8795_leifeng_pagoda.jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Hồ Tây gần Liễu Lãng Văn Oanh · Jakub Hałun · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:20090524_Hangzhou_West_Lake_7538.jpg) · [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)
- Đoạn Kiều · Yumeto · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:20230629_Duan_Qiao.jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Điền Tử Phường · 钉钉 · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Tianzifang.jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Đồ uống LINLEE · 逆襲のあまのじゃく · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:LINLEE_Tea_with_a_duck.jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Cà phê và bánh sừng bò · JIP · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Coffee_and_croissant_at_Espresso_House_in_Turku.jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Vịt quay · Neodymium+Nd · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Roast_Duck_with_Rice_Noodles.jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- CHAGEE tại Trường Sa · Huangdan2060 · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Chagee_store_in_Changsha_20250414N.jpg) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Luckin Coffee tại Raffles City Trường Ninh · Baycrest · [Ảnh gốc](https://commons.wikimedia.org/wiki/File:Luckin_Coffee_at_Raffles_City_Changning.jpg) · [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/)

## Chạy local

```bash
node src/preview.mjs
```

Mở [Giang Nam PWA](http://127.0.0.1:8765/trip/). Chạy `node src/build-trip.mjs` sau khi sửa dữ liệu hoặc tài nguyên để cập nhật bản xem trước và phiên bản bộ nhớ đệm.

## Deploy (để dùng offline trên điện thoại)

GitHub Actions dựng và triển khai thư mục `public/` khi có thay đổi được đẩy lên `master`. Trang chủ và hai URL kế hoạch cũ đều dẫn về [Giang Nam PWA](https://codewithvinh.github.io/Shanghai/trip/).

Sau lần mở đầu tiên qua HTTPS, đợi trạng thái **Dùng được ngoại tuyến** trước khi ngắt mạng. Để cài trên iPhone, mở bằng Safari và chọn **Chia sẻ → Thêm vào MH chính**. Bản đồ nền và điều hướng trong Amap Global hoặc Apple Maps phụ thuộc vào kết nối mạng và dữ liệu đã tải trong ứng dụng bản đồ.

## Cấu trúc

| Thư mục | Nội dung |
|--------|----------|
| `public/` | Site tĩnh (HTML/CSS/JS/ảnh) — publish cái này |
| `src/` | Preview server + build helpers |
| `tools/` | Script chỉnh sửa / sync |
| `plans/`, `notes/` | Ghi chú kế hoạch |
| `skill/` | Skill hỗ trợ lên kế hoạch |

Thư mục `visa/` và file PDF được bỏ qua bởi `.gitignore` (tài liệu cá nhân).
