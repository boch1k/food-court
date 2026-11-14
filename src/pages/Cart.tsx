import {Link} from "react-router";
import {TotalCart} from "@/components/TotalCart";

export const Cart = () => {
    return (
        <div className="mx-auto max-w-125 rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
            <Link
                to="/"
                className="mb-4 inline-block font-semibold text-amber-500 no-underline transition-colors hover:text-amber-600"
            >
                ⬅️ Назад в меню
            </Link>
            <aside className="w-full">
                <TotalCart/>
            </aside>
        </div>
    );
};
