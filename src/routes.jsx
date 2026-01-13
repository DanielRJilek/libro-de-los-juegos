import MainMenu from "./views/MainMenu/MainMenu";
import Home from "./views/Home/Home";
import LogIn from "./components/LogIn/LogIn";
import Welcome from "./components/Welcome/Welcome";
import SignUp from "./components/Signup/Signup";
import Doblet from "./views/Tablas/Doblet/Doblet";
import ProtectedRoute from "./ProtectedRoute";
import DobletLobby from "./views/Tablas/Doblet/DobletLobby";
 
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
        element: (
            <ProtectedRoute/>
        ),
        children: [
            {
                path: "/games/doblet",
                element: (<DobletLobby></DobletLobby>)
            }
        ]
     }
]


export default routes