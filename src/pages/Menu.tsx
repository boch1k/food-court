import React, { useEffect, useState } from "react";
import { MOCK_PRODUCTS } from "@/utils/mockProducts";
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import {
  CategoryFilter,
  type FilterCategory,
} from "@/components/CategoryFilter";
import { TotalCart } from "@/components/TotalCart";
import { useCart } from "@/context/CartProvider";
import { Button } from "@/components/ui/Button";

export const Menu: React.FC = () => {
  const { totalItems, totalPrice } = useCart();
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false); // Стейт мобильной корзины
  const [isLoading, setIsLoading] = useState(true); // skeleton state

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[1fr_350px] pb-24 lg:pb-0">
      <div className="flex flex-col gap-4">
        {/* Категории */}
        <div className="h-14 w-full items-center flex flex-row gap-4">
          {/* поиск */}
          <div className="relative sm:max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск ..."
              className="w-full rounded-full border border-gray-200 hover:border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <CategoryFilter
            activeCategory={selectedCategory}
            onCategoryChange={(cat) => setSelectedCategory(cat)}
          />
        </div>

        {/* Результаты поиска */}
        <h2 className="text-lg font-bold text-gray-900 md:text-2xl">
          {searchQuery
            ? `Результаты поиска: "${searchQuery}"`
            : selectedCategory === "all"
              ? "🔥 Популярные блюда"
              : "🍽️ Категория"}
        </h2>
        {/* строка не найдено */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
            Ничего не найдено 😔
          </div>
        ) : (
          /* Продуктовая сетка: 2 колонки на мобилках (grid-cols-2), 3-4 на десктопах */
          <div className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-5">
            {/* Пока идет загрузка, рендерим сетку из 6 пустых скелетонов */}
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))
              : filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        )}
      </div>

      {/* Десктопная корзина (скрыта на мобилках через hidden lg:block) */}
      <aside className="hidden lg:block w-full">
        <TotalCart />
      </aside>

      {/* Мобильная корзина всплывает снизу во весь экран (Drawer), если открыта */}
      {isMobileCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsMobileCartOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl animate-in slide-in-from-bottom duration-300">
            <div
              className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4"
              onClick={() => setIsMobileCartOpen(false)}
            />
            <TotalCart />
          </div>
        </div>
      )}

      {/* Фиксированная плавающая кнопка внизу экрана для смартфонов */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 p-4 border-t border-gray-100 backdrop-blur-md lg:hidden flex justify-center animate-in slide-in-from-bottom duration-200">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-between px-6 shadow-lg bg-amber-500 hover:bg-amber-600 active:scale-98"
            onClick={() => setIsMobileCartOpen(true)}
          >
            <span className="flex items-center gap-2">
              <span>🛒</span> Смотреть заказ
              <span className="bg-white text-amber-600 text-xs px-2 py-0.5 rounded-full font-black">
                {totalItems}
              </span>
            </span>
            <span>{totalPrice} ₽</span>
          </Button>
        </div>
      )}
    </div>
  );
};
