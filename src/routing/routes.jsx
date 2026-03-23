import MainMenu from "../views/MainMenu/MainMenu";
import Home from "../views/Home/Home";
import LogIn from "../components/LogIn/LogIn";
import Welcome from "../views/Welcome/Welcome";
import SignUp from "../components/Signup/Signup";
import Doblet from "../views/Tablas/Doblet/Doblet";
import ProtectedRoute from "./ProtectedRoute";
import Lobby from "../views/Lobby/Lobby";
import About from "../views/About/About";
 
const routes = [
    {
        path: "/",
        element: (<Home>
            <Welcome></Welcome>
        </Home>),
    },
    {
        path: "/games",
        element: <MainMenu/>,
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
        element: (<About></About>)
     },
     {
        element: (
            <ProtectedRoute/>
        ),
        children: [
            {
                path: "/games/:title",
                element: (<Lobby></Lobby>),
                children: [
                    {
                        path: "/games/:title/table/:instance",
                    },
                ]
            },
            
            {
                path: "/games/:title/table/:instance/play",
                element: (<Doblet></Doblet>)
            }
        ]
     }
]


export default routes