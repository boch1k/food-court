import React from "react";
import {cn} from "@/utils/cn";

// варианты внешнего вида и размеров
type ButtonVariant = "primary" | "success" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    ref?: React.Ref<HTMLButtonElement>;
}

// Словари со стилями для удобного маппинга классов Tailwind v4
const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-amber-500 text-white shadow-xs hover:bg-amber-600 active:bg-amber-700",
    success:
        "bg-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.2)] hover:bg-emerald-700 active:bg-emerald-800",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    ghost:
        "bg-none border-none text-gray-500 hover:text-gray-700 active:text-gray-900 font-semibold",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "w-full p-3.5 text-base rounded-xl",
};

export const Button = ({
                           variant = "primary",
                           size = "md",
                           className,
                           ref,
                           disabled,
                           children,
                           ...props
                       }: ButtonProps) => {
    return (
        <button
            ref={ref}
            disabled={disabled}
            className={cn(
                // Базовые неизменяемые стили для всех кнопок
                "inline-flex items-center justify-center font-bold cursor-pointer transition-all duration-200 select-none outline-none active:scale-95",
                // Динамические стили на основе пропсов
                variantClasses[variant],
                sizeClasses[size],
                // Стили для заблокированной кнопки
                disabled &&
                "cursor-not-allowed bg-gray-300 text-gray-400 shadow-none active:scale-100",
                // Кастомные классы, если нужно что-то точечно докинуть снаружи
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
};
