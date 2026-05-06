import { createContext, useEffect, useState, useContext, use } from "react";
import { AuthContext } from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

export const UserContext = createContext();
// private and public data separation may not be necessary

export const UserContextProvider = ({children}) => {
    const [username, setUsername] = useState(null);  
    const [userID, setUserID] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const auth = useContext(AuthContext);

    const fetchPrivateData = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${userID}/private`, {
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const data = await response.json();
            setUserData(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth.accessToken && auth.accessToken != null && userID && userID != null) {
            fetchPrivateData();
            setIsLoading(false);
        }
        else {
            setUserData(null);
        }
    }, [auth.accessToken, userID])


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${API_URL}/users/`, {
                    // mode: "cors",
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${localStorage.getItem("token")}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" }, 
                });
                if (!response.ok) {
                    throw new Error("Failed");
                }
                const {_id, username} = await response.json();
                setUsername(username);
                setUserID(_id);
            } 
            catch (error) {
                console.log(error)
                setUserID("");
                setUsername("");
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])
    
    return (
        <UserContext value=
            {{username, userID, setUsername, setUserID, isLoading,
            userData, setUserData, fetchPrivateData
            }}>
            {children}
        </UserContext>
    )
}