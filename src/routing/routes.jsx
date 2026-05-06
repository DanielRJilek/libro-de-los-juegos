import MainMenu from "../views/MainMenu/MainMenu";
import Home from "../views/Home/Home";
import LogIn from "../components/LogIn/LogIn";
import Welcome from "../views/Welcome/Welcome";
import SignUp from "../components/Signup/Signup";
import Doblet from "../views/Doblet/Doblet";
import ProtectedRoute from "./ProtectedRoute";
import Lobby from "../views/Lobby/Lobby";
import About from "../views/About/About";
import Title from "../components/Title/Title";
import Game from "../views/Game/Game";
import ProfilePage from "../views/ProfilePage/ProfilePage";
import MusicPage from "../views/MusicPage/MusicPage";
 
const routes = [
    {
        path: "/",
        element: (<Home>
            
            <Title></Title>
            <Welcome></Welcome>
            
        </Home>),
    },
    {
        path: "/games",
        element: (<Home>
            
            <MainMenu></MainMenu>
            
        </Home>)
    },
     {
        path: "/login",
        element: (<Home>
            <LogIn></LogIn>
        </Home>)
     },
     {
        path: "/signup",
        element: (<Home>
            <SignUp></SignUp>
        </Home>)
     },
     {
        path: "/about",
        element: (<Home>
            <About></About>
            </Home>)
     },
     {
        path: "/music",
        element: (<Home>
            <MusicPage></MusicPage>
            </Home>)
     },
     {
        element: (
            <ProtectedRoute/>
        ),
        children: [
            {
                path: "/games/:title",
                element: (  <Home>
                                <Lobby></Lobby>
                            </Home>),
            },
            {
                path: "/games/:title/table/:instance",
                element: (  <Home>
                                <Lobby></Lobby>
                            </Home>),
            },
            {
                path: "/games/:title/table/:instance/play",
                element: (<Game>
                    <Doblet></Doblet>
                </Game>)
            },
            {
                path: "/profile/:instance",
                element: (<Home>
                    <ProfilePage></ProfilePage>
                </Home>)
            },
            {
                path: "/profile/:instance/edit",
                element: (<Home>
                    <ProfilePage edit={true}></ProfilePage>
                </Home>)
            }
        ]
     }
]


export default routes