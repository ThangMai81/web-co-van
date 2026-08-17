"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children }: { children: ReactNode }) {
  // chỉ đơn giản trỏ đến phần tử div mà chúng ta muốn quan sát
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // tạo một IntersectionObserver để quan sát phần tử div
    const observer = new IntersectionObserver(
      ([entry]) => {
        // nếu phần tử div xuất hiện trong viewport, chúng ta sẽ setVisible thành true
        // và ngừng quan sát phần tử đó
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    // bắt đầu quan sát phần tử div
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}
