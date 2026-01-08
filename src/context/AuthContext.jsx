import { createContext, useState } from "react";
// import useAuthContext from "../hooks/useAuthContext";



export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null);   
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