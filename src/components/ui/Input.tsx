import React from "react";
import {cn} from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    isTouched?: boolean;
    ref?: React.Ref<HTMLInputElement>;
}

export const Input = ({
                          label,
                          error,
                          isTouched = true,
                          className,
                          disabled,
                          ref,
                          ...props
                      }: InputProps) => {
    const hasError = !!error && isTouched;

    return (
        <div className="mb-3.5 w-full">
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-500">
                    {label}
                </label>
            )}

            <input
                ref={ref}
                disabled={disabled}
                className={cn(
                    "w-full rounded-lg focus:outline-none border border-gray-300 p-2.5 text-gray-900 transition-colors disabled:bg-gray-50",
                    hasError &&
                    "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none",
                    className,
                )}
                {...props}
            />

            {hasError && (
                <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
            )}
        </div>
    );
};
