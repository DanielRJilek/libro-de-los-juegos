import MainMenu from "./views/MainMenu/MainMenu";
import Home from "./views/Home/Home";
import LogIn from "./components/LogIn/LogIn";
import Welcome from "./components/Welcome/Welcome";
import SignUp from "./components/Signup/Signup";
 
const routes = [
    {
        path: "/",
        element: (<Home>
            <Welcome></Welcome>
        </Home>),
    },
    {
        path: "/MainMenu",
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
     }
]


export default routes