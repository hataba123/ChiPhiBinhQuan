# Chi phí bình quân

Ứng dụng web nội bộ giúp theo dõi giá trị món đồ và tính chi phí sử dụng bình quân.

## Chạy local

Yêu cầu Node.js phiên bản 22 trở lên.

```bash
npm install
npm run dev
```

Hoặc trên Windows, double-click file `Chay-web.bat` để tự cài đặt (nếu cần),
khởi động web và mở trình duyệt.

## Tính năng

- Thêm món đồ với tên, nhóm, giá tiền và thời gian sử dụng.
- Tự động tính chi phí sử dụng mỗi năm.
- Tổng hợp tổng giá trị tài sản và chi phí bình quân mỗi tháng.
- Xóa món đồ trực tiếp khỏi bảng.

## Kiểm tra

```bash
npm run build
npm test
```
