import { createContext, useState } from "react";
import { CgProfile } from "react-icons/cg";

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [username, setUsername] = useState("");  
    const [userID, setUserID] = useState("");
    const [profilePic , setProfilePic] = useState(() => {return(CgProfile)});
    return (
        <UserContext value={{username, userID, setUsername, profilePic, setProfilePic, setUserID}}>
            {children}
        </UserContext>
    )
}