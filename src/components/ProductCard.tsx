import {type Product} from "@/types";
import {cn} from "@/utils/cn"; // <-- Проверьте путь к вашему хелперу cn
import {useCart} from "@/context/CartProvider";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({product}: ProductCardProps) => {
    const {id, name, description, price, image, isAvailable} = product;
    const {cart, addToCart} = useCart();

    const cartItem = cart.find((item) => item.product.id === id);

    return (
        <div
            className={cn(
                /* Базово: маленькие падинги для смартфона. От sm (640px) увеличиваем */
                "flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-3 sm:p-4 shadow-xs transition-opacity duration-200",
                // Затемняем карточку, если блюдо закончилось
                !isAvailable && "opacity-60",
            )}
        >
            <div>
                {/* Адаптивная высота картинки */}
                <img
                    src={image}
                    alt={name}
                    className="h-30 sm:h-45 w-full rounded-lg object-cover"
                />
                {/*  Заголовок: базово мелкий text-sm и обрезка в 1 строку. От sm — крупнее */}
                <h3 className="m-0 mt-2 mb-1 text-sm font-bold text-gray-900 line-clamp-1 sm:text-lg sm:line-clamp-none">
                    {name}
                </h3>

                {/* Описание прячем на самых маленьких экранах, чтобы карточки были одной высоты */}
                <p className="hidden sm:block m-0 mb-4 h-10 line-clamp-2 text-sm text-gray-500">
                    {description}
                </p>
            </div>
            {/* Футер карточки: базово элементы в колонку (flex-col). От sm — в строку */}
            <div className="flex gap-2 mt-2 flex-row items-center justify-between">
        <span className="text-base font-black text-gray-800 whitespace-nowrap sm:text-lg">
          {isAvailable && `${price} ₽`}
        </span>

                {/* Контейнер кнопок добавления товара */}
                <div className="flex items-center gap-2 ">
                    {cartItem && (
                        <>
                            <span>{"🍕"}</span>
                        </>
                    )}
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!isAvailable}
                        className={cn(
                            "cursor-pointer rounded-md px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white transition-colors duration-200",
                            "bg-amber-500 hover:bg-amber-600 active:bg-amber-700",
                            !isAvailable &&
                            "cursor-not-allowed bg-gray-300 hover:bg-gray-300",
                        )}
                    >
                        {isAvailable ? "+" : "Нет в наличии"}
                    </button>
                </div>
            </div>
        </div>
    );
};
