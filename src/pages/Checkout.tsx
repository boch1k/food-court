import {useState} from "react";
import {Link} from "react-router";
import {CheckoutForm} from "@/components/CheckoutForm";

export const Checkout = () => {
    const [isOrdered, setIsOrdered] = useState(false);

    return (
        <aside className="w-full">
            {isOrdered ? (
                <div
                    className="mx-auto my-10 max-w-125 rounded-xl border border-gray-100 bg-white px-5 py-10 text-center shadow-xs">
                    <span className="text-5xl">🎉</span>
                    <h2 className="my-4 text-2xl font-bold text-emerald-600">
                        Заказ успешно принят!
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                        Заказ принят. Ожидайте курьера в течение 45 минут.
                    </p>
                    <Link
                        to="/"
                        className="mt-5 inline-block rounded-md bg-amber-500 px-5 py-2.5 font-bold text-white no-underline transition-colors hover:bg-amber-600 active:bg-amber-700"
                    >
                        Вернуться в меню
                    </Link>
                </div>
            ) : (
                <CheckoutForm onSuccess={() => setIsOrdered(true)}/>
            )}
        </aside>
    );
};
