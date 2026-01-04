import './ProfileDrop.css'
import { IconContext } from 'react-icons';
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { useState } from 'react';
import { useContext } from 'react';
import { useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';

function ProfileDrop() {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
        open ? setOpen(false) : setOpen(true)
    }
    const options = [  ];

    const token = useContext(AuthContext);
    const user = useContext(UserContext);
    const ProfilePic = user.profilePic;
    // const navigate = useNavigate();
    const logout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://libro-de-los-juegos-server.onrender.com/auth/logout', {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            // const code = await response.text();
            token.setUser(null);
            // navigate('/MainMenu');
        } 
        catch (error) {
            console.log(error);
        }
    }

    // const [Icon, setIcon] = useState(CgProfile)
    return (
        <IconContext.Provider value={{className:'icon'}}>
            <div className='icon-holder'>
                <ProfilePic onClick={toggleOpen}></ProfilePic>
                {open ? <div className='drop-options'>
                    <div className='drop-header'>
                        <ProfilePic></ProfilePic>
                        {`${user.username}`}</div>
                    <ul>
                        <li>
                            <CiEdit></CiEdit>
                            <span>Edit Profile</span>
                        </li>
                        <li>
                            <GoPeople></GoPeople>
                            <span>Friends</span>
                        </li>
                        <li onClick={logout}>
                            <TbLogout2></TbLogout2>
                            <span>Log Out</span>
                        </li>
                    </ul>
                </div> : []}
            </div>
            
        </IconContext.Provider>
    )
}

export default ProfileDrop