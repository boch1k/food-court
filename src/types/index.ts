// 1. Создаем единый базовый тип для категорий блюд
export type ProductCategory = "pizza" | "burgers" | "drinks" | "desserts";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: ProductCategory;
    isAvailable: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface OrderInput {
    customerName: string;
    phone: string;
    address: string;
    // Структура позиций в чеке
    items: {
        productId: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    status: "pending" | "cooking" | "delivering" | "completed";
    createdAt: string; // Изменили Date на string для безопасной JSON-сериализации
}

export interface SavedAddress {
    id: string;
    city: string;
    street: string;
    house: string;
    apartment?: string;
    isDefault: boolean;
}

export interface User {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    addresses: SavedAddress[];
}

// Структура заказа для истории в Личном Кабинете
export interface OrderHistoryItem {
    id: string;
    items: { productId: string; name: string; quantity: number; price: number }[];
    totalPrice: number;
    status: "pending" | "cooking" | "delivering" | "completed";
    createdAt: string;
}
