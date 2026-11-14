import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isAuthModalOpen: boolean;
  openAuthModal: (redirectUrl?: string) => void;
  closeAuthModal: () => void;
  returnUrl: string | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  const openAuthModal = (redirectUrl?: string) => {
    if (redirectUrl) setReturnUrl(redirectUrl);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setReturnUrl(null);
  };

  return (
    <ModalContext
      value={{ isAuthModalOpen, openAuthModal, closeAuthModal, returnUrl }}
    >
      {children}
    </ModalContext>
  );
};

export function useModal() {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModal должен использоваться внутри ModalProvider");
  return context;
}
