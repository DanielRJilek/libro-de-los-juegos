import MainMenu from "../views/MainMenu/MainMenu";
import Home from "../views/Home/Home";
import Welcome from "../views/Welcome/Welcome";
import Signup from "../views/Signup/Signup";
import Login from "../views/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import Lobby from "../views/Lobby/Lobby";
import About from "../views/About/About";
import Title from "../components/Title/Title";
import ProfilePage from "../views/ProfilePage/ProfilePage";
import MusicPage from "../views/MusicPage/MusicPage";
import TablesGame from "../views/TablesGame/TablesGame";
 
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
        element: (<Home backdrop="featured">
            <Login></Login>
        </Home>)
     },
     {
        path: "/signup",
        element: (<Home backdrop="featured">
            <Signup></Signup>
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
        element: (<Home backdrop="featured">
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
                element: (  <Home backdrop="task">
                                <Lobby></Lobby>
                            </Home>),
            },
            {
                path: "/games/:title/table/:instance",
                element: (  <Home backdrop="task">
                                <Lobby></Lobby>
                            </Home>),
            },
            {
                path: "/games/:title/table/:instance/play",
                element: (<TablesGame></TablesGame>)
            },
            {
                path: "/profile/:instance",
                element: (<Home backdrop="task">
                    <ProfilePage></ProfilePage>
                </Home>)
            },
            {
                path: "/profile/:instance/edit",
                element: (<Home backdrop="task">
                    <ProfilePage edit={true}></ProfilePage>
                </Home>)
            }
        ]
     }
]


export default routes