import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./views/Home/Home";
 
const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
])


export default routes