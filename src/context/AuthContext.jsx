import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(() => {
        const token = localStorage.getItem("token");
        return token;
    });   
    useEffect(() => {
        if (accessToken==null) {
            localStorage.removeItem("token");
        }
        localStorage.setItem("token", accessToken);
    }, [accessToken])
    return (
        <AuthContext value={{accessToken,setAccessToken}}>
            {children}
        </AuthContext>
    )
}