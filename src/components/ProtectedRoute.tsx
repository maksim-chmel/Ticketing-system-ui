import React, {JSX} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PageState from "./Common/PageState";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <PageState title="Checking session" message="Restoring your authorization state." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
