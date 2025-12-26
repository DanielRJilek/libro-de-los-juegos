import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthContext = () => {
    const {user} = useContext(AuthContext);
    return user;
}

export default useAuthContext