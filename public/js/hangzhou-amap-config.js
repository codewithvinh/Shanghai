/**
 * Cấu hình Amap (高德) JS API 2.0 — theo Quick Start:
 * https://lbs.amap.com/api/javascript-api-v2/getting-started
 *
 * 1. Đăng ký https://console.amap.com/ → Key loại Web端(JS API)
 * 2. Key tạo sau 2021-12-02 BẮT BUỘC kèm 安全密钥 (securityJsCode)
 * 3. Load bằng AMapLoader (webapi.amap.com/loader.js) — môi trường Trung Quốc
 *    (bản overseas dùng sg-webapi.opnavi.com — KHÔNG dùng cho chuyến TQ)
 * 4. Whitelist domain/IP: 127.0.0.1, localhost, IP LAN điện thoại
 *
 * Điền vào đây, hoặc nhập trên trang Bản đồ (lưu localStorage).
 */
window.HZ_AMAP = window.HZ_AMAP || {
  key: "",           // Web JS API Key
  securityJsCode: "" // 安全密钥
};
