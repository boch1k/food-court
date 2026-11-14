import {useCart} from "@/context/CartProvider";
import {useNavigate} from "react-router";
import {Button} from "./ui/Button";
import {useAuth} from "@/context/AuthProvider";
import {useModal} from "@/context/ModalProvider";

export const TotalCart = () => {
    const {cart, addToCart, removeFromCart, clearCart, totalPrice, totalItems} =
        useCart();
    const {isAuthenticated} = useAuth();
    const {openAuthModal} = useModal();
    const navigate = useNavigate();

    const handleCheckoutClick = () => {
        if (isAuthenticated) {
            navigate("/checkout");
        } else {
            openAuthModal("/checkout");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                <h3 className="m-0 text-lg font-medium text-gray-800">
                    🛒 Корзина пуста
                </h3>
            </div>
        );
    }

    return (
        <div className="sticky top-5 rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="m-0 text-xl font-bold text-gray-900">🛒 Ваш заказ</h2>
                <Button variant="ghost" onClick={clearCart}>
                    Очистить
                </Button>
            </div>

            <div className="mb-5 max-h-62.5 overflow-y-auto pr-1">
                {cart.map((item) => (
                    <div
                        key={item.product.id}
                        className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-none"
                    >
                        <div className="flex-1">
                            <h4 className="m-0 mb-1 text-[15px] font-medium text-gray-900">
                                {item.product.name}
                            </h4>
                            <span className="text-sm text-gray-400">
                {item.product.price} ₽
              </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="flex h-6 w-6 cursor-pointer pb-0.5 items-center justify-center rounded-full border border-gray-300 bg-white font-medium transition-colors hover:bg-gray-50 active:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="font-bold text-gray-800">{item.quantity}</span>
                            <button
                                onClick={() => addToCart(item.product)}
                                className="flex h-6 w-6 cursor-pointer pb-0.5 items-center justify-center rounded-full border border-gray-300 bg-white font-medium transition-colors hover:bg-gray-50 active:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-5 border-t-2 border-dashed border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Итого:</span>
                    <span className="text-amber-500">{totalPrice} ₽</span>
                </div>
            </div>

            <button
                onClick={handleCheckoutClick}
                className="w-full cursor-pointer rounded-lg border-none bg-amber-500 p-3.5 text-base font-bold text-white transition-colors hover:bg-amber-600 active:bg-amber-700"
            >
                Перейти к оформлению ({totalItems})
            </button>
        </div>
    );
};
