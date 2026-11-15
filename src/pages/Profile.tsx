import React from "react";
import { useAuth } from "@/context/AuthProvider";

const getStatusDetails = (status: string) => {
  switch (status) {
    case "pending":
      return {
        text: "⏳ Принят",
        className: "bg-blue-50 text-blue-700 border-blue-100",
      };
    case "cooking":
      return {
        text: "👨‍🍳 Готовится",
        className: "bg-amber-50 text-amber-700 border-amber-100",
      };
    case "delivering":
      return {
        text: "🛵 В пути",
        className: "bg-indigo-50 text-indigo-700 border-indigo-100",
      };
    case "completed":
      return {
        text: "✅ Доставлен",
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      };
    default:
      return {
        text: "• Обрабатывается",
        className: "bg-gray-50 text-gray-700 border-gray-100",
      };
  }
};

export const Profile: React.FC = () => {
  const { user, orders, addresses } = useAuth();

  if (orders.loading || addresses.loading) {
    return (
      <div className="py-20 text-center text-gray-500 animate-pulse">
        ⏳ Загрузка вашего профиля и истории заказов...
      </div>
    );
  }

  if (orders.error || addresses.error) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-red-100 bg-red-50 p-5 text-center text-red-700">
        <span className="text-3xl">⚠️</span>
        <h3 className="mt-2 mb-1 font-bold">Не удалось загрузить данные</h3>
        <p className="text-sm opacity-90">адреса или заказы</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700"
        >
          Повторить запрос
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 items-start md:grid-cols-[300px_500px]">
      <aside className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
        <div className="text-center border-b border-gray-100 pb-4 mb-4">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl">
            👤
          </div>
          <h2 className="m-0 text-xl font-bold text-gray-900">
            {user?.name || "Кто ты?"}
          </h2>
          <p className="m-0 mt-1 text-sm text-gray-400">{user?.phone}</p>
        </div>
        <div>
          <h3 className="m-0 mb-3 text-sm text-center font-bold uppercase tracking-wider text-gray-400">
            Сохраненные адреса
          </h3>
          {addresses.data.length === 0 ? (
            <p className="m-0 text-sm text-gray-500 italic">
              Адреса еще не добавлены
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {addresses.data.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 text-sm text-gray-700"
                >
                  <p className="m-0 font-medium">
                    ул. {addr.street}, дом {addr.house}
                    {addr.apartment && `, кв. ${addr.apartment}`}
                  </p>
                  {addr.isDefault && (
                    <span className="mt-1 inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      последний
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main>
        <h2 className="m-0 mb-5 text-xl font-black text-gray-900 md:text-2xl">
          📜 История ваших заказов ({orders.data.length})
        </h2>

        {orders.data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-500">
            Вы еще не совершали покупок. Самое время заказать что-нибудь
            вкусное! 🍕
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.data.map((order) => {
              const status = getStatusDetails(order.status);
              const formattedDate = new Date(
                order.createdAt,
              ).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-3">
                    <div>
                      <span className="text-sm font-bold text-gray-900">
                        Заказ #{order.id.replace("ord_", "")}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-400">
                        {formattedDate}
                      </span>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  <div className="mb-4 flex flex-col gap-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>
                          {item.name}{" "}
                          <span className="text-xs text-gray-400">
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="font-medium text-gray-800">
                          {item.price * item.quantity} ₽
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <span className="text-sm font-medium text-gray-500">
                      Итоговая стоимость:
                    </span>
                    <span className="text-base font-black text-amber-500">
                      {order.totalPrice} ₽
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
