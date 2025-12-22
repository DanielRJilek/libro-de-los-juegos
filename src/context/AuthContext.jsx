import { createContext } from "react";
import useAuthContext from "../hooks/useAuthContext";

const AuthContext = createContext({
    token: null,
    setCredentials: (accessToken) => {
        token = accessToken;
    },
    logOut: () => {
        token = null;
    }
});

function AuthProvider({children}) {
    // const {user} = useAuthContext(AuthContext);
    AuthContext;
    return (
        <AuthContext.Provider value={[AuthContext.token, AuthContext.setCredentials, AuthContext.logOut]}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider