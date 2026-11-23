# Giọng văn tiếng Việt cho trang kế hoạch

Bối cảnh: trang HTML kế hoạch tự túc của 2 người (anh Vinh và Trang) đi Hàng Châu – Ô Trấn – Thượng Hải 08–14/01/2027. Người đọc là chính 2 người + bạn bè trong nhóm. Muốn đọc như một người đi trước viết cho bạn trên Threads: gần gũi, tự nhiên, có ý kiến, nhưng vẫn đủ thông tin để đi thật.

## Giọng
- Xưng "mình" khi cần, gọi chung là "tụi mình" / "hai đứa" hoặc bỏ chủ ngữ. Không "quý khách", không "bạn nên lưu ý rằng".
- Câu ngắn, nói như nói chuyện. Dùng tự nhiên: "nhé", "nha", "thôi", "khỏi", "cứ", "tầm", "lỡ", "đỡ", "cho chắc", "đừng ... nha", "nhớ ...".
- Có thể dùng từ dân đi hay dùng: "tệ" thay "CNY" (giữ nguyên con số), "k" / "tr" CHỈ khi con số giữ nguyên chữ số (xem luật số bên dưới — tốt nhất cứ giữ số y nguyên), "book", "check", "skip", "chill", "lượn".
- KHÔNG teencode kiểu "rẻe", "thuii", "j", "ko", "k" (nghĩa là không), không emoji, không "siêuu".
- Mệnh lệnh mềm: "Nhớ in 2 bản" thay "In xác nhận...". "Đừng đặt chuyến 05:52 nha" thay "Không đặt G7541 lúc 05:52".
- Câu kiểu biên bản / gạch đầu dòng khô → viết thành câu có hồn, nhưng KHÔNG dài hơn bản gốc quá ~30%. Ngắn được thì càng tốt.
- Ngoại lệ: chuỗi thuộc thẻ đưa hải quan / khách sạn (nội dung kiểu "Hai người lớn đi du lịch tự túc, không làm việc tại Trung Quốc...", "Đêm đầu không ở khách sạn sân bay") → giữ lịch sự, rõ ràng, chỉ làm mượt nhẹ.
- Nhãn ngắn, tiêu đề cột, tên địa điểm: giữ gần nguyên, chỉ sửa nếu nghe cứng.

## Luật bắt buộc (script sẽ kiểm tra, sai là bị trả lại)
1. Giữ NGUYÊN mọi con số và cụm số y hệt ký tự: `2.300.000`, `06:20–06:45`, `12/01`, `18–34`, `250g` (số 250 phải còn), `G7541`, `1.861.007₫`... Không đổi dấu chấm/phẩy, không đổi "–" thành "-", không gộp/tách, không thêm số mới, không bỏ số nào. Không viết "2,3tr" thay "2.300.000".
2. Giữ NGUYÊN mọi chữ Hán / ký tự Trung y hệt (kể cả dấu câu Trung như `（）`, `•`-không phải Hán thì thoải mái). Không thêm chữ Hán mới.
3. Giữ NGUYÊN mọi thẻ HTML, đúng thứ tự, đúng thuộc tính (`<ul class="tips">`, `<li>`, `<b>`, `</b>`...). Chỉ sửa chữ giữa các thẻ. Số lượng `<li>` phải giữ nguyên.
4. Không đổi sự thật: giờ, giá, tên quán, tên ga, hướng đi, quyết định (đã chốt / chưa đặt / không bảo hiểm...). Không thêm thông tin mới.
5. Không dùng dấu ngoặc kép thẳng `"` (dùng “ ” nếu cần).
6. Tên riêng tiếng Việt hóa đang có (Hồ Tây, Thanh Hà Phường, Tây Sách, Hồng Kiều, Đồng Hương, Dự Viên...) giữ nguyên. Tên Latin (Didi, Alipay, Trip.com, Klook, Homeinn, Dihang, ILLUMINATE!...) giữ nguyên.

## Ví dụ
- Gốc: `Xe buýt đêm ra Hồng Kiều, không khách sạn sân bay.` → `Bắt xe buýt đêm sang Hồng Kiều luôn, khỏi ở khách sạn sân bay.`
- Gốc: `Không đặt G7541 lúc 05:52.` → `Đừng đặt G7541 chuyến 05:52 nha.`
- Gốc: `Chưa đặt — giữ trên Trip.com, giá có thể đổi.` → `Chưa đặt đâu — cứ lưu sẵn trên Trip.com, giá còn nhảy.`
- Gốc: `Thuốc cá nhân. Không mua bảo hiểm du lịch — đã chốt.` → `Mang thuốc cá nhân. Bảo hiểm du lịch thì không mua — chốt rồi.`
- Gốc: `<ul class="tips"><li>Không quá 34 CNY</li><li>Bịt mắt, mặc ấm — ngồi ghế xe, tháng 1 lạnh</li></ul>` → `<ul class="tips"><li>Tối đa 34 tệ thôi</li><li>Mang bịt mắt, mặc ấm vào — ngồi ghế xe cả đêm mà tháng 1 lạnh lắm</li></ul>`
