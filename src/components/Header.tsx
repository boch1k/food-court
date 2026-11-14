import {Link} from "react-router";
import {useCart} from "@/context/CartProvider";
import {useAuth} from "@/context/AuthProvider";
import {Button} from "./ui/Button";
import {useModal} from "@/context/ModalProvider";

export const Header = () => {
    const {totalItems, totalPrice} = useCart();
    const {user, logout, isAuthenticated} = useAuth();
    const {openAuthModal} = useModal();

    console.log("header рендер");

    return (
        <header className="w-full mb-6 border-b border-gray-100">
            <div className="flex flex-wrap gap-2 items-center justify-between max-w-312.5 p-4 sm:p-5 font-sans">
                <Link
                    to="/"
                    className="text-inherit no-underline transition-opacity hover:opacity-90 shrink-0"
                >
                    <h1 className="m-0 text-xl font-black tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                        <span className="sm:hidden">🍕 FC</span> {/* На мобилках коротко */}
                        <span className="hidden sm:inline">🍕 Food Court</span>
                    </h1>
                </Link>

                {/* Контейнер индикатор и корзина */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Индикатор корзины-кнопка */}
                    <Link
                        to="/cart"
                        className="flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white no-underline shadow-sm transition-all hover:bg-amber-600 active:scale-98"
                    >
                        <span>🛒</span>

                        {/* Бэйдж с количеством товаров (появляется, только если в корзине что-то есть) */}
                        {totalItems > 0 && (
                            <span
                                key={totalItems}
                                className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-black text-amber-600 animate-pop"
                            >
                {totalItems}
              </span>
                        )}

                        {/* Показываем сумму, если она больше нуля */}
                        {totalPrice > 0 && (
                            <>
                <span
                    className="hidden sm:inline whitespace-nowrap ml-1 border-l border-white/30 pl-2 text-amber-50 font-medium sm:text-xl">
                  {totalPrice} ₽
                </span>
                                <span className="sm:hidden"></span>
                            </>
                        )}
                    </Link>

                    {/* Кнопка Логина */}
                    {isAuthenticated ? (
                        <div
                            className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-100 p-1 sm:pl-4 sm:pr-2 sm:py-1 text-sm text-gray-700">
                            {/* Ссылка в профиль */}
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 font-semibold text-gray-800 no-underline hover:text-amber-500 transition-colors"
                            >
                                {/* Круглая аватарка, видимая всегда */}
                                <div
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                                    {user?.name ? user.name[0].toUpperCase() : "👤"}
                                </div>
                                {/* Имя прячем на мобилках, показываем от sm: */}
                            </Link>
                            {/* Кнопка выхода */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="h-7 w-7 p-0 flex items-center justify-center text-red-500 hover:text-red-600 rounded-full hover:bg-red-100 sm:h-auto sm:w-auto sm:px-2 sm:py-1 sm:bg-none sm:text-xs"
                            >
                                <span className="sm:hidden">✕</span>
                                <span className="hidden sm:inline">Выйти</span>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openAuthModal()}
                            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
                        >
                            Войти
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
