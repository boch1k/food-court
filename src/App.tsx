import {BrowserRouter, Route, Routes} from "react-router";
import {Outlet} from "react-router";

import {ProtectedRoute} from "@/components/ProtectedRoute";
import {AuthProvider} from "@/context/AuthProvider";
import {CartProvider} from "@/context/CartProvider";
import {ModalProvider} from "@/context/ModalProvider";

import {Menu} from "@/pages/Menu";
import {Checkout} from "@/pages/Checkout";
import {Cart} from "@/pages/Cart";
import {Profile} from "@/pages/Profile";
import {NotFound} from "@/pages/NotFound";
import {Header} from "@/components/Header";
import {AuthModal} from "@/components/AuthModal";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppContent/>}>
                    <Route index element={<Menu/>}/>
                    <Route path="cart" element={<Cart/>}/>
                    <Route
                        path="checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <ProtectedRoute>
                                <Profile/>
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
};

const AppContent = () => {
    return (
        <AuthProvider>
            <ModalProvider>
                <CartProvider>
                    <Header/>
                    <Outlet/>
                    <AuthModal/>
                </CartProvider>
            </ModalProvider>
        </AuthProvider>
    );
};
