import { createContext } from "react";

const AuthContext = createContext({
    token: null,
    setCredentials: (accessToken) => {
        token = accessToken;
    },
    logOut: () => {
        token = null;
    }
});

export default AuthContext