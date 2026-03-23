import { Navigate, Outlet, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ClipLoader } from "react-spinners";

function ProtectedRoute() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext)
    const navigate = useNavigate();
    
    // Wait for user data to load from API
    if (user.isLoading) {
        return (<ClipLoader></ClipLoader>)
    }
    
    return (
        (auth.accessToken && auth.accessToken != null && user.userID && user.userID != null) ? 
            <Outlet/> : <Navigate to={"/login"}></Navigate>
    )
}

export default ProtectedRoute