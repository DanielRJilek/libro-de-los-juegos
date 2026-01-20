import { Navigate, Outlet, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function ProtectedRoute() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext)
    const navigate = useNavigate();
    return (
        (auth.accessToken && auth.accessToken != null && user.userID && user.userID != null) ? <Outlet/> : <Navigate to={"/login"}></Navigate>
    )
}

export default ProtectedRoute