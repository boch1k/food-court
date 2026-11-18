import { createContext, type ReactNode, useContext, useState } from "react";
import { type OrderHistoryItem, type SavedAddress, type User } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getAddresses, getOrders } from "@/utils/localData";
import { useCallback } from "react";

type Orders = {
  data: OrderHistoryItem[];
  loading: boolean;
  error: unknown;
};

type Addresses = {
  data: SavedAddress[];
  loading: boolean;
  error: unknown;
};

interface AuthContextType {
  user: User | null;
  orders: Orders;
  addresses: Addresses;
  leaving: boolean;
  logout: () => void;
  isAuthenticated: boolean;
  sendVerificationCode: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  refreshStoredData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tempPhone, setTempPhone] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [user, setUser] = useLocalStorage<User | null>("food-court-user", null);
  const [, setDataRevision] = useState(0);
  const refreshStoredData = useCallback(() => {
    setDataRevision((revision) => revision + 1);
  }, []);

  const orders: Orders = {
    data: user ? getOrders(user.id) : [],
    loading: false,
    error: undefined,
  };
  const addresses: Addresses = {
    data: user ? getAddresses(user.id) : [],
    loading: false,
    error: undefined,
  };

  const handleLogout = () => setLeaving(true);

  const sendVerificationCode = async (phone: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setTempPhone(phone);
  };

  const verifyCode = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (code !== "1111") throw new Error("Invalid code");
    const loggedUser: User = {
      id: "usr_test",
      phone: tempPhone,
      name: "Вася",
      addresses: [],
    };
    setUser(loggedUser);
  };

  const logout = () => {
    handleLogout();
    setUser(null);
    localStorage.removeItem("food-court-user");
  };

  return (
    <AuthContext
      value={{
        user,
        orders,
        addresses,
        leaving,
        logout,
        isAuthenticated: !!user,
        sendVerificationCode,
        verifyCode,
        refreshStoredData,
      }}
    >
      {children}
    </AuthContext>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be call in AuthProvider");
  }
  return context;
}
