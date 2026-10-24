# CASE 20:10 — Shards of Memory

Web game điều tra chạy hoàn toàn trong trình duyệt, xây dựng bằng React, TypeScript và Vite. Tiến trình game, cấu hình puzzle đang dùng và phân vai được lưu bằng `localStorage` trên thiết bị hiện tại.

## Chạy dự án

```bash
npm install
npm run dev
```

Kiểm tra bản production:

```bash
npm run build
npm run preview
```

## Dữ liệu BTC có thể thay đổi

- `src/data/puzzles.json`: mã Phone, Warehouse B, B-19 và hint Phase 1–2.
- `src/data/photos.json`: metadata và đường dẫn ảnh trong điện thoại.
- `src/data/notes.json`: ghi chú được phục hồi từ điện thoại.
- `src/data/evidence.json`: danh mục vật chứng.
- `src/data/players.json`: tên người chơi và đường dẫn avatar.
- `src/data/roles.json`: chức danh cùng mô tả công khai.
- `src/data/b19-access-log.json`: nội dung vật chứng TL-02.
- `src/data/b19-board.json`: thế cờ Phase 3.
- `src/data/endings.json`: các đoạn kết Phase 4 (điều kiện, kết luận, lời dẫn) và mã mở Secret Ending.
- `src/data/classified.json`: nội dung Tài liệu mật — tóm tắt vụ án, đáp án, dòng thời gian thật; mục `secret: true` bị niêm phong tới khi mở Secret Ending.

Video Tài liệu mật đọc từ `public/secret/1023.mp4` (không commit vì ~700MB). Tạo lại từ file gốc bằng:

```bash
ffmpeg -i doc/TaiLieuMat/1023.mov -c copy -movflags +faststart public/secret/1023.mp4
```

Ảnh người chơi đặt tại `public/avatars/player-01.jpg` đến `player-15.jpg`. Nếu ảnh chưa có hoặc tải lỗi, giao diện tự dùng avatar placeholder.

## Nạp thế cờ B-19

Repo hiện chưa có thế cờ gốc do BTC cung cấp và không tự sinh dữ liệu thay thế. Có hai cách cấu hình trong `src/data/b19-board.json`:

1. Đặt ảnh bàn cờ trong `public/evidence/phase3/`, điền `imagePath`, rồi đặt `sourceReady` thành `true`.
2. Điền `pieces` bằng các phần tử như `{ "square": "a1", "piece": "white-rook" }`, rồi đặt `sourceReady` thành `true`.

Các tên quân được hỗ trợ: `white/black-king`, `queen`, `rook`, `bishop`, `knight`, `pawn`.

## Admin Mode

Mở từ **GM ACCESS** hoặc nhấn `Ctrl + Shift + A`. Mã mặc định nằm trong `src/data/game-config.json`. Admin có thể điều khiển progression, đổi mã puzzle, bật/tắt hint và âm thanh, phân vai, import/export assignments và reset dữ liệu.

Phân vai dùng storage key riêng nên thao tác reset game không xóa assignments.

## Deploy

Sau `npm run build`, thư mục `dist/` có thể deploy lên Vercel, Netlify hoặc GitHub Pages. Các asset dùng `import.meta.env.BASE_URL` để tương thích với subpath.
