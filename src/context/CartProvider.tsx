import {type CartItem, type Product} from "@/types";
import {createContext, type ReactNode, useContext} from "react";
import {useLocalStorage} from "@/hooks/useLocalStorage";

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: { children: ReactNode }) => {
    const [cart, setCart] = useLocalStorage<CartItem[]>("food-court-cart", []);
    // число товаров и общая сумма
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );

    // добавляем в корзину
    const addToCart = (product: Product) => {
        // проверяем если товар уже есть в корзине
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.product.id === product.id,
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item.product.id === product.id
                        ? {...item, quantity: item.quantity + 1}
                        : item,
                );
            }
            return [...prevCart, {product, quantity: 1}];
        });
    };

    // удаляем из корзины
    const removeFromCart = (productId: string) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.product.id === productId,
            );

            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map((item) =>
                    item.product.id === productId
                        ? {...item, quantity: item.quantity - 1}
                        : item,
                );
            }
            return prevCart.filter((item) => item.product.id !== productId);
        });
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart должен использоваться внутри CartProvider");
    }
    return context;
};
