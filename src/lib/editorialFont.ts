import { Playfair_Display } from "next/font/google";

/**
 * Font tiêu đề "editorial" cho các trang chi tiết (chương trình, khóa học).
 * Cùng họ Playfair Display đã dùng ở hero trang Sứ mệnh để thống nhất nhận diện.
 * Gắn `editorialFont.variable` lên phần tử gốc của trang, rồi dùng class `font-editorial`.
 */
export const editorialFont = Playfair_Display({
  variable: "--font-editorial-raw",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});
