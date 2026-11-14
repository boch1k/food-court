import React, {useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthProvider";
import {useModal} from "@/context/ModalProvider";

import {usePhoneInput} from "@/hooks/usePhoneInput";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";

export const AuthModal = () => {
    const {isAuthModalOpen, closeAuthModal, returnUrl} = useModal();
    const {sendVerificationCode, verifyCode} = useAuth();

    const [step, setStep] = useState<"phone" | "code">("phone");
    const [smsCode, setSmsCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const {
        phone,
        isPhoneTouched,
        phoneInputRef,
        handlePhoneInputChange,
        resetPhoneField,
        setIsPhoneTouched,
    } = usePhoneInput((phoneError) => {
        setError(phoneError);
    });

    if (!isAuthModalOpen) return null;

    const handleSendPhone = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const rawPhone = phone.replace(/\D/g, "");

        if (rawPhone.length < 11) {
            setError("Введите корректный номер телефона (11 цифр)");
            setIsPhoneTouched(true);
            return;
        }

        setIsSubmitting(true);
        try {
            await sendVerificationCode(phone);
            setStep("code");
            setError(undefined);
        } catch (err) {
            if (err instanceof Error) {
                setError("Ошибка отправки СМС. Попробуйте еще раз.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Логика проверки СМС-кода
    const handleVerifyCode = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (smsCode.length < 4) {
            setError("Код должен состоять из 4 цифр");
            return;
        }

        setIsSubmitting(true);
        try {
            await verifyCode(smsCode);
            closeAuthModal();
            if (returnUrl) {
                navigate(returnUrl);
            }
            // Сбрасываем модалку в исходное состояние
            setStep("phone");
            setSmsCode("");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "Неверный код");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // нужно добавить проверку по времени на повторный запрос
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={closeAuthModal}/>

            <div
                className="relative z-10 w-full max-w-100 rounded-xl border border-gray-100 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <div className="text-center mb-5">
                    <span className="text-4xl">{step === "phone" ? "📱" : "💬"}</span>
                    <h2 className="mt-2 mb-1 text-xl font-bold text-gray-900">
                        {step === "phone" ? "Вход на сайт" : "Подтверждение номера"}
                    </h2>
                    <p className="m-0 text-sm text-gray-500">
                        {step === "phone"
                            ? "Введите номер телефона для получения кода"
                            : `Мы отправили код на номер ${phone}`}
                    </p>
                </div>

                {step === "phone" ? (
                    /* Шага 1: Ввод Телефона */
                    <form onSubmit={handleSendPhone}>
                        <Input
                            ref={phoneInputRef}
                            label="Номер телефона"
                            type="tel"
                            value={phone}
                            onChange={handlePhoneInputChange}
                            onBlur={resetPhoneField}
                            placeholder="+7 (999) 123-45-67"
                            disabled={isSubmitting}
                            error={error}
                            isTouched={isPhoneTouched}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isSubmitting}
                            className="mt-2"
                        >
                            {isSubmitting ? "Отправка..." : "Получить код"}
                        </Button>
                    </form>
                ) : (
                    /* Шага 2: Ввод СМС-кода */
                    <form onSubmit={handleVerifyCode}>
                        <Input
                            label="Код из СМС"
                            type="text"
                            maxLength={4}
                            value={smsCode}
                            onChange={(e) => {
                                const code = e.target.value.replace(/\D/g, ""); // Только цифры
                                setSmsCode(code);
                                if (error) setError(undefined);
                            }}
                            placeholder="1111"
                            disabled={isSubmitting}
                            error={error}
                        />
                        <Button
                            type="submit"
                            variant="success"
                            size="lg"
                            disabled={isSubmitting}
                            className="mt-2"
                        >
                            {isSubmitting ? "Проверка..." : "Войти"}
                        </Button>
                        <button
                            type="button"
                            onClick={() => {
                                setStep("phone");
                                setError(undefined);
                            }}
                            className="mt-4 w-full text-center text-xs font-semibold text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                            Изменить номер телефона
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
