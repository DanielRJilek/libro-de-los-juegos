import { Navigate, Outlet, useNavigate } from "react-router";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

function ProtectedRoute() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        auth.accessToken !=null ? <Outlet/> : <Navigate to={"/login"}></Navigate>
    )
}

export default ProtectedRoute