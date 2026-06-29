import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api/client';

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
            const data = await apiFetch(`/users/${userID}/private`, {token: auth.accessToken, method: 'GET'});
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
                const {_id, username} = await apiFetch('/users', {token: auth.accessToken, method: 'GET'});
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