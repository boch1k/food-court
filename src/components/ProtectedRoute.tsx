import React, {useEffect} from "react";
import {Navigate, useLocation} from "react-router";
import {useAuth} from "@/context/AuthProvider";
import {useModal} from "@/context/ModalProvider";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const {leaving, isAuthenticated} = useAuth();
    const {openAuthModal} = useModal();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated && !leaving) {
            openAuthModal(location.pathname);
        }
    }, [leaving, isAuthenticated, openAuthModal, location.pathname]);

    // Если не авторизован, перенаправляем на главную
    if (!isAuthenticated) {
        console.log("не авторизован");
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};
