import React from "react";

export const ProductSkeleton: React.FC = () => {
    return (
        /* Блок мерцает благодаря классу animate-pulse */
        <div
            className="animate-pulse flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4 h-62.5 sm:h-90">
            <div>
                {/* Заглушка для картинки */}
                <div className="h-30 sm:h-45 w-full rounded-lg bg-gray-200"/>

                {/* Заглушка для заголовка */}
                <div className="mt-3 mb-2 h-4 w-2/3 rounded bg-gray-200"/>

                {/* Заглушка для двух строк описания (видима только от sm:) */}
                <div className="hidden sm:block space-y-2 mt-4">
                    <div className="h-3 w-full rounded bg-gray-200"/>
                    <div className="h-3 w-4/5 rounded bg-gray-200"/>
                </div>
            </div>

            {/* Заглушка для футера: цена + кнопка */}
            <div className="flex items-center justify-between mt-2 sm:mt-0">
                <div className="h-5 w-16 rounded bg-gray-200"/>
                <div className="h-8 w-20 rounded bg-gray-200"/>
            </div>
        </div>
    );
};
