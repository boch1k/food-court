import { useRef } from "react";
import { cn } from "../utils/cn";
import { type ProductCategory } from "../types";

// Добавляем к существующим категориям вариант 'all'
export type FilterCategory = "all" | ProductCategory;

interface CategoryFilterProps {
  activeCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
}

const CATEGORIES: { id: FilterCategory; label: string; icon: string }[] = [
  { id: "all", label: "Всё меню", icon: "🍽️" },
  { id: "pizza", label: "Пицца", icon: "🍕" },
  { id: "burgers", label: "Бургеры", icon: "🍔" },
  { id: "drinks", label: "Напитки", icon: "🥤" },
  { id: "desserts", label: "Десерты", icon: "🍰" },
];

export const CategoryFilter = ({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const startScrolling = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Запускаем быстрый интервал, имитирующий плавное движение
    intervalRef.current = setInterval(() => {
      const offset = direction === "left" ? -40 : 40;
      container.scrollBy({ left: offset, behavior: "smooth" });
    }, 40);
  };

  const stopScrolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        onMouseEnter={() => startScrolling("left")}
        onMouseLeave={stopScrolling}
        className="absolute left-0 top-0 bottom-0 z-20 w-6 bg-transparent"
      />
      <div
        ref={scrollContainerRef}
        className="overflow-x-scroll whitespace-nowrap flex gap-3 scrollbar-none scroll-smooth"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                // Базовые стили для всех кнопок
                "flex cursor-pointer items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-100",
                // Стили для неактивного состояния
                "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                // Стили для активного состояния (перекрывают базовые благодаря tailwind-merge)
                isActive &&
                  "border-amber-500 bg-amber-500 text-white shadow-[0_4px_10px_rgba(245,158,11,0.3)] hover:bg-amber-600 hover:border-amber-600",
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
      <div
        onMouseEnter={() => startScrolling("right")}
        onMouseLeave={stopScrolling}
        className={cn(
          "absolute right-0 top-0 bottom-0 z-20 w-10",
          // Градиент: справа налево (от плотного цвета фона к полной прозрачности)
          "bg-linear-to-l from-white via-white/40 to-transparent",
        )}
      />
    </div>
  );
};
