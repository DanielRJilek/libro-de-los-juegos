import MainMenu from "./views/MainMenu/MainMenu";
import Home from "./views/Home/Home";
 
const routes = [
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/MainMenu",
        element: <MainMenu/>,
    }
]


export default routes