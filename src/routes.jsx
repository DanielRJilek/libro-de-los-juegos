import MainMenu from "./views/MainMenu/MainMenu";
import Home from "./views/Home/Home";
import LogIn from "./components/LogIn/LogIn";
import Welcome from "./components/Welcome/Welcome";
import SignUp from "./components/Signup/Signup";
import Doblet from "./views/Tablas/Doblet/Doblet";
 
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
        path: "/games/doblet",
        element: (
            <Doblet></Doblet>
        )
     }
]


export default routes