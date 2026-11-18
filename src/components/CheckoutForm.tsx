import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { type OrderHistoryItem } from "@/types";
import { saveAddress, saveOrder } from "@/utils/localData";

interface CheckoutFormProps {
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  address?: string;
}

export const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, refreshStoredData } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Обработчик формы */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // проверка полей доставки
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Пожалуйста, введите ваше имя";
    } else if (name.trim().length < 2) {
      newErrors.name = "Имя должно быть не короче 2 символов";
    }
    if (!address.trim()) {
      newErrors.address = "Укажите адрес доставки";
    } else if (address.trim().length < 10) {
      newErrors.address =
        "Пожалуйста, напишите адрес подробнее (улица, дом, кв)";
    }
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    if (!user) return;

    const bodyData = {
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsLoading(true);
      setError(null);
      const result: OrderHistoryItem = saveOrder(user.id, bodyData);
      saveAddress(user.id, {
        id: `addr_${Date.now()}`,
        city: "",
        street: address.trim(),
        house: "",
        isDefault: true,
      });
      refreshStoredData();
      if (result) {
        clearCart();
        onSuccess();
      }
    } catch (err) {
      console.error("Ошибка при отправке заказа:", err);
      setError("Не удалось сохранить заказ в этом браузере");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-125 rounded-xl border border-gray-100 bg-white p-5 shadow-xs">
      <form onSubmit={handleSubmit} className="border-gray-100">
        <h3 className="m-0 mb-4 text-lg font-bold text-gray-900">
          📍 Данные для доставки
        </h3>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <Input
          label="Ваше имя"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (formErrors.name)
              setFormErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="Иван"
          disabled={isLoading}
          error={formErrors.name}
        />

        <Input
          label="Номер телефона (из профиля)"
          type="tel"
          value={user?.phone || ""}
          disabled={true}
          className="bg-gray-50 text-gray-400 cursor-not-allowed"
        />

        <Input
          label="Адрес доставки"
          type="text"
          disabled={isLoading}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (formErrors.address)
              setFormErrors((prev) => ({ ...prev, address: undefined }));
          }}
          placeholder="ул. Пушкина, д. 10, кв. 5"
          error={formErrors.address}
        />

        <Button
          type="submit"
          variant="success"
          size="lg"
          disabled={isLoading || !cart.length}
        >
          {isLoading ? "Отправка заказа..." : "Подтвердить заказ"}
        </Button>
      </form>
    </div>
  );
};
