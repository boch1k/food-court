import {type ChangeEvent, useEffect, useRef, useState} from "react";

// функция доб маски
const formatDigits = (digits: string): string => {
    if (!digits) return "";
    let formatted = "+";
    if (digits.startsWith("8")) {
        formatted += "7";
    } else formatted += digits.substring(0, 1);
    if (digits.length >= 1) formatted += ` (${digits.substring(1, 4)}`;
    if (digits.length >= 4) formatted += `) ${digits.substring(4, 7)}`;
    if (digits.length >= 7) formatted += `-${digits.substring(7, 9)}`;
    if (digits.length >= 9) formatted += `-${digits.substring(9, 11)}`;
    return formatted;
};

export const usePhoneInput = (
    onValidationError: (msg: string | undefined) => void,
) => {
    const [phone, setPhone] = useState("");
    const [isPhoneTouched, setIsPhoneTouched] = useState(false);

    const phoneInputRef = useRef<HTMLInputElement>(null);
    const cursorPositionRef = useRef<number>(0);

    // возвращаем курсор на место
    useEffect(() => {
        if (phoneInputRef.current) {
            const pos = cursorPositionRef.current;
            phoneInputRef.current.setSelectionRange(pos, pos);
        }
    }, [phone]);

    const handlePhoneInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsPhoneTouched(true);

        const input = e.target;
        const selectionStart = input.selectionStart ?? 0;
        const inputValue = input.value;
        const prevValue = phone;

        const prevDigits = prevValue.replace(/\D/g, "");
        let newDigits = inputValue.replace(/\D/g, "");

        if (newDigits.length > 11) return;

        // если удалили символ маски
        if (
            inputValue.length < prevValue.length &&
            newDigits.length === prevDigits.length
        ) {
            const deletedCharIndex = selectionStart; // индекс удаленной маски
            const charBeforeCursor = prevValue[deletedCharIndex]; // удаленный символ

            if (
                charBeforeCursor === " " ||
                charBeforeCursor === ")" ||
                charBeforeCursor === "-" ||
                charBeforeCursor === "("
            ) {
                const digitsBeforeCursor = prevValue
                    .substring(0, deletedCharIndex)
                    .replace(/\D/g, "");
                const digitsAfterCursor = prevValue
                    .substring(deletedCharIndex)
                    .replace(/\D/g, "");
                newDigits = digitsBeforeCursor.slice(0, -1) + digitsAfterCursor;
            }
        }

        const formattedValue = formatDigits(newDigits);

        // Расчёт позиции курсора
        let newCursorPos = selectionStart;
        if (inputValue.length < prevValue.length) {
            if (formattedValue[newCursorPos - 1] === ")") newCursorPos -= 2;
        } else {
            if (formattedValue[newCursorPos + 2] === "(") newCursorPos += 3;
            if (formattedValue[newCursorPos] === ")") newCursorPos += 2;
            if (formattedValue[newCursorPos] === "-") newCursorPos++;
        }
        cursorPositionRef.current = newCursorPos;
        setPhone(formattedValue);

        // Передаем ошибку наверх в родительскую форму
        if (formattedValue && formattedValue.length < 18) {
            onValidationError("Введите корректный номер телефона (11 цифр)");
        } else {
            onValidationError(undefined);
        }
    };

    const resetPhoneField = () => {
        if (!phone) {
            onValidationError(undefined);
            setIsPhoneTouched(false);
        }
    };

    return {
        phone,
        isPhoneTouched,
        phoneInputRef,
        handlePhoneInputChange,
        resetPhoneField,
        setIsPhoneTouched,
    };
};
