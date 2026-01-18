import { createContext, useEffect, useState } from "react";
// import useAuthContext from "../hooks/useAuthContext";

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

// function AuthProvider({children}) {
//     // const {user} = useAuthContext(AuthContext);
//     // AuthContext;
//     return (
//         <AuthContext.Provider value={[AuthContext.token, AuthContext.setCredentials, AuthContext.logOut]}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export default AuthProvider